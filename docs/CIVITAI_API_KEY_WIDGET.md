# CivitAI API Key Widget Implementation

## Overview

Added a UI widget for CivitAI API key input to the LoRAInfoExtractor node, with automatic environment variable mapping similar to the Gemini API implementation.

## Implementation Details

### 1. New UI Widget

Added `civitai_api_key` input widget to LoRAInfoExtractor:

```python
"civitai_api_key": ("STRING", {
    "multiline": False,
    "default": os.environ.get("CIVITAI_API_KEY") or os.environ.get("CIVIT_API_KEY", "YOUR_CIVITAI_API_KEY_HERE"),
    "tooltip": "Your CivitAI API key (automatically uses CIVITAI_API_KEY or CIVIT_API_KEY environment variable if available)"
}),
```

### 2. Environment Variable Mapping

- **Dual Variable Support**: Widget checks both `CIVITAI_API_KEY` and `CIVIT_API_KEY` environment variables
- **Automatic Detection**: Widget automatically loads environment variable as default value
- **Manual Override**: Users can enter API key directly in the widget
- **Placeholder Handling**: Uses `"YOUR_CIVITAI_API_KEY_HERE"` as placeholder when no key is available

### 3. WANVIDLORA Structure Support

Enhanced file path extraction to handle WANVIDLORA list structure:

```python
# Handles list of LoRA dictionaries like:
[
    {
        'path': '/workspace/ComfyUI/models/loras/Wan2.2-Low-MysticXXX.safetensors',
        'strength': 0.9999,
        'name': 'Wan2.2-Low-MysticXXX',
        'blocks': {},
        'layer_filter': '',
        'low_mem_load': False
    }
]
```

### 4. CivitAI Service Updates

Enhanced `CivitAIService` to accept API key parameter with dual environment variable support:

```python
def __init__(self, api_key=None):
    self.cache = {}
    # Use provided API key, otherwise fallback to environment variables (try both variants)
    self.api_key = api_key or os.environ.get("CIVITAI_API_KEY") or os.environ.get("CIVIT_API_KEY", "")
```

### 5. Debug Logging Implementation

Added comprehensive debug logging throughout the process:

```python
print(f"[DEBUG] LoRAInfoExtractor.extract_lora_info called:")
print(f"  - civitai_api_key: {'PROVIDED' if civitai_api_key and civitai_api_key != 'YOUR_CIVITAI_API_KEY_HERE' else 'NOT PROVIDED'}")
print(f"  - fallback_name: '{fallback_name}'")
print(f"  - use_civitai_api: {use_civitai_api}")
```

## Usage Examples

### Example 1: Using Environment Variable (Full Name)

1. Set environment variable: `export CIVITAI_API_KEY="your_actual_key_here"`
2. Restart ComfyUI
3. LoRAInfoExtractor widget will automatically show the key
4. CivitAI API calls will use the environment key

### Example 1b: Using Environment Variable (Short Name)

1. Set environment variable: `export CIVIT_API_KEY="your_actual_key_here"`
2. Restart ComfyUI
3. LoRAInfoExtractor widget will automatically show the key
4. CivitAI API calls will use the environment key

### Example 2: Using Widget Input

1. Add LoRAInfoExtractor node to workflow
2. Enter CivitAI API key directly in the `civitai_api_key` field
3. Key will override any environment variable setting
4. CivitAI API calls will use the widget-provided key

### Example 3: No API Key (Local Only)

1. Leave `civitai_api_key` field as placeholder
2. Set `use_civitai_api` to `False`
3. Node will use local metadata extraction only

## Debug Output Example

When running with debug logging enabled:

```
[DEBUG] LoRAInfoExtractor.extract_lora_info called:
  - civitai_api_key: PROVIDED
  - fallback_name: 'My Custom LoRA'
  - use_civitai_api: True
  - lora type: <class 'list'>
[DEBUG] LoRA is a list with 1 items
[DEBUG] Processing first LoRA: <class 'dict'>
[DEBUG] First LoRA keys: ['path', 'strength', 'name', 'blocks', 'layer_filter', 'low_mem_load']
[DEBUG] Found path in first LoRA dict: /workspace/ComfyUI/models/loras/Wan2.2-Low-MysticXXX.safetensors
[DEBUG] Creating CivitAI service with API key: PROVIDED
[DEBUG] CivitAI Service initialized
[DEBUG] ✅ CivitAI API key found: test_wid...2345
```

## Benefits

1. **User-Friendly**: No need to set environment variables - can enter key directly in UI
2. **Flexible**: Supports both environment variables and direct input
3. **Secure**: API key is masked in debug output (shows only first 8 and last 4 characters)
4. **Debug-Ready**: Comprehensive logging helps troubleshoot issues
5. **Consistent**: Follows same pattern as Gemini API key implementation

## Security Considerations

- API keys are masked in debug output: `test_wid...2345`
- Keys are not logged in full to prevent accidental exposure
- Widget input is treated as sensitive data

## Testing Results

✅ **Widget Creation**: CivitAI API key widget successfully added
✅ **Environment Mapping**: Automatic detection of `CIVITAI_API_KEY` or `CIVIT_API_KEY` environment variables
✅ **Service Integration**: CivitAI service accepts and uses provided API key
✅ **Debug Logging**: Comprehensive debug output for troubleshooting
✅ **Fallback Mechanism**: Works correctly when no API key provided
✅ **WANVIDLORA Support**: Properly handles WANVIDLORA list structure for file path extraction
✅ **File Path Extraction**: Successfully extracts paths from LoRA dictionaries in list format

## Related Files

- `utils/nodes.py`: LoRAInfoExtractor class with new widget
- `utils/civitai_service.py`: Enhanced CivitAIService with API key parameter
- `docs/LORA_METADATA_INTEGRATION.md`: Updated documentation

## Next Steps

1. Users can now enter CivitAI API keys directly in the ComfyUI interface
2. Debug logging will help identify if CivitAI API calls are working correctly
3. Consider adding API key validation to provide immediate feedback
4. May want to add a "Test Connection" button for API key validation

## Date

September 24, 2025
