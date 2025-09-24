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

- **filenames**: (STRING, forceInput) - Video filenames from VHS_VideoCombine or other video output nodes (handles both single files and lists)

### Optional

- **artist**: (STRING) - Artist/Creator metadata
- **comment**: (STRING, multiline) - Additional comments metadata
- **lora_json**: (STRING) - LoRA JSON data from LoRAInfoExtractor (contains structured LoRA metadata)
- **overwrite_original**: (Yes/No) - Whether to overwrite the original file or create a new one with '\_metadata' suffix

## Output

- **filenames**: (STRING) - Output filenames (original or new file with metadata)

## Usage Examples

### Basic Usage with VHS_VideoCombine

```
[Video Processing] → [VHS_VideoCombine] → [VideoMetadataNode] → [Output]
```

1. Connect the `Filenames` output from VHS_VideoCombine to the `filenames` input of VideoMetadataNode
2. Optionally add artist and comment metadata
3. Choose whether to overwrite original or create new file
4. The output `filenames` can be connected to other nodes or used as final output

### LoRA-Enhanced Workflow (Recommended)

```
[LoRA Selection] → [LoRAInfoExtractor] → [Video Processing] → [VHS_VideoCombine] → [VideoMetadataNode] → [Output]
                              ↓
                        [lora_json]
```

1. Connect LoRA selector (e.g., WanVideo Lora Select Multi) to LoRAInfoExtractor
2. Connect `lora_json` output from LoRAInfoExtractor to `lora_json` input of VideoMetadataNode
3. Connect `Filenames` output from VHS_VideoCombine to `filenames` input of VideoMetadataNode
4. The node automatically generates title, description, and keywords from LoRA data

### Workflow Integration

The VideoMetadataNode is designed to fit naturally into ComfyUI video processing workflows:

```
[Image Generation] → [Video Creation] → [VHS_VideoCombine] → [VideoMetadataNode] → [File Output]
                                                                    ↑
[LoRA Data] → [LoRAInfoExtractor] → [lora_json] ────────────────────┘
```

### LoRA JSON Integration

The VideoMetadataNode now processes structured LoRA JSON data from the LoRAInfoExtractor node:

- **lora_json**: JSON string containing detailed LoRA metadata
    - **Automatic Title**: Uses `combined_display` field as video title
    - **Automatic Description**: Generates description from individual LoRA info
    - **Automatic Keywords**: Creates keywords from LoRA names
    - **Raw JSON Storage**: Stores complete JSON as custom metadata

### Metadata Fields Usage

- **Artist**: Creator or artist name
- **Comment**: Additional notes or production information
- **LoRA Data**: Automatically extracted from JSON:
    - Title: "LoRA1 + LoRA2" format
    - Description: Bullet-pointed LoRA information
    - Keywords: "LoRA: Name1, Name2" format

## Technical Implementation

### FFmpeg Command Structure

The node constructs FFmpeg commands like:

```bash
# Basic metadata
ffmpeg -i input.mp4 -c copy -metadata artist="Creator" -metadata comment="Notes" output.mp4

# With LoRA JSON data (automatically generated)
ffmpeg -i input.mp4 -c copy \
  -metadata title="LoRA1 + LoRA2" \
  -metadata description="LoRA Information:\n• CivitAI: LoRA1 by Creator1\n• Local: LoRA2 (strength: 0.8)" \
  -metadata keywords="LoRA: LoRA1, LoRA2" \
  -metadata lora_json='{"loras":[...],"count":2,"combined_display":"LoRA1 + LoRA2"}' \
  output.mp4
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
