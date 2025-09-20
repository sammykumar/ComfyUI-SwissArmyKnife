# Widget State Persistence Fix

## Problem Description

When using the `GeminiUtilMediaDescribe` node:

1. Change `media_source` to "Randomize Media from Path"
2. Save the workflow
3. Refresh the browser or reload the workflow
4. **Issue**: The "Choose Image to Upload" widget becomes visible again, even though `media_source` is still set to "Randomize Media from Path"

This happens because ComfyUI doesn't automatically persist JavaScript-controlled widget visibility changes when saving/loading workflows.

## Solution Implemented

Added ComfyUI's standard serialization system using `onSerialize` and `onConfigure` methods:

### 1. State Serialization (`onSerialize`)

-   Saves current UI state (media_source and media_type values) when workflow is saved
-   State is stored in the workflow JSON file

### 2. State Restoration (`onConfigure`)

-   Restores UI state when workflow is loaded
-   Sets widget values and calls `updateMediaWidgets()` to update visibility

### 3. Workflow Loading Hook (`loadedGraphNode`)

-   Ensures UI state is applied when workflows are loaded from files
-   Provides fallback for edge cases

## Technical Implementation

```javascript
// Save UI state during workflow save
const onSerialize = nodeType.prototype.onSerialize;
nodeType.prototype.onSerialize = function (o) {
    const result = onSerialize?.apply(this, arguments);

    o.ui_state = {
        media_source: this.mediaSourceWidget?.value || "Upload Media",
        media_type: this.mediaTypeWidget?.value || "image",
    };

    return result;
};

// Restore UI state during workflow load
const onConfigure = nodeType.prototype.onConfigure;
nodeType.prototype.onConfigure = function (o) {
    const result = onConfigure?.apply(this, arguments);

    if (o.ui_state) {
        // Set widget values
        if (this.mediaSourceWidget && o.ui_state.media_source) {
            this.mediaSourceWidget.value = o.ui_state.media_source;
        }
        if (this.mediaTypeWidget && o.ui_state.media_type) {
            this.mediaTypeWidget.value = o.ui_state.media_type;
        }

        // Update UI to match restored state
        setTimeout(() => {
            this.updateMediaWidgets();
        }, 0);
    }

    return result;
};
```

## Testing Steps

1. **Set up the node**:

    - Add a `GeminiUtilMediaDescribe` node to your workflow
    - Change `media_source` to "Randomize Media from Path"
    - Verify that the image upload widgets are hidden

2. **Save and reload**:

    - Save the workflow (Ctrl+S)
    - Refresh the browser or reload ComfyUI
    - Load the saved workflow

3. **Verify fix**:
    - ✅ The `media_source` should still be "Randomize Media from Path"
    - ✅ The image upload widgets should remain hidden
    - ✅ Only the `media_path` text input should be visible

## Benefits

-   **Persistent UI State**: Widget visibility is now properly saved/restored
-   **Consistent UX**: Users don't need to reconfigure the UI after reloading
-   **Standard Approach**: Uses ComfyUI's official serialization system
-   **Compatible**: Works with workflow sharing and version control

## Console Logging

The fix includes debug logging to help track state persistence:

```
[SERIALIZE] Saving UI state: {media_source: "Randomize Media from Path", media_type: "image"}
[CONFIGURE] Restoring UI state: {media_source: "Randomize Media from Path", media_type: "image"}
[CONFIGURE] UI state restored and widgets updated
[LOADED] Applied UI state for loaded workflow node
```

This fix follows ComfyUI best practices and is the standard solution used by other custom nodes with dynamic UI elements.
