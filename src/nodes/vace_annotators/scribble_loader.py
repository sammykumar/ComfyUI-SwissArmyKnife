"""
Utility helpers for loading/caching VACE scribble annotator models.
"""

from __future__ import annotations

import threading
from pathlib import Path
from typing import Dict, Optional

import torch

from .annotator_models import load_scribble_model


class ScribbleLoaderError(RuntimeError):
    pass


_MODEL_CACHE: Dict[str, torch.nn.Module] = {}
_CACHE_LOCK = threading.Lock()


def _normalize_key(style: str, model_path: str) -> str:
    resolved = Path(model_path).expanduser()
    try:
        resolved = resolved.resolve()
    except FileNotFoundError:
        pass
    return f"{style}:{resolved}"


def get_scribble_model(style: str, model_path: str, device: Optional[torch.device] = None, force_reload: bool = False) -> torch.nn.Module:
    if not model_path:
        raise ScribbleLoaderError("Model path is empty. Provide a scribble checkpoint path.")
    cache_key = _normalize_key(style, model_path)
    if not force_reload:
        with _CACHE_LOCK:
            cached = _MODEL_CACHE.get(cache_key)
        if cached is not None:
            return cached
    try:
        model = load_scribble_model(model_path, style, device=device)
    except Exception as exc:
        raise ScribbleLoaderError(str(exc)) from exc
    with _CACHE_LOCK:
        _MODEL_CACHE[cache_key] = model
    return model


def clear_scribble_cache():
    with _CACHE_LOCK:
        _MODEL_CACHE.clear()
