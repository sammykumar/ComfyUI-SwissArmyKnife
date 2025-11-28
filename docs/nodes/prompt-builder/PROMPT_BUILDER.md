# Prompt Builder Node

Builds paragraph-level overrides for Gemini-based MediaDescribe pipelines. The node gathers optional sections (subject, visual style, clothing, scene, action) plus a prefix, outputs a formatted preview string, and emits the `OVERRIDES` dictionary that MediaDescribe expects. Empty inputs simply fall back to Gemini's generated paragraphs, so you only have to touch the sections you want to customize.

## Features

- **Paragraph granularity** – Override any combination of MediaDescribe paragraphs without rewriting the whole description
- **Preview output** – `prompt_text` mirrors exactly what will be sent downstream for quick review/logging
- **Non-destructive overrides** – Empty inputs remain untouched so Gemini output passes through unchanged
- **MediaDescribe compatible** – Uses the same `OVERRIDES` schema as the existing Media Describe Overrides node
- **Workflow-friendly** – All inputs accept upstream `STRING` connections, letting you feed prompt fragments from other nodes or templates

## Inputs

| Name | Type | Description |
| --- | --- | --- |
| `prompt_prefix` | STRING | Optional text inserted before every overridden paragraph (i.e., setup instructions) |
| `override_subject` | STRING | Replacement for the SUBJECT paragraph |
| `override_visual_style` | STRING | Replacement for VISUAL STYLE paragraph (cinematic/stylization/tone) |
| `override_clothing` | STRING | Replacement for CLOTHING paragraph |
| `override_scene` | STRING | Replacement for SCENE paragraph (video only) |
| `override_action` | STRING | Replacement for ACTION paragraph (video only). Emits the legacy `override_movement` key as well for backward compatibility. |

All inputs default to blank strings and are fully optional.

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `prompt_text` | STRING | Preview string that concatenates prefix + populated sections separated by blank lines |
| `overrides` | OVERRIDES | Dictionary ready to connect directly into MediaDescribe's `overrides` input |

## Usage

1. Drop the **Prompt Builder** node anywhere in your workflow (under `Swiss Army Knife 🔪/Prompt Tools`).
2. Enter any sections you wish to override. Leave fields blank to keep Gemini output untouched.
3. Optionally wire upstream `STRING` nodes (e.g., templates, metadata) into any field to automate overrides.
4. Connect the `overrides` output to the `overrides` input on the MediaDescribe node.
5. (Optional) Use `prompt_text` to feed dashboards, logs, or filename generators for transparency.

## Prompt Assembly Logic

- Prefix is trimmed and appended first if present.
- Each override field is trimmed; non-empty values are appended downstream separated by blank lines.
- The preview string mirrors this ordering, giving you a deterministic representation of what will be sent to Gemini/LLM nodes.
- The OVERRIDES dictionary preserves raw (untrimmed) strings so downstream nodes can decide how to handle whitespace.

## Troubleshooting

| Issue | Resolution |
| --- | --- |
| Override not taking effect | Ensure the field is non-empty and the `overrides` output connects directly to MediaDescribe. Check the Control Panel JSON for final override state. |
| Blank preview string | All fields are empty; populate at least one section or prefix. |
| Unexpected newline formatting | Preview output inserts double newlines between populated sections. Trim/replace in downstream nodes if you need custom spacing. |

## Integration Notes

- Compatible with both MediaDescribe image and video variants since it reuses the shared OVERRIDES structure.
- Works alongside the Control Panel node—`prompt_text` can be surfaced in dashboards or metadata logs.
- You can chain multiple Prompt Builders by wiring `prompt_text` into another builder's field for layered templating.

## Related Documentation

- [Media Describe Node](../media-describe/MEDIA_DESCRIBE.md) – Full details on how overrides are consumed
- [Control Panel Node](../control-panel/CONTROL_PANEL.md) – Display prompt summaries alongside render metadata
- [Web Help Page](../../web/docs/PromptBuilder.md) – In-app summary shown inside ComfyUI
