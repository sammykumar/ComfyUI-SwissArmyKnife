"""
LLM Studio Options Node

This module contains the LLMStudioOptions node which provides configuration
options for LLM Studio media description nodes.
"""

import os


class LLMStudioOptions:
    """
    A ComfyUI custom node that provides configuration options for LLM Studio nodes.
    This node outputs an options object that can be connected to LLM Studio processing nodes.
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
                "base_url": ("STRING", {
                    "multiline": False,
                    "default": "http://192.168.50.41:1234",
                    "tooltip": "LM Studio server URL (e.g. http://192.168.50.41:1234)"
                }),
                "model_name": ("STRING", {
                    "multiline": False,
                    "default": "qwen/qwen3-vl-30b",
                    "tooltip": "Model name in LM Studio (e.g. qwen/qwen3-vl-30b)"
                }),
                "prompt_style": (["Text2Image", "ImageEdit"], {
                    "default": "Text2Image",
                    "tooltip": "Text2Image: Generates descriptive prompts for models like FLUX Dev, SDXL, etc. ImageEdit: Generates instruction prompts with words like 'change to...', 'modify this...' for image editing models like FLUX Redux/Kontext, Nano Banana, Qwen Image Edit"
                }),
                "temperature": ("FLOAT", {
                    "default": 0.5,
                    "min": 0.0,
                    "max": 2.0,
                    "step": 0.1,
                    "tooltip": "Temperature for text generation"
                }),
                "sample_rate": ("FLOAT", {
                    "default": 2.0,
                    "min": 0.1,
                    "max": 30.0,
                    "step": 0.1,
                    "tooltip": "Frames per second to extract (e.g., 1.0 = 1 frame/sec, 2.0 = 2 frames/sec)"
                }),
                "max_duration": ("FLOAT", {
                    "default": 5.0,
                    "min": 1.0,
                    "max": 60.0,
                    "step": 0.5,
                    "tooltip": "Maximum duration in seconds to sample from video"
                }),
                "change_clothing_color": (["Yes", "No"], {
                    "default": "No",
                    "tooltip": "If enabled, adjust clothing color descriptions to new colors that harmonize with the scene and differ from the original colors"
                }),
                "verbose": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Show detailed processing information in console"
                }),
            }
        }

    RETURN_TYPES = ("LLM_STUDIO_OPTIONS",)
    RETURN_NAMES = ("llm_studio_options",)
    FUNCTION = "create_options"
    CATEGORY = "Swiss Army Knife 🔪/Media Caption"

    def create_options(self, base_url, model_name, prompt_style, temperature, sample_rate, max_duration, change_clothing_color, verbose):
        """
        Create an options object with all the configuration settings
        """
        options = {
            "provider": "llm_studio",  # Identifier to distinguish from Gemini
            "base_url": base_url,
            "model_name": model_name,
            "model_type": prompt_style,  # Keep internal key as model_type for consistency with Gemini
            "temperature": temperature,
            "sample_rate": sample_rate,
            "max_duration": max_duration,
            "change_clothing_color": change_clothing_color == "Yes",
            "describe_clothing": True,  # Always enabled to match Gemini
            "describe_hair_style": True,  # Always enabled to match Gemini
            "describe_bokeh": True,  # Always enabled to match Gemini
            "describe_subject": True,  # Always enabled to match Gemini
            "verbose": verbose,
        }
        return (options,)
