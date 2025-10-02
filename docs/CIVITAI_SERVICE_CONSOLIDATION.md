# CivitAI Service Consolidation

**Date**: October 2, 2025

## Overview

Consolidated two separate CivitAI service implementations into a single, unified service at `utils/civitai_service.py`.

## Problem

The codebase had two separate CivitAI service implementations:

1. **`utils/civitai_service.py`** - More mature implementation
    - Used `httpx` for HTTP requests
    - Integrated with hash caching system (`lora_hash_cache`)
    - Supported multiple hash types (SHA256, AutoV1, AutoV2, Blake3, CRC32)
    - Had retry logic and rate limiting handling
    - Used by `utils/nodes.py` for LoRA metadata extraction

2. **`utils/lora_manager/civitai_service.py`** - Simpler implementation
    - Used `aiohttp` for HTTP requests
    - Had basic trigger word extraction
    - Used by `utils/lora_manager/web_api.py`

## Solution

Consolidated both implementations into `utils/civitai_service.py` with the following features:

### Key Features Retained

- **HTTP Client**: Uses `httpx` (more reliable and sync-friendly)
- **Hash Caching**: Integrated with `lora_hash_cache` for efficient hash computation
- **Multiple Hash Types**: Supports SHA256, AutoV1, AutoV2, Blake3, CRC32 with priority-based lookups
- **Retry Logic**: Handles rate limiting (429) with exponential backoff
- **API Key Support**: Supports both `CIVITAI_API_KEY` and `CIVIT_API_KEY` environment variables
- **Trigger Word Extraction**: Added from the lora_manager version

### New Methods Added

```python
def get_trigger_words(self, file_path: str, max_words: int = 3) -> List[str]:
    """Get trigger words for a LoRA file by path"""

def get_trigger_words_by_filename(self, lora_filename: str, max_words: int = 3) -> List[str]:
    """Get trigger words for a LoRA file by filename (resolves full path)"""

def get_civitai_service() -> CivitAIService:
    """Global singleton instance getter"""
```

## Changes Made

### 1. Enhanced `utils/civitai_service.py`

- Added `List` to type imports
- Added optional ComfyUI `folder_paths` import for path resolution
- Added `get_trigger_words()` method for trigger word extraction from file path
- Added `get_trigger_words_by_filename()` method for resolving LoRA filenames to paths
- Added global `get_civitai_service()` singleton function

### 2. Updated `utils/lora_manager/web_api.py`

**Before:**

```python
from .civitai_service import get_civitai_service
# ...
trigger_words = await civitai_service.get_trigger_words(lora_filename)
```

**After:**

```python
from ..civitai_service import get_civitai_service
# ...
trigger_words = civitai_service.get_trigger_words_by_filename(lora_filename)
```

### 3. Removed Duplicate File

Deleted `utils/lora_manager/civitai_service.py` as it's no longer needed.

## API Compatibility

### For `utils/nodes.py` (No Changes Required)

```python
from .civitai_service import CivitAIService

# Existing usage still works
service = CivitAIService(api_key=api_key)
model_info = service.get_model_info_by_hash(file_path)
```

### For `utils/lora_manager/web_api.py` (Updated)

```python
from ..civitai_service import get_civitai_service

# Updated from async to sync call
service = get_civitai_service()
trigger_words = service.get_trigger_words_by_filename(lora_filename)
```

## Benefits

1. **Single Source of Truth**: One implementation to maintain and improve
2. **Better Hash Support**: Multiple hash types with priority-based fallback
3. **Performance**: Hash caching reduces redundant computations
4. **Reliability**: Better error handling and retry logic
5. **Cleaner Architecture**: Related functionality in one place

## Testing

All tests pass:

- ✅ Ruff linting: `All checks passed!`
- ✅ Import tests: Service imports successfully
- ✅ Method availability: All required methods present
- ✅ Singleton pattern: `get_civitai_service()` works correctly

## Migration Guide

If you have custom code importing from the old location:

**Before:**

```python
from utils.lora_manager.civitai_service import CivitAiService, get_civitai_service
```

**After:**

```python
from utils.civitai_service import CivitAIService, get_civitai_service
```

Note: Class name changed from `CivitAiService` to `CivitAIService` (capitalization).

## Future Improvements

- Consider adding async versions of methods if needed for performance
- Add more sophisticated trigger word extraction from descriptions
- Cache trigger words separately to avoid repeated API calls
- Add unit tests for the consolidated service
