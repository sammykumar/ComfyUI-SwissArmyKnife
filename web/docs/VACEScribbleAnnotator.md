# VACEScribbleAnnotator
Generate anime/general/sketch scribble maps using the official VACE ContourInference checkpoints (with Sobel fallback).

## Inputs
- `images` – IMAGE batch of frames to stylize.
- `style`, `inference_mode`, `resolution` – select checkpoint + processing size.
- Optional `model_path` – explicit checkpoint override.

## Outputs
- `scribble_maps` – IMAGE tensor with RGB scribble overlays.

## Usage Tips
1. Place after video/image loaders before ControlNet or composition nodes.
2. Keep `inference_mode=auto` to automatically fall back when checkpoints are missing.

## Additional Resources
- [Full documentation](docs/nodes/vace-annotators/scribble/README.md)
