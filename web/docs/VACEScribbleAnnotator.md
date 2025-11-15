# VACEScribbleAnnotator
Generate anime/general/sketch scribble maps using the official VACE ContourInference checkpoints (with Sobel fallback).

## Inputs
- `images` – IMAGE batch of frames to stylize.
- `style`, `inference_mode`, `resolution` – select checkpoint + processing size.
- `batch_size` – process frames in chunks to limit VRAM (set to `0` to process the entire batch).
- `edge_threshold` – controls how aggressively Sobel/legacy outputs are thresholded (default `0.12`, ignored by vendor checkpoints).
- Optional `model_path` – explicit checkpoint override.
 - Optional `mask` – Optional `MASK` input to restrict scribble generation to specified regions. See the "Mask Input (Optional)" section below.

## Outputs
- `scribble_maps` – IMAGE tensor with RGB scribble overlays.

## Usage Tips
1. Place after video/image loaders before ControlNet or composition nodes.
2. Keep `inference_mode=auto` to automatically fall back when checkpoints are missing.
3. Lower `batch_size` (e.g., 8–12) if you encounter CUDA OOM while processing long clips.

## Mask Input (Optional) 🪄

Add an optional `mask` input to only generate scribbles inside a mask region.

Summary
- A `mask` input restricts scribble/edge generation to the region(s) specified by the provided mask.
- Minimal implementation applies the mask to the final NHWC scribble map so the node’s existing model pipeline remains unchanged.
- Both vendor model outputs and the Sobel fallback produce per-pixel NHWC float outputs; masks are compatible and require only resizing and optional broadcasting.

Input (user-focused)
- `mask` — Optional `MASK` input (ComfyUI `MASK` type).
	- Accepts: batched masks `[B, H, W]` or single mask `[1, H, W]` to be broadcasted to batch size.
	- Accepts mask images with 1, 3, or 4 channels (RGB/RGBA) or uint8 (0–255) or float (0–1).
	- Soft masks supported: if mask is float 0..1, scribble blending follows float mask (partial blend). Optionally a `mask_threshold` can be added if desired.

Behavior
- Mask resizing & broadcasting:
	- If mask resolution differs from image resolution, it’s resized to the scribble output size using bilinear interpolation (resize in NCHW space via `F.interpolate`).
	- If the mask batch size is 1 and images have N frames, it’s broadcast to `[N, H, W]`.
- Channel handling:
	- Multi-channel masks (RGB or RGBA) are reduced to single-channel masks by using alpha (if 4 channels) or channel mean.
	- The single-channel mask is repeated to 3 channels to match the scribble output.
- Scribble application:
	- Scribble output has values 0.0 (black lines) .. 1.0 (white background). Apply mask by:
		- scribble_out = scribble_out * mask3 + white * (1 - mask3)
		- For soft masks, mask3 is float `0..1`, resulting in a blend.
- Default outside-of-mask behavior:
	- White background (1.0) is used outside the mask — this matches current scribble maps that use white background.

Example usage (ComfyUI)
- Connect the `LoadImage` node’s `MASK` output to the `mask` input on the `VACE Scribble Annotator` node.
- When processing a batch, the node applies a single mask to every frame (if mask has batch size 1) or a unique mask per frame (if the mask batch matches).

## Developer Notes (Implementation guidance) 🔧

Small changes only (safe & minimal)
- Add `mask` to `INPUT_TYPES["optional"]` in `nodes/vace_annotators/vace_scribble_annotator.py`.
	- Example snippet for Node schema (user-facing):
		- "mask": ("MASK", {"tooltip": "Optional mask to restrict scribble generation, resized and broadcasted to frames."})
- Add argument to method signature:
	- Add `mask: torch.Tensor | None = None` to `generate_scribble(...)`.
- Apply mask after processing:
	- After `scribble_maps = self._process_scribble(...)`, call a new helper:
		- `scribble_maps = self._apply_mask_to_scribbles(scribble_maps, mask)`
	- Keep the existing `scribble_maps` shape and return semantics intact.

Minimal helper pseudo-implementation (developer-level)
- Pseudocode for `_apply_mask_to_scribbles`:

```python
def _apply_mask_to_scribbles(self, scribbles, mask, mask_threshold=None):
		"""
		scribbles: torch.Tensor [B, H, W, 3], float 0..1 (NHWC)
		mask: None or torch.Tensor [B, H_m, W_m, C] or [1, H_m, W_m, C] or [B, H_m, W_m] dtype uint8 or float0..1
		"""
		if mask is None:
				return scribbles
		# normalize dtype -> float 0..1
		mask = mask.float() / 255.0 if mask.dtype == torch.uint8 else mask.float()
		# reduce channels -> single channel (alpha if C==4 else mean across channels)
		if mask.ndim == 4:
				if mask.shape[-1] == 4:
						single = mask[..., 3:4]
				else:
						single = mask.mean(dim=-1, keepdim=True)
		elif mask.ndim == 3:
				single = mask[..., None]  # add channel dim
		# Broadcast to batch size
		if single.shape[0] == 1 and scribbles.shape[0] > 1:
				single = single.repeat(scribbles.shape[0], 1, 1, 1)
		# Resize to scribble HW
		import torch.nn.functional as F
		single_nchw = single.permute(0, 3, 1, 2)
		single_resized = F.interpolate(single_nchw, size=(scribbles.shape[1], scribbles.shape[2]), mode='bilinear', align_corners=False)
		mask3 = single_resized.repeat(1, 3, 1, 1).permute(0, 2, 3, 1)
		# Optional: Mask thresholding
		if mask_threshold is not None:
				mask3 = (mask3 > mask_threshold).float()
		# Apply mask (outside set to white)
		scribbles = scribbles * mask3 + 1.0 * (1.0 - mask3)
		return scribbles
```

- Keep the return as `scribble_maps` in NHWC float tensor `.cpu()` for the node’s RETURN_TYPES semantics.

Edge Cases and Behavior
- Fully zero mask => all white scribbles (no lines).
- Fully one mask => identical to no mask.
- If mask dtype is `uint8`, treat 0..255 as 0..1 (divide by 255).
- If `mask` is `IMAGE` instead of `MASK` or different dtype, convert where feasible.

Optional API enhancements
- Optional param, `mask_threshold` (FLOAT, default 0.5):
	- Binarize soft masks if desired.
- Optional param, `mask_dilate` (INT, default 0):
	- Expand masked region to ensure adjacent edges are included (morphology / dilation).
- Optional param, `outside_mode` (`white|transparent|original`):
	- `white` = default; `transparent` => use alpha (requires returning RGBA or mask-out color). `original` => composite scribble onto original image outside the mask.

Advanced optimization (future)
- Crop inference by calculating mask bounding box and running the model only on the crop; paste outputs into full canvas for speed. This requires careful logic for model input normalization and edge blending and is out of scope for the minimal approach.

## Tests & Validation 🧪

Suggested tests for `tests/`
- `test_vace_scribble_annotator_mask.py`:
	- Test 1: Small synthetic image (e.g., 16x16), create a binary mask rectangle. Run generate_scribble with `inference_mode="fallback"` and assert that:
		- Inside rectangle: scribble pixel values < 1 (lines exist).
		- Outside rectangle: scribble pixel values == 1 (white).
	- Test 2: Soft mask blending: a mask with values `[0, 0.5, 1]` across columns should blend scribbles proportionally (scribbles partial intensity).
	- Test 3: Batch broadcast: use batch images N and mask batch size 1 and confirm mask applied to all frames.
	- Test 4: Edge case: empty mask -> all white; full mask -> identical to no mask case.

Testing utilities:
- The repo’s tests likely use CPU tensors. Ensure all tests use CPU-only tensors (force device to CPU) to avoid GPU dependency.

## Documentation & Help page updates
- Update `web/docs/VACEScribbleAnnotator.md` (or create `docs/nodes/vace-annotators/scribble/VIDEO_SCRIBBLE.md`) to include:
	- Inputs: include `mask` and its behavior.
	- Example: short usage snippet describing LoadImage mask wiring.
	- Developer notes linking to the main node `vace_scribble_annotator.py`.

## Implementation Checklist (for devs) ✅
1. Update `INPUT_TYPES` in `nodes/vace_annotators/vace_scribble_annotator.py` to add the `mask` input.
2. Add `mask` parameter to `generate_scribble(...)`.
3. Implement `_apply_mask_to_scribbles` helper (as above).
4. Call helper post `_process_scribble(...)`.
5. Add tests in `tests/` to validate the functionality.
6. Update the help doc: `web/docs/VACEScribbleAnnotator.md` (the doc you’re currently editing) and canonical docs `docs/nodes/vace-annotators/scribble/` if used.
7. Optional: add `mask_threshold`, `mask_dilate` or `outside_mode` parameters if desired.

## Example Quick Notes for Developer on API Changes
- Node schema update:
	- `optional` → add `mask`
- Function signature:
	- `def generate_scribble(..., mask: Optional[torch.Tensor] = None, mask_threshold: float = 0.5) -> Tuple[torch.Tensor]:`
- Where to apply:
	- After `scribble_maps = self._process_scribble(...)`
	- `if mask is not None: scribble_maps = self._apply_mask_to_scribbles(scribble_maps, mask, mask_threshold)`

If it’s helpful, I can:
1) Paste this content into `web/docs/VACEScribbleAnnotator.md` for you, or
2) Generate the test skeleton and developer helper code snippets in `vace_scribble_annotator.py` (non-executing plan only), or
3) Draft a PR description showing the change.

Which would you like me to take next? ✅

## Additional Resources
- [Full documentation](docs/nodes/vace-annotators/scribble/README.md)
