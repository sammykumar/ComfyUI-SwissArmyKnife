# LoRA JSON Workflow Serialization

## Overview

The `LoRAInfoExtractor` node now automatically saves its `lora_json` output value to the workflow JSON file. This enables automation scripts and external tools to access the structured LoRA metadata directly from the workflow without needing to re-execute the node.

## Problem Solved

**Before**: Workflow JSON only contained node inputs and basic metadata:

```json
{
    "1031": {
        "inputs": {
            "civitai_api_key": "9c80a8272431b8fae138c3a82838ed1a",
            "fallback_name": "",
            "use_civitai_api": true,
            "wan_model_type": "low",
            "lora": ["1030", 0]
        },
        "class_type": "LoRAInfoExtractor",
        "_meta": {
            "title": "[Low] LoRA Info Extractor"
        }
    }
}
```

**After**: Workflow JSON now includes the `lora_json` output:

```json
{
    "1031": {
        "inputs": {
            "civitai_api_key": "9c80a8272431b8fae138c3a82838ed1a",
            "fallback_name": "",
            "use_civitai_api": true,
            "wan_model_type": "low",
            "lora": ["1030", 0]
        },
        "class_type": "LoRAInfoExtractor",
        "_meta": {
            "title": "[Low] LoRA Info Extractor"
        },
        "lora_json_output": "{\"loras\":[{\"index\":0,\"display_name\":\"Epic Realism\",\"hash\":\"abc123...\",\"file\":{\"exists\":true,\"path\":\"/path/to/lora.safetensors\"},\"strength\":1.0,\"civitai\":{\"civitai_name\":\"Epic Realism\",\"version_name\":\"v5.0\",\"creator\":\"Creator\"}}],\"summary\":{\"count\":1,\"civitai_matches\":1},\"combined_display\":\"Epic Realism\",\"wan_model_type\":\"low\"}"
    }
}
```

## How It Works

### JavaScript Widget Extension

A new ComfyUI extension (`comfyui_swissarmyknife.lora_info_extractor`) automatically:

1. **Captures Output**: Listens for `LoRAInfoExtractor` node execution results
2. **Caches Data**: Stores the `lora_json` output in the node instance
3. **Serializes**: Saves the cached data to workflow JSON when workflow is saved
4. **Restores**: Loads the cached data when workflow is opened

### Technical Implementation

```javascript
// Capture execution results
node.onExecuted = function (message) {
    if (message?.output?.lora_json?.[0]) {
        this._cached_lora_json = message.output.lora_json[0];
    }
};

// Save to workflow JSON
nodeType.prototype.onSerialize = function (o) {
    if (this._cached_lora_json) {
        o.lora_json_output = this._cached_lora_json;
    }
};

// Restore from workflow JSON
nodeType.prototype.onConfigure = function (o) {
    if (o.lora_json_output) {
        this._cached_lora_json = o.lora_json_output;
    }
};
```

## Usage for Automation Scripts

### Accessing LoRA JSON Data

```python
import json

# Load workflow JSON
with open('workflow.json', 'r') as f:
    workflow = json.load(f)

# Find LoRAInfoExtractor nodes
for node_id, node_data in workflow.items():
    if node_data.get('class_type') == 'LoRAInfoExtractor':
        # Access the saved lora_json output
        if 'lora_json_output' in node_data:
            lora_json_str = node_data['lora_json_output']
            lora_data = json.loads(lora_json_str)

            print(f"Node {node_id} LoRA Data:")
            print(f"  Combined Display: {lora_data['combined_display']}")
            print(f"  LoRA Count: {lora_data['summary']['count']}")
            print(f"  Wan Model Type: {lora_data['wan_model_type']}")

            for lora in lora_data['loras']:
                print(f"  - {lora['display_name']} (strength: {lora['strength']})")
```

### Example Automation Use Cases

1. **Video Processing Pipelines**: Extract LoRA metadata for video descriptions
2. **Batch Processing**: Identify which LoRAs were used in completed workflows
3. **Quality Control**: Verify LoRA configurations match requirements
4. **Report Generation**: Generate summaries of LoRA usage across workflows

## Data Structure

The saved `lora_json_output` contains the complete JSON structure from `LoRAInfoExtractor`:

```json
{
    "loras": [
        {
            "index": 0,
            "display_name": "Epic Realism",
            "hash": "abc123def456...",
            "hashes": {
                "sha256": "abc123def456...",
                "md5": "def456ghi789...",
                "blake3": "ghi789jkl012..."
            },
            "file": {
                "exists": true,
                "path": "/path/to/epic_realism.safetensors"
            },
            "strength": 1.0,
            "original": {
                "raw": {
                    "name": "epic_realism",
                    "strength": 1.0
                }
            },
            "civitai": {
                "civitai_name": "Epic Realism",
                "version_name": "v5.0",
                "civitai_url": "https://civitai.com/models/123456",
                "model_id": 123456,
                "version_id": 789012,
                "matched_hash_type": "sha256",
                "cache_hit": true
            }
        }
    ],
    "summary": {
        "count": 1,
        "missing_files": 0,
        "civitai_matches": 1,
        "civitai_cache_hits": 1,
        "local_only": 0,
        "tags": ["photorealistic", "portrait", "detailed"]
    },
    "combined_display": "Epic Realism",
    "wan_model_type": "low"
}
```

## Compatibility

### Browser Cache Refresh

After updating the extension, refresh your browser cache to ensure the new JavaScript code is loaded:

- **Chrome/Edge**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- **Firefox**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Existing Workflows

- **New Workflows**: Automatically include `lora_json_output` after first execution
- **Existing Workflows**: Need to be executed once to populate the `lora_json_output` field
- **Backward Compatibility**: Workflows without `lora_json_output` continue to work normally

## Troubleshooting

### Missing lora_json_output in Workflow

1. **Execute Node**: Run the workflow to trigger `LoRAInfoExtractor` execution
2. **Save Workflow**: Save the workflow after execution to capture the output
3. **Check Browser Console**: Look for debug messages about caching and serialization

### Debug Information

The extension logs detailed information to the browser console:

```
[DEBUG] LoRAInfoExtractor node created
[DEBUG] LoRAInfoExtractor onExecuted called with: {...}
[DEBUG] Cached lora_json from execution: {"loras":[...]...
[SERIALIZE] Saved lora_json to workflow: {"loras":[...]...
[CONFIGURE] Restored lora_json from workflow: {"loras":[...]...
```

### Validation Steps

1. **Open Browser DevTools**: F12 in most browsers
2. **Execute LoRAInfoExtractor**: Run a workflow containing the node
3. **Check Console**: Look for cache and serialize debug messages
4. **Save and Reload**: Save workflow, reload page, check for restore messages

## Future Enhancements

### Potential Improvements

- **Compression**: Compress large JSON outputs to reduce workflow file size
- **Selective Fields**: Option to save only specific fields from the JSON output
- **Multiple Outputs**: Support for saving all output values, not just `lora_json`
- **Export Tools**: Built-in utilities to extract and format the JSON data

### Integration Opportunities

- **API Endpoints**: Expose LoRA data through ComfyUI API endpoints
- **Webhook Support**: Send LoRA metadata to external services on completion
- **Database Integration**: Store LoRA usage statistics in external databases
