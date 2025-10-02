# Video Preview Node - TypeError Fix

**Date:** October 2, 2025  
**Issue:** `TypeError: 'int' object is not iterable`  
**Status:** ✅ Fixed

## Problem Description

When executing the VideoPreview node in ComfyUI, the workflow failed with:

```
TypeError: 'int' object is not iterable
```

**Error Location:**

```python
File "/workspace/ComfyUI/execution.py", line 384, in get_output_from_returns
    ui = {k: [y for x in uis for y in x[k]] for k in uis[0].keys()}
```

## Root Cause

ComfyUI expects **all values** in the `ui` dictionary returned by output nodes to be **lists**.

The original code was returning:

```python
return {
    "ui": {
        "connected_inputs": connected_inputs,  # This is a list ✓
        "input_count": len(connected_inputs)   # This is an int ✗
    }
}
```

ComfyUI's execution code tries to iterate over all values in the `ui` dict, expecting them to be lists. When it encountered the integer `input_count`, it failed.

## The Fix

Changed the return statement to wrap **all values in lists**:

```python
return {
    "ui": {
        "connected_inputs": [connected_inputs],  # List wrapped in list
        "input_count": [len(connected_inputs)]   # Int wrapped in list
    }
}
```

## Testing

Verified the fix works correctly:

```python
# Test output with reference_vid connected:
{
    "ui": {
        "connected_inputs": [["reference_vid"]],  # ✓ List of list
        "input_count": [1]                        # ✓ List containing int
    }
}
```

Both values are now properly wrapped in lists and can be iterated by ComfyUI's execution system.

## Key Lesson

**ComfyUI UI Return Format Rule:**

When returning data from an `OUTPUT_NODE` in the `ui` dictionary:

- ✅ **All values MUST be lists**
- ✅ Even single integers, strings, or booleans must be wrapped: `[value]`
- ✅ Lists should be wrapped in another list: `[my_list]`
- ✅ This applies to all keys in the `ui` dictionary

## Example Patterns

### ❌ Wrong

```python
return {
    "ui": {
        "text": "hello",           # String - will fail
        "count": 5,                # Int - will fail
        "items": ["a", "b"],       # List - might work but inconsistent
    }
}
```

### ✅ Correct

```python
return {
    "ui": {
        "text": ["hello"],         # String wrapped in list
        "count": [5],              # Int wrapped in list
        "items": [["a", "b"]],     # List wrapped in list
    }
}
```

## Files Modified

- `nodes/utils/video_preview.py` - Fixed return format
- `docs/VIDEO_PREVIEW_TYPEERROR_FIX.md` - This documentation

## Related Issues

This is a common issue when creating custom output nodes for ComfyUI. The error message isn't immediately obvious about the cause (list wrapping requirement).

## References

- ComfyUI execution.py: `get_output_from_returns()` function
- ComfyUI docs: https://docs.comfy.org/custom-nodes/backend/server_overview

---

**Fix Verified:** ✅  
All linting checks pass, and the node now executes successfully in ComfyUI workflows.
