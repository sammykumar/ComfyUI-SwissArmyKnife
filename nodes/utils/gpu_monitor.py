import threading
import time
import torch
import gc
import os

class GPUMonitor:
    """
    A background thread monitor that logs GPU memory usage at a specified interval.
    Useful for diagnosing intermittent OOM issues during long-running operations.
    """
    def __init__(self, interval: float = 1.0, log_path: str = None):
        self.interval = interval
        self.log_path = log_path
        self.stop_event = threading.Event()
        self.thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self.running = False

    def start(self):
        """Start the monitoring thread."""
        if not torch.cuda.is_available():
            print("GPUMonitor: CUDA not available, skipping monitoring.")
            return
        
        self.running = True
        self.thread.start()
        msg = f"GPUMonitor: Started monitoring every {self.interval}s"
        print(msg)
        if self.log_path:
            try:
                with open(self.log_path, "a") as f:
                    f.write(f"\n{msg}\n")
            except Exception as e:
                print(f"GPUMonitor: Failed to write to log file: {e}")

    def stop(self):
        """Stop the monitoring thread."""
        if self.running:
            self.stop_event.set()
            self.thread.join(timeout=2.0)
            self.running = False
            print("GPUMonitor: Stopped monitoring")

    def _monitor_loop(self):
        while not self.stop_event.is_set():
            try:
                # torch.cuda.mem_get_info() returns (free, total) in bytes
                free_bytes, total_bytes = torch.cuda.mem_get_info()
                free_gb = free_bytes / 1024**3
                total_gb = total_bytes / 1024**3
                used_gb = total_gb - free_gb
                
                allocated_bytes = torch.cuda.memory_allocated()
                reserved_bytes = torch.cuda.memory_reserved()
                max_allocated_bytes = torch.cuda.max_memory_allocated()
                
                allocated_gb = allocated_bytes / 1024**3
                reserved_gb = reserved_bytes / 1024**3
                max_allocated_gb = max_allocated_bytes / 1024**3

                msg = f"[GPU Monitor] Memory: {used_gb:.1f}GB used / {total_gb:.1f}GB total ({free_gb:.1f}GB free) | Alloc: {allocated_gb:.1f}GB | Rsrv: {reserved_gb:.1f}GB | Max: {max_allocated_gb:.1f}GB"
                print(msg)
                
                if self.log_path:
                    with open(self.log_path, "a") as f:
                        f.write(msg + "\n")
                        
            except Exception as e:
                print(f"[GPU Monitor] Error checking memory: {e}")
            
            time.sleep(self.interval)

def dump_gpu_models(log_path: str = None):
    """
    Scans for torch.nn.Module instances that have parameters on CUDA and logs them.
    Useful for identifying what models are consuming VRAM during an OOM.
    """
    print("!!! Dumping GPU Models !!!")
    
    if log_path:
        try:
            with open(log_path, "a") as f:
                f.write("\n!!! Dumping GPU Models !!!\n")
        except Exception:
            pass

    try:
        # Force garbage collection to clear out any loose references
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        for obj in gc.get_objects():
            try:
                if isinstance(obj, torch.nn.Module):
                    # Check if any parameter is on CUDA
                    is_on_cuda = False
                    for param in obj.parameters():
                        if param.device.type == 'cuda':
                            is_on_cuda = True
                            break
                    
                    if is_on_cuda:
                        # Try to estimate size
                        size_mb = 0
                        for param in obj.parameters():
                            if param.device.type == 'cuda':
                                size_mb += param.nelement() * param.element_size() / 1024 / 1024
                        
                        msg = f"  - Model on GPU: {type(obj).__name__} (~{size_mb:.1f} MB params)"
                        print(msg)
                        if log_path:
                            with open(log_path, "a") as f:
                                f.write(msg + "\n")
            except Exception:
                # Some objects might be weakrefs or have issues during iteration
                continue
                
    except Exception as e:
        print(f"Error dumping GPU models: {e}")
