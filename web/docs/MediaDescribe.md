# MediaDescribe
Describe images or video clips with LM Studio (or other configured providers) by combining `MediaSelection` outputs, optional overrides, and caching so downstream prompt builders get structured data.

## Inputs
- `media_processed_path` – resolved media path from `MediaSelection` (or another loader) that this node analyzes.
- `llm_studio_options` – configuration dict from **LM Studio - Options** describing base URL, model, sampling rate, etc.
- `overrides` – optional input from **Media Describe - Overrides** to replace specific paragraphs.
- `use_custom_prompts` – boolean toggle to send manual prompt text instead of the auto-generated Wan/VACE templates.
- `custom_system_prompt` – multiline system prompt applied when `use_custom_prompts` is true (pre-filled with the Wan 2.2 instructions).
- `custom_user_prompt` – multiline user prompt applied when `use_custom_prompts` is true.

## Outputs
- `all_media_describe_data` – master JSON blob with every paragraph and metadata point.
- `raw_llm_json` – untouched Gemini response (for auditing/debugging).
- `positive_prompt_json` & `positive_prompt` – structured and flattened prompt text ready for Control Panel or generation.
- `prompt_request` – the exact instructions sent to Gemini, plus inferred `height`/`width`.

## Usage Tips
1. Connect `MediaSelection` (or VHS loaders) to feed frames plus metadata.
2. Chain `LM Studio - Options` and optional `MediaDescribeOverrides` into their respective ports.
3. Flip on `use_custom_prompts` only when you need to hand-edit the system/user instructions; otherwise leave it off to keep adaptive defaults.
4. Send the outputs to downstream nodes such as `ShowText`, `ControlPanel*`, or filename/build nodes.

## Additional Resources
- [Full documentation](docs/nodes/media-describe/MEDIA_DESCRIBE.md)
