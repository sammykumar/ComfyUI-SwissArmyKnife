# Azure Storage Upload Node - Quick Reference

Upload files from ComfyUI workflows directly to Azure Blob Storage.

## Quick Start

1. **Install SDK**: `pip install azure-storage-blob`
2. **Configure**: Add connection string in ComfyUI Settings
3. **Use**: Connect filename output to Azure Storage Upload node

## Basic Usage

```
filename: "/tmp/image.png"
container_name: "uploads"
blob_name: "" (auto-uses filename)
```

## Outputs

-   `upload_status` - Success/error message
-   `blob_url` - Full URL to uploaded file
-   `blob_name` - Final blob name

## Full Documentation

See [AZURE_STORAGE_UPLOAD.md](./AZURE_STORAGE_UPLOAD.md) for complete documentation.
