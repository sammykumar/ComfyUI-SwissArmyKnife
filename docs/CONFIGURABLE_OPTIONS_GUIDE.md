# Gemini Util - Configurable Options Guide

## Overview

The Gemini Describe functionality has been enhanced with configurable options through two nodes:

1. **Gemini Util - Options**: Configuration node that defines how descriptions should be generated
2. **Gemini Util - Media Describe**: Processing node that accepts media and optional configuration

## New Gemini Util - Options Node

### Purpose
This node provides granular control over description generation by separating configuration from media processing. Connect this node's output to the `gemini_options` input of the Media Describe node.

### Configuration Options

#### API & Model Settings
- **Gemini API Key**: Your Google Gemini API key
- **Gemini Model**: Choose from available models (2.5-flash, 2.5-flash-lite, 2.5-pro)
- **Model Type**: Text2Image or ImageEdit workflow type

#### Description Control (New Boolean Options)
- **Describe Clothing?** [Yes/No]: Include detailed clothing and accessory descriptions
- **Describe Hair Style?** [Yes/No]: Include hair texture and motion (but not color/length)
- **Describe Bokeh?** [Yes/No]: Allow depth of field effects and blur descriptions

#### Text Options
- **Prefix Text**: Text to prepend to generated descriptions

## Updated Media Describe Node

### Changes
- **Removed**: API key, model selection, description mode combo box, prefix text
- **Added**: Optional `gemini_options` input that accepts configuration from Options node
- **Maintained**: All media handling capabilities (upload, random selection, image/video support)

### Backward Compatibility
When no Options node is connected, the Media Describe node uses these defaults:
- Describe Clothing: No
- Describe Hair Style: Yes  
- Describe Bokeh: Yes
- API Key: Default development key
- Model: gemini-2.5-flash

## Usage Examples

### Basic Usage
1. Add "Gemini Util - Options" node to workflow
2. Configure desired settings
3. Add "Gemini Util - Media Describe" node
4. Connect Options node output to Media Describe `gemini_options` input
5. Provide media input (image tensor or upload)

### Option Combinations

#### For Minimal Descriptions (No Clothing, No Hair, No Bokeh)
- Clean, simple descriptions focusing on core elements
- Results in 3-paragraph structure: Subject, Cinematic, Style

#### For Detailed Fashion Analysis (Clothing + Hair)
- Comprehensive descriptions including garments and hairstyles
- Results in 4-paragraph structure when clothing enabled

#### For Sharp Focus Photography (No Bokeh)
- Explicitly prevents depth-of-field language
- Useful for product photography or architectural scenes

### System Prompt Improvements

#### Enhanced Decisiveness
All prompts now include instructions to avoid uncertain language:
- ❌ "She appears to be wearing either lace tights or leggings"
- ✅ "She wears black lace tights"

#### Hair Style Option
New granular control over hair descriptions:
- When enabled: Includes texture and movement
- When disabled: Completely omits hair references
- Always excludes: Color and length (as before)

#### Dynamic Paragraph Structure
- 3 paragraphs: Subject, Cinematic, Style (no clothing)
- 4 paragraphs: Subject, Cinematic, Style, Clothing (with clothing)
- 5-6 paragraphs for video: Adds Scene and Movement sections

## Migration Guide

### For Existing Workflows
Existing Media Describe nodes will continue working with default settings. To use new features:

1. Add Options node to workflow
2. Configure desired settings  
3. Connect to Media Describe node
4. Remove any hardcoded API keys from Media Describe node

### Option Mapping
Old combo box "Description Mode" maps to new options as follows:

- "Describe without clothing" → Clothing: No, Hair: Yes, Bokeh: Yes
- "Describe with clothing" → Clothing: Yes, Hair: Yes, Bokeh: Yes  
- "Describe without clothing (No bokeh)" → Clothing: No, Hair: Yes, Bokeh: No
- "Describe with clothing (No bokeh)" → Clothing: Yes, Hair: Yes, Bokeh: No

## Benefits

1. **Modularity**: Configure once, use with multiple media nodes
2. **Flexibility**: Mix and match options as needed
3. **Clarity**: Each option has a clear purpose
4. **Extensibility**: Easy to add new options in the future
5. **Precision**: More deterministic descriptions without uncertainty

## Troubleshooting

### No Description Generated
- Verify Options node is connected to Media Describe
- Check API key is valid
- Ensure media input is provided

### Unexpected Content
- Review individual option settings
- Check if hair/clothing/bokeh options match expectations
- Verify model type (Text2Image vs ImageEdit) is appropriate

### Backward Compatibility Issues
- Media Describe works standalone with defaults
- Only connect Options node if you need custom configuration