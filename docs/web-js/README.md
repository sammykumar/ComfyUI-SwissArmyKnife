# UI Widgets Documentation

Reusable UI components and custom widgets for ComfyUI-SwissArmyKnife nodes.

## 📄 Documentation Files

### Core Widgets

- **[CONTROL_PANEL.md](CONTROL_PANEL.md)** - Dashboard widget for monitoring and displaying workflow data
- **[DIMENSIONS_DISPLAY.md](DIMENSIONS_DISPLAY.md)** - Media dimension display widget with troubleshooting
- **[RESOURCE_MONITOR.md](RESOURCE_MONITOR.md)** - Floating HUD with live telemetry + inline restart workflow
- **[SEED_WIDGET.md](SEED_WIDGET.md)** - Randomization seed widget for reproducible workflows
- **[UPLOAD_WIDGETS.md](UPLOAD_WIDGETS.md)** - Interactive upload buttons for media files
- **[WIDGET_FIXES.md](WIDGET_FIXES.md)** - General widget fixes, visibility management, and state persistence

## 🎯 Widget Categories

### Control Panel

- Multi-option configuration interface
- JSON data handling and parsing
- Two-column layout for metadata and content
- Dynamic option visibility
- Workflow serialization and execution monitoring

### Dimension Display

- Automatic width/height display
- Multiple message format support
- API event handler integration
- Real-time updates after execution
- Debug logging and troubleshooting

### Seed Widget

- Random seed generation with 🎲 button
- Seed value persistence across workflows
- Smart visibility (shows only for "Randomize from Path" mode)
- Reproducible file selection
- Large integer range support (0 to 2^64-1)

### Resource Monitor ⭐ NEW: OOM Detection System

- **Floating HUD**: Glassmorphism bar with live CPU/RAM/GPU/VRAM monitoring via WebSocket
- **Workflow Profiler**: Popup showing execution stats, cache hits, VRAM peaks
- **OOM Detection & Analysis**: ✅ **FULLY IMPLEMENTED & TESTED**
  - Pre-OOM warnings at 85% (⚠️ yellow) and 95% (🔴 red) VRAM thresholds
  - Visual warning indicators on stats cards in profiler popup
  - 💥 OOM column in node execution table showing failed nodes
  - Comprehensive "💥 OOM Analysis" modal tab with:
    - Summary cards (Total OOMs, OOM Rate, Workflow Count)
    - Recent OOM events with detailed context (VRAM, models, timing)
    - Node type ranking by OOM frequency
    - Model correlation analysis (problematic combinations)
    - Auto-generated recommendations with severity indicators
- **Restart Workflow**: Full `/swissarmyknife/restart` lifecycle with health polling
- **Independent Extension**: Separate from menu-based widgets for modular development

### Upload Widgets

- Interactive file upload buttons for images and videos
- ComfyUI integration with built-in upload system
- Dynamic widget visibility based on media type
- Click-to-upload interface with file browser
- Real-time button updates showing selected filenames

### Widget Fixes

- Visibility management and hiding mechanism
- Final string widget update handling
- State persistence with onSerialize/onConfigure
- Upload widget management
- Dynamic widget system improvements

## 🔧 Implementation Patterns

### Widget Registration

```javascript
app.registerExtension({
    name: 'widget_name',
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Widget setup
    },
});
```

### State Persistence

Widgets should:

1. Save state to node properties
2. Restore state on node creation
3. Serialize state in workflow JSON
4. Handle missing/invalid state gracefully

### Event Handling

- Listen to ComfyUI API events
- Update UI on node execution
- Handle user interactions
- Clean up event listeners on removal

## 🆕 Latest Updates

### November 29, 2025 - OOM Detection System v1.4.0

**Status**: ✅ **COMPLETE & TESTED**

Comprehensive Out of Memory detection and analysis system:

- **Backend**: Full OOM tracking with historical statistics (`profiler_core.py`)
- **API**: REST endpoint at `/swissarmyknife/profiler/stats` returns `.data.oom_stats`
- **Frontend**: Visual indicators, 💥 column, and dedicated OOM Analysis tab
- **Testing**: User-verified working with live OOM data from WanVideoSampler workflows

See [RESOURCE_MONITOR.md](RESOURCE_MONITOR.md) for complete implementation details.

## 📚 Related Documentation

- [Debug System](../infrastructure/debug/) - For widget debugging

---

**Category**: UI Components
**Status**: Active Development
