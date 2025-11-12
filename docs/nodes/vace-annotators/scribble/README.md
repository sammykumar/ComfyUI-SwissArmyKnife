# VACE Annotator — Scribble (ComfyUI node)

This documentation describes the VACE Scribble/Edge Annotator node implemented in this repository for ComfyUI.

Summary
-------
The node produces scribble/edge maps from input images (frames). It attempts to use the official VACE-Annotators generator/checkpoint when the annotator code and checkpoint are available in the runtime environment. If the official model code is not available, the node falls back to a high-quality Sobel-based PyTorch implementation so it produces useful edge maps immediately.

Status
------
- Short-term: Working. The node resolves ComfyUI base directory correctly, prints debug candidate model paths, attempts to load an annotator model when present, and otherwise falls back to a Sobel edge detector.
- Medium-term (planned): Vendor or import the official VACE-Annotators `scribble` code and implement exact preprocessing/postprocessing to reproduce stylized outputs identical to upstream.

Where to place model files
-------------------------
Place official VACE-Annotators checkpoint files under your ComfyUI base models directory. For example (when running ComfyUI with `--base-directory /comfyui/basedir`):

/comfyui/basedir/models/vace_annotators/scribble/
├─ anime_style/netG_A_latest.pth
├─ general/scribble.pth
└─ sketch/sketch.pth

Notes
- The node attempts to discover ComfyUI's base directory (via `folder_paths` if available) and will check `/comfyui/basedir/models/vace_annotators/scribble/...` first.
- If `folder_paths` is not available, the node falls back to these candidate locations (in order):
  - `models/vace_annotators/scribble`
  - `../models/vace_annotators/scribble`
  - `~/ComfyUI/models/vace_annotators/scribble`

Behavior and usage
------------------
Inputs (node fields):
- `images` (IMAGE) — Input images or frames (batch supported)
- `style` (choice: `anime`, `general`, `sketch`) — Which annotator style/checkpoint to use
- `inference_mode` (choice: `auto`, `model`, `fallback`) — Auto = prefer vendored model, Model = require checkpoint, Fallback = always Sobel
- `edge_threshold` (FLOAT) — Edge/adaptive-threshold intensity control (default: **0.12**). Lower = more edges.
- `resolution` (INT) — Internal processing resolution (default: 512)
- `model_path` (STRING) — Optional explicit path to a checkpoint (overrides default path resolution)

Processing logic (overview)
1. Resolve `model_path`: if not provided the node checks ComfyUI-aware base directory candidates, then legacy fallbacks. Debug prints list the candidates and the first match.
2. `_load_model` attempts to dynamically import an annotator generator class if the VACE-Annotators code is installed/available on PYTHONPATH:
   - It searches common module/class names (e.g., `NetG`, `Generator`, `ResnetGenerator`) and will try to instantiate the class and load the checkpoint's `state_dict`.
   - If this succeeds the node uses the real model for inference (with preprocessing/postprocessing applied).
3. If no annotator code is available or loading fails, the node uses a built-in Sobel fallback implemented in PyTorch (GPU-aware).

Sobel fallback specifics
- Input images are normalized (uint8 -> 0..1 or kept as floats if already normalized).
- Images are resized to `resolution` before convolution.
- Sobel 3x3 kernels are applied using `torch.nn.functional.conv2d`.
- The gradient magnitude is normalized per-image, resized back to the original frame size, thresholded, and converted to an RGB scribble map (NHWC) for ComfyUI.

Model-based inference specifics (when annotator code is present)
- Inputs are resized/normalized according to the model's expected range (attempts 0..1 -> -1..1 conversion when appropriate).
- Inference is run inside `torch.no_grad()` with the model on the detected device (CUDA if available).
- Output is reduced to a single-channel magnitude, thresholded, and returned as an RGB scribble map.

Why the node previously produced all-white output
-----------------------------------------------
The original placeholder used a simple finite-difference gradient and a default threshold of 0.5. Typical normalized image gradients are much smaller than 0.5, so this suppressed all edges producing an all-white output. The new default threshold and Sobel fallback normalize magnitudes and produce visible edges.

Threshold tuning guidance
-------------------------
- Sobel outputs are normalized per-image. Typical useful thresholds range from `0.02` to `0.15` depending on desired detail.
- You've observed reasonable results at `0.05`. Try `0.02`–`0.06` for more detail; increase toward `0.1`–`0.15` to reduce noise.
- When using the official model, the thresholding/postprocessing behavior may differ; tune per-style.

Debugging & verification (commands to run inside ComfyUI container)
------------------------------------------------------------------
Check model files exist (example):

```zsh
ls -la /comfyui/basedir/models/vace_annotators/scribble
ls -la /comfyui/basedir/models/vace_annotators/scribble/anime_style/netG_A_latest.pth
```

Check `folder_paths` availability and reported directories:

```zsh
python - <<'PY'
try:
    import folder_paths
    print('folder_paths available')
    if hasattr(folder_paths, 'get_base_directory'):
        print('get_base_directory ->', folder_paths.get_base_directory())
    if hasattr(folder_paths, 'base_dir'):
        print('base_dir ->', folder_paths.base_dir)
    if hasattr(folder_paths, 'get_user_directory'):
        print('get_user_directory ->', folder_paths.get_user_directory())
    if hasattr(folder_paths, 'user_dir'):
        print('user_dir ->', folder_paths.user_dir)
except Exception as e:
    print('folder_paths not available:', e)
PY
```

Run a ComfyUI flow and observe logs — expected messages when node runs:
- "VACE scribble: checking N candidate base paths for style '...'."
- A list of `candidate:` paths the node tried
- Either `-> found: /...` and then messages indicating model load success, OR messages indicating it is falling back to the Sobel detector.

Roadmap and next steps
----------------------
Long-term implementation plan (detailed)
--------------------------------------
This section documents the concrete, engineer-oriented implementation steps needed to reproduce the VACE `scribble` output exactly inside this repository. It is written so another developer or an LLM can follow the steps and implement the vendored model + pipeline.

High-level goals
- Reproduce the stylized scribble outputs produced by the VACE-Annotators `scribble` models (anime/general/sketch) inside the ComfyUI node, with equivalent preprocessing, model architecture, checkpoint loading, and postprocessing.
- Deliver a user-friendly experience in Docker/ComfyUI without requiring users to pip-install the full upstream repo (recommended: vendor minimal model code and transforms into `nodes/vace_annotators/annotator_models/`).

Files and placement (implemented)
- `nodes/vace_annotators/annotator_models/scribble.py` — vendored ResNet generator, preprocessing, postprocessing helpers (Apache-2.0 attribution included).
- `nodes/vace_annotators/annotator_models/__init__.py` — shim exporting loader + helpers.
- `nodes/vace_annotators/scribble_loader.py` — thin loader, caching, and device handling for checkpoints.
- `tests/annotators/test_scribble_inference.py` — smoke tests for fallback + optional model inference, writes artifacts under `tests/output/`.

Step-by-step implementation
1) Acquire upstream reference code
    - Pull the `scribble` subfolder from `VACE-Annotators` (or copy the relevant model and transforms files). The important things to locate are:
      - Generator/netG model class file (often named `networks.py`, `model.py`, or similar).
      - Any custom layers or utilities used by the generator (e.g., `blocks.py`, `ops.py`).
      - The `README`/config in `scribble` describing expected input ranges and any tricks.

2) Vendor minimal model code (preferred)
    - Copy only the model class and minimal required helper layers into `nodes/vace_annotators/annotator_models/scribble.py`.
    - Add the original upstream license header and an attribution comment at the top of the vendored file.
    - Resolve imports: replace upstream package-relative imports with local relative imports inside the vendored module (keep changes minimal).
    - Add a small `load_scribble_model(path, style, device)` function which:
      - Instantiates the correct generator class for `style` (anime/general/sketch if the architectures differ).
      - Loads the checkpoint with `torch.load(path, map_location='cpu')`.
      - Extracts the proper `state_dict` key (try `ckpt['state_dict']`, `ckpt['model']`, or `ckpt` itself).
      - Strips common prefixes like `module.` when present.
      - Calls `model.load_state_dict()` and moves model to `device` then `model.eval()`.

3) Implement exact preprocessing pipeline
    - Inspect the upstream preprocessing for `scribble` in VACE-Annotators. Typical steps:
      - Resize input to model `resolution` (some models accept arbitrary sizes, but vendor code often uses a fixed internal size).
      - Convert to float32 and normalize pixel range to the model's expected input: commonly `[-1, 1]` (so do `img = img*2 - 1` for 0..1 inputs).
      - Reorder to NCHW and (if necessary) apply mean/std normalization used during training.
      - Optionally apply any augment-style transforms (color to grayscale, edge-aware augment) the model expects.
    - Implement preprocessing as a helper function in `annotator_models/scribble.py` and call it from `vace_scribble_annotator._process_scribble` when a model is loaded.

4) Model inference & device handling
    - Run inference inside `torch.no_grad()` on the chosen `device` (CUDA if available).
    - Support batching: if user supplies a batch of frames, run in a stable batch size (or chunk to avoid OOM).
    - Prefer single-GPU/CPU mode; multi-GPU/torchrun support is out of scope but document if needed.

5) Exact postprocessing to match upstream
    - Upstream scratch note: generator outputs are often in `tanh` range `[-1,1]` or `sigmoid` `0..1` depending on architecture.
    - Postprocessing pipeline to implement (exact mapping depends on model):
      - If `tanh` used: `out = (out + 1) / 2` to get `0..1` range.
      - Convert multi-channel output to single-channel magnitude (if generator outputs X/Y or multiple maps): e.g., `mag = out.abs().mean(dim=1, keepdim=True)` or apply a custom mapping per upstream code.
      - Apply morphological thinning / non-maximum suppression (to reduce thick strokes to single-pixel lines). Use `skimage.morphology.thin` or implement a small PyTorch morphological thinning op.
      - Optionally apply small median/bilateral denoising and connected-component filtering to remove tiny speckles.
      - Use adaptive thresholding tuned per-style; upstream may use a percentile-based threshold or learned binarization. Implement:
            - `thr = np.percentile(mag.cpu().numpy(), 95) * scale` as a starting point, or
            - Otsu's method per-frame for adaptive thresholding.
    - Resize postprocessed binary map back to original frame size and convert to NHWC RGB for ComfyUI.

6) Integration and fallback behavior
    - Keep the Sobel fallback for users who do not want to install upstream code or for quick testing.
    - Expose a node option `inference_mode` (enum: `auto`, `model`, `fallback`) to force the mode.
    - If `model` mode is selected and model loading fails, show a clear error with instructions to place checkpoints and/or install the vendored annotator module.

7) Testing & visual validation
    - Add a test script `tests/annotators/test_scribble_inference.py` that:
      - Loads a small sample frame (e.g., `tests/data/sample1.png`), runs the model and the Sobel fallback, and writes outputs to `tests/output/` for visual diff.
      - Asserts output shapes and that the output is not all-white/black (simple sanity checks).
    - Add CI job (optional) to run the unit test on CPU using a very small checkpoint or a mocked model.

8) Documentation & user instructions
    - Update this README with exact model filenames, how to download official checkpoints (link to the Hugging Face `VACE-Annotators` page), and how to place them under the ComfyUI base models folder.
    - Add a small `docs/INSTALL-VACE-ANNOTATORS.md` with Docker steps to add the vendored model code (or pip-install upstream). If vendored, document that no additional pip install is required.

Performance and engineering notes
- Memory: when running on GPU, be mindful of the `resolution` setting; model-based inference can be heavy at high resolution (recommend 512 or 640 for typical single-GPU inference). Provide chunking or frame-by-frame processing to avoid OOM.
- Determinism: set `torch.backends.cudnn.deterministic = True` only if needed; otherwise prefer speed.
- Packaging: keep vendored code minimal to avoid license confusion. Preserve Apache-2.0 headers and add a `VENDORING.md` note referencing upstream commit/URL.

Licensing and attribution
--------------------------------
- Upstream VACE-Annotators by `ali-vilab` (Apache-2.0). If vendoring code, include the original license header in the vendored files and add a `VENDORING.md` file listing the upstream source and commit/URL.

Acceptance criteria (how to know we matched upstream)
- Visual parity: sample inputs processed through the vendored model should visually match the output from running the official VACE-Annotators repo (same line thickness/density and stylization for the same checkpoint and preprocessing settings).
- Automated checks: the test harness saves model output images to `tests/output/` and provides a small visual-diff script (pixel-level similarity or structural similarity index) to assert similarity beyond trivial thresholds.

Implementation checklist (developer view)
- [x] Copy generator class and minimal helpers into `nodes/vace_annotators/annotator_models/scribble.py` with license header.
- [x] Implement `load_scribble_model(path, style, device)` and wire it into `vace_scribble_annotator._load_model()`.
- [x] Implement exact preprocessing transforms used upstream.
- [x] Implement postprocessing (tanh->0..1, thinning, adaptive thresholding, denoising).
- [x] Add a node `inference_mode` option and improved error messages.
- [x] Add tests and a small visual-diff utility.
- [x] Add `docs/VENDORING.md` documenting the vendored files and upstream links.


Attribution & license
---------------------
- Upstream VACE and VACE-Annotators by ali-vilab: https://github.com/ali-vilab/VACE and https://huggingface.co/ali-vilab/VACE-Annotators
- Upstream content is Apache-2.0; if we vendor their code, we must preserve license and attribution in the vendored files.

Contact / development notes
---------------------------
- The node implementation is in `nodes/vace_annotators/vace_scribble_annotator.py`.
- For reproducible Docker usage, vendoring minimal annotator model code gives the best UX (no extra pip install). Otherwise, document the requirement to install the upstream annotator package in the Docker image.

If you want, I can now vendor the minimal `scribble` model code into `nodes/vace_annotators/annotator_models/` (with attribution), implement the exact preprocessing/postprocessing, and add a test harness. Please confirm if you want vendoring (recommended) or depending on upstream package installation.
