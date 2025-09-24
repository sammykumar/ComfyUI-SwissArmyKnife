# VHS-SK (VideoHelperSuite - Swiss Knife Edition)
# Fork of ComfyUI-VideoHelperSuite with customizations for SwissArmyKnife

from .videohelpersuite.nodes import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
from .videohelpersuite import documentation

# VHS-SK specific web directory
WEB_DIRECTORY = "./VHS_SK/web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
documentation.format_descriptions(NODE_CLASS_MAPPINGS)
