# Prompt Builder

## Summary
Prompt Builder assembles paragraph-level overrides for MediaDescribe. Fill in whichever sections you want to replace, leave the rest blank, and the node emits both a preview string and the `OVERRIDES` dictionary MediaDescribe expects.

## Inputs
- `prompt_prefix` – Optional text placed before all other sections
- `override_subject` – Replacement SUBJECT paragraph
- `override_visual_style` – Replacement VISUAL STYLE paragraph
- `override_clothing` – Replacement CLOTHING paragraph
- `override_scene` – Replacement SCENE paragraph (video)
- `override_action` – Replacement ACTION paragraph (video)

## Outputs
- `prompt_text` (`STRING`) – Preview-ready string built from populated sections
- `overrides` (`OVERRIDES`) – Dictionary that plugs into MediaDescribe's `overrides` input

## Usage Tips
- Leave fields blank to keep Gemini output for that section
- Wire upstream `STRING` nodes for dynamic overrides (templates, metadata, etc.)
- Display `prompt_text` in Control Panel or logs to verify overrides before rendering
- Works for both image and video MediaDescribe variants

## Documentation
Full details: [`docs/nodes/prompt-builder/PROMPT_BUILDER.md`](../../docs/nodes/prompt-builder/PROMPT_BUILDER.md)
