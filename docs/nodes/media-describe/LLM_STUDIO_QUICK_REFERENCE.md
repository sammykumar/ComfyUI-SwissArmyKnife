# LLM Studio Video Describe - Quick Reference

**Quick access guide for the LLM Studio Video Describe node**

## Basic Usage

```python
# Node: LLM Studio Video Describe
# Category: Swiss Army Knife 🔪/Media Caption

Inputs:
  base_url: "http://192.168.50.41:1234"
  model_name: "qwen/qwen3-vl-30b"
  video_path: "/path/to/video.mp4"
  fps_sample: 1.0
  max_duration: 5.0
  temperature: 0.5
  verbose: False

Outputs:
  combined_caption: STRING  # Final video description
  frame_captions: STRING    # Individual frame captions (JSON)
  frames_processed: INT     # Number of frames processed
```

## Common Configurations

### Quick Scan (Fast)

- `fps_sample`: 2.0 (1 frame every 2 seconds)
- `max_duration`: 3.0 (first 3 seconds only)
- `temperature`: 0.3 (consistent output)

### Detailed Analysis (Slow)

- `fps_sample`: 0.5 (2 frames per second)
- `max_duration`: 10.0 (first 10 seconds)
- `temperature`: 0.7 (more creative)

### Balanced (Recommended)

- `fps_sample`: 1.0 (1 frame per second)
- `max_duration`: 5.0 (first 5 seconds)
- `temperature`: 0.5 (balanced)

## Setup Checklist

- [ ] LM Studio is running
- [ ] Vision model is loaded in LM Studio
- [ ] Model name matches exactly
- [ ] Base URL is correct (default: `http://192.168.50.41:1234`)
- [ ] Video file path is valid

## Supported Models

Vision-language models that work with this node:

- `qwen/qwen3-vl-30b` (default)
- `qwen/qwen3-vl-7b`
- Other models with vision capabilities supported by LM Studio

## Error Quick Fixes

| Error                            | Fix                                |
| -------------------------------- | ---------------------------------- |
| "Failed to connect to LM Studio" | Start LM Studio and load a model   |
| "Video file not found"           | Check video path is correct        |
| "No frames extracted"            | Verify video file is valid         |
| "Error processing frame"         | Check model supports vision inputs |

## Key Differences from JoyCaption

| Feature    | LLM Studio        | JoyCaption |
| ---------- | ----------------- | ---------- |
| API        | OpenAI-compatible | vLLM HTTP  |
| Port       | 1234              | 8023       |
| Sleep/Wake | ❌ No             | ✅ Yes     |
| Client     | `openai` package  | `requests` |

## Performance Tips

1. **Reduce frame count**: Increase `fps_sample` or decrease `max_duration`
2. **Use GPU**: Enable GPU acceleration in LM Studio settings
3. **Lower temperature**: Use 0.3-0.5 for faster, consistent captions
4. **Smaller model**: Use 7B variant instead of 30B if available

## Full Documentation

See [LLM_STUDIO_MEDIA_DESCRIBE.md](./LLM_STUDIO_MEDIA_DESCRIBE.md) for complete documentation.

## Related Nodes

- **JoyCaption Media Describe** - Alternative using vLLM
- **Media Describe** - Gemini-based analysis
- **Video Preview** - View frames and video

## Last Updated

October 14, 2025
