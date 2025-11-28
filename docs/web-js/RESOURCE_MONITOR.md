# Resource Monitor - Restart Button Implementation

**Status**: Initial implementation complete - restart button added to top bar
**Created**: 2025-11-28
**Component**: Web JavaScript Extension (`web/js/resource_monitor.js`)

## Overview

The Resource Monitor extension adds a red "Restart" button to ComfyUI's top bar (next to the Run button), following the same placement pattern as Crystools' resource monitor. This is the first component of a planned full resource monitoring system.

## Implementation Details

### File Structure

```
web/
├── js/
│   ├── resource_monitor.js      # NEW: Resource monitor extension
│   └── swiss-army-knife.js      # Existing: Main extension (kept separate)
└── css/
    └── restart-button.css       # Existing: Unused CSS (kept for reference)
```

### Extension Registration

**Extension Name**: `comfyui_swissarmyknife.resource_monitor`

The extension is registered separately from the main Swiss Army Knife extension for better logical grouping of resource monitoring features.

### Top Bar Integration Pattern

Unlike the existing restart button in `swiss-army-knife.js` (which uses ComfyUI's menu command API and appears in a dropdown menu), the new resource monitor button uses **ComfyButtonGroup** to place the button in the top bar, exactly matching Crystools' implementation.

**Integration Method (matches Crystools):**
- Uses `ComfyButtonGroup` class from ComfyUI API
- Creates button group with ID `swissarmyknife-resource-monitor`
- Inserts before settings group: `app.menu.settingsGroup.element.before(buttonGroup.element)`
- No polling required - direct insertion during setup
- Same placement as Crystools resource monitor

### Button Placement Strategy

The implementation uses the **exact same placement as Crystools**:

1. **ComfyButtonGroup**: Creates a container using ComfyUI's official `ComfyButtonGroup` class
2. **Insert before settings**: Uses `app.menu.settingsGroup.element.before(buttonGroup.element)`
3. **Result**: Button appears in top bar, in the same location as Crystools resource monitor

### Styling

**Inline CSS injection** (not using `restart-button.css`):
- Background: `#dc3545` (Bootstrap danger red)
- Hover: `#c82333` (darker red)
- Active: `#bd2130` (even darker red)
- Disabled: `#6c757d` (gray, for future use)
- Border radius: `4px`
- Padding: `6px 12px`
- Font: `14px`, bold, white text
- Transitions: `0.2s ease` for smooth hover effects
- Active state includes `scale(0.98)` transform for click feedback

### Button Behavior

**Current Implementation (Placeholder):**
```javascript
button.addEventListener("click", async () => {
    debugLog("Restart button clicked (no functionality yet)");
    // TODO: Implement restart functionality
});
```

**Planned Functionality:**
- User confirmation dialog
- Backend API call to `/swissarmyknife/restart`
- Success/error notifications
- Automatic page reload after restart
- Disabled state during restart process

### Debug Logging

The extension respects the `SwissArmyKnife.debug_mode` setting and logs:
- Extension registration and setup
- Button creation and injection attempts
- DOM query results
- Success/failure of button placement

**Log prefix**: `[SwissArmyKnife][ResourceMonitor]`

## Comparison: Menu Command vs Top Bar Injection

### Existing Menu Command Approach
**File**: `web/js/swiss-army-knife.js` (lines 2419-2537)

**Pros:**
- Uses official ComfyUI extension API
- Automatic menu integration
- Consistent with ComfyUI conventions

**Cons:**
- Button appears in dropdown menu (not visible by default)
- Requires multiple clicks to access
- Not suitable for frequently-used actions

### New Top Bar Injection Approach
**File**: `web/js/resource_monitor.js`

**Pros:**
- Button always visible in top bar
- One-click access
- Better for frequently-used actions
- **Identical to Crystools' placement pattern**
- Uses official ComfyUI API (`ComfyButtonGroup`)

**Cons:**
- Different from standard menu command pattern
- Placement may vary across ComfyUI versions (but same as Crystools)

## Integration with Existing Restart Implementation

The new resource monitor extension **coexists** with the existing restart button in the menu:

| Feature | Menu Command | Top Bar Button |
|---------|-------------|----------------|
| **Location** | "Swiss Army Knife" menu dropdown | Top bar next to Run button |
| **Label** | "🔴 Restart ComfyUI Server" | "Restart" |
| **Functionality** | Full implementation (confirmation, API call, reload) | Placeholder (no functionality yet) |
| **Extension** | `swiss-army-knife.js` | `resource_monitor.js` |
| **API Method** | ComfyUI menu command API | Direct DOM injection |

**Future**: The menu command can be removed once the top bar button has full functionality implemented.

## Browser Refresh Required

After adding `web/js/resource_monitor.js`, users must:
1. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache if the extension doesn't load

No ComfyUI server restart is needed (JavaScript-only change).

## Next Steps

### Immediate
- [ ] Test button visibility in ComfyUI web interface
- [ ] Verify button placement next to Run button
- [ ] Implement restart functionality (connect to backend API)

### Short-term (Resource Monitor Features)
- [ ] Add CPU usage monitor
- [ ] Add RAM usage monitor  
- [ ] Add GPU/VRAM monitors
- [ ] Add temperature monitors
- [ ] Create backend API for hardware stats collection
- [ ] Implement real-time updates via WebSocket/polling

### Long-term
- [ ] Add settings for monitor visibility/placement
- [ ] Add customizable refresh rates
- [ ] Add historical graphs
- [ ] Add alerts for high resource usage
- [ ] Remove old menu command restart button

## Known Issues

1. **No Functionality**: The button currently does nothing when clicked (placeholder implementation).
2. **Cross-version Compatibility**: Placement depends on `app.menu.settingsGroup.element` being available (same constraint as Crystools).

## Testing Instructions

1. **Verify Extension Loading**:
   ```javascript
   // In browser console:
   console.log(app.extensions);
   // Should show: comfyui_swissarmyknife.resource_monitor
   ```

2. **Verify Button Presence**:
   ```javascript
   // In browser console:
   document.getElementById("swissarmyknife-restart-button");
   // Should return: <button> element
   ```

3. **Verify Styling**:
   ```javascript
   // In browser console:
   const button = document.getElementById("swissarmyknife-restart-button");
   const styles = window.getComputedStyle(button);
   console.log(styles.backgroundColor); // Should be: rgb(220, 53, 69)
   ```

4. **Manual Testing**:
   - Open ComfyUI web interface
   - Look for red "Restart" button in top bar
   - Verify it's positioned next to the Run button
   - Click the button (should log to console if debug mode enabled)
   - Hover over button (should darken)

## References

- **Crystools Monitor**: https://github.com/crystian/ComfyUI-Crystools/blob/2f18256c5b5063937106f29a8e0a7db3ae3869b7/web/monitor.ts
- **ComfyUI Extension API**: https://docs.comfy.org/custom-nodes/js/javascript_overview
- **Existing Restart Implementation**: `web/js/swiss-army-knife.js` lines 2419-2537
- **Backend Restart API**: `nodes/restart_api.py`

## Documentation Updates

- **This file**: Initial documentation created
- **README.md**: Not yet updated (pending testing)
- **IMPLEMENTATION_STATUS.md**: Should be updated after testing
