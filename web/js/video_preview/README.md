# Video Preview Widget

This directory contains the JavaScript implementation for the Video Preview custom node.

## Files

- **`video_preview.js`** - Main widget implementation for video preview functionality

## Purpose

The Video Preview widget provides an interactive HTML5 video player for ComfyUI workflows, similar to VHS (VideoHelperSuite) nodes. It displays video inputs with playback controls, auto-sizing, and mute/unmute functionality.

## Integration

This widget is automatically loaded by ComfyUI from the `web` directory structure. The widget registers itself for the `VideoPreview` node type defined in `nodes/utils/video_preview.py`.

## Key Features

- HTML5 video player with native controls
- Auto-sizing based on video aspect ratio
- Mute/unmute on hover
- Context menu options (Show/Hide, Mute/Unmute)
- Error handling for invalid sources

## Usage

No manual loading required - ComfyUI automatically discovers and loads all `.js` files in the `web` directory recursively.

## Development

When making changes to `video_preview.js`:

1. Edit the file
2. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
3. Reload ComfyUI in browser

No server restart is needed for JavaScript changes.

## References

- Python backend: `nodes/utils/video_preview.py`
- Documentation: `docs/VIDEO_PREVIEW_NODE.md`
- Based on: VHS (VideoHelperSuite) implementation
