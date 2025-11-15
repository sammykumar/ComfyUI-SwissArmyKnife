"""
ND Super LoRA Loader Node - Main implementation
"""

from typing import Union, Dict, Any, Tuple, List
import json

try:
    import folder_paths
    from nodes import LoraLoader
    COMFYUI_AVAILABLE = True
except ImportError:
    print("ND Super Nodes: ComfyUI modules not available (this is normal during development)")
    folder_paths = None
    LoraLoader = None
    COMFYUI_AVAILABLE = False

try:
    from .lora_utils import get_lora_by_filename
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(__file__))
    from lora_utils import get_lora_by_filename


class SuperDualLoraLoader:
    CATEGORY = "Swiss Army Knife 🔪"
    RETURN_TYPES = ("WANVIDLORA", "WANVIDLORA", "CLIP", "STRING")
    RETURN_NAMES = ("high_noise_lora", "low_noise_lora", "CLIP", "TRIGGER_WORDS")
    FUNCTION = "load_loras"
    DESCRIPTION = (
        "Consumes Wan high/low noise LoRA stacks plus a JSON bundle, applies enabled LoRAs with per-entry strengths, and emits updated models."
    )

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "high_noise_lora": ("WANVIDLORA", {"tooltip": "LoRA stack for high noise model from WanVideo Lora Select or compatible nodes"}),
                "low_noise_lora": ("WANVIDLORA", {"tooltip": "LoRA stack for low noise model from WanVideo Lora Select or compatible nodes"}),
            },
            "optional": {
                "clip": ("CLIP",),
                "lora_bundle": ("STRING",),
            },
            "hidden": {}
        }

    def load_loras(self, high_noise_lora, low_noise_lora, clip=None, lora_bundle: Union[str, None] = None, **kwargs) -> Tuple[Any, Any, Any, str]:
        if not COMFYUI_AVAILABLE:
            print("Super LoRA Loader: ComfyUI not available, cannot load LoRAs")
            return (high_noise_lora, low_noise_lora, clip, "")

        trigger_words: List[str] = []
        current_high_noise_model = high_noise_lora
        current_low_noise_model = low_noise_lora
        current_clip = clip

        if current_high_noise_model is None and current_low_noise_model is None:
            print("Super LoRA Loader: No models provided; returning unchanged")
            return (None, None, current_clip, "")

        lora_configs: List[Dict[str, Any]] = []
        if isinstance(lora_bundle, str) and lora_bundle.strip():
            try:
                parsed = json.loads(lora_bundle)
                if isinstance(parsed, list):
                    lora_configs = parsed
            except json.JSONDecodeError as e:
                print(f"Super LoRA Loader: Failed to parse lora_bundle JSON: {e}")
        else:
            for key, val in kwargs.items():
                if key.lower().startswith("lora_") and isinstance(val, dict):
                    lora_configs.append(val)

        for value in lora_configs:
            if not isinstance(value, dict):
                continue
            enabled = bool(value.get('enabled', value.get('on', False)))
            if not enabled:
                continue
            lora_name = value.get('lora', 'None')
            if not lora_name or lora_name == "None":
                continue
            strength_model = float(value.get('strength', 1.0))
            strength_clip = float(value.get('strengthClip', value.get('strengthTwo', strength_model)))
            model_type = value.get('modelType', 'both')
            if current_clip is None:
                if strength_clip != 0:
                    print(f"Super LoRA Loader: Warning - CLIP strength provided without CLIP; ignoring for '{lora_name}'")
                strength_clip = 0
            if (strength_model != 0 or strength_clip != 0) and LoraLoader is not None:
                try:
                    lora_path = get_lora_by_filename(lora_name)
                    if lora_path:
                        if (model_type in ['high', 'both']) and current_high_noise_model is not None:
                            current_high_noise_model, current_clip = LoraLoader().load_lora(current_high_noise_model, current_clip, lora_path, strength_model, strength_clip)
                        if (model_type in ['low', 'both']) and current_low_noise_model is not None:
                            current_low_noise_model, current_clip = LoraLoader().load_lora(current_low_noise_model, current_clip, lora_path, strength_model, strength_clip)
                except Exception as e:
                    print(f"Super LoRA Loader: Error loading LoRA '{lora_name}': {e}")
            tw = (value.get('triggerWords') or value.get('triggerWord') or '').strip()
            if tw:
                trigger_words.append(tw)

        combined_trigger_words = ", ".join(trigger_words) if trigger_words else ""
        return (current_high_noise_model, current_low_noise_model, current_clip, combined_trigger_words)


class SuperLoraLoader:
    CATEGORY = "Swiss Army Knife 🔪"
    RETURN_TYPES = ("WANVIDLORA", "CLIP", "STRING")
    RETURN_NAMES = ("WANVIDLORA", "CLIP", "TRIGGER_WORDS")
    FUNCTION = "load_loras"
    DESCRIPTION = (
        "Single-stream LoRA loader that parses template bundles, applies each enabled LoRA to the provided model/CLIP combo, and returns the updated stack plus collected trigger words."
    )
