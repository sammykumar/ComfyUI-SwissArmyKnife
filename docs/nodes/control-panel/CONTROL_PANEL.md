# Control Panel Data Population Debugging Enhancement

## Issue

The Control Panel node was not displaying data from `all_media_describe_data` input, even though the data was confirmed to exist in the workflow.

## Solution Implemented

### 1. Backend (Python) Enhancements

**File**: `nodes/utils/control_panel.py`

#### Changes:

1. **Doubled output data** - Return both `all_media_describe_data` and `all_media_describe_data_copy` in the UI dict for redundancy
2. **Added comprehensive logging** - Print all kwargs received to debug what data is coming in
3. **Added output logging** - Print the full result structure being returned to the UI

```python
# DOUBLE the output - return BOTH in ui dict
result = {
    "ui": {
        "all_media_describe_data": [all_media_data],
        "all_media_describe_data_copy": [all_media_data]  # Duplicate for redundancy
    }
}
```

#### Debug Output:

```
🔍 DEBUG - All kwargs received:
  - all_media_describe_data: str = {"final_prompt": "...", ...}

🔍 DEBUG - Returning to UI:
{
  "ui": {
    "all_media_describe_data": [...],
    "all_media_describe_data_copy": [...]
  }
}
```

### 2. Frontend (JavaScript) Enhancements

**File**: `web/js/swiss-army-knife.js`

#### Changes in `updateControlPanelData`:

1. **Console logging always enabled** - Using `console.log` instead of `debugLog` for critical debugging
2. **Try multiple data sources** - Check both `data.all_media_describe_data` and `data.all_media_describe_data_copy`
3. **Comprehensive logging** - Log every step of data extraction and parsing
4. **Log all object keys** - Show what keys are available at each level

```javascript
// Try all possible locations for the data
if (data.all_media_describe_data) {
    console.log('🔍 [ControlPanel DEBUG] Found data.all_media_describe_data');
    rawData = Array.isArray(data.all_media_describe_data)
        ? data.all_media_describe_data[0]
        : data.all_media_describe_data;
} else if (data.all_media_describe_data_copy) {
    console.log(
        '🔍 [ControlPanel DEBUG] Found data.all_media_describe_data_copy',
    );
    rawData = Array.isArray(data.all_media_describe_data_copy)
        ? data.all_media_describe_data_copy[0]
        : data.all_media_describe_data_copy;
}
```

#### Changes in `onExecuted`:

1. **Full message structure logging** - Log the complete message object received
2. **Log all keys at each level** - Show what properties are available
3. **Trace execution path** - Show which code paths are being taken

```javascript
console.log('🔍 [ControlPanel DEBUG] onExecuted called');
console.log('🔍 [ControlPanel DEBUG] Full message object:', message);
console.log(
    '🔍 [ControlPanel DEBUG] message keys:',
    Object.keys(message || {}),
);
```

## Debugging Workflow

### Step 1: Check Python Console Output

Look for the Control Panel debug output in the ComfyUI server logs:

```
============================================================
CONTROL PANEL - Workflow Information
============================================================

🔍 DEBUG - All kwargs received:
  - all_media_describe_data: str = {...}

📊 All Media Describe Data:
{
  "final_prompt": "...",
  "gemini_status": "...",
  "media_info": "..."
}

🔍 DEBUG - Returning to UI:
{...}
```

### Step 2: Check Browser Console Output

Open browser DevTools and look for the Control Panel debug messages:

```
🔍 [ControlPanel DEBUG] onExecuted called
🔍 [ControlPanel DEBUG] Full message object: {...}
🔍 [ControlPanel DEBUG] message keys: ["output"]
🔍 [ControlPanel DEBUG] message.output: {...}
🔍 [ControlPanel DEBUG] message.output keys: ["all_media_describe_data", "all_media_describe_data_copy"]
🔍 [ControlPanel DEBUG] updateControlPanelData called
🔍 [ControlPanel DEBUG] data received: {...}
🔍 [ControlPanel DEBUG] Found data.all_media_describe_data
🔍 [ControlPanel DEBUG] rawData: "{...}"
🔍 [ControlPanel DEBUG] Parsed mediaData: {...}
🔍 [ControlPanel DEBUG] mediaData keys: ["final_prompt", "gemini_status", ...]
```

### Step 3: Identify the Issue

Based on the debug output, you can identify:

- ✅ Is data being sent from Python? (Check Python console)
- ✅ Is data arriving in JavaScript? (Check `onExecuted` logs)
- ✅ Which data structure is being used? (Check `message.output` keys)
- ✅ Is JSON parsing successful? (Check parsed mediaData)
- ✅ Which fields are available? (Check mediaData keys)

## Common Issues and Solutions

### Issue 1: Data not arriving in JavaScript

**Symptom**: Python shows data being returned, but JavaScript shows empty message.output

**Solution**: Check that the node is properly registered as an OUTPUT_NODE in Python

### Issue 2: Data structure mismatch

**Symptom**: JavaScript can't find `all_media_describe_data` in the message

**Solution**: The double-output approach now checks both `all_media_describe_data` and `all_media_describe_data_copy`

### Issue 3: JSON parsing fails

**Symptom**: Error in browser console about JSON parsing

**Solution**: Check that the data is properly JSON serialized in Python before sending

## Testing

### Manual Test Steps:

1. Start ComfyUI server with the custom node installed
2. Create a workflow with:
    - A media source node (e.g., Load Video)
    - Gemini Media Describe node
    - Control Panel node connected to `all_media_describe_data` output
3. Execute the workflow
4. Check both Python console and browser console for debug output
5. Verify Control Panel displays the data in three columns

### Expected Output:

- **Left Column**: Final prompt text
- **Middle Column**: Gemini status information
- **Right Column**: Media info (height, width, description, etc.)

## Performance Considerations

The debug logging uses `console.log` instead of `debugLog`, which means it will always appear in the console even when DEBUG mode is disabled. This is intentional for critical debugging but should be considered for production.

**Future Enhancement**: Consider adding a separate `CONTROL_PANEL_DEBUG` flag that can be toggled independently.

## Related Files

- `nodes/utils/control_panel.py` - Backend node implementation
- `web/js/swiss-army-knife.js` - Frontend widget implementation (lines 380-520)
- `docs/nodes/control-panel/CONTROL_PANEL_DATA_POPULATION_DEBUG.md` - This document

## Implementation Date

October 11, 2025

## Status

✅ Implemented - Comprehensive debugging in place for both backend and frontend

---

# Control Panel Data Population Fix

## Issue Summary

The Control Panel node was displaying "(No final_prompt in data)" even though the `all_media_describe_data` was successfully being passed to the node.

## Root Cause Analysis

After adding comprehensive debugging, the issues were identified:

### 1. Field Name Mismatch ✅ FIXED

**Problem**: Code was checking for `mediaData.final_prompt` but the actual field name in the data is `final_string`.

**Evidence from debug logs**:

```javascript
// mediaData keys showed:
['description', 'media_info', 'gemini_status', 'final_string', 'height', 'width',
 'subject', 'cinematic_aesthetic', 'stylization_tone', 'clothing', 'scene', 'movement']

// But code was checking:
if (mediaData.final_prompt) { ... }  // ❌ This field doesn't exist!
```

**Fix**: Updated to check multiple possible field names in priority order:

```javascript
const finalText =
    mediaData.final_string || mediaData.final_prompt || mediaData.description;
```

### 2. Message Structure Handling ✅ FIXED

**Problem**: Code assumed data would be in `message.output`, but ComfyUI was sending it at the root level of the message.

**Evidence from debug logs**:

```javascript
// What we received:
message = {
    all_media_describe_data: [...],
    all_media_describe_data_copy: [...]
}

// What the code was looking for:
message.output.all_media_describe_data  // ❌ message.output was undefined
```

**Fix**: Updated `onExecuted` handler to check both locations:

```javascript
if (message && message.output) {
    this.updateControlPanelData(message.output);
} else if (
    message &&
    (message.all_media_describe_data || message.all_media_describe_data_copy)
) {
    this.updateControlPanelData(message); // Handle root-level data
}
```

## Changes Made

### File: `web/js/swiss-army-knife.js`

#### Change 1: Flexible Field Name Checking

**Location**: Lines ~462-471 (updateControlPanelData function)

**Before**:

```javascript
// Left column: Final Prompt
if (mediaData.final_prompt) {
    this._cp_leftColumn.textContent = formatValue(mediaData.final_prompt, 2000);
} else {
    this._cp_leftColumn.textContent = '(No final_prompt in data)';
}
```

**After**:

```javascript
// Left column: Final String/Prompt (check both field names)
const finalText =
    mediaData.final_string || mediaData.final_prompt || mediaData.description;
if (finalText) {
    console.log(
        '🔍 [ControlPanel DEBUG] Setting final text:',
        finalText.substring(0, 50),
    );
    this._cp_leftColumn.textContent = formatValue(finalText, 2000);
} else {
    console.log(
        '🔍 [ControlPanel DEBUG] No final_string/final_prompt/description in mediaData',
    );
    this._cp_leftColumn.textContent = '(No final text in data)';
}
```

#### Change 2: Handle Multiple Message Structures

**Location**: Lines ~554-567 (onExecuted handler)

**Before**:

```javascript
if (message && message.output) {
    this.updateControlPanelData(message.output);
} else {
    console.log('🔍 [ControlPanel DEBUG] No message.output available');
}
```

**After**:

```javascript
// Try multiple data sources - data might be at root or in output
if (message && message.output) {
    console.log(
        '🔍 [ControlPanel DEBUG] Calling updateControlPanelData with message.output:',
        message.output,
    );
    this.updateControlPanelData(message.output);
} else if (
    message &&
    (message.all_media_describe_data || message.all_media_describe_data_copy)
) {
    console.log(
        '🔍 [ControlPanel DEBUG] Calling updateControlPanelData with message (root level):',
        message,
    );
    this.updateControlPanelData(message);
} else {
    console.log(
        '🔍 [ControlPanel DEBUG] No data found in message.output or message root',
    );
}
```

#### Change 3: Updated Displayed Keys List

**Location**: Lines ~505-513

**Before**:

```javascript
const displayedKeys = [
    'final_prompt',
    'gemini_status',
    'media_info',
    'height',
    'width',
];
```

**After**:

```javascript
const displayedKeys = [
    'final_prompt',
    'final_string',
    'description',
    'gemini_status',
    'media_info',
    'height',
    'width',
];
```

## Testing Results

### Before Fix

```
Left Column: "(No final_prompt in data)"
Middle Column: "🤖 Gemini Analysis Status: ✅ Complete..."
Right Column: [All other fields listed including subject, cinematic_aesthetic, etc.]
```

### After Initial Fix

```
Left Column: "A woman with straight, flowing blonde hair stands upright..."
Middle Column: "🤖 Gemini Analysis Status: ✅ Complete..."
Right Column: [Media info, height, width, subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement]
```

### After Cleanup (October 11, 2025 - Second Update)

Removed verbose fields from right column to show only essential metadata:

```
Left Column: "A woman with straight, flowing blonde hair stands upright..."
Middle Column: "🤖 Gemini Analysis Status: ✅ Complete..."
Right Column: [Media info, height, width ONLY]
```

**Hidden fields**: subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement
**Rationale**: These verbose description fields are already shown in the left column (final_string). Displaying them again in the right column created unnecessary clutter.

## Debug Logs Analysis

The comprehensive debug logging revealed:

1. ✅ Data **IS** being sent from Python backend
2. ✅ Data **IS** arriving in JavaScript
3. ✅ JSON parsing **IS** successful
4. ❌ Field name mismatch prevented display (NOW FIXED)
5. ❌ Message structure assumption was incorrect (NOW FIXED)

### Key Debug Output

```
🔍 [ControlPanel DEBUG] onExecuted called
🔍 [ControlPanel DEBUG] message keys: ['all_media_describe_data', 'all_media_describe_data_copy']
🔍 [ControlPanel DEBUG] message.output: undefined  ← This showed the structure issue
🔍 [ControlPanel DEBUG] Found data.all_media_describe_data
🔍 [ControlPanel DEBUG] Parsed mediaData: {...}
🔍 [ControlPanel DEBUG] mediaData keys: ['description', 'media_info', 'gemini_status', 'final_string', ...]
🔍 [ControlPanel DEBUG] No final_prompt in mediaData  ← This showed the field name issue
```

## Lessons Learned

### 1. Field Naming Consistency

Different parts of the workflow use different field names:

- `final_string` - Gemini Media Describe output
- `final_prompt` - Expected by Control Panel (legacy name?)
- `description` - Fallback field

**Solution**: Use flexible fallback checking for multiple field names.

### 2. ComfyUI Message Structure Variability

ComfyUI can send node execution results in different structures:

- `message.output.field_name` - Standard OUTPUT_NODE pattern
- `message.field_name` - Direct root-level data

**Solution**: Check both locations when handling `onExecuted` messages.

### 3. Importance of Comprehensive Debugging

The initial approach of doubling the output (both `all_media_describe_data` and `all_media_describe_data_copy`) helped confirm data was arriving, but the extensive console logging was crucial to identifying the actual issues.

### 4. Display Clutter Reduction (October 11, 2025)

After fixing the initial issues, the right column was displaying many verbose fields (subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement) that duplicated content already shown in the left column's final_string field.

**Solution**: Removed the loop that added "all other fields" to only display essential metadata (media_info, height, width).

## Next Steps

### Short Term

- [x] Fix field name mismatch
- [x] Handle both message structures
- [x] Test with real workflow
- [x] Remove verbose duplicate fields from right column
- [ ] Monitor for any edge cases

### Long Term

- [ ] Standardize field naming across all nodes
- [ ] Document ComfyUI message structure patterns
- [ ] Consider adding field name mapping configuration
- [ ] Add visual indicator when using fallback field names
- [ ] Make displayed fields configurable via node settings

## Related Files

- `web/js/swiss-army-knife.js` - Frontend implementation (Control Panel widget)
- `nodes/utils/control_panel.py` - Backend implementation
- `docs/nodes/control-panel/CONTROL_PANEL_DATA_POPULATION_DEBUG.md` - Original debug documentation
- `docs/nodes/control-panel/README.md` - Control Panel overview

## Implementation Date

October 11, 2025

## Status

✅ FIXED - Both field name mismatch and message structure issues resolved

---

# Control Panel Prompt Breakdown Implementation

## Overview

The Control Panel system consists of two nodes that display workflow information in different formats:

1. **ControlPanelOverview** - Displays full workflow data in 3 columns
2. **ControlPanelPromptBreakdown** - Displays parsed prompt data in 6 columns

## ControlPanelPromptBreakdown Node

### Purpose

Breaks down a long-form description (from Gemini AI video analysis) into structured categories for easier reading and prompt engineering.

### Input

- `all_media_describe_data` (STRING) - JSON data containing the full media analysis, including a `description` field

### Output

Displays parsed description text across 6 columns:

1. **Subject** - First paragraph (character/subject description)
2. **Cinematic/Aesthetic** - Second paragraph (camera work, lighting, framing)
3. **Stylization/Tone** - Third paragraph (overall mood, style, aesthetic)
4. **Clothing** - Fourth paragraph (wardrobe, attire details)
5. **Scene** - Fifth paragraph (environment, setting, location)
6. **Movement** - Sixth paragraph (actions, gestures, motion)

### Implementation Details

#### Backend (Python)

**File:** `/nodes/utils/control_panel.py`

```python
def display_info(self, **kwargs):
    # Extract description from all_media_describe_data
    description_text = data.get("description", "")

    # Split by double newline to get paragraphs
    paragraphs = [p.strip() for p in description_text.split("\n\n") if p.strip()]

    # Map paragraphs to categories (1st = subject, 2nd = cinematic, etc.)
    prompt_breakdown = {
        "subject": paragraphs[0] if len(paragraphs) > 0 else "",
        "cinematic_aesthetic": paragraphs[1] if len(paragraphs) > 1 else "",
        "stylization_tone": paragraphs[2] if len(paragraphs) > 2 else "",
        "clothing": paragraphs[3] if len(paragraphs) > 3 else "",
        "scene": paragraphs[4] if len(paragraphs) > 4 else "",
        "movement": paragraphs[5] if len(paragraphs) > 5 else ""
    }

    # Return JSON structure
    return {
        "ui": {
            "prompt_breakdown": [json.dumps(prompt_breakdown)],
            "raw_data": [all_media_data]
        }
    }
```

**Key Points:**

- Splits description by `\n\n` (double newline) to identify paragraphs
- Maps paragraphs sequentially to the 6 categories
- Returns `prompt_breakdown` as JSON string in the UI output
- Includes `raw_data` for debugging purposes

#### Frontend (JavaScript)

**File:** `/web/js/swiss-army-knife.js`

```javascript
// Create 6 columns with headings
const subjectCol = createColumn('Subject');
const cinematicCol = createColumn('Cinematic/Aesthetic');
const stylizationCol = createColumn('Stylization/Tone');
const clothingCol = createColumn('Clothing');
const sceneCol = createColumn('Scene');
const movementCol = createColumn('Movement');

// Parse and display data
this.updatePromptBreakdownData = function (data) {
    // Extract prompt_breakdown from data
    let rawData = data.prompt_breakdown;

    // Parse JSON if string
    let promptBreakdown =
        typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

    // Update each column
    this._cpb_subject.textContent = promptBreakdown.subject || '(empty)';
    this._cpb_cinematic.textContent =
        promptBreakdown.cinematic_aesthetic || '(empty)';
    // ... etc for all 6 columns
};
```

**Key Points:**

- Creates 6-column flex layout with fixed headers
- Parses `prompt_breakdown` JSON from backend
- Displays each category in its dedicated column
- Shows "(empty)" for missing data
- Includes debug logging for troubleshooting

### Data Flow

```
1. GeminiUtilMediaDescribe Node
   ↓ (generates description with 6 paragraphs)

2. all_media_describe_data (JSON string)
   ↓ (contains "description" field)

3. ControlPanelPromptBreakdown.display_info()
   ↓ (splits by \n\n, maps to categories)

4. UI output: { "prompt_breakdown": [...], "raw_data": [...] }
   ↓

5. JavaScript widget.onExecuted(message)
   ↓ (receives message.prompt_breakdown)

6. updatePromptBreakdownData(data)
   ↓ (parses JSON, updates DOM)

7. 6-column display in ComfyUI
```

### Debugging

Both backend and frontend include extensive debug logging:

**Python Backend:**

```python
print(f"\n📊 Prompt Breakdown ({len(paragraphs)} paragraphs found):")
print(f"  Subject: {prompt_breakdown['subject'][:100]}...")
# ... logs first 100 chars of each category
```

**JavaScript Frontend:**

```javascript
console.log('🔍 [ControlPanelPromptBreakdown DEBUG] data received:', data);
console.log(
    '🔍 [ControlPanelPromptBreakdown DEBUG] Parsed breakdown:',
    promptBreakdown,
);
```

### Testing

1. Connect `GeminiUtilMediaDescribe` output to `ControlPanelPromptBreakdown` input
2. Execute the workflow
3. Check console logs to verify:
    - Description is being split correctly into 6 paragraphs
    - JSON structure is valid
    - Data reaches the JavaScript widget
4. Verify 6 columns display in the node UI

### Known Issues

- If description has fewer than 6 paragraphs, remaining columns show "(empty)"
- No line wrapping controls - long paragraphs may require scrolling
- Column widths are equal (flex: 1) - may need adjustment for different content lengths

### Future Enhancements

1. **Smart Paragraph Detection**
    - Use AI/heuristics to detect category boundaries if paragraphs don't follow expected order
2. **Column Width Adjustment**
    - Allow user to resize columns
    - Auto-adjust based on content length
3. **Export Functionality**
    - Copy individual categories to clipboard
    - Export as structured JSON for prompt engineering tools
4. **Syntax Highlighting**
    - Different colors for different categories
    - Highlight key terms (e.g., subject names, camera angles, clothing items)

## Files Modified

- `/nodes/utils/control_panel.py` - Backend node implementation
- `/web/js/swiss-army-knife.js` - Frontend widget implementation

## Related Documentation

- [Video Preview Implementation](../video-preview/)
- [Gemini Media Describe](../media-describe/)
- [Control Panel Overview](./CONTROL_PANEL_OVERVIEW.md)

## Version History

- **2025-10-13**: Initial implementation with 6-column paragraph breakdown