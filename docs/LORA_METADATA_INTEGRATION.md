# LoRA Metadata Integration

## Overview

The LoRA Metadata Integration feature enables automatic extraction of LoRA names from various LoRA loading nodes and embedding them into video metadata. This solution provides seamless integration with WanVideoWrapper's LoRA loading nodes and other LoRA systems to capture the actual CivitAI names (not just filenames) and embed them in video metadata.

## Architecture

The solution consists of two main components:

### 1. LoRAInfoExtractor Node

A new custom node that extracts LoRA information from various input formats:

- **Input**: Accepts `WANVIDLORA` type from WanVideoWrapper LoRA loading nodes
- **Output**: Returns `lora_name` (string), `lora_info` (formatted info), and `lora_passthrough` (original input)
- **Compatibility**: Specifically designed for WanVideoWrapper LoRA objects with WANVIDLORA type

### 2. Enhanced VideoMetadataNode

The existing VideoMetadataNode has been extended with:

- **New Input**: `lora_name` parameter for accepting LoRA names
- **Metadata Integration**: Embeds LoRA names in both `keywords` and custom `lora` metadata fields
- **Backward Compatibility**: All existing functionality remains unchanged

## Workflow Integration

### Basic Workflow

```
[LoRA Loader] → [LoRAInfoExtractor] → [VideoProcessing] → [VideoMetadataNode]
                        ↓                                        ↓
                [LoRA Name String] ────────────────────→ [Final Video with Metadata]
```

### Complete Example Workflow

```
[WanVideoWrapper LoRA Loader] → [LoRAInfoExtractor] → [Video Generation Pipeline]
                                        ↓                        ↓
                                [LoRA Name: "Cinematic Style"]   [VHS_VideoCombine]
                                        ↓                        ↓
                                [VideoMetadataNode] ←───────────[Video File]
                                        ↓
                            [Final Video with LoRA Metadata]
```

## Supported LoRA Input Formats

The LoRAInfoExtractor node can handle various LoRA input formats:

### 1. WanVideoWrapper LoRA Objects

- Dictionary-like objects with metadata
- Attributes like `civitai_name`, `name`, `model_name`

### 2. Dictionary Format

```python
{
    "civitai_name": "Cinematic Style LoRA",
    "filename": "cinematic_style.safetensors",
    "model_name": "Cinematic"
}
```

### 3. Tuple/List Format

```python
(model_object, "LoRA Name")
(model_object, {"name": "LoRA Name"})
```

### 4. Filename Strings

```python
"/path/to/cinematic_style.safetensors"
```

## Metadata Embedding

The LoRA name is embedded in video metadata in two ways:

### 1. Keywords Field

- Added to existing keywords: `"landscape, portrait, LoRA: Cinematic Style"`
- Creates new keywords if none exist: `"LoRA: Cinematic Style"`

### 2. Custom LoRA Field

- Dedicated metadata field: `lora=Cinematic Style`
- Accessible via FFmpeg metadata tools

## Name Cleaning and Normalization

The LoRAInfoExtractor automatically cleans and normalizes LoRA names:

1. **File Extension Removal**: `.safetensors`, `.ckpt`, `.pt` removed
2. **Underscore to Space**: `cinematic_style` → `cinematic style`
3. **Title Case**: `cinematic style` → `Cinematic Style`
4. **Whitespace Cleanup**: Removes extra spaces and trims

## Node Properties

### LoRAInfoExtractor

**Inputs:**

- `lora` (required, WANVIDLORA type): LoRA object from WanVideoWrapper LoRA loading nodes
- `fallback_name` (optional, string): Fallback name if extraction fails

**Outputs:**

- `lora_name` (string): Cleaned and normalized LoRA name
- `lora_info` (string): Formatted info string: "LoRA: [name]"
- `lora_passthrough` (WANVIDLORA): Original LoRA input for chaining

**Category:** Swiss Army Knife 🔪

### Enhanced VideoMetadataNode

**New Input:**

- `lora_name` (optional, string): LoRA name from LoRAInfoExtractor

**Metadata Fields Created:**

- `keywords`: Includes LoRA name in comma-separated keywords
- `lora`: Dedicated LoRA metadata field

## Implementation Details

### Error Handling

The LoRAInfoExtractor includes robust error handling:

- **Unknown Format**: Returns "Unknown LoRA" if format not recognized
- **Fallback Support**: Uses `fallback_name` parameter if extraction fails
- **Exception Safety**: Catches all exceptions and returns error information

### Name Extraction Priority

The node tries extraction methods in this order:

1. **Dictionary keys**: `civitai_name` → `name` → `model_name` → `title` → `filename`
2. **Object attributes**: Same priority as dictionary keys
3. **Tuple/List**: Extracts from second element (name or metadata dict)
4. **Filename**: Extracts base name without path and extension

### Metadata Processing

FFmpeg metadata commands generated:

```bash
# If keywords exist and LoRA name provided
-metadata 'keywords=existing keywords, LoRA: [name]'

# If only LoRA name provided
-metadata 'keywords=LoRA: [name]'

# Always add custom LoRA field
-metadata 'lora=[name]'
```

## Usage Examples

### Example 1: Basic Usage

1. Add **LoRAInfoExtractor** node to workflow
2. Connect WanVideoWrapper LoRA output to `lora`
3. Connect `lora_name` output to **VideoMetadataNode** `lora_name` input
4. Process video as normal

### Example 2: With Fallback Name

1. Set `fallback_name` to "Custom LoRA" in LoRAInfoExtractor
2. If automatic extraction fails, "Custom LoRA" will be used
3. Useful for unknown LoRA formats or file-based LoRAs

### Example 3: Chaining Multiple LoRAs

```
[LoRA 1] → [LoRAInfoExtractor 1] → [Name 1]
[LoRA 2] → [LoRAInfoExtractor 2] → [Name 2]
                    ↓
[Combine Names] → [VideoMetadataNode]
```

## Testing and Validation

### Verification Steps

1. **Import Test**:

    ```python
    from utils.nodes import NODE_CLASS_MAPPINGS
    print("LoRAInfoExtractor" in NODE_CLASS_MAPPINGS)  # Should be True
    ```

2. **Node Registration**:
    - Check ComfyUI node list for "LoRA Info Extractor"
    - Verify node appears in "Swiss Army Knife 🔪" category

3. **Metadata Verification**:
    ```bash
    ffprobe -v quiet -print_format json -show_format video.mp4
    ```
    Look for `lora` and `keywords` in metadata tags.

### Expected Behavior

- **LoRA Name Extraction**: Correctly identifies and cleans LoRA names
- **Metadata Embedding**: LoRA names appear in both keywords and custom fields
- **Error Handling**: Graceful handling of unknown formats with fallback support
- **Backward Compatibility**: Existing VideoMetadataNode functionality unchanged

## Troubleshooting

### Common Issues

**Issue**: "Unknown LoRA" returned despite valid input

- **Solution**: Check input format and add fallback_name
- **Debug**: Examine LoRA object structure to identify metadata keys

**Issue**: Metadata not appearing in video

- **Solution**: Verify FFmpeg is installed and video file is writable
- **Debug**: Check ComfyUI console for FFmpeg errors

**Issue**: Node not appearing in ComfyUI

- **Solution**: Restart ComfyUI server after installation
- **Debug**: Check Python import errors in ComfyUI logs

### Debug Information

Enable debug logging by checking ComfyUI console output when using the nodes. The LoRAInfoExtractor will show extraction attempts and results.

## Future Enhancements

Potential improvements for future versions:

1. **CivitAI API Integration**: Direct lookup of LoRA names by hash
2. **Safetensors Metadata Reading**: Parse embedded metadata from .safetensors files
3. **Multiple LoRA Support**: Handle arrays of LoRA inputs
4. **Advanced Name Mapping**: User-configurable name transformations
5. **Caching**: Cache extracted names to improve performance

## Related Documentation

- [VIDEO_METADATA_NODE.md](VIDEO_METADATA_NODE.md) - Original video metadata functionality
- [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Overall project status
- [WIDGET_INVESTIGATION_AND_FIXES.md](WIDGET_INVESTIGATION_AND_FIXES.md) - UI widget details

## File Modifications

This feature required changes to:

- `utils/nodes.py`: Added LoRAInfoExtractor class and enhanced VideoMetadataNode
- `docs/LORA_METADATA_INTEGRATION.md`: This documentation file

## Workflow JSON Example

```json
{
    "nodes": [
        {
            "id": 1,
            "type": "WanVideoWrapper_LoRALoader",
            "data": { "lora_name": "cinematic_style.safetensors" }
        },
        {
            "id": 2,
            "type": "LoRAInfoExtractor",
            "data": { "fallback_name": "Cinematic Style" }
        },
        {
            "id": 3,
            "type": "VideoMetadataNode",
            "data": {
                "title": "Generated Video",
                "keywords": "AI generated, video"
            }
        }
    ],
    "connections": [
        { "from": "1.lora_output", "to": "2.lora" },
        { "from": "2.lora_name", "to": "3.lora_name" },
        { "from": "video_pipeline.filename", "to": "3.filename" }
    ]
}
```
