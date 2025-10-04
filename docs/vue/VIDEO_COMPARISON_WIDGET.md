# Video Comparison Widget (Vue Component)

A Vue 3 component for side-by-side video comparison using Video.js, designed for ComfyUI workflows.

## Features

### Multi-Video Display

- **Responsive Grid Layout**: Displays 1-3 videos in an adaptive grid
    - 1 video: Full width
    - 2 videos: Side-by-side
    - 3 videos: Three columns (responsive to 2 columns on tablet, 1 column on mobile)
- **Progressive Loading**: Videos appear as they become available
- **Status Indicators**: Visual feedback showing loaded vs. waiting videos

### Synchronized Playback

- **Play/Pause All**: Control all videos simultaneously
- **Sync Button**: Synchronize all video timelines to the same position
- **Mute/Unmute All**: Toggle audio for all videos at once
- **Timeline Scrubber**: Seek through all videos in sync with a unified slider

### Video.js Integration

- **Professional Controls**: Built-in Video.js player controls for each video
- **Aspect Ratio**: Optimized for 9:16 vertical videos
- **Playback Speed**: Support for 0.5x, 1x, 1.5x, 2x speed
- **Responsive Design**: Fluid video sizing that adapts to container

## Installation

The component is already set up with:

- **Video.js**: Core video player library
- **@videojs-player/vue**: Vue 3 integration for Video.js
- **PrimeVue**: UI components (Button, Slider)

Dependencies are installed via:

```bash
npm install video.js @videojs-player/vue
```

## Usage

### In a ComfyUI Node

```python
# Python node implementation
class VideoComparisonNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "optional": {
                "reference_video": ("IMAGE", {"tooltip": "Reference video"}),
                "base_video": ("IMAGE", {"tooltip": "Base processed video"}),
                "upscaled_video": ("IMAGE", {"tooltip": "Upscaled video"}),
            }
        }

    RETURN_TYPES = ()
    FUNCTION = "compare_videos"
    OUTPUT_NODE = True

    def compare_videos(self, reference_video=None, base_video=None, upscaled_video=None):
        return {
            "ui": {
                "videos": {
                    "reference": reference_video,
                    "base": base_video,
                    "upscaled": upscaled_video,
                }
            }
        }
```

### JavaScript Widget Registration

```javascript
getCustomWidgets(_app) {
    return {
        VIDEO_COMPARISON_WIDGET(node) {
            const widget = new ComponentWidgetImpl({
                node,
                name: 'video_comparison',
                component: VideoComparisonWidget,
                inputSpec: { name: 'video_comparison', type: 'video-comparison' },
                options: {},
            });

            addWidget(node, widget);
            return { widget };
        },
    };
}
```

## Props

| Prop             | Type              | Required | Description                 |
| ---------------- | ----------------- | -------- | --------------------------- |
| `widget`         | `ComponentWidget` | Yes      | ComfyUI widget instance     |
| `referenceVideo` | `string`          | No       | URL/path to reference video |
| `baseVideo`      | `string`          | No       | URL/path to base video      |
| `upscaledVideo`  | `string`          | No       | URL/path to upscaled video  |

## Component Structure

### Video Slots

The component displays three video slots:

1. **Reference Video**: Original or reference content
2. **Base Video**: Processed/generated video
3. **Upscaled Video**: Enhanced/upscaled version

Each slot shows:

- Video label
- Status indicator (✓ Loaded / Waiting...)
- Video player or placeholder

### Control Panel

#### Playback Controls

- **Play All / Pause All**: Toggle playback for all loaded videos
- **Sync**: Align all videos to the same timestamp
- **Mute All / Unmute All**: Toggle audio across all videos

#### Timeline Controls

- **Time Display**: Current time in MM:SS format
- **Slider**: Unified timeline for seeking
- **Duration**: Total video duration

#### Info Panel

- **Video Count**: Shows "X / 3 videos loaded"

## Styling

### CSS Variables

The component uses CSS variables for theming:

- `--surface-ground`: Background color (#1e1e1e)
- `--surface-card`: Card background (#2a2a2a)
- `--surface-border`: Border color (#3a3a3a)
- `--text-color`: Primary text color (#e0e0e0)
- `--text-color-secondary`: Secondary text color (#9e9e9e)
- `--green-500`: Success color (#4caf50)
- `--yellow-500`: Warning color (#ffc107)

### Responsive Breakpoints

- **Desktop (>1024px)**: 3-column grid
- **Tablet (640-1024px)**: 2-column grid
- **Mobile (<640px)**: Single column, stacked buttons

## Events & Lifecycle

### Player Events

- `@ready`: Fired when a player is initialized
- `@timeupdate`: Updates current time and duration
- `@play`: Sets playing state
- `@pause`: Updates playing state when all videos are paused

### Watchers

- Monitors video prop changes and logs updates
- Automatically updates UI when new videos are loaded

### Cleanup

- Disposes all Video.js players on component unmount
- Prevents memory leaks from video instances

## API Reference

### Methods

#### `togglePlayAll()`

Plays or pauses all active video players.

#### `syncAllVideos()`

Synchronizes all videos to the current time of the first video.

#### `toggleMuteAll()`

Toggles mute state for all videos.

#### `onSeek(value: number | number[])`

Seeks all videos to the specified time (in seconds).

#### `formatTime(seconds: number): string`

Formats seconds into MM:SS format.

### Computed Properties

#### `activeVideos`

Returns array of video slots that have a source URL.

#### `videoSlots`

Returns array of all three video slot configurations with labels and sources.

## Internationalization

Translations are defined in `locales/en.ts`:

```typescript
videoComparison: {
    referenceVideo: 'Reference Video',
    baseVideo: 'Base Video',
    upscaledVideo: 'Upscaled Video',
    waitingForVideo: 'Waiting for video...',
    playAll: 'Play All',
    pauseAll: 'Pause All',
    sync: 'Sync',
    mute: 'Mute All',
    unmute: 'Unmute All',
    videosLoaded: 'videos loaded',
}
```

## Example Workflow

1. **User connects video outputs** to the comparison node
2. **Reference video loads first** (typically input video, loads quickly)
3. **Base video loads** after processing (~1-2 minutes)
4. **Upscaled video loads** after upscaling (~5+ minutes)
5. **User can interact** with controls at any point
6. **Videos play in sync** when Play All is clicked
7. **Timeline scrubbing** moves all videos together

## Troubleshooting

### Videos Not Loading

- Check that video URLs/paths are valid
- Verify video formats are supported by browser
- Check browser console for errors

### Sync Issues

- Click the "Sync" button to realign videos
- Ensure all videos have loaded before syncing

### Autoplay Blocked

- Some browsers block autoplay with audio
- Use the Play All button manually
- Consider muting videos for autoplay

### Performance Issues

- Large/high-resolution videos may cause lag
- Consider reducing video resolution
- Close unused browser tabs
- Check GPU acceleration is enabled

## Future Enhancements

- [ ] Volume control per video
- [ ] Playback speed selector in UI
- [ ] Loop toggle
- [ ] Fullscreen mode for individual videos
- [ ] Screenshot/snapshot capture
- [ ] Video metadata display
- [ ] Keyboard shortcuts
- [ ] Custom aspect ratio selection
- [ ] Side-by-side vs. overlay comparison modes

## Related Documentation

- [Video Preview Node](../../nodes/video-preview/) - Original video preview implementation
- [Vue Integration Guide](../../INTEGRATION_GUIDE.md) - How to create Vue components
- [Video.js Documentation](https://videojs.com/) - Video.js API reference
