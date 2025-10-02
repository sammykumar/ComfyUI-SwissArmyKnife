# JavaScript Reddit Post Widget Fix

## Issue Description

When selecting "Reddit Post" as the media source, the UI was not showing the Reddit URL input field. Instead, it was showing upload widgets as if "Upload Media" was selected.

## Root Cause

The JavaScript widget code in `web/js/swiss-army-knife.js` was checking for `"Reddit post"` (lowercase 'p') but the Python backend was updated to use `"Reddit Post"` (uppercase 'P'), causing the condition to never match.

## Console Logs Analysis

The debug logs showed:

- `[STATE] Upload Media mode - hiding media_path widget`
- `[STATE] Creating image upload widgets` / `[STATE] Creating video upload widgets`

This indicated the JavaScript was falling through to the "Upload Media" logic instead of the Reddit Post logic.

## Fix Applied

**File**: `web/js/swiss-army-knife.js`  
**Line**: 435

### Before

```javascript
} else if (mediaSource === "Reddit post") {
    console.log("[STATE] Reddit post mode - showing Reddit URL widget");
```

### After

```javascript
} else if (mediaSource === "Reddit Post") {
    console.log("[STATE] Reddit Post mode - showing Reddit URL widget");
```

## Expected Behavior After Fix

When "Reddit Post" is selected as media_source:

1. **Console Logs Should Show**:

    ```
    [STATE] Reddit Post mode - showing Reddit URL widget
    [STATE] Hiding seed widget for Reddit mode
    ```

2. **UI Should Display**:
    - Reddit URL text input field
    - No upload widgets (image/video upload buttons should be hidden)
    - No media path widget
    - No seed widget

3. **Hidden Widgets**:
    - `media_path` widget
    - `seed` widget
    - `uploaded_image_file` widget
    - `uploaded_video_file` widget

4. **Visible Widgets**:
    - `reddit_url` text input field
    - All standard Gemini options (frame_rate, max_duration, etc.)

## Browser Cache Note

**Important**: After deploying this JavaScript fix, users may need to:

- Hard refresh the browser (Ctrl+F5 / Cmd+Shift+R)
- Clear browser cache
- Restart ComfyUI server to ensure new JavaScript is loaded

## Testing Steps

1. Select "Reddit Post" from media_source dropdown
2. Verify console shows `[STATE] Reddit Post mode - showing Reddit URL widget`
3. Confirm Reddit URL text input field is visible
4. Verify upload widgets are hidden
5. Test entering a Reddit URL and processing media

## Related Files

- `web/js/swiss-army-knife.js` - JavaScript widget logic (fixed)
- `nodes/nodes.py` - Python backend (already working)
- `docs/REDDIT_POST_MEDIA_SOURCE.md` - Feature documentation
