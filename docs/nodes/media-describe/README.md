# Media Describe Node Documentation

AI-powered media description using Google's Gemini API for analyzing images and videos.

## 📄 Documentation Files

### Core Implementation

- **[gemini-prompts.md](gemini-prompts.md)** - Gemini API prompts and prompt engineering
- **[GEMINI_UTILS_REFACTORING_PLAN.md](GEMINI_UTILS_REFACTORING_PLAN.md)** - Refactoring plan for Gemini utilities

### Features & Data Output

- **[ALL_MEDIA_DESCRIBE_DATA_OUTPUT.md](ALL_MEDIA_DESCRIBE_DATA_OUTPUT.md)** - Complete data output format and structure
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
- **Retry Logic**: Automatic retry on API failures
- **Error Handling**: Robust error handling for API issues
- **Structured Output**: JSON-formatted results

## 🔧 Technical Details

### Files

- **Python Backend**: `nodes/utils/gemini_utils.py`, `nodes/media_describe.py`
- **API Integration**: Google Generative AI SDK

### API Configuration

- Requires Gemini API key
- Configurable retry attempts
- Rate limiting support
- Error logging and debugging

### Output Format

Structured JSON output with:

- Description text
- Confidence scores
- Detected objects
- Scene analysis
- Custom fields based on prompt

## 🐛 Common Issues

1. **API 500 Errors**: Automatic retry logic handles transient failures
2. **Rate Limiting**: Built-in retry with exponential backoff
3. **API Key**: Ensure valid Gemini API key is configured
4. **Large Media**: Processing time varies with media size

## 📚 Related Documentation

- [Gemini Prompts](gemini-prompts.md) - Detailed prompt engineering guide
- [Debug System](../../infrastructure/debug/) - For API debugging
- [Features](../../features/) - For prompt improvements and decisiveness

---

**Node Type**: AI/Analysis
**Category**: Media Processing
**Status**: Active Development
