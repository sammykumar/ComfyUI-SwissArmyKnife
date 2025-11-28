#!/usr/bin/env python3
"""
Test script for resource monitor backend
Run this to verify hardware monitoring is working
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nodes.utils.resource_monitor import HardwareInfo, GPUInfo, MonitorService
import json


def test_hardware_info():
    """Test hardware information collection"""
    print("\n=== Testing Hardware Info ===")
    hw = HardwareInfo()
    status = hw.get_full_status()
    print(json.dumps(status, indent=2, default=str))


def test_gpu_info():
    """Test GPU information collection"""
    print("\n=== Testing GPU Info ===")
    gpu = GPUInfo()
    status = gpu.get_full_status()
    print(json.dumps(status, indent=2, default=str))


def test_monitor_service():
    """Test monitor service (without actual server)"""
    print("\n=== Testing Monitor Service ===")
    
    # Create service without server (for testing only)
    service = MonitorService(server=None, interval=2.0)
    
    # Get current status
    status = service.get_current_status()
    print(json.dumps(status, indent=2, default=str))
    
    print("\n=== Test GPU Device 0 ===")
    device_info = service.get_gpu_device_info(0)
    print(json.dumps(device_info, indent=2, default=str))


if __name__ == "__main__":
    try:
        test_hardware_info()
        test_gpu_info()
        test_monitor_service()
        print("\n✅ All tests completed successfully!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
