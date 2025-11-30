# Media Selection Node - README

## Overview

The Media Selection node centralizes all media ingestion logic for SwissArmyKnife workflows. It pulls images or videos from uploads, folders, or Reddit, normalizes dimensions/metadata, and hands off a clean path for downstream nodes.

## 📄 Documentation

- **[MEDIA_SELECTION.md](MEDIA_SELECTION.md)** – Complete documentation, workflows, and troubleshooting

## Node Summary

- **Category**: Swiss Army Knife 🔪/Input
- **Purpose**: Gather media without invoking AI processing
- **Outputs**: `media_path`, `media_type`, `media_info`, `height`, `width`, `duration`, `fps`

## Highlights

- Unified upload widgets for both image and video inputs
- Randomization support with deterministic seeding
- Reddit download pipeline with redgifs handling and caching
- Resize/trimming controls that keep metadata accurate
- JSON summary for dashboards or downstream automations

## Example Workflow

1. **Media Selection** – choose source + resizing rules  
2. **LM Studio Structured Describe** – analyze the normalized file  
3. **Control Panel** – display the resulting JSON/prompt data

## Related Docs

- [Structured Output Implementation](../lm-studio-describe/STRUCTURED_OUTPUT_IMPLEMENTATION.md) – consumes the outputs of Media Selection
- [Control Panel](../control-panel/) – displays the metadata JSON produced downstream
