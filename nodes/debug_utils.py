"""
Centralized debug logging utilities for ComfyUI-SwissArmyKnife
All debug logging should use this module to respect the debug_mode setting
"""

import os
import logging


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


def setup_logging():
    """
    Configure logging based on debug mode setting.
    Call this once at module level to set up logging.
    """
    if is_debug_enabled():
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    else:
        # In non-debug mode, only show warnings and errors to avoid noisy logs
        logging.basicConfig(
            level=logging.WARNING,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )


def get_logger(name: str):
    """
    Get a logger instance that respects the debug mode setting.
    
    Args:
        name: Logger name (typically __name__)
        
    Returns:
        logging.Logger: Configured logger instance
    """
    return logging.getLogger(name)
