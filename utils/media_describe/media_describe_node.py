"""
Media Describe Node for ComfyUI-SwissArmyKnife

A ComfyUI custom node for describing media using various caption models.
"""


class MediaDescribe:
    """
    A ComfyUI custom node for describing media using various caption models.
    This is the skeleton implementation that will be expanded upon.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "caption_model": ("STRING", {
                    "default": "default_model",
                    "tooltip": "Caption model to use for media description"
                }),
            },
            "optional": {
                # Additional inputs can be added here later
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("description", "media_info", "gemini_status", "processed_media_path", "final_string")
    FUNCTION = "describe_media"
    CATEGORY = "Swiss Army Knife 🔪"

    def describe_media(self, caption_model):
        """
        Process media and generate description using the specified caption model.
        This is a skeleton implementation that will be expanded upon.

        Args:
            caption_model: The caption model to use for generating descriptions

        Returns:
            tuple: (description, media_info, gemini_status, processed_media_path, final_string)
        """
        try:
            # Skeleton implementation - to be expanded
            description = f"Media description generated using {caption_model}"
            media_info = "📷 Media Processing Info (Skeleton):\n• Caption Model: " + caption_model
            gemini_status = "🤖 Media Describe Status: ✅ Skeleton Implementation"
            processed_media_path = ""
            final_string = description

            return (description, media_info, gemini_status, processed_media_path, final_string)

        except Exception as e:
            # Re-raise the exception to stop workflow execution
            raise Exception(f"Media description failed: {str(e)}")