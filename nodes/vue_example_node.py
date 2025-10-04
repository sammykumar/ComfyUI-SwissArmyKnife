"""
Example Vue Component Node for ComfyUI Swiss Army Knife
Demonstrates how to use Vue components in ComfyUI custom nodes
"""


class VueExampleNode:
    """
    A demo node that uses a Vue component widget.
    This shows how to integrate Vue components with ComfyUI nodes.
    """

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define the input types for the node.
        The EXAMPLE_WIDGET type will be handled by the Vue component.
        """
        return {
            "required": {
                "example_widget": ("EXAMPLE_WIDGET", {}),
            },
            "optional": {
                "text_input": ("STRING", {
                    "multiline": False,
                    "default": "Hello from Vue!",
                    "tooltip": "Optional text input"
                }),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("output",)
    FUNCTION = "process"
    CATEGORY = "Swiss Army Knife 🔪"
    OUTPUT_NODE = True

    def process(self, example_widget, text_input=""):
        """
        Process the widget data and return a result.
        The example_widget will contain data from the Vue component.
        """
        print(f"[VueExampleNode] Widget data: {example_widget}")
        print(f"[VueExampleNode] Text input: {text_input}")

        # The Vue component sets widget.value to { clicks: count }
        if isinstance(example_widget, dict):
            clicks = example_widget.get('clicks', 0)
            result = f"Button clicked {clicks} times. Input: {text_input}"
        else:
            result = f"Widget value: {example_widget}. Input: {text_input}"

        return (result,)


# Export for node registration
NODE_CLASS_MAPPINGS = {
    "VueExampleNode": VueExampleNode
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "VueExampleNode": "Video Preview (Native)"
}
