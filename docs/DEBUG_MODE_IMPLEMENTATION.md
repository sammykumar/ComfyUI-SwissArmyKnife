# DEBUG Mode Implementation

## Overview

The Swiss Army Knife extension now respects the `DEBUG` environment variable setting from `.env` to control console logging in the browser JavaScript.

## How It Works

### Backend (Python)

1. **Config API Endpoint** (`nodes/config_api.py`):
    - Exposes a `/swissarmyknife/config` endpoint
    - Reads `DEBUG` environment variable from `.env`
    - Returns JSON with `debug` boolean flag
    - Registered in `__init__.py` at extension load time

2. **Environment Variable Reading**:

    ```python
    debug = os.environ.get("DEBUG", "false").lower() in ("true", "1", "yes")
    ```

    - Supports: `true`, `1`, `yes` (case-insensitive) for enabling debug mode
    - Defaults to `false` if not set

### Frontend (JavaScript)

1. **Debug Configuration Loading** (`web/js/swiss-army-knife.js`):
    - Fetches debug setting from `/swissarmyknife/config` on extension load
    - Stores in `DEBUG_ENABLED` flag
    - Logs debug mode status to console

2. **Conditional Logging Wrapper**:

    ```javascript
    const debugLog = (...args) => {
        if (DEBUG_ENABLED) {
            console.log(...args);
        }
    };
    ```

3. **Log Classification**:
    - **Debug logs** (controlled by DEBUG flag):
        - `debugLog()` - Implementation details, state tracking, diagnostic info
        - All `[DEBUG]`, `[SERIALIZE]`, `[CONFIGURE]`, `[LOADED]`, `[API]` tagged messages
    - **Always-visible logs** (not controlled by DEBUG flag):
        - `console.log()` - User-facing messages, version info
        - `console.warn()` - Warnings
        - `console.error()` - Errors
        - Extension loading message
        - Debug mode status message

## Configuration

### Enable Debug Mode

In `.env`:

```bash
DEBUG=true
```

Or any of:

```bash
DEBUG=1
DEBUG=yes
DEBUG=True
DEBUG=YES
```

### Disable Debug Mode

In `.env`:

```bash
DEBUG=false
```

Or simply omit the `DEBUG` setting entirely (defaults to `false`).

## Testing

1. **Verify Config Endpoint**:

    ```bash
    curl http://localhost:8188/swissarmyknife/config
    ```

    Should return: `{"debug": true}` or `{"debug": false}`

2. **Test Debug Mode Enabled**:
    - Set `DEBUG=true` in `.env`
    - Restart ComfyUI server
    - Refresh browser
    - Open browser console
    - Should see: "Swiss Army Knife Debug Mode: ENABLED"
    - Should see debug logs with `[DEBUG]` tags

3. **Test Debug Mode Disabled**:
    - Set `DEBUG=false` in `.env`
    - Restart ComfyUI server
    - Refresh browser
    - Open browser console
    - Should see: "Swiss Army Knife Debug Mode: DISABLED"
    - Should NOT see debug logs with `[DEBUG]` tags

## Implementation Details

### Files Modified

1. **`__init__.py`**:
    - Added config API route registration
    - Added `DEBUG` to exports

2. **`nodes/config_api.py`** (new file):
    - Created config API endpoint
    - Reads DEBUG from environment

3. **`web/js/swiss-army-knife.js`**:
    - Added `loadDebugConfig()` async function
    - Added `debugLog()` wrapper function
    - Replaced ~50+ `console.log()` calls with `debugLog()` for debug-level messages
    - Kept user-facing logs as `console.log()`

### Logging Categories Changed to debugLog()

- Node registration messages
- Widget state serialization/deserialization
- File upload handlers
- Workflow loading
- API event processing
- Dimensions display updates
- Media widget management
- LoRA info extraction

### Logging Categories Kept as console.log()

- Extension version and load timestamp
- Debug mode status (enabled/disabled)
- Development utility functions
- Version update notifications
- Cache control messages
- User-facing warnings and errors

## Benefits

1. **Cleaner Console**: Users can disable debug logs for cleaner console output in production
2. **Debugging**: Developers can enable detailed logging when troubleshooting
3. **Centralized Control**: Single environment variable controls all debug logging
4. **No Code Changes**: Toggle debug mode without modifying code
5. **Server Restart**: Changes to DEBUG setting require server restart (not just browser refresh)

## Future Enhancements

Potential improvements:

- Add different log levels (DEBUG, INFO, WARN, ERROR)
- Add per-node debug control
- Add runtime debug toggle (no server restart needed)
- Add debug log filtering by category
- Add debug log export functionality

## Final Statistics

After complete implementation:

- **Total debugLog calls**: 167 (converted from console.log)
- **Remaining console.log calls**: 15 (all user-facing or system-required)
    - 1 inside debugLog function itself (required)
    - 2 user-facing status messages (debug mode, extension loading)
    - 2 error/status messages (filename preview error, video preview status)
    - 10 development utility messages (cache busting, localhost only)
- **Conversion rate**: ~92% of logging now respects DEBUG flag

### Log Categories Converted to debugLog

All these message types now respect the DEBUG environment variable:

- `[DEBUG]` - Implementation details and diagnostics
- `[STATE]` - Widget state management
- `[WIDGET]` - Widget operations
- `[CONFIGURE]` - Configuration and restoration
- `[SERIALIZE]` - Workflow serialization
- `[LOADED]` - Workflow loading
- `[UPLOAD]` - File upload operations
- `[API]` - API event handling
- `[MediaDescribe]` - Media description node diagnostics
- Widget discovery and manipulation
- File restoration and state management
- Dimensions display updates

### User-Facing Messages (Always Visible)

These messages always appear regardless of DEBUG setting:

- Extension version and load timestamp
- Debug mode status (ENABLED/DISABLED)
- Development utilities info (localhost only)
- Critical error messages
- Cache clearing confirmations

## Troubleshooting

### "Still seeing debug logs after setting DEBUG=false"

1. **Verify .env file**:

    ```bash
    cat /Users/samkumar/Development/dev-lab-hq/ai-image-hub/apps/comfyui-swiss-army-knife/.env | grep DEBUG
    ```

    Should show: `DEBUG=false`

2. **Test config API**:

    ```bash
    curl http://127.0.0.1:8188/swissarmyknife/config
    ```

    Should return: `{"debug": false}`

    If it returns `{"debug": true}`, the .env file isn't being read correctly.

3. **Clear ALL caches**:
    - Stop ComfyUI server completely
    - Clear browser cache (hard refresh: Cmd+Shift+R / Ctrl+Shift+F5)
    - In browser console, run: `localStorage.clear(); sessionStorage.clear()`
    - Or use the built-in utility: `clearSwissArmyKnifeCache()`
    - Restart ComfyUI server
    - Reload page

4. **Check for cached JavaScript**:
    - Browser may have cached the old swiss-army-knife.js
    - Force cache bypass: Disable browser cache in DevTools Network tab
    - Or increment EXTENSION_VERSION in swiss-army-knife.js to force reload

5. **Verify server restart**:
    - Ensure you fully restarted the ComfyUI server (not just refreshed browser)
    - Environment variables are only read at server startup

### "Debug mode status shows DISABLED but still see logs from other extensions"

The DEBUG flag only controls Swiss Army Knife logs. Other extensions (Node Enhancer, Super LoRA Loader, etc.) have their own logging that isn't affected by this setting.

Logs from other extensions will show different formats:

- `extension.js:6753 NodeEnhancer: Registering extension...`
- `extension.js:6891 Super LoRA Loader: Registering extension...`

These are separate extensions and not controlled by Swiss Army Knife's DEBUG setting.

## Final Statistics

After complete implementation:

- **Total debugLog calls**: 167 (converted from console.log)
- **Remaining console.log calls**: 15 (all user-facing or system-required)
- **Conversion rate**: ~92% of logging now respects DEBUG flag

### User-Facing Messages (Always Visible)

These messages always appear regardless of DEBUG setting:

- Extension version and load timestamp
- Debug mode status (ENABLED/DISABLED)
- Development utilities info (localhost only)
- Critical error messages

## Troubleshooting

### "Still seeing debug logs after setting DEBUG=false"

The logs you're seeing are from **other extensions** (Node Enhancer, Super LoRA Loader). Swiss Army Knife debug logs will have tags like `[DEBUG]`, `[STATE]`, `[WIDGET]`, etc.

**Verification steps:**

1. Check browser console shows: "Swiss Army Knife Debug Mode: DISABLED"
2. Verify no messages with `[DEBUG]`, `[STATE]`, `[WIDGET]` tags appear
3. Other extensions' logs (extension.js:XXXX) are normal and unrelated

**If Swiss Army Knife debug logs still appear:**

1. Verify `.env` has `DEBUG=false`
2. Fully restart ComfyUI server (environment variables load at startup)
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
4. Clear browser cache: `clearSwissArmyKnifeCache()` in console
