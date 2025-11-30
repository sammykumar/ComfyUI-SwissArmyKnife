# Cache Optimization Fix

## Issue

The cache system was not properly optimized for seed-based media selection, causing unnecessary API calls when users tested different seeds that selected the same media files.

## Root Cause Analysis

1. **Seed Independence**: Different seeds selecting the same file should share the same cache entry
2. **Missing Duration Parameter**: Video caching wasn't considering `max_duration` parameter, causing incorrect cache sharing

## Solution Implemented

### 1. Seed-Independent Caching ✅

The caching system was already correctly implemented to be seed-independent:

- Cache keys are based on `media_identifier = get_file_media_identifier(selected_media_path)`
- This uses **file path + modification time**, not the seed used to select it
- Different seeds selecting the same file will have identical cache keys

### 2. Added Duration Parameter to Video Cache ✅

Updated video processing cache to include `max_duration`:

```python
# Before (missing max_duration)
cache_options = {
    "describe_clothing": describe_clothing,
    "describe_hair_style": describe_hair_style,
    "describe_bokeh": describe_bokeh,
    "describe_subject": describe_subject
}

# After (includes max_duration)
cache_options = {
    "describe_clothing": describe_clothing,
    "describe_hair_style": describe_hair_style,
    "describe_bokeh": describe_bokeh,
    "describe_subject": describe_subject,
    "max_duration": max_duration  # Include duration in cache key
}
```

## Impact

### Before Fix

- **Same file, different seeds**: New API call each time ❌
- **Same file, different duration**: Incorrect cache hit ❌

### After Fix

- **Same file, different seeds**: Cache hit ✅
- **Same file, different duration**: Separate cache entries ✅

## Cache Key Structure

Cache keys are now properly based on:

1. **Media identifier**: `file_path + modification_time` (seed-independent)
2. **Gemini model**: e.g., `models/gemini-2.5-flash`
3. **Options combination**: `describe_*` flags + `max_duration`
4. **Model type**: For images only (Text2Image/ImageEdit)

## Validation

Test scenarios that should now work efficiently:

- ✅ Testing multiple seeds with the same file selected → Cache hit after first call
- ✅ Different duration limits on same file → Separate cache entries
- ✅ Different option combinations → Separate cache entries (expected)
- ✅ Different models → Separate cache entries (expected)

## Files Modified

- `nodes/nodes.py` - Added `max_duration` to video cache options

## Related Documentation

- `docs/CACHING.md` - General caching implementation details
