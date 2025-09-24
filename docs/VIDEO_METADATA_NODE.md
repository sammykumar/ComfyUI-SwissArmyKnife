# Video Metadata Node

## Overview

The VideoMetadataNode is a ComfyUI custom node that enables adding metadata to video files. It's designed to work seamlessly with the VHS_VideoCombine node and other video processing nodes in ComfyUI workflows.

## Features

- **FFmpeg-based metadata injection**: Uses FFmpeg's `-metadata` option for reliable metadata embedding
- **Chain-friendly design**: Takes filename input and outputs filename for workflow chaining
- **Non-destructive option**: Can create new files with metadata instead of overwriting originals
- **Copy-only processing**: Uses stream copying to avoid re-encoding (fast and lossless)
- **Multiple metadata fields**: Supports common metadata fields used across video formats

## Input Parameters

### Required

- **filename**: (STRING, forceInput) - Video filename from VHS_VideoCombine or other video output nodes

### Optional

- **title**: (STRING) - Video title metadata
- **description**: (STRING, multiline) - Video description metadata
- **artist**: (STRING) - Artist/Creator metadata
- **keywords**: (STRING) - Keywords/Tags metadata (comma-separated)
- **comment**: (STRING, multiline) - Additional comments metadata
- **overwrite_original**: (Yes/No) - Whether to overwrite the original file or create a new one with '\_metadata' suffix

## Output

- **filename**: (STRING) - Output filename (original or new file with metadata)

## Usage Examples

### Basic Usage with VHS_VideoCombine

```
[Video Processing] → [VHS_VideoCombine] → [VideoMetadataNode] → [Output]
```

1. Connect the `filename` output from VHS_VideoCombine to the `filename` input of VideoMetadataNode
2. Fill in desired metadata fields (title, description, artist, etc.)
3. Choose whether to overwrite original or create new file
4. The output `filename` can be connected to other nodes or used as final output

### Workflow Integration

The VideoMetadataNode is designed to fit naturally into ComfyUI video processing workflows:

```
[Image Generation] → [Video Creation] → [VHS_VideoCombine] → [VideoMetadataNode] → [File Output]
```

### Metadata Fields Usage

- **Title**: Short descriptive title for the video
- **Description**: Longer description of the video content
- **Artist**: Creator or artist name
- **Keywords**: Comma-separated tags for searchability
- **Comment**: Additional notes or production information

## Technical Implementation

### FFmpeg Command Structure

The node constructs FFmpeg commands like:

```bash
ffmpeg -i input.mp4 -c copy -metadata title="My Video" -metadata artist="Creator" output.mp4
```

### Key Design Decisions

1. **Stream Copying (-c copy)**: Avoids re-encoding for speed and quality preservation
2. **Conditional Metadata**: Only adds metadata fields that have content
3. **Safe Overwriting**: Uses temporary files when overwriting to prevent corruption
4. **Error Handling**: Comprehensive error handling for file operations and FFmpeg execution

### File Handling

- **Overwrite Mode**: Creates temporary file, then replaces original
- **New File Mode**: Creates new file with `_metadata` suffix
- **Validation**: Checks input file existence before processing

## Error Handling

The node handles several error conditions:

- **Missing input file**: Validates file exists before processing
- **FFmpeg execution errors**: Captures and reports FFmpeg stderr output
- **File system errors**: Handles permissions and disk space issues
- **Invalid metadata**: Sanitizes metadata inputs

## Performance Considerations

- **No Re-encoding**: Uses stream copying for maximum speed
- **Minimal Memory Usage**: FFmpeg handles file processing efficiently
- **Batch Processing**: Can be used in loops for multiple files

## Compatibility

### Video Formats

- Supports all video formats that FFmpeg can handle
- MP4, MOV, AVI, MKV, WebM, etc.

### Metadata Standards

- Uses standard metadata keys compatible with most video players
- Follows FFmpeg metadata conventions

### ComfyUI Integration

- Compatible with ComfyUI's string passing system
- Works with VHS node suite and other video processing nodes

## Future Enhancements

Potential future additions:

- Custom metadata key support
- Batch metadata templates
- Metadata extraction/reading capabilities
- Integration with other metadata standards
- Preview of existing metadata

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: Ensure FFmpeg is installed and in PATH
2. **Permission denied**: Check file permissions for input/output files
3. **Unsupported format**: Verify video format is supported by FFmpeg
4. **Disk space**: Ensure sufficient space for output files

### Debug Information

The node outputs success messages and detailed error information to help with troubleshooting.

## Installation Notes

- Requires FFmpeg to be installed and accessible in system PATH
- No additional Python dependencies beyond what's already in the project
- Compatible with existing ComfyUI-SwissArmyKnife installation
