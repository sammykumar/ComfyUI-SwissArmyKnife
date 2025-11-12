# ShowText
Simple output node that prints and displays any string – perfect for showing prompts or captions in the UI.

## Inputs
- `text` – multiline string to display.

## Outputs
- `text` – the same string, so you can continue passing it downstream if needed.

## Usage Tips
1. Connect `positive_prompt` / `final_string` outputs from MediaDescribe to inspect them while iterating.
2. Mark as the final node in a prompt-check pipeline to keep ComfyUI from complaining about missing outputs.

## Additional Resources
- [Full documentation](docs/web-js/WIDGET_FIXES.md#using-showtext-helper-node)
