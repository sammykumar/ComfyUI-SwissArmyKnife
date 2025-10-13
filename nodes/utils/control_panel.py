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
        print("\n🔍 DEBUG - All kwargs received:")
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
                print("\n📊 All Media Describe Data:")
                print(json.dumps(data, indent=2))

                # DOUBLE the output - return BOTH in ui dict
                result = {
                    "ui": {
                        "all_media_describe_data": [all_media_data],
                        "all_media_describe_data_copy": [all_media_data]  # Duplicate for redundancy
                    }
                }

                print("\n🔍 DEBUG - Returning to UI:")
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
        Accepts positive_prompt_json which contains structured JSON response from Gemini.
        """
        return {
            "required": {},
            "optional": {
                "positive_prompt_json": ("STRING", {"forceInput": True, "tooltip": "Positive prompt JSON data"}),
            },
        }

    RETURN_TYPES = ()  # No outputs - this is a display-only node
    FUNCTION = "display_info"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    OUTPUT_NODE = True  # Makes this an output node that displays in the UI

    def display_info(self, **kwargs):
        """
        Display prompt breakdown organized into 6 columns.
        Parses the positive_prompt_json structured JSON response.
        """
        import json

        # Log summary to console
        print("\n" + "="*60)
        print("CONTROL PANEL - Prompt Breakdown")
        print("="*60)

        # Get input data
        positive_prompt_json = kwargs.get("positive_prompt_json")

        prompt_breakdown = {
            "subject": "",
            "clothing": "",
            "movement": "",
            "scene": "",
            "cinematic_aesthetic": "",
            "stylization_tone": ""
        }

        # Parse JSON input
        if positive_prompt_json:
            try:
                print(f"\n🔍 Parsing positive_prompt_json (structured JSON)")

                # Parse the JSON data
                if isinstance(positive_prompt_json, str):
                    gemini_data = json.loads(positive_prompt_json)
                else:
                    gemini_data = positive_prompt_json

                # Extract fields from JSON (supporting both video and image field names)
                prompt_breakdown["subject"] = gemini_data.get("subject", "")
                prompt_breakdown["clothing"] = gemini_data.get("clothing", "")
                prompt_breakdown["movement"] = gemini_data.get("movement", "")
                prompt_breakdown["scene"] = gemini_data.get("scene", "")

                # Support both field name formats for cinematic aesthetic
                prompt_breakdown["cinematic_aesthetic"] = gemini_data.get(
                    "cinematic_aesthetic_control", 
                    gemini_data.get("cinematic_aesthetic", "")
                )

                prompt_breakdown["stylization_tone"] = gemini_data.get("stylization_tone", "")

                print("✅ Successfully parsed structured JSON from Gemini")

            except json.JSONDecodeError as e:
                print(f"\n❌ Error parsing positive_prompt_json: {e}")
                print(f"Raw data: {positive_prompt_json}")
                return {"ui": {"error": [f"Invalid JSON: {str(e)}"]}}

        # Log to console
        if prompt_breakdown["subject"] or prompt_breakdown["cinematic_aesthetic"]:
            print("\n📊 Prompt Breakdown:")
            print(f"  Subject: {prompt_breakdown['subject'][:100]}...")
            print(f"  Clothing: {prompt_breakdown['clothing'][:100]}...")
            print(f"  Movement: {prompt_breakdown['movement'][:100]}...")
            print(f"  Scene: {prompt_breakdown['scene'][:100]}...")
            print(f"  Cinematic/Aesthetic: {prompt_breakdown['cinematic_aesthetic'][:100]}...")
            print(f"  Stylization/Tone: {prompt_breakdown['stylization_tone'][:100]}...")

            # Return structured data for UI display in columns
            result = {
                "ui": {
                    "prompt_breakdown": [json.dumps(prompt_breakdown)],
                    "raw_data": [positive_prompt_json]  # Keep raw data for debugging
                }
            }

            print("\n🔍 DEBUG - Returning to UI:")
            print(json.dumps(result, indent=2))

            return result
        else:
            print(f"\n(No valid data found in positive_prompt_json)")

        print("\n" + "="*60 + "\n")

        return {"ui": {"status": ["No JSON input connected"]}}


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
