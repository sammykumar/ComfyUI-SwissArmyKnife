#!/usr/bin/env python3
"""
Test script for Media Selection and Frame Extraction nodes.

This script demonstrates how the new nodes work and can be used for testing.
Run this from the ComfyUI root directory or ensure the module path is correct.
"""

import sys
import os
from nodes.debug_utils import setup_logging, get_logger

setup_logging()
logger = get_logger(__name__)

# Add the extension to path (adjust as needed for your setup)
# sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

def test_media_selection():
    """Test the Media Selection node."""
    logger.info("=" * 60)
    logger.info("Testing Media Selection Node")
    logger.info("=" * 60)
    
    from nodes.media_selection.media_selection import MediaSelection
    
    node = MediaSelection()
    
    # Test with a local video file (adjust path as needed)
    test_video_path = "/path/to/test/video.mp4"  # Update this
    
    if not os.path.exists(test_video_path):
        logger.warning(f"⚠️  Test video not found: {test_video_path}")
        logger.warning("Please update test_video_path in the script to point to a real video file")
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
        
        logger.info(f"✅ Media Selection Success!")
        logger.info(f"   Media Path: {media_path}")
        logger.info(f"   Media Type: {media_type}")
        logger.info(f"   Dimensions: {width}x{height}")
        logger.info(f"   Duration: {duration:.2f}s")
        logger.info(f"   FPS: {fps:.2f}")
        logger.info(f"\nMedia Info:\n{media_info}")
        
        return media_path
        
    except Exception as e:
        logger.error(f"❌ Media Selection Failed: {e}")
        return None


def test_frame_extractor(video_path):
    """Test the Frame Extractor node."""
    logger.info("\n" + "=" * 60)
    logger.info("Testing Frame Extractor Node")
    logger.info("=" * 60)
    
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
        
        logger.info(f"✅ Frame Extraction Success!")
        logger.info(f"   Extracted {len(frame_paths)} frames")
        logger.info(f"\n{frame_info}")
        
        logger.info(f"\nExtracted Frames:")
        for i, (path, ts) in enumerate(zip(frame_paths, frame_timestamps)):
            logger.info(f"   {i + 1}. {os.path.basename(path)} @ {ts}s")
        
        return frame_paths
        
    except Exception as e:
        logger.error(f"❌ Frame Extraction Failed: {e}")
        return None


def test_caption_combiner():
    """Test the Multi-Caption Combiner node."""
    logger.info("\n" + "=" * 60)
    logger.info("Testing Multi-Caption Combiner Node")
    logger.info("=" * 60)
    
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
        logger.warning("⚠️  No Gemini API key found!")
        logger.warning("Set the GEMINI_API_KEY environment variable to test this node:")
        logger.warning("   export GEMINI_API_KEY='your-api-key-here'")
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
        
        logger.info(f"✅ Caption Combining Success!")
        logger.info(f"\n{gemini_status}")
        logger.info(f"\nCombined Caption:")
        logger.info(f"   {combined_caption}")
        
        return combined_caption
        
    except Exception as e:
        logger.error(f"❌ Caption Combining Failed: {e}")
        return None


def main():
    """Run all tests."""
    logger.info("\n" + "🔪" * 30)
    logger.info("ComfyUI Swiss Army Knife - Media Selection Nodes Test")
    logger.info("🔪" * 30 + "\n")
    
    # Test 1: Media Selection
    video_path = test_media_selection()
    
    # Test 2: Frame Extraction (only if media selection succeeded)
    if video_path:
        frame_paths = test_frame_extractor(video_path)
    else:
        logger.info("\n⏭️  Skipping Frame Extraction test (no video available)")
        frame_paths = None
    
    # Test 3: Caption Combining (works independently)
    combined_caption = test_caption_combiner()
    
    # Summary
    logger.info("\n" + "=" * 60)
    logger.info("Test Summary")
    logger.info("=" * 60)
    logger.info(f"Media Selection:      {'✅ PASS' if video_path else '❌ FAIL'}")
    logger.info(f"Frame Extraction:     {'✅ PASS' if frame_paths else '❌ FAIL or SKIPPED'}")
    logger.info(f"Caption Combining:    {'✅ PASS' if combined_caption else '❌ FAIL or SKIPPED'}")
    logger.info("=" * 60)
    
    logger.info("\n✨ Testing complete!")
    print("\nNext steps:")
    logger.info("1. Update test_video_path in this script to point to a real video")
    logger.info("2. Set GEMINI_API_KEY environment variable for caption combining")
    logger.info("3. Run the script again to test all functionality")
    logger.info("4. Try the nodes in ComfyUI with the workflow from README.md")


if __name__ == "__main__":
    main()
