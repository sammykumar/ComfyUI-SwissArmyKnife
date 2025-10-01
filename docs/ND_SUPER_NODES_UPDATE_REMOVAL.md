# ND Super Nodes Update Checking Removal

## Overview

This document describes the removal of update checking functionality from the ComfyUI-SwissArmyKnife project, which is a fork of nd-super-nodes.

## Why Remove Update Checking?

ComfyUI-SwissArmyKnife forked the nd-super-nodes project and has diverged from the original. Checking for updates against the original nd-super-nodes repository:

- Is no longer relevant since this is a separate fork
- Could confuse users with update notifications for the wrong repository
- Makes unnecessary API calls to GitHub
- Shows incorrect version information

## Changes Made

### Frontend Changes (JavaScript)

**File**: `web/js/lora_manager/extension.js`

Removed the following components:

- **UpdateService class** (~104 lines, lines 1896-2000): Entire service that checked GitHub for nd-super-nodes updates
- **UpdateService initialization** (line 3730): Removed `this.updateService = UpdateService.getInstance()` from SuperLoraNode
- **Update checking in initialization** (lines 3751-3757): Removed `this.updateService.initialize()` from Promise.all
- **Global status variable** (line 3773): Removed `window.NDSuperNodesUpdateStatus` assignment
- **Update checking command** (lines 6933-6940): Removed "Check ND Super Nodes Updates" from extension commands

Added explanatory comment at line 1896:

```javascript
// UpdateService removed - this is a forked version and does not check for nd-super-nodes updates
```

### Backend Changes (Python)

**File**: `utils/lora_manager/web_api.py`

- Changed import from `get_update_status` to `get_local_version`
- Modified `get_version_info()` function to return only local version information
- Disabled GitHub release checking functionality
- Returns simple response: `{ "localVersion": {...}, "hasUpdate": false, "message": "This is a forked version. Update checking disabled." }`

**File**: `utils/lora_manager/version_utils.py`

- No changes made to this file
- Functions like `get_update_status()` and `_fetch_latest_release()` remain in code but are no longer called
- Consider removing this file in the future if not needed

### Documentation Changes

Updated the following documentation files to remove UpdateService references:

- `docs/SUPERLORA_IMPLEMENTATION_GUIDE.md`: Removed UpdateService from services list
- `docs/SUPERLORA_CLARIFICATION.md`: Removed UpdateService from services list

## Version Endpoint Behavior

The `/super_lora/version` and `/superlora/version` endpoints remain active but now return:

```json
{
    "localVersion": {
        "version": "x.x.x",
        "builtAt": "ISO-8601-timestamp"
    },
    "hasUpdate": false,
    "message": "This is a forked version. Update checking disabled."
}
```

Previous behavior (now disabled):

- Fetched latest release from `https://api.github.com/repos/HenkDz/nd-super-nodes/releases/latest`
- Compared versions and returned update availability
- Cached results for 24 hours
- Displayed update notifications in ComfyUI UI

## UI Changes

Users will no longer see:

- Update notification overlay: "ND Super Nodes v1.7.2 available. Run update.ps1 / update.sh in your node folder to upgrade"
- "Check ND Super Nodes Updates" command in ComfyUI command palette
- Automatic update checking on node initialization

## Files That Can Be Removed (Optional)

The following files are no longer used and can be removed in the future:

- `utils/lora_manager/version_utils.py`: Contains GitHub release checking logic
- Any cached update files in `<ComfyUI user dir>/nd_super_nodes/nd_super_nodes_update_cache.json`

## Future Considerations

If you want to implement update checking for ComfyUI-SwissArmyKnife:

1. Create a new GitHub releases system for this repository
2. Update `GITHUB_RELEASE_URL` in version_utils.py to point to your fork
3. Re-enable UpdateService in extension.js
4. Update version checking messages to reference ComfyUI-SwissArmyKnife

## Testing

After these changes:

1. ✅ No update notifications appear in ComfyUI UI
2. ✅ Version endpoint returns local version only
3. ✅ No GitHub API calls to nd-super-nodes repository
4. ✅ SuperLoraLoader and SuperDualLoraLoader nodes function normally

## Related Documentation

- `docs/SUPERLORA_IMPLEMENTATION_GUIDE.md`: Technical guide for SuperLoraLoader
- `docs/SUPERLORA_CLARIFICATION.md`: File structure clarification
- `docs/ND_SUPER_NODES_FORK_SUMMARY.md`: Overview of nd-super-nodes fork
