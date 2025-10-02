# Dimensions Display Widget for GeminiUtilMediaDescribe

## Overview

The `GeminiUtilMediaDescribe` node now displays the width and height of the processed media directly on the node itself using a JavaScript widget. This provides immediate visual feedback about the media dimensions without needing to connect the output to another node or check the console.

## Implementation

### Display Widget

A read-only text widget named `dimensions_display` is dynamically created or updated after the node executes:

```javascript
dimensionsWidget.value = `📐 Dimensions: ${width} x ${height}`;
```

### Key Features

1. **Dynamic Creation**: The widget is created dynamically after first execution if it doesn't exist
2. **Auto-Update**: Updates automatically each time the node executes with new media
3. **Visual Icon**: Uses 📐 emoji for easy identification
4. **Format**: Displays as "Width x Height" (e.g., "📐 Dimensions: 1920 x 1080")
5. **Non-Serializable**: The widget doesn't save to workflow (serialize: false) since values change per execution

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

### Debug Logging

The implementation includes extensive logging for troubleshooting:

```javascript
console.log('[MediaDescribe] onExecuted called with message:', message);
console.log('[MediaDescribe] Found dimensions in array format:', height, width);
console.log('[MediaDescribe] Updated dimensions display:', width, height);
```

## Python Node Output Structure

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

## UI Behavior

### Before Execution

- No dimensions widget is shown (or shows placeholder if pre-created)

### After Execution

- Widget appears/updates with format: `📐 Dimensions: WIDTH x HEIGHT`
- Node automatically resizes to accommodate the widget
- Canvas refreshes to show the update immediately

### Example Display

```
📐 Dimensions: 1920 x 1080
📐 Dimensions: 512 x 512
📐 Dimensions: 3840 x 2160
```

## Troubleshooting

### Widget Not Appearing

1. **Check Browser Console**: Look for "[MediaDescribe]" log messages
2. **Verify Execution**: Ensure the node actually executed (green border)
3. **Check Message Structure**: The debug logs show the exact message structure received
4. **Browser Cache**: Clear browser cache with hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Widget Shows Wrong Values

1. **Check Python Output**: Verify the Python node is returning correct height/width values
2. **Check Array Indices**: Ensure RETURN_TYPES order hasn't changed in Python
3. **Review Console Logs**: Debug logs show which message structure was used

### Widget Position Issues

The widget is added dynamically after execution, so it appears below existing widgets. If you want it in a specific position, you may need to reorder widgets in the node creation phase.

## Benefits

1. **Immediate Feedback**: No need to connect output to see dimensions
2. **Workflow Clarity**: Quickly identify media resolution at a glance
3. **Debug Aid**: Helps verify correct media loading and processing
4. **No Extra Nodes**: Doesn't require additional nodes to display values
5. **Non-Intrusive**: Doesn't affect workflow serialization or node connectivity

## Technical Details

- **File**: `web/js/swiss-army-knife.js`
- **Node**: `GeminiUtilMediaDescribe`
- **Widget Type**: Text (read-only)
- **Widget Name**: `dimensions_display`
- **Serialization**: Disabled (serialize: false)
- **Update Trigger**: `onExecuted` method

## Future Enhancements

Possible improvements:

- Add file size display
- Show media format/codec information
- Display frame rate for videos
- Add duration for videos
- Color-code based on resolution (HD, FHD, 4K, etc.)

## Related Documentation

- `CLEAR_VIDEO_PREVIEW_FUNCTION_ORDER_FIX.md` - JavaScript method ordering
- `IMPLEMENTATION_STATUS.md` - Overall feature status
- Python node documentation in `nodes/nodes.py`

## Date Implemented

October 2, 2025
