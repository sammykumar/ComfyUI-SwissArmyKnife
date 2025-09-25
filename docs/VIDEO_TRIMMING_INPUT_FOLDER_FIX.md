# Video Trimming ComfyUI Input Folder Fix

## Problem Description

When videos were trimmed due to `max_duration` settings, the trimmed video files were being saved to the system temporary directory (`/tmp/`) instead of the ComfyUI input folder. This caused issues when trying to pass the video path to other ComfyUI nodes like "Load Video" which expect files to be in the input folder.

**Error Pattern:**

```
Trimming video: /comfyui-nvidia/input/reddit_Taking_the_skin_canoe_down_the_7455ef86.mp4 -> /tmp/tmphgwavmnx.mp4 (duration: 5.0s)
Successfully trimmed video to /tmp/tmphgwavmnx.mp4
...
Exception: video is not a valid path: 🤖 Gemini Analysis Status: ✅ Complete
```

## Root Cause Analysis

The video trimming logic was using `tempfile.NamedTemporaryFile()` to create trimmed video files:

```python
# OLD CODE - Created temporary files
with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
    trimmed_video_path = temp_file.name
```

This resulted in:

1. **Trimmed videos saved to `/tmp/`** instead of ComfyUI input folder
2. **Path incompatibility** with other ComfyUI nodes expecting input folder paths
3. **File management issues** - trimmed videos not accessible through ComfyUI interface

## Solution Implementation

### 1. **ComfyUI Input Folder Storage**

Updated video trimming to save trimmed videos to the ComfyUI input folder:

```python
# NEW CODE - Save to ComfyUI input folder
try:
    import folder_paths
    input_dir = folder_paths.get_input_directory()
except ImportError:
    input_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "input")

# Ensure input directory exists
os.makedirs(input_dir, exist_ok=True)

# Create trimmed video filename based on original file
base_name = os.path.splitext(os.path.basename(selected_media_path))[0]
trimmed_filename = f"{base_name}_trimmed_{actual_duration:.1f}s.mp4"
trimmed_video_path = os.path.join(input_dir, trimmed_filename)
```

### 2. **Descriptive Filename Generation**

Trimmed videos now have descriptive filenames that indicate their purpose:

**Filename Format**: `{original_name}_trimmed_{duration}s.mp4`

**Examples:**

- `reddit_Taking_the_skin_canoe_down_the_7455ef86_trimmed_5.0s.mp4`
- `my_video_trimmed_10.0s.mp4`
- `sample_content_trimmed_3.5s.mp4`

### 3. **Improved Logging**

Added better logging to show where trimmed videos are saved:

```python
print(f"Attempting to trim video from {original_duration:.2f}s to {actual_duration:.2f}s")
print(f"Trimmed video will be saved to: {trimmed_video_path}")
...
print(f"Successfully trimmed video and saved to input folder: {trimmed_filename}")
```

### 4. **Consistent Path Management**

Ensured `trimmed_video_output_path` is correctly set in all scenarios:

```python
# When trimming succeeds
trimmed_video_output_path = trimmed_video_path

# When trimmed file is empty or missing
trimmed_video_output_path = selected_media_path

# When trimming fails
trimmed_video_output_path = selected_media_path
```

## Technical Details

### Directory Management

```python
# Get ComfyUI input directory (same logic as other file operations)
try:
    import folder_paths
    input_dir = folder_paths.get_input_directory()
except ImportError:
    input_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "input")

# Ensure directory exists
os.makedirs(input_dir, exist_ok=True)
```

### Filename Safety

- **Base name extraction**: Uses original filename without extension
- **Duration inclusion**: Shows exact trimmed duration in filename
- **Extension consistency**: Always uses `.mp4` for trimmed videos
- **Path resolution**: Full path construction for ComfyUI compatibility

### Error Handling

```python
# Verify trimmed file exists and has content
if os.path.exists(trimmed_video_path) and os.path.getsize(trimmed_video_path) > 0:
    print(f"Successfully trimmed video and saved to input folder: {trimmed_filename}")
else:
    print(f"Warning: Trimmed video file is empty or missing, using original")
    final_video_path = selected_media_path
    trimmed_video_output_path = selected_media_path
    trimmed = False
```

## Benefits

### 1. **ComfyUI Node Compatibility**

- Trimmed videos can be passed to "Load Video" and other ComfyUI nodes
- Paths are recognized by ComfyUI's file system
- No more "invalid path" errors

### 2. **File Management**

- Trimmed videos appear in ComfyUI input folder
- Accessible through ComfyUI's file browser interface
- Persistent between sessions

### 3. **Better Organization**

- Descriptive filenames make purpose clear
- Duration information in filename helps identify content
- All video files centralized in input folder

### 4. **Debugging and Development**

- Trimmed videos remain accessible for inspection
- Clear logging shows where files are saved
- Easier to troubleshoot video processing issues

## Expected Behavior Changes

### Before Fix

```
Trimming video: /input/original.mp4 -> /tmp/tmpXXXXXX.mp4 (duration: 5.0s)
Successfully trimmed video to /tmp/tmpXXXXXX.mp4
...
Exception: video is not a valid path: [status output]
```

### After Fix

```
Trimming video: /input/reddit_video_12345678.mp4 -> /input/reddit_video_12345678_trimmed_5.0s.mp4 (duration: 5.0s)
Trimmed video will be saved to: /input/reddit_video_12345678_trimmed_5.0s.mp4
Successfully trimmed video and saved to input folder: reddit_video_12345678_trimmed_5.0s.mp4
...
[Video successfully processed by subsequent nodes]
```

## File Structure Impact

### Input Folder Contents

The ComfyUI input folder will now contain:

```
input/
├── reddit_Taking_the_skin_canoe_down_the_7455ef86.mp4          # Original download
├── reddit_Taking_the_skin_canoe_down_the_7455ef86_trimmed_5.0s.mp4  # Trimmed version
├── other_video.mp4                                             # Other original files
├── other_video_trimmed_10.0s.mp4                             # Other trimmed files
└── ...
```

### File Relationships

- **Original files**: Downloaded Reddit media or uploaded files
- **Trimmed files**: Generated when `max_duration` < original duration
- **Naming pattern**: Clear relationship between original and trimmed files
- **No duplicates**: Trimming same file with same duration reuses filename

## Compatibility

### Backward Compatibility

- ✅ **Existing workflows**: Continue to work without changes
- ✅ **API compatibility**: Same function signatures and return values
- ✅ **Parameter handling**: No changes to user-facing parameters

### Forward Compatibility

- ✅ **Node integration**: Compatible with all ComfyUI video nodes
- ✅ **Path handling**: Uses standard ComfyUI path conventions
- ✅ **File management**: Integrates with ComfyUI's file system

## Performance Impact

- **Minimal overhead**: Directory creation and filename generation are fast
- **Storage efficiency**: Files stored in organized, accessible location
- **Network efficiency**: No change to download or processing logic
- **Memory efficiency**: No additional memory usage

## Testing

### Validated Scenarios

- ✅ **Reddit video trimming**: RedGifs videos trimmed and saved to input folder
- ✅ **Upload video trimming**: Uploaded videos trimmed and saved properly
- ✅ **Random video trimming**: Random selection videos trimmed correctly
- ✅ **Long filenames**: Handles long original filenames appropriately
- ✅ **Duration formatting**: Correct decimal formatting in filenames
- ✅ **Path compatibility**: Trimmed files work with Load Video node

### Test Cases

1. **Basic trimming**: 10s video trimmed to 5s → Creates `video_trimmed_5.0s.mp4`
2. **No trimming needed**: 3s video with 5s max → Uses original file
3. **Error handling**: FFmpeg failure → Falls back to original file
4. **Path resolution**: Various input folder configurations → Correct paths generated

## Related Files

- `utils/nodes.py`: Main implementation with updated video trimming logic
- `docs/REDDIT_INPUT_FOLDER_STORAGE.md`: Reddit download folder documentation
- `docs/VIDEO_TRIMMING_REDGIFS_FIX.md`: RedGifs URL extraction fix

## Future Enhancements

1. **Cleanup Management**: Automatic removal of old trimmed files
2. **Compression Options**: Quality settings for trimmed videos
3. **Batch Processing**: Trim multiple videos at once
4. **Cache Management**: Reuse existing trimmed files when possible
5. **Metadata Preservation**: Maintain video metadata in trimmed files
