# get_version() Import Error Fix

## Problem

ComfyUI was failing to import the custom node with the error:

```
Cannot import /comfyui-nvidia/custom_nodes/ComfyUI-SwissArmyKnife module for custom nodes: name 'get_version' is not defined
```

## Root Cause

The `__init__.py` file was calling `get_version()` on line 29, but the function was never defined or imported. This was likely removed during a previous refactoring or merge conflict.

## Solution

Added the missing `get_version()` function to `__init__.py`. The function:

1. Attempts to read the version from `pyproject.toml` using Python's `tomllib` module
2. Falls back to a timestamp-based version if reading fails
3. Returns the version string for cache busting purposes

## Implementation

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
```

## Notes

- The function uses `tomllib` which is available in Python 3.11+
- For older Python versions, the fallback timestamp mechanism ensures the module still loads
- The VERSION is used for JavaScript cache busting (see `JAVASCRIPT_CACHE_BUSTING.md`)
- Current version in `pyproject.toml` is `2.0.0`

## Verification

After the fix, the module should import successfully in ComfyUI. Verify with:

```bash
python3 -m py_compile __init__.py  # Should complete without errors
```

## Related Documentation

- `JAVASCRIPT_CACHE_BUSTING.md` - Details on how VERSION is used for cache busting
- `CACHE_BUSTING_SUMMARY.md` - Overview of cache busting implementation

## Date

Fixed: October 1, 2025
