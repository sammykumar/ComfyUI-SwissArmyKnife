"""
GPU Information Collector
Collects GPU metrics (VRAM, utilization, temperature) using pynvml and torch
"""
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

# Try importing torch
try:
    import torch
    TORCH_AVAILABLE = True
    CUDA_AVAILABLE = torch.cuda.is_available()
except ImportError:
    TORCH_AVAILABLE = False
    CUDA_AVAILABLE = False
    logger.warning("torch not available - GPU monitoring disabled")

# Try importing pynvml for detailed GPU metrics
try:
    import pynvml
    pynvml.nvmlInit()
    PYNVML_AVAILABLE = True
except Exception as e:
    PYNVML_AVAILABLE = False
    logger.info(f"pynvml not available - using torch-only GPU metrics: {e}")


class GPUInfo:
    """
    Collects GPU information (VRAM, utilization, temperature)
    Prefers pynvml for detailed metrics, falls back to torch
    """
    
    def __init__(self):
        self.device_count = 0
        self._handles = []
        
        if CUDA_AVAILABLE:
            self.device_count = torch.cuda.device_count()
            
            # Initialize pynvml handles if available
            if PYNVML_AVAILABLE:
                try:
                    self._handles = [
                        pynvml.nvmlDeviceGetHandleByIndex(i) 
                        for i in range(self.device_count)
                    ]
                except Exception as e:
                    logger.error(f"Error initializing pynvml handles: {e}")
                    self._handles = []
    
    def get_device_count(self) -> int:
        """Get number of available CUDA devices"""
        return self.device_count
    
    def get_vram_info(self, device_id: int = 0) -> Optional[Dict[str, Any]]:
        """
        Get VRAM usage for specified device
        Returns dict with: total, used, free (in bytes and GB)
        """
        if not CUDA_AVAILABLE or device_id >= self.device_count:
            return None
        
        try:
            # Try pynvml first for more accurate info
            if PYNVML_AVAILABLE and device_id < len(self._handles):
                handle = self._handles[device_id]
                mem_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
                
                return {
                    "total": mem_info.total,
                    "used": mem_info.used,
                    "free": mem_info.free,
                    "percent": (mem_info.used / mem_info.total * 100) if mem_info.total > 0 else 0,
                    "total_gb": mem_info.total / (1024**3),
                    "used_gb": mem_info.used / (1024**3),
                    "free_gb": mem_info.free / (1024**3)
                }
            
            # Fallback to torch
            if TORCH_AVAILABLE:
                with torch.cuda.device(device_id):
                    free_bytes, total_bytes = torch.cuda.mem_get_info(device_id)
                    used_bytes = total_bytes - free_bytes
                    
                    return {
                        "total": total_bytes,
                        "used": used_bytes,
                        "free": free_bytes,
                        "percent": (used_bytes / total_bytes * 100) if total_bytes > 0 else 0,
                        "total_gb": total_bytes / (1024**3),
                        "used_gb": used_bytes / (1024**3),
                        "free_gb": free_bytes / (1024**3)
                    }
        
        except Exception as e:
            logger.error(f"Error getting VRAM info for device {device_id}: {e}")
        
        return None
    
    def get_gpu_utilization(self, device_id: int = 0) -> Optional[float]:
        """
        Get GPU utilization percentage (0-100)
        Only available with pynvml
        """
        if not PYNVML_AVAILABLE or device_id >= len(self._handles):
            return None
        
        try:
            handle = self._handles[device_id]
            util = pynvml.nvmlDeviceGetUtilizationRates(handle)
            return float(util.gpu)
        except Exception as e:
            logger.error(f"Error getting GPU utilization for device {device_id}: {e}")
            return None
    
    def get_gpu_temperature(self, device_id: int = 0) -> Optional[float]:
        """
        Get GPU temperature in Celsius
        Only available with pynvml
        """
        if not PYNVML_AVAILABLE or device_id >= len(self._handles):
            return None
        
        try:
            handle = self._handles[device_id]
            temp = pynvml.nvmlDeviceGetTemperature(handle, pynvml.NVML_TEMPERATURE_GPU)
            return float(temp)
        except Exception as e:
            logger.error(f"Error getting GPU temperature for device {device_id}: {e}")
            return None
    
    def get_gpu_name(self, device_id: int = 0) -> Optional[str]:
        """Get GPU device name"""
        if not CUDA_AVAILABLE or device_id >= self.device_count:
            return None
        
        try:
            # Try pynvml first
            if PYNVML_AVAILABLE and device_id < len(self._handles):
                handle = self._handles[device_id]
                name = pynvml.nvmlDeviceGetName(handle)
                # Decode if bytes
                return name.decode('utf-8') if isinstance(name, bytes) else name
            
            # Fallback to torch
            if TORCH_AVAILABLE:
                return torch.cuda.get_device_name(device_id)
        
        except Exception as e:
            logger.error(f"Error getting GPU name for device {device_id}: {e}")
        
        return f"GPU {device_id}"
    
    def get_gpu_power_usage(self, device_id: int = 0) -> Optional[Dict[str, float]]:
        """
        Get GPU power usage in watts
        Only available with pynvml
        Returns dict with: current, limit (in watts)
        """
        if not PYNVML_AVAILABLE or device_id >= len(self._handles):
            return None
        
        try:
            handle = self._handles[device_id]
            power_mw = pynvml.nvmlDeviceGetPowerUsage(handle)  # milliwatts
            power_limit_mw = pynvml.nvmlDeviceGetPowerManagementLimit(handle)
            
            return {
                "current": power_mw / 1000.0,  # Convert to watts
                "limit": power_limit_mw / 1000.0,
                "percent": (power_mw / power_limit_mw * 100) if power_limit_mw > 0 else 0
            }
        except Exception as e:
            logger.debug(f"Error getting GPU power usage for device {device_id}: {e}")
            return None
    
    def get_device_info(self, device_id: int = 0) -> Dict[str, Any]:
        """
        Get all information for a specific GPU device
        """
        if not CUDA_AVAILABLE or device_id >= self.device_count:
            return {
                "available": False,
                "device_id": device_id
            }
        
        info = {
            "available": True,
            "device_id": device_id,
            "name": self.get_gpu_name(device_id),
            "vram": self.get_vram_info(device_id)
        }
        
        # Add pynvml-only metrics if available
        if PYNVML_AVAILABLE:
            info["utilization"] = self.get_gpu_utilization(device_id)
            info["temperature"] = self.get_gpu_temperature(device_id)
            info["power"] = self.get_gpu_power_usage(device_id)
        
        return info
    
    def get_all_devices_info(self) -> List[Dict[str, Any]]:
        """
        Get information for all GPU devices
        """
        return [self.get_device_info(i) for i in range(self.device_count)]
    
    def get_full_status(self) -> Dict[str, Any]:
        """
        Get complete GPU status for all devices
        """
        return {
            "available": CUDA_AVAILABLE,
            "torch_available": TORCH_AVAILABLE,
            "pynvml_available": PYNVML_AVAILABLE,
            "device_count": self.device_count,
            "devices": self.get_all_devices_info()
        }
    
    def clear_vram_cache(self, device_id: Optional[int] = None):
        """
        Clear VRAM cache for specified device (or all devices)
        """
        if not TORCH_AVAILABLE or not CUDA_AVAILABLE:
            logger.warning("Cannot clear VRAM - CUDA not available")
            return
        
        try:
            if device_id is not None and device_id < self.device_count:
                with torch.cuda.device(device_id):
                    torch.cuda.empty_cache()
                logger.info(f"Cleared VRAM cache for device {device_id}")
            else:
                # Clear all devices
                for i in range(self.device_count):
                    with torch.cuda.device(i):
                        torch.cuda.empty_cache()
                logger.info(f"Cleared VRAM cache for all {self.device_count} devices")
        
        except Exception as e:
            logger.error(f"Error clearing VRAM cache: {e}")
    
    def __del__(self):
        """Cleanup pynvml on destruction"""
        if PYNVML_AVAILABLE:
            try:
                pynvml.nvmlShutdown()
            except:
                pass
