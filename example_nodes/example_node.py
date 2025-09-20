"""
Example node for ComfyUI-SwissArmyKnife scaffolding.
This demonstrates the basic structure for ComfyUI custom nodes.
"""


class ExampleNode:
    """
    A minimal example node that demonstrates the basic ComfyUI node structure.
    This can be used as a template for creating new nodes.
    """

    @classmethod
    def INPUT_TYPES(cls):
        """Define the input types for this node."""
        return {
            "required": {
                "text": ("STRING", {"default": "Hello, ComfyUI!"}),
                "number": ("INT", {"default": 42, "min": 0, "max": 100}),
            },
            "optional": {
                "optional_text": ("STRING", {"default": ""}),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("output_text",)
    FUNCTION = "process"
    CATEGORY = "ComfyUI-SwissArmyKnife/Example"

    def process(self, text, number, optional_text=""):
        """Process the inputs and return the result."""
        result = f"Text: {text}, Number: {number}"
        if optional_text:
            result += f", Optional: {optional_text}"
        return (result,)


# Export the node for ComfyUI registration
NODE_CLASS_MAPPINGS = {
    "ExampleNode": ExampleNode,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ExampleNode": "Example Node",
}