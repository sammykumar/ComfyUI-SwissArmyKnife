# Update Video Metadata Node

**Last Updated:** October 13, 2025  
**Node Type:** Metadata Processor  
**Category:** Utils  
**Display Name:** Update Video Metadata  
**Status:** Active Development

## Overview

The Update Video Metadata node enables adding and appending metadata to video files using FFmpeg. It's designed to work seamlessly with the VHS_VideoCombine node and other video processing nodes in ComfyUI workflows. The node **appends to existing metadata** instead of overwriting it, ensuring that existing metadata in video files is preserved while adding new information.

## Table of Contents

- [Features](#features)
- [Input Parameters](#input-parameters)
- [Usage Examples](#usage-examples)
- [Metadata Appending Behavior](#metadata-appending-behavior)
- [LoRA JSON Integration](#lora-json-integration)
- [VHS VideoCombine Compatibility](#vhs-videocombine-compatibility)
- [Technical Implementation](#technical-implementation)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## Features

- **FFmpeg-based metadata injection**: Uses FFmpeg's `-metadata` option for reliable metadata embedding
- **Append mode**: Preserves existing metadata while adding new information
- **Chain-friendly design**: Takes filename input and outputs filename for workflow chaining
- **Non-destructive option**: Can create new files with metadata instead of overwriting originals
- **Copy-only processing**: Uses stream copying to avoid re-encoding (fast and lossless)
- **Multiple metadata fields**: Supports artist, comment, title, description, keywords
- **LoRA JSON integration**: Automatically extracts metadata from LoRA JSON data
- **VHS_FILENAMES type support**: Direct compatibility with VHS VideoCombine node

## Input Parameters

### Required

- **filenames**: (VHS_FILENAMES, forceInput) - Video filenames from VHS_VideoCombine or other video output nodes
  - Supports single string filename
  - Supports list with single file (extracts first)
  - Supports list with multiple files (processes first file only)

### Optional

- **artist**: (STRING) - Artist/Creator metadata
- **comment**: (STRING, multiline) - Additional comments metadata
- **overwrite_original**: (Yes/No) - Whether to overwrite the original file or create a new one with '_metadata' suffix

## Output

- **filenames**: (VHS_FILENAMES) - Output filenames (original or new file with metadata)

## Usage Examples

### Basic Usage with VHS_VideoCombine

```
[Video Processing] → [VHS_VideoCombine] → [Update Video Metadata] → [Output]
                                                    ↑
                                          [artist, comment]
```

1. Connect the `Filenames` output from VHS_VideoCombine to the `filenames` input
2. Optionally add artist and comment metadata
3. Choose whether to overwrite original or create new file
4. The output `filenames` can be connected to other nodes or used as final output

### Multi-Stage Processing

```
[VHS_VideoCombine] → [Update Video Metadata] → [Update Video Metadata] → [Output]
                              ↑                        ↑
                        [Artist info]          [LoRA info]
```

Multiple Update Video Metadata nodes can be chained to add metadata in stages. Each stage appends to existing metadata.

## Metadata Appending Behavior

The node **appends** new metadata to existing metadata instead of overwriting it.

### Example: Adding LoRA Info to Video with Existing Metadata

**Input Video Metadata:**
```
title: "Character Animation"
description: "Fantasy character design"
artist: "Original Creator"
```

**Node Parameters:**
```
lora_json: {"combined_display": "Style + Detail LoRAs", ...}
```

**Output Video Metadata:**
```
title: "Character Animation

Style + Detail LoRAs"

description: "Fantasy character design

LoRA Information:
• Local: Style LoRA (strength: 0.8)
• Local: Detail LoRA (strength: 0.6)"

artist: "Original Creator"
keywords: "LoRA: Style, Detail"
lora_json: "{...full LoRA JSON...}"
```

### Metadata Combination Rules

- **Title, Description, Comment**: Separated with double newlines (`\n\n`) for readability
- **Artist**: Appended with double newlines
- **Keywords**: Comma-separated for better keyword handling

## VHS VideoCombine Compatibility

The node uses `VHS_FILENAMES` type for full compatibility with the VHS (VideoHelperSuite) ecosystem.

### Type Compatibility

```python
# VHS VideoCombine Output
class VideoCombineNode:
    RETURN_TYPES = ("VHS_FILENAMES",)
    RETURN_NAMES = ("Filenames",)

# Update Video Metadata Input/Output
class VideoMetadataNode:
    INPUT_TYPES = {
        "required": {
            "filenames": ("VHS_FILENAMES", {"forceInput": True})
        }
    }
    RETURN_TYPES = ("VHS_FILENAMES",)
```

### Input Format Support

| Input Format             | Support | Behavior                   |
| ------------------------ | ------- | -------------------------- |
| Single string filename   | ✅      | Direct processing          |
| List with single file    | ✅      | Extract first file         |
| List with multiple files | ✅      | Process first file only    |
| Empty/invalid input      | ❌      | Error with helpful message |

### Processing Logic

```python
# Flexible input handling
if isinstance(filenames, list) and len(filenames) > 0:
    filename = filenames[0]  # Use first file if multiple
elif isinstance(filenames, str):
    filename = filenames  # Direct string filename
else:
    raise Exception(f"Invalid filenames input: {filenames}")
```

## Technical Implementation

### FFmpeg Command Structure

The node constructs FFmpeg commands like:

```bash
# Basic metadata with appending
ffmpeg -i input.mp4 -c copy \
  -metadata artist="Original Creator

AI Creator Studio" \
  -metadata comment="Original notes

Additional production info" \
  output.mp4

# With LoRA JSON data (automatically generated and appended)
ffmpeg -i input.mp4 -c copy \
  -metadata title="Original Title

LoRA1 + LoRA2" \
  -metadata description="Original description

LoRA Information:
• CivitAI: LoRA1 by Creator1
• Local: LoRA2 (strength: 0.8)" \
  -metadata keywords="original, keywords, LoRA: LoRA1, LoRA2" \
  -metadata lora_json='{"loras":[...],"count":2,"combined_display":"LoRA1 + LoRA2"}' \
  output.mp4
```

### Helper Methods

#### `_get_existing_metadata(filename)`

Reads existing metadata from video file using ffprobe:

```python
def _get_existing_metadata(self, filename):
    """Read existing metadata from video file using ffprobe."""
    cmd = [
        'ffprobe', '-v', 'quiet', '-print_format', 'json',
        '-show_format', filename
    ]
    # Extracts existing metadata tags
    # Returns dictionary of existing metadata fields
    # Gracefully handles missing files or invalid metadata
```

#### `_combine_metadata_field(existing, new)`

Combines existing and new metadata content:

```python
def _combine_metadata_field(self, existing, new):
    """Combine existing metadata field with new content."""
    if not existing:
        return new
    if not new:
        return existing
    # Separates content with double newlines for readability
    return f"{existing}\n\n{new}"
```

### Key Design Decisions

1. **Stream Copying (-c copy)**: Avoids re-encoding for speed and quality preservation
2. **Conditional Metadata**: Only adds metadata fields that have content
3. **Safe Overwriting**: Uses temporary files when overwriting to prevent corruption
4. **Error Handling**: Comprehensive error handling for file operations and FFmpeg execution
5. **Metadata Preservation**: Reads existing metadata before writing to preserve it

### File Handling

- **Overwrite Mode**: Creates temporary file, then replaces original
- **New File Mode**: Creates new file with `_metadata` suffix
- **Validation**: Checks input file existence before processing
- **Cleanup**: Removes temporary files on error

## Error Handling

The node handles several error conditions:

### Missing Input File

```python
if not os.path.exists(filename):
    raise Exception(f"Input video file not found: {filename}")
```

### Metadata Reading Failures

```python
# Returns empty dict if metadata can't be read
except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
    return {}  # Fresh metadata will be created
```

### FFmpeg Execution Errors

```python
# Clear error messages for FFmpeg issues
except subprocess.CalledProcessError as e:
    raise Exception(f"FFmpeg metadata operation failed: {e.stderr}")
```

### Invalid Input Type

```python
# Handles various input formats gracefully
if isinstance(filenames, list) and len(filenames) > 0:
    filename = filenames[0]
elif isinstance(filenames, str):
    filename = filenames
else:
    raise Exception(f"Invalid filenames input: {filenames}")
```

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: 
   - Ensure FFmpeg is installed and in PATH
   - Verify with: `ffmpeg -version`

2. **Permission denied**: 
   - Check file permissions for input/output files
   - Ensure write permissions in output directory

3. **Unsupported format**: 
   - Verify video format is supported by FFmpeg
   - Test with common formats: MP4, MOV, MKV, WebM

4. **Disk space**: 
   - Ensure sufficient space for output files
   - Especially important when not overwriting originals

5. **Type mismatch error**:
   - Ensure using VHS_FILENAMES type from VHS VideoCombine
   - Check that input is properly connected

### Debug Information

The node outputs success messages and detailed error information:
- FFmpeg command being executed
- Input/output file paths
- Metadata being added
- Error messages with stderr output

## Benefits

### Data Preservation

- ✅ Existing metadata is never lost
- ✅ Multiple processing passes accumulate information
- ✅ Original authorship and descriptions preserved

### Enhanced Workflow Support

- ✅ Can process videos through multiple metadata nodes
- ✅ Different stages can add different types of metadata
- ✅ Supports iterative workflow development

### Better Organization

- ✅ Clear separation between different metadata sources
- ✅ Readable formatting with double newlines
- ✅ Keywords properly comma-separated

### Backward Compatibility

- ✅ Works with videos that have no existing metadata
- ✅ Graceful handling of missing or corrupt metadata
- ✅ Compatible with VHS VideoCombine and custom nodes

## Compatibility

### Video Formats

Supports all video formats that FFmpeg can handle:
- MP4, MOV, AVI, MKV, WebM, FLV, etc.

### Metadata Standards

- Uses standard metadata keys compatible with most video players
- Follows FFmpeg metadata conventions
- Compatible with QuickTime, MP4, and MKV metadata standards

### ComfyUI Integration

- Compatible with ComfyUI's type system (VHS_FILENAMES)
- Works with VHS node suite and other video processing nodes
- Supports workflow chaining and multi-stage processing

## Performance Considerations

- **No Re-encoding**: Uses stream copying for maximum speed
- **Minimal Memory Usage**: FFmpeg handles file processing efficiently
- **Batch Processing**: Can be used in loops for multiple files
- **Fast Metadata Operations**: Metadata changes are nearly instant

## Future Enhancements

### Potential Improvements

1. **Metadata Versioning**: Track when different metadata was added
2. **Selective Overwrite**: Option to overwrite specific fields while preserving others
3. **Metadata Templates**: Predefined metadata structures for different use cases
4. **Batch Processing**: Process multiple files with same metadata updates
5. **Custom metadata key support**: Add arbitrary metadata fields
6. **Metadata extraction/reading capabilities**: Read and display existing metadata
7. **Preview of existing metadata**: Show what's already in the video file

### Advanced Features

1. **Metadata Validation**: Ensure metadata formats are valid
2. **Custom Separators**: Different separation styles for different metadata types
3. **Metadata Export**: Export metadata to external formats (JSON, XML, etc.)
4. **History Tracking**: Maintain history of metadata changes
5. **Integration with other metadata standards**: Support for XMP, EXIF, etc.

## Related Documentation

- [Video Preview Node](../video-preview/VIDEO_PREVIEW.md) - For displaying videos
- [Media Describe Node](../media-describe/MEDIA_DESCRIBE.md) - For AI-powered video analysis
- [VHS VideoCombine](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite) - Video combination node

## Installation Notes

- Requires FFmpeg to be installed and accessible in system PATH
- No additional Python dependencies beyond what's already in the project
- Compatible with existing ComfyUI-SwissArmyKnife installation

---

**Node Type**: Metadata Processor  
**Category**: Utils  
**Status**: Active Development  
**VHS Compatible**: ✅ Yes
