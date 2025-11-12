# LLMStudioVideoDescribe
Extract frames from a video clip and ask an LM Studio-hosted VL model (e.g., Qwen3-VL) to describe the action.

## Inputs
- `base_url`, `model_name` – LM Studio host and model identifier.
- `video_path` – absolute/relative path to the clip to analyze.
- `sample_rate`, `max_duration` – control how many frames are sampled.
- `caption_prompt`, `temperature`, `verbose` – tailor the language output and logging.

## Outputs
- `combined_caption` – merged clip description.
- `frame_captions` – JSON blob of per-frame captions (mirrors combined caption in v2).
- `frames_processed` – integer count for sanity checks.

## Usage Tips
1. Point `video_path` at a trimmed clip (use MediaSelection/VHS nodes to prep).
2. Adjust sample rate/duration to balance detail vs speed.
3. Feed the caption into downstream prompt or logging nodes.

## Additional Resources
- [Full documentation](docs/nodes/llm-studio-describe/LLM_STUDIO_VIDEO_DESCRIBE.md)
