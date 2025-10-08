# Media Selection & Frame Extraction Nodes

## Overview

This document outlines the design for splitting the current `Media Describe` node into more modular components to support advanced workflows with external captioning models like JoyCaption.

## Problem Statement

Currently, the `Media Describe` node combines three responsibilities:

1. **Media Selection** - Upload, randomize from path, download from Reddit
2. **Frame Extraction** - For videos, extracting frames to send to Gemini
3. **Description Generation** - Using Gemini to describe the media

This monolithic design makes it difficult to:

- Use external image captioning models (like JoyCaption) for specific aspects
- Process individual frames differently
- Combine multiple captioning sources
- Have fine-grained control over the workflow

### Specific Use Case

**NSFW Action Description with JoyCaption:**

1. Get a video clip from various sources (upload, random from folder, Reddit)
2. Extract 3-5 representative frames from the video
3. Send each frame individually to JoyCaption to get detailed action descriptions
4. Use Gemini to combine these frame captions into one cohesive "movement/action" description
5. Use Gemini on the full video to describe other aspects (subject, clothing, scene, aesthetic, etc.)
6. Combine everything into the final prompt

## Proposed Solution

Split the functionality into three new nodes:

### 1. Media Selection Node

**Purpose:** Handle all media input sources and basic processing, without any AI description.

**Inputs:**

- `media_source`: ["Upload Media", "Randomize Media from Path", "Reddit Post", "Randomize from Subreddit"]
- `media_type`: ["image", "video"]
- `seed`: (INT) For randomization reproducibility
- `media_path`: (STRING, optional) Directory path for randomization
- `uploaded_image_file`: (STRING, optional) Path to uploaded image
- `uploaded_video_file`: (STRING, optional) Path to uploaded video
- `reddit_url`: (STRING, optional) Reddit post URL
- `subreddit_url`: (STRING, optional) Subreddit URL for randomization
- `max_duration`: (FLOAT, optional) Maximum video duration in seconds

**Outputs:**

- `media_path`: (STRING) Absolute path to the selected/downloaded media file
- `media_type`: (STRING) "image" or "video" (detected/validated type)
- `media_info`: (STRING) Formatted information about the media (source, dimensions, duration, etc.)
- `height`: (INT) Media height
- `width`: (INT) Media width
- `duration`: (FLOAT) Duration in seconds (0 for images)
- `fps`: (FLOAT) Frames per second (0 for images)

**Functionality:**

- Reuse all existing media source logic from current `Media Describe` node
- Handle Upload, Randomize from Path, Reddit Post, Randomize from Subreddit
- Download and cache Reddit media
- Trim videos if `max_duration` is specified
- Return media path and metadata WITHOUT any AI processing

---

### 2. Frame Extractor Node

**Purpose:** Extract specific frames from a video as individual images.

**Inputs:**

- `video_path`: (STRING) Path to video file (from Media Selection node)
- `num_frames`: (INT, default=3) Number of frames to extract
- `extraction_method`: ["Evenly Spaced", "Random", "Key Frames", "Start/Middle/End"]
- `seed`: (INT, optional) For random extraction
- `start_time`: (FLOAT, optional) Start time in seconds for frame extraction window
- `end_time`: (FLOAT, optional) End time in seconds for frame extraction window
- `output_format`: (STRING, default="png") Output image format

**Outputs:**

- `frame_paths`: (LIST[STRING]) List of paths to extracted frame images
- `frame_timestamps`: (LIST[FLOAT]) Timestamps (in seconds) of each extracted frame
- `frame_info`: (STRING) Formatted information about extracted frames

**Functionality:**

- Open video using OpenCV
- Extract frames based on selected method:
    - **Evenly Spaced**: Divide video duration by num_frames, extract at those intervals
    - **Random**: Randomly select frames (with seed for reproducibility)
    - **Key Frames**: Use OpenCV to detect scene changes/key frames
    - **Start/Middle/End**: Extract one frame from start, middle, and end
- Save frames as individual image files (PNG/JPG)
- Support extraction window (start_time to end_time) for partial video processing
- Return list of frame paths for further processing

**Example Usage:**

```
Video (5 seconds) -> Frame Extractor (num_frames=3, method="Evenly Spaced")
-> Frames at: [0.5s, 2.5s, 4.5s]
```

---

### 3. Multi-Caption Combiner Node

**Purpose:** Combine multiple image captions (e.g., from JoyCaption) into a single cohesive description using Gemini.

**Inputs:**

- `captions`: (LIST[STRING]) List of captions to combine
- `timestamps`: (LIST[FLOAT], optional) Timestamps corresponding to each caption
- `gemini_api_key`: (STRING) Gemini API key
- `gemini_model`: (STRING, default="gemini-2.5-flash") Gemini model to use
- `combination_style`: ["Chronological Narrative", "Action Summary", "Movement Flow", "Custom"]
- `custom_prompt`: (STRING, optional) Custom instruction for combining captions
- `output_format`: ["Paragraph", "Bullet Points", "Scene Description"]

**Outputs:**

- `combined_caption`: (STRING) The combined caption
- `gemini_status`: (STRING) API call status information

**Functionality:**

- Take multiple captions (e.g., from 3 frames processed by JoyCaption)
- Use Gemini to intelligently combine them into a cohesive description
- Support different combination styles:
    - **Chronological Narrative**: Describe the progression from first frame to last
    - **Action Summary**: Summarize the overall action/movement
    - **Movement Flow**: Focus on flow and transitions between poses
    - **Custom**: User-provided prompt template
- Include timestamps in the prompt to help Gemini understand temporal relationships
- Return a single, well-formatted description

**System Prompt Examples:**

For "Action Summary" style:

```
You are an expert at analyzing sequential video frame descriptions and synthesizing them into a cohesive action description.

Given the following frame descriptions from a video clip:
- Frame 1 (0.5s): {caption_1}
- Frame 2 (2.5s): {caption_2}
- Frame 3 (4.5s): {caption_3}

Create a single paragraph that describes the overall movement and action occurring in this video. Focus on:
1. The primary action being performed
2. Body part movements and positions
3. Progression and flow of movement over time
4. Any notable transitions or changes

Be specific about body movements, gestures, and positioning. Include NSFW actions if present in the descriptions.
```

---

### 4. Modified Media Describe Node (Optional)

This could be a simplified version that:

- Takes a media path directly (no source selection)
- Optionally accepts override inputs for specific paragraphs (like "movement" from the Multi-Caption Combiner)
- Focuses purely on Gemini description

OR we keep the existing `Media Describe` node as-is for backward compatibility and simple use cases.

---

## Proposed Workflow

### Workflow 1: NSFW Action Description with JoyCaption

```
┌─────────────────────┐
│  Media Selection    │
│  - Source: Reddit   │
│  - Type: Video      │
└──────────┬──────────┘
           │ video_path
           ▼
┌─────────────────────┐
│  Frame Extractor    │
│  - Frames: 3        │
│  - Method: Evenly   │
└──────────┬──────────┘
           │ frame_paths (3 images)
           ▼
┌─────────────────────┐
│   JoyCaption GGUF   │ (process each frame)
│  - Frame 1 -> Cap 1 │
│  - Frame 2 -> Cap 2 │
│  - Frame 3 -> Cap 3 │
└──────────┬──────────┘
           │ captions (3 descriptions)
           ▼
┌─────────────────────┐
│ Multi-Caption       │
│ Combiner            │
│ - Style: Action     │
└──────────┬──────────┘
           │ combined_caption (movement/action)
           ▼
┌─────────────────────┐
│ Media Describe      │
│ - Overrides:        │
│   movement: ^^^^^   │
│ - Describes other   │
│   aspects (subject, │
│   scene, aesthetic) │
└──────────┬──────────┘
           │ final_description
           ▼
```

### Workflow 2: Simple Image Description (Backward Compatible)

```
┌─────────────────────┐
│  Media Selection    │
│  - Source: Upload   │
│  - Type: Image      │
└──────────┬──────────┘
           │ media_path
           ▼
┌─────────────────────┐
│  Media Describe     │
│  (Full description) │
└──────────┬──────────┘
           │ final_description
           ▼
```

---

## Implementation Considerations

### 1. Frame Extractor Technical Details

**Frame Extraction Strategy:**

- Use OpenCV `cv2.VideoCapture` to read video
- Calculate frame positions based on extraction method
- Use `cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)` to seek
- Save frames to temporary directory with unique names
- Clean up temporary frames on node completion (optional, configurable)

**Memory Management:**

- Process frames one at a time to avoid loading entire video into memory
- Use temporary files instead of keeping frames in memory
- Provide option to cache extracted frames for re-use

### 2. Multi-Caption Combiner Technical Details

**Prompt Engineering:**

- Template-based prompts with placeholders for captions and timestamps
- Support different combination strategies via prompt templates
- Allow users to see/edit the system prompt (advanced option)

**Gemini API:**

- Reuse existing retry logic from `_call_gemini_with_retry`
- Support configurable Gemini models
- Cache combined results based on input caption hash

### 3. Backward Compatibility

**Option A: Keep existing Media Describe as-is**

- Create new nodes alongside existing one
- Users can choose simple workflow (current node) or advanced workflow (new nodes)

**Option B: Refactor Media Describe internally**

- Make Media Describe use Media Selection internally
- Add optional input for "skip media selection" mode
- More complex but cleaner architecture

**Recommendation:** Option A for faster implementation and safer backward compatibility.

### 4. Data Flow Optimization

**Challenge:** JoyCaption processes images one at a time, so we need to handle the list of frames.

**Solutions:**

1. **Batch Processing Node** - Create a utility node that takes a list of images and processes them through JoyCaption one by one, collecting results
2. **Manual Loop** - User creates 3 separate JoyCaption nodes (simple but tedious)
3. **Python Script Node** - Advanced users can write custom loops

**Recommendation:** Create a "Batch Image Processor" utility node that can work with any image processing node.

---

## Node File Structure

```
nodes/
├── media_describe/
│   ├── __init__.py
│   ├── mediia_describe.py (existing, keep as-is)
│   ├── media_describe_overrides.py (existing)
│   ├── gemini_util_options.py (existing)
│   └── prompt_breakdown.py (existing)
├── media_selection/
│   ├── __init__.py
│   ├── media_selection.py (NEW - Media Selection node)
│   ├── frame_extractor.py (NEW - Frame Extractor node)
│   └── multi_caption_combiner.py (NEW - Multi-Caption Combiner node)
└── utils/
    └── batch_processor.py (NEW - Optional batch processing utility)
```

---

## Next Steps

### Phase 1: Core Nodes

1. [ ] Create `Media Selection` node
    - Extract media source logic from `Media Describe`
    - Test with all source types (upload, randomize, Reddit)
    - Validate outputs match expected format

2. [ ] Create `Frame Extractor` node
    - Implement OpenCV frame extraction
    - Test different extraction methods
    - Validate output image quality

3. [ ] Create `Multi-Caption Combiner` node
    - Implement Gemini API integration
    - Create prompt templates for different combination styles
    - Test with sample captions

### Phase 2: Integration & Testing

4. [ ] Test complete workflow with JoyCaption
    - Validate frame extraction -> JoyCaption -> Combiner -> Media Describe pipeline
    - Test with various video sources
    - Benchmark performance

5. [ ] Create documentation and examples
    - Write user guide for new workflow
    - Create example workflows for common use cases
    - Document limitations and best practices

### Phase 3: Polish

6. [ ] Add batch processing utilities (if needed)
7. [ ] Performance optimization
8. [ ] Add advanced features (caching, parallel processing, etc.)

---

## Open Questions

1. **Frame Extraction Count:** Should we support variable number of frames (3-10) or fixed?
    - **Answer:** Variable with default of 3, max of 10 for practical purposes

2. **Temporary File Cleanup:** Should extracted frames be automatically deleted?
    - **Answer:** Configurable option - auto-cleanup by default, but allow caching for debugging

3. **JoyCaption Integration:** Should we create a JoyCaption wrapper node or rely on existing implementations?
    - **Answer:** Use existing JoyCaption nodes, focus on compatibility

4. **Media Describe Modification:** Should we modify the existing node or keep it as-is?
    - **Answer:** Keep existing node for backward compatibility, create new streamlined version if needed

5. **Batch Processing:** How to handle processing multiple frames through single-image nodes?
    - **Answer:** Create utility batch processor node or document manual duplication approach

---

## Success Criteria

The implementation will be considered successful when:

1. ✅ User can extract 3 frames from a video
2. ✅ User can process each frame through JoyCaption
3. ✅ User can combine JoyCaption outputs into one action description via Gemini
4. ✅ User can use combined action description as override in Media Describe
5. ✅ Final output includes JoyCaption-based action + Gemini-based other descriptions
6. ✅ Workflow is reproducible with seed control
7. ✅ Existing workflows using current Media Describe node continue to work

---

## Alternative Approaches Considered

### Alternative 1: Single "Smart" Node

Create one mega-node that detects when JoyCaption output is provided and automatically uses it.

**Pros:**

- Simpler for users
- Less node clutter

**Cons:**

- Complex internal logic
- Less flexible
- Harder to debug
- Doesn't follow Unix philosophy (do one thing well)

### Alternative 2: Full Video -> Frame Splitter

Instead of Frame Extractor, create a node that takes video and outputs multiple parallel streams.

**Pros:**

- More aligned with ComfyUI's parallel processing model

**Cons:**

- More complex to implement
- Harder to control frame count dynamically
- May not be necessary for this use case

**Decision:** Stick with proposed modular approach for clarity and flexibility.

---

## Resources & References

- [ComfyUI Custom Node Development](https://github.com/comfyanonymous/ComfyUI)
- [OpenCV Frame Extraction](https://docs.opencv.org/4.x/d8/dfe/classcv_1_1VideoCapture.html)
- [JoyCaption Model](https://huggingface.co/spaces/fancyfeast/joy-caption-alpha-two)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

## Version History

- **v0.1** (2025-10-08): Initial requirements documentation
