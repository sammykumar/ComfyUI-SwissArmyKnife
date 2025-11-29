"""
Profiler Core - Workflow and Node Performance Tracking
Tracks execution time, VRAM/RAM usage, cache hits, and tensor shapes
"""
import gc
import json
import logging
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

# Import safetensors for metadata extraction (optional)
try:
    from safetensors import safe_open
    SAFETENSORS_AVAILABLE = True
except ImportError:
    SAFETENSORS_AVAILABLE = False
    logger.warning("safetensors library not available - model metadata extraction will be limited")


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
        self.raw_inputs: Optional[Any] = None  # Store raw inputs for model tracking
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

        # Loaded models tracking (per GPU) - using direct GPU memory scanning
        self.loaded_models: Dict[int, List[Dict[str, Any]]] = {}  # gpu_id -> list of model info
        self._model_scan_cache_timestamp: Optional[float] = None
        self._model_scan_cache_ttl: float = 1.0  # Cache scan results for 1 second

        # Track pending model loads with metadata (filename, timestamp, metadata)
        self._pending_model_loads: List[Dict[str, Any]] = []
        self._pending_loads_max_age: float = 5.0  # Keep pending loads for 5 seconds

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

        # Track input shapes and store raw inputs
        if inputs:
            node_profile.input_sizes = self._get_tensor_sizes(inputs)
            node_profile.raw_inputs = inputs  # Store for model tracking

            # Capture model filenames and extract metadata for correlation
            self._capture_model_metadata(inputs, node_type)

        profile.nodes[node_id] = node_profile
        profile.execution_order.append(node_id)

    def _scan_gpu_models(self) -> Dict[int, List[Dict[str, Any]]]:
        """Scan GPU memory for loaded models with parent/child grouping and metadata

        Enhanced approach:
        1. Collect all CUDA modules and build parent/child hierarchy
        2. Identify top-level parent models (not children of others)
        3. Calculate total VRAM including all child layers
        4. Match to safetensors metadata from pending loads
        5. Return grouped models with user-friendly names
        """
        result: Dict[int, List[Dict[str, Any]]] = {}

        if not self.torch_available or not self.cuda_available:
            return result

        try:
            import torch

            # Force garbage collection to get current state
            gc.collect()

            # Clean up old pending loads (>5 seconds)
            current_time = time.time()
            self._pending_model_loads = [
                load for load in self._pending_model_loads
                if current_time - load.get('timestamp', 0) < self._pending_loads_max_age
            ]

            # PHASE 1: Collect all CUDA modules with parent/child relationships
            all_cuda_modules = {}  # module_id -> module_data
            parent_child_map = {}  # child_id -> parent_id
            
            print(f"[SwissArmyKnife][Profiler] 🔍 Starting GPU scan...")

            for obj in gc.get_objects():
                try:
                    if not isinstance(obj, torch.nn.Module):
                        continue

                    # Check if module has CUDA parameters
                    # CRITICAL: Track unique params to avoid double-counting
                    has_cuda_params = False
                    gpu_id = 0
                    size_bytes_total = 0  # Total size with unique params
                    param_count = 0
                    unique_params = set()  # Track unique param IDs for this module

                    for param in obj.parameters(recurse=True):  # Get ALL params including children
                        if param.device.type == 'cuda':
                            param_id = id(param)
                            # Only count each unique parameter once
                            if param_id not in unique_params:
                                has_cuda_params = True
                                gpu_id = param.device.index if param.device.index is not None else 0
                                size_bytes_total += param.nelement() * param.element_size()
                                param_count += 1
                                unique_params.add(param_id)

                    if not has_cuda_params:
                        continue

                    module_id = id(obj)
                    model_class = type(obj).__name__

                    # Store module data
                    all_cuda_modules[module_id] = {
                        'module': obj,
                        'class_name': model_class,
                        'gpu_id': gpu_id,
                        'size_bytes_total': size_bytes_total,  # Total size including descendants
                        'param_count': param_count,
                        'children': []
                    }

                    # Build parent-child relationships
                    for child_name, child_module in obj.named_children():
                        if isinstance(child_module, torch.nn.Module):
                            child_id = id(child_module)
                            parent_child_map[child_id] = module_id
                            all_cuda_modules[module_id]['children'].append(child_id)

                except (AttributeError, RuntimeError, ReferenceError):
                    continue

            # PHASE 2: Identify top-level parents (not children of others)
            top_level_parents = set(all_cuda_modules.keys()) - set(parent_child_map.keys())

            print(f"[SwissArmyKnife][Profiler] 🔍 Found {len(all_cuda_modules)} CUDA modules, {len(top_level_parents)} top-level parents")
            
            # Debug: Show parent class breakdown
            parent_summary = {}
            for parent_id in top_level_parents:
                class_name = all_cuda_modules[parent_id]['class_name']
                size_gb = all_cuda_modules[parent_id]['size_bytes_total'] / (1024**3)
                if class_name not in parent_summary:
                    parent_summary[class_name] = {'count': 0, 'total_gb': 0.0}
                parent_summary[class_name]['count'] += 1
                parent_summary[class_name]['total_gb'] += size_gb
            
            print(f"[SwissArmyKnife][Profiler] 📊 Parent class summary:")
            for class_name, stats in sorted(parent_summary.items(), key=lambda x: x[1]['total_gb'], reverse=True):
                print(f"[SwissArmyKnife][Profiler]   - {stats['count']}× {class_name}: {stats['total_gb']:.2f} GB total")

            # PHASE 3: Process significant parent models only (filter out small utility modules)
            MIN_SIZE_MB = 100  # Only report models > 100MB
            
            for parent_id in top_level_parents:
                if parent_id not in all_cuda_modules:
                    continue

                parent_data = all_cuda_modules[parent_id]
                module = parent_data['module']
                model_class = parent_data['class_name']
                gpu_id = parent_data['gpu_id']

                # Use the total size already calculated (includes all descendants with unique params)
                total_size_bytes = parent_data['size_bytes_total']
                size_mb = total_size_bytes / (1024 * 1024)
                size_gb = size_mb / 1024
                
                # Debug logging for WanModel to understand VRAM distribution
                if 'Wan' in model_class or size_gb > 1.0:
                    print(f"[SwissArmyKnife][Profiler] 🔍 {model_class}: {size_gb:.2f} GB ({parent_data['param_count']} params)")
                
                # Skip small utility modules (CustomLinear < 100MB are individual layers)
                if size_mb < MIN_SIZE_MB:
                    continue

                total_param_count = parent_data['param_count']
                
                # Count layers by traversing children
                layer_count = 1  # Start with self
                stack = list(parent_data['children'])
                visited = set()

                while stack:
                    current_id = stack.pop()
                    if current_id in visited or current_id not in all_cuda_modules:
                        continue
                    visited.add(current_id)
                    layer_count += 1
                    
                    # Add children to stack
                    if current_id in all_cuda_modules:
                        stack.extend(all_cuda_modules[current_id]['children'])

                # PHASE 4: Extract model name from metadata or attributes
                model_name = self._extract_model_name(module, model_class)

                # Try to match with safetensors metadata
                metadata = self._match_pending_metadata(size_mb, model_class)
                if metadata:
                    # Use metadata model_type if available (e.g., "Wan2_2-T2V-A14B-HIGH")
                    if 'model_type' in metadata:
                        model_name = metadata['model_type']
                        print(f"[SwissArmyKnife][Profiler] ✅ Found metadata model_type: {model_name}")
                    # If no model_type but has filename, extract from filename
                    elif 'filename' in metadata:
                        filename_stem = Path(metadata['filename']).stem
                        # Remove common suffixes to get clean model name
                        for suffix in ['_fp8_e5m2', '_fp8_e4m3fn', '_fp16', '_bf16', '_scaled', '_KJ']:
                            filename_stem = filename_stem.replace(suffix, '')
                        model_name = filename_stem
                        print(f"[SwissArmyKnife][Profiler] 📄 Using filename: {model_name}")

                # Format display name with details
                if size_gb >= 1.0:
                    size_str = f"{size_gb:.1f} GB"
                else:
                    size_str = f"{int(size_mb)} MB"

                display_name = f"{model_name} ({self._classify_model_type(model_class)}, {size_str}, {layer_count} layers)"
                print(f"[SwissArmyKnife][Profiler]   📦 Displaying: {display_name}")

                model_info = {
                    'type': self._classify_model_type(model_class),
                    'name': display_name,  # Use full display_name for tooltip
                    'display_name': display_name,
                    'base_name': model_name,  # Store clean name separately
                    'vram_mb': int(size_mb),
                    'layer_count': layer_count,
                    'param_count': total_param_count,
                    'loaded_at': datetime.now().isoformat(),
                    'class_name': model_class,
                    'metadata': metadata or {}
                }

                # Initialize GPU list if needed
                if gpu_id not in result:
                    result[gpu_id] = []

                result[gpu_id].append(model_info)

            # PHASE 5: Sort by VRAM usage (descending) and limit to top 10 per GPU
            for gpu_id in result:
                result[gpu_id].sort(key=lambda x: x['vram_mb'], reverse=True)
                result[gpu_id] = result[gpu_id][:10]  # Limit to top 10 models

            model_count = sum(len(models) for models in result.values())
            print(f"[SwissArmyKnife][Profiler] ✅ Grouped into {model_count} parent models across {len(result)} GPU(s)")

            # Log model details
            for gpu_id, models in result.items():
                print(f"[SwissArmyKnife][Profiler] GPU {gpu_id}: {len(models)} models")
                for model in models:
                    print(f"[SwissArmyKnife][Profiler]   - {model['display_name']}")

        except Exception as e:
            logger.warning(f"Failed to scan GPU models: {e}")
            print(f"[SwissArmyKnife][Profiler] ⚠️  GPU scan error: {e}")
            import traceback
            traceback.print_exc()

        return result

    def _capture_model_metadata(self, inputs: Dict[str, Any], node_type: str) -> None:
        """Capture model filenames and extract safetensors metadata during node execution"""
        try:
            current_time = time.time()

            # Look for common input keys that contain file paths
            path_keys = ['model', 'checkpoint', 'ckpt_name', 'model_path', 'checkpoint_path', 
                        'lora_name', 'vae', 'file', 'path', 'filename']

            for key in path_keys:
                if key in inputs:
                    value = inputs[key]

                    # Handle various input formats
                    if isinstance(value, str):
                        filepath = value
                    elif isinstance(value, tuple) and len(value) > 0:
                        filepath = value[0]
                    elif hasattr(value, 'filename'):
                        filepath = value.filename
                    else:
                        continue

                    # Check if it's a safetensors file
                    if not isinstance(filepath, str) or not filepath.endswith('.safetensors'):
                        continue

                    # Extract metadata if available
                    metadata = self._read_safetensors_metadata(filepath)

                    pending_load = {
                        'filename': filepath,
                        'timestamp': current_time,
                        'node_type': node_type,
                        'metadata': metadata
                    }

                    self._pending_model_loads.append(pending_load)
                    print(f"[SwissArmyKnife][Profiler] 📄 Captured model: {Path(filepath).name} (metadata: {bool(metadata)})")

        except Exception as e:
            logger.debug(f"Failed to capture model metadata: {e}")

    def _read_safetensors_metadata(self, filepath: str) -> Optional[Dict[str, Any]]:
        """Read metadata from safetensors file"""
        if not SAFETENSORS_AVAILABLE:
            return None

        try:
            # Try to resolve full path if relative
            full_path = Path(filepath)
            if not full_path.is_absolute():
                # Try common ComfyUI model directories
                possible_dirs = [
                    Path('/workspace/ComfyUI/models/checkpoints'),
                    Path('/workspace/ComfyUI/models/loras'),
                    Path('/workspace/ComfyUI/models/vae'),
                    Path('/workspace/ComfyUI/models/unet'),
                    Path('models/checkpoints'),
                    Path('models/loras'),
                    Path('models/vae'),
                    Path('models/unet'),
                ]

                for base_dir in possible_dirs:
                    candidate = base_dir / filepath
                    if candidate.exists():
                        full_path = candidate
                        break

            if not full_path.exists():
                return None

            with safe_open(str(full_path), framework="pt", device="cpu") as f:
                metadata = f.metadata()
                return metadata if metadata else {}

        except Exception as e:
            logger.debug(f"Failed to read safetensors metadata from {filepath}: {e}")
            return None

    def _extract_model_name(self, module, default_name: str) -> str:
        """Extract user-friendly model name from module attributes"""
        # Try common attribute patterns
        for attr in ['name', 'model_name', '_name', 'model_type', '__name__']:
            if hasattr(module, attr):
                value = getattr(module, attr)
                if isinstance(value, str) and value and value != default_name:
                    return value

        # Try to get from config
        if hasattr(module, 'config'):
            config = module.config
            if hasattr(config, '_name_or_path'):
                return str(config._name_or_path)
            if hasattr(config, 'name'):
                return str(config.name)

        # Try metadata from safetensors
        if hasattr(module, '__metadata__'):
            metadata = module.__metadata__
            if isinstance(metadata, dict) and 'model_type' in metadata:
                return metadata['model_type']

        return default_name

    def _match_pending_metadata(self, size_mb: float, class_name: str) -> Optional[Dict[str, Any]]:
        """Match loaded model to pending metadata by size and timing"""
        if not self._pending_model_loads:
            return None

        # Sort by timestamp (most recent first)
        sorted_loads = sorted(self._pending_model_loads, key=lambda x: x['timestamp'], reverse=True)

        # Simple heuristic: return most recent load with matching class name pattern
        for load in sorted_loads:
            metadata = load.get('metadata', {})
            if metadata and 'model_type' in metadata:
                # Found a load with metadata - use it
                load['matched'] = True
                return {
                    'filename': load['filename'],
                    'model_type': metadata.get('model_type'),
                    'metadata': metadata
                }

        # Fallback: return most recent load even without metadata
        if sorted_loads:
            return {'filename': sorted_loads[0]['filename']}

        return None

    def _classify_model_type(self, class_name: str) -> str:
        """Classify model type from class name"""
        class_lower = class_name.lower()

        if any(x in class_lower for x in ['checkpoint', 'unet', 'diffusion', 'dit', 'transformer2d', 'wanvideo', 'wan2']):
            return 'checkpoint'
        elif 'lora' in class_lower:
            return 'lora'
        elif 'vae' in class_lower or 'autoencoder' in class_lower:
            return 'vae'
        elif any(x in class_lower for x in ['clip', 't5', 'textencoder', 'frozenclipt5']):
            return 'clip'
        elif 'controlnet' in class_lower:
            return 'controlnet'
        elif any(x in class_lower for x in ['upscale', 'esrgan']):
            return 'upscaler'
        elif 'depth' in class_lower:
            return 'depth'
        else:
            return 'model'

    def get_loaded_models(self) -> Dict[int, Dict[str, Any]]:
        """Get currently loaded models by GPU using direct memory scanning"""
        # Check cache to avoid expensive scans on every request
        now = time.time()
        if (self._model_scan_cache_timestamp is None or 
            now - self._model_scan_cache_timestamp > self._model_scan_cache_ttl):
            # Refresh cache with actual GPU memory scan
            self.loaded_models = self._scan_gpu_models()
            self._model_scan_cache_timestamp = now

        result = {}
        for gpu_id, models in self.loaded_models.items():
            total_vram = sum(m['vram_mb'] for m in models)
            result[gpu_id] = {
                'models': models,
                'total_vram_mb': total_vram,
                'model_count': len(models),
                'last_activity': models[-1]['loaded_at'] if models else None
            }

        return result

    def clear_loaded_models(self, gpu_id: Optional[int] = None):
        """Clear loaded models tracking"""
        if gpu_id is not None:
            self.loaded_models[gpu_id] = []
        else:
            self.loaded_models.clear()
        # Reset cache timestamp to force rescan
        self._model_scan_cache_timestamp = None

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
        vram_delta = 0
        if self.torch_available and self.cuda_available:
            try:
                import torch
                node_profile.vram_after = torch.cuda.memory_allocated()
                node_profile.vram_peak = torch.cuda.max_memory_allocated()
                vram_delta = node_profile.vram_after - (node_profile.vram_before or 0)
                print(f"[SwissArmyKnife][Profiler] Node {node_profile.node_type} VRAM: before={node_profile.vram_before}, after={node_profile.vram_after}, peak={node_profile.vram_peak}, delta={vram_delta}")

                # Invalidate model cache on significant VRAM changes (>100MB)
                if abs(vram_delta) > 100 * 1024 * 1024:
                    print(f"[SwissArmyKnife][Profiler] 🔄 Significant VRAM change detected ({vram_delta / (1024*1024):.1f} MB), invalidating model cache")
                    self._model_scan_cache_timestamp = None  # Force rescan on next get_loaded_models() call
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
