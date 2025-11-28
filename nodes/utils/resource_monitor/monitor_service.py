"""
Resource Monitor Service
Background service that collects and broadcasts hardware metrics
"""
import asyncio
import logging
import time
from typing import Dict, Any, Optional

from .hardware_info import HardwareInfo
from .gpu_info import GPUInfo

logger = logging.getLogger(__name__)


class MonitorService:
    """
    Background service that periodically collects hardware metrics
    and broadcasts them to connected clients
    """

    def __init__(self, server, interval: float = 2.0):
        """
        Initialize monitor service
        
        Args:
            server: PromptServer instance for broadcasting
            interval: Update interval in seconds (default: 2.0)
        """
        self.server = server
        self.interval = interval
        self.running = False
        self.task: Optional[asyncio.Task] = None

        # Initialize info collectors
        self.hardware_info = HardwareInfo()
        self.gpu_info = GPUInfo()

        logger.info(f"MonitorService initialized (interval: {interval}s)")

    async def _monitor_loop(self):
        """Main monitoring loop - runs in background"""
        logger.info("MonitorService: Starting monitor loop")

        while self.running:
            try:
                # Collect all metrics
                data = self.get_current_status()

                # Broadcast to all connected clients
                if self.server and hasattr(self.server, 'send_sync'):
                    self.server.send_sync('swissarmyknife.monitor', data)

                # Wait for next interval
                await asyncio.sleep(self.interval)

            except asyncio.CancelledError:
                logger.info("MonitorService: Loop cancelled")
                break
            except Exception as e:
                logger.error(f"MonitorService: Error in monitor loop: {e}", exc_info=True)
                await asyncio.sleep(self.interval)

        logger.info("MonitorService: Monitor loop stopped")

    def start(self):
        """Start the monitoring service"""
        if self.running:
            logger.warning("MonitorService: Already running")
            return

        self.running = True

        # Start the monitoring loop
        try:
            loop = asyncio.get_event_loop()
            self.task = loop.create_task(self._monitor_loop())
            logger.info("MonitorService: Started successfully")
        except Exception as e:
            logger.error(f"MonitorService: Failed to start: {e}")
            self.running = False

    def stop(self):
        """Stop the monitoring service"""
        if not self.running:
            return

        logger.info("MonitorService: Stopping...")
        self.running = False

        if self.task:
            self.task.cancel()
            self.task = None

        logger.info("MonitorService: Stopped")

    def get_current_status(self) -> Dict[str, Any]:
        """
        Get current hardware status snapshot
        
        Returns:
            Dict containing all hardware metrics
        """
        return {
            "timestamp": time.time(),
            "hardware": self.hardware_info.get_full_status(),
            "gpu": self.gpu_info.get_full_status()
        }

    def get_gpu_device_info(self, device_id: int) -> Dict[str, Any]:
        """Get detailed info for specific GPU device"""
        return self.gpu_info.get_device_info(device_id)

    def clear_vram(self, device_id: Optional[int] = None) -> Dict[str, Any]:
        """
        Clear VRAM cache for specified device (or all devices)
        
        Args:
            device_id: Device ID to clear, or None for all devices
            
        Returns:
            Dict with success status and message
        """
        try:
            self.gpu_info.clear_vram_cache(device_id)

            # Get updated status after clearing
            status = self.get_current_status()

            # Broadcast immediate update
            if self.server and hasattr(self.server, 'send_sync'):
                self.server.send_sync('swissarmyknife.monitor', status)

            return {
                "success": True,
                "message": f"VRAM cleared for {'all devices' if device_id is None else f'device {device_id}'}",
                "status": status
            }

        except Exception as e:
            logger.error(f"Error clearing VRAM: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def set_interval(self, interval: float):
        """
        Update monitoring interval
        
        Args:
            interval: New interval in seconds
        """
        if interval < 0.5:
            logger.warning(f"Interval {interval}s too low, setting to 0.5s")
            interval = 0.5

        old_interval = self.interval
        self.interval = interval
        logger.info(f"MonitorService: Interval changed from {old_interval}s to {interval}s")
