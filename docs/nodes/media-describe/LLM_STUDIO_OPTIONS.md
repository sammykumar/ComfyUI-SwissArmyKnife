# LLM Studio Options Node

**Node Type**: `LLMStudioOptions`  
**Display Name**: "LLM Studio - Options"  
**Category**: Swiss Army Knife 🔪/Media Caption  
**Created**: October 15, 2025

## Overview

The **LLM Studio Options** node provides configuration settings for using LM Studio with vision-language models (like Qwen3-VL) for media analysis. This node outputs an options object that can be connected to the `MediaDescribe` node to use local LLM models instead of Gemini API.

## Key Features

- **Local Processing**: Run vision models locally via LM Studio
- **No API Key Required**: Unlike Gemini, LM Studio runs locally without external API calls
- **Flexible Configuration**: Configure model settings, sampling rates, and prompts
- **Video Support**: Extract and analyze video frames at customizable intervals
- **Temperature Control**: Fine-tune generation creativity and consistency

## Inputs

All inputs are required with sensible defaults:

| Input            | Type    | Default                     | Description                                           |
| ---------------- | ------- | --------------------------- | ----------------------------------------------------- |
| `base_url`       | STRING  | `http://192.168.50.41:1234` | LM Studio server URL                                  |
| `model_name`     | STRING  | `qwen/qwen3-vl-30b`         | Model name loaded in LM Studio                        |
| `temperature`    | FLOAT   | `0.5`                       | Temperature for text generation (0.0-2.0)             |
| `fps_sample`     | FLOAT   | `1.0`                       | Extract 1 frame every N seconds (0.1-10.0)            |
| `max_duration`   | FLOAT   | `5.0`                       | Maximum duration in seconds to sample from (1.0-60.0) |
| `caption_prompt` | STRING  | (See below)                 | Prompt for individual frame captions                  |
| `verbose`        | BOOLEAN | `False`                     | Show detailed processing information in console       |

### Default Caption Prompt

```
Describe this image in detail, focusing on the subject, setting, and mood.
```

## Outputs

| Output               | Type                 | Description                              |
| -------------------- | -------------------- | ---------------------------------------- |
| `llm_studio_options` | LLM_STUDIO_OPTIONS   | Configuration object for MediaDescribe   |

## How It Works

1. **Configuration Storage**: The node packages all settings into a dictionary with the identifier `"provider": "llm_studio"`
2. **Connection**: Connect the output to the `MediaDescribe` node's `llm_options` input
3. **Processing**: MediaDescribe detects the provider and routes processing to LLM Studio instead of Gemini

## Usage Example

### Basic Setup

1. Start LM Studio and load a vision model (e.g., `qwen/qwen3-vl-30b`)
2. Add LLM Studio - Options node to workflow
3. Configure inputs:
    - `base_url`: `http://192.168.50.41:1234` (LM Studio server)
    - `model_name`: Match the model loaded in LM Studio
    - `temperature`: `0.5` (balanced creativity)
    - `fps_sample`: `1.0` (1 frame per second for videos)
    - `max_duration`: `5.0` (sample first 5 seconds of videos)
4. Connect output to MediaDescribe node

### Custom Prompting

For specialized analysis, customize the `caption_prompt`:

```
Analyze this image focusing on:
1. Main subject and their actions
2. Environmental setting and lighting
3. Color palette and mood
4. Composition and framing
Provide a detailed paragraph.
```

### Video Processing

For video analysis:

- `fps_sample: 1.0` → Extract 1 frame per second
- `max_duration: 10.0` → Analyze first 10 seconds
- Lower `fps_sample` for more frames (e.g., `0.5` = 2 frames per second)
- Increase `max_duration` for longer videos (careful: more frames = slower processing)

## Comparison with Gemini Options

| Feature               | LLM Studio Options         | Gemini Options                |
| --------------------- | -------------------------- | ----------------------------- |
| **API Key**           | Not required (local)       | Required (GEMINI_API_KEY)     |
| **Processing**        | Local GPU/CPU              | Cloud-based API               |
| **Cost**              | Free (runs locally)        | Pay per API call              |
| **Privacy**           | Fully private              | Data sent to Google servers   |
| **Model Selection**   | Any LM Studio vision model | Gemini models only            |
| **Structured Output** | Simple caption             | Structured JSON with fields   |
| **Customization**     | Full control via prompts   | Predefined prompt styles      |

## Configuration Options Explained

### base_url

The URL where LM Studio is running. Default is `http://192.168.50.41:1234`.

- **Local**: `http://localhost:1234` or `http://127.0.0.1:1234`
- **Network**: `http://192.168.x.x:1234` (replace with your LM Studio server IP)
- **Port**: Default LM Studio port is `1234`, change if configured differently

### model_name

The exact model name as shown in LM Studio. Common vision models:

- `qwen/qwen3-vl-30b` (recommended)
- `qwen/qwen3-vl-7b` (faster, less accurate)
- Other vision-language models supported by LM Studio

**Important**: The model must be loaded in LM Studio before running the workflow.

### temperature

Controls randomness in generation:

- `0.0` - Deterministic, factual descriptions
- `0.5` - Balanced (default, recommended)
- `1.0` - More creative, varied descriptions
- `2.0` - Highly creative, less predictable

### fps_sample

How frequently to extract frames from video:

- `0.1` - 10 frames per second (very detailed, slow)
- `0.5` - 2 frames per second (detailed)
- `1.0` - 1 frame per second (balanced, default)
- `2.0` - 1 frame every 2 seconds (fast)

### max_duration

Maximum video length to process:

- `5.0` - 5 seconds (default, fast)
- `10.0` - 10 seconds (balanced)
- `30.0` - 30 seconds (detailed, slower)
- `60.0` - 1 minute (maximum, very slow)

## Prerequisites

### LM Studio Setup

1. **Install LM Studio**: Download from [lmstudio.ai](https://lmstudio.ai)
2. **Load Vision Model**: Download and load a vision-language model (e.g., Qwen3-VL)
3. **Start Server**: Click "Start Server" in LM Studio
4. **Verify URL**: Note the server URL (default: `http://localhost:1234`)

### Network Configuration

If LM Studio is on a different machine:

1. Configure LM Studio to listen on all interfaces (not just localhost)
2. Update `base_url` to use the LM Studio machine's IP address
3. Ensure firewall allows connections on port 1234

## Error Handling

### Common Errors

**"Failed to connect to LM Studio"**
- Verify LM Studio is running and server is started
- Check `base_url` is correct
- Ensure network connectivity (ping the server)

**"Model not found"**
- Verify `model_name` matches exactly what's loaded in LM Studio
- Reload the model in LM Studio if necessary

**"No frames could be processed"**
- Video file may be corrupted
- Try reducing `fps_sample` or `max_duration`
- Check video codec is supported

## Performance Tips

1. **Model Selection**: Smaller models (7B) are faster than larger ones (30B)
2. **Frame Sampling**: Higher `fps_sample` values = fewer frames = faster processing
3. **Duration**: Lower `max_duration` = less video to process = faster results
4. **Temperature**: Lower values (0.3-0.5) generate faster than higher values
5. **Hardware**: GPU acceleration significantly speeds up vision model inference

## Integration with MediaDescribe

The LLM Studio Options node works seamlessly with MediaDescribe:

1. **Create Options**: LLM Studio - Options node
2. **Connect**: Output → MediaDescribe `llm_options` input
3. **Process**: MediaDescribe automatically detects LLM Studio provider
4. **Output**: Receives simplified caption-based output

### Output Differences

**LLM Studio Output:**
- Single combined caption
- Simple JSON structure
- Less structured than Gemini output
- Focus on narrative description

**Gemini Output:**
- Structured JSON with 6 fields
- Subject, clothing, movement, scene, etc.
- Designed for text-to-image prompts
- More detailed and categorized

## Future Enhancements

Planned improvements:

- [ ] Support for multiple caption prompts (different analyses)
- [ ] Batch processing multiple images/videos
- [ ] Custom JSON schema for structured output
- [ ] Model performance metrics (tokens/sec, latency)
- [ ] Automatic model selection based on task
- [ ] Integration with other LM Studio features

## Related Nodes

- **MediaDescribe**: Main node that uses these options
- **Gemini Util - Options**: Alternative cloud-based option provider
- **LLM Studio Video Describe**: Direct video description (standalone)
- **LLM Studio Picture Describe**: Direct image description (standalone)
- **Media Describe - Overrides**: Override specific output fields

## Changelog

### October 15, 2025 - Initial Release

- Created LLM Studio Options node
- Supports image and video processing configuration
- Integrates with MediaDescribe node via `llm_options` input
- Default settings optimized for Qwen3-VL models
