# VHS-SK Implementation Documentation

## Overview

VHS-SK (VideoHelperSuite - Swiss Knife Edition) is a fork of the ComfyUI-VideoHelperSuite project integrated into ComfyUI-SwissArmyKnife. This provides video processing capabilities alongside the existing Gemini AI functionality.

## Fork Details

- **Original Repository**: https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite
- **Fork Date**: 2024-09-21  
- **Integration**: Forked into VHS_SK/ directory with customizations for SwissArmyKnife

## Directory Structure

```
VHS_SK/
├── __init__.py                     # Main entry point with VHS-SK customizations
├── README.md                       # Original VHS documentation
├── requirements.txt               # VHS dependencies (opencv-python, imageio-ffmpeg)
├── videohelpersuite/              # Core Python modules
│   ├── batched_nodes.py          # Batch processing nodes
│   ├── documentation.py          # Node documentation system
│   ├── image_latent_nodes.py     # Image/latent manipulation nodes
│   ├── latent_preview.py         # Preview functionality
│   ├── load_images_nodes.py      # Image sequence loading
│   ├── load_video_nodes.py       # Video loading nodes
│   ├── logger.py                 # Logging utilities
│   ├── nodes.py                  # Main node definitions
│   ├── server.py                 # Server-side functionality
│   └── utils.py                  # Utility functions
├── web/js/                        # Frontend JavaScript
│   ├── VHS.core.js               # Core VHS web functionality
│   └── videoinfo.js              # Video information widget
└── video_formats/                 # Video format configurations
    ├── h264-mp4.json             # H.264 MP4 format
    ├── h265-mp4.json             # H.265 MP4 format
    ├── webm.json                 # WebM format
    ├── av1-webm.json             # AV1 WebM format
    ├── ProRes.json               # ProRes format
    ├── ffv1-mkv.json             # FFV1 MKV format
    ├── nvenc_*.json              # NVIDIA encoder formats
    ├── gifski.json               # High-quality GIF format
    ├── ffmpeg-gif.json           # Standard GIF format
    ├── 8bit-png.json             # PNG sequence (8-bit)
    └── 16bit-png.json            # PNG sequence (16-bit)
```

## Available Nodes (VideoHelperSuite)

### I/O Nodes
- **VHS_LoadVideo**: Load video files with frame rate/size control
- **VHS_LoadVideoPath**: Load videos from external paths
- **VHS_LoadImages**: Load image sequences from directories
- **VHS_LoadImagesPath**: Load image sequences from external paths
- **VHS_VideoCombine**: Combine images into video with audio support

### Batch Processing Nodes
- **VHS_SplitLatents**: Split latent batches into two groups
- **VHS_MergeLatents**: Merge two latent batches
- **VHS_SelectEveryNthLatent**: Select every Nth latent from batch
- **VHS_GetLatentCount**: Get count of latents in batch
- **VHS_DuplicateLatents**: Duplicate latent batches
- **VHS_SplitImages**: Image equivalent of split latents
- **VHS_MergeImages**: Image equivalent of merge latents
- **VHS_SelectEveryNthImage**: Image equivalent of select every Nth
- **VHS_GetImageCount**: Image equivalent of get count
- **VHS_DuplicateImages**: Image equivalent of duplicate batch

### Advanced Nodes
- **VHS_LoadAudio**: Load standalone audio files
- **VHS_VAEEncodeBatched**: Batch VAE encoding
- **VHS_VAEDecodeBatched**: Batch VAE decoding

## Integration with SwissArmyKnife

### Main Repository Integration

The main `__init__.py` has been updated to include VHS-SK nodes:

```python
# Import VHS-SK nodes
try:
    from .VHS_SK import NODE_CLASS_MAPPINGS as VHS_NODE_CLASS_MAPPINGS
    from .VHS_SK import NODE_DISPLAY_NAME_MAPPINGS as VHS_NODE_DISPLAY_NAME_MAPPINGS
except ImportError as e:
    print(f"Warning: VHS-SK nodes not available: {e}")
    VHS_NODE_CLASS_MAPPINGS = {}
    VHS_NODE_DISPLAY_NAME_MAPPINGS = {}

# Combine main nodes, helper nodes, and VHS-SK nodes
NODE_CLASS_MAPPINGS = {**MAIN_NODE_CLASS_MAPPINGS, **HELPER_NODE_CLASS_MAPPINGS, **VHS_NODE_CLASS_MAPPINGS}
NODE_DISPLAY_NAME_MAPPINGS = {**MAIN_NODE_DISPLAY_NAME_MAPPINGS, **HELPER_NODE_DISPLAY_NAME_MAPPINGS, **VHS_NODE_DISPLAY_NAME_MAPPINGS}
```

### Dependencies

Additional dependencies required for VHS-SK functionality:

- `opencv-python`: Computer vision operations
- `imageio-ffmpeg`: FFmpeg video processing
- `torch`: PyTorch for tensor operations
- `Pillow`: Image processing
- `numpy`: Numerical operations

### Web Extensions

VHS-SK includes JavaScript extensions for enhanced video preview functionality:

- **VHS.core.js**: Core video preview and control functionality
- **videoinfo.js**: Video information display widgets

## Usage Scenarios

### Video Workflow Integration

VHS-SK nodes can be combined with existing SwissArmyKnife Gemini nodes for comprehensive video analysis workflows:

1. **Load Video** → **Gemini Video Description** → **Video Combine**
2. **Load Images** → **Gemini Image Analysis** → **Video Combine with Audio**
3. **Split Video** → **Batch Gemini Processing** → **Merge Results**

### Customization Opportunities

As a fork, VHS-SK can be customized for SwissArmyKnife-specific features:

- **Custom Video Formats**: Add specialized formats for AI processing
- **Gemini Integration**: Direct hooks between video nodes and Gemini analysis
- **Batch Processing**: Enhanced batch operations for large video datasets
- **Swiss Army Knife Branding**: UI customizations and branding

## Development Notes

### Current Status
- ✅ **Codebase Ported**: All VideoHelperSuite files copied to VHS_SK/
- ✅ **Directory Structure**: Proper Python module structure created
- ✅ **Dependencies**: Core dependencies (torch, opencv, Pillow) installed
- ✅ **Integration**: Main __init__.py updated to include VHS-SK nodes
- ⚠️ **Testing**: Requires ComfyUI environment for full functionality testing

### Next Steps

1. **ComfyUI Environment Testing**: Test nodes in actual ComfyUI installation
2. **Custom Format Development**: Add SwissArmyKnife-specific video formats
3. **Gemini Integration**: Create direct connections between VHS and Gemini nodes
4. **Documentation**: Update README.md with VHS-SK specific information
5. **UI Customization**: Customize web interface for SwissArmyKnife branding

### Maintenance

- **Upstream Sync**: Monitor original VideoHelperSuite for updates
- **Version Tracking**: Track which VHS version was forked from
- **Change Documentation**: Document all customizations made to the fork
- **Testing**: Maintain test suite for VHS-SK specific functionality

## Implementation Status

- **Fork Creation**: ✅ Complete
- **Basic Integration**: ✅ Complete  
- **Dependency Installation**: ✅ Complete
- **Documentation**: ✅ Complete
- **ComfyUI Testing**: ⚠️ Pending (requires ComfyUI environment)
- **Customizations**: ❌ Not Started
- **Advanced Integration**: ❌ Not Started

This completes the basic fork implementation of VideoHelperSuite into ComfyUI-SwissArmyKnife as VHS-SK.