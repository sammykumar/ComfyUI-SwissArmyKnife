# Media Selection Node Documentation

**Last Updated:** October 17, 2025  
**Node Type:** Input Utility  
**Category:** Swiss Army Knife 🔪/Media Caption  
**Status:** Stable

## Overview

Media Selection isolates all media ingestion tasks—uploads, folder randomization, and Reddit downloads—so that AI nodes only deal with normalized files. The node validates the file, trims/resizes when instructed, and returns both the resolved path and a structured metadata blob.

## Features

- **Multi-Source Intake**: Upload fields for quick tests, deterministic folder sampling, and Reddit/Redgifs download support.
- **Deterministic Randomization**: `seed` drives folder/subreddit sampling for reproducible iterations.
- **Resize + Trim Helpers**: Auto-orientation presets (832×480 landscape / 480×832 portrait), custom dimensions, and optional `max_duration`.
- **Rich Metadata Output**: Height, width, fps, duration, and a JSON summary describing each decision.
- **Temp Directory Hygiene**: Uses SwissArmyKnife temp utilities to keep cache paths predictable.
- **Debug Logging Hooks**: Emits `[SwissArmyKnife][MediaSelection]` logs when debug mode is enabled.

## Node Configuration

| Input | Type | Description |
| --- | --- | --- |
| `media_source` | CHOICE | `Upload Media`, `Randomize from Path`, `Reddit Post`, `Randomize from Subreddit` |
| `media_type` | CHOICE | `image` or `video` |
| `seed` | INT | Drives deterministic selection for randomization modes |
| `media_path` | STRING | Base directory when randomizing from path |
| `uploaded_image_file` / `uploaded_video_file` | FILE | Set via upload widgets when using `Upload Media` |
| `reddit_url` / `subreddit_url` | STRING | Reddit endpoints used by download helper |
| `max_duration` | FLOAT | Trims long clips (seconds, `0` = full length) |
| `resize_mode` | CHOICE | `None`, `Auto (by orientation)`, or `Custom` |
| `resize_width` / `resize_height` | INT | Target dimensions for `Custom` mode |

Outputs:

- `media_path`: Absolute temp path to the processed file
- `media_type`: Echoes resolved type (`image`/`video`)
- `media_info`: Multiline summary (source, resize actions, Reddit metadata, etc.)
- `height` / `width`: Final pixel dimensions
- `duration` / `fps`: For videos only (0 for still images)

## Workflow Examples

### 1. Standard Describe Pipeline

1. **Media Selection** – `Upload Media`, `media_type=video`, `max_duration=6`, `resize_mode=Auto`.
2. **LM Studio Structured Describe** – consume `media_processed_path` for JSON captioning.
3. **Control Panel** – displays the JSON returned by the structured describe nodes so QA can verify metadata.

### 2. Reddit Sampling Loop

1. **Media Selection** – `media_source=Randomize from Subreddit`, `subreddit_url=r/GifSound`, `seed=<iteration>`.
2. **Prompt Builder / overrides** – optional curated overrides (structured describe nodes accept custom JSON input).
3. **LM Studio Structured Describe** – triggered when `llm_studio_options` present.

## Implementation Notes

- Path operations happen through `nodes/utils/temp_utils.py` to keep compatibility with Docker bind mounts.
- Reddit downloads reuse caching helpers so repeated URLs avoid re-downloading.
- Browser widgets live in `web/js/swiss-army-knife.js` under the `MediaSelection` branch; there is no dedicated Vue/React client.
- Removal of `FrameExtractor` and `MultiCaptionCombiner` (October 2025) simplified this module back to a single node. Workflows that previously chained those nodes should switch to external tools or LM Studio pipelines.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| **“File not found” after upload** | Ensure ComfyUI temp directory is writable; verify upload widget emitted a filename |
| **Reddit download fails** | Confirm URL is public and that Redgifs content isn’t behind age gates; rerun with `DEBUG=true` to capture the exact request |
| **Wrong orientation after resize** | Use `Auto (by orientation)` for quick presets or provide explicit custom dimensions |
| **Randomization not changing files** | Increment `seed` or toggle `media_type` to force new sampling |

## Related Documentation

- [Structured Output Implementation](../lm-studio-describe/STRUCTURED_OUTPUT_IMPLEMENTATION.md)
- [Control Panel](../control-panel/README.md)
- [Control Panel](../control-panel/CONTROL_PANEL.md)
