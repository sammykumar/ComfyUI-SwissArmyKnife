# Reddit URL Widget Visibility Fix

## Issue Description

When switching from "Reddit Post" to other media source options (like "Upload Media" or "Randomize Media from Path"), the Reddit URL text input widget should be hidden but may remain visible or retain its value.

## Root Cause Analysis

The widget hiding logic was implemented but may have issues with:

1. **Widget Reference**: The `reddit_url` widget might not be found properly
2. **UI Refresh**: The visibility changes might not take effect immediately
3. **Value Persistence**: The widget value might persist when switching modes
4. **State Management**: The widget state might not be properly reset

## Enhanced Solution

### Debug Logging Added

Enhanced the JavaScript widget management with comprehensive debug logging:

```javascript
// Widget discovery logging
console.log(
    `[DEBUG] originalRedditUrlWidget found: ${!!originalRedditUrlWidget}`,
);
console.log(
    `[DEBUG] All widget names: ${this.widgets.map((w) => w.name).join(', ')}`,
);

// State tracking for each mode
console.log('[STATE] Hiding Reddit URL widget for upload mode');
console.log('[STATE] Hiding Reddit URL widget for randomize mode');
console.log('[STATE] Showing Reddit URL widget for Reddit Post mode');

// Final state verification
console.log(
    `[DEBUG] Final Reddit URL widget state - type: ${type}, visible: ${visible}, value: "${value}"`,
);
```

### Value Clearing

Added explicit value clearing when hiding the Reddit URL widget:

```javascript
// Clear the value when hiding the widget
originalRedditUrlWidget.value = '';
```

### Widget State Management

The logic now properly handles all three media source modes:

#### 1. Reddit Post Mode

- ✅ Shows `reddit_url` widget as text input
- ✅ Hides `media_path`, `seed`, upload widgets

#### 2. Randomize Media from Path Mode

- ✅ Hides `reddit_url` widget
- ✅ Clears `reddit_url` value
- ✅ Shows `media_path` and `seed` widgets

#### 3. Upload Media Mode

- ✅ Hides `reddit_url` widget
- ✅ Clears `reddit_url` value
- ✅ Shows appropriate upload widgets

## Testing Steps

### Console Debug Output

When switching between media sources, you should see:

**Switching TO Reddit Post:**

```
[DEBUG] originalRedditUrlWidget found: true
[STATE] Reddit Post mode - showing Reddit URL widget
[STATE] Showing Reddit URL widget for Reddit Post mode
[DEBUG] Final Reddit URL widget state - type: text, visible: true, value: ""
```

**Switching FROM Reddit Post to Upload Media:**

```
[DEBUG] originalRedditUrlWidget found: true
[STATE] Upload Media mode - hiding media_path widget
[STATE] Hiding Reddit URL widget for upload mode
[DEBUG] Final Reddit URL widget state - type: hidden, visible: false, value: ""
```

**Switching FROM Reddit Post to Randomize Media:**

```
[DEBUG] originalRedditUrlWidget found: true
[STATE] Showing media path widget
[STATE] Hiding Reddit URL widget for randomize mode
[DEBUG] Final Reddit URL widget state - type: hidden, visible: false, value: ""
```

### UI Behavior Verification

1. **Start with Reddit Post mode** - Reddit URL input should be visible
2. **Enter a Reddit URL** - Verify the text input works
3. **Switch to Upload Media** - Reddit URL input should disappear
4. **Switch back to Reddit Post** - Reddit URL input should reappear (with cleared value)
5. **Switch to Randomize Media** - Reddit URL input should disappear
6. **Check console logs** - Should show appropriate debug messages

### Troubleshooting

If the Reddit URL widget doesn't hide properly:

1. **Check console logs** for:
    - `[DEBUG] originalRedditUrlWidget found: false` - Widget not found
    - Missing `[STATE] Hiding Reddit URL widget` messages - Logic not executing
    - Final widget state shows `visible: true` - Hiding failed

2. **Verify widget names** in console output:
    - Should include `reddit_url` in the widget names list
    - If missing, check Python backend INPUT_TYPES

3. **Browser cache refresh** may be needed for JavaScript changes

## Code Changes

### File: `web/js/swiss-army-knife.js`

#### Enhanced Debug Logging

- Added widget discovery verification
- Added state change logging for all modes
- Added final state verification
- Added complete widget names listing

#### Value Management

- Clear `reddit_url` value when hiding widget
- Proper widget type management (`text` vs `hidden`)
- Explicit `computeSize` reset for visibility changes

#### UI Refresh

- Existing `setSize(this.computeSize())` call ensures UI updates
- Widget type changes trigger proper visibility updates

## Expected Behavior

After applying this fix:

1. **Reddit URL widget should only be visible in Reddit Post mode**
2. **Widget value should be cleared when switching away from Reddit Post**
3. **Console logs should provide clear feedback about widget state changes**
4. **UI should update immediately when switching media source options**
5. **No widget persistence issues between mode switches**

## Related Files

- `web/js/swiss-army-knife.js` - JavaScript widget management (enhanced)
- `nodes/nodes.py` - Python backend with `reddit_url` input definition
- `docs/JAVASCRIPT_REDDIT_POST_FIX.md` - Original Reddit Post JavaScript fix
- `docs/REDDIT_POST_MEDIA_SOURCE.md` - Overall Reddit Post feature documentation
