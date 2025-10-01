# LoRA Manager Web Extension

This directory contains the web extension components for the LoRA Manager, providing the frontend UI for the Super LoRA Loader and enhanced file picker.

## Files

- **`extension.js`**: Main JavaScript extension implementing:
  - Super LoRA Loader UI with multi-LoRA management
  - Enhanced file picker overlay
  - Template management dialog
  - CivitAI integration for trigger words
  - Drag-and-drop LoRA reordering
  - Tag-based organization UI

## Features

### Super LoRA Loader UI

- Multi-LoRA management with enable/disable toggles
- Per-LoRA strength controls (model and CLIP)
- Trigger word display and editing
- Tag-based grouping with collapsible sections
- Duplicate detection
- Template save/load/delete operations

### Enhanced File Picker (ND Super Selector)

- Advanced file browser overlay
- Folder navigation with breadcrumbs
- Search functionality
- Multi-select support
- Per-node enable/disable via right-click menu
- Persistent settings across sessions
- Visual indicators (golden border, lightning icon ⚡)

### Supported Nodes for Enhanced Picker

- CheckpointLoader
- VAELoader
- LoraLoader
- UNETLoader
- CLIPLoader
- ControlNetLoader
- UpscaleModelLoader
- GGUF variants

## Loading

The web extension is automatically loaded by ComfyUI from the `web` directory. The JavaScript file registers itself with ComfyUI's extension system using:

```javascript
app.registerExtension({
    name: "comfyui_swissarmyknife.lora_manager",
    // ... extension implementation
});
```

## API Integration

The extension communicates with backend API endpoints:

- `/super_lora/loras` - Get available LoRAs
- `/super_lora/files` - List files in folders
- `/super_lora/templates` - Template operations
- `/super_lora/civitai_info` - Fetch CivitAI metadata

## Browser Compatibility

The extension uses modern JavaScript features and requires:
- ES6+ support
- Fetch API
- Promise support
- Local Storage

Tested with Chrome, Firefox, and Edge.

## Development

### Testing Changes

1. Make changes to `extension.js`
2. Refresh ComfyUI in browser (Ctrl+F5 / Cmd+Shift+R)
3. Check browser console for errors
4. Test node functionality in ComfyUI

### Debugging

Open browser developer tools and check:
- Console for JavaScript errors
- Network tab for API requests
- Application > Local Storage for persisted data

## Styling

Custom styles are loaded from `web/css/lora_manager/style.css` and provide:
- LoRA list styling
- Enhanced file picker overlay
- Template dialog
- Tag headers and collapsible sections
- Enable/disable toggle styling
- Strength slider styling

## Credits

Original implementation from nd-super-nodes by HenkDz.
Integrated into ComfyUI-SwissArmyKnife with minimal modifications.
