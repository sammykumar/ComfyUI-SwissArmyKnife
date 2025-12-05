import cv2
import os
import glob
import subprocess
import mimetypes
import random
from html import unescape
from urllib.parse import urlparse

import requests
from PIL import Image

from ..utils.temp_utils import get_temp_file_path
from ..debug_utils import Logger

logger = Logger("MediaSelection")

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
                "media_source": (["Upload Media", "Randomize Media from Path", "Reddit/RedGif Post", "Randomize from Subreddit"], {
                    "default": "Reddit/RedGif Post",
                    "tooltip": "Choose whether to upload media, randomize from a directory path, download from a Reddit/RedGif post, or randomize from a subreddit"
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
                    "tooltip": "Reddit post URL or direct Redgifs/Gfycat URL (used when media_source is Reddit/RedGif Post)"
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
            media_source: Source of media ("Upload Media", "Randomize Media from Path", "Reddit/RedGif Post", or "Randomize from Subreddit")
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
            # Handle different media sources
            if media_source == "Randomize Media from Path":
                selected_media_path, media_info_text = self._randomize_from_path(
                    media_path, media_type, seed
                )
            elif media_source == "Reddit/RedGif Post":
                selected_media_path, media_type, media_info_text = self._download_reddit_post(
                    reddit_url, media_type
                )
            elif media_source == "Randomize from Subreddit":
                selected_media_path, media_type, media_info_text = self._randomize_from_subreddit(
                    subreddit_url, media_type, seed
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

    def _randomize_from_path(self, media_path, media_type, seed):
        """Randomly select media from a directory path."""
        if not media_path or not media_path.strip():
            raise ValueError("Media path is required when using 'Randomize Media from Path'")

        if not os.path.exists(media_path):
            raise ValueError(f"Media path does not exist: {media_path}")

        # Define supported file extensions
        if media_type == "image":
            extensions = ["*.jpg", "*.jpeg", "*.png", "*.bmp", "*.gif", "*.tiff", "*.webp"]
        else:  # video
            extensions = ["*.mp4", "*.avi", "*.mov", "*.mkv", "*.wmv", "*.flv", "*.webm"]

        # Find all matching files (including subdirectories)
        all_files = []
        for ext in extensions:
            all_files.extend(glob.glob(os.path.join(media_path, ext)))
            all_files.extend(glob.glob(os.path.join(media_path, ext.upper())))
            all_files.extend(glob.glob(os.path.join(media_path, "**", ext), recursive=True))
            all_files.extend(glob.glob(os.path.join(media_path, "**", ext.upper()), recursive=True))

        if not all_files:
            raise ValueError(f"No {media_type} files found in path: {media_path}")

        # Sort files by modification time (newest first) so seed=0 selects the most recent file
        # Note: getctime() returns metadata change time on Linux, getmtime() returns actual modification time
        all_files.sort(key=lambda f: os.path.getmtime(f), reverse=True)

        # Remove duplicates AFTER sorting (preserving sorted order)
        all_files = list(dict.fromkeys(all_files))  # Preserves order while removing duplicates

        # Use seed as index with wraparound (seed % file_count)
        # This ensures: seed 0 = first file (most recent), seed N >= file_count wraps around
        file_index = seed % len(all_files)
        selected_media_path = all_files[file_index]

        emoji = "📷" if media_type == "image" else "📹"
        media_info_text = f"{emoji} {media_type.title()} Processing Info (Index Selection):\n• File: {os.path.basename(selected_media_path)}\n• Index: {file_index} of {len(all_files)} files (seed: {seed}, 0 = most recent)\n• Source: {media_path}\n• Full path: {selected_media_path}"

        return selected_media_path, media_info_text

    def _download_reddit_post(self, reddit_url, media_type):
        """Download media from a Reddit post."""
        if not reddit_url or not reddit_url.strip():
            raise ValueError("Reddit URL is required when media_source is 'Reddit/RedGif Post'")

        downloaded_path, detected_media_type, reddit_media_info = self._download_reddit_media(reddit_url)
        selected_media_path = downloaded_path

        if detected_media_type != media_type:
            print(f"Warning: Media type mismatch. Expected '{media_type}' but detected '{detected_media_type}' from Reddit post. Using detected type.")
            media_type = detected_media_type

        file_size_mb = reddit_media_info.get('file_size', 0) / 1024 / 1024
        emoji = "📷" if media_type == "image" else "📹"
        media_info_text = f"{emoji} {media_type.title()} Processing Info (Reddit Post):\n• Title: {reddit_media_info.get('title', 'Unknown')}\n• Source: {reddit_url}\n• File Size: {file_size_mb:.2f} MB\n• Content Type: {reddit_media_info.get('content_type', 'Unknown')}"

        return selected_media_path, media_type, media_info_text

    def _randomize_from_subreddit(self, subreddit_url, media_type, seed):
        """Get random media from a subreddit."""
        if not subreddit_url or not subreddit_url.strip():
            raise ValueError("Subreddit URL is required when media_source is 'Randomize from Subreddit'")

        random_post_url = self._get_random_subreddit_post(subreddit_url, seed, media_type)
        downloaded_path, detected_media_type, reddit_media_info = self._download_reddit_media(random_post_url)
        selected_media_path = downloaded_path

        if detected_media_type != media_type:
            print(f"Warning: Media type mismatch. Expected '{media_type}' but detected '{detected_media_type}' from subreddit post. Using detected type.")
            media_type = detected_media_type

        file_size_mb = reddit_media_info.get('file_size', 0) / 1024 / 1024
        emoji = "📷" if media_type == "image" else "📹"

        # Extract subreddit name for display
        if 'reddit.com/r/' in subreddit_url:
            display_subreddit = subreddit_url.split('reddit.com/r/')[1].split('/')[0]
        elif subreddit_url.startswith('r/'):
            display_subreddit = subreddit_url[2:].split('/')[0]
        else:
            display_subreddit = subreddit_url.split('/')[0]

        media_info_text = f"{emoji} {media_type.title()} Processing Info (Random from r/{display_subreddit}):\n• Title: {reddit_media_info.get('title', 'Unknown')}\n• Post URL: {random_post_url}\n• File Size: {file_size_mb:.2f} MB\n• Content Type: {reddit_media_info.get('content_type', 'Unknown')}"

        return selected_media_path, media_type, media_info_text

    def _get_random_subreddit_post(self, subreddit_url, seed, media_type="image"):
        """Return a random Reddit post URL that matches the requested media type."""
        try:
            subreddit_url = subreddit_url.strip()

            if 'reddit.com/r/' in subreddit_url:
                subreddit_name = subreddit_url.split('reddit.com/r/')[1].split('/')[0]
            elif subreddit_url.startswith('r/'):
                subreddit_name = subreddit_url[2:].split('/')[0]
            else:
                subreddit_name = subreddit_url.split('/')[0]

            random.seed(seed)
            sort_methods = ['hot', 'new', 'top']
            selected_sort = random.choice(sort_methods)

            if selected_sort == 'top':
                json_url = f'https://www.reddit.com/r/{subreddit_name}/top.json?limit=100&t=week'
            else:
                json_url = f'https://www.reddit.com/r/{subreddit_name}/{selected_sort}.json?limit=100'

            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }

            logger.info(f"Fetching posts from r/{subreddit_name} (sort: {selected_sort})...")
            response = requests.get(json_url, headers=headers, timeout=30)
            response.raise_for_status()

            data = response.json()
            posts = data.get('data', {}).get('children', [])

            if not posts:
                raise ValueError(f"No posts found in r/{subreddit_name}")

            media_posts = []
            for post in posts:
                post_data = post['data']
                url = post_data.get('url', '')

                is_image = (
                    url.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')) or
                    'i.redd.it' in url or
                    (post_data.get('media_metadata') is not None and
                     any(m.get('e') == 'Image' for m in post_data.get('media_metadata', {}).values()))
                )

                is_video = (
                    url.endswith(('.mp4', '.webm', '.mov')) or
                    'v.redd.it' in url or
                    'redgifs.com' in url or
                    'gfycat.com' in url or
                    (post_data.get('media_metadata') is not None and
                     any(m.get('e') in ('AnimatedImage', 'Video') for m in post_data.get('media_metadata', {}).values()))
                )

                if media_type == "image" and is_image:
                    media_posts.append(post_data)
                elif media_type == "video" and is_video:
                    media_posts.append(post_data)

            if not media_posts:
                raise ValueError(f"No {media_type} posts found in r/{subreddit_name}. Try a different subreddit or media type.")

            logger.info(f"Found {len(media_posts)} {media_type} posts in r/{subreddit_name} (sort: {selected_sort})")

            selected_post = random.choice(media_posts)
            random.seed(None)

            post_permalink = selected_post.get('permalink', '')
            if post_permalink:
                return f"https://www.reddit.com{post_permalink}"

            post_id = selected_post.get('id', '')
            return f"https://www.reddit.com/r/{subreddit_name}/comments/{post_id}/"

        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to fetch subreddit posts: Network error - {str(e)}")
        except (KeyError, IndexError, TypeError) as e:
            raise Exception(f"Failed to parse subreddit data: Invalid format - {str(e)}")
        except Exception as e:
            raise Exception(f"Subreddit randomization failed: {str(e)}")

    def _download_reddit_media(self, reddit_url):
        """Download media from a Reddit post and return local path plus metadata."""
        try:
            if not reddit_url or not isinstance(reddit_url, str):
                raise ValueError("Invalid Reddit URL provided")

            reddit_url = reddit_url.strip()
            if not reddit_url.startswith(('http://', 'https://')):
                reddit_url = 'https://' + reddit_url

            parsed_url = urlparse(reddit_url)
            # Allow direct Reddit posts or direct Redgifs/Gfycat URLs
            allowed_hosts = ['reddit.com', 'www.reddit.com', 'redgifs.com', 'www.redgifs.com', 'gfycat.com', 'www.gfycat.com']
            if not any(h in parsed_url.netloc.lower() for h in allowed_hosts):
                raise ValueError("URL must be a Reddit post URL or a supported external host (redgifs.com/gfycat.com)")

            # If this is a direct Redgifs/Gfycat URL, attempt to extract the direct media URL
            if 'redgifs.com' in parsed_url.netloc.lower() or 'gfycat.com' in parsed_url.netloc.lower():
                media_url, media_type = self._extract_redgifs_url(reddit_url)
                if not media_url:
                    raise ValueError(f"Could not extract a direct media URL from: {reddit_url}")

                # Bypass reddit JSON flow and download the media_url directly
                logger.info(f"Downloading media from direct external URL: {media_url}")
                direct_external = True
                post_title = reddit_url
            else:
                json_url = reddit_url.rstrip('/') + '.json'
                direct_external = False
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }

            if not direct_external:
                response = requests.get(json_url, headers=headers, timeout=30)
                response.raise_for_status()
                data = response.json()

                if not data or len(data) < 1:
                    raise ValueError("Unable to parse Reddit post data")

                post_data = data[0]['data']['children'][0]['data']
                media_url = None
                media_type = None
                post_title = post_data.get('title', 'Reddit Post')

                if post_data.get('url'):
                    url = post_data['url']

                if url.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    media_url = url
                    media_type = 'image'
                elif url.endswith(('.mp4', '.webm', '.mov')):
                    media_url = url
                    media_type = 'video'
                elif 'i.redd.it' in url:
                    media_url = url
                    media_type = 'image'
                elif 'v.redd.it' in url and post_data.get('media') and post_data['media'].get('reddit_video'):
                    media_url = post_data['media']['reddit_video'].get('fallback_url')
                    media_type = 'video'
                elif 'redgifs.com' in url or 'gfycat.com' in url:
                    media_url, media_type = self._extract_redgifs_url(url)
                    if not media_url:
                        logger.warning(f"Warning: Could not extract direct video URL from {url}, trying original URL as fallback")
                        media_url = url
                        media_type = 'video'

                if not media_url and post_data.get('media_metadata'):
                    for media_info in post_data['media_metadata'].values():
                        if media_info.get('s') and media_info['s'].get('u'):
                            media_url = unescape(media_info['s']['u'])
                            mime_type = media_info.get('m', '')
                            if mime_type.startswith('image/'):
                                media_type = 'image'
                            elif mime_type.startswith('video/'):
                                media_type = 'video'
                            break

            if not media_url:
                raise ValueError(f"No downloadable media found in Reddit post: {post_title}")

            logger.info(f"Downloading media from: {media_url}")

            if 'redgifs.com' in media_url and not media_url.endswith(('.mp4', '.webm', '.mov')):
                logger.warning("Warning: Redgifs URL doesn't appear to be a direct video link, trying to extract...")
                extracted_url, extracted_type = self._extract_redgifs_url(media_url)
                if extracted_url:
                    logger.info(f"Successfully extracted direct video URL: {extracted_url}")
                    media_url = extracted_url
                    media_type = extracted_type

            media_response = requests.get(media_url, headers=headers, timeout=60)
            media_response.raise_for_status()

            content_type = media_response.headers.get('content-type', '')
            content_length = len(media_response.content)

            if content_type.startswith('text/html') and 'redgifs.com' in media_url:
                raise ValueError(f"Redgifs URL returned webpage instead of video: {media_url}")

            if content_length < 1024:
                logger.warning(f"Warning: Very small content size ({content_length} bytes), might not be valid media")

            file_ext = None
            if content_type:
                file_ext = mimetypes.guess_extension(content_type)

            if not file_ext:
                parsed_media_url = urlparse(media_url)
                if '.' in parsed_media_url.path:
                    file_ext = '.' + parsed_media_url.path.split('.')[-1].lower()

            if not file_ext:
                file_ext = '.mp4' if media_type == 'video' else '.jpg'

            temp_path = get_temp_file_path(suffix=file_ext, prefix='reddit_media', subdir='downloads')
            with open(temp_path, 'wb') as temp_file:
                temp_file.write(media_response.content)

            media_info = {
                'title': post_title,
                'url': reddit_url,
                'media_url': media_url,
                'file_size': len(media_response.content),
                'content_type': content_type
            }

            return temp_path, media_type, media_info

        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to download Reddit media: Network error - {str(e)}")
        except (KeyError, IndexError, TypeError) as e:
            raise Exception(f"Failed to parse Reddit post: Invalid post format - {str(e)}")
        except Exception as e:
            raise Exception(f"Reddit media download failed: {str(e)}")

    def _extract_redgifs_url(self, redgifs_url):
        """Attempt to extract a direct video URL from a Redgifs or Gfycat link."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }

            logger.debug(f"[DEBUG] Attempting to extract video URL from: {redgifs_url}")

            if 'redgifs.com' in redgifs_url:
                parsed_url = urlparse(redgifs_url)
                path_parts = parsed_url.path.strip('/').split('/')

                gif_id = None
                if 'watch' in path_parts:
                    gif_idx = path_parts.index('watch')
                    if gif_idx + 1 < len(path_parts):
                        gif_id = path_parts[gif_idx + 1]
                elif path_parts:
                    gif_id = path_parts[-1]

                logger.debug(f"[DEBUG] Extracted gif_id: {gif_id}")

                if gif_id:
                    try:
                        logger.debug("[DEBUG] Strategy 1: Scraping page for video URLs")
                        response = requests.get(redgifs_url, headers=headers, timeout=30)
                        if response.status_code == 200:
                            content = response.text
                            import re

                            patterns = [
                                r'"(https://[^\"\']*\.redgifs\.com/[^\"\']*\.mp4[^\"\']*)"',
                                r'"(https://files\.redgifs\.com/[^\"\']*\.mp4[^\"\']*)"',
                                r'"(https://thumbs\d*\.redgifs\.com/[^\"\']*\.mp4[^\"\']*)"',
                                r'"videoUrl":"([^\"\']*)"',
                                r'"url":"(https://[^\"\']*\.mp4[^\"\']*)"',
                            ]

                            for pattern in patterns:
                                matches = re.findall(pattern, content, re.IGNORECASE)
                                for match in matches:
                                    clean_url = match.replace('\\', '')
                                    try:
                                        test_response = requests.head(clean_url, headers=headers, timeout=10)
                                        if test_response.status_code == 200:
                                            content_type = test_response.headers.get('content-type', '')
                                            if 'video' in content_type.lower() or clean_url.endswith('.mp4'):
                                                logger.debug(f"[DEBUG] Successfully found working video URL: {clean_url}")
                                                return clean_url, 'video'
                                    except Exception:
                                        continue
                    except Exception as scrape_error:
                        logger.debug(f"[DEBUG] Strategy 1 failed: {scrape_error}")

                    try:
                        logger.debug("[DEBUG] Strategy 2: Trying direct URL patterns")
                        direct_patterns = [
                            f"https://files.redgifs.com/{gif_id}.mp4",
                            f"https://thumbs.redgifs.com/{gif_id}.mp4",
                            f"https://thumbs2.redgifs.com/{gif_id}.mp4",
                            f"https://files.redgifs.com/{gif_id}-mobile.mp4",
                        ]

                        for direct_url in direct_patterns:
                            try:
                                test_response = requests.head(direct_url, headers=headers, timeout=10)
                                if test_response.status_code == 200:
                                    logger.debug(f"[DEBUG] Direct URL successful: {direct_url}")
                                    return direct_url, 'video'
                            except Exception:
                                continue
                    except Exception as direct_error:
                        logger.debug(f"[DEBUG] Strategy 2 failed: {direct_error}")

                    try:
                        logger.debug("[DEBUG] Strategy 3: Trying redgifs API")
                        api_url = f"https://api.redgifs.com/v2/gifs/{gif_id}"
                        response = requests.get(api_url, headers=headers, timeout=30)

                        if response.status_code == 200:
                            data = response.json()
                            if 'gif' in data and 'urls' in data['gif']:
                                video_urls = data['gif']['urls']
                                for quality in ['hd', 'sd', 'poster']:
                                    if quality in video_urls and video_urls[quality]:
                                        return video_urls[quality], 'video'
                    except Exception as api_error:
                        logger.debug(f"[DEBUG] Strategy 3 failed: {api_error}")

            elif 'gfycat.com' in redgifs_url:
                parsed_url = urlparse(redgifs_url)
                path_parts = parsed_url.path.strip('/').split('/')
                if path_parts:
                    gfy_name = path_parts[-1]
                    return self._extract_redgifs_url(f"https://www.redgifs.com/watch/{gfy_name}")

        except Exception as e:
            logger.debug(f"[DEBUG] Exception in _extract_redgifs_url: {str(e)}")

        return None, None

    def _upload_media(self, media_type, uploaded_image_file, uploaded_video_file):
        """Handle uploaded media files."""
        try:
            import folder_paths
            input_dir = folder_paths.get_input_directory()
        except ImportError:
            input_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "input")

        if media_type == "image":
            if not uploaded_image_file:
                raise ValueError("Image file upload is required when media_source is 'Upload Media' and media_type is 'image'")
            selected_media_path = os.path.join(input_dir, uploaded_image_file)
            media_info_text = f"📷 Image Processing Info (Uploaded File):\n• File: {uploaded_image_file}"
        else:  # video
            if not uploaded_video_file:
                raise ValueError("Video upload is required when media_source is 'Upload Media' and media_type is 'video'")
            selected_media_path = os.path.join(input_dir, uploaded_video_file)
            media_info_text = f"📹 Video Processing Info (Uploaded File):\n• File: {uploaded_video_file}"

        return selected_media_path, media_info_text

    def _resize_image(self, pil_image, resize_mode, resize_width, resize_height):
        """
        Resize an image based on the specified mode.

        Args:
            pil_image: PIL Image object to resize
            resize_mode: "None", "Auto (by orientation)", or "Custom"
            resize_width: Target width for Custom mode
            resize_height: Target height for Custom mode

        Returns:
            Resized PIL Image object or original if no resize
        """
        if resize_mode == "None":
            return pil_image

        original_width, original_height = pil_image.size

        if resize_mode == "Auto (by orientation)":
            # Determine output dimensions based on image orientation
            # Landscape (wider): 832x480, Portrait (taller): 480x832
            if original_width > original_height:
                target_width = 832
                target_height = 480
            else:
                target_width = 480
                target_height = 832
        elif resize_mode == "Custom":
            target_width = resize_width
            target_height = resize_height
        else:
            # Unknown mode, return original
            return pil_image

        # Calculate aspect ratios
        original_aspect = original_width / original_height
        target_aspect = target_width / target_height

        # Resize with aspect ratio preservation, then crop to exact dimensions
        if original_aspect > target_aspect:
            # Original is wider, fit to height and crop width
            new_height = target_height
            new_width = int(new_height * original_aspect)
        else:
            # Original is taller, fit to width and crop height
            new_width = target_width
            new_height = int(new_width / original_aspect)

        # Resize with high-quality Lanczos resampling
        resized = pil_image.resize((new_width, new_height), Image.LANCZOS)

        # Center crop to exact target dimensions
        left = (new_width - target_width) // 2
        top = (new_height - target_height) // 2
        right = left + target_width
        bottom = top + target_height

        cropped = resized.crop((left, top, right, bottom))

        print(f"Resized image from {original_width}x{original_height} to {target_width}x{target_height}")
        return cropped

    def _process_image(self, image_path, resize_mode, resize_width, resize_height):
        """Process image and optionally resize it."""
        # Read image with PIL for better format support
        pil_image = Image.open(image_path)

        # Apply resizing if requested
        if resize_mode != "None":
            pil_image = self._resize_image(pil_image, resize_mode, resize_width, resize_height)

            # Save resized image to a temporary file
            from ..utils.temp_utils import get_temp_file_path

            # Determine file extension
            _, ext = os.path.splitext(image_path)
            if not ext:
                ext = '.png'

            resized_path = get_temp_file_path(suffix=ext, prefix='resized', subdir='images')

            # Convert RGBA to RGB if saving as JPEG
            if ext.lower() in ['.jpg', '.jpeg'] and pil_image.mode == 'RGBA':
                pil_image = pil_image.convert('RGB')

            # Save the resized image
            pil_image.save(resized_path)
            image_path = resized_path
            print(f"Saved resized image to: {resized_path}")

        # Get dimensions from the (possibly resized) image
        width, height = pil_image.size

        return height, width, 0.0, 0.0, image_path

    def _get_image_metadata(self, image_path):
        """Get image dimensions using OpenCV."""
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Failed to read image: {image_path}")

        height, width = img.shape[:2]
        return height, width, 0.0, 0.0

    def _resize_video(self, video_path, resize_mode, resize_width, resize_height, original_width, original_height):
        """
        Resize a video based on the specified mode using ffmpeg.

        Args:
            video_path: Path to the video file
            resize_mode: "None", "Auto (by orientation)", or "Custom"
            resize_width: Target width for Custom mode
            resize_height: Target height for Custom mode
            original_width: Original video width
            original_height: Original video height

        Returns:
            Tuple of (resized_video_path, target_width, target_height) or (None, original_width, original_height) if no resize
        """
        if resize_mode == "None":
            return None, original_width, original_height

        # Determine target dimensions
        if resize_mode == "Auto (by orientation)":
            # Landscape (wider): 832x480, Portrait (taller): 480x832
            if original_width > original_height:
                target_width = 832
                target_height = 480
            else:
                target_width = 480
                target_height = 832
        elif resize_mode == "Custom":
            target_width = resize_width
            target_height = resize_height
        else:
            # Unknown mode, no resize
            return None, original_width, original_height

        # Calculate aspect ratios for proper scaling and cropping
        original_aspect = original_width / original_height
        target_aspect = target_width / target_height

        # Determine scale dimensions (fit to one dimension, crop the other)
        if original_aspect > target_aspect:
            # Original is wider, fit to height and crop width
            scale_height = target_height
            scale_width = int(scale_height * original_aspect)
        else:
            # Original is taller, fit to width and crop height
            scale_width = target_width
            scale_height = int(scale_width / original_aspect)

        # Create output path
        resized_path = get_temp_file_path(suffix='.mp4', prefix='resized', subdir='videos')

        try:
            print(f"Resizing video from {original_width}x{original_height} to {target_width}x{target_height}")

            # Build ffmpeg command with scale and crop filters
            # First scale to intermediate size, then crop to exact target
            scale_filter = f"scale={scale_width}:{scale_height}"
            crop_filter = f"crop={target_width}:{target_height}"
            vf_filter = f"{scale_filter},{crop_filter}"

            cmd = [
                'ffmpeg',
                '-i', video_path,
                '-vf', vf_filter,
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '23',
                '-c:a', 'copy',  # Copy audio without re-encoding
                '-y',
                resized_path
            ]

            subprocess.run(cmd, capture_output=True, text=True, check=True)

            if os.path.exists(resized_path) and os.path.getsize(resized_path) > 0:
                print(f"Successfully resized video to: {resized_path}")
                return resized_path, target_width, target_height
            else:
                print("Warning: Resized video file is empty, using original")
                return None, original_width, original_height

        except subprocess.CalledProcessError as e:
            print(f"FFmpeg resize error: {e.stderr}")
            print("Warning: Could not resize video. Using original dimensions.")
            return None, original_width, original_height
        except FileNotFoundError:
            print("FFmpeg not found. Please install ffmpeg to use video resizing.")
            return None, original_width, original_height

    def _process_video(self, video_path, max_duration, media_info_text, resize_mode="None", resize_width=832, resize_height=480):
        """Process video and optionally trim and resize it."""
        # Get video metadata using OpenCV
        cap = cv2.VideoCapture(video_path)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        original_duration = frame_count / fps if fps > 0 else 0
        cap.release()

        print(f"Original video properties: {frame_count} frames, {fps:.2f} fps, {width}x{height}, {original_duration:.2f}s duration")

        if original_duration <= 0:
            raise ValueError(f"Invalid video: duration is {original_duration:.2f} seconds. The video file may be corrupted or empty.")
        if frame_count <= 0:
            raise ValueError(f"Invalid video: {frame_count} frames. The video file may be corrupted or empty.")

        # Determine if we need to trim
        final_video_path = video_path
        actual_duration = original_duration
        trimmed = False

        if max_duration > 0 and max_duration < original_duration:
            # Trim video
            min_duration = min(1.0, original_duration)
            actual_duration = max(min_duration, min(max_duration, original_duration))

            # Use ComfyUI-aware temp directory
            trimmed_video_path = get_temp_file_path(suffix='.mp4', prefix='trimmed', subdir='videos')

            print(f"Attempting to trim video from {original_duration:.2f}s to {actual_duration:.2f}s")
            if self._trim_video(video_path, trimmed_video_path, actual_duration):
                final_video_path = trimmed_video_path
                trimmed = True
                print(f"Successfully trimmed video to {trimmed_video_path}")
            else:
                print(f"Warning: Could not trim video. Using original video for {original_duration:.2f}s")
                actual_duration = original_duration

        # Apply resizing if requested
        resized = False
        if resize_mode != "None":
            resized_path, width, height = self._resize_video(
                final_video_path, resize_mode, resize_width, resize_height, width, height
            )
            if resized_path:
                final_video_path = resized_path
                resized = True
                print(f"Video resized to {width}x{height}")

        # Update media info
        trim_info = f" (trimmed: 0.0s → {actual_duration:.1f}s)" if trimmed else ""
        resize_info = f" (resized to {width}x{height})" if resized else ""
        media_info_text += f"\n• Original Duration: {original_duration:.2f} seconds"
        media_info_text += f"\n• Processed Duration: {actual_duration:.2f} seconds{trim_info}"
        media_info_text += f"\n• Frames: {frame_count}"
        media_info_text += f"\n• Frame Rate: {fps:.2f} FPS"
        media_info_text += f"\n• Resolution: {width}x{height}{resize_info}"

        return height, width, actual_duration, fps, final_video_path, media_info_text

    def _trim_video(self, input_path, output_path, duration):
        """Trim video to specified duration using ffmpeg."""
        if duration <= 0:
            print(f"Error: Invalid duration {duration} seconds for video trimming")
            return False

        if not os.path.exists(input_path):
            print(f"Error: Input video file does not exist: {input_path}")
            return False

        try:
            print(f"Trimming video: {input_path} -> {output_path} (duration: {duration}s)")

            cmd = [
                'ffmpeg',
                '-i', input_path,
                '-t', str(duration),
                '-c', 'copy',
                '-avoid_negative_ts', 'make_zero',
                '-y',
                output_path
            ]

            subprocess.run(cmd, capture_output=True, text=True, check=True)

            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                print(f"Successfully trimmed video: {os.path.getsize(output_path)} bytes")
                return True
            else:
                print("Warning: Trimmed file is empty, trying re-encoding")
                raise subprocess.CalledProcessError(1, cmd, "Empty output file")

        except subprocess.CalledProcessError as e:
            print(f"FFmpeg copy error: {e.stderr}")
            # Fallback: try with re-encoding
            try:
                print("Attempting video trimming with re-encoding...")
                cmd = [
                    'ffmpeg',
                    '-i', input_path,
                    '-t', str(duration),
                    '-c:v', 'libx264',
                    '-c:a', 'aac',
                    '-preset', 'fast',
                    '-y',
                    output_path
                ]
                subprocess.run(cmd, capture_output=True, text=True, check=True)

                if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                    print(f"Successfully trimmed video with re-encoding: {os.path.getsize(output_path)} bytes")
                    return True
                else:
                    logger.error("Error: Re-encoded file is also empty")
                    return False

            except subprocess.CalledProcessError as e2:
                print(f"FFmpeg re-encoding also failed: {e2.stderr}")
                return False
        except FileNotFoundError:
            print("FFmpeg not found. Please install ffmpeg to use duration trimming.")
            return False
