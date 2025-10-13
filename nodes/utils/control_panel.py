"""
Control Panel Node - Displays comprehensive workflow information
"""


class ControlPanelOverview:
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


class ControlPanelPromptBreakdown:
    """
    A control panel node that displays prompt breakdown across 5 columns.
    Extracts and organizes prompt data into: subject, cinematic/aesthetic, 
    stylization/tone, clothing, scene, and movement categories.
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
        Display prompt breakdown organized into 5 columns.
        Parses the all_media_describe_data JSON and extracts prompt information.
        """
        import json
        
        # Log summary to console
        print("\n" + "="*60)
        print("CONTROL PANEL - Prompt Breakdown")
        print("="*60)
        
        all_media_data = kwargs.get("all_media_describe_data")
        
        if all_media_data:
            try:
                # Parse the JSON data
                if isinstance(all_media_data, str):
                    data = json.loads(all_media_data)
                else:
                    data = all_media_data
                
                # Extract description text
                description_text = ""
                if isinstance(data, dict):
                    description_text = data.get("description", "")
                
                # Split description into paragraphs (split by double newline)
                paragraphs = [p.strip() for p in description_text.split("\n\n") if p.strip()]
                
                # Map paragraphs to categories
                # 1st paragraph = subject
                # 2nd paragraph = cinematic/aesthetic
                # 3rd paragraph = stylization/tone
                # 4th paragraph = clothing
                # 5th paragraph = scene
                # 6th paragraph = movement
                prompt_breakdown = {
                    "subject": paragraphs[0] if len(paragraphs) > 0 else "",
                    "cinematic_aesthetic": paragraphs[1] if len(paragraphs) > 1 else "",
                    "stylization_tone": paragraphs[2] if len(paragraphs) > 2 else "",
                    "clothing": paragraphs[3] if len(paragraphs) > 3 else "",
                    "scene": paragraphs[4] if len(paragraphs) > 4 else "",
                    "movement": paragraphs[5] if len(paragraphs) > 5 else ""
                }
                
                # Log to console
                print(f"\n📊 Prompt Breakdown ({len(paragraphs)} paragraphs found):")
                print(f"  Subject: {prompt_breakdown['subject'][:100]}...")
                print(f"  Cinematic/Aesthetic: {prompt_breakdown['cinematic_aesthetic'][:100]}...")
                print(f"  Stylization/Tone: {prompt_breakdown['stylization_tone'][:100]}...")
                print(f"  Clothing: {prompt_breakdown['clothing'][:100]}...")
                print(f"  Scene: {prompt_breakdown['scene'][:100]}...")
                print(f"  Movement: {prompt_breakdown['movement'][:100]}...")
                
                # Return structured data for UI display in columns
                result = {
                    "ui": {
                        "prompt_breakdown": [json.dumps(prompt_breakdown)],
                        "raw_data": [all_media_data]  # Keep raw data for debugging
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
    "ControlPanelOverview": ControlPanelOverview,
    "ControlPanelPromptBreakdown": ControlPanelPromptBreakdown
}

# Export display name mapping
CONTROL_PANEL_NODE_DISPLAY_NAME_MAPPINGS = {
    "ControlPanelOverview": "🎛️ Control Panel Overview",
    "ControlPanelPromptBreakdown": "🎛️ Control Panel Prompt Breakdown"
}
