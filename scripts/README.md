# Run VACE Scribble Annotator from CLI

This folder contains a small helper script to run the `VACEScribbleAnnotator` node outside of ComfyUI for faster iteration.

Usage (basic):

```bash
source .venv/bin/activate
python scripts/run_scribble_node.py --image path/to/image.jpg --outputDir out
```

Run with mask (optional):

```bash
python scripts/run_scribble_node.py --image path/to/image.jpg --mask path/to/mask.png --outputDir out
```

Notes:
- The script uses the Sobel fallback by default (`--inference_mode fallback`) to avoid needing heavy model weights during early development.
- To test vendor model inference, supply `--inference_mode model` and `--model_path` to point at a valid VACE model checkpoint.
- Small images (64–512) are recommended when iterating quickly.
