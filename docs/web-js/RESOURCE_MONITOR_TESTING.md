# Resource Monitor Testing Guide

## Phase 2 Frontend Implementation - Testing Plan

### Prerequisites
1. Backend monitoring service must be running (auto-starts with ComfyUI)
2. Python dependencies installed: `psutil`, `pynvml`, `py-cpuinfo`
3. ComfyUI server restarted to load backend changes
4. Browser cache cleared (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)

### Test Checklist

#### 1. Visual Placement Test
- [ ] Resource monitor appears in top bar
- [ ] Positioned next to workflow run button (before settings)
- [ ] Red "Restart" button visible
- [ ] Monitor displays appear after restart button

#### 2. Backend Connection Test
Open browser console (F12) and check:
- [ ] No JavaScript errors on page load
- [ ] Debug log shows "Resource Monitor extension setup started"
- [ ] Debug log shows successful fetch of initial status
- [ ] WebSocket connection established for 'swissarmyknife.monitor' events

#### 3. Monitor Display Test

**Expected Monitors (depends on system and available dependencies):**

If `psutil` available:
- [ ] CPU monitor showing percentage (0-100%)
- [ ] RAM monitor showing percentage (0-100%)
- [ ] CPU Temp monitor (if temperature sensors available)

If `torch` or `pynvml` available:
- [ ] VRAM 0 monitor (always available with torch/pynvml)
- [ ] GPU 0 monitor (only if pynvml available)
- [ ] Temp 0 monitor (only if pynvml available)

For multi-GPU systems:
- [ ] Additional GPU/VRAM/Temp monitors for GPU 1, 2, etc.

#### 4. Real-Time Updates Test
- [ ] Monitors update every 2 seconds
- [ ] Check browser console for WebSocket events (debug mode)
- [ ] Values change in response to system load

#### 5. Color Coding Test

Generate different load levels and verify colors:

| Usage Level | Expected Color | CSS Class |
|-------------|---------------|-----------|
| 0-49% | Green (#28a745) | level-low |
| 50-69% | Yellow (#ffc107) | level-medium |
| 70-89% | Orange (#fd7e14) | level-high |
| 90-100% | Red (#dc3545) | level-critical |

Test:
- [ ] Low load (< 50%) shows green
- [ ] Medium load (50-69%) shows yellow
- [ ] High load (70-89%) shows orange
- [ ] Critical load (90%+) shows red

#### 6. Restart Button Test
- [ ] Restart button still works correctly
- [ ] Shows "Restarting server..." toast notification
- [ ] Server shuts down and restarts
- [ ] Page reloads after 5 seconds
- [ ] Monitors reappear after restart

#### 7. API Endpoint Test

Test REST API endpoints directly:

```bash
# Get current status
curl http://localhost:8188/swissarmyknife/monitor/status | jq

# Get GPU 0 info
curl http://localhost:8188/swissarmyknife/monitor/gpu/0 | jq

# Clear VRAM
curl -X POST http://localhost:8188/swissarmyknife/monitor/clear-vram | jq

# Update monitoring interval to 5 seconds
curl -X PATCH http://localhost:8188/swissarmyknife/monitor/settings \
  -H "Content-Type: application/json" \
  -d '{"interval": 5}' | jq
```

Expected responses:
- [ ] `/status` returns full hardware + GPU status
- [ ] `/gpu/0` returns specific GPU info
- [ ] `/clear-vram` clears VRAM and returns success
- [ ] `/settings` updates interval and returns success

#### 8. Graceful Degradation Test

Test behavior when dependencies are missing:

**Without psutil:**
- [ ] No CPU/RAM/CPU Temp monitors shown
- [ ] No JavaScript errors
- [ ] GPU monitors still work (if available)

**Without pynvml:**
- [ ] GPU utilization monitors not shown
- [ ] VRAM monitors still work (via torch)
- [ ] Temperature monitors not shown

**Without torch or pynvml:**
- [ ] No GPU monitors shown
- [ ] CPU/RAM monitors still work (if psutil available)
- [ ] Restart button still works

#### 9. Browser Compatibility Test
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### 10. Styling Test
- [ ] Monitors have consistent spacing (8px gap)
- [ ] Labels are uppercase with proper letter-spacing
- [ ] Font sizes appropriate (10px label, 13px value)
- [ ] Background has subtle transparency
- [ ] Matches overall ComfyUI theme

### Common Issues and Solutions

#### Issue: Monitors don't appear
**Solution:**
1. Check browser console for errors
2. Verify backend service started (check server logs)
3. Clear browser cache and hard refresh
4. Verify `/swissarmyknife/monitor/status` endpoint returns data

#### Issue: Values show "--" or "N/A"
**Solution:**
1. Check if Python dependencies installed (psutil, pynvml, py-cpuinfo)
2. Verify backend service can access hardware info
3. Check server logs for Python errors
4. Test API endpoint directly with curl

#### Issue: No color coding
**Solution:**
1. Check that percent values are being passed to updateMonitorValue()
2. Verify CSS classes are applied (inspect element in browser)
3. Check CSS is properly injected

#### Issue: WebSocket not receiving updates
**Solution:**
1. Enable debug mode in ComfyUI settings
2. Check browser console for WebSocket connection
3. Verify monitor service is broadcasting (check server logs)
4. Test that `/status` endpoint works

### Performance Metrics

Expected performance:
- Initial load: < 500ms for status fetch
- Update interval: 2 seconds (configurable)
- CPU overhead: < 1% on average
- Memory overhead: < 10MB

### Next Steps After Testing

Once Phase 2 testing is complete:

1. **Documentation updates:**
   - Update `docs/web-js/RESOURCE_MONITOR.md` with Phase 2 details
   - Add screenshots to documentation
   - Document configuration options

2. **Phase 3 enhancements:**
   - Add "Clear VRAM" button
   - Add settings panel for monitor visibility
   - Add configurable update frequency UI
   - Add tooltips with detailed info
   - Add historical graphs (optional)

3. **Performance optimization:**
   - Implement throttling for high-frequency updates
   - Add request batching for API calls
   - Optimize WebSocket message size

4. **User experience:**
   - Add loading states
   - Add error states with retry
   - Add hover tooltips
   - Add click-to-expand details
