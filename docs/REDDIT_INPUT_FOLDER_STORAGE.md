# Reddit Media Storage in ComfyUI Input Folder

## Overview

Updated the Reddit media downloading functionality to save downloaded files to the ComfyUI input folder instead of using temporary files. This provides better file management, persistence, and consistency with the "Upload Media" workflow.

## Previous Behavior

- Reddit media was downloaded to temporary files using `tempfile.NamedTemporaryFile()`
- Files were stored in system temp directory (e.g., `/tmp/`)
- Files could be deleted by system cleanup or disappear between sessions
- No consistent naming or organization

## New Behavior

- Reddit media is now downloaded directly to the ComfyUI input folder
- Files persist between sessions and are available in ComfyUI's file browser
- Consistent naming convention for easy identification
- Same folder structure as "Upload Media" option

## Implementation Details

### File Storage Location

```python
# Get ComfyUI input directory (same logic as Upload Media mode)
try:
    import folder_paths
    input_dir = folder_paths.get_input_directory()
except ImportError:
    input_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "input")
```

### Filename Generation

Files are saved with a descriptive, unique naming convention:

```python
# Create unique filename: reddit_{title}_{hash}.{ext}
url_hash = hashlib.md5(reddit_url.encode()).hexdigest()[:8]
safe_title = "".join(c for c in post_title[:30] if c.isalnum() or c in (' ', '-', '_')).strip()
safe_title = safe_title.replace(' ', '_') if safe_title else 'reddit_media'
filename = f"reddit_{safe_title}_{url_hash}{file_ext}"
```

**Filename Examples:**

- `reddit_Amazing_Cat_Video_a1b2c3d4.mp4`
- `reddit_Beautiful_Sunset_e5f6g7h8.jpg`
- `reddit_reddit_media_i9j0k1l2.webm` (for posts with non-alphanumeric titles)

### Directory Management

```python
# Ensure input directory exists
os.makedirs(input_dir, exist_ok=True)

# Write media content to input directory
with open(file_path, 'wb') as f:
    f.write(media_response.content)
```

## Benefits

### 1. **File Persistence**

- Downloaded Reddit media persists between ComfyUI sessions
- Files remain available for reuse without re-downloading
- Consistent with other ComfyUI media handling

### 2. **Better Organization**

- All media files in one location (input folder)
- Descriptive filenames make identification easy
- Hash-based uniqueness prevents filename conflicts

### 3. **ComfyUI Integration**

- Files appear in ComfyUI's built-in file browser
- Can be referenced by other nodes that expect input folder files
- Consistent with ComfyUI's file management patterns

### 4. **Debugging and Development**

- Downloaded files remain accessible for debugging
- Can manually inspect downloaded media
- Easier to troubleshoot download issues

## User Experience Changes

### Media Info Display

The processing info now shows the saved filename:

```
📹 Video Processing Info (Reddit Post):
• Title: Amazing Cat Video
• Source: https://www.reddit.com/r/cats/comments/example
• Saved as: reddit_Amazing_Cat_Video_a1b2c3d4.mp4
• File Size: 2.5 MB
• Content Type: video/mp4
```

### File Availability

- Downloaded Reddit media appears in ComfyUI input folder
- Files can be reused by selecting "Upload Media" mode and choosing the previously downloaded file
- Manual file management possible through file system

## Technical Details

### Error Handling

```python
# Ensure input directory exists
os.makedirs(input_dir, exist_ok=True)

# Safe filename generation
safe_title = "".join(c for c in post_title[:30] if c.isalnum() or c in (' ', '-', '_')).strip()
safe_title = safe_title.replace(' ', '_') if safe_title else 'reddit_media'
```

### Filename Safety

- Only alphanumeric characters, spaces, hyphens, and underscores allowed
- Spaces converted to underscores
- 30-character limit on title portion
- Fallback to 'reddit_media' for posts with no valid characters
- 8-character hash ensures uniqueness

### File Extension Detection

```python
# Determine file extension from content type or URL
content_type = media_response.headers.get('content-type', '')
file_ext = mimetypes.guess_extension(content_type) if content_type else None

if not file_ext:
    # Fallback to URL extension
    parsed_media_url = urlparse(media_url)
    if '.' in parsed_media_url.path:
        file_ext = '.' + parsed_media_url.path.split('.')[-1].lower()

if not file_ext:
    file_ext = '.mp4' if media_type == 'video' else '.jpg'
```

## Compatibility

### Backward Compatibility

- ✅ Existing workflows continue to work
- ✅ No changes to API or parameters
- ✅ Same return values and behavior

### Forward Compatibility

- ✅ Files persist for reuse
- ✅ Integrates with ComfyUI file system
- ✅ Supports future file management features

## File Management

### Automatic Cleanup

The system does not automatically delete downloaded Reddit media files. Users can:

1. **Manual cleanup**: Delete files from the input folder as needed
2. **ComfyUI management**: Use ComfyUI's built-in file management if available
3. **System management**: Files follow standard filesystem permissions

### Storage Considerations

- Files persist until manually deleted
- Large Reddit videos consume disk space
- Consider periodic cleanup of old Reddit downloads
- Monitor input folder size for storage management

## Testing

### Validated Scenarios

- ✅ **RedGifs videos**: Downloaded to input folder with proper naming
- ✅ **Reddit images**: Saved with descriptive filenames
- ✅ **Gallery posts**: First media item downloaded and saved
- ✅ **Long titles**: Properly truncated and sanitized
- ✅ **Special characters**: Safely handled in filenames
- ✅ **Duplicate URLs**: Hash ensures unique filenames

### Test Cases

1. **Download same Reddit post twice**: Should create same filename (no duplicates)
2. **Posts with special characters**: Should create safe filenames
3. **Very long post titles**: Should truncate to 30 characters
4. **Different file types**: Should get appropriate extensions

## Related Files

- `utils/nodes.py`: Main implementation with updated download logic
- `docs/REDDIT_POST_MEDIA_SOURCE.md`: Original Reddit feature documentation
- `docs/VIDEO_TRIMMING_REDGIFS_FIX.md`: RedGifs URL extraction fix

## Future Enhancements

1. **File Deduplication**: Skip download if identical file already exists
2. **Cleanup Options**: Add automatic cleanup of old downloads
3. **Subfolder Organization**: Organize by date or subreddit
4. **Download History**: Track downloaded files and metadata
5. **Batch Downloads**: Support multiple Reddit URLs at once
