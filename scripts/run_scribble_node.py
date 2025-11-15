#!/usr/bin/env python3
"""Run VACEScribbleAnnotator from the command line (outside ComfyUI).

Example:
  python scripts/run_scribble_node.py --image tests/data/example.jpg --mask tests/data/example_mask.png --inference_mode fallback --output out/scribble.png
"""
from __future__ import annotations

import argparse
import os
import sys
from typing import List

# allow importing local package when executed from scripts/
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

import numpy as np
from PIL import Image
import torch

from nodes.vace_annotators.vace_scribble_annotator import VACEScribbleAnnotator


def load_image(path: str) -> np.ndarray:
    img = Image.open(path).convert("RGB")
    return np.array(img)


def load_mask(path: str) -> np.ndarray:
    img = Image.open(path)
    # Convert to single channel mask if possible
    if img.mode in ("RGBA", "LA"):
        # Use alpha channel
        mask = np.array(img.split()[-1])
    else:
        # Convert to grayscale
        mask = np.array(img.convert("L"))
    return mask


def to_nhwc_tensor(imgs: List[np.ndarray]) -> torch.Tensor:
    # imgs: list of HxWx3 or HxW
    arrs = []
    for img in imgs:
        a = img.astype(np.float32)
        if a.ndim == 2:
            a = np.expand_dims(a, -1)
        if a.shape[-1] == 1:
            # mask mode, keep single channel
            arrs.append(a)
        else:
            arrs.append(a)
    batch = np.stack(arrs, axis=0)
    return torch.from_numpy(batch)


def save_nhwc_tensor_as_images(tensor: torch.Tensor, out_dir: str, prefix: str = "scribble"):
    os.makedirs(out_dir, exist_ok=True)
    arr = tensor.numpy()
    for i in range(arr.shape[0]):
        img = (arr[i] * 255.0).clip(0, 255).astype("uint8")
        Image.fromarray(img).save(os.path.join(out_dir, f"{prefix}_{i}.png"))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--image", nargs="+", required=True)
    p.add_argument("--mask", help="Optional mask image (single image or same batch size)")
    p.add_argument("--style", default="anime", choices=["anime", "general", "sketch"])
    p.add_argument("--inference_mode", default="fallback", choices=["auto", "model", "fallback"])
    p.add_argument("--resolution", default=512, type=int)
    p.add_argument("--model_path", default="")
    p.add_argument("--batch_size", default=0, type=int)
    p.add_argument("--output", default="out")
    args = p.parse_args()

    images = [load_image(p) for p in args.image]
    img_tensor = to_nhwc_tensor(images)

    mask_tensor = None
    if args.mask:
        mask = load_mask(args.mask)
        mask_tensor = to_nhwc_tensor([mask])
    if img_tensor.dtype == torch.uint8 or img_tensor.max() > 2.0:
        img_tensor = img_tensor  # Node handles float/uint8 normalization if needed

    annotator = VACEScribbleAnnotator()
    # If the node expects NHWC float, pass directly
    if hasattr(annotator, "generate_scribble"):
        res = annotator.generate_scribble(img_tensor, args.style, args.inference_mode, args.resolution, args.model_path, args.batch_size, mask_tensor)
    else:
        raise RuntimeError("Annotator doesn't expose generate_scribble")

    scribble_maps = res[0]
    save_nhwc_tensor_as_images(scribble_maps, args.output)


if __name__ == "__main__":
    main()
