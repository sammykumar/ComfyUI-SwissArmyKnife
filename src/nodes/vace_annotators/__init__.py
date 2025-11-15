"""
VACE Annotator Nodes for ComfyUI SwissArmyKnife
"""

from .vace_depth_annotator import VACEDepthAnnotator
from .vace_flow_annotator import VACEFlowAnnotator
from .vace_scribble_annotator import VACEScribbleAnnotator

NODE_CLASS_MAPPINGS = {
    "VACEDepthAnnotator": VACEDepthAnnotator,
    "VACEFlowAnnotator": VACEFlowAnnotator,
    "VACEScribbleAnnotator": VACEScribbleAnnotator,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "VACEDepthAnnotator": "VACE Annotator - Depth",
    "VACEFlowAnnotator": "VACE Annotator - Flow",
    "VACEScribbleAnnotator": "VACE Annotator - Scribble",
}

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]
