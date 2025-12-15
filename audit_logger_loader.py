"""Helper to import the audit_logger module regardless of package naming."""

from __future__ import annotations

import importlib.util
from functools import lru_cache
from pathlib import Path
from types import ModuleType
from typing import Any


@lru_cache(maxsize=1)
def _load_audit_logger_module() -> ModuleType:
    module_path = Path(__file__).resolve().parent / "lib" / "audit_logger.py"
    spec = importlib.util.spec_from_file_location(
        "swiss_army_knife.audit_logger", module_path
    )
    if spec is None or spec.loader is None:
        raise ImportError("Unable to load audit_logger module")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def create_audit_logger(*args: Any, **kwargs: Any):
    module = _load_audit_logger_module()
    return module.create_audit_logger(*args, **kwargs)
