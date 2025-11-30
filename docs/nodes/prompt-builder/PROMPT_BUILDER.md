# Prompt Builder Node

Builds paragraph-level overrides for Gemini-based workflows. The node gathers optional sections (subject, clothing, action, scene, visual style) plus a prefix, outputs a formatted preview string, and leaves any blank field untouched so Gemini output can fill the gap downstream.

## Features

- **Paragraph granularity** – Override any combination of paragraphs without rewriting the whole description
- **Preview output** – `positive_prompt` mirrors exactly what will be sent downstream for quick review/logging
- **Non-destructive overrides** – Empty inputs remain untouched so Gemini output passes through unchanged
- **Workflow-friendly** – All inputs accept upstream `STRING` connections, letting you feed prompt fragments from other nodes or templates

## Inputs

| Name | Type | Description |
| --- | --- | --- |
| `prefix` | STRING | Optional text inserted before every overridden paragraph (i.e., setup instructions) |
| `subject` | STRING | Replacement for the SUBJECT paragraph |
| `clothing` | STRING | Replacement for CLOTHING paragraph |
| `action` | STRING | Replacement for ACTION paragraph (video only). Still emits the legacy `override_movement` key for backward compatibility. |
| `scene` | STRING | Replacement for SCENE paragraph (video only) |
| `visual_style` | STRING | Replacement for VISUAL STYLE paragraph (cinematic/stylization/tone) |

All inputs default to blank strings and are fully optional.

## Output

| Name | Type | Description |
| --- | --- | --- |
| `positive_prompt` | STRING | Preview string that concatenates populated sections with single newline separators |

## Usage

1. Drop the **Prompt Builder** node anywhere in your workflow (under `Swiss Army Knife 🔪/Prompt Tools`).
2. Enter any sections you wish to override. Leave fields blank to keep Gemini output untouched.
3. Optionally wire upstream `STRING` nodes (e.g., templates, metadata) into any field to automate overrides.
4. (Optional) Use `positive_prompt` to feed dashboards, logs, conditioning inputs, or filename generators for transparency.

## Prompt Assembly Logic

- Prefix is trimmed and added first if present.
- Each override field is trimmed; non-empty values are appended downstream separated by single newline characters.
- The preview string mirrors this ordering, giving you a deterministic representation of what will be sent to Gemini/LLM nodes.

## Troubleshooting

| Issue | Resolution |
| --- | --- |
| Blank preview string | All fields are empty; populate at least one section or prefix. |
| Unexpected newline formatting | Preview output inserts single newlines between populated sections. Trim/replace in downstream nodes if you need custom spacing. |

## Integration Notes

- Feed `positive_prompt` into any downstream `STRING` input such as conditioning nodes, Control Panel displays, or logging helpers.
- Works alongside the Control Panel node—`positive_prompt` can be surfaced in dashboards or metadata logs.
- You can chain multiple Prompt Builders by wiring `positive_prompt` into another builder's field for layered templating.

## Related Documentation

- [Structured Output Implementation](../lm-studio-describe/STRUCTURED_OUTPUT_IMPLEMENTATION.md) – Understand how paragraph fields are structured downstream
- [Control Panel Node](../control-panel/CONTROL_PANEL.md) – Display prompt summaries alongside render metadata
- [Web Help Page](../../web/docs/PromptBuilder.md) – In-app summary shown inside ComfyUI
