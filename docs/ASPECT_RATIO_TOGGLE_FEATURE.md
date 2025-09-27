# Aspect Ratio Toggle Feature for GeminiMediaDescribe

## Overview

The GeminiMediaDescribe node now includes an **aspect ratio toggle** that allows users to choose between portrait and landscape video processing. This feature addresses the request to support different video orientations for media analysis.

## Feature Details

### Aspect Ratio Options

- **Portrait (Default)**: 480w × 832h
- **Landscape**: 832w × 480h

### Implementation

#### Backend (Python)

The aspect ratio functionality is implemented in `utils/nodes.py`:

1. **INPUT_TYPES Addition**: Added `aspect_ratio` parameter as an optional dropdown with portrait/landscape options
2. **Video Processing**: Modified `_process_video` method to accept aspect_ratio parameter  
3. **Cropping Logic**: Implemented `_crop_video` method using FFmpeg for video resizing and cropping
4. **Cache Integration**: Added aspect_ratio to cache options for proper result caching

#### Frontend (JavaScript)

The JavaScript widgets in `web/js/swiss-army-knife.js` provide dynamic UI behavior:

1. **Conditional Visibility**: aspect_ratio widget is shown only when media_type is "video"
2. **Hidden for Images**: aspect_ratio widget is hidden when media_type is "image"
3. **State Management**: Proper widget state persistence and restoration

## Usage

### Basic Usage

1. Set **media_type** to "video"
2. The **aspect_ratio** dropdown will appear automatically
3. Choose between:
   - **portrait**: For vertical videos (480×832)
   - **landscape**: For horizontal videos (832×480)
4. Upload or select your video
5. Run the analysis

### Technical Workflow

1. Video is processed with original dimensions
2. If trimming is needed (max_duration), video is trimmed first
3. Video is then cropped/resized to the selected aspect ratio using FFmpeg
4. Final processed video is sent to Gemini API for analysis
5. Temporary files are cleaned up automatically

## FFmpeg Processing

The implementation uses FFmpeg with sophisticated scaling and cropping:

```bash
ffmpeg -i input.mp4 \
  -vf "scale=480:832:force_original_aspect_ratio=increase,crop=480:832" \
  -c:a copy \
  -y output.mp4
```

### Scale and Crop Strategy

- **scale**: Resizes video to target dimensions while maintaining aspect ratio
- **force_original_aspect_ratio=increase**: Ensures scaled video is at least as large as target
- **crop**: Crops the scaled video to exact target dimensions
- **copy audio**: Preserves original audio without re-encoding

## Error Handling

### Fallback Mechanisms

1. **Primary Method**: Scale + crop for optimal quality
2. **Fallback Method**: Simple crop if scaling fails
3. **Final Fallback**: Use original video if cropping fails entirely

### Cleanup

- Temporary files are automatically cleaned up after processing
- Both successful and failed processing scenarios include cleanup
- No temporary files are left behind

## Media Info Display

The media info output now includes cropping details:

```
• Resolution: 1920x1080 → 480x832 (cropped to portrait)
• File Size: 15.42 MB
```

## Cache Behavior

- Results are cached based on all parameters including aspect_ratio
- Different aspect ratios produce separate cache entries
- Cache hits provide instant results for previously processed videos

## Backward Compatibility

- Existing workflows continue to work unchanged
- Default aspect_ratio is "portrait" 
- aspect_ratio parameter is optional and only affects video processing
- Image processing is unaffected

## JavaScript Widget Behavior

### Dynamic Visibility

- aspect_ratio widget is hidden by default
- Only visible when media_type === "video" 
- Automatically hidden when switching to image mode
- State is preserved during workflow serialization/deserialization

### Widget Management

```javascript
// Show for videos
originalAspectRatioWidget.type = "combo";
originalAspectRatioWidget.computeSize = () => [0, LiteGraph.NODE_WIDGET_HEIGHT];

// Hide for images  
originalAspectRatioWidget.type = "hidden";
originalAspectRatioWidget.computeSize = () => [0, -4];
```

## Testing

### Automated Tests

The implementation includes comprehensive tests:

1. **INPUT_TYPES Structure**: Validates parameter configuration
2. **Video Cropping**: Tests actual FFmpeg processing with sample videos
3. **Dimension Verification**: Confirms output matches expected aspect ratios

### Manual Testing

To test manually:

1. Create a GeminiMediaDescribe node
2. Set media_type to "video" (aspect_ratio widget appears)
3. Set media_type to "image" (aspect_ratio widget disappears)
4. Upload a video and test both portrait and landscape modes

## Dependencies

- **FFmpeg**: Required for video processing (version 6.1.1+ recommended)
- **OpenCV**: Used for video dimension verification
- **ComfyUI**: Standard widget system for UI components

## Performance Notes

- Video cropping adds minimal processing time
- Uses FFmpeg stream copying when possible for speed
- Temporary files are stored in system temp directory
- Memory usage scales with video duration and quality

## Troubleshooting

### Common Issues

1. **FFmpeg Not Found**: Ensure FFmpeg is installed and in PATH
2. **Cropping Failed**: Check video format compatibility
3. **Widget Not Visible**: Verify media_type is set to "video"

### Debug Information

Enable debug logging to see:
- Widget visibility state changes
- FFmpeg command execution
- Temporary file creation/cleanup
- Cache hit/miss information

## Future Enhancements

Potential improvements for future versions:

1. **Custom Dimensions**: Allow user-defined aspect ratios
2. **Crop Position**: Choose crop center, top, bottom positions
3. **Quality Settings**: Configurable video quality presets
4. **Batch Processing**: Support multiple aspect ratios simultaneously