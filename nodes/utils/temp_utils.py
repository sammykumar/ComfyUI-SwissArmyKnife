"""
Temporary directory utilities for ComfyUI-SwissArmyKnife.
Provides ComfyUI-aware temporary file and directory management that respects
the --base-directory and --temp-directory flags.
"""

import os
import tempfile
from typing import Optional

try:
    import folder_paths
    COMFYUI_AVAILABLE = True
except ImportError:
    folder_paths = None
    COMFYUI_AVAILABLE = False


def get_temp_directory() -> str:
    """
    Get the base temporary directory for ComfyUI operations.
    
    This function respects ComfyUI's configuration:
    - Uses ComfyUI's user directory + '/temp' if available
    - Falls back to system temp directory if ComfyUI not available
    
    When using Docker with --base-directory, this ensures temp files
    are stored within the ComfyUI workspace rather than the container's /tmp.
    
    Returns:
        str: Path to the base temporary directory
    """
    if COMFYUI_AVAILABLE and folder_paths is not None:
        try:
            # Use ComfyUI's user directory for temp files
            user_dir = folder_paths.get_user_directory()
            temp_dir = os.path.join(user_dir, "temp")
            os.makedirs(temp_dir, exist_ok=True)
            return temp_dir
        except Exception as e:
            print(f"Warning: Could not get ComfyUI temp directory: {e}")

    # Fallback to system temp directory
    return tempfile.gettempdir()


def get_temp_subdirectory(subdir_name: str) -> str:
    """
    Get or create a subdirectory within ComfyUI's temp directory.
    
    Args:
        subdir_name: Name of the subdirectory to create
        
    Returns:
        str: Path to the subdirectory
        
    Example:
        frames_dir = get_temp_subdirectory("comfyui_frames")
    """
    base_temp = get_temp_directory()
    subdir = os.path.join(base_temp, subdir_name)
    os.makedirs(subdir, exist_ok=True)
    return subdir


def get_temp_file_path(suffix: str = "", prefix: str = "tmp", subdir: Optional[str] = None) -> str:
    """
    Generate a temporary file path within ComfyUI's temp directory.
    
    This is a replacement for tempfile.NamedTemporaryFile that respects
    ComfyUI's base directory configuration.
    
    Args:
        suffix: File extension (e.g., '.mp4', '.jpg')
        prefix: Filename prefix (default: 'tmp')
        subdir: Optional subdirectory within temp (e.g., 'video_processing')
        
    Returns:
        str: Full path to the temporary file (file is NOT created)
        
    Example:
        temp_video = get_temp_file_path(suffix='.mp4', subdir='videos')
        # Use the path to write your file
        with open(temp_video, 'wb') as f:
            f.write(video_data)
    """
    if subdir:
        base_temp = get_temp_subdirectory(subdir)
    else:
        base_temp = get_temp_directory()

    # Generate a unique filename
    import uuid
    unique_id = uuid.uuid4().hex[:8]
    filename = f"{prefix}_{unique_id}{suffix}"

    return os.path.join(base_temp, filename)
