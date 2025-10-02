# LoRA Loader Node Documentation

Advanced LoRA (Low-Rank Adaptation) loader with metadata integration, CivitAI support, and enhanced UI controls.

## 📄 Documentation Files

### Implementation Guides

- **[SUPERLORA_IMPLEMENTATION_GUIDE.md](SUPERLORA_IMPLEMENTATION_GUIDE.md)** - Main SuperLoRA implementation guide
- **[SUPERLORA_CLARIFICATION.md](SUPERLORA_CLARIFICATION.md)** - Architecture and design clarifications
- **[SUPER_LORA_LOADER_VARIANTS.md](SUPER_LORA_LOADER_VARIANTS.md)** - Different loader variants and configurations

### UI & Panel Implementation

- **[DUAL_LORA_PANEL_IMPLEMENTATION.md](DUAL_LORA_PANEL_IMPLEMENTATION.md)** - Dual LoRA panel for side-by-side loading
- **[SUPERLORA_SINGLE_PANEL_IMPLEMENTATION.md](SUPERLORA_SINGLE_PANEL_IMPLEMENTATION.md)** - Single panel implementation
- **[SUPERLORA_SINGLE_STREAM_IMPLEMENTATION.md](SUPERLORA_SINGLE_STREAM_IMPLEMENTATION.md)** - Single stream loading approach

### Metadata & Integration

- **[LORA_METADATA_INTEGRATION.md](LORA_METADATA_INTEGRATION.md)** - Metadata extraction and integration
- **[LORA_MANAGER_INTEGRATION.md](LORA_MANAGER_INTEGRATION.md)** - Integration with LoRA manager systems
- **[LORA_STACK_METADATA_ENHANCEMENT.md](LORA_STACK_METADATA_ENHANCEMENT.md)** - Stack metadata enhancements

### JSON & Serialization

- **[LORA_JSON_CLEANUP.md](LORA_JSON_CLEANUP.md)** - JSON handling cleanup and optimization
- **[LORA_JSON_WORKFLOW_SERIALIZATION.md](LORA_JSON_WORKFLOW_SERIALIZATION.md)** - Workflow serialization for LoRA data

### Features & Enhancements

- **[MULTIPLE_LORA_SUPPORT.md](MULTIPLE_LORA_SUPPORT.md)** - Loading multiple LoRAs simultaneously
- **[SUPERLORA_WANVIDLORA_UPDATE.md](SUPERLORA_WANVIDLORA_UPDATE.md)** - WanVidLoRA integration updates
- **[WAN_MODEL_TYPE_SELECTION.md](WAN_MODEL_TYPE_SELECTION.md)** - Model type selection for WAN models

### Bug Fixes

- **[SUPERLORA_PLUS_BUTTON_FIX.md](SUPERLORA_PLUS_BUTTON_FIX.md)** - Plus button functionality fixes

## 🎯 Quick Reference

### Node Purpose

Load and manage LoRA models with:

- CivitAI metadata integration
- Multiple LoRA support
- Hash-based model lookup
- UI panels for easy management
- Workflow serialization

### Key Features

- **Metadata Integration**: Automatic metadata from CivitAI
- **Hash Lookup**: Multiple hash type support (AutoV2, SHA256, etc.)
- **UI Panels**: Dual and single panel configurations
- **JSON Serialization**: Save/load LoRA configurations
- **Multiple LoRAs**: Load and blend multiple LoRAs
- **Model Type Selection**: Support for different model architectures

## 🔧 Technical Details

### Files

- **Python Backend**: `nodes/lora_loader.py`, `nodes/utils/lora_utils.py`
- **JavaScript UI**: `web/js/lora_widgets.js`
- **Metadata Cache**: `cache/lora_hash_cache.json`

### LoRA Configuration

```json
{
    "lora_name": "example_lora",
    "strength_model": 1.0,
    "strength_clip": 1.0,
    "civitai_metadata": {
        "model_id": 12345,
        "version_id": 67890,
        "name": "Example LoRA",
        "tags": ["style", "character"]
    }
}
```

### Hash Types Supported

- AutoV2 (default)
- SHA256
- CRC32
- BLAKE3

## 🐛 Common Issues

1. **Metadata Not Loading**: Check CivitAI API key configuration
2. **Hash Mismatch**: Ensure correct hash type is selected
3. **Multiple LoRAs**: Check strength values don't exceed limits
4. **Cache Issues**: Clear `lora_hash_cache.json` if experiencing stale data

## 📚 Related Documentation

- [CivitAI Integration](../../integrations/civitai/) - CivitAI API integration details
- [Caching](../../infrastructure/caching/) - Cache optimization and management
- [Control Panel](../../ui-widgets/) - UI panel implementation patterns

---

**Node Type**: Model Loader
**Category**: LoRA/Adapters
**Status**: Active Development
