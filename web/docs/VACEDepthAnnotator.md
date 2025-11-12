# VACEDepthAnnotator
Run the VACE depth estimator to produce H×W depth maps for each frame, with automatic fallback when checkpoints are missing.

## Inputs
- `images` – IMAGE batch to analyze.
- `style` / `inference_mode` / `resolution` – control checkpoint selection and processing size.
- Optional `model_path` – override path discovery.

## Outputs
- `depth_maps` – IMAGE tensor containing normalized depth values.

## Usage Tips
1. Drop into video pipelines before ControlNet/conditioning nodes.
2. Keep `resolution` reasonable (512) unless you need extra detail.

## Additional Resources
- [Full documentation](docs/nodes/vace-annotators/VACE_ANNOTATORS.md#vace-annotator-depth)
