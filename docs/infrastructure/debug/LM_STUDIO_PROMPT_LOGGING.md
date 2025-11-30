# LM Studio Prompt Logging

Debug logging for LM Studio API calls inside the **LM Studio Structured Describe** nodes.

## Overview

When using LM Studio for media description, it's crucial to verify that prompts are being sent correctly. The verbose logging system provides detailed insight into:

- System prompts being constructed
- User prompts being sent
- Model configuration options
- Media type and model type selection

## Enabling Verbose Logging

Set `verbose=True` on the **LM Studio Structured Describe** (image) or **LM Studio Structured Video Describe** nodes to enable detailed prompt logging.

## Log Output Format

### Prompt Construction Log

Shows the initial configuration after prompts are built:

```
============================================================
🔧 LM Studio Prompt Construction:
============================================================
Media Type: image
Model Type: Text2Image
Describe Clothing: True
Change Clothing Color: False
Describe Hair Style: True
Describe Bokeh: True
Describe Subject: True
============================================================
```

### Frame Processing Log (Videos)

Shows prompts when processing video with all frames sent in a single request:

```
📹 Extracting 5 frames from video...
✅ Extracted frame 1/5
✅ Extracted frame 2/5
✅ Extracted frame 3/5
✅ Extracted frame 4/5
✅ Extracted frame 5/5

============================================================
🔍 LM Studio Video Prompt Debug:
============================================================
📝 System Prompt:
You are an expert assistant specialized in analyzing and verbalizing input videos for cinematic-quality video transformation using the Wan 2.2 + VACE workflow.

DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions...

Return **only** a single valid JSON object with **exactly six** string fields in this exact order:
1. "subject" - Detailed description of the main subject
2. "clothing" - Clothing and style details
3. "movement" - Actions, motion, and choreography across frames
4. "scene" - Setting, environment, and background elements
5. "cinematic_aesthetic_control" - Lighting, camera details, and rendering cues
6. "stylization_tone" - Mood/genre descriptors

Each field's value is one fully formed paragraph (a single string) for that category.

📝 User Prompt:
Please analyze this video and provide a detailed description in the JSON format specified in the system prompt.

📊 Sending 5 frames in single request
============================================================

✅ Video analysis complete: {"subject": "The video begins with a close-up of...
```

### Image Processing Log

Shows prompts for single image analysis:

```
============================================================
🔍 LM Studio Image Prompt Debug:
============================================================
📝 System Prompt:
Generate a Wan 2.2 optimized text to image prompt. You are an expert assistant specialized in analyzing and verbalizing input media for instagram-quality posts using the Wan 2.2 Text to Image workflow.

DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions...

Return **only** a single valid JSON object with **exactly six** string fields in this exact order:
1. "subject" - Detailed description of the main subject
2. "clothing" - Clothing and style details
3. "movement" - Pose, gesture, or implied motion
4. "scene" - Setting, environment, and background elements
5. "cinematic_aesthetic" - Lighting, camera details, and rendering cues
6. "stylization_tone" - Mood/genre descriptors

Each field's value is one fully formed paragraph (a single string) for that category.

📝 User Prompt:
Please analyze this image and provide a detailed description in the JSON format specified in the system prompt.
============================================================
```

## Prompt Variations

### Text2Image Mode (Images)

**System Prompt Pattern**:

- Specifies Wan 2.2 Text to Image workflow
- Requires JSON output with 6 fields
- Uses "cinematic_aesthetic" field name
- Emphasizes decisiveness

**User Prompt**:

- Simple analysis request
- References JSON format from system prompt

### ImageEdit Mode (Images)

**System Prompt Pattern**:

- Focuses on Qwen-Image-Edit instructions
- Requires single-sentence output
- No JSON structure
- Emphasizes decisiveness

**User Prompt**:

- Requests single-sentence instruction
- References guidelines from system prompt

### Text2Image Mode (Videos)

**System Prompt Pattern**:

- Specifies Wan 2.2 + VACE workflow
- Requires JSON output with 6 fields
- Uses "cinematic_aesthetic_control" field name (different from images!)
- Emphasizes movement and choreography
- Emphasizes decisiveness

**User Prompt**:

- Video-specific analysis request
- References JSON format from system prompt

## Common Issues Debugged

### 1. Empty or Generic Responses

**Symptom**: LLM returns generic captions instead of structured JSON

**Debug Check**:

- Verify system prompt includes JSON structure definition
- Check that model_type is correctly set (Text2Image vs ImageEdit)
- Ensure media_type matches actual media (image vs video)

### 2. Wrong Field Names

**Symptom**: JSON response uses different field names than expected

**Debug Check**:

- Video prompts use "cinematic_aesthetic_control"
- Image prompts use "cinematic_aesthetic"
- Verify prompt construction matches media type

### 3. Uncertain Language

**Symptom**: Descriptions include "appears to be", "seems to be", etc.

**Debug Check**:

- Verify DECISIVENESS REQUIREMENT appears in system prompt
- Check that prompt includes forbidden phrases list

### 4. Non-JSON Responses

**Symptom**: Response is paragraph format instead of JSON

**Debug Check**:

- Verify "Return **only** a single valid JSON object" appears in system prompt
- Check max_tokens is sufficient (1000 for videos, 500 for images)
- Ensure model supports vision input
- For videos, verify frames are being sent correctly in content array

### 5. Poor Video Understanding (FIXED)

**Symptom**: Video descriptions lack temporal coherence or motion tracking

**Solution**: As of the latest update, all video frames are sent in a **single API request**, allowing the model to:

- Understand temporal relationships between frames
- Track motion and action progression across the sequence
- Generate more coherent descriptions
- Reduce network overhead (1 request instead of N requests)
- Better leverage Qwen3-VL's video understanding capabilities

### 6. JSON Not Being Parsed (FIXED)

**Symptom**: Control Panel shows entire JSON string in "Subject" field instead of parsed fields

**Root Cause**: Code was ignoring the JSON response and creating a simplified structure

**Solution**: Updated code to:

- Parse JSON response from LM Studio
- Normalize field names (`cinematic_aesthetic_control` → `cinematic_aesthetic`)
- Ensure all required fields exist
- Fall back to simple structure only if JSON parsing fails

**Debug Output**:

```
============================================================
🔍 Parsing LLM Response:
============================================================
Raw response:
{"subject": "A close-up of a person's mouth...", "clothing": "...", ...}
============================================================

✅ Successfully parsed JSON response
Fields found: ['subject', 'clothing', 'movement', 'scene', 'cinematic_aesthetic', 'stylization_tone']
```

## Code Location

Implementation: `nodes/media_describe/media_describe.py`

Key methods:

- `_process_with_llm_studio()` - Lines 1773-2080 (updated)
- System prompt construction - Lines 1825-1858
- Video frame extraction - Lines 1888-1930 (single request approach)
- Image logging - Lines 1978-1986

## Related Documentation

- [Structured Output Implementation Notes](../../nodes/lm-studio-describe/STRUCTURED_OUTPUT_IMPLEMENTATION.md)
- [Structured Output Proposal](../../nodes/lm-studio-describe/STRUCTURED_OUTPUT_PROPOSAL.md)
- [Debug Mode Implementation](DEBUG_MODE_IMPLEMENTATION.md)
