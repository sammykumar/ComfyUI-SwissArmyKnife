"""
Control Panel Node - Displays comprehensive workflow information
"""


class ControlPanel:
    """
    A control panel node that displays all key information from the workflow.
    This node acts as a central dashboard showing data from connected nodes.
    Supports dynamic wildcard inputs that accept any data type.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define input fields that will be displayed on the control panel.
        Only accepts all_media_describe_data which contains all the workflow information.
        """
        return {
            "required": {},
            "optional": {
                "all_media_describe_data": ("STRING", {"forceInput": True}),
            },
        }

    RETURN_TYPES = ()  # No outputs - this is a display-only node
    FUNCTION = "display_info"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    OUTPUT_NODE = True  # Makes this an output node that displays in the UI

    def display_info(self, **kwargs):
        """
        Display all the workflow information on the control panel.
        Parses the all_media_describe_data JSON and returns structured data for UI display.
        """
        import json
        
        # Log summary to console
        print("\n" + "="*60)
        print("CONTROL PANEL - Workflow Information")
        print("="*60)
        
        all_media_data = kwargs.get("all_media_describe_data")
        
        # DEBUG: Print ALL kwargs to see what we're receiving
        print(f"\n🔍 DEBUG - All kwargs received:")
        for key, value in kwargs.items():
            print(f"  - {key}: {type(value).__name__} = {str(value)[:200]}")
        
        if all_media_data:
            try:
                # Parse the JSON data
                if isinstance(all_media_data, str):
                    data = json.loads(all_media_data)
                else:
                    data = all_media_data
                
                # Log to console
                print(f"\n📊 All Media Describe Data:")
                print(json.dumps(data, indent=2))
                
                # DOUBLE the output - return BOTH in ui dict
                result = {
                    "ui": {
                        "all_media_describe_data": [all_media_data],
                        "all_media_describe_data_copy": [all_media_data]  # Duplicate for redundancy
                    }
                }
                
                print(f"\n🔍 DEBUG - Returning to UI:")
                print(json.dumps(result, indent=2))
                
                return result
                
            except json.JSONDecodeError as e:
                print(f"\n❌ Error parsing JSON: {e}")
                print(f"Raw data: {all_media_data}")
                return {"ui": {"error": [f"Invalid JSON: {str(e)}"]}}
        else:
            print("\n(No all_media_describe_data connected)")
        
        print("\n" + "="*60 + "\n")
        
        return {"ui": {"status": ["No inputs connected"]}}


# Export node class mapping
CONTROL_PANEL_NODE_CLASS_MAPPINGS = {
    "ControlPanel": ControlPanel
}

# Export display name mapping
CONTROL_PANEL_NODE_DISPLAY_NAME_MAPPINGS = {
    "ControlPanel": "🎛️ Control Panel"
}
