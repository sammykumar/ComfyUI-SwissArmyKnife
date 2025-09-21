# VHS-SK Usage Examples

This document provides practical examples of using VHS-SK (VideoHelperSuite - Swiss Knife Edition) nodes in ComfyUI workflows.

## Basic Video Processing

### Example 1: Load and Preview Video

```
VHS_LoadVideo
├── video: (input video file)
├── force_rate: 8 (AnimateDiff compatible)
├── force_size: 512x512
├── frame_load_cap: 16
└── skip_first_frames: 0
    └── OUTPUT: IMAGE batch
```

### Example 2: Create Video from Images

```
Image Batch → VHS_VideoCombine
                ├── frame_rate: 8
                ├── loop_count: 0
                ├── filename_prefix: "output"
                ├── format: "h264-mp4"
                └── save_output: True
                    └── OUTPUT: VHS_FILENAMES
```

## Advanced Workflows

### Example 3: Video Analysis + Processing

```
VHS_LoadVideo → GeminiUtilVideoDescribe → VHS_VideoCombine
     │               ├── api_key: (your key)           │
     │               ├── model: "gemini-2.0-flash-exp" │
     │               └── description prompts           │
     │                   └── OUTPUT: description       │
     └── OUTPUT: IMAGE batch ──────────────────────────┘
```

### Example 4: Batch Processing Pipeline

```
VHS_LoadVideo → VHS_SplitImages → GeminiUtilImageDescribe (batch) → VHS_MergeImages → VHS_VideoCombine
     │               │                     │                            │                    │
     │               └── split_index: 8    └── batch analysis           │                    │
     │                                                                  │                    │
     └── Large video batch ──────────────────────────────────────────────┘                    │
                                                                                              │
                                                                     Final processed video ──┘
```

## Video Format Options

### High Quality Settings

```
VHS_VideoCombine
├── format: "h265-mp4"
├── crf: 18 (higher quality)
├── pix_fmt: "yuv420p10le" (10-bit color)
└── save_metadata: True (includes workflow)
```

### Fast/Streaming Settings

```
VHS_VideoCombine  
├── format: "h264-mp4"
├── crf: 23 (balanced quality/size)
├── pix_fmt: "yuv420p" (standard)
└── save_metadata: False
```

### Animation/GIF Creation

```
VHS_VideoCombine
├── format: "gifski" (high quality GIFs)
└── frame_rate: 10 (smooth animation)

# OR

VHS_VideoCombine
├── format: "ffmpeg-gif" (standard GIFs)
└── frame_rate: 8 (compatible)
```

## Working with Image Sequences

### Example 5: Directory Processing

```
VHS_LoadImages
├── directory: "path/to/images"
├── image_load_cap: 100
├── skip_first_images: 0
└── select_every_nth: 2 (every other image)
    └── OUTPUT: IMAGE batch
```

### Example 6: Frame Extraction

```
VHS_LoadVideo → VHS_SelectEveryNthImage → VHS_LoadImages (save)
     │               │                           │
     │               └── select_every_nth: 5     └── Process as individual images
     │
     └── Extract keyframes every 5 frames
```

## Audio Integration

### Example 7: Video with Audio

```
VHS_LoadVideo (video source) → VHS_VideoCombine ← VHS_LoadAudio (audio source)
     │                               │                    │
     └── IMAGE frames                └── combine          └── Audio track
                                         │
                                         └── Final video with synchronized audio
```

## Batch Management

### Example 8: Large Dataset Processing

```
VHS_LoadVideo (large file)
    │
    └── VHS_SplitImages (split_index: 50)
            ├── Batch A (frames 0-49)
            │   └── Process with Gemini AI
            │
            └── Batch B (frames 50+)
                └── Process separately
                    │
                    └── VHS_MergeImages → final result
```

### Example 9: Memory-Efficient Processing

```
VHS_LoadVideo
├── frame_load_cap: 16 (small batches)
├── skip_first_frames: 0 (start position)
│
└── Process in chunks:
    ├── Batch 1: frames 0-15
    ├── Batch 2: frames 16-31 (skip_first_frames: 16)
    ├── Batch 3: frames 32-47 (skip_first_frames: 32)
    └── Continue...
```

## Advanced Preview Features

### Example 10: Preview Configuration

With VHS Advanced Previews enabled in ComfyUI settings:

- **Load Video nodes** show preview reflecting current settings
- **Right-click options**: Open preview, Save preview, Pause preview
- **Sync preview**: Restart all previews for comparison
- **Browser-optimized**: Automatically downscaled for performance

## File Organization

### Recommended Directory Structure

```
ComfyUI/
├── input/
│   ├── videos/              # Source videos
│   ├── images/              # Source image sequences  
│   └── audio/               # Audio files
├── output/
│   ├── processed_videos/    # VHS_VideoCombine output
│   └── extracted_frames/    # Frame extraction results
└── temp/
    └── vhs_preview/         # VHS preview cache
```

### File Naming Conventions

```python
# VHS_VideoCombine filename_prefix examples:
"video_%date:yyyy-MM-dd%"          # → video_2024-09-21.mp4
"processed/output_%counter%"        # → processed/output_001.mp4  
"analysis_%prompt:subject%"         # → analysis_woman.mp4
```

## Performance Tips

1. **Memory Management**: Use `frame_load_cap` to limit memory usage
2. **Format Selection**: Choose appropriate formats for your use case
3. **Batch Sizes**: Process large videos in smaller chunks
4. **Preview Optimization**: Disable previews for large files
5. **Storage**: Use temp directory for intermediate files

## Integration with Gemini AI

VHS-SK works seamlessly with existing SwissArmyKnife Gemini nodes:

- **Video Analysis**: Load video → Gemini description → Enhanced output
- **Frame Analysis**: Extract frames → Batch Gemini processing → Combine results
- **Selective Processing**: Split video → Analyze interesting parts → Reconstruct

For complete node documentation, see `docs/VHS_SK_IMPLEMENTATION.md`.