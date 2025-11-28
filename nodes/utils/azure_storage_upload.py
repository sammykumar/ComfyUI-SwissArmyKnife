"""
Azure Storage Container Upload Utility Node

This node uploads files to Azure Blob Storage using the connection string
configured in the ComfyUI settings.
"""

import os
from typing import Tuple

# Azure Storage SDK
try:
    from azure.storage.blob import BlobServiceClient, ContentSettings
    AZURE_AVAILABLE = True
except ImportError:
    AZURE_AVAILABLE = False
    print("⚠️ Azure Storage SDK not installed. Install with: pip install azure-storage-blob")


class AzureStorageUpload:
    """
    Upload files to Azure Blob Storage Container.
    
    Uses the Azure Storage connection string from ComfyUI settings:
    SwissArmyKnife.azure_storage.connection_string
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
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING", "STRING")
    RETURN_NAMES = ("upload_status", "blob_url", "blob_name")
    FUNCTION = "upload_to_azure"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    OUTPUT_NODE = True
    DESCRIPTION = (
        "Uploads any file path to Azure Blob Storage using the connection string stored in Swiss Army Knife settings, returning "
        "status text plus the blob URL/name."
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
    
    def upload_to_azure(
        self, 
        filename: str, 
        container_name: str = "uploads"
    ) -> Tuple[str, str, str]:
        """
        Upload a file to Azure Blob Storage.
        
        Args:
            filename: Path to the file to upload
            container_name: Name of the Azure Storage container
            
        Returns:
            Tuple of (upload_status, blob_url, blob_name)
        """
        
        # Check if Azure SDK is available
        if not AZURE_AVAILABLE:
            error_msg = "❌ Azure Storage SDK not installed. Install with: pip install azure-storage-blob"
            print(error_msg)
            return (error_msg, "", "")
        
        # Validate filename
        if not filename or not filename.strip():
            error_msg = "❌ No filename provided"
            print(error_msg)
            return (error_msg, "", "")
        
        filename = filename.strip()
        
        # Check if file exists
        if not os.path.exists(filename):
            error_msg = f"❌ File not found: {filename}"
            print(error_msg)
            return (error_msg, "", "")
        
        # Get connection string from settings
        connection_string = self.get_connection_string()
        if not connection_string:
            error_msg = "❌ No Azure Storage connection string configured. Please set it in ComfyUI Settings."
            print(error_msg)
            return (error_msg, "", "")
        
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
            
            return (success_msg, blob_url, blob_name)
            
        except Exception as e:
            error_msg = f"❌ Failed to upload to Azure Storage: {str(e)}"
            print(error_msg)
            import traceback
            traceback.print_exc()
            return (error_msg, "", "")
    
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
    "AzureStorageUpload": AzureStorageUpload
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "AzureStorageUpload": "Upload to Azure Storage Container"
}
