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
                # Optional video inputs (VIDEO type - ComfyUI native)
                "reference_video": ("VIDEO", {
                    "tooltip": "Reference video for comparison (typically the source/original)"
                }),
                "base_video": ("VIDEO", {
                    "tooltip": "Base processed video (e.g., after initial processing)"
                }),
                "upscaled_video": ("VIDEO", {
                    "tooltip": "Upscaled or enhanced video for comparison"
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
            reference_video: Optional reference video (VIDEO type)
            base_video: Optional base video (VIDEO type)
            upscaled_video: Optional upscaled video (VIDEO type)

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
        Vue comparison mode using VIDEO type for professional video comparison.

        Args:
            reference_video: Optional reference video (VIDEO type)
            base_video: Optional base video (VIDEO type)
            upscaled_video: Optional upscaled video (VIDEO type)

        Returns:
            Dictionary containing UI data for the Vue component
        """
        connected_videos = []
        video_data = {}

        # Check and log each video input
        if reference_video is not None:
            # Get metadata for logging
            try:
                dims = reference_video.get_dimensions() if hasattr(reference_video, 'get_dimensions') else 'unknown'
                duration = reference_video.get_duration() if hasattr(reference_video, 'get_duration') else 'unknown'
                print(f"📹 reference_video: Connected (dimensions: {dims}, duration: {duration}s)")
            except:
                print(f"📹 reference_video: Connected")
            connected_videos.append("reference")
            video_data["reference"] = self._process_video(reference_video, "reference")

        if base_video is not None:
            try:
                dims = base_video.get_dimensions() if hasattr(base_video, 'get_dimensions') else 'unknown'
                duration = base_video.get_duration() if hasattr(base_video, 'get_duration') else 'unknown'
                print(f"📹 base_video: Connected (dimensions: {dims}, duration: {duration}s)")
            except:
                print(f"📹 base_video: Connected")
            connected_videos.append("base")
            video_data["base"] = self._process_video(base_video, "base")

        if upscaled_video is not None:
            try:
                dims = upscaled_video.get_dimensions() if hasattr(upscaled_video, 'get_dimensions') else 'unknown'
                duration = upscaled_video.get_duration() if hasattr(upscaled_video, 'get_duration') else 'unknown'
                print(f"📹 upscaled_video: Connected (dimensions: {dims}, duration: {duration}s)")
            except:
                print(f"📹 upscaled_video: Connected")
            connected_videos.append("upscaled")
            video_data["upscaled"] = self._process_video(upscaled_video, "upscaled")

        print(f"\n✅ Total videos connected: {len(connected_videos)}")
        print("=" * 60 + "\n")

        # Return UI data for the Vue component
        # NOTE: All values MUST be wrapped in lists for ComfyUI
        return {
            "ui": {
                "widget_type": ["VIDEO_COMPARISON_WIDGET"],
                "videos": [video_data],
                "connected_videos": [connected_videos],
                "video_count": [len(connected_videos)],
            }
        }

    def _process_video(self, video_input: Any, video_type: str) -> Dict[str, Any]:
        """
        Process video input and prepare metadata for display.

        Args:
            video_input: Video input object (VIDEO type from ComfyUI)
            video_type: Type of video (reference, base, upscaled)

        Returns:
            Dictionary containing video metadata and path/URL
        """
        import os
        from urllib.parse import urlencode
        
        # TEMPORARY: Hardcoded video URL for testing layout/interaction
        # TODO: Remove this and use actual video input processing
        TEMP_VIDEO_URL = "https://server.skproductions.llc/assets/video.mp4"
        
        metadata = {
            "type": video_type,
            "url": TEMP_VIDEO_URL,  # Hardcoded for now
        }
        
        # Extract metadata from VIDEO type if available
        try:
            if hasattr(video_input, 'get_dimensions'):
                width, height = video_input.get_dimensions()
                metadata["width"] = width
                metadata["height"] = height
                metadata["dimensions"] = f"{width}x{height}"
            
            if hasattr(video_input, 'get_duration'):
                metadata["duration"] = video_input.get_duration()
            
            if hasattr(video_input, 'get_container_format'):
                metadata["format"] = video_input.get_container_format()
            
            # Commented out for now - will re-enable when we fix input node integration
            # if hasattr(video_input, 'get_stream_source'):
            #     # Get the streamable source (file path or BytesIO)
            #     source = video_input.get_stream_source()
            #     if isinstance(source, str):
            #         # Convert file path to ComfyUI API URL
            #         # Parse the path similar to video_preview.js
            #         clean_path = source
            #         
            #         # Remove common ComfyUI path prefixes
            #         for prefix in ['/workspace/ComfyUI/', '/comfyui-nvidia/', '/app/ComfyUI/', '/ComfyUI/']:
            #             if clean_path.startswith(prefix):
            #                 clean_path = clean_path[len(prefix):]
            #                 break
            #         
            #         # Extract type (output, temp, input) and filename
            #         path_parts = clean_path.split("/")
            #         file_type = path_parts[0] if len(path_parts) > 0 else "output"
            #         filename = path_parts[-1] if len(path_parts) > 0 else ""
            #         subfolder = "/".join(path_parts[1:-1]) if len(path_parts) > 2 else ""
            #         
            #         # Construct URL using ComfyUI's /api/view endpoint
            #         params = {
            #             "filename": filename,
            #             "type": file_type,
            #             "subfolder": subfolder,
            #         }
            #         metadata["url"] = f"/api/view?{urlencode(params)}"
            #         metadata["fullpath"] = source  # Keep original path for debugging
                    
        except Exception as e:
            print(f"Warning: Could not extract metadata from {video_type} video: {e}")
            import traceback
            traceback.print_exc()
        
        return metadata


# Export node class mapping
VIDEO_PREVIEW_NATIVE_NODE_CLASS_MAPPINGS = {
    "VideoPreviewNative": VideoPreviewNative
}

# Export display name mapping
VIDEO_PREVIEW_NATIVE_NODE_DISPLAY_NAME_MAPPINGS = {
    "VideoPreviewNative": "🎬 Video Preview (Native)"
}
