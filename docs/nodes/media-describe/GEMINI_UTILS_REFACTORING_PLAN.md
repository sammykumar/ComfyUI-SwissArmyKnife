# Gemini Utils Extension Refactoring Plan

## Date: October 1, 2025

## Overview

Refactor `web/js/swiss-army-knife.js` (1160+ lines) into a modular structure similar to the `lora_manager` folder for better organization, maintainability, and developer experience.

## Current State

**File: `web/js/swiss-army-knife.js`** (1160+ lines)

- Single monolithic file handling 3 different node types
- `GeminiUtilOptions` node (~10 lines)
- `FilenameGenerator` node (~180 lines)
- `GeminiUtilMediaDescribe` node (~1000+ lines)
- Complex state management, upload handling, serialization

## Proposed Structure

```
web/js/
├── lora_manager/
│   ├── extension.js           # LoRA management (existing)
│   └── README.md
├── gemini_utils/              # NEW FOLDER
│   ├── extension.js           # Main registration (~50 lines)
│   ├── media_describe.js      # GeminiUtilMediaDescribe (~1000+ lines)
│   ├── filename_generator.js  # FilenameGenerator (~180 lines)
│   ├── options.js             # GeminiUtilOptions (~10 lines)
│   ├── shared_utils.js        # Common utilities (if needed)
│   └── README.md              # Documentation
└── swiss-army-knife.js        # DEPRECATED (keep temporarily for compatibility)
```

## Refactoring Steps

### Phase 1: Create New Structure

1. **Create folder**

    ```bash
    mkdir -p web/js/gemini_utils
    ```

2. **Create extension.js (main entry point)**
    - Import handlers from separate files
    - Register all three node types
    - Delegate to specific handlers

3. **Extract media_describe.js**
    - Move `GeminiUtilMediaDescribe` logic
    - Export `registerMediaDescribeNode()` function
    - Export helper functions (upload handlers, state management)

4. **Extract filename_generator.js**
    - Move `FilenameGenerator` logic
    - Export `registerFilenameGeneratorNode()` function
    - Include filename generation logic

5. **Extract options.js**
    - Move `GeminiUtilOptions` logic
    - Export `registerOptionsNode()` function

6. **Create shared_utils.js (if needed)**
    - Common utilities used across multiple files
    - File upload helpers
    - Widget management utilities

### Phase 2: Implementation Details

#### File: `gemini_utils/extension.js`

```javascript
console.log('Loading Gemini Utils extension');

import {
    registerMediaDescribeNode,
    handleMediaDescribeLoaded,
} from './media_describe.js';
import { registerFilenameGeneratorNode } from './filename_generator.js';
import { registerOptionsNode } from './options.js';

app.registerExtension({
    name: 'comfyui_swissarmyknife.gemini_utils',

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === 'GeminiUtilMediaDescribe') {
            console.log('Registering GeminiUtilMediaDescribe node');
            registerMediaDescribeNode(nodeType, nodeData, app);
        } else if (nodeData.name === 'FilenameGenerator') {
            console.log('Registering FilenameGenerator node');
            registerFilenameGeneratorNode(nodeType, nodeData, app);
        } else if (nodeData.name === 'GeminiUtilOptions') {
            console.log('Registering GeminiUtilOptions node');
            registerOptionsNode(nodeType, nodeData, app);
        }
    },

    loadedGraphNode(node, app) {
        if (node.comfyClass === 'GeminiUtilMediaDescribe') {
            handleMediaDescribeLoaded(node, app);
        }
    },
});
```

#### File: `gemini_utils/media_describe.js`

```javascript
/**
 * GeminiUtilMediaDescribe Node Handler
 * Handles media upload, state persistence, and Reddit integration
 */

export function registerMediaDescribeNode(nodeType, nodeData, app) {
    // All the current GeminiUtilMediaDescribe logic
    const onNodeCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
        // ... existing implementation ...
    };

    // Add serialization
    const onSerialize = nodeType.prototype.onSerialize;
    nodeType.prototype.onSerialize = function (o) {
        // ... existing implementation ...
    };

    // Add configuration
    const onConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function (o) {
        // ... existing implementation ...
    };
}

export function handleMediaDescribeLoaded(node, app) {
    // loadedGraphNode logic for GeminiUtilMediaDescribe
    console.log('[LOADED] loadedGraphNode called for GeminiUtilMediaDescribe');
    // ... existing implementation ...
}

// Helper functions
export function clearAllMediaState() {
    /* ... */
}
export function updateMediaWidgets() {
    /* ... */
}
// ... other helpers ...
```

#### File: `gemini_utils/filename_generator.js`

```javascript
/**
 * FilenameGenerator Node Handler
 * Generates dynamic filenames based on workflow parameters
 */

export function registerFilenameGeneratorNode(nodeType, nodeData, app) {
    console.log('Registering FilenameGenerator node');

    const onNodeCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
        const result = onNodeCreated?.apply(this, arguments);

        // Add preview widget
        this.addWidget(/* ... */);

        // Update filename preview function
        this.updateFilenamePreview = function () {
            // ... existing implementation ...
        };

        // Set up listeners
        // ... existing implementation ...

        return result;
    };
}
```

#### File: `gemini_utils/options.js`

```javascript
/**
 * GeminiUtilOptions Node Handler
 * Configuration options for Gemini API
 */

export function registerOptionsNode(nodeType, nodeData, app) {
    console.log('Registering GeminiUtilOptions node');

    // This node doesn't need special widgets
    // The existing ComfyUI widgets are sufficient
}
```

### Phase 3: Testing & Migration

1. **Update Python to load new extension**

    ```python
    # In __init__.py or nodes.py
    WEB_DIRECTORY = "./web/js"

    # Ensure both extensions are loaded:
    # - lora_manager/extension.js
    # - gemini_utils/extension.js
    ```

2. **Test each node type**
    - [ ] GeminiUtilMediaDescribe upload functionality
    - [ ] GeminiUtilMediaDescribe state persistence
    - [ ] GeminiUtilMediaDescribe Reddit integration
    - [ ] FilenameGenerator preview updates
    - [ ] GeminiUtilOptions configuration

3. **Deprecate old file**
    - Keep `swiss-army-knife.js` temporarily with deprecation notice
    - Add console warning directing to new location
    - Remove after confirming no issues

### Phase 4: Documentation

Create comprehensive documentation:

#### File: `gemini_utils/README.md`

```markdown
# Gemini Utils Extension

JavaScript widgets for Gemini AI integration in ComfyUI Swiss Army Knife.

## Files

- **extension.js**: Main entry point, registers all node types
- **media_describe.js**: Media upload and description generation (1000+ lines)
- **filename_generator.js**: Dynamic filename generation widget (180 lines)
- **options.js**: Configuration options widget (10 lines)

## Node Types

### GeminiUtilMediaDescribe

Upload and describe images/videos using Gemini AI.

**Features:**

- Media upload (image/video)
- Reddit post integration
- Path-based media randomization
- State persistence across workflow saves
- Preview generation

### FilenameGenerator

Generate structured filenames based on workflow parameters.

**Features:**

- Dynamic filename preview
- Subdirectory management
- Date-based organization
- Parameter-based naming

### GeminiUtilOptions

Configure Gemini API options.

## Development

### Making Changes

1. Edit the appropriate file based on node type
2. Test changes by refreshing browser cache
3. No build step required (plain JavaScript)

### Adding New Nodes

1. Create new handler file: `new_node.js`
2. Export `registerNewNode()` function
3. Import and register in `extension.js`
```

## Benefits

### 1. **Improved Maintainability**

- Each node type in its own file
- Clear separation of concerns
- Easier to locate and fix bugs

### 2. **Better Development Experience**

- Work on one node without affecting others
- Smaller files = easier to understand
- Can test individual components

### 3. **Scalability**

- Easy to add new Gemini-related nodes
- Can share common utilities
- Follows established patterns (lora_manager)

### 4. **Performance**

- Browser caching per file
- Can lazy-load if needed in future
- Smaller initial load if using module imports

### 5. **Documentation**

- README per functionality area
- Clear file-to-node mapping
- Examples and usage guides

## Migration Impact

### Breaking Changes

None - both old and new files can coexist during transition.

### Deprecation Plan

1. Add new `gemini_utils/` folder alongside `swiss-army-knife.js`
2. Update Python to load new extension
3. Test thoroughly
4. Mark `swiss-army-knife.js` as deprecated
5. Remove after 1-2 releases

### Rollback Plan

If issues arise, simply revert to loading `swiss-army-knife.js`.

## File Size Comparison

### Before

```
web/js/swiss-army-knife.js: 1160+ lines (monolithic)
```

### After

```
web/js/gemini_utils/
  ├── extension.js:          ~50 lines
  ├── media_describe.js:     ~1000 lines
  ├── filename_generator.js: ~180 lines
  ├── options.js:            ~10 lines
  └── README.md:             Documentation
```

Total: Same functionality, better organized.

## Implementation Timeline

1. **Phase 1: Structure** (30 min)
    - Create folder
    - Create skeleton files

2. **Phase 2: Extract Code** (1-2 hours)
    - Move media_describe logic
    - Move filename_generator logic
    - Move options logic
    - Create main extension.js

3. **Phase 3: Testing** (30 min)
    - Test each node type
    - Verify state persistence
    - Check upload functionality

4. **Phase 4: Documentation** (30 min)
    - Write README
    - Add inline documentation
    - Update main project docs

**Total Estimated Time: 2.5-3.5 hours**

## Success Criteria

- [x] All three nodes work identically to before
- [x] State persistence works correctly
- [x] File uploads work correctly
- [x] Reddit integration works correctly
- [x] Filename preview works correctly
- [x] No console errors
- [x] Documentation complete
- [x] Code follows project conventions

## References

- Current implementation: `web/js/swiss-army-knife.js`
- Pattern to follow: `web/js/lora_manager/`
- Project guidelines: `.github/copilot-instructions.md`

## Conclusion

This refactoring will bring the Gemini Utils extension in line with the project's modular architecture, making it easier to maintain, extend, and document. The structure mirrors the successful `lora_manager` pattern and provides a clear path for future enhancements.
