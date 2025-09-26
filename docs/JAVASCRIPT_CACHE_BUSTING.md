# JavaScript Cache Busting Implementation Guide

## Problem

Browsers cache JavaScript files aggressively, which can prevent users from seeing updates to ComfyUI custom node JavaScript widgets after code changes. This is particularly problematic during development and after publishing updates.

## Solution Options

### Option 1: Version-Based Query Parameters (Recommended)

Add version query parameters to JavaScript file URLs to force browser cache invalidation.

#### Implementation Steps

1. **Modify `__init__.py` to include version in web directory registration**
2. **Use `pyproject.toml` version for cache busting**
3. **Automatically append version to JavaScript file loading**

#### Code Implementation

**Enhanced `__init__.py`:**

```python
import os
from .utils.nodes import NODE_CLASS_MAPPINGS as MAIN_NODE_CLASS_MAPPINGS
from .utils.nodes import NODE_DISPLAY_NAME_MAPPINGS as MAIN_NODE_DISPLAY_NAME_MAPPINGS
from .utils.helper_nodes import HELPER_NODE_CLASS_MAPPINGS
from .utils.helper_nodes import HELPER_NODE_DISPLAY_NAME_MAPPINGS

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

**Enhanced JavaScript Loading (for React components):**

```javascript
// In swiss-army-knife.js - add version to any dynamic imports
const version = '1.4.0'; // Could be injected from Python

// Example for dynamic script loading
function loadVersionedScript(src) {
    const script = document.createElement('script');
    script.src = `${src}?v=${version}`;
    document.head.appendChild(script);
}
```

### Option 2: File Hash-Based Cache Busting

Generate hash-based filenames during build/deployment.

#### Implementation

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

### Option 3: Timestamp-Based Cache Busting

Use file modification time for cache busting.

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

### Option 4: ComfyUI Extension Reload Helper

Add a reload mechanism for development.

```javascript
// Add to swiss-army-knife.js
app.registerExtension({
    name: 'comfyui_swissarmyknife.cache_control',

    async setup() {
        // Add reload button for development
        if (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'
        ) {
            const reloadBtn = document.createElement('button');
            reloadBtn.innerText = 'Reload Swiss Army Knife';
            reloadBtn.onclick = () => {
                // Force reload of extension
                window.location.reload(true);
            };
            document.body.appendChild(reloadBtn);
        }
    },
});
```

## Implementation Recommendation

### For Development

Use **Option 3 (Timestamp-based)** for development:

- Automatically updates when files change
- No manual version bumping required
- Easy to implement

### For Production

Use **Option 1 (Version-based)** for production:

- Controlled cache invalidation
- Semantic versioning alignment
- Professional deployment practice

## Browser Cache Clearing Commands

For users experiencing cache issues, provide these instructions:

### Hard Refresh

- **Windows/Linux**: `Ctrl + F5` or `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

### Clear ComfyUI Cache

```javascript
// Run in browser console to clear ComfyUI-specific cache
localStorage.clear();
sessionStorage.clear();
```

### Developer Tools

1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

## Testing Cache Busting

### Verification Steps

1. **Deploy JavaScript changes**
2. **Check file URLs include version/hash parameters**
3. **Verify browser loads new content**
4. **Test functionality works as expected**

### Debug Commands

```javascript
// Check loaded extension files in browser console
console.log(document.querySelectorAll('script[src*="swiss-army-knife"]'));

// Check for version parameters
Array.from(document.querySelectorAll('script')).forEach((script) => {
    if (script.src.includes('swiss-army-knife')) {
        console.log('Swiss Army Knife script:', script.src);
    }
});
```

## Related Files

- `__init__.py` - Web directory registration and version management
- `web/js/swiss-army-knife.js` - Main JavaScript extension
- `pyproject.toml` - Version source for cache busting
- Browser developer tools - Cache debugging and clearing

## Implemented Solution

### Current Implementation

The project now includes a comprehensive cache busting solution:

#### 1. Version-Based Cache Busting (`__init__.py`)

```python
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

VERSION = get_version()
```

#### 2. JavaScript Version Tracking (`web/js/swiss-army-knife.js`)

```javascript
// Version and cache busting info
const EXTENSION_VERSION = '1.4.0'; // Should match pyproject.toml version
const LOAD_TIMESTAMP = new Date().toISOString();

console.log(
    `Loading swiss-army-knife.js extension v${EXTENSION_VERSION} at ${LOAD_TIMESTAMP}`,
);
```

#### 3. Development Utilities

- **Cache clearing function**: `clearSwissArmyKnifeCache()` in browser console
- **Force reload function**: `reloadSwissArmyKnife()` in browser console
- **Automatic version update notifications**

#### 4. Cache Busting Script (`scripts/cache_bust.sh`)

```bash
# Automatically sync version between pyproject.toml and JavaScript
./scripts/cache_bust.sh

# Generates cache_info.json with version, hash, and timestamp
```

### Usage

#### For Developers

1. **Make changes to JavaScript files**
2. **Run cache busting script**:
    ```bash
    ./scripts/cache_bust.sh
    ```
3. **Restart ComfyUI server** (Python changes only)
4. **Hard refresh browser** (Ctrl+F5 / Cmd+Shift+R)

#### For Users Experiencing Cache Issues

1. **Browser console commands** (development only):

    ```javascript
    clearSwissArmyKnifeCache(); // Clear cache and reload
    reloadSwissArmyKnife(); // Force reload with cache bypass
    ```

2. **Manual browser cache clearing**:
    - Hard refresh: `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
    - Developer Tools → Network tab → "Disable cache"
    - Settings → Clear browsing data

#### Automated Features

- **Version change detection**: Automatically shows notification when extension updates
- **Development mode detection**: Additional utilities available on localhost
- **Hash-based integrity checking**: File content hashes for validation

## Notes

- ComfyUI automatically serves files from `WEB_DIRECTORY`
- JavaScript changes require browser cache refresh (not server restart)
- Version-based cache busting provides most reliable user experience
- Consider both development and production deployment workflows
- Development utilities are only available on localhost/127.0.0.1
- Cache busting script automatically syncs versions between Python and JavaScript
