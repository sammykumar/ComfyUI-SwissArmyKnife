"""
Web API endpoint for exposing configuration to frontend
"""

from aiohttp import web
import os


# Global variable to cache API keys from frontend settings
_cached_api_keys = {
    "gemini_api_key": "",
    "civitai_api_key": "",
    "azure_storage_connection_string": ""
}


def get_api_keys():
    """Get cached API keys (used by nodes to access credentials)"""
    global _cached_api_keys
    return _cached_api_keys.copy()


def get_setting_value(setting_id):
    """Get a setting value from ComfyUI's settings system"""
    try:
        # Check cached API keys from frontend only (no environment variable fallback)
        global _cached_api_keys
        if setting_id == "swiss_army_knife.gemini.api_key":
            return _cached_api_keys.get("gemini_api_key", "")
        elif setting_id == "swiss_army_knife.civitai.api_key":
            return _cached_api_keys.get("civitai_api_key", "")
        elif setting_id == "swiss_army_knife.azure_storage.connection_string":
            return _cached_api_keys.get("azure_storage_connection_string", "")
            
    except Exception as e:
        print(f"[Swiss Army Knife] Error getting setting {setting_id}: {e}")
    
    return ""


async def get_config(request):
    """Get frontend configuration including DEBUG setting and API keys"""
    try:
        # Read DEBUG setting from environment
        debug = os.environ.get("DEBUG", "false").lower() in ("true", "1", "yes")
        
        # Get API keys from settings (uses cached values or environment variables)
        gemini_api_key = get_setting_value("swiss_army_knife.gemini.api_key")
        civitai_api_key = get_setting_value("swiss_army_knife.civitai.api_key")
        azure_connection_string = get_setting_value("swiss_army_knife.azure_storage.connection_string")

        return web.json_response({
            "debug": debug,
            "gemini_api_key": gemini_api_key,
            "civitai_api_key": civitai_api_key,
            "azure_storage_connection_string": azure_connection_string
        })
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


async def set_api_keys(request):
    """Allow frontend to pass API keys from settings to backend"""
    try:
        data = await request.json()
        gemini_key = data.get("gemini_api_key", "")
        civitai_key = data.get("civitai_api_key", "")
        azure_connection_string = data.get("azure_storage_connection_string", "")
        
        print(f"[Azure Debug] set_api_keys received connection string length: {len(azure_connection_string)}")
        if azure_connection_string:
            print(f"[Azure Debug] Connection string preview: {azure_connection_string[:50]}...")
        
        # Store API keys in a global location that can be accessed by nodes
        global _cached_api_keys
        _cached_api_keys = {
            "gemini_api_key": gemini_key,
            "civitai_api_key": civitai_key,
            "azure_storage_connection_string": azure_connection_string
        }
        
        print(f"[Azure Debug] Cached keys after update: {list(_cached_api_keys.keys())}")
        print(f"[Azure Debug] Cached Azure connection string length: {len(_cached_api_keys.get('azure_storage_connection_string', ''))}")
        
        # Refresh the global CivitAI service to pick up the new API key
        try:
            from .civitai_service import refresh_civitai_service
            refresh_civitai_service()
        except ImportError:
            pass  # CivitAI service not available
        
        print(f"[Swiss Army Knife] API keys cached: Gemini={bool(gemini_key)}, CivitAI={bool(civitai_key)}, Azure={bool(azure_connection_string)}")
        
        return web.json_response({"success": True})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


def register_config_routes(app):
    """Register configuration API routes"""
    app.router.add_get("/swissarmyknife/config", get_config)
    app.router.add_post("/swissarmyknife/set_api_keys", set_api_keys)
