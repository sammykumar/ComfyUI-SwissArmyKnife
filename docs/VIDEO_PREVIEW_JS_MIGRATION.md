# Video Preview JavaScript Migration

**Date:** October 2, 2025  
**Status:** ✅ Complete

## What Changed

Moved the Video Preview JavaScript widget to a dedicated directory for better organization.

### Before

```
web/
├── js/
│   ├── lora_manager/
│   ├── swiss-army-knife.js
│   └── video_preview.js  ← Was here
```

### After

```
web/
├── js/
│   ├── lora_manager/
│   └── swiss-army-knife.js
└── video_preview/         ← New directory
    ├── README.md
    └── video_preview.js   ← Moved here
```

## Changes Made

### 1. Directory Structure

- Created new directory: `web/video_preview/`
- Moved file: `web/js/video_preview.js` → `web/video_preview/video_preview.js`

### 2. Import Paths Updated

Changed the import statements in `video_preview.js`:

**Before:**

```javascript
import { app } from '../../scripts/app.js';
import { api } from '../../scripts/api.js';
```

**After:**

```javascript
import { app } from '../../../scripts/app.js';
import { api } from '../../../scripts/api.js';
```

**Reason:** The file moved from 2 levels deep (`web/js/`) to still 2 levels deep but in a different path (`web/video_preview/`). However, the relative path to ComfyUI's scripts directory changed from going up 2 levels to going up 3 levels.

### 3. Documentation Updates

Updated all documentation references:

- `docs/VIDEO_PREVIEW_NODE.md`
- `docs/VIDEO_PREVIEW_IMPLEMENTATION_SUMMARY.md`

### 4. Added README

Created `web/video_preview/README.md` to document the widget directory.

## Why This Change?

1. **Better Organization**: Video preview widget has its own dedicated directory
2. **Scalability**: Easier to add related files (CSS, assets) in the future
3. **Consistency**: Follows the pattern used by `lora_manager` extension
4. **Isolation**: Clear separation from the main swiss-army-knife.js

## How ComfyUI Loads Extensions

ComfyUI automatically loads JavaScript files from the `WEB_DIRECTORY` recursively. The structure is:

```
ComfyUI/
└── custom_nodes/
    └── ComfyUI-SwissArmyKnife/
        ├── __init__.py (defines WEB_DIRECTORY = "./web")
        └── web/
            ├── js/
            │   └── *.js (loaded)
            └── video_preview/
                └── *.js (loaded)
```

**No code changes needed in `__init__.py`** - ComfyUI discovers the files automatically.

## Validation Results

All checks passed ✅:

```
✅ Directory Structure:
   - web/video_preview/
   - web/video_preview/README.md
   - web/video_preview/video_preview.js

✅ File Sizes:
   - README.md: 1.3K
   - video_preview.js: 7.1K

✅ JavaScript Syntax Check:
   ✓ Syntax valid

✅ Import Paths Verification:
   - Line 6: import { app } from "../../../scripts/app.js"
   - Line 7: import { api } from "../../../scripts/api.js"
```

## Testing

To verify the migration works:

1. **Restart ComfyUI server** (to reload Python backend)
2. **Clear browser cache** (Ctrl+Shift+R / Cmd+Shift+R)
3. **Load a workflow** with the VideoPreview node
4. **Verify** the video preview widget appears and functions correctly

## Files Modified

| File                                           | Action           | Description                              |
| ---------------------------------------------- | ---------------- | ---------------------------------------- |
| `web/video_preview/video_preview.js`           | Moved & Modified | JavaScript widget (updated import paths) |
| `web/video_preview/README.md`                  | Created          | Directory documentation                  |
| `docs/VIDEO_PREVIEW_NODE.md`                   | Modified         | Updated file paths                       |
| `docs/VIDEO_PREVIEW_IMPLEMENTATION_SUMMARY.md` | Modified         | Updated file paths                       |
| `docs/VIDEO_PREVIEW_JS_MIGRATION.md`           | Created          | This migration doc                       |

## No Changes Needed

✅ `__init__.py` - WEB_DIRECTORY already points to `./web`  
✅ `nodes/utils/video_preview.py` - Python backend unchanged  
✅ Node registration - No changes needed

## Rollback Instructions

If needed, to revert this change:

```bash
# Move file back to original location
mv web/video_preview/video_preview.js web/js/video_preview.js

# Update import paths back to:
# import { app } from "../../scripts/app.js";
# import { api } from "../../scripts/api.js";

# Remove the video_preview directory
rm -rf web/video_preview/
```

## Future Enhancements

With the dedicated directory structure, we can easily add:

- `video_preview.css` - Custom styling
- `video_preview_utils.js` - Helper functions
- `assets/` - Icons, images, or other resources
- Multiple widget files for different features

---

**Migration Complete** ✅  
The video preview widget is now properly organized in its own directory.
