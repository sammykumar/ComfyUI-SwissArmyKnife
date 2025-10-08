# 🔪 Media Selection Nodes - Quick Reference

## Node Overview

| Node                       | Purpose                        | Key Outputs             |
| -------------------------- | ------------------------------ | ----------------------- |
| **Media Selection**        | Get media from various sources | media_path, metadata    |
| **Frame Extractor**        | Extract frames from video      | frame_paths, timestamps |
| **Multi-Caption Combiner** | Combine captions with Gemini   | combined_caption        |

---

## Media Selection

**Inputs:**

```
media_source: Upload | Randomize | Reddit | Subreddit
media_type: image | video
seed: INT (for randomization)
max_duration: FLOAT (video only, 0 = full)
```

**Outputs:**

```
media_path → Full path to media file
media_type → Validated type (image/video)
media_info → Formatted info string
height, width → Dimensions in pixels
duration, fps → Video metadata (0 for images)
```

**Example:**

```
Source: "Reddit Post"
URL: "https://reddit.com/r/videos/xyz"
Max Duration: 10.0
→ Returns trimmed video path + metadata
```

---

## Frame Extractor

**Inputs:**

```
video_path: STRING (from Media Selection)
num_frames: INT (1-20, default 3)
extraction_method: Evenly Spaced | Random | Start/Middle/End
seed: INT (for Random method)
start_time, end_time: FLOAT (extraction window)
output_format: png | jpg
```

**Outputs:**

```
frame_paths → "path1,path2,path3"
frame_timestamps → "0.83,2.50,4.17"
frame_info → Formatted extraction details
```

**Example:**

```
Video: 5 seconds
Method: Evenly Spaced
Frames: 3
→ Extracts at: 0.83s, 2.50s, 4.17s
```

---

## Multi-Caption Combiner

**Inputs:**

```
captions: STRING (comma or newline-separated)
gemini_api_key: STRING
gemini_model: STRING (default: gemini-2.0-flash-exp)
combination_style: Action Summary | Chronological | Movement Flow | Custom
timestamps: STRING (optional, "t1,t2,t3")
custom_prompt: STRING (for Custom style)
output_format: Paragraph | Bullet Points | Scene Description
```

**Outputs:**

```
combined_caption → Single cohesive description
gemini_status → API status info
```

**Example:**

```
Captions:
  "Woman dancing with arms down,
   Woman spinning with arms out,
   Woman posing gracefully"
Style: Action Summary
→ "A woman performs a graceful dance..."
```

---

## Common Workflows

### Workflow 1: Basic Frame Extraction

```
Media Selection → Frame Extractor
```

Use case: Extract specific frames for analysis

### Workflow 2: JoyCaption Action Description

```
Media Selection → Frame Extractor → JoyCaption (×3) → Multi-Caption Combiner
```

Use case: Detailed NSFW action descriptions

### Workflow 3: Complete Video Description

```
Media Selection → Frame Extractor → JoyCaption (×3) → Multi-Caption Combiner
                      ↓
                Media Describe (with movement override)
```

Use case: Full prompt with JoyCaption actions + Gemini aesthetics

---

## Quick Tips

### 🎯 For Best Results

**Frame Extraction:**

- Use "Evenly Spaced" for overall motion capture
- Use "Random" for diverse sampling
- Use "Start/Middle/End" for key moments
- Set extraction window for specific video sections

**Caption Combining:**

- Include timestamps for temporal context
- "Action Summary" → overall movement
- "Chronological" → step-by-step progression
- "Movement Flow" → rhythm and continuity
- Custom → your own prompt template

**Media Selection:**

- Use seed for reproducible random selection
- Set max_duration to avoid API limits
- Reddit videos auto-trim if large

### ⚡ Performance

**Fast:**

- 3 frames, Evenly Spaced
- PNG format (high quality)
- max_duration: 5-10s

**Quality:**

- 5-7 frames, Random
- Include timestamps
- Detailed custom prompts

### 🐛 Troubleshooting

| Issue                 | Solution                               |
| --------------------- | -------------------------------------- |
| No frames extracted   | Check video path, try shorter duration |
| Gemini error          | Verify API key, check internet         |
| Reddit download fails | Check URL, try different post          |
| Video trim fails      | Install ffmpeg: `brew install ffmpeg`  |

---

## API Quick Reference

### MediaSelection.select_media()

```python
select_media(
    media_source: str,      # Upload|Randomize|Reddit|Subreddit
    media_type: str,        # image|video
    seed: int,              # For randomization
    media_path: str = "",   # Directory for randomization
    uploaded_image_file: str = "",
    uploaded_video_file: str = "",
    reddit_url: str = "",
    subreddit_url: str = "",
    max_duration: float = 0.0
) → (media_path, media_type, media_info, h, w, dur, fps)
```

### FrameExtractor.extract_frames()

```python
extract_frames(
    video_path: str,        # Video file path
    num_frames: int,        # 1-20
    extraction_method: str, # Evenly|Random|Start/Middle/End
    seed: int = 0,
    start_time: float = 0.0,
    end_time: float = 0.0,
    output_format: str = "png"
) → (frame_paths, timestamps, frame_info)
```

### MultiCaptionCombiner.combine_captions()

```python
combine_captions(
    captions: str,          # Comma or newline-separated
    gemini_api_key: str,
    gemini_model: str,
    combination_style: str, # Action|Chronological|Movement|Custom
    timestamps: str = "",
    custom_prompt: str = "",
    output_format: str = "Paragraph"
) → (combined_caption, gemini_status)
```

---

## Environment Setup

```bash
# Required
pip install opencv-python pillow google-generativeai

# For video trimming
brew install ffmpeg  # macOS
apt install ffmpeg   # Linux

# Gemini API key
export GEMINI_API_KEY="your-key-here"
```

---

## File Locations

```
nodes/media_selection/
├── __init__.py
├── media_selection.py        # Media Selection node
├── frame_extractor.py         # Frame Extractor node
└── multi_caption_combiner.py  # Multi-Caption Combiner

docs/nodes/media-selection/
├── OVERVIEW.md               # Design document
├── README.md                 # Full documentation
├── WORKFLOW_EXAMPLE.md       # Step-by-step guide
├── IMPLEMENTATION_SUMMARY.md # Implementation details
├── QUICK_REFERENCE.md        # This file
└── test_nodes.py            # Test script
```

---

## Example Workflow

```
1. Media Selection
   - Source: Reddit Post
   - URL: https://reddit.com/r/videos/abc123
   - Max Duration: 10s
   ↓ media_path

2. Frame Extractor
   - Frames: 3
   - Method: Evenly Spaced
   - Format: PNG
   ↓ frame_paths: "f1.png,f2.png,f3.png"

3. JoyCaption (process each frame manually)
   - Frame 1 → Caption 1
   - Frame 2 → Caption 2
   - Frame 3 → Caption 3

4. Multi-Caption Combiner
   - Captions: "cap1,cap2,cap3"
   - Timestamps: "0.8,2.5,4.2"
   - Style: Action Summary
   ↓ combined_caption: "A woman dances..."

5. Media Describe - Overrides
   - movement: [combined_caption]

6. Media Describe
   - Uses video + overrides
   ↓ Final description with JoyCaption actions
```

---

## Support

- 📖 Full docs: `docs/nodes/media-selection/README.md`
- 🧪 Test: `docs/nodes/media-selection/test_nodes.py`
- 🐛 Issues: GitHub Issues
- 💬 Questions: Project discussions

---

**Version:** 1.0.0  
**Last Updated:** October 8, 2025

🔪 Happy prompting!
