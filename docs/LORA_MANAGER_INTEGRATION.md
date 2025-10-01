# LoRA Manager Integration

## Overview

The LoRA Manager is a powerful suite of tools forked from [nd-super-nodes](https://github.com/HenkDz/nd-super-nodes) that has been integrated into ComfyUI-SwissArmyKnife under `utils/lora_manager/`. This integration provides advanced LoRA loading and management capabilities with an enhanced UI.

## Features

### 1. Super LoRA Loader Node

The **Super LoRA Loader 🔪** node provides:

- **Multiple LoRA Loading**: Load multiple LoRAs in a single node
- **Individual Controls**: Per-LoRA enable/disable toggles
- **Dual Strength Support**: Separate model and CLIP strength controls
- **Trigger Words**: Automatic trigger word extraction and display
- **Tag Organization**: Group LoRAs by tags with collapsible sections
- **Template System**: Save and load LoRA configurations as templates
- **Duplicate Detection**: Prevents adding the same LoRA twice

### 2. Enhanced File Picker (ND Super Selector)

The file picker overlay provides:

- **Visual Indicators**: Golden-bordered widgets with lightning icon (⚡)
- **Advanced Browser**: Folder navigation with search functionality
- **Multi-Select**: Select multiple files at once
- **Per-Node Toggle**: Enable/disable enhancements via right-click menu
- **Persistent Settings**: Settings saved across workflow loads

Supported nodes for enhanced file picker:
- CheckpointLoader
- VAELoader
- LoraLoader
- UNETLoader
- CLIPLoader
- ControlNetLoader
- UpscaleModelLoader
- GGUF variants

### 3. Template Management

Templates allow you to:
- **Save**: Store current LoRA configurations with names
- **Load**: Quickly restore saved configurations
- **Rename**: Update template names
- **Delete**: Remove unwanted templates
- **Share**: Templates are stored in ComfyUI's user directory

### 4. CivitAI Integration

Automatic metadata fetching:
- **Trigger Words**: Auto-fetch from CivitAI API
- **Model Info**: Retrieve model descriptions and details
- **Fallback**: Uses local safetensors metadata if API unavailable
- **Caching**: Reduces API calls with smart caching

## Architecture

### Backend Components

Located in `utils/lora_manager/`:

- **`nd_super_lora_node.py`**: Main LoRA loader node implementation
- **`lora_utils.py`**: LoRA file discovery and metadata extraction
- **`civitai_service.py`**: CivitAI API integration
- **`template_manager.py`**: Template save/load/delete operations
- **`web_api.py`**: HTTP API endpoints for frontend
- **`file_api.py`**: Enhanced file listing API
- **`version_utils.py`**: Version checking and update notifications
- **`__init__.py`**: Module initialization and node registration

### Web Components

Located in `web/js/lora_manager/` and `web/css/lora_manager/`:

- **`extension.js`**: Frontend JavaScript for UI enhancements
- **`style.css`**: Custom styling for LoRA manager UI

### API Routes

The lora_manager registers the following API endpoints:

**LoRA Operations:**
- `GET /super_lora/loras` - List available LoRAs
- `GET /super_lora/files?folder_name=loras` - List files in folder
- `POST /super_lora/civitai_info` - Fetch CivitAI metadata

**Template Operations:**
- `GET /super_lora/templates` - List all templates
- `GET /super_lora/templates/{name}` - Get specific template
- `POST /super_lora/templates` - Save new template
- `DELETE /super_lora/templates/{name}` - Delete template

**Version Info:**
- `GET /super_lora/version` - Get version and update status

## Integration with Swiss Army Knife

### Node Registration

The lora_manager nodes are integrated into the main node mappings in `__init__.py`:

```python
from .utils.lora_manager import NODE_CLASS_MAPPINGS as LORA_MANAGER_NODE_CLASS_MAPPINGS
from .utils.lora_manager import NODE_DISPLAY_NAME_MAPPINGS as LORA_MANAGER_NODE_DISPLAY_NAME_MAPPINGS

NODE_CLASS_MAPPINGS = {
    **MAIN_NODE_CLASS_MAPPINGS,
    **HELPER_NODE_CLASS_MAPPINGS,
    **LORA_MANAGER_NODE_CLASS_MAPPINGS
}
```

### Category Organization

All lora_manager nodes use the **Swiss Army Knife 🔪** category, keeping them organized with other Swiss Army Knife nodes in ComfyUI's node browser.

### Web Extension Loading

The web extension files are automatically loaded from `web/js/lora_manager/` and `web/css/lora_manager/` directories through ComfyUI's standard web directory loading mechanism.

## Dependencies

The lora_manager requires the following Python packages:

- **aiohttp>=3.8.0**: For async HTTP requests and API endpoints
- **safetensors** (optional): For reading LoRA metadata from safetensors files

These are specified in `pyproject.toml`:

```toml
dependencies = [
    # ... other dependencies
    "aiohttp>=3.8.0",
]
```

## Usage

### Basic Usage

1. Add a **Super LoRA Loader 🔪** node to your workflow
2. Connect a MODEL input (required)
3. Connect a CLIP input (optional)
4. Use the enhanced UI to:
   - Add LoRAs by clicking the "+" button
   - Adjust per-LoRA strengths with sliders
   - Enable/disable individual LoRAs with checkboxes
   - View and edit trigger words
   - Organize LoRAs with tags

### Template Workflow

1. Configure your desired LoRA setup
2. Click "Save Template" in the overlay
3. Enter a template name
4. Later, click "Load Template" to restore the configuration

### Enhanced File Picker

1. Right-click on a supported node (e.g., LoraLoader)
2. Select "⚡ Enable ND Super Selector"
3. Click the lightning icon (⚡) on the widget
4. Browse, search, and select files in the overlay

## Development

### Adding New Features

When extending the lora_manager:

1. Add backend logic to appropriate file in `utils/lora_manager/`
2. Update web frontend in `web/js/lora_manager/extension.js`
3. Add new API routes to `web_api.py` if needed
4. Update this documentation

### Testing

To test lora_manager functionality:

```bash
# Test Python imports
python3 -c "from utils.lora_manager import NODE_CLASS_MAPPINGS; print(list(NODE_CLASS_MAPPINGS.keys()))"

# Test with ComfyUI running
# 1. Start ComfyUI server
# 2. Check console for "Swiss Army Knife LoRA Manager: API routes registered"
# 3. Test node in ComfyUI interface
```

## Troubleshooting

### API Routes Not Registered

**Symptom**: Message "Failed to register API routes" in console

**Solutions**:
- Check that aiohttp is installed: `pip install aiohttp>=3.8.0`
- Verify ComfyUI server is running
- Check for conflicting route registrations

### LoRAs Not Listed

**Symptom**: No LoRAs appear in the node

**Solutions**:
- Verify LoRAs are in ComfyUI's loras directory
- Check folder_paths configuration
- Try refreshing the node

### Trigger Words Not Loading

**Symptom**: Trigger words show as empty

**Solutions**:
- Check internet connection for CivitAI API
- Verify LoRA file has metadata (safetensors format)
- Check console for API errors

### Templates Not Saving

**Symptom**: Template save fails silently

**Solutions**:
- Check write permissions on ComfyUI user directory
- Verify sufficient disk space
- Check console for error messages

## Credits

The lora_manager component is forked from [nd-super-nodes](https://github.com/HenkDz/nd-super-nodes) by HenkDz. 

**Original Features:**
- Super LoRA Loader implementation
- Enhanced file picker overlay
- Template management system
- CivitAI integration

**Swiss Army Knife Adaptations:**
- Category integration (Swiss Army Knife 🔪)
- Module restructuring under `utils/lora_manager/`
- Updated branding and print statements
- Documentation and contribution guidelines

## License

The lora_manager component retains its original license from nd-super-nodes. The integration work is licensed under the GNU General Public License v3 (GPL-3.0), consistent with ComfyUI-SwissArmyKnife.

## Future Enhancements

Potential improvements for the lora_manager:

- [ ] Add bulk LoRA operations (enable/disable all)
- [ ] Implement LoRA preview thumbnails
- [ ] Add LoRA metadata caching for faster loads
- [ ] Support for custom LoRA categories/collections
- [ ] Integration with existing SwissArmyKnife metadata features
- [ ] Export/import templates as JSON files
- [ ] LoRA conflict detection and warnings
- [ ] Performance metrics and loading time display

## See Also

- [nd-super-nodes Original Repository](https://github.com/HenkDz/nd-super-nodes)
- [ComfyUI Custom Node Development](https://docs.comfy.org/custom-nodes/overview)
- [CONTRIBUTING.md](../CONTRIBUTING.md) - General contribution guidelines
- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - Project status tracking
