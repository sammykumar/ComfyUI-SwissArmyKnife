# Prompt Truncation Fix

**Date**: October 8, 2025  
**Status**: ✅ Completed  
**Type**: Bug Fix

## Problem

System and user prompts in the Control Panel were being truncated at 500 characters, cutting off important prompt content.

### Symptoms

- System prompt showing "... (truncated)" message
- Only first 500 characters of prompts visible
- Full prompt content not accessible in UI

### Root Cause

The `formatField` helper function in Control Panel applies a 500-character truncation limit to all fields by default:

```javascript
const formatField = (emoji, label, value, skipTruncate = false) => {
    let valueStr = String(value);
    // Truncate very long values unless skipTruncate is true
    if (!skipTruncate && valueStr.length > 500) {
        valueStr = valueStr.substring(0, 500) + '... (truncated)';
    }
    return `${emoji} ${label}:\n${valueStr}\n\n`;
};
```

When prompts were appended to `gemini_status`, the combined value exceeded 500 characters and got truncated.

## Solution

Added `skipTruncate` flag when prompts are included in gemini_status field:

```javascript
// Populate left column
for (const field of leftFields) {
    if (parsedData.hasOwnProperty(field.key)) {
        let fieldValue = parsedData[field.key];
        let skipTruncate = false;

        // For gemini_status, append prompts if available
        if (field.key === 'gemini_status') {
            if (parsedData.system_prompt || parsedData.user_prompt) {
                fieldValue +=
                    '\n\n📝 System Prompt:\n' +
                    (parsedData.system_prompt || 'N/A');
                fieldValue +=
                    '\n\n💬 User Prompt:\n' + (parsedData.user_prompt || 'N/A');

                // Don't truncate when prompts are included (they can be long)
                skipTruncate = true; // ✅ FIX
            }
        }

        leftLines.push(
            formatField(field.emoji, field.label, fieldValue, skipTruncate),
        );
    }
}
```

## Files Modified

**File**: `web/js/swiss-army-knife.js`

**Location**: Lines ~469-492 (Control Panel data display logic)

**Change**: Set `skipTruncate = true` when prompts are appended to gemini_status

## Before & After

### Before (Truncated)

```
🔄 Gemini Status:
🤖 Gemini Analysis Status: ✅ Complete
• Model: models/gemini-2.5-pro
• API Key: ****abcd
• Input: Video

📝 System Prompt:
You are an expert assistant specialized in analyzing and verbalizing input videos for cinematic-quality video transformation using the Wan 2.2 + VACE workflow.

DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions. When you see something that could be described multiple ways, make a confident choice and state it as fact. Never use... (truncated)
```

### After (Full Display)

```
🔄 Gemini Status:
🤖 Gemini Analysis Status: ✅ Complete
• Model: models/gemini-2.5-pro
• API Key: ****abcd
• Input: Video

📝 System Prompt:
You are an expert assistant specialized in analyzing and verbalizing input videos for cinematic-quality video transformation using the Wan 2.2 + VACE workflow.

DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions. When you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or". Instead of "holding a black folder or book", write "holding a black folder". Instead of "wearing what appears to be denim", write "wearing dark blue denim jeans".

Before writing, silently review the provided media. Do not use meta phrases (e.g., "this video shows").
Generate descriptions that adhere to the following structured layers and constraints, formatting each as a SEPARATE PARAGRAPH in this exact order:

1. SUBJECT (First Paragraph)
[... full prompt continues ...]

💬 User Prompt:
Please analyze this video and provide a detailed description following the 6-paragraph structure outlined in the system prompt.
```

## Why This Matters

### System Prompts Can Be Very Long

**Wan 2.2 Image Prompts**: ~1500-2000 characters

- Detailed paragraph structure instructions
- Decisiveness requirements
- Multiple constraint layers
- Critical notes and safeguards

**ImageEdit Prompts**: ~800-1200 characters

- Qwen-Image-Edit specific instructions
- Focus and composition requirements
- Color change instructions

**Video Prompts**: ~1800-2500 characters

- 6-paragraph structure for videos
- Movement and scene descriptions
- Temporal continuity requirements

### Full Visibility Required

Users need to see the **complete prompts** to:

- ✅ Debug AI responses effectively
- ✅ Understand full instruction set
- ✅ Identify missing or incorrect instructions
- ✅ Optimize prompt engineering
- ✅ Reproduce results accurately

## Technical Details

### Truncation Logic

The `formatField` function accepts a `skipTruncate` parameter:

```javascript
const formatField = (emoji, label, value, skipTruncate = false) => {
    let valueStr = String(value);

    // Only truncate if skipTruncate is false AND value exceeds 500 chars
    if (!skipTruncate && valueStr.length > 500) {
        valueStr = valueStr.substring(0, 500) + '... (truncated)';
    }

    return `${emoji} ${label}:\n${valueStr}\n\n`;
};
```

### Fields with Truncation

**Truncated** (default):

- `media_info` - Usually short
- `processed_media_path` - Usually short
- `height` - Always short
- `width` - Always short

**Not Truncated** (skipTruncate = true):

- `final_string` (right column) - Full description needed
- `gemini_status` with prompts - Full prompts needed

### Scrolling Behavior

Long prompts are fully displayed in the Control Panel's left column, which has:

- `overflow: auto` - Enables scrolling
- `maxHeight: 100%` - Stays within node bounds
- `whiteSpace: pre-wrap` - Preserves formatting

Users can scroll within the left panel to read the complete prompts.

## Testing Checklist

- [x] JavaScript syntax valid (no errors)
- [x] skipTruncate flag properly set for gemini_status with prompts
- [x] Full system prompt displays (1500+ chars)
- [x] Full user prompt displays (100+ chars)
- [x] No truncation message appears
- [x] Scrolling works in left panel
- [x] Other fields still truncate correctly (if needed)

## Benefits

### ✅ Complete Transparency

- See entire prompt sent to Gemini
- No information loss
- Full debugging capability

### ✅ Better UX

- No frustrating truncation
- Scroll to read full content
- Professional presentation

### ✅ Accurate Documentation

- Capture complete prompt configurations
- Share full prompts with team
- Maintain accurate records

## Edge Cases Handled

### Very Long Prompts (3000+ chars)

- Full content displayed
- Scrollable in Control Panel
- No performance issues

### Cache Hits

- Placeholder text: "(Cached result - prompts not available)"
- Always short, no truncation needed

### Missing Prompts

- Shows "N/A" for missing prompts
- Short text, no truncation

### Combined Length

- gemini_status (~200 chars) + system_prompt (~2000 chars) + user_prompt (~100 chars) = ~2300 chars total
- All displayed without truncation

---

**Implementation Date**: October 8, 2025  
**Status**: Production Ready ✅  
**Breaking Changes**: None ✅  
**User Impact**: Improved visibility ✅
