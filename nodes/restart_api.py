"""
Restart API endpoint for ComfyUI Swiss Army Knife
"""
import os
import sys
import signal
import time
from .debug_utils import Logger

logger = Logger("RestartAPI")


def register_restart_routes(app):
    """
    Register restart API route with ComfyUI server.
    
    Args:
        app: The aiohttp or PromptServer application instance
    """
    from aiohttp import web
    
    @app.routes.post("/swissarmyknife/restart")
    async def restart_server(request):
        """
        Restart the ComfyUI server.
        This sends a SIGTERM signal to the current process, which should trigger a restart
        if ComfyUI is running under a process manager or the restart script.
        """
        try:
            logger.log("Server restart requested...")
            
            # Return success response before restarting
            response = web.json_response({
                "success": True,
                "message": "Server restart initiated"
            })
            
            # Schedule the restart after sending response
            import asyncio
            async def do_restart():
                await asyncio.sleep(0.5)  # Give time for response to be sent
                logger.log("Restarting server...")
                
                # Try graceful shutdown first
                os.kill(os.getpid(), signal.SIGTERM)
                
                # If that doesn't work after a delay, force exit
                await asyncio.sleep(2)
                logger.log("Force restarting...")
                sys.exit(0)
            
            asyncio.create_task(do_restart())
            
            return response
            
        except Exception as e:
            logger.error(f"Error restarting server: {e}")
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    logger.log("Registered restart API route")
