"""
Prompt Builder Node

Allows users to assemble custom prompt sections (prefix, subject, clothing,
action, scene, visual style) and emits a formatted prompt string.
"""

from typing import List


class PromptBuilder:
    """A ComfyUI custom node for composing paragraph-level prompt overrides."""

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {},
            "optional": {
                "prefix": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Optional text that appears before all other sections",
                    },
                ),
                "subject": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for SUBJECT paragraph",
                    },
                ),
                "clothing": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for CLOTHING paragraph",
                    },
                ),
                "action": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for ACTION paragraph (video only)",
                    },
                ),
                "scene": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for SCENE paragraph (video only)",
                    },
                ),
                "visual_style": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "Override text for VISUAL STYLE paragraph",
                    },
                ),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("positive_prompt",)
    FUNCTION = "build_prompt"
    CATEGORY = "Swiss Army Knife 🔪/Prompt Tools"
    DESCRIPTION = (
        "Compose prompt paragraphs for MediaDescribe or other nodes. Outputs a preview string plus an OVERRIDES dictionary "
        "compatible with MediaDescribe overrides."
    )

    def build_prompt(
        self,
        prefix: str = "",
        subject: str = "",
        clothing: str = "",
        action: str = "",
        scene: str = "",
        visual_style: str = "",
    ):
        """Compose a prompt string from the provided overrides."""

        prompt_segments: List[str] = []

        for text in (
            prefix,
            subject,
            clothing,
            action,
            scene,
            visual_style,
        ):
            clean_text = text.strip()
            if clean_text:
                prompt_segments.append(clean_text)

        positive_prompt = "\n".join(prompt_segments)

        return (positive_prompt,)


NODE_CLASS_MAPPINGS = {
    "PromptBuilder": PromptBuilder,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PromptBuilder": "Prompt Builder",
}
