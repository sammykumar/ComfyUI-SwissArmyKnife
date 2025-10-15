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
                "temperature": ("FLOAT", {
                    "default": 0.5,
                    "min": 0.0,
                    "max": 2.0,
                    "step": 0.1,
                    "tooltip": "Temperature for text generation"
                }),
                "fps_sample": ("FLOAT", {
                    "default": 1.0,
                    "min": 0.1,
                    "max": 10.0,
                    "step": 0.1,
                    "tooltip": "Extract 1 frame every N seconds (for video processing)"
                }),
                "max_duration": ("FLOAT", {
                    "default": 5.0,
                    "min": 1.0,
                    "max": 60.0,
                    "step": 0.5,
                    "tooltip": "Maximum duration in seconds to sample from video"
                }),
                "caption_prompt": ("STRING", {
                    "default": "Describe this image in detail, focusing on the subject, setting, and mood.",
                    "multiline": True,
                    "tooltip": "Prompt for image/frame captions"
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

    def create_options(self, base_url, model_name, temperature, fps_sample, max_duration, caption_prompt, verbose):
        """
        Create an options object with all the configuration settings
        """
        options = {
            "provider": "llm_studio",  # Identifier to distinguish from Gemini
            "base_url": base_url,
            "model_name": model_name,
            "temperature": temperature,
            "fps_sample": fps_sample,
            "max_duration": max_duration,
            "caption_prompt": caption_prompt,
            "verbose": verbose,
        }
        return (options,)
