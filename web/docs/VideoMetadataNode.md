# VideoMetadataNode
Append artist/comments/LoRA metadata to rendered videos using FFmpeg without re-encoding the stream.

## Inputs
- `filenames` – VHS_VideoCombine output (VHS_FILENAMES).
- `comment` – multiline note that becomes a metadata tag.
- `lora_json` – structured data from `LoRAInfoExtractor` for richer metadata.
- `overwrite_original` – choose between in-place update or creating a `_metadata` copy.

## Outputs
- `Filenames` – final list (matching VHS type) for downstream saves or uploads.

## Usage Tips
1. Chain after VHS_VideoCombine.
2. Fill in LoRA/comment fields, run the node, then pass the resulting filenames to upload/archive steps.

## Additional Resources
- [Full documentation](docs/nodes/video-metadata/VIDEO_METADATA.md)
