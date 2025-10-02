"""
Control Panel Node - Displays comprehensive workflow information
"""


class ControlPanel:
    """
    A control panel node that displays all key information from the workflow.
    This node acts as a central dashboard showing description, media info, 
    processing status, and final outputs in one place.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define all input fields that will be displayed on the control panel.
        All inputs are optional to allow flexible connections.
        """
        return {
            "optional": {
                "description": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Description of the media content"
                }),
                "media_info": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Metadata and information about the source media"
                }),
                "gemini_status": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "Status of Gemini API processing"
                }),
                "processed_media_path": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "File path to the processed media"
                }),
                "final_string": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Final output string from processing"
                }),
                "height": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 10000,
                    "tooltip": "Height of the media in pixels"
                }),
                "width": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 10000,
                    "tooltip": "Width of the media in pixels"
                }),
            }
        }

    RETURN_TYPES = ()  # No outputs - this is a display-only node
    FUNCTION = "display_info"
    CATEGORY = "Utils"
    OUTPUT_NODE = True  # Makes this an output node that displays in the UI

    def display_info(
        self, 
        description="", 
        media_info="", 
        gemini_status="", 
        processed_media_path="", 
        final_string="", 
        height=0, 
        width=0
    ):
        """
        Display all the workflow information on the control panel.
        Logs a summary to the console and returns nothing (display only).
        """
        # Log summary to console
        print("\n" + "="*60)
        print("CONTROL PANEL - Workflow Information")
        print("="*60)
        
        if description:
            print(f"\n📝 Description:\n{description[:200]}{'...' if len(description) > 200 else ''}")
        
        if media_info:
            print(f"\n📊 Media Info:\n{media_info[:200]}{'...' if len(media_info) > 200 else ''}")
        
        if gemini_status:
            print(f"\n🔄 Gemini Status: {gemini_status}")
        
        if processed_media_path:
            print(f"\n📁 Processed Media: {processed_media_path}")
        
        if final_string:
            print(f"\n✨ Final String:\n{final_string[:200]}{'...' if len(final_string) > 200 else ''}")
        
        if height > 0 or width > 0:
            print(f"\n📐 Dimensions: {width} x {height}")
        
        print("\n" + "="*60 + "\n")
        
        # Return empty dict for UI representation
        return {"ui": {
            "description": [description],
            "media_info": [media_info],
            "gemini_status": [gemini_status],
            "processed_media_path": [processed_media_path],
            "final_string": [final_string],
            "dimensions": [f"{width} x {height}"]
        }}


# Export node class mapping
CONTROL_PANEL_NODE_CLASS_MAPPINGS = {
    "ControlPanel": ControlPanel
}

# Export display name mapping
CONTROL_PANEL_NODE_DISPLAY_NAME_MAPPINGS = {
    "ControlPanel": "🎛️ Control Panel"
}
