# Prompt Builder Node - Quick Reference

Assemble paragraph-level overrides for the structured describe outputs or any other prompt consumer.

## Quick Start

1. Connect upstream text inputs (manually typed or from nodes).
2. Fill only the sections you want to override; leave others blank to keep Gemini output.
3. Use `positive_prompt` anywhere you need a final assembled prompt (Control Panel, loggers, conditioning nodes, etc.).

## Inputs

- `prefix` – Text prepended before other sections
- `subject` – Replacement for SUBJECT paragraph
- `clothing` – Replacement for CLOTHING paragraph
- `action` – Replacement for ACTION paragraph (video)
- `scene` – Replacement for SCENE paragraph (video)
- `visual_style` – Replacement for VISUAL STYLE paragraph

## Output

- `positive_prompt` (`STRING`) – Preview-ready prompt string with newline separators

## Full Documentation

See [PROMPT_BUILDER.md](./PROMPT_BUILDER.md) for detailed behavior, wiring examples, and troubleshooting.
