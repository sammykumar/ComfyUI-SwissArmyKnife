"""
Media Description Module

This module contains the MediaDescribeOverrides node,
LLMStudioVideoDescribe node, LLMStudioPictureDescribe node,
LLMStudioStructuredDescribe node, LLMStudioStructuredVideoDescribe node,
LLMStudioOptions node, and related functionality for configuring media analysis.
"""

from .llm_studio_options import LLMStudioOptions
from .media_describe import MediaDescribe
from .media_describe_overrides import MediaDescribeOverrides
from .llm_studio_describe import LLMStudioVideoDescribe, LLMStudioPictureDescribe
from .llm_studio_structured import LLMStudioStructuredDescribe, LLMStudioStructuredVideoDescribe

__all__ = [
    'LLMStudioOptions', 
    'MediaDescribe', 
    'MediaDescribeOverrides', 
    'LLMStudioVideoDescribe', 
    'LLMStudioPictureDescribe',
    'LLMStudioStructuredDescribe',
    'LLMStudioStructuredVideoDescribe'
]
