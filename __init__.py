import os
from .nodes.nodes import NODE_CLASS_MAPPINGS as MAIN_NODE_CLASS_MAPPINGS
from .nodes.nodes import NODE_DISPLAY_NAME_MAPPINGS as MAIN_NODE_DISPLAY_NAME_MAPPINGS
from .nodes.helper_nodes import HELPER_NODE_CLASS_MAPPINGS
from .nodes.helper_nodes import HELPER_NODE_DISPLAY_NAME_MAPPINGS

# Import control panel node
try:
    from .nodes.utils.control_panel import CONTROL_PANEL_NODE_CLASS_MAPPINGS
    from .nodes.utils.control_panel import CONTROL_PANEL_NODE_DISPLAY_NAME_MAPPINGS
except ImportError as e:
    print(f"Warning: Could not import control panel node: {e}")
    CONTROL_PANEL_NODE_CLASS_MAPPINGS = {}
    CONTROL_PANEL_NODE_DISPLAY_NAME_MAPPINGS = {}

# Import civit metadata helper node
try:
    from .nodes.utils.civit_metadata_helper import CIVIT_METADATA_HELPER_NODE_CLASS_MAPPINGS
    from .nodes.utils.civit_metadata_helper import CIVIT_METADATA_HELPER_NODE_DISPLAY_NAME_MAPPINGS
except ImportError as e:
    print(f"Warning: Could not import civit metadata helper node: {e}")
    CIVIT_METADATA_HELPER_NODE_CLASS_MAPPINGS = {}
    CIVIT_METADATA_HELPER_NODE_DISPLAY_NAME_MAPPINGS = {}

# Import Azure Storage Upload node
try:
    from .nodes.utils.azure_storage_upload import NODE_CLASS_MAPPINGS as AZURE_STORAGE_NODE_CLASS_MAPPINGS
    from .nodes.utils.azure_storage_upload import NODE_DISPLAY_NAME_MAPPINGS as AZURE_STORAGE_NODE_DISPLAY_NAME_MAPPINGS
except ImportError as e:
    print(f"Warning: Could not import Azure Storage Upload node: {e}")
    AZURE_STORAGE_NODE_CLASS_MAPPINGS = {}
    AZURE_STORAGE_NODE_DISPLAY_NAME_MAPPINGS = {}

# Import lora_manager nodes
try:
    from .nodes.lora_manager import NODE_CLASS_MAPPINGS as LORA_MANAGER_NODE_CLASS_MAPPINGS
    from .nodes.lora_manager import NODE_DISPLAY_NAME_MAPPINGS as LORA_MANAGER_NODE_DISPLAY_NAME_MAPPINGS
except ImportError as e:
    print(f"Warning: Could not import lora_manager nodes: {e}")
    LORA_MANAGER_NODE_CLASS_MAPPINGS = {}
    LORA_MANAGER_NODE_DISPLAY_NAME_MAPPINGS = {}

# Import media_selection nodes
try:
    from .nodes.media_selection.media_selection import MediaSelection
    from .nodes.media_selection.frame_extractor import FrameExtractor
    from .nodes.media_selection.multi_caption_combiner import MultiCaptionCombiner
    
    MEDIA_SELECTION_NODE_CLASS_MAPPINGS = {
        "MediaSelection": MediaSelection,
        "FrameExtractor": FrameExtractor,
        "MultiCaptionCombiner": MultiCaptionCombiner,
    }
    MEDIA_SELECTION_NODE_DISPLAY_NAME_MAPPINGS = {
        "MediaSelection": "Media Selection",
        "FrameExtractor": "Frame Extractor",
        "MultiCaptionCombiner": "Multi-Caption Combiner",
    }
except ImportError as e:
    print(f"Warning: Could not import media_selection nodes: {e}")
    MEDIA_SELECTION_NODE_CLASS_MAPPINGS = {}
    MEDIA_SELECTION_NODE_DISPLAY_NAME_MAPPINGS = {}

# Register config API routes
try:
    from .nodes.config_api import register_config_routes
    from .nodes.restart_api import register_restart_routes
    from server import PromptServer
    app = getattr(PromptServer.instance, "app", None) or PromptServer.instance
    if app:
        register_config_routes(app)
        register_restart_routes(app)
        print("Swiss Army Knife: Registered config API routes")
except Exception as e:
    print(f"Swiss Army Knife: Could not register config API routes: {e}")


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

# Combine main nodes, helper nodes, control panel, civit metadata helper, azure storage, lora_manager, and media_selection nodes
NODE_CLASS_MAPPINGS = {
    **MAIN_NODE_CLASS_MAPPINGS,
    **HELPER_NODE_CLASS_MAPPINGS,
    **CONTROL_PANEL_NODE_CLASS_MAPPINGS,
    **CIVIT_METADATA_HELPER_NODE_CLASS_MAPPINGS,
    **AZURE_STORAGE_NODE_CLASS_MAPPINGS,
    **LORA_MANAGER_NODE_CLASS_MAPPINGS,
    **MEDIA_SELECTION_NODE_CLASS_MAPPINGS
}
NODE_DISPLAY_NAME_MAPPINGS = {
    **MAIN_NODE_DISPLAY_NAME_MAPPINGS,
    **HELPER_NODE_DISPLAY_NAME_MAPPINGS,
    **CONTROL_PANEL_NODE_DISPLAY_NAME_MAPPINGS,
    **CIVIT_METADATA_HELPER_NODE_DISPLAY_NAME_MAPPINGS,
    **AZURE_STORAGE_NODE_DISPLAY_NAME_MAPPINGS,
    **LORA_MANAGER_NODE_DISPLAY_NAME_MAPPINGS,
    **MEDIA_SELECTION_NODE_DISPLAY_NAME_MAPPINGS
}

WEB_DIRECTORY = "./web"
VERSION = get_version()

# Load DEBUG setting from environment
DEBUG = os.environ.get("DEBUG", "false").lower() in ("true", "1", "yes")

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY", "VERSION", "DEBUG"]