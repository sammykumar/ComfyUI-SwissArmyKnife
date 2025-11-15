"""
Centralized debug logging utilities for ComfyUI-SwissArmyKnife
All debug logging should use this module to respect the debug_mode setting
"""

import os


def is_debug_enabled():
    """
    Check if debug mode is enabled.
    Checks both environment variable and frontend settings.
    """
    # Check environment variable first (for backwards compatibility)
    env_debug = os.environ.get("DEBUG", "false").lower() in ("true", "1", "yes")
    if env_debug:
        return True

    # Check frontend settings
    try:
        from .config_api import get_debug_mode
        return get_debug_mode()
    except (ImportError, Exception):
        return False


def debug_print(*args, **kwargs):
    """Print debug messages only when debug mode is enabled"""
    if is_debug_enabled():
        print(*args, **kwargs)
