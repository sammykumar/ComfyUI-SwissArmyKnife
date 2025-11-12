# SuperLoraLoader
Single-stream variant of the Super loader for standard Wan workflows; still supports multiple LoRAs, per-entry strengths, and trigger capture.

## Inputs
- `lora` – WANVIDLORA stack to augment.
- Optional `clip` and `lora_bundle` JSON (or legacy `lora_*` kwargs).

## Outputs
- `WANVIDLORA` – updated stack after applying enabled LoRAs.
- `CLIP` – forwarded/modified CLIP.
- `TRIGGER_WORDS` – aggregated keywords.

## Usage Tips
1. Send the Wan LoRA stack plus a bundle describing which LoRAs to apply.
2. Route outputs into Wan's sampler nodes just like the standard loader.

## Additional Resources
- [Full documentation](docs/nodes/lora-loader/LORA_LOADER.md#superloraloader)
