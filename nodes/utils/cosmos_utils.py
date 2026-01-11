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
    from azure.cosmos import CosmosClient, exceptions as cosmos_exceptions
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
        return None
    try:
        from ..config_api import get_api_keys
        api_keys = get_api_keys()
        conn_str = api_keys.get("azure_cosmos_connection_string")
        if not conn_str:
            return None
        return CosmosClient.from_connection_string(conn_str)
    except Exception as e:
        logger.debug(f"Failed to create Cosmos client: {e}")
        return None

def get_blob_service_client():
    if not BLOB_AVAILABLE:
        return None
    try:
        from ..config_api import get_api_keys
        api_keys = get_api_keys()
        conn_str = api_keys.get("azure_storage_connection_string")
        if not conn_str:
            return None
        return BlobServiceClient.from_connection_string(conn_str)
    except Exception as e:
        logger.debug(f"Failed to create Blob client: {e}")
        return None

def update_job_metadata(job_id: str, metadata_patch: Dict[str, Any]):
    """
    Update a job's generationMetadata in CosmosDB using a partial merge.
    """
    client = get_cosmos_client()
    if not client:
        return

    try:
        from ..config_api import get_api_keys
        api_keys = get_api_keys()
        db_name = api_keys.get("azure_cosmos_database_name", "data")
        container_name = api_keys.get("azure_cosmos_jobs_container", "jobs")

        database = client.get_database_client(db_name)
        container = database.get_container_client(container_name)

        # Read existing document
        try:
            item = container.read_item(item=job_id, partition_key=job_id)
        except cosmos_exceptions.CosmosResourceNotFoundError:
            logger.debug(f"Job document {job_id} not found for update")
            return

        # Prepare generationMetadata
        if "generationMetadata" not in item:
            item["generationMetadata"] = {}
        
        gen_meta = item["generationMetadata"]
        
        # Handle prompts specifically if they exist in patch (for merging)
        if "prompts" in metadata_patch:
            if "prompts" not in gen_meta:
                gen_meta["prompts"] = {}
            
            # Merge prompts
            new_prompts = metadata_patch.pop("prompts")
            gen_meta["prompts"].update(new_prompts)
        
        # Update remaining fields in generationMetadata
        gen_meta.update(metadata_patch)
        
        # Save back
        container.replace_item(item=job_id, body=item)
        logger.info(f"✅ Successfully updated metadata for job {job_id}")

    except Exception as e:
        logger.error(f"❌ Failed to update CosmosDB metadata: {e}")

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
