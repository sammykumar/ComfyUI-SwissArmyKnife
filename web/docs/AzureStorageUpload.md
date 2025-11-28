# AzureStorageUpload
Upload any generated file to Azure Blob Storage using the connection string stored in ComfyUI settings.

## Inputs
- `filename` – absolute path to the asset to upload.
- `container_name` – target container (created automatically if missing).

## Outputs
- `upload_status` – success/error message.
- `blob_url` – direct HTTPS URL to the uploaded blob.
- `blob_name` – final object name.

## Usage Tips
1. Set the Azure connection string under Swiss Army Knife settings and install `azure-storage-blob`.
2. Pass filenames from VideoMetadataNode or VHS nodes to push renders straight to the cloud.

## Additional Resources
- [Full documentation](docs/nodes/azure-storage-upload/AZURE_STORAGE_UPLOAD.md)
