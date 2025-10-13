# System Prompt Field Standardization

**Date**: October 13, 2025
**Status**: ✅ Completed

## Overview

Updated the Gemini system prompts to always include all 6 fields in the standardized order for both image and video processing. This ensures consistency between the Control Panel Prompt Breakdown display and the actual Gemini API responses.

## Standard Field Order

All Gemini prompts now explicitly request these 6 fields in this exact order:

1. **subject**
2. **clothing**
3. **movement**
4. **scene**
5. **cinematic_aesthetic** (or `cinematic_aesthetic_control` for videos)
6. **stylization_tone**

## Changes Made

### Image Processing Prompt

**Before**: Conditionally included 4 fields based on boolean flags

- Only included: subject, clothing, cinematic_aesthetic, stylization_tone
- Fields were conditionally added based on `describe_subject` and `describe_clothing` flags

**After**: Always includes all 6 fields

- Added `movement` field: _"For still images, describe implied motion, frozen action, or static pose. Examples: 'frozen mid-stride', 'poised in stillness', 'captured mid-gesture'."_
- Added `scene` field: _"Describe the environment, setting, and spatial context. Include background elements, location type, and atmospheric details."_
- Removed conditional logic - all fields always present
- Updated system prompt to explicitly list all 6 fields in order

### Video Processing Prompt

**Status**: Already correct

- Video prompts already had all 6 fields hardcoded
- Field order already matched the standard
- No changes needed

## Benefits

1. **Consistency**: Control Panel columns match Gemini output structure
2. **Completeness**: All descriptions include environment and motion context
3. **Predictability**: Always receive the same JSON structure regardless of options
4. **Clarity**: Gemini receives explicit instructions for all 6 categories

## Example Output Structure

### Image Output

```json
{
    "subject": "A woman standing with relaxed posture, hands at her sides, hair flowing naturally...",
    "clothing": "Dark blue denim jacket with silver buttons, fitted black jeans...",
    "movement": "Poised in stillness, captured in a moment of calm contemplation...",
    "scene": "Modern urban setting with concrete walls and industrial lighting...",
    "cinematic_aesthetic": "Soft natural lighting from left, shot at f/1.8 with shallow depth of field...",
    "stylization_tone": "Contemporary minimalist aesthetic with noir-inspired shadows..."
}
```

### Video Output

```json
{
    "subject": "A woman walking forward with confident stride, hair moving with momentum...",
    "clothing": "Flowing red dress with fabric billowing in motion...",
    "movement": "Striding purposefully from background to foreground, accelerating through the frame...",
    "scene": "Busy city street with blurred pedestrians and storefronts...",
    "cinematic_aesthetic_control": "Tracking shot following subject, maintaining focus with rack focus transitions...",
    "stylization_tone": "Cinematic realism with dramatic color grading..."
}
```

## Implementation Details

### Image Prompt Structure

The system prompt now includes:

```
Return **only** a single valid JSON object (no code fences, no extra text)
with **exactly six** string fields in this exact order:

1. "subject"
2. "clothing"
3. "movement"
4. "scene"
5. "cinematic_aesthetic"
6. "stylization_tone"
```

### Field Descriptions for Images

- **movement**: Adapted for still images - describes implied motion, frozen action, or static pose
- **scene**: Provides environmental context that was previously implicit
- Other fields remain functionally the same

## Testing Required

After these changes:

1. **Restart ComfyUI server** (backend Python changes)
2. **Test image analysis** - Verify all 6 fields are returned by Gemini
3. **Test video analysis** - Verify behavior remains unchanged
4. **Check Control Panel** - Verify all columns populate correctly
5. **Verify scene descriptions** - Ensure scene field provides useful context for images

## Files Modified

- `nodes/media_describe/mediia_describe.py` - Updated image prompt generation (lines 980-1020)

## Related Documentation

- [JSON Field Order Standardization](../infrastructure/JSON_FIELD_ORDER_STANDARDIZATION.md)
- [Gemini Options Simplification](GEMINI_OPTIONS_SIMPLIFICATION.md)

## Notes

- The `movement` field for images describes static/frozen motion rather than actual movement
- The `scene` field for images provides important environmental context previously missing
- Video prompts were already correct and required no changes
- This change complements the removal of conditional toggles from the options node
