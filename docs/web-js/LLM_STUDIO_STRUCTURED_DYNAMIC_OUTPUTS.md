# LLM Studio Structured Output - Dynamic Output Labels

## Overview

The LLM Studio Structured Describe nodes feature **dynamic output labels** that automatically update based on the selected schema preset. This provides clear visual feedback about what data each output contains without needing to remember field positions.

## How It Works

When you change the `schema_preset` dropdown, the JavaScript widget automatically updates the output slot labels to reflect the actual field names from the selected JSON schema.

### Visual Example

**Before (Generic Labels):**
```
LM Studio Structured Describe (Image)
├─ json_output
├─ field_1
├─ field_2
├─ field_3
├─ field_4
└─ field_5
```

**After Selecting "character_analysis" (Dynamic Labels):**
```
LM Studio Structured Describe (Image)
├─ json_output
├─ appearance
├─ expression
├─ pose
├─ clothing
└─ (empty)
```

## Schema-to-Label Mappings

### Character Analysis Schema
- **field_1** → `appearance` - Physical appearance details
- **field_2** → `expression` - Facial expression and emotion
- **field_3** → `pose` - Body position and posture
- **field_4** → `clothing` - Clothing and accessories
- **field_5** → (empty)

### Simple Description Schema
- **field_1** → `caption` - Single paragraph description
- **field_2** → `tags` - Comma-separated list of tags
- **field_3** → (empty)
- **field_4** → (empty)
- **field_5** → (empty)

### Video Description Schema
- **field_1** → `subject` - Main subject details
- **field_2** → `clothing` - Clothing and accessories
- **field_3** → `movement` - Body movements across frames
- **field_4** → `scene` - Physical environment
- **field_5** → `visual_style` - Lighting and camera techniques

## Features

### ✅ Real-Time Updates
Labels update immediately when you change the schema preset dropdown - no need to reload or recreate the node.

### ✅ Visual Clarity
Empty outputs are labeled as empty, making it clear which outputs contain data for the current schema.

### ✅ Both Node Types
Works identically for:
- **LLMStudioStructuredDescribe** (Image)
- **LLMStudioStructuredVideoDescribe** (Video)

### ✅ Workflow Persistence
Label updates are applied when:
- Node is first created
- Schema preset is changed
- Workflow is loaded from file

## Technical Implementation

### JavaScript Widget Registration

Located in `web/js/swiss-army-knife.js`, the implementation:

1. **Registers handlers** for both node types during `beforeRegisterNodeDef`
2. **Defines schema mappings** for each preset's field names
3. **Hooks into widget callback** to detect schema preset changes
4. **Updates output slots** by modifying `node.outputs[i].label` and `node.outputs[i].name`
5. **Forces canvas refresh** to show visual changes immediately

### Key Code Structure

```javascript
const SCHEMA_OUTPUT_LABELS = {
    "video_description": ["subject", "clothing", "movement", "scene", "visual_style"],
    "simple_description": ["caption", "tags", "", "", ""],
    "character_analysis": ["appearance", "expression", "pose", "clothing", ""]
};

// Update output labels function
this.updateOutputLabels = function(schemaPreset) {
    const labels = SCHEMA_OUTPUT_LABELS[schemaPreset] || ["", "", "", "", ""];
    
    for (let i = 0; i < 5; i++) {
        const outputIndex = i + 1; // Skip first output (json_output)
        if (this.outputs && this.outputs[outputIndex]) {
            const label = labels[i] || `field_${i + 1}`;
            this.outputs[outputIndex].label = label;
            this.outputs[outputIndex].name = label;
        }
    }
    
    this.setDirtyCanvas(true, true); // Force visual update
};
```

### Python Backend (Unchanged)

The Python backend always returns 6 outputs:
```python
RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "STRING")
RETURN_NAMES = ("json_output", "field_1", "field_2", "field_3", "field_4", "field_5")
```

The JavaScript layer only changes the **visual labels** - the actual data structure remains fixed at 6 outputs.

## Benefits

### For Users
- **Better UX**: Know exactly what each output contains at a glance
- **Faster Workflow**: No need to check documentation or test outputs
- **Less Confusion**: Empty outputs are clearly marked

### For Developers
- **No Backend Changes**: Python code remains simple with fixed output count
- **Easy Maintenance**: Schema mappings defined in one place
- **Extensible**: Easy to add new schemas by updating the mapping object

## Debug Mode

Enable **Debug Mode** in ComfyUI settings (`SwissArmyKnife.debug_mode`) to see detailed console logs:

```javascript
[SwissArmyKnife] [LLMStudioStructured] Updating output labels for schema: character_analysis
[SwissArmyKnife] [LLMStudioStructured] New labels: ["appearance", "expression", "pose", "clothing", ""]
[SwissArmyKnife] [LLMStudioStructured] Updated output 1: appearance
[SwissArmyKnife] [LLMStudioStructured] Updated output 2: expression
[SwissArmyKnife] [LLMStudioStructured] Updated output 3: pose
[SwissArmyKnife] [LLMStudioStructured] Updated output 4: clothing
[SwissArmyKnife] [LLMStudioStructured] Updated output 5: field_5
```

## Future Enhancements

Potential improvements:
- [ ] Hide empty outputs entirely (requires ComfyUI core support)
- [ ] Custom color coding for different field types
- [ ] Tooltip hints showing field descriptions
- [ ] Support for custom user-defined schemas

## Related Documentation

- [LM Studio Structured Output Node](../nodes/lm-studio-describe/LM_STUDIO_STRUCTURED.md)
- [Web JavaScript Widgets Overview](./README.md)
- [ComfyUI Custom Node JavaScript Development](../../AGENTS.md#web-extension-javascript-development)
