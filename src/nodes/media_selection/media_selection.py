import cv2  # noqa: F401
import os  # noqa: F401
import glob  # noqa: F401
import subprocess  # noqa: F401
from PIL import Image  # noqa: F401
from ..utils.temp_utils import get_temp_file_path  # noqa: F401


class MediaSelection:
    """
    A ComfyUI custom node for selecting media from various sources without AI processing.
    Supports uploaded media, random selection from directory, Reddit posts, and subreddit randomization.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "media_source": (["Upload Media", "Randomize Media from Path", "Reddit Post", "Randomize from Subreddit"], {
                    "default": "Reddit Post",
                    "tooltip": "Choose whether to upload media, randomize from a directory path, download from a Reddit post, or randomize from a subreddit"
                }),
                "media_type": (["image", "video"], {
                    "default": "image",
                    "tooltip": "Select the type of media to process"
                }),
                "seed": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 0xFFFFFFFFFFFFFFFF,
                    "tooltip": "Seed for randomization when using 'Randomize Media from Path' or 'Randomize from Subreddit'. Use different seeds to force re-execution."
                }),
            },
            "optional": {
                "media_path": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "Directory path to randomly select media from, including all subdirectories (used when media_source is Randomize Media from Path)"
                }),
                "uploaded_image_file": ("STRING", {
                    "default": "",
                    "tooltip": "Path to uploaded image file (managed by upload widget)"
                }),
                "uploaded_video_file": ("STRING", {
                    "default": "",
                    "tooltip": "Path to uploaded video file (managed by upload widget)"
                }),
                "reddit_url": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "Reddit post URL (used when media_source is Reddit Post)"
                }),
                "subreddit_url": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "Subreddit URL or name (e.g., 'r/pics' or 'https://www.reddit.com/r/pics/') - used when media_source is Randomize from Subreddit"
                }),
                "max_duration": ("FLOAT", {
                    "default": 0.0,
                    "min": 0.0,
                    "max": 300.0,
                    "step": 0.1,
                    "tooltip": "Maximum duration in seconds for videos (0 = use full video). Video will be trimmed if longer."
                }),
                "resize_mode": (["None", "Auto (by orientation)", "Custom"], {
                    "default": "None",
                    "tooltip": "Resize mode: None (original size), Auto (832x480 landscape, 480x832 portrait), Custom (specify dimensions)"
                }),
                "resize_width": ("INT", {
                    "default": 832,
                    "min": 64,
                    "max": 8192,
                    "step": 8,
                    "tooltip": "Target width for Custom resize mode"
                }),
                "resize_height": ("INT", {
                    "default": 480,
                    "min": 64,
                    "max": 8192,
                    "step": 8,
                    "tooltip": "Target height for Custom resize mode"
                }),
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "INT", "INT", "FLOAT", "FLOAT")
    RETURN_NAMES = ("media_path", "media_type", "media_info", "height", "width", "duration", "fps")
    FUNCTION = "select_media"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    DESCRIPTION = (
        "Selects an image or video from uploads, filesystem directories, or Reddit sources, optionally trims/resizes it, and "
        "returns the resolved path plus metadata (type, dimensions, duration, fps)."
    )

    def select_media(self, media_source, media_type, seed, media_path="", uploaded_image_file="", uploaded_video_file="", reddit_url="", subreddit_url="", max_duration=0.0, resize_mode="None", resize_width=832, resize_height=480):
        """
        Select media from various sources and return path and metadata.

        Args:
            media_source: Source of media ("Upload Media", "Randomize Media from Path", "Reddit Post", or "Randomize from Subreddit")
            media_type: Type of media ("image" or "video")
            seed: Seed for randomization
            media_path: Directory path for randomization (optional)
            uploaded_image_file: Path to uploaded image (optional)
            uploaded_video_file: Path to uploaded video (optional)
            reddit_url: Reddit post URL (optional)
            subreddit_url: Subreddit URL for randomization (optional)
            max_duration: Maximum video duration in seconds (0 = full video)
            resize_mode: Resize mode ("None", "Auto (by orientation)", or "Custom")
            resize_width: Target width for Custom resize mode
            resize_height: Target height for Custom resize mode

        Returns:
            Tuple of (media_path, media_type, media_info, height, width, duration, fps)
        """
        selected_media_path = None
        media_info_text = ""

        try:
            # Import helper methods from the MediaDescribe node
            from ..media_describe.media_describe import MediaDescribe
            helper = MediaDescribe()

            # Handle different media sources
            if media_source == "Randomize Media from Path":
                selected_media_path, media_info_text = self._randomize_from_path(
                    media_path, media_type, seed
                )
            elif media_source == "Reddit Post":
                selected_media_path, media_type, media_info_text = self._download_reddit_post(
                    reddit_url, media_type, helper
                )
            elif media_source == "Randomize from Subreddit":
                selected_media_path, media_type, media_info_text = self._randomize_from_subreddit(
                    subreddit_url, media_type, seed, helper
                )
            else:  # Upload Media
                selected_media_path, media_info_text = self._upload_media(
                    media_type, uploaded_image_file, uploaded_video_file
                )

            # Get media metadata
            if media_type == "image":
                height, width, duration, fps, selected_media_path = self._process_image(
                    selected_media_path, resize_mode, resize_width, resize_height
                )
                media_info_text += f"\n• Resolution: {width}x{height}"
            else:  # video
                height, width, duration, fps, selected_media_path, media_info_text = self._process_video(
                    selected_media_path, max_duration, media_info_text, resize_mode, resize_width, resize_height
                )

            return (selected_media_path, media_type, media_info_text, height, width, duration, fps)

        except Exception as e:
            raise Exception(f"Media selection failed: {str(e)}")
