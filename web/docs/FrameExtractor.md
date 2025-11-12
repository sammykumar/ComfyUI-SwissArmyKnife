# FrameExtractor

Extract frames from a video path using evenly spaced, random, or start/middle/end sampling so you can caption individual frames or feed them into other analysis nodes.

## Inputs

- `video_path` – absolute path from MediaSelection or another node.
- `num_frames` – number of frames to save (1–20).
- `extraction_method` – Evenly Spaced, Random, or Start/Middle/End.
- Optional: `seed` for random mode, `start_time`/`end_time` window, and `output_format` (`png` or `jpg`).

## Outputs

- `frame_paths` – comma-separated list of saved frame files.
- `frame_timestamps` – comma-separated timestamps (seconds) for each frame.
- `frame_info` – human-readable summary of extraction settings/results.
- `frames_directory` – folder containing the exported frames (useful for follow-up tooling).

## Usage Tips

1. Pair with MediaSelection’s `media_path` output to extract batches from trimmed clips.
2. Random mode honors the provided `seed`, so re-running with the same value reproduces identical frame sets.
3. The `frames_directory` lives in ComfyUI’s temp folder; clean it up when you are done with experimentation.

## Additional Resources

- [Full documentation](docs/nodes/media-selection/MEDIA_SELECTION.md#frame-extractor)
