"""
JoyCaption nodes for ComfyUI

This module provides AI-powered image captioning functionality using LLaVA vision-language models.
Supports both standard HuggingFace transformers and efficient GGUF quantized models.

Node Categories:
- JoyCaption: Basic captioning with HuggingFace models
- JoyCaption Advanced: Full control over generation parameters
- JoyCaption GGUF: Efficient quantized model inference
- JoyCaption GGUF Advanced: Advanced quantized model controls
- JoyCaption Extra Options: Additional caption customization
- Image Batch Path: Batch processing for multiple images
- Caption Saver: Save generated captions to files
"""

from .JC import NODE_CLASS_MAPPINGS as JC_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS as JC_DISPLAY_MAPPINGS
from .JC_GGUF import NODE_CLASS_MAPPINGS as GGUF_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS as GGUF_DISPLAY_MAPPINGS  
from .CaptionTools import NODE_CLASS_MAPPINGS as TOOLS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS as TOOLS_DISPLAY_MAPPINGS

# Combine all node mappings
NODE_CLASS_MAPPINGS = {}
NODE_CLASS_MAPPINGS.update(JC_MAPPINGS)
NODE_CLASS_MAPPINGS.update(GGUF_MAPPINGS)
NODE_CLASS_MAPPINGS.update(TOOLS_MAPPINGS)

NODE_DISPLAY_NAME_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS.update(JC_DISPLAY_MAPPINGS)
NODE_DISPLAY_NAME_MAPPINGS.update(GGUF_DISPLAY_MAPPINGS)
NODE_DISPLAY_NAME_MAPPINGS.update(TOOLS_DISPLAY_MAPPINGS)

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]