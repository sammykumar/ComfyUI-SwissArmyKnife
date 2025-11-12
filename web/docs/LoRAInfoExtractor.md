# LoRAInfoExtractor
Traverse WanVideo LoRA stacks, hash each file, optionally query CivitAI, and emit structured metadata plus human summaries.

## Inputs
- `lora` – WANVIDLORA stack from Wan selectors or Super loaders.
- Optional `fallback_name`, `use_civitai_api`, `wan_model_type` toggles for offline mode and labeling.

## Outputs
- `lora_json` – machine-readable metadata.
- `lora_info` – formatted summary string for logs/UI.
- `lora_passthrough` – original stack so you can continue piping it forward.

## Usage Tips
1. Insert right after LoRA selection nodes to capture metadata before loading.
2. Feed `lora_json` to VideoMetadataNode or logging sinks.

## Additional Resources
- [Full documentation](docs/nodes/lora-loader/LORA_LOADER.md)
