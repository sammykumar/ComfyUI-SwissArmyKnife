# Video Metadata Node Documentation

The Video Metadata node extracts, manipulates, and appends metadata to videos during processing.

## 📄 Documentation Files

### Core Implementation

- **[VIDEO_METADATA_NODE.md](VIDEO_METADATA_NODE.md)** - Main node implementation and features
- **[VIDEO_METADATA_JSON_INTEGRATION.md](VIDEO_METADATA_JSON_INTEGRATION.md)** - JSON metadata integration

### Features & Enhancements

- **[UPDATE_VIDEO_METADATA_APPEND_FUNCTIONALITY.md](UPDATE_VIDEO_METADATA_APPEND_FUNCTIONALITY.md)** - Metadata append and update functionality

### Integration & Compatibility

- **[VHS_VIDEOCOMBINE_COMPATIBILITY_FIX.md](VHS_VIDEOCOMBINE_COMPATIBILITY_FIX.md)** - Compatibility fixes with VHS VideoCombine nodes

## 🎯 Quick Reference

### Node Purpose

Extract and manipulate video metadata including:

- Resolution and dimensions
- Frame rate and duration
- Codec information
- Custom metadata fields
- Workflow integration data

### Key Features

- **Metadata Extraction**: Read metadata from video files
- **JSON Integration**: Export/import metadata as JSON
- **Append Functionality**: Add metadata to existing videos
- **VHS Compatibility**: Works seamlessly with VHS Video nodes

## 🔧 Technical Details

### Files

- **Python Backend**: `nodes/utils/video_metadata.py`
- **Metadata Format**: JSON-based metadata structure

### Metadata Structure

```json
{
    "width": 1080,
    "height": 1920,
    "fps": 30,
    "duration": 10.5,
    "codec": "h264",
    "custom_fields": {}
}
```

## 📚 Related Documentation

- [Video Preview Node](../video-preview/) - For displaying videos with metadata
- [Media Describe Node](../media-describe/) - For AI-generated video descriptions

---

**Node Type**: Utility/Metadata
**Category**: Video Processing
**Status**: Stable
