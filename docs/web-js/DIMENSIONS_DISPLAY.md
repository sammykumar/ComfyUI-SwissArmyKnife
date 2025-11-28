# Dimensions Display Widget

**Last Updated**: October 8, 2025  
**Node**: MediaDescribe (formerly GeminiUtilMediaDescribe)

The MediaDescribe node displays the width and height of processed media directly on the node using a JavaScript widget. This provides immediate visual feedback about media dimensions without needing to connect the output to another node or check the console.

---

## Table of Contents

1. [Overview](#overview)
2. [Implementation](#implementation)
3. [Troubleshooting](#troubleshooting)
4. [Testing](#testing)

---

## Overview

### Display Widget

A read-only text widget named `dimensions_display` is dynamically created or updated after the node executes:

```javascript
dimensionsWidget.value = `📐 Dimensions: ${width} x ${height}`;
```

### Key Features

1. **Dynamic Creation**: Widget is created dynamically after first execution if it doesn't exist
2. **Auto-Update**: Updates automatically each time the node executes with new media
3. **Visual Icon**: Uses 📐 emoji for easy identification
4. **Format**: Displays as "Width x Height" (e.g., "📐 Dimensions: 1920 x 1080")
5. **Non-Serializable**: Widget doesn't save to workflow (serialize: false) since values change per execution

### UI Behavior

**Before Execution:**

- No dimensions widget is shown (or shows placeholder if pre-created)

**After Execution:**

- Widget appears/updates with format: `📐 Dimensions: WIDTH x HEIGHT`
- Node automatically resizes to accommodate the widget
- Canvas refreshes to show the update immediately

**Example Display:**

```
📐 Dimensions: 1920 x 1080
📐 Dimensions: 512 x 512
📐 Dimensions: 3840 x 2160
```

---

## Implementation

### Message Structure Handling

The implementation handles multiple possible message structures from ComfyUI:

#### Structure 1: Array Format

```javascript
// message = [description, media_info, status, path, final_string, height, width]
height = message[5]; // Index 5
width = message[6]; // Index 6
```

#### Structure 2: Property Format

```javascript
// message = { height: [1080], width: [1920], ... }
height = Array.isArray(message.height) ? message.height[0] : message.height;
width = Array.isArray(message.width) ? message.width[0] : message.width;
```

#### Structure 3: Output Array Format

```javascript
// message = {output: [desc, info, ..., height, width]}
height = message.output[5];
width = message.output[6];
```

#### Structure 4: Output Property Format

```javascript
// message = {output: {height: [1080], width: [1920]}}
height = Array.isArray(message.output.height)
    ? message.output.height[0]
    : message.output.height;
width = Array.isArray(message.output.width)
    ? message.output.width[0]
    : message.output.width;
```

### API Event Handler

Added a robust app-level API event handler that catches execution results directly from ComfyUI's execution API:

```javascript
import { api } from '../../../scripts/api.js';

api.addEventListener('executed', ({ detail }) => {
    const { node_id, output } = detail;
    const node = app.graph.getNodeById(node_id);

    if (node && node.comfyClass === 'MediaDescribe') {
        // Extract dimensions from API event
        const height = Array.isArray(output.height)
            ? output.height[0]
            : output.height;
        const width = Array.isArray(output.width)
            ? output.width[0]
            : output.width;

        if (height && width) {
            node.updateDimensionsDisplay(height, width);
        }
    }
});
```

### Helper Function

Created a reusable `updateDimensionsDisplay()` function:

```javascript
updateDimensionsDisplay(height, width) {
    let dimensionsWidget = this.widgets?.find(w => w.name === "dimensions_display");

    if (!dimensionsWidget) {
        // Create widget if it doesn't exist
        dimensionsWidget = this.addWidget("text", "dimensions_display", "", () => {}, {
            serialize: false
        });
    }

    // Update widget value
    dimensionsWidget.value = `📐 ${width} x ${height}`;

    // Force UI refresh
    this.setSize(this.computeSize());
    app.canvas.setDirty(true);
}
```

### Debug Logging

The implementation includes extensive logging for troubleshooting:

```javascript
console.log('[MediaDescribe] onExecuted called with message:', message);
console.log('[MediaDescribe] Found dimensions in array format:', height, width);
console.log('[MediaDescribe] Updated dimensions display:', width, height);
```

### Python Node Output Structure

The Python node returns a tuple with 7 elements:

```python
RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "INT", "INT")
RETURN_NAMES = ("description", "media_info", "gemini_status", "processed_media_path",
                "final_string", "height", "width")
```

**Output Indices:**

- 0: description (STRING)
- 1: media_info (STRING)
- 2: gemini_status (STRING)
- 3: processed_media_path (STRING)
- 4: final_string (STRING)
- 5: **height (INT)** ← Used for display
- 6: **width (INT)** ← Used for display

---

## Troubleshooting

### Quick Verification Steps

#### Step 1: Clear Browser Cache (CRITICAL!)

You **MUST** hard refresh your browser to see the changes:

- **Chrome/Edge (macOS)**: `Cmd + Shift + R`
- **Chrome/Edge (Windows/Linux)**: `Ctrl + Shift + R`
- **Firefox**: `Cmd + Shift + R` (macOS) or `Ctrl + F5` (Windows/Linux)
- **Safari**: `Cmd + Option + R`

#### Step 2: Check Console Logs

After hard refreshing, open the browser console (F12 or Cmd+Option+I) and look for these messages:

**On Page Load:**

```
Loading swiss-army-knife.js extension v1.4.0 at [timestamp]
```

**When Adding the Node:**

```
Registering MediaDescribe node with dynamic media widgets
```

**When Executing the Workflow:**

Look for **BOTH** of these log sequences:

**From API Event Handler:**

```
[API] Execution event received for node: [nodeId]
[API] Output data: {description: ..., height: [1080], width: [1920], ...}
[API] Found MediaDescribe execution result
[API] Extracted dimensions from API event: 1920 x 1080
[MediaDescribe] updateDimensionsDisplay called with: 1080 1920
[MediaDescribe] Created dimensions display widget
```

**From onExecuted Method:**

```
[MediaDescribe] onExecuted called
[MediaDescribe] Message type: object
[MediaDescribe] Message keys: [array of keys]
[MediaDescribe] Found dimensions in [format]: [height] [width]
[MediaDescribe] updateDimensionsDisplay called with: [height] [width]
[MediaDescribe] Updated dimensions display: [width] x [height]
```

#### Step 3: Verify Widget Appears

After executing the workflow, you should see a new text field on the node that displays:

```
📐 1920 x 1080
```

(or whatever the actual dimensions of your media are)

### Common Issues

#### Issue 1: No Console Logs at All

**Problem:** The extension file hasn't loaded or browser cache not cleared.

**Solution:**

1. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Check that `/web/js/swiss-army-knife.js` file exists
3. Verify ComfyUI server restarted if needed
4. Check browser console for JavaScript errors

#### Issue 2: Logs Show "Could not extract dimensions"

**Problem:** Message structure is different than expected.

**Solution:**

1. Check the full console log for `[MediaDescribe] Message keys:`
2. Look at what keys are available in the message object
3. Report the message structure for further debugging

#### Issue 3: Widget Creates But Doesn't Show

**Problem:** Widget is hidden or node size not updating.

**Solution:**

1. Try manually resizing the node in ComfyUI
2. Check if the widget name conflicts with another widget
3. Look for console errors about widget creation
4. Try reloading the workflow

#### Issue 4: "api is not defined" Error

**Problem:** The API import statement is missing.

**Solution:**
Check that the file has this import at the top:

```javascript
import { api } from '../../../scripts/api.js';
```

#### Issue 5: Widget Shows Wrong Values

**Problem:** Incorrect dimension extraction.

**Solution:**

1. Check Python output: Verify the Python node returns correct height/width values
2. Check Array Indices: Ensure RETURN_TYPES order hasn't changed in Python
3. Review Console Logs: Debug logs show which message structure was used

#### Issue 6: Widget Position Issues

**Problem:** Widget appears in unexpected location.

**Solution:**
The widget is added dynamically after execution, so it appears below existing widgets. Widget ordering is determined by creation order in the node setup phase.

---

## Testing

### Testing Procedure

1. **Clear cache** (Cmd+Shift+R / Ctrl+Shift+R)
2. **Open console** (F12)
3. **Add MediaDescribe node** to workflow
4. **Set** media_source to "Reddit Post" (or upload media)
5. **Enter** a Reddit URL (or upload file)
6. **Execute** the workflow (Queue Prompt)
7. **Watch console** for the log messages above
8. **Check node** for the 📐 widget

### Expected Behavior

**Before Execution:**

- Node shows normal widgets (media_source, media_type, reddit_url, etc.)
- No dimensions widget visible

**During Execution:**

- Node shows green border
- Console logs execution events

**After Execution:**

- Node shows green border (completed)
- **📐 1920 x 1080** widget appears at bottom of node
- Widget shows actual width x height of processed media
- Console shows success messages

---

## Benefits

1. **Immediate Feedback**: No need to connect output to see dimensions
2. **Workflow Clarity**: Quickly identify media resolution at a glance
3. **Debug Aid**: Helps verify correct media loading and processing
4. **No Extra Nodes**: Doesn't require additional nodes to display values
5. **Non-Intrusive**: Doesn't affect workflow serialization or node connectivity

---

## Technical Details

- **File**: `web/js/swiss-army-knife.js`
- **Node**: `MediaDescribe`
- **Widget Type**: Text (read-only)
- **Widget Name**: `dimensions_display`
- **Serialization**: Disabled (serialize: false)
- **Update Trigger**: `onExecuted` method + API event handler

---

## Future Enhancements

Possible improvements:

- Add file size display
- Show media format/codec information
- Display frame rate for videos
- Add duration for videos
- Color-code based on resolution (HD, FHD, 4K, etc.)
- Aspect ratio display
- Megapixel calculation

---

## Related Documentation

- [Media Describe Node](../nodes/media-describe/) - Main node documentation
- [JavaScript Improvements](../features/JAVASCRIPT_IMPROVEMENTS.md) - Cache busting and debugging
- [Debug System](../infrastructure/debug/) - For widget debugging
