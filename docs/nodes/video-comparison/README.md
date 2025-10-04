# Video Comparison Node Documentation

The Video Comparison node is a Vue 3-based component using Video.js for professional side-by-side video comparison in ComfyUI workflows.

## 📄 Documentation Files

### Implementation & Setup

- **[VIDEO_COMPARISON_COMPLETE.md](VIDEO_COMPARISON_COMPLETE.md)** - Complete implementation summary and overview
- **[IMPLEMENTATION_VIDEO_COMPARISON.md](IMPLEMENTATION_VIDEO_COMPARISON.md)** - Detailed implementation guide and architecture
- **[VIDEO_COMPARISON_QUICK_REF.md](VIDEO_COMPARISON_QUICK_REF.md)** - Quick reference card for common tasks

## 🎯 Quick Reference

### Node Information

- **Node Name**: 🎬 Video Comparison (Vue)
- **Category**: Utils
- **Widget Type**: VIDEO_COMPARISON_WIDGET
- **Framework**: Vue 3 + Video.js

### Key Features

- **Side-by-Side Display**: Compare up to 3 videos simultaneously
- **Synchronized Controls**: Play/pause/seek all videos together
- **Progressive Loading**: Videos appear as soon as they're available
- **Professional Player**: Built on Video.js with advanced features
- **Responsive Design**: Adaptive grid layout for all screen sizes

### Inputs

- `reference_video` (IMAGE) - Reference/original video
- `base_video` (IMAGE) - Processed video
- `upscaled_video` (IMAGE) - Enhanced/upscaled video

All inputs are optional to support progressive loading.

## 🔧 Technical Details

### Technologies

- **Frontend**: Vue 3.5.13 + TypeScript
- **Video Player**: Video.js with @videojs-player/vue
- **UI Components**: PrimeVue 4.2.5
- **Localization**: Vue-i18n
- **Build Tool**: Vite

### Files

- **Python Backend**: `nodes/utils/video_comparison_vue.py`
- **Vue Component**: `vue-components/src/components/VideoComparisonWidget.vue`
- **Build Output**: `web/js/vue-components.js` (925 KB)
- **Styles**: `web/js/assets/vue-components.css` (43 KB)

## 📚 Related Documentation

### Vue Components

- [Vue Setup Summary](../../vue/VUE_SETUP_SUMMARY.md) - Initial Vue integration
- [Integration Guide](../../vue/INTEGRATION_GUIDE.md) - How to create Vue components
- [Testing Guide](../../vue/TESTING.md) - Testing Vue components
- [Video Comparison Widget](../../vue/VIDEO_COMPARISON_WIDGET.md) - Widget API documentation
- [Quick Start](../../vue/QUICK_START_VIDEO_COMPARISON.md) - Getting started guide
- [Integration with Existing](../../vue/INTEGRATION_WITH_EXISTING_VIDEO_PREVIEW.md) - Migration guide

### Other Video Nodes

- [Video Preview Node](../video-preview/) - Original JavaScript-based video preview
- [Video Metadata Node](../video-metadata/) - Video metadata extraction

### Infrastructure

- [Caching System](../../infrastructure/caching/) - Video caching strategies
- [Debug System](../../infrastructure/debug/) - Debugging tools

## 🚀 Getting Started

1. **Install Dependencies**: Video.js is already installed
2. **Build Component**: `npm run vue:build`
3. **Register Node**: Add to `nodes/__init__.py`
4. **Implement URLs**: Create video URL generation logic
5. **Use in Workflow**: Add node and connect video outputs

See [VIDEO_COMPARISON_QUICK_REF.md](VIDEO_COMPARISON_QUICK_REF.md) for detailed setup instructions.

## 🎨 Features Overview

### Video Display

✅ Side-by-side comparison (1-3 videos)  
✅ Responsive grid layout  
✅ Progressive loading support  
✅ Status indicators (loaded/waiting)  
✅ Video placeholders

### Playback Controls

✅ Play/Pause All button  
✅ Sync button (align timelines)  
✅ Mute/Unmute All  
✅ Timeline scrubber (unified)  
✅ Time display (MM:SS)  
✅ Playback speed control (0.5x-2x)

### UI/UX

✅ Dark theme (ComfyUI-compatible)  
✅ PrimeVue components  
✅ Internationalization (i18n)  
✅ TypeScript support  
✅ Responsive design

## 📊 Comparison with Video Preview

| Feature    | Video Preview (JS) | Video Comparison (Vue) |
| ---------- | ------------------ | ---------------------- |
| Framework  | Plain JavaScript   | Vue 3 + TypeScript     |
| Player     | Custom             | Video.js               |
| Layout     | Sequential         | Side-by-side           |
| Sync       | Manual             | Synchronized           |
| Bundle     | ~50 KB             | ~925 KB                |
| Responsive | Fixed              | Adaptive               |

## 🔄 Recent Updates

- **October 4, 2025**: Initial implementation with Video.js
- **October 4, 2025**: Documentation organized

---

**Node Type**: Display/Preview  
**Category**: Utils  
**Status**: Active Development
