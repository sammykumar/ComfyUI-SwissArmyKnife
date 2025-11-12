# MediaSelection

Select images or videos from uploads, filesystem directories, or Reddit sources, optionally trimming/resizing them and returning the resolved path plus metadata for downstream nodes.

## Inputs

- `media_source` – choose Upload, Randomize from Path, Reddit Post, or Randomize from Subreddit.
- `media_type` – image or video (controls downstream handling).
- `seed` – forces deterministic randomization when sampling folders/subreddits.
- Optional fields: `media_path`, upload fields, Reddit/subreddit URLs, max duration, resize mode + dimensions.

## Outputs

- `media_path` – absolute path to the selected media.
- `media_type` – echoes the resolved type (image/video).
- `media_info` – JSON summary string (dimensions, duration, FPS, resize decisions).
- `height`, `width`, `duration`, `fps` – numeric metadata for chaining into VHS/analysis nodes.

## Usage Tips

1. Use “Randomize Media from Path” with different seeds to iterate through a dataset quickly.
2. “Auto (by orientation)” resize keeps common portrait/landscape sizes (832×480 or 480×832) without manual math.
3. When sourcing Reddit media, provide either a full URL or `r/subreddit`—the node handles downloads and temp storage.

## Additional Resources

- [Full documentation](docs/nodes/media-selection/MEDIA_SELECTION.md)
