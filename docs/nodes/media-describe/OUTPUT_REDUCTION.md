# MediaDescribe Output Reduction

**Date**: October 7, 2025  
**Status**: ✅ Completed  
**Breaking Change**: Yes - Reduced from 8 outputs to 5 outputs

## Summary

Simplified the MediaDescribe node by removing redundant output sockets and keeping only the essential outputs needed for workflows.

## Changes Made

### Output Reduction

**Before (8 outputs):**

1. description ❌ REMOVED
2. media_info ❌ REMOVED
3. gemini_status ❌ REMOVED
4. processed_media_path ✅ KEPT
5. final_string ✅ KEPT
6. height ✅ KEPT
7. width ✅ KEPT
8. all_media_describe_data ✅ KEPT

**After (5 outputs):**

1. processed_media_path
2. final_string
3. all_media_describe_data
4. height
5. width

### Rationale

- **`description`** - Removed (redundant: available in `all_media_describe_data` JSON)
- **`media_info`** - Removed (redundant: available in `all_media_describe_data` JSON)
- **`gemini_status`** - Removed (not commonly used in workflows)
- **`processed_media_path`** - **KEPT** (essential for tracking processed media)
- **`final_string`** - **KEPT** (primary output for prompt generation)
- **`all_media_describe_data`** - **KEPT** (contains all data including removed fields)
- **`height`** - **KEPT** (commonly used for workflow logic)
- **`width`** - **KEPT** (commonly used for workflow logic)

### Data Availability

All removed data is still available through the `all_media_describe_data` JSON output:

```json
{
    "description": "Full description text",
    "media_info": "Media metadata",
    "gemini_status": "API status",
    "final_string": "Description with prefix",
    "processed_media_path": "/path/to/media",
    "height": 1080,
    "width": 1920,
    "subject": "...",
    "cinematic_aesthetic": "...",
    "stylization_tone": "...",
    "clothing": "...",
    "scene": "...",
    "movement": "..."
}
```

## Files Modified

### Python Changes

**File**: `nodes/media_describe/mediia_describe.py`

1. **Updated RETURN_TYPES** (line ~1543):

```python
# Before
RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "INT", "INT", "STRING")

# After
RETURN_TYPES = ("STRING", "STRING", "STRING", "INT", "INT")
```

2. **Updated RETURN_NAMES** (line ~1544):

```python
# Before
RETURN_NAMES = ("description", "media_info", "gemini_status", "processed_media_path", "final_string", "height", "width", "all_media_describe_data")

# After
RETURN_NAMES = ("processed_media_path", "final_string", "all_media_describe_data", "height", "width")
```

3. **Updated all return statements** (4 locations):

```python
# Before
return (final_description, media_info_text, gemini_status, processed_media_path, final_string, output_height, output_width, all_data)

# After
return (processed_media_path, final_string, all_data, output_height, output_width)
```

### JavaScript Changes

**File**: `web/js/swiss-army-knife.js`

1. **Updated dimensions extraction** (lines ~1647-1673):

```javascript
// Before
if (Array.isArray(message) && message.length >= 7) {
    height = message[5]; // Index 5 is height
    width = message[6]; // Index 6 is width
}

// After
if (Array.isArray(message) && message.length >= 5) {
    height = message[3]; // Index 3 is height
    width = message[4]; // Index 4 is width
}
```

2. **Updated all_media_describe_data extraction** (line ~1697):

```javascript
// Before
if (Array.isArray(message) && message.length >= 8) {
    allDataJson = message[7]; // Index 7 is all_media_describe_data
}

// After
if (Array.isArray(message) && message.length >= 3) {
    allDataJson = message[2]; // Index 2 is all_media_describe_data
}
```

## Migration Guide

### If You Were Using Removed Outputs

#### Description Output

**Old:**

```
[MediaDescribe] → description → [Text Node]
```

**New:**

```
[MediaDescribe] → all_media_describe_data → [JSON Parser]
                                               ↓
                                        Extract "description"
```

**OR (recommended):**

```
[MediaDescribe] → final_string → [Text Node]
(final_string includes the description with prefix)
```

#### Media Info Output

**Old:**

```
[MediaDescribe] → media_info → [Display Node]
```

**New:**

```
[MediaDescribe] → all_media_describe_data → [JSON Parser]
                                               ↓
                                        Extract "media_info"
```

#### Gemini Status Output

**Old:**

```
[MediaDescribe] → gemini_status → [Debug Node]
```

**New:**

```
[MediaDescribe] → all_media_describe_data → [JSON Parser]
                                               ↓
                                        Extract "gemini_status"
```

### If You're Using Kept Outputs

**No changes needed!** These workflows continue to work:

```
[MediaDescribe] → final_string → [Your Workflow]
[MediaDescribe] → processed_media_path → [Your Workflow]
[MediaDescribe] → height/width → [Your Logic Nodes]
[MediaDescribe] → all_media_describe_data → [JSON Processing]
```

## Benefits

### ✅ Cleaner UI

- 3 fewer output sockets on the node
- Less visual clutter
- Easier to identify important outputs

### ✅ Simplified Workflows

- Focus on the most commonly used outputs
- Reduce connection complexity
- Easier for new users to understand

### ✅ No Data Loss

- All data still available in `all_media_describe_data`
- Can parse JSON to access removed fields
- Backward compatible for data access

### ✅ Better Organization

- Overview widget for quick reference
- Prompt Breakdown node for detailed viewing
- Essential outputs as sockets

## Testing Checklist

- [x] Python code updated (RETURN_TYPES, RETURN_NAMES)
- [x] All 4 return statements updated
- [x] JavaScript dimension extraction updated (index 3, 4)
- [x] JavaScript all_media_describe_data extraction updated (index 2)
- [x] No Python errors
- [x] No JavaScript errors
- [x] Output order correct: processed_media_path, final_string, all_media_describe_data, height, width

## Comparison

| Output                   | Before | After | Available in JSON? |
| ------------------------ | ------ | ----- | ------------------ |
| description              | ✅     | ❌    | ✅ Yes             |
| media_info               | ✅     | ❌    | ✅ Yes             |
| gemini_status            | ✅     | ❌    | ✅ Yes             |
| processed_media_path     | ✅     | ✅    | ✅ Yes             |
| final_string             | ✅     | ✅    | ✅ Yes             |
| height                   | ✅     | ✅    | ✅ Yes             |
| width                    | ✅     | ✅    | ✅ Yes             |
| all_media_describe_data  | ✅     | ✅    | N/A (is the JSON)  |
| **Total Output Sockets** | **8**  | **5** | -                  |

---

**Implementation Date**: October 7, 2025  
**Status**: Production Ready ✅  
**Breaking Changes**: Yes (3 output sockets removed) ⚠️  
**Data Loss**: None (all data in JSON) ✅
