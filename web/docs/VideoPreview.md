# VideoPreview
Web-based preview panel that streams reference, base, and upscaled videos side-by-side with synced controls.

## Inputs
- `reference_vid`, `base_vid`, `upscaled_vid` – file paths from VHS save nodes.
- All inputs are optional so you can preview any combination.

## Outputs
- Display-only node; results render in the ComfyUI panel (no tensors emitted).

## Usage Tips
1. Place at the end of your workflow and connect whichever video paths you want to inspect.
2. Use the UI buttons (play/pause/sync) to compare runs while generation continues.

## Additional Resources
- [Full documentation](docs/nodes/video-preview/VIDEO_PREVIEW.md)
