# Gemini Util - Options Node Simplification

**Date**: October 13, 2025
**Status**: ✅ Completed

## Overview

Simplified the Gemini Util - Options node by removing toggles for commonly-enabled features. These features are now always enabled by default, reducing UI clutter and simplifying the workflow setup.

## Changes Made

### Removed Input Toggles

The following inputs have been **removed** from the node UI:

1. ❌ **describe_clothing** - Always enabled now
2. ❌ **describe_hair_style** - Always enabled now
3. ❌ **describe_bokeh** - Always enabled now
4. ❌ **describe_subject** - Always enabled now
5. ❌ **prefix_text** - Always empty now (prefix functionality removed)
6. ❌ **replace_action_with_twerking** - Always disabled now (feature removed)

### Retained Input Toggles

The following inputs remain in the node:

1. ✅ **gemini_api_key** - Required for API authentication
2. ✅ **gemini_model** - Model selection dropdown
3. ✅ **prompt_style** - Text2Image vs ImageEdit mode selection
4. ✅ **change_clothing_color** - Optional feature toggle

## Backward Compatibility

The internal options object still contains all the removed fields, but they are now **hardcoded to `True`**:

```python
options = {
    "gemini_api_key": effective_api_key,
    "gemini_model": gemini_model,
    "model_type": prompt_style,
    "describe_clothing": True,        # Always enabled
    "change_clothing_color": change_clothing_color == "Yes",
    "describe_hair_style": True,      # Always enabled
    "describe_bokeh": True,           # Always enabled
    "describe_subject": True,         # Always enabled
    "replace_action_with_twerking": False,  # Always disabled
    "prefix_text": ""                 # Always empty
}
```

This ensures that existing code in `mediia_describe.py` and other files that check these boolean flags will continue to work without modifications.

## Benefits

1. **Cleaner UI**: Minimal toggle switches make the node easy to use
2. **Simpler Workflow**: Users don't need to configure commonly-enabled features
3. **Better Defaults**: All essential description features are enabled out-of-the-box
4. **Focused Features**: Only the most useful toggle (change_clothing_color) remains

## Files Modified

- `nodes/media_describe/gemini_util_options.py` - Removed input toggles and hardcoded values in `create_options()`

## Testing Required

After these changes:

1. **Restart ComfyUI server** (backend Python changes)
2. **Test workflow execution** with the simplified options node
3. **Verify all descriptions** include subject, clothing, hair style, and bokeh details
4. **Test change_clothing_color feature** if needed

## Migration Notes

Existing workflows using the old node version will:

- Show missing connections for removed inputs (safe to ignore)
- Continue working as before since all removed features are now always-on
- Can be updated to use the simplified node by simply reconnecting the retained inputs

## Rationale

The removed toggles were almost always enabled in practice:

- **describe_clothing**: Essential for character description
- **describe_hair_style**: Important visual detail
- **describe_bokeh**: Crucial for photographic quality prompts
- **describe_subject**: Core requirement for prompt generation

The **prefix_text** field was rarely used and added complexity. Users who need prefix functionality can add text manually to the final output or use string concatenation nodes.

The **replace_action_with_twerking** feature was a niche use case that added unnecessary complexity to the UI.

Keeping them as inputs added unnecessary complexity without practical benefit.
