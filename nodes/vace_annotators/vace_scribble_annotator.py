"""
VACE Scribble Annotator Node

Generates scribble/edge maps from images using VACE scribble models.
Supports anime-style and general edge detection.
"""

import os
import sys
import importlib
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
                    "default": 0.12,
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
        # Debug: list candidates checked
        try:
            print(f"VACE scribble: checking {len(possible_bases)} candidate base paths for style '{style}'")
        except Exception:
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

        # Attempt to load an official annotator model if the VACE-Annotators package
        # or repository code is available in Python path. We'll try several common
        # module/package names and class names used for generators.
        def _find_model_class():
            candidates = [
                'vace_annotators',
                'VACE_Annotators',
                'VACE_annotators',
                'vace.annotators',
                'scribble',
                'VACE.Annotators',
            ]
            class_names = ['NetG', 'Generator', 'ResnetGenerator', 'netG']

            for mod_name in candidates:
                try:
                    mod = importlib.import_module(mod_name)
                except Exception:
                    continue

                # Walk the module attributes to find a candidate class
                for attr_name in dir(mod):
                    if attr_name in class_names:
                        cls = getattr(mod, attr_name)
                        if isinstance(cls, type):
                            return cls

                # Also try submodules
                try:
                    for sub in getattr(mod, '__all__', []) or []:
                        try:
                            submod = importlib.import_module(f"{mod_name}.{sub}")
                        except Exception:
                            continue
                        for attr_name in dir(submod):
                            if attr_name in class_names:
                                cls = getattr(submod, attr_name)
                                if isinstance(cls, type):
                                    return cls
                except Exception:
                    pass

            return None

        model_obj = None
        model_cls = _find_model_class()
        device = 'cuda' if torch.cuda.is_available() else 'cpu'

        if model_cls is not None:
            try:
                # Instantiate with no args if possible
                model = model_cls()
                # Load checkpoint
                ckpt = torch.load(model_path, map_location='cpu')
                # Try common checkpoint key names
                if isinstance(ckpt, dict) and 'state_dict' in ckpt:
                    state = ckpt['state_dict']
                else:
                    state = ckpt

                # If state keys are prefixed (e.g. 'module.'), try to clean
                try:
                    model.load_state_dict(state)
                except RuntimeError:
                    # attempt to strip common prefixes
                    new_state = {}
                    for k, v in state.items():
                        new_k = k
                        if k.startswith('module.'):
                            new_k = k[len('module.'):]
                        new_state[new_k] = v
                    model.load_state_dict(new_state)

                model.to(device)
                model.eval()
                model_obj = model
                print(f"✓ Loaded annotator model class {model_cls.__name__} from module for style {style}")
            except Exception as e:
                print(f"Could not instantiate/load model class {model_cls}: {e}")

        # If we couldn't load an official model, fall back to a lightweight placeholder
        if model_obj is None:
            print("No VACE annotator model class found on PYTHONPATH or failed to load checkpoint.")
            print("Falling back to built-in Sobel edge detector fallback. To use the official model, install the VACE-Annotators code or add it to PYTHONPATH.")
            model_obj = {
                "type": style,
                "path": model_path,
                "loaded": False,
            }

        # Cache and return
        self._model_cache[cache_key] = model_obj
        return model_obj

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
        import torch.nn.functional as F

        batch_size = images.shape[0]
        print(f"Processing {batch_size} frame(s) for scribble detection at resolution {resolution}")

        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # Convert images from ComfyUI format [B,H,W,C] (0..1 or 0..255) to NCHW float [B,1,H,W]
        img = images
        # If images look like 0..255 ints, normalize to 0..1
        if img.dtype == torch.uint8 or img.max() > 2.0:
            img = img.float() / 255.0
        else:
            img = img.float()

        # If model is a torch module, run it; otherwise use Sobel fallback
        if isinstance(model, torch.nn.Module):
            with torch.no_grad():
                inp = F.interpolate(img.permute(0, 3, 1, 2), size=(resolution, resolution), mode='bilinear', align_corners=False)
                inp = inp.to(device)
                # Normalize to -1..1 if values in 0..1
                if inp.max() <= 1.0:
                    inp = inp * 2.0 - 1.0
                try:
                    out = model(inp)
                except Exception as e:
                    print(f"Model inference failed: {e}. Falling back to Sobel.")
                    model = None
                else:
                    # Convert output to magnitude in 0..1
                    if isinstance(out, tuple) or isinstance(out, list):
                        out = out[0]
                    # Ensure out is on CPU
                    out = out.detach().cpu()
                    # If out is multi-channel, reduce to single channel
                    if out.ndim == 4 and out.shape[1] > 1:
                        mag = out.abs().mean(dim=1, keepdim=True)
                    elif out.ndim == 4:
                        mag = out.abs()
                    else:
                        mag = out.unsqueeze(1).abs()

                    # Map from [-1,1] -> [0,1] if necessary
                    if mag.max() > 1.1:
                        # assume already in 0..255 or large range; normalize
                        mag = mag / (mag.max() + 1e-8)
                    elif mag.min() < -0.5:
                        mag = (mag + 1.0) / 2.0

                    # Resize back to input resolution
                    mag = F.interpolate(mag, size=(images.shape[1], images.shape[2]), mode='bilinear', align_corners=False)
                    # Apply threshold
                    edges = (mag > edge_threshold).float()
                    scribble_maps = 1.0 - edges.repeat(1, 1, 1, 3)
                    # Convert from NCHW back to NHWC
                    scribble_maps = scribble_maps.permute(0, 2, 3, 1).cpu()
                    return scribble_maps

        # Sobel fallback
        with torch.no_grad():
            gray = img.mean(dim=-1, keepdim=True)  # [B,H,W,1]
            # to NCHW
            gray_n = gray.permute(0, 3, 1, 2).to(device)
            gray_n = F.interpolate(gray_n, size=(resolution, resolution), mode='bilinear', align_corners=False)

            # Sobel kernels
            kx = torch.tensor([[[ -1., 0., 1.], [ -2., 0., 2.], [ -1., 0., 1.]]], device=device)
            ky = torch.tensor([[[ -1., -2., -1.], [0., 0., 0.], [1., 2., 1.]]], device=device)
            kx = kx.unsqueeze(1)  # [1,1,3,3]
            ky = ky.unsqueeze(1)

            grad_x = F.conv2d(gray_n, kx, padding=1)
            grad_y = F.conv2d(gray_n, ky, padding=1)
            mag = torch.sqrt(grad_x ** 2 + grad_y ** 2)

            # Normalize per image
            max_per = mag.view(mag.shape[0], -1).max(dim=1)[0].view(-1, 1, 1, 1)
            mag = mag / (max_per + 1e-8)

            # Resize back to original
            mag = F.interpolate(mag, size=(images.shape[1], images.shape[2]), mode='bilinear', align_corners=False)

            edges = (mag > edge_threshold).float()
            scribble_maps = 1.0 - edges.repeat(1, 1, 1, 3)
            scribble_maps = scribble_maps.permute(0, 2, 3, 1).cpu()
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
