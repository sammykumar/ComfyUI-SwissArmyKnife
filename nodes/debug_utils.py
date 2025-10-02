"""
Centralized debug logging utilities for ComfyUI-SwissArmyKnife
All debug logging should use this module to respect the DEBUG environment variable
"""

import os

# Load DEBUG setting from environment (same as __init__.py)
DEBUG_ENABLED = os.environ.get("DEBUG", "false").lower() in ("true", "1", "yes")


def debug_print(*args, **kwargs):
    """Print debug messages only when DEBUG is enabled"""
    if DEBUG_ENABLED:
        print(*args, **kwargs)


def is_debug_enabled():
    """Check if debug mode is enabled"""
    return DEBUG_ENABLED
