# Temporary Directory Utilities

## Overview

ComfyUI-SwissArmyKnife uses a centralized temporary directory utility (`nodes/utils/temp_utils.py`) to ensure all temporary files and directories respect ComfyUI's configuration, especially in Docker environments with custom base directories.

## Why This Matters

### Problem with Standard Python tempfile

- `tempfile.gettempdir()` returns the system temp directory (e.g., `/tmp` on Linux)
- In Docker, this is the container's `/tmp`, not the ComfyUI workspace
- Files are isolated from the host and don't respect `--base-directory`

### Solution: ComfyUI-Aware Temp Directory

- Uses ComfyUI's `folder_paths.get_user_directory()` + `/temp`
- Respects `--base-directory` flag in Docker setups
- Falls back to system temp when ComfyUI not available
- Ensures consistent behavior across different deployment scenarios

## Usage

### Getting Base Temp Directory

```python
from ..utils.temp_utils import get_temp_directory

# Get ComfyUI's temp directory
temp_dir = get_temp_directory()
# Returns: /workspace/ComfyUI/user/temp (in Docker)
# Or: <user_dir>/temp (local install)
```

### Getting a Temp Subdirectory

```python
from ..utils.temp_utils import get_temp_subdirectory

# Create/get a subdirectory within temp
frames_dir = get_temp_subdirectory("comfyui_frames")
# Returns: /workspace/ComfyUI/user/temp/comfyui_frames
```

### Getting a Temp File Path

```python
from ..utils.temp_utils import get_temp_file_path

# Get a temp file path with specific extension
temp_video = get_temp_file_path(suffix='.mp4', prefix='trimmed', subdir='videos')
# Returns: /workspace/ComfyUI/user/temp/videos/trimmed_a1b2c3d4.mp4

# Use it like a regular file path
with open(temp_video, 'wb') as f:
    f.write(video_data)
```

## Implementation Details

### Directory Structure

When using Docker with `--base-directory /workspace/ComfyUI`:

```
/workspace/ComfyUI/
├── user/
│   └── temp/                          # Base temp directory
│       ├── comfyui_frames/           # Frame extraction subdirectory
│       │   └── frames_video_abc123/  # Per-video frame storage
│       ├── videos/                    # Video processing subdirectory
│       │   └── trimmed_xyz789.mp4    # Temporary trimmed videos
│       └── downloads/                 # Downloaded media subdirectory
│           └── reddit_media_def456.jpg
```

### Fallback Behavior

1. **ComfyUI Available**: Uses `folder_paths.get_user_directory() + '/temp'`
2. **ComfyUI Unavailable**: Falls back to `tempfile.gettempdir()`

This ensures compatibility with:

- Local ComfyUI installations
- Docker deployments with custom base directories
- Standalone testing/development environments

## Nodes Using Temp Utils

All nodes that create temporary files have been updated:

1. **Media Selection** (`nodes/media_selection/media_selection.py`)
    - Uses `get_temp_file_path(suffix='.mp4', subdir='videos')` for video trimming
2. **Media Describe** (`nodes/media_describe/mediia_describe.py`)
    - Uses `get_temp_file_path(suffix=file_ext, subdir='downloads')` for Reddit downloads
    - Uses `get_temp_file_path(suffix='.mp4', subdir='videos')` for video trimming

## Docker Configuration

In your `docker-compose.yml`:

```yaml
command: python main.py --listen 0.0.0.0 --port 8188 --cpu --base-directory /workspace/ComfyUI
```

With this setup:

- Temp files: `/workspace/ComfyUI/user/temp/...`
- Mounted to host: `./.comfyui/user/temp/...`
- Persistent across container restarts

## Benefits

✅ **Consistent behavior** across Docker and local installations  
✅ **Respects ComfyUI configuration** (`--base-directory`, `--temp-directory`)  
✅ **Better file organization** with subdirectories  
✅ **Works in mounted volumes** (accessible from host)  
✅ **Graceful fallback** when ComfyUI not available

## Migration from Python tempfile

### Before

```python
import tempfile

# Old way - uses system /tmp
base_temp_dir = tempfile.gettempdir()

# Or
with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
    temp_path = temp_file.name
```

### After

```python
from ..utils.temp_utils import get_temp_subdirectory, get_temp_file_path

# New way - uses ComfyUI temp directory
base_temp_dir = get_temp_subdirectory("my_subdir")

# Or
temp_path = get_temp_file_path(suffix='.mp4', prefix='my_prefix', subdir='my_subdir')
```
