# LoRA JSON Cleanup and Optimization

## Overview

This document describes the cleanup and optimization of the LoRA JSON output to make it more manageable and focused on essential data.

## Changes Made

### File Information Cleanup

**Removed fields from `file` object:**

- `size_bytes` - File size in bytes (removed to reduce clutter)
- `size_human` - Human-readable file size (removed to reduce clutter)
- `modified_at` - File modification timestamp (removed to reduce clutter)

**Kept fields in `file` object:**

- `exists` - Whether the file exists
- `path` - Absolute path to the file

### Raw Entry Cleanup

**Removed fields from `original.raw` object:**

- `path` - File path (redundant with file.path)
- `blocks` - Block configuration data (internal use only)
- `layer_filter` - Layer filter settings (internal use only)
- `low_mem_load` - Memory loading flag (internal use only)
- `merge_loras` - LoRA merging flag (internal use only)

**Kept fields in `original.raw` object:**

- `strength` - LoRA strength value
- `name` - Original name field
- Any other custom fields that aren't in the removal list

### Original Object Cleanup

**Removed fields from `original` object:**

- `name` - Original name (redundant, already in display_name)
- `path` - Original path (redundant with file.path)

**Kept fields in `original` object:**

- `raw` - Filtered raw entry data

### CivitAI Response Filtering

**Kept only essential fields from CivitAI API response:**

- `civitai_name` - Model name on CivitAI
- `version_name` - Version name
- `civitai_url` - Direct URL to the model page
- `model_id` - CivitAI model ID
- `version_id` - CivitAI version ID
- `air` - AIR rating (if available in API response)
- `hashes` - All computed hash types
- `fetched_at` - Timestamp when data was fetched
- `matched_hash_type` - Which hash type matched
- `matched_hash_value` - The matching hash value
- `cache_hit` - Whether this was a cache hit or fresh API call

**Removed fields from CivitAI response:**

- `description` - Model description (can be lengthy)
- `creator` - Creator username (available via URL)
- `hash` - Single hash (redundant with hashes object)
- `tags` - Model tags (moved to summary level)
- `type` - Model type (usually "LORA")
- `nsfw` - NSFW flag (available via URL)
- `stats` - Download/like statistics (available via URL)
- `api_response` - Full API response (too verbose)

### Summary Enhancements

**Added to summary:**

- `civitai_cache_hits` - Number of CivitAI responses from cache

**Removed from summary:**

- `total_size_bytes` - Total file size in bytes
- `total_size_human` - Human-readable total size

### Wan Model Type Addition

**Added new field:**

- `wan_model_type` - User-selectable field indicating whether the LoRA is used with Wan 2.2 High Noise, Low Noise model, or none/other
- **Values**: `"high"`, `"low"`, or `"none"`
- **Default**: `"high"`
- **Location**: Root level of JSON output (alongside `loras`, `summary`, `combined_display`)

## New JSON Structure

```json
{
    "loras": [
        {
            "index": 0,
            "display_name": "My LoRA",
            "hash": "ABCD1234...",
            "hashes": {
                "sha256": "ABCD1234...",
                "crc32": "12345678",
                "blake3": "EFGH5678...",
                "autov1": "1234567890",
                "autov2": "0987654321"
            },
            "file": {
                "exists": true,
                "path": "/path/to/lora.safetensors"
            },
            "strength": 0.95,
            "original": {
                "raw": {
                    "strength": 0.95,
                    "name": "My LoRA"
                }
            },
            "civitai": {
                "civitai_name": "Amazing LoRA",
                "version_name": "v2.0",
                "civitai_url": "https://civitai.com/models/12345",
                "model_id": "12345",
                "version_id": "67890",
                "air": "4.8",
                "hashes": {
                    "sha256": "ABCD1234...",
                    "crc32": "12345678",
                    "blake3": "EFGH5678...",
                    "autov1": "1234567890",
                    "autov2": "0987654321"
                },
                "matched_hash_type": "autov1",
                "matched_hash_value": "1234567890",
                "cache_hit": false,
                "fetched_at": "2025-09-26T12:00:00Z"
            }
        }
    ],
    "summary": {
        "count": 1,
        "missing_files": 0,
        "civitai_matches": 1,
        "civitai_cache_hits": 0,
        "local_only": 0,
        "tags": ["tag1", "tag2"]
    },
    "combined_display": "Amazing LoRA",
    "wan_model_type": "high"
}
```

## Benefits of Cleanup

### Reduced JSON Size

- Removed redundant and verbose fields
- Focused on essential metadata only
- Typical reduction of 40-60% in JSON size

### Improved Readability

- Cleaner structure with less noise
- Essential information is easier to find
- Better for API consumers and debugging

### Better Performance

- Smaller payloads for network transfer
- Faster JSON parsing and processing
- Reduced memory usage

### Enhanced Cache Information

- Clear indication of cache hits vs fresh API calls
- Better understanding of CivitAI API usage
- Useful for debugging and optimization

## Backward Compatibility

The cleanup maintains backward compatibility for essential fields:

- `hash` field still contains SHA256
- `display_name` still available
- `file.exists` and `file.path` preserved
- `civitai` object still contains core model information

## Migration Notes

If your code relies on removed fields:

### File Size Information

- **Before**: `lora.file.size_bytes`, `lora.file.size_human`
- **Migration**: Use `os.path.getsize()` if needed, or add back to local processing

### File Timestamps

- **Before**: `lora.file.modified_at`
- **Migration**: Use `os.path.getmtime()` if needed

### Detailed CivitAI Data

- **Before**: `lora.civitai.description`, `lora.civitai.creator`, etc.
- **Migration**: Use the `civitai_url` to fetch additional details if needed

### Raw Entry Fields

- **Before**: `lora.original.raw.path`, `lora.original.raw.blocks`, etc.
- **Migration**: These were internal fields; use `lora.file.path` for file path

## Date Implemented

September 26, 2025
