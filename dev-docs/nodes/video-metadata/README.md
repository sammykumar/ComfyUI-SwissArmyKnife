# Video Metadata Node Documentation

The Video Metadata node extracts, manipulates, and appends metadata to videos during processing.

## 📄 Documentation

- **[VIDEO_METADATA.md](VIDEO_METADATA.md)** - Complete documentation including append functionality, VHS compatibility, LoRA JSON integration, and troubleshooting

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

- [LM Studio Structured Describe Nodes](../lm-studio-describe/) - For AI-generated descriptions

---

**Node Type**: Utility/Metadata
**Category**: Video Processing
**Status**: Stable
