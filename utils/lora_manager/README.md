# LoRA Manager

This directory contains the LoRA Manager component, forked from [nd-super-nodes](https://github.com/HenkDz/nd-super-nodes) by HenkDz.

## What is LoRA Manager?

LoRA Manager provides advanced LoRA loading and management capabilities for ComfyUI, including:

- **Super LoRA Loader Node**: Load multiple LoRAs with individual controls
- **Enhanced File Picker**: Advanced file selection overlay with search
- **Template System**: Save and load LoRA configurations
- **CivitAI Integration**: Automatic trigger word fetching

## Files

- **`__init__.py`**: Module initialization and node registration
- **`nd_super_lora_node.py`**: Main Super LoRA Loader node
- **`lora_utils.py`**: LoRA file discovery and metadata extraction
- **`civitai_service.py`**: CivitAI API integration
- **`template_manager.py`**: Template save/load/delete operations
- **`web_api.py`**: HTTP API endpoints for frontend
- **`file_api.py`**: Enhanced file listing API
- **`version_utils.py`**: Version checking and update notifications

## Integration

The LoRA Manager is integrated into ComfyUI-SwissArmyKnife:

1. Nodes are registered in the main `__init__.py`
2. All nodes use the "Swiss Army Knife 🔪" category
3. Web extensions are loaded from `web/js/lora_manager/`
4. API routes are registered with ComfyUI's PromptServer

## Documentation

For detailed information, see [docs/LORA_MANAGER_INTEGRATION.md](../../docs/LORA_MANAGER_INTEGRATION.md)

## Original Project

This component is forked from:
- **Repository**: https://github.com/HenkDz/nd-super-nodes
- **Author**: HenkDz
- **Original License**: See original repository

## Swiss Army Knife Modifications

- Category changed to "Swiss Army Knife 🔪"
- Print statements updated with "Swiss Army Knife LoRA Manager" branding
- Module restructured under `utils/lora_manager/`
- Documentation added for integration
- Display name updated to "Super LoRA Loader 🔪"

## Usage

Add the **Super LoRA Loader 🔪** node to your ComfyUI workflow:

1. Connect MODEL input (required)
2. Connect CLIP input (optional)
3. Use the enhanced UI to add and configure LoRAs
4. Save configurations as templates for reuse

## Development

When modifying lora_manager:

1. Make changes to Python files in this directory
2. Update web extension in `web/js/lora_manager/`
3. Test with ComfyUI running
4. Update documentation as needed

## Credits

Original implementation by HenkDz (nd-super-nodes).
Integration work by the ComfyUI-SwissArmyKnife team.
