# SuperDualLoraLoader
Load and manage separate high-noise and low-noise LoRA stacks in a single node, including trigger extraction and template bundles.

## Inputs
- `high_noise_lora`, `low_noise_lora` – WANVIDLORA stacks from WanVideo selectors.
- Optional `clip` tensor plus `lora_bundle` JSON coming from the UI template editor.

## Outputs
- Updated `high_noise_lora` and `low_noise_lora` models.
- `CLIP` – forwarded/modified CLIP instance.
- `TRIGGER_WORDS` – comma-separated string of trigger phrases from enabled LoRAs.

## Usage Tips
1. Configure bundles in the UI (templates panel) and send them to this node.
2. Feed the resulting WANVIDLORA tensors into Wan's sampler chain.

## Additional Resources
- [Full documentation](docs/nodes/lora-loader/LORA_LOADER.md#superdualloraloader)
