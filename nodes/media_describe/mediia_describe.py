import cv2
import numpy as np
from PIL import Image
import mimetypes
import requests
import io
import os
import subprocess
import time
import json
import random
import re
from urllib.parse import urlparse
from html import unescape

from google import genai
from google.genai import types

from ..cache import get_cache, get_file_media_identifier, get_tensor_media_identifier
from ..utils.temp_utils import get_temp_file_path

class MediaDescribe:
    """
    A ComfyUI custom node for describing images or videos using Google's Gemini API.
    Supports both uploaded media and random selection from a directory path (including subdirectories).
    """

    def __init__(self):
        pass

    def _call_gemini_with_retry(self, client, model, contents, config, max_retries=3, retry_delay=5):
        """
        Call Gemini API with retry logic for handling overload errors.
        
        Args:
            client: Gemini client instance
            model: Gemini model name
            contents: Content to send to Gemini
            config: Generation config
            max_retries: Maximum number of retry attempts (default: 3)
            retry_delay: Delay in seconds between retries (default: 5)
            
        Returns:
            Response from Gemini API
            
        Raises:
            Exception: If all retries fail
        """
        last_error = None

        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=contents,
                    config=config,
                )

                # Check if response has valid text
                if response.text is not None:
                    return response

                # If response is empty, construct error message
                error_msg = "Error: Gemini returned empty response"
                if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                    error_msg += f" (Prompt feedback: {response.prompt_feedback})"
                if hasattr(response, 'candidates') and response.candidates:
                    error_msg += f" (Candidates available: {len(response.candidates)})"

                # If not the last attempt, retry after delay
                if attempt < max_retries - 1:
                    print(f"Gemini API returned empty response. Retrying in {retry_delay} seconds... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(retry_delay)
                    last_error = RuntimeError(error_msg)
                    continue
                else:
                    # Last attempt failed
                    raise RuntimeError(error_msg)

            except Exception as e:
                last_error = e

                # Check if it's an error we should retry
                error_str = str(e)
                should_retry = (
                    "500" in error_str or 
                    "503" in error_str or 
                    "overloaded" in error_str.lower() or
                    "empty response" in error_str.lower()
                )

                # If not the last attempt and it's a retryable error, retry after delay
                if attempt < max_retries - 1 and should_retry:
                    print(f"Gemini API error: {error_str}")
                    print(f"Retrying in {retry_delay} seconds... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(retry_delay)
                    continue
                else:
                    # Last attempt or non-retryable error
                    raise

        # If we exhausted all retries, raise the last error
        if last_error:
            raise last_error

    def _ordinal(self, n):
        """Convert number to ordinal string (1->First, 2->Second, etc.)"""
        ordinals = ["", "First", "Second", "Third", "Fourth", "Fifth", "Sixth"]
        if n < len(ordinals):
            return ordinals[n]
        else:
            return f"{n}th"

    def _parse_paragraphs(self, description, override_subject="", override_cinematic_aesthetic="", override_stylization_tone="", override_clothing="", override_scene="", override_movement=""):
        """
        Parse description into individual paragraphs and apply overrides.
        Supports both JSON format (for video) and paragraph format (for images).
        Returns tuple: (subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement, final_description)
        """
        # Initialize all paragraph variables
        subject = ""
        cinematic_aesthetic = ""
        stylization_tone = ""
        clothing = ""
        scene = ""
        movement = ""
        
        # Try to parse as JSON first (for video format)
        try:
            # Remove any markdown code fences if present
            cleaned_description = description.strip()
            if cleaned_description.startswith('```'):
                # Remove code fences
                lines = cleaned_description.split('\n')
                # Find first line that's not a fence
                start_idx = 0
                for i, line in enumerate(lines):
                    if line.strip().startswith('```'):
                        start_idx = i + 1
                    else:
                        start_idx = i
                        break
                # Find last line that's not a fence
                end_idx = len(lines)
                for i in range(len(lines) - 1, -1, -1):
                    if lines[i].strip().startswith('```'):
                        end_idx = i
                    else:
                        break
                cleaned_description = '\n'.join(lines[start_idx:end_idx])
            
            # Try to parse as JSON
            json_data = json.loads(cleaned_description)
            
            # Extract fields from JSON (using exact field names from the prompt)
            subject = json_data.get("subject", "")
            clothing = json_data.get("clothing", "")
            scene = json_data.get("scene", "")
            movement = json_data.get("movement", "")
            cinematic_aesthetic = json_data.get("cinematic_aesthetic_control", "")  # Map to cinematic_aesthetic
            stylization_tone = json_data.get("stylization_tone", "")
            
        except (json.JSONDecodeError, ValueError):
            # Fall back to paragraph parsing (for images)
            # Split description into paragraphs (separated by blank lines)
            paragraphs = [p.strip() for p in description.split('\n\n') if p.strip()]
            
            # Map paragraphs to variables (order matters based on system prompt)
            if len(paragraphs) >= 1:
                subject = paragraphs[0] if len(paragraphs) > 0 else ""
            if len(paragraphs) >= 2:
                cinematic_aesthetic = paragraphs[1] if len(paragraphs) > 1 else ""
            if len(paragraphs) >= 3:
                stylization_tone = paragraphs[2] if len(paragraphs) > 2 else ""
            if len(paragraphs) >= 4:
                clothing = paragraphs[3] if len(paragraphs) > 3 else ""
            if len(paragraphs) >= 5:
                scene = paragraphs[4] if len(paragraphs) > 4 else ""
            if len(paragraphs) >= 6:
                movement = paragraphs[5] if len(paragraphs) > 5 else ""
        
        # Apply overrides
        if override_subject.strip():
            subject = override_subject.strip()
        if override_cinematic_aesthetic.strip():
            cinematic_aesthetic = override_cinematic_aesthetic.strip()
        if override_stylization_tone.strip():
            stylization_tone = override_stylization_tone.strip()
        if override_clothing.strip():
            clothing = override_clothing.strip()
        if override_scene.strip():
            scene = override_scene.strip()
        if override_movement.strip():
            movement = override_movement.strip()
        
        # Rebuild final description from non-empty paragraphs
        final_parts = []
        for para in [subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement]:
            if para:
                final_parts.append(para)
        final_description = "\n\n".join(final_parts)
        
        return (subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement, final_description)

    def _trim_video(self, input_path, output_path, duration):
        """
        Trim video to specified duration from the beginning using ffmpeg

        Args:
            input_path: Path to input video file
            output_path: Path to output trimmed video file
            duration: Duration in seconds from the beginning
        """

        # Validate inputs
        if duration <= 0:
            print(f"Error: Invalid duration {duration} seconds for video trimming")
            return False

        if not os.path.exists(input_path):
            print(f"Error: Input video file does not exist: {input_path}")
            return False

        try:
            print(f"Trimming video: {input_path} -> {output_path} (duration: {duration}s)")

            # Use ffmpeg to trim the video from the beginning
            cmd = [
                'ffmpeg',
                '-i', input_path,
                '-t', str(duration),     # Duration from start
                '-c', 'copy',  # Copy streams without re-encoding for speed
                '-avoid_negative_ts', 'make_zero',
                '-y',  # Overwrite output file if it exists
                output_path
            ]

            subprocess.run(cmd, capture_output=True, text=True, check=True)

            # Check if output file was created and has content
            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                print(f"Successfully trimmed video with copy codec: {os.path.getsize(output_path)} bytes")
                return True
            else:
                print("Warning: Trimmed file is empty, trying re-encoding")
                raise subprocess.CalledProcessError(1, cmd, "Empty output file")

        except subprocess.CalledProcessError as e:
            print(f"FFmpeg copy error: {e.stderr}")
            # Fallback: try with re-encoding if copy fails
            try:
                print("Attempting video trimming with re-encoding...")
                cmd = [
                    'ffmpeg',
                    '-i', input_path,
                    '-t', str(duration),
                    '-c:v', 'libx264',
                    '-c:a', 'aac',
                    '-preset', 'fast',  # Faster encoding
                    '-y',
                    output_path
                ]
                subprocess.run(cmd, capture_output=True, text=True, check=True)

                # Check if output file was created and has content
                if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                    print(f"Successfully trimmed video with re-encoding: {os.path.getsize(output_path)} bytes")
                    return True
                else:
                    print("Error: Re-encoded file is also empty")
                    return False

            except subprocess.CalledProcessError as e2:
                print(f"FFmpeg re-encoding also failed: {e2.stderr}")
                return False
        except FileNotFoundError:
            print("FFmpeg not found. Please install ffmpeg to use duration trimming.")
            return False

    def _extract_redgifs_video_url(self, redgifs_url):
        """
        Extract the actual video URL from a RedGifs page

        Args:
            redgifs_url: RedGifs watch URL (e.g., https://www.redgifs.com/watch/scientifictriviallizard)

        Returns:
            tuple: (video_url, media_type) or raises exception on failure
        """
        try:
            # Extract the gif ID from the URL
            # URL format: https://www.redgifs.com/watch/GIFID  
            gif_id = redgifs_url.split('/')[-1].lower()

            print(f"Extracting RedGifs video for ID: {gif_id}")

            # Try common RedGifs video URL patterns
            # RedGifs typically serves videos in these formats
            possible_urls = [
                f"https://thumbs2.redgifs.com/{gif_id}.mp4",
                f"https://thumbs.redgifs.com/{gif_id}.mp4", 
                f"https://files.redgifs.com/{gif_id}.mp4",
                f"https://thumbs2.redgifs.com/{gif_id}-mobile.mp4",
                f"https://thumbs.redgifs.com/{gif_id}-mobile.mp4"
            ]

            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'video/mp4,video/webm,video/*,*/*;q=0.9',
                'Referer': 'https://www.redgifs.com/'
            }

            # Try each possible URL to find a working video
            for video_url in possible_urls:
                try:
                    print(f"Trying video URL: {video_url}")
                    response = requests.head(video_url, headers=headers, timeout=10)
                    if response.status_code == 200:
                        content_type = response.headers.get('content-type', '')
                        if content_type.startswith('video/'):
                            print(f"Found working RedGifs video URL: {video_url}")
                            return video_url, 'video'
                except requests.RequestException:
                    continue

            # If direct URLs don't work, try to parse the page
            print("Direct URLs failed, attempting to parse RedGifs page...")
            page_response = requests.get(redgifs_url, headers=headers, timeout=30)
            page_response.raise_for_status()

            # Look for video URLs in the page content
            page_content = page_response.text

            # Try to find video URLs in common patterns
            import re
            video_patterns = [
                r'"contentUrl":"([^"]*\.mp4[^"]*)"',
                r'"url":"([^"]*thumbs[^"]*\.mp4[^"]*)"',
                r'src="([^"]*\.mp4[^"]*)"',
                r'data-src="([^"]*\.mp4[^"]*)"'
            ]

            for pattern in video_patterns:
                matches = re.findall(pattern, page_content, re.IGNORECASE)
                for match in matches:
                    # Clean up the URL (remove escape characters)
                    video_url = match.replace('\\/', '/')
                    if video_url.startswith('//'):
                        video_url = 'https:' + video_url
                    elif not video_url.startswith('http'):
                        video_url = 'https://' + video_url

                    try:
                        # Verify this URL works
                        test_response = requests.head(video_url, headers=headers, timeout=10)
                        if test_response.status_code == 200:
                            content_type = test_response.headers.get('content-type', '')
                            if content_type.startswith('video/'):
                                print(f"Found RedGifs video URL from page: {video_url}")
                                return video_url, 'video'
                    except requests.RequestException:
                        continue

            raise ValueError(f"Could not extract video URL from RedGifs page: {redgifs_url}")

        except Exception as e:
            raise ValueError(f"Failed to extract RedGifs video: {str(e)}")

    def _get_random_subreddit_post(self, subreddit_url, seed, media_type="image"):
        """
        Get a random post from a subreddit

        Args:
            subreddit_url: Subreddit URL (e.g., https://www.reddit.com/r/pics/ or just r/pics)
            seed: Seed for randomization
            media_type: Type of media to filter for ("image" or "video")

        Returns:
            str: Random post URL from the subreddit
        """
        try:
            # Clean up subreddit URL
            subreddit_url = subreddit_url.strip()
            
            # Extract subreddit name from various formats
            if 'reddit.com/r/' in subreddit_url:
                subreddit_name = subreddit_url.split('reddit.com/r/')[1].split('/')[0]
            elif subreddit_url.startswith('r/'):
                subreddit_name = subreddit_url[2:].split('/')[0]
            else:
                subreddit_name = subreddit_url.split('/')[0]
            
            # Randomize between 'hot', 'new', and 'top' sort methods using the seed
            random.seed(seed)
            sort_methods = ['hot', 'new', 'top']
            selected_sort = random.choice(sort_methods)
            
            # Build subreddit JSON API URL with randomized sort method and larger limit
            # Using limit=100 to get a larger pool of posts
            if selected_sort == 'top':
                json_url = f'https://www.reddit.com/r/{subreddit_name}/top.json?limit=100&t=week'
            else:
                json_url = f'https://www.reddit.com/r/{subreddit_name}/{selected_sort}.json?limit=100'
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            print(f"Fetching posts from r/{subreddit_name} (sort: {selected_sort})...")
            response = requests.get(json_url, headers=headers, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if 'data' not in data or 'children' not in data['data']:
                raise ValueError(f"Invalid subreddit data received from r/{subreddit_name}")
            
            posts = data['data']['children']
            
            if not posts:
                raise ValueError(f"No posts found in r/{subreddit_name}")
            
            # Filter posts that have media (images or videos) based on media_type preference
            media_posts = []
            for post in posts:
                post_data = post['data']
                url = post_data.get('url', '')
                
                # Determine if post is image or video
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
                     any(m.get('e') == 'AnimatedImage' or m.get('e') == 'Video' for m in post_data.get('media_metadata', {}).values()))
                )
                
                # Add post if it matches the desired media type
                if media_type == "image" and is_image:
                    media_posts.append(post_data)
                elif media_type == "video" and is_video:
                    media_posts.append(post_data)
            
            if not media_posts:
                raise ValueError(f"No {media_type} posts found in r/{subreddit_name}. Try a different subreddit or media type.")
            
            print(f"Found {len(media_posts)} {media_type} posts in r/{subreddit_name} (sort: {selected_sort})")
            
            # Randomly select a post using the seed (already seeded above)
            selected_post = random.choice(media_posts)
            random.seed(None)
            
            # Build post URL
            post_permalink = selected_post.get('permalink', '')
            if post_permalink:
                post_url = f"https://www.reddit.com{post_permalink}"
            else:
                # Fallback to constructing URL from post ID
                post_id = selected_post.get('id', '')
                post_url = f"https://www.reddit.com/r/{subreddit_name}/comments/{post_id}/"
            
            print(f"Selected random post: {selected_post.get('title', 'Unknown')}")
            print(f"Post URL: {post_url}")
            
            return post_url
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to fetch subreddit posts: Network error - {str(e)}")
        except (KeyError, IndexError, TypeError) as e:
            raise Exception(f"Failed to parse subreddit data: Invalid format - {str(e)}")
        except Exception as e:
            raise Exception(f"Subreddit randomization failed: {str(e)}")

    def _download_reddit_media(self, reddit_url):
        """
        Download media from a Reddit post URL

        Args:
            reddit_url: Reddit post URL

        Returns:
            tuple: (media_path, media_type, media_info) or raises exception on failure
        """
        try:
            # Validate URL format
            if not reddit_url or not isinstance(reddit_url, str):
                raise ValueError("Invalid Reddit URL provided")

            # Clean up URL - ensure it's a proper Reddit URL
            reddit_url = reddit_url.strip()
            if not reddit_url.startswith(('http://', 'https://')):
                reddit_url = 'https://' + reddit_url

            parsed_url = urlparse(reddit_url)
            if 'reddit.com' not in parsed_url.netloc:
                raise ValueError("URL must be a Reddit post URL")

            # Convert to JSON API URL
            json_url = reddit_url.rstrip('/') + '.json'

            # Set headers to mimic a browser request
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }

            # Get Reddit post data
            response = requests.get(json_url, headers=headers, timeout=30)
            response.raise_for_status()

            data = response.json()
            if not data or len(data) < 1:
                raise ValueError("Unable to parse Reddit post data")

            post_data = data[0]['data']['children'][0]['data']

            # Extract media information
            media_url = None
            media_type = None
            post_title = post_data.get('title', 'Reddit Post')

            # Check for direct image/video URL
            if post_data.get('url'):
                url = post_data['url']

                # Handle different Reddit media formats
                if url.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    media_url = url
                    media_type = 'image'
                elif url.endswith(('.mp4', '.webm', '.mov')):
                    media_url = url
                    media_type = 'video'
                elif 'i.redd.it' in url:
                    media_url = url
                    media_type = 'image'
                elif 'v.redd.it' in url:
                    # Reddit video - need to get the video URL
                    if post_data.get('media') and post_data['media'].get('reddit_video'):
                        media_url = post_data['media']['reddit_video'].get('fallback_url')
                        media_type = 'video'

                elif 'redgifs.com' in url or 'gfycat.com' in url:
                    # External video hosting - extract the actual video URL
                    media_url, media_type = self._extract_redgifs_url(url)
                    if not media_url:
                        # Fallback: try to use the original URL directly
                        print(f"Warning: Could not extract direct video URL from {url}, trying original URL as fallback")
                        media_url = url
                        media_type = 'video'

            # Check for gallery or media_metadata
            if not media_url and post_data.get('media_metadata'):
                # Handle Reddit gallery posts - take the first media item
                for media_id, media_info in post_data['media_metadata'].items():
                    if media_info.get('s') and media_info['s'].get('u'):
                        media_url = unescape(media_info['s']['u'])
                        if media_info.get('m', '').startswith('image/'):
                            media_type = 'image'
                        elif media_info.get('m', '').startswith('video/'):
                            media_type = 'video'
                        break

            if not media_url:
                raise ValueError(f"No downloadable media found in Reddit post: {post_title}")

            # Download the media file
            print(f"Downloading media from: {media_url}")

            # Special handling for redgifs URLs that might not be direct video URLs
            if 'redgifs.com' in media_url and not media_url.endswith(('.mp4', '.webm', '.mov')):
                print("Warning: Redgifs URL doesn't appear to be a direct video link, trying to extract...")
                extracted_url, extracted_type = self._extract_redgifs_url(media_url)
                if extracted_url:
                    print(f"Successfully extracted direct video URL: {extracted_url}")
                    media_url = extracted_url
                    media_type = extracted_type
                else:
                    print("Failed to extract direct URL, will try original URL anyway...")

            media_response = requests.get(media_url, headers=headers, timeout=60)
            media_response.raise_for_status()

            # Check if we got actual media content
            content_type = media_response.headers.get('content-type', '')
            content_length = len(media_response.content)

            print(f"Downloaded content: {content_type}, size: {content_length} bytes")

            # If we got HTML instead of media (common with redgifs), try to extract again
            if content_type.startswith('text/html') and 'redgifs.com' in media_url:
                print("Got HTML content instead of video, this suggests URL extraction failed")
                raise ValueError(f"Redgifs URL returned webpage instead of video: {media_url}")

            # Validate we have actual content
            if content_length < 1024:  # Less than 1KB is suspicious for media
                print(f"Warning: Very small content size ({content_length} bytes), might not be valid media")

            # Determine file extension from content type or URL
            file_ext = None

            if content_type:
                file_ext = mimetypes.guess_extension(content_type)

            if not file_ext:
                # Fallback to URL extension
                parsed_media_url = urlparse(media_url)
                if '.' in parsed_media_url.path:
                    file_ext = '.' + parsed_media_url.path.split('.')[-1].lower()

            if not file_ext:
                file_ext = '.mp4' if media_type == 'video' else '.jpg'

            # Create temporary file using ComfyUI-aware temp directory
            temp_path = get_temp_file_path(suffix=file_ext, prefix='reddit_media', subdir='downloads')
            with open(temp_path, 'wb') as temp_file:
                temp_file.write(media_response.content)

            # Create media info
            file_size = len(media_response.content)
            media_info = {
                'title': post_title,
                'url': reddit_url,
                'media_url': media_url,
                'file_size': file_size,
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
        """
        Extract the actual video URL from a redgifs or gfycat page

        Args:
            redgifs_url: redgifs or gfycat URL

        Returns:
            tuple: (video_url, media_type) or (None, None) on failure
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }

            print(f"[DEBUG] Attempting to extract video URL from: {redgifs_url}")

            # Handle different redgifs URL formats
            if 'redgifs.com' in redgifs_url:
                # Extract gif ID from URL
                parsed_url = urlparse(redgifs_url)
                path_parts = parsed_url.path.strip('/').split('/')

                # Try to find the gif ID (usually the last part or after 'watch')
                gif_id = None
                if 'watch' in path_parts:
                    gif_idx = path_parts.index('watch')
                    if gif_idx + 1 < len(path_parts):
                        gif_id = path_parts[gif_idx + 1]
                elif path_parts:
                    gif_id = path_parts[-1]

                print(f"[DEBUG] Extracted gif_id: {gif_id}")

                if gif_id:
                    # Strategy 1: Try to scrape the page for video URLs
                    try:
                        print("[DEBUG] Strategy 1: Scraping page for video URLs")
                        response = requests.get(redgifs_url, headers=headers, timeout=30)
                        if response.status_code == 200:
                            content = response.text

                            # Look for various video URL patterns in the HTML
                            import re

                            # Pattern 1: Look for HD/SD video URLs in script tags or data attributes
                            patterns = [
                                r'"(https://[^"]*\.redgifs\.com/[^"]*\.mp4[^"]*)"',
                                r'"(https://files\.redgifs\.com/[^"]*\.mp4[^"]*)"',
                                r'"(https://thumbs\d*\.redgifs\.com/[^"]*\.mp4[^"]*)"',
                                r'"videoUrl":"([^"]*)"',
                                r'"url":"(https://[^"]*\.mp4[^"]*)"',
                            ]

                            for pattern in patterns:
                                matches = re.findall(pattern, content, re.IGNORECASE)
                                for match in matches:
                                    # Clean up the URL (remove escaping)
                                    clean_url = match.replace('\\', '')
                                    print(f"[DEBUG] Found potential video URL: {clean_url}")

                                    # Test if the URL is accessible
                                    try:
                                        test_response = requests.head(clean_url, headers=headers, timeout=10)
                                        if test_response.status_code == 200:
                                            content_type = test_response.headers.get('content-type', '')
                                            if 'video' in content_type.lower() or clean_url.endswith('.mp4'):
                                                print(f"[DEBUG] Successfully found working video URL: {clean_url}")
                                                return clean_url, 'video'
                                    except:
                                        continue
                    except Exception as e:
                        print(f"[DEBUG] Strategy 1 failed: {str(e)}")

                    # Strategy 2: Try common direct URL patterns
                    try:
                        print("[DEBUG] Strategy 2: Trying direct URL patterns")
                        direct_patterns = [
                            f"https://files.redgifs.com/{gif_id}.mp4",
                            f"https://thumbs.redgifs.com/{gif_id}.mp4",
                            f"https://thumbs2.redgifs.com/{gif_id}.mp4",
                            f"https://files.redgifs.com/{gif_id}-mobile.mp4",
                        ]

                        for direct_url in direct_patterns:
                            try:
                                print(f"[DEBUG] Testing direct URL: {direct_url}")
                                test_response = requests.head(direct_url, headers=headers, timeout=10)
                                if test_response.status_code == 200:
                                    print(f"[DEBUG] Direct URL successful: {direct_url}")
                                    return direct_url, 'video'
                            except:
                                continue
                    except Exception as e:
                        print(f"[DEBUG] Strategy 2 failed: {str(e)}")

                    # Strategy 3: Try the API (might be rate limited or require auth)
                    try:
                        print("[DEBUG] Strategy 3: Trying redgifs API")
                        api_url = f"https://api.redgifs.com/v2/gifs/{gif_id}"
                        response = requests.get(api_url, headers=headers, timeout=30)

                        if response.status_code == 200:
                            data = response.json()
                            print(f"[DEBUG] API response structure: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")

                            if 'gif' in data and 'urls' in data['gif']:
                                video_urls = data['gif']['urls']
                                print(f"[DEBUG] Available video qualities: {list(video_urls.keys())}")

                                for quality in ['hd', 'sd', 'poster']:
                                    if quality in video_urls and video_urls[quality]:
                                        video_url = video_urls[quality]
                                        print(f"[DEBUG] Found {quality} quality video: {video_url}")
                                        return video_url, 'video'
                        else:
                            print(f"[DEBUG] API returned status {response.status_code}: {response.text[:200]}")
                    except Exception as e:
                        print(f"[DEBUG] Strategy 3 failed: {str(e)}")

            elif 'gfycat.com' in redgifs_url:
                print("[DEBUG] Processing gfycat URL (legacy)")
                # Gfycat was shut down, but some URLs might redirect to redgifs
                parsed_url = urlparse(redgifs_url)
                path_parts = parsed_url.path.strip('/').split('/')

                if path_parts:
                    gfy_name = path_parts[-1]
                    print(f"[DEBUG] Extracted gfy_name: {gfy_name}")

                    # Try redgifs with the gfy name
                    return self._extract_redgifs_url(f"https://www.redgifs.com/watch/{gfy_name}")

            print(f"[DEBUG] All strategies failed for {redgifs_url}")

        except Exception as e:
            print(f"[DEBUG] Exception in _extract_redgifs_url: {str(e)}")

        return None, None

    def _process_image(self, gemini_api_key, gemini_model, model_type, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, prefix_text, image, selected_media_path, media_info_text, override_subject="", override_cinematic_aesthetic="", override_stylization_tone="", override_clothing=""):
        """
        Process image using logic from GeminiImageDescribe
        
        Args:
            override_subject: Override text for SUBJECT paragraph
            override_cinematic_aesthetic: Override text for CINEMATIC AESTHETIC paragraph
            override_stylization_tone: Override text for STYLIZATION & TONE paragraph
            override_clothing: Override text for CLOTHING paragraph
        """
        try:
            # Build system prompt based on individual options
            if model_type == "Text2Image":
                # Initialize prompt components
                prompts = []
                paragraph_num = 1

                # Subject paragraph (conditional)
                if describe_subject:
                    subject_prompt = f"""SUBJECT ({self._ordinal(paragraph_num)} Paragraph)
Begin with a gendered noun phrase (e.g., "A woman…", "A man…")."""

                    # Add hair style description if enabled
                    if describe_hair_style:
                        subject_prompt += """
Include hairstyle and its texture or motion (no color or length)."""

                    subject_prompt += """
Include posture, gestures as applicable.
Strictly exclude any reference to ethnicity, age, body type, tattoos, glasses, hair color, hair length, eye color, height, or makeup."""

                    prompts.append(subject_prompt)
                    paragraph_num += 1

                # Build cinematic aesthetic paragraph
                if describe_bokeh:
                    cinematic_prompt = f"""CINEMATIC AESTHETIC CONTROL ({self._ordinal(paragraph_num)} Paragraph)
Lighting (source/direction/quality/temperature), camera details (shot type, angle/height, movement), optics (lens feel, DOF, rack focus), and exposure/render cues as applicable."""
                else:
                    cinematic_prompt = f"""CINEMATIC AESTHETIC CONTROL ({self._ordinal(paragraph_num)} Paragraph)
Lighting (source/direction/quality/temperature), camera details (shot type, angle/height, movement), and exposure/render cues as applicable. Everything must be in sharp focus with no depth of field effects, bokeh, or blur. Do not mention optics, DOF, rack focus, or any depth-related visual effects."""

                prompts.append(cinematic_prompt)
                paragraph_num += 1

                # Style paragraph
                style_prompt = f"""STYLIZATION & TONE ({self._ordinal(paragraph_num)} Paragraph)
Mood/genre descriptors (e.g., "noir-inspired silhouette," "cinematic realism," etc.)."""

                prompts.append(style_prompt)
                paragraph_num += 1

                # Clothing paragraph (conditional)
                clothing_prompt = ""
                if describe_clothing:
                    clothing_prompt = f"""
CLOTHING ({self._ordinal(paragraph_num)} Paragraph)
Describe all visible clothing and accessories with absolute certainty and definitiveness. Be specific: identify garment type with confidence, state definitive color(s), material/texture, fit/silhouette, length, notable construction (seams, straps, waistbands), and condition. Include footwear if visible and describe exactly how fabrics respond to motion (stretching, swaying, tightening, wrinkling). Make decisive choices when multiple interpretations are possible - choose one specific description and state it as fact. Do not describe any text, typography, words, letters, logos, brand names, or written content visible on clothing or accessories. Exclude tattoos, glasses, and other prohibited attributes."""
                    if change_clothing_color:
                        clothing_prompt += "\nAdditionally, do not repeat the original clothing colors you infer from the media. Instead, change the clothing color descriptions to NEW hues that harmonize with the scene's lighting and palette while being different from the original colors. Prefer complementary, analogous, or neutral tones that fit the environment; state the NEW colors decisively (e.g., 'a deep forest-green jacket' even if the original is different). Never mention or compare to the original color."
                    paragraph_num += 1

                paragraph_count = paragraph_num - 1

                # Build critical note based on what's included
                critical_note = f"CRITICAL: Output exactly {paragraph_count} paragraphs, one per category, separated by a blank line."

                if not describe_clothing:
                    critical_note += " DO NOT describe clothing, accessories, or garments in any paragraph."
                if not describe_subject:
                    critical_note += " DO NOT describe people, subjects, or human figures in any paragraph."

                # Add bokeh restriction if needed
                if not describe_bokeh:
                    critical_note += " Never mention depth of field, bokeh, blur, optics, DOF, rack focus, or any depth-related visual effects."

                if describe_clothing and change_clothing_color:
                    critical_note += " When stating clothing colors, only state the NEW, scene-harmonized colors (different from original); never mention the original colors."

                critical_note += " Never mention prohibited attributes, even if visible. Be completely decisive and definitive in all descriptions - eliminate all uncertainty language including 'appears to be', 'seems to be', 'might be', 'possibly', 'likely', 'or', 'either/or'. When multiple interpretations are possible, confidently choose one and state it as absolute fact."

                # Combine all parts
                combined_prompts = "\n\n".join(prompts)

                system_prompt = f"""Generate a Wan 2.2 optimized text to image prompt. You are an expert assistant specialized in analyzing and verbalizing input media for instagram-quality posts using the Wan 2.2 Text to Image workflow.

DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions. When you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or". Instead of "holding a black folder or book", write "holding a black folder". Instead of "wearing what appears to be denim", write "wearing dark blue denim jeans".

Before writing, silently review the provided media. Do not use meta phrases (e.g., "this picture shows").
Generate descriptions that adhere to the following structured layers and constraints, formatting each as a SEPARATE PARAGRAPH in this exact order:

{combined_prompts}{clothing_prompt}

{critical_note}"""
                user_prompt = f"Please analyze this image and provide a detailed description following the {paragraph_count}-paragraph structure outlined in the system prompt."

            else:  # model_type == "ImageEdit"
                # Build ImageEdit system prompt based on options
                focus_instruction = "f/11 for deep focus—no bokeh or blur" if not describe_bokeh else ""
                if not describe_bokeh:
                    focus_safeguards = ", no depth of field, no bokeh"
                else:
                    focus_safeguards = ""

                # Build traits list based on options
                traits_list = []
                if describe_hair_style:
                    traits_list.append("hairstyle and")
                if describe_clothing:
                    traits_list.append("outfit style")

                if describe_subject:
                    traits_list.append("pose, posture")
                    traits_instruction = ", ".join(traits_list) if traits_list else "pose and posture only"

                    if describe_clothing:
                        clothing_note = f"describe {traits_instruction} (without age, ethnicity, tattoos, hair color, etc.)"
                    else:
                        clothing_note = f"describe {traits_instruction} only (avoid clothing, age, ethnicity, tattoos, hair color, etc.)"

                    change_colors_clause = ""
                    if describe_clothing and change_clothing_color:
                        change_colors_clause = ", and change all clothing colors to NEW hues that harmonize with the scene while being different from the original colors (do not reuse or mention original colors; choose complementary/analogous/neutral tones and state them explicitly)"

                    system_prompt = f"""You are an expert assistant generating concise, single-sentence Qwen-Image-Edit instructions. Always be completely decisive and definitive - when you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or". Instead of "holding a black folder or book", write "holding a black folder".

Always begin with "Make this person…", include vivid, focused scene details (e.g. bedroom props, lights, furniture or gym bench, textured wall, window views) early to anchor the setting{"," if focus_instruction else ""} {focus_instruction}, {clothing_note}{change_colors_clause}, include clear torso and head orientation (e.g., "back facing the camera with torso turned 45° and head looking over her shoulder toward viewer"), reference cinematic aesthetic cues (lighting, framing, lens, shot type), anchor realism by stating skin shows subtle pores, light wrinkles, and realistic surface detail, end with "keep everything else unchanged," and include negative safeguards like "no distortion, no blur artifacts{focus_safeguards}.\""""
                else:
                    # No subject description - focus on environment/scene only
                    traits_instruction = ", ".join(traits_list) if traits_list else "environment details only"

                    system_prompt = f"""You are an expert assistant generating concise, single-sentence Qwen-Image-Edit instructions. Always be completely decisive and definitive - when you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or".

Focus on vivid, focused scene details (e.g. bedroom props, lights, furniture or gym bench, textured wall, window views) to anchor the setting{"," if focus_instruction else ""} {focus_instruction}, do not describe people or human subjects, reference cinematic aesthetic cues (lighting, framing, lens, shot type), end with "keep everything else unchanged," and include negative safeguards like "no distortion, no blur artifacts{focus_safeguards}.\""""

                user_prompt = "Please analyze this image and generate a single-sentence Qwen-Image-Edit instruction following the guidelines in the system prompt."

            # Convert image to bytes for Gemini
            if image is not None:
                # Convert ComfyUI IMAGE tensor to image data
                if hasattr(image, 'cpu'):
                    image_np = image.cpu().numpy()
                else:
                    image_np = image

                # Take the first image from the batch if multiple images
                if len(image_np.shape) == 4:
                    image_array = image_np[0]
                else:
                    image_array = image_np

                # Convert from 0-1 float to 0-255 uint8
                if image_array.dtype == np.float32 or image_array.dtype == np.float64:
                    image_array = (image_array * 255).astype(np.uint8)

                # Convert numpy array to PIL Image
                if len(image_array.shape) == 3 and image_array.shape[2] == 3:
                    pil_image = Image.fromarray(image_array, 'RGB')
                elif len(image_array.shape) == 3 and image_array.shape[2] == 4:
                    pil_image = Image.fromarray(image_array, 'RGBA')
                else:
                    pil_image = Image.fromarray(image_array).convert('RGB')

                # Convert PIL image to bytes
                img_byte_arr = io.BytesIO()
                pil_image.save(img_byte_arr, format='JPEG')
                image_data = img_byte_arr.getvalue()

                # Update media info
                media_info_text += f"\n• Resolution: {pil_image.size[0]}x{pil_image.size[1]}"
            elif selected_media_path:
                # Read image from file path
                pil_image = Image.open(selected_media_path)
                if pil_image.mode != 'RGB':
                    pil_image = pil_image.convert('RGB')

                # Convert PIL image to bytes
                img_byte_arr = io.BytesIO()
                pil_image.save(img_byte_arr, format='JPEG')
                image_data = img_byte_arr.getvalue()

                # Update media info
                file_size = os.path.getsize(selected_media_path) / 1024 / 1024  # Size in MB
                media_info_text += f"\n• Resolution: {pil_image.size[0]}x{pil_image.size[1]}\n• File Size: {file_size:.2f} MB"
            else:
                raise ValueError("No image data available for processing")

            # Determine output dimensions based on image orientation
            img_width = pil_image.size[0]
            img_height = pil_image.size[1]
            if img_width > img_height:
                # Landscape: width is longer
                output_width = 832
                output_height = 480
            else:
                # Portrait or square: height is longer or equal
                output_width = 480
                output_height = 832

            # Determine media identifier for caching
            if selected_media_path:
                # For file-based media, use file path + modification time
                media_identifier = get_file_media_identifier(selected_media_path)
            else:
                # For tensor-based media, use content hash
                media_identifier = get_tensor_media_identifier(image)

            # Check cache for existing result
            cache = get_cache()

            # Build options dict for caching
            cache_options = {
                "describe_clothing": describe_clothing,
                "change_clothing_color": change_clothing_color,
                "describe_hair_style": describe_hair_style,
                "describe_bokeh": describe_bokeh,
                "describe_subject": describe_subject
            }

            cached_result = cache.get(
                media_identifier=media_identifier,
                gemini_model=gemini_model,
                model_type=model_type,
                options=cache_options
            )

            if cached_result is not None:
                # Return cached result
                description = cached_result['description']

                # Format outputs for cached image processing
                gemini_status = f"""🤖 Gemini Analysis Status: ✅ Complete (Cached)
• Model: {gemini_model}
• Model Type: {model_type}
• API Key: {'*' * (len(gemini_api_key) - 4) + gemini_api_key[-4:] if len(gemini_api_key) >= 4 else '****'}
• Input: Image
• Cache: HIT at {cached_result.get('human_timestamp', 'unknown time')}"""
                
                # Parse paragraphs and apply overrides
                subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement, final_description = self._parse_paragraphs(
                    description, override_subject, override_cinematic_aesthetic, override_stylization_tone, override_clothing
                )
                
                final_string = f"{prefix_text}{final_description}" if prefix_text else final_description

                # Create aggregated data output for Control Panel as JSON
                all_data = json.dumps({
                    "description": final_description,
                    "media_info": media_info_text,
                    "gemini_status": gemini_status,
                    "final_string": final_string,
                    "height": output_height,
                    "width": output_width,
                    "subject": subject,
                    "cinematic_aesthetic": cinematic_aesthetic,
                    "stylization_tone": stylization_tone,
                    "clothing": clothing,
                    "scene": scene,
                    "movement": movement
                })

                return (final_string, all_data, output_height, output_width)

            # Initialize the Gemini client
            client = genai.Client(api_key=gemini_api_key)

            # Create the content structure for image analysis
            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(
                            mime_type="image/jpeg",
                            data=image_data,
                        ),
                    ],
                ),
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=f"{system_prompt}\n\n{user_prompt}"),
                    ],
                ),
            ]

            # Configure generation with thinking enabled
            generate_content_config = types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_budget=-1,
                ),
            )

            # Generate the image description with retry logic
            response = self._call_gemini_with_retry(
                client=client,
                model=gemini_model,
                contents=contents,
                config=generate_content_config,
                max_retries=3,
                retry_delay=5
            )

            # Process response (response.text is guaranteed to be non-None from retry logic)
            description = response.text.strip()

            # Store successful result in cache
            cache.set(
                media_identifier=media_identifier,
                gemini_model=gemini_model,
                description=description,
                model_type=model_type,
                options=cache_options
            )

            # Format outputs for image processing
            gemini_status = f"""🤖 Gemini Analysis Status: ✅ Complete
• Model: {gemini_model}
• Model Type: {model_type}
• API Key: {'*' * (len(gemini_api_key) - 4) + gemini_api_key[-4:] if len(gemini_api_key) >= 4 else '****'}
• Input: Image"""
            
            # Parse paragraphs and apply overrides
            subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement, final_description = self._parse_paragraphs(
                description, override_subject, override_cinematic_aesthetic, override_stylization_tone, override_clothing
            )
            
            final_string = f"{prefix_text}{final_description}" if prefix_text else final_description

            # Create aggregated data output for Control Panel as JSON
            all_data = json.dumps({
                "description": final_description,
                "media_info": media_info_text,
                "gemini_status": gemini_status,
                "final_string": final_string,
                "height": output_height,
                "width": output_width,
                "subject": subject,
                "cinematic_aesthetic": cinematic_aesthetic,
                "stylization_tone": stylization_tone,
                "clothing": clothing,
                "scene": scene,
                "movement": movement
            })

            return (final_string, all_data, output_height, output_width)

        except Exception as e:
            # Re-raise the exception to stop workflow execution
            raise Exception(f"Image analysis failed: {str(e)}")

    def _process_video(self, gemini_api_key, gemini_model, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, replace_action_with_twerking, prefix_text, selected_media_path, frame_rate, max_duration, media_info_text, override_subject="", override_cinematic_aesthetic="", override_stylization_tone="", override_clothing="", override_scene="", override_movement=""):
        """
        Process video using logic from GeminiVideoDescribe
        
        Args:
            override_subject: Override text for SUBJECT paragraph
            override_cinematic_aesthetic: Override text for CINEMATIC AESTHETIC paragraph
            override_stylization_tone: Override text for STYLIZATION & TONE paragraph
            override_clothing: Override text for CLOTHING paragraph
            override_scene: Override text for SCENE paragraph
            override_movement: Override text for MOVEMENT paragraph
        """
        try:
            # Build system prompt based on individual options for video
            # Initialize paragraph tracking
            paragraph_num = 1
            prompts = []

            # Subject paragraph (conditional)
            if describe_subject:
                subject_prompt = f"""{paragraph_num}. SUBJECT ({self._ordinal(paragraph_num)} Paragraph)
Begin with a gendered noun phrase (e.g., "A woman…", "A man…")."""

                # Add hair style description if enabled
                if describe_hair_style:
                    subject_prompt += """
Include hairstyle and its texture or motion (no color or length)."""

                subject_prompt += """
Include posture, gestures as applicable.
Strictly exclude any reference to ethnicity, age, body type, tattoos, glasses, hair color, hair length, eye color, height, or makeup."""

                prompts.append(subject_prompt)
                paragraph_num += 1

            # Build clothing paragraph (conditional)
            if describe_clothing:
                clothing_prompt = f"""
{paragraph_num}. CLOTHING ({self._ordinal(paragraph_num)} Paragraph)
Describe all visible clothing and accessories with absolute certainty and definitiveness. Be specific: identify garment type with confidence, state definitive color(s), material/texture, fit/silhouette, length, notable construction (seams, straps, waistbands), and condition. Include footwear if visible and describe exactly how fabrics respond to motion (stretching, swaying, tightening, wrinkling). Make decisive choices when multiple interpretations are possible - choose one specific description and state it as fact. Do not describe any text, typography, words, letters, logos, brand names, or written content visible on clothing or accessories. Exclude tattoos, glasses, and other prohibited attributes."""
                if change_clothing_color:
                    clothing_prompt += "\nAdditionally, do not repeat the original clothing colors you infer from the video. Instead, change the clothing color descriptions to NEW hues that harmonize with the scene's lighting and palette while being different from the original colors. Prefer complementary, analogous, or neutral tones that fit the environment; state the NEW colors decisively, and never reference the original color."
                paragraph_num += 1
            else:
                clothing_prompt = ""

            # Scene paragraph
            scene_prompt = f"""
{paragraph_num}. SCENE ({self._ordinal(paragraph_num)} Paragraph)
Describe the visible environment clearly and vividly."""
            prompts.append(scene_prompt)
            paragraph_num += 1

            # Movement paragraph
            if replace_action_with_twerking:
                movement_prompt = f"""
{paragraph_num}. MOVEMENT ({self._ordinal(paragraph_num)} Paragraph)
Describe the initial pose and body position in the first frame of the video. Then append: "A woman is twerking and shaking her ass. She has a curvy body and a huge ass. """
            else:
                movement_prompt = f"""
{paragraph_num}. MOVEMENT ({self._ordinal(paragraph_num)} Paragraph)
In this paragraph, describe body-part–specific movement and how it aligns with musical rhythm and beat structure. Begin with an overall summary: e.g., 'The subject initiates with a hip sway on the downbeat…'. Then narrate movement chronologically, using precise action verbs and transitions like 'then', 'as', and 'after', referencing the timeline (e.g., early/mid/late beat or second). Specify which body parts move, how they articulate (e.g., 'the right arm lifts upward, then sweeps outward; the torso tilts as the knees bend'), describe footwork, weight shifts, and alignment with music beats. Also include any camera movement (e.g., 'camera pans to follow the torso shift'). Avoid general labels—focus on locomotor and non‑locomotor gestures, repetition, rhythm, and choreography phrasing. Always include any buttock or breast movements that you see"""
            prompts.append(movement_prompt)
            paragraph_num += 1

            # Build cinematic aesthetic paragraph
            if describe_bokeh:
                cinematic_prompt = f"""
{paragraph_num}. CINEMATIC AESTHETIC CONTROL ({self._ordinal(paragraph_num)} Paragraph)
Lighting (source/direction/quality/temperature), camera details (shot type, angle/height, movement), optics (lens feel, DOF, rack focus), and exposure/render cues as applicable."""
            else:
                cinematic_prompt = f"""
{paragraph_num}. CINEMATIC AESTHETIC CONTROL ({self._ordinal(paragraph_num)} Paragraph)
Lighting (source/direction/quality/temperature), camera details (shot type, angle/height, movement), and exposure/render cues as applicable. Everything must be in sharp focus with no depth of field effects, bokeh, or blur. Do not mention optics, DOF, rack focus, or any depth-related visual effects."""

            prompts.append(cinematic_prompt)
            paragraph_num += 1

            # Style paragraph
            style_prompt = f"""
{paragraph_num}. STYLIZATION & TONE ({self._ordinal(paragraph_num)} Paragraph)
Mood/genre descriptors (e.g., "noir-inspired silhouette," "cinematic realism," etc.)."""
            prompts.append(style_prompt)

            paragraph_count = paragraph_num

            # Build critical note based on what's included
            critical_note = f"CRITICAL: Output exactly {paragraph_count} paragraphs, one per category, separated by a blank line."
            if not describe_clothing:
                critical_note += " DO NOT describe clothing, accessories, or garments in any paragraph."
            if not describe_subject:
                critical_note += " DO NOT describe people, subjects, or human figures in any paragraph."
            if not describe_bokeh:
                critical_note += " Never mention depth of field, bokeh, blur, optics, DOF, rack focus, or any depth-related visual effects."
            if describe_clothing and change_clothing_color:
                critical_note += " When stating clothing colors, only state the NEW, scene-harmonized colors (different from original); never mention the original colors."
            critical_note += " Never mention prohibited attributes, even if visible. Be completely decisive and definitive in all descriptions - eliminate all uncertainty language including 'appears to be', 'seems to be', 'might be', 'possibly', 'likely', 'or', 'either/or'. When multiple interpretations are possible, confidently choose one and state it as absolute fact."

            # Build JSON field descriptions based on enabled options
            subject_field = ""
            clothing_field = ""
            scene_field = ""
            movement_field = ""
            cinematic_field = ""
            style_field = ""
            
            if describe_subject:
                subject_field = 'Begin with a gendered noun phrase (e.g., "A woman…", "A man…").'
                if describe_hair_style:
                    subject_field += ' Include hairstyle and its texture or motion (no color or length).'
                subject_field += ' Include posture and gestures as applicable. Strictly exclude any reference to ethnicity, age, body type, tattoos, glasses, hair color, hair length, eye color, height, or makeup.'
            else:
                subject_field = 'Leave empty or provide minimal scene context without describing people.'
            
            if describe_clothing:
                clothing_field = 'Describe all visible clothing and accessories with absolute certainty and definitiveness. Be specific: garment type, definitive color(s), material/texture, fit/silhouette, length, notable construction (seams, straps, waistbands), and condition. Include footwear if visible and describe exactly how fabrics respond to motion (stretching, swaying, tightening, wrinkling). Make decisive choices when multiple interpretations are possible; state one as fact. Do not describe text, typography, words, letters, logos, brand names, or written content on clothing or accessories. Exclude tattoos, glasses, and other prohibited attributes.'
                if change_clothing_color:
                    clothing_field += ' Additionally, do not repeat the original clothing colors you infer from the video. Instead, change the clothing color descriptions to NEW hues that harmonize with the scene\'s lighting and palette while being different from the original colors. Prefer complementary, analogous, or neutral tones that fit the environment; state the NEW colors decisively, and never reference the original color.'
            else:
                clothing_field = 'Leave empty.'
            
            scene_field = 'Describe the visible environment clearly and vividly.'
            
            if replace_action_with_twerking:
                movement_field = 'Describe the initial pose and body position in the first frame of the video. Then append: "A woman is twerking and shaking her ass. She has a curvy body and a huge ass."'
            else:
                movement_field = 'Start with an overall summary tied to musical rhythm and beat structure (e.g., "The subject initiates with a hip sway on the downbeat…"). Then narrate movement chronologically using precise action verbs and transitions like "then", "as", "after", and reference timeline markers (early/mid/late beat or second). Specify which body parts move and how they articulate (e.g., "the right arm lifts upward, then sweeps outward; the torso tilts as the knees bend"), including footwork, weight shifts, and alignment with beats. Include any camera movement (e.g., "camera pans to follow the torso shift"). Avoid general labels—focus on locomotor and non-locomotor gestures, repetition, rhythm, and choreography phrasing. Always include any buttock or breast movements that you see.'
            
            if describe_bokeh:
                cinematic_field = 'Cover lighting (source/direction/quality/temperature), camera details (shot type, angle/height, movement), optics (lens feel, DOF, rack focus), and exposure/render cues as applicable.'
            else:
                cinematic_field = 'Cover lighting (source/direction/quality/temperature), camera details (shot type, angle/height, movement), and exposure/render cues as applicable. Everything must be in sharp focus with no depth of field effects, bokeh, or blur. Do not mention optics, DOF, rack focus, or any depth-related visual effects.'
            
            style_field = 'Provide mood/genre descriptors (e.g., "noir-inspired silhouette", "cinematic realism", etc.).'
            
            # Build constraints note
            constraints = "Never mention prohibited attributes (ethnicity, age, body type, tattoos, glasses, hair color, hair length, eye color, height, makeup), even if visible."
            if not describe_clothing:
                constraints += " DO NOT describe clothing, accessories, or garments in any field."
            if not describe_subject:
                constraints += " DO NOT describe people, subjects, or human figures in any field."
            if not describe_bokeh:
                constraints += " Never mention depth of field, bokeh, blur, optics, DOF, rack focus, or any depth-related visual effects."
            if describe_clothing and change_clothing_color:
                constraints += " When stating clothing colors, only state the NEW, scene-harmonized colors (different from original); never mention the original colors."
            constraints += " Be completely decisive and definitive in all descriptions—eliminate all uncertainty language including 'appears to be', 'seems to be', 'might be', 'possibly', 'likely', 'or', 'either/or'. When multiple interpretations are possible, confidently choose one and state it as absolute fact."

            system_prompt = f"""You are an expert assistant specialized in analyzing and verbalizing input videos for cinematic-quality video transformation using the Wan 2.2 + VACE workflow.

DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions. When you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or". Instead of "holding a black folder or book", write "holding a black folder". Instead of "wearing what appears to be denim", write "wearing dark blue denim jeans".

Before writing, silently review all provided frames as a single clip and infer motion across time; reason stepwise over the entire sequence (start → middle → end). Do not use meta phrases (e.g., "this video shows").

## Output format

Return **only** a single valid JSON object (no code fences, no extra text) with **exactly six** string fields in this exact order:

1. "subject"
2. "clothing"
3. "scene"
4. "movement"
5. "cinematic_aesthetic_control"
6. "stylization_tone"

Each field's value is one fully formed paragraph (a single string) for that category. Do not include newline characters between fields; each value should be a single-paragraph string.

Example (structure only):
{{
"subject": "…",
"clothing": "…",
"scene": "…",
"movement": "…",
"cinematic_aesthetic_control": "…",
"stylization_tone": "…"
}}

## Content requirements by field

### 1) SUBJECT → "subject"

{subject_field}

### 2) CLOTHING → "clothing"

{clothing_field}

### 3) SCENE → "scene"

{scene_field}

### 4) MOVEMENT → "movement"

{movement_field}

### 5) CINEMATIC AESTHETIC CONTROL → "cinematic_aesthetic_control"

{cinematic_field}

### 6) STYLIZATION & TONE → "stylization_tone"

{style_field}

## Global constraints

{constraints}"""
            user_prompt = "Please analyze this video and provide a detailed description in the JSON format specified in the system prompt."

            # Process video file
            if not selected_media_path or not os.path.exists(selected_media_path):
                raise ValueError(f"Video file not found: {selected_media_path}")

            # Get original video info using OpenCV
            cap = cv2.VideoCapture(selected_media_path)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            original_duration = frame_count / fps if fps > 0 else 0
            cap.release()

            print(f"Original video properties: {frame_count} frames, {fps:.2f} fps, {width}x{height}, {original_duration:.2f}s duration")

            # Determine output dimensions based on video orientation
            if width > height:
                # Landscape: width is longer
                output_width = 832
                output_height = 480
            else:
                # Portrait or square: height is longer or equal
                output_width = 480
                output_height = 832

            # Validate video has content
            if original_duration <= 0:
                raise ValueError(f"Invalid video: duration is {original_duration:.2f} seconds. The video file may be corrupted or empty.")
            if frame_count <= 0:
                raise ValueError(f"Invalid video: {frame_count} frames. The video file may be corrupted or empty.")

            # Determine the video file to use for analysis
            final_video_path = selected_media_path
            actual_duration = original_duration
            trimmed = False
            trimmed_video_output_path = selected_media_path

            # Calculate duration based on max_duration
            if max_duration > 0:
                # Ensure we don't go below 1 second minimum for meaningful analysis
                min_duration = min(1.0, original_duration)
                actual_duration = max(min_duration, min(max_duration, original_duration))
                print(f"Duration calculation: max_duration={max_duration}, original={original_duration:.2f}s, actual={actual_duration:.2f}s")
            else:
                actual_duration = original_duration

            # Check if we need to trim the video (only duration limit)
            if max_duration > 0 and actual_duration < original_duration:
                # Create a temporary trimmed video file using ComfyUI-aware temp directory
                trimmed_video_path = get_temp_file_path(suffix='.mp4', prefix='trimmed', subdir='videos')

                # Attempt to trim the video
                print(f"Attempting to trim video from {original_duration:.2f}s to {actual_duration:.2f}s")
                if self._trim_video(selected_media_path, trimmed_video_path, actual_duration):
                    final_video_path = trimmed_video_path
                    trimmed = True
                    trimmed_video_output_path = trimmed_video_path

                    # Verify trimmed file exists and has content
                    if os.path.exists(trimmed_video_path) and os.path.getsize(trimmed_video_path) > 0:
                        print(f"Successfully trimmed video to {trimmed_video_path}")
                    else:
                        print("Warning: Trimmed video file is empty or missing, using original")
                        final_video_path = selected_media_path
                        trimmed = False
                else:
                    print(f"Warning: Could not trim video. Using original video for {original_duration:.2f}s")
                    actual_duration = original_duration
                    trimmed_video_output_path = selected_media_path

            # Read the final video file (original or trimmed)
            with open(final_video_path, 'rb') as video_file:
                video_data = video_file.read()

            file_size = len(video_data) / 1024 / 1024  # Size in MB

            # Validate video size and format for Gemini API
            max_file_size_mb = 50  # Gemini's file size limit
            if file_size > max_file_size_mb:
                raise ValueError(f"Video file too large for Gemini API: {file_size:.2f} MB (max: {max_file_size_mb} MB). Try reducing max_duration.")

            # Determine correct MIME type based on file extension
            video_mime_type = "video/mp4"  # Default
            if final_video_path.lower().endswith(('.webm',)):
                video_mime_type = "video/webm"
            elif final_video_path.lower().endswith(('.mov',)):
                video_mime_type = "video/quicktime"
            elif final_video_path.lower().endswith(('.avi',)):
                video_mime_type = "video/x-msvideo"

            print(f"Processing video: {file_size:.2f} MB, {actual_duration:.2f}s, MIME: {video_mime_type}")

            # Update video info to include trimming details
            end_time = actual_duration  # Since we start from 0
            trim_info = f" (trimmed: 0.0s → {end_time:.1f}s)" if trimmed else ""

            updated_media_info = f"""{media_info_text}
• Original Duration: {original_duration:.2f} seconds
• Start Time: 0.0 seconds
• End Time: {end_time:.2f} seconds
• Processed Duration: {actual_duration:.2f} seconds{trim_info}
• Frames: {frame_count}
• Frame Rate: {fps:.2f} FPS
• Resolution: {width}x{height}
• File Size: {file_size:.2f} MB"""

            # Determine media identifier for caching (always file-based for videos)
            media_identifier = get_file_media_identifier(selected_media_path)

            # Check cache for existing result
            cache = get_cache()

            # Build options dict for caching
            cache_options = {
                "describe_clothing": describe_clothing,
                "change_clothing_color": change_clothing_color,
                "describe_hair_style": describe_hair_style,
                "describe_bokeh": describe_bokeh,
                "describe_subject": describe_subject,
                "replace_action_with_twerking": replace_action_with_twerking,  # Include in cache key
                "max_duration": max_duration  # Include duration in cache key
            }

            cached_result = cache.get(
                media_identifier=media_identifier,
                gemini_model=gemini_model,
                model_type="",  # Videos don't use model_type
                options=cache_options
            )

            if cached_result is not None:
                # Return cached result
                description = cached_result['description']

                # Format outputs for cached video processing
                gemini_status = f"""🤖 Gemini Analysis Status: ✅ Complete (Cached)
• Model: {gemini_model}
• API Key: {'*' * (len(gemini_api_key) - 4) + gemini_api_key[-4:] if len(gemini_api_key) >= 4 else '****'}
• Input: Video
• Cache: HIT at {cached_result.get('human_timestamp', 'unknown time')}"""
                
                # Parse paragraphs and apply overrides (for videos)
                subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement, final_description = self._parse_paragraphs(
                    description, override_subject, override_cinematic_aesthetic, override_stylization_tone, override_clothing, override_scene, override_movement
                )
                
                final_string = f"{prefix_text}{final_description}" if prefix_text else final_description

                # Create aggregated data output for Control Panel as JSON
                all_data = json.dumps({
                    "description": final_description,
                    "media_info": updated_media_info,
                    "gemini_status": gemini_status,
                    "final_string": final_string,
                    "height": output_height,
                    "width": output_width,
                    "subject": subject,
                    "cinematic_aesthetic": cinematic_aesthetic,
                    "stylization_tone": stylization_tone,
                    "clothing": clothing,
                    "scene": scene,
                    "movement": movement
                })

                return (final_string, all_data, output_height, output_width)

            # Initialize the Gemini client
            client = genai.Client(api_key=gemini_api_key)

            # Create the content structure for video analysis
            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(
                            mime_type=video_mime_type,
                            data=video_data,
                        ),
                    ],
                ),
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=f"{system_prompt}\n\n{user_prompt}"),
                    ],
                ),
            ]

            # Configure generation with thinking enabled
            generate_content_config = types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(
                    thinking_budget=-1,
                ),
            )

            # Generate the video description with retry logic
            response = self._call_gemini_with_retry(
                client=client,
                model=gemini_model,
                contents=contents,
                config=generate_content_config,
                max_retries=3,
                retry_delay=5
            )

            # Process response (response.text is guaranteed to be non-None from retry logic)
            description = response.text.strip()

            # Store successful result in cache
            cache.set(
                media_identifier=media_identifier,
                gemini_model=gemini_model,
                description=description,
                model_type="",  # Videos don't use model_type
                options=cache_options
            )

            # Format outputs for video processing
            gemini_status = f"""🤖 Gemini Analysis Status: ✅ Complete
• Model: {gemini_model}
• API Key: {'*' * (len(gemini_api_key) - 4) + gemini_api_key[-4:] if len(gemini_api_key) >= 4 else '****'}
• Input: Video"""

            # Parse paragraphs and apply overrides (for videos)
            subject, cinematic_aesthetic, stylization_tone, clothing, scene, movement, final_description = self._parse_paragraphs(
                description, override_subject, override_cinematic_aesthetic, override_stylization_tone, override_clothing, override_scene, override_movement
            )
            
            final_string = f"{prefix_text}{final_description}" if prefix_text else final_description

            # Create aggregated data output for Control Panel as JSON
            all_data = json.dumps({
                "description": final_description,
                "media_info": updated_media_info,
                "gemini_status": gemini_status,
                "final_string": final_string,
                "height": output_height,
                "width": output_width,
                "subject": subject,
                "cinematic_aesthetic": cinematic_aesthetic,
                "stylization_tone": stylization_tone,
                "clothing": clothing,
                "scene": scene,
                "movement": movement
            })

            return (final_string, all_data, output_height, output_width)

        except Exception as e:
            # Provide more specific error messages for common issues
            error_msg = str(e)
            if "500 INTERNAL" in error_msg:
                error_msg += "\n\nThis is a Gemini API server error. Try:\n- Using a shorter video (reduce max_duration)\n- Waiting a few minutes and trying again\n- Using a different video source"
            elif "413" in error_msg or "too large" in error_msg.lower():
                error_msg += "\n\nVideo file is too large. Try reducing max_duration to create a smaller video."
            elif "unsupported" in error_msg.lower():
                error_msg += "\n\nVideo format may not be supported. Try with a different video."

            # Re-raise the exception to stop workflow execution
            raise Exception(f"Video analysis failed: {error_msg}")

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        Takes media_processed_path from media selection node and generates description.
        """
        return {
            "required": {
                "media_processed_path": ("STRING", {
                    "default": "",
                    "tooltip": "Path to the processed media file from Media Selection node"
                }),
            },
            "optional": {
                "gemini_options": ("GEMINI_OPTIONS", {
                    "tooltip": "Configuration options from Gemini Util - Options node"
                }),
                "overrides": ("OVERRIDES", {
                    "tooltip": "Paragraph overrides from Media Describe - Overrides node (optional)"
                }),
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "INT", "INT")
    RETURN_NAMES = ("final_string", "all_media_describe_data", "height", "width")
    FUNCTION = "describe_media"
    CATEGORY = "Swiss Army Knife 🔪/Media Caption"

    def describe_media(self, media_processed_path, gemini_options=None, overrides=None):
        """
        Process media (image or video) and analyze with Gemini

        Args:
            media_processed_path: Path to the processed media file from Media Selection node
            gemini_options: Configuration options from Gemini Util - Options node (optional)
            overrides: Dictionary of paragraph overrides from Media Describe - Overrides node (optional)
        """
        # Validate media path
        if not media_processed_path or not media_processed_path.strip():
            raise ValueError("media_processed_path is required")
        
        if not os.path.exists(media_processed_path):
            raise ValueError(f"Media file does not exist: {media_processed_path}")

        # Handle missing gemini_options with defaults
        if gemini_options is None:
            gemini_options = {
                "gemini_api_key": "YOUR_GEMINI_API_KEY_HERE",
                "gemini_model": "models/gemini-2.5-flash",
                "model_type": "Text2Image",
                "describe_clothing": False,
                "change_clothing_color": False,
                "describe_hair_style": True,
                "describe_bokeh": True,
                "describe_subject": True,
                "replace_action_with_twerking": False,
                "prefix_text": ""
            }

        # Handle missing overrides with defaults
        if overrides is None:
            overrides = {}
        
        # Extract override values with defaults
        override_subject = overrides.get("override_subject", "")
        override_cinematic_aesthetic = overrides.get("override_cinematic_aesthetic", "")
        override_stylization_tone = overrides.get("override_stylization_tone", "")
        override_clothing = overrides.get("override_clothing", "")
        override_scene = overrides.get("override_scene", "")
        override_movement = overrides.get("override_movement", "")

        # Extract values from options
        gemini_api_key = gemini_options["gemini_api_key"]
        gemini_model = gemini_options["gemini_model"]
        model_type = gemini_options["model_type"]
        describe_clothing = gemini_options["describe_clothing"]
        change_clothing_color = gemini_options.get("change_clothing_color", False)
        describe_hair_style = gemini_options["describe_hair_style"]
        describe_bokeh = gemini_options["describe_bokeh"]
        describe_subject = gemini_options["describe_subject"]
        replace_action_with_twerking = gemini_options.get("replace_action_with_twerking", False)
        prefix_text = gemini_options["prefix_text"]

        try:
            # Determine media type from file extension
            file_ext = os.path.splitext(media_processed_path)[1].lower()
            video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm']
            media_type = "video" if file_ext in video_extensions else "image"
            
            media_info_text = f"{'📹' if media_type == 'video' else '📷'} Media Processing Info:\n• File: {os.path.basename(media_processed_path)}\n• Type: {media_type}\n• Full path: {media_processed_path}"

            # Process based on media type
            if media_type == "image":
                # Process as image - delegate to image logic
                return self._process_image(
                    gemini_api_key, gemini_model, model_type, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, prefix_text,
                    None, media_processed_path, media_info_text,
                    override_subject, override_cinematic_aesthetic, override_stylization_tone, override_clothing
                )
            else:
                # Process as video - delegate to video logic  
                return self._process_video(
                    gemini_api_key, gemini_model, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, replace_action_with_twerking, prefix_text,
                    media_processed_path, 30.0, 0.0, media_info_text,
                    override_subject, override_cinematic_aesthetic, override_stylization_tone, override_clothing, override_scene, override_movement
                )

        except Exception as e:
            # Re-raise the exception to stop workflow execution
            raise Exception(f"Media analysis failed: {str(e)}")
