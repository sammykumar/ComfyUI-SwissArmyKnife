# Prompt Breakdown DOM Widget Update

**Date**: October 7, 2025  
**Status**: ✅ Completed  
**Type**: UI Enhancement

## Summary

Updated the **Media Describe - Prompt Breakdown** node to display content using a custom DOM widget instead of a text field, matching the Control Panel's display style.

## Changes Made

### Before: Text Field Widget

- Used `addWidget("text", ...)` with multiline text field
- Had read-only text input element
- Required manual styling of `inputEl`
- Had editable appearance (even though read-only)

### After: DOM Widget

- Uses `addDOMWidget(...)` with custom HTML element
- Direct DOM manipulation for display
- Cleaner, more control-panel-like appearance
- No input field - pure display element

## Implementation Details

### DOM Widget Creation

```javascript
const dom = document.createElement('div');
dom.style.fontFamily =
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
dom.style.fontSize = '13px';
dom.style.lineHeight = '1.5';
dom.style.overflow = 'auto';
dom.style.maxHeight = '100%';
dom.style.padding = '12px';
dom.style.borderRadius = '6px';
dom.style.background = 'var(--comfy-menu-bg, #1e1e1e)';
dom.style.border = '1px solid var(--border-color, #333)';
dom.style.color = 'var(--fg-color, #d4d4d4)';
dom.style.whiteSpace = 'pre-wrap';
dom.style.wordBreak = 'break-word';

const widget = this.addDOMWidget(
    'MediaDescribePromptBreakdown',
    'breakdown_display',
    dom,
    {
        serialize: false, // Don't store in workflow JSON
        hideOnZoom: false,
    },
);
```

### Display Update Method

```javascript
this.displayBreakdown = function (jsonData) {
    if (!this._breakdown_dom) return;

    try {
        const data =
            typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

        let displayText = '';
        const sections = [
            { key: 'subject', label: '🎯 SUBJECT', divider: '=' },
            {
                key: 'cinematic_aesthetic',
                label: '🎬 CINEMATIC AESTHETIC',
                divider: '=',
            },
            {
                key: 'stylization_tone',
                label: '🎨 STYLIZATION & TONE',
                divider: '=',
            },
            { key: 'clothing', label: '👔 CLOTHING', divider: '=' },
            { key: 'scene', label: '🏞️ SCENE', divider: '=' },
            { key: 'movement', label: '🎭 MOVEMENT', divider: '=' },
        ];

        for (const section of sections) {
            if (data[section.key] && data[section.key].trim()) {
                const dividerLine = section.divider.repeat(50);
                displayText += `${dividerLine}\n`;
                displayText += `${section.label}\n`;
                displayText += `${dividerLine}\n`;
                displayText += `${data[section.key]}\n\n`;
            }
        }

        this._breakdown_dom.textContent =
            displayText.trim() || 'No paragraph data available';
        this.setDirtyCanvas(true, true);
    } catch (e) {
        debugLog('[PromptBreakdown] Error parsing JSON:', e);
        this._breakdown_dom.textContent = 'Error: Invalid JSON data';
        this.setDirtyCanvas(true, true);
    }
};
```

### Resize Handler

```javascript
const onResize = nodeType.prototype.onResize;
nodeType.prototype.onResize = function (size) {
    const result = onResize?.call(this, size);
    if (this._breakdown_dom) {
        this._breakdown_dom.style.width = this.size[0] - 20 + 'px';
    }
    return result;
};
```

## Files Modified

### JavaScript Changes

**File**: `web/js/swiss-army-knife.js`

**Lines**: ~2028-2112 (MediaDescribePromptBreakdown registration)

**Key Changes**:

1. Removed `addWidget("text", ...)` call
2. Added `addDOMWidget(...)` with custom div element
3. Added resize handler to adjust DOM width
4. Updated `displayBreakdown()` to use `dom.textContent` instead of `widget.value`
5. Added `setDirtyCanvas(true, true)` calls to trigger canvas refresh

## Benefits

### ✅ Consistent UI

- Matches Control Panel display style
- Uses same DOM widget approach
- Consistent theming and styling

### ✅ Better Performance

- No input element overhead
- Direct DOM manipulation
- Cleaner rendering

### ✅ Improved UX

- No confusing text field appearance
- Pure display widget (no false editability)
- Better visual hierarchy

### ✅ Cleaner Code

- No need for `inputEl` checks and setTimeout workarounds
- Simpler styling approach
- More maintainable

## Display Format

The widget displays paragraphs in this format:

```
==================================================
🎯 SUBJECT
==================================================
[Subject paragraph text here]

==================================================
🎬 CINEMATIC AESTHETIC
==================================================
[Cinematic aesthetic paragraph text here]

==================================================
🎨 STYLIZATION & TONE
==================================================
[Stylization & tone paragraph text here]

==================================================
👔 CLOTHING
==================================================
[Clothing paragraph text here]

==================================================
🏞️ SCENE
==================================================
[Scene paragraph text here]

==================================================
🎭 MOVEMENT
==================================================
[Movement paragraph text here]
```

## Node Behavior

### Input

- **all_media_describe_data** (STRING, forceInput)
    - Connects to MediaDescribe's `all_media_describe_data` output
    - Contains JSON with all paragraph data

### Output

- None (display-only node)

### Display

- Shows formatted breakdown of all 6 paragraphs
- Updates when execution completes
- Preserves data across workflow saves (via connection)

## Comparison with Control Panel

| Feature     | Control Panel (Overview)      | Prompt Breakdown              |
| ----------- | ----------------------------- | ----------------------------- |
| Widget Type | DOM Widget (2 columns)        | DOM Widget (single column)    |
| Purpose     | Compact summary               | Detailed formatted display    |
| Data Source | all_media_describe_data input | all_media_describe_data input |
| Layout      | Left/Right panels             | Single scrollable panel       |
| Content     | Brief paragraph previews      | Full paragraph text           |
| Styling     | 11px, compact                 | 13px, spacious                |
| Use Case    | Quick overview                | Detailed review               |

## Testing Checklist

- [x] JavaScript syntax valid (no errors)
- [x] DOM widget created correctly
- [x] Resize handler implemented
- [x] Display formatting correct (6 sections with dividers)
- [x] Error handling for invalid JSON
- [x] Canvas refresh on updates (`setDirtyCanvas`)
- [x] No text field visible
- [x] Consistent with Control Panel style

## Migration Notes

### No Breaking Changes

- Existing workflows continue to work
- Same input/output structure
- Only UI display method changed

### Visual Changes

- Users will see a display panel instead of a text field
- No functional differences
- Better visual consistency with Control Panel

---

**Implementation Date**: October 7, 2025  
**Status**: Production Ready ✅  
**Breaking Changes**: None (UI only) ✅  
**Consistency**: Matches Control Panel approach ✅
