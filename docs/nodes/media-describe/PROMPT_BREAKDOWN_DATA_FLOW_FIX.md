# Prompt Breakdown Data Flow Fix

**Date**: October 7, 2025  
**Status**: ✅ Completed  
**Type**: Bug Fix

## Problem

The **Media Describe - Prompt Breakdown** node was not displaying paragraph data after execution. The node showed "Waiting for data..." even when connected to MediaDescribe's `all_media_describe_data` output.

## Root Cause

### Issue 1: Python Return Value

The Python `display_breakdown()` function was returning an empty dict `{}`, which meant no data was passed to the JavaScript frontend for display.

```python
# BEFORE (Incorrect)
def display_breakdown(self, all_media_describe_data):
    return {}  # ❌ No data sent to frontend!
```

### Issue 2: JavaScript Data Retrieval

The JavaScript `onExecuted` handler was looking for data in widgets, but with `forceInput: True`, the data comes through the execution message, not through widgets.

```javascript
// BEFORE (Incorrect)
const dataWidget = this.widgets?.find(
    (w) => w.name === 'all_media_describe_data',
);
// ❌ forceInput fields don't create widgets!
```

## Solution

### Fix 1: Return UI Data from Python

Updated the Python function to return data in the `ui` field, which is the standard ComfyUI pattern for passing data to frontend display nodes:

```python
# AFTER (Correct)
def display_breakdown(self, all_media_describe_data):
    """
    Process the JSON data for display.
    The actual display happens in the JavaScript UI widget.

    Args:
        all_media_describe_data: JSON string containing paragraph data

    Returns:
        Dict with ui key containing the data for JavaScript to display
    """
    # Return the data in the ui field so JavaScript can access it
    # This is the standard way ComfyUI passes data to frontend widgets
    return {
        "ui": {
            "all_media_describe_data": [all_media_describe_data]
        }
    }
```

### Fix 2: Read UI Data in JavaScript

Updated the `onExecuted` handler to read data from the execution message (where UI data is passed):

```javascript
// AFTER (Correct)
const onExecuted = nodeType.prototype.onExecuted;
nodeType.prototype.onExecuted = function (message) {
    const result = onExecuted?.apply(this, arguments);

    debugLog('[PromptBreakdown] onExecuted called');
    debugLog('[PromptBreakdown] Message:', message);
    debugLog(
        '[PromptBreakdown] Message keys:',
        message ? Object.keys(message) : 'null',
    );

    // Check for data in the UI field (standard ComfyUI pattern for display nodes)
    if (message && message.all_media_describe_data) {
        const jsonData = Array.isArray(message.all_media_describe_data)
            ? message.all_media_describe_data[0]
            : message.all_media_describe_data;

        debugLog(
            '[PromptBreakdown] Found data in message.all_media_describe_data:',
            jsonData?.substring(0, 200),
        );
        this.displayBreakdown(jsonData);
        return result;
    }

    // Fallback: check widgets (for backward compatibility)
    const dataWidget = this.widgets?.find(
        (w) => w.name === 'all_media_describe_data',
    );
    if (dataWidget && dataWidget.value) {
        debugLog(
            '[PromptBreakdown] Found widget data:',
            dataWidget.value.substring(0, 200),
        );
        this.displayBreakdown(dataWidget.value);
        return result;
    }

    debugLog('[PromptBreakdown] No data found in message or widgets');
    return result;
};
```

## ComfyUI Data Flow Pattern

### Display Nodes with forceInput

For nodes that:

- Have `OUTPUT_NODE = True` (display nodes)
- Use `forceInput: True` for inputs
- Need to pass data to frontend widgets

**Correct Pattern**:

1. **Python Side**:

```python
def my_function(self, input_data):
    return {
        "ui": {
            "my_data_field": [input_data]  # Data wrapped in array
        }
    }
```

2. **JavaScript Side**:

```javascript
nodeType.prototype.onExecuted = function (message) {
    if (message && message.my_data_field) {
        const data = Array.isArray(message.my_data_field)
            ? message.my_data_field[0]
            : message.my_data_field;
        this.displayMyData(data);
    }
};
```

### Key Points

1. **UI Field**: Data must be returned in the `ui` key of the return dict
2. **Array Wrapping**: Values in the `ui` dict should be wrapped in arrays
3. **Message Parameter**: JavaScript receives UI data via the `message` parameter in `onExecuted`
4. **Array Unwrapping**: JavaScript should unwrap the array to get the actual data

## Files Modified

### Python Changes

**File**: `nodes/media_describe/prompt_breakdown.py`

**Function**: `display_breakdown()`

**Change**: Return UI data instead of empty dict

```python
return {
    "ui": {
        "all_media_describe_data": [all_media_describe_data]
    }
}
```

### JavaScript Changes

**File**: `web/js/swiss-army-knife.js`

**Function**: `onExecuted` (MediaDescribePromptBreakdown)

**Changes**:

1. Check `message.all_media_describe_data` first (UI data)
2. Unwrap array if needed
3. Fallback to widget check for backward compatibility
4. Enhanced debug logging

## Testing Checklist

- [x] Python returns UI data correctly
- [x] JavaScript reads from message parameter
- [x] Array unwrapping works correctly
- [x] Debug logging shows data flow
- [x] Fallback to widgets for compatibility
- [x] No Python errors
- [x] No JavaScript errors

## Execution Flow

### Complete Data Flow

```
┌─────────────────────┐
│  MediaDescribe      │
│                     │
│  [Execute]          │
│  ↓                  │
│  Returns:           │
│  - final_string     │
│  - all_media_       │
│    describe_data ───┼───┐
└─────────────────────┘   │
                          │ Connection
                          ↓
┌─────────────────────────────────────┐
│  MediaDescribePromptBreakdown       │
│                                     │
│  INPUT:                             │
│  - all_media_describe_data ←────────┘
│    (forceInput: True)               │
│                                     │
│  [Execute display_breakdown()]      │
│  ↓                                  │
│  PYTHON: return {                   │
│    "ui": {                          │
│      "all_media_describe_data": [data]
│    }                                │
│  }                                  │
│  ↓                                  │
│  JAVASCRIPT: onExecuted(message)    │
│  ↓                                  │
│  Read: message.all_media_describe_data[0]
│  ↓                                  │
│  displayBreakdown(jsonData)         │
│  ↓                                  │
│  Parse JSON & format sections       │
│  ↓                                  │
│  Update DOM widget display          │
│  ↓                                  │
│  setDirtyCanvas(true, true)         │
│                                     │
│  RESULT: Formatted paragraphs       │
│  displayed in node                  │
└─────────────────────────────────────┘
```

## Debug Output

After the fix, you should see these debug messages in the browser console:

```
[PromptBreakdown] onExecuted called
[PromptBreakdown] Message: {all_media_describe_data: ["..."]}
[PromptBreakdown] Message keys: ["all_media_describe_data"]
[PromptBreakdown] Found data in message.all_media_describe_data: {"subject":"...","cinematic_aesthetic":"...",...}
```

## Benefits

### ✅ Proper ComfyUI Pattern

- Follows standard ComfyUI display node pattern
- Uses official UI data passing mechanism
- Compatible with ComfyUI's execution system

### ✅ Reliable Data Flow

- Data properly passed from Python to JavaScript
- No dependency on widget creation timing
- Guaranteed to work when node executes

### ✅ Better Debugging

- Enhanced logging shows data flow
- Easy to track where data is/isn't
- Clear error messages

### ✅ Future-Proof

- Uses documented ComfyUI patterns
- Less likely to break with ComfyUI updates
- Easier for other developers to understand

---

**Implementation Date**: October 7, 2025  
**Status**: Production Ready ✅  
**Breaking Changes**: None (internal fix) ✅  
**Pattern**: Standard ComfyUI display node ✅
