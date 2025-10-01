# Gemini API 500 Error Fix

## Problem Description

Users were experiencing 500 INTERNAL server errors when processing videos through the Gemini API, particularly with Reddit-downloaded videos. The error occurred during the video analysis phase after successful media download.

**Error Pattern:**

```
Exception in describe_media: 500 INTERNAL <error details>
```

## Root Cause Analysis

The Gemini API has strict limitations on:

1. **File Size**: Maximum 50 MB per video file
2. **Video Format**: Specific MIME type requirements
3. **Processing Duration**: Long videos may timeout or exceed processing limits

Reddit videos often exceed these limits, causing server-side failures.

## Solution Implementation

### 1. Video File Size Validation

Added comprehensive size checking before Gemini API calls:

```python
# Validate video size and format for Gemini API
max_file_size_mb = 50  # Gemini's file size limit
if file_size > max_file_size_mb:
    raise ValueError(f"Video file too large for Gemini API: {file_size:.2f} MB (max: {max_file_size_mb} MB). Try reducing max_duration.")
```

### 2. MIME Type Detection

Implemented proper MIME type detection for video format compatibility:

```python
# Determine correct MIME type based on file extension
video_mime_type = "video/mp4"  # Default
if final_video_path.lower().endswith(('.webm',)):
    video_mime_type = "video/webm"
elif final_video_path.lower().endswith(('.mov',)):
    video_mime_type = "video/quicktime"
elif final_video_path.lower().endswith(('.avi',)):
    video_mime_type = "video/x-msvideo"
```

### 3. Enhanced Error Messages

Added specific error handling with actionable user guidance:

```python
if "500 INTERNAL" in error_msg:
    error_msg += "\n\nThis is a Gemini API server error. Try:\n- Using a shorter video (reduce max_duration)\n- Waiting a few minutes and trying again\n- Using a different video source"
elif "413" in error_msg or "too large" in error_msg.lower():
    error_msg += "\n\nVideo file is too large. Try reducing max_duration to create a smaller video."
elif "unsupported" in error_msg.lower():
    error_msg += "\n\nVideo format may not be supported. Try with a different video."
```

### 4. Improved Logging

Added detailed video processing information:

```python
print(f"Processing video: {file_size:.2f} MB, {actual_duration:.2f}s, MIME: {video_mime_type}")
```

## Prevention Strategies

### For Users

1. **Reduce max_duration**: Start with 10-15 seconds for Reddit videos
2. **Monitor file sizes**: Check video info output for size warnings
3. **Use shorter clips**: Prefer shorter, focused video segments
4. **Wait between retries**: Gemini API may have rate limiting

### For Developers

1. **Proactive validation**: Check file size before API calls
2. **Format conversion**: Consider converting to optimal formats (MP4)
3. **Duration limiting**: Automatically trim long videos
4. **Retry logic**: Implement exponential backoff for temporary failures

## Technical Details

### File Size Calculation

```python
file_stats = os.stat(final_video_path)
file_size = file_stats.st_size / (1024 * 1024)  # Convert to MB
```

### MIME Type Mapping

- `.mp4` → `video/mp4` (preferred)
- `.webm` → `video/webm`
- `.mov` → `video/quicktime`
- `.avi` → `video/x-msvideo`

### Validation Flow

1. Process video (trim if needed)
2. Check file size against 50 MB limit
3. Determine MIME type from extension
4. Log processing details
5. Upload to Gemini with correct MIME type
6. Provide specific error messages if failure occurs

## Testing

### Validated Scenarios

- ✅ Large Reddit videos (>50MB) now show clear error messages
- ✅ Proper MIME type detection for different video formats
- ✅ Informative error messages guide users to solutions
- ✅ File size logging helps debug issues

### Test Cases

1. **Large Video**: Use max_duration=60 with long Reddit video → Should show size error
2. **Different Formats**: Test .webm, .mov, .avi files → Should detect correct MIME types
3. **API Failures**: Trigger 500 errors → Should show helpful retry suggestions

## Future Improvements

1. **Automatic Compression**: Reduce video quality for large files
2. **Format Conversion**: Convert unsupported formats to MP4
3. **Progressive Trimming**: Auto-reduce duration if file too large
4. **Retry Logic**: Implement automatic retries with backoff
5. **Quality Presets**: Offer low/medium/high quality options

## Related Files

- `utils/nodes.py`: Main implementation
- `docs/REDDIT_POST_MEDIA_SOURCE.md`: Reddit feature documentation
- `web/js/swiss-army-knife.js`: Frontend Reddit URL widget

## Deployment Notes

- No ComfyUI server restart required (Python code changes)
- Users need to refresh browser cache if frontend changes made
- Compatible with existing workflows
- Backward compatible with existing media sources

## Performance Impact

- **Minimal overhead**: File size check is very fast
- **Better user experience**: Clear errors instead of mysterious failures
- **Reduced API waste**: Prevents doomed API calls
- **Faster debugging**: Detailed logging helps identify issues quickly
