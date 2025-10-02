# clearVideoPreview Function Order Fix

## Issue

When attempting to add the `GeminiUtilMediaDescribe` node to a ComfyUI workflow, users encountered the following JavaScript error:

```
TypeError: this.clearVideoPreview is not a function
```

The error stack trace showed:

```
at ComfyNode.clearAllMediaState (swiss-army-knife.js:254:26)
at ComfyNode.updateMediaWidgets (swiss-army-knife.js:380:26)
at nodeType.onNodeCreated (swiss-army-knife.js:703:22)
```

## Root Cause

The issue was caused by a **function definition order problem** in the JavaScript code. The `clearVideoPreview()` method was being called by `clearAllMediaState()` before it was defined:

1. **Line ~254**: `clearAllMediaState()` calls `this.clearVideoPreview()`
2. **Line ~1287**: `clearVideoPreview()` was defined as a prototype method

When the node was created, `clearAllMediaState()` would try to call a method that didn't exist yet, resulting in the "not a function" error.

## Solution

The fix involved two changes:

### 1. Move `clearVideoPreview` Definition Earlier

The `clearVideoPreview()` method was moved to be defined **immediately after** the widget references are set up and **before** `clearAllMediaState()` is defined:

```javascript
// Find the media_source widget
this.mediaSourceWidget = this.widgets.find((w) => w.name === "media_source");

// Find the media_type widget
this.mediaTypeWidget = this.widgets.find((w) => w.name === "media_type");

// Define clearVideoPreview early so it can be used by clearAllMediaState
this.clearVideoPreview = function () {
    // For the media node, we don't have complex video preview
    // This is just a placeholder method
    console.log("Video preview cleared for media node");
};

// Method to clear all media state (images, videos, previews, file data)
this.clearAllMediaState = function () {
    console.log("[DEBUG] clearAllMediaState called");
    // ... can now safely call this.clearVideoPreview()
```

### 2. Remove Duplicate Definition

The duplicate `nodeType.prototype.clearVideoPreview` definition that was defined later (around line 1287) was removed to avoid confusion and potential override issues.

## Technical Details

- **File Modified**: `web/js/swiss-army-knife.js`
- **Node Affected**: `GeminiUtilMediaDescribe`
- **Fix Type**: Function definition order correction
- **Impact**: Instance method vs prototype method - the fix uses instance method definition within `onNodeCreated` for consistency with other methods like `clearAllMediaState`

## Testing

After applying this fix:

1. The `GeminiUtilMediaDescribe` node can be successfully added to workflows
2. No JavaScript errors occur during node creation
3. The media state clearing functionality works as expected
4. Browser cache refresh is required to see the changes (standard for JavaScript widget updates)

## Prevention

When defining interdependent methods in JavaScript classes or prototypes:

1. **Define methods before they are called**, not after
2. Group related method definitions together for clarity
3. Be cautious with methods that call other methods - ensure dependencies are defined first
4. Consider using eslint rules like `no-use-before-define` to catch these issues early

## Related Files

- `/Users/samkumar/Development/dev-lab-hq/ai-image-hub/apps/comfyui-swiss-army-knife/web/js/swiss-army-knife.js`

## Date Fixed

October 2, 2025
