# MediaDescribe Control Panel Migration

**Date**: October 7, 2025  
**Status**: ✅ Completed  
**Breaking Changes**: Yes - Output sockets changed from 14 to 8

## Summary

Migrated individual paragraph outputs (subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement) from separate output sockets to a unified control panel widget. This provides a cleaner UI while maintaining full access to all paragraph data.

## What Changed

### Before (14 outputs)

```
MediaDescribe Outputs:
1. description
2. media_info
3. gemini_status
4. processed_media_path
5. final_string
6. height
7. width
8. all_media_describe_data
9. subject ❌ REMOVED
10. cinematic_aesthetic ❌ REMOVED
11. stylization_tone ❌ REMOVED
12. clothing ❌ REMOVED
13. scene ❌ REMOVED
14. movement ❌ REMOVED
```

### After (8 outputs + Control Panel)

```
MediaDescribe Outputs:
1. description
2. media_info
3. gemini_status
4. processed_media_path
5. final_string
6. height
7. width
8. all_media_describe_data

MediaDescribe Control Panel Widget:
📋 Paragraph Outputs (Read-only multiline text widget)
- 🎯 Subject
- 🎬 Cinematic Aesthetic
- 🎨 Style/Tone
- 👔 Clothing
- 🏞️ Scene (video only)
- 🎭 Movement (video only)
```

## Benefits

### ✅ Cleaner UI

- 6 fewer output sockets on MediaDescribe node
- Less visual clutter in workflow canvas
- Easier to identify core outputs

### ✅ Better Organization

- All paragraph outputs grouped in one place
- Clear visual hierarchy with emoji labels
- Easier to read and understand

### ✅ Full Data Access

- All paragraph data still available in `all_media_describe_data` JSON output
- Can be parsed programmatically if needed
- No functionality lost

### ✅ Improved UX

- Read-only text panel prevents accidental edits
- Monospace font for better readability
- Automatic updates after each execution

## Migration Guide

### If You Were Using Individual Paragraph Outputs

**Old Workflow** (connecting to individual outputs):

```
[MediaDescribe]
  → subject (output 9) → [Text Node]
  → cinematic_aesthetic (output 10) → [Another Node]
```

**New Workflow** (parse from JSON):

```
[MediaDescribe]
  → all_media_describe_data (output 8) → [JSON Parser]
     → Extract "subject"
     → Extract "cinematic_aesthetic"
     → etc.
```

**Alternative** (use control panel for viewing):

```
[MediaDescribe]
  - View paragraphs in 📋 Paragraph Outputs control panel widget
  - No need to connect outputs for simple viewing
```

### If You Only Used Combined Description

**No changes needed!** The main `description` output still works exactly the same way:

```
[MediaDescribe] → description → [Your Nodes]
```

## Implementation Details

### Python Changes

**File**: `nodes/media_describe/mediia_describe.py`

1. **RETURN_TYPES** reduced from 14 to 8 outputs:

```python
# Before
RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "INT", "INT", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING")

# After
RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "INT", "INT", "STRING")
```

2. **RETURN_NAMES** updated:

```python
# Before
RETURN_NAMES = ("description", "media_info", "gemini_status", "processed_media_path", "final_string", "height", "width", "all_media_describe_data", "subject", "cinematic_aesthetic", "stylization_tone", "clothing", "scene", "movement")

# After
RETURN_NAMES = ("description", "media_info", "gemini_status", "processed_media_path", "final_string", "height", "width", "all_media_describe_data")
```

3. **Return statements** updated (4 locations):

```python
# Before
return (final_description, media_info_text, gemini_status, processed_media_path, final_string, output_height, output_width, all_data, subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement)

# After
return (final_description, media_info_text, gemini_status, processed_media_path, final_string, output_height, output_width, all_data)
```

### JavaScript Changes

**File**: `web/js/swiss-army-knife.js`

1. **Added Control Panel Widget** in `onNodeCreated`:

```javascript
// Add control panel widget for displaying paragraph outputs
this.paragraphControlPanel = this.addWidget(
    'text',
    '📋 Paragraph Outputs',
    '',
    () => {},
    { multiline: true },
);
this.paragraphControlPanel.serialize = false;
this.paragraphControlPanel.inputEl.readOnly = true;
this.paragraphControlPanel.inputEl.style.fontFamily = 'monospace';
this.paragraphControlPanel.inputEl.style.fontSize = '12px';
this.paragraphControlPanel.inputEl.style.backgroundColor = '#1e1e1e';
this.paragraphControlPanel.inputEl.style.color = '#d4d4d4';
```

2. **Added Update Method**:

```javascript
// Method to update paragraph display in control panel
this.updateParagraphsDisplay = function (paragraphs) {
    if (!this.paragraphControlPanel) return;

    let displayText = '';
    const labels = {
        subject: '🎯 Subject',
        cinematic_aesthetic: '🎬 Cinematic',
        stylization_tone: '🎨 Style/Tone',
        clothing: '👔 Clothing',
        scene: '🏞️ Scene',
        movement: '🎭 Movement',
    };

    for (const [key, label] of Object.entries(labels)) {
        if (paragraphs[key]) {
            displayText += `${label}:\n${paragraphs[key]}\n\n`;
        }
    }

    this.paragraphControlPanel.value =
        displayText.trim() || 'No paragraph outputs yet';
};
```

3. **Updated onExecuted** to populate control panel:

```javascript
// Extract and display paragraph outputs from all_media_describe_data
let allDataJson = null;

// all_media_describe_data is at index 7
if (Array.isArray(message) && message.length >= 8) {
    allDataJson = message[7];
} else if (message.all_media_describe_data) {
    allDataJson = Array.isArray(message.all_media_describe_data)
        ? message.all_media_describe_data[0]
        : message.all_media_describe_data;
}

// Parse and display paragraphs
if (allDataJson) {
    try {
        const data =
            typeof allDataJson === 'string'
                ? JSON.parse(allDataJson)
                : allDataJson;
        if (data && typeof data === 'object') {
            this.updateParagraphsDisplay({
                subject: data.subject || '',
                cinematic_aesthetic: data.cinematic_aesthetic || '',
                stylization_tone: data.stylization_tone || '',
                clothing: data.clothing || '',
                scene: data.scene || '',
                movement: data.movement || '',
            });
        }
    } catch (e) {
        debugLog('[MediaDescribe] Error parsing all_media_describe_data:', e);
    }
}
```

## Testing Checklist

- [x] Python code updated (RETURN_TYPES, RETURN_NAMES, return statements)
- [x] JavaScript widget added to MediaDescribe node
- [x] Control panel displays after execution
- [x] Paragraph data extracted from `all_media_describe_data`
- [x] Override functionality still works (via Media Describe - Overrides node)
- [x] All 6 paragraphs display correctly
- [x] Styling (monospace, dark theme) applied
- [x] No errors in Python code
- [x] No errors in JavaScript code
- [x] Documentation updated

## Files Modified

### Code Files

1. `nodes/media_describe/mediia_describe.py` - Updated return types and statements
2. `web/js/swiss-army-knife.js` - Added control panel widget and update logic

### Documentation Files

1. `docs/nodes/media-describe/README.md` - Updated output count and added control panel section
2. `docs/nodes/media-describe/PARAGRAPH_OVERRIDE_FEATURE.md` - Updated to reflect control panel
3. `docs/nodes/media-describe/CONTROL_PANEL_MIGRATION.md` - This file

## Backward Compatibility

**⚠️ BREAKING CHANGE**: Workflows that connect to individual paragraph outputs (outputs 9-14) will need to be updated.

**Solutions**:

1. Parse `all_media_describe_data` JSON output to extract paragraph data
2. Use the control panel widget for visual viewing
3. Update workflows to use the combined `description` output

**Non-Breaking**: Workflows using only the main `description` output continue to work without changes.

---

**Implementation Date**: October 7, 2025  
**Implemented By**: GitHub Copilot  
**Status**: Production Ready ✅  
**Breaking Changes**: Yes (output sockets reduced) ⚠️
