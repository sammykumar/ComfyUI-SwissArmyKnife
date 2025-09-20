# Widget Investigation and Fixes

## Problem Analysis

### Issues Found:

1. **Visible unwanted widgets**: On load, the GeminiMediaDescribe node was showing `media_path`, `uploaded_image_file`, and `uploaded_video_file` input fields that should have been hidden.

2. **Video widgets shown when image selected**: Even when `media_type` was set to "image" (default), video-related widgets were still visible.

3. **Inconsistent node registration**: The JavaScript widget registration used `nodeType.comfyClass == "GeminiUtilMediaDescribe"` instead of the consistent pattern `nodeData.name === "GeminiUtilMediaDescribe"`.

### Root Causes:

1. **Missing widget hiding mechanism**: The optional input fields defined in the Python `INPUT_TYPES` were not being hidden by the JavaScript widget system.

2. **Widget duplication**: The upload functions were creating new hidden widgets instead of using the existing optional input widgets.

3. **Incomplete widget management**: The dynamic widget system wasn't properly controlling the visibility of the original input widgets.

## Solutions Implemented:

### 1. Fixed Node Registration Condition

**File**: `web/js/gemini_widgets.js`
**Change**:

```javascript
// BEFORE:
} else if (nodeType.comfyClass == "GeminiUtilMediaDescribe") {

// AFTER:
} else if (nodeData.name === "GeminiUtilMediaDescribe") {
```

### 2. Added Widget Hiding Mechanism

**Added function** to hide optional input widgets immediately on node creation:

```javascript
this.hideOptionalInputWidgets = function () {
    const widgetsToHide = [
        "media_path",
        "uploaded_image_file",
        "uploaded_video_file",
    ];

    for (const widgetName of widgetsToHide) {
        const widget = this.widgets.find((w) => w.name === widgetName);
        if (widget) {
            widget.type = "hidden";
            widget.computeSize = () => [0, -4]; // Make it take no space
        }
    }
};
```

### 3. Improved Widget Management System

**Updated** `updateMediaWidgets` function to:

-   Find and control the original input widgets instead of creating duplicates
-   Show/hide `media_path` widget based on `media_source` selection
-   Properly hide unused upload widgets based on `media_type` selection

### 4. Fixed Upload Functions

**Updated** both image and video upload functions to:

-   Use the original `uploaded_image_file` and `uploaded_video_file` widgets
-   Fall back to creating hidden widgets only if originals don't exist
-   Properly update the original widgets with file paths

### 5. Enhanced State Management

**Updated** `clearAllMediaState` function to:

-   Clear both custom widgets and original input widgets
-   Properly reset all widget values when switching modes

### 6. Added Missing Features

**Added** missing `final_string` widget and `onExecuted` handler for the GeminiMediaDescribe node to match the functionality of other nodes.

## Expected Behavior After Fixes:

### On Node Load:

-   Only `media_source` and `media_type` dropdowns should be visible
-   `media_path`, `uploaded_image_file`, and `uploaded_video_file` should be hidden
-   Default configuration: "Upload Media" + "image" should show image upload widgets only

### When "Upload Media" + "image" is selected:

-   Image upload button and image info widget should be visible
-   Video widgets should be hidden
-   `media_path` widget should be hidden

### When "Upload Media" + "video" is selected:

-   Video upload button and video info widget should be visible
-   Image widgets should be hidden
-   `media_path` widget should be hidden

### When "Randomize Media from Path" is selected:

-   `media_path` text input should become visible
-   All upload widgets should be hidden
-   Upload file widgets should remain hidden

### During File Upload:

-   Uploaded file paths should be stored in the original input widgets
-   These widgets remain hidden but contain the correct data for the Python node

## Testing Recommendations:

1. **Load the GeminiMediaDescribe node** and verify only expected widgets are visible
2. **Switch between media_source options** and verify appropriate widgets show/hide
3. **Switch between media_type options** and verify appropriate widgets show/hide
4. **Upload files** and verify they're processed correctly
5. **Execute the node** and verify the final_string widget updates properly

## Files Modified:

-   `web/js/gemini_widgets.js` - Main widget management fixes

The fixes ensure a clean, intuitive user interface that only shows relevant widgets based on user selections, eliminating confusion and improving usability.
