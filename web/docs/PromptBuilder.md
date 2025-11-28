# Prompt Builder

## Summary
Prompt Builder assembles paragraph-level overrides for Gemini prompts. Fill in whichever sections you want to replace, leave the rest blank, and the node emits a preview-ready string you can route to any downstream `STRING` input.

## Inputs
- `prefix` – Optional text placed before all other sections
- `subject` – Replacement SUBJECT paragraph
- `clothing` – Replacement CLOTHING paragraph
- `action` – Replacement ACTION paragraph (video)
- `scene` – Replacement SCENE paragraph (video)
- `visual_style` – Replacement VISUAL STYLE paragraph

## Output
- `positive_prompt` (`STRING`) – Preview-ready string built from populated sections with newline separators

## Usage Tips
- Leave fields blank to keep Gemini output for that section
- Wire upstream `STRING` nodes for dynamic overrides (templates, metadata, etc.)
- Display `positive_prompt` in Control Panel or logs to verify overrides before rendering
- Works for both image and video MediaDescribe variants

## Documentation
Full details: [`docs/nodes/prompt-builder/PROMPT_BUILDER.md`](../../docs/nodes/prompt-builder/PROMPT_BUILDER.md)
