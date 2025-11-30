# Enhanced GPU Model Detection with Metadata Extraction

**Status**: ✅ Implemented  
**Date**: November 29, 2025  
**Component**: Resource Monitor - GPU Profiling  
**Related Files**:
- `nodes/utils/resource_monitor/profiler_core.py` (lines 1-600)
- `web/js/resource_monitor.js` (tooltip display)

## Problem Statement

Initial GPU model scanning detected 603 individual layer components (WanLayerNorm, WanRMSNorm, WanSelfAttention) instead of showing meaningful parent models. Users saw:
- ❌ 603 entries showing "WanLayerNorm (model, 0.0 GB)"
- ❌ No correlation to user-selected model filenames
- ❌ Technical class names instead of user-friendly names
- ❌ All layers showing 0.0 GB (incorrect sizing)

**User Requirement**: "The average comfyui user won't understand these levels"

## Solution Overview

Enhanced three-phase approach that:
1. **Reads safetensors metadata** during model loading
2. **Groups child layers** under parent models
3. **Displays user-friendly names** with accurate VRAM usage

### Example Output

**Before**: 603 × `WanLayerNorm (model, 0.0 GB)`

**After**:
- `Wan2_2-T2V-A14B-HIGH (checkpoint, 2.1 GB, 145 layers)`
- `VACE-Depth (model, 512 MB, 45 layers)`
- `MyLoRA (lora, 128 MB, 32 layers)`

## Implementation Details

### 1. Safetensors Metadata Extraction

**File**: `profiler_core.py` (lines 1-20)

```python
# Import safetensors library for metadata reading
try:
    from safetensors import safe_open
    SAFETENSORS_AVAILABLE = True
except ImportError:
    SAFETENSORS_AVAILABLE = False
```

**Installation**:
```bash
pip3 install safetensors
```

**Purpose**: Read `model_type` and other metadata directly from .safetensors files

### 2. Pending Model Loads Tracking

**File**: `profiler_core.py` (lines 136-141)

```python
# Track pending model loads with metadata (filename, timestamp, metadata)
self._pending_model_loads: List[Dict[str, Any]] = []
self._pending_loads_max_age: float = 5.0  # Keep pending loads for 5 seconds
```

**Purpose**: Store model filenames and metadata during node execution for later correlation with loaded modules

### 3. Model Metadata Capture

**File**: `profiler_core.py` (`_capture_model_metadata()` method, lines 449-489)

**Triggered**: During `start_node()` before model execution

**Process**:
1. Scan node inputs for file path keys: `model`, `checkpoint`, `ckpt_name`, `lora_name`, etc.
2. Filter for `.safetensors` files
3. Read metadata using `safe_open()`
4. Store in `_pending_model_loads` with timestamp

**Example**:
```python
# Input: {'ckpt_name': 'Wan2_2-T2V-A14B-HIGH_fp8.safetensors'}
# Reads metadata: {'model_type': 'Wan2_2-T2V-A14B-HIGH', ...}
# Stores: {
#     'filename': 'Wan2_2-T2V-A14B-HIGH_fp8.safetensors',
#     'timestamp': 1732901234.56,
#     'node_type': 'WanVideoModelLoader',
#     'metadata': {'model_type': 'Wan2_2-T2V-A14B-HIGH'}
# }
```

### 4. Enhanced GPU Scanning with Grouping

**File**: `profiler_core.py` (`_scan_gpu_models()` method, lines 270-444)

**Five-Phase Process**:

#### Phase 1: Collect All CUDA Modules
- Scan all Python objects using `gc.get_objects()`
- Filter for `torch.nn.Module` instances
- Build parent/child relationship map using `named_children()`
- Only count direct parameters (`recurse=False`)

```python
for param in obj.parameters(recurse=False):  # Only direct params
    if param.device.type == 'cuda':
        size_bytes += param.nelement() * param.element_size()
```

#### Phase 2: Identify Top-Level Parents
- Find modules that are NOT children of other modules
- These represent complete models (not individual layers)

```python
top_level_parents = set(all_cuda_modules.keys()) - set(parent_child_map.keys())
```

#### Phase 3: Calculate Total VRAM
- For each parent, traverse all descendants using depth-first search
- Sum VRAM across all child layers
- Count total layers and parameters

```python
# Depth-first traversal through module hierarchy
stack = [parent_id]
while stack:
    current_id = stack.pop()
    total_size_bytes += current_data['size_bytes']
    layer_count += 1
    stack.extend(current_data['children'])
```

#### Phase 4: Extract Model Names
- Try module attributes: `name`, `model_name`, `config._name_or_path`
- Try module metadata: `__metadata__['model_type']`
- Match to `_pending_model_loads` by timestamp
- Use safetensors `model_type` field if available

```python
model_name = self._extract_model_name(module, model_class)
metadata = self._match_pending_metadata(size_mb, model_class)
if metadata and 'model_type' in metadata:
    model_name = metadata['model_type']
```

#### Phase 5: Format Display Names
- Show model type, size (GB or MB), layer count
- Sort by VRAM usage (descending)
- Limit to top 10 models per GPU

```python
display_name = f"{model_name} ({model_type}, {size_str}, {layer_count} layers)"
# Example: "Wan2_2-T2V-A14B-HIGH (checkpoint, 2.1 GB, 145 layers)"
```

### 5. Helper Methods

#### `_read_safetensors_metadata(filepath: str)`
**Lines**: 491-527

- Resolves relative paths to common ComfyUI model directories
- Opens safetensors file with `safe_open()`
- Extracts metadata dictionary
- Returns `{'model_type': '...', ...}` or `None`

**Paths Checked**:
```python
possible_dirs = [
    Path('/workspace/ComfyUI/models/checkpoints'),
    Path('/workspace/ComfyUI/models/loras'),
    Path('/workspace/ComfyUI/models/vae'),
    Path('/workspace/ComfyUI/models/unet'),
    Path('models/checkpoints'),
    Path('models/loras'),
    # ... etc
]
```

#### `_extract_model_name(module, default_name: str)`
**Lines**: 529-552

- Tries common attribute patterns on PyTorch module
- Checks `config._name_or_path` for HuggingFace models
- Checks `__metadata__['model_type']` for safetensors
- Falls back to class name if nothing found

#### `_match_pending_metadata(size_mb: float, class_name: str)`
**Lines**: 554-578

- Matches loaded module to pending metadata by timestamp
- Returns most recent load with metadata
- Fallback: returns most recent load even without metadata
- Used for correlating GPU modules to user-selected files

#### `_classify_model_type(class_name: str)`
**Lines**: 580-597

- Updated with WanVideo patterns: `wanvideo`, `wan2`
- Returns: `checkpoint`, `lora`, `vae`, `clip`, `controlnet`, `upscaler`, `depth`, `model`

## Technical Challenges Solved

### Challenge 1: Layer-Level Detection
**Problem**: Detecting 603 individual layers instead of 5-10 models

**Solution**: Build parent/child hierarchy and only report top-level parents

**Impact**: Reduced from 603 entries to ~5-10 meaningful models

### Challenge 2: Zero VRAM Reporting
**Problem**: All layers showing 0.0 GB

**Solution**: 
- Only count direct parameters with `recurse=False`
- Traverse children separately and sum VRAM
- Calculate at parent level including all descendants

**Impact**: Accurate VRAM reporting (e.g., 2.1 GB for Wan2 model)

### Challenge 3: Filename Correlation
**Problem**: No way to match detected modules to user-selected files

**Solution**:
- Capture filenames during `start_node()`
- Read safetensors metadata immediately
- Store with timestamp for correlation
- Match by timing when scanning GPU

**Impact**: Display "Wan2_2-T2V-A14B-HIGH" instead of "WanTransformerDecoder"

### Challenge 4: Block Swapping / RAM Offloading
**Problem**: WanVideo models use block swapping - parts may be in RAM

**Solution**:
- Only scan CUDA memory (`param.device.type == 'cuda'`)
- Automatically handles offloaded models
- Only reports what's actually on GPU

**Impact**: Accurate representation of GPU state

## Performance Optimizations

### 1. Scan Caching
**Implementation**: `get_loaded_models()` method (lines 600+)

```python
# Cache scan results for 1 second
if self._model_scan_cache_timestamp:
    age = time.time() - self._model_scan_cache_timestamp
    if age < self._model_scan_cache_ttl:
        return self.loaded_models  # Return cached
```

**Impact**: Prevents expensive scans on every API request

### 2. Cache Invalidation
**Implementation**: `end_node()` method

```python
# Invalidate if VRAM changed by more than 100MB
vram_change = abs(node_profile.vram_after - node_profile.vram_before)
if vram_change > 100 * 1024 * 1024:  # 100MB threshold
    self._model_scan_cache_timestamp = None
```

**Impact**: Fresh scans only when models actually load/unload

### 3. Garbage Collection
**Implementation**: `_scan_gpu_models()` line 288

```python
# Force GC before scanning to get accurate state
gc.collect()
```

**Impact**: Ensures dead references are cleaned up before counting

### 4. Top 10 Limit
**Implementation**: Phase 5 of scanning

```python
# Sort by VRAM and limit to top 10
result[gpu_id].sort(key=lambda x: x['vram_mb'], reverse=True)
result[gpu_id] = result[gpu_id][:10]
```

**Impact**: Prevents overwhelming UI with hundreds of models

### 5. Pending Loads Cleanup
**Implementation**: Lines 291-295

```python
# Clean up old pending loads (>5 seconds)
self._pending_model_loads = [
    load for load in self._pending_model_loads
    if current_time - load.get('timestamp', 0) < 5.0
]
```

**Impact**: Prevents memory leak from accumulating metadata

## Testing & Validation

### Test Scenario 1: WanVideo Model Loading
**Setup**: Load Wan2_2-T2V-A14B-HIGH model with block swapping

**Expected Output**:
```
GPU 0: 5 models
  - Wan2_2-T2V-A14B-HIGH (checkpoint, 2.1 GB, 145 layers)
  - VACE-Depth (model, 512 MB, 45 layers)
  - MyLoRA (lora, 128 MB, 32 layers)
```

**Validation**:
- ✅ Shows grouped parent model, not 603 layers
- ✅ Accurate VRAM calculation (2.1 GB)
- ✅ Displays user-friendly name from metadata
- ✅ Shows layer count for context

### Test Scenario 2: Multiple Model Types
**Setup**: Load checkpoint + VAE + LoRA + CLIP

**Expected Output**: 4-5 distinct models sorted by VRAM

### Test Scenario 3: Model Unloading
**Setup**: Clear models and observe cache invalidation

**Expected Output**: Empty model list after VRAM drops

### Test Scenario 4: Without Safetensors Library
**Setup**: Remove safetensors package

**Expected Output**: Graceful degradation, shows class names instead of metadata

## Dependencies

### Required
- `torch` - PyTorch module inspection
- `gc` - Python garbage collection

### Optional
- `safetensors` - Metadata extraction (highly recommended)

**Installation**:
```bash
pip3 install safetensors
```

**Graceful Degradation**: If safetensors not available:
- Still performs grouping and VRAM calculation
- Uses class names instead of metadata
- Shows warning on startup

## Future Enhancements

### Enhancement 1: Multi-GPU Tooltip
**Current**: Single tooltip for all GPUs  
**Proposed**: Separate tooltip per GPU with per-GPU model list

### Enhancement 2: Model Age Tracking
**Current**: Shows only current models  
**Proposed**: Show "loaded 2m ago" timestamp

### Enhancement 3: Offloaded Model Indicator
**Current**: Only shows GPU-resident models  
**Proposed**: Show RAM-offloaded models with "(offloaded)" indicator

### Enhancement 4: Model File Paths
**Current**: Shows model name only  
**Proposed**: Show full file path in tooltip

### Enhancement 5: More Metadata Fields
**Current**: Only uses `model_type`  
**Proposed**: Extract and display `architecture`, `base_model`, etc.

## Related Documentation

- **Core Implementation**: [GPU_MEMORY_SCANNING.md](GPU_MEMORY_SCANNING.md) - Original scanning approach
- **Widget Display**: [CONTROL_PANEL.md](CONTROL_PANEL.md) - Frontend tooltip rendering
- **API Endpoint**: `/swissarmyknife/profiler/loaded_models` - REST API for model data
- **Node Tracking**: `profiler_core.py` - Complete profiler implementation

## Troubleshooting

### Issue: No Models Shown
**Cause**: No CUDA modules in memory  
**Solution**: Load a model and wait for node execution to complete

### Issue: Shows Class Names Instead of Metadata
**Cause**: safetensors library not installed  
**Solution**: `pip3 install safetensors`

### Issue: Incorrect VRAM Numbers
**Cause**: Block swapping or model sharing  
**Solution**: VRAM is per-GPU, shared layers counted once

### Issue: Old Models Still Showing
**Cause**: Cache not invalidated  
**Solution**: Wait 1 second or trigger VRAM change >100MB

### Issue: Too Many Models Listed
**Cause**: Many small models loaded  
**Solution**: Only top 10 shown, sorted by VRAM usage

## Logging & Debugging

**Console Output**:
```
[SwissArmyKnife][Profiler] 📄 Captured model: Wan2_2-HIGH.safetensors (metadata: True)
[SwissArmyKnife][Profiler] 🔍 Found 603 CUDA modules, 5 top-level parents
[SwissArmyKnife][Profiler] ✅ Grouped into 5 parent models across 1 GPU(s)
[SwissArmyKnife][Profiler] GPU 0: 5 models
[SwissArmyKnife][Profiler]   - Wan2_2-T2V-A14B-HIGH (checkpoint, 2.1 GB, 145 layers)
```

**Enable Debug Logging**:
```python
logger.setLevel(logging.DEBUG)
```

## Commit Reference

**Feature Branch**: `feat/Resource-monitor/CU-86b7mzbtx`  
**Implementation Date**: November 29, 2025  
**Key Changes**:
- Added safetensors import and metadata extraction
- Enhanced `_scan_gpu_models()` with 5-phase approach
- Added `_capture_model_metadata()` for filename tracking
- Added helper methods for name extraction and matching
- Fixed VRAM calculation using parent/child traversal
- Limited display to top 10 models per GPU
