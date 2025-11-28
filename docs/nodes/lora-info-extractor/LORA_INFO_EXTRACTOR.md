# LoRA Info Extractor Node

The **LoRA Info Extractor** walks WanVideo LoRA stacks, calculates persistent hashes for every referenced file, optionally fetches matching metadata from CivitAI, and emits both a structured JSON blob plus a readable summary string. Use it to keep render logs auditable and to pass rich LoRA metadata into downstream nodes such as the Video Metadata updater.

## Features

- **Stack-aware traversal** – Recursively inspects `WANVIDLORA` stacks (`stack`, `children`, `items`, `chain`, etc.) and deduplicates entries by path/name.
- **Persistent hashing** – Uses `lora_hash_cache` to store SHA256/CRC32/BLAKE3/AutoV1/AutoV2 hashes so file checks become incremental.
- **CivitAI enrichment** – Looks up hashes against CivitAI (when enabled) using the API key stored in `swiss_army_knife.civitai.api_key`.
- **Structured output** – Returns a JSON payload that includes every LoRA’s hashes, file info, optional CivitAI data, and a rolled-up summary.
- **Wan model tagging** – Annotates the payload with `wan_model_type` (`"high"`, `"low"`, or `"none"`) so downstream nodes know which Wan model variants were used.
- **Readable summary** – The second output is a markdown-friendly text block that highlights summary stats and per-LoRA notes.

## Inputs

| Name | Type | Description |
| --- | --- | --- |
| `lora` | WANVIDLORA (required) | LoRA stack from WanVideo LoRA Select or compatible nodes |
| `fallback_name` | STRING | Display label used when no LoRAs are discovered |
| `use_civitai_api` | BOOLEAN (default `True`) | Toggle CivitAI lookups. When disabled, only local metadata + hashes are emitted |
| `wan_model_type` | ENUM (`high`, `low`, `none`) | Records which Wan 2.2 model flavor this stack targets |

All inputs are optional except `lora`. The node automatically handles single dictionaries, strings, and lists even if Wan nodes output slightly different shapes.

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `lora_json` | STRING | JSON payload containing `loras`, `summary`, `combined_display`, and `wan_model_type` |
| `lora_info` | STRING | Multi-line summary (first line is headline summary, followed by bullet points per LoRA) |
| `lora_passthrough` | WANVIDLORA | Original `lora` input for chaining downstream |

## JSON Structure

```json
{
  "loras": [
    {
      "index": 0,
      "display_name": "Dreamy Painter",
      "hash": "ABC123...",
      "hashes": {
        "sha256": "ABC123...",
        "crc32": "F0E1D2C3",
        "blake3": "XYZ...",
        "autov1": "0F1E2D3C4B",
        "autov2": "1234567890"
      },
      "file": {
        "exists": true,
        "path": "/comfy/models/loras/dreamy_painter.safetensors"
      },
      "strength": 0.8,
      "original": {
        "raw": {
          "strength": 0.8
        }
      },
      "civitai": {
        "civitai_name": "Dreamy Painter",
        "version_name": "v6",
        "civitai_url": "https://civitai.com/models/12345",
        "creator": "ExampleArtist",
        "tags": ["illustration", "anime"],
        "matched_hash_type": "sha256",
        "cache_hit": true
      }
    }
  ],
  "summary": {
    "count": 1,
    "missing_files": 0,
    "civitai_matches": 1,
    "civitai_cache_hits": 1,
    "local_only": 0,
    "tags": ["anime", "illustration"]
  },
  "combined_display": "Dreamy Painter",
  "wan_model_type": "high"
}
```

Use the `combined_display` string as a quick label (e.g., send it into the Video Metadata node so FFmpeg titles/keywords list the LoRAs that were used).

## Typical Workflow

```
WanVideo LoRA Select (Multi) ──▶ LoRAInfoExtractor ──▶ VideoMetadataNode
                                   │                    │
                                   ├─ lora_json ────────┘ (metadata embed)
                                   ├─ lora_info ──▶ Control Panel / Logger
                                   └─ lora_passthrough ─▶ Downstream LoRA-aware nodes
```

## CivitAI Integration

- Store the CivitAI API key once in **ComfyUI Settings → Swiss Army Knife → Civitai API Key**.
- The node automatically retrieves the key via `get_setting_value("swiss_army_knife.civitai.api_key")`.
- Set `use_civitai_api=False` for offline-only usage (only local hashes + filenames will appear).
- Hashes are cached so only the first run hits disk/network; subsequent renders reuse the cache unless the files change.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `Fallback: No LoRAs Detected` | Ensure the upstream node outputs `WANVIDLORA` (list/dict). You can wire `lora_passthrough` into a `ShowText` node to inspect the raw stack. |
| Missing files | The summary line reports `Missing: N`. Confirm the referenced `.safetensors` files exist at the recorded path. |
| No CivitAI matches | Confirm the key is set in ComfyUI settings and `use_civitai_api=True`. The debug log also prints whether a key was detected. |
| Slow first run | Hash cache warms on the first pass because every LoRA file must be read. Subsequent runs re-use cached hashes as long as the files remain unchanged. |

## Related Documentation

- [Video Metadata Node](../video-metadata/VIDEO_METADATA.md) – Shows how `lora_json` is embedded back into FFmpeg metadata.
- [CivitAI API Key Widget Implementation](../../integrations/civitai/CIVITAI_API_KEY_WIDGET.md) – Details the backend/frontend plumbing for settings-based API keys.
- [Settings Integration Guide](../../infrastructure/SETTINGS_INTEGRATION.md) – Overview of how Swiss Army Knife nodes access stored secrets.
