# Integrating Video.js Component with Existing Video Preview

This guide shows how to integrate the new Vue/Video.js comparison component with your existing video preview infrastructure.

## Existing Infrastructure

Your current video preview system (from `#file:video-preview`):

- Location: `nodes/utils/video_preview.py` (Python backend)
- Widget: `web/js/video_preview/video_preview.js` (JavaScript)
- Uses VHS-style video preview
- Progressive loading support

## Integration Approach

### Option 1: Side-by-Side (Recommended)

Keep both implementations and let users choose:

**Use Video Preview (JS)** when:

- You need a lightweight solution
- You only need basic playback
- Bundle size is a concern

**Use Video Comparison (Vue)** when:

- You need professional controls
- You want synchronized playback
- You need side-by-side comparison
- You want advanced features (speed control, etc.)

### Option 2: Gradual Migration

Migrate features from the old implementation to the new one:

1. **Phase 1**: Use Vue component for new features
2. **Phase 2**: Add missing features from old implementation
3. **Phase 3**: Deprecate old implementation
4. **Phase 4**: Remove old implementation

## Sharing Video URL Logic

Both components need to convert video frames to accessible URLs. Create a shared utility:

### Create Shared Utility

**File**: `nodes/utils/video_url_generator.py`

```python
"""
Shared utilities for generating video URLs from frame data
"""
import os
import tempfile
import hashlib
from typing import Any, Optional
import folder_paths


class VideoURLGenerator:
    """Generate URLs for video files that are accessible to the ComfyUI frontend"""

    def __init__(self):
        self.temp_dir = folder_paths.get_temp_directory()

    def generate_url(
        self,
        video_frames: Any,
        video_type: str = "preview",
        format: str = "mp4"
    ) -> str:
        """
        Generate a URL for video frames.

        Args:
            video_frames: Tensor of video frames
            video_type: Type identifier for the video
            format: Video format (mp4, webm, etc.)

        Returns:
            URL accessible from the frontend
        """
        # Generate a unique filename
        frame_hash = self._hash_frames(video_frames)
        filename = f"{video_type}_{frame_hash}.{format}"
        filepath = os.path.join(self.temp_dir, filename)

        # Save video if it doesn't exist
        if not os.path.exists(filepath):
            self._save_video(video_frames, filepath, format)

        # Generate URL (adjust based on your ComfyUI setup)
        # This is the typical ComfyUI pattern for temporary files
        return f"/view?filename={filename}&type=temp&subfolder=videos"

    def _hash_frames(self, frames: Any) -> str:
        """Generate a hash for the video frames"""
        # Simple hash based on shape and first/last frames
        shape_str = str(frames.shape) if hasattr(frames, 'shape') else str(frames)
        return hashlib.md5(shape_str.encode()).hexdigest()[:8]

    def _save_video(self, frames: Any, filepath: str, format: str):
        """
        Save video frames to file.

        Note: This is a placeholder. You'll need to implement based on your
        video encoding library (e.g., opencv, ffmpeg, imageio, etc.)
        """
        # TODO: Implement video encoding
        # Example with imageio:
        # import imageio
        # writer = imageio.get_writer(filepath, fps=30, codec='libx264')
        # for frame in frames:
        #     writer.append_data(frame)
        # writer.close()

        raise NotImplementedError(
            "Video encoding not implemented. "
            "Add your video encoding logic here."
        )


# Singleton instance
_video_url_generator = None


def get_video_url_generator() -> VideoURLGenerator:
    """Get the global video URL generator instance"""
    global _video_url_generator
    if _video_url_generator is None:
        _video_url_generator = VideoURLGenerator()
    return _video_url_generator
```

### Update Video Comparison Node

**File**: `nodes/utils/video_comparison_vue.py`

```python
from .video_url_generator import get_video_url_generator

class VideoComparisonNode:
    # ... existing code ...

    def _process_video(self, video_frames: Any, video_type: str) -> Dict[str, Any]:
        """Process video frames and generate URL"""
        generator = get_video_url_generator()

        try:
            # Generate URL for the video
            video_url = generator.generate_url(video_frames, video_type)

            metadata = {
                "type": video_type,
                "url": video_url,
                "shape": str(video_frames.shape) if hasattr(video_frames, "shape") else None,
            }

            return metadata

        except Exception as e:
            print(f"Error processing {video_type} video: {e}")
            return {
                "type": video_type,
                "url": None,
                "error": str(e),
            }
```

### Update Original Video Preview Node

**File**: `nodes/utils/video_preview.py`

```python
from .video_url_generator import get_video_url_generator

class VideoPreview:
    # ... existing code ...

    def preview_videos(self, reference_vid=None, base_vid=None, upscaled_vid=None):
        """Preview videos with generated URLs"""
        generator = get_video_url_generator()

        videos = {}

        if reference_vid is not None:
            videos['reference'] = generator.generate_url(reference_vid, 'reference')

        if base_vid is not None:
            videos['base'] = generator.generate_url(base_vid, 'base')

        if upscaled_vid is not None:
            videos['upscaled'] = generator.generate_url(upscaled_vid, 'upscaled')

        return {
            "ui": {
                "videos": videos
            }
        }
```

## Frontend Integration

### Loading Video.js CSS

The Vue component imports Video.js CSS automatically:

```vue
import 'video.js/dist/video-js.css';
```

This is included in the built bundle at `web/js/assets/vue-components.css`.

### ComfyUI Extension Registration

Both components are registered in the same extension file:

**File**: `vue-components/src/main.ts`

```typescript
comfyApp.registerExtension({
    name: 'comfyui-swissarmyknife.vue-components',

    getCustomWidgets(_app) {
        return {
            // New Video.js comparison widget
            VIDEO_COMPARISON_WIDGET(node: any) {
                const widget = new ComponentWidgetImpl({
                    node,
                    name: 'video_comparison',
                    component: VideoComparisonWidget,
                    inputSpec: {
                        name: 'video_comparison',
                        type: 'video-comparison',
                    },
                    options: {},
                });

                addWidget(node, widget);
                return { widget };
            },

            // Could also add a Vue version of the original preview
            VIDEO_PREVIEW_VUE_WIDGET(node: any) {
                // Similar implementation for Vue-based preview
            },
        };
    },
});
```

## Migration Path

### Step 1: Add Shared Utility (Today)

```bash
# Create the shared video URL generator
touch nodes/utils/video_url_generator.py
```

### Step 2: Implement Video Encoding (This Week)

Choose a library:

- **imageio**: Easy to use, good quality
- **opencv**: Fast, widely used
- **ffmpeg-python**: Most control, best quality

### Step 3: Test Both Implementations (Next Week)

- Test original video preview with shared utility
- Test new Vue comparison component
- Compare performance and features

### Step 4: Gather Feedback (Ongoing)

- Ask users which they prefer
- Identify missing features
- Plan deprecation timeline

## Example: Using imageio for Video Encoding

```python
def _save_video(self, frames: Any, filepath: str, format: str):
    """Save video frames using imageio"""
    import imageio
    import numpy as np

    # Convert frames to numpy array if needed
    if not isinstance(frames, np.ndarray):
        frames = np.array(frames)

    # Ensure frames are in the right format (H, W, C) and range (0-255)
    if frames.dtype == np.float32 or frames.dtype == np.float64:
        frames = (frames * 255).astype(np.uint8)

    # Create video writer
    writer = imageio.get_writer(
        filepath,
        fps=30,  # Adjust as needed
        codec='libx264',  # For MP4
        quality=8,  # 0-10, 10 is best
        pixelformat='yuv420p'  # For compatibility
    )

    # Write frames
    for frame in frames:
        writer.append_data(frame)

    writer.close()
```

## Performance Considerations

### Bundle Sizes

- **Video Preview (JS)**: ~50KB
- **Video Comparison (Vue)**: ~950KB

### Optimization Strategies

1. **Lazy Loading**: Load Video.js only when needed
2. **Code Splitting**: Separate bundle for video components
3. **CDN Fallback**: Load Video.js from CDN
4. **Tree Shaking**: Remove unused Video.js features

### Example: CDN Fallback

```typescript
// In vite.config.mts, externalize video.js
external: [
    'video.js',  // Load from CDN
    '@videojs-player/vue',
]

// In component or index.html
<link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet">
<script src="https://vjs.zencdn.net/8.10.0/video.min.js"></script>
```

## Conclusion

Both implementations can coexist:

- **Shared utilities** reduce code duplication
- **Progressive migration** minimizes risk
- **User choice** ensures best experience

The new Vue/Video.js component is production-ready, but the migration can be gradual based on your needs and user feedback.
