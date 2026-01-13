"""
Azure CosmosDB and Blob Storage utilities for Swiss Army Knife nodes.
"""

import os
import json
import logging
import tempfile
from pathlib import Path
from typing import Any, Dict, Optional, Union

# SDK Imports
try:
    from azure.cosmos import CosmosClient, exceptions as cosmos_exceptions, PartitionKey
    COSMOS_AVAILABLE = True
except ImportError:
    COSMOS_AVAILABLE = False

try:
    from azure.storage.blob import BlobServiceClient, ContentSettings
    BLOB_AVAILABLE = True
except ImportError:
    BLOB_AVAILABLE = False

# Logger
logger = logging.getLogger("SwissArmyKnife.CosmosUtils")

def get_cosmos_client():
    if not COSMOS_AVAILABLE:
        print("[CosmosUtils] ⚠️ azure-cosmos SDK not installed")
        return None
    try:
        from ..config_api import get_api_keys
        api_keys = get_api_keys()
        conn_str = api_keys.get("azure_cosmos_connection_string")
        if not conn_str:
            print("[CosmosUtils] ⚠️ azure_cosmos_connection_string not found in config")
            return None
        return CosmosClient.from_connection_string(conn_str)
    except Exception as e:
        print(f"[CosmosUtils] ⚠️ Failed to create Cosmos client: {e}")
        return None

def get_blob_service_client():
    if not BLOB_AVAILABLE:
        print("[CosmosUtils] ⚠️ azure-storage-blob SDK not installed")
        return None
    try:
        from ..config_api import get_api_keys
        api_keys = get_api_keys()
        conn_str = api_keys.get("azure_storage_connection_string")
        if not conn_str:
            print("[CosmosUtils] ⚠️ azure_storage_connection_string not found in config")
            return None
        return BlobServiceClient.from_connection_string(conn_str)
    except Exception as e:
        print(f"[CosmosUtils] ⚠️ Failed to create Blob client: {e}")
        return None

def update_job_metadata(job_id: str, metadata_patch: Dict[str, Any]):
    """
    Update a job's generationMetadata in CosmosDB using a partial merge.
    """
    client = get_cosmos_client()
    if not client:
        print(f"[CosmosUtils] ⚠️ Cosmos client not available or not configured")
        return

    try:
        from ..config_api import get_api_keys
        api_keys = get_api_keys()
        db_name = api_keys.get("azure_cosmos_database_name", "data")
        container_name = api_keys.get("azure_cosmos_jobs_container", "jobs")

        print(f"[CosmosUtils] Connecting to {db_name}/{container_name} for job {job_id}...")
        database = client.get_database_client(db_name)
        container = database.get_container_client(container_name)

        # Read existing document
        # CRITICAL: Container partition key path is /job_id but documents have 'jobId' field (camelCase)
        # Since field names don't match, documents have undefined partition key
        # Use cross-partition query to find the document reliably
        item = None
        try:
            print(f"[CosmosUtils] Querying for document with id={job_id}")
            query = "SELECT * FROM c WHERE c.id = @id"
            params = [{"name": "@id", "value": job_id}]
            results = list(container.query_items(
                query=query,
                parameters=params,
                enable_cross_partition_query=True,
                max_item_count=1
            ))
            if results:
                item = results[0]
                print(f"[CosmosUtils] ✅ Found job document {job_id}")
                print(f"[CosmosUtils] 📋 Document fields: id={item.get('id')}, jobId={item.get('jobId')}, job_id={item.get('job_id', 'NOT SET')}")
            else:
                print(f"[CosmosUtils] ❌ No document found with id={job_id}")
                return
        except Exception as e:
            print(f"[CosmosUtils] ❌ Error querying for job document {job_id}: {e}")
            import traceback
            traceback.print_exc()
            return

        # Prepare generationMetadata
        if "generationMetadata" not in item:
            item["generationMetadata"] = {}
        
        gen_meta = item["generationMetadata"]
        
        # Ensure prompts exists
        if "prompts" not in gen_meta:
            gen_meta["prompts"] = {}
        
        # Handle prompts specifically if they exist in patch (for merging)
        if "prompts" in metadata_patch:
            # Merge prompts
            new_prompts = metadata_patch.pop("prompts")
            gen_meta["prompts"].update(new_prompts)
        
        # Update remaining fields in generationMetadata
        gen_meta.update(metadata_patch)
        
        # Save back - documents have undefined partition key since /job_id path doesn't match 'jobId' field
        # We need to use the same (undefined) partition key for the replace operation
        # Try to extract job_id if it exists, otherwise use PartitionKey.NONE equivalent
        partition_key_for_replace = item.get("job_id")  # Will be None if field doesn't exist
        if partition_key_for_replace is None:
            # Document has undefined partition key, but we still need to specify SOMETHING
            # Try using the jobId field value as CosmosDB might accept it
            partition_key_for_replace = item.get("jobId", job_id)
        
        print(f"[CosmosUtils] Attempting replace with partition_key={partition_key_for_replace}")
        
        try:
            # First try with the extracted partition key
            container.replace_item(item=job_id, body=item, partition_key=partition_key_for_replace)
            print(f"[CosmosUtils] ✅ Successfully updated metadata for job {job_id}")
        except Exception as replace_error:
            print(f"[CosmosUtils] ⚠️ Replace failed with partition_key={partition_key_for_replace}: {replace_error}")
            # Try upsert instead as a fallback
            try:
                print(f"[CosmosUtils] Attempting upsert as fallback...")
                container.upsert_item(body=item)
                print(f"[CosmosUtils] ✅ Successfully upserted metadata for job {job_id}")
            except Exception as upsert_error:
                print(f"[CosmosUtils] ❌ Upsert also failed: {upsert_error}")
                raise

    except Exception as e:
        print(f"[CosmosUtils] ❌ Failed to update CosmosDB metadata: {e}")
        import traceback
        traceback.print_exc()

def upload_subject_image(job_id: str, source: Union[str, Path, Any]) -> Optional[str]:
    """
    Upload a subject/reference image to Azure Blob Storage.
    Returns the URL of the uploaded blob.
    """
    client = get_blob_service_client()
    if not client:
        return None

    try:
        container_name = "media-files"
        # Ensure container exists
        container_client = client.get_container_client(container_name)
        
        blob_name = f"subjects/{job_id}.jpg"
        blob_client = container_client.get_blob_client(blob_name)

        if isinstance(source, (str, Path)) and os.path.exists(source):
            with open(source, "rb") as data:
                blob_client.upload_blob(data, overwrite=True, content_settings=ContentSettings(content_type="image/jpeg"))
        elif hasattr(source, "cpu"): # Simple check for torch tensor
            # Handle ComfyUI image tensor (Torch Tensor [B, H, W, C])
            import torch
            import numpy as np
            from PIL import Image
            
            # Convert tensor to PIL Image [B, H, W, C] -> [H, W, C]
            img_np = 255. * source.cpu().numpy().squeeze()
            img_np = np.clip(img_np, 0, 255).astype(np.uint8)
            pil_img = Image.fromarray(img_np)
            
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
                pil_img.save(tmp.name, quality=95)
                tmp_path = tmp.name
            
            with open(tmp_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True, content_settings=ContentSettings(content_type="image/jpeg"))
            
            os.unlink(tmp_path)
        else:
            logger.error(f"❌ Unsupported subject image source type: {type(source)}")
            return None

        # Get URL
        url = blob_client.url
        logger.info(f"✅ Uploaded subject image for {job_id} to {url}")
        return url

    except Exception as e:
        logger.error(f"❌ Failed to upload subject image: {e}")
        return None
