# MediaDescribe
Describe images or video clips with Google's Gemini API, combining MediaSelection inputs, optional overrides, and caching so downstream prompt builders get structured data.

## Inputs
- `media_source` / `media_type` / path & upload fields – choose whether to pull a random asset, a fixed path, or an uploaded file.
- `media_info`, `resize_width`, `resize_height`, `max_duration`, `fps` – keep Gemini's request aligned with the workflow resolution/duration.
- `gemini_options` from `GeminiUtilOptions` plus optional `overrides` and prompt prefix fields to steer the narration.
- `seed`, `prompt_style`, `fallback_mode` controls for deterministic captions across batch/exploration runs.

## Outputs
- `all_media_describe_data` – master JSON blob with every paragraph and metadata point.
- `raw_llm_json` – untouched Gemini response (for auditing/debugging).
- `positive_prompt_json` & `positive_prompt` – structured and flattened prompt text ready for Control Panel or generation.
- `prompt_request` – the exact instructions sent to Gemini, plus inferred `height`/`width`.

## Usage Tips
1. Connect `MediaSelection` (or VHS loaders) to feed frames plus metadata.
2. Chain `GeminiUtilOptions` and optional `MediaDescribeOverrides` into their respective ports.
3. Send the outputs to downstream nodes such as `ShowText`, `ControlPanel*`, or filename/build nodes.

## Additional Resources
- [Full documentation](docs/nodes/media-describe/MEDIA_DESCRIBE.md)
