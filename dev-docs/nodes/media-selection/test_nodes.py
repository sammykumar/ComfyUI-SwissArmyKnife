#!/usr/bin/env python3
"""
Quick sanity test for the Media Selection node.

Run from the repository root (after activating the venv) to ensure the node
can consume a local file and emit metadata without throwing exceptions.
"""

import os

def test_media_selection(test_media_path: str):
    """Smoke test for Media Selection."""
    from nodes.media_selection.media_selection import MediaSelection

    if not os.path.exists(test_media_path):
        raise FileNotFoundError(f"Test media not found: {test_media_path}")

    node = MediaSelection()

    result = node.select_media(
        media_source="Upload Media",
        media_type="video",
        seed=0,
        uploaded_video_file=os.path.basename(test_media_path),
        max_duration=3.0,
    )

    media_path, media_type, media_info, height, width, duration, fps = result

    print("✅ Media Selection Success")
    print(f"media_path: {media_path}")
    print(f"media_type: {media_type}")
    print(f"dimensions: {width}x{height}")
    print(f"duration/fps: {duration}/{fps}")
    print("media_info:")
    print(media_info)

if __name__ == "__main__":
    SAMPLE_VIDEO = "/path/to/sample.mp4"
    test_media_selection(SAMPLE_VIDEO)
