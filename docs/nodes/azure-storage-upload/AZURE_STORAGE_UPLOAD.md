# Azure Storage Upload Node

## Overview

The **Upload to Azure Storage Container** node enables direct file uploads from ComfyUI workflows to Azure Blob Storage. This is useful for backing up generated images, storing workflow outputs in the cloud, or integrating with cloud-based pipelines.

## Location

-   **Category**: Swiss Army Knife/Utils
-   **File**: `nodes/utils/azure_storage_upload.py`
-   **Class**: `AzureStorageUpload`
-   **Display Name**: "Upload to Azure Storage Container"

## Features

✅ **Automatic Container Creation** - Creates containers if they don't exist
✅ **Content Type Detection** - Automatically sets appropriate MIME types based on file extensions
✅ **Connection String Override** - Can override settings connection string per-node if needed
✅ **Full URL Output** - Returns the blob URL for use in other nodes or external systems
✅ **Detailed Status Messages** - Provides clear success/error feedback

## Prerequisites

### 1. Install Azure Storage SDK

The node requires the `azure-storage-blob` Python package:

```bash
# Activate your virtual environment first
source .venv/bin/activate

# Install Azure Storage SDK
pip install azure-storage-blob
```

### 2. Configure Connection String

Set your Azure Storage connection string in ComfyUI Settings:

1. Open ComfyUI Settings
2. Find "Azure Storage Connection String" under Swiss Army Knife settings
3. Paste your connection string from Azure Portal

**Where to find your connection string:**

-   Azure Portal → Storage Account → Access Keys → Connection String

## Node Inputs

### Required Inputs

| Input              | Type   | Description                                                           |
| ------------------ | ------ | --------------------------------------------------------------------- |
| **filename**       | STRING | Full path to the file to upload (e.g., `/path/to/image.png`)          |
| **container_name** | STRING | Azure Storage container name (defaults to `"uploads"`)                |
| **blob_name**      | STRING | Name for the blob in Azure (leave empty to use the original filename) |

### Optional Inputs

| Input                          | Type   | Description                                                                       |
| ------------------------------ | ------ | --------------------------------------------------------------------------------- |
| **connection_string_override** | STRING | Override the connection string from settings (useful for multi-account workflows) |

## Node Outputs

| Output            | Type   | Description                                    |
| ----------------- | ------ | ---------------------------------------------- |
| **upload_status** | STRING | Success or error message with details          |
| **blob_url**      | STRING | Full URL to the uploaded blob (empty on error) |
| **blob_name**     | STRING | Final blob name used (empty on error)          |

## Usage Examples

### Basic Upload

```
Input:
  filename: "/tmp/comfyui_output/image_001.png"
  container_name: "uploads"
  blob_name: ""  (uses original filename)

Output:
  upload_status: "✅ Successfully uploaded to Azure Storage
                  Container: uploads
                  Blob: image_001.png
                  URL: https://mystorageaccount.blob.core.windows.net/uploads/image_001.png"
  blob_url: "https://mystorageaccount.blob.core.windows.net/uploads/image_001.png"
  blob_name: "image_001.png"
```

### Custom Blob Name

```
Input:
  filename: "/tmp/output.jpg"
  container_name: "gallery"
  blob_name: "2025-10-30-artwork-001.jpg"

Output:
  blob_url: "https://mystorageaccount.blob.core.windows.net/gallery/2025-10-30-artwork-001.jpg"
  blob_name: "2025-10-30-artwork-001.jpg"
```

### Organized Structure

```
Input:
  filename: "/tmp/video.mp4"
  container_name: "media-archive"
  blob_name: "videos/2025/october/final-render.mp4"

Output:
  blob_url: "https://mystorageaccount.blob.core.windows.net/media-archive/videos/2025/october/final-render.mp4"
```

## Supported File Types

The node automatically detects and sets appropriate content types for:

### Images

-   `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.bmp`, `.ico`

### Videos

-   `.mp4`, `.webm`, `.avi`, `.mov`, `.mkv`

### Documents

-   `.txt`, `.json`, `.xml`, `.csv`, `.pdf`

### Archives

-   `.zip`, `.tar`, `.gz`

### Other

-   `.bin` and unknown extensions default to `application/octet-stream`

## Container Naming Rules

Azure Storage container names must follow these rules (automatically enforced by the node):

-   ✅ Lowercase letters, numbers, and hyphens only
-   ✅ 3-63 characters long
-   ✅ Must start with a letter or number
-   ❌ No consecutive hyphens
-   ❌ No uppercase letters

The node automatically cleans container names to meet these requirements.

## Error Handling

### Common Errors and Solutions

#### "Azure Storage SDK not installed"

```
❌ Azure Storage SDK not installed. Install with: pip install azure-storage-blob
```

**Solution**: Install the package: `pip install azure-storage-blob`

#### "No Azure Storage connection string configured"

```
❌ No Azure Storage connection string configured. Please set it in ComfyUI Settings.
```

**Solution**: Add your connection string in ComfyUI Settings → Swiss Army Knife → Azure Storage Connection String

#### "File not found"

```
❌ File not found: /path/to/file.png
```

**Solution**: Verify the file path is correct and the file exists

#### "Failed to upload to Azure Storage"

```
❌ Failed to upload to Azure Storage: [error details]
```

**Solution**: Check your connection string, network connectivity, and Azure account permissions

## Workflow Integration Examples

### 1. Save Every Generated Image to Cloud

```
[Image Generator] → [Save Image] → [Azure Storage Upload]
                                     ↓
                              (Cloud Backup)
```

### 2. Upload with Custom Naming

```
[Image Generator] → [Filename Generator] → [Save Image] → [Azure Storage Upload]
                            ↓                                      ↓
                    (Custom filename)                        (Upload to Azure)
```

### 3. Conditional Cloud Storage

```
[Image Generator] → [Quality Check] → [Azure Storage Upload]
                                            ↓
                                    (Only upload if quality passes)
```

## Implementation Details

### Connection String Retrieval

The node retrieves the Azure Storage connection string in this order:

1. **connection_string_override** input parameter (if provided)
2. ComfyUI Settings (synced from frontend via `config_api.py`)
3. Returns empty string if neither is available

### Blob Upload Process

1. Validate filename exists
2. Get connection string from settings or override
3. Create `BlobServiceClient` from connection string
4. Get or create the specified container
5. Determine content type from file extension
6. Upload file with `upload_blob(overwrite=True)`
7. Return blob URL and status

### Content Type Detection

The `_get_content_type()` method maps file extensions to MIME types for proper browser handling.

## Security Considerations

⚠️ **Connection String Security**

-   Connection strings contain sensitive credentials
-   Store them securely in ComfyUI settings (not in workflows)
-   Use `connection_string_override` sparingly and never commit to version control

⚠️ **Public Access**

-   By default, uploaded blobs may not be publicly accessible
-   Configure container access level in Azure Portal if public access is needed
-   Consider using SAS tokens for temporary access

⚠️ **File Overwrites**

-   The node uses `overwrite=True` by default
-   Existing blobs with the same name will be replaced
-   Use unique blob names to prevent accidental overwrites

## Troubleshooting

### Debug Mode

Enable debug logging to see detailed upload information:

1. Set `DEBUG=true` in your environment
2. Restart ComfyUI
3. Check console output for detailed logs

### Verify Connection String

Test your connection string format:

```
DefaultEndpointsProtocol=https;AccountName=<account>;AccountKey=<key>;EndpointSuffix=core.windows.net
```

### Check Azure Permissions

Ensure your storage account has:

-   ✅ Blob Service enabled
-   ✅ Storage Blob Data Contributor role (or equivalent)
-   ✅ No network restrictions blocking your IP

## Future Enhancements

Potential improvements for future versions:

-   [ ] Support for SAS token authentication
-   [ ] Batch upload multiple files
-   [ ] Progress reporting for large files
-   [ ] Blob metadata tagging
-   [ ] Container access level configuration
-   [ ] Automatic retry on network failures
-   [ ] Thumbnail generation for images
-   [ ] Integration with Azure CDN

## Related Documentation

-   [Azure Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/)
-   [Azure Blob Storage Python SDK](https://docs.microsoft.com/en-us/python/api/azure-storage-blob/)
-   [Config API Integration](../../infrastructure/SETTINGS_INTEGRATION.md)

## Changelog

### Version 1.0.0 (2025-10-30)

-   Initial implementation
-   Support for connection string authentication
-   Automatic container creation
-   Content type detection
-   Full error handling and status reporting
