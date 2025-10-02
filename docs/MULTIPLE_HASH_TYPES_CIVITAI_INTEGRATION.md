# Multiple Hash Types and CivitAI API Integration

## Overview

This document describes the implementation of multiple hash type computation and enhanced CivitAI API integration for LoRA files in the ComfyUI-SwissArmyKnife extension.

## Hash Types Supported

The system now computes the following hash types for each LoRA file:

### 1. SHA256

- **Purpose**: Standard cryptographic hash for file integrity verification
- **Format**: Full 64-character uppercase hexadecimal string
- **Usage**: Primary hash for general file identification

### 2. CRC32

- **Purpose**: Fast checksum for file integrity
- **Format**: 8-character uppercase hexadecimal string
- **Usage**: Quick file verification and duplicate detection

### 3. Blake3

- **Purpose**: Modern, fast cryptographic hash
- **Format**: 64-character uppercase hexadecimal string
- **Availability**: Only available if `blake3` Python package is installed
- **Usage**: High-performance hashing for large files

### 4. AutoV1 (CivitAI Format)

- **Purpose**: CivitAI-specific hash format for model identification
- **Algorithm**: SHA256 of first 8KB of file, truncated to first 10 characters
- **Format**: 10-character uppercase hexadecimal string
- **Usage**: CivitAI model matching

### 5. AutoV2 (CivitAI Format)

- **Purpose**: Enhanced CivitAI hash format with better sampling
- **Algorithm**: SHA256 of strategic samples from file (beginning, 25%, 75%, end positions), truncated to first 10 characters
- **Format**: 10-character uppercase hexadecimal string
- **Usage**: Improved CivitAI model matching for files with different headers

## Implementation Details

### Hash Cache Storage

The hash cache (`lora_hash_cache.json`) now stores:

```json
{
    "/absolute/path/to/lora.safetensors": {
        "hashes": {
            "sha256": "ABCD1234...",
            "crc32": "12345678",
            "blake3": "EFGH5678...",
            "autov1": "1234567890",
            "autov2": "0987654321"
        },
        "hash": "ABCD1234...", // Legacy SHA256 for compatibility
        "mtime": 1234567890.123,
        "size": 123456789,
        "updated_at": 1234567890.123
    }
}
```

### CivitAI API Integration

The CivitAI service now attempts multiple hash types when looking up models:

1. **Priority Order**: SHA256 → AutoV1 → AutoV2 → Blake3 → CRC32
2. **Early Success**: Stops at first successful match
3. **Comprehensive Response**: Includes full API response plus metadata

#### API Response Enhancement

The CivitAI response now includes:

```json
{
  // Legacy processed fields (backward compatibility)
  "civitai_name": "Model Name",
  "version_name": "Version Name",
  "creator": "Author",
  "description": "Description",
  "civitai_url": "https://civitai.com/models/12345",
  "model_id": "12345",
  "version_id": "67890",
  "tags": ["tag1", "tag2"],
  "type": "LORA",
  "nsfw": false,
  "stats": {...},
  "fetched_at": "2025-09-26T12:00:00Z",

  // New fields
  "matched_hash_type": "autov1",
  "matched_hash_value": "1234567890",
  "all_hashes": {
    "sha256": "ABCD1234...",
    "crc32": "12345678",
    "blake3": "EFGH5678...",
    "autov1": "1234567890",
    "autov2": "0987654321"
  },

  // Full API response for comprehensive access
  "api_response": {
    // Complete CivitAI API response data
  }
}
```

### LoRA JSON Output Enhancement

The LoRA JSON output now includes comprehensive hash information:

```json
{
    "loras": [
        {
            "index": 0,
            "display_name": "My LoRA",
            "hash": "ABCD1234...", // Legacy SHA256
            "hashes": {
                "sha256": "ABCD1234...",
                "crc32": "12345678",
                "blake3": "EFGH5678...",
                "autov1": "1234567890",
                "autov2": "0987654321"
            },
            "file": {
                "exists": true,
                "path": "/path/to/lora.safetensors",
                "size_bytes": 123456789,
                "size_human": "117.7 MB",
                "modified_at": "2025-09-26T12:00:00Z"
            },
            "civitai": {
                // Full CivitAI response with all fields
            }
        }
    ],
    "summary": {
        "count": 1,
        "civitai_matches": 1,
        "total_size_bytes": 123456789,
        "total_size_human": "117.7 MB"
    }
}
```

## Usage Examples

### Basic Hash Computation

```python
from nodes.lora_hash_cache import get_cache

cache = get_cache()
hashes = cache.get_hashes("/path/to/lora.safetensors")

print(f"SHA256: {hashes['sha256']}")
print(f"AutoV1: {hashes['autov1']}")
print(f"AutoV2: {hashes['autov2']}")
```

### CivitAI Lookup with Multiple Hash Types

```python
from nodes.civitai_service import CivitAIService

service = CivitAIService(api_key="your_api_key")
model_info = service.get_model_info_by_hash("/path/to/lora.safetensors")

if model_info:
    print(f"Found model: {model_info['civitai_name']}")
    print(f"Matched using: {model_info['matched_hash_type']}")
    print(f"Full API response: {model_info['api_response']}")
```

## Performance Considerations

### Hash Computation

- **File Reading**: Single pass through file for all hash types
- **Memory Usage**: Optimized for large files with strategic sampling
- **Caching**: All hash types cached together to minimize I/O

### CivitAI API Calls

- **Early Termination**: Stops at first successful hash match
- **Caching**: Results cached by file path to avoid repeated API calls
- **Rate Limiting**: Automatic retry with backoff for rate-limited requests

## Backward Compatibility

The implementation maintains full backward compatibility:

1. **Legacy Hash Field**: `hash` field still contains SHA256 for existing code
2. **Cache Migration**: Automatically upgrades old cache entries
3. **API Structure**: Existing CivitAI response fields preserved

## Error Handling

### Missing Dependencies

- **Blake3**: Gracefully falls back to null if blake3 package not installed
- **Network Errors**: CivitAI API failures don't prevent hash computation

### File System Issues

- **Missing Files**: Returns null hashes without crashing
- **Permission Errors**: Logged and handled gracefully
- **Cache Corruption**: Automatic cache rebuild on JSON decode errors

## Testing

Run the validation script to test the implementation:

```bash
python3 test_hash_implementation.py
```

This tests:

- Hash computation for all supported types
- Cache functionality and persistence
- CivitAI service initialization
- Backward compatibility

## Configuration

### Environment Variables

- `CIVITAI_API_KEY` or `CIVIT_API_KEY`: CivitAI API key for enhanced lookups
- No additional configuration required for hash computation

### Dependencies

- `httpx`: HTTP client for CivitAI API calls
- `blake3`: Optional, for Blake3 hash support

## Troubleshooting

### Common Issues

1. **Blake3 Not Available**
    - Install: `pip install blake3`
    - Or: Accept null Blake3 hashes

2. **CivitAI API Key Issues**
    - Set environment variable: `export CIVITAI_API_KEY=your_key`
    - Check key validity at https://civitai.com

3. **Cache Corruption**
    - Delete cache file: `rm cache/lora_hash_cache.json`
    - Will rebuild automatically on next use

4. **Import Errors**
    - Ensure all dependencies installed: `pip install httpx blake3`
    - Check Python path configuration

5. **Event Loop Errors** ✅ FIXED
    - **Issue**: "Cannot run the event loop while another loop is running"
    - **Cause**: ComfyUI runs its own asyncio event loop
    - **Solution**: Implemented thread-based async handling for CivitAI API calls
    - **Status**: Automatically handled by the current implementation

## Future Enhancements

Potential improvements for future versions:

1. **Additional Hash Types**: MD5, xxHash for specific use cases
2. **Parallel Processing**: Multi-threaded hash computation for large files
3. **API Fallbacks**: Alternative model databases if CivitAI unavailable
4. **Hash Verification**: Validate cached hashes against file changes
