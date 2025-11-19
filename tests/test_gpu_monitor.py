import time
import threading
from unittest.mock import patch, MagicMock
import sys
import os

# Add the project root to the path so we can import the module
sys.path.append(os.path.abspath("/Users/samkumar/Development/dev-lab-hq/ai-image-hub/apps/comfyui-swiss-army-knife"))

from nodes.utils.gpu_monitor import GPUMonitor

def test_gpu_monitor():
    with open("verify_output.txt", "w") as f:
        f.write("Testing GPUMonitor...\n")
    
    # Mock torch.cuda
    with patch('torch.cuda') as mock_cuda:
        mock_cuda.is_available.return_value = True
        # Return (free, total) in bytes. Let's say 8GB total, 4GB free.
        mock_cuda.mem_get_info.return_value = (4 * 1024**3, 8 * 1024**3)
        
        # Redirect stdout to file to capture monitor output
        original_stdout = sys.stdout
        with open("verify_output.txt", "a") as f:
            sys.stdout = f
            
            monitor = GPUMonitor(interval=0.1)
            monitor.start()
            
            print("Monitor started. Waiting for logs...")
            time.sleep(0.5)
            
            monitor.stop()
            print("Monitor stopped.")
            
            sys.stdout = original_stdout

if __name__ == "__main__":
    test_gpu_monitor()
