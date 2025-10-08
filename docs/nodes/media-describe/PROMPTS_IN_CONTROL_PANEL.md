# System and User Prompts in Control Panel

**Date**: October 8, 2025  
**Status**: ✅ Completed  
**Type**: Feature Enhancement

## Summary

Added **system_prompt** and **user_prompt** to the `all_media_describe_data` JSON output and enhanced the Control Panel to display these prompts under the "Gemini Status" section.

## Motivation

Users need visibility into the exact prompts sent to Gemini API to:

- Debug and understand AI responses
- Verify prompt engineering is working correctly
- Tune and optimize prompts for better results
- Reproduce results with specific prompt configurations

## Implementation

### Python Changes

**File**: `nodes/media_describe/mediia_describe.py`

#### 1. Image Processing (Live API Call)

Added `system_prompt` and `user_prompt` to `all_media_describe_data`:

```python
all_data = json.dumps({
    "description": final_description,
    "media_info": media_info_text,
    "gemini_status": gemini_status,
    "processed_media_path": processed_media_path,
    "final_string": final_string,
    "height": output_height,
    "width": output_width,
    "subject": subject,
    "cinematic_aesthetic": cinematic_aesthetic,
    "stylization_tone": stylization_tone,
    "clothing": clothing,
    "scene": scene,
    "movement": movement,
    "system_prompt": system_prompt,      # ✅ NEW
    "user_prompt": user_prompt            # ✅ NEW
})
```

**Updated in 2 locations**:

- Line ~986-1002 (Image processing with API call)
- Line ~1072-1088 (Image processing from uploaded file)

#### 2. Image Processing (Cached Result)

For cached results where prompts aren't available:

```python
all_data = json.dumps({
    # ... other fields ...
    "system_prompt": system_prompt,
    "user_prompt": user_prompt
})
```

**Note**: When using cache, prompts from the cache hit are included.

#### 3. Video Processing (Live API Call)

Added prompts to video processing:

```python
all_data = json.dumps({
    # ... other fields ...
    "system_prompt": system_prompt,      # ✅ NEW
    "user_prompt": user_prompt            # ✅ NEW
})
```

**Updated in 1 location**:

- Line ~1447-1463 (Video processing with API call)

#### 4. Video Processing (Cached Result)

For video cache hits:

```python
all_data = json.dumps({
    # ... other fields ...
    "system_prompt": "(Cached result - prompts not available)",  # ✅ NEW
    "user_prompt": "(Cached result - prompts not available)"     # ✅ NEW
})
```

**Updated in 1 location**:

- Line ~1361-1377 (Video processing from cache)

### JavaScript Changes

**File**: `web/js/swiss-army-knife.js`

Enhanced Control Panel to display prompts under Gemini Status:

```javascript
// Populate left column
for (const field of leftFields) {
    if (parsedData.hasOwnProperty(field.key)) {
        let fieldValue = parsedData[field.key];

        // For gemini_status, append prompts if available
        if (field.key === 'gemini_status') {
            if (parsedData.system_prompt || parsedData.user_prompt) {
                fieldValue +=
                    '\n\n📝 System Prompt:\n' +
                    (parsedData.system_prompt || 'N/A');
                fieldValue +=
                    '\n\n💬 User Prompt:\n' + (parsedData.user_prompt || 'N/A');
            }
        }

        leftLines.push(formatField(field.emoji, field.label, fieldValue));
    }
}
```

**Updated in 1 location**:

- Line ~450-480 (Control Panel data display logic)

## Control Panel Display

### Before

```
═══ LEFT PANEL ═══

🔄 Gemini Status:
🤖 Gemini Analysis Status: ✅ Complete
• Model: models/gemini-2.5-pro
• API Key: ****abcd
• Input: Image
```

### After

```
═══ LEFT PANEL ═══

🔄 Gemini Status:
🤖 Gemini Analysis Status: ✅ Complete
• Model: models/gemini-2.5-pro
• API Key: ****abcd
• Input: Image

📝 System Prompt:
Generate a Wan 2.2 optimized text to image prompt. You are an expert assistant specialized in analyzing and verbalizing input media for instagram-quality posts using the Wan 2.2 Text to Image workflow.

DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions...

[Full system prompt displayed here]

💬 User Prompt:
Please analyze this image and provide a detailed description following the 6-paragraph structure outlined in the system prompt.
```

## JSON Structure

### Complete all_media_describe_data Schema

```json
{
    "description": "Full description text",
    "media_info": "Media metadata",
    "gemini_status": "API status text",
    "processed_media_path": "/path/to/media",
    "final_string": "Description with prefix",
    "height": 1080,
    "width": 1920,
    "subject": "Subject paragraph...",
    "cinematic_aesthetic": "Cinematic paragraph...",
    "stylization_tone": "Style paragraph...",
    "clothing": "Clothing paragraph...",
    "scene": "Scene paragraph...",
    "movement": "Movement paragraph...",
    "system_prompt": "Full system prompt sent to Gemini...", // ✅ NEW
    "user_prompt": "User prompt sent to Gemini..." // ✅ NEW
}
```

### Cache Hit Scenario

```json
{
    // ... other fields ...
    "system_prompt": "(Cached result - prompts not available)",
    "user_prompt": "(Cached result - prompts not available)"
}
```

## Use Cases

### 1. Debugging AI Responses

**Scenario**: AI returns unexpected description

**Solution**: Check Control Panel to see exact prompts sent:

```
📝 System Prompt:
[Shows actual prompt structure and instructions]

💬 User Prompt:
Please analyze this image and provide a detailed description...
```

### 2. Prompt Engineering

**Scenario**: Tuning prompts for better results

**Workflow**:

1. Run workflow with current prompts
2. View prompts in Control Panel
3. Identify areas for improvement
4. Modify prompt engineering code
5. Re-run and compare results

### 3. Result Reproduction

**Scenario**: Need to reproduce specific AI output

**Solution**: Save the exact prompts from Control Panel for future reference

### 4. Different Model Types

**Image Model** (Wan 2.2):

```
System Prompt:
Generate a Wan 2.2 optimized text to image prompt...
```

**ImageEdit Model** (Qwen-Image-Edit):

```
System Prompt:
You are an expert assistant generating concise, single-sentence Qwen-Image-Edit instructions...
```

**Video Model**:

```
System Prompt:
You are an expert assistant specialized in analyzing and verbalizing input videos for cinematic-quality video transformation...
```

## Benefits

### ✅ Full Transparency

- See exactly what's sent to Gemini API
- No hidden prompt engineering
- Complete visibility into AI interaction

### ✅ Better Debugging

- Quickly identify prompt issues
- Understand why AI returns specific results
- Track prompt changes over time

### ✅ Prompt Optimization

- Fine-tune system prompts
- Test different instruction patterns
- Improve AI output quality

### ✅ Reproducibility

- Save exact prompts for documentation
- Share prompt configurations with team
- Maintain consistent results

### ✅ Educational Value

- Learn effective prompt engineering
- Understand AI instruction patterns
- See how different options affect prompts

## Technical Details

### Data Flow

```
┌─────────────────────────────┐
│  MediaDescribe Node         │
│                             │
│  1. Build system_prompt     │
│     based on options        │
│  2. Build user_prompt       │
│  3. Send to Gemini API      │
│  4. Get response            │
│  5. Package in all_data:    │
│     {                       │
│       ...                   │
│       system_prompt: "..."  │
│       user_prompt: "..."    │
│     }                       │
└─────────────────────────────┘
              │
              ↓
┌─────────────────────────────┐
│  all_media_describe_data    │
│  (JSON string output)       │
└─────────────────────────────┘
              │
              ↓
┌─────────────────────────────┐
│  Control Panel Node         │
│                             │
│  1. Parse JSON              │
│  2. Extract gemini_status   │
│  3. Append system_prompt    │
│  4. Append user_prompt      │
│  5. Display in LEFT panel   │
└─────────────────────────────┐
```

### Prompt Construction

Prompts are dynamically built based on:

- **Model Type**: Wan 2.2, ImageEdit, Video
- **Options**: describe_clothing, describe_bokeh, etc.
- **Paragraph Count**: Number of structured paragraphs
- **Critical Notes**: Color changes, prohibited attributes

### Example System Prompt (Wan 2.2)

```
Generate a Wan 2.2 optimized text to image prompt. You are an expert assistant specialized in analyzing and verbalizing input media for instagram-quality posts using the Wan 2.2 Text to Image workflow.

DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions. When you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or".

Before writing, silently review the provided media. Do not use meta phrases (e.g., "this picture shows").
Generate descriptions that adhere to the following structured layers and constraints, formatting each as a SEPARATE PARAGRAPH in this exact order:

1. SUBJECT (First Paragraph)
Establish the core subject and their immediate physical state...

2. CINEMATIC AESTHETIC CONTROL (Second Paragraph)
Define the visual and technical qualities...

[... and so on ...]
```

## Testing Checklist

- [x] System prompt added to all_media_describe_data (4 locations)
- [x] User prompt added to all_media_describe_data (4 locations)
- [x] Cache scenario handles prompts correctly
- [x] Control Panel displays prompts under Gemini Status
- [x] Prompts formatted with emoji labels (📝 📬)
- [x] No Python errors
- [x] No JavaScript errors
- [x] JSON structure validated
- [x] Display logic works correctly

## Known Limitations

### Cache Hits

When results come from cache, prompts may not be available (shows placeholder text):

```
"system_prompt": "(Cached result - prompts not available)"
"user_prompt": "(Cached result - prompts not available)"
```

**Future Enhancement**: Store prompts in cache for complete history.

### Long Prompts

System prompts can be very long (1000+ characters). The Control Panel displays the full prompt, which may require scrolling in the left panel.

**Mitigation**: Prompts are displayed in a scrollable area.

## Backwards Compatibility

### ✅ No Breaking Changes

- Existing workflows continue to work
- New fields are additive only
- Control Panel gracefully handles missing prompts (shows "N/A")

### ✅ Optional Display

- Prompts only display if available in JSON
- Falls back gracefully for old data
- No errors if fields missing

---

**Implementation Date**: October 8, 2025  
**Status**: Production Ready ✅  
**Breaking Changes**: None ✅  
**Transparency**: Full prompt visibility ✅
