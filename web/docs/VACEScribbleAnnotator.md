# VACEScribbleAnnotator
Generate anime/general/sketch scribble maps using the official VACE ContourInference checkpoints (with Sobel fallback).

## Inputs
- `images` – IMAGE batch of frames to stylize.
- `style`, `inference_mode`, `resolution` – select checkpoint + processing size.
- `batch_size` – process frames in chunks to limit VRAM (set to `0` to process the entire batch).
- `edge_threshold` – controls how aggressively Sobel/legacy outputs are thresholded (default `0.12`, ignored by vendor checkpoints).
- Optional `model_path` – explicit checkpoint override.

## Outputs
- `scribble_maps` – IMAGE tensor with RGB scribble overlays.

## Usage Tips
1. Place after video/image loaders before ControlNet or composition nodes.
2. Keep `inference_mode=auto` to automatically fall back when checkpoints are missing.
3. Lower `batch_size` (e.g., 8–12) if you encounter CUDA OOM while processing long clips.

## Additional Resources
- [Full documentation](docs/nodes/vace-annotators/scribble/README.md)
