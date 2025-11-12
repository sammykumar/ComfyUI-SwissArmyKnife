"""Smoke tests for the VACE scribble annotator node."""

from __future__ import annotations

import os
from pathlib import Path

import numpy as np
import torch
from PIL import Image

from nodes.vace_annotators.scribble_loader import clear_scribble_cache
from nodes.vace_annotators.vace_scribble_annotator import VACEScribbleAnnotator

SAMPLE_IMAGE = Path(__file__).resolve().parent.parent / "data" / "sample_scribble_input.png"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def _load_sample() -> torch.Tensor:
    if not SAMPLE_IMAGE.exists():  # pragma: no cover - repo hygiene
        raise FileNotFoundError(f"Missing sample image at {SAMPLE_IMAGE}")
    arr = np.asarray(Image.open(SAMPLE_IMAGE).convert("RGB"), dtype=np.float32) / 255.0
    tensor = torch.from_numpy(arr).unsqueeze(0)
    return tensor


def _save_image(tensor: torch.Tensor, path: Path) -> None:
    arr = tensor.squeeze(0).cpu().numpy()
    arr = np.clip(arr * 255.0, 0, 255).astype(np.uint8)
    Image.fromarray(arr).save(path)


def test_scribble_fallback_smoke(tmp_path):
    node = VACEScribbleAnnotator()
    images = _load_sample()
    out = node.generate_scribble(
        images,
        "anime",
        "fallback",
        256,
        edge_threshold=0.08,
    )[0]
    assert out.shape == images.shape
    contrast = float(out.max().item() - out.min().item())
    assert contrast > 0.05, "Fallback scribble map should have visible edges"
    _save_image(out, OUTPUT_DIR / "scribble_fallback.png")


MODEL_PATH = os.environ.get("VACE_SCRIBBLE_MODEL_PATH")


def test_scribble_model_optional(tmp_path):
    if not MODEL_PATH or not Path(MODEL_PATH).exists():
        return
    clear_scribble_cache()
    node = VACEScribbleAnnotator()
    images = _load_sample()
    out = node.generate_scribble(
        images,
        "anime",
        "model",
        512,
        edge_threshold=0.12,
        model_path=MODEL_PATH,
    )[0]
    assert out.shape == images.shape
    _save_image(out, OUTPUT_DIR / "scribble_model.png")
