# Example Workflow: NSFW Action Description with JoyCaption

This is a step-by-step guide for creating a workflow that uses the new Media Selection nodes with JoyCaption.

## Workflow Diagram

```
Media Selection → Frame Extractor → JoyCaption (×3) → Multi-Caption Combiner → Media Describe
```

## Step-by-Step Setup

### Step 1: Add Media Selection Node

1. Add node: **Media Selection**
2. Configure:
    - `media_source`: "Reddit Post" (or your preferred source)
    - `media_type`: "video"
    - `seed`: 12345
    - `reddit_url`: "https://www.reddit.com/r/..." (your video URL)
    - `max_duration`: 10.0 (optional, limits video length)

### Step 2: Add Frame Extractor Node

1. Add node: **Frame Extractor**
2. Connect: Media Selection's `media_path` → Frame Extractor's `video_path`
3. Configure:
    - `num_frames`: 3
    - `extraction_method`: "Evenly Spaced"
    - `output_format`: "png"

### Step 3: Extract Frame Paths

The Frame Extractor outputs frame paths as a comma-separated string. You'll need to manually process each frame through JoyCaption.

**Manual Method:**

1. Run the workflow up to Frame Extractor
2. Check the console output or node info to see frame paths
3. Note the three frame file paths

**Example output:**

```
<comfyui_temp>/comfyui_frames/frames_<video_filename>_<hash>/frame_000_t0.83s.png
<comfyui_temp>/comfyui_frames/frames_<video_filename>_<hash>/frame_001_t2.50s.png
<comfyui_temp>/comfyui_frames/frames_<video_filename>_<hash>/frame_002_t4.17s.png
```

**Note**: The temp directory respects ComfyUI's `--base-directory` and `--temp-directory` flags.

### Step 4: Process Frames with JoyCaption

For each frame:

1. Add node: **JoyCaption GGUF** (add 3 nodes total, one per frame)
2. Configure each node:
    - Load the frame image (you may need to manually load each extracted frame)
    - Set processing mode: "Descriptive"
    - Set caption length: "any"
3. Note: You'll need to manually provide each frame path to JoyCaption nodes

**Alternative:** If available, use a batch processing node to process all frames at once.

### Step 5: Collect Captions

Collect the output from each JoyCaption node:

**Example captions:**

```
Frame 1: A woman in a red dress dancing, her arms at her sides, body slightly leaning forward
Frame 2: A woman in a red dress mid-spin, arms extended outward for balance, hair flowing
Frame 3: A woman in a red dress completing a turn, arms gracefully positioned, pose elegant
```

### Step 6: Add Multi-Caption Combiner Node

1. Add node: **Multi-Caption Combiner**
2. Configure:
    - `captions`: Paste the three captions (comma or newline-separated)
    - `gemini_api_key`: Your Gemini API key
    - `gemini_model`: "models/gemini-2.0-flash-exp"
    - `combination_style`: "Action Summary"
    - `timestamps`: "0.83,2.50,4.17" (from Frame Extractor output)
    - `output_format`: "Paragraph"

**Captions input example:**

```
A woman in a red dress dancing, her arms at her sides, body slightly leaning forward,
A woman in a red dress mid-spin, arms extended outward for balance, hair flowing,
A woman in a red dress completing a turn, arms gracefully positioned, pose elegant
```

### Step 7: Add Media Describe - Overrides Node

1. Add node: **Media Describe - Overrides**
2. Connect: Multi-Caption Combiner's `combined_caption` → Overrides' `override_movement` input
3. Configure other overrides as needed (leave empty for Gemini to generate)

### Step 8: Add Media Describe Node

1. Add node: **Media Describe**
2. Connect:
    - Media Selection's `media_path` → Media Describe's `uploaded_video_file` (or use the path directly)
    - Gemini Util - Options node → Media Describe's `gemini_options`
    - Media Describe - Overrides → Media Describe's `overrides`
3. Configure:
    - `media_source`: "Upload Media" (since we already have the media)
    - `media_type`: "video"

### Step 9: Configure Gemini Options

1. Add node: **Gemini Util - Options**
2. Configure:
    - `gemini_api_key`: Your Gemini API key
    - `gemini_model`: "models/gemini-2.5-flash"
    - `model_type`: "Text2Image" (or your preferred type)
    - `describe_subject`: Yes
    - `describe_clothing`: Yes
    - `describe_bokeh`: Yes
    - etc.

### Step 10: Run the Workflow

1. Execute the workflow
2. The final output will combine:
    - **Movement** (from JoyCaption via Multi-Caption Combiner)
    - **Subject, Clothing, Scene, Aesthetic** (from Gemini via Media Describe)

## Expected Output

The final description will be structured like:

```
SUBJECT:
A woman with flowing dark hair styled in loose waves...

CLOTHING:
She wears a vibrant red dress with a fitted bodice and flowing skirt...

SCENE:
The setting is a minimalist indoor space with soft lighting...

MOVEMENT (from JoyCaption):
The woman performs a graceful spinning dance. Initially standing with arms at her sides and body leaning slightly forward, she transitions into a mid-spin with arms extended outward for balance as her hair flows with the motion. The sequence concludes with her completing the turn in an elegant pose with arms gracefully positioned.

CINEMATIC AESTHETIC:
Soft, diffused lighting from the left creates a gentle glow...

STYLIZATION & TONE:
Cinematic realism with an elegant, contemporary aesthetic...
```

## Workflow Tips

### Optimizing for Speed

- Use shorter videos (max_duration: 5-10 seconds)
- Extract fewer frames (num_frames: 3)
- Use faster Gemini models

### Improving Quality

- Extract more frames (num_frames: 5-7)
- Use "Random" extraction method for diverse sampling
- Provide detailed custom prompts to Multi-Caption Combiner

### Handling Different Content

- For fast action: Use "Chronological Narrative" combination style
- For dance/movement: Use "Movement Flow" combination style
- For general scenes: Use "Action Summary" combination style

## Troubleshooting

### Issue: Frame extraction fails

- Check video path is correct
- Verify video is not corrupted
- Try shorter duration

### Issue: JoyCaption doesn't accept frames

- Ensure frames are saved as images (PNG/JPG)
- Check frame paths in console output
- May need to manually load images into ComfyUI

### Issue: Captions don't combine well

- Try different combination styles
- Include timestamps for better temporal context
- Adjust custom prompt for specific needs

### Issue: Media Describe ignores override

- Verify override is connected to Media Describe node
- Check override field name matches (e.g., "override_movement")
- Ensure override text is not empty

## Alternative Workflows

### Workflow 2: Simple Frame Analysis

```
Media Selection → Frame Extractor → [Process frames individually]
```

Use this for analyzing specific frames without combining.

### Workflow 3: Multi-Source Comparison

```
Media Selection (source A) → Frame Extractor → Caption Combiner ┐
                                                                 ├→ Compare
Media Selection (source B) → Frame Extractor → Caption Combiner ┘
```

Compare different videos or sources.

## Next Steps

1. Save this workflow in ComfyUI
2. Test with different videos
3. Experiment with different combination styles
4. Adjust frame count and extraction methods
5. Fine-tune prompts for your specific use case

## Resources

- Full documentation: `/docs/nodes/media-selection/README.md`
- Node implementation: `/nodes/media_selection/`
- Test script: `/docs/nodes/media-selection/test_nodes.py`
