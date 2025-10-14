# JoyCaption Media Describe Node

**Category:** SwissArmyKnife/Media Describe  
**Node Class:** `JoyCaptionMediaDescribe`  
**Display Name:** "JoyCaption Media Describe"

## Overview

The JoyCaption Media Describe node analyzes video content using a local vLLM server running the JoyCaption vision-language model. It extracts frames from a video at configurable intervals, generates captions for each frame, and combines them into a coherent video description.

## Key Features

- **Local Processing:** Uses local vLLM server (no external API calls)
- **Frame Extraction:** Configurable frame sampling rate and duration
- **Smart Captioning:** Individual frame captions combined into coherent description
- **Power Management:** Automatic wake/sleep control for vLLM model
- **Flexible Prompting:** Customizable caption prompt for different use cases
- **Verbose Logging:** Optional detailed frame-by-frame output

## Requirements

### System Requirements

1. **vLLM Server:** Running on `http://localhost:8023`
2. **Model:** `fancyfeast/llama-joycaption-beta-one-hf-llava`
3. **OpenCV:** For video frame extraction (`opencv-python`)
4. **Python Dependencies:**
    - `requests`
    - `cv2` (opencv-python)
    - `base64`
    - `tempfile`

### Docker Setup

The node expects a vLLM server running with the JoyCaption model. Example Docker setup:

```bash
docker run -d \
  --name joycaption-vllm \
  --gpus all \
  -p 8023:8000 \
  vllm/vllm-openai:latest \
  --model fancyfeast/llama-joycaption-beta-one-hf-llava
```

## Input Parameters

### Required Inputs

| Parameter           | Type    | Default     | Range      | Description                                      |
| ------------------- | ------- | ----------- | ---------- | ------------------------------------------------ |
| `video_path`        | STRING  | ""          | -          | Path to video file to analyze                    |
| `fps_sample`        | FLOAT   | 1.0         | 0.1 - 10.0 | Extract 1 frame every N seconds                  |
| `max_duration`      | FLOAT   | 5.0         | 1.0 - 60.0 | Maximum duration in seconds to sample from       |
| `caption_prompt`    | STRING  | (see below) | -          | Prompt for individual frame captions             |
| `max_caption_words` | INT     | 40          | 10 - 200   | Maximum words for final combined caption         |
| `temperature`       | FLOAT   | 0.5         | 0.0 - 2.0  | Temperature for text generation                  |
| `verbose`           | BOOLEAN | False       | -          | Show detailed frame-by-frame captions in console |

### Default Caption Prompt

```
Describe only the specific sexual act being performed in 30 words or less.
Focus exclusively on the physical actions and positions.
Do not describe physical appearance, clothing, setting, or background.
```

**Note:** This can be customized for any use case (not just adult content).

## Output Parameters

The node returns three outputs:

| Output             | Type   | Description                              |
| ------------------ | ------ | ---------------------------------------- |
| `combined_caption` | STRING | Final coherent video description         |
| `frame_captions`   | STRING | JSON string of individual frame captions |
| `frames_processed` | INT    | Number of frames successfully processed  |

## Implementation Details

### Frame Extraction Algorithm

1. Open video file with OpenCV
2. Calculate total frames and video FPS
3. Determine sampling duration: `min(video_duration, max_duration)`
4. Calculate frames to extract: `int(sampling_duration / fps_sample)`
5. Extract frames at calculated intervals
6. Save frames to temporary directory as JPG files

### Captioning Pipeline

1. **Wake Model:** Check if vLLM model is sleeping and wake if needed
2. **Encode Frames:** Convert frames to base64-encoded JPEG
3. **Caption Frames:** Send each frame to vLLM with custom prompt
4. **Combine Captions:** Use LLM to create coherent description from frame captions
5. **Sleep Model:** Put model to sleep after processing (power management)
6. **Cleanup:** Remove temporary frame files

### Power Management

The node includes automatic power management for the vLLM server:

- **Wake:** `POST /wake_up` - Wakes sleeping model before processing
- **Sleep:** `POST /sleep?level=1` - Puts model to sleep after processing
- **Status:** `GET /is_sleeping` - Checks if model is currently sleeping

Sleep levels:

- **Level 1:** Offload weights to CPU, discard KV cache (recommended)
- **Level 2:** Discard weights and KV cache completely

### Error Handling

The node handles various error scenarios:

- **Video Not Found:** Returns error message if video file doesn't exist
- **Frame Extraction Failure:** Returns error if no frames can be extracted
- **Encoding Errors:** Skips frames that fail to encode, continues with others
- **Caption Failures:** Returns error if all frames fail to caption
- **Network Errors:** Prints warnings but attempts to continue

## Usage Examples

### Basic Usage

```python
# Simple video captioning
video_path = "/path/to/video.mp4"
caption, frame_captions, num_frames = joycaption_node.describe_video(
    video_path=video_path,
    fps_sample=1.0,
    max_duration=5.0,
    caption_prompt="Describe the main action in this frame.",
    max_caption_words=40,
    temperature=0.5,
    verbose=False
)
```

### Custom Prompt for Nature Videos

```python
# Nature documentary captioning
caption, _, _ = joycaption_node.describe_video(
    video_path="/path/to/nature.mp4",
    fps_sample=2.0,  # 1 frame every 2 seconds
    max_duration=10.0,  # Sample 10 seconds
    caption_prompt="Describe the wildlife, landscape, and natural phenomena visible in this scene.",
    max_caption_words=60,
    temperature=0.7,
    verbose=True
)
```

### High-Frequency Sampling

```python
# Detailed action analysis
caption, _, _ = joycaption_node.describe_video(
    video_path="/path/to/sports.mp4",
    fps_sample=0.5,  # 2 frames per second
    max_duration=3.0,  # First 3 seconds
    caption_prompt="Describe the athletic movement and technique in 20 words.",
    max_caption_words=80,
    temperature=0.3,  # Lower temperature for consistency
    verbose=True
)
```

## Performance Characteristics

### Processing Time

- **Frame Extraction:** ~0.1-0.5 seconds per frame
- **Frame Captioning:** ~2-5 seconds per frame (depends on vLLM server)
- **Caption Combining:** ~2-3 seconds
- **Total:** ~10-30 seconds for typical 5-frame video

### Resource Usage

- **CPU:** Frame extraction (OpenCV)
- **GPU:** vLLM server (model inference)
- **Memory:** Temporary frame storage (~1-5 MB per frame)
- **Disk:** Temporary files cleaned up automatically

## API Reference

### vLLM Endpoints

The node makes HTTP calls to these vLLM endpoints:

#### Chat Completions

```
POST http://localhost:8023/v1/chat/completions
```

Request format:

```json
{
    "model": "fancyfeast/llama-joycaption-beta-one-hf-llava",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful image captioner."
        },
        {
            "role": "user",
            "content": [
                { "type": "text", "text": "Caption prompt here" },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/jpeg;base64,..."
                    }
                }
            ]
        }
    ],
    "max_tokens": 300,
    "temperature": 0.5
}
```

#### Sleep Status

```
GET http://localhost:8023/is_sleeping
```

Response:

```json
{
    "is_sleeping": false
}
```

#### Wake Up

```
POST http://localhost:8023/wake_up
```

#### Sleep

```
POST http://localhost:8023/sleep?level=1
```

## Troubleshooting

### Common Issues

#### 1. Connection Refused

**Problem:** `ConnectionError: Connection refused to localhost:8023`

**Solution:**

- Check vLLM server is running: `docker ps | grep joycaption`
- Check port mapping: `docker port <container_id>`
- Verify vLLM logs: `docker logs <container_id>`

#### 2. Model Not Loaded

**Problem:** `Error 404: Model not found`

**Solution:**

- Verify model name in vLLM startup command
- Check vLLM logs for model loading errors
- Ensure sufficient GPU memory for model

#### 3. Timeout Errors

**Problem:** `ReadTimeout: Request timed out after 60 seconds`

**Solution:**

- Increase timeout in code (default: 60s for captioning, 30s for combining)
- Check GPU utilization: `nvidia-smi`
- Wake model manually before processing: `curl -X POST http://localhost:8023/wake_up`

#### 4. No Frames Extracted

**Problem:** `No frames extracted from video`

**Solution:**

- Verify video file exists and is readable
- Check video format compatibility with OpenCV
- Test with `ffmpeg -i video.mp4` to verify video integrity
- Try different fps_sample or max_duration values

#### 5. Poor Caption Quality

**Problem:** Captions are generic or inaccurate

**Solution:**

- Adjust `caption_prompt` to be more specific
- Lower `temperature` for more consistent output (e.g., 0.3)
- Increase `max_caption_words` for more detailed descriptions
- Try different `fps_sample` values to capture different moments

## Best Practices

### 1. Frame Sampling

- **Fast Action:** Use `fps_sample=0.5` (2 frames/sec) for sports, action scenes
- **Slow Action:** Use `fps_sample=2.0` (1 frame/2 sec) for dialogue, landscapes
- **Default:** `fps_sample=1.0` works well for most content

### 2. Duration Selection

- **Short Clips:** Use `max_duration=5.0` (default) for quick summaries
- **Long Videos:** Use `max_duration=10.0-30.0` for comprehensive analysis
- **Very Long Videos:** Process in chunks or increase max_duration carefully

### 3. Temperature Settings

- **Consistent Captions:** `temperature=0.3` for factual, consistent output
- **Creative Captions:** `temperature=0.7-1.0` for varied, creative descriptions
- **Balanced:** `temperature=0.5` (default) for general use

### 4. Prompt Engineering

Good prompts are:

- **Specific:** Focus on what you want described
- **Concise:** Keep under 50 words when possible
- **Action-Oriented:** Focus on verbs and actions
- **Constraint-Aware:** Specify word limits in prompt

Example prompts:

```
# Technical description
"Describe the camera angle, lighting, and composition in 20 words."

# Action-focused
"What is the main character doing? Describe the action in 15 words."

# Emotional analysis
"Describe the mood and emotional tone of this scene in 25 words."
```

### 5. Verbose Mode

Enable `verbose=True` when:

- Debugging frame extraction
- Testing new prompts
- Analyzing caption quality
- Performance tuning

Disable `verbose=False` for:

- Production workflows
- Batch processing
- Clean console output

## Integration Examples

### With Filename Generator

```python
# Generate filename from video caption
caption, _, _ = joycaption_node.describe_video(
    video_path=input_video,
    fps_sample=1.0,
    max_duration=5.0,
    caption_prompt="Describe the main action briefly.",
    max_caption_words=20,
    temperature=0.5,
    verbose=False
)

# Use caption in filename
filename = filename_generator.generate(
    description=caption,
    scheduler="default",
    shift=12.0,
    total_steps=40,
    shift_step=25
)
```

### With Video Metadata Node

```python
# Add caption to video metadata
caption, frame_captions, num_frames = joycaption_node.describe_video(
    video_path=input_video,
    fps_sample=1.0,
    max_duration=5.0,
    caption_prompt="Describe the content.",
    max_caption_words=40,
    temperature=0.5,
    verbose=False
)

# Update video metadata
metadata_node.update_metadata(
    video_path=input_video,
    description=caption,
    keywords=f"frames:{num_frames}"
)
```

## Future Enhancements

Potential improvements for future versions:

1. **Batch Processing:** Process multiple videos in sequence
2. **Frame Selection:** Smart frame selection based on scene changes
3. **Multi-Model Support:** Allow different vLLM models/endpoints
4. **Caching:** Cache frame captions for repeated processing
5. **Audio Analysis:** Include audio transcription in captions
6. **Progress Callback:** Real-time progress updates for long videos
7. **Output Formats:** Support JSON, XML, or structured output formats

## Related Nodes

- **Media Describe:** Gemini-based image/video description (cloud-based)
- **Video Preview:** Preview video frames in ComfyUI
- **Video Metadata Node:** Add metadata to video files
- **Filename Generator:** Generate filenames from captions

## Technical Notes

### Thread Safety

The node is **not thread-safe** due to:

- Shared temporary directory creation
- Shared vLLM server access
- No locking mechanism

For concurrent processing, run separate ComfyUI instances or implement queue-based processing.

### Memory Management

- Temporary files are cleaned up after processing
- Frame data is not kept in memory between captions
- vLLM server KV cache is cleared when model sleeps

### OpenCV Video Format Support

The node supports any video format that OpenCV can read, including:

- MP4 (H.264, H.265)
- AVI
- MOV
- MKV
- WebM
- FLV

For unsupported formats, pre-convert with FFmpeg:

```bash
ffmpeg -i input.mkv -c:v libx264 -c:a aac output.mp4
```

## License & Attribution

This node is part of ComfyUI-SwissArmyKnife.

**JoyCaption Model:**

- Model: `fancyfeast/llama-joycaption-beta-one-hf-llava`
- License: Check model repository for license information
- Credit: FancyFeast team

## Changelog

### Version 1.0.0 (Initial Release)

- Frame extraction with configurable sampling
- Individual frame captioning
- LLM-based caption combining
- Automatic power management
- Verbose logging option
- Error handling and recovery
