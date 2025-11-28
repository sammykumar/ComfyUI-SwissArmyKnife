"""
VACE Annotator Nodes for ComfyUI SwissArmyKnife

Provides depth estimation, optical flow, and scribble/edge detection nodes
using VACE-Annotators models from ali-vilab.

Models should be downloaded from: https://huggingface.co/ali-vilab/VACE-Annotators
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
