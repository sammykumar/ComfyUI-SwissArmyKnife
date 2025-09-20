import os
import server
from aiohttp import web
import folder_paths
import nodes
from .utils.nodes import NODE_CLASS_MAPPINGS
from .utils.nodes import NODE_DISPLAY_NAME_MAPPINGS

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]

# Define the path to our extension
workspace_path = os.path.dirname(__file__)
dist_path = os.path.join(workspace_path, "dist/example_ext")
dist_locales_path = os.path.join(workspace_path, "dist/locales")

# Print the current paths for debugging
print(f"ComfyUI_example_frontend_extension workspace path: {workspace_path}")
print(f"Dist path: {dist_path}")
print(f"Dist locales path: {dist_locales_path}")
print(f"Locales exist: {os.path.exists(dist_locales_path)}")

# Register the static route for serving our React app assets
if os.path.exists(dist_path):
    # Add the routes for the extension
    server.PromptServer.instance.app.add_routes([
        web.static("/example_ext/", dist_path),
    ])

    # Register the locale files route
    if os.path.exists(dist_locales_path):
        server.PromptServer.instance.app.add_routes([
            web.static("/locales/", dist_locales_path),
        ])
        print("Registered locale files route at /locales/")
    else:
        print("WARNING: Locale directory not found!")

    # Also register the standard ComfyUI extension web directory

    project_name = os.path.basename(workspace_path)

    try:
        # Method added in https://github.com/comfyanonymous/ComfyUI/pull/8357
        from comfy_config import config_parser

        project_config = config_parser.extract_node_configuration(workspace_path)
        project_name = project_config.project.name
        print(f"project name read from pyproject.toml: {project_name}")
    except Exception as e:
        print(f"Could not load project config, using default name '{project_name}': {e}")

    # Register the dist directory for React app
    nodes.EXTENSION_WEB_DIRS[project_name] = os.path.join(workspace_path, "dist")

    # Also register the web directory for JavaScript extensions
    web_dir = os.path.join(workspace_path, "web")
    if os.path.exists(web_dir):
        nodes.EXTENSION_WEB_DIRS[f"{project_name}_web"] = web_dir
        print(f"Registered web directory: {web_dir}")

else:
    print("ComfyUI Example React Extension: Dist directory not found")

    # Fallback: register web directory even if dist doesn't exist
    project_name = os.path.basename(workspace_path)
    web_dir = os.path.join(workspace_path, "web")
    if os.path.exists(web_dir):
        nodes.EXTENSION_WEB_DIRS[f"{project_name}_web"] = web_dir
        print(f"Registered web directory (fallback): {web_dir}")