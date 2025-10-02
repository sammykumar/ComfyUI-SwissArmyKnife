# LoRAInfoExtractor JSON Output Format

## Overview

The `LoRAInfoExtractor` node now outputs structured JSON data instead of concatenated strings, providing better data handling and parsing capabilities for downstream processing.

## Implementation Details

### Return Types and Names

- **RETURN_TYPES**: `("STRING", "STRING", "WANVIDLORA")`
- **RETURN_NAMES**: `("lora_json", "lora_info", "lora_passthrough")`

### Output Structure

The first output (`lora_json`) contains a JSON string with the following structure:

```json
{
    "loras": [
        {
            "index": 0,
            "name": "LoRA Name",
            "info": "Detailed info string",
            "path": "/path/to/lora.safetensors",
            "strength": 1.0,
            "has_civitai_data": true
        }
    ],
    "count": 1,
    "combined_display": "LoRA Name + Another LoRA"
}
```

### JSON Fields Description

#### Root Level Fields

- **`loras`**: Array of LoRA objects containing detailed metadata for each processed LoRA
- **`count`**: Integer representing the total number of valid LoRAs processed
- **`combined_display`**: String with " + " separated LoRA names for easy display (maintains backward compatibility)

#### LoRA Object Fields

- **`index`**: Zero-based index of the LoRA in the processing order
- **`name`**: Clean LoRA name (from CivitAI or extracted from filename)
- **`info`**: Human-readable information string including source (CivitAI/Local) and strength
- **`path`**: Full file path to the LoRA file
- **`strength`**: Numeric strength value from the WANVIDLORA configuration
- **`has_civitai_data`**: Boolean indicating whether CivitAI metadata was successfully retrieved

## Example Outputs

### Multiple LoRAs with Mixed Sources

```json
{
    "loras": [
        {
            "index": 0,
            "name": "Realistic Vision",
            "info": "CivitAI: Realistic Vision (v5.1) by SomeCreator",
            "path": "/ComfyUI/models/loras/realistic_vision.safetensors",
            "strength": 1.0,
            "has_civitai_data": true
        },
        {
            "index": 1,
            "name": "CustomStyle",
            "info": "Local: CustomStyle (strength: 0.8)",
            "path": "/ComfyUI/models/loras/custom_style.safetensors",
            "strength": 0.8,
            "has_civitai_data": false
        }
    ],
    "count": 2,
    "combined_display": "Realistic Vision + CustomStyle"
}
```

### No Valid LoRAs (Error Case)

```json
{
    "loras": [],
    "count": 0,
    "combined_display": "No Valid LoRAs",
    "error": "No valid LoRAs found"
}
```

### Exception Handling

```json
{
    "loras": [],
    "count": 0,
    "combined_display": "Error Extracting LoRA",
    "error": "Specific error message"
}
```

## Processing Logic

### Multiple LoRA Processing

1. **Input Validation**: Check if input is WANVIDLORA list structure
2. **LoRA Filtering**: Skip entries with `path: 'none'` or empty paths
3. **CivitAI Lookup**: Query CivitAI API for each valid LoRA (if enabled)
4. **Name Extraction**: Use CivitAI name or extract from filename
5. **JSON Construction**: Build structured JSON with all metadata
6. **Return**: JSON string, human-readable info, and original passthrough

### Single LoRA Processing (Compatibility)

- Maintains backward compatibility with non-list inputs
- Returns same JSON structure with single LoRA in array
- Handles both CivitAI and local extraction methods

## Usage Examples

### Parsing JSON Output in Python

```python
import json

# From ComfyUI workflow
lora_json, lora_info, lora_passthrough = lora_extractor_node_output

# Parse JSON
lora_data = json.loads(lora_json)

# Access data
total_loras = lora_data["count"]
display_name = lora_data["combined_display"]

# Iterate through LoRAs
for lora in lora_data["loras"]:
    print(f"LoRA: {lora['name']} (strength: {lora['strength']})")
    if lora["has_civitai_data"]:
        print("  Has CivitAI metadata")
    else:
        print("  Local metadata only")
```

### JavaScript Processing

```javascript
// Parse JSON output
const loraData = JSON.parse(loraJsonOutput);

// Access combined display for UI
document.getElementById('lora-display').textContent = loraData.combined_display;

// Process individual LoRAs
loraData.loras.forEach((lora, index) => {
    console.log(`LoRA ${index + 1}: ${lora.name} at ${lora.strength} strength`);
});
```

## Benefits of JSON Format

### Structured Data Access

- **Programmatic Processing**: Easy to parse and process in any language
- **Type Safety**: Clear data types for each field
- **Extensibility**: Easy to add new fields without breaking existing code

### Backward Compatibility

- **Combined Display**: `combined_display` field maintains the " + " separated format
- **Info String**: Second output still provides human-readable information
- **Passthrough**: Third output preserves original WANVIDLORA data

### Enhanced Metadata

- **Strength Values**: Individual strength values for each LoRA
- **Source Information**: Clear indication of CivitAI vs local metadata
- **File Paths**: Full paths available for further processing
- **Processing Status**: Error handling and success indicators

## Migration Guide

### From String Format

**Old Usage** (string concatenation):

```python
# Old format returned: "LoRA1 + LoRA2"
lora_names = old_output[0]
names_list = lora_names.split(" + ")
```

**New Usage** (JSON parsing):

```python
# New format returns structured JSON
lora_json = json.loads(new_output[0])
names_list = [lora["name"] for lora in lora_json["loras"]]
combined_display = lora_json["combined_display"]  # Same as old format
```

### Accessing Additional Data

With JSON format, you now have access to:

- Individual LoRA strength values
- Full file paths
- CivitAI metadata indicators
- Processing error information
- Structured arrays for iteration

## Implementation Status

- ✅ **JSON Structure**: Complete with all metadata fields
- ✅ **Multiple LoRA Support**: Handles WANVIDLORA list structure
- ✅ **Single LoRA Compatibility**: Backward compatibility maintained
- ✅ **Error Handling**: Proper JSON error responses
- ✅ **CivitAI Integration**: Preserves CivitAI metadata detection
- ✅ **Testing**: Validated with mock data and real WANVIDLORA structures

## Technical Notes

### JSON Library

Uses Python's built-in `json` module for serialization:

- **Consistency**: Standard JSON formatting with 2-space indentation
- **Reliability**: Built-in error handling and validation
- **Performance**: Efficient serialization and parsing

### Memory Considerations

- JSON strings are larger than simple concatenated strings
- Rich metadata provides more value than storage overhead
- Structured data enables better caching and processing optimization

### Future Enhancements

Potential additions to JSON structure:

- **Model Hash**: File hash for verification
- **File Size**: LoRA file size information
- **Last Modified**: File timestamp data
- **Tags**: CivitAI tag information
- **Ratings**: CivitAI popularity/rating data
