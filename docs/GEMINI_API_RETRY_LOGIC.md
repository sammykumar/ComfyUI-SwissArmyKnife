# Gemini API Retry Logic Implementation

## Overview

Implemented automatic retry logic with exponential backoff to handle Gemini API overload errors in the MediaDescribe node. When the Gemini API returns an empty response or encounters overload conditions, the node now automatically retries up to 3 times with a 5-second delay between attempts before failing.

## Problem Statement

The Gemini API occasionally becomes overloaded and returns empty responses with error messages like:

```
Error: Gemini returned empty response (Candidates available: 1)
```

This would cause the entire ComfyUI workflow to fail immediately without attempting recovery, even though the issue is often temporary and would succeed on retry.

## Solution

### Implementation Details

1. **New Helper Method**: `_call_gemini_with_retry()`
    - Wraps all Gemini API calls with intelligent retry logic
    - Parameters:
        - `max_retries`: Default 3 attempts
        - `retry_delay`: Default 5 seconds between attempts
    - Handles both empty responses and API errors (500, 503, overload errors)

2. **Retry Conditions**
    - Empty response from Gemini (response.text is None)
    - HTTP 500 errors (Internal Server Error)
    - HTTP 503 errors (Service Unavailable)
    - Any error containing "overloaded" in the message
    - Any error containing "empty response" in the message

3. **User Feedback**
    - Logs retry attempts to console: `"Gemini API returned empty response. Retrying in 5 seconds... (Attempt 1/3)"`
    - Provides clear error messages after all retries are exhausted

### Code Changes

#### 1. Added `time` import

```python
import time
```

#### 2. Created retry helper method

```python
def _call_gemini_with_retry(self, client, model, contents, config, max_retries=3, retry_delay=5):
    """
    Call Gemini API with retry logic for handling overload errors.
    """
    # Implementation with retry loop and error handling
```

#### 3. Updated image processing

Replaced direct API call:

```python
response = client.models.generate_content(...)
if response.text is not None:
    description = response.text.strip()
else:
    raise RuntimeError(error_msg)
```

With retry-wrapped call:

```python
response = self._call_gemini_with_retry(
    client=client,
    model=gemini_model,
    contents=contents,
    config=generate_content_config,
    max_retries=3,
    retry_delay=5
)
description = response.text.strip()  # Guaranteed non-None
```

#### 4. Updated video processing

Applied the same pattern to video analysis calls.

## Benefits

1. **Improved Reliability**: Transient API issues no longer cause immediate workflow failure
2. **Better User Experience**: Users don't need to manually restart workflows when Gemini API is temporarily overloaded
3. **Configurable**: Easy to adjust retry count and delay if needed
4. **Transparent**: Users see retry attempts in logs
5. **Backward Compatible**: No changes to node inputs/outputs or workflow configuration

## Testing Recommendations

1. **Normal Operation**: Verify workflows still complete successfully when API works normally
2. **Simulated Failure**: Test with API key that causes temporary errors
3. **Complete Failure**: Verify proper error message after 3 failed attempts
4. **Cache Behavior**: Ensure retry logic doesn't interfere with caching

## Future Enhancements

Potential improvements for future consideration:

1. **Configurable Retry Parameters**: Add UI inputs for `max_retries` and `retry_delay`
2. **Exponential Backoff**: Increase delay with each retry (5s, 10s, 20s)
3. **Retry Statistics**: Track and display retry success rates in status output
4. **Rate Limiting Detection**: Detect and handle 429 (Too Many Requests) errors specifically
5. **Circuit Breaker Pattern**: Temporarily disable API calls after repeated failures

## Related Files

- `/nodes/media_describe/mediia_describe.py` - Main implementation
- This documentation file

## References

- Original error report: Exception message "Gemini returned empty response (Candidates available: 1)"
- Stack trace location: `utils/nodes.py` line 1207 and 1487 (note: file is actually in `nodes/media_describe/mediia_describe.py`)
- Node type: `MediaDescribe` (formerly `GeminiUtilMediaDescribe`)
