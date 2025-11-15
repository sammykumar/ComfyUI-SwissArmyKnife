# VACEScribbleAnnotator
Generate anime/general/sketch scribble maps using the official VACE ContourInference checkpoints (with Sobel fallback).

## Inputs
- `images` – IMAGE batch of frames to stylize.
- `style`, `inference_mode`, `resolution` – select checkpoint + processing size.
- `batch_size` – process frames in chunks to limit VRAM (set to `0` to process the entire batch).
- Optional `model_path` – explicit checkpoint override.

## Outputs
- `scribble_maps` – IMAGE tensor with RGB scribble overlays.

## Usage Tips
1. Place after video/image loaders before ControlNet or composition nodes.
2. Keep `inference_mode=auto` to automatically fall back when checkpoints are missing.
3. Lower `batch_size` (e.g., 8–12) if you encounter CUDA OOM while processing long clips.

## Additional Resources
- [Full documentation](docs/nodes/vace-annotators/scribble/README.md)

## Run outside ComfyUI (CLI Runner)

We provide a small helper script for running the annotator outside of ComfyUI to facilitate fast development:

```bash
source .venv/bin/activate
python scripts/run_scribble_node.py --image tests/data/example.jpg --mask tests/data/example_mask.png --inference_mode fallback --outputDir tests/data/output/
```

Notes:
- The runner uses `inference_mode=fallback` by default, which uses a Sobel-based fallback and requires no checkpoints. Using the vendor models requires `--inference_mode model` and a valid `--model_path`.
- For faster iterations, use small images and `inference_mode=fallback`.

