# Media Describe - Prompt Breakdown Node

**Node Name**: Media Describe - Prompt Breakdown  
**Category**: Swiss Army Knife 🔪  
**Type**: Display/Output Node  
**Date Created**: October 7, 2025

## Overview

The **Media Describe - Prompt Breakdown** node is a dedicated display node that shows a beautifully formatted breakdown of all paragraph outputs from the MediaDescribe node. It presents each paragraph category with proper headings, dividers, and emoji labels for easy reading.

## Purpose

This node provides a **clean, organized view** of the AI-generated description paragraphs without cluttering the MediaDescribe node with multiple output sockets. It's perfect for:

- **Reviewing** the detailed breakdown of generated descriptions
- **Copying** specific paragraphs for use elsewhere
- **Understanding** what the AI generated for each category
- **Quality checking** before using descriptions in your workflow

## Node Inputs

| Input Name                | Type   | Required | Description                                      |
| ------------------------- | ------ | -------- | ------------------------------------------------ |
| `all_media_describe_data` | STRING | Yes      | JSON output from MediaDescribe (output socket 8) |

## Node Outputs

**None** - This is a display-only node with no outputs.

## Display Format

The node displays paragraphs with:

### For Images & Videos:

```
==================================================
🎯 SUBJECT
==================================================
[Subject paragraph content here]

==================================================
🎬 CINEMATIC AESTHETIC
==================================================
[Cinematic aesthetic paragraph content here]

==================================================
🎨 STYLIZATION & TONE
==================================================
[Stylization & tone paragraph content here]

==================================================
👔 CLOTHING
==================================================
[Clothing paragraph content here]
```

### For Videos (additional sections):

```
==================================================
🏞️ SCENE
==================================================
[Scene description paragraph content here]

==================================================
🎭 MOVEMENT
==================================================
[Movement/action paragraph content here]
```

## Usage Example

### Basic Workflow

```
[MediaDescribe]
  → all_media_describe_data → [Media Describe - Prompt Breakdown]
                                (displays formatted breakdown)
```

### Complete Workflow with Overrides

```
[Media Describe - Overrides] ──┐
                                ├→ [MediaDescribe]
[Gemini Util - Options] ────────┘       ↓
                                 all_media_describe_data
                                         ↓
                          [Media Describe - Prompt Breakdown]
                          (shows final breakdown with overrides)
```

## Features

### ✅ Formatted Display

- Professional divider lines between sections
- Emoji labels for visual identification
- Monospace font for clean reading
- Dark theme styling

### ✅ Smart Filtering

- Only shows paragraphs that have content
- Skips empty/missing sections
- Handles both image and video data gracefully

### ✅ Read-Only

- Content is read-only (cannot be edited)
- Prevents accidental modifications
- Safe for reviewing generated content

### ✅ Copy-Friendly

- Easy to select and copy individual paragraphs
- Formatted for readability
- Line spacing optimized for clarity

## Widget Details

**Widget Name**: 📋 Prompt Breakdown  
**Type**: Multiline text (read-only)  
**Font**: Monospace  
**Size**: 13px  
**Theme**: Dark (#1e1e1e background, #d4d4d4 text)  
**Line Height**: 1.5 (improved readability)

## Technical Details

### Python Implementation

**File**: `nodes/media_describe/prompt_breakdown.py`

```python
class MediaDescribePromptBreakdown:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "all_media_describe_data": ("STRING", {
                    "forceInput": True
                })
            }
        }

    RETURN_TYPES = ()
    OUTPUT_NODE = True
    FUNCTION = "display_breakdown"
```

### JavaScript Widget

**File**: `web/js/swiss-army-knife.js`

- Parses `all_media_describe_data` JSON
- Formats each paragraph with section headers
- Updates display on node execution
- Handles errors gracefully

## Comparison: Overview vs Prompt Breakdown

| Feature               | 📋 Overview (on MediaDescribe) | 📋 Prompt Breakdown (separate node) |
| --------------------- | ------------------------------ | ----------------------------------- |
| **Location**          | Built into MediaDescribe node  | Separate dedicated node             |
| **Display Style**     | Compact list with emoji        | Full formatted breakdown            |
| **Section Dividers**  | None                           | Visual dividers between sections    |
| **Line Spacing**      | Standard                       | Enhanced (1.5 line height)          |
| **Font Size**         | 12px                           | 13px (larger)                       |
| **Best For**          | Quick reference while working  | Detailed review and copying         |
| **Updates When**      | Automatically after execution  | When connected to MediaDescribe     |
| **Can be Duplicated** | No (one per MediaDescribe)     | Yes (multiple breakdown nodes)      |

## Use Cases

### 1. Quality Review

Connect to MediaDescribe to review the AI-generated description in detail before using it in your workflow.

### 2. Paragraph Extraction

Use the formatted display to easily copy specific paragraphs for manual editing or use in other tools.

### 3. Comparison

Create multiple breakdown nodes connected to different MediaDescribe nodes to compare outputs.

### 4. Documentation

Use the formatted output to document what the AI generated for a particular media file.

### 5. Training Reference

Review breakdowns to understand how the AI structures descriptions for different types of media.

## Tips

1. **Multiple Nodes**: You can use multiple Prompt Breakdown nodes to compare different MediaDescribe outputs
2. **Copy Content**: The read-only display makes it easy to select and copy specific paragraphs
3. **Override Preview**: Connect after Media Describe - Overrides to see the final merged result
4. **Empty Sections**: The node automatically hides empty paragraph sections for cleaner display

## Troubleshooting

### Issue: "Waiting for data..." displayed

**Solution**: Make sure the node is connected to a MediaDescribe node's `all_media_describe_data` output (socket 8)

### Issue: "Error: Invalid JSON data"

**Solution**: The connected data is not valid JSON. Verify the MediaDescribe node executed successfully

### Issue: No content showing

**Solution**: The MediaDescribe node may not have generated any paragraphs. Check if it executed successfully

### Issue: Widget not updating

**Solution**: Ensure the workflow has been executed (queue prompt). The widget updates after execution.

## Related Nodes

- **[MediaDescribe](README.md)** - Main analysis node
- **[Media Describe - Overrides](MEDIA_DESCRIBE_OVERRIDES_NODE.md)** - Override paragraphs
- **[Gemini Util - Options](gemini-prompts.md)** - Configure Gemini API

---

**Created**: October 7, 2025  
**Status**: Production Ready ✅  
**Type**: Display Node
