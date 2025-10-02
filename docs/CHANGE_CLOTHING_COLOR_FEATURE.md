# CHANGE_CLOTHING_COLOR_FEATURE

Purpose: Add a boolean option to the Gemini Util - Options node to instruct Gemini to change clothing colors in descriptions to new, scene-harmonized hues that differ from the original colors.

## What changed

- New option in `Gemini Util - Options`:
    - Name: `change_clothing_color`
    - Type: Boolean (Yes/No)
    - Default: No
    - Location: `nodes/nodes.py` under `GeminiUtilOptions.INPUT_TYPES`
- Propagated through the options object as `change_clothing_color: bool`.
- Used by both image and video prompts to adjust clothing color language when clothing descriptions are enabled.
- Included in caching options to avoid stale results when toggled.

## Behavior

- When `describe_clothing` is Yes AND `change_clothing_color` is Yes:
    - Text2Image prompt: In the CLOTHING paragraph, the model is instructed to state NEW clothing colors that harmonize with the scene (complementary/analogous/neutral), explicitly different from the original. The prompt forbids mentioning or comparing to the original color.
    - ImageEdit prompt: Adds a clause to change all clothing colors to NEW, scene-harmonized hues, explicitly different from the original; do not mention or reuse the original colors.
    - Video prompt: Same as image—CLOTHING paragraph instructs changing to NEW scene-harmonized hues and never referencing the original.

- When `describe_clothing` is No: The color-change logic is ignored.

## Files touched

- `nodes/nodes.py`
    - Added `change_clothing_color` to `GeminiUtilOptions.INPUT_TYPES`
    - Updated `GeminiUtilOptions.create_options` signature and returned options
    - Propagated option into `GeminiMediaDescribe.describe_media`
    - Updated `_process_image` and `_process_video` prompts and cache keys
- No changes needed in `web/js/swiss-army-knife.js` because ComfyUI auto-renders standard widgets for Python-defined inputs for the Options node.

## Validation

- Import check: `from nodes.nodes import NODE_CLASS_MAPPINGS` loads successfully
- Expected available nodes include `GeminiUtilVideoDescribe` or `GeminiUtilMediaDescribe` depending on current implementation; in this repo: `GeminiUtilMediaDescribe`, `GeminiUtilOptions`, `FilenameGenerator`.

## Usage

1. Add `Gemini Util - Options` node to your workflow.
2. Enable `Describe clothing` and toggle `Change clothing color` to `Yes`.
3. Connect the options to `Gemini Util - Media Describe` and run.
4. For image workflows, the `final_string` will include updated clothing colors; for video, the description will reflect new scene-harmonized clothing colors.

## Notes and future considerations

- Color selection is model-driven guidance; ensure the downstream model uses the prompt accordingly.
- If you want to force a particular palette family (e.g., warm neutrals), a future enhancement could expose a `clothing_color_palette_hint` string.
