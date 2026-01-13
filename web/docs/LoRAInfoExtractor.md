# LoRA Info Extractor

## Summary
Traverses Wan LoRA stacks, hashes every referenced file, optionally queries CivitAI using the Swiss Army Knife settings key, and outputs both a JSON blob plus a readable summary so you always know which LoRAs were active.

## Inputs
- `lora` – WANVIDLORA stack from WanVideo LoRA Select (required)
- `fallback_name` – Label used when no LoRAs can be discovered
- `use_civitai_api` – Toggle remote CivitAI lookups (defaults to enabled)
- `wan_model_type` – `"high"`, `"low"`, or `"none"` depending on Wan 2.2 noise model

## Outputs
- `lora_json` (`STRING`) – Structured metadata with hashes, summary stats, and combined display name
- `lora_info` (`STRING`) – Multi-line summary string, perfect for Control Panel or logging nodes
- `lora_passthrough` (`WANVIDLORA`) – Original stack for downstream chaining

## Usage Tips
- Store your CivitAI API key once in ComfyUI Settings → Swiss Army Knife and leave `use_civitai_api` enabled for rich metadata.
- Wire `lora_json` into your preferred metadata writer (FFmpeg scripts, Azure uploads, etc.) to embed LoRA info back into rendered files.
- Display `lora_info` with ComfyUI's built-in text display/output nodes or the Control Panel prompt widgets to verify which LoRAs were active per render.
- If you only need hashes (offline), disable `use_civitai_api` for faster execution.

## Documentation
Full details: [`docs/nodes/lora-info-extractor/LORA_INFO_EXTRACTOR.md`](../../docs/nodes/lora-info-extractor/LORA_INFO_EXTRACTOR.md)
