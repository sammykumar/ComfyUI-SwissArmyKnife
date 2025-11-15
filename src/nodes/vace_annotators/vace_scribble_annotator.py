"""
VACE Scribble Annotator Node
"""

from __future__ import annotations

import os
from typing import Tuple

import torch

try:
    import folder_paths
    COMFYUI_AVAILABLE = True
except Exception:
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
    _model_cache = {}

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "images": ("IMAGE", {"tooltip": "Input images or video frames (batch supported)"}),
                "style": (["anime", "general", "sketch"], {"default": "anime", "tooltip": "Style"}),
                "inference_mode": (["auto", "model", "fallback"], {"default": "auto", "tooltip": "Mode"}),
                "resolution": ("INT", {"default": 512, "min": 64, "max": 2048, "step": 64}),
                "edge_threshold": ("FLOAT", {"default": EDGE_THRESHOLD_DEFAULT, "min": 0.0, "max": 1.0, "step": 0.01}),
            },
            "optional": {
                "model_path": ("STRING", {"default": "", "multiline": False}),
                "batch_size": ("INT", {"default": 0, "min": 0, "max": 128}),
            },
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("scribble_maps",)
    FUNCTION = "generate_scribble"
    CATEGORY = "Swiss Army Knife 🔪/VACE Annotators"
    DESCRIPTION = "Runs the VACE scribble models or Sobel fallback to convert IMAGE batches into scribble maps."

    def _get_default_model_path(self, style: str) -> str:
        possible_bases = []
        try:
            if COMFYUI_AVAILABLE and folder_paths is not None:
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
        possible_bases.extend(["models/vace_annotators/scribble", "../models/vace_annotators/scribble", os.path.expanduser("~/ComfyUI/models/vace_annotators/scribble")])
        model_files = {"anime": "anime_style/netG_A_latest.pth", "general": "general/scribble.pth", "sketch": "sketch/sketch.pth"}
        model_file = model_files.get(style, "anime_style/netG_A_latest.pth")
        for base_path in possible_bases:
            full_path = os.path.join(base_path, model_file)
            if os.path.exists(full_path):
                return full_path
        return os.path.join(possible_bases[0], model_file)

    def _load_model(self, style: str, model_path: str, inference_mode: str):
        if inference_mode == "fallback":
            return None
        resolved_path = model_path or self._get_default_model_path(style)
        if not os.path.exists(resolved_path):
            if inference_mode == "model":
                raise FileNotFoundError(f"VACE scribble checkpoint missing for style '{style}' at {resolved_path}")
            return None
        cache_key = f"{style}:{resolved_path}"
        if cache_key in self._model_cache:
            return self._model_cache[cache_key]
        try:
            model = get_scribble_model(style, resolved_path)
        except ScribbleLoaderError:
            if inference_mode == "model":
                raise
            model = None
        self._model_cache[cache_key] = model
        return model

    def _sobel_fallback(self, images: torch.Tensor, resolution: int, edge_threshold: float) -> torch.Tensor:
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
            scribble_maps = 1.0 - edges.repeat(1, 3, 1, 1)
            return scribble_maps.permute(0, 2, 3, 1).cpu()

    def _process_scribble(self, images: torch.Tensor, model, resolution: int, inference_mode: str, batch_size: int, edge_threshold: float) -> torch.Tensor:
        total_frames = images.shape[0]
        effective_batch = batch_size if batch_size and batch_size > 0 else total_frames
        outputs = []
        for start in range(0, total_frames, effective_batch):
            end = min(total_frames, start + effective_batch)
            chunk = images[start:end]
            if isinstance(model, torch.nn.Module):
                outputs.append(self._run_model_chunk(chunk, model, resolution, edge_threshold))
            else:
                outputs.append(self._sobel_fallback(chunk, resolution, edge_threshold))
        return torch.cat(outputs, dim=0)

    def _run_model_chunk(self, images: torch.Tensor, model: torch.nn.Module, resolution: int, edge_threshold: float) -> torch.Tensor:
        with torch.no_grad():
            normalize_mode = getattr(model, "_sak_input_normalization", "tanh")
            inp = preprocess_scribble_input(images, resolution, normalize_mode=normalize_mode)
            device = next(model.parameters()).device
            out = model(inp.to(device))
            post_mode = getattr(model, "_sak_postprocess", "quantile")
            if post_mode == "vendor":
                scribble_maps = postprocess_vendor_scribble_output(out.detach(), target_hw=(images.shape[1], images.shape[2]))
            else:
                scribble_maps = postprocess_scribble_output(out.detach(), target_hw=(images.shape[1], images.shape[2]), user_threshold=edge_threshold, apply_thinning=True)
            return scribble_maps

    def generate_scribble(self, images: torch.Tensor, style: str, inference_mode: str, resolution: int, edge_threshold: float = EDGE_THRESHOLD_DEFAULT, model_path: str = "", batch_size: int = 10) -> Tuple[torch.Tensor]:
        edge_threshold = float(max(0.0, min(1.0, edge_threshold)))
        model = self._load_model(style, model_path, inference_mode)
        scribble_maps = self._process_scribble(images, model, resolution, inference_mode, batch_size, edge_threshold)
        return (scribble_maps,)

if __name__ == "__main__":
    print("VACE Scribble Annotator Node")
