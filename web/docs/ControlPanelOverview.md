# ControlPanelOverview
Dashboard-style output that renders the full `all_media_describe_data` JSON so you can audit everything Gemini/LM Studio produced.

## Inputs
- Optional `all_media_describe_data` string (connect the LM Studio structured describe node's `json_output` here).

## Outputs
- Display-only node that surfaces the JSON inside the UI's Control Panel tab.

## Usage Tips
1. Drop the node anywhere in the workflow and connect your structured describe node's `json_output`.
2. Open the Control Panel sidebar to see structured cards for each section.

## Additional Resources
- [Full documentation](docs/nodes/control-panel/README.md)
