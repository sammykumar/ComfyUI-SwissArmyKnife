"""
Web API endpoint for exposing configuration to frontend
"""

from aiohttp import web
import os


async def get_config(request):
    """Get frontend configuration including DEBUG setting"""
    try:
        # Read DEBUG setting from environment
        debug = os.environ.get("DEBUG", "false").lower() in ("true", "1", "yes")

        return web.json_response({
            "debug": debug
        })
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


def register_config_routes(app):
    """Register configuration API routes"""
    app.router.add_get("/swissarmyknife/config", get_config)
