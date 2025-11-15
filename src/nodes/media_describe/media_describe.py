"""
Compatibility shim for media_describe - development helper

When running from the repository, the original implementation exists under
`nodes/media_describe/media_describe.py`. This shim tries to import that
implementation dynamically so we don't have to duplicate the entire file here
during the migration to src/ layout.
"""

from __future__ import annotations

import importlib.util
import importlib.machinery
from pathlib import Path
import sys

_orig_path = Path(__file__).resolve().parents[2] / "nodes" / "media_describe" / "media_describe.py"
if _orig_path.exists():
	spec = importlib.util.spec_from_file_location("nodes.media_describe.media_describe", str(_orig_path))
	if spec and spec.loader:
		module = importlib.util.module_from_spec(spec)
		loader = spec.loader
		assert loader is not None
		loader.exec_module(module)
		# Re-export core symbols
		for name in getattr(module, "__all__", [n for n in dir(module) if not n.startswith("_")]):
			globals()[name] = getattr(module, name)
		# Ensure module is in sys.modules under the expected package name
		sys.modules["nodes.media_describe.media_describe"] = module
else:
	# Fallback minimal stub for packaging/runtime when original isn't present
	class MediaDescribe:  # pragma: no cover - fallback
		def __init__(self, *args, **kwargs):
			raise RuntimeError("MediaDescribe implementation not available; source file missing")
