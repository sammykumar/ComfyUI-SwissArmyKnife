# Video Resizing Implementation

## Overview

Added video resizing functionality to the Media Selection node to match the existing image resizing capabilities.

## Implementation Date

October 8, 2025

## Changes Made

### 1. New Method: `_resize_video()`

**Location:** `nodes/media_selection/media_selection.py`

**Purpose:** Resize videos using ffmpeg with the same logic as image resizing

**Supported Modes:**

- **None**: No resizing (original dimensions)
- **Auto (by orientation)**:
    - Landscape (width > height): 832×480
    - Portrait (height ≥ width): 480×832
- **Custom**: User-specified dimensions (resize_width × resize_height)

**Algorithm:**

1. Determine target dimensions based on resize mode
2. Calculate aspect ratios for proper scaling
3. Scale video to fit one dimension (maintaining aspect ratio)
4. Center crop to exact target dimensions
5. Use ffmpeg with high-quality encoding:
    - Video codec: libx264
    - Preset: fast
    - CRF: 23 (good quality/size balance)
    - Audio: copied without re-encoding

**Error Handling:**

- Falls back to original dimensions if ffmpeg fails
- Handles missing ffmpeg gracefully
- Validates output file existence and size

### 2. Updated Method: `_process_video()`

**Changes:**

- Added parameters: `resize_mode`, `resize_width`, `resize_height`
- Calls `_resize_video()` after trimming (if applicable)
- Updates media info text to include resize information
- Returns resized dimensions instead of original when resizing is applied

**Processing Order:**

1. Extract original metadata (dimensions, fps, duration)
2. Trim video (if max_duration specified)
3. Resize video (if resize_mode != "None")
4. Return final path and metadata

### 3. Updated Method: `select_media()`

**Changes:**

- Now passes `resize_mode`, `resize_width`, `resize_height` to `_process_video()`
- Ensures consistent behavior between image and video processing

## Usage Examples

### Example 1: Auto Resize by Orientation

```python
# Landscape video (1920x1080) → 832x480
# Portrait video (1080x1920) → 480x832
resize_mode = "Auto (by orientation)"
```

### Example 2: Custom Dimensions

```python
# Any video → 1024x768
resize_mode = "Custom"
resize_width = 1024
resize_height = 768
```

### Example 3: No Resizing

```python
# Keep original dimensions
resize_mode = "None"
```

## Technical Details

### FFmpeg Command Structure

```bash
ffmpeg -i input.mp4 \
  -vf "scale={scale_width}:{scale_height},crop={target_width}:{target_height}" \
  -c:v libx264 -preset fast -crf 23 \
  -c:a copy \
  -y output.mp4
```

### Aspect Ratio Preservation

The implementation uses a scale-then-crop approach:

1. **Scale**: Resize to fit one dimension while maintaining aspect ratio
2. **Crop**: Center crop to exact target dimensions

This ensures:

- No distortion (aspect ratio preserved during scale)
- Exact output dimensions (center crop to target)
- High visual quality (no stretching)

### Performance Considerations

- **Encoding preset**: "fast" balances speed and quality
- **CRF value**: 23 provides good quality at reasonable file sizes
- **Audio handling**: Audio stream is copied (no re-encoding) for speed
- **Temporary files**: Resized videos stored in temp directory with "resized\_" prefix

## Benefits

1. **Consistency**: Videos and images now support the same resizing modes
2. **Flexibility**: Three resize modes cover most use cases
3. **Quality**: High-quality encoding with proper aspect ratio handling
4. **Performance**: Optimized ffmpeg settings for speed
5. **Robustness**: Graceful error handling and fallbacks

## Requirements

- **FFmpeg**: Must be installed and available in system PATH
- **Python packages**: opencv-python (cv2), subprocess (built-in)

## Future Enhancements

Potential improvements:

1. Support for additional output formats (webm, avi, etc.)
2. Configurable encoding quality (CRF parameter)
3. GPU-accelerated encoding (when available)
4. Batch processing optimization
5. Preview frame generation at target resolution

## Related Files

- Implementation: `nodes/media_selection/media_selection.py`
- Documentation: `docs/nodes/media-selection/README.md`
- UI Integration: `web/js/swiss-army-knife.js`
