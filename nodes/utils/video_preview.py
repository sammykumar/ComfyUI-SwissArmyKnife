"""
Video Preview Node - Displays multiple video inputs for comparison
"""


class VideoPreview:
    """
    A video preview node that displays multiple video inputs side by side.
    Accepts reference, base, and upscaled video inputs for comparison.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define input fields for the video preview node.
        All inputs are optional IMAGE types to support flexible workflow connections.
        """
        return {
            "required": {},
            "optional": {
                "reference_vid": ("IMAGE", {
                    "tooltip": "Reference video for comparison"
                }),
                "base_vid": ("IMAGE", {
                    "tooltip": "Base video input"
                }),
                "upscaled_vid": ("IMAGE", {
                    "tooltip": "Upscaled video for comparison"
                }),
            },
        }

    RETURN_TYPES = ()  # No outputs - this is a display-only node
    FUNCTION = "preview_videos"
    CATEGORY = "Utils"
    OUTPUT_NODE = True  # Makes this an output node that displays in the UI

    def preview_videos(self, reference_vid=None, base_vid=None, upscaled_vid=None):
        """
        Display the video inputs for preview.
        Accepts optional video inputs and prepares them for UI display.

        Args:
            reference_vid: Optional reference video (IMAGE type)
            base_vid: Optional base video (IMAGE type)
            upscaled_vid: Optional upscaled video (IMAGE type)

        Returns:
            Dictionary with UI data for display
        """
        # Log summary to console
        print("\n" + "="*60)
        print("VIDEO PREVIEW - Connected Inputs")
        print("="*60)

        connected_inputs = []

        if reference_vid is not None:
            print(f"📹 reference_vid: Connected (shape: {reference_vid.shape if hasattr(reference_vid, 'shape') else 'unknown'})")
            connected_inputs.append("reference_vid")

        if base_vid is not None:
            print(f"📹 base_vid: Connected (shape: {base_vid.shape if hasattr(base_vid, 'shape') else 'unknown'})")
            connected_inputs.append("base_vid")

        if upscaled_vid is not None:
            print(f"📹 upscaled_vid: Connected (shape: {upscaled_vid.shape if hasattr(upscaled_vid, 'shape') else 'unknown'})")
            connected_inputs.append("upscaled_vid")

        if not connected_inputs:
            print("\n(No video inputs connected)")

        print("\n" + "="*60 + "\n")

        # Return UI data - all values must be lists for ComfyUI
        return {
            "ui": {
                "connected_inputs": [connected_inputs],  # Wrap list in list
                "input_count": [len(connected_inputs)]   # Wrap int in list
            }
        }


# Export node class mapping
VIDEO_PREVIEW_NODE_CLASS_MAPPINGS = {
    "VideoPreview": VideoPreview
}

# Export display name mapping
VIDEO_PREVIEW_NODE_DISPLAY_NAME_MAPPINGS = {
    "VideoPreview": "🎬 Video Preview"
}
