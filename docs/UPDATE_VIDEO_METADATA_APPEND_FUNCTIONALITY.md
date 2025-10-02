# Update Video Metadata - Append Functionality

## Overview

The VideoMetadataNode has been renamed to "Update Video Metadata" and enhanced to append to existing metadata instead of overwriting it. This ensures that existing metadata in video files is preserved while adding new information.

## Key Changes

### 1. Display Name Update

- **Old Name**: "Video Metadata"
- **New Name**: "Update Video Metadata"
- **Purpose**: Better reflects the append functionality

### 2. Metadata Appending Behavior

#### Before (Overwrite Mode)

```bash
# Original metadata
title: "My Video"
description: "Original description"

# After running node with LoRA data
title: "LoRA Style + Detail"  # ❌ Original title lost
description: "LoRA Information: ..."  # ❌ Original description lost
```

#### After (Append Mode)

```bash
# Original metadata
title: "My Video"
description: "Original description"

# After running node with LoRA data
title: "My Video

LoRA Style + Detail"  # ✅ Original title preserved
description: "Original description

LoRA Information: ..."  # ✅ Original description preserved
```

## Technical Implementation

### New Helper Methods

#### `_get_existing_metadata(filename)`

Reads existing metadata from video file using ffprobe:

```python
def _get_existing_metadata(self, filename):
    """Read existing metadata from video file using ffprobe."""
    # Uses ffprobe to extract existing metadata tags
    # Returns dictionary of existing metadata fields
    # Gracefully handles missing files or invalid metadata
```

#### `_combine_metadata_field(existing, new)`

Combines existing and new metadata content:

```python
def _combine_metadata_field(self, existing, new):
    """Combine existing metadata field with new content."""
    # Separates content with double newlines for readability
    # Handles empty existing or new content gracefully
    # Returns: "existing\n\nnew" format
```

### Enhanced Metadata Processing

#### Artist Field

```python
# Appends to existing artist information
existing_artist = existing_metadata.get('artist', '')
combined_artist = self._combine_metadata_field(existing_artist, new_artist)
```

#### Comment Field

```python
# Appends to existing comments
existing_comment = existing_metadata.get('comment', '')
combined_comment = self._combine_metadata_field(existing_comment, new_comment)
```

#### LoRA Metadata Integration

```python
# Title: Appends LoRA combined_display to existing title
existing_title = existing_metadata.get('title', '')
combined_title = self._combine_metadata_field(existing_title, lora_display)

# Description: Appends LoRA information to existing description
existing_description = existing_metadata.get('description', '')
combined_description = self._combine_metadata_field(existing_description, lora_info)

# Keywords: Uses comma separation for better keyword handling
if existing_keywords.strip():
    combined_keywords = f'{existing_keywords.strip()}, LoRA: {lora_keywords}'
else:
    combined_keywords = f'LoRA: {lora_keywords}'
```

## Usage Examples

### Example 1: Adding Artist to Existing Video

```
Input Video Metadata:
- title: "Epic Battle Scene"
- description: "Generated with Stable Diffusion"

Node Parameters:
- artist: "AI Creator Studio"

Output Video Metadata:
- title: "Epic Battle Scene"
- description: "Generated with Stable Diffusion"
- artist: "AI Creator Studio"
```

### Example 2: Adding LoRA Info to Video with Existing Metadata

```
Input Video Metadata:
- title: "Character Animation"
- description: "Fantasy character design"
- artist: "Original Creator"

Node Parameters:
- lora_json: {"combined_display": "Style + Detail LoRAs", ...}

Output Video Metadata:
- title: "Character Animation

Style + Detail LoRAs"
- description: "Fantasy character design

LoRA Information:
• Local: Style LoRA (strength: 0.8)
• Local: Detail LoRA (strength: 0.6)"
- artist: "Original Creator"
- keywords: "LoRA: Style, Detail"
- lora_json: "{...full LoRA JSON...}"
```

## Benefits

### 1. Data Preservation

- ✅ Existing metadata is never lost
- ✅ Multiple processing passes accumulate information
- ✅ Original authorship and descriptions preserved

### 2. Enhanced Workflow Support

- ✅ Can process videos through multiple metadata nodes
- ✅ Different stages can add different types of metadata
- ✅ Supports iterative workflow development

### 3. Better Organization

- ✅ Clear separation between different metadata sources
- ✅ Readable formatting with double newlines
- ✅ Keywords properly comma-separated

### 4. Backward Compatibility

- ✅ Works with videos that have no existing metadata
- ✅ Graceful handling of missing or corrupt metadata
- ✅ Same interface as previous version

## Error Handling

### Missing Files

```python
# Gracefully handles missing video files
if not os.path.exists(filename):
    raise Exception(f"Input video file not found: {filename}")
```

### Metadata Reading Failures

```python
# Returns empty dict if metadata can't be read
except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
    return {}  # Fresh metadata will be created
```

### FFmpeg Command Failures

```python
# Clear error messages for FFmpeg issues
except subprocess.CalledProcessError as e:
    raise Exception(f"FFmpeg metadata operation failed: {e.stderr}")
```

## Future Enhancements

### Potential Improvements

1. **Metadata Versioning**: Track when different metadata was added
2. **Selective Overwrite**: Option to overwrite specific fields while preserving others
3. **Metadata Templates**: Predefined metadata structures for different use cases
4. **Batch Processing**: Process multiple files with same metadata updates

### Advanced Features

1. **Metadata Validation**: Ensure metadata formats are valid
2. **Custom Separators**: Different separation styles for different metadata types
3. **Metadata Export**: Export metadata to external formats (JSON, XML, etc.)
4. **History Tracking**: Maintain history of metadata changes

## Related Files

- **Implementation**: `nodes/nodes.py` - VideoMetadataNode class
- **VHS Compatibility**: `VHS_VIDEOCOMBINE_COMPATIBILITY_FIX.md`
- **LoRA Integration**: `VIDEO_METADATA_JSON_INTEGRATION.md`
- **Multiple LoRA Support**: `MULTIPLE_LORA_SUPPORT.md`

## Version Information

- **Version**: 1.3.0+
- **Feature**: Append functionality
- **Breaking Changes**: None (maintains same interface)
- **Dependencies**: ffmpeg, ffprobe (same as before)
