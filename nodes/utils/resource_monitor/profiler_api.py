"""
Profiler API Endpoints
REST API for workflow profiling statistics and archive management
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Global profiler manager instance
_profiler_manager: Optional['ProfilerManager'] = None


def set_profiler_manager(manager):
    """Set the global profiler manager instance"""
    global _profiler_manager
    _profiler_manager = manager
    logger.info("Profiler manager registered with API")


def get_profiler_manager():
    """Get the global profiler manager instance"""
    return _profiler_manager


def register_profiler_routes(app):
    """
    Register profiler API routes with ComfyUI server
    
    Args:
        app: The aiohttp or PromptServer application instance
    """
    from aiohttp import web
    
    @app.routes.get("/swissarmyknife/profiler/stats")
    async def get_profiler_stats(request):
        """
        GET /swissarmyknife/profiler/stats
        Get current profiler statistics
        """
        try:
            manager = get_profiler_manager()
            if not manager:
                return web.json_response({
                    "success": False,
                    "error": "Profiler not initialized"
                }, status=503)
            
            stats = manager.get_stats()
            return web.json_response({
                "success": True,
                "data": stats
            })
        
        except Exception as e:
            logger.error(f"Error getting profiler stats: {e}", exc_info=True)
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    @app.routes.get("/swissarmyknife/profiler/archives")
    async def list_archives(request):
        """
        GET /swissarmyknife/profiler/archives
        List all archive files
        """
        try:
            manager = get_profiler_manager()
            if not manager:
                return web.json_response({
                    "success": False,
                    "error": "Profiler not initialized"
                }, status=503)
            
            archives = manager.list_archives()
            return web.json_response({
                "success": True,
                "data": archives
            })
        
        except Exception as e:
            logger.error(f"Error listing archives: {e}", exc_info=True)
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    @app.routes.post("/swissarmyknife/profiler/archive")
    async def create_archive(request):
        """
        POST /swissarmyknife/profiler/archive
        Create a new archive from current history
        """
        try:
            manager = get_profiler_manager()
            if not manager:
                return web.json_response({
                    "success": False,
                    "error": "Profiler not initialized"
                }, status=503)
            
            filename = manager.create_archive()
            return web.json_response({
                "success": True,
                "data": {"filename": filename}
            })
        
        except Exception as e:
            logger.error(f"Error creating archive: {e}", exc_info=True)
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    @app.routes.post("/swissarmyknife/profiler/archive/{filename}/load")
    async def load_archive(request):
        """
        POST /swissarmyknife/profiler/archive/:filename/load
        Load an archive file
        """
        try:
            filename = request.match_info['filename']
            
            manager = get_profiler_manager()
            if not manager:
                return web.json_response({
                    "success": False,
                    "error": "Profiler not initialized"
                }, status=503)
            
            manager.load_archive(filename)
            return web.json_response({
                "success": True,
                "data": {"message": f"Loaded archive {filename}"}
            })
        
        except FileNotFoundError as e:
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=404)
        except Exception as e:
            logger.error(f"Error loading archive: {e}", exc_info=True)
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    @app.routes.delete("/swissarmyknife/profiler/archive/{filename}")
    async def delete_archive(request):
        """
        DELETE /swissarmyknife/profiler/archive/:filename
        Delete an archive file
        """
        try:
            filename = request.match_info['filename']
            
            manager = get_profiler_manager()
            if not manager:
                return web.json_response({
                    "success": False,
                    "error": "Profiler not initialized"
                }, status=503)
            
            manager.delete_archive(filename)
            return web.json_response({
                "success": True,
                "data": {"message": f"Deleted archive {filename}"}
            })
        
        except FileNotFoundError as e:
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=404)
        except Exception as e:
            logger.error(f"Error deleting archive: {e}", exc_info=True)
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    logger.info("Profiler API routes registered")
