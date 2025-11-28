"""
Hardware Information Collector
Collects CPU, RAM, and system information using psutil
"""
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False
    logger.warning("psutil not available - CPU/RAM monitoring disabled")

try:
    import cpuinfo
    CPUINFO_AVAILABLE = True
except ImportError:
    CPUINFO_AVAILABLE = False
    logger.info("py-cpuinfo not available - detailed CPU info disabled")


class HardwareInfo:
    """
    Collects system hardware information (CPU, RAM, Disk)
    """
    
    def __init__(self):
        self._cpu_brand = None
        if CPUINFO_AVAILABLE:
            try:
                info = cpuinfo.get_cpu_info()
                self._cpu_brand = info.get('brand_raw', 'Unknown CPU')
            except Exception as e:
                logger.warning(f"Failed to get CPU brand: {e}")
                self._cpu_brand = "Unknown CPU"
    
    def get_cpu_usage(self) -> Optional[float]:
        """
        Get current CPU usage percentage (0-100)
        Returns None if psutil not available
        """
        if not PSUTIL_AVAILABLE:
            return None
        
        try:
            return psutil.cpu_percent(interval=0.1)
        except Exception as e:
            logger.error(f"Error getting CPU usage: {e}")
            return None
    
    def get_cpu_per_core(self) -> Optional[list]:
        """
        Get CPU usage per core
        Returns None if psutil not available
        """
        if not PSUTIL_AVAILABLE:
            return None
        
        try:
            return psutil.cpu_percent(interval=0.1, percpu=True)
        except Exception as e:
            logger.error(f"Error getting per-core CPU usage: {e}")
            return None
    
    def get_memory_info(self) -> Optional[Dict[str, Any]]:
        """
        Get RAM usage information
        Returns dict with: total, available, used, percent
        Returns None if psutil not available
        """
        if not PSUTIL_AVAILABLE:
            return None
        
        try:
            mem = psutil.virtual_memory()
            return {
                "total": mem.total,
                "available": mem.available,
                "used": mem.used,
                "percent": mem.percent,
                "total_gb": mem.total / (1024**3),
                "used_gb": mem.used / (1024**3),
                "available_gb": mem.available / (1024**3)
            }
        except Exception as e:
            logger.error(f"Error getting memory info: {e}")
            return None
    
    def get_disk_usage(self, path: str = "/") -> Optional[Dict[str, Any]]:
        """
        Get disk usage for specified path
        Returns dict with: total, used, free, percent
        Returns None if psutil not available
        """
        if not PSUTIL_AVAILABLE:
            return None
        
        try:
            disk = psutil.disk_usage(path)
            return {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": disk.percent,
                "total_gb": disk.total / (1024**3),
                "used_gb": disk.used / (1024**3),
                "free_gb": disk.free / (1024**3)
            }
        except Exception as e:
            logger.error(f"Error getting disk usage: {e}")
            return None
    
    def get_cpu_temperature(self) -> Optional[float]:
        """
        Get CPU temperature (if available)
        Returns temperature in Celsius, or None if not available
        
        Note: Temperature sensors may not be available on all systems
        """
        if not PSUTIL_AVAILABLE:
            return None
        
        try:
            # Try to get temperature sensors
            temps = psutil.sensors_temperatures()
            if not temps:
                return None
            
            # Try common sensor names
            for name in ['coretemp', 'k10temp', 'cpu_thermal', 'cpu-thermal']:
                if name in temps:
                    entries = temps[name]
                    if entries:
                        # Return the first current temperature
                        return entries[0].current
            
            # If no known sensors, try the first available
            first_sensor = next(iter(temps.values()))
            if first_sensor:
                return first_sensor[0].current
                
        except (AttributeError, Exception) as e:
            # sensors_temperatures may not be available on all platforms
            logger.debug(f"CPU temperature not available: {e}")
        
        return None
    
    def get_cpu_count(self) -> Optional[Dict[str, int]]:
        """
        Get CPU core count information
        Returns dict with: physical, logical
        """
        if not PSUTIL_AVAILABLE:
            return None
        
        try:
            return {
                "physical": psutil.cpu_count(logical=False),
                "logical": psutil.cpu_count(logical=True)
            }
        except Exception as e:
            logger.error(f"Error getting CPU count: {e}")
            return None
    
    def get_full_status(self) -> Dict[str, Any]:
        """
        Get all hardware information in a single call
        Returns dict with all available hardware metrics
        """
        status = {
            "available": PSUTIL_AVAILABLE,
            "cpu_brand": self._cpu_brand
        }
        
        if PSUTIL_AVAILABLE:
            status["cpu_percent"] = self.get_cpu_usage()
            status["cpu_per_core"] = self.get_cpu_per_core()
            status["cpu_count"] = self.get_cpu_count()
            status["cpu_temp"] = self.get_cpu_temperature()
            status["memory"] = self.get_memory_info()
            status["disk"] = self.get_disk_usage()
        
        return status
