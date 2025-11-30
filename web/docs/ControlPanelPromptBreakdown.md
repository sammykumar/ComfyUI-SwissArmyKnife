# ControlPanelPromptBreakdown
Focused control panel that splits the positive prompt JSON into columns (subject, clothing, movement, scene, visual style).

## Inputs
- Optional `positive_prompt_json` string from the LM Studio structured describe nodes (wire their `json_output`).

## Outputs
- Display-only UI breakdown shown in the Control Panel.

## Usage Tips
1. Connect the structured prompt JSON output from the LM Studio describe nodes.
2. Use the table to quickly tweak overrides when iterating on style guidance.

## Additional Resources
- [Full documentation](docs/nodes/control-panel/README.md#prompt-breakdown)
