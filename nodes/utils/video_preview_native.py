"""
Video Preview Node (Native) - Professional video comparison with Video.js
Uses Vue-based VIDEO_COMPARISON_WIDGET for side-by-side video comparison
"""
from typing import Dict, Any, Optional


class VideoPreviewNative:
    """
    A professional video preview node using Video.js for side-by-side comparison.
    Displays multiple video inputs with synchronized playback controls.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define input fields for the video preview node.
        Uses VIDEO_COMPARISON_WIDGET for professional video comparison with Video.js.
        """
        return {
            "required": {
                "video_widget": ("VIDEO_COMPARISON_WIDGET", {
                    "default": {},
                    "tooltip": "Professional video comparison widget with Video.js controls"
                }),
            },
            "optional": {
                # Optional video inputs (IMAGE tensors)
                "reference_video": ("IMAGE", {
                    "tooltip": "Reference video frames for comparison (typically the source/original)"
                }),
                "base_video": ("IMAGE", {
                    "tooltip": "Base processed video frames (e.g., after initial processing)"
                }),
                "upscaled_video": ("IMAGE", {
                    "tooltip": "Upscaled or enhanced video frames for comparison"
                }),
            },
        }

    RETURN_TYPES = ()  # No outputs - this is a display-only node
    FUNCTION = "preview_videos"
    CATEGORY = "Utils"
    OUTPUT_NODE = True  # Makes this an output node that displays in the UI

    def preview_videos(
        self,
        video_widget,
        reference_video: Optional[Any] = None,
        base_video: Optional[Any] = None,
        upscaled_video: Optional[Any] = None,
    ):
        """
        Display videos using the VIDEO_COMPARISON_WIDGET.

        Args:
            video_widget: The video comparison widget data from Vue component
            reference_video: Optional reference video frames (IMAGE)
            base_video: Optional base video frames (IMAGE)
            upscaled_video: Optional upscaled video frames (IMAGE)

        Returns:
            Dictionary with UI data for display
        """
        # Log summary to console
        print("\n" + "="*60)
        print("VIDEO PREVIEW (Native) - Vue Video.js Widget")
        print("="*60)
        print(f"Widget data: {video_widget}")

        # Process video inputs
        return self._preview_vue_comparison(reference_video, base_video, upscaled_video)

    def _preview_vue_comparison(
        self,
        reference_video: Optional[Any] = None,
        base_video: Optional[Any] = None,
        upscaled_video: Optional[Any] = None,
    ) -> Dict[str, Any]:
        """
        Vue comparison mode using IMAGE tensors for professional video comparison.

        Args:
            reference_video: Optional reference video frames
            base_video: Optional base video frames
            upscaled_video: Optional upscaled video frames

        Returns:
            Dictionary containing UI data for the Vue component
        """
        connected_videos = []
        video_data = {}

        # Check and log each video input
        if reference_video is not None:
            shape = (
                reference_video.shape if hasattr(reference_video, "shape") else "unknown"
            )
            print(f"📹 reference_video: Connected (shape: {shape})")
            connected_videos.append("reference")
            video_data["reference"] = self._process_video(reference_video, "reference")

        if base_video is not None:
            shape = base_video.shape if hasattr(base_video, "shape") else "unknown"
            print(f"📹 base_video: Connected (shape: {shape})")
            connected_videos.append("base")
            video_data["base"] = self._process_video(base_video, "base")

        if upscaled_video is not None:
            shape = (
                upscaled_video.shape if hasattr(upscaled_video, "shape") else "unknown"
            )
            print(f"📹 upscaled_video: Connected (shape: {shape})")
            connected_videos.append("upscaled")
            video_data["upscaled"] = self._process_video(upscaled_video, "upscaled")

        print(f"\n✅ Total videos connected: {len(connected_videos)}")
        print("=" * 60 + "\n")

        # Return UI data for the Vue component
        return {
            "ui": {
                "widget_type": "VIDEO_COMPARISON_WIDGET",
                "videos": video_data,
                "connected_videos": connected_videos,
                "video_count": len(connected_videos),
            }
        }

    def _process_video(self, video_frames: Any, video_type: str) -> Dict[str, Any]:
        """
        Process video frames and prepare metadata for display.

        Args:
            video_frames: Video frame data (IMAGE tensor)
            video_type: Type of video (reference, base, upscaled)

        Returns:
            Dictionary containing video metadata and path/URL
        """
        # This is a placeholder - in a real implementation, you would:
        # 1. Save the video frames to a temporary file
        # 2. Generate a URL accessible to the frontend
        # 3. Extract metadata (duration, resolution, fps, etc.)

        metadata = {
            "type": video_type,
            "url": None,  # This should be set to the actual video URL
            "shape": str(video_frames.shape) if hasattr(video_frames, "shape") else None,
        }

        return metadata


# Export node class mapping
VIDEO_PREVIEW_NATIVE_NODE_CLASS_MAPPINGS = {
    "VideoPreviewNative": VideoPreviewNative
}

# Export display name mapping
VIDEO_PREVIEW_NATIVE_NODE_DISPLAY_NAME_MAPPINGS = {
    "VideoPreviewNative": "🎬 Video Preview (Native)"
}
