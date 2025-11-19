import threading
import time
import torch

class GPUMonitor:
    """
    A background thread monitor that logs GPU memory usage at a specified interval.
    Useful for diagnosing intermittent OOM issues during long-running operations.
    """
    def __init__(self, interval: float = 1.0):
        self.interval = interval
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
        print(f"GPUMonitor: Started monitoring every {self.interval}s")

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
                free_mb = free_bytes / 1024 / 1024
                total_mb = total_bytes / 1024 / 1024
                used_mb = total_mb - free_mb
                
                print(f"[GPU Monitor] Memory: {used_mb:.0f}MB used / {total_mb:.0f}MB total ({free_mb:.0f}MB free)")
            except Exception as e:
                print(f"[GPU Monitor] Error checking memory: {e}")
            
            time.sleep(self.interval)
