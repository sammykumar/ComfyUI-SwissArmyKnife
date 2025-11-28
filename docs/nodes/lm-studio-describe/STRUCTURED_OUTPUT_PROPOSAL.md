# LM Studio Structured Output Implementation Proposal

## Overview

LM Studio supports structured output via JSON Schema, which is more reliable than prompting for JSON in natural language. This proposal outlines how to implement structured output for the LM Studio nodes.

**Reference**: https://lmstudio.ai/docs/developer/openai-compat/structured-output

## Current State (Prompt-Based)

Currently, both Gemini and LM Studio nodes request JSON output via prompts:

```python
# Current approach in media_describe.py (Gemini nodes)
DEFAULT_IMAGE_TEXT2IMAGE_SYSTEM_PROMPT = """
Return **only** a single valid JSON object (no code fences, no extra text)
with **exactly five** string fields in this exact order:
1. "subject" - Detailed description of the main subject
2. "clothing" - Clothing and style details
3. "movement" - Pose, gesture, or implied motion
4. "scene" - Setting, environment, and background
5. "visual_style" - Lighting, camera, mood/genre
"""
```

**Problems with this approach:**

-   ❌ Model might include markdown code fences (```json)
-   ❌ Model might add extra explanation text
-   ❌ No guarantee of field presence or types
-   ❌ Requires manual JSON parsing and error handling
-   ❌ Less reliable across different models

## Proposed Solution: JSON Schema

LM Studio supports structured output via the `response_format` parameter in both endpoints:

### 1. Chat Completions Endpoint

```python
response = client.chat.completions.create(
    model="qwen3-vl-8b-thinking-mlx",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": [
            {"type": "text", "text": "Describe this image"},
            {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,..."}}
        ]}
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "video_description",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "subject": {
                        "type": "string",
                        "description": "Detailed description of the main subject"
                    },
                    "clothing": {
                        "type": "string",
                        "description": "Clothing and style details"
                    },
                    "movement": {
                        "type": "string",
                        "description": "Pose, gesture, or implied motion"
                    },
                    "scene": {
                        "type": "string",
                        "description": "Setting, environment, and background"
                    },
                    "visual_style": {
                        "type": "string",
                        "description": "Lighting, camera, mood/genre"
                    }
                },
                "required": ["subject", "clothing", "movement", "scene", "visual_style"],
                "additionalProperties": False
            }
        }
    }
)

# Response is guaranteed to be valid JSON matching the schema
result = json.loads(response.choices[0].message.content)
```

### 2. Completions Endpoint

```python
import requests

response = requests.post(
    "http://192.168.50.41:1234/v0/completions",
    json={
        "model": "qwen3-vl-8b-thinking-mlx",
        "prompt": "Describe this image in detail",
        "images": ["data:image/jpeg;base64,..."],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "video_description",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "subject": {"type": "string"},
                        "clothing": {"type": "string"},
                        "movement": {"type": "string"},
                        "scene": {"type": "string"},
                        "visual_style": {"type": "string"}
                    },
                    "required": ["subject", "clothing", "movement", "scene", "visual_style"]
                }
            }
        }
    }
)

result = response.json()
content = json.loads(result["choices"][0]["text"])
```

## Benefits of Structured Output

✅ **Guaranteed valid JSON** - No markdown fences or extra text  
✅ **Type safety** - Fields are guaranteed to exist and have correct types  
✅ **No manual parsing** - Direct JSON deserialization  
✅ **More reliable** - Works consistently across models  
✅ **Better performance** - Model knows exactly what format to generate  
✅ **Validation** - Schema validates output automatically

## Implementation Recommendations

### Option 1: Add to Existing Nodes (Minimal Change)

Add an optional parameter to enable structured output:

```python
"use_structured_output": ("BOOLEAN", {
    "default": True,
    "tooltip": "Use JSON schema for structured output (more reliable)"
}),
"output_schema": (["video_description", "simple_description", "custom"], {
    "default": "video_description",
    "tooltip": "JSON schema to use for structured output"
})
```

### Option 2: Create New Node (Recommended)

Create a dedicated `LLMStudioStructuredDescribe` node that:

-   Always uses structured output (no option to disable)
-   Has predefined schemas matching the Gemini node outputs
-   Returns both raw JSON and individual field outputs
-   Supports custom schemas via JSON string input

```python
RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "STRING")
RETURN_NAMES = ("json_output", "subject", "clothing", "movement", "scene", "visual_style")
```

## JSON Schema Presets

### Preset 1: Video Description (Matches Gemini Output)

```python
VIDEO_DESCRIPTION_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "video_description",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "subject": {
                    "type": "string",
                    "description": "Detailed description of the main subject including posture, gestures, facial expressions, and body positioning"
                },
                "clothing": {
                    "type": "string",
                    "description": "Detailed clothing and accessories with specific colors, materials, textures, fit, construction details"
                },
                "movement": {
                    "type": "string",
                    "description": "Body-part-specific movement across frames with precise action verbs and transitions"
                },
                "scene": {
                    "type": "string",
                    "description": "Physical environment details including walls, floors, furniture, lighting, spatial layout"
                },
                "visual_style": {
                    "type": "string",
                    "description": "Combined lighting, camera techniques, color grading, mood, genre aesthetics"
                }
            },
            "required": ["subject", "clothing", "movement", "scene", "visual_style"],
            "additionalProperties": False
        }
    }
}
```

### Preset 2: Simple Description

```python
SIMPLE_DESCRIPTION_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "simple_description",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "caption": {
                    "type": "string",
                    "description": "Single paragraph description of the image/video"
                },
                "tags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of relevant tags/keywords"
                }
            },
            "required": ["caption", "tags"],
            "additionalProperties": False
        }
    }
}
```

### Preset 3: Character Analysis

```python
CHARACTER_ANALYSIS_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "character_analysis",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "appearance": {
                    "type": "string",
                    "description": "Physical appearance details"
                },
                "expression": {
                    "type": "string",
                    "description": "Facial expression and emotion"
                },
                "pose": {
                    "type": "string",
                    "description": "Body position and posture"
                },
                "clothing": {
                    "type": "string",
                    "description": "Clothing and accessories"
                }
            },
            "required": ["appearance", "expression", "pose", "clothing"],
            "additionalProperties": False
        }
    }
}
```

## Migration Path

### Phase 1: Test & Validate

1. Create test script to validate structured output works with qwen3-vl-8b-thinking-mlx
2. Compare output quality between prompt-based and schema-based approaches
3. Verify all LM Studio models support structured output

### Phase 2: Implement Optional Feature

1. Add `use_structured_output` parameter to existing nodes
2. Keep backward compatibility with prompt-based approach
3. Default to structured output for new users

### Phase 3: Dedicated Node

1. Create `LLMStudioStructuredDescribe` node
2. Include preset schemas
3. Support custom schema input
4. Multiple output pins for individual fields

### Phase 4: Documentation

1. Update node documentation
2. Create examples comparing approaches
3. Add troubleshooting guide
4. Document custom schema creation

## Testing Script

Create `/tmp/test_lmstudio_structured.py`:

```python
#!/usr/bin/env python3
"""Test LM Studio structured output with JSON schema"""

import base64
import json
import requests
from pathlib import Path

BASE_URL = "http://192.168.50.41:1234"
MODEL_NAME = "qwen3-vl-8b-thinking-mlx"

VIDEO_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "video_description",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "subject": {"type": "string"},
                "clothing": {"type": "string"},
                "movement": {"type": "string"},
                "scene": {"type": "string"},
                "visual_style": {"type": "string"}
            },
            "required": ["subject", "clothing", "movement", "scene", "visual_style"],
            "additionalProperties": False
        }
    }
}

def test_structured_output(image_path: str):
    with open(image_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode("utf-8")

    # Test with completions endpoint
    response = requests.post(
        f"{BASE_URL}/v0/completions",
        json={
            "model": MODEL_NAME,
            "prompt": "Analyze this image and describe it in detail",
            "images": [f"data:image/jpeg;base64,{base64_image}"],
            "response_format": VIDEO_SCHEMA,
            "temperature": 0.2
        },
        timeout=120
    )

    result = response.json()
    print("Raw response:")
    print(json.dumps(result, indent=2))

    # Parse structured output
    content = json.loads(result["choices"][0]["text"])
    print("\nParsed structured output:")
    print(json.dumps(content, indent=2))

    # Validate schema
    assert "subject" in content
    assert "clothing" in content
    assert "movement" in content
    assert "scene" in content
    assert "visual_style" in content
    print("\n✅ Schema validation passed!")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        test_structured_output(sys.argv[1])
    else:
        print("Usage: python3 test_lmstudio_structured.py /path/to/image.jpg")
```

## Next Steps

1. **Test**: Run the test script to validate structured output works
2. **Decide**: Choose between Option 1 (modify existing) or Option 2 (new node)
3. **Implement**: Add structured output support
4. **Document**: Update documentation with examples
5. **Compare**: Benchmark quality vs prompt-based approach

## Questions to Answer

-   [ ] Does qwen3-vl-8b-thinking-mlx support structured output?
-   [ ] Does structured output eliminate thinking tags?
-   [ ] What's the performance impact?
-   [ ] Should we make this the default?
-   [ ] Do we need custom schema support?
-   [ ] Should we migrate Gemini nodes too?
