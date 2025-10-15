# LLM Studio Video Describe Node

A ComfyUI custom node for describing videos using LM Studio with vision-language models like Qwen3-VL.

## Overview

The `LLMStudioVideoDescribe` node analyzes videos by extracting frames and sending them to a local LM Studio server for analysis. It uses the OpenAI-compatible API to communicate with vision models.

## Recent Optimization (Single-Request Approach)

As of the latest update, the node sends **all video frames in a single API request** for optimal performance and better temporal understanding.

### Benefits:

1. **🚀 Performance**: 1 HTTP request instead of N+1 requests (N frames + 1 summary)
2. **🎯 Better Understanding**: Model sees all frames together for temporal context
3. **📊 Motion Tracking**: Can track actions and movement across frames
4. **⚡ Faster**: Eliminates network overhead from multiple requests

### Implementation:

```python
# Extract all frames first
frame_paths, video_duration = extract_frames_from_video(...)

# Encode all frames to base64
images = [encode_image(frame) for frame in frame_paths]

# Build content array: [text_prompt, image1, image2, ..., imageN]
content_array = [{"type": "text", "text": prompt}] + images

# Send single request with all frames
response = client.chat.completions.create(
    messages=[{
        "role": "user",
        "content": content_array  # All frames in one message
    }],
    max_tokens=1000
)
```

## Input Parameters

### Required:

- **`base_url`** (STRING): LM Studio server URL
    - Default: `http://192.168.50.41:1234`
    - Example: Your local LM Studio instance

- **`model_name`** (STRING): Model identifier in LM Studio
    - Default: `qwen/qwen3-vl-30b`
    - Supports any vision-language model loaded in LM Studio

- **`video_path`** (STRING): Path to video file
    - Absolute path to video file on disk
    - Supports common formats: MP4, AVI, MOV, etc.

- **`fps_sample`** (FLOAT): Frame sampling rate
    - Default: `1.0` (extract 1 frame per second)
    - Range: 0.1 - 10.0
    - Higher values = more frames, longer processing

- **`max_duration`** (FLOAT): Maximum sampling duration
    - Default: `5.0` seconds
    - Range: 1.0 - 60.0
    - Limits how much of the video is analyzed

- **`caption_prompt`** (STRING): Prompt for video analysis
    - Multiline text field
    - Guides what the model should focus on
    - Default: Describes sexual acts (customizable for your use case)

- **`temperature`** (FLOAT): Generation temperature
    - Default: `0.5`
    - Range: 0.0 - 2.0
    - Lower = more focused, Higher = more creative

- **`verbose`** (BOOLEAN): Debug logging
    - Default: `False`
    - Shows detailed processing information

## Output Parameters

Returns tuple of:

1. **`combined_caption`** (STRING): Unified video description
2. **`frame_captions`** (STRING): Same as combined_caption (for backwards compatibility)
3. **`frames_processed`** (INT): Number of frames analyzed

## Usage Example

```python
# In ComfyUI workflow
video_describe = LLMStudioVideoDescribe()

caption, _, num_frames = video_describe.describe_video(
    base_url="http://192.168.50.41:1234",
    model_name="qwen/qwen3-vl-30b",
    video_path="/path/to/video.mp4",
    fps_sample=1.0,
    max_duration=5.0,
    caption_prompt="Describe the actions and movement in this video.",
    temperature=0.5,
    verbose=True
)

print(f"Analyzed {num_frames} frames")
print(f"Description: {caption}")
```

## Console Output

### Normal Mode:

```
✅ Connected to LM Studio at http://192.168.50.41:1234
📦 Using model: qwen/qwen3-vl-30b
🎬 Processing video: /path/to/video.mp4
📹 Video duration: 10.50s, sampling 5.00s
📸 Extracted 5 frames (1 frame per 1.0s)

🤖 Analyzing 5 frames in single request...

✅ Video description: The video shows a person performing a series of actions...
```

### Verbose Mode:

```
✅ Connected to LM Studio at http://192.168.50.41:1234
📦 Using model: qwen/qwen3-vl-30b
🎬 Processing video: /path/to/video.mp4
📹 Video duration: 10.50s, sampling 5.00s
📸 Extracted 5 frames (1 frame per 1.0s)

🤖 Analyzing 5 frames in single request...
📊 Sending 5 frames in single request
✅ Video analysis complete: The video shows a person performing a series of actions...

✅ Video description: The video shows a person performing a series of actions...

================================================================================
📋 FULL VIDEO DESCRIPTION
================================================================================
The video shows a person performing a series of actions including walking,
turning, and gesturing. The scene takes place in an outdoor setting with
natural lighting. The person's movement progresses from left to right across
the frame, with noticeable changes in posture and arm positioning.
================================================================================
```

## Technical Details

### Frame Extraction:

- Uses OpenCV (`cv2`) for video processing
- Calculates frame indices based on `fps_sample` and `max_duration`
- Saves frames to temporary directory during processing
- Cleans up temporary files after completion

### API Communication:

- Uses OpenAI Python SDK for compatibility
- Sends frames as base64-encoded JPEG images
- Content array format: `[text_prompt, image1, image2, ..., imageN]`
- Single API call per video (not per frame)

### Error Handling:

- Validates LM Studio connection before processing
- Checks video file exists
- Handles frame extraction errors gracefully
- Reports clear error messages

## Performance Comparison

### Old Approach (Frame-by-Frame):

- 5 frames = 6 HTTP requests (5 frames + 1 summary)
- Total time: ~30-45 seconds
- Network overhead: Significant
- Context: Each frame analyzed independently

### New Approach (Single Request):

- 5 frames = 1 HTTP request
- Total time: ~10-15 seconds
- Network overhead: Minimal
- Context: All frames analyzed together

**Result**: ~3x faster with better video understanding! 🚀

## Troubleshooting

### Connection Issues:

- Verify LM Studio is running at the specified URL
- Check firewall settings
- Ensure model is loaded in LM Studio

### Empty Descriptions:

- Check `caption_prompt` is clear and specific
- Verify model supports vision input
- Try adjusting `temperature`

### Too Many/Few Frames:

- Adjust `fps_sample` (higher = more frames)
- Adjust `max_duration` (longer = more frames)
- Balance quality vs processing time

## Related Nodes

- **LLM Studio Picture Describe**: For single image analysis
- **Media Describe**: Unified node with LLM Studio and Gemini support
- **LLM Studio - Options**: Configuration node for Media Describe

## Code Location

- Implementation: `nodes/media_describe/llm_studio_describe.py`
- Class: `LLMStudioVideoDescribe`
- Lines: ~20-290

## Changelog

### v2.0 - Single Request Optimization

- Changed from frame-by-frame processing to single-request approach
- Removed `caption_frame()` method (no longer needed)
- Removed `combine_captions()` method (no longer needed)
- Increased `max_tokens` to 1000 for comprehensive descriptions
- Updated return value: `frame_captions` now matches `combined_caption`
- Added verbose logging for frame count

### v1.0 - Initial Implementation

- Frame-by-frame video analysis
- Individual frame captioning
- LLM-based caption summarization
