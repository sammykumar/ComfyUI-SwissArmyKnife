# All Media Describe Data Output Feature

**Date**: October 2, 2025  
**Status**: Completed

## Overview

The `MediaDescribe` node now includes a new output called `all_media_describe_data` that aggregates all the node's outputs into a single, formatted string. This is specifically designed to work seamlessly with the Control Panel node, allowing you to view all MediaDescribe information in one place.

## Implementation

### New Output

**Output Name**: `all_media_describe_data`  
**Type**: `STRING`  
**Position**: 8th output (index 7)

### Output Format

The aggregated data is formatted as a multi-line string with emoji labels and clear sections:

```
📝 Description:
<Full description from Gemini>

📊 Media Info:
<Media information including file details, dimensions, etc.>

🔄 Gemini Status:
<Gemini API status with model, API key info, cache status>

📁 Processed Media Path:
<Path to the processed media file>

✨ Final String:
<Final formatted string with prefix>

📐 Dimensions:
<width> x <height>
```

## Usage with Control Panel

### Setup

1. Add `MediaDescribe` node to your workflow
2. Add `Control Panel` node
3. Right-click Control Panel and select "➕ Add input" (if needed)
4. Connect `MediaDescribe.all_media_describe_data` → `ControlPanel.in1`

### Result

After workflow execution, the Control Panel will display all MediaDescribe information in a beautifully formatted view:

```
═══ EXECUTION RESULTS ═══

📊 in1:
📝 Description:
A woman with long brown hair wearing a red dress...

📊 Media Info:
📹 Video Processing Info (Reddit post):
• Title: Amazing video...

🔄 Gemini Status:
🤖 Gemini Analysis Status: ✅ Complete
• Model: gemini-2.0-flash-exp
...

📐 Dimensions:
1920 x 1080
```

## Benefits

### Single Connection Point

- **Before**: Required 7 separate connections to see all MediaDescribe outputs
- **After**: Just 1 connection shows everything

### Organized Display

- Clear emoji labels for each section
- Proper spacing and formatting
- Easy to read and understand

### Flexible Usage

- Can still use individual outputs if needed
- Aggregated output is an additional option, not a replacement
- Works with any Control Panel input slot

## Code Changes

### Python Changes (`mediia_describe.py`)

1. **Updated RETURN_TYPES**:

```python
RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "INT", "INT", "STRING")
```

2. **Updated RETURN_NAMES**:

```python
RETURN_NAMES = ("description", "media_info", "gemini_status", "processed_media_path",
                "final_string", "height", "width", "all_media_describe_data")
```

3. **Added aggregation before each return**:

```python
# Create aggregated data output for Control Panel
all_data = (
    f"📝 Description:\n{description}\n\n"
    f"📊 Media Info:\n{media_info_text}\n\n"
    f"🔄 Gemini Status:\n{gemini_status}\n\n"
    f"📁 Processed Media Path:\n{processed_media_path}\n\n"
    f"✨ Final String:\n{final_string}\n\n"
    f"📐 Dimensions:\n{output_width} x {output_height}"
)

return (..., all_data)
```

### Locations Updated

All return statements in `_process_image()` and `_process_video()`:

- Cached image result (line ~812)
- Fresh image result (line ~875)
- Cached video result (line ~1151)
- Fresh video result (line ~1222)

## Compatibility

### Backward Compatibility

✅ **Fully compatible** - Existing workflows continue to work without changes. The new output is additive only.

### Forward Compatibility

✅ **Works with existing nodes** - The aggregated output is a standard STRING type that can be connected to any STRING input.

## Examples

### Example 1: Simple Monitoring

Connect `all_media_describe_data` to a single Control Panel input to monitor your MediaDescribe workflow:

```
[MediaDescribe] → (all_media_describe_data) → [Control Panel.in1]
```

### Example 2: Multiple MediaDescribe Nodes

Monitor multiple MediaDescribe nodes simultaneously:

```
[MediaDescribe #1] → (all_media_describe_data) → [Control Panel.in1]
[MediaDescribe #2] → (all_media_describe_data) → [Control Panel.in2]
```

### Example 3: Mixed Monitoring

Combine aggregated and individual outputs:

```
[MediaDescribe] → (all_media_describe_data) → [Control Panel.in1]
[MediaDescribe] → (height) → [Control Panel.in2]
[MediaDescribe] → (width) → [Control Panel.in3]
```

## Testing

To test the new output:

1. **Create Test Workflow**:
    - Add MediaDescribe node
    - Add Control Panel node
    - Connect `all_media_describe_data` output

2. **Run Workflow**:
    - Upload or select media
    - Execute workflow
    - Check Control Panel display

3. **Verify Output**:
    - All sections should be present
    - Formatting should be clean
    - Data should match individual outputs

## Troubleshooting

### Issue: Aggregated output shows empty sections

**Solution**: Check that all MediaDescribe inputs are properly configured. Empty values will show as empty sections in the aggregated output.

### Issue: Display is cut off in Control Panel

**Solution**: The Control Panel has a 500-character truncation per field. The full content is still in the output; just not all displayed. You can adjust this in the JavaScript code if needed.

### Issue: Formatting looks wrong

**Solution**: Ensure you're connecting to a Control Panel node, not a regular text display. The Control Panel preserves line breaks and formatting.

## Future Enhancements

Possible improvements:

1. **Customizable Format**: Allow users to choose which sections to include
2. **JSON Output Option**: Provide structured JSON instead of formatted text
3. **HTML Formatting**: Rich text formatting for better visualization
4. **Collapsible Sections**: Interactive sections in the Control Panel UI

## Related Documentation

- [Control Panel Implementation](./CONTROL_PANEL_IMPLEMENTATION.md)
- [MediaDescribe Class Documentation](../nodes/media_describe/mediia_describe.py)

## Conclusion

The `all_media_describe_data` output provides a convenient way to view all MediaDescribe information in a single, well-formatted display. It's perfect for monitoring, debugging, and understanding what your MediaDescribe node is producing without connecting multiple wires.
