# Async Event Loop Fix for ComfyUI Integration

## Issue Description

When running the LoRA Info Extractor in ComfyUI, users encountered this error:

```
Error fetching CivitAI data for /path/to/lora.safetensors: Cannot run the event loop while another loop is running
```

## Root Cause

ComfyUI runs its own asyncio event loop, and our CivitAI service was attempting to create a new event loop using `asyncio.run()` or `new_event_loop().run_until_complete()`. This created a conflict because:

1. ComfyUI's main thread already has an active event loop
2. You cannot run `asyncio.run()` when an event loop is already running
3. Creating a new event loop in the same thread causes synchronization issues

## Solution Implemented

Updated the `_run_async()` method in `CivitAIService` to use thread-based async handling:

### Before (Problematic)

```python
def _run_async(self, coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)

    # This approach failed in ComfyUI
    new_loop = asyncio.new_event_loop()
    try:
        return new_loop.run_until_complete(coro)
    finally:
        new_loop.close()
```

### After (Fixed)

```python
def _run_async(self, coro):
    import concurrent.futures

    try:
        # Check if we're in an event loop
        loop = asyncio.get_running_loop()
        # If we are, run the coroutine in a separate thread
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(self._run_in_thread, coro)
            return future.result()
    except RuntimeError:
        # No event loop running, use asyncio.run directly
        return asyncio.run(coro)

def _run_in_thread(self, coro):
    """Run coroutine in a new event loop in the current thread."""
    new_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(new_loop)
    try:
        return new_loop.run_until_complete(coro)
    finally:
        new_loop.close()
        asyncio.set_event_loop(None)
```

## How It Works

1. **Detection**: Check if an event loop is already running using `asyncio.get_running_loop()`
2. **Thread Isolation**: If a loop exists, run the async operation in a separate thread
3. **Clean Execution**: Create a new event loop in the thread, run the coroutine, then clean up
4. **Fallback**: If no loop is running, use standard `asyncio.run()`

## Benefits

- ✅ **Compatible with ComfyUI**: Works seamlessly within ComfyUI's event loop
- ✅ **Thread Safe**: Isolates async operations to prevent conflicts
- ✅ **Backward Compatible**: Still works in non-event-loop environments
- ✅ **Clean Resource Management**: Properly closes event loops and threads

## Testing

The fix was validated with:

- Service initialization outside event loops
- Service calls within active event loops (ComfyUI simulation)
- Multiple hash type API calls
- Error handling for 404 responses

## Impact

This fix resolves the blocking issue that prevented the LoRA Info Extractor from working in ComfyUI environments while maintaining compatibility with other usage scenarios.

## Related Files

- `nodes/civitai_service.py` - Main implementation
- `docs/MULTIPLE_HASH_TYPES_CIVITAI_INTEGRATION.md` - Comprehensive documentation

## Date Fixed

September 26, 2025
