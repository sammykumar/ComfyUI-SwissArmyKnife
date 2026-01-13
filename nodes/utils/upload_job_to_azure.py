"""
Azure Storage Container Upload Utility Node

This node uploads files to Azure Blob Storage using the connection string
configured in the ComfyUI settings.
"""

import os
import json
import uuid
import hashlib
from typing import Tuple
from datetime import datetime, timezone

# Azure Storage SDK
try:
    from azure.storage.blob import BlobServiceClient, ContentSettings
    AZURE_AVAILABLE = True
except ImportError:
    AZURE_AVAILABLE = False
    print("⚠️ Azure Storage SDK not installed. Install with: pip install azure-storage-blob")

# Azure Cosmos SDK
try:
    from azure.cosmos import CosmosClient, exceptions as cosmos_exceptions
    COSMOS_AVAILABLE = True
except ImportError:
    COSMOS_AVAILABLE = False
    print("⚠️ Azure Cosmos SDK not installed. Install with: pip install azure-cosmos")


class UploadJobToAzure:
    """
    Upload files to Azure Blob Storage and create job documents in CosmosDB.
    
    Uses connection strings from ComfyUI settings:
    - SwissArmyKnife.azure_storage.connection_string
    - SwissArmyKnife.azure_cosmos.connection_string
    """
    
    def __init__(self):
        self.connection_string = None
        self.container_name = "uploads"  # Default container name
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "filename": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "tooltip": "Full path to the file to upload"
                }),
                "container_name": ("STRING", {
                    "default": "uploads",
                    "multiline": False,
                    "tooltip": "Azure Storage container name (will be created if it doesn't exist)"
                }),
            },
            "optional": {
                "metadata_json": ("STRING", {
                    "default": "",
                    "multiline": True,
                    "tooltip": "Generation metadata JSON from CivitMetadataHelper node (optional). Connect the 'text' output from CivitMetadataHelper to this input."
                }),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("upload_status", "blob_url", "blob_name", "job_id", "job_status")
    FUNCTION = "upload_to_azure"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    OUTPUT_NODE = True
    DESCRIPTION = (
        "Uploads files to Azure Blob Storage and creates job documents in CosmosDB. "
        "Returns upload status, blob URL, job ID, and job status. "
        "Connect metadata_json from CivitMetadataHelper for automatic metadata ingestion."
    )
    
    def get_connection_string(self) -> str:
        """Get connection string from settings."""
        # Try to get from settings (API keys are synced from frontend)
        try:
            # Import here to avoid circular dependencies
            from ..config_api import get_api_keys
            api_keys = get_api_keys()
            print(f"[Azure Upload] Retrieved API keys from config: {list(api_keys.keys()) if api_keys else 'None'}")
            if api_keys and "azure_storage_connection_string" in api_keys:
                conn_str = api_keys["azure_storage_connection_string"]
                print(f"[Azure Upload] Connection string found: {bool(conn_str)} (length: {len(conn_str) if conn_str else 0})")
                return conn_str
            else:
                print(f"[Azure Upload] No azure_storage_connection_string in API keys")
        except Exception as e:
            print(f"⚠️ Failed to get Azure connection string from settings: {e}")
            import traceback
            traceback.print_exc()
        
        return ""
    
    def get_cosmos_connection_string(self) -> str:
        """Get CosmosDB connection string from settings."""
        try:
            from ..config_api import get_api_keys
            api_keys = get_api_keys()
            print(f"[Cosmos] Retrieved API keys from config: {list(api_keys.keys()) if api_keys else 'None'}")
            if api_keys and "azure_cosmos_connection_string" in api_keys:
                conn_str = api_keys["azure_cosmos_connection_string"]
                print(f"[Cosmos] Connection string found: {bool(conn_str)} (length: {len(conn_str) if conn_str else 0})")
                return conn_str
            else:
                print(f"[Cosmos] No azure_cosmos_connection_string in API keys")
        except Exception as e:
            print(f"⚠️ Failed to get CosmosDB connection string from settings: {e}")
            import traceback
            traceback.print_exc()

        return ""

    def get_cosmos_database_name(self) -> str:
        """Get database name from settings."""
        try:
            from ..config_api import get_api_keys
            api_keys = get_api_keys()
            return api_keys.get("azure_cosmos_database_name", "data")
        except Exception:
            return "data"

    def get_cosmos_jobs_container(self) -> str:
        """Get jobs container name from settings."""
        try:
            from ..config_api import get_api_keys
            api_keys = get_api_keys()
            return api_keys.get("azure_cosmos_jobs_container", "jobs")
        except Exception:
            return "jobs"

    def create_cosmos_client(self):
        """Create CosmosDB client if connection string is available."""
        if not COSMOS_AVAILABLE:
            print("⚠️ Azure Cosmos SDK not available")
            return None

        conn_str = self.get_cosmos_connection_string()
        if not conn_str:
            print("⚠️ No CosmosDB connection string configured")
            return None

        try:
            client = CosmosClient.from_connection_string(conn_str)
            print(f"✅ CosmosDB client created successfully")
            return client
        except Exception as e:
            print(f"⚠️ Failed to create CosmosDB client: {e}")
            return None

    def parse_metadata(self, metadata_json: str) -> dict | None:
        """Parse generation metadata from JSON string."""
        if not metadata_json or not metadata_json.strip():
            return None

        try:
            metadata = json.loads(metadata_json)
            print(f"✅ Parsed generation metadata: {list(metadata.keys()) if isinstance(metadata, dict) else 'not a dict'}")
            return metadata if isinstance(metadata, dict) else None
        except json.JSONDecodeError as e:
            print(f"⚠️ Failed to parse metadata JSON: {e}")
            return None
    
    def create_job_document(
        self,
        blob_url: str,
        cdn_url: str,
        blob_name: str,
        filename: str,
        metadata: dict | None
    ) -> tuple[str, str]:
        """
        Create job document in CosmosDB.

        Args:
            blob_url: Azure Blob Storage URL
            cdn_url: CDN URL (if available)
            blob_name: Blob name in storage
            filename: Original filename
            metadata: Generation metadata dict (optional)

        Returns:
            (job_id, status_message)
        """
        cosmos_client = self.create_cosmos_client()
        if not cosmos_client:
            return ("", "⚠️ CosmosDB not configured - job document not created")

        try:
            # Get database and container
            db_name = self.get_cosmos_database_name()
            container_name = self.get_cosmos_jobs_container()

            print(f"[Cosmos] Using database: {db_name}, container: {container_name}")

            database = cosmos_client.get_database_client(db_name)
            container = database.get_container_client(container_name)

            # Generate job document
            job_id = str(uuid.uuid4())
            timestamp = int(datetime.now(timezone.utc).timestamp())
            source_url = f"comfyui://native/{timestamp}"
            source_url_hash = hashlib.sha256(source_url.encode()).hexdigest()
            now_iso = datetime.now(timezone.utc).isoformat()

            job_doc = {
                "id": job_id,
                "jobId": job_id,
                "sourceUrl": source_url,
                "sourceUrlHash": source_url_hash,
                "capturedAt": now_iso,
                "status": "completed",
                "mediaStatus": "not_applicable",
                "finalVideoUrl": blob_url,
                "finalVideoCdnUrl": cdn_url if cdn_url else blob_url,
                "finalVideoBlobName": blob_name,
                "finalVideoUploadedAt": now_iso,
                "finalVideoSourcePath": f"comfyui-native/{filename}",
                "createdAt": now_iso,
                "updatedAt": now_iso,
                "context": {
                    "platform": "comfyui-native",
                    "uploadedVia": "UploadJobToAzure",
                    "tags": ["comfyui", "direct-upload"]
                }
            }

            # Add metadata if provided
            if metadata:
                job_doc["generationMetadata"] = metadata
                print(f"📝 Added generation metadata to job document")
            else:
                print(f"ℹ️ No metadata provided - job created without generationMetadata field")

            # Create document in CosmosDB
            print(f"📤 Creating job document in CosmosDB...")
            container.create_item(body=job_doc)

            success_msg = f"✅ Job created: {job_id}"
            print(success_msg)
            return (job_id, success_msg)

        except cosmos_exceptions.CosmosHttpResponseError as e:
            error_msg = f"❌ CosmosDB HTTP error: {e.message}"
            print(error_msg)
            return ("", error_msg)
        except Exception as e:
            error_msg = f"❌ Failed to create job: {str(e)}"
            print(error_msg)
            import traceback
            traceback.print_exc()
            return ("", error_msg)
    
    def upload_to_azure(
        self, 
        filename: str, 
        container_name: str = "uploads",
        metadata_json: str = ""
    ) -> Tuple[str, str, str, str, str]:
        """
        Upload a file to Azure Blob Storage.
        
        Args:
            filename: Path to the file to upload
            container_name: Name of the Azure Storage container
            metadata_json: Generation metadata JSON (optional)
            
        Returns:
            Tuple of (upload_status, blob_url, blob_name, job_id, job_status)
        """
        
        # Check if Azure SDK is available
        if not AZURE_AVAILABLE:
            error_msg = "❌ Azure Storage SDK not installed. Install with: pip install azure-storage-blob"
            print(error_msg)
            return (error_msg, "", "", "", "")
        
        # Validate filename
        if not filename or not filename.strip():
            error_msg = "❌ No filename provided"
            print(error_msg)
            return (error_msg, "", "", "", "")
        
        filename = filename.strip()
        
        # Check if file exists
        if not os.path.exists(filename):
            error_msg = f"❌ File not found: {filename}"
            print(error_msg)
            return (error_msg, "", "", "", "")
        
        # Get connection string from settings
        connection_string = self.get_connection_string()
        if not connection_string:
            error_msg = "❌ No Azure Storage connection string configured. Please set it in ComfyUI Settings."
            print(error_msg)
            return (error_msg, "", "", "", "")
        
        # Use filename as blob name
        blob_name = os.path.basename(filename)
        
        # Clean container name (lowercase, alphanumeric and hyphens only)
        container_name = container_name.strip().lower()
        container_name = "".join(c for c in container_name if c.isalnum() or c == "-")
        
        if not container_name:
            container_name = "uploads"
        
        try:
            print(f"📤 Uploading to Azure Storage...")
            print(f"   Container: {container_name}")
            print(f"   Blob name: {blob_name}")
            print(f"   File: {filename}")
            
            # Create BlobServiceClient
            blob_service_client = BlobServiceClient.from_connection_string(connection_string)
            
            # Get or create container
            container_client = blob_service_client.get_container_client(container_name)
            
            # Create container if it doesn't exist
            if not container_client.exists():
                print(f"📦 Creating container: {container_name}")
                container_client.create_container()
                print(f"✅ Container created: {container_name}")
            
            # Get blob client
            blob_client = container_client.get_blob_client(blob_name)
            
            # Determine content type based on file extension
            content_type = self._get_content_type(filename)
            content_settings = ContentSettings(content_type=content_type)
            
            # Upload file
            print(f"⬆️  Uploading file to blob: {blob_name}")
            with open(filename, "rb") as data:
                blob_client.upload_blob(
                    data, 
                    overwrite=True,
                    content_settings=content_settings
                )
            
            # Get blob URL
            blob_url = blob_client.url
            
            success_msg = f"✅ Successfully uploaded to Azure Storage\n" \
                         f"Container: {container_name}\n" \
                         f"Blob: {blob_name}\n" \
                         f"URL: {blob_url}"
            
            print(success_msg)
            
            # Parse metadata (optional)
            metadata = self.parse_metadata(metadata_json)

            # Create job document in CosmosDB
            job_id, job_status = self.create_job_document(
                blob_url=blob_url,
                cdn_url=blob_url,  # CDN URL same as blob URL for now
                blob_name=blob_name,
                filename=os.path.basename(filename),
                metadata=metadata
            )

            # Combine status messages
            combined_status = success_msg
            if job_id:
                combined_status += f"\n{job_status}"
            else:
                combined_status += f"\n{job_status} (video uploaded successfully)"

            return (combined_status, blob_url, blob_name, job_id, job_status)
            
        except Exception as e:
            error_msg = f"❌ Failed to upload to Azure Storage: {str(e)}"
            print(error_msg)
            import traceback
            traceback.print_exc()
            return (error_msg, "", "", "", "")
    
    def _get_content_type(self, filename: str) -> str:
        """Determine content type based on file extension."""
        ext = os.path.splitext(filename)[1].lower()
        
        content_types = {
            # Images
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".svg": "image/svg+xml",
            ".bmp": "image/bmp",
            ".ico": "image/x-icon",
            
            # Videos
            ".mp4": "video/mp4",
            ".webm": "video/webm",
            ".avi": "video/x-msvideo",
            ".mov": "video/quicktime",
            ".mkv": "video/x-matroska",
            
            # Text/Documents
            ".txt": "text/plain",
            ".json": "application/json",
            ".xml": "application/xml",
            ".csv": "text/csv",
            ".pdf": "application/pdf",
            
            # Archives
            ".zip": "application/zip",
            ".tar": "application/x-tar",
            ".gz": "application/gzip",
            
            # Other
            ".bin": "application/octet-stream",
        }
        
        return content_types.get(ext, "application/octet-stream")


# Node class mappings for ComfyUI
NODE_CLASS_MAPPINGS = {
    "UploadJobToAzure": UploadJobToAzure
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "UploadJobToAzure": "Upload Job to Azure"
}
