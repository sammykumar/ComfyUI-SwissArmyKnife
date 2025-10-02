# Unified Debug Logging System

**Created:** October 2, 2025  
**Status:** ✅ Implemented

## Overview

ComfyUI-SwissArmyKnife now has a **centralized debug logging system** that respects a single `DEBUG` environment variable across both Python backend and JavaScript frontend code.

## How It Works

### Environment Variable

Set the `DEBUG` environment variable to control debug logging:

```bash
# Enable debug logging
DEBUG=true

# Disable debug logging (default)
DEBUG=false

# Also accepts: 1, yes, True for enabled
```

### Backend (Python)

All Python debug logging now uses the centralized `debug_utils.py` module:

```python
from nodes.debug_utils import debug_print, is_debug_enabled

# Use debug_print instead of print for debug messages
debug_print("This will only show when DEBUG=true")

# Check if debug is enabled
if is_debug_enabled():
    # Do expensive debug operations only when needed
    pass
```

**Files Updated:**

- `nodes/debug_utils.py` - New centralized debug utilities module
- `nodes/config_api.py` - Exposes DEBUG setting to frontend via `/swissarmyknife/config`
- `__init__.py` - Loads DEBUG from environment

### Frontend (JavaScript)

All JavaScript debug logging uses the centralized debug system loaded from server config:

```javascript
// DEBUG mode - will be loaded from server config
let DEBUG_ENABLED = false;

// Conditional logging wrapper
const debugLog = (...args) => {
    if (DEBUG_ENABLED) {
        console.log('[ComponentName]', ...args);
    }
};

// Load DEBUG setting from server
async function loadDebugConfig() {
    const response = await fetch('/swissarmyknife/config');
    const config = await response.json();
    DEBUG_ENABLED = config.debug || false;
}
```

**Files Updated:**

- `web/js/swiss-army-knife.js` - Main extension debug system
- `web/js/video_preview/video_preview.js` - Video preview widget debug logging

## Configuration

### 1. Create `.env` file

```bash
cp .env.example .env
```

### 2. Set DEBUG variable

Edit `.env`:

```bash
DEBUG=true  # Enable debug logging
```

### 3. Restart ComfyUI Server

Debug settings are loaded at startup, so you must **restart the ComfyUI server** after changing the DEBUG variable:

```bash
# Stop ComfyUI
# Restart ComfyUI
```

### 4. Refresh Browser

After restarting the server, **hard refresh your browser** to load the new debug configuration:

- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`
- **Or**: Open DevTools → Right-click refresh → "Empty Cache and Hard Reload"

## Benefits

### ✅ Single Source of Truth

- One environment variable controls all debug logging
- No need to edit multiple files to enable/disable debug mode

### ✅ Production Ready

- Debug logging disabled by default
- No performance impact in production
- Clean console output without debug noise

### ✅ Developer Friendly

- Easy to enable debug mode for troubleshooting
- Consistent debug output format with prefixes
- Works across both Python and JavaScript

### ✅ Conditional Logging

- Only logs when DEBUG=true
- Avoids cluttering production logs
- Easy to trace issues in development

## Debug Output Examples

### Python Debug Output

```
[DEBUG] LoRAInfoExtractor.extract_lora_info called
  - use_civitai_api: True
  - civitai_api_key provided: True
  - fallback_name: 'my_lora'
[DEBUG] Discovered 3 LoRA entries in stack
```

### JavaScript Debug Output

```
Video Preview Debug Mode: ENABLED
[VideoPreview] reference_vid raw value: /comfyui-nvidia/temp/video.mp4 string
[VideoPreview] Loaded reference_vid:
  Extracted: /comfyui-nvidia/temp/video.mp4
  Type: temp
  Subfolder: (none)
  Filename: video.mp4
  URL: /api/view?filename=video.mp4&type=temp&subfolder=
```

## Migration Guide

### For Python Code

**Before:**

```python
print("[DEBUG] Some debug message")
print(f"[DEBUG] Value: {value}")
```

**After:**

```python
from nodes.debug_utils import debug_print

debug_print("[DEBUG] Some debug message")
debug_print(f"[DEBUG] Value: {value}")
```

### For JavaScript Code

**Before:**

```javascript
const DEBUG = true;
if (DEBUG) {
    console.log('[Component]', 'debug message');
}
```

**After:**

```javascript
let DEBUG_ENABLED = false;

const debugLog = (...args) => {
    if (DEBUG_ENABLED) {
        console.log('[Component]', ...args);
    }
};

async function loadDebugConfig() {
    const response = await fetch('/swissarmyknife/config');
    const config = await response.json();
    DEBUG_ENABLED = config.debug || false;
}

loadDebugConfig();

// Use debugLog instead of console.log
debugLog('debug message');
```

## Files to Update (Future Work)

The following files still contain hardcoded debug logging that should be migrated to use `debug_utils.py`:

### Python Files (Not Yet Migrated)

- `nodes/nodes.py` - LoRA extraction debug logs
- `nodes/civitai_service.py` - CivitAI API debug logs
- `nodes/lora_hash_cache.py` - Cache operation logs
- `nodes/cache.py` - Cache file logs
- `nodes/utils/video_preview.py` - Video preview logs
- `nodes/utils/control_panel.py` - Control panel logs
- `nodes/lora_manager/*.py` - LoRA manager debug logs

### Migration Priority

1. **High Priority**: Core nodes (`nodes.py`, `civitai_service.py`)
2. **Medium Priority**: Utility modules (`cache.py`, `lora_hash_cache.py`)
3. **Low Priority**: Utility nodes (`control_panel.py`, `video_preview.py`)

## Troubleshooting

### Debug logs not appearing after enabling DEBUG

**Solution:**

1. Verify `.env` file exists and contains `DEBUG=true`
2. **Restart ComfyUI server** (required)
3. **Hard refresh browser** (Cmd+Shift+R)
4. Check console for: `Swiss Army Knife Debug Mode: ENABLED`
5. Check console for: `Video Preview Debug Mode: ENABLED`

### Environment variable not loading

**Solution:**

1. Ensure `.env` file is in the extension root directory
2. Check file permissions (should be readable)
3. Verify ComfyUI loads `.env` files (may need python-dotenv)
4. Try setting environment variable directly before starting ComfyUI:
    ```bash
    export DEBUG=true
    # Start ComfyUI
    ```

### Debug mode enabled but no logs

**Solution:**

1. Check that code is using `debug_print()` or `debugLog()`
2. Verify `/swissarmyknife/config` endpoint returns `{"debug": true}`
3. Check browser console and server logs separately

## API Endpoint

### GET `/swissarmyknife/config`

Returns the current debug configuration:

```json
{
    "debug": true
}
```

This endpoint is called by JavaScript extensions to synchronize debug settings with the backend.

## Future Enhancements

1. **Dynamic Debug Toggle**: Add UI button to toggle debug mode without restarting
2. **Debug Levels**: Support different debug levels (INFO, DEBUG, TRACE)
3. **Component Filtering**: Enable debug for specific components only
4. **Log File Output**: Option to write debug logs to file
5. **Performance Metrics**: Track and display performance data in debug mode

## Related Documentation

- `.env.example` - Environment variable configuration template
- `nodes/debug_utils.py` - Python debug utilities implementation
- `nodes/config_api.py` - API endpoint for debug configuration
- `web/js/swiss-army-knife.js` - JavaScript debug system implementation
