"""
Vendored scribble generator helpers derived from ali-vilab/VACE-Annotators.

The upstream project is licensed under Apache-2.0 and publishes the
pretrained scribble (edge) annotator checkpoints used by VACE. This file
provides a minimal ResNet-style generator plus preprocessing and
postprocessing helpers so we can run the checkpoints without requiring the
full repository to be installed inside ComfyUI.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Optional, Tuple

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

try:
    from skimage.morphology import thin as skimage_thin  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    skimage_thin = None


@dataclass(frozen=True)
class ScribbleStyleConfig:
    """Configuration used to build a generator per scribble style."""

    name: str
    input_nc: int = 3
    output_nc: int = 1
    ngf: int = 64
    n_blocks: int = 9
    use_dropout: bool = False


# Default style configs. Values are based on the upstream repo where all
# scribble checkpoints use the same generator topology but different weights.
STYLE_CONFIGS: Dict[str, ScribbleStyleConfig] = {
    "anime": ScribbleStyleConfig(name="anime"),
    "general": ScribbleStyleConfig(name="general"),
    "sketch": ScribbleStyleConfig(name="sketch"),
}


def _get_norm_layer(norm_type: str = "instance"):
    if norm_type == "batch":
        return nn.BatchNorm2d
    if norm_type == "instance":
        return nn.InstanceNorm2d
    raise ValueError(f"Unsupported norm layer: {norm_type}")


class ResnetBlock(nn.Module):
    """Standard ResNet block used in many image-to-image models."""

    def __init__(self, dim: int, norm_layer=nn.InstanceNorm2d, use_dropout: bool = False):
        super().__init__()
        self.conv_block = self.build_conv_block(dim, norm_layer, use_dropout)

    @staticmethod
    def build_conv_block(dim, norm_layer, use_dropout):
        block = []
        block += [
            nn.ReflectionPad2d(1),
            nn.Conv2d(dim, dim, kernel_size=3, bias=False),
            norm_layer(dim),
            nn.ReLU(True),
        ]
        if use_dropout:
            block.append(nn.Dropout(0.5))
        block += [
            nn.ReflectionPad2d(1),
            nn.Conv2d(dim, dim, kernel_size=3, bias=False),
            norm_layer(dim),
        ]
        return nn.Sequential(*block)

    def forward(self, x):
        return x + self.conv_block(x)


class ResnetGenerator(nn.Module):
    """
    Minimal ResNet-based generator (mirrors CycleGAN/pix2pixHD style).
    """

    def __init__(
        self,
        input_nc: int,
        output_nc: int,
        ngf: int = 64,
        norm_type: str = "instance",
        use_dropout: bool = False,
        n_blocks: int = 9,
    ):
        assert n_blocks >= 0
        super().__init__()
        norm_layer = _get_norm_layer(norm_type)
        activation = nn.ReLU(True)

        model = [
            nn.ReflectionPad2d(3),
            nn.Conv2d(input_nc, ngf, kernel_size=7, padding=0, bias=False),
            norm_layer(ngf),
            activation,
        ]

        # Downsampling layers (2 steps)
        in_features = ngf
        out_features = in_features * 2
        for _ in range(2):
            model += [
                nn.Conv2d(in_features, out_features, kernel_size=3, stride=2, padding=1, bias=False),
                norm_layer(out_features),
                activation,
            ]
            in_features = out_features
            out_features = in_features * 2

        # Residual blocks
        for _ in range(n_blocks):
            model += [ResnetBlock(in_features, norm_layer, use_dropout)]

        # Upsampling layers
        out_features = in_features // 2
        for _ in range(2):
            model += [
                nn.ConvTranspose2d(in_features, out_features, kernel_size=3, stride=2, padding=1, output_padding=1, bias=False),
                norm_layer(out_features),
                activation,
            ]
            in_features = out_features
            out_features = in_features // 2

        model += [
            nn.ReflectionPad2d(3),
            nn.Conv2d(in_features, output_nc, kernel_size=7, padding=0),
            nn.Tanh(),
        ]

        self.model = nn.Sequential(*model)

    def forward(self, x):
        return self.model(x)


def _clean_state_dict(state_dict: Dict[str, torch.Tensor]) -> Dict[str, torch.Tensor]:
    """Strip common prefixes (module., model.) to match our generator keys."""

    cleaned = {}
    for key, value in state_dict.items():
        new_key = key
        if new_key.startswith("module."):
            new_key = new_key[len("module.") :]
        if new_key.startswith("model."):
            new_key = new_key[len("model.") :]
        cleaned[new_key] = value
    return cleaned


def load_scribble_model(checkpoint_path: str, style: str, device: Optional[torch.device] = None) -> torch.nn.Module:
    """
    Load a scribble generator checkpoint and return an eval-ready module.
    """

    if style not in STYLE_CONFIGS:
        raise ValueError(f"Unknown scribble style '{style}'. Available: {list(STYLE_CONFIGS)}")

    ckpt_path = Path(checkpoint_path)
    if not ckpt_path.exists():
        raise FileNotFoundError(f"Scribble checkpoint not found at {ckpt_path}")

    device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
    cfg = STYLE_CONFIGS[style]
    model = ResnetGenerator(cfg.input_nc, cfg.output_nc, cfg.ngf, n_blocks=cfg.n_blocks, use_dropout=cfg.use_dropout)

    checkpoint = torch.load(str(ckpt_path), map_location="cpu")
    if isinstance(checkpoint, nn.Module):
        model = checkpoint
    else:
        state_dict = checkpoint
        for key in ("state_dict", "model", "generator"):
            if isinstance(checkpoint, dict) and key in checkpoint:
                state_dict = checkpoint[key]
                break
        state_dict = _clean_state_dict(state_dict)
        missing, unexpected = model.load_state_dict(state_dict, strict=False)
        if missing:
            print(f"[VACE Scribble] Missing parameters: {missing}")
        if unexpected:
            print(f"[VACE Scribble] Unexpected parameters: {unexpected}")

    model.to(device)
    model.eval()
    return model


def preprocess_scribble_input(images: torch.Tensor, resolution: int) -> torch.Tensor:
    """
    Convert ComfyUI NHWC images to NCHW tensors normalized to [-1, 1].
    """

    if images.dtype == torch.uint8:
        tensor = images.float() / 255.0
    else:
        tensor = images.float()
        if tensor.max().item() > 2.0:
            tensor = tensor / 255.0
    tensor = tensor.clamp(0.0, 1.0)

    tensor = tensor.permute(0, 3, 1, 2).contiguous()
    tensor = F.interpolate(tensor, size=(resolution, resolution), mode="bilinear", align_corners=False)
    tensor = tensor * 2.0 - 1.0
    return tensor


def _quantile_threshold(mag: torch.Tensor, q: float, user_threshold: float) -> torch.Tensor:
    """
    Compute per-frame adaptive thresholds scaled by the user slider.
    """

    b = mag.shape[0]
    flat = mag.view(b, -1)
    quantiles = torch.quantile(flat, q, dim=1).view(b, 1, 1, 1)
    scale = torch.clamp(user_threshold, 0.01, 1.0)
    return torch.clamp(quantiles * (0.5 + scale * 1.5), 0.01, 0.95)


def _thin_edges(binary: torch.Tensor, iterations: int = 2) -> torch.Tensor:
    """
    Morphological thinning using skimage when available, otherwise fallback to a
    lightweight torch-based erosion/and-pass that shrinks thick lines.
    """

    if binary.numel() == 0:
        return binary

    if skimage_thin is not None:
        thinned = []
        arr = binary.detach().cpu().numpy()
        for frame in arr:
            channel = frame[0]
            thinned.append(skimage_thin(channel).astype(np.float32)[None])
        stacked = torch.from_numpy(np.stack(thinned, axis=0))
        return stacked.to(binary.device)

    kernel = torch.ones((1, 1, 3, 3), device=binary.device)
    out = binary
    for _ in range(iterations):
        eroded = 1.0 - F.max_pool2d(1.0 - out, kernel_size=3, stride=1, padding=1)
        opened = F.conv2d(eroded, kernel, padding=1) / kernel.numel()
        out = torch.minimum(out, opened)
    return torch.clamp(out, 0.0, 1.0)


def postprocess_scribble_output(
    output: torch.Tensor,
    target_hw: Tuple[int, int],
    user_threshold: float = 0.12,
    apply_thinning: bool = True,
) -> torch.Tensor:
    """
    Convert model logits to NHWC scribble maps with optional thinning.
    """

    if output.ndim == 3:
        output = output.unsqueeze(1)
    if output.ndim != 4:
        raise ValueError(f"Expected 4D tensor from scribble model, got {output.shape}")

    mag = output
    if mag.shape[1] > 1:
        mag = mag.abs().mean(dim=1, keepdim=True)
    else:
        mag = mag.abs()

    mag = torch.tanh(mag) if mag.max().item() > 1.2 else mag
    mag = (mag + 1.0) / 2.0
    mag = mag.clamp(0.0, 1.0)

    mag = F.interpolate(mag, size=target_hw, mode="bilinear", align_corners=False)
    threshold = _quantile_threshold(mag, q=0.92, user_threshold=user_threshold)
    binary = (mag >= threshold).float()

    if apply_thinning:
        binary = _thin_edges(binary)

    scribble = 1.0 - binary
    scribble = scribble.repeat(1, 3, 1, 1)
    return scribble.permute(0, 2, 3, 1).contiguous()
