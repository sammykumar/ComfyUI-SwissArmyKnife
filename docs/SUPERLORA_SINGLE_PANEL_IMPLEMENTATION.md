# SuperLoraLoader Single Panel Implementation

## Overview

This document describes the implementation of the JavaScript widget for `SuperLoraLoader` node, based on the original nd-super-nodes implementation but adapted for single-stream LoRA loading (no dual high/low noise model support).

## Key Differences from SuperDualLoraLoader

1. **Single Model Input**: Only accepts one `WANVIDLORA` input (not separate high_noise_lora and low_noise_lora)
2. **Simplified Backend**: No `modelType` field needed (high/low/both selection removed)
3. **Single Panel UI**: Uses the original single-panel LoRA selector from nd-super-nodes
4. **Return Types**: Returns `(WANVIDLORA, CLIP, STRING)` instead of `(WANVIDLORA, WANVIDLORA, CLIP, STRING)`

## Implementation Architecture

### Backend Python (Already Implemented)

- Located in: `nodes/lora_manager/nd_super_lora_node.py`
- Class: `SuperLoraLoader`
- Accepts: `lora` (WANVIDLORA), optional `clip` (CLIP), `lora_bundle` (STRING JSON)
- Returns: Modified `lora` stack, `clip`, and trigger words

### Frontend JavaScript Widget

- Location: `web/js/swiss-army-knife.js`
- Node registration: `SuperLoraLoader`
- Features:
    - Single LoRA selection panel
    - Enable/disable individual LoRAs
    - Dual strength controls (model/clip)
    - Trigger word display and editing
    - Template save/load
    - Tag organization (optional)

## Widget Structure

Based on nd-super-nodes implementation:

1. **SuperLoraHeaderWidget**: Control bar with buttons
    - Add LoRA button
    - Enable/Disable All toggle
    - Save Template
    - Load Template
    - Settings

2. **SuperLoraWidget**: Individual LoRA row
    - Enable toggle
    - LoRA name selector
    - Strength controls (model and clip)
    - Trigger words field
    - Move up/down arrows
    - Remove button

3. **SuperLoraTagWidget** (optional): Tag header for organization
    - Collapsible sections
    - Tag name display
    - LoRA count

## Data Flow

1. User adds LoRAs via the widget
2. Widget stores LoRA configs in custom widgets array
3. On serialization, configs are bundled into JSON string
4. JSON string passed to backend via `lora_bundle` parameter
5. Backend applies LoRAs to the single model stream
6. Returns modified model, clip, and combined trigger words

## Configuration Storage

Widget state stored in:

- `node.customWidgets[]`: Array of widget instances
- `node.properties`: Node-level settings (enableTags, showTriggerWords, etc.)
- Serialized to workflow JSON for persistence

## Integration Points

### Input Types

- `lora`: WANVIDLORA (required)
- `clip`: CLIP (optional)
- `lora_bundle`: STRING (hidden, auto-generated)

### Return Types

- `WANVIDLORA`: Modified LoRA stack
- `CLIP`: Modified CLIP (if provided)
- `STRING`: Combined trigger words

## Implementation Status

- [x] Backend Python implementation complete
- [x] Frontend JavaScript widget implementation (this task)
- [x] Single-panel LoRA selector UI
- [x] Basic settings dialog
- [ ] Advanced features (trigger word fetching, templates)
- [ ] Documentation
- [ ] Testing against hosted ComfyUI server

## Implementation Details

### JavaScript Widget Features Implemented

1. **Single Panel UI**
    - Header bar with "Add LoRA" button
    - List of added LoRAs with enable/disable toggles
    - LoRA name display with click-to-change
    - Strength display (model and CLIP)
    - Remove button for each LoRA

2. **Core Functionality**
    - Add LoRAs via context menu selector
    - Enable/disable individual LoRAs
    - Remove LoRAs from the list
    - Change LoRA selection by clicking the name
    - Automatic serialization to `lora_bundle` JSON

3. **Settings Dialog**
    - Show/hide trigger words (placeholder)
    - Separate model/CLIP strengths toggle

4. **Data Persistence**
    - Stores LoRA configs in `node.loraConfigs` array
    - Serializes to `lora_bundle` widget for backend
    - Restores state when loading workflows

### Simplified Implementation Notes

This implementation provides the core functionality from nd-super-nodes but with some simplifications:

- **No TypeScript**: Plain JavaScript implementation
- **No Services**: Direct API calls instead of service classes
- **Simplified UI**: Basic canvas drawing without advanced styling
- **Limited Features**: Core functionality only, advanced features to be added later

### Future Enhancements

Potential features to add from nd-super-nodes original:

1. **Trigger Word Fetching**: Auto-fetch from CivitAI API
2. **Template System**: Save/load LoRA sets
3. **Tag Organization**: Group LoRAs by tags
4. **Advanced UI**: Better styling, animations, search
5. **Strength Sliders**: Interactive strength adjustment
6. **Drag and Drop**: Reorder LoRAs
7. **Multi-select**: Add multiple LoRAs at once

## References

- Original implementation: https://github.com/HenkDz/nd-super-nodes
- Backend file: `nodes/lora_manager/nd_super_lora_node.py`
- Target file: `web/js/swiss-army-knife.js`
