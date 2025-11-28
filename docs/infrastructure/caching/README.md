# Caching Documentation

Documentation for caching strategies, optimization, and verification systems in ComfyUI-SwissArmyKnife.

## 📄 Documentation Files

### Core Caching

- **[CACHING.md](CACHING.md)** - Main caching architecture and strategies
- **[CACHE_OPTIMIZATION_FIX.md](CACHE_OPTIMIZATION_FIX.md)** - Cache optimization improvements

### Browser Cache Busting

- **[CACHE_BUSTING_SUMMARY.md](CACHE_BUSTING_SUMMARY.md)** - Browser cache busting implementation summary
- **[JAVASCRIPT_CACHE_BUSTING.md](../../features/JAVASCRIPT_CACHE_BUSTING.md)** - JavaScript-specific cache busting (see features/)

### Verification & Testing

- **[CACHE_VERIFICATION_OCTOBER_2025.md](CACHE_VERIFICATION_OCTOBER_2025.md)** - October 2025 cache verification tests
- **[CACHE_VERIFICATION_SUMMARY.md](CACHE_VERIFICATION_SUMMARY.md)** - Cache verification summary and results

## 🎯 Quick Reference

### Cache Types

1. **LoRA Hash Cache**: `cache/lora_hash_cache.json` - Stores LoRA model hashes
2. **Gemini Descriptions**: `cache/gemini_descriptions/` - AI-generated descriptions
3. **Browser Cache**: JavaScript/CSS file versioning

### Key Features

- **Persistent Caching**: Long-term storage of expensive computations
- **Cache Busting**: Automatic versioning for JavaScript/CSS updates
- **Verification**: Automated cache integrity checks
- **Optimization**: Performance improvements through smart caching

## 🔧 Cache Management

### Clear Cache

```bash
# Clear LoRA hash cache
rm cache/lora_hash_cache.json

# Clear Gemini description cache
rm -rf cache/gemini_descriptions/*

# Clear browser cache (user action)
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

### Verify Cache

```python
# Run cache verification tests
python test_cache_verification.py
```

## 📚 Related Documentation

- [Debug System](../debug/) - For cache debugging

- [Media Describe](../../nodes/media-describe/) - For description caching

---

**Category**: Infrastructure
**Status**: Stable
