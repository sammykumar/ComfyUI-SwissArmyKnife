"""
Media Selection and Frame Extraction Nodes

This module provides nodes for handling media input and frame extraction,
decoupling these concerns from AI-based description generation.
"""

from .media_selection import MediaSelection
from .frame_extractor import FrameExtractor
from .multi_caption_combiner import MultiCaptionCombiner

__all__ = ['MediaSelection', 'FrameExtractor', 'MultiCaptionCombiner']
