"""
Prompt Builder Node

Allows users to assemble custom prompt sections (prefix, subject, style, clothing,
scene, action) and emits both a formatted prompt string plus an OVERRIDES
dictionary that MediaDescribe already understands.
"""

from typing import Dict, List


class PromptBuilder:
    """
    A ComfyUI custom node for composing paragraph-level prompt overrides.
    Emits both a preview string and an OVERRIDES dictionary compatible with
    MediaDescribe. Keep fields empty to reuse Gemini output for that section.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Return a dictionary which contains config for all input fields.
        All fields are optional - leave empty to use Gemini's output.
        """

        return {
            "required": {},
            "optional": {
                "prompt_prefix": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Optional text that appears before every other paragraph",
                    },
                ),
                "override_subject": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for SUBJECT paragraph",
                    },
                ),
                "override_visual_style": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for VISUAL STYLE paragraph",
                    },
                ),
                "override_clothing": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for CLOTHING paragraph",
                    },
                ),
                "override_scene": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for SCENE paragraph (video only)",
                    },
                ),
                "override_action": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for ACTION paragraph (video only)",
                    },
                ),
            },
        }

    RETURN_TYPES = ("STRING", "OVERRIDES")
    RETURN_NAMES = ("prompt_text", "overrides")
    FUNCTION = "build_prompt"
    CATEGORY = "Swiss Army Knife 🔪/Prompt Tools"
    DESCRIPTION = (
        "Compose prompt paragraphs for MediaDescribe or other nodes. Outputs a preview string plus an OVERRIDES dictionary "
        "compatible with MediaDescribe overrides."
    )

    def build_prompt(
        self,
        prompt_prefix: str = "",
        override_subject: str = "",
        override_visual_style: str = "",
        override_clothing: str = "",
        override_scene: str = "",
        override_action: str = "",
    ):
        """
        Compose a prompt preview string and dictionary from the provided overrides.

        Args:
            prompt_prefix: Text to prepend before the generated description
            override_subject: Override text for SUBJECT paragraph
            override_visual_style: Override text for VISUAL STYLE paragraph
            override_clothing: Override text for CLOTHING paragraph
            override_scene: Override text for SCENE paragraph (video only)
            override_action: Override text for ACTION paragraph (video only)

        Returns:
            Tuple of (prompt_text, overrides_dict)
        """

        overrides: Dict[str, str] = {
            "prompt_prefix": prompt_prefix,
            "override_subject": override_subject,
            "override_visual_style": override_visual_style,
            "override_clothing": override_clothing,
            "override_scene": override_scene,
            "override_action": override_action,
            # Backwards compatibility for downstream nodes still reading the legacy key
            "override_movement": override_action,
        }

        prompt_segments: List[str] = []

        if prompt_prefix.strip():
            prompt_segments.append(prompt_prefix.strip())

        for text in (
            override_subject,
            override_visual_style,
            override_clothing,
            override_scene,
            override_action,
        ):
            clean_text = text.strip()
            if clean_text:
                prompt_segments.append(clean_text)

        prompt_text = "\n\n".join(prompt_segments)

        return (prompt_text, overrides)


NODE_CLASS_MAPPINGS = {
    "PromptBuilder": PromptBuilder,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PromptBuilder": "Prompt Builder",
}
