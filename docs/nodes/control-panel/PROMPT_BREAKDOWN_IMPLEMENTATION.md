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
