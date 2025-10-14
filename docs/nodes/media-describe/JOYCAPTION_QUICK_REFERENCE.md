# JoyCaption Media Describe - Quick Reference

## Node Information

- **Node Name**: JoyCaptionMediaDescribe
- **Display Name**: "JoyCaption Media Describe"
- **Category**: SwissArmyKnife/Media Describe
- **Type**: Video Analysis Node

## Quick Start

### Prerequisites

1. **vLLM Server Running**:

    ```bash
    docker run -d --name joycaption-vllm --gpus all -p 8023:8000 \
      vllm/vllm-openai:latest \
      --model fancyfeast/llama-joycaption-beta-one-hf-llava
    ```

2. **OpenCV Installed**:
    ```bash
    source .venv/bin/activate
    pip install opencv-python
    ```

### Basic Usage

1. Add "JoyCaption Media Describe" node to workflow
2. Set `video_path` to your video file
3. Adjust `fps_sample` (default: 1.0 = 1 frame per second)
4. Set `max_duration` (default: 5.0 seconds)
5. Run workflow

### Input Parameters

| Parameter         | Default    | Range    | Description                 |
| ----------------- | ---------- | -------- | --------------------------- |
| video_path        | ""         | -        | Path to video file          |
| fps_sample        | 1.0        | 0.1-10.0 | Frames per second to sample |
| max_duration      | 5.0        | 1.0-60.0 | Max seconds to analyze      |
| caption_prompt    | (see docs) | -        | Prompt for frame captions   |
| max_caption_words | 40         | 10-200   | Max words in final caption  |
| temperature       | 0.5        | 0.0-2.0  | Generation randomness       |
| verbose           | False      | -        | Show detailed logs          |

### Output Values

1. **combined_caption** (STRING): Final video description
2. **frame_captions** (STRING): Individual frame captions (JSON-like)
3. **frames_processed** (INT): Number of frames analyzed

## Common Use Cases

### Quick Video Summary (Default)

```
fps_sample: 1.0
max_duration: 5.0
temperature: 0.5
```

### Detailed Action Analysis

```
fps_sample: 0.5  # 2 frames per second
max_duration: 10.0
temperature: 0.3  # More consistent
```

### Long-Form Content

```
fps_sample: 2.0  # 1 frame every 2 seconds
max_duration: 30.0
temperature: 0.7  # More creative
```

## Troubleshooting

### vLLM Connection Error

```bash
# Check vLLM is running
docker ps | grep joycaption

# Test endpoint
curl http://localhost:8023/health
```

### No Frames Extracted

- Verify video file exists
- Check video format (MP4 recommended)
- Try increasing max_duration

### Poor Caption Quality

- Adjust caption_prompt to be more specific
- Lower temperature (0.3) for consistency
- Try different fps_sample values

## vLLM Server Management

### Manual Wake/Sleep

Wake model:

```bash
curl -X POST http://localhost:8023/wake_up
```

Put to sleep:

```bash
curl -X POST http://localhost:8023/sleep?level=1
```

Check status:

```bash
curl http://localhost:8023/is_sleeping
```

## Integration Examples

### With Video Preview Node

```
Video File → JoyCaption Media Describe → combined_caption
          → Video Preview → video_preview
```

### With Filename Generator

```
Video File → JoyCaption Media Describe → combined_caption
          → Filename Generator → filename
```

### With Metadata Node

```
Video File → JoyCaption Media Describe → combined_caption
          → Video Metadata Node → updated_video
```

## Performance Tips

1. **Faster Processing**: Increase fps_sample (fewer frames)
2. **Better Quality**: Decrease fps_sample (more frames)
3. **Consistent Output**: Lower temperature (0.3-0.4)
4. **Creative Output**: Higher temperature (0.7-1.0)
5. **Short Videos**: max_duration 5-10 seconds
6. **Long Videos**: max_duration 20-30 seconds

## File Locations

- **Node Code**: `nodes/media_describe/joycaption_describe.py`
- **Documentation**: `docs/nodes/media-describe/JOYCAPTION_MEDIA_DESCRIBE.md`
- **Registration**: `nodes/nodes.py`
- **Exports**: `nodes/media_describe/__init__.py`

## Next Steps

1. **Restart ComfyUI** to load the node
2. **Test with sample video** to verify functionality
3. **Adjust parameters** for your use case
4. **Check documentation** for advanced features

## Related Documentation

- Full Documentation: `JOYCAPTION_MEDIA_DESCRIBE.md`
- Media Describe Overview: `README.md`
- Gemini Media Describe: `MEDIA_DESCRIBE.md`
