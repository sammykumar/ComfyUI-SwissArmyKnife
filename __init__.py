import os
from .utils.nodes import NODE_CLASS_MAPPINGS as MAIN_NODE_CLASS_MAPPINGS
from .utils.nodes import NODE_DISPLAY_NAME_MAPPINGS as MAIN_NODE_DISPLAY_NAME_MAPPINGS
from .utils.helper_nodes import HELPER_NODE_CLASS_MAPPINGS
from .utils.helper_nodes import HELPER_NODE_DISPLAY_NAME_MAPPINGS

# Get version from pyproject.toml for cache busting
def get_version():
    try:
        import tomllib
        pyproject_path = os.path.join(os.path.dirname(__file__), "pyproject.toml")
        with open(pyproject_path, "rb") as f:
            data = tomllib.load(f)
            return data["project"]["version"]
    except Exception:
        # Fallback to timestamp if version reading fails
        import time
        return str(int(time.time()))

# Combine main nodes and helper nodes
NODE_CLASS_MAPPINGS = {**MAIN_NODE_CLASS_MAPPINGS, **HELPER_NODE_CLASS_MAPPINGS}
NODE_DISPLAY_NAME_MAPPINGS = {**MAIN_NODE_DISPLAY_NAME_MAPPINGS, **HELPER_NODE_DISPLAY_NAME_MAPPINGS}

WEB_DIRECTORY = "./web"
VERSION = get_version()

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY", "VERSION"]