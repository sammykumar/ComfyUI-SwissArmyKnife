# Documentation Consolidation Guide

**Date:** October 13, 2025  
**Status:** Phase 1 Complete

## Overview

This guide documents the documentation consolidation process for ComfyUI-SwissArmyKnife. The goal is to have **one comprehensive markdown file per node** instead of multiple scattered files.

## Consolidation Status

### ✅ Completed / Retired Nodes

1. **video-metadata** – Node retired (November 30, 2025). Documentation set removed because the FFmpeg metadata helper is no longer shipped.

> **Note:** The legacy `video-preview` node has been retired, so its documentation set was removed rather than consolidated.

### 📋 Pending Consolidation (4/6)

1. **control-panel** - 3 files remaining
2. **reddit-media** - 6 files remaining
3. **media-selection** - 8 files remaining
4. **lora-loader** - 15 files remaining

**Total:** 32 files to consolidate (media-describe documentation was retired alongside the node)

## Consolidation Template

Use this structure when consolidating node documentation:

```markdown
# [Node Name]

**Last Updated:** [Date]  
**Node Type:** [Type]  
**Category:** [Category]  
**Status:** Active Development

## Overview

[Brief description of what the node does]

## Table of Contents

- [Features](#features)
- [Node Configuration](#node-configuration)
- [Usage](#usage)
- [Implementation Details](#implementation-details)
- [Bug Fixes & Troubleshooting](#bug-fixes--troubleshooting)
- [Testing](#testing)
- [Related Documentation](#related-documentation)

## Features

[Key features and capabilities]

## Node Configuration

### Location
- **Python Backend**: `path/to/file.py`
- **JavaScript Widget**: `path/to/widget.js`
- **Category**: [Category]
- **Display Name**: [Name]

### Input Parameters

[Input configuration]

### Output

[Output configuration]

## Usage

[Usage examples and workflows]

## Implementation Details

[Technical implementation details]

### Helper Methods

[Key helper methods and functions]

### Key Design Decisions

[Important design decisions]

## Bug Fixes & Troubleshooting

### [Issue Name]

**Issue:** [Description]

**Root Cause:** [Explanation]

**Fix:** [Solution]

### Common Issues

1. **Issue 1**: Solution
2. **Issue 2**: Solution

## Testing

[Testing procedures]

## Future Enhancements

[Planned features and improvements]

## Related Documentation

- [Related Node 1](../node1/NODE1.md)
- [Related Node 2](../node2/NODE2.md)

---

**Node Type**: [Type]  
**Category**: [Category]  
**Status**: [Status]
```

## Consolidation Steps

1. **Read all files** in the node directory (except README.md)
2. **Identify sections**:
   - Core implementation
   - Features
   - Bug fixes
   - Usage examples
   - Technical details
3. **Merge content** following the template structure
4. **Remove duplicates** and consolidate related information
5. **Create comprehensive file** with all information
6. **Update README.md** to point to the single consolidated file
7. **Remove old files** after verification
8. **Test links** to ensure all cross-references work

## File Naming Convention

- **Consolidated file**: `[NODE_NAME].md` (all caps with underscores)
- **Examples**: 
  - `VIDEO_METADATA.md`
  - `MEDIA_DESCRIBE.md`
  - `LORA_LOADER.md`

## README.md Pattern

Each node directory should have a README.md with this structure:

```markdown
# [Node Name] Documentation

[Brief description]

## 📄 Documentation

- **[[NODE_NAME].md]([NODE_NAME].md)** - Complete documentation including [key topics]

## 🎯 Quick Reference

[Quick reference information]

## 🔧 Technical Details

[Brief technical details]

## 📚 Related Documentation

[Links to related docs]

---

**Node Type**: [Type]  
**Category**: [Category]  
**Status**: [Status]
```

## Cross-Reference Updates

When consolidating, ensure these are updated:

1. **Internal links** within the consolidated file
2. **Links from other nodes** pointing to the old files
3. **Links in infrastructure docs** referencing the node
4. **Links in main docs/README.md**
5. **Links in AGENTS.md** (if applicable)

## Quality Checklist

Before considering a node "consolidated":

- [ ] All original content is preserved
- [ ] No duplicate information
- [ ] Table of contents is complete
- [ ] All sections are properly formatted
- [ ] Code examples are included
- [ ] Troubleshooting section is comprehensive
- [ ] Related documentation links work
- [ ] README.md is updated
- [ ] Old files are removed
- [ ] Cross-references are updated

## Benefits of Consolidation

1. **Easier to navigate** - One file to search instead of many
2. **Reduced redundancy** - No duplicate information across files
3. **Better maintenance** - Update one file instead of tracking multiple
4. **Clearer organization** - Logical flow from overview to details
5. **Faster onboarding** - New developers can understand a node from one comprehensive document

## Next Steps

To complete the consolidation:

1. Start with **control-panel** (3 files, smallest remaining)
2. Then **reddit-media** (6 files)
3. Then **media-selection** (8 files)
4. Then **lora-loader** (15 files)

Each consolidated file should follow the pattern established by VIDEO_METADATA.md and the structured describe implementation docs.

---

**Guide Version**: 1.0  
**Last Updated**: October 13, 2025
