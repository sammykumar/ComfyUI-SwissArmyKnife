import time
import threading
from unittest.mock import patch, MagicMock
import sys
import os

# Add the project root to the path so we can import the module
sys.path.append(os.path.abspath("/Users/samkumar/Development/dev-lab-hq/ai-image-hub/apps/comfyui-swiss-army-knife"))

from nodes.utils.gpu_monitor import GPUMonitor

def test_gpu_monitor():
    log_file = "test_gpu_monitor.log"
    if os.path.exists(log_file):
        os.remove(log_file)
        
    print(f"Testing GPUMonitor with log file: {log_file}")
    
    # Mock torch.cuda
    with patch('torch.cuda') as mock_cuda:
        mock_cuda.is_available.return_value = True
        # Return (free, total) in bytes. Let's say 8GB total, 4GB free.
        mock_cuda.mem_get_info.return_value = (4 * 1024**3, 8 * 1024**3)
        mock_cuda.memory_allocated.return_value = 2 * 1024**3
        mock_cuda.memory_reserved.return_value = 3 * 1024**3
        mock_cuda.max_memory_allocated.return_value = 3.5 * 1024**3
        
        # Redirect stdout to file to capture monitor output
        original_stdout = sys.stdout
        with open("verify_output.txt", "w") as f:
            sys.stdout = f
            
            monitor = GPUMonitor(interval=0.1, log_path=log_file)
            monitor.start()
            
            print("Monitor started. Waiting for logs...")
            time.sleep(0.5)
            
            monitor.stop()
            print("Monitor stopped.")
            
            sys.stdout = original_stdout

    # Verify log file content
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            content = f.read()
            if "GPUMonitor: Started monitoring" in content and "[GPU Monitor] Memory:" in content:
                print("✅ Log file created and contains expected content.")
            else:
                print("❌ Log file created but missing expected content.")
                print(f"Content:\n{content}")
        os.remove(log_file)
    else:
        print("❌ Log file was not created.")

if __name__ == "__main__":
    test_gpu_monitor()
