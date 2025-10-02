# Reddit URL Widget Persistence Bug Fix

## Issue Description

After switching from "Reddit Post" to other media sources (Upload Media, Randomize Media from Path), the Reddit URL widget was properly hidden in the logic (`type: hidden, visible: false`) but still appeared visually in the UI. This created a confusing user experience where the widget seemed to persist between mode switches.

## Root Cause Analysis

The console logs revealed that the widget state management was working correctly:

```
[STATE] Hiding Reddit URL widget for upload mode
[DEBUG] Final Reddit URL widget state - type: hidden, visible: false, value: ""
```

However, ComfyUI's rendering system wasn't properly removing the visual representation of widgets that were set to `type: hidden`. This is a known issue with ComfyUI's widget visibility system where:

1. **Logical State**: Widget is correctly hidden (`type: hidden`)
2. **Visual State**: Widget DOM element remains visible in the UI
3. **Rendering Gap**: ComfyUI doesn't immediately refresh the visual display

## Enhanced Solution

### Complete Widget Removal (Final Solution)

When the standard widget hiding approaches failed, implemented complete widget removal from the DOM and widgets array:

```javascript
// Complete widget removal approach
if (originalRedditUrlWidget) {
    // Store widget for potential restoration
    this._hiddenRedditWidget = originalRedditUrlWidget;

    // Completely remove the widget from the widgets array
    const widgetIndex = this.widgets.indexOf(originalRedditUrlWidget);
    if (widgetIndex > -1) {
        this.widgets.splice(widgetIndex, 1);
    }

    // Remove DOM element completely
    if (
        originalRedditUrlWidget.element &&
        originalRedditUrlWidget.element.parentNode
    ) {
        originalRedditUrlWidget.element.parentNode.removeChild(
            originalRedditUrlWidget.element,
        );
    }

    // Force node to recompute size
    if (this.setSize) {
        setTimeout(() => {
            this.setSize(this.computeSize());
        }, 10);
    }
}
```

### Widget Restoration

When switching back to Reddit Post mode, restore the completely removed widget:

```javascript
// Check if widget still exists in widgets array
if (originalRedditUrlWidget) {
    // Widget exists, just show it normally
    originalRedditUrlWidget.type = 'text';
    originalRedditUrlWidget.computeSize =
        originalRedditUrlWidget.constructor.prototype.computeSize;
} else if (this._hiddenRedditWidget) {
    // Widget was removed, restore it
    this.widgets.push(this._hiddenRedditWidget);
    this._hiddenRedditWidget.type = 'text';
    this._hiddenRedditWidget.computeSize =
        this._hiddenRedditWidget.constructor.prototype.computeSize;
    this.redditUrlWidget = this._hiddenRedditWidget;
    this._hiddenRedditWidget.options = this._hiddenRedditWidget.options || {};
    this._hiddenRedditWidget.options.serialize = true;
    // Clear the stored reference
    this._hiddenRedditWidget = null;
}

// Aggressive showing (new)
if (originalRedditUrlWidget.element) {
    originalRedditUrlWidget.element.style.display = ''; // Reset DOM display
}
originalRedditUrlWidget.options = originalRedditUrlWidget.options || {};
originalRedditUrlWidget.options.serialize = true; // Enable serialization
```

### Enhanced UI Refresh

Added multiple refresh signals to force ComfyUI to update the visual display:

```javascript
// Standard refresh (existing)
this.setSize(this.computeSize());

// Additional refresh signals (new)
if (this.graph && this.graph.setDirtyCanvas) {
    this.graph.setDirtyCanvas(true, true);
}

// Delayed refresh to ensure rendering
setTimeout(() => {
    if (this.setDirtyCanvas) {
        this.setDirtyCanvas(true);
    }
    this.setSize(this.computeSize());
}, 10);
```

## Code Changes

### File: `web/js/swiss-army-knife.js`

#### 1. Randomize Media Mode Hiding

```javascript
// Before: Basic hiding only
originalRedditUrlWidget.type = 'hidden';
originalRedditUrlWidget.computeSize = () => [0, -4];

// After: Aggressive hiding
originalRedditUrlWidget.type = 'hidden';
originalRedditUrlWidget.computeSize = () => [0, -4];
originalRedditUrlWidget.value = '';
if (originalRedditUrlWidget.element) {
    originalRedditUrlWidget.element.style.display = 'none';
}
originalRedditUrlWidget.options.serialize = false;
```

#### 2. Upload Media Mode Hiding

Same aggressive hiding approach as randomize mode.

#### 3. Reddit Post Mode Showing

```javascript
// Before: Basic showing only
originalRedditUrlWidget.type = 'text';
originalRedditUrlWidget.computeSize =
    originalRedditUrlWidget.constructor.prototype.computeSize;

// After: Aggressive showing with display reset
originalRedditUrlWidget.type = 'text';
originalRedditUrlWidget.computeSize =
    originalRedditUrlWidget.constructor.prototype.computeSize;
if (originalRedditUrlWidget.element) {
    originalRedditUrlWidget.element.style.display = '';
}
originalRedditUrlWidget.options.serialize = true;
```

#### 4. Enhanced UI Refresh

Added multiple refresh mechanisms and delayed refresh to ensure visual updates.

## Expected Console Output

### When Hiding (Upload/Randomize Mode)

```
[STATE] Hiding Reddit URL widget for upload mode (aggressive)
[DEBUG] Final Reddit URL widget state - type: hidden, visible: false, value: ""
```

### When Showing (Reddit Post Mode)

```
[STATE] Showing Reddit URL widget for Reddit Post mode (with display reset)
[DEBUG] Final Reddit URL widget state - type: text, visible: true, value: ""
```

## Testing Instructions

1. **Start with Reddit Post mode** - Verify Reddit URL input is visible
2. **Enter a test URL** - Confirm input works
3. **Switch to Upload Media** - Reddit URL should disappear completely (both logic and visually)
4. **Switch to Randomize Media** - Reddit URL should remain hidden
5. **Switch back to Reddit Post** - Reddit URL should reappear with cleared value
6. **Check browser console** - Should show "aggressive" hiding/showing messages

## Fallback Strategy

If the aggressive approach still doesn't work, the next steps would be:

1. **Widget Removal**: Completely remove and recreate widgets instead of hiding
2. **Force DOM Manipulation**: Direct DOM element removal/addition
3. **ComfyUI API**: Use ComfyUI's internal widget management APIs
4. **Complete Node Refresh**: Force complete node re-rendering

## Browser Compatibility

The solution uses standard CSS `display` property manipulation which is supported in all modern browsers. The `setTimeout` approach ensures compatibility with ComfyUI's rendering cycle.

## Performance Impact

- **Minimal**: The aggressive approach adds a few DOM operations and one 10ms timeout
- **One-time**: Only executes during mode switches, not during normal operation
- **Cleanup**: Properly manages widget state to prevent memory leaks

## Related Files

- `web/js/swiss-army-knife.js` - Main widget management (enhanced)
- `docs/REDDIT_URL_WIDGET_VISIBILITY_FIX.md` - Previous iteration documentation
- `docs/JAVASCRIPT_REDDIT_POST_FIX.md` - Original Reddit Post JavaScript fix

## Success Criteria

✅ **Logical State**: Widget `type` and `value` correctly managed  
✅ **Visual State**: Widget completely hidden/shown in UI  
✅ **State Persistence**: No widget values persist between mode switches  
✅ **UI Responsiveness**: Immediate visual feedback when switching modes  
✅ **Debug Visibility**: Clear console logging for troubleshooting
