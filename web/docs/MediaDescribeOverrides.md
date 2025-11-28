# MediaDescribeOverrides
Override individual paragraphs (subject, visual style, clothing, scene, action) that Gemini would normally author.

## Inputs
- `prompt_prefix` – text that should appear before every generated description.
- Paragraph override fields – supply custom subject/visual style/clothing/scene/action strings only where needed.

## Outputs
- `overrides` – dictionary wiring directly into MediaDescribe's overrides input.

## Usage Tips
1. Fill only the fields you want to replace; leave others empty to preserve Gemini output.
2. Connect the result to MediaDescribe's `overrides` input before running the workflow.

## Additional Resources
- [Full documentation](docs/nodes/media-describe/MEDIA_DESCRIBE.md#media-describe-overrides)
