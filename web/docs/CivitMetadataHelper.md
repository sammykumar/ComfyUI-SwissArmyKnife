# CivitMetadataHelper
Collect sampling settings, LoRA names, and prompts into formatted text/JSON that matches CivitAI's preferred metadata schema.

## Inputs
- `steps`, `cfg`, `seed`, `high_sampler`, `low_sampler` – capture generation settings.
- `lora_high`, `lora_low` – record LoRA names for transparency.
- `positive_prompt`, `negative_prompt` – include both prompts verbatim.

## Outputs
- `formatted_metadata` – human-readable summary.
- `json_metadata` – structured payload that downstream nodes can parse.
- `summary` – compact single-line overview.

## Usage Tips
1. Connect scheduler/LoRA/prompt values before uploading or archiving models.
2. Feed the formatted or JSON outputs into logging nodes, ComfyUI's built-in text display nodes, or Azure uploads.

## Additional Resources
- [Full documentation](docs/integrations/civitai/README.md)
