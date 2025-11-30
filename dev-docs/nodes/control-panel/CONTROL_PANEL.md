# Control Panel Prompt Nodes

## Status Update (November 30, 2025)
- The legacy **ControlPanelOverview** node has been removed. Its functionality overlapped with the ComfyUI viewer widgets and became redundant once the LM Studio nodes started exposing richer `json_output` fields.
- **ControlPanelPromptBreakdown** remains and continues to be the supported control panel node. It focuses on presenting the structured prompt JSON coming from `LLMStudioStructuredDescribe` / `LLMStudioStructuredVideoDescribe`.

## Active Node: ControlPanelPromptBreakdown
| Attribute | Details |
| --- | --- |
| **Category** | `Swiss Army Knife 🔪/Utils` |
| **Inputs** | `positive_prompt_json` (`STRING`, optional, force input) – expects the `json_output` from LM Studio nodes |
| **Outputs** | UI dictionary only (`{"ui": {"prompt_breakdown": [...]}}`) – no tensor outputs |
| **Purpose** | Split the structured Gemini/LM Studio prompt into five columns (subject, clothing, movement, scene, visual_style) so artists can audit overrides quickly |

### Data Flow
```
LM Studio Structured Describe ──▶ ControlPanelPromptBreakdown
        json_output                   positive_prompt_json
            │                                  │
            ├─ (ui) prompt_breakdown JSON ─────┘ → DOM widget renders 5 columns
```

### Backend Implementation
- `nodes/utils/control_panel.py`
  - Class: `ControlPanelPromptBreakdown`
  - Function: `display_info`
  - Logs with `Logger("ControlPanelPromptBreakdown")` so messages only appear when DEBUG mode is enabled (`DEBUG=true` env or Swiss Army Knife → Settings → Debug toggle).

### Frontend Implementation
- `web/js/swiss-army-knife.js`
  - `beforeRegisterNodeDef` hook registers the DOM widget when `nodeData.name === "ControlPanelPromptBreakdown"`.
  - Adds five resizable columns with headings plus `Awaiting execution…` placeholders.
  - `updatePromptBreakdownData()` tries `prompt_breakdown`, `all_media_describe_data`, and `all_media_describe_data_copy` to remain backward compatible with legacy JSON shapes.
  - `onExecuted` pipes `message.output` straight into `updatePromptBreakdownData`.

## Debugging Checklist
1. **Confirm upstream JSON**
   - Add a `Note` node or ComfyUI built-in text output to the LM Studio node’s `json_output`.
   - Validate that the JSON contains `subject`, `clothing`, `movement`, `scene`, and `visual_style` keys.
2. **Enable DEBUG logs**
   ```bash
   DEBUG=true python main.py  # or set the Swiss Army Knife debug toggle in the UI
   ```
   - Look for `[ControlPanelPromptBreakdown DEBUG]` messages to verify parsing and assignment per column.
3. **Browser console**
   - Open DevTools → Console.
   - Filter for `ControlPanelPromptBreakdown` to ensure `onExecuted` fires and data arrives.
4. **Widget rendering issues**
   - The DOM widget width is tied to `nodeType.prototype.onResize`. If the layout looks truncated, drag the node wider; the script recalculates widths each time `onResize` runs.

## Testing Steps
1. Wire `LLMStudioStructuredDescribe.json_output` to `ControlPanelPromptBreakdown.positive_prompt_json`.
2. Queue the workflow. Expect each column to show the matching paragraph after execution.
3. Delete one field from the JSON and rerun to verify the widget shows `(empty)` for that column.
4. Disable DEBUG mode and confirm the node still renders (logs should be silent).

## Future Enhancements
1. **Column composer** – Allow creators to choose which JSON keys map to columns.
2. **Clipboard helpers** – Quick copy buttons per column for prompt iteration.
3. **Collapsible sections** – Collapse long sections (e.g., scene) to save vertical space.

## Related Documentation
- [dev-docs/web-js/CONTROL_PANEL_PROMPT_BREAKDOWN_JSON_UPDATE.md](../../web-js/CONTROL_PANEL_PROMPT_BREAKDOWN_JSON_UPDATE.md) – chronicle of the JSON parsing changes.
- [dev-docs/nodes/lm-studio-describe/](../lm-studio-describe/) – source of the structured prompt schema.
- [web/docs/ControlPanelPromptBreakdown.md](../../../web/docs/ControlPanelPromptBreakdown.md) – user-facing help page that mirrors this information.
