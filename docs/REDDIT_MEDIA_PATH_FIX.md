# Reddit Media Download and Video Trimming Path Fix

## Problem

The Reddit media download and video trimming functionality had a critical bug where absolute paths were being returned instead of relative paths, causing issues with ComfyUI node compatibility.

### Specific Issues

1. **Reddit downloads** returned absolute paths like `/comfyui-nvidia/input/reddit_filename.mp4`
2. **Trimmed videos** returned absolute paths like `/comfyui-nvidia/input/trimmed_filename.mp4`
3. **Docker container paths** like `/comfyui-nvidia/` were included in the `processed_media_path` output
4. Other ComfyUI nodes couldn't properly reference these files

## Root Cause

The `processed_media_path` output was returning full absolute filesystem paths instead of paths relative to the ComfyUI input directory. This broke compatibility with other nodes that expect relative paths.

## Solution

### 1. Reddit Media Download Path Fix

**Before:**

```python
file_path = os.path.join(input_dir, filename)
return file_path, media_type, media_info  # Returns absolute path
```

**After:**

```python
# Use appropriate subfolder
subfolder = "swiss_army_knife_videos" if media_type == "video" else "swiss_army_knife_images"
media_subfolder_path = os.path.join(input_dir, subfolder)
file_path = os.path.join(media_subfolder_path, filename)

# Return relative path (subfolder/filename) instead of absolute path
relative_path = os.path.join(subfolder, filename)
return relative_path, media_type, media_info
```

**Main Processing Path Handling:**

```python
# Download returns relative path, but we need absolute for file operations
downloaded_relative_path, detected_media_type, reddit_media_info = self._download_reddit_media(reddit_url)

# Convert relative path back to absolute path for internal processing
selected_media_path = os.path.join(input_dir, downloaded_relative_path)
```

### 2. Video Trimming Path Fix

**Before:**

```python
trimmed_video_path = os.path.join(input_dir, trimmed_filename)
trimmed_video_output_path = trimmed_video_path  # Absolute path
```

**After:**

```python
# Use swiss_army_knife_videos subfolder for consistency
video_subfolder = "swiss_army_knife_videos"
video_subfolder_path = os.path.join(input_dir, video_subfolder)
trimmed_video_path = os.path.join(video_subfolder_path, trimmed_filename)

# Store relative path for output (subfolder/filename)
trimmed_video_output_path = os.path.join(video_subfolder, trimmed_filename)
```

### 3. Path Conversion Helper

Added `_convert_absolute_to_relative_path()` helper method to handle conversion of any absolute paths back to relative paths for ComfyUI compatibility:

```python
def _convert_absolute_to_relative_path(self, absolute_path):
    """
    Convert absolute path to relative path for ComfyUI compatibility.
    Returns the path relative to ComfyUI input directory.
    """
    if not absolute_path:
        return ""

    try:
        import folder_paths
        input_dir = folder_paths.get_input_directory()
    except ImportError:
        input_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "input")

    # If path is already relative or doesn't contain input_dir, return as-is
    if not os.path.isabs(absolute_path) or input_dir not in absolute_path:
        return absolute_path

    # Convert absolute path to relative by removing input_dir prefix
    try:
        relative_path = os.path.relpath(absolute_path, input_dir)
        return relative_path
    except ValueError:
        # If can't make relative, return original
        return absolute_path
```

### 4. All Return Paths Fixed

Updated all `processed_media_path` returns to use relative paths:

- **Cached results**: Both image and video cached returns
- **Main processing**: Both image and video main returns
- **Reddit downloads**: Direct relative path return
- **Trimmed videos**: Relative path construction

## Subfolder Structure

Ensured consistent subfolder usage:

- **Videos**: `swiss_army_knife_videos/filename.mp4`
- **Images**: `swiss_army_knife_images/filename.jpg`

This applies to:

- Reddit downloads
- Trimmed videos
- Uploaded media (already working)

## Files Modified

- `utils/nodes.py`:
    - `_download_reddit_media()` method
    - `_process_video()` method
    - `_process_image()` method
    - Added `_convert_absolute_to_relative_path()` helper
    - Updated all return statements

## Testing

The fix ensures:

1. **Reddit videos** are downloaded to `input/swiss_army_knife_videos/reddit_*.mp4`
2. **Reddit images** are downloaded to `input/swiss_army_knife_images/reddit_*.jpg`
3. **Trimmed videos** are saved to `input/swiss_army_knife_videos/*_trimmed_*.mp4`
4. **`processed_media_path` output** contains relative paths like `swiss_army_knife_videos/filename.mp4`
5. **Other ComfyUI nodes** can properly reference the processed media files

## Impact

This fix resolves the compatibility issue where other ComfyUI nodes couldn't properly load or reference media files processed by the Swiss Army Knife nodes, particularly for Reddit downloads and trimmed videos.
