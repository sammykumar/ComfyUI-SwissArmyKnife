# Media Describe Node Documentation

AI-powered media description using Google's Gemini API for analyzing images and videos.

## 📄 Documentation Files

### Core Nodes

- **MediaDescribe** - Main node for analyzing media with Gemini AI
- **[Media Describe - Overrides](MEDIA_DESCRIBE_OVERRIDES_NODE.md)** - Paragraph override configuration node
- **[Media Describe - Prompt Breakdown](PROMPT_BREAKDOWN_NODE.md)** - Display node for formatted paragraph breakdown
- **Gemini Util - Options** - Gemini API configuration node

### Core Implementation

- **[gemini-prompts.md](gemini-prompts.md)** - Gemini API prompts and prompt engineering
- **[GEMINI_UTILS_REFACTORING_PLAN.md](GEMINI_UTILS_REFACTORING_PLAN.md)** - Refactoring plan for Gemini utilities

### Features & Data Output

- **[ALL_MEDIA_DESCRIBE_DATA_OUTPUT.md](ALL_MEDIA_DESCRIBE_DATA_OUTPUT.md)** - Complete data output format and structure
- **[PARAGRAPH_OVERRIDE_FEATURE.md](PARAGRAPH_OVERRIDE_FEATURE.md)** - Paragraph override and individual output features
- **[MEDIA_DESCRIBE_OVERRIDES_NODE.md](MEDIA_DESCRIBE_OVERRIDES_NODE.md)** - Media Describe - Overrides node documentation
- **[CLASS_RENAME_MEDIADESCRIBE.md](CLASS_RENAME_MEDIADESCRIBE.md)** - Class naming and refactoring

### API Integration & Reliability

- **[GEMINI_API_500_ERROR_FIX.md](GEMINI_API_500_ERROR_FIX.md)** - Handling Gemini API 500 errors
- **[GEMINI_API_RETRY_LOGIC.md](GEMINI_API_RETRY_LOGIC.md)** - Retry logic and error recovery

## 🎯 Quick Reference

### Node Purpose

Generate AI-powered descriptions for:

- Images (detailed analysis)
- Videos (frame-by-frame or summary)
- Media characteristics and content
- Object detection and scene understanding

### Key Features

- **Gemini Integration**: Uses Google Gemini AI for analysis
- **Custom Prompts**: Configurable prompts for different use cases
- **Paragraph Override**: Separate node for overriding individual paragraphs with custom text
- **Individual Outputs**: Access each paragraph separately
- **Retry Logic**: Automatic retry on API failures
- **Error Handling**: Robust error handling for API issues
- **Structured Output**: JSON-formatted results

## 🔧 Technical Details

### Nodes Overview

#### MediaDescribe

Main analysis node that processes images/videos with Gemini AI.

**Inputs:**

- Media source configuration (upload, random, reddit)
- Media type (image/video)
- Gemini options (from Gemini Util - Options node)
- **Overrides** (optional, from Media Describe - Overrides node)

**Outputs (8 total):**

1. description - Full combined description
2. media_info - Media information
3. gemini_status - API status
4. processed_media_path - File path
5. final_string - Description with prefix
6. height - Media height
7. width - Media width
8. all_media_describe_data - Aggregated JSON with paragraph data

**Control Panel Widget:**

- **📋 Overview** - Displays a compact summary of individual paragraph outputs:
    - 🎯 Subject
    - 🎬 Cinematic Aesthetic
    - 🎨 Style/Tone
    - 👔 Clothing
    - 🏞️ Scene (video only)
    - 🎭 Movement (video only)

> **Note**: Individual paragraph outputs are displayed in the Overview widget instead of separate output sockets. For a **detailed formatted breakdown**, use the **[Media Describe - Prompt Breakdown](PROMPT_BREAKDOWN_NODE.md)** node.

#### Media Describe - Prompt Breakdown

Display node for formatted paragraph breakdown. **[See full documentation →](PROMPT_BREAKDOWN_NODE.md)**

**Input:**

- `all_media_describe_data` - Connect from MediaDescribe output (socket 8)

**Output:**

- None (display-only node)

**Display Widget:**

- **📋 Prompt Breakdown** - Shows beautifully formatted breakdown with section headers, dividers, and proper spacing

**Best For:**

- Detailed review of AI-generated descriptions
- Copying specific paragraphs
- Quality checking before use
- Comparing multiple outputs

#### Media Describe - Overrides

Configuration node for paragraph-level customization.

**Inputs (all optional):**

- override_subject
- override_cinematic_aesthetic
- override_stylization_tone
- override_clothing
- override_scene (video only)
- override_movement (video only)

**Output:**

- overrides - OVERRIDES dictionary to connect to MediaDescribe

### Basic Workflow

```
┌─────────────────────────┐
│ Gemini Util - Options   │
└─────────────────────────┘
            │ (gemini_options)
            ▼
┌─────────────────────────┐
│ MediaDescribe           │ ──→ Outputs
└─────────────────────────┘
```

### Workflow with Overrides

```
┌──────────────────────────┐
│ Media Describe -         │
│ Overrides                │
└──────────────────────────┘
            │ (overrides)
            ├──────────────────┐
            ▼                  │
┌─────────────────────────┐   │
│ Gemini Util - Options   │   │
└─────────────────────────┘   │
            │ (gemini_options) │
            ▼                  │
┌─────────────────────────┐   │
│ MediaDescribe           │◄──┘
└─────────────────────────┘
            │
            ▼
     [14 Outputs]
```

### Files

- **Python Backend**:
    - `nodes/media_describe/mediia_describe.py` - Main MediaDescribe node
    - `nodes/media_describe/media_describe_overrides.py` - Overrides node
    - `nodes/media_describe/gemini_util_options.py` - Options node
- **API Integration**: Google Generative AI SDK

### API Configuration

- Requires Gemini API key
- Configurable retry attempts
- Rate limiting support
- Error logging and debugging

## 🐛 Common Issues

1. **API 500 Errors**: Automatic retry logic handles transient failures
2. **Rate Limiting**: Built-in retry with exponential backoff
3. **API Key**: Ensure valid Gemini API key is configured
4. **Large Media**: Processing time varies with media size

## 📚 Related Documentation

- [Gemini Prompts](gemini-prompts.md) - Detailed prompt engineering guide
- [Media Describe - Overrides Node](MEDIA_DESCRIBE_OVERRIDES_NODE.md) - Override node documentation
- [Paragraph Override Feature](PARAGRAPH_OVERRIDE_FEATURE.md) - Override feature details
- [All Media Describe Data Output](ALL_MEDIA_DESCRIBE_DATA_OUTPUT.md) - Aggregated output format
- [Debug System](../../infrastructure/debug/) - For API debugging
- [Features](../../features/) - For prompt improvements and decisiveness

---

**Node Type**: AI/Analysis  
**Category**: Swiss Army Knife 🔪  
**Status**: Active Development
