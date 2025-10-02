# Twerking Action Replacement Feature

## Overview

The "Replace Action with Twerking" feature allows users to replace the standard video movement analysis with specific twerking content. When enabled, this option modifies the MOVEMENT paragraph generation in video processing.

## Implementation

### New Option

- **Option Name**: `replace_action_with_twerking`
- **Type**: Boolean (Yes/No)
- **Default**: No
- **Location**: Gemini Util - Options node

### Behavior

#### When Disabled (Default)

The standard movement analysis is performed:

- Describes body-part specific movement and musical rhythm alignment
- Provides chronological movement narration with precise action verbs
- Includes footwork, weight shifts, and choreography phrasing
- Maintains original detailed movement analysis

#### When Enabled

The movement prompt is replaced with:

1. **Initial Frame Description**: Describes the pose and body position in the first frame
2. **Twerking Content**: Appends the fixed text: "A woman is twerking and shaking her ass. She has a curvy body and a huge ass."

### Technical Details

#### Files Modified

- `nodes/nodes.py`:
    - Added `replace_action_with_twerking` to GeminiUtilOptions INPUT_TYPES
    - Updated `create_options()` method signature and implementation
    - Modified `_process_video()` method signature and movement prompt logic
    - Updated method call and default values

#### Code Location

- Movement prompt generation: Lines ~483-495 in `nodes/nodes.py`
- Option definition: Lines ~55-59 in `nodes/nodes.py`

### Usage Instructions

1. **Add Options Node**: Place "Gemini Util - Options" node in your workflow
2. **Configure Option**: Set "Replace Action with Twerking?" to "Yes"
3. **Connect to Media Describe**: Connect the options output to the Media Describe node
4. **Process Video**: The video analysis will use the twerking replacement in the movement paragraph

### Compatibility

- **Backward Compatible**: Existing workflows without the options node default to "No"
- **Video Only**: This feature only affects video processing, not image analysis
- **Paragraph Structure**: Maintains the standard paragraph numbering and structure

### Example Output

**Standard Movement Paragraph:**

```
3. MOVEMENT (Third Paragraph)
The subject initiates with a hip sway on the downbeat, then lifts the right arm upward while the torso tilts as the knees bend...
```

**With Twerking Replacement:**

```
3. MOVEMENT (Third Paragraph)
The subject stands with arms raised overhead in an energetic pose. A woman is twerking and shaking her ass. She has a curvy body and a huge ass.
```

## Configuration Options

The twerking replacement works in combination with other options:

- **Describe Subject**: Still controls whether subject descriptions are included
- **Describe Clothing**: Still controls clothing descriptions
- **Describe Bokeh**: Still controls cinematic effects
- **Other Options**: Unaffected by this feature

## Notes

- This feature is designed for specific content generation needs
- The replacement text is fixed and not customizable in the current implementation
- Only affects the MOVEMENT paragraph in video processing workflows
- Future enhancements could include customizable replacement text
