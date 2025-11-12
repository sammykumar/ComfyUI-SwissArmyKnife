# VACE Scribble Annotator — Help Page

Help-page style documentation for the **VACEScribbleAnnotator** custom node bundled with ComfyUI-SwissArmyKnife. This format mirrors the structure described in the official ComfyUI custom node help page guide.

---

## Summary

Generate stylized scribble/edge maps from images or video frames. The node automatically uses the official VACE ContourInference checkpoints (anime/general/sketch) when they are available and falls back to a Sobel/ResNet implementation otherwise. Outputs are RGB scribble maps that can be previewed directly or routed into downstream control nodes.

**Category:** `Swiss Army Knife 🔪/VACE Annotators`  
**Node ID:** `VACEScribbleAnnotator`

---

## Inputs

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `images` | IMAGE | ✔ | - | Input image or batch of frames (NHWC, ComfyUI standard). |
| `style` | COMBO (`anime`,`general`,`sketch`) | ✔ | `anime` | Selects which official VACE checkpoint to load. |
| `inference_mode` | COMBO (`auto`,`model`,`fallback`) | ✔ | `auto` | `auto` prefers checkpoints when present, `model` requires them (errors otherwise), `fallback` forces Sobel mode. |
| `batch_size` | INT | ✖ | `10` | Process frames in chunks to limit VRAM. Set to `0` to process the full batch at once. |
| `resolution` | INT | ✔ | `512` | Square working resolution used before inference. Higher values capture more detail but use more VRAM/time. |
| `model_path` | STRING | ✖ | `""` | Optional explicit checkpoint path. When empty, the node searches the standard `models/vace_annotators/scribble/...` tree. |

---

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `scribble_maps` | IMAGE | RGB scribble/edge maps (same H×W as the input frames). |

---

## Behavior

### Backend auto-detection

1. **ContourInference (vendor) backend** – Triggered when the checkpoint contains `model0.*` keys. The node instantiates the original VACE generator, keeps inputs in `[0,1]`, and uses the native Sigmoid outputs directly. This reproduces the vendor visuals exactly and ignores the old edge-threshold slider.
2. **ResNet backend** – Triggered for legacy/custom checkpoints that match the vendored ResNet architecture. Inputs are normalized to `[-1,1]`, outputs go through adaptive quantile thresholding, and optional thinning runs to mimic the previous SwissArmyKnife behavior.
3. **Sobel fallback** – When checkpoints are missing (or `inference_mode=fallback`), the node applies grayscale Sobel filters, normalizes magnitudes per-frame, thresholds with an internal factor of `0.12`, and produces usable scribble maps without any external files.

Every backend respects the `batch_size` chunking control, so large frame batches can be streamed without exhausting VRAM.

### Resolution handling

All three backends resize incoming frames to the chosen `resolution` for processing and then resize outputs back to the original dimensions. This keeps interface shapes stable while letting you trade quality for speed.

### Model discovery order

1. If ComfyUI exposes `folder_paths`, the node inspects the reported base directory and checks `models/vace_annotators/scribble/…`.
2. Falls back to relative paths (`models/...`, `../models/...`) and finally `~/ComfyUI/models/...`.
3. If `model_path` is provided it takes precedence and is cached per-style for reuse.

---

## Usage Guide

1. **Place checkpoints** (optional for Sobel fallback) under:
   ```
   models/vace_annotators/scribble/
   ├─ anime_style/netG_A_latest.pth
   ├─ general/scribble.pth
   └─ sketch/sketch.pth
   ```
2. **Add the node** to a workflow and connect an IMAGE batch (e.g., from VHS video loaders or image inputs).
3. Select a `style` and keep `inference_mode=auto` for the common case.
4. Leave `model_path` blank unless you store checkpoints in a custom location.
5. Adjust `resolution` to balance fidelity vs. performance (512 is the vendor default; 768–1024 offers more detail).
6. Run the workflow; the node logs which backend ran and outputs an IMAGE tensor ready for previews or downstream control nodes.
7. If the GPU runs out of memory, lower `batch_size` (e.g., 8–12) so frames are processed in smaller chunks.

---

## Troubleshooting

| Symptom | Likely Cause | Resolution |
| --- | --- | --- |
| `Failed to load VACE scribble model` | Checkpoint missing or incompatible. | Verify the file path, download from ali-vilab/VACE-Annotators, or switch `inference_mode` to `fallback`. |
| Output looks gray with little contrast | Running Sobel fallback at low resolution. | Increase `resolution` or install the official checkpoints. |
| Node import warning about `postprocess_vendor_scribble_output` | Outdated installation. | Update the extension to include the latest vendored helpers. |
| Workflow validation complains about resolution type | Ensure the `resolution` widget is set to an integer (multiples of 64 recommended). |

---

## Notes & Implementation Details

- Vendor checkpoints prefer CUDA but will fall back to CPU automatically; Sobel mode runs on whichever device is available.
- Morphological thinning uses `skimage` when present but gracefully degrades to a torch-only pass.
- A shared cache inside `scribble_loader.py` prevents duplicate checkpoint loads during long sessions.
- Documentation and implementation are kept in-sync via `docs/VENDORING.md`; refer there when updating vendored code.

---

## Change Log (key highlights)

- **Nov 2025**: Vendor ContourInference graph added, automatic backend detection, edge-threshold slider removed.
- **Oct 2025**: Initial vendored ResNet model + Sobel fallback shipped (pre-threshold-removal).

---

For additional VACE node information (depth, flow, combined usage) see `docs/nodes/vace-annotators/VACE_ANNOTATORS.md` and the sample workflows in `docs/nodes/vace-annotators/example_workflow.json`.
