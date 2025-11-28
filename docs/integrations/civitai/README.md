# CivitAI Integration Documentation

Integration with CivitAI API for model metadata, hash lookup, and automatic model information retrieval.

## 📄 Documentation Files

- **[CIVITAI_API_KEY_WIDGET.md](CIVITAI_API_KEY_WIDGET.md)** - API key configuration widget
- **[CIVITAI_SERVICE_CONSOLIDATION.md](CIVITAI_SERVICE_CONSOLIDATION.md)** - Service consolidation and optimization
- **[MULTIPLE_HASH_TYPES_CIVITAI_INTEGRATION.md](MULTIPLE_HASH_TYPES_CIVITAI_INTEGRATION.md)** - Multiple hash type support

## 🎯 Quick Reference

### API Configuration

Set CivitAI API key via:

1. **Widget**: In-node API key input
2. **Environment**: `CIVITAI_API_KEY` environment variable
3. **Config File**: ComfyUI config file

### Features

- **Metadata Lookup**: Automatic model information retrieval
- **Hash Support**: AutoV2, SHA256, CRC32, BLAKE3
- **Model Info**: Name, version, tags, descriptions
- **Image Previews**: Model preview images
- **Version Detection**: Automatic version matching

## 🔧 API Endpoints Used

- `/api/v1/model-versions/by-hash/{hash}`
- `/api/v1/models/{modelId}`
- `/api/v1/images/{imageId}`

### Hash Types

1. **AutoV2** (Recommended): Fast, collision-resistant
2. **SHA256**: Secure, slower
3. **CRC32**: Fast, less secure
4. **BLAKE3**: Fast, secure

## 🐛 Common Issues

1. **API Key Invalid**: Check key in CivitAI account settings
2. **Rate Limiting**: CivitAI has rate limits - cache results
3. **Hash Mismatch**: Try different hash types
4. **Model Not Found**: Model may not be on CivitAI

## 📚 Related Documentation


- [Caching](../../infrastructure/caching/) - For caching CivitAI responses

---

**Category**: Integration
**Status**: Stable
