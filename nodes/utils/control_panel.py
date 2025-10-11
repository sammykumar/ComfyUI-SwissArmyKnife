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
        Accepts any keyword arguments from connected inputs.
        Logs a summary to the console and returns data for UI display.
        """
        # Log summary to console
        print("\n" + "="*60)
        print("CONTROL PANEL - Workflow Information")
        print("="*60)
        
        if kwargs:
            for key, value in kwargs.items():
                # Truncate long strings for console display
                if isinstance(value, str) and len(value) > 200:
                    display_value = value[:200] + "..."
                else:
                    display_value = value
                
                print(f"\n📊 {key}:\n{display_value}")
        else:
            print("\n(No inputs connected)")
        
        print("\n" + "="*60 + "\n")
        
        # Return data in format that JavaScript can read from message.output
        # Convert all values to lists (ComfyUI convention)
        ui_data = {}
        for key, value in kwargs.items():
            ui_data[key] = [value] if not isinstance(value, list) else value
        
        return {"ui": ui_data if ui_data else {"status": ["No inputs connected"]}}


# Export node class mapping
CONTROL_PANEL_NODE_CLASS_MAPPINGS = {
    "ControlPanel": ControlPanel
}

# Export display name mapping
CONTROL_PANEL_NODE_DISPLAY_NAME_MAPPINGS = {
    "ControlPanel": "🎛️ Control Panel"
}
