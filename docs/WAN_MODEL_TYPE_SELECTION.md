# Wan Model Type Selection Feature

## Overview

The LoRA Info Extractor node now includes a `wan_model_type` field that allows users to specify whether the LoRA is being used with the Wan 2.2 High Noise or Low Noise model. This information is included in the LoRA JSON output for better workflow tracking and metadata management.

## Feature Details

### Node Input Field

**Field Name**: `wan_model_type`

- **Type**: Dropdown selection
- **Options**: `["high", "low", "none"]`
- **Default**: `"high"`
- **Location**: Optional inputs section
- **Tooltip**: "Specify whether this LoRA is used with Wan 2.2 High Noise, Low Noise model, or none/other"

### JSON Output

The selected `wan_model_type` value is included at the root level of the LoRA JSON output:

```json
{
  "loras": [...],
  "summary": {...},
  "combined_display": "My LoRA",
  "wan_model_type": "high"
}
```

## Usage

### In ComfyUI Node

1. Connect your LoRA stack to the LoRA Info Extractor node
2. Set the `wan_model_type` dropdown to one of:
    - `"high"` - For use with Wan 2.2 High Noise model
    - `"low"` - For use with Wan 2.2 Low Noise model
    - `"none"` - For use with other models or when not applicable
3. The selected value will be included in the JSON output

### In JSON Processing

The `wan_model_type` field can be accessed in downstream processing:

```python
import json

lora_json = json.loads(lora_json_string)
model_type = lora_json.get("wan_model_type", "high")

if model_type == "high":
    print("Using Wan 2.2 High Noise model")
elif model_type == "low":
    print("Using Wan 2.2 Low Noise model")
elif model_type == "none":
    print("Using other model or not applicable")
```

## Implementation Details

### Code Changes

1. **INPUT_TYPES Updated**: Added `wan_model_type` dropdown to optional inputs
2. **Method Signature**: Updated `extract_lora_info` to accept `wan_model_type` parameter
3. **Debug Logging**: Added `wan_model_type` to debug output
4. **JSON Payload**: Included `wan_model_type` in all JSON responses (success, fallback, error)

### Validation

The field is validated through ComfyUI's input system:

- Only `"high"`, `"low"`, or `"none"` values are accepted
- Default value is `"high"` if not specified
- Field is optional (has default value)

## Examples

### High Noise Model Usage

```json
{
    "loras": [
        {
            "index": 0,
            "display_name": "Style LoRA",
            "hash": "ABC123...",
            "strength": 0.8,
            "file": {
                "exists": true,
                "path": "/path/to/style.safetensors"
            },
            "civitai": {
                "civitai_name": "Amazing Style LoRA",
                "version_name": "v1.2",
                "cache_hit": false
            }
        }
    ],
    "summary": {
        "count": 1,
        "civitai_matches": 1
    },
    "combined_display": "Amazing Style LoRA",
    "wan_model_type": "high"
}
```

### Low Noise Model Usage

```json
{
    "loras": [
        {
            "index": 0,
            "display_name": "Character LoRA",
            "hash": "DEF456...",
            "strength": 1.0,
            "file": {
                "exists": true,
                "path": "/path/to/character.safetensors"
            }
        }
    ],
    "summary": {
        "count": 1,
        "civitai_matches": 0
    },
    "combined_display": "Character LoRA",
    "wan_model_type": "low"
}
```

### None/Other Model Usage

```json
{
    "loras": [
        {
            "index": 0,
            "display_name": "Generic LoRA",
            "hash": "GHI789...",
            "strength": 0.7,
            "file": {
                "exists": true,
                "path": "/path/to/generic.safetensors"
            }
        }
    ],
    "summary": {
        "count": 1,
        "civitai_matches": 0
    },
    "combined_display": "Generic LoRA",
    "wan_model_type": "none"
}
```

## Benefits

### Workflow Tracking

- Clear indication of which Wan 2.2 model variant is being used
- Better organization of LoRA usage patterns
- Helpful for workflow documentation and sharing

### Metadata Management

- Consistent tracking across different workflows
- Easy identification of model compatibility
- Support for automated workflow analysis

### Integration Support

- Enables downstream tools to make decisions based on model type
- Supports workflow optimization based on noise model selection
- Facilitates better LoRA recommendation systems

## Backward Compatibility

The feature is fully backward compatible:

- **Default Value**: If not specified, defaults to `"high"`
- **Optional Field**: Does not break existing workflows
- **JSON Structure**: Adds field without modifying existing structure
- **API Compatibility**: Existing code can ignore the new field

## Future Enhancements

Potential future improvements:

- **Auto-detection**: Automatically detect model type from workflow context
- **Model-specific Recommendations**: Suggest optimal LoRA settings per model type
- **Batch Processing**: Support different model types within the same LoRA stack
- **Validation**: Verify LoRA compatibility with selected model type

## Date Implemented

September 26, 2025
