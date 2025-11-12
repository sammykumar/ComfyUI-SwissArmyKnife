# MultiCaptionCombiner

Combine multiple frame captions into a cohesive description using Google Gemini—ideal after captioning individual frames extracted from a video.

## Inputs

- `captions` – comma- or newline-separated captions (one per frame).
- `gemini_api_key` – API key for the Gemini client.
- `gemini_model` – model identifier (e.g., `models/gemini-2.0-flash-exp`).
- `combination_style` – Action Summary, Chronological Narrative, Movement Flow, or Custom.
- Optional: `timestamps`, `custom_prompt` (for Custom style), and `output_format` (Paragraph, Bullet Points, Scene Description).

## Outputs

- `combined_caption` – the final synthesized description.
- `gemini_status` – log/status string summarizing model, style, count, and outcome.

## Usage Tips

1. Feed comma-separated captions directly from an external captioning pipeline or a CSV export.
2. Provide timestamps to give Gemini temporal context (“Frame at 0.8s…”) when summarizing motion.
3. Use `combination_style="Custom"` plus `custom_prompt` to steer tone (e.g., instructional vs. descriptive).

## Additional Resources

- [Full documentation](docs/nodes/media-selection/MEDIA_SELECTION.md#multicaptioncombinercombine_captions)
