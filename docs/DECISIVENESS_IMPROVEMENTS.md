# Gemini Prompt Decisiveness Improvements

## Overview

Enhanced the Gemini prompts to eliminate uncertainty language and provide more decisive, confident descriptions. The changes address the issue where Gemini would respond with uncertain phrases like "holding a black folder or book" instead of making a definitive choice.

## Changes Made

### 1. Text2Image Prompts (Image Processing)

**Added prominent decisiveness requirement early in system prompt:**

```
DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions. When you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or". Instead of "holding a black folder or book", write "holding a black folder". Instead of "wearing what appears to be denim", write "wearing dark blue denim jeans".
```

**Enhanced critical note to be more explicit:**

-   Added comprehensive list of uncertainty phrases to avoid
-   Added instruction to "confidently choose one and state it as absolute fact"

### 2. ImageEdit Prompts

**Added decisiveness requirement to single-sentence ImageEdit instructions:**

```
Always be completely decisive and definitive - when you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or". Instead of "holding a black folder or book", write "holding a black folder".
```

### 3. Video Processing Prompts

**Added same decisiveness requirement to video analysis:**

-   Includes the same prominent decisiveness section as Text2Image
-   Enhanced critical note with comprehensive uncertainty language elimination
-   Improved clothing descriptions to be more definitive

### 4. Clothing Descriptions

**Enhanced clothing description sections for both image and video:**

-   Added "with confidence" and "definitiveness" language
-   Included instruction to "Make decisive choices when multiple interpretations are possible"
-   Emphasized choosing "one specific description and state it as fact"

## Examples of Improvements

### Before (Uncertain Language)

-   ❌ "She appears to be wearing either lace tights or leggings"
-   ❌ "holding what might be a black folder or book"
-   ❌ "seems to be wearing denim, possibly jeans"
-   ❌ "likely has curly hair texture"

### After (Decisive Language)

-   ✅ "She wears black lace tights"
-   ✅ "holding a black folder"
-   ✅ "wearing dark blue denim jeans"
-   ✅ "has curly hair texture"

## Benefits

1. **Eliminates Ambiguity**: No more "either/or" constructions
2. **Improves Prompt Quality**: More specific descriptions for better AI generation
3. **Reduces Uncertainty**: Confident descriptions lead to better results
4. **Better User Experience**: Clear, definitive outputs instead of wishy-washy descriptions

## Technical Implementation

-   Changes applied to `utils/nodes.py` in the `GeminiMediaDescribe` class
-   Affects all three processing modes: Text2Image, ImageEdit, and Video
-   Maintains backward compatibility with existing options
-   No breaking changes to API or node structure

## Validation

-   ✅ Python syntax validation passed
-   ✅ Node class mappings intact
-   ✅ All functionality preserved
-   ✅ Enhanced decisiveness implemented across all prompt types

The prompts now consistently guide Gemini to make confident, definitive choices rather than expressing uncertainty through hedging language.
