from .media_describe import (
    LLMStudioStructuredDescribe,
    LLMStudioStructuredVideoDescribe,
    LMStudioCombinedStructuredDescribe,
)
from .utils.parse_string_to_bbox import ParseStringToBBox

# A dictionary that contains all nodes you want to export with their names
# NOTE: names should be globally unique
NODE_CLASS_MAPPINGS = {
    "LLMStudioStructuredDescribe": LLMStudioStructuredDescribe,
    "LLMStudioStructuredVideoDescribe": LLMStudioStructuredVideoDescribe,
    "LMStudioCombinedStructuredDescribe": LMStudioCombinedStructuredDescribe,
    "ParseStringToBBox": ParseStringToBBox,
}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {
    "LLMStudioStructuredDescribe": "LM Studio Structured Describe (Image)",
    "LLMStudioStructuredVideoDescribe": "LM Studio Structured Describe (Video)",
    "LMStudioCombinedStructuredDescribe": "LM Studio Structured Describe (Combined)",
    "ParseStringToBBox": "Parse String To BBox",
}
