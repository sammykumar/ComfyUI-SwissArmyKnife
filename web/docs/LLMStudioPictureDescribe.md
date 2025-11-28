# LLMStudioPictureDescribe
Send a single image tensor to LM Studio and receive a richly detailed caption using the selected VL model.

## Inputs
- `base_url`, `model_name` – LM Studio endpoint + model.
- `image` – ComfyUI IMAGE tensor to caption.
- `caption_prompt` – instructions for what to focus on.
- `temperature`, `verbose` – language style + logging.

## Outputs
- `caption` – generated paragraph describing the input image.

## Usage Tips
1. Insert the node after any IMAGE output (e.g., generated frames, uploads).
2. Tweak the prompt to emphasize facial features, outfits, etc., then route the caption to ShowText or Control Panel.

## Additional Resources
- [Full documentation](docs/nodes/lm-studio-describe/LM_STUDIO_VIDEO_DESCRIBE.md#related-nodes)
