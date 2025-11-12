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
        All inputs are optional STRING types containing video file paths.
        """
        return {
            "required": {},
            "optional": {
                "reference_vid": ("STRING", {
                    "default": "",
                    "tooltip": "Reference video file path for comparison"
                }),
                "base_vid": ("STRING", {
                    "default": "",
                    "tooltip": "Base video file path"
                }),
                "upscaled_vid": ("STRING", {
                    "default": "",
                    "tooltip": "Upscaled video file path for comparison"
                }),
            },
        }

    RETURN_TYPES = ()  # No outputs - this is a display-only node
    FUNCTION = "preview_videos"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    OUTPUT_NODE = True  # Makes this an output node that displays in the UI
    DESCRIPTION = (
        "Displays any combination of reference/base/upscaled video file paths in the custom JS preview so you can compare clips "
        "side-by-side without additional processing."
    )

    def preview_videos(self, reference_vid="", base_vid="", upscaled_vid=""):
        """
        Display the video inputs for preview.
        Accepts optional video file paths and prepares them for UI display.

        Args:
            reference_vid: Optional reference video file path (STRING)
            base_vid: Optional base video file path (STRING)
            upscaled_vid: Optional upscaled video file path (STRING)

        Returns:
            Dictionary with UI data for display
        """
        # Log summary to console
        print("\n" + "="*60)
        print("VIDEO PREVIEW - Connected Inputs")
        print("="*60)

        video_paths = {}
        connected_inputs = []

        if reference_vid and reference_vid.strip():
            print(f"📹 reference_vid: {reference_vid}")
            connected_inputs.append("reference_vid")
            video_paths["reference_vid"] = reference_vid

        if base_vid and base_vid.strip():
            print(f"📹 base_vid: {base_vid}")
            connected_inputs.append("base_vid")
            video_paths["base_vid"] = base_vid

        if upscaled_vid and upscaled_vid.strip():
            print(f"📹 upscaled_vid: {upscaled_vid}")
            connected_inputs.append("upscaled_vid")
            video_paths["upscaled_vid"] = upscaled_vid

        if not connected_inputs:
            print("\n(No video inputs connected)")

        print("\n" + "="*60 + "\n")

        # Return UI data - all values must be lists for ComfyUI
        return {
            "ui": {
                "video_paths": [video_paths],            # Dict of video paths
                "connected_inputs": [connected_inputs],  # List of connected input names
                "input_count": [len(connected_inputs)]   # Count of connected inputs
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
