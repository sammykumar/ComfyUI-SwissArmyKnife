# SuperLoraLoader Plus Button Fix

## Issue

The Plus (+) button on the single-stream `SuperLoraLoader` node was incorrectly triggering the dual-panel LoRA selector (designed for high/low noise pairs), instead of showing the standard single-stream LoRA selector.

## Root Cause

The `showLoraSelector` method in `/web/js/lora_manager/extension.js` was checking only whether a widget was passed (`!widget`) to determine which selector to show:

```javascript
// Old logic - INCORRECT
if (!widget) {
    // Always show dual-panel selector when no widget passed
    OverlayService.getInstance().showDualLoraSelector({...});
    return;
}
```

When the Plus button was clicked via `onAddLoraDown`, it called:

```javascript
WidgetAPI.showLoraSelector(node, void 0, event);
```

This passed `undefined` as the widget parameter, triggering the dual-panel selector for ALL node types.

## Solution

Modified the `showLoraSelector` method to check the node type before deciding which selector to show:

```javascript
// New logic - CORRECT
const isDualStreamNode = node.type === "SuperDualLoraLoader";

// Only show dual-panel selector for SuperDualLoraLoader nodes
if (!widget && isDualStreamNode) {
    OverlayService.getInstance().showDualLoraSelector({...});
    return;
}

// For SuperLoraLoader (single stream), fall through to single-stream selector
OverlayService.getInstance().showSearchOverlay({...});
```

## Node Types

- **`SuperLoraLoader`**: Single-stream node - should always use single-stream selector
- **`SuperDualLoraLoader`**: Dual-stream node - uses dual-panel selector for adding pairs

## Expected Behavior

### SuperLoraLoader (Single Stream)

- **Plus button**: Opens single-stream LoRA selector with multi-select capability
- **Edit existing LoRA**: Opens single-stream selector to replace that specific LoRA

### SuperDualLoraLoader (Dual Stream)

- **Plus button**: Opens dual-panel selector to add high/low noise LoRA pairs
- **Edit existing LoRA**: Opens single-stream selector to replace that specific LoRA

## Files Modified

- `/web/js/lora_manager/extension.js` - Line 4250-4287 (showLoraSelector method)

## Testing

1. Create a `SuperLoraLoader` node
2. Click the Plus (+) button
3. Verify the single-stream selector appears (not the dual-panel)
4. Should show standard LoRA list with multi-select toggle capability

5. Create a `SuperDualLoraLoader` node
6. Click the Plus (+) button
7. Verify the dual-panel selector appears for high/low noise pairs

## Future Considerations

- Consider adding node type validation throughout the codebase
- Ensure consistent selector behavior across all node interactions
- Document selector usage patterns for future node types
