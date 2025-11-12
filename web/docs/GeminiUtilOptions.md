# GeminiUtilOptions
Small helper that packages Gemini model choice and behavior flags so every MediaDescribe call uses consistent settings.

## Inputs
- `gemini_model` – pick between Flash, Flash-Lite, or Pro variants.
- `prompt_style` – switch between Text2Image prompts and ImageEdit style instructions.
- `change_clothing_color` – opt-in stylistic adjustment for wardrobe callouts.

## Outputs
- `gemini_options` – dictionary that MediaDescribe reads for API key, model, styling toggles.

## Usage Tips
1. Drop the node upstream of MediaDescribe and connect its output to the `gemini_options` input.
2. Tune the dropdowns once per workflow so every frame/process run stays consistent.

## Additional Resources
- [Full documentation](docs/nodes/media-describe/MEDIA_DESCRIBE.md#geminiutiloptions)
