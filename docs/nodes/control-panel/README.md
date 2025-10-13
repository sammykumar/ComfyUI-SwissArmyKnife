# Control Panel Node Documentation

The Control Panel node is a display-only node that shows comprehensive workflow information from connected nodes.

## Documentation Files

### CONTROL_PANEL_DATA_POPULATION_DEBUG.md

**Enhanced debugging for data population issues**

Comprehensive guide to debugging Control Panel data flow from backend to frontend. Includes:

- Double output implementation (redundant data paths)
- Extensive console logging for both Python and JavaScript
- Step-by-step debugging workflow
- Common issues and solutions
- Testing procedures

**Use when**: Control Panel is not showing data or you need to trace data flow through the system.

**Date**: October 11, 2025
**Status**: ✅ Implemented

---

## Node Overview

### Purpose

The Control Panel node acts as a central dashboard that displays key workflow information in an organized, multi-column layout.

### Features

- **Display-only node** - No outputs, only visualizes data
- **Three-column layout**:
    - Left: Final Prompt/Description (full text)
    - Middle: Gemini Status (model, API key info, completion status)
    - Right: Media Info (media processing details, height, width only)
- **Accepts JSON data** via `all_media_describe_data` input
- **Auto-updates** on workflow execution
- **Clean display** - Shows only essential metadata, hides verbose fields like subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement

### Input

- `all_media_describe_data` (STRING, optional) - JSON string containing workflow data

### Output

None - display-only node

### Category

Swiss Army Knife 🔪/Utils

## Implementation Files

### Backend

- `nodes/utils/control_panel.py` - Python node implementation
    - Class: `ControlPanel`
    - Function: `display_info`
    - Returns: `{"ui": {"all_media_describe_data": [...]}}`

### Frontend

- `web/js/swiss-army-knife.js` - JavaScript widget implementation
    - Lines ~238-520: Control Panel node setup
    - Function: `updateControlPanelData` - Parses and displays data
    - Handler: `onExecuted` - Receives execution results

## Data Flow

```
Gemini Media Describe Node
    ↓
    all_media_describe_data (JSON string)
    ↓
Control Panel Node (Python)
    ↓
    {"ui": {"all_media_describe_data": [...]}}
    ↓
ComfyUI onExecuted Event
    ↓
    message.output.all_media_describe_data
    ↓
JavaScript updateControlPanelData()
    ↓
    Parse JSON → Extract fields → Update DOM
    ↓
Three-column display in UI
```

## Related Nodes

- **Gemini Media Describe** - Primary data source for Control Panel
- **Media Selection** - Provides media path information
- **Video Metadata** - Provides technical video details

## Known Issues

See `CONTROL_PANEL_DATA_POPULATION_DEBUG.md` for debugging data population issues.

## Future Enhancements

- [ ] Add configurable column layout
- [ ] Support custom field selection
- [ ] Add export functionality (copy to clipboard, save to file)
- [ ] Add collapsible sections for large datasets
- [ ] Add separate `CONTROL_PANEL_DEBUG` toggle independent of global DEBUG


---

**⚠️ CONSOLIDATION IN PROGRESS**: This node's documentation is currently split across multiple files and needs to be consolidated into a single comprehensive file. Please refer to individual files for now. See [video-preview](../video-preview/VIDEO_PREVIEW.md) and [video-metadata](../video-metadata/VIDEO_METADATA.md) for examples of consolidated documentation.
