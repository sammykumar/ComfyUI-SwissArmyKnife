# VideoMetadataNode JSON Integration Update

## Overview

The VideoMetadataNode has been updated to integrate with the new JSON output format from the LoRAInfoExtractor, replacing individual metadata inputs with structured JSON processing.

## Changes Made

### Removed Inputs

The following input fields have been **removed** from VideoMetadataNode:

- **title**: Individual title input field
- **description**: Individual description input field
- **keywords**: Individual keywords input field
- **lora_name**: Individual LoRA name input field

### Added Input

- **lora_json**: (STRING) - LoRA JSON data from LoRAInfoExtractor containing structured LoRA metadata

### Retained Inputs

The following inputs remain unchanged:

- **filename**: (STRING, forceInput) - Video filename input
- **artist**: (STRING) - Artist/Creator metadata
- **comment**: (STRING, multiline) - Additional comments metadata
- **overwrite_original**: (Yes/No) - File overwrite behavior

## JSON Processing Logic

### Automatic Metadata Generation

When `lora_json` input is provided, the node automatically generates metadata:

1. **Title**: Extracted from `combined_display` field
    - Example: "LoRA1 + LoRA2"

2. **Description**: Generated from individual LoRA `info` fields
    - Format: "LoRA Information:\n• Info1\n• Info2"
    - Example: "LoRA Information:\n• CivitAI: LoRA1 by Creator1\n• Local: LoRA2 (strength: 0.8)"

3. **Keywords**: Created from LoRA `name` fields
    - Format: "LoRA: Name1, Name2"
    - Example: "LoRA: Realistic Vision, Custom Style"

4. **Raw JSON**: Complete JSON stored as `lora_json` custom metadata

### Error Handling

- **JSON Parse Errors**: Falls back to treating input as simple string
- **Missing Fields**: Gracefully handles incomplete JSON structures
- **Empty Data**: Skips metadata generation for empty/invalid inputs

## Workflow Integration

### New Recommended Workflow

```
[LoRA Selector] → [LoRAInfoExtractor] → [Video Processing] → [VHS_VideoCombine] → [VideoMetadataNode]
                           ↓                                                           ↑
                    [lora_json] ──────────────────────────────────────────────────────┘
```

### Connection Steps

1. Connect LoRA selector (e.g., WanVideo Lora Select Multi) to LoRAInfoExtractor
2. Connect `lora_json` output from LoRAInfoExtractor to VideoMetadataNode `lora_json` input
3. Connect video filename from VHS_VideoCombine to VideoMetadataNode `filename` input
4. Optionally add `artist` and `comment` metadata
5. Configure `overwrite_original` behavior

## Benefits

### Structured Data Processing

- **Rich Metadata**: Comprehensive LoRA information in video metadata
- **Automatic Generation**: No manual input of title/description/keywords required
- **Consistency**: Standardized metadata format across videos
- **Extensibility**: Easy to add new metadata fields from JSON structure

### Workflow Simplification

- **Fewer Connections**: Single JSON input instead of multiple string inputs
- **Automatic Population**: Metadata automatically derived from LoRA data
- **Error Reduction**: Less manual input reduces configuration errors
- **Future-Proof**: JSON structure allows for easy extension

## Example Output Metadata

### Video with Two LoRAs

Given JSON input:

```json
{
    "loras": [
        {
            "name": "Realistic Vision",
            "info": "CivitAI: Realistic Vision (v5.1) by SomeCreator",
            "strength": 1.0,
            "has_civitai_data": true
        },
        {
            "name": "CustomStyle",
            "info": "Local: CustomStyle (strength: 0.8)",
            "strength": 0.8,
            "has_civitai_data": false
        }
    ],
    "count": 2,
    "combined_display": "Realistic Vision + CustomStyle"
}
```

Generated metadata:

- **title**: "Realistic Vision + CustomStyle"
- **description**: "LoRA Information:\n• CivitAI: Realistic Vision (v5.1) by SomeCreator\n• Local: CustomStyle (strength: 0.8)"
- **keywords**: "LoRA: Realistic Vision, CustomStyle"
- **lora_json**: [Complete JSON string]

## Migration Guide

### For Existing Workflows

**Old Structure (No Longer Supported):**

```
[Manual Input] → title ────┐
[Manual Input] → description ──┤
[Manual Input] → keywords ──┤
[LoRA Name] → lora_name ──────┤
                              ├─→ [VideoMetadataNode]
[Video File] → filename ──────┘
```

**New Structure:**

```
[LoRA Data] → [LoRAInfoExtractor] → lora_json ──┐
[Video File] → filename ─────────────────────────├─→ [VideoMetadataNode]
[Optional] → artist ─────────────────────────────┤
[Optional] → comment ────────────────────────────┘
```

### Update Steps

1. **Remove Manual Inputs**: Delete title, description, keywords, lora_name connections
2. **Add LoRAInfoExtractor**: Connect LoRA selector to LoRAInfoExtractor
3. **Connect JSON**: Connect `lora_json` output to VideoMetadataNode
4. **Test**: Verify metadata generation works as expected

## Technical Implementation

### Method Signature Change

**Before:**

```python
def add_metadata(self, filename, title="", description="", artist="", keywords="", comment="", lora_name="", overwrite_original="No"):
```

**After:**

```python
def add_metadata(self, filename, artist="", comment="", lora_json="", overwrite_original="No"):
```

### JSON Processing Code

```python
# Process LoRA JSON metadata
if lora_json.strip():
    try:
        import json
        lora_data = json.loads(lora_json)

        # Extract title from combined_display
        if 'combined_display' in lora_data and lora_data['combined_display']:
            cmd.extend(['-metadata', f'title={lora_data["combined_display"]}'])

        # Generate description and keywords from LoRA array
        if 'loras' in lora_data and lora_data['loras']:
            descriptions = []
            keywords = []

            for lora in lora_data['loras']:
                if 'info' in lora and lora['info']:
                    descriptions.append(lora['info'])
                if 'name' in lora and lora['name']:
                    keywords.append(lora['name'])

            if descriptions:
                description_text = '\n'.join([f'• {desc}' for desc in descriptions])
                cmd.extend(['-metadata', f'description=LoRA Information:\n{description_text}'])

            if keywords:
                keywords_text = ', '.join(keywords)
                cmd.extend(['-metadata', f'keywords=LoRA: {keywords_text}'])

        # Store raw JSON for advanced use
        cmd.extend(['-metadata', f'lora_json={lora_json.strip()}'])

    except json.JSONDecodeError:
        # Fallback to simple string storage
        cmd.extend(['-metadata', f'lora={lora_json.strip()}'])
```

## Testing

### Validation Results

✅ **Input Structure**: All old inputs removed, lora_json input added  
✅ **JSON Processing**: Correctly parses LoRA JSON and generates metadata  
✅ **Error Handling**: Graceful fallback for invalid JSON  
✅ **Backward Compatibility**: artist and comment inputs preserved  
✅ **Workflow Integration**: Works seamlessly with LoRAInfoExtractor

### Test Scenarios

1. **Valid JSON**: Proper metadata generation
2. **Invalid JSON**: Fallback to string storage
3. **Empty JSON**: No metadata generated
4. **Partial JSON**: Handles missing fields gracefully
5. **No JSON**: Node works with only artist/comment inputs

## Impact

### Positive Changes

- **Automation**: Reduces manual metadata input
- **Consistency**: Standardized metadata format
- **Rich Data**: More comprehensive LoRA information
- **Integration**: Better workflow connectivity
- **Maintenance**: Easier to extend and modify

### Breaking Changes

- **Old Workflows**: Existing workflows using title/description/keywords/lora_name inputs need updates
- **Manual Control**: Less granular control over individual metadata fields
- **Dependencies**: Now requires LoRAInfoExtractor for rich metadata

## Future Enhancements

### Potential Additions

- **Custom Templates**: Configurable metadata formatting
- **Field Selection**: Choose which JSON fields to include
- **Merge Logic**: Combine JSON metadata with manual inputs
- **Validation**: JSON schema validation for input
- **Preview**: Metadata preview before processing

## Documentation Updates

- ✅ **VIDEO_METADATA_NODE.md**: Updated with new input structure
- ✅ **JSON_OUTPUT_FORMAT.md**: Documents LoRAInfoExtractor JSON format
- ✅ **This Document**: Comprehensive update documentation
- 🔄 **Workflow Examples**: Need update in other documentation files
- 🔄 **Integration Guides**: Update integration documentation
