# Gemini Media Description Caching

This document explains the caching functionality implemented for the Gemini custom nodes.

## Overview

The caching system automatically stores Gemini API responses to avoid redundant API calls when analyzing the same media with the same description prompt. This provides:

-   **Fast repeated analyses** - Cached results return in milliseconds instead of waiting for API calls
-   **API cost savings** - Avoids duplicate API requests for identical media+prompt combinations
-   **Transparent operation** - Caching is always enabled and requires no user configuration
-   **Accurate isolation** - Separate cache entries for each unique media+prompt+model combination

## How It Works

### Cache Key Generation

Each cache entry uses a unique key based on:

1. **Media identifier** - Uniquely identifies the media content
2. **Description mode** - The selected prompt option (e.g., "Describe without clothing")
3. **Model settings** - The Gemini model name and type

### Media Identification

-   **Video files**: Uses file path + modification time + file size
-   **Image tensors**: Uses content hash of the tensor data
-   **Uploaded files**: Uses the file path in ComfyUI's input directory + metadata

### Description Modes

Caching works with all 4 description modes:

-   "Describe without clothing"
-   "Describe with clothing"
-   "Describe without clothing (No bokeh)"
-   "Describe with clothing (No bokeh)"

Each mode creates a separate cache entry for the same media file.

### Storage

Cache entries are stored as JSON files in the `cache/gemini_descriptions/` directory:

-   Each file contains the description, metadata, and timestamp
-   Cache persists across ComfyUI restarts
-   Cache directory is created automatically
-   Cache files are excluded from git via `.gitignore`

## Cache Behavior

### Cache Hit (Fast Path)

```
User analyzes media → Check cache → Found → Return cached description (< 1ms)
```

### Cache Miss (API Path)

```
User analyzes media → Check cache → Not found → Call Gemini API → Store result → Return description
```

### Cache Isolation Examples

Same video file with different prompts:

-   `video.mp4` + "Describe without clothing" → Cache entry A
-   `video.mp4` + "Describe with clothing" → Cache entry B
-   `video.mp4` + "Describe without clothing (No bokeh)" → Cache entry C
-   `video.mp4` + "Describe with clothing (No bokeh)" → Cache entry D

Same prompt with different models:

-   `video.mp4` + "Describe without clothing" + `gemini-2.5-flash` → Cache entry A
-   `video.mp4` + "Describe without clothing" + `gemini-2.5-pro` → Cache entry B

## Implementation Details

### Files Modified

-   `utils/cache.py` - New cache utility module
-   `utils/nodes.py` - Added caching to GeminiVideoDescribe and GeminiImageDescribe classes

### Cache Integration Points

1. **Before Gemini API call** - Check cache for existing result
2. **After successful API response** - Store result in cache
3. **Cache hit handling** - Return cached result with appropriate status message

### Status Messages

Cache hits are indicated in the Gemini status output:

```
🤖 Gemini Analysis Status: ✅ Complete (Cached)
• Model: models/gemini-2.5-flash
• Cached: 2025-09-02 10:16:32
```

Regular API calls show:

```
🤖 Gemini Analysis Status: ✅ Complete
• Model: models/gemini-2.5-flash
• API Key: ****1234
```

## Performance Benefits

-   **First analysis**: Normal API call timing (~2-5 seconds)
-   **Subsequent analyses**: Cache retrieval (~0.1ms)
-   **API savings**: 100% reduction in duplicate calls
-   **User experience**: Instant results for repeated workflows

## Cache Management

### Automatic Behavior

-   Cache entries are created automatically
-   No user configuration required
-   Cache persists across sessions
-   Old entries remain until manually cleared

### Manual Management

The cache can be inspected or cleared programmatically:

```python
from utils.cache import get_cache

cache = get_cache()

# Get cache statistics
info = cache.get_cache_info()
print(f"Entries: {info['entries']}, Size: {info['total_size_mb']} MB")

# Clear specific entry (not exposed in UI)
# cache._get_cache_file_path(key) and os.remove()
```

### Cache Directory Location

-   Default: `<comfyui_swissarmyknife>/cache/gemini_descriptions/`
-   Contains JSON files with SHA256 hash names
-   Safe to delete entire directory to clear all cache

## User Workflow Impact

The caching is completely transparent to users:

1. **First time analyzing media**: Works exactly as before (API call)
2. **Re-analyzing same media+prompt**: Results appear instantly from cache
3. **Different prompts on same media**: Each creates new cache entry
4. **Different media files**: Each gets separate cache entries

Users will notice:

-   Faster repeated analyses
-   Cache hit indicators in status messages
-   No additional configuration needed
-   Consistent behavior across ComfyUI restarts
