# LLMStudioOptions
Configures how LM Studio (OpenAI-compatible local server) should be queried when using LLM Studio describe nodes.

## Inputs
- `base_url` and `model_name` – point to the LM Studio server + deployed VL model.
- `prompt_style`, `temperature`, `sample_rate`, `max_duration` – control caption tone plus how much video is analyzed.
- `change_clothing_color`, `verbose` – optional styling and logging toggles.

## Outputs
- `llm_studio_options` – dict consumed by MediaDescribe/LLM Studio nodes for consistent requests.

## Usage Tips
1. Place before `MediaDescribe` (when using the LM Studio backend) or the dedicated LLM Studio describe nodes.
2. Update the URL/model names when switching machines or LM Studio deployments.

## Additional Resources
- [Full documentation](docs/nodes/media-describe/LLM_STUDIO_OPTIONS.md)
