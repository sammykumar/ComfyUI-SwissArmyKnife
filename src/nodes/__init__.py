"""
Compatibility shim package for 'nodes'.

This top-level package in src/ is a copy of the Python package so that setuptools
can find and package the 'nodes' package when using a `src/` layout.

The files are intentionally a duplicate of `nodes/` so we can keep the existing
developer-friendly layout (run from repository root) while allowing packaging to
use src/ layout during install. This file will be populated with the real
implementation files (copied from `nodes/`).

Note: During a migration phase we keep the original `nodes/` folder intact. The
`src/` copy will become the canonical source for packaging and releases; after
validation we can remove the root `nodes/` folder.
"""

from .nodes import *  # Import all the node definitions (copied into src/nodes)  # noqa: F403,F405

__all__ = ["*"]  # noqa: F405
