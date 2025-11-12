#!/usr/bin/env python3
"""
Test script for Media Selection and Frame Extraction nodes.

This script demonstrates how the new nodes work and can be used for testing.
Run this from the ComfyUI root directory or ensure the module path is correct.
"""

import os

# Add the extension to path (adjust as needed for your setup)
# sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

def test_media_selection():
    """Test the Media Selection node."""
    print("=" * 60)
    print("Testing Media Selection Node")
    print("=" * 60)

    from nodes.media_selection.media_selection import MediaSelection

    node = MediaSelection()

    # Test with a local video file (adjust path as needed)
    test_video_path = "/path/to/test/video.mp4"  # Update this

    if not os.path.exists(test_video_path):
        print(f"⚠️  Test video not found: {test_video_path}")
        print("Please update test_video_path in the script to point to a real video file")
        return None

    try:
        # Simulate upload media
        result = node.select_media(
            media_source="Upload Media",
            media_type="video",
            seed=0,
            uploaded_video_file=os.path.basename(test_video_path),
            max_duration=5.0
        )

        media_path, media_type, media_info, height, width, duration, fps = result

        print("✅ Media Selection Success!")
        print(f"   Media Path: {media_path}")
        print(f"   Media Type: {media_type}")
        print(f"   Dimensions: {width}x{height}")
        print(f"   Duration: {duration:.2f}s")
        print(f"   FPS: {fps:.2f}")
        print(f"\nMedia Info:\n{media_info}")

        return media_path

    except Exception as e:
        print(f"❌ Media Selection Failed: {e}")
        return None


def test_frame_extractor(video_path):
    """Test the Frame Extractor node."""
    print("\n" + "=" * 60)
    print("Testing Frame Extractor Node")
    print("=" * 60)

    from nodes.media_selection.frame_extractor import FrameExtractor

    node = FrameExtractor()

    try:
        result = node.extract_frames(
            video_path=video_path,
            num_frames=3,
            extraction_method="Evenly Spaced",
            seed=0,
            output_format="png"
        )

        frame_paths_str, frame_timestamps_str, frame_info = result

        frame_paths = frame_paths_str.split(',')
        frame_timestamps = frame_timestamps_str.split(',')

        print("✅ Frame Extraction Success!")
        print(f"   Extracted {len(frame_paths)} frames")
        print(f"\n{frame_info}")

        print("\nExtracted Frames:")
        for i, (path, ts) in enumerate(zip(frame_paths, frame_timestamps)):
            print(f"   {i + 1}. {os.path.basename(path)} @ {ts}s")

        return frame_paths

    except Exception as e:
        print(f"❌ Frame Extraction Failed: {e}")
        return None


def test_caption_combiner():
    """Test the Multi-Caption Combiner node."""
    print("\n" + "=" * 60)
    print("Testing Multi-Caption Combiner Node")
    print("=" * 60)

    from nodes.media_selection.multi_caption_combiner import MultiCaptionCombiner

    node = MultiCaptionCombiner()

    # Sample captions (simulating AI model output)
    sample_captions = """A woman in a red dress stands with arms at her sides,
A woman in a red dress spins with arms outstretched to the sides,
A woman in a red dress completes the turn with a graceful pose"""

    sample_timestamps = "0.5,2.5,4.5"

    # You need to set your Gemini API key
    gemini_api_key = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")

    if gemini_api_key == "YOUR_API_KEY_HERE":
        print("⚠️  No Gemini API key found!")
        print("Set the GEMINI_API_KEY environment variable to test this node:")
        print("   export GEMINI_API_KEY='your-api-key-here'")
        return None

    try:
        result = node.combine_captions(
            captions=sample_captions,
            gemini_api_key=gemini_api_key,
            gemini_model="models/gemini-2.0-flash-exp",
            combination_style="Action Summary",
            timestamps=sample_timestamps,
            output_format="Paragraph"
        )

        combined_caption, gemini_status = result

        print("✅ Caption Combining Success!")
        print(f"\n{gemini_status}")
        print("\nCombined Caption:")
        print(f"   {combined_caption}")

        return combined_caption

    except Exception as e:
        print(f"❌ Caption Combining Failed: {e}")
        return None


def main():
    """Run all tests."""
    print("\n" + "🔪" * 30)
    print("ComfyUI Swiss Army Knife - Media Selection Nodes Test")
    print("🔪" * 30 + "\n")

    # Test 1: Media Selection
    video_path = test_media_selection()

    # Test 2: Frame Extraction (only if media selection succeeded)
    if video_path:
        frame_paths = test_frame_extractor(video_path)
    else:
        print("\n⏭️  Skipping Frame Extraction test (no video available)")
        frame_paths = None

    # Test 3: Caption Combining (works independently)
    combined_caption = test_caption_combiner()

    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print(f"Media Selection:      {'✅ PASS' if video_path else '❌ FAIL'}")
    print(f"Frame Extraction:     {'✅ PASS' if frame_paths else '❌ FAIL or SKIPPED'}")
    print(f"Caption Combining:    {'✅ PASS' if combined_caption else '❌ FAIL or SKIPPED'}")
    print("=" * 60)

    print("\n✨ Testing complete!")
    print("\nNext steps:")
    print("1. Update test_video_path in this script to point to a real video")
    print("2. Set GEMINI_API_KEY environment variable for caption combining")
    print("3. Run the script again to test all functionality")
    print("4. Try the nodes in ComfyUI with the workflow from README.md")


if __name__ == "__main__":
    main()
