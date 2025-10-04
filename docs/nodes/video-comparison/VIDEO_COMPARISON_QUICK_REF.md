# Video Comparison Component - Quick Reference Card

## 📦 What Was Built

✅ **Vue 3 Video Comparison Component** using Video.js  
✅ **Python ComfyUI Node** for backend integration  
✅ **Complete Documentation** and guides  
✅ **Built and Ready** to integrate

## 🗂️ Key Files

```
vue-components/src/components/
  └── VideoComparisonWidget.vue    ← Main component

nodes/utils/
  └── video_comparison_vue.py      ← Python node

web/js/
  ├── vue-components.js             ← Built bundle (925 KB)
  └── assets/vue-components.css     ← Styles (43 KB)

Documentation:
  ├── VIDEO_COMPARISON_COMPLETE.md
  ├── vue-components/VIDEO_COMPARISON_WIDGET.md
  ├── vue-components/QUICK_START_VIDEO_COMPARISON.md
  └── vue-components/INTEGRATION_WITH_EXISTING_VIDEO_PREVIEW.md
```

## 🎯 Features

### Display

- 1-3 videos side-by-side
- Responsive grid (mobile/tablet/desktop)
- Progressive loading support
- Status indicators

### Controls

- **Play/Pause All** - Control all videos
- **Sync** - Align all timelines
- **Mute All** - Toggle audio
- **Timeline Scrubber** - Unified seeking
- **Speed Control** - 0.5x to 2x

### Tech Stack

- Vue 3.5.13 + TypeScript
- Video.js (professional player)
- PrimeVue (UI components)
- Vue-i18n (translations)

## 🚀 Quick Start (3 Steps)

### 1. Register Node

```python
# In nodes/__init__.py
from .utils.video_comparison_vue import (
    NODE_CLASS_MAPPINGS as VIDEO_COMP,
    NODE_DISPLAY_NAME_MAPPINGS as VIDEO_COMP_NAMES
)
NODE_CLASS_MAPPINGS.update(VIDEO_COMP)
NODE_DISPLAY_NAME_MAPPINGS.update(VIDEO_COMP_NAMES)
```

### 2. Implement Video URLs

```python
# In nodes/utils/video_comparison_vue.py
def _process_video(self, video_frames, video_type):
    # TODO: Implement video encoding and URL generation
    video_url = save_and_get_url(video_frames, video_type)
    return {"type": video_type, "url": video_url}
```

### 3. Build & Test

```bash
npm run vue:build   # Build component
# Restart ComfyUI
# Add "🎬 Video Comparison (Vue)" node to workflow
```

## 💻 Usage in ComfyUI

### Node Inputs (All Optional)

- `reference_video` (IMAGE) - Original/reference video
- `base_video` (IMAGE) - Processed video
- `upscaled_video` (IMAGE) - Enhanced video

### Example Workflow

```
Load Video ──→ reference_video ──┐
                                  │
Process ──────→ base_video ───────├──→ 🎬 Video Comparison
                                  │
Upscale ──────→ upscaled_video ───┘
```

## 🎨 Customization

### Change Aspect Ratio

```typescript
// In VideoComparisonWidget.vue
const playerOptions = {
    aspectRatio: '16:9', // Change this
};
```

### Change Labels

```typescript
// In vue-components/src/locales/en.ts
videoComparison: {
    referenceVideo: 'Your Label',
}
```

### Change Theme

```css
/* In your CSS */
:root {
    --surface-ground: #yourcolor;
}
```

## 📊 Comparison Quick Reference

| Feature | Old (JS)     | New (Vue)      |
| ------- | ------------ | -------------- |
| Videos  | 3 sequential | 3 side-by-side |
| Player  | Custom       | Video.js       |
| Sync    | Manual       | Automatic      |
| Size    | 50 KB        | 925 KB         |
| Mobile  | Fixed        | Responsive     |

## 🔧 Common Tasks

### Build Component

```bash
npm run vue:build      # One-time build
npm run vue:dev        # Watch mode
```

### Check Types

```bash
cd vue-components
npm run type-check
```

### Debug

1. Check browser console
2. Verify video URLs are valid
3. Check Video.js version compatibility
4. Test in different browsers

## ⚠️ TODO Before Using

- [ ] Implement video URL generation
- [ ] Register node in `__init__.py`
- [ ] Test with actual video data
- [ ] Implement video encoding (imageio/ffmpeg)

## 📖 Documentation Files

| File                                         | What's Inside               |
| -------------------------------------------- | --------------------------- |
| `VIDEO_COMPARISON_COMPLETE.md`               | Full implementation summary |
| `VIDEO_COMPARISON_WIDGET.md`                 | API docs, props, methods    |
| `QUICK_START_VIDEO_COMPARISON.md`            | Getting started guide       |
| `INTEGRATION_WITH_EXISTING_VIDEO_PREVIEW.md` | Migration guide             |

## 💡 Pro Tips

1. **Progressive Loading**: Videos load as available, no waiting!
2. **Sync Button**: Use when videos drift out of alignment
3. **Mobile**: Stacks videos vertically automatically
4. **Performance**: Reduce video resolution if laggy
5. **Formats**: Stick to MP4 (H.264) for best compatibility

## 🆘 Troubleshooting

### Videos don't load

→ Check `_process_video()` implementation  
→ Verify video URLs are accessible  
→ Check browser console for errors

### Videos out of sync

→ Click "Sync" button  
→ Ensure same frame rate  
→ Check for playback speed differences

### Build errors

→ `cd vue-components && npm install`  
→ `npm run build`

### Large bundle size

→ Consider lazy loading  
→ Or use CDN for Video.js

## ✅ You're Ready!

The component is **built and ready to integrate**. Just:

1. Implement video URL generation
2. Register the node
3. Test in ComfyUI

See `VIDEO_COMPARISON_COMPLETE.md` for full details!
