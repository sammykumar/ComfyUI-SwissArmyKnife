# Video Preview Progressive Loading Implementation

## Problem Statement

The Video Preview node displays three video inputs side-by-side:

- `reference_vid` - Usually available quickly (input video)
- `base_vid` - Takes time to generate (processed video)
- `upscaled_vid` - Takes 5+ minutes to generate (upscaled version)

Previously, the video preview widget would only update when the entire workflow completed, meaning users had to wait 5+ minutes to see any videos, even though `reference_vid` was available immediately.

## Solution

Implemented progressive video loading that displays videos as soon as they become available, rather than waiting for all three videos to complete.

### How It Works

1. **ComfyUI Execution Model**: ComfyUI executes nodes in topological order. When a node completes execution, it emits an `executed` event via the API with the node's output data.

2. **Event Listener**: The video preview widget now listens to ComfyUI's `executed` API events:

    ```javascript
    api.addEventListener('executed', progressHandler);
    ```

3. **Progressive Updates**: Each time the VideoPreview node executes (which happens whenever any of its inputs change), it:
    - Receives the current state of all video paths
    - Checks which videos have valid paths
    - Loads only the videos that are available
    - Leaves placeholders for videos that aren't ready yet

4. **Video Loading Helper**: Extracted the video loading logic into a reusable `loadVideoFromPath()` function that:
    - Parses video paths (handles JSON arrays, file paths, etc.)
    - Constructs proper `/api/view` URLs
    - Updates the video element and hides the placeholder
    - Autoplays newly loaded videos

### Code Structure

```javascript
// Helper function to load individual videos
const loadVideoFromPath = (inputName, videoPath, index) => {
    // Parse and validate video path
    // Construct video URL
    // Update DOM elements
    // Setup autoplay
};

// Original onExecuted handler (fallback)
this.onExecuted = function (message) { ... };

// New progressive loading handler
const progressHandler = (event) => {
    if (event.detail.node === this.id) {
        // Load videos as they become available
    }
};

// Register event listener
api.addEventListener("executed", progressHandler);

// Cleanup on node removal
this.onRemoved = function () {
    api.removeEventListener("executed", progressHandler);
};
```

### User Experience

**Before**:

- Wait 5+ minutes for entire workflow
- All videos appear at once at the end

**After**:

- `reference_vid` appears within seconds
- `base_vid` appears when processing completes (~1-2 mins)
- `upscaled_vid` appears when upscaling completes (~5+ mins)
- Users can start comparing videos immediately

### Event Handling Details

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

### Testing Scenarios

1. **All videos connected**: All three videos load progressively as they complete
2. **Partial connection**: Only connected videos load, others show placeholders
3. **Reconnection**: Changing video sources updates the appropriate preview
4. **Multiple VideoPreview nodes**: Each node has its own event handler with proper `this.id` checking

### Future Enhancements

Potential improvements for progressive loading:

1. **Loading Indicators**: Show a spinner or progress bar for videos that are still processing
2. **Estimated Time**: Display expected wait time for each video slot
3. **Status Messages**: Show text like "Processing...", "Upscaling...", etc.
4. **Cancellation**: Allow users to cancel long-running video generation
5. **Queue Position**: If using ComfyUI queue, show position in queue

### Related Files

- **JavaScript Widget**: `web/js/video_preview/video_preview.js`
- **Python Backend**: `nodes/utils/video_preview.py`
- **Documentation**: This file

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

## Implementation Date

October 2, 2025

## Related Issues

- Long wait times for video preview
- Poor UX when videos take 5+ minutes to generate
- Need for incremental feedback during workflow execution
