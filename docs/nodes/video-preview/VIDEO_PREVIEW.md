# Video Preview Node

**Last Updated:** October 13, 2025  
**Node Type:** Display/Preview  
**Category:** Utils  
**Status:** Active Development

## Overview

The Video Preview node displays video inputs with an interactive preview widget. It accepts up to three optional IMAGE-type inputs for displaying reference, base, and upscaled videos side-by-side with playback controls.

## Table of Contents

- [Features](#features)
- [Node Configuration](#node-configuration)
- [Usage](#usage)
- [Progressive Loading](#progressive-loading)
- [JavaScript Widget](#javascript-widget)
- [Implementation Details](#implementation-details)
- [Bug Fixes & Troubleshooting](#bug-fixes--troubleshooting)
- [Testing](#testing)
- [Related Documentation](#related-documentation)

## Features

### Multiple Video Inputs
- **`reference_vid`**: Reference video for comparison (typically the source)
- **`base_vid`**: Base processed video
- **`upscaled_vid`**: Upscaled version of the video
- All inputs are optional, allowing partial connections

### Interactive Video Widget
- HTML5 video player with standard controls
- Play/pause all, sync timelines, mute/unmute
- Timeline scrubber for seeking through all videos simultaneously
- Auto-play when videos load
- Auto-sizing based on video aspect ratio
- Show/hide preview options
- Context menu integration

### Progressive Loading
Videos load incrementally as they become available:
- `reference_vid`: Appears within seconds (input video)
- `base_vid`: Appears after processing (~1-2 minutes)
- `upscaled_vid`: Appears after upscaling (~5+ minutes)

This prevents users from waiting for all videos to complete before seeing any results.

### Display Features
- Side-by-side comparison of up to 3 videos in 9:16 aspect ratio
- Console logging of connected inputs and their shapes
- Configured as OUTPUT_NODE for display in ComfyUI interface

## Node Configuration

### Location
- **Python Backend**: `nodes/utils/video_preview.py`
- **JavaScript Widget**: `web/video_preview/video_preview.js`
- **Category**: Utils
- **Display Name**: 🎬 Video Preview

### Input Types

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

### Python Configuration

```python
class VideoPreview:
    RETURN_TYPES = ()  # No outputs - display-only
    FUNCTION = "preview_videos"
    CATEGORY = "Utils"
    OUTPUT_NODE = True  # Enables UI display
```

### UI Data Format

Returns a dictionary with UI data for JavaScript widget display:

```python
{
    "ui": {
        "connected_inputs": [["reference_vid", "base_vid", "upscaled_vid"]],
        "input_count": [3]
    }
}
```

**Important:** All values in the `ui` dictionary must be wrapped in lists to comply with ComfyUI's execution requirements.

## Usage

1. Add the Video Preview node to your ComfyUI workflow
2. Connect any combination of the three video inputs
3. Videos appear progressively as they're generated
4. Use media controls to compare videos
5. Scrub timeline to see specific moments across all videos

### Console Output

When executed, the node logs:

```
============================================================
VIDEO PREVIEW - Connected Inputs
============================================================
📹 reference_vid: Connected (shape: (30, 512, 512, 3))
📹 base_vid: Connected (shape: (30, 512, 512, 3))
📹 upscaled_vid: Connected (shape: (30, 1024, 1024, 3))

============================================================
```

## Progressive Loading

### How It Works

1. **ComfyUI Execution Model**: ComfyUI executes nodes in topological order and emits an `executed` event when a node completes.

2. **Event Listener**: The video preview widget listens to ComfyUI's `executed` API events:
   ```javascript
   api.addEventListener('executed', progressHandler);
   ```

3. **Progressive Updates**: Each time the VideoPreview node executes, it:
   - Receives the current state of all video paths
   - Checks which videos have valid paths
   - Loads only the videos that are available
   - Leaves placeholders for videos that aren't ready yet

4. **Video Loading Helper**: The `loadVideoFromPath()` function:
   - Parses video paths (handles JSON arrays, file paths, etc.)
   - Constructs proper `/api/view` URLs
   - Updates the video element and hides the placeholder
   - Autoplays newly loaded videos

### User Experience

**Before Progressive Loading:**
- Wait 5+ minutes for entire workflow
- All videos appear at once at the end

**After Progressive Loading:**
- `reference_vid` appears within seconds
- `base_vid` appears when processing completes (~1-2 mins)
- `upscaled_vid` appears when upscaling completes (~5+ mins)
- Users can start comparing videos immediately

### Event Handling

The `executed` event contains:

```javascript
{
    node: "node_id",
    output: {
        video_paths: [{
            reference_vid: "/path/to/video.mp4",
            base_vid: "/path/to/base.mp4",
            upscaled_vid: "/path/to/upscaled.mp4"
        }]
    }
}
```

The handler:
1. Checks if the event is for this VideoPreview node (`node === this.id`)
2. Extracts the `video_paths` object
3. Iterates through each video input
4. Loads any videos with valid paths
5. Skips videos that don't have paths yet

### Memory and Performance

- **Event Cleanup**: Properly removes event listeners when the node is destroyed to prevent memory leaks
- **Idempotent Loading**: Loading the same video path multiple times is safe - the browser caches the video
- **No Polling**: Uses event-driven architecture, not polling, for efficiency

## JavaScript Widget

The video preview widget is located in `web/video_preview/video_preview.js` and follows the VHS (VideoHelperSuite) pattern.

### Features

- **Video Element**: HTML5 video player with controls
- **Auto-sizing**: Widget height adjusts based on video aspect ratio
- **Mute Control**: Videos start muted, unmute on hover
- **Context Menu Integration**: Right-click menu options for show/hide and mute/unmute
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

### Directory Structure Migration

The widget was organized into a dedicated directory for better organization:

**Before:**
```
web/js/video_preview.js
```

**After:**
```
web/video_preview/
├── README.md
└── video_preview.js
```

Import paths were updated accordingly:
```javascript
import { app } from '../../../scripts/app.js';
import { api } from '../../../scripts/api.js';
```

ComfyUI automatically loads JavaScript files from the `WEB_DIRECTORY` recursively, so no changes to `__init__.py` were needed.

## Implementation Details

### Node Registration

The node is registered in `nodes/nodes.py`:

```python
from .utils.video_preview import VideoPreview

NODE_CLASS_MAPPINGS = {
    "VideoPreview": VideoPreview
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "VideoPreview": "🎬 Video Preview"
}
```

### API Dependencies

This implementation relies on:
- ComfyUI's `/scripts/api.js` - Provides the `api` object and event system
- ComfyUI's `executed` event - Fired when any node completes execution
- ComfyUI's `/api/view` endpoint - Serves video files for browser playback

### Debugging

Enable debug mode to see progressive loading in action:

1. Set `DEBUG_ENABLED = true` in ComfyUI-SwissArmyKnife config
2. Watch browser console for:
   - `[VideoPreview] progress event:` - Shows when events arrive
   - `[VideoPreview] progress - Loading videos as they become available:` - Shows which videos are being loaded
   - `[VideoPreview] Loaded <inputName>:` - Shows successful video loads

## Bug Fixes & Troubleshooting

### TypeError: 'int' object is not iterable

**Issue:** The workflow failed with `TypeError: 'int' object is not iterable` in ComfyUI's execution.py.

**Root Cause:** ComfyUI expects all values in the `ui` dictionary to be lists.

**Fix:** Wrap all return values in lists:

```python
# ❌ Wrong
return {
    "ui": {
        "connected_inputs": connected_inputs,  # List ✓
        "input_count": len(connected_inputs)   # Int ✗
    }
}

# ✅ Correct
return {
    "ui": {
        "connected_inputs": [connected_inputs],  # List wrapped in list
        "input_count": [len(connected_inputs)]   # Int wrapped in list
    }
}
```

**Key Lesson:** When returning data from an OUTPUT_NODE in the `ui` dictionary:
- ✅ All values MUST be lists
- ✅ Even single integers, strings, or booleans must be wrapped: `[value]`
- ✅ Lists should be wrapped in another list: `[my_list]`

### clearVideoPreview Function Order Error

**Issue:** JavaScript error `this.clearVideoPreview is not a function` when adding nodes.

**Root Cause:** Function definition order problem - `clearVideoPreview()` was called before it was defined.

**Fix:** Move `clearVideoPreview()` definition to be defined before it's called by `clearAllMediaState()`.

### Common Issues

1. **Videos not loading**: Check that video paths are valid and accessible
2. **Sync issues**: Use the "Sync" button to synchronize all video timelines
3. **Autoplay blocked**: Some browsers block autoplay - manually click play
4. **Performance**: Large videos may cause lag - consider reducing resolution

## Testing

### Python Backend Testing

```bash
# Activate virtual environment
source .venv/bin/activate

# Test Python import
python3 -c "from nodes.utils.video_preview import VideoPreview; print('✓ VideoPreview import successful')"

# Test node registration
python3 -c "from nodes.nodes import NODE_CLASS_MAPPINGS; print('✓ VideoPreview registered:', 'VideoPreview' in NODE_CLASS_MAPPINGS)"

# Run linting on Python
ruff check nodes/utils/video_preview.py
```

### JavaScript Widget Testing

```bash
# Verify JavaScript file exists
ls -la web/video_preview/video_preview.js

# Verify JavaScript syntax
node --check web/video_preview/video_preview.js
```

### Integration Testing

1. **Restart ComfyUI server** (required for Python changes)
2. **Refresh browser cache** (Ctrl+Shift+R / Cmd+Shift+R) for JavaScript changes
3. **Load a workflow** with the VideoPreview node
4. **Verify** the video preview widget appears and functions correctly

### Testing Scenarios

1. **All videos connected**: All three videos load progressively as they complete
2. **Partial connection**: Only connected videos load, others show placeholders
3. **Reconnection**: Changing video sources updates the appropriate preview
4. **Multiple VideoPreview nodes**: Each node has its own event handler with proper `this.id` checking

## Future Enhancements

1. ✅ **JavaScript Widget**: Video preview widget implemented
2. ✅ **Video Playback Controls**: HTML5 video controls enabled
3. ✅ **Progressive Loading**: Implemented
4. **Multi-Video Display**: Show all three inputs simultaneously (currently single video)
5. **Comparison Tools**: Implement A/B comparison sliders or split-screen views
6. **Metadata Display**: Show video dimensions, frame count, FPS, and duration
7. **Export Options**: Allow saving comparison screenshots or GIFs
8. **Configurable Layout**: Support different layout options (horizontal, vertical, grid)
9. **Loading Indicators**: Show spinner or progress bar for videos still processing
10. **Estimated Time**: Display expected wait time for each video slot
11. **Status Messages**: Show text like "Processing...", "Upscaling...", etc.

## Related Documentation

- [Video Metadata Node](../video-metadata/VIDEO_METADATA.md) - For extracting video metadata
- [Media Describe Node](../media-describe/MEDIA_DESCRIBE.md) - For AI-powered video analysis
- [Debug System](../../infrastructure/debug/) - For troubleshooting issues

## References

- **VHS Implementation**: https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite/blob/main/web/js/VHS.core.js
- **ComfyUI Docs**: https://docs.comfy.org/custom-nodes/js/javascript_overview
- **ComfyUI Backend**: https://docs.comfy.org/custom-nodes/backend/server_overview

---

**Implementation Complete** ✅  
The Video Preview node is fully functional with both Python backend and JavaScript widget components.
