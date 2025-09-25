from google import genai
from google.genai import types
import cv2
import hashlib
import tempfile
import os
import subprocess
import numpy as np
from PIL import Image
from html import unescape
import io
import json
import mimetypes
import requests
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse, urlunparse

from .cache import get_cache, get_file_media_identifier, get_tensor_media_identifier
from .civitai_service import CivitAIService
from .lora_hash_cache import get_cache as get_lora_hash_cache


class GeminiUtilOptions:
    """
    A ComfyUI custom node that provides configuration options for Gemini nodes.
    This node outputs an options object that can be connected to Gemini processing nodes.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "gemini_api_key": ("STRING", {
                    "multiline": False,
                    "default": os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE"),
                    "tooltip": "Your Gemini API key (automatically uses GEMINI_API_KEY environment variable if available)"
                }),
                "gemini_model": (["models/gemini-2.5-flash", "models/gemini-2.5-flash-lite", "models/gemini-2.5-pro"], {
                    "default": "models/gemini-2.5-flash",
                    "tooltip": "Select the Gemini model to use"
                }),
                "prompt_style": (["Text2Image", "ImageEdit"], {
                    "default": "Text2Image",
                    "tooltip": "Text2Image: Generates descriptive prompts for models like FLUX Dev, SDXL, etc. ImageEdit: Generates instruction prompts with words like 'change to...', 'modify this...' for image editing models like FLUX Redux/Kontext, Nano Banana, Qwen Image Edit"
                }),
                "describe_clothing": (["Yes", "No"], {
                    "default": "Yes",
                    "tooltip": "Whether to include detailed clothing and accessory descriptions"
                }),
                "change_clothing_color": (["Yes", "No"], {
                    "default": "No",
                    "tooltip": "If enabled, adjust clothing color descriptions to new colors that harmonize with the scene and differ from the original colors"
                }),
                "describe_hair_style": (["Yes", "No"], {
                    "default": "Yes",
                    "tooltip": "Whether to include hair style descriptions (texture and motion, but not color or length)"
                }),
                "describe_bokeh": (["Yes", "No"], {
                    "default": "Yes", 
                    "tooltip": "Whether to include depth of field effects, bokeh, and blur descriptions"
                }),
                "describe_subject": (["Yes", "No"], {
                    "default": "Yes",
                    "tooltip": "Whether to include subject/person descriptions in the first paragraph"
                }),
                "replace_action_with_twerking": (["Yes", "No"], {
                    "default": "No",
                    "tooltip": "Replace video movement/action description with twerking description"
                }),
                "prefix_text": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Text to prepend to the generated description"
                }),
            }
        }

    RETURN_TYPES = ("GEMINI_OPTIONS",)
    RETURN_NAMES = ("gemini_options",)
    FUNCTION = "create_options"
    CATEGORY = "Swiss Army Knife 🔪"

    def create_options(self, gemini_api_key, gemini_model, prompt_style, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, replace_action_with_twerking, prefix_text):
        """
        Create an options object with all the configuration settings
        """
        options = {
            "gemini_api_key": gemini_api_key,
            "gemini_model": gemini_model,
            "model_type": prompt_style,  # Keep internal key as model_type for backward compatibility
            "describe_clothing": describe_clothing == "Yes",
            "change_clothing_color": change_clothing_color == "Yes",
            "describe_hair_style": describe_hair_style == "Yes", 
            "describe_bokeh": describe_bokeh == "Yes",
            "describe_subject": describe_subject == "Yes",
            "replace_action_with_twerking": replace_action_with_twerking == "Yes",
            "prefix_text": prefix_text
        }
        return (options,)

class GeminiMediaDescribe:
    """
    A ComfyUI custom node for describing images or videos using Google's Gemini API.
    Supports both uploaded media and random selection from a directory path (including subdirectories).
    """

    def __init__(self):
        pass

    def _ordinal(self, n):
        """Convert number to ordinal string (1->First, 2->Second, etc.)"""
        ordinals = ["", "First", "Second", "Third", "Fourth", "Fifth", "Sixth"]
        if n < len(ordinals):
            return ordinals[n]
        else:
            return f"{n}th"

    def _trim_video(self, input_path, output_path, duration):
        """
        Trim video to specified duration from the beginning using ffmpeg

        Args:
            input_path: Path to input video file
            output_path: Path to output trimmed video file
            duration: Duration in seconds from the beginning
        """

        try:
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
            return True

        except subprocess.CalledProcessError as e:
            print(f"FFmpeg error: {e.stderr}")
            # Fallback: try with re-encoding if copy fails
            try:
                cmd = [
                    'ffmpeg',
                    '-i', input_path,
                    '-t', str(duration),
                    '-c:v', 'libx264',
                    '-c:a', 'aac',
                    '-y',
                    output_path
                ]
                subprocess.run(cmd, capture_output=True, text=True, check=True)
                return True
            except subprocess.CalledProcessError as e2:
                print(f"FFmpeg re-encoding also failed: {e2.stderr}")
                return False
        except FileNotFoundError:
            print("FFmpeg not found. Please install ffmpeg to use duration trimming.")
            return False

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
                    # External video hosting - use the direct URL
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
            media_response = requests.get(media_url, headers=headers, timeout=60)
            media_response.raise_for_status()
            
            # Determine file extension from content type or URL
            content_type = media_response.headers.get('content-type', '')
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
                
            # Create temporary file
            with tempfile.NamedTemporaryFile(suffix=file_ext, delete=False) as temp_file:
                temp_file.write(media_response.content)
                temp_path = temp_file.name
                
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

    def _process_image(self, gemini_api_key, gemini_model, model_type, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, prefix_text, image, selected_media_path, media_info_text):
        """
        Process image using logic from GeminiImageDescribe
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

                processed_media_path = selected_media_path if selected_media_path else ""
                final_string = f"{prefix_text}{description}" if prefix_text else description

                return (description, media_info_text, gemini_status, processed_media_path, final_string)

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

            # Generate the image description
            response = client.models.generate_content(
                model=gemini_model,
                contents=contents,
                config=generate_content_config,
            )

            # Process response
            if response.text is not None:
                description = response.text.strip()

                # Store successful result in cache
                cache.set(
                    media_identifier=media_identifier,
                    gemini_model=gemini_model,
                    description=description,
                    model_type=model_type,
                    options=cache_options
                )
            else:
                error_msg = "Error: Gemini returned empty response"
                if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                    error_msg += f" (Prompt feedback: {response.prompt_feedback})"
                if hasattr(response, 'candidates') and response.candidates:
                    error_msg += f" (Candidates available: {len(response.candidates)})"
                # Raise exception to stop workflow execution
                raise RuntimeError(error_msg)

            # Format outputs for image processing
            gemini_status = f"""🤖 Gemini Analysis Status: ✅ Complete
• Model: {gemini_model}
• Model Type: {model_type}
• API Key: {'*' * (len(gemini_api_key) - 4) + gemini_api_key[-4:] if len(gemini_api_key) >= 4 else '****'}
• Input: Image"""

            processed_media_path = selected_media_path if selected_media_path else ""
            final_string = f"{prefix_text}{description}" if prefix_text else description

            return (description, media_info_text, gemini_status, processed_media_path, final_string)

        except Exception as e:
            # Re-raise the exception to stop workflow execution
            raise Exception(f"Image analysis failed: {str(e)}")

    def _process_video(self, gemini_api_key, gemini_model, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, replace_action_with_twerking, prefix_text, selected_media_path, frame_rate, max_duration, media_info_text):
        """
        Process video using logic from GeminiVideoDescribe
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

            # Combine all parts
            combined_prompts = "\n".join(prompts)

            system_prompt = f"""You are an expert assistant specialized in analyzing and verbalizing input videos for cinematic-quality video transformation using the Wan 2.2 + VACE workflow.

DECISIVENESS REQUIREMENT: Always provide definitive, certain descriptions. When you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or". Instead of "holding a black folder or book", write "holding a black folder". Instead of "wearing what appears to be denim", write "wearing dark blue denim jeans".

Before writing, silently review all provided frames as a single clip and infer motion across time; reason stepwise over the entire sequence (start → middle → end). Do not use meta phrases (e.g., "this video shows").
Generate descriptions that adhere to the following structured layers and constraints, formatting each as a SEPARATE PARAGRAPH in this exact order:

{combined_prompts}{clothing_prompt}

{critical_note}"""
            user_prompt = f"Please analyze this video and provide a detailed description following the {paragraph_count}-paragraph structure outlined in the system prompt."

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

            # Determine the video file to use for analysis
            final_video_path = selected_media_path
            actual_duration = original_duration
            trimmed = False
            trimmed_video_output_path = selected_media_path

            # Calculate duration based on max_duration
            if max_duration > 0:
                actual_duration = min(max_duration, original_duration)

            # Check if we need to trim the video (only duration limit)
            if max_duration > 0 and actual_duration < original_duration:
                # Create a temporary trimmed video file
                with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
                    trimmed_video_path = temp_file.name

                # Attempt to trim the video
                if self._trim_video(selected_media_path, trimmed_video_path, actual_duration):
                    final_video_path = trimmed_video_path
                    trimmed = True
                    trimmed_video_output_path = trimmed_video_path
                else:
                    print(f"Warning: Could not trim video. Using original video for {actual_duration:.2f}s")
                    actual_duration = original_duration
                    trimmed_video_output_path = selected_media_path

            # Read the final video file (original or trimmed)
            with open(final_video_path, 'rb') as video_file:
                video_data = video_file.read()

            file_size = len(video_data) / 1024 / 1024  # Size in MB

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

                processed_media_path = selected_media_path if selected_media_path else ""
                final_string = f"{prefix_text}{description}" if prefix_text else description

                return (description, updated_media_info, gemini_status, processed_media_path, final_string)

            # Initialize the Gemini client
            client = genai.Client(api_key=gemini_api_key)

            # Create the content structure for video analysis
            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(
                            mime_type="video/mp4",
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

            # Generate the video description
            response = client.models.generate_content(
                model=gemini_model,
                contents=contents,
                config=generate_content_config,
            )

            # Process response
            if response.text is not None:
                description = response.text.strip()

                # Store successful result in cache
                cache.set(
                    media_identifier=media_identifier,
                    gemini_model=gemini_model,
                    description=description,
                    model_type="",  # Videos don't use model_type
                    options=cache_options
                )
            else:
                error_msg = "Error: Gemini returned empty response"
                if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
                    error_msg += f" (Prompt feedback: {response.prompt_feedback})"
                if hasattr(response, 'candidates') and response.candidates:
                    error_msg += f" (Candidates available: {len(response.candidates)})"
                # Raise exception to stop workflow execution
                raise RuntimeError(error_msg)

            # Format outputs for video processing
            gemini_status = f"""🤖 Gemini Analysis Status: ✅ Complete
• Model: {gemini_model}
• API Key: {'*' * (len(gemini_api_key) - 4) + gemini_api_key[-4:] if len(gemini_api_key) >= 4 else '****'}
• Input: Video"""

            final_string = f"{prefix_text}{description}" if prefix_text else description

            return (description, updated_media_info, gemini_status, trimmed_video_output_path, final_string)

        except Exception as e:
            # Re-raise the exception to stop workflow execution
            raise Exception(f"Video analysis failed: {str(e)}")

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        Supports both image and video inputs with upload or random selection from path.
        """
        return {
            "required": {
                "media_source": (["Upload Media", "Randomize Media from Path", "Reddit post"], {
                    "default": "Upload Media",
                    "tooltip": "Choose whether to upload media, randomize from a directory path, or download from a Reddit post"
                }),
                "media_type": (["image", "video"], {
                    "default": "image",
                    "tooltip": "Select the type of media to analyze"
                }),
                "seed": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 0xFFFFFFFFFFFFFFFF,
                    "tooltip": "Seed for randomization when using 'Randomize Media from Path'. Use different seeds to force re-execution."
                }),
            },
            "optional": {
                "gemini_options": ("GEMINI_OPTIONS", {
                    "tooltip": "Configuration options from Gemini Util - Options node"
                }),
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
                "frame_rate": ("FLOAT", {
                    "default": 30,
                    "min": 1.0,
                    "max": 60.0,
                    "step": 0.1,
                    "tooltip": "Frame rate for the temporary video file (used when processing VIDEO input)"
                }),
                "max_duration": ("FLOAT", {
                    "default": 5.0,
                    "min": 0.0,
                    "max": 300.0,
                    "step": 0.1,
                    "tooltip": "Maximum duration in seconds (0 = use full video, only applies to videos)"
                }),
                "reddit_url": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "Reddit post URL (used when media_source is Reddit post)"
                }),
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("description", "media_info", "gemini_status", "processed_media_path", "final_string")
    FUNCTION = "describe_media"
    CATEGORY = "Swiss Army Knife 🔪"

    def describe_media(self, media_source, media_type, seed, gemini_options=None, media_path="", uploaded_image_file="", uploaded_video_file="", frame_rate=24.0, max_duration=0.0, reddit_url=""):
        """
        Process media (image or video) and analyze with Gemini

        Args:
            media_source: Source of media ("Upload Media", "Randomize Media from Path", or "Reddit post")
            media_type: Type of media ("image" or "video")
            seed: Seed for randomization when using 'Randomize Media from Path'. Use different seeds to force re-execution.
            gemini_options: Configuration options from Gemini Util - Options node (optional)
            media_path: Directory path to randomly select media from, including subdirectories (optional)
            uploaded_image_file: Path to uploaded image file (optional)
            uploaded_video_file: Path to uploaded video file (optional)
            frame_rate: Frame rate for temporary video (legacy parameter, not used)
            max_duration: Maximum duration in seconds (0 = use full video, only applies to videos)
            reddit_url: Reddit post URL (used when media_source is Reddit post)
        """
        # Initialize variables that might be needed in exception handler
        selected_media_path = None
        media_info_text = ""

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
            # Import required modules
            import os
            import random
            import glob

            # First, determine what media we're processing

            if media_source == "Randomize Media from Path":
                if not media_path or not media_path.strip():
                    raise ValueError("Media path is required when using 'Randomize Media from Path'")

                # Validate path exists
                if not os.path.exists(media_path):
                    current_dir = os.getcwd()
                    parent_dir = os.path.dirname(media_path) if media_path else "N/A"
                    parent_exists = os.path.exists(parent_dir) if parent_dir else False

                    debug_info = f"""
Path Debug Info:
• Requested path: {media_path}
• Current working dir: {current_dir}
• Parent directory: {parent_dir}
• Parent exists: {parent_exists}
• Is absolute path: {os.path.isabs(media_path) if media_path else False}"""

                    raise ValueError(f"Media path does not exist: {media_path}{debug_info}")

                # Define supported file extensions
                if media_type == "image":
                    extensions = ["*.jpg", "*.jpeg", "*.png", "*.bmp", "*.gif", "*.tiff", "*.webp"]
                else:  # video
                    extensions = ["*.mp4", "*.avi", "*.mov", "*.mkv", "*.wmv", "*.flv", "*.webm"]

                # Find all matching files (including subdirectories)
                all_files = []
                for ext in extensions:
                    # Search in root directory
                    all_files.extend(glob.glob(os.path.join(media_path, ext)))
                    all_files.extend(glob.glob(os.path.join(media_path, ext.upper())))
                    # Search in subdirectories recursively
                    all_files.extend(glob.glob(os.path.join(media_path, "**", ext), recursive=True))
                    all_files.extend(glob.glob(os.path.join(media_path, "**", ext.upper()), recursive=True))

                if not all_files:
                    try:
                        dir_contents = os.listdir(media_path)
                        total_files = len(dir_contents)
                        sample_files = dir_contents[:5]  # Show first 5 files

                        debug_info = f"""
Directory scan results:
• Path: {media_path}
• Total items in directory: {total_files}
• Sample files: {sample_files}
• Looking for {media_type} files with extensions: {extensions}
• Search includes subdirectories recursively"""

                        raise ValueError(f"No {media_type} files found in path: {media_path}{debug_info}")
                    except PermissionError:
                        raise ValueError(f"Permission denied accessing path: {media_path}")
                    except Exception as scan_error:
                        raise ValueError(f"Error scanning path {media_path}: {str(scan_error)}")

                # Randomly select a file using the seed for reproducible selection
                # When seed changes, a different file may be selected, forcing re-execution
                random.seed(seed)
                selected_media_path = random.choice(all_files)

                # Reset random state to avoid affecting other operations
                random.seed(None)

                if media_type == "image":
                    # For random image, we'll read it as PIL and convert to bytes
                    media_info_text = f"📷 Image Processing Info (Random Selection):\n• File: {os.path.basename(selected_media_path)}\n• Source: Random from {media_path} (including subdirectories)\n• Full path: {selected_media_path}"
                else:
                    # For random video, set up for video processing
                    media_info_text = f"📹 Video Processing Info (Random Selection):\n• File: {os.path.basename(selected_media_path)}\n• Source: Random from {media_path} (including subdirectories)\n• Full path: {selected_media_path}"
            elif media_source == "Reddit post":
                # Reddit post mode
                if not reddit_url or not reddit_url.strip():
                    raise ValueError("Reddit URL is required when media_source is 'Reddit post'")
                
                # Download media from Reddit post
                downloaded_path, detected_media_type, reddit_media_info = self._download_reddit_media(reddit_url)
                selected_media_path = downloaded_path
                
                # Override media_type if detected type is different (but warn user)
                if detected_media_type != media_type:
                    print(f"Warning: Media type mismatch. Expected '{media_type}' but detected '{detected_media_type}' from Reddit post. Using detected type.")
                    media_type = detected_media_type
                
                # Create media info text
                file_size_mb = reddit_media_info.get('file_size', 0) / 1024 / 1024
                emoji = "📷" if media_type == "image" else "📹"
                media_info_text = f"{emoji} {media_type.title()} Processing Info (Reddit Post):\n• Title: {reddit_media_info.get('title', 'Unknown')}\n• Source: {reddit_url}\n• File Size: {file_size_mb:.2f} MB\n• Content Type: {reddit_media_info.get('content_type', 'Unknown')}"
            else:
                # Upload Media mode
                if media_type == "image":
                    if not uploaded_image_file:
                        raise ValueError("Image file upload is required when media_source is 'Upload Media' and media_type is 'image'")
                    # Use uploaded image file
                    try:
                        import folder_paths
                        input_dir = folder_paths.get_input_directory()
                    except ImportError:
                        input_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "input")
                    selected_media_path = os.path.join(input_dir, uploaded_image_file)
                    media_info_text = f"📷 Image Processing Info (Uploaded File):\n• File: {uploaded_image_file}"
                else:  # video
                    if not uploaded_video_file:
                        raise ValueError("Video upload is required when media_source is 'Upload Media' and media_type is 'video'")
                    try:
                        import folder_paths
                        input_dir = folder_paths.get_input_directory()
                    except ImportError:
                        input_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "input")
                    selected_media_path = os.path.join(input_dir, uploaded_video_file)
                    media_info_text = f"📹 Video Processing Info (Uploaded File):\n• File: {uploaded_video_file}"

            # Now process the media based on type
            if media_type == "image":
                # Process as image - delegate to image logic
                return self._process_image(
                    gemini_api_key, gemini_model, model_type, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, prefix_text,
                    None, selected_media_path, media_info_text
                )
            else:
                # Process as video - delegate to video logic  
                return self._process_video(
                    gemini_api_key, gemini_model, describe_clothing, change_clothing_color, describe_hair_style, describe_bokeh, describe_subject, replace_action_with_twerking, prefix_text,
                    selected_media_path, frame_rate, max_duration, media_info_text
                )

        except Exception as e:
            # Re-raise the exception to stop workflow execution
            raise Exception(f"Media analysis failed: {str(e)}")


class FilenameGenerator:
    """
    A ComfyUI custom node that generates structured filenames based on workflow parameters.
    Creates filenames with optional date subdirectory and all parameter values included.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "scheduler": ("STRING", {
                    "forceInput": True,
                    "tooltip": "Scheduler input from WanVideo Scheduler Selector or other scheduler nodes"
                }),
                "shift": ("FLOAT", {
                    "default": 12.0,
                    "min": 0.0,
                    "max": 100.0,
                    "step": 0.01,
                    "tooltip": "Shift value"
                }),
                "total_steps": ("INT", {
                    "default": 40,
                    "min": 1,
                    "max": 10000,
                    "tooltip": "Total number of steps"
                }),
                "shift_step": ("INT", {
                    "default": 25,
                    "min": 1,
                    "max": 10000,
                    "tooltip": "Shift step value"
                }),
                "high_cfg": ("FLOAT", {
                    "default": 3.0,
                    "min": 0.0,
                    "max": 30.0,
                    "step": 0.01,
                    "tooltip": "High CFG value"
                }),
                "low_cfg": ("FLOAT", {
                    "default": 4.0,
                    "min": 0.0,
                    "max": 30.0,
                    "step": 0.01,
                    "tooltip": "Low CFG value"
                }),
                "base_filename": ("STRING", {
                    "default": "base",
                    "tooltip": "Base filename (without extension)"
                }),
                "subdirectory_prefix": ("STRING", {
                    "default": "",
                    "tooltip": "Optional subdirectory prefix (e.g., 'project_name'). Will be added before date subdirectory."
                }),
                "add_date_subdirectory": ("BOOLEAN", {
                    "default": True,
                    "tooltip": "Add date subdirectory (YYYY-MM-DD format)"
                }),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("filename",)
    FUNCTION = "generate_filename"
    CATEGORY = "Swiss Army Knife 🔪"

    def generate_filename(self, scheduler, shift, total_steps, shift_step, high_cfg, low_cfg, base_filename, subdirectory_prefix, add_date_subdirectory):
        """
        Generate a structured filename based on the provided parameters.        
        Args:
            scheduler: Scheduler string from scheduler node
            shift: Shift value
            total_steps: Total number of steps
            shift_step: Shift step value
            high_cfg: High CFG value
            low_cfg: Low CFG value
            base_filename: Base filename
            subdirectory_prefix: Optional subdirectory prefix
            add_date_subdirectory: Whether to add date subdirectory
        Returns:
            Generated filename string
        """
        try:
            # Format float values to replace decimal points with underscores
            shift_str = f"{shift:.2f}".replace(".", "_")
            high_cfg_str = f"{high_cfg:.2f}".replace(".", "_")
            low_cfg_str = f"{low_cfg:.2f}".replace(".", "_")

            # Clean scheduler string to ensure it's filename-safe
            scheduler_clean = str(scheduler).strip().replace(" ", "_").lower()

            # Clean base filename to ensure it's filename-safe
            base_clean = base_filename.strip().replace(" ", "_")

            # Generate the filename components
            filename_parts = [
                base_clean,
                "scheduler", scheduler_clean,
                "shift", shift_str,
                "total_steps", str(total_steps),
                "shift_step", str(shift_step),
                "highCFG", high_cfg_str,
                "lowCFG", low_cfg_str
            ]

            # Join all parts with underscores
            filename = "_".join(filename_parts)

            # Build directory structure with optional subdirectory prefix and date
            directory_parts = []

            # Add subdirectory prefix if provided
            if subdirectory_prefix and subdirectory_prefix.strip():
                prefix_clean = subdirectory_prefix.strip().replace(" ", "_")
                directory_parts.append(prefix_clean)

            # Add date subdirectory if requested
            if add_date_subdirectory:
                current_date = datetime.now().strftime("%Y-%m-%d")
                directory_parts.append(current_date)

            # Combine directory parts with filename
            if directory_parts:
                full_path = "/".join(directory_parts) + "/" + filename
            else:
                full_path = filename

            return (full_path,)

        except Exception as e:
            raise Exception(f"Filename generation failed: {str(e)}")


class LoRAInfoExtractor:
    """Enriched LoRA metadata extraction with persistent hashing and CivitAI lookup."""

    PATH_ATTRIBUTES = ("path", "file", "file_path", "filepath", "filename", "model_path", "lora_path")
    NAME_ATTRIBUTES = ("civitai_name", "display_name", "name", "model_name", "title", "filename")
    STACK_KEYS = ("stack", "loras", "children", "items", "chain")

    def __init__(self):
        self.civitai_service = CivitAIService()
        self.hash_cache = get_lora_hash_cache()

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "lora": ("WANVIDLORA", {
                    "tooltip": "LoRA stack from WanVideo Lora Select or compatible nodes"
                }),
            },
            "optional": {
                "civitai_api_key": ("STRING", {
                    "multiline": False,
                    "default": os.environ.get("CIVITAI_API_KEY") or os.environ.get("CIVIT_API_KEY", "YOUR_CIVITAI_API_KEY_HERE"),
                    "tooltip": "Override CivitAI API key (falls back to CIVITAI_API_KEY/CIVIT_API_KEY env vars)"
                }),
                "fallback_name": ("STRING", {
                    "default": "",
                    "tooltip": "Used when no LoRA metadata can be determined"
                }),
                "use_civitai_api": ("BOOLEAN", {
                    "default": True,
                    "tooltip": "Disable to skip remote lookups and rely on local metadata only"
                }),
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "WANVIDLORA")
    RETURN_NAMES = ("lora_json", "lora_info", "lora_passthrough")
    FUNCTION = "extract_lora_info"
    CATEGORY = "Swiss Army Knife 🔪"

    def extract_lora_info(self, lora: Any, civitai_api_key: str = "", fallback_name: str = "", use_civitai_api: bool = True):
        """Extract LoRA stack metadata and return JSON plus human readable summary."""

        debug_repr = repr(lora)
        print("[DEBUG] LoRAInfoExtractor.extract_lora_info called")
        print(f"  - use_civitai_api: {use_civitai_api}")
        print(f"  - civitai_api_key provided: {bool(civitai_api_key and civitai_api_key != 'YOUR_CIVITAI_API_KEY_HERE')}")
        print(f"  - fallback_name: '{fallback_name}'")
        print(f"  - lora type: {type(lora)}")
        print(f"  - lora repr: {debug_repr[:300]}{'...' if len(debug_repr) > 300 else ''}")

        try:
            civitai_service = None
            if use_civitai_api:
                effective_api_key = civitai_api_key if civitai_api_key and civitai_api_key != "YOUR_CIVITAI_API_KEY_HERE" else None
                civitai_service = CivitAIService(api_key=effective_api_key)

            entries = self._discover_lora_entries(lora)
            if not entries:
                synthetic = self._coerce_single_lora(lora)
                if synthetic:
                    print("[DEBUG] No stack entries found, using synthetic single LoRA entry")
                    entries = [synthetic]
            print(f"[DEBUG] Discovered {len(entries)} LoRA entries in stack")

            processed_entries = []
            info_lines: List[str] = []
            total_size = 0
            missing_files = 0
            civitai_matches = 0
            tags_accumulator = set()

            for index, entry in enumerate(entries):
                metadata = self._process_entry(
                    entry,
                    index,
                    civitai_service,
                    use_civitai_api,
                )

                processed_entries.append(metadata)

                if metadata["file"]["exists"] and metadata["file"]["size_bytes"]:
                    total_size += metadata["file"]["size_bytes"]
                else:
                    missing_files += 1

                if metadata["civitai"]:
                    civitai_matches += 1
                    tags_accumulator.update(metadata["civitai"].get("tags", []))

                info_lines.append(self._format_info_line(metadata))

            summary = self._build_summary(
                count=len(processed_entries),
                missing_files=missing_files,
                civitai_matches=civitai_matches,
                total_size=total_size,
                tags=sorted(tag for tag in tags_accumulator if tag)
            )

            if processed_entries:
                combined_display = " + ".join(entry["display_name"] for entry in processed_entries)
                summary_line = self._format_summary_line(summary)
                info_block = "\n".join([summary_line] + info_lines)
                payload = {
                    "loras": processed_entries,
                    "summary": summary,
                    "combined_display": combined_display,
                }
                return (json.dumps(payload, indent=2), info_block, lora)

            # No entries found, return fallback response
            fallback_label = fallback_name.strip() or "No LoRAs Detected"
            empty_payload = {
                "loras": [],
                "summary": summary,
                "combined_display": fallback_label,
                "error": "LoRA stack did not contain any LoRA dictionaries",
            }
            return (json.dumps(empty_payload, indent=2), f"Fallback: {fallback_label}", lora)

        except Exception as exc:  # pylint: disable=broad-except
            print(f"[DEBUG] Error in extract_lora_info: {exc}")
            fallback_label = fallback_name.strip() or "Error Extracting LoRA"
            error_payload = {
                "loras": [],
                "summary": {"count": 0},
                "combined_display": fallback_label,
                "error": str(exc),
            }
            return (json.dumps(error_payload, indent=2), f"Error: {exc}", lora)

    def _discover_lora_entries(self, data: Any) -> List[Dict[str, Any]]:
        """Recursively walk WanVideo LoRA stack and collect unique LoRA dicts."""

        results: List[Dict[str, Any]] = []
        visited_ids = set()

        def visit(node: Any):
            if isinstance(node, (list, tuple, set)):
                for item in node:
                    visit(item)
                return

            if not isinstance(node, dict):
                return

            node_id = id(node)
            if node_id in visited_ids:
                return
            visited_ids.add(node_id)

            if self._looks_like_lora(node):
                results.append(node)

            for key in self.STACK_KEYS:
                if key in node and isinstance(node[key], (list, tuple)):
                    for child in node[key]:
                        visit(child)

            for value in node.values():
                if isinstance(value, (list, tuple, dict)):
                    visit(value)

        visit(data)

        deduped: List[Dict[str, Any]] = []
        seen_keys = set()
        for entry in results:
            path = self._extract_first(entry, self.PATH_ATTRIBUTES)
            name = self._extract_first(entry, self.NAME_ATTRIBUTES)
            key = (path or "", name or "")
            if key not in seen_keys:
                deduped.append(entry)
                seen_keys.add(key)

        return deduped

    def _coerce_single_lora(self, lora_input: Any) -> Optional[Dict[str, Any]]:
        if isinstance(lora_input, dict):
            return lora_input
        if isinstance(lora_input, str):
            return {"path": lora_input, "name": os.path.basename(lora_input)}
        if hasattr(lora_input, "__dict__"):
            return dict(lora_input.__dict__)
        if isinstance(lora_input, (list, tuple)) and lora_input:
            # Attempt to treat first element as meaningful metadata
            first = lora_input[0]
            if isinstance(first, dict):
                return first
            if isinstance(first, str):
                return {"path": first, "name": os.path.basename(first)}
        return None

    def _looks_like_lora(self, candidate: Dict[str, Any]) -> bool:
        if any(candidate.get(attr) for attr in self.PATH_ATTRIBUTES):
            return True
        if any(candidate.get(attr) for attr in self.NAME_ATTRIBUTES):
            return True
        if "strength" in candidate or "stack" in candidate:
            return True
        return False

    def _process_entry(self, entry: Dict[str, Any], index: int, civitai_service: Optional[CivitAIService], use_civitai_api: bool) -> Dict[str, Any]:
        file_path = self._extract_first(entry, self.PATH_ATTRIBUTES)
        if isinstance(file_path, str):
            file_path = file_path.strip()

        normalized_path = os.path.abspath(file_path) if file_path else None
        file_exists = bool(normalized_path and os.path.exists(normalized_path))

        strength = entry.get("strength")
        if isinstance(strength, str):
            try:
                strength = float(strength)
            except ValueError:
                strength = None

        raw_name = self._extract_first(entry, self.NAME_ATTRIBUTES)
        name_from_filename = self._clean_name(os.path.basename(file_path)) if file_path else None
        display_name = self._select_display_name(raw_name, name_from_filename)

        file_size = os.path.getsize(normalized_path) if file_exists else 0
        file_mtime = os.path.getmtime(normalized_path) if file_exists else None
        file_hash = self.hash_cache.get_hash(normalized_path) if file_exists else None

        civitai_data = None
        if file_exists and use_civitai_api and civitai_service:
            civitai_data = civitai_service.get_model_info_by_hash(normalized_path)
            if civitai_data and civitai_data.get("civitai_name"):
                display_name = self._select_display_name(civitai_data.get("civitai_name"), display_name)

        file_info = {
            "exists": file_exists,
            "path": normalized_path or file_path,
            "size_bytes": file_size,
            "size_human": self._human_readable_size(file_size) if file_exists else "0 B",
            "modified_at": datetime.utcfromtimestamp(file_mtime).isoformat() + "Z" if file_mtime else None,
        }

        return {
            "index": index,
            "display_name": display_name,
            "hash": file_hash,
            "file": file_info,
            "strength": strength,
            "original": {
                "raw": entry,
                "name": raw_name,
                "path": file_path,
            },
            "civitai": civitai_data,
        }

    def _build_summary(self, *, count: int, missing_files: int, civitai_matches: int, total_size: int, tags: List[str]) -> Dict[str, Any]:
        return {
            "count": count,
            "missing_files": missing_files,
            "civitai_matches": civitai_matches,
            "local_only": max(count - civitai_matches, 0),
            "total_size_bytes": total_size,
            "total_size_human": self._human_readable_size(total_size),
            "tags": tags[:25],
        }

    def _format_summary_line(self, summary: Dict[str, Any]) -> str:
        parts = [
            f"Summary: {summary['count']} LoRAs",
            f"CivitAI matches: {summary['civitai_matches']}",
        ]
        if summary["missing_files"]:
            parts.append(f"Missing: {summary['missing_files']}")
        parts.append(f"Total size: {summary['total_size_human']}")
        return " • ".join(parts)

    def _format_info_line(self, metadata: Dict[str, Any]) -> str:
        segments: List[str] = []
        civitai = metadata.get("civitai") or {}

        if civitai:
            version = civitai.get("version_name")
            creator = civitai.get("creator", "Unknown")
            version_fragment = f" ({version})" if version and version != metadata["display_name"] else ""
            segments.append(f"CivitAI{version_fragment} by {creator}")
        else:
            segments.append("Local metadata")

        if metadata.get("hash"):
            segments.append(f"hash {metadata['hash'][:10]}…")

        file_info = metadata["file"]
        if not file_info["exists"]:
            segments.append("missing file")
        else:
            segments.append(f"{file_info['size_human']}")

        joined_segments = " | ".join(segments)
        return f"• {metadata['display_name']} — {joined_segments}" if joined_segments else f"• {metadata['display_name']}"

    def _extract_first(self, source: Dict[str, Any], keys: Tuple[str, ...]) -> Optional[str]:
        for key in keys:
            value = source.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
        return None

    def _select_display_name(self, *names: Optional[str]) -> str:
        for name in names:
            cleaned = self._clean_name(name)
            if cleaned != "Unknown LoRA":
                return cleaned
        return "Unknown LoRA"

    def _human_readable_size(self, size_bytes: int) -> str:
        if size_bytes <= 0:
            return "0 B"
        units = ["B", "KB", "MB", "GB", "TB"]
        size = float(size_bytes)
        for unit in units:
            if size < 1024 or unit == units[-1]:
                return f"{size:.2f} {unit}"
            size /= 1024
        return f"{size_bytes} B"

    def _clean_name(self, name: Optional[str]) -> str:
        if not name:
            return "Unknown LoRA"
        cleaned = str(name).replace('.safetensors', '').replace('.ckpt', '').replace('.pt', '')
        cleaned = cleaned.replace('_', ' ').strip()
        cleaned = ' '.join(word.capitalize() for word in cleaned.split())
        return cleaned or "Unknown LoRA"


class VideoMetadataNode:
    """
    A ComfyUI custom node for adding metadata to video files.
    Takes a filename input (typically from VHS_VideoCombine) and adds custom metadata
    using FFmpeg. Supports common metadata fields like title, description, artist, and keywords.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "filenames": ("VHS_FILENAMES", {
                    "forceInput": True,
                    "tooltip": "Video filenames from VHS_VideoCombine (VHS_FILENAMES type)"
                }),
            },
            "optional": {
                "comment": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Additional comments metadata"
                }),
                "lora_json": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "LoRA JSON data from LoRAInfoExtractor (contains structured LoRA metadata)"
                }),
                "overwrite_original": (["Yes", "No"], {
                    "default": "No",
                    "tooltip": "Whether to overwrite the original file or create a new one with '_metadata' suffix"
                }),
            }
        }

    RETURN_TYPES = ("VHS_FILENAMES",)
    RETURN_NAMES = ("Filenames",)
    FUNCTION = "add_metadata"
    CATEGORY = "Swiss Army Knife 🔪"

    def add_metadata(self, filenames, artist="", comment="", lora_json="", overwrite_original="No"):
        """
        Update metadata in a video file using FFmpeg, appending to existing metadata.
        
        Args:
            filenames: Input video filenames from VHS_VideoCombine (will process first file)
            artist: Artist/Creator name (appends to existing artist info)
            comment: Additional comments (appends to existing comments)
            lora_json: JSON string containing LoRA metadata from LoRAInfoExtractor
            overwrite_original: Whether to overwrite original file
            
        Returns:
            Output filenames (original or new file with updated metadata)
        """
        try:
            # Extract filename from filenames input (VHS_VideoCombine may output multiple files or special format)
            # Handle both single filename string and potential list/array formats
            if isinstance(filenames, list) and len(filenames) > 0:
                filename = filenames[0]  # Use first file if multiple
            elif isinstance(filenames, str):
                filename = filenames  # Direct string filename
            else:
                raise Exception(f"Invalid filenames input: {filenames}")
                
            # Validate input file exists
            if not os.path.exists(filename):
                raise Exception(f"Input video file not found: {filename}")

            # Read existing metadata first
            existing_metadata = self._get_existing_metadata(filename)

            # Determine output filename
            if overwrite_original == "Yes":
                output_filename = filename
                temp_filename = filename + ".tmp"
            else:
                # Create new filename with _metadata suffix
                name, ext = os.path.splitext(filename)
                output_filename = f"{name}_metadata{ext}"
                temp_filename = output_filename

            # Build FFmpeg command with metadata
            cmd = [
                'ffmpeg',
                '-i', filename,
                '-c', 'copy',  # Copy streams without re-encoding
                '-y'  # Overwrite output file if it exists
            ]

            # Add basic metadata options if provided (append to existing)
            if artist.strip():
                existing_artist = existing_metadata.get('artist', '')
                combined_artist = self._combine_metadata_field(existing_artist, artist.strip())
                cmd.extend(['-metadata', f'artist={combined_artist}'])

            if comment.strip():
                existing_comment = existing_metadata.get('comment', '')
                combined_comment = self._combine_metadata_field(existing_comment, comment.strip())
                cmd.extend(['-metadata', f'comment={combined_comment}'])

            # Process LoRA JSON metadata (append to existing)
            if lora_json.strip():
                try:
                    import json
                    lora_data = json.loads(lora_json)
                    
                    # Extract title from combined_display for video title (append to existing)
                    if 'combined_display' in lora_data and lora_data['combined_display']:
                        existing_title = existing_metadata.get('title', '')
                        combined_title = self._combine_metadata_field(existing_title, lora_data['combined_display'])
                        cmd.extend(['-metadata', f'title={combined_title}'])
                    
                    # Create description from LoRA info (append to existing)
                    if 'loras' in lora_data and lora_data['loras']:
                        descriptions = []
                        keywords = []
                        
                        for lora in lora_data['loras']:
                            if 'info' in lora and lora['info']:
                                descriptions.append(lora['info'])
                            if 'name' in lora and lora['name']:
                                keywords.append(lora['name'])
                        
                        if descriptions:
                            description_text = '\n'.join([f'• {desc}' for desc in descriptions])
                            lora_description = f'LoRA Information:\n{description_text}'
                            existing_description = existing_metadata.get('description', '')
                            combined_description = self._combine_metadata_field(existing_description, lora_description)
                            cmd.extend(['-metadata', f'description={combined_description}'])
                        
                        if keywords:
                            lora_keywords = ', '.join(keywords)
                            existing_keywords = existing_metadata.get('keywords', '')
                            # For keywords, use comma separation
                            if existing_keywords.strip():
                                combined_keywords = f'{existing_keywords.strip()}, LoRA: {lora_keywords}'
                            else:
                                combined_keywords = f'LoRA: {lora_keywords}'
                            cmd.extend(['-metadata', f'keywords={combined_keywords}'])
                    
                    # Add raw LoRA JSON as custom metadata for advanced use
                    cmd.extend(['-metadata', f'lora_json={lora_json.strip()}'])
                    
                except json.JSONDecodeError:
                    # If JSON parsing fails, treat as simple string
                    cmd.extend(['-metadata', f'lora={lora_json.strip()}'])
                except Exception as e:
                    print(f"Warning: Could not process LoRA JSON: {e}")
                    cmd.extend(['-metadata', f'lora={lora_json.strip()}'])

            # Add output filename
            cmd.append(temp_filename)

            # Execute FFmpeg command
            subprocess.run(cmd, capture_output=True, text=True, check=True)

            # If we're overwriting the original, move temp file to original location
            if overwrite_original == "Yes":
                os.replace(temp_filename, output_filename)

            print(f"Successfully updated metadata in video: {output_filename}")
            return (output_filename,)

        except subprocess.CalledProcessError as e:
            raise Exception(f"FFmpeg metadata operation failed: {e.stderr}")
        except Exception as e:
            raise Exception(f"Video metadata operation failed: {str(e)}")
    
    def _get_existing_metadata(self, filename):
        """
        Read existing metadata from video file using ffprobe.
        
        Args:
            filename: Path to video file
            
        Returns:
            Dictionary of existing metadata fields
        """
        try:
            cmd = [
                'ffprobe',
                '-v', 'quiet',
                '-print_format', 'json',
                '-show_format',
                filename
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            metadata_info = json.loads(result.stdout)
            
            # Extract metadata tags from format section
            if 'format' in metadata_info and 'tags' in metadata_info['format']:
                return metadata_info['format']['tags']
            else:
                return {}
                
        except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
            # If we can't read metadata, return empty dict (metadata will be created fresh)
            return {}
    
    def _combine_metadata_field(self, existing, new):
        """
        Combine existing metadata field with new content.
        
        Args:
            existing: Existing metadata content (string)
            new: New metadata content to append (string)
            
        Returns:
            Combined metadata string
        """
        existing = existing.strip() if existing else ''
        new = new.strip() if new else ''
        
        if not existing:
            return new
        elif not new:
            return existing
        else:
            # Separate with double newline for readability
            return f'{existing}\n\n{new}'


# A dictionary that contains all nodes you want to export with their names
# NOTE: names should be globally unique
NODE_CLASS_MAPPINGS = {
    "GeminiUtilMediaDescribe": GeminiMediaDescribe,
    "GeminiUtilOptions": GeminiUtilOptions,
    "FilenameGenerator": FilenameGenerator,
    "VideoMetadataNode": VideoMetadataNode,
    "LoRAInfoExtractor": LoRAInfoExtractor
}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {
    "GeminiUtilMediaDescribe": "Gemini Util - Media Describe",
    "GeminiUtilOptions": "Gemini Util - Options",
    "FilenameGenerator": "Filename Generator",
    "VideoMetadataNode": "Update Video Metadata",
    "LoRAInfoExtractor": "LoRA Info Extractor"
}
