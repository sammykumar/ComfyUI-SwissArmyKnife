"""
ND Super LoRA Loader Node - Main implementation
"""

from typing import Union, Dict, Any, Tuple, List
import json

# Import ComfyUI modules with fallbacks
try:
    import folder_paths
    from nodes import LoraLoader
    COMFYUI_AVAILABLE = True
except ImportError:
    print("ND Super Nodes: ComfyUI modules not available (this is normal during development)")
    folder_paths = None
    LoraLoader = None
    COMFYUI_AVAILABLE = False

# Import local modules
try:
    from .lora_utils import get_lora_by_filename, extract_trigger_words
    from .civitai_service import CivitAiService, get_civitai_service
except ImportError:
    # Fallback for development/testing
    import sys
    import os
    sys.path.append(os.path.dirname(__file__))
    from lora_utils import get_lora_by_filename


class SuperDualLoraLoader:
    """
    SuperDualLoraLoader (WanVideoWrapper) - A powerful node for loading multiple LoRAs with advanced features.
    
    Features:
    - Multiple LoRA loading in a single node
    - Separate high noise and low noise model support
    - Individual enable/disable controls
    - Dual strength support (model/clip)
    - Automatic trigger word extraction
    - Tag-based organization
    - Template save/load system
    """

    CATEGORY = "Swiss Army Knife 🔪"
    RETURN_TYPES = ("WANVIDLORA", "WANVIDLORA", "CLIP", "STRING")
    RETURN_NAMES = ("high_noise_lora", "low_noise_lora", "CLIP", "TRIGGER_WORDS")
    FUNCTION = "load_loras"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "high_noise_lora": ("WANVIDLORA",{
                    "tooltip": "LoRA stack for high noise model from WanVideo Lora Select or compatible nodes"
             }),
                "low_noise_lora": ("WANVIDLORA",{
                    "tooltip": "LoRA stack for low noise model from WanVideo Lora Select or compatible nodes"
             }),
            },
            "optional": {
                "clip": ("CLIP",),
                # Frontend will provide a JSON array of lora configs here
                "lora_bundle": ("STRING",),
            },
            "hidden": {}
        }

    def load_loras(self, high_noise_lora, low_noise_lora, clip=None, lora_bundle: Union[str, None] = None, **kwargs) -> Tuple[Any, Any, Any, str]:
        """
        Load multiple LoRAs from provided bundle and return modified high noise model, low noise model, clip, and trigger words.
        """
        if not COMFYUI_AVAILABLE:
            print("Super LoRA Loader: ComfyUI not available, cannot load LoRAs")
            return (high_noise_lora, low_noise_lora, clip, "")  # Return models unchanged

        trigger_words: List[str] = []
        current_high_noise_model = high_noise_lora
        current_low_noise_model = low_noise_lora
        current_clip = clip

        if current_high_noise_model is None and current_low_noise_model is None:
            print("Super LoRA Loader: No models provided; returning unchanged")
            return (None, None, current_clip, "")

        print("--- Super LoRA Loader Backend ---")
        print(f"Received lora_bundle length: {len(lora_bundle) if isinstance(lora_bundle, str) else 'None'}")

        # Parse lora configs from the bundle (JSON array)
        lora_configs: List[Dict[str, Any]] = []
        if isinstance(lora_bundle, str) and lora_bundle.strip():
            try:
                parsed = json.loads(lora_bundle)
                if isinstance(parsed, list):
                    lora_configs = parsed
                else:
                    print("Super LoRA Loader: lora_bundle is not a list; ignoring")
            except json.JSONDecodeError as e:
                print(f"Super LoRA Loader: Failed to parse lora_bundle JSON: {e}")
        else:
            # Fallback: try kwargs (legacy/testing paths like lora_1,...)
            for key, val in kwargs.items():
                if key.lower().startswith("lora_") and isinstance(val, dict):
                    lora_configs.append(val)

        print(f"Super LoRA Loader: Parsed {len(lora_configs)} lora configs")

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

            # Determine which model(s) to apply to (default: both)
            model_type = value.get('modelType', 'both')  # 'high', 'low', or 'both'

            # Respect missing clip
            if current_clip is None:
                if strength_clip != 0:
                    print(f"Super LoRA Loader: Warning - CLIP strength provided without CLIP; ignoring for '{lora_name}'")
                strength_clip = 0

            # Apply lora only if any strength is non-zero
            if (strength_model != 0 or strength_clip != 0) and LoraLoader is not None:
                try:
                    lora_path = get_lora_by_filename(lora_name)
                    if lora_path:
                        # Apply to high noise model
                        if (model_type in ['high', 'both']) and current_high_noise_model is not None:
                            current_high_noise_model, current_clip = LoraLoader().load_lora(
                                current_high_noise_model,
                                current_clip,
                                lora_path,
                                strength_model,
                                strength_clip
                            )
                            print(f"Super LoRA Loader: Loaded '{lora_name}' to HIGH noise model {strength_model}/{strength_clip}")

                        # Apply to low noise model
                        if (model_type in ['low', 'both']) and current_low_noise_model is not None:
                            current_low_noise_model, current_clip = LoraLoader().load_lora(
                                current_low_noise_model,
                                current_clip,
                                lora_path,
                                strength_model,
                                strength_clip
                            )
                            print(f"Super LoRA Loader: Loaded '{lora_name}' to LOW noise model {strength_model}/{strength_clip}")
                    else:
                        print(f"Super LoRA Loader: Could not resolve LoRA file for '{lora_name}'")
                except Exception as e:
                    print(f"Super LoRA Loader: Error loading LoRA '{lora_name}': {e}")
                    # Continue to collect trigger words even if load failed

            # Collect trigger words (from enabled lorAs)
            tw = (value.get('triggerWords') or value.get('triggerWord') or '').strip()
            if tw:
                trigger_words.append(tw)
                print(f"Super LoRA Loader: + trigger '{tw}'")

        combined_trigger_words = ", ".join(trigger_words) if trigger_words else ""
        print(f"Returning trigger words: '{combined_trigger_words}'")
        print("---------------------------------")

        return (current_high_noise_model, current_low_noise_model, current_clip, combined_trigger_words)


class SuperLoraLoader:
    """
    SuperLoraLoader - A powerful node for loading multiple LoRAs with advanced features.
    Single-stream version for standard workflows using WanVideo LoRA stack.
    
    Features:
    - Multiple LoRA loading in a single node
    - Individual enable/disable controls
    - Dual strength support (model/clip)
    - Automatic trigger word extraction
    - Tag-based organization
    - Template save/load system
    """

    CATEGORY = "Swiss Army Knife 🔪"
    RETURN_TYPES = ("WANVIDLORA", "CLIP", "STRING")
    RETURN_NAMES = ("WANVIDLORA", "CLIP", "TRIGGER_WORDS")
    FUNCTION = "load_loras"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "lora": ("WANVIDLORA",{
                    "tooltip": "LoRA stack from WanVideo Lora Select or compatible nodes"
                }),
            },
            "optional": {
                "clip": ("CLIP",),
                # Frontend will provide a JSON array of lora configs here
                "lora_bundle": ("STRING",),
            },
            "hidden": {}
        }

    def load_loras(self, lora, clip=None, lora_bundle: Union[str, None] = None, **kwargs) -> Tuple[Any, Any, str]:
        """
        Load multiple LoRAs from provided bundle and return modified lora model, clip, and trigger words.
        """
        if not COMFYUI_AVAILABLE:
            print("Super LoRA Loader: ComfyUI not available, cannot load LoRAs")
            return (lora, clip, "")  # Return lora unchanged

        trigger_words: List[str] = []
        current_model = lora
        current_clip = clip

        if current_model is None:
            print("Super LoRA Loader: No model provided; returning unchanged")
            return (None, current_clip, "")

        print("--- Super LoRA Loader (Single Stream) Backend ---")
        print(f"Received lora_bundle length: {len(lora_bundle) if isinstance(lora_bundle, str) else 'None'}")

        # Parse lora configs from the bundle (JSON array)
        lora_configs: List[Dict[str, Any]] = []
        if isinstance(lora_bundle, str) and lora_bundle.strip():
            try:
                parsed = json.loads(lora_bundle)
                if isinstance(parsed, list):
                    lora_configs = parsed
                else:
                    print("Super LoRA Loader: lora_bundle is not a list; ignoring")
            except json.JSONDecodeError as e:
                print(f"Super LoRA Loader: Failed to parse lora_bundle JSON: {e}")
        else:
            # Fallback: try kwargs (legacy/testing paths like lora_1,...)
            for key, val in kwargs.items():
                if key.lower().startswith("lora_") and isinstance(val, dict):
                    lora_configs.append(val)

        print(f"Super LoRA Loader: Parsed {len(lora_configs)} lora configs")

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

            # Respect missing clip
            if current_clip is None:
                if strength_clip != 0:
                    print(f"Super LoRA Loader: Warning - CLIP strength provided without CLIP; ignoring for '{lora_name}'")
                strength_clip = 0

            # Apply lora only if any strength is non-zero
            if (strength_model != 0 or strength_clip != 0) and LoraLoader is not None:
                try:
                    lora_path = get_lora_by_filename(lora_name)
                    if lora_path:
                        current_model, current_clip = LoraLoader().load_lora(
                            current_model,
                            current_clip,
                            lora_path,
                            strength_model,
                            strength_clip
                        )
                        print(f"Super LoRA Loader: Loaded '{lora_name}' {strength_model}/{strength_clip}")
                    else:
                        print(f"Super LoRA Loader: Could not resolve LoRA file for '{lora_name}'")
                except Exception as e:
                    print(f"Super LoRA Loader: Error loading LoRA '{lora_name}': {e}")
                    # Continue to collect trigger words even if load failed

            # Collect trigger words (from enabled lorAs)
            tw = (value.get('triggerWords') or value.get('triggerWord') or '').strip()
            if tw:
                trigger_words.append(tw)
                print(f"Super LoRA Loader: + trigger '{tw}'")

        combined_trigger_words = ", ".join(trigger_words) if trigger_words else ""
        print(f"Returning trigger words: '{combined_trigger_words}'")
        print("---------------------------------")

        return (current_model, current_clip, combined_trigger_words)



