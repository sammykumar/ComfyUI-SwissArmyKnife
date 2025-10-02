# SuperLoraLoader Implementation Guide

## ⚠️ IMPORTANT: Correct Implementation Location

The SuperLoraLoader JavaScript implementation is **already complete** and located at:

```
web/js/lora_manager/extension.js  ✅ USE THIS FILE
```

**DO NOT** add SuperLoraLoader code to `web/js/swiss-army-knife.js` - that file is reserved for other Swiss Army Knife utilities only.

## Overview

The SuperLoraLoader system consists of two components working together:

### 1. Backend (Python) - `nodes/lora_manager/nd_super_lora_node.py`

Two node classes:

- **`SuperLoraLoader`**: Single-stream LoRA loader (one WANVIDLORA input/output)
- **`SuperDualLoraLoader`**: Dual-stream LoRA loader (separate high/low noise WANVIDLORA)

### 2. Frontend (JavaScript) - `web/js/lora_manager/extension.js`

Complete nd-super-nodes port (~7000+ lines) including:

- Full service architecture (LoraService, TemplateService, CivitAiService, etc.)
- Advanced widget system (SuperLoraHeaderWidget, SuperLoraWidget, SuperLoraTagWidget)
- Template system for saving/loading LoRA sets
- CivitAI integration for auto-fetching trigger words
- Tag organization system
- Node enhancer for other ComfyUI node types
- Advanced search overlays with folder filtering

## File Structure

```
ComfyUI-SwissArmyKnife/
├── nodes/lora_manager/
│   └── nd_super_lora_node.py           # Backend Python nodes ✅
│
├── web/js/
│   ├── lora_manager/
│   │   └── extension.js                # Complete frontend implementation ✅
│   │       ├── Services (~2000 lines)
│   │       ├── Widget Classes (~1500 lines)
│   │       ├── SuperLoraNode (~2500 lines)
│   │       └── Extension Registration
│   │
│   └── swiss-army-knife.js             # Other utilities (NOT for SuperLoraLoader) ❌
│
└── docs/
    └── SUPERLORA_IMPLEMENTATION_GUIDE.md  # This file
```

## Features

### SuperLoraLoader (Single-Stream)

**Inputs:**

- `lora`: WANVIDLORA (required) - Input LoRA stack
- `clip`: CLIP (optional) - CLIP model for text encoding
- `lora_bundle`: STRING (hidden) - Auto-generated JSON config

**Outputs:**

- `WANVIDLORA`: Modified LoRA stack with all enabled LoRAs applied
- `CLIP`: Modified CLIP (if provided)
- `STRING`: Combined trigger words from all enabled LoRAs

### SuperDualLoraLoader (Dual-Stream)

**Inputs:**

- `high_noise_lora`: WANVIDLORA (required) - High noise model LoRA stack
- `low_noise_lora`: WANVIDLORA (required) - Low noise model LoRA stack
- `clip`: CLIP (optional) - CLIP model for text encoding
- `lora_bundle`: STRING (hidden) - Auto-generated JSON config

**Outputs:**

- `high_noise_lora`: Modified high noise LoRA stack
- `low_noise_lora`: Modified low noise LoRA stack
- `CLIP`: Modified CLIP (if provided)
- `STRING`: Combined trigger words from all enabled LoRAs

### UI Features

1. **Header Controls**
    - Add LoRA button with advanced search overlay
    - Enable/Disable All toggle
    - Save Template (save current LoRA set)
    - Load Template (restore saved LoRA set)
    - Settings dialog

2. **Individual LoRA Widgets**
    - Enable/disable toggle
    - LoRA name with click-to-change selector
    - Strength sliders (separate model/clip or combined)
    - Trigger words with inline editing
    - CivitAI auto-fetch for trigger words
    - Tag assignment for organization
    - Move up/down arrows for reordering
    - Remove button

3. **Advanced Features**
    - Tag-based organization with collapsible sections
    - Template management for saving/loading LoRA sets
    - Search overlay with folder filtering
    - Automatic trigger word fetching from CivitAI
    - Settings persistence via LocalStorage## Data Flow

4. User adds LoRAs via the UI widget
5. Each LoRA is stored as a `SuperLoraWidget` with config:
    ```javascript
    {
      lora: "lora_filename.safetensors",
      enabled: true,
      strength: 1.0,
      strengthClip: 1.0,
      triggerWords: "trigger, words, here",
      tag: "Character",
      autoFetched: true
    }
    ```
6. On workflow save/execution, configs are bundled into JSON:
    ```javascript
    [
      { lora: "...", enabled: true, strength: 1.0, ... },
      { lora: "...", enabled: true, strength: 0.8, ... }
    ]
    ```
7. JSON string passed to backend via `lora_bundle` parameter
8. Backend Python applies each enabled LoRA sequentially
9. Returns modified model(s), clip, and combined trigger words

## Services (extension.js)

### LoraService

- Fetches available LoRA files from ComfyUI
- Manages LoRA configurations and validation
- Handles LoRA grouping and sorting

### TemplateService

- Save LoRA sets as named templates
- Load previously saved templates
- Template persistence via backend API
- Import/export template JSON

### CivitAiService

- Auto-fetch trigger words from CivitAI API
- Cache trigger words for performance
- Respect user preferences for auto-fetch

### TagSetService

- Manage tag definitions
- Tag CRUD operations
- LocalStorage persistence

### OverlayService

- Enhanced search overlays
- Folder filtering with chips
- Multi-select support
- Dual-panel selector (for SuperDualLoraLoader)

### FilePickerService

- Enhanced file selection for multiple types
- Caching for performance
- Global refresh hooks

## Usage Example

1. Add `SuperLoraLoader` node to workflow
2. Connect `lora` input from WanVideo Lora Select or compatible node
3. Optionally connect `clip` input
4. Click "Add LoRA" button in the node
5. Search and select LoRAs from the overlay
6. Adjust strengths and trigger words as needed
7. Enable/disable LoRAs as desired
8. Save as template for reuse (optional)
9. Connect outputs to downstream nodes

## Development Notes

- The extension is registered via `app.registerExtension()` in extension.js
- Both `SuperLoraLoader` and `SuperDualLoraLoader` node types are handled by the same `SuperLoraNode` class
- Custom widgets use canvas drawing for full UI control
- Mouse event handling is custom to support interactive controls
- Serialization/deserialization handles workflow persistence
- The system is fully compatible with ComfyUI's workflow save/load

## Testing Status

- [x] Backend Python implementation
- [x] Frontend JavaScript implementation
- [x] Single-stream loader (SuperLoraLoader)
- [x] Dual-stream loader (SuperDualLoraLoader)
- [x] All services and widgets
- [ ] Comprehensive testing against hosted ComfyUI server
- [ ] User documentation and tutorials

## References

- **Original Source**: https://github.com/HenkDz/nd-super-nodes
- **Backend**: `nodes/lora_manager/nd_super_lora_node.py`
- **Frontend**: `web/js/lora_manager/extension.js` ✅ **COMPLETE IMPLEMENTATION**
- **Other Utils**: `web/js/swiss-army-knife.js` (not for SuperLoraLoader)
