"""
Template management system for ND Super Nodes
"""

import json
import os
from typing import List, Dict, Any, Optional

try:
    import folder_paths
    COMFYUI_AVAILABLE = True
except ImportError:
    print("ND Super Nodes: ComfyUI folder_paths not available for templates")
    folder_paths = None
    COMFYUI_AVAILABLE = False


class TemplateManager:
    """Manages saving and loading of LoRA configuration templates."""

    def __init__(self):
        self.templates_dir = self._get_templates_directory()
        self._ensure_templates_dir()

    def _get_templates_directory(self) -> str:
        if COMFYUI_AVAILABLE and folder_paths is not None:
            try:
                user_dir = folder_paths.get_user_directory()
                return os.path.join(user_dir, "super_lora_templates")
            except Exception:
                pass
        return os.path.join(os.path.dirname(__file__), "..", "templates")

    def _ensure_templates_dir(self):
        os.makedirs(self.templates_dir, exist_ok=True)

    def save_template(self, name: str, lora_configs: List[Dict[str, Any]]) -> bool:
        try:
            safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
            if not safe_name:
                safe_name = "template"

            filename = f"{safe_name}.json"
            filepath = os.path.join(self.templates_dir, filename)
            template_data = {"name": name, "version": "1.0", "loras": lora_configs, "created_at": self._get_timestamp()}
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(template_data, f, indent=2, ensure_ascii=False)
            print(f"ND Super Nodes: Template '{name}' saved successfully")
            return True
        except Exception as e:
            print(f"ND Super Nodes: Error saving template '{name}': {e}")
            return False

    def load_template(self, name: str) -> Optional[Dict[str, Any]]:
        try:
            filename = f"{name}.json"
            filepath = os.path.join(self.templates_dir, filename)
            if not os.path.exists(filepath):
                for file in os.listdir(self.templates_dir):
                    if file.endswith('.json'):
                        try:
                            test_path = os.path.join(self.templates_dir, file)
                            with open(test_path, 'r', encoding='utf-8') as f:
                                data = json.load(f)
                                if data.get('name') == name:
                                    filepath = test_path
                                    break
                        except:
                            continue
                else:
                    return None
            with open(filepath, 'r', encoding='utf-8') as f:
                template_data = json.load(f)
            return template_data
        except Exception as e:
            print(f"ND Super Nodes: Error loading template '{name}': {e}")
            return None

    def list_templates(self) -> List[Dict[str, str]]:
        templates = []
        try:
            if not os.path.exists(self.templates_dir):
                return templates
            for filename in os.listdir(self.templates_dir):
                if filename.endswith('.json'):
                    try:
                        filepath = os.path.join(self.templates_dir, filename)
                        with open(filepath, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                        templates.append({"name": data.get('name', filename[:-5]), "filename": filename, "created_at": data.get('created_at', '')})
                    except Exception as e:
                        print(f"ND Super Nodes: Error reading template '{filename}': {e}")
                        continue
        except Exception as e:
            print(f"ND Super Nodes: Error listing templates: {e}")
        return sorted(templates, key=lambda x: x['name'])

    def delete_template(self, name: str) -> bool:
        try:
            template_data = self.load_template(name)
            if not template_data:
                return False
            filename = f"{name}.json"
            filepath = os.path.join(self.templates_dir, filename)
            if not os.path.exists(filepath):
                for file in os.listdir(self.templates_dir):
                    if file.endswith('.json'):
                        try:
                            test_path = os.path.join(self.templates_dir, file)
                            with open(test_path, 'r', encoding='utf-8') as f:
                                data = json.load(f)
                                if data.get('name') == name:
                                    filepath = test_path
                                    break
                        except:
                            continue
                else:
                    return False
            os.remove(filepath)
            print(f"ND Super Nodes: Template '{name}' deleted successfully")
            return True
        except Exception as e:
            print(f"ND Super Nodes: Error deleting template '{name}': {e}")
            return False

    def _get_timestamp(self) -> str:
        from datetime import datetime
        return datetime.now().isoformat()


_template_manager = TemplateManager()


def get_template_manager() -> TemplateManager:
    return _template_manager
