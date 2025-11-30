# Summary
Generates JSON-structured descriptions for a single image using LM Studio's schema-enforced responses. Default behavior targets photorealistic character analysis with the Visionary Image Architect system prompt that locks appearance, expression, pose, and clothing outputs for Wan 2.2 workflows.

# Inputs
- `base_url`: LM Studio endpoint (default `http://192.168.50.41:1234`).
- `model_name`: Any loaded LM Studio multimodal model (defaults to `qwen3-vl-8b-thinking-mlx`).
- `image`: IMAGE tensor to analyze.
- `schema_preset`: Choose `simple_description` or `character_analysis` (default). Character mode uses the new architect prompt described above.
- `system_prompt`: Override instructions if you need a custom style.
- `user_prompt`: Free-form request text.
- `temperature`, `top_p`, `max_tokens`, `verbose`: Standard generation controls.

# Outputs
- `json_output`: The entire LM Studio response string.
- `field_1` … `field_5`: Individual schema fields mapped in order (appearance, expression, pose, clothing when using `character_analysis`).

# Usage Tips
- Keep `schema_preset` on `character_analysis` to leverage the Visionary Image Architect default; switch to `simple_description` for lightweight captions.
- Use `verbose=True` while troubleshooting to inspect payloads and LM Studio errors in the console.
- The system prompt enforces decisive wording—omit hedging phrases in your own overrides to maintain consistency.
- Downstream nodes can parse the JSON string or read the individual field outputs without extra string handling.

# Documentation
- Full guide: [docs/nodes/lm-studio-describe/STRUCTURED_OUTPUT_IMPLEMENTATION.md](../../docs/nodes/lm-studio-describe/STRUCTURED_OUTPUT_IMPLEMENTATION.md)
