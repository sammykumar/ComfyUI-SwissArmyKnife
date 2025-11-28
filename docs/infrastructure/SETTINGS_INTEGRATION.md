# ComfyUI Settings Integration

## Overview

As of version 2.8.11+, ComfyUI-SwissArmyKnife integrates with ComfyUI's native settings system to manage API keys securely. This replaces the previous approach of using text input widgets for API keys.

## Settings Configuration

### Gemini API Key

- **Setting ID**: `swiss_army_knife.gemini.api_key`
- **Location**: ComfyUI Settings → Swiss Army Knife → Gemini API Key
- **Purpose**: Used by MediaDescribe and LM Studio nodes for Gemini calls

### CivitAI API Key

- **Setting ID**: `swiss_army_knife.civitai.api_key`
- **Location**: ComfyUI Settings → Swiss Army Knife → Civitai API Key
- **Purpose**: Used by LoRAInfoExtractor for metadata lookup

## Benefits of Settings Integration

### Security

- API keys are stored securely in ComfyUI's settings system
- Keys are never saved in workflow JSON files
- Settings are stored separately from shareable workflows

### User Experience

- Configure once, use everywhere
- No need to enter API keys in individual nodes
- Settings persist across ComfyUI sessions

### Workflow Sharing

- Workflows can be shared without exposing API keys
- Recipients can use their own API keys from settings
- No risk of accidentally sharing sensitive information

## Node Changes

### MediaDescribe Node

**Before**: Required a separate GeminiUtilOptions node with an API key widget  
**After**: Reads the Gemini key directly from settings (no extra node required)

### LoRAInfoExtractor Node

**Before**: Had a `civitai_api_key` text input widget
**After**: Automatically retrieves API key from ComfyUI settings

## Technical Implementation

### Frontend (JavaScript)

- Settings are registered using ComfyUI's settings API
- `onChange` handlers automatically sync settings to backend
- Helper functions provide easy access to settings values

### Backend (Python)

- Settings are cached from frontend via API endpoint
- Fallback to environment variables if settings unavailable
- Nodes access API keys via centralized function

### API Endpoints

- `GET /swissarmyknife/config` - Retrieve current configuration
- `POST /swissarmyknife/set_api_keys` - Update cached API keys

## Migration Guide

### For Users

1. Open ComfyUI Settings (gear icon)
2. Navigate to "Swiss Army Knife" section
3. Enter your API keys:
    - Gemini API Key: Your Google AI Studio API key
    - CivitAI API Key: Your CivitAI API key
4. Existing workflows will automatically use the new settings

### For Developers

- Nodes should use `get_setting_value()` function instead of input parameters
- JavaScript widgets can access settings via `app.extensionManager.setting.get()`
- Settings changes are automatically synced between frontend and backend

## Fallback Behavior

If ComfyUI settings are not available, the system falls back to:

1. Environment variables (`GEMINI_API_KEY`, `CIVITAI_API_KEY`)
2. Empty string (will cause API operations to fail gracefully)

This ensures backward compatibility and graceful degradation.

## Files Modified

### JavaScript

- `web/js/swiss-army-knife.js` - Settings registration and sync

### Python

- `nodes/config_api.py` - Settings caching and API endpoints
- `nodes/utils/lora_info_extractor.py` - Removed CivitAI API key widget from LoRAInfoExtractor

## Troubleshooting

### Settings Not Working

1. Check ComfyUI version supports settings API
2. Verify settings are entered correctly (no extra spaces)
3. Check browser console for JavaScript errors
4. Restart ComfyUI if settings seem stuck

### API Keys Not Being Used

1. Verify settings are entered in ComfyUI Settings panel
2. Check server logs for caching messages
3. Ensure fallback environment variables are not interfering
4. Try refreshing the page to force settings sync

### Workflow Compatibility

- Existing workflows will work automatically
- Shared workflows will use recipient's API keys from settings
- No migration of existing workflow files needed
