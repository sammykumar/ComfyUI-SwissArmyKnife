# LM Studio Structured Describe Nodes - Usage Guide

## Overview

Two new nodes that use LM Studio's JSON Schema structured output feature for guaranteed valid JSON responses.

## New Nodes

### 1. LM Studio Structured Describe (Image)

**Node ID**: `LLMStudioStructuredDescribe`

Analyzes single images with structured JSON output.

**Inputs:**

-   `base_url` - LM Studio server URL (default: http://192.168.50.41:1234)
-   `model_name` - Model to use (default: qwen3-vl-8b-thinking-mlx)
-   `image` - ComfyUI IMAGE tensor
-   `schema_preset` - Dropdown: video_description, simple_description, character_analysis
-   `prompt` - Text prompt for analysis
-   `temperature` - Generation temperature (0.0-2.0, default 0.2)
-   `verbose` - Show detailed logging

**Outputs:**

-   `json_output` - Complete JSON as string
-   `field_1` - First field value (e.g., "subject")
-   `field_2` - Second field value (e.g., "clothing")
-   `field_3` - Third field value (e.g., "movement")
-   `field_4` - Fourth field value (e.g., "scene")
-   `field_5` - Fifth field value (e.g., "visual_style")

### 2. LM Studio Structured Describe (Video)

**Node ID**: `LLMStudioStructuredVideoDescribe`

Analyzes videos with structured JSON output.

**Inputs:**

-   `base_url` - LM Studio server URL
-   `model_name` - Model to use
-   `video_path` - Path to video file
-   `sample_rate` - Frames per second to extract (default: 2.0)
-   `max_duration` - Maximum duration to sample (default: 5.0s)
-   `schema_preset` - Dropdown: video_description, simple_description, character_analysis
-   `prompt` - Text prompt for analysis
-   `temperature` - Generation temperature
-   `verbose` - Show detailed logging

**Outputs:**

-   `json_output` - Complete JSON as string
-   `field_1` through `field_5` - Individual field values
-   `frames_processed` - Number of frames analyzed

## Schema Presets

### video_description

Matches Gemini node output format with 5 fields:

```json
{
    "subject": "Detailed description of the main subject...",
    "clothing": "Detailed clothing and accessories...",
    "movement": "Body-part-specific movement...",
    "scene": "Physical environment details...",
    "visual_style": "Lighting, camera techniques..."
}
```

### simple_description

Simple caption and tags:

```json
{
    "caption": "Single paragraph description...",
    "tags": ["tag1", "tag2", "tag3"]
}
```

### character_analysis

Character-focused analysis:

```json
{
    "appearance": "Physical appearance details...",
    "expression": "Facial expression and emotion...",
    "pose": "Body position and posture...",
    "clothing": "Clothing and accessories..."
}
```

## Key Benefits

✅ **Guaranteed Valid JSON** - No markdown fences or extra text
✅ **Type Safety** - All required fields guaranteed to exist
✅ **No Manual Parsing** - Direct JSON deserialization
✅ **Multiple Outputs** - Access both full JSON and individual fields
✅ **Schema Validation** - Automatic validation against schema
✅ **May Eliminate Thinking Tags** - Test to verify with your model

## Usage Example

```
┌────────────────────────────────────┐
│ Load Image                         │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ LM Studio Structured Describe     │
│                                    │
│ Schema: video_description          │
│ Model: qwen3-vl-8b-thinking-mlx   │
└──┬──┬──┬──┬──┬──────────────────────┘
   │  │  │  │  │
   │  │  │  │  └─► visual_style
   │  │  │  └────► scene
   │  │  └───────► movement
   │  └──────────► clothing
   └─────────────► subject (or json_output)
```

## Testing

### Test the nodes work:

```bash
# In ComfyUI terminal after restart:
python3 -c "from nodes.media_describe.llm_studio_structured import LLMStudioStructuredDescribe; print('✅ Node imports successfully')"
```

### Test structured output directly:

```bash
python3 /tmp/test_lmstudio_structured.py /path/to/image.jpg
```

This will:

1. Test prompt-based approach (old way)
2. Test structured output with completions endpoint
3. Test structured output with chat completions endpoint
4. Show which approach produces cleanest JSON
5. Check for thinking tags in responses

## Troubleshooting

### Node doesn't appear in ComfyUI

1. Restart ComfyUI server completely
2. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
3. Check console for import errors

### "Model not found" error

-   Ensure qwen3-vl-8b-thinking-mlx is loaded in LM Studio
-   Check model name matches exactly (case-sensitive)
-   Verify LM Studio is running on specified URL

### "Failed to parse JSON response" error

This should NOT happen with structured output. If it does:

1. Test if your model supports structured output
2. Run the test script to diagnose
3. Check LM Studio version (ensure it's recent)

### Empty field outputs

-   Check `json_output` to see full response
-   Verify schema_preset matches expected fields
-   Try `verbose=True` to see detailed logs

## Comparison with Original Nodes

| Feature        | Original LLMStudio Nodes | New Structured Nodes |
| -------------- | ------------------------ | -------------------- |
| JSON Output    | ❌ Via prompting         | ✅ Via JSON Schema   |
| Valid JSON     | ⚠️ Requires cleanup      | ✅ Guaranteed        |
| Thinking Tags  | ⚠️ May appear            | ✅ May be eliminated |
| Field Access   | ❌ Manual parsing        | ✅ Direct outputs    |
| Schema Presets | ❌ None                  | ✅ 3 built-in        |
| Reliability    | ⚠️ Model-dependent       | ✅ Schema-enforced   |

## Next Steps

1. **Restart ComfyUI** to load new nodes
2. **Test** with your model to verify:
    - Does structured output work?
    - Are thinking tags eliminated?
    - Is output quality good?
3. **Use** in workflows and compare vs original nodes
4. **Report** any issues or unexpected behavior

## Files Created

-   `nodes/media_describe/llm_studio_structured.py` - Node implementation
-   `docs/nodes/lm-studio-describe/STRUCTURED_OUTPUT_IMPLEMENTATION.md` - This file
-   `/tmp/test_lmstudio_structured.py` - Test script

## Related Documentation

-   [Structured Output Proposal](./STRUCTURED_OUTPUT_PROPOSAL.md) - Detailed proposal and design
-   [LM Studio Documentation](https://lmstudio.ai/docs/developer/openai-compat/structured-output)
