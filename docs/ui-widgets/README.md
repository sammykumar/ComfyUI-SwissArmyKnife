# UI Widgets Documentation

Reusable UI components and custom widgets for ComfyUI-SwissArmyKnife nodes.

## 📄 Documentation Files

### Control Panels

- **[CONTROL_PANEL_IMPLEMENTATION.md](CONTROL_PANEL_IMPLEMENTATION.md)** - Main control panel implementation
- **[CONTROL_PANEL_JSON_DATA_FIX.md](CONTROL_PANEL_JSON_DATA_FIX.md)** - JSON data handling fixes

### Dimension Display

- **[DIMENSIONS_DISPLAY_WIDGET.md](DIMENSIONS_DISPLAY_WIDGET.md)** - Dimension display widget implementation
- **[DIMENSIONS_DISPLAY_TROUBLESHOOTING.md](DIMENSIONS_DISPLAY_TROUBLESHOOTING.md)** - Troubleshooting dimension display issues

### Seed Widget

- **[SEED_WIDGET_IMPLEMENTATION.md](SEED_WIDGET_IMPLEMENTATION.md)** - Seed randomization widget
- **[SEED_WIDGET_RANDOMIZATION_FIX.md](SEED_WIDGET_RANDOMIZATION_FIX.md)** - Seed randomization fixes

### General Widgets

- **[FINAL_STRING_WIDGET_FIX.md](FINAL_STRING_WIDGET_FIX.md)** - String widget fixes
- **[WIDGET_INVESTIGATION_AND_FIXES.md](WIDGET_INVESTIGATION_AND_FIXES.md)** - General widget investigations
- **[WIDGET_STATE_PERSISTENCE_FIX.md](WIDGET_STATE_PERSISTENCE_FIX.md)** - Widget state persistence

## 🎯 Widget Types

### Control Panel

- Multi-option configuration interface
- JSON data handling
- Dynamic option visibility
- Workflow serialization

### Dimension Display

- Width/height display
- Aspect ratio calculation
- Resolution presets
- Responsive updates

### Seed Widget

- Random seed generation
- Seed value persistence
- Lock/unlock functionality
- Workflow integration

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

## 📚 Related Documentation

- [Video Preview](../nodes/video-preview/) - Advanced widget example
- [LoRA Loader](../nodes/lora-loader/) - Complex UI implementation
- [Debug System](../infrastructure/debug/) - For widget debugging

---

**Category**: UI Components
**Status**: Active Development
