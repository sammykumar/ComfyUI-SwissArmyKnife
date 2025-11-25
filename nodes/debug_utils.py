"""
Centralized debug logging utilities for ComfyUI-SwissArmyKnife
All debug logging should use this module to respect the debug_mode setting
"""

import os


import datetime

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


class Logger:
    def __init__(self, name=None):
        self.name = name

    def _format(self, level, message):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        prefix = f"[{self.name}] " if self.name else ""
        return f"[{timestamp}] [{level}] {prefix}{message}"

    def debug(self, message):
        if is_debug_enabled():
            print(self._format("DEBUG", message))
            
    def log(self, message):
        # Alias for debug, or standard log
        if is_debug_enabled():
            print(self._format("INFO", message))

    def error(self, message):
        # Errors are always printed
        print(self._format("ERROR", message))


# Backwards compatibility for existing code until fully migrated
def debug_print(*args, **kwargs):
    """Print debug messages only when debug mode is enabled"""
    if is_debug_enabled():
        print(*args, **kwargs)
