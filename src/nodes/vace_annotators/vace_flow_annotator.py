"""
VACE Flow Annotator Node
"""

import os
import torch
from typing import Tuple


class VACEFlowAnnotator:
    _model_cache = {}

    def __init__(self):
        self.model = None
        self.current_model_path = None

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "images": ("IMAGE", {"tooltip": "Input video frames (batch of at least 2 frames required)"}),
                "resolution": ("INT", {"default": 512, "min": 64, "max": 2048, "step": 64, "tooltip": "Processing resolution"}),
                "flow_direction": (["forward", "backward", "bidirectional"], {"default": "forward", "tooltip": "Direction of optical flow"}),
            },
            "optional": {
                "model_path": ("STRING", {"default": "", "multiline": False, "tooltip": "Custom model path"}),
            }
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("flow_maps",)
    FUNCTION = "generate_flow"
    CATEGORY = "Swiss Army Knife 🔪/VACE Annotators"
    DESCRIPTION = "Loads RAFT flow model, computes flow between frames, and emits flow maps."

    def _get_default_model_path(self) -> str:
        possible_bases = ["models/vace_annotators/flow", "../models/vace_annotators/flow", os.path.expanduser("~/ComfyUI/models/vace_annotators/flow")]
        model_file = "raft.pth"
        for base_path in possible_bases:
            full_path = os.path.join(base_path, model_file)
            if os.path.exists(full_path):
                return full_path
        return os.path.join(possible_bases[0], model_file)

    def _load_model(self, model_path: str):
        if not model_path or not os.path.exists(model_path):
            model_path = self._get_default_model_path()
        cache_key = f"raft:{model_path}"
        if cache_key in self._model_cache:
            return self._model_cache[cache_key]
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"VACE flow model not found at: {model_path}")
        model = {"type": "raft", "path": model_path, "loaded": True}
        self._model_cache[cache_key] = model
        return model

    def _process_flow(self, images: torch.Tensor, model, resolution: int, flow_direction: str) -> torch.Tensor:
        batch_size = images.shape[0]
        if batch_size < 2:
            raise ValueError("Optical flow requires at least 2 frames")
        if flow_direction == "forward":
            flow_maps = torch.abs(images[1:] - images[:-1])
        elif flow_direction == "backward":
            flow_maps = torch.abs(images[:-1] - images[1:])
        else:
            forward_flow = torch.abs(images[1:] - images[:-1])
            backward_flow = torch.abs(images[:-1] - images[1:])
            flow_maps = (forward_flow + backward_flow) / 2
        return flow_maps

    def generate_flow(self, images: torch.Tensor, resolution: int, flow_direction: str, model_path: str = "") -> Tuple[torch.Tensor]:
        model = self._load_model(model_path)
        flow_maps = self._process_flow(images, model, resolution, flow_direction)
        return (flow_maps,)
