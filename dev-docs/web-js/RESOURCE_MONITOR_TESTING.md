# Resource Monitor Testing Guide

## Phase 2 Frontend Implementation - Testing Plan

### Prerequisites
1. Backend monitoring service is running (auto-starts with ComfyUI).
2. Python dependencies installed: `psutil`, `pynvml`, `py-cpuinfo`, `torch` (VRAM fallback).
3. ComfyUI server restarted to load backend changes.
4. Browser cache cleared (hard refresh: Ctrl+Shift+R or Cmd+Shift+R).
5. `SwissArmyKnife.debug_mode` enabled when you need verbose console logs.

### Test Checklist

#### 1. Visual Placement & Layout
- [ ] Floating glass bar renders ~50px below the main toolbar and remains centered on scroll.
- [ ] Wrapper has rounded corners, blur backdrop, and sits above other UI elements (`z-index: 9999`).
- [ ] Monitor tiles appear to the left, Restart button appears on the right with a divider.
- [ ] Hover and active states animate smoothly on both the monitors and the restart button.

#### 2. Backend Connection Test
Open browser console (F12) and check:
- [ ] No JavaScript errors on page load.
- [ ] Debug log shows "Resource Monitor extension setup started" and "inserted as floating bar" when debug mode is on.
- [ ] Initial `fetch /swissarmyknife/monitor/status` succeeds; failures must surface as console errors.
- [ ] Listener registered for `swissarmyknife.monitor` events (watch for `Monitor update received` logs when data arrives).

#### 3. Monitor Display Test

Expected tiles are driven entirely by backend capabilities:

If `psutil` is available:
- [ ] `CPU` tile shows percentage (0-100%).
- [ ] `RAM` tile shows GB used with a decimal (e.g., `12.4 GB`).
- [ ] `Temp` tile appears only if CPU temperature is reported.

If `torch` or `pynvml` is available:
- [ ] `VRAM {index} (Model)` tile appears for each detected GPU.
- [ ] `GPU {index} (Model)` utilization tile appears when pynvml exposes utilization stats.
- [ ] `TEMP {index} (Model)` appears when GPU temperature is reported.

For multi-GPU systems:
- [ ] Additional sets render for GPU 1, GPU 2, etc. Labels include compact model identifiers (e.g., `3090Ti`).

#### 4. Real-Time Update Test
- [ ] Tiles update roughly every two seconds without manual refresh.
- [ ] Debug logs show `Monitor update received` payloads at the same cadence in debug mode.
- [ ] Induce load (e.g., start a workflow) and confirm the numbers change accordingly.

#### 5. Gradient Fill & Threshold Test
Trigger different load levels and verify the gradient color + fill percentage logic:

| Usage Level | Expected Color (Linear Gradient) |
|-------------|----------------------------------|
| 0-49%       | Green `rgba(34, 197, 94, 0.25)`   |
| 50-69%      | Yellow `rgba(234, 179, 8, 0.25)`  |
| 70-89%      | Orange `rgba(249, 115, 22, 0.25)` |
| 90%+        | Red `rgba(239, 68, 68, 0.25)`     |

- [ ] Fill width matches the numeric percentage (use dev tools to inspect the inline `background` style if needed).
- [ ] When no percentage is available, tiles revert to the default translucent background.

#### 6. Restart Button Flow
- [ ] Default state shows `Restart` with ComfyUI button styling.
- [ ] On click, button disables + label changes to `Restarting...` and a toast appears (`severity: warn`, detail "Waiting for ComfyUI to become available...").
- [ ] `/swissarmyknife/restart` POST fires (confirm via network tab) and errors are ignored silently if the server drops.
- [ ] Button remains disabled while `/system_stats` polling runs; debug logs show health check attempts every 5 seconds.
- [ ] When the server responds OK, a success toast appears and the page hard-reloads.
- [ ] If the timeout (60 attempts) expires, a warning toast appears and the button re-enables with the original label.
- [ ] Any caught error shows an error toast with the message body.

#### 7. API Endpoint Smoke Test

```bash
# Get current status
curl http://localhost:8188/swissarmyknife/monitor/status | jq

# Get GPU 0 info
curl http://localhost:8188/swissarmyknife/monitor/gpu/0 | jq

# Clear VRAM (all devices)
curl -X POST http://localhost:8188/swissarmyknife/monitor/clear-vram | jq

# Update monitoring interval to 5 seconds
curl -X PATCH http://localhost:8188/swissarmyknife/monitor/settings \
  -H "Content-Type: application/json" \
  -d '{"interval": 5}' | jq
```

Expected responses:
- [ ] `/status` returns `success: true` plus `hardware` + `gpu` payloads used by the UI.
- [ ] `/gpu/0` returns a detailed entry for the requested device.
- [ ] `/clear-vram` responds with `success: true` and performs the backend cleanup.
- [ ] `/settings` echoes `current_settings.interval` with the updated value.

#### 8. Graceful Degradation

| Missing Dependency | Expected UI Behavior |
|--------------------|---------------------|
| psutil             | No CPU/RAM/CPU Temp tiles render, restart button still works. |
| pynvml             | GPU utilization + GPU temps are hidden, VRAM tiles render if torch is available. |
| torch + pynvml     | No GPU/VRAM tiles render; only CPU tiles (if psutil exists) plus restart. |
| Backend offline    | Tiles stay blank (`--`) and console logs errors, but page continues functioning. |

#### 9. Browser Compatibility
- [ ] Chrome / Chromium.
- [ ] Firefox.
- [ ] Safari.
- [ ] Edge.

Confirm that the floating bar respects viewport width (no clipping on smaller windows) and that the restart toasts display across browsers.

#### 10. Styling Regression Pass
- [ ] 16px border radius and blur remain consistent.
- [ ] Letter spacing on labels is subtle but readable; values use 14px semi-bold font.
- [ ] Restart button uses the same red palette as defined in CSS (`#dc3545` hover -> `#c82333`).
- [ ] Divider pseudo-element (`::before`) appears only on the restart button and aligns vertically.
- [ ] Wrapper maintains drop shadow depth without overlapping default ComfyUI dialogs.

### Common Issues & Fix Paths

**Monitors never appear**
1. Check browser console for failed `/status` calls.
2. Verify backend monitor service is running (server logs).
3. Hit `/swissarmyknife/monitor/status` manually to ensure JSON is returned.
4. Clear the browser cache and hard refresh.

**Tiles show `--` indefinitely**
1. Confirm backend dependencies (psutil/pynvml/torch) are installed inside the Docker environment.
2. Inspect backend logs for sensor access errors.
3. In debug mode ensure `Monitor update received` logs are flowing.
4. Validate REST endpoints above return actual numeric values.

**Gradient colors never change**
1. Inspect element and confirm inline `style.background` updates as percentages change.
2. Ensure the backend is sending non-null `percent` fields (inspect REST payload).
3. Force a workload that crosses multiple thresholds (e.g., launch a heavy workflow or GPU benchmark).

**Restart button stays disabled**
1. Watch the Network tab to ensure `/system_stats` is eventually reachable.
2. Check Docker/container logs to make sure ComfyUI actually restarted.
3. Verify toast message (should warn about manual refresh) and re-enable behavior.
4. Reload manually, then reproduce with debug logs enabled to capture attempts.

### Performance Expectations
- Initial status fetch + DOM build: < 500ms on modern browsers.
- Update cadence: ~2s (matches backend interval, configurable through `/settings`).
- CPU overhead: < 1% in Chrome DevTools performance captures.
- Memory overhead: < 10 MB total (DOM + JS state).

### Wrap-Up / Follow-Up Items
1. Capture screenshots of the floating HUD for `docs/web-js/RESOURCE_MONITOR.md` (include GPU + CPU heavy scenarios).
2. Document any backend sensor anomalies in `docs/infrastructure/debug/` if issues persist.
3. File issues for Phase 3 items (Clear VRAM button, visibility toggles, interval slider) as separate tickets once baseline testing passes.
