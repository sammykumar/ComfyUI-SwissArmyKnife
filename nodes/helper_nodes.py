import torch
from .debug_utils import Logger

logger = Logger("HelperNodes")
class ShowText:
    """
    A simple ComfyUI custom node that displays text input.
    Useful for showing the final_string output from Gemini nodes.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        Takes a STRING input and displays it.
        """
        return {
            "required": {
                "text": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Text to display"
                }),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "show_text"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    OUTPUT_NODE = True  # This makes it an output node that shows in the UI
    DESCRIPTION = (
        "Simple output helper that prints and displays any STRING input inside ComfyUI—ideal for inspecting prompts or captions "
        "produced by MediaDescribe."
    )

    def show_text(self, text):
        """
        Simply return the input text and display it
        """
        logger.log(f"ShowText node displaying: {text[:100]}...")  # Log first 100 chars
        return (text,)


# A dictionary that contains the helper nodes
HELPER_NODE_CLASS_MAPPINGS = {
    "ShowText": ShowText
}

# A dictionary that contains the friendly/humanly readable titles for the nodes
HELPER_NODE_DISPLAY_NAME_MAPPINGS = {
    "ShowText": "Show Text"
}
