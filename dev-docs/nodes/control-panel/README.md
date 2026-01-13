# Control Panel Node Documentation

## Files
- **[CONTROL_PANEL.md](CONTROL_PANEL.md)** – canonical implementation details for `ControlPanelPromptBreakdown` (backend + frontend)
- **CONTROL_PANEL_DATA_POPULATION_DEBUG.md** – archived notes from the retired `ControlPanelOverview` node (kept only for historical troubleshooting of legacy workflows)

## Active Node Summary
| Property | Value |
| --- | --- |
| **Name** | `ControlPanelPromptBreakdown` |
| **Category** | Swiss Army Knife 🔪/Utils |
| **Inputs** | `positive_prompt_json` (`STRING`, optional, force input) |
| **Outputs** | UI-only (`{"ui": {"prompt_breakdown": [...]}}`) |
| **Status** | Stable |

### Purpose
Render the structured prompt JSON from LM Studio nodes into five digestible columns (Subject, Clothing, Movement, Scene, Visual Style). It is the fastest way to sanity-check overrides before feeding prompts downstream.

### Input Schema Expectations
- Source JSON: `LLMStudioStructuredDescribe.json_output` or `LLMStudioStructuredVideoDescribe.json_output`
- Required keys: `subject`, `clothing`, `movement`, `scene`, `visual_style`
- Backward compatibility: still inspects `all_media_describe_data`/`prompt_breakdown` arrays so older saved workflows can load without edits.

### Output Behavior
- The node does **not** emit tensors. Instead it returns a `ui` dictionary that ComfyUI reads to populate the DOM widget created in `web/js/swiss-army-knife.js`.
- Missing keys render as `(empty)` so artists know which paragraphs need overrides.

## Implementation Locations
- **Backend**: `nodes/utils/control_panel.py` → `ControlPanelPromptBreakdown.display_info`
- **Frontend**: `web/js/swiss-army-knife.js` → `beforeRegisterNodeDef` handler for `ControlPanelPromptBreakdown`

## Data Flow Overview
```
LLMStudioStructuredDescribe ──▶ ControlPanelPromptBreakdown
       json_output                  positive_prompt_json
           │                               │
           └─────────────── JSON string ───┘
                                   │
                         Python parses JSON
                                   │
                        {"ui": {"prompt_breakdown": [...]}}
                                   │
                     JS updatePromptBreakdownData()
                                   │
                        DOM columns render text
```

## Related Nodes
- **LM Studio Structured Describe (Image/Video)** – produces the JSON consumed here
- **Control Panel Prompt Breakdown (web/docs)** – user-facing help that mirrors the developer view
- **Media Selection** – typically precedes LM Studio nodes and controls which asset is being described

## Troubleshooting Quick Hits
1. **No columns populated** → Confirm the JSON actually reaches the node (`DEBUG=true` and check `[ControlPanelPromptBreakdown DEBUG]` logs).
2. **Columns show `(No data available)`** → The upstream JSON is empty or missing required keys. Verify the LM Studio node executed successfully.
3. **Widget squashed** → Drag the node wider; the DOM widget recomputes widths on every resize.
4. **Legacy workflows** → If an ancient workflow still references `ControlPanelOverview`, replace it with `ControlPanelPromptBreakdown` or remove the node entirely.

## Future Ideas
- Column selector (let artists pick which JSON keys to visualize)
- Copy-to-clipboard buttons per column
- Optional markdown rendering for the visual style column
