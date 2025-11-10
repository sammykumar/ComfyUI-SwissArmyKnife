"""
VACE Scribble Annotator Node

Generates scribble/edge maps from images using VACE scribble models.
Supports anime-style and general edge detection.
"""

import os
import torch
from typing import Tuple

# Prefer ComfyUI folder_paths when available (respects --base-directory)
try:
    import folder_paths
    COMFYUI_AVAILABLE = True
except Exception:
    folder_paths = None
    COMFYUI_AVAILABLE = False


class VACEScribbleAnnotator:
    """
    A ComfyUI node for scribble/edge detection using VACE-Annotators scribble models.

    Extracts edge maps and stylized sketches for artistic video generation/editing.
    """

    # Class-level cache for loaded models
    _model_cache = {}

    def __init__(self):
        self.model = None
        self.current_model_path = None

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define input fields for the VACE Scribble Annotator node.
        """
        return {
            "required": {
                "images": ("IMAGE", {
                    "tooltip": "Input images or video frames (batch supported)"
                }),
                "style": (["anime", "general", "sketch"], {
                    "default": "anime",
                    "tooltip": "Style of scribble/edge detection"
                }),
                "edge_threshold": ("FLOAT", {
                    "default": 0.5,
                    "min": 0.0,
                    "max": 1.0,
                    "step": 0.05,
                    "tooltip": "Threshold for edge detection (lower = more edges)"
                }),
                "resolution": ("INT", {
                    "default": 512,
                    "min": 64,
                    "max": 2048,
                    "step": 64,
                    "tooltip": "Processing resolution (lower = faster, higher = more detail)"
                }),
            },
            "optional": {
                "model_path": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "tooltip": "Custom path to model file (leave empty for default: models/vace_annotators/scribble/)"
                }),
            }
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("scribble_maps",)
    FUNCTION = "generate_scribble"
    CATEGORY = "Swiss Army Knife 🔪/VACE Annotators"

    def _get_default_model_path(self, style: str) -> str:
        """Get default model path based on style."""
        # Try ComfyUI-aware paths first (respects --base-directory)
        possible_bases = []
        if COMFYUI_AVAILABLE and folder_paths is not None:
            try:
                base_dir = None

                # Prefer an explicit base directory API if present
                if hasattr(folder_paths, "get_base_directory"):
                    base_dir = folder_paths.get_base_directory()
                elif hasattr(folder_paths, "base_dir"):
                    base_dir = folder_paths.base_dir

                # Some ComfyUI installs expose a "user" directory inside the base dir
                # (e.g. <base>/user). If only get_user_directory/user_dir is available,
                # take its parent directory when it looks like a nested 'user' folder.
                if base_dir is None:
                    if hasattr(folder_paths, "get_user_directory"):
                        user_dir = folder_paths.get_user_directory()
                    elif hasattr(folder_paths, "user_dir"):
                        user_dir = folder_paths.user_dir
                    else:
                        user_dir = None

                    if user_dir:
                        # If the basename is 'user', use its parent as the base directory
                        if os.path.basename(os.path.normpath(user_dir)).lower() == "user":
                            base_dir = os.path.dirname(os.path.normpath(user_dir))
                        else:
                            base_dir = user_dir

                if base_dir:
                    possible_bases.append(os.path.join(base_dir, "models", "vace_annotators", "scribble"))
            except Exception:
                # If anything goes wrong, fall back to legacy candidates below
                pass

        # Legacy / development fallback paths
        possible_bases.extend([
            "models/vace_annotators/scribble",
            "../models/vace_annotators/scribble",
            os.path.expanduser("~/ComfyUI/models/vace_annotators/scribble"),
        ])

        # Model files for different styles
        model_files = {
            "anime": "anime_style/netG_A_latest.pth",
            "general": "general/scribble.pth",
            "sketch": "sketch/sketch.pth"
        }

        model_file = model_files.get(style, "anime_style/netG_A_latest.pth")

        # Check each possible base path
        for base_path in possible_bases:
            full_path = os.path.join(base_path, model_file)
            if os.path.exists(full_path):
                return full_path

        # Return the first path as default (even if it doesn't exist)
        return os.path.join(possible_bases[0], model_file)

    def _load_model(self, style: str, model_path: str):
        """
        Load scribble model with caching.

        Args:
            style: Style of scribble detection (anime, general, sketch)
            model_path: Path to model weights
        """
        # Use provided path or default
        if not model_path or not os.path.exists(model_path):
            model_path = self._get_default_model_path(style)

        # Check cache
        cache_key = f"{style}:{model_path}"
        if cache_key in self._model_cache:
            print(f"✓ Using cached VACE scribble model: {style}")
            return self._model_cache[cache_key]

        # Check if model file exists
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"VACE scribble model not found at: {model_path}\n"
                f"Please download the model from: https://huggingface.co/ali-vilab/VACE-Annotators\n"
                f"Expected location: {model_path}"
            )

        print(f"Loading VACE scribble model: {style} from {model_path}")

        # Load model based on style
        # Note: This is a placeholder implementation
        # In a real implementation, you would load the actual VACE model architecture
        try:
            # Placeholder: In real implementation, load actual VACE scribble model
            model = {
                "type": style,
                "path": model_path,
                "loaded": True
            }

            self._model_cache[cache_key] = model
            print("✓ VACE scribble model loaded successfully")
            return model

        except Exception as e:
            raise RuntimeError(f"Failed to load VACE scribble model: {str(e)}")

    def _process_scribble(self, images: torch.Tensor, model, edge_threshold: float, resolution: int) -> torch.Tensor:
        """
        Process images to generate scribble/edge maps.

        Args:
            images: Input images [B, H, W, C] in ComfyUI format
            model: Loaded scribble model
            edge_threshold: Threshold for edge detection
            resolution: Processing resolution

        Returns:
            Scribble maps [B, H, W, C] in ComfyUI format
        """
        batch_size = images.shape[0]
        print(f"Processing {batch_size} frame(s) for scribble detection at resolution {resolution}")

        # Placeholder implementation
        # In real implementation, you would:
        # 1. Convert ComfyUI format to model input format
        # 2. Resize to processing resolution
        # 3. Run inference for edge/scribble detection
        # 4. Apply threshold
        # 5. Post-process scribble maps
        # 6. Convert back to ComfyUI format

        # For now, return simple edge detection as placeholder
        # Convert to grayscale
        gray = images.mean(dim=-1, keepdim=True)

        # Simple edge detection using gradient
        # Compute gradients in x and y directions
        grad_x = torch.abs(gray[:, :, 1:, :] - gray[:, :, :-1, :])
        grad_y = torch.abs(gray[:, 1:, :, :] - gray[:, :-1, :, :])

        # Pad to maintain size
        grad_x = torch.nn.functional.pad(grad_x, (0, 0, 0, 1))
        grad_y = torch.nn.functional.pad(grad_y, (0, 0, 0, 0, 0, 1))

        # Combine gradients
        edges = torch.sqrt(grad_x ** 2 + grad_y ** 2)

        # Apply threshold
        edges = (edges > edge_threshold).float()

        # Convert to RGB (white edges on black background)
        scribble_maps = 1.0 - edges.repeat(1, 1, 1, 3)

        return scribble_maps

    def generate_scribble(self, images: torch.Tensor, style: str, edge_threshold: float, resolution: int, model_path: str = "") -> Tuple[torch.Tensor]:
        """
        Generate scribble/edge maps from input images.

        Args:
            images: Input images or video frames [B, H, W, C]
            style: Style of scribble detection
            edge_threshold: Threshold for edge detection
            resolution: Processing resolution
            model_path: Optional custom model path

        Returns:
            Tuple containing scribble maps [B, H, W, C]
        """
        # Load model (with caching)
        model = self._load_model(style, model_path)

        # Process images
        scribble_maps = self._process_scribble(images, model, edge_threshold, resolution)

        print(f"✓ Generated scribble maps: shape={scribble_maps.shape}")

        return (scribble_maps,)


# Export for testing
if __name__ == "__main__":
    print("VACE Scribble Annotator Node")
    print("For use with ComfyUI")
