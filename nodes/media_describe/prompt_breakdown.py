"""
Media Describe - Prompt Breakdown Node

Displays a formatted breakdown of all paragraph outputs from MediaDescribe node.
This is a display-only node with no outputs.
"""

class MediaDescribePromptBreakdown:
    """
    Display node that shows a formatted breakdown of MediaDescribe paragraph outputs.
    
    This node accepts the all_media_describe_data JSON output from MediaDescribe
    and displays each paragraph with proper headings in an organized control panel.
    """
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "all_media_describe_data": ("STRING", {
                    "forceInput": True,
                    "tooltip": "Connect to MediaDescribe's all_media_describe_data output"
                })
            }
        }
    
    RETURN_TYPES = ()
    OUTPUT_NODE = True
    FUNCTION = "display_breakdown"
    CATEGORY = "Swiss Army Knife 🔪/Media Caption"
    
    def display_breakdown(self, all_media_describe_data):
        """
        Process the JSON data for display.
        The actual display happens in the JavaScript UI widget.
        
        Args:
            all_media_describe_data: JSON string containing paragraph data
            
        Returns:
            Dict with ui key containing the data for JavaScript to display
        """
        # Return the data in the ui field so JavaScript can access it
        # This is the standard way ComfyUI passes data to frontend widgets
        return {
            "ui": {
                "all_media_describe_data": [all_media_describe_data]
            }
        }
