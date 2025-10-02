# LoRA Metadata Integration

## Overview

The LoRA Metadata Integration feature enables automatic extraction of LoRA names from various LoRA loading nodes and embedding them into video metadata. This solution provides seamless integration with WanVideoWrapper's LoRA loading nodes and other LoRA systems to capture the actual CivitAI names (not just filenames) and embed them in video metadata.

## Architecture

The solution consists of three main components:

### 1. CivitAI Service Module

A dedicated service (`nodes/civitai_service.py`) that handles CivitAI API integration:

- **File Hash Calculation**: SHA256 hash generation for LoRA files
- **API Integration**: Queries CivitAI's API using file hashes
- **Caching**: Intelligent caching to avoid repeated API calls
- **Error Handling**: Robust error handling for network issues and missing models

### 2. LoRAInfoExtractor Node

A new custom node that extracts LoRA information with CivitAI integration:

- **Input**: Accepts `WANVIDLORA` type from WanVideoWrapper LoRA loading nodes
- **CivitAI Lookup**: Automatically queries CivitAI API for official model names
- **Fallback Support**: Falls back to local metadata extraction if CivitAI lookup fails
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

## LoRA Information Extraction

The LoRAInfoExtractor uses a multi-stage approach to extract LoRA names:

### 1. CivitAI API Lookup (Primary Method)

When `use_civitai_api` is enabled (default), the node:

1. **Extracts File Path**: Searches WANVIDLORA objects for file paths
2. **Calculates Hash**: Generates SHA256 hash of the LoRA file
3. **Queries CivitAI**: Uses hash to lookup official model information
4. **Returns Official Data**: Model name, creator, version, and metadata

### 2. Local Metadata Extraction (Fallback)

If CivitAI lookup fails or is disabled, falls back to:

- **WanVideoWrapper Objects**: Dictionary-like objects with metadata
- **Embedded Metadata**: Attributes like `civitai_name`, `name`, `model_name`
- **Dictionary Format**: Standard key-value metadata structures
- **Tuple/List Format**: Structured LoRA data formats
- **Filename Strings**: Direct file path processing

### 3. CivitAI API Response Structure

```json
{
    "civitai_name": "Realistic Vision V6.0 B1",
    "version_name": "v6.0 (B1)",
    "creator": "SG_161222",
    "description": "Photorealistic model...",
    "civitai_url": "https://civitai.com/models/4201",
    "model_id": "4201",
    "tags": ["photarealism", "portraits"],
    "type": "Checkpoint",
    "nsfw": false
}
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
- `use_civitai_api` (optional, boolean, default: True): Whether to query CivitAI API for metadata

**Outputs:**

- `lora_name` (string): Official CivitAI name or cleaned local name
- `lora_info` (string): Formatted info string with source indicator
- `lora_passthrough` (WANVIDLORA): Original LoRA input for chaining

**Output Format Examples:**

- CivitAI Success: `"CivitAI: Realistic Vision V6.0 by SG_161222"`
- CivitAI with Version: `"CivitAI: Realistic Vision V6.0 (B1) by SG_161222"`
- Local Fallback: `"Local: Cinematic Style"`
- Fallback Name: `"Fallback: Custom LoRA"`

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

## CivitAI API Setup

### Environment Variable Configuration

1. **Get CivitAI API Key**: Visit [CivitAI API Settings](https://civitai.com/user/account) to generate an API key
2. **Set Environment Variable**: Add your API key to your environment:

```bash
# In your .env file
CIVITAI_API_KEY=your_api_key_here

# Or set directly in environment
export CIVITAI_API_KEY=your_api_key_here
```

3. **Docker Configuration**: If using Docker, add to docker-compose.yml:

```yaml
environment:
    - CIVITAI_API_KEY=${CIVITAI_API_KEY}
```

### API Key Benefits

- **Higher Rate Limits**: Authenticated requests have higher rate limits
- **Access to Private Models**: Can access your private models on CivitAI
- **Better Error Handling**: More detailed error messages for authenticated requests

### Without API Key

The integration works without an API key but with limitations:

- Lower rate limits (may hit rate limiting faster)
- Only public models are accessible
- Basic error messages

## Usage Examples

### Example 1: Basic Usage with CivitAI

1. Add **LoRAInfoExtractor** node to workflow
2. Connect WanVideoWrapper LoRA output to `lora`
3. Ensure `use_civitai_api` is enabled (default)
4. Connect `lora_name` output to **VideoMetadataNode** `lora_name` input
5. Process video - CivitAI lookup happens automatically

**Expected Result**: `"CivitAI: Realistic Vision V6.0 by SG_161222"`

### Example 2: Local-Only Mode

1. Set `use_civitai_api` to `False` in LoRAInfoExtractor
2. Set `fallback_name` to "Custom LoRA" if desired
3. Only local metadata extraction will be used

**Expected Result**: `"Local: Cinematic Style"` or `"Fallback: Custom LoRA"`

### Example 3: Hybrid Approach with Fallback

1. Enable CivitAI API (default)
2. Set meaningful `fallback_name` for unknown models
3. CivitAI lookup attempted first, fallback used if needed

**Results**:

- Found on CivitAI: `"CivitAI: Epic Realism by epiCRealism"`
- Not found: `"Fallback: Custom Fantasy LoRA"`

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
    from nodes.nodes import NODE_CLASS_MAPPINGS
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

**Issue**: CivitAI API lookup fails

- **Solution**: Verify `CIVITAI_API_KEY` is set in environment variables
- **Debug**: Check console for "No CivitAI API key found" messages
- **Fallback**: Disable `use_civitai_api` to use local extraction only

**Issue**: "Model not found on CivitAI" message

- **Solution**: Model may not be uploaded to CivitAI, use fallback_name
- **Debug**: Verify file hash calculation is working correctly
- **Alternative**: Use local-only mode for custom/private models

### Debug Information

Enable debug logging by checking ComfyUI console output when using the nodes. The LoRAInfoExtractor will show extraction attempts and results.

### CivitAI API Debug Steps

1. **Verify API Key**: Check environment variable is set correctly
2. **Test Hash Calculation**: Confirm SHA256 hash is generated for LoRA files
3. **Check API Response**: Look for HTTP errors or "not found" responses
4. **Fallback Testing**: Ensure local extraction works when CivitAI fails

## Future Enhancements

Potential improvements for future versions:

1. **✅ CivitAI API Integration**: ~~Direct lookup of LoRA names by hash~~ - **IMPLEMENTED**
2. **Safetensors Metadata Reading**: Parse embedded metadata from .safetensors files
3. **Multiple LoRA Support**: Handle arrays of LoRA inputs
4. **Advanced Name Mapping**: User-configurable name transformations
5. **Enhanced Caching**: Persistent cache for CivitAI lookups across sessions
6. **Batch Processing**: Support for multiple LoRA nodes in single operations

## Related Documentation

- [VIDEO_METADATA_NODE.md](VIDEO_METADATA_NODE.md) - Original video metadata functionality
- [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Overall project status
- [WIDGET_INVESTIGATION_AND_FIXES.md](WIDGET_INVESTIGATION_AND_FIXES.md) - UI widget details

## File Modifications

This feature required changes to:

- `nodes/nodes.py`: Added LoRAInfoExtractor class and enhanced VideoMetadataNode
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
