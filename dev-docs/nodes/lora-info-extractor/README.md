# LoRA Info Extractor - Quick Reference

Extracts metadata about Wan LoRA stacks, hashes every file, and optionally enriches the results with CivitAI lookup data.

## Quick Start

1. Connect `WANVIDLORA` output from WanVideo LoRA Select (single or multi).
2. (Optional) Toggle `use_civitai_api` if you want to hit the CivitAI API using the Swiss Army Knife settings key.
3. Wire the `lora_json` output into downstream nodes (e.g., Video Metadata) and surface `lora_info` anywhere you want a readable summary.

## Inputs

- `lora` (`WANVIDLORA`, required) – Stack of LoRA dictionaries coming from Wan nodes
- `fallback_name` (`STRING`, optional) – Used when no LoRA metadata can be determined
- `use_civitai_api` (`BOOLEAN`, optional, default `True`) – Disable to skip remote lookups
- `wan_model_type` (`["high","low","none"]`, optional, default `high`) – Tracks whether the stack targets Wan 2.2 high/low/noise models

## Outputs

- `lora_json` (`STRING`) – Structured JSON payload with hashes, metadata, and summary counts
- `lora_info` (`STRING`) – Human-friendly summary of each LoRA plus a headline summary line
- `lora_passthrough` (`WANVIDLORA`) – Original stack for chaining downstream

## Full Documentation

See [LORA_INFO_EXTRACTOR.md](./LORA_INFO_EXTRACTOR.md) for complete JSON schema, troubleshooting tips, and integration patterns.
