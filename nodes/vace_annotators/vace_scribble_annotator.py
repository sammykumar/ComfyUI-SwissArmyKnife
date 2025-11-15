"""
VACE Scribble Annotator Node

Generates scribble/edge maps from images using vendored VACE scribble models
and falls back to a Sobel implementation when checkpoints are unavailable.
"""

from __future__ import annotations

import os
from typing import Tuple

import torch

# Prefer ComfyUI folder_paths when available (respects --base-directory)
try:
    import folder_paths
    COMFYUI_AVAILABLE = True
except Exception:  # pragma: no cover - runtime dependency
    folder_paths = None
    COMFYUI_AVAILABLE = False

from .annotator_models import (
    postprocess_scribble_output,
    postprocess_vendor_scribble_output,
    preprocess_scribble_input,
)
from .scribble_loader import ScribbleLoaderError, get_scribble_model


EDGE_THRESHOLD_DEFAULT = 0.12


class VACEScribbleAnnotator:
    """ComfyUI node for VACE scribble/edge detection."""

    _model_cache = {}

    @classmethod
    def INPUT_TYPES(cls):
        """Node schema."""
        return {
            "required": {
                "images": ("IMAGE", {
                    "tooltip": "Input images or video frames (batch supported)",
                }),
                "style": (["anime", "general", "sketch"], {
                    "default": "anime",
                    "tooltip": "Style of scribble/edge detection",
                }),
                "inference_mode": (["auto", "model", "fallback"], {
                    "default": "auto",
                    "tooltip": "auto: prefer model when available. model: require checkpoint. fallback: always Sobel",
                }),
                "resolution": ("INT", {
                    "default": 512,
                    "min": 64,
                    "max": 2048,
                    "step": 64,
                    "tooltip": "Processing resolution (lower = faster, higher = more detail)",
                }),
            },
            "optional": {
                "model_path": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "tooltip": "Custom path to model file (leave empty for default discovery)",
                }),
                "batch_size": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 128,
                    "tooltip": "Process frames in chunks to reduce VRAM usage (0 = process entire batch).",
                }),
                "mask": ("MASK", {
                    "default": None,
                    "tooltip": "Optional mask to restrict scribble generation to specific regions (batch or single-frame).",
                }),
            },
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("scribble_maps",)
    FUNCTION = "generate_scribble"
    CATEGORY = "Swiss Army Knife 🔪/VACE Annotators"
    DESCRIPTION = (
        "Runs the vendored VACE scribble models (anime/general/sketch) or Sobel fallback to convert IMAGE batches into RGB "
        "scribble maps at the requested resolution."
    )

    def _get_default_model_path(self, style: str) -> str:
        """Resolve default checkpoint path for a style."""
        possible_bases = []
        if COMFYUI_AVAILABLE and folder_paths is not None:
            try:
                base_dir = None
                if hasattr(folder_paths, "get_base_directory"):
                    base_dir = folder_paths.get_base_directory()
                elif hasattr(folder_paths, "base_dir"):
                    base_dir = folder_paths.base_dir
                if base_dir is None:
                    user_dir = None
                    if hasattr(folder_paths, "get_user_directory"):
                        user_dir = folder_paths.get_user_directory()
                    elif hasattr(folder_paths, "user_dir"):
                        user_dir = folder_paths.user_dir
                    if user_dir:
                        if os.path.basename(os.path.normpath(user_dir)).lower() == "user":
                            base_dir = os.path.dirname(os.path.normpath(user_dir))
                        else:
                            base_dir = user_dir
                if base_dir:
                    possible_bases.append(os.path.join(base_dir, "models", "vace_annotators", "scribble"))
            except Exception:
                pass

        possible_bases.extend([
            "models/vace_annotators/scribble",
            "../models/vace_annotators/scribble",
            os.path.expanduser("~/ComfyUI/models/vace_annotators/scribble"),
        ])

        model_files = {
            "anime": "anime_style/netG_A_latest.pth",
            "general": "general/scribble.pth",
            "sketch": "sketch/sketch.pth",
        }

        model_file = model_files.get(style, "anime_style/netG_A_latest.pth")

        try:
            print(f"VACE scribble: checking {len(possible_bases)} candidate base paths for style '{style}'")
        except Exception:  # pragma: no cover - print guard
            pass

        for base_path in possible_bases:
            full_path = os.path.join(base_path, model_file)
            try:
                print(f"  candidate: {full_path}")
            except Exception:
                pass
            if os.path.exists(full_path):
                print(f"  -> found: {full_path}")
                return full_path

        return os.path.join(possible_bases[0], model_file)

    def _load_model(self, style: str, model_path: str, inference_mode: str):
        if inference_mode == "fallback":
            return None

        resolved_path = model_path or self._get_default_model_path(style)
        if not os.path.exists(resolved_path):
            message = (
                f"VACE scribble checkpoint missing for style '{style}'. Expected at {resolved_path}."
            )
            if inference_mode == "model":
                raise FileNotFoundError(
                    f"{message} Download checkpoints from https://huggingface.co/ali-vilab/VACE-Annotators"
                )
            print(f"{message} Falling back to Sobel implementation.")
            return None

        cache_key = f"{style}:{resolved_path}"
        if cache_key in self._model_cache:
            print(f"✓ Using cached VACE scribble model: {style}")
            return self._model_cache[cache_key]

        print(f"Loading VACE scribble model: {style} from {resolved_path}")
        try:
            model = get_scribble_model(style, resolved_path)
        except ScribbleLoaderError as exc:
            if inference_mode == "model":
                raise
            print(f"Failed to load VACE scribble model ({exc}). Using Sobel fallback.")
            model = None

        self._model_cache[cache_key] = model
        return model

    def _sobel_fallback(self, images: torch.Tensor, resolution: int) -> torch.Tensor:
        import torch.nn.functional as F

        img = images
        if img.dtype == torch.uint8 or img.max() > 2.0:
            img = img.float() / 255.0
        else:
            img = img.float()

        with torch.no_grad():
            gray = img.mean(dim=-1, keepdim=True)
            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            gray_n = gray.permute(0, 3, 1, 2).to(device)
            gray_n = F.interpolate(gray_n, size=(resolution, resolution), mode='bilinear', align_corners=False)

            kx = torch.tensor([[[-1., 0., 1.], [-2., 0., 2.], [-1., 0., 1.]]], device=device).unsqueeze(1)
            ky = torch.tensor([[[-1., -2., -1.], [0., 0., 0.], [1., 2., 1.]]], device=device).unsqueeze(1)

            grad_x = F.conv2d(gray_n, kx, padding=1)
            grad_y = F.conv2d(gray_n, ky, padding=1)
            mag = torch.sqrt(grad_x ** 2 + grad_y ** 2)

            max_per = mag.view(mag.shape[0], -1).max(dim=1)[0].view(-1, 1, 1, 1)
            mag = mag / (max_per + 1e-8)

            mag = F.interpolate(mag, size=(images.shape[1], images.shape[2]), mode='bilinear', align_corners=False)
            edges = (mag > EDGE_THRESHOLD_DEFAULT).float()
            # Repeat channel dimension (C=1 -> C=3) to form RGB scribble map
            scribble_maps = 1.0 - edges.repeat(1, 3, 1, 1)
            return scribble_maps.permute(0, 2, 3, 1).cpu()

    def _apply_mask_to_scribbles(self, scribble_maps: torch.Tensor, mask: torch.Tensor | None) -> torch.Tensor:
        """Apply a mask to the NHWC scribble_maps tensor.

        scribble_maps: [B, H, W, 3] float (0..1)
        mask: optional tensor; valid shapes: [B, H, W], [B, H, W, C], [1, H, W], etc.
        """
        if mask is None:
            return scribble_maps

        import torch.nn.functional as F

        scribble_maps = scribble_maps.cpu().float()
        m = mask.float()
        # Treat uint8 masks (0..255) as 0..1
        if m.dtype == torch.uint8 or (hasattr(m, 'max') and m.max() > 2.0):
            m = m / 255.0

        # Normalize mask dims: [B, H, W, 1]
        if m.ndim == 3:
            m = m.unsqueeze(-1)
        if m.ndim == 4 and m.shape[-1] > 1:
            if m.shape[-1] == 4:
                m = m[..., 3:4]
            else:
                m = m.mean(dim=-1, keepdim=True)

        # Broadcast mask over batch if needed
        if m.shape[0] == 1 and scribble_maps.shape[0] > 1:
            m = m.repeat(scribble_maps.shape[0], 1, 1, 1)

        # Resize mask to scribble shape
        single_nchw = m.permute(0, 3, 1, 2)
        if single_nchw.shape[2] != scribble_maps.shape[1] or single_nchw.shape[3] != scribble_maps.shape[2]:
            single_resized = F.interpolate(single_nchw, size=(scribble_maps.shape[1], scribble_maps.shape[2]), mode='bilinear', align_corners=False)
        else:
            single_resized = single_nchw
        mask_nhwc = single_resized.permute(0, 2, 3, 1)
        mask3 = mask_nhwc.repeat(1, 1, 1, 3).to(scribble_maps.dtype)

        return scribble_maps * mask3 + (1.0 - mask3)

    def _process_scribble(
        self,
        images: torch.Tensor,
        model,
        resolution: int,
        inference_mode: str,
        batch_size: int,
    ) -> torch.Tensor:
        total_frames = images.shape[0]
        effective_batch = batch_size if batch_size and batch_size > 0 else total_frames
        print(
            f"Processing {total_frames} frame(s) for scribble detection at resolution {resolution} "
            f"(mode={inference_mode}, chunk_size={effective_batch})"
        )

        outputs = []
        for start in range(0, total_frames, effective_batch):
            end = min(total_frames, start + effective_batch)
            chunk = images[start:end]
            if isinstance(model, torch.nn.Module):
                outputs.append(self._run_model_chunk(chunk, model, resolution))
            else:
                outputs.append(self._sobel_fallback(chunk, resolution))
        return torch.cat(outputs, dim=0)

    def _run_model_chunk(self, images: torch.Tensor, model: torch.nn.Module, resolution: int) -> torch.Tensor:
        with torch.no_grad():
            normalize_mode = getattr(model, "_sak_input_normalization", "tanh")
            inp = preprocess_scribble_input(images, resolution, normalize_mode=normalize_mode)
            device = next(model.parameters()).device
            out = model(inp.to(device))
            post_mode = getattr(model, "_sak_postprocess", "quantile")
            if post_mode == "vendor":
                scribble_maps = postprocess_vendor_scribble_output(
                    out.detach(),
                    target_hw=(images.shape[1], images.shape[2]),
                )
            else:
                scribble_maps = postprocess_scribble_output(
                    out.detach(),
                    target_hw=(images.shape[1], images.shape[2]),
                    user_threshold=EDGE_THRESHOLD_DEFAULT,
                    apply_thinning=True,
                )
            return scribble_maps

    def generate_scribble(
        self,
        images: torch.Tensor,
        style: str,
        inference_mode: str,
        resolution: int,
        model_path: str = "",
        batch_size: int = 10,
        mask: torch.Tensor | None = None,
    ) -> Tuple[torch.Tensor]:
        model = self._load_model(style, model_path, inference_mode)
        scribble_maps = self._process_scribble(images, model, resolution, inference_mode, batch_size)
        scribble_maps = scribble_maps.cpu()
        if mask is not None:
            scribble_maps = self._apply_mask_to_scribbles(scribble_maps, mask)
        print(f"✓ Generated scribble maps: shape={scribble_maps.shape}")
        return (scribble_maps,)


if __name__ == "__main__":  # pragma: no cover - manual smoke test
    print("VACE Scribble Annotator Node")
    print("For use with ComfyUI")
