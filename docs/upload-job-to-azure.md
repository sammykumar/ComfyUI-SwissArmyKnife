# UploadJobToAzure Node

Upload videos to Azure Blob Storage and automatically create job documents in CosmosDB for review and publishing.

## Purpose

This node enables ComfyUI-native workflows to integrate with the AI Image Hub review system. Videos uploaded through this node automatically appear in the web app's review route, ready for publishing to CivitAI.

## Inputs

### Required

-   **filename** (STRING): Full path to the video file to upload
-   **container_name** (STRING): Azure Storage container name (default: "uploads")

### Optional

-   **metadata_json** (STRING): Generation metadata JSON from CivitMetadataHelper node
    -   Connect the `text` output from CivitMetadataHelper to this input
    -   Enables automatic metadata extraction for CivitAI publishing

## Outputs

-   **upload_status** (STRING): Combined upload and job creation status
-   **blob_url** (STRING): Azure Blob Storage URL for the uploaded video
-   **blob_name** (STRING): Blob name in storage
-   **job_id** (STRING): CosmosDB job document ID (empty if creation failed)
-   **job_status** (STRING): Job creation status message

## Configuration

Required settings in ComfyUI Settings → Swiss Army Knife:

1. **Azure Storage Connection String**: `AccountEndpoint=...;AccountKey=...`
2. **Azure Cosmos DB Connection String**: `AccountEndpoint=...;AccountKey=...`
3. **Database Name**: (default: "data")
4. **Jobs Container Name**: (default: "jobs")

## Example Workflow

```
[LoadVideo] → video
      ↓
[VideoProcessing] → processed_video
      ↓
[CivitMetadataHelper] → text (metadata JSON)
      ↓
[UploadJobToAzure]
   - filename: processed_video
   - container_name: "uploads"
   - metadata_json: text (from CivitMetadataHelper)
```

## Behavior

1. Uploads video to Azure Blob Storage
2. Parses metadata JSON (if provided)
3. Creates job document in CosmosDB with:
    - Status: "completed"
    - Platform: "comfyui-native"
    - Generation metadata (if provided)
4. Returns job ID for tracking

## Error Handling

-   Upload succeeds even if CosmosDB write fails
-   Missing metadata: Job created without generationMetadata field
-   Invalid metadata JSON: Logged as warning, job created without metadata
-   CosmosDB unavailable: Video uploaded, warning logged, job_id empty

## Troubleshooting

**Video uploads but job not created**:

-   Check CosmosDB connection string in settings
-   Verify database and container names are correct
-   Check ComfyUI console for error messages

**Metadata not appearing**:

-   Verify CivitMetadataHelper output is connected to metadata_json input
-   Check metadata JSON is valid (test with JSON validator)
-   Review console logs for parsing errors

**Jobs not appearing in review route**:

-   Verify job status is "completed"
-   Check finalVideoUrl field is populated
-   Ensure container name matches expected location

## Integration with AI Image Hub

Once a video is uploaded and a job document is created:

1. The job appears in the AI Image Hub web app at `/review`
2. You can review the video and its metadata
3. The video can be published directly to CivitAI from the review interface
4. Generation metadata (if provided) is automatically extracted for CivitAI posting

## Node History

-   **v1.0.0**: Initial release as `AzureStorageUpload` (basic blob upload)
-   **v2.0.0**: Renamed to `UploadJobToAzure` with CosmosDB integration and job document creation
