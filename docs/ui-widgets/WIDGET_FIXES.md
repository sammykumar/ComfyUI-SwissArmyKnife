# Widget Fixes and Improvements

**Last Updated**: October 8, 2025  
**Nodes Affected**: MediaDescribe (formerly GeminiUtilMediaDescribe)

This document consolidates widget-related fixes and improvements for ComfyUI-SwissArmyKnife, including visibility management, state persistence, and execution result handling.

---

## Table of Contents

1. [Widget Visibility Investigation and Fixes](#widget-visibility-investigation-and-fixes)
2. [Final String Widget Update Fix](#final-string-widget-update-fix)
3. [Widget State Persistence Fix](#widget-state-persistence-fix)

---

## Widget Visibility Investigation and Fixes

### Problem Analysis

**Issues Found:**

1. **Visible unwanted widgets**: On load, the MediaDescribe node was showing `media_path`, `uploaded_image_file`, and `uploaded_video_file` input fields that should have been hidden.

2. **Video widgets shown when image selected**: Even when `media_type` was set to "image" (default), video-related widgets were still visible.

3. **Inconsistent node registration**: The JavaScript widget registration used `nodeType.comfyClass == "GeminiUtilMediaDescribe"` instead of the consistent pattern `nodeData.name === "GeminiUtilMediaDescribe"`.

**Root Causes:**

1. **Missing widget hiding mechanism**: The optional input fields defined in the Python `INPUT_TYPES` were not being hidden by the JavaScript widget system.

2. **Widget duplication**: The upload functions were creating new hidden widgets instead of using the existing optional input widgets.

3. **Incomplete widget management**: The dynamic widget system wasn't properly controlling the visibility of the original input widgets.

### Solutions Implemented

#### 1. Fixed Node Registration Condition

**File**: `web/js/swiss-army-knife.js`

```javascript
// BEFORE:
} else if (nodeType.comfyClass == "GeminiUtilMediaDescribe") {

// AFTER:
} else if (nodeData.name === "MediaDescribe") {
```

#### 2. Added Widget Hiding Mechanism

Added function to hide optional input widgets immediately on node creation:

```javascript
this.hideOptionalInputWidgets = function () {
    const widgetsToHide = [
        'media_path',
        'uploaded_image_file',
        'uploaded_video_file',
    ];

    for (const widgetName of widgetsToHide) {
        const widget = this.widgets.find((w) => w.name === widgetName);
        if (widget) {
            widget.type = 'hidden';
            widget.computeSize = () => [0, -4]; // Make it take no space
        }
    }
};
```

#### 3. Improved Widget Management System

Updated `updateMediaWidgets` function to:
- Find and control the original input widgets instead of creating duplicates
- Show/hide `media_path` widget based on `media_source` selection
- Properly hide unused upload widgets based on `media_type` selection

#### 4. Fixed Upload Functions

Updated both image and video upload functions to:
- Use the original `uploaded_image_file` and `uploaded_video_file` widgets
- Fall back to creating hidden widgets only if originals don't exist
- Properly update the original widgets with file paths

#### 5. Enhanced State Management

Updated `clearAllMediaState` function to:
- Clear both custom widgets and original input widgets
- Properly reset all widget values when switching modes

### Expected Behavior After Fixes

**On Node Load:**
- Only `media_source` and `media_type` dropdowns should be visible
- `media_path`, `uploaded_image_file`, and `uploaded_video_file` should be hidden
- Default configuration: "Upload Media" + "image" should show image upload widgets only

**When "Upload Media" + "image" is selected:**
- Image upload button and image info widget should be visible
- Video widgets should be hidden
- `media_path` widget should be hidden

**When "Upload Media" + "video" is selected:**
- Video upload button and video info widget should be visible
- Image widgets should be hidden
- `media_path` widget should be hidden

**When "Randomize Media from Path" is selected:**
- `media_path` text input should become visible
- All upload widgets should be hidden
- Upload file widgets should remain hidden

**During File Upload:**
- Uploaded file paths should be stored in the original input widgets
- These widgets remain hidden but contain the correct data for the Python node

---

## Final String Widget Update Fix

### Issue Description

The `final_string` widget was not being populated when ComfyUI nodes executed. This was because:

1. ✅ Python nodes correctly returned `final_string` as output
2. ✅ JavaScript widgets created the `finalStringWidget`
3. ❌ **Missing**: No mechanism to update the widget with execution results

### Solution Applied

Added `onExecuted` methods to node types that:

1. Listen for node execution completion
2. Extract the `final_string` output from the execution results
3. Update the `finalStringWidget.value` with the actual generated text

### Implementation

**File**: `web/js/swiss-army-knife.js`

```javascript
// MediaDescribe onExecuted handler
nodeType.prototype.onExecuted = function(message) {
    // Extract final_string from execution results
    const finalString = message.final_string || message[4]; // Try property or index
    
    // Update widget value
    if (this.finalStringWidget && finalString) {
        this.finalStringWidget.value = Array.isArray(finalString) 
            ? finalString[0] 
            : finalString;
        console.log('[MediaDescribe] Updated final_string widget with:', this.finalStringWidget.value);
    }
};
```

### Before vs After

**Before (Broken):**
```
final_string widget: "Populated Prompt (Will be generated automatically)"
```

**After (Fixed):**
```
final_string widget: "A woman with flowing hair stands gracefully in a sunlit garden. The scene unfolds on a wooden deck overlooking rolling hills..."
```

### Testing

**Using MediaDescribe Node:**

1. Add a "Media Describe" node to your workflow
2. Connect media input (upload or from path)
3. Configure your Gemini API key and prompts
4. Execute the workflow (Queue Prompt)
5. **Verify**: The `final_string` widget should populate with the actual generated description

**Using ShowText Helper Node:**

1. Add a "Show Text" node to your workflow
2. Connect the `final_string` output from MediaDescribe to the `text` input of ShowText
3. Execute the workflow
4. **Result**: ShowText node will display the final generated prompt text

### Example Workflow

```
[Load Image] → [MediaDescribe] → [ShowText]
                    ↓
             final_string widget updates
                    ↓
          [Connect final_string output to ShowText input]
```

### Debugging

- Check browser console for "Updated final_string widget with:" messages
- Verify execution completes without errors
- Ensure API key is valid and has quota

---

## Widget State Persistence Fix

### Problem Description

When using the MediaDescribe node:

1. Change `media_source` to "Randomize Media from Path"
2. Save the workflow
3. Refresh the browser or reload the workflow
4. **Issue**: The "Choose Image to Upload" widget becomes visible again, even though `media_source` is still set to "Randomize Media from Path"

This happens because ComfyUI doesn't automatically persist JavaScript-controlled widget visibility changes when saving/loading workflows.

### Solution Implemented

Added ComfyUI's standard serialization system using `onSerialize` and `onConfigure` methods:

#### 1. State Serialization (`onSerialize`)

Saves current UI state (media_source and media_type values) when workflow is saved. State is stored in the workflow JSON file.

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
```

#### 2. State Restoration (`onConfigure`)

Restores UI state when workflow is loaded. Sets widget values and calls `updateMediaWidgets()` to update visibility.

```javascript
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

#### 3. Workflow Loading Hook (`loadedGraphNode`)

Ensures UI state is applied when workflows are loaded from files. Provides fallback for edge cases.

```javascript
app.registerExtension({
    name: "comfyui_swissarmyknife.workflow_loader",
    async loadedGraphNode(node, app) {
        if (node.comfyClass === "MediaDescribe") {
            // Trigger widget update after workflow load
            setTimeout(() => {
                if (node.updateMediaWidgets) {
                    node.updateMediaWidgets();
                }
            }, 100);
        }
    }
});
```

### Testing Steps

1. **Set up the node**:
   - Add a MediaDescribe node to your workflow
   - Change `media_source` to "Randomize Media from Path"
   - Verify that the image upload widgets are hidden

2. **Save and reload**:
   - Save the workflow (`Ctrl+S`)
   - Refresh the browser or reload ComfyUI
   - Load the saved workflow

3. **Verify fix**:
   - ✅ The `media_source` should still be "Randomize Media from Path"
   - ✅ The image upload widgets should remain hidden
   - ✅ Only the `media_path` text input should be visible

### Benefits

- **Persistent UI State**: Widget visibility is now properly saved/restored
- **Consistent UX**: Users don't need to reconfigure the UI after reloading
- **Standard Approach**: Uses ComfyUI's official serialization system
- **Compatible**: Works with workflow sharing and version control

### Console Logging

Debug messages help verify state persistence:

```
[LOADED] loadedGraphNode called for MediaDescribe
[STATE] Restoring UI state: {"media_source": "Randomize Media from Path", "media_type": "image"}
[STATE] Updated widget visibility after state restoration
```

---

## Summary

These widget fixes ensure:

1. **Clean UI**: Only relevant widgets are visible based on user selections
2. **Proper Updates**: Execution results properly populate widget values
3. **Persistent State**: Widget visibility and values are saved/restored with workflows
4. **Better UX**: Intuitive interface that eliminates confusion

### Files Modified

- `web/js/swiss-army-knife.js` - Main widget management fixes

### Related Documentation

- [Dimensions Display Widget](DIMENSIONS_DISPLAY.md) - Another dynamic widget implementation
- [Seed Widget](SEED_WIDGET.md) - Randomization widget with visibility toggling
- [Control Panel Widget](CONTROL_PANEL.md) - Dashboard widget for monitoring
- [JavaScript Improvements](../features/JAVASCRIPT_IMPROVEMENTS.md) - Cache busting and debugging
