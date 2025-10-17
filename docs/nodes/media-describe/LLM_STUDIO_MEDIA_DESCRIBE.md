# LLM Studio Video Describe Node

**Node Type**: `LLMStudioVideoDescribe`  
**Display Name**: "LLM Studio Video Describe"  
**Category**: Swiss Army Knife 🔪/Media Caption  
**Created**: October 14, 2025

## Overview

The LLM Studio Video Describe node enables video captioning using LM Studio's OpenAI-compatible API with vision-language models like Qwen3-VL. It extracts frames from videos and generates intelligent captions using local models.

## Key Features

- **LM Studio Integration**: Uses OpenAI-compatible API to connect to LM Studio
- **Vision-Language Models**: Supports models like Qwen3-VL for image understanding
- **Frame Sampling**: Configurable frame extraction (fps-based sampling)
- **Smart Summarization**: Combines individual frame captions into coherent video descriptions
- **Local Inference**: Runs entirely on local hardware via LM Studio

## Inputs

### Required Inputs

| Input               | Type    | Default                     | Description                                           |
| ------------------- | ------- | --------------------------- | ----------------------------------------------------- |
| `base_url`          | STRING  | `http://192.168.50.41:1234` | LM Studio server URL                                  |
| `model_name`        | STRING  | `qwen/qwen3-vl-30b`         | Model name loaded in LM Studio                        |
| `video_path`        | STRING  | `""`                        | Path to video file to analyze                         |
| `fps_sample`        | FLOAT   | `1.0`                       | Extract 1 frame every N seconds (0.1-10.0)            |
| `max_duration`      | FLOAT   | `5.0`                       | Maximum duration in seconds to sample from (1.0-60.0) |
| `caption_prompt`    | STRING  | (See below)                 | Prompt for individual frame captions                  |
| `max_caption_words` | INT     | `40`                        | Maximum words for final combined caption (10-200)     |
| `temperature`       | FLOAT   | `0.5`                       | Temperature for text generation (0.0-2.0)             |
| `verbose`           | BOOLEAN | `False`                     | Show detailed frame-by-frame captions in console      |

#### Default Caption Prompt

```
Describe only the specific sexual act being performed in 30 words or less.
Focus exclusively on the physical actions and positions.
Do not describe physical appearance, clothing, setting, or background.
```

## Outputs

| Output             | Type   | Description                              |
| ------------------ | ------ | ---------------------------------------- |
| `combined_caption` | STRING | Final coherent video description         |
| `frame_captions`   | STRING | JSON string of individual frame captions |
| `frames_processed` | INT    | Number of frames successfully processed  |

## How It Works

### 1. Client Initialization

```python
self.client = OpenAI(base_url=f"{base_url}/v1", api_key="lm-studio")
```

The node initializes an OpenAI client pointing to LM Studio's local endpoint. The API key is always `"lm-studio"` as it's not validated by LM Studio.

### 2. Frame Extraction

Uses OpenCV to extract frames from video based on:

- **Sampling rate**: Extract 1 frame every `fps_sample` seconds
- **Duration limit**: Only sample first `max_duration` seconds
- **Smart calculation**: Ensures frame indices don't exceed video length

Example: For a 30-second video with `fps_sample=1.0` and `max_duration=5.0`:

- Extracts 5 frames (at 0s, 1s, 2s, 3s, 4s)
- Saves frames as temporary JPEGs
- Encodes frames to base64 for API

### 3. Frame Captioning

Each frame is sent to the vision-language model with:

```python
response = self.client.chat.completions.create(
    model=self.model_name,
    messages=[
        {
            "role": "system",
            "content": "You are a helpful image captioner."
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": caption_prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ]
        }
    ],
    max_tokens=300,
    temperature=temperature
)
```

### 4. Caption Combination

Individual frame captions are combined using the LLM:

```python
summary_prompt = f"""Given these descriptions of {num_frames} frames from a video in chronological order:

Frame 1: [caption]
Frame 2: [caption]
...

Create a single, natural-flowing sentence that describes the complete video sequence.
Remove redundancy and focus on progression of actions. Maximum {max_words} words."""
```

The temperature is reduced by 40% (`temperature * 0.6`) for more consistent output.

## Dependencies

### Python Packages

- `openai` - OpenAI Python client (works with LM Studio)
- `opencv-python` - Video frame extraction
- `base64` - Image encoding (built-in)
- `tempfile` - Temporary file management (built-in)

### System Requirements

- **LM Studio** running with a vision-language model loaded
- **Model compatibility**: Model must support vision inputs (e.g., Qwen3-VL)
- **FFmpeg** - Not required (OpenCV handles video processing)

## Usage Example

### Basic Setup

1. Start LM Studio and load a vision model (e.g., `qwen/qwen3-vl-30b`)
2. Add LLM Studio Video Describe node to workflow
3. Configure inputs:
    - `base_url`: `http://192.168.50.41:1234` (LM Studio server)
    - `model_name`: Match the model loaded in LM Studio
    - `video_path`: Path to your video file
    - `fps_sample`: `1.0` (1 frame per second)
    - `max_duration`: `5.0` (sample first 5 seconds)

### Custom Prompting

For different use cases, modify the `caption_prompt`:

**Scene Description:**

```
Describe the overall scene, setting, and atmosphere in this image.
Focus on visual elements, lighting, and mood. Maximum 40 words.
```

**Action Analysis:**

```
Identify and describe any actions or movements visible in this image.
Be specific about what is happening. Maximum 30 words.
```

**Technical Analysis:**

```
Analyze the composition, framing, and cinematography of this image.
Note camera angles, lighting, and visual techniques. Maximum 50 words.
```

## Error Handling

### Connection Errors

If LM Studio is not running:

```
❌ Failed to connect to LM Studio at http://192.168.50.41:1234
Make sure LM Studio is running at http://192.168.50.41:1234
```

**Solution**: Start LM Studio and ensure the model is loaded.

### Video File Errors

If video file not found:

```
❌ Video file not found: /path/to/video.mp4
```

**Solution**: Verify the path is correct and file exists.

### Frame Extraction Errors

If no frames could be extracted:

```
❌ No frames extracted from video
```

**Solution**: Check video file is valid and not corrupted.

### Captioning Errors

Individual frame errors are caught and logged:

```
❌ Error processing frame: [error details]
```

The node continues processing other frames and returns `"[Error: ...]"` for failed frames.

## Performance Considerations

### Frame Sampling Strategy

- **Low sampling** (`fps_sample=2.0`): Faster, fewer API calls, may miss details
- **High sampling** (`fps_sample=0.5`): Slower, more API calls, captures more detail

### Duration Limits

- **Short duration** (`max_duration=3.0`): Quick processing, good for simple videos
- **Long duration** (`max_duration=10.0`): More comprehensive, slower processing

### Temperature Settings

- **Low temperature** (`0.2-0.5`): More consistent, factual captions
- **Medium temperature** (`0.5-0.8`): Balanced creativity and accuracy
- **High temperature** (`0.8-2.0`): More creative, less predictable

## Troubleshooting

### Model Not Loaded

**Symptom**: Error messages about model not found

**Solution**:

1. Open LM Studio
2. Go to the "Models" tab
3. Load the desired vision-language model
4. Ensure model name matches exactly in node settings

### Slow Processing

**Symptom**: Long wait times between frames

**Possible causes**:

- Large model running on CPU
- High `fps_sample` rate (too many frames)
- Long `max_duration` (too many frames)

**Solutions**:

- Use GPU acceleration in LM Studio
- Increase `fps_sample` to reduce frame count
- Decrease `max_duration` to sample shorter portion

### Inconsistent Captions

**Symptom**: Captions vary significantly between runs

**Solution**:

- Lower `temperature` (try 0.3-0.5)
- Use more specific prompts
- Increase context in prompts

## Implementation Details

### File Location

```
nodes/media_describe/llm_studio_describe.py
```

### Key Methods

- `initialize_client()` - Sets up OpenAI client for LM Studio
- `extract_frames_from_video()` - Extracts and saves video frames
- `encode_image()` - Converts frame to base64
- `caption_frame()` - Generates caption for single frame
- `combine_captions()` - Merges frame captions into video description
- `describe_video()` - Main orchestration method

### Temporary Files

The node creates temporary directories for frame storage:

```python
temp_dir = Path(tempfile.mkdtemp())
frame_path = temp_dir / f"frame_{idx:03d}.jpg"
```

Files are automatically cleaned up after processing.

## Future Enhancements

### Potential Improvements

1. **Batch Processing**: Process multiple frames in single API call
2. **Caching**: Cache frame captions to avoid reprocessing
3. **Model Selection**: Dropdown for available models in LM Studio
4. **Quality Settings**: JPEG quality control for frame encoding
5. **Progress Tracking**: Real-time progress updates during processing
6. **Multi-model Support**: Compare captions from different models

## Related Nodes

- **Media Describe** - Gemini-based video analysis
- **Video Preview** - Video playback and frame visualization
- **Video Metadata** - Extract video technical metadata

## References

- [LM Studio Documentation](https://lmstudio.ai/docs)
- [OpenAI Python SDK](https://github.com/openai/openai-python)
- [Qwen3-VL Model](https://huggingface.co/qwen/qwen3-vl-30b)

## Changelog

### October 14, 2025 - Initial Release

- Created LLM Studio Video Describe node
- Implemented OpenAI client integration
- Added comprehensive documentation
- Registered node in ComfyUI system
