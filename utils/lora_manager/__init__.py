"""
LoRA Manager - ComfyUI-SwissArmyKnife Sub-Module
Forked from nd-super-nodes (https://github.com/HenkDz/nd-super-nodes)
A suite of modern implementations for enhanced LoRA loading and UI features.
"""

try:
    from .nd_super_lora_node import SuperDualLoraLoader, SuperLoraLoader
except ImportError:
    # Fallback for development/testing
    import sys
    import os
    sys.path.append(os.path.dirname(__file__))
    from nd_super_lora_node import SuperDualLoraLoader, SuperLoraLoader

NODE_CLASS_MAPPINGS = {
    "SuperDualLoraLoader": SuperDualLoraLoader,
    "SuperLoraLoader": SuperLoraLoader,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "SuperDualLoraLoader": "SuperDualLoraLoader (WanVideoWrapper) 🔪",
    "SuperLoraLoader": "SuperLoraLoader 🔪",
}

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]

# Register HTTP routes with ComfyUI's PromptServer when available
try:
    from .web_api import register_routes as _register_super_lora_routes
    from .file_api import register_file_api_routes as _register_file_api_routes
    try:
        from server import PromptServer  # ComfyUI's server
        _app = getattr(PromptServer.instance, "app", None) or PromptServer.instance
        if _app:
            _register_super_lora_routes(_app)
            _register_file_api_routes(_app)
            print("Swiss Army Knife LoRA Manager: API routes registered")
    except Exception as _e:
        print(f"Swiss Army Knife LoRA Manager: Failed to register API routes: {_e}")
except Exception:
    # Safe to ignore if web_api is unavailable in certain environments
    pass
