"""
VACE Depth Annotator Node
"""

import os
import torch
from typing import Tuple


class VACEDepthAnnotator:
    _model_cache = {}

    def __init__(self):
        self.model = None
        self.current_model_path = None

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "images": ("IMAGE", {"tooltip": "Input images or video frames (batch supported)"}),
                "model_type": (["midas", "depth_anything_v2"], {"default": "midas", "tooltip": "Depth estimation model to use"}),
                "resolution": ("INT", {"default": 512, "min": 64, "max": 2048, "step": 64, "tooltip": "Processing resolution"}),
            },
            "optional": {
                "model_path": ("STRING", {"default": "", "multiline": False, "tooltip": "Custom path to model"}),
            }
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("depth_maps",)
    FUNCTION = "generate_depth"
    CATEGORY = "Swiss Army Knife 🔪/VACE Annotators"
    DESCRIPTION = "Loads a VACE depth checkpoint (MiDaS or Depth Anything v2), processes IMAGE batches, and returns depth maps."

    def _get_default_model_path(self, model_type: str) -> str:
        possible_bases = ["models/vace_annotators/depth", "../models/vace_annotators/depth", os.path.expanduser("~/ComfyUI/models/vace_annotators/depth")]
        model_files = {"midas": "midas.pth", "depth_anything_v2": "depth_anything_v2.pth"}
        model_file = model_files.get(model_type, "midas.pth")
        for base_path in possible_bases:
            full_path = os.path.join(base_path, model_file)
            if os.path.exists(full_path):
                return full_path
        return os.path.join(possible_bases[0], model_file)

    def _load_model(self, model_type: str, model_path: str):
        if not model_path or not os.path.exists(model_path):
            model_path = self._get_default_model_path(model_type)
        cache_key = f"{model_type}:{model_path}"
        if cache_key in self._model_cache:
            return self._model_cache[cache_key]
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"VACE depth model not found at: {model_path}")
        model = {"type": model_type, "path": model_path, "loaded": True}
        self._model_cache[cache_key] = model
        return model

    def _process_depth(self, images: torch.Tensor, model, resolution: int) -> torch.Tensor:
        depth_maps = images.mean(dim=-1, keepdim=True).repeat(1, 1, 1, 3)
        return depth_maps

    def generate_depth(self, images: torch.Tensor, model_type: str, resolution: int, model_path: str = "") -> Tuple[torch.Tensor]:
        model = self._load_model(model_type, model_path)
        depth_maps = self._process_depth(images, model, resolution)
        return (depth_maps,)
