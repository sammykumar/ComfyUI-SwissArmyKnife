# JSON Response Format for Gemini Prompts

## Overview

Updated the Gemini system prompts to return responses in JSON format for both image and video processing. This provides structured output that is easier to parse and more reliable than paragraph-based parsing.

**New Output**: Added `raw_gemini_json` output node that contains the raw JSON response from Gemini before any processing or override application.

## Node Outputs

The Media Describe node now returns **5 outputs** (updated from 4):

1. **final_string** (STRING) - The final concatenated description with prefix and overrides applied
2. **all_media_describe_data** (STRING) - JSON containing all processed data including status and metadata
3. **raw_gemini_json** (STRING) - **NEW** - The raw JSON response directly from Gemini API
4. **height** (INT) - Output height dimension
5. **width** (INT) - Output width dimension

### raw_gemini_json Output

The new `raw_gemini_json` output provides:

- **Unprocessed response** from Gemini API
- **JSON format** as returned by the model
- **Before overrides** are applied
- **Direct access** to structured Gemini output

This is useful for:

- Debugging prompt responses
- Custom downstream processing
- Analyzing Gemini's raw output
- Building custom parsing logic

## Changes Made

### 1. Text2Image Prompt (Images)

**Previous Format**: Returned plain text paragraphs separated by blank lines
**New Format**: Returns JSON object with specific fields

#### JSON Structure for Images

```json
{
    "subject": "...", // Optional: if describe_subject is enabled
    "cinematic_aesthetic": "...", // Always included
    "stylization_tone": "...", // Always included
    "clothing": "..." // Optional: if describe_clothing is enabled
}
```

#### Field Names

- `subject` - Subject description (person, pose, hairstyle)
- `cinematic_aesthetic` - Lighting, camera, and optical details
- `stylization_tone` - Mood and genre descriptors
- `clothing` - Clothing and accessories description

### 2. Video Prompt

**Format**: Already using JSON, no changes needed

#### JSON Structure for Videos

```json
{
    "subject": "...",
    "clothing": "...",
    "scene": "...",
    "movement": "...",
    "cinematic_aesthetic_control": "...",
    "stylization_tone": "..."
}
```

```json
{
    "subject": "A woman lies on her back with her wavy hair spread across a white bed. Her arms are initially extended above her head and outward, then move to grip her own hair at the sides of her head, and later hold her thighs. Her facial expressions cycle through states of intense focus, wide-eyed surprise, and open-mouthed screaming. Her chest and abdomen visibly contract and relax with exertion.",
    "clothing": "The woman wears no clothing. She wears a plain ring on the fourth finger of her left hand. The male hand features a broad, golden wrist watch with a structured metal band on the left wrist.",
    "scene": "The scene unfolds in a brightly lit bedroom, featuring a large bed dressed with a crisp, white quilted comforter and white sheets. The comforter has subtle stitched lines forming a grid pattern. The background reveals a wooden headboard, light-colored walls, and a small bedside table with an unidentifiable object on it. The lighting is consistent throughout, suggesting a bright daytime interior.",
    "movement": "The subject initiates with her legs spread wide, maintaining this posture throughout the interaction. As a dark-colored phallus is introduced, her torso arches backward, her head tilting upwards with her mouth agape in response to each deep insertion. Her shoulders and arms remain extended for the initial thrusts, allowing her breasts to jiggle with the rhythmic motion. Midway through the sequence, she brings her hands upward to grip her wavy hair, pulling it as her facial expressions intensify with wide-eyed screams and a tensed jaw, coinciding with forceful penetrative movements. A dark-skinned hand, adorned with a golden watch, first rests on her lower abdomen, applying pressure during some thrusts, then shifts to hold her left thigh to assist in maintaining her leg position. The phallus performs consistent deep strokes into her vulva, marked by full withdrawals and re-insertions, causing her hips to lift and her legs to occasionally flex. Late in the sequence, another dark-skinned hand supports her right leg. The camera maintains a consistent, steady overhead shot, offering a direct top-down perspective on the interaction without any panning or tilting, then briefly cuts to a side angle before returning to the original overhead perspective.",
    "cinematic_aesthetic_control": "The scene is illuminated by bright, uniform light sourced from above, casting minimal shadows and creating a soft, even glow across the subjects and the bed. The camera maintains a static, high-angle overhead shot for the majority of the video, offering a direct, unflinching view of the action, with two brief, rapid camera movements to a side perspective before returning to the original overhead framing. Every element within the frame, from the textures of the bed linens to the skin tones of the subjects, remains in sharp focus. The overall exposure is bright and balanced, ensuring all details are clearly visible without over or underexposure.",
    "stylization_tone": "The visual presentation conveys a raw, intense realism, capturing a moment of extreme physical sensation with an unvarnished directness. The consistent overhead framing establishes a voyeuristic and intimate tone, emphasizing the emotional and physiological responses of the subject. The atmosphere is charged with a blend of pleasure and overwhelming sensation, lending itself to a genre of raw, intimate personal narrative."
}
```

### 3. Parser Updates

Updated `_parse_paragraphs()` method to:

- Support both `cinematic_aesthetic` (images) and `cinematic_aesthetic_control` (videos)
- Prioritize JSON parsing over paragraph parsing
- Maintain backward compatibility with paragraph format as fallback

## Benefits

1. **Structured Output**: JSON provides clear field boundaries
2. **Easier Parsing**: No ambiguity about paragraph order
3. **Better Error Handling**: JSON parsing errors are more explicit
4. **Consistent Format**: Both images and videos now use JSON
5. **Conditional Fields**: Only returns enabled fields in the JSON structure

## Implementation Details

### System Prompt Structure

The system prompt now includes:

1. **Output Format Section**: Specifies the exact JSON structure
2. **Content Requirements**: Describes what each field should contain
3. **Global Constraints**: Lists restrictions and requirements

### Example System Prompt Excerpt

```
## Output Format

Return **only** a single valid JSON object (no code fences, no extra text) with the following structure:

{
  "subject": "...",
  "cinematic_aesthetic": "...",
  "stylization_tone": "...",
  "clothing": "..."
}

Each field's value is one fully formed paragraph (a single string) for that category.
```

## Testing Recommendations

1. Test with `describe_subject` enabled and disabled
2. Test with `describe_clothing` enabled and disabled
3. Test with `describe_bokeh` enabled and disabled
4. Verify JSON parsing with markdown code fences
5. Verify fallback to paragraph parsing if JSON fails

## Date

October 13, 2025
