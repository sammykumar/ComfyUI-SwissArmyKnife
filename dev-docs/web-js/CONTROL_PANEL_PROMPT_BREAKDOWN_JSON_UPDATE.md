# Control Panel Prompt Breakdown - JSON Parsing Update

## Overview

Updated the **Control Panel Prompt Breakdown** node to exclusively use structured JSON parsing from the `raw_gemini_json` output. **Removed the brittle newline-splitting fallback logic** for cleaner, more maintainable code.

## Changes Made

### 1. Python Backend (`nodes/utils/control_panel.py`)

#### Updated Input Field

**Removed** `all_media_describe_data` input (legacy fallback)  
**Kept** `raw_gemini_json` as the sole input:

```python
@classmethod
def INPUT_TYPES(cls):
    return {
        "required": {},
        "optional": {
            "raw_gemini_json": ("STRING", {"forceInput": True, "tooltip": "Raw JSON response from Gemini API"}),
        },
    }
```

#### Simplified Parsing Logic

**Removed Complexity:**

- ❌ Removed fallback to paragraph parsing
- ❌ Removed `all_media_describe_data` handling
- ❌ Removed brittle `split("\n\n")` logic

**Kept Clean JSON Parsing:**

```python
# Parse structured JSON directly
gemini_data = json.loads(raw_gemini_json)
prompt_breakdown = {
    "subject": gemini_data.get("subject", ""),
    "cinematic_aesthetic": gemini_data.get("cinematic_aesthetic", ""),
    "stylization_tone": gemini_data.get("stylization_tone", ""),
    "clothing": gemini_data.get("clothing", ""),
    "scene": gemini_data.get("scene", ""),
    "movement": gemini_data.get("movement", "")
}
```

### 2. Parsing Logic Flow (Simplified)

```python
# Single parsing path - no fallback
if raw_gemini_json:
    gemini_data = json.loads(raw_gemini_json)
    prompt_breakdown["subject"] = gemini_data.get("subject", "")
    prompt_breakdown["cinematic_aesthetic"] = gemini_data.get(
        "cinematic_aesthetic_control",
        gemini_data.get("cinematic_aesthetic", "")
    )
    # ... extract other fields
else:
    return {"ui": {"status": ["No raw_gemini_json connected"]}}
```

### 3. Benefits

✅ **Cleaner Code**: Removed ~50 lines of fallback logic  
✅ **Single Responsibility**: Only parses structured JSON  
✅ **No Brittle Logic**: No more paragraph splitting  
✅ **Better Maintainability**: One parsing path to maintain  
✅ **Clear Error Messages**: Explicitly requires `raw_gemini_json`

### 4. Console Output

The updated code provides clear console feedback:

```
🔍 Parsing raw_gemini_json (structured JSON)
✅ Successfully parsed structured JSON from Gemini

📊 Prompt Breakdown:
  Subject: A woman lies on her back...
  Cinematic/Aesthetic: The scene is illuminated by bright...
  Stylization/Tone: The visual presentation conveys...
  Clothing: The woman wears no clothing...
  Scene: The scene unfolds in a brightly lit bedroom...
  Movement: The subject initiates with her legs spread...
```

Or when not connected:

```
(No valid data found in raw_gemini_json)
```

## Usage

### Required Setup (Simplified)

```
LLMStudioStructuredDescribe / LLMStudioStructuredVideoDescribe
  └─ json_output → Control Panel Prompt Breakdown (wire into `positive_prompt_json`)
```

## Migration Notes

- **Breaking Change**: Legacy `all_media_describe_data`/`raw_gemini_json` inputs removed
- **Action Required**: Connect the structured node's `json_output` (or any compatible JSON string) to the `positive_prompt_json` input
- **Legacy Workflows**: Need to swap MediaDescribe nodes for LM Studio structured nodes or other JSON sources
- **Benefit**: Cleaner, schema-driven parsing without brittle field positions

## Testing Recommendations

1. ✅ Test with `raw_gemini_json` connected (images)
2. ✅ Test with `raw_gemini_json` connected (videos)
3. ✅ Test with markdown code fences in JSON
4. ✅ Test with disabled fields (e.g., `describe_subject=False`)
5. ✅ Test error handling when `raw_gemini_json` not connected

## Related Files

- `nodes/utils/control_panel.py` - Python backend logic (**simplified**)
- `web/js/swiss-army-knife.js` - JavaScript UI display (unchanged)
- `nodes/media_describe/llm_studio_structured.py` - Source of `json_output`

## Date

October 13, 2025
