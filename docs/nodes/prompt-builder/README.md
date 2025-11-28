# Prompt Builder Node - Quick Reference

Assemble paragraph-level overrides for MediaDescribe outputs or any other prompt consumer.

## Quick Start

1. Connect upstream text inputs (manually typed or from nodes).
2. Fill only the sections you want to override; leave others blank to keep Gemini output.
3. Use `prompt_text` for preview/logging and connect `overrides` to MediaDescribe.

## Inputs

- `prompt_prefix` – Text prepended before other sections
- `override_subject` – Replacement for SUBJECT paragraph
- `override_visual_style` – Replacement for VISUAL STYLE paragraph
- `override_clothing` – Replacement for CLOTHING paragraph
- `override_scene` – Replacement for SCENE paragraph (video)
- `override_action` – Replacement for ACTION paragraph (video)

## Outputs

- `prompt_text` (`STRING`) – Preview-ready prompt string
- `overrides` (`OVERRIDES`) – Dictionary compatible with MediaDescribe

## Full Documentation

See [PROMPT_BUILDER.md](./PROMPT_BUILDER.md) for detailed behavior, wiring examples, and troubleshooting.
