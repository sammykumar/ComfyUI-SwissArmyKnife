"""
Resource Monitor API Endpoints
REST API for hardware monitoring and control
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Global monitor service instance
_monitor_service: Optional['MonitorService'] = None


def set_monitor_service(service):
    """Set the global monitor service instance"""
    global _monitor_service
    _monitor_service = service
    logger.info("Monitor service registered with API")


def get_monitor_service():
    """Get the global monitor service instance"""
    return _monitor_service


def register_monitor_routes(app):
    """
    Register resource monitor API routes with ComfyUI server
    
    Args:
        app: The aiohttp or PromptServer application instance
    """
    from aiohttp import web
    
    @app.routes.get("/swissarmyknife/monitor/status")
    async def get_monitor_status(request):
        """
        GET /swissarmyknife/monitor/status
        Get current hardware monitoring status
        """
        try:
            service = get_monitor_service()
            if not service:
                return web.json_response({
                    "success": False,
                    "error": "Monitor service not initialized"
                }, status=503)
            
            status = service.get_current_status()
            return web.json_response({
                "success": True,
                "data": status
            })
        
        except Exception as e:
            logger.error(f"Error getting monitor status: {e}", exc_info=True)
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    @app.routes.get("/swissarmyknife/monitor/gpu/{device_id}")
    async def get_gpu_device_info(request):
        """
        GET /swissarmyknife/monitor/gpu/:device_id
        Get detailed information for specific GPU device
        """
        try:
            device_id = int(request.match_info['device_id'])
            
            service = get_monitor_service()
            if not service:
                return web.json_response({
                    "success": False,
                    "error": "Monitor service not initialized"
                }, status=503)
            
            device_info = service.get_gpu_device_info(device_id)
            return web.json_response({
                "success": True,
                "data": device_info
            })
        
        except ValueError:
            return web.json_response({
                "success": False,
                "error": "Invalid device_id - must be integer"
            }, status=400)
        except Exception as e:
            logger.error(f"Error getting GPU device info: {e}", exc_info=True)
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    @app.routes.post("/swissarmyknife/monitor/clear-vram")
    async def clear_vram(request):
        """
        POST /swissarmyknife/monitor/clear-vram
        Clear VRAM cache for specified device or all devices
        
        Body (optional):
            {
                "device_id": 0  // null or omitted = all devices
            }
        """
        try:
            service = get_monitor_service()
            if not service:
                return web.json_response({
                    "success": False,
                    "error": "Monitor service not initialized"
                }, status=503)
            
            # Parse request body
            device_id = None
            try:
                data = await request.json()
                device_id = data.get('device_id')
            except:
                # No body or invalid JSON - clear all devices
                pass
            
            result = service.clear_vram(device_id)
            
            if result.get('success'):
                return web.json_response(result)
            else:
                return web.json_response(result, status=500)
        
        except Exception as e:
            logger.error(f"Error clearing VRAM: {e}", exc_info=True)
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    @app.routes.patch("/swissarmyknife/monitor/settings")
    async def update_monitor_settings(request):
        """
        PATCH /swissarmyknife/monitor/settings
        Update monitor service settings
        
        Body:
            {
                "interval": 2.0  // Update interval in seconds
            }
        """
        try:
            service = get_monitor_service()
            if not service:
                return web.json_response({
                    "success": False,
                    "error": "Monitor service not initialized"
                }, status=503)
            
            data = await request.json()
            
            # Update interval if provided
            if 'interval' in data:
                interval = float(data['interval'])
                service.set_interval(interval)
            
            return web.json_response({
                "success": True,
                "message": "Settings updated",
                "current_settings": {
                    "interval": service.interval,
                    "running": service.running
                }
            })
        
        except ValueError as e:
            return web.json_response({
                "success": False,
                "error": f"Invalid value: {e}"
            }, status=400)
        except Exception as e:
            logger.error(f"Error updating monitor settings: {e}", exc_info=True)
            return web.json_response({
                "success": False,
                "error": str(e)
            }, status=500)
    
    logger.info("Registered resource monitor API routes")
