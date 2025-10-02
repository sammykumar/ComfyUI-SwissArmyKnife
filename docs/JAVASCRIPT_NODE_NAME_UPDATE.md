# JavaScript Node Name Update - MediaDescribe

## Overview

Updated all JavaScript references from `GeminiUtilMediaDescribe` to `MediaDescribe` to match the Python node ID change in `NODE_CLASS_MAPPINGS`.

## Problem

The Python backend had already renamed the node ID from `"GeminiUtilMediaDescribe"` to `"MediaDescribe"` in the `NODE_CLASS_MAPPINGS`, but the JavaScript code in `web/js/swiss-army-knife.js` was still using the old name, causing the JavaScript widgets and event handlers to fail to attach to the node.

## Changes Made

Updated all 9 occurrences of `GeminiUtilMediaDescribe` to `MediaDescribe` in `/web/js/swiss-army-knife.js`:

### 1. Node Registration (Line ~238)

```javascript
// Before
else if (nodeData.name === "GeminiUtilMediaDescribe") {
    debugLog("Registering GeminiUtilMediaDescribe node with dynamic media widgets");

// After
else if (nodeData.name === "MediaDescribe") {
    debugLog("Registering MediaDescribe node with dynamic media widgets");
```

### 2. Workflow Loading Hook (Line ~1403)

```javascript
// Before
if (node.comfyClass === "GeminiUtilMediaDescribe") {
    debugLog("[LOADED] loadedGraphNode called for GeminiUtilMediaDescribe");

// After
if (node.comfyClass === "MediaDescribe") {
    debugLog("[LOADED] loadedGraphNode called for MediaDescribe");
```

### 3. Execution Event Handler (Line ~1435-1483)

```javascript
// Before
// Setup app-level execution handler for GeminiUtilMediaDescribe
async setup() {
    // ...
    if (node && node.comfyClass === "GeminiUtilMediaDescribe") {
        debugLog("[API] ✅ Found GeminiUtilMediaDescribe execution result");
        // ...
    } else {
        debugLog("[API] ❌ Not a GeminiUtilMediaDescribe node, skipping");
    }
}

// After
// Setup app-level execution handler for MediaDescribe
async setup() {
    // ...
    if (node && node.comfyClass === "MediaDescribe") {
        debugLog("[API] ✅ Found MediaDescribe execution result");
        // ...
    } else {
        debugLog("[API] ❌ Not a MediaDescribe node, skipping");
    }
}
```

## Impact

### Fixed Functionality

- JavaScript widgets now properly attach to the MediaDescribe node
- Dynamic media upload widgets (image/video) work correctly
- Reddit URL widget visibility toggling works
- Seed widget for randomization works
- Dimensions display widget shows correct height/width
- File persistence on workflow save/load works

### Backward Compatibility

- **Breaking Change**: Existing workflows using the old node will need to be updated
- The Python node ID changed from `"GeminiUtilMediaDescribe"` to `"MediaDescribe"`
- Users with saved workflows containing the old node ID will need to:
    1. Open the workflow JSON
    2. Find and replace `"GeminiUtilMediaDescribe"` with `"MediaDescribe"`
    3. Or recreate the node in ComfyUI

## Testing

After these changes, verify:

1. ✅ MediaDescribe node appears in the node menu
2. ✅ Dynamic widgets appear based on media_source selection:
    - Upload Media → Shows image/video upload buttons
    - Randomize from Path → Shows media_path and seed inputs
    - Reddit Post → Shows reddit_url input
3. ✅ File uploads work and persist across workflow save/load
4. ✅ Dimensions display widget shows after execution
5. ✅ Video/image previews work correctly

## Related Files

- `/web/js/swiss-army-knife.js` - JavaScript widgets and event handlers (UPDATED)
- `/nodes/nodes.py` - Python node definitions (already updated)
- `/nodes/media_describe/mediia_describe.py` - MediaDescribe class implementation

## Related Documentation

- `docs/CLASS_RENAME_MEDIADESCRIBE.md` - Original class rename documentation
- `docs/GEMINI_API_RETRY_LOGIC.md` - Retry logic implementation (uses updated name)
- `docs/DIMENSIONS_DISPLAY_WIDGET.md` - Dimensions display feature (references old name)
- `docs/WIDGET_INVESTIGATION_AND_FIXES.md` - Widget fixes (references old name)

## Notes

- The display name "Media Describe" remains unchanged
- All debug logs updated to use new name for consistency
- Comment headers updated to reflect new node name
- This aligns JavaScript code with the Python backend node registration
