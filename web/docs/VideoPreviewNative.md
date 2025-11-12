# VideoPreviewNative
Lightweight native preview output that simply echoes connected video paths for the ComfyUI UI to play without the advanced JS widget.

## Inputs
- Optional `reference_vid`, `base_vid`, `upscaled_vid` strings containing video file paths.

## Outputs
- UI dictionary with `video_paths`, `connected_inputs`, and `input_count` for the panel.

## Usage Tips
1. Use when you want a zero-dependency preview node (no custom JS).
2. Connect whichever filenames you have available; the UI will only show linked videos.

## Additional Resources
- [Full documentation](docs/nodes/video-preview/VIDEO_PREVIEW.md#native-preview)
