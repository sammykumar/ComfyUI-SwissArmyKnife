# VACE Annotators - Complete Documentation

Comprehensive documentation for VACE Annotator nodes in ComfyUI SwissArmyKnife.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Node Reference](#node-reference)
4. [Usage Examples](#usage-examples)
5. [Model Architecture](#model-architecture)
6. [Performance & Optimization](#performance--optimization)
7. [Troubleshooting](#troubleshooting)

## Overview

VACE-Annotators is a suite of preprocessing tools for video editing and generation tasks, developed by ali-vilab. This SwissArmyKnife integration provides three main annotator nodes:

- **Depth Annotator**: Generates depth maps for depth-aware effects
- **Flow Annotator**: Computes optical flow between frames for motion analysis
- **Scribble Annotator**: Extracts edge maps and stylized sketches

These nodes can be used as control signals for video generation/editing workflows in ComfyUI.

### Key Features

- **Batch Processing**: All nodes support processing multiple frames simultaneously
- **Model Caching**: Models are cached on first load for efficient reuse
- **Flexible Resolution**: Process at different resolutions for speed/quality tradeoff
- **Multiple Model Support**: Each node supports different model variants

## Installation

### Prerequisites

```bash
# PyTorch (required)
pip install torch torchvision

# OpenCV (required for video processing)
pip install opencv-python

# PIL/Pillow (required for image operations)
pip install pillow
```

### Model Downloads

1. Visit the VACE-Annotators HuggingFace repository:
   https://huggingface.co/ali-vilab/VACE-Annotators

2. Download the model files you need:
   - **Depth models**: `depth/midas.pth` or `depth/depth_anything_v2.pth`
   - **Flow model**: `flow/raft.pth`
   - **Scribble models**: `scribble/anime_style/netG_A_latest.pth`, etc.

3. Place models in one of these locations (in order of precedence):
   ```
   models/vace_annotators/depth/
   ../models/vace_annotators/depth/
   ~/ComfyUI/models/vace_annotators/depth/
   ```

### Directory Structure

```
ComfyUI/
├── models/
│   └── vace_annotators/
│       ├── depth/
│       │   ├── midas.pth
│       │   └── depth_anything_v2.pth
│       ├── flow/
│       │   └── raft.pth
│       └── scribble/
│           ├── anime_style/
│           │   └── netG_A_latest.pth
│           ├── general/
│           │   └── scribble.pth
│           └── sketch/
│               └── sketch.pth
└── custom_nodes/
    └── ComfyUI-SwissArmyKnife/
        └── nodes/
            └── vace_annotators/
```

## Node Reference

### VACE Annotator - Depth

Generates depth maps from images or video frames.

**Category**: `Swiss Army Knife 🔪/VACE Annotators`

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `images` | IMAGE | - | Input images or video frames (batch supported) |
| `model_type` | ENUM | "midas" | Model to use: "midas" or "depth_anything_v2" |
| `resolution` | INT | 512 | Processing resolution (64-2048, step 64) |
| `model_path` | STRING | "" | Optional custom model path |

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `depth_maps` | IMAGE | Generated depth maps [B, H, W, C] |

#### Model Types

- **MiDaS**: General-purpose depth estimation, good for diverse scenes
- **Depth Anything V2**: More accurate depth estimation, better edge preservation

#### Usage Notes

- Lower resolution = faster processing, less detail
- Higher resolution = slower processing, more detail
- Batch processing is efficient for video frames
- Models are cached after first load

---

### VACE Annotator - Flow

Generates optical flow maps from video frames.

**Category**: `Swiss Army Knife 🔪/VACE Annotators`

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `images` | IMAGE | - | Input video frames (minimum 2 frames required) |
| `resolution` | INT | 512 | Processing resolution (64-2048, step 64) |
| `flow_direction` | ENUM | "forward" | Flow direction: "forward", "backward", or "bidirectional" |
| `model_path` | STRING | "" | Optional custom model path |

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `flow_maps` | IMAGE | Generated optical flow maps [B-1 or B, H, W, C] |

#### Flow Directions

- **Forward**: Flow from frame i to frame i+1
- **Backward**: Flow from frame i+1 to frame i
- **Bidirectional**: Average of forward and backward flow

#### Usage Notes

- Requires at least 2 frames in the batch
- Output has B-1 frames for forward/backward (flow between consecutive frames)
- Uses RAFT (Recurrent All-Pairs Field Transforms) architecture
- Best for analyzing motion and temporal consistency

---

### VACE Annotator - Scribble

Generates scribble/edge maps from images for stylized effects.

**Category**: `Swiss Army Knife 🔪/VACE Annotators`

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `images` | IMAGE | - | Input images or video frames (batch supported) |
| `style` | ENUM | "anime" | Style: "anime", "general", or "sketch" |
| `inference_mode` | ENUM | "auto" | `auto` prefers vendored model, `model` requires checkpoint, `fallback` forces Sobel mode |
| `batch_size` | INT | 10 | Process frames in chunks to reduce VRAM usage (0 = full batch). |
| `resolution` | INT | 512 | Processing resolution (64-2048, step 64) |
| `edge_threshold` | FLOAT | 0.12 | Threshold used by Sobel and legacy ResNet backends (lower = more edges). Ignored by vendor checkpoints. |
| `model_path` | STRING | "" | Optional custom model path |

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `scribble_maps` | IMAGE | Generated scribble/edge maps [B, H, W, C] |

#### Styles

- **Anime**: Specialized for anime-style edge detection and stylization
- **General**: General-purpose edge detection for various content
- **Sketch**: Sketch-like line extraction for artistic effects

#### Usage Notes

- `auto` inference will use vendored VACE model when checkpoints are present, otherwise Sobel fallback.
- `model` mode surfaces helpful errors when checkpoints are missing or incompatible.
- `edge_threshold` replaces the internal factor so you can decide how aggressive Sobel/ResNet edges should be (default `0.12`). Vendor checkpoints ignore this control.
- Adaptive quantile thresholding plus morphological thinning (legacy backend) remains available automatically when the vendor checkpoint is missing.
- Use the `batch_size` field to stream large frame batches across multiple forward passes if you run into VRAM limits.
- Useful for style transfer and artistic video generation; can be combined with other control signals.

## Usage Examples

### Example 1: Single Image Depth Estimation

```
Input: Single image
↓
[VACE Annotator - Depth]
  model_type: midas
  resolution: 512
↓
Output: Depth map
```

### Example 2: Video Optical Flow

```
Input: Video frames (10 frames)
↓
[VACE Annotator - Flow]
  flow_direction: forward
  resolution: 512
↓
Output: 9 flow maps (between consecutive frames)
```

### Example 3: Anime Scribble Extraction

```
Input: Anime image or video
↓
[VACE Annotator - Scribble]
  style: anime
  resolution: 512
↓
Output: Anime-style scribble map
```

### Example 4: Multi-Modal Control Signals

```
Input Video Frames
├─→ [VACE Annotator - Depth] → Depth Maps
├─→ [VACE Annotator - Flow] → Flow Maps
└─→ [VACE Annotator - Scribble] → Edge Maps
      ↓
   Combined Control Signals
      ↓
   Video Generation/Editing Pipeline
```

## Model Architecture

### Depth Models

- **MiDaS**: DPT-Hybrid architecture, ~100M parameters
- **Depth Anything V2**: Enhanced architecture with better edge preservation

### Flow Models

- **RAFT**: Recurrent All-Pairs Field Transforms
  - Iterative refinement of flow estimates
  - All-pairs correlation computation
  - Efficient for real-time and batch processing

### Scribble Models

- **Anime Style**: GAN-based model (netG_A_latest.pth)
- **General/Sketch**: Edge detection and stylization networks

## Performance & Optimization

### Processing Speed

Resolution impact on processing time (approximate, per frame):

| Resolution | Depth | Flow | Scribble |
|------------|-------|------|----------|
| 256x256 | ~50ms | ~100ms | ~30ms |
| 512x512 | ~150ms | ~300ms | ~80ms |
| 1024x1024 | ~500ms | ~1200ms | ~250ms |

*Times are approximate and depend on hardware (GPU vs CPU)*

### Memory Usage

- **Depth**: ~2-4GB GPU memory at 512x512
- **Flow**: ~4-6GB GPU memory at 512x512 (needs 2 frames)
- **Scribble**: ~1-2GB GPU memory at 512x512

### Optimization Tips

1. **Batch Processing**: Process multiple frames together for efficiency
2. **Resolution**: Start with 512x512, increase only if needed
3. **Model Caching**: Models stay in memory between calls (efficient)
4. **GPU Usage**: Ensure CUDA is available for best performance
5. **Frame Skipping**: For flow, consider processing every Nth frame for long videos

## Troubleshooting

### Model Not Found Error

```
Error: VACE depth model not found at: models/vace_annotators/depth/midas.pth
```

**Solution**:
1. Download model from https://huggingface.co/ali-vilab/VACE-Annotators
2. Place in correct directory: `models/vace_annotators/depth/midas.pth`
3. Or specify custom path in `model_path` input

### Optical Flow Requires 2+ Frames

```
Error: Optical flow requires at least 2 frames, got 1
```

**Solution**:
- Provide a batch of at least 2 frames for flow computation
- Use frame extraction node if working with video file

### Out of Memory

```
Error: CUDA out of memory
```

**Solution**:
1. Reduce `resolution` parameter (try 256 or 384)
2. Process fewer frames at once (smaller batches)
3. Close other GPU-intensive applications
4. Use CPU if GPU memory is limited

### Import Errors

```
Error: No module named 'torch'
```

**Solution**:
```bash
pip install torch torchvision opencv-python pillow
```

## Implementation Notes

### Current Status

The current implementation provides:
- ✅ Full node structure and ComfyUI integration
- ✅ Input/output specifications
- ✅ Model loading and caching framework
- ✅ Error handling and validation
- ⚠️ Placeholder processing (needs actual model implementation)

### Next Steps for Full Implementation

To complete the implementation with actual VACE model inference:

1. **Install VACE dependencies**:
   ```bash
   pip install -r requirements/annotator.txt  # From VACE repo
   ```

2. **Import VACE annotator classes**:
   ```python
   from vace.annotators.depth import DepthAnnotator
   from vace.annotators.flow import FlowAnnotator
   from vace.annotators.scribble import ScribbleAnnotator
   ```

3. **Replace placeholder processing** in each node:
   - Load actual VACE model architecture
   - Convert ComfyUI tensor format to VACE input format
   - Run inference
   - Convert VACE output back to ComfyUI format

4. **Add tensor format conversions**:
   ```python
   # ComfyUI format: [B, H, W, C] (RGB, range 0-1)
   # VACE format: [B, C, H, W] (RGB/BGR, range varies)
   ```

### Design Decisions

- **Model Caching**: Class-level cache for efficiency across multiple calls
- **Flexible Paths**: Multiple default paths for different ComfyUI installations
- **Placeholder Processing**: Simple operations for testing without full VACE installation
- **Error Messages**: Clear guidance on model downloads and setup

## References

- **VACE Repository**: https://github.com/ali-vilab/VACE
- **VACE-Annotators Models**: https://huggingface.co/ali-vilab/VACE-Annotators
- **Research Paper**: https://arxiv.org/abs/2503.07598
- **Documentation**: https://deepwiki.com/ali-vilab/VACE/4-annotator-system
- **ComfyUI Custom Nodes Guide**: https://docs.comfy.org/custom-nodes/backend/server_overview

## Version History

- **v1.0.0**: Initial implementation with placeholder processing
  - Three annotator nodes (Depth, Flow, Scribble)
  - Model loading and caching framework
  - Full ComfyUI integration
  - Documentation and examples

## License

This integration follows the licensing of:
- SwissArmyKnife: [Project License]
- VACE-Annotators: Apache-2.0 (https://huggingface.co/ali-vilab/VACE-Annotators)

## Contributing

To enhance these nodes:
1. Add actual VACE model inference (replace placeholder processing)
2. Optimize tensor conversions between ComfyUI and VACE formats
3. Add more annotator variants (pose, mask, segmentation)
4. Create example workflows
5. Test with real VACE models and report issues

## Support

For issues or questions:
- GitHub Issues: https://github.com/sammykumar/ComfyUI-SwissArmyKnife/issues
- Tag issues with: `vace-annotators`
