# Video Preview Node

## Overview

The Video Preview node is a utility node that displays video inputs with an interactive preview widget. It accepts up to three optional IMAGE-type inputs for displaying reference, base, and upscaled videos, with a JavaScript widget that provides video playback controls similar to VHS nodes.

## Location

- **Python Backend**: `nodes/utils/video_preview.py`
- **JavaScript Widget**: `web/video_preview/video_preview.js`
- **Category**: Utils
- **Display Name**: 🎬 Video Preview

## Features

- **Multiple Video Inputs**: Accepts three optional IMAGE-type inputs
    - `reference_vid`: Reference video for comparison (currently displayed in widget)
    - `base_vid`: Base video input (planned)
    - `upscaled_vid`: Upscaled video for comparison (planned)
- **Interactive Video Widget**: JavaScript widget based on VHS implementation
    - Video playback with controls
    - Mute/unmute functionality
    - Show/hide preview options
    - Auto-sizing based on video aspect ratio
- **Flexible Connections**: All inputs are optional, allowing partial connections
- **Console Logging**: Logs connected inputs and their shapes to console
- **Output Node**: Configured as an OUTPUT_NODE for display in the ComfyUI interface

## Input Types

All inputs are optional IMAGE types:

```python
"optional": {
    "reference_vid": ("IMAGE", {
        "tooltip": "Reference video for comparison"
    }),
    "base_vid": ("IMAGE", {
        "tooltip": "Base video input"
    }),
    "upscaled_vid": ("IMAGE", {
        "tooltip": "Upscaled video for comparison"
    }),
}
```

## Usage

1. Add the Video Preview node to your ComfyUI workflow
2. Connect any combination of the three video inputs
3. The node will display information about connected inputs
4. Check the console for detailed logging including video shapes

## Implementation Details

### Node Configuration

- **Class**: `VideoPreview`
- **RETURN_TYPES**: `()` (no outputs - display-only)
- **FUNCTION**: `preview_videos`
- **OUTPUT_NODE**: `True` (enables UI display)
- **CATEGORY**: `Utils`

### Console Output

When executed, the node logs:

- A separator line for visual clarity
- Each connected input with its name and shape (if available)
- Connection status message

Example console output:

```
============================================================
VIDEO PREVIEW - Connected Inputs
============================================================
📹 reference_vid: Connected (shape: (30, 512, 512, 3))
📹 base_vid: Connected (shape: (30, 512, 512, 3))
📹 upscaled_vid: Connected (shape: (30, 1024, 1024, 3))

============================================================
```

### UI Data Format

Returns a dictionary with UI data for JavaScript widget display:

```python
{
    "ui": {
        "connected_inputs": ["reference_vid", "base_vid", "upscaled_vid"],
        "input_count": 3
    }
}
```

## Integration

The node is registered in `nodes/nodes.py`:

```python
from .utils.video_preview import VideoPreview

NODE_CLASS_MAPPINGS = {
    # ... other nodes
    "VideoPreview": VideoPreview
}

NODE_DISPLAY_NAME_MAPPINGS = {
    # ... other nodes
    "VideoPreview": "🎬 Video Preview"
}
```

## JavaScript Widget

The video preview widget is implemented in `web/video_preview/video_preview.js` following the VHS (VideoHelperSuite) pattern:

### Features

- **Video Element**: HTML5 video player with controls
- **Auto-sizing**: Widget height adjusts based on video aspect ratio
- **Mute Control**: Videos start muted, unmute on hover
- **Context Menu Integration**: Right-click menu options for:
    - Show/Hide preview
    - Mute/Unmute preview
- **Error Handling**: Gracefully handles missing or invalid video sources

### Widget Registration

```javascript
app.registerExtension({
    name: 'SwissArmyKnife.VideoPreview',
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData?.name === 'VideoPreview') {
            // Adds video preview widget
        }
    },
});
```

## Future Enhancements

Potential improvements for this node:

1. ✅ **JavaScript Widget**: Video preview widget implemented (October 2, 2025)
2. ✅ **Video Playback Controls**: HTML5 video controls enabled
3. **Multi-Video Display**: Show all three inputs (reference, base, upscaled) simultaneously
4. **Comparison Tools**: Implement A/B comparison sliders or split-screen views
5. **Metadata Display**: Show video dimensions, frame count, FPS, and duration
6. **Export Options**: Allow saving comparison screenshots or GIFs
7. **Configurable Layout**: Support different layout options (horizontal, vertical, grid)

## Testing

To verify the node works correctly:

```bash
# Activate virtual environment
source .venv/bin/activate

# Test Python import
python3 -c "from nodes.utils.video_preview import VideoPreview; print('✓ VideoPreview import successful')"

# Test node registration
python3 -c "from nodes.nodes import NODE_CLASS_MAPPINGS; print('✓ VideoPreview registered:', 'VideoPreview' in NODE_CLASS_MAPPINGS)"

# Run linting on Python
ruff check nodes/utils/video_preview.py

# Verify JavaScript file exists
ls -la web/video_preview/video_preview.js
```

## Usage Notes

1. **After Installation**: Restart the ComfyUI server for Python changes to take effect
2. **Browser Cache**: Refresh browser cache (Ctrl+Shift+R / Cmd+Shift+R) to load JavaScript widget
3. **Video Format**: Accepts IMAGE type inputs (video frames from ComfyUI nodes)
4. **Preview Display**: Video preview appears in the node after execution

## Related Files

- `nodes/utils/video_preview.py` - Python backend implementation
- `web/video_preview/video_preview.js` - JavaScript widget implementation
- `nodes/nodes.py` - Node registration and imports
- `docs/VIDEO_PREVIEW_NODE.md` - This documentation file

## Implementation Reference

The video preview widget implementation is based on:

- **VHS (VideoHelperSuite)**: https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite/blob/main/web/js/VHS.core.js
- **ComfyUI API**: Uses standard ComfyUI `addDOMWidget` and `api.apiURL` patterns

## Created

October 2, 2025

## Status

✅ **Implemented** - Backend node created and registered (October 2, 2025)
✅ **Implemented** - JavaScript video preview widget based on VHS (October 2, 2025)
⏳ **Pending** - Multi-video display for all three inputs
⏳ **Pending** - Advanced comparison tools and metadata display
