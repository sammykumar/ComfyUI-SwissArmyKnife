# Clothing Text and Typography Exclusion Enhancement

## Overview

Enhanced the Gemini clothing description prompts to exclude any text, typography, words, letters, logos, brand names, or written content visible on clothing or accessories. This addresses the issue where brand names like "PSD" on shorts would be included in descriptions.

## Changes Made

### Before

The clothing description prompts only excluded "logos or brand names":

```
Do not describe logos or brand names. Exclude tattoos, glasses, and other prohibited attributes.
```

### After

Enhanced exclusion to cover all forms of text and typography:

```
Do not describe any text, typography, words, letters, logos, brand names, or written content visible on clothing or accessories. Exclude tattoos, glasses, and other prohibited attributes.
```

## Implementation Details

The changes were applied to both image and video processing in `utils/nodes.py`:

1. **Image Processing** (Line ~174): Updated the CLOTHING paragraph prompt in the `_process_image` method
2. **Video Processing** (Line ~416): Updated the CLOTHING paragraph prompt in the `_process_video` method

Both instances now use the comprehensive text exclusion language.

## Examples of Exclusions

### What Gets Excluded Now ✅

- Brand names: "PSD", "Nike", "Adidas", "Supreme"
- Typography: Stylized fonts, decorative lettering
- Words/Text: Any readable text on clothing
- Letters: Individual letters or monograms
- Written content: Printed messages, slogans, quotes
- Logos: Company logos, symbols with text components

### What Still Gets Described ✅

- Garment type and style
- Colors and materials
- Fit and silhouette
- Construction details (seams, straps, waistbands)
- Fabric texture and behavior
- Overall design elements (excluding text)

## Benefits

1. **Cleaner Descriptions**: No unwanted brand references in generated prompts
2. **Copyright Compliance**: Avoids reproducing trademarked brand names
3. **Focus on Style**: Emphasizes actual clothing design over commercial messaging
4. **Consistent Exclusion**: Comprehensive coverage of all text-related elements

## Technical Notes

- Changes maintain all existing functionality
- No breaking changes to API or node structure
- Applies to both Text2Image and Video processing modes
- Works with all configurable options (describe_clothing enabled)
- Backward compatible with existing workflows

## Usage

This enhancement automatically applies when:

- Using `GeminiMediaDescribe` node with clothing descriptions enabled
- Processing images or videos with visible text on clothing
- Any workflow where clothing description is part of the output

No configuration changes needed - the improvement is applied automatically to all clothing descriptions.
