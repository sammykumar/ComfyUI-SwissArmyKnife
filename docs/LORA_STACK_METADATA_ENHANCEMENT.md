# LoRA Stack Metadata Enhancement

## Overview

The **LoRAInfoExtractor** node now processes entire LoRA stacks emitted by WanVideo's LoRA Manager nodes. The node walks nested stack structures, computes persistent SHA256 hashes for each LoRA file, enriches the data with CivitAI metadata, and publishes detailed summary statistics for downstream nodes (e.g., `VideoMetadataNode`).

Key goals:

- Capture every LoRA in the chain (including deeply nested stack members)
- Minimize repeated hashing through a persistent cache that survives ComfyUI restarts
- Query the CivitAI API asynchronously without blocking ComfyUI's worker threads
- Deliver structured metadata to workflows while gracefully handling missing files

## Architecture

### 1. Persistent Hash Cache (`utils/lora_hash_cache.py`)

- Stores file path ➜ SHA256 mappings with `mtime` + `size` validation
- Persists to `cache/lora_hash_cache.json` in the repository root
- Uses an `RLock` to guarantee thread-safe read/write access
- Automatically invalidates entries when LoRA files change or disappear

### 2. CivitAI Service (`utils/civitai_service.py`)

- Async HTTP client powered by `httpx`
- Automatically reuses hashes from the persistent cache
- Retries on HTTP 429 up to two times with respect for `Retry-After`
- Returns detailed payloads: model name, version, creator, tags, stats, NSFW flag, etc.

### 3. LoRA Stack Walker (`utils/nodes.py#LoRAInfoExtractor`)

- Recursively inspects WanVideo stack structures (`stack`, `loras`, `children`, `items`, `chain` keys)
- Deduplicates LoRA entries using `(path, name)` keys to avoid double counting
- Falls back to single-LoRA inputs (strings, dicts, objects) for backwards compatibility
- Compiles per-LoRA blocks containing:
    - Display name (CivitAI name if available, otherwise cleaned filename)
    - SHA256 hash (persistent cache)
    - File information (path, existence, size, modification time)
    - CivitAI metadata when available
- Produces a node summary with aggregate counts, missing files, total file size, and top tags

## Output JSON Structure

```json
{
  "loras": [
    {
      "index": 0,
      "display_name": "Realistic Vision V6",
      "hash": "A1B2C3…",
      "file": {
        "exists": true,
        "path": "/models/loras/realistic_vision_v6.safetensors",
        "size_bytes": 167772160,
        "size_human": "160.00 MB",
        "modified_at": "2025-09-24T12:34:56Z"
      },
      "strength": 0.85,
      "original": {
        "raw": { "path": "…", "strength": 0.85, "stack": [ … ] },
        "name": "realistic_vision_v6",
        "path": "/models/loras/realistic_vision_v6.safetensors"
      },
      "civitai": {
        "civitai_name": "Realistic Vision",
        "version_name": "6.0",
        "creator": "SG_161222",
        "tags": ["photorealistic", "portrait"],
        "stats": {"downloadCount": 1234},
        "fetched_at": "2025-09-25T00:42:11Z"
      }
    }
  ],
  "summary": {
    "count": 2,
    "missing_files": 0,
    "civitai_matches": 2,
    "local_only": 0,
    "total_size_bytes": 335544320,
    "total_size_human": "320.00 MB",
    "tags": ["photorealistic", "portrait"]
  },
  "combined_display": "Realistic Vision V6 + Cinematic Style"
}
```

The `lora_info` output (human-readable string) contains a summary line followed by bullet points for each LoRA, including hash fragments and file status.

## Error Handling & Fallbacks

- **Missing Files**: Entries remain in the JSON with `exists: false` and `missing file` markers in the info text.
- **Hash Failures**: Gracefully handled by skipping the hash field; cache entry is invalidated if necessary.
- **API Errors**: Network issues, 404s, or 429 rate limits are logged; processing continues with local metadata.
- **Empty Stacks**: Falls back to the provided `fallback_name` (if any) and returns an empty `loras` list with an explanatory `error` field.

## Workflow Integration

1. **Connect WanVideo LoRA output** → `LoRAInfoExtractor.lora`
2. Optional: Provide `civitai_api_key` input or set `CIVITAI_API_KEY` environment variable
3. **Use `lora_json` output** for downstream metadata nodes (e.g., `VideoMetadataNode`)
4. **Inspect `lora_info`** for quick console/debug summaries

## Cache Maintenance

- Cache files live in `<repo>/cache/lora_hash_cache.json`
- Use the helper:
    ```python
    from utils.lora_hash_cache import get_cache
    get_cache().clear()
    ```
    to purge hashes and force recomputation
- Entries automatically refresh when LoRA files change (mtime/size mismatch)

## Future Enhancements

- Persist CivitAI results on disk to reduce API traffic across sessions
- Surface additional CivitAI metadata (e.g., trigger words, thumbnail URLs) in the JSON payload
- Expose cache size/health metrics through a lightweight diagnostics node
