# Control Panel Widget

**Last Updated**: October 8, 2025  
**Status**: Completed

The Control Panel node is a display-only dashboard node that shows data from connected workflow nodes. It includes a predefined input specifically designed for MediaDescribe's `all_media_describe_data` output, plus the ability to add dynamic wildcard inputs for other connections.

---

## Table of Contents

1. [Overview](#overview)
2. [Implementation Details](#implementation-details)
3. [JSON Data Format](#json-data-format)
4. [Usage](#usage)
5. [Troubleshooting](#troubleshooting)

---

## Overview

The Control Panel provides a flexible dashboard for monitoring workflow data with:

- **Predefined Input**: `all_media_describe_data` input for MediaDescribe integration
- **Dynamic Inputs**: Add unlimited wildcard inputs via context menu
- **Dual Display Modes**: Connection info (before execution) and execution results (after execution)
- **Two-Column Layout**: Organized display with left (metadata) and right (content) columns
- **Real-time Updates**: Automatically updates when connections change or execution completes

---

## Implementation Details

### Backend (Python)

**File**: `nodes/utils/control_panel.py`

#### Key Features

1. **Predefined Input**
    - Includes `all_media_describe_data` input specifically for MediaDescribe node
    - Type: STRING with `forceInput: True` (connection-only, no text widget)
    - Perfect for connecting MediaDescribe's aggregated output

2. **Dynamic Input Handling**
    - Accepts `**kwargs` to handle any connected inputs dynamically
    - Python side automatically receives all connected data
    - Can add more wildcard inputs via JavaScript context menu

3. **OUTPUT_NODE Configuration**
    - Set as `OUTPUT_NODE = True` to display in UI
    - `RETURN_TYPES = ()` - no outputs, display-only node
    - Returns data via `{"ui": {...}}` format for JavaScript consumption

4. **Console Logging**
    - Logs all connected data to console with formatting
    - Truncates long strings (>200 chars) for readability
    - Displays "(No inputs connected)" when no data available

5. **Data Format**
    - Converts all values to lists (ComfyUI convention)
    - Returns `{"ui": {key: [value], ...}}` structure
    - JavaScript reads from `message.output` in execution handler

### Frontend (JavaScript)

**File**: `web/js/swiss-army-knife.js`

#### Key Features

1. **Predefined Input Display**
    - Node starts with `all_media_describe_data` input (from Python definition)
    - No default wildcard inputs added (predefined input is sufficient)
    - Input counter initialized from existing inputs

2. **Dynamic Wildcard Inputs**
    - Uses `"*"` type to accept any datatype (except primitives)
    - Right-click context menu: "➕ Add input" to add more
    - Can add as many additional inputs as needed

3. **DOM Widget Display**
    - Scrollable monospace display area (max 300px height)
    - Shows two modes:
        - **Connection mode**: Lists connected nodes and outputs
        - **Execution mode**: Shows actual data values from execution

4. **Connection Information Display**
    - Shows `inputName ⇐ NodeName.outputName` format
    - Updates automatically when connections change
    - Uses `getInputLink()` and `getNodeById()` to resolve connections

5. **Execution Data Display**
    - Triggered by `onExecuted` handler
    - Reads from `message.output` structure
    - Formats data with emoji prefixes and truncation
    - Handles both array and direct values

6. **Context Menu Options**
    - **"➕ Add input"**: Adds a new wildcard input slot
    - **"♻︎ Rebuild summary"**: Forces refresh of connection display

7. **Auto-Update Triggers**
    - `onConnectionsChange`: Updates when links are made/broken
    - `onExecuted`: Updates with execution results
    - `onResize`: Adjusts DOM width to match node width

---

## JSON Data Format

### The Problem (Original Implementation)

The Control Panel was receiving a pre-formatted text string from MediaDescribe:

```python
# Old approach - formatted string
all_data = (
    f"📝 Description:\n{description}\n\n"
    f"📊 Media Info:\n{media_info_text}\n\n"
    # ... etc
)
```

This prevented the Control Panel from accessing individual fields, making it impossible to:

- Parse and format individual values
- Create organized multi-column layouts
- Filter or transform specific fields

### The Solution (JSON Format)

Changed `all_media_describe_data` to a JSON string containing individual fields:

```python
# New approach - structured JSON
all_data = json.dumps({
    "description": description,
    "media_info": media_info_text,
    "gemini_status": gemini_status,
    "processed_media_path": processed_media_path,
    "final_string": final_string,
    "height": output_height,
    "width": output_width
})
```

This change was applied to all four locations in `mediia_describe.py` where `all_data` is created:

1. Image upload with cache hit
2. Image processing without cache
3. Video with cache hit
4. Video processing without cache

### Two-Column Layout

The Control Panel now uses a **flexbox two-column layout**:

**Left Column (50% width)** - Technical Metadata:

- 📊 Media Info
- 🔄 Gemini Status
- 📁 Processed Media Path
- 📐 Height
- 📐 Width

**Right Column (50% width)** - Content & Outputs:

- 📝 Description
- ✨ Final String

Each column:

- Has independent scrolling for long content
- Uses monospace font for better readability
- Properly handles truncation (>500 characters)
- Falls back to raw display if JSON parsing fails

### Files Modified

**Python:**

- `nodes/media_describe/mediia_describe.py`
    - Added `import json` at the top
    - Converted all 4 `all_data` assignments to use `json.dumps()`

**JavaScript:**

- `web/js/swiss-army-knife.js`
    - Created two-column flex layout for Control Panel DOM
    - Updated `updateControlPanelData()` function to parse JSON and distribute fields
    - Updated `updateControlPanelSummary()` to work with two-column layout
    - Added `_cp_leftColumn` and `_cp_rightColumn` references for column management

### Benefits

1. **Structured Data**: Control Panel receives structured JSON instead of pre-formatted text
2. **Two-Column Layout**: Better organization with metadata and content separation
3. **Independent Scrolling**: Each column scrolls independently for long content
4. **Flexibility**: JavaScript can format, truncate, or transform individual fields
5. **Extensibility**: Easy to add new fields or change display order
6. **Better UX**: Clearly labeled sections in an organized layout
7. **Space Efficiency**: 50/50 split maximizes horizontal space usage

---

## Usage

### Basic Setup

1. Add "🎛️ Control Panel" node to workflow
2. Node starts with `all_media_describe_data` input
3. Connect MediaDescribe's `all_media_describe_data` output to it

### Adding More Inputs

1. Right-click on Control Panel node
2. Select "➕ Add input"
3. New input slot appears (`in1`, `in2`, etc.)
4. Connect any non-primitive output to the new input

### Viewing Results

**Before Execution (Connection Mode)**:

```
all_media_describe_data ⇐ MediaDescribe.all_media_describe_data
```

**After Execution (Data Mode)**:

```
═══ EXECUTION RESULTS ═══

Left Column:              Right Column:
📊 Media Info:           📝 Description:
📹 Video Processing...   A woman with long...

🔄 Gemini Status:        ✨ Final String:
✅ Complete              woman, long hair...

📁 Processed Media Path:
/path/to/media.mp4

📐 Dimensions:
1920 x 1080
```

### Testing

To verify the Control Panel:

1. **Create a workflow** with:
    - MediaDescribe node
    - ControlPanel node
    - Connect MediaDescribe's `all_media_describe_data` output to ControlPanel's input

2. **Execute the workflow** with an image or video

3. **Verify Control Panel displays**:
    - Two-column layout (50/50 split)
    - Left column: media_info, gemini_status, processed_media_path, height, width
    - Right column: description, final_string
    - Each field individually displayed with emoji labels
    - Proper formatting and spacing
    - Independent scrolling for each column

---

## Troubleshooting

### Issue: NullArgumentError - LGraph reference null or undefined

**Solution**: Fixed by adding proper null checks in `updateControlPanelSummary()` function. The function now checks for `this.graph || app.graph` with fallback and defers the initial summary update by 100ms to ensure the graph is fully initialized.

### Issue: Control Panel not updating with execution results

**Solution**: The Control Panel node now listens to API execution events in the `setup()` method. Added handler for `node.comfyClass === "ControlPanel"` that calls `node.updateControlPanelData(output)` when execution completes.

### Issue: Inputs not accepting connections

**Solution**: Verify the output is not a primitive type. Wildcard inputs (`"*"`) only accept non-primitive datatypes (STRING, INT, IMAGE, etc. - not direct text input).

### Issue: Data not displaying after execution

**Solution**:

1. Check browser console for debug logs (enable DEBUG mode)
2. Verify Python node is returning `{"ui": {...}}` structure
3. Ensure MediaDescribe is outputting JSON format, not formatted string

### Issue: Display area too small/large

**Solution**:

1. Adjust `maxHeight` in DOM element styling (currently 300px)
2. Or resize node manually by dragging corners
3. Use `onResize` to adjust width automatically

### Issue: Browser cache showing old version

**Solution**: Hard refresh (`Cmd+Shift+R` on macOS, `Ctrl+Shift+R` on Windows/Linux) or use cache clearing utilities. See [JavaScript Improvements](../features/JAVASCRIPT_IMPROVEMENTS.md) for cache busting details.

### Issue: JSON parsing fails

**Solution**: The Control Panel includes fallback handling. If JSON parsing fails, it displays the raw data. Check:

1. MediaDescribe node is using updated version with JSON output
2. `all_media_describe_data` contains valid JSON string
3. No corruption in data transmission

---

## Technical Details

### ComfyUI Integration

**Node Registration:**

- Python class exported via `CONTROL_PANEL_NODE_CLASS_MAPPINGS`
- Display name: "🎛️ Control Panel"
- Category: "Utils"

**Wildcard Input Type (`"*"`):**

- Accepts any non-primitive datatype
- Allows connection to STRING, INT, IMAGE, etc.
- Does NOT accept primitive widgets (direct text input)

**Execution Flow:**

```
User connects nodes → Queue execution → Python runs →
Returns {"ui": data} → JavaScript onExecuted receives message.output →
DOM widget updates with parsed JSON
```

**Data Structure:**

```javascript
// Python returns:
{"ui": {"all_media_describe_data": ["{\"description\": \"...\", ...}"]}}

// JavaScript receives in message.output:
{"all_media_describe_data": ["{\"description\": \"...\", ...}"]}

// JavaScript parses to:
{description: "...", media_info: "...", gemini_status: "...", ...}
```

### Styling

Uses CSS custom properties for theming:

- `--comfy-menu-bg` / fallback `#1e1e1e`
- `--border-color` / fallback `#333`
- `--fg-color` / fallback `#d4d4d4`

Monospace font stack for cross-platform consistency:

```css
font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    monospace;
```

---

## Known Limitations

1. **Primitive Inputs**: Wildcard `"*"` type doesn't accept primitive widgets (text input fields)
2. **Serialization**: DOM content not saved to workflow (by design - `serialize: false`)
3. **Large Data**: Values truncated at 500 characters to prevent UI slowdown
4. **Input Naming**: Inputs named sequentially (`in1`, `in2`, etc.) - not customizable via UI
5. **JSON Parsing**: If MediaDescribe outputs non-JSON data, falls back to raw display

---

## Future Enhancements

Possible improvements:

1. **Custom Input Names**: Allow renaming inputs via context menu
2. **Collapsible Sections**: Expand/collapse individual data fields
3. **Export Data**: Copy-to-clipboard or save-to-file functionality
4. **Data Formatting**: JSON prettification, syntax highlighting
5. **Filter/Search**: Search within displayed data
6. **Display Modes**: Toggle between compact/expanded views
7. **Column Resize**: Draggable divider for custom column widths

---

## Related Documentation

- [Media Describe Node](../nodes/media-describe/) - AI content analysis integration
- [JavaScript Improvements](../features/JAVASCRIPT_IMPROVEMENTS.md) - Cache busting and updates
- [Debug System](../infrastructure/debug/) - For widget debugging
