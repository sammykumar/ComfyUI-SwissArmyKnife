from google import genai
from google.genai import types
import cv2
import tempfile
import os
import subprocess
import numpy as np
from PIL import Image
import io
from datetime import datetime
from .cache import get_cache, get_file_media_identifier, get_tensor_media_identifier


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

    def create_options(self, gemini_api_key, gemini_model, prompt_style, describe_clothing, describe_hair_style, describe_bokeh, describe_subject, prefix_text):
        """
        Create an options object with all the configuration settings
        """
        options = {
            "gemini_api_key": gemini_api_key,
            "gemini_model": gemini_model,
            "model_type": prompt_style,  # Keep internal key as model_type for backward compatibility
            "describe_clothing": describe_clothing == "Yes",
            "describe_hair_style": describe_hair_style == "Yes", 
            "describe_bokeh": describe_bokeh == "Yes",
            "describe_subject": describe_subject == "Yes",
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

    def _process_image(self, gemini_api_key, gemini_model, model_type, describe_clothing, describe_hair_style, describe_bokeh, describe_subject, prefix_text, image, selected_media_path, media_info_text):
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

                    system_prompt = f"""You are an expert assistant generating concise, single-sentence Qwen-Image-Edit instructions. Always be completely decisive and definitive - when you see something that could be described multiple ways, make a confident choice and state it as fact. Never use uncertain language like "appears to be", "seems to be", "might be", "possibly", "likely", or "or". Instead of "holding a black folder or book", write "holding a black folder".

Always begin with "Make this person…", include vivid, focused scene details (e.g. bedroom props, lights, furniture or gym bench, textured wall, window views) early to anchor the setting{"," if focus_instruction else ""} {focus_instruction}, {clothing_note}, include clear torso and head orientation (e.g., "back facing the camera with torso turned 45° and head looking over her shoulder toward viewer"), reference cinematic aesthetic cues (lighting, framing, lens, shot type), anchor realism by stating skin shows subtle pores, light wrinkles, and realistic surface detail, end with "keep everything else unchanged," and include negative safeguards like "no distortion, no blur artifacts{focus_safeguards}.\""""
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

    def _process_video(self, gemini_api_key, gemini_model, describe_clothing, describe_hair_style, describe_bokeh, describe_subject, prefix_text, selected_media_path, frame_rate, max_duration, media_info_text):
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
                "describe_hair_style": describe_hair_style,
                "describe_bokeh": describe_bokeh,
                "describe_subject": describe_subject
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
                "media_source": (["Upload Media", "Randomize Media from Path"], {
                    "default": "Upload Media",
                    "tooltip": "Choose whether to upload media or randomize from a directory path"
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
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("description", "media_info", "gemini_status", "processed_media_path", "final_string")
    FUNCTION = "describe_media"
    CATEGORY = "Swiss Army Knife 🔪"

    def describe_media(self, media_source, media_type, seed, gemini_options=None, media_path="", uploaded_image_file="", uploaded_video_file="", frame_rate=24.0, max_duration=0.0):
        """
        Process media (image or video) and analyze with Gemini

        Args:
            media_source: Source of media ("Upload Media" or "Randomize Media from Path")
            media_type: Type of media ("image" or "video")
            seed: Seed for randomization when using 'Randomize Media from Path'. Use different seeds to force re-execution.
            gemini_options: Configuration options from Gemini Util - Options node (optional)
            media_path: Directory path to randomly select media from, including subdirectories (optional)
            uploaded_image_file: Path to uploaded image file (optional)
            uploaded_video_file: Path to uploaded video file (optional)
            frame_rate: Frame rate for temporary video (legacy parameter, not used)
            max_duration: Maximum duration in seconds (0 = use full video, only applies to videos)
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
                "describe_hair_style": True,
                "describe_bokeh": True,
                "describe_subject": True,
                "prefix_text": ""
            }

        # Extract values from options
        gemini_api_key = gemini_options["gemini_api_key"]
        gemini_model = gemini_options["gemini_model"]
        model_type = gemini_options["model_type"]
        describe_clothing = gemini_options["describe_clothing"]
        describe_hair_style = gemini_options["describe_hair_style"]
        describe_bokeh = gemini_options["describe_bokeh"]
        describe_subject = gemini_options["describe_subject"]
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
                    gemini_api_key, gemini_model, model_type, describe_clothing, describe_hair_style, describe_bokeh, describe_subject, prefix_text,
                    None, selected_media_path, media_info_text
                )
            else:
                # Process as video - delegate to video logic  
                return self._process_video(
                    gemini_api_key, gemini_model, describe_clothing, describe_hair_style, describe_bokeh, describe_subject, prefix_text,
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


# A dictionary that contains all nodes you want to export with their names
# NOTE: names should be globally unique
NODE_CLASS_MAPPINGS = {
    "GeminiUtilMediaDescribe": GeminiMediaDescribe,
    "GeminiUtilOptions": GeminiUtilOptions,
    "FilenameGenerator": FilenameGenerator
}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {
    "GeminiUtilMediaDescribe": "Gemini Util - Media Describe",
    "GeminiUtilOptions": "Gemini Util - Options",
    "FilenameGenerator": "Filename Generator"
}
