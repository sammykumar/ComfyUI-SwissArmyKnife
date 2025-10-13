# UI Widgets Documentation

Reusable UI components and custom widgets for ComfyUI-SwissArmyKnife nodes.

## 📄 Documentation Files

### Core Widgets

- **[CONTROL_PANEL.md](CONTROL_PANEL.md)** - Dashboard widget for monitoring and displaying workflow data
- **[DIMENSIONS_DISPLAY.md](DIMENSIONS_DISPLAY.md)** - Media dimension display widget with troubleshooting
- **[SEED_WIDGET.md](SEED_WIDGET.md)** - Randomization seed widget for reproducible workflows
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

## 📚 Related Documentation

- [Video Preview](../nodes/video-preview/) - Advanced widget example
- [LoRA Loader](../nodes/lora-loader/) - Complex UI implementation
- [Debug System](../infrastructure/debug/) - For widget debugging

---

**Category**: UI Components
**Status**: Active Development
