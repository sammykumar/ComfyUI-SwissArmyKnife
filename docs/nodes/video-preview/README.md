# Video Preview Node Documentation

The Video Preview node displays multiple video inputs side-by-side for easy comparison during workflow execution.

## 📄 Documentation Files

### Core Implementation

- **[VIDEO_PREVIEW_NODE.md](VIDEO_PREVIEW_NODE.md)** - Main node implementation and architecture
- **[VIDEO_PREVIEW_IMPLEMENTATION_SUMMARY.md](VIDEO_PREVIEW_IMPLEMENTATION_SUMMARY.md)** - Implementation overview and design decisions
- **[VIDEO_PREVIEW_JS_MIGRATION.md](VIDEO_PREVIEW_JS_MIGRATION.md)** - Migration from React to plain JavaScript

### Features

- **[VIDEO_PREVIEW_PROGRESSIVE_LOADING.md](VIDEO_PREVIEW_PROGRESSIVE_LOADING.md)** - Progressive video loading as videos become available (not waiting for all videos to complete)

### Bug Fixes & Troubleshooting

- **[VIDEO_PREVIEW_TYPEERROR_FIX.md](VIDEO_PREVIEW_TYPEERROR_FIX.md)** - TypeError resolution and fixes
- **[CLEAR_VIDEO_PREVIEW_FUNCTION_ORDER_FIX.md](CLEAR_VIDEO_PREVIEW_FUNCTION_ORDER_FIX.md)** - Function execution order fixes

## 🎯 Quick Reference

### Node Inputs

- `reference_vid` - Reference video for comparison (typically the source)
- `base_vid` - Base processed video
- `upscaled_vid` - Upscaled version of the video

### Key Features

- **Side-by-Side Comparison**: Display up to 3 videos simultaneously in 9:16 aspect ratio
- **Progressive Loading**: Videos load as soon as they're available (reference → base → upscaled)
- **Media Controls**: Play/pause all, sync timelines, mute/unmute
- **Timeline Scrubber**: Seek through all videos simultaneously
- **Auto-play**: Videos start playing automatically when loaded

### Usage

1. Connect video output nodes to the Video Preview inputs
2. Videos appear progressively as they're generated
3. Use media controls to compare videos
4. Scrub timeline to see specific moments across all videos

## 🔧 Technical Details

### Files

- **Python Backend**: `nodes/utils/video_preview.py`
- **JavaScript Widget**: `web/js/video_preview/video_preview.js`
- **CSS Styles**: Inline styles in JavaScript widget

### Progressive Loading

Videos load incrementally:

- `reference_vid`: Appears within seconds (input video)
- `base_vid`: Appears after processing (~1-2 minutes)
- `upscaled_vid`: Appears after upscaling (~5+ minutes)

This prevents users from waiting 5+ minutes to see any results.

### Event System

Uses ComfyUI's `executed` API event to receive progressive updates:

```javascript
api.addEventListener('executed', progressHandler);
```

## 🐛 Common Issues

1. **Videos not loading**: Check that video paths are valid and accessible
2. **Sync issues**: Use the "Sync" button to synchronize all video timelines
3. **Autoplay blocked**: Some browsers block autoplay - manually click play
4. **Performance**: Large videos may cause lag - consider reducing resolution

## 📚 Related Documentation

- [Video Metadata Node](../video-metadata/) - For extracting video metadata
- [Media Describe Node](../media-describe/) - For AI-powered video analysis
- [Debug System](../../infrastructure/debug/) - For troubleshooting issues

## 🔄 Recent Updates

- **October 2, 2025**: Added progressive loading support
- **Earlier**: Migrated from React to plain JavaScript for better compatibility

---

**Node Type**: Display/Preview
**Category**: Utils
**Status**: Active Development
