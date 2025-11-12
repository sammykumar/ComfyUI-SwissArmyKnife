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
    preprocess_scribble_input,
)
from .scribble_loader import ScribbleLoaderError, get_scribble_model


class VACEScribbleAnnotator:
    """ComfyUI node for VACE scribble/edge detection."""

    _model_cache = {}

    def __init__(self):
        self.model = None
        self.current_model_path = None

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
                "edge_threshold": ("FLOAT", {
                    "default": 0.12,
                    "min": 0.0,
                    "max": 1.0,
                    "step": 0.02,
                    "tooltip": "Edge threshold / contrast factor (lower = more edges)",
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
            },
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("scribble_maps",)
    FUNCTION = "generate_scribble"
    CATEGORY = "Swiss Army Knife 🔪/VACE Annotators"

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

    def _sobel_fallback(self, images: torch.Tensor, edge_threshold: float, resolution: int) -> torch.Tensor:
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
            edges = (mag > edge_threshold).float()
            scribble_maps = 1.0 - edges.repeat(1, 1, 1, 3)
            return scribble_maps.permute(0, 2, 3, 1).cpu()

    def _process_scribble(self, images: torch.Tensor, model, edge_threshold: float, resolution: int, inference_mode: str) -> torch.Tensor:
        batch_size = images.shape[0]
        print(f"Processing {batch_size} frame(s) for scribble detection at resolution {resolution} (mode={inference_mode})")

        if isinstance(model, torch.nn.Module):
            with torch.no_grad():
                inp = preprocess_scribble_input(images, resolution)
                device = next(model.parameters()).device
                out = model(inp.to(device))
                scribble_maps = postprocess_scribble_output(
                    out.detach(),
                    target_hw=(images.shape[1], images.shape[2]),
                    user_threshold=edge_threshold,
                    apply_thinning=True,
                )
                return scribble_maps

        return self._sobel_fallback(images, edge_threshold, resolution)

    def generate_scribble(
        self,
        images: torch.Tensor,
        style: str,
        inference_mode: str,
        edge_threshold: float,
        resolution: int,
        model_path: str = "",
    ) -> Tuple[torch.Tensor]:
        model = self._load_model(style, model_path, inference_mode)
        scribble_maps = self._process_scribble(images, model, edge_threshold, resolution, inference_mode)
        print(f"✓ Generated scribble maps: shape={scribble_maps.shape}")
        return (scribble_maps,)


if __name__ == "__main__":  # pragma: no cover - manual smoke test
    print("VACE Scribble Annotator Node")
    print("For use with ComfyUI")
