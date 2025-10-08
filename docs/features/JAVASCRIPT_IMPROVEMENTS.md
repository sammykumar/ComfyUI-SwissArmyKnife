# JavaScript Improvements and Fixes

**Last Updated**: October 8, 2025

This document consolidates JavaScript-related improvements, fixes, and infrastructure enhancements for ComfyUI-SwissArmyKnife.

---

## Table of Contents

1. [Cache Busting Implementation](#cache-busting-implementation)
2. [Module Loading Error Resolution](#module-loading-error-resolution)
3. [Node Name Updates](#node-name-updates)

---

## Cache Busting Implementation

### Problem

Browsers cache JavaScript files aggressively, which can prevent users from seeing updates to ComfyUI custom node JavaScript widgets after code changes. This is particularly problematic during development and after publishing updates.

### Solution Options

#### Option 1: Version-Based Query Parameters (Recommended)

Add version query parameters to JavaScript file URLs to force browser cache invalidation.

**Implementation in `__init__.py`:**

```python
import os
from .nodes.nodes import NODE_CLASS_MAPPINGS as MAIN_NODE_CLASS_MAPPINGS
from .nodes.nodes import NODE_DISPLAY_NAME_MAPPINGS as MAIN_NODE_DISPLAY_NAME_MAPPINGS
from .nodes.helper_nodes import HELPER_NODE_CLASS_MAPPINGS
from .nodes.helper_nodes import HELPER_NODE_DISPLAY_NAME_MAPPINGS

# Get version from pyproject.toml for cache busting
def get_version():
    try:
        import tomllib
        pyproject_path = os.path.join(os.path.dirname(__file__), "pyproject.toml")
        with open(pyproject_path, "rb") as f:
            data = tomllib.load(f)
            return data["project"]["version"]
    except Exception:
        # Fallback to timestamp if version reading fails
        import time
        return str(int(time.time()))

# Combine main nodes and helper nodes
NODE_CLASS_MAPPINGS = {**MAIN_NODE_CLASS_MAPPINGS, **HELPER_NODE_CLASS_MAPPINGS}
NODE_DISPLAY_NAME_MAPPINGS = {**MAIN_NODE_DISPLAY_NAME_MAPPINGS, **HELPER_NODE_DISPLAY_NAME_MAPPINGS}

WEB_DIRECTORY = "./web"
VERSION = get_version()

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY", "VERSION"]
```

**JavaScript Version Tracking:**

```javascript
// Version and cache busting info
const EXTENSION_VERSION = '1.4.0'; // Should match pyproject.toml version
const LOAD_TIMESTAMP = new Date().toISOString();

console.log(
    `Loading swiss-army-knife.js extension v${EXTENSION_VERSION} at ${LOAD_TIMESTAMP}`,
);
```

#### Option 2: File Hash-Based Cache Busting

```python
import hashlib
import os

def get_file_hash(filepath):
    """Generate SHA256 hash of file content for cache busting"""
    try:
        with open(filepath, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()[:8]
    except Exception:
        return "default"

# In __init__.py
js_file_path = os.path.join(os.path.dirname(__file__), "web/js/swiss-army-knife.js")
JS_FILE_HASH = get_file_hash(js_file_path)
```

#### Option 3: Timestamp-Based Cache Busting

```python
import os

def get_file_timestamp(filepath):
    """Get file modification timestamp for cache busting"""
    try:
        return str(int(os.path.getmtime(filepath)))
    except Exception:
        import time
        return str(int(time.time()))

# In __init__.py
js_file_path = os.path.join(os.path.dirname(__file__), "web/js/swiss-army-knife.js")
JS_TIMESTAMP = get_file_timestamp(js_file_path)
```

### Current Implementation

The project includes a comprehensive cache busting solution:

1. **Version-Based Cache Busting** - Uses `pyproject.toml` version with timestamp fallback
2. **Cache Busting Script** - `scripts/cache_bust.sh` for automatic version syncing
3. **Development Utilities** - Browser console commands for cache clearing
4. **Automatic Version Detection** - Notifies users when extension updates

### Usage

#### For Developers

1. Make changes to JavaScript files
2. Run cache busting script:
    ```bash
    ./scripts/cache_bust.sh
    ```
3. Restart ComfyUI server (Python changes only)
4. Hard refresh browser (`Ctrl+F5` / `Cmd+Shift+R`)

#### For Users Experiencing Cache Issues

**Browser console commands** (development only):

```javascript
clearSwissArmyKnifeCache(); // Clear cache and reload
reloadSwissArmyKnife(); // Force reload with cache bypass
```

**Manual browser cache clearing**:

- Hard refresh: `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Developer Tools → Network tab → "Disable cache"
- Settings → Clear browsing data

### Related Files

- `__init__.py` - Web directory registration and version management
- `web/js/swiss-army-knife.js` - Main JavaScript extension
- `pyproject.toml` - Version source for cache busting
- `scripts/cache_bust.sh` - Automated cache busting script

---

## Module Loading Error Resolution

### Problem

ComfyUI was showing JavaScript errors when trying to load modules from non-existent paths:

```
Error loading extension /extensions/comfyui_swissarmyknife/node_modules/ajv/lib/dotjs/allOf.js
Error loading extension /extensions/comfyui_swissarmyknife/node_modules/ajv/lib/dotjs/multipleOf.js
Error loading extension /extensions/comfyui_swissarmyknife/node_modules/ajv/lib/dotjs/dependencies.js
...
```

### Root Cause

The `web/node_modules` directory contained development dependencies (ESLint, Prettier, etc.) that were accidentally being served by ComfyUI as part of the web extension. ComfyUI was attempting to load these Node.js modules as browser JavaScript files, which is incorrect.

### Solution Applied

1. **Removed `web/node_modules`** - Development dependencies shouldn't be exposed to ComfyUI
2. **Removed `web/package-lock.json`** - No longer needed without dependencies in web directory
3. **Kept `web/package.json`** - Still useful for development tool configuration

### Architecture Clarification

**Active Files:**

- ✅ `web/js/gemini_widgets.js` - Plain JavaScript widgets for ComfyUI
- ✅ `web/css/gemini_widgets.css` - CSS for widgets

**Disabled/Development Only:**

- ⚠️ `ui-react_backup/` - React UI extension (disabled)

**Node Modules Locations:**

- Root directory (`node_modules/`) - Playwright tests
- React UI directory (`ui-react_backup/ui/node_modules/`) - React build
- Test directory (`web/tests/node_modules/`) - Playwright web tests

### Expected Result

ComfyUI no longer attempts to load development dependencies as web assets. Plain JavaScript widgets continue to work normally without errors.

### Files Affected

- ❌ Removed: `/web/node_modules/` (entire directory)
- ❌ Removed: `/web/package-lock.json`
- ✅ Kept: `/web/package.json` (for development tools only)
- ✅ Kept: `/web/js/gemini_widgets.js` (main widget functionality)
- ✅ Kept: `/web/css/gemini_widgets.css` (widget styling)

### Verification

To verify the fix:

1. Restart ComfyUI server
2. Clear browser cache
3. Check browser console for JavaScript errors
4. Confirm that nodes load and function correctly

---

## Node Name Updates

### Overview

Updated all JavaScript references from `GeminiUtilMediaDescribe` to `MediaDescribe` to match the Python node ID change in `NODE_CLASS_MAPPINGS`.

### Problem

The Python backend had already renamed the node ID from `"GeminiUtilMediaDescribe"` to `"MediaDescribe"` in the `NODE_CLASS_MAPPINGS`, but the JavaScript code in `web/js/swiss-army-knife.js` was still using the old name, causing JavaScript widgets and event handlers to fail to attach to the node.

### Changes Made

Updated all 9 occurrences of `GeminiUtilMediaDescribe` to `MediaDescribe` in `/web/js/swiss-army-knife.js`:

#### 1. Node Registration

```javascript
// Before
else if (nodeData.name === "GeminiUtilMediaDescribe") {
    debugLog("Registering GeminiUtilMediaDescribe node with dynamic media widgets");

// After
else if (nodeData.name === "MediaDescribe") {
    debugLog("Registering MediaDescribe node with dynamic media widgets");
```

#### 2. Workflow Loading Hook

```javascript
// Before
if (node.comfyClass === "GeminiUtilMediaDescribe") {
    debugLog("[LOADED] loadedGraphNode called for GeminiUtilMediaDescribe");

// After
if (node.comfyClass === "MediaDescribe") {
    debugLog("[LOADED] loadedGraphNode called for MediaDescribe");
```

#### 3. Execution Event Handler

```javascript
// Before
if (node && node.comfyClass === "GeminiUtilMediaDescribe") {
    debugLog("[API] ✅ Found GeminiUtilMediaDescribe execution result");

// After
if (node && node.comfyClass === "MediaDescribe") {
    debugLog("[API] ✅ Found MediaDescribe execution result");
```

### Impact

**Fixed Functionality:**

- ✅ JavaScript widgets properly attach to the MediaDescribe node
- ✅ Dynamic media upload widgets (image/video) work correctly
- ✅ Reddit URL widget visibility toggling works
- ✅ Seed widget for randomization works
- ✅ Dimensions display widget shows correct height/width
- ✅ File persistence on workflow save/load works

**Backward Compatibility:**

- ⚠️ **Breaking Change**: Existing workflows using the old node need updating
- Users with saved workflows containing the old node ID will need to:
    1. Open the workflow JSON
    2. Find and replace `"GeminiUtilMediaDescribe"` with `"MediaDescribe"`
    3. Or recreate the node in ComfyUI

### Testing Checklist

After these changes, verify:

1. ✅ MediaDescribe node appears in the node menu
2. ✅ Dynamic widgets appear based on media_source selection:
    - Upload Media → Shows image/video upload buttons
    - Randomize from Path → Shows media_path and seed inputs
    - Reddit Post → Shows reddit_url input
3. ✅ File uploads work and persist across workflow save/load
4. ✅ Dimensions display widget shows after execution
5. ✅ Video/image previews work correctly

### Related Files

- `/web/js/swiss-army-knife.js` - JavaScript widgets and event handlers (updated)
- `/nodes/nodes.py` - Python node definitions (already updated)
- `/nodes/media_describe/mediia_describe.py` - MediaDescribe class implementation

---

## Summary

These JavaScript improvements ensure:

1. **Reliable Cache Management** - Users always see the latest code updates
2. **Clean Module Loading** - No spurious errors from development dependencies
3. **Consistent Naming** - JavaScript and Python node IDs are synchronized

For related documentation, see:

- [Media Describe Node](../nodes/media-describe/) - AI content analysis
- [Debug System](../infrastructure/debug/) - For JavaScript debugging
- [UI Widgets](../ui-widgets/) - Widget implementation details
