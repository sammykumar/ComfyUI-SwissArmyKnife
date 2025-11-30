"""
Control Panel Node - Displays comprehensive workflow information
"""

from ..debug_utils import Logger


_overview_logger = Logger("ControlPanelOverview")
_prompt_logger = Logger("ControlPanelPromptBreakdown")


def _log_section(logger, title):
    logger.debug(f"\n{'=' * 60}\n{title}\n{'=' * 60}")


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
    DESCRIPTION = (
        "Displays the full `all_media_describe_data` JSON inside ComfyUI’s Control Panel so you can audit structured describe "
        "outputs without leaving the workflow."
    )

    def display_info(self, **kwargs):
        """
        Display all the workflow information on the control panel.
        Parses the all_media_describe_data JSON and returns structured data for UI display.
        """
        import json

        _log_section(_overview_logger, "CONTROL PANEL - Workflow Information")

        all_media_data = kwargs.get("all_media_describe_data")

        _overview_logger.debug("\n🔍 DEBUG - All kwargs received:")
        for key, value in kwargs.items():
            _overview_logger.debug(
                f"  - {key}: {type(value).__name__} = {str(value)[:200]}"
            )

        if all_media_data:
            try:
                # Parse the JSON data
                if isinstance(all_media_data, str):
                    data = json.loads(all_media_data)
                else:
                    data = all_media_data

                _overview_logger.debug("\n📊 All Media Describe Data:")
                _overview_logger.debug(json.dumps(data, indent=2))

                # DOUBLE the output - return BOTH in ui dict
                result = {
                    "ui": {
                        "all_media_describe_data": [all_media_data],
                        "all_media_describe_data_copy": [all_media_data]  # Duplicate for redundancy
                    }
                }

                _overview_logger.debug("\n🔍 DEBUG - Returning to UI:")
                _overview_logger.debug(json.dumps(result, indent=2))

                return result

            except json.JSONDecodeError as e:
                _overview_logger.error(f"Error parsing JSON: {e}")
                _overview_logger.error(f"Raw data: {all_media_data}")
                return {"ui": {"error": [f"Invalid JSON: {str(e)}"]}}
        else:
            _overview_logger.debug("\n(No all_media_describe_data connected)")

        _overview_logger.debug("\n" + "="*60 + "\n")

        return {"ui": {"status": ["No inputs connected"]}}


class ControlPanelPromptBreakdown:
    """
    A control panel node that displays prompt breakdown across 5 columns.
    Extracts and organizes prompt data into: subject, clothing, movement, 
    scene, and visual_style categories (unified from cinematic/aesthetic and stylization/tone).
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
    DESCRIPTION = (
        "Breaks the structured positive prompt JSON into columns (subject, clothing, movement, scene, visual style) for quick "
        "review while iterating on overrides."
    )

    def display_info(self, **kwargs):
        """
        Display prompt breakdown organized into 6 columns.
        Parses the positive_prompt_json structured JSON response.
        """
        import json

        _log_section(_prompt_logger, "CONTROL PANEL - Prompt Breakdown")

        # Get input data
        positive_prompt_json = kwargs.get("positive_prompt_json")

        prompt_breakdown = {
            "subject": "",
            "clothing": "",
            "movement": "",
            "scene": "",
            "visual_style": ""
        }

        # Parse JSON input
        if positive_prompt_json:
            try:
                _prompt_logger.debug("\n🔍 Parsing positive_prompt_json (structured JSON)")

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

                # Extract the unified visual_style field (supports legacy field names for backward compatibility)
                prompt_breakdown["visual_style"] = gemini_data.get(
                    "visual_style", 
                    gemini_data.get("cinematic_aesthetic_control", 
                        gemini_data.get("cinematic_aesthetic", 
                            gemini_data.get("stylization_tone", "")
                        )
                    )
                )

                _prompt_logger.debug("✅ Successfully parsed structured JSON from Gemini")

            except json.JSONDecodeError as e:
                _prompt_logger.error(f"Error parsing positive_prompt_json: {e}")
                _prompt_logger.error(f"Raw data: {positive_prompt_json}")
                return {"ui": {"error": [f"Invalid JSON: {str(e)}"]}}

        # Log to console
        if prompt_breakdown["subject"] or prompt_breakdown["visual_style"]:
            _prompt_logger.debug("\n📊 Prompt Breakdown:")
            _prompt_logger.debug(f"  Subject: {prompt_breakdown['subject'][:100]}...")
            _prompt_logger.debug(f"  Clothing: {prompt_breakdown['clothing'][:100]}...")
            _prompt_logger.debug(f"  Movement: {prompt_breakdown['movement'][:100]}...")
            _prompt_logger.debug(f"  Scene: {prompt_breakdown['scene'][:100]}...")
            _prompt_logger.debug(f"  Visual Style: {prompt_breakdown['visual_style'][:100]}...")

            # Return structured data for UI display in columns
            result = {
                "ui": {
                    "prompt_breakdown": [json.dumps(prompt_breakdown)],
                    "raw_data": [positive_prompt_json]  # Keep raw data for debugging
                }
            }

            _prompt_logger.debug("\n🔍 DEBUG - Returning to UI:")
            _prompt_logger.debug(json.dumps(result, indent=2))

            return result
        else:
            _prompt_logger.debug("\n(No valid data found in positive_prompt_json)")

        _prompt_logger.debug("\n" + "="*60 + "\n")

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
