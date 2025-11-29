"""
Profiler Core - Workflow and Node Performance Tracking
Tracks execution time, VRAM/RAM usage, cache hits, and tensor shapes
"""
import json
import logging
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)


class NodeProfile:
    """Profile data for a single node execution"""

    def __init__(self, node_id: str, node_type: str):
        self.node_id = node_id
        self.node_type = node_type
        self.start_time: Optional[float] = None
        self.end_time: Optional[float] = None
        self.vram_before: Optional[int] = None
        self.vram_after: Optional[int] = None
        self.vram_peak: Optional[int] = None
        self.ram_before: Optional[int] = None
        self.ram_after: Optional[int] = None
        self.input_sizes: Dict[str, List[int]] = {}
        self.output_sizes: Dict[str, List[int]] = {}
        self.cache_hit: bool = False
        self.error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            'nodeId': self.node_id,
            'nodeType': self.node_type,
            'startTime': self.start_time,
            'endTime': self.end_time,
            'executionTime': (self.end_time - self.start_time) * 1000 if self.start_time and self.end_time else None,  # ms
            'vramBefore': self.vram_before,
            'vramAfter': self.vram_after,
            'vramPeak': self.vram_peak,
            'vramDelta': (self.vram_after - self.vram_before) if self.vram_before is not None and self.vram_after is not None else None,
            'ramBefore': self.ram_before,
            'ramAfter': self.ram_after,
            'ramDelta': (self.ram_after - self.ram_before) if self.ram_before is not None and self.ram_after is not None else None,
            'inputSizes': self.input_sizes,
            'outputSizes': self.output_sizes,
            'cacheHit': self.cache_hit,
            'error': self.error
        }


class WorkflowProfile:
    """Profile data for an entire workflow execution"""

    def __init__(self, prompt_id: str):
        self.prompt_id = prompt_id
        self.start_time: Optional[float] = None
        self.end_time: Optional[float] = None
        self.nodes: Dict[str, NodeProfile] = {}
        self.execution_order: List[str] = []
        self.cache_hits = 0
        self.cache_misses = 0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        execution_time = (self.end_time - self.start_time) * 1000 if self.start_time and self.end_time else None

        # Calculate peaks
        vram_peak = 0
        ram_peak = 0
        for node in self.nodes.values():
            if node.vram_peak:
                vram_peak = max(vram_peak, node.vram_peak)
            if node.ram_after:
                ram_peak = max(ram_peak, node.ram_after)

        return {
            'promptId': self.prompt_id,
            'startTime': self.start_time,
            'endTime': self.end_time,
            'executionTime': execution_time,
            'nodes': {node_id: node.to_dict() for node_id, node in self.nodes.items()},
            'executionOrder': self.execution_order,
            'cacheHits': self.cache_hits,
            'cacheMisses': self.cache_misses,
            'totalVramPeak': vram_peak,
            'totalRamPeak': ram_peak,
            'nodesExecuted': len([n for n in self.nodes.values() if not n.cache_hit])
        }


class ProfilerManager:
    """Singleton manager for workflow profiling"""

    _instance: Optional['ProfilerManager'] = None
    _initialized = False

    def __init__(self):
        if ProfilerManager._initialized:
            return

        ProfilerManager._initialized = True

        # Active profiles
        self.active_profiles: Dict[str, WorkflowProfile] = {}

        # History
        self.history: List[Dict[str, Any]] = []
        self.max_history = 10000

        # Rolling averages
        self.node_averages: Dict[str, Dict[str, Any]] = {}
        self.workflow_averages: Dict[str, Any] = {
            'total_time': 0.0,
            'count': 0,
            'vram_peak': 0.0,
            'ram_peak': 0.0
        }

        # Persistence
        self.history_file = Path("cache/profiler_history.json")
        self.archive_dir = Path("cache/profiler_archives")
        self._save_counter = 0
        self._save_batch_size = 5
        self._save_executor = ThreadPoolExecutor(max_workers=1)

        # Ensure directories exist
        self.history_file.parent.mkdir(parents=True, exist_ok=True)
        self.archive_dir.mkdir(parents=True, exist_ok=True)

        # Load existing history
        self._load_history()

        # Check dependencies
        self._check_dependencies()

        logger.info("ProfilerManager initialized")

    @classmethod
    def get_instance(cls) -> 'ProfilerManager':
        """Get singleton instance"""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _check_dependencies(self):
        """Check for optional dependencies and log capabilities"""
        self.torch_available = False
        self.cuda_available = False
        self.psutil_available = False

        try:
            import torch
            self.torch_available = True  # Torch is installed
            self.cuda_available = torch.cuda.is_available()  # CUDA hardware present
            logger.info(f"Torch installed: {self.torch_available}, CUDA available: {self.cuda_available}")

            if not self.cuda_available:
                logger.warning("CUDA not available - VRAM tracking will be disabled (CPU-only mode)")
        except ImportError:
            logger.warning("Torch not available - VRAM tracking disabled")

        try:
            import psutil
            # Verify psutil is functional by attempting to access process info
            _ = psutil.Process()
            self.psutil_available = True
            logger.info("psutil available")
        except ImportError:
            logger.warning("psutil not available - RAM tracking disabled")

    def start_workflow(self, prompt_id: str):
        """Start profiling a workflow"""
        profile = WorkflowProfile(prompt_id)
        profile.start_time = time.time()
        self.active_profiles[prompt_id] = profile
        print(f"[SwissArmyKnife][Profiler] Started workflow profiling: {prompt_id}")
        logger.debug(f"Started workflow profiling: {prompt_id}")

    def end_workflow(self, prompt_id: str):
        """End profiling a workflow"""
        if prompt_id not in self.active_profiles:
            logger.warning(f"Workflow {prompt_id} not found in active profiles")
            return

        profile = self.active_profiles[prompt_id]
        profile.end_time = time.time()
        print(f"[SwissArmyKnife][Profiler] Ended workflow profiling: {prompt_id}, duration: {profile.end_time - profile.start_time:.2f}s")

        # Add to history
        workflow_dict = profile.to_dict()
        self.history.append(workflow_dict)

        # Update averages
        self._update_averages(workflow_dict)

        # Remove from active
        del self.active_profiles[prompt_id]

        # Check history limit and archive if needed
        if len(self.history) >= self.max_history:
            self._auto_archive()

        # Batched save
        self._save_history()

        logger.debug(f"Ended workflow profiling: {prompt_id}")

    def start_node(self, prompt_id: str, node_id: str, node_type: str, inputs: Any = None):
        """Start profiling a node execution"""
        if prompt_id not in self.active_profiles:
            logger.warning(f"Workflow {prompt_id} not found, creating it")
            self.start_workflow(prompt_id)

        profile = self.active_profiles[prompt_id]
        node_profile = NodeProfile(node_id, node_type)
        node_profile.start_time = time.time()

        # Track VRAM
        if self.torch_available and self.cuda_available:
            try:
                import torch
                torch.cuda.reset_peak_memory_stats()
                node_profile.vram_before = torch.cuda.memory_allocated()
            except Exception as e:
                logger.warning(f"⚠️  VRAM tracking failed at start of node {node_type}: {e}")

        # Track RAM
        if self.psutil_available:
            try:
                import psutil
                node_profile.ram_before = psutil.Process().memory_info().rss
            except Exception as e:
                logger.debug(f"RAM tracking error: {e}")

        # Track input shapes
        if inputs:
            node_profile.input_sizes = self._get_tensor_sizes(inputs)

        profile.nodes[node_id] = node_profile
        profile.execution_order.append(node_id)

    def end_node(self, prompt_id: str, node_id: str, outputs: Any = None, cache_hit: bool = False):
        """End profiling a node execution"""
        if prompt_id not in self.active_profiles:
            logger.warning(f"Workflow {prompt_id} not found")
            return

        profile = self.active_profiles[prompt_id]
        if node_id not in profile.nodes:
            logger.warning(f"Node {node_id} not found in workflow {prompt_id}")
            return

        node_profile = profile.nodes[node_id]
        node_profile.end_time = time.time()
        node_profile.cache_hit = cache_hit

        execution_time_ms = (node_profile.end_time - node_profile.start_time) * 1000
        print(f"[SwissArmyKnife][Profiler] Node {node_profile.node_type} (ID: {node_id}) took {execution_time_ms:.2f}ms")

        # Update cache stats
        if cache_hit:
            profile.cache_hits += 1
        else:
            profile.cache_misses += 1

        # Track VRAM
        if self.torch_available and self.cuda_available:
            try:
                import torch
                node_profile.vram_after = torch.cuda.memory_allocated()
                node_profile.vram_peak = torch.cuda.max_memory_allocated()
                vram_delta = node_profile.vram_after - (node_profile.vram_before or 0)
                print(f"[SwissArmyKnife][Profiler] Node {node_profile.node_type} VRAM: before={node_profile.vram_before}, after={node_profile.vram_after}, peak={node_profile.vram_peak}, delta={vram_delta}")
            except Exception as e:
                logger.warning(f"⚠️  VRAM tracking failed for node {node_profile.node_type}: {e}")
                print(f"[SwissArmyKnife][Profiler] ⚠️  VRAM tracking error: {e}")

        # Track RAM
        if self.psutil_available:
            try:
                import psutil
                node_profile.ram_after = psutil.Process().memory_info().rss
            except Exception as e:
                logger.debug(f"RAM tracking error: {e}")

        # Track output shapes
        if outputs:
            node_profile.output_sizes = self._get_tensor_sizes(outputs)

    def _get_tensor_sizes(self, data: Any) -> Dict[str, List[int]]:
        """Extract tensor shapes from data"""
        sizes = {}

        if not self.torch_available:
            return sizes

        try:
            import torch

            if isinstance(data, torch.Tensor):
                sizes['tensor'] = list(data.shape)
            elif isinstance(data, dict):
                for key, value in data.items():
                    if isinstance(value, torch.Tensor):
                        sizes[key] = list(value.shape)
            elif isinstance(data, (list, tuple)):
                for i, value in enumerate(data):
                    if isinstance(value, torch.Tensor):
                        sizes[f'item_{i}'] = list(value.shape)
        except Exception as e:
            logger.debug(f"Tensor size extraction error: {e}")

        return sizes

    def _update_averages(self, workflow_dict: Dict[str, Any]):
        """Update rolling averages"""
        # Workflow averages
        if workflow_dict['executionTime']:
            self.workflow_averages['count'] += 1
            self.workflow_averages['total_time'] += workflow_dict['executionTime']
            self.workflow_averages['vram_peak'] += workflow_dict['totalVramPeak']
            self.workflow_averages['ram_peak'] += workflow_dict['totalRamPeak']

        # Node averages
        for node_dict in workflow_dict['nodes'].values():
            node_type = node_dict['nodeType']

            if node_type not in self.node_averages:
                self.node_averages[node_type] = {
                    'total_time': 0.0,
                    'count': 0,
                    'vram_usage': 0.0,
                    'ram_usage': 0.0,
                    'cache_hits': 0
                }

            avg = self.node_averages[node_type]
            avg['count'] += 1

            if node_dict['executionTime']:
                avg['total_time'] += node_dict['executionTime']

            if node_dict['vramDelta']:
                avg['vram_usage'] += node_dict['vramDelta']

            if node_dict['ramDelta']:
                avg['ram_usage'] += node_dict['ramDelta']

            if node_dict['cacheHit']:
                avg['cache_hits'] += 1

    def get_stats(self) -> Dict[str, Any]:
        """Get current profiler statistics"""
        # Calculate averages
        node_averages_computed = {}
        for node_type, avg in self.node_averages.items():
            count = avg['count']
            if count > 0:
                node_averages_computed[node_type] = {
                    'avg_time': avg['total_time'] / count,
                    'avg_vram': avg['vram_usage'] / count,
                    'avg_ram': avg['ram_usage'] / count,
                    'count': count,
                    'cache_hits': avg['cache_hits'],
                    'cache_hit_rate': (avg['cache_hits'] / count) * 100
                }

        workflow_avg_computed = {}
        if self.workflow_averages['count'] > 0:
            count = self.workflow_averages['count']
            workflow_avg_computed = {
                'avg_time': self.workflow_averages['total_time'] / count,
                'avg_vram_peak': self.workflow_averages['vram_peak'] / count,
                'avg_ram_peak': self.workflow_averages['ram_peak'] / count,
                'count': count
            }

        return {
            'latest': self.history[-1] if self.history else None,
            'history': self.history[-100:],  # Last 100 workflows
            'node_averages': node_averages_computed,
            'workflow_averages': workflow_avg_computed
        }

    def _load_history(self):
        """Load history from disk"""
        try:
            if self.history_file.exists():
                with open(self.history_file, 'r') as f:
                    data = json.load(f)
                    self.history = data.get('history', [])
                    self.node_averages = data.get('node_averages', {})
                    self.workflow_averages = data.get('workflow_averages', {
                        'total_time': 0.0,
                        'count': 0,
                        'vram_peak': 0.0,
                        'ram_peak': 0.0
                    })
                logger.info(f"Loaded {len(self.history)} workflow profiles from history")
        except Exception as e:
            logger.error(f"Failed to load history: {e}")
            self.history = []

    def _save_history(self, force: bool = False):
        """Save history to disk (batched)"""
        self._save_counter += 1

        if not force and self._save_counter < self._save_batch_size:
            return

        self._save_counter = 0
        self._save_executor.submit(self._async_save_history)

    def _async_save_history(self):
        """Async save to disk"""
        try:
            data = {
                'history': self.history,
                'node_averages': self.node_averages,
                'workflow_averages': self.workflow_averages
            }

            with open(self.history_file, 'w') as f:
                json.dump(data, f, indent=2)

            logger.debug(f"Saved {len(self.history)} workflow profiles to history")
        except Exception as e:
            logger.error(f"Failed to save history: {e}")

    def _auto_archive(self):
        """Auto-archive when history limit reached"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        archive_file = self.archive_dir / f"profiler_archive_{timestamp}.json"

        try:
            data = {
                'history': self.history,
                'node_averages': self.node_averages,
                'workflow_averages': self.workflow_averages,
                'archived_at': timestamp
            }

            with open(archive_file, 'w') as f:
                json.dump(data, f, indent=2)

            logger.info(f"Auto-archived {len(self.history)} profiles to {archive_file.name}")

            # Clear current history
            self.history = []
            self.node_averages = {}
            self.workflow_averages = {
                'total_time': 0.0,
                'count': 0,
                'vram_peak': 0.0,
                'ram_peak': 0.0
            }

        except Exception as e:
            logger.error(f"Failed to auto-archive: {e}")

    def create_archive(self) -> str:
        """Manually create an archive"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        archive_file = self.archive_dir / f"profiler_archive_{timestamp}.json"

        data = {
            'history': self.history,
            'node_averages': self.node_averages,
            'workflow_averages': self.workflow_averages,
            'archived_at': timestamp
        }

        with open(archive_file, 'w') as f:
            json.dump(data, f, indent=2)

        return archive_file.name

    def list_archives(self) -> List[Dict[str, Any]]:
        """List all archive files"""
        archives = []

        for archive_file in self.archive_dir.glob("profiler_archive_*.json"):
            try:
                stat = archive_file.stat()
                archives.append({
                    'filename': archive_file.name,
                    'created': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    'size': stat.st_size
                })
            except Exception as e:
                logger.error(f"Failed to read archive {archive_file.name}: {e}")

        return sorted(archives, key=lambda x: x['created'], reverse=True)

    def load_archive(self, filename: str):
        """Load an archive file"""
        archive_file = self.archive_dir / filename

        if not archive_file.exists():
            raise FileNotFoundError(f"Archive {filename} not found")

        with open(archive_file, 'r') as f:
            data = json.load(f)
            self.history = data.get('history', [])
            self.node_averages = data.get('node_averages', {})
            self.workflow_averages = data.get('workflow_averages', {})

        logger.info(f"Loaded archive {filename}")

    def delete_archive(self, filename: str):
        """Delete an archive file"""
        archive_file = self.archive_dir / filename

        if not archive_file.exists():
            raise FileNotFoundError(f"Archive {filename} not found")

        archive_file.unlink()
        logger.info(f"Deleted archive {filename}")
