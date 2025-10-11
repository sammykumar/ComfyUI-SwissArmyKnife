"""
Gemini Utility Options Node

This module contains the GeminiUtilOptions node which provides configuration
options for Gemini media description nodes.
"""

import os


class GeminiUtilOptions:
    """
    A ComfyUI custom node that provides configuration options for Gemini nodes.
    This node outputs an options object that can be connected to Gemini processing nodes.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "gemini_api_key": ("STRING", {
                    "multiline": False,
                    "default": os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE"),
                    "tooltip": "Your Gemini API key (automatically uses GEMINI_API_KEY environment variable if available)"
                }),
                "gemini_model": (["models/gemini-2.5-flash", "models/gemini-2.5-flash-lite", "models/gemini-2.5-pro"], {
                    "default": "models/gemini-2.5-flash",
                    "tooltip": "Select the Gemini model to use"
                }),
                "prompt_style": (["Text2Image", "ImageEdit"], {
                    "default": "Text2Image",
                    "tooltip": "Text2Image: Generates descriptive prompts for models like FLUX Dev, SDXL, etc. ImageEdit: Generates instruction prompts with words like 'change to...', 'modify this...' for image editing models like FLUX Redux/Kontext, Nano Banana, Qwen Image Edit"
                }),
                "describe_clothing": (["Yes", "No"], {
                    "default": "Yes",
                    "tooltip": "Whether to include detailed clothing and accessory descriptions"
                }),
                "change_clothing_color": (["Yes", "No"], {
                    "default": "No",
                    "tooltip": "If enabled, adjust clothing color descriptions to new colors that harmonize with the scene and differ from the original colors"
                }),
                "describe_hair_style": (["Yes", "No"], {
                    "default": "Yes",
                    "tooltip": "Whether to include hair style descriptions (texture and motion, but not color or length)"
                }),
                "describe_bokeh": (["Yes", "No"], {
                    "default": "Yes", 
                    "tooltip": "Whether to include depth of field effects, bokeh, and blur descriptions"
                }),
                "describe_subject": (["Yes", "No"], {
                    "default": "Yes",
                    "tooltip": "Whether to include subject/person descriptions in the first paragraph"
                }),
                "replace_action_with_twerking": (["Yes", "No"], {
                    "default": "No",
                    "tooltip": "Replace video movement/action description with twerking description"
                }),
                "prefix_text": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Text to prepend to the generated description"
                }),
            }
        }

    RETURN_TYPES = ("GEMINI_OPTIONS",)
    RETURN_NAMES = ("gemini_options",)
    FUNCTION = "create_options"
    CATEGORY = "Swiss Army Knife 🔪/Media Caption"

    def create_options(self, gemini_api_key, gemini_model, prompt_style, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, replace_action_with_twerking, prefix_text):
        """
        Create an options object with all the configuration settings
        """
        # Use environment variable if API key is placeholder or empty
        # This handles cases where the API key was not serialized to the workflow
        effective_api_key = gemini_api_key
        if not gemini_api_key or gemini_api_key == "YOUR_GEMINI_API_KEY_HERE":
            effective_api_key = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")
        
        options = {
            "gemini_api_key": effective_api_key,
            "gemini_model": gemini_model,
            "model_type": prompt_style,  # Keep internal key as model_type for backward compatibility
            "describe_clothing": describe_clothing == "Yes",
            "change_clothing_color": change_clothing_color == "Yes",
            "describe_hair_style": describe_hair_style == "Yes", 
            "describe_bokeh": describe_bokeh == "Yes",
            "describe_subject": describe_subject == "Yes",
            "replace_action_with_twerking": replace_action_with_twerking == "Yes",
            "prefix_text": prefix_text
        }
        return (options,)
