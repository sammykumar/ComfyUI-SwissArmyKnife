from .utils.nodes import NODE_CLASS_MAPPINGS as MAIN_NODE_CLASS_MAPPINGS
from .utils.nodes import NODE_DISPLAY_NAME_MAPPINGS as MAIN_NODE_DISPLAY_NAME_MAPPINGS
from .utils.helper_nodes import HELPER_NODE_CLASS_MAPPINGS
from .utils.helper_nodes import HELPER_NODE_DISPLAY_NAME_MAPPINGS

# Import lora_manager nodes
try:
    from .utils.lora_manager import NODE_CLASS_MAPPINGS as LORA_MANAGER_NODE_CLASS_MAPPINGS
    from .utils.lora_manager import NODE_DISPLAY_NAME_MAPPINGS as LORA_MANAGER_NODE_DISPLAY_NAME_MAPPINGS
except ImportError as e:
    print(f"Warning: Could not import lora_manager nodes: {e}")
    LORA_MANAGER_NODE_CLASS_MAPPINGS = {}
    LORA_MANAGER_NODE_DISPLAY_NAME_MAPPINGS = {}

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

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]