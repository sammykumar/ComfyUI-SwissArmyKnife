# Debug System Documentation

Unified debug and logging system for ComfyUI-SwissArmyKnife.

## 📄 Documentation Files

- **[DEBUG_MODE_IMPLEMENTATION.md](DEBUG_MODE_IMPLEMENTATION.md)** - Debug mode implementation and usage
- **[UNIFIED_DEBUG_SYSTEM.md](UNIFIED_DEBUG_SYSTEM.md)** - Unified debug system architecture
- **[LM_STUDIO_PROMPT_LOGGING.md](LM_STUDIO_PROMPT_LOGGING.md)** - LM Studio prompt debugging

## 🎯 Quick Reference

### Debug Configuration

Debug mode can be enabled/disabled via:

1. **Server Config**: `/swissarmyknife/config` endpoint
2. **Environment Variable**: `DEBUG_ENABLED=true`
3. **Runtime**: Toggle via API
4. **LM Studio**: `verbose` option in LM Studio - Options node

### Debug Output

When enabled, debug output appears in:

- Browser console (JavaScript widgets)
- Server logs (Python nodes)
- Network tab (API calls)
- LM Studio prompts (when verbose=True)

### Usage

```python
# Python - use debug logging
from utils.debug import debug_log
debug_log("My debug message", variable_name)
```

```javascript
// JavaScript - conditional logging
const debugLog = (...args) => {
    if (DEBUG_ENABLED) {
        console.log('[ComponentName]', ...args);
    }
};
```

## 🔧 Features

### Unified System

- **Consistent Format**: `[ComponentName] Message: data`
- **Conditional Output**: Only logs when debug mode is enabled
- **Performance**: Zero overhead when disabled
- **Granular Control**: Per-component debug levels

### Component Tags

- `[VideoPreview]` - Video preview widget debug

- `[MediaDescribe]` - Gemini API debug
- `[CivitAI]` - CivitAI integration debug
- `[Cache]` - Caching system debug

## 🐛 Debugging Workflow

1. **Enable Debug Mode**: Set `DEBUG_ENABLED=true` in config
2. **Reproduce Issue**: Run the workflow that causes the problem
3. **Check Logs**: Review browser console and server logs
4. **Identify Component**: Look for component tags in logs
5. **Analyze Data**: Examine logged variables and state
6. **Fix and Test**: Make changes and verify with debug logs
7. **Disable Debug**: Turn off debug mode for production

## 📚 Related Documentation

- [Caching](../caching/) - For cache-related debugging
- [All Nodes](../../nodes/) - For node-specific debugging
- [Features](../../features/) - For feature debugging

---

**Category**: Infrastructure
**Status**: Stable
