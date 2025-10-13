# JSON Field Order Standardization

**Date**: October 13, 2025
**Status**: ✅ Completed

## Overview

Standardized the order of JSON fields across all code (Python backend, JavaScript widgets, and documentation) to maintain consistency throughout the codebase.

## Standard Field Order

The consistent order for all prompt breakdown and media description JSON structures is:

1. **subject**
2. **clothing**
3. **movement**
4. **scene**
5. **cinematic_aesthetic**
6. **stylization_tone**

## Files Updated

### Python Backend

#### `nodes/utils/control_panel.py`

- Updated `prompt_breakdown` dictionary initialization (line 133)
- Updated field extraction order (lines 154-165)
- Updated console logging order (lines 177-182)

#### `nodes/media_describe/mediia_describe.py`

- Updated `_build_final_json()` method (line 252)
- Updated video `all_data` JSON (line 1175)
- Updated image `all_data` JSON (line 1265)
- Updated video prompt JSON field order (line 1445)
- Updated cached video data JSON (line 1655)
- Updated video analysis data JSON (line 1745)
- Updated JSON field descriptions in prompts (line 980)

### JavaScript Widgets

#### `web/js/swiss-army-knife.js`

- Updated column creation order (line 669)
- Updated column border styling (line 677)
- Updated DOM appendChild order (lines 679-684)
- Updated reference storage order (lines 699-704)
- Updated error message order (lines 770-775)
- Updated "no data" message order (lines 783-788)
- Updated column update order (lines 795-800)

## Benefits

1. **Consistency**: All files now use the same field order
2. **Maintainability**: Easier to track changes across the codebase
3. **UI Clarity**: Column order matches data structure order
4. **Documentation Alignment**: Documentation will reflect the same order

## Testing Required

After these changes, you should:

1. **Restart ComfyUI server** (backend Python changes)
2. **Clear browser cache** (JavaScript widget changes)
3. **Test workflow execution** to verify all fields display correctly
4. **Verify column order** in Control Panel Prompt Breakdown node

## Related Outputs

The order affects these outputs:

- Control Panel Prompt Breakdown widget display
- JSON outputs from Gemini AI Media Describe node
- `positive_prompt_json` output
- `all_media_describe_data` output
- Console logging output

## Future Considerations

- If adding new fields (e.g., "prefix"), insert them at the appropriate position
- Maintain this order in all new features and documentation
- Update this document if the standard order changes

## Notes

- The field order was previously inconsistent across files
- "scene" and "movement" are video-specific fields but are included in all structures for consistency
- The order prioritizes: subject → physical attributes → motion → environment → technical aspects
