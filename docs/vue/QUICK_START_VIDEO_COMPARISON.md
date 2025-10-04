# Video Comparison Component - Quick Start Guide

## Overview

The Video Comparison component is a Vue 3-based widget that provides professional side-by-side video comparison using Video.js. It's designed for ComfyUI workflows where you need to compare multiple video outputs (e.g., reference vs. processed vs. upscaled).

## ✅ Installation Complete

You've already installed the required packages:

- ✅ `video.js` - Core video player
- ✅ `@videojs-player/vue` - Vue 3 integration

## 📦 What's Included

### Vue Component

**Location**: `vue-components/src/components/VideoComparisonWidget.vue`

**Features**:

- Side-by-side display of up to 3 videos
- Synchronized playback controls
- Timeline scrubbing
- Mute/unmute controls
- Responsive grid layout
- Progressive loading support

### Python Node

**Location**: `nodes/utils/video_comparison_vue.py`

**Features**:

- Optional video inputs (reference, base, upscaled)
- Progressive loading support
- Metadata extraction
- UI data formatting for Vue component

### Documentation

- `VIDEO_COMPARISON_WIDGET.md` - Full component documentation
- Translation support in `locales/en.ts`

## 🚀 Next Steps

### 1. Register the Python Node

Add to your `nodes/__init__.py`:

```python
from .utils.video_comparison_vue import NODE_CLASS_MAPPINGS as VIDEO_COMPARISON_MAPPINGS
from .utils.video_comparison_vue import NODE_DISPLAY_NAME_MAPPINGS as VIDEO_COMPARISON_NAMES

NODE_CLASS_MAPPINGS.update(VIDEO_COMPARISON_MAPPINGS)
NODE_DISPLAY_NAME_MAPPINGS.update(VIDEO_COMPARISON_NAMES)
```

### 2. Implement Video URL Generation

The component needs video URLs to work. Update `_process_video()` in the Python node:

```python
def _process_video(self, video_frames: Any, video_type: str) -> Dict[str, Any]:
    # Save video frames to a temporary file
    video_path = self._save_video_frames(video_frames, video_type)

    # Generate a URL accessible to the frontend
    # This depends on your ComfyUI setup
    video_url = f"/view?filename={os.path.basename(video_path)}&type=output"

    return {
        "type": video_type,
        "url": video_url,
        "shape": str(video_frames.shape),
    }
```

### 3. Build and Test

```bash
# Build Vue components
npm run vue:build

# Or use watch mode for development
npm run vue:dev
```

### 4. Load in ComfyUI

The component will be available as:

- **Node Name**: 🎬 Video Comparison (Vue)
- **Category**: Utils
- **Widget Type**: VIDEO_COMPARISON_WIDGET

## 📋 Usage Example

### Basic Workflow

```
[Load Video] → [Process Video] → [Video Comparison]
                      ↓
               [Upscale Video] ─┘
```

### With All Three Inputs

1. Connect your reference video to `reference_video`
2. Connect processed video to `base_video`
3. Connect upscaled video to `upscaled_video`
4. Videos will appear progressively as they're generated

### Progressive Loading

The component supports progressive loading:

- Videos appear as soon as they're available
- You don't need to wait for all videos to complete
- Perfect for long-running upscaling operations

## 🎨 Customization

### Styling

The component uses CSS variables for theming. You can customize in your ComfyUI theme:

```css
:root {
    --surface-ground: #1e1e1e;
    --surface-card: #2a2a2a;
    --surface-border: #3a3a3a;
    --text-color: #e0e0e0;
    --text-color-secondary: #9e9e9e;
}
```

### Translations

Add or modify translations in `vue-components/src/locales/en.ts`:

```typescript
videoComparison: {
    referenceVideo: 'Your Custom Label',
    // ... other translations
}
```

### Video.js Options

Modify player options in the component:

```typescript
const playerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    aspectRatio: '16:9', // Change aspect ratio
    playbackRates: [0.5, 1, 1.5, 2],
    // Add more Video.js options
};
```

## 🔧 Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clean and reinstall dependencies
cd vue-components
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Videos Not Loading

1. Check video URL generation in `_process_video()`
2. Verify video files are accessible from the frontend
3. Check browser console for errors
4. Ensure video format is supported (MP4, WebM)

### Sync Issues

- Videos must have the same frame rate for perfect sync
- Use the "Sync" button to realign if they drift
- Check that all videos have loaded before syncing

### Performance Issues

- Large videos (>1080p) may cause lag
- Consider reducing resolution for preview
- Enable hardware acceleration in browser
- Use modern video codecs (H.264, H.265)

## 📚 Key Differences from Video Preview Node

| Feature         | Video Preview (JS)    | Video Comparison (Vue)       |
| --------------- | --------------------- | ---------------------------- |
| Framework       | Plain JavaScript      | Vue 3 + Video.js             |
| UI Library      | Custom                | PrimeVue                     |
| Player          | Custom implementation | Professional Video.js        |
| Responsiveness  | Fixed layout          | Adaptive grid                |
| Localization    | None                  | Vue-i18n                     |
| Maintainability | Lower                 | Higher (component-based)     |
| Features        | Basic controls        | Advanced (speed, sync, etc.) |

## 🎯 Best Practices

1. **Use Progressive Loading**: Don't wait for all videos to complete
2. **Optimize Video Size**: Use appropriate resolution for comparison
3. **Handle Errors Gracefully**: Check for video availability before loading
4. **Provide Fallbacks**: Show placeholders when videos aren't ready
5. **Clean Up Resources**: Dispose players when component unmounts

## 🔄 Development Workflow

### Watch Mode

For active development:

```bash
# Terminal 1: Watch Vue components
npm run vue:dev

# Terminal 2: Watch Python changes (if using Docker)
npm run dev:python
```

### Hot Module Replacement

The Vite build supports fast refresh during development. Changes to Vue components will be reflected quickly.

### Type Checking

Run TypeScript type checking:

```bash
cd vue-components
npm run type-check
```

## 📖 Additional Resources

- [Video.js Documentation](https://videojs.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [PrimeVue Documentation](https://primevue.org/)
- [ComfyUI Frontend Types](https://github.com/comfyanonymous/ComfyUI)

## 🎉 You're Ready!

The Video Comparison component is now set up and ready to use. Build it, register the node, and start comparing videos side-by-side in your ComfyUI workflows!

For detailed API documentation, see `VIDEO_COMPARISON_WIDGET.md`.
