# Media Selection & Frame Extraction Nodes - README

## Overview

## 📄 Documentation

- **[MEDIA_SELECTION.md](MEDIA_SELECTION.md)** - Complete consolidated documentation

This module provides three new ComfyUI nodes that enable advanced video processing workflows by decoupling media selection, frame extraction, and caption combining from AI description generation.

## Nodes

### 1. Media Selection

**Category:** Swiss Army Knife 🔪

**Purpose:** Handle media input from various sources without AI processing.

**Inputs:**

- **media_source**: Source type (Upload Media, Randomize from Path, Reddit Post, Randomize from Subreddit)
- **media_type**: Type of media (image or video)
- **seed**: Randomization seed for reproducibility
- **media_path** (optional): Directory path for randomization
- **uploaded_image_file** (optional): Uploaded image file path
- **uploaded_video_file** (optional): Uploaded video file path
- **reddit_url** (optional): Reddit post URL
- **subreddit_url** (optional): Subreddit for randomization
- **max_duration** (optional): Maximum video duration in seconds (0 = full video)
- **resize_mode** (optional): Resize mode (None, Auto (by orientation), Custom)
- **resize_width** (optional): Target width for Custom resize mode (default: 832)
- **resize_height** (optional): Target height for Custom resize mode (default: 480)

**Outputs:**

- **media_path**: Absolute path to selected/downloaded media
- **media_type**: Detected/validated media type
- **media_info**: Formatted information about the media
- **height**: Media height in pixels (after resizing if applicable)
- **width**: Media width in pixels (after resizing if applicable)
- **duration**: Duration in seconds (0 for images)
- **fps**: Frames per second (0 for images)

**Features:**

- **Interactive Upload Widgets**: Click-to-upload buttons for images and videos when using "Upload Media" mode
- **Dynamic UI**: Upload widgets change based on media_type selection (image/video)
- **ComfyUI Integration**: Uses ComfyUI's built-in upload system for proper file handling
- Supports all media sources from the original Media Describe node
- Downloads and caches Reddit media
- Trims videos to specified max_duration if needed
- **Resizes images and videos** with three modes:
    - **None**: Keep original dimensions
    - **Auto (by orientation)**: Landscape → 832×480, Portrait → 480×832
    - **Custom**: Specify exact dimensions
- Uses high-quality resizing (Lanczos for images, libx264 for videos)
- Center crops to exact dimensions while preserving aspect ratio
- Returns comprehensive metadata without AI processing

---

### 2. Frame Extractor

**Category:** Swiss Army Knife 🔪

**Purpose:** Extract specific frames from videos as individual images.

**Inputs:**

- **video_path**: Path to video file (from Media Selection node)
- **num_frames**: Number of frames to extract (1-20)
- **extraction_method**: Method for frame selection
    - **Evenly Spaced**: Divide video into equal segments
    - **Random**: Randomly select frames with seed
    - **Start/Middle/End**: Extract from key positions
- **seed** (optional): Seed for random extraction
- **start_time** (optional): Start of extraction window (seconds)
- **end_time** (optional): End of extraction window (seconds, 0 = end of video)
- **output_format**: Output image format (png or jpg)

**Outputs:**

- **frame_paths**: Comma-separated paths to extracted frames
- **frame_timestamps**: Comma-separated timestamps (seconds)
- **frame_info**: Formatted extraction information

**Features:**

- Multiple extraction strategies
- Configurable extraction window for partial video processing
- High-quality frame output (PNG or JPG)
- Automatic timestamp tracking
- Saves frames to temporary directory

**Example Usage:**

```
Input: 5-second video
Method: Evenly Spaced, num_frames=3
Output: Frames at 0.83s, 2.50s, 4.17s
```

---

### 3. Multi-Caption Combiner

**Category:** Swiss Army Knife 🔪

**Purpose:** Combine multiple image captions into a cohesive description using Gemini AI.

**Inputs:**

- **captions**: Comma or newline-separated captions to combine
- **gemini_api_key**: Google Gemini API key
- **gemini_model**: Gemini model to use (default: gemini-2.0-flash-exp)
- **combination_style**: Style for combining captions
    - **Action Summary**: Overall action/movement summary
    - **Chronological Narrative**: Sequential progression description
    - **Movement Flow**: Focus on flow and continuity
    - **Custom**: Use custom prompt
- **timestamps** (optional): Comma-separated timestamps for each caption
- **custom_prompt** (optional): Custom combining instruction
- **output_format**: Format for output (Paragraph, Bullet Points, Scene Description)

**Outputs:**

- **combined_caption**: Combined description
- **gemini_status**: API call status information

**Features:**

- Intelligent caption synthesis using Gemini
- Multiple combination styles for different use cases
- Optional timestamp awareness for temporal context
- Retry logic for API reliability
- Support for NSFW content description

---

## Workflow Examples

### Example 1: NSFW Action Description with JoyCaption

This workflow demonstrates how to use external captioning (JoyCaption) for specific aspects while using Gemini for others.

```
┌─────────────────────┐
│  Media Selection    │
│  - Source: Reddit   │
│  - Type: Video      │
│  - Seed: 12345      │
└──────────┬──────────┘
           │ video_path
           ▼
┌─────────────────────┐
│  Frame Extractor    │
│  - Frames: 3        │
│  - Method: Evenly   │
│  - Format: PNG      │
└──────────┬──────────┘
           │ frame_paths
           │ (3 images)
           ▼
    ┌──────────────┐
    │ For each     │
    │ frame:       │
    │              │
    │ JoyCaption   │ → Caption 1
    │ GGUF         │ → Caption 2
    │              │ → Caption 3
    └──────┬───────┘
           │ captions (3 descriptions)
           ▼
┌─────────────────────┐
│ Multi-Caption       │
│ Combiner            │
│ - Style: Action     │
│ - Format: Paragraph │
└──────────┬──────────┘
           │ combined_caption
           │ (movement/action)
           ▼
┌─────────────────────┐
│ Media Describe      │
│ - Overrides:        │
│   movement: ^^^^    │
│ - Describes other   │
│   aspects           │
└──────────┬──────────┘
           │ final_description
           ▼
      (Complete prompt with
       JoyCaption actions +
       Gemini aesthetics)
```

### Example 2: Simple Frame Analysis

Extract and analyze specific frames from a video:

```
Media Selection → Frame Extractor → [Process each frame individually]
```

### Example 3: Video Sampling

Get representative frames from a long video:

```
Media Selection (max_duration=10s) → Frame Extractor (Start/Middle/End) → Analysis
```

---

## Installation

These nodes are automatically loaded when you install the ComfyUI Swiss Army Knife extension.

**Requirements:**

- Python 3.10+
- OpenCV (cv2)
- Google Generative AI SDK
- PIL/Pillow
- ffmpeg (for video trimming)

**Dependencies are installed automatically with:**

```bash
pip install -e .
```

---

## Usage Tips

### Media Selection

- Use **seed** parameter to ensure reproducible random selection
- **max_duration** is useful for large Reddit videos to avoid API limits
- The node will auto-detect actual media type from Reddit posts

### Frame Extractor

- **Evenly Spaced** works best for capturing overall motion
- **Random** is good for diverse sampling
- **Start/Middle/End** ensures you capture key moments
- Use **start_time** and **end_time** to focus on specific video sections

### Multi-Caption Combiner

- **Action Summary** style is ideal for movement descriptions
- **Chronological Narrative** works well for showing progression
- **Movement Flow** emphasizes continuity and rhythm
- Include **timestamps** for better temporal understanding
- The **Custom** style lets you define your own combining logic

### Connecting to JoyCaption

Since JoyCaption processes images one at a time, you'll need to:

1. Extract frames using Frame Extractor
2. Manually process each frame through JoyCaption (or use a batch processor)
3. Collect the captions (comma-separated or newline-separated)
4. Feed them to Multi-Caption Combiner

**Tip:** You can paste captions directly into the Multi-Caption Combiner input, separated by commas:

```
Caption 1: A woman in a red dress dancing,
Caption 2: The woman spins with arms outstretched,
Caption 3: She completes the turn with a graceful pose
```

---

## Technical Notes

### Frame Extraction

- Frames are saved to a temporary directory within ComfyUI's temp directory (respects `--base-directory`)
- Frames are named with format: `frame_XXX_tY.YYs.png`
- PNG format preserves quality, JPG saves space
- Timestamps are calculated from frame number and FPS

### Caption Combining

- Uses Gemini API with retry logic (3 attempts, 5s delay)
- Temperature: 0.7, Top-p: 0.95 for balanced creativity
- Supports both comma-separated and newline-separated captions
- Timestamps are optional but recommended for temporal context

### Media Selection

- Reddit media is downloaded to temporary files
- Videos are trimmed using ffmpeg (copy codec first, re-encode as fallback)
- All metadata is extracted using OpenCV for consistency

---

## Troubleshooting

### "No frames extracted"

- Check that video_path is valid
- Verify video is not corrupted
- Ensure extraction window (start_time/end_time) is valid

### "Gemini API error"

- Verify API key is correct
- Check internet connection
- Try again (automatic retry logic included)
- Consider rate limits if making many requests

### "Reddit download failed"

- Check Reddit URL is valid
- Some Reddit videos require special handling (RedGifs, Gfycat)
- Try different post or subreddit

### "Video trimming failed"

- Ensure ffmpeg is installed: `ffmpeg -version`
- Check video format is supported
- Try with re-encoding enabled

---

## Future Enhancements

Potential improvements for future versions:

- [ ] Batch processing utility for multiple frames through single-image nodes
- [ ] Key frame detection using scene change analysis
- [ ] Motion analysis for intelligent frame selection
- [ ] Frame caching to avoid re-extraction
- [ ] Visual preview of extracted frames
- [ ] Support for image sequences as input
- [ ] Advanced timestamp interpolation

---

## API Reference

### MediaSelection.select_media()

```python
def select_media(
    media_source: str,
    media_type: str,
    seed: int,
    media_path: str = "",
    uploaded_image_file: str = "",
    uploaded_video_file: str = "",
    reddit_url: str = "",
    subreddit_url: str = "",
    max_duration: float = 0.0
) -> Tuple[str, str, str, int, int, float, float]
```

### FrameExtractor.extract_frames()

```python
def extract_frames(
    video_path: str,
    num_frames: int,
    extraction_method: str,
    seed: int = 0,
    start_time: float = 0.0,
    end_time: float = 0.0,
    output_format: str = "png"
) -> Tuple[str, str, str]
```

### MultiCaptionCombiner.combine_captions()

```python
def combine_captions(
    captions: str,
    gemini_api_key: str,
    gemini_model: str,
    combination_style: str,
    timestamps: str = "",
    custom_prompt: str = "",
    output_format: str = "Paragraph"
) -> Tuple[str, str]
```

---

## License

This module is part of the ComfyUI Swiss Army Knife extension and follows the same license.

## Support

For issues, feature requests, or questions:

- GitHub Issues: [ComfyUI-SwissArmyKnife](https://github.com/sammykumar/ComfyUI-SwissArmyKnife)
- Documentation: See `/docs/nodes/media-selection/OVERVIEW.md`

---

**Version:** 1.0.0  
**Last Updated:** October 8, 2025  
**Author:** ComfyUI Swiss Army Knife Team
