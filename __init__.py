import os
from .nodes.nodes import NODE_CLASS_MAPPINGS as MAIN_NODE_CLASS_MAPPINGS
from .nodes.nodes import NODE_DISPLAY_NAME_MAPPINGS as MAIN_NODE_DISPLAY_NAME_MAPPINGS
from .nodes.helper_nodes import HELPER_NODE_CLASS_MAPPINGS
from .nodes.helper_nodes import HELPER_NODE_DISPLAY_NAME_MAPPINGS

# Import lora_manager nodes
try:
    from .nodes.lora_manager import NODE_CLASS_MAPPINGS as LORA_MANAGER_NODE_CLASS_MAPPINGS
    from .nodes.lora_manager import NODE_DISPLAY_NAME_MAPPINGS as LORA_MANAGER_NODE_DISPLAY_NAME_MAPPINGS
except ImportError as e:
    print(f"Warning: Could not import lora_manager nodes: {e}")
    LORA_MANAGER_NODE_CLASS_MAPPINGS = {}
    LORA_MANAGER_NODE_DISPLAY_NAME_MAPPINGS = {}

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

# Combine main nodes, helper nodes, and lora_manager nodes
NODE_CLASS_MAPPINGS = {
    **MAIN_NODE_CLASS_MAPPINGS,
    **HELPER_NODE_CLASS_MAPPINGS,
    **LORA_MANAGER_NODE_CLASS_MAPPINGS
}
NODE_DISPLAY_NAME_MAPPINGS = {
    **MAIN_NODE_DISPLAY_NAME_MAPPINGS,
    **HELPER_NODE_DISPLAY_NAME_MAPPINGS,
    **LORA_MANAGER_NODE_DISPLAY_NAME_MAPPINGS
}

WEB_DIRECTORY = "./web"
VERSION = get_version()

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY", "VERSION"]