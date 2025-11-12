"""
LLM Studio Describe Nodes

This module contains nodes for using LM Studio with vision-language models (like Qwen3-VL)
to analyze video and image content.
"""

import base64
from openai import OpenAI
import cv2
import tempfile
import os
from pathlib import Path
from typing import Tuple, List


class LLMStudioVideoDescribe:
    """
    A ComfyUI custom node for describing videos using LM Studio with vision-language models.
    Extracts frames from video and generates captions using models like Qwen3-VL.
    """

    def __init__(self):
        self.client = None
        self.base_url = None
        self.model_name = "qwen/qwen3-vl-30b"

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define input parameters for the node.
        """
        return {
            "required": {
                "base_url": ("STRING", {
                    "default": "http://192.168.50.41:1234",
                    "multiline": False,
                    "tooltip": "LM Studio server URL (e.g. http://192.168.50.41:1234)"
                }),
                "model_name": ("STRING", {
                    "default": "qwen/qwen3-vl-30b",
                    "multiline": False,
                    "tooltip": "Model name in LM Studio (e.g. qwen/qwen3-vl-30b)"
                }),
                "video_path": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "tooltip": "Path to video file to analyze"
                }),
                "sample_rate": ("FLOAT", {
                    "default": 2.0,
                    "min": 0.1,
                    "max": 30.0,
                    "step": 0.1,
                    "tooltip": "Frames per second to extract (e.g., 1.0 = 1 frame/sec, 2.0 = 2 frames/sec)"
                }),
                "max_duration": ("FLOAT", {
                    "default": 5.0,
                    "min": 1.0,
                    "max": 60.0,
                    "step": 0.5,
                    "tooltip": "Maximum duration in seconds to sample from"
                }),
                "caption_prompt": ("STRING", {
                    "default": "Describe the specific sexual act being performed in explicit detail. Focus ONLY on the physical actions, positions, and movements. Requirements: 1) Use only generic terms like \"woman\", \"man\", \"person\" - DO NOT describe physical appearance, body types, hair color, ethnicity, clothing, or accessories. 2) Specify exact positions and penetration details - mention if the man's penis is penetrating the woman's vagina, anus, or mouth, or if other sexual acts are occurring. 3) Describe the motion and rhythm - is it fast, slow, gentle, rough, rhythmic, etc. 4) Include key actions - such as kissing, touching, grabbing, positioning, eye contact, or reactions. 5) If visible, describe bodily fluids - if a white substance is shooting from a penis, the man is ejaculating semen; specify where it goes (on body parts, in mouth, on face, etc.). 6) Note any transitions between positions or acts during the sequence. 7) DO NOT mention watermarks, logos, backgrounds, settings, furniture, or anything not directly related to the sexual act itself. 8) IMPORTANT: Provide your response as a SINGLE CONTINUOUS PARAGRAPH with no line breaks or bullet points. Be explicit, factual, and clinical in your description.",
                    "multiline": True,
                    "tooltip": "Prompt for individual frame captions"
                }),
                "temperature": ("FLOAT", {
                    "default": 0.2,
                    "min": 0.0,
                    "max": 2.0,
                    "step": 0.1,
                    "tooltip": "Temperature for text generation"
                }),
                "verbose": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Show detailed frame-by-frame captions in console"
                }),
            },
        }

    RETURN_TYPES = ("STRING", "STRING", "INT")
    RETURN_NAMES = ("combined_caption", "frame_captions", "frames_processed")
    FUNCTION = "describe_video"
    CATEGORY = "Swiss Army Knife 🔪/Media Caption"
    DESCRIPTION = (
        "Samples frames from a source video, sends them to an LM Studio VL model, and returns combined/frame-level captions plus "
        "the number of frames processed."
    )

    def extract_frames_from_video(
        self, 
        video_path: str, 
        sample_rate: float = 1.0, 
        max_duration: float = 5.0
    ) -> Tuple[List[Path], float]:
        """
        Extract frames from video at specified sampling rate.

        Args:
            video_path: Path to video file
            sample_rate: Frames per second to extract (e.g., 1.0 = 1 fps, 2.0 = 2 fps)
            max_duration: Maximum duration in seconds to sample from

        Returns:
            Tuple of (list of frame paths, video duration)
        """
        cap = cv2.VideoCapture(str(video_path))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        video_fps = cap.get(cv2.CAP_PROP_FPS)
        duration = total_frames / video_fps if video_fps > 0 else 0

        extracted_frames = []
        temp_dir = Path(tempfile.mkdtemp())

        # Calculate frames to extract based on sample rate (frames per second)
        sampling_duration = min(duration, max_duration)
        num_frames_to_extract = int(sampling_duration * sample_rate)
        if num_frames_to_extract == 0:
            num_frames_to_extract = 1

        # Calculate interval between frames in terms of video frames
        # sample_rate = frames per second we want
        # video_fps = actual frames per second in video
        # interval = video_fps / sample_rate = how many video frames to skip
        frame_interval = video_fps / sample_rate if sample_rate > 0 else video_fps
        
        frame_indices = [int(i * frame_interval) for i in range(num_frames_to_extract)]
        # Make sure we don't exceed total frames
        frame_indices = [idx for idx in frame_indices if idx < total_frames]

        for idx, frame_num in enumerate(frame_indices):
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
            ret, frame = cap.read()

            if ret:
                frame_path = temp_dir / f"frame_{idx:03d}.jpg"
                cv2.imwrite(str(frame_path), frame)
                extracted_frames.append(frame_path)

        cap.release()
        return extracted_frames, duration

    def encode_image(self, image_path: Path) -> str:
        """Encode image to base64 string."""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def initialize_client(self, base_url: str, model_name: str) -> bool:
        """
        Initialize OpenAI client for LM Studio.

        Args:
            base_url: LM Studio server URL
            model_name: Model name to use

        Returns:
            True if successful, False otherwise
        """
        try:
            self.base_url = base_url
            self.model_name = model_name
            self.client = OpenAI(base_url=f"{base_url}/v1", api_key="lm-studio")
            print(f"✅ Connected to LM Studio at {base_url}")
            print(f"📦 Using model: {model_name}")
            return True
        except Exception as e:
            print(f"❌ Error connecting to LM Studio: {e}")
            print(f"Make sure LM Studio is running at {base_url}")
            return False

    def describe_video(
        self,
        base_url: str,
        model_name: str,
        video_path: str,
        sample_rate: float,
        max_duration: float,
        caption_prompt: str,
        temperature: float,
        verbose: bool
    ) -> Tuple[str, str, int]:
        """
        Main function to describe video using LM Studio model.

        Returns:
            Tuple of (combined_caption, frame_captions_json, frames_processed)
        """
        # Initialize LM Studio client
        if not self.initialize_client(base_url, model_name):
            error_msg = f"Failed to connect to LM Studio at {base_url}"
            print(f"❌ {error_msg}")
            return (error_msg, "[]", 0)

        # Validate video path
        if not video_path or not os.path.exists(video_path):
            error_msg = f"Video file not found: {video_path}"
            print(f"❌ {error_msg}")
            return (error_msg, "[]", 0)

        print(f"🎬 Processing video: {video_path}")

        # Extract frames from video
        try:
            frame_paths, video_duration = self.extract_frames_from_video(
                video_path, 
                sample_rate=sample_rate,
                max_duration=max_duration
            )

            if not frame_paths:
                error_msg = "No frames extracted from video"
                print(f"❌ {error_msg}")
                return (error_msg, "[]", 0)

            sampling_duration = min(video_duration, max_duration)
            print(f"📹 Video duration: {video_duration:.2f}s, sampling {sampling_duration:.2f}s")
            print(f"📸 Extracted {len(frame_paths)} frames ({sample_rate} fps)")

        except Exception as e:
            error_msg = f"Error extracting frames: {e}"
            print(f"❌ {error_msg}")
            return (error_msg, "[]", 0)

        # Encode frames
        images = []
        for frame in frame_paths:
            try:
                encoded = self.encode_image(frame)
                images.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{encoded}"
                    }
                })
            except Exception as e:
                print(f"⚠️ Error encoding frame {frame}: {e}")
                continue

        if not images:
            error_msg = "No frames could be encoded"
            print(f"❌ {error_msg}")
            return (error_msg, "[]", 0)

        # Build content array with text prompt followed by all frames
        print(f"\n🤖 Analyzing {len(images)} frames in single request...")
        content_array = [{"type": "text", "text": caption_prompt}] + images

        if verbose:
            print(f"� Sending {len(images)} frames in single request")

        # Send all frames in a single API request
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful video analysis assistant."
                    },
                    {
                        "role": "user",
                        "content": content_array
                    }
                ],
                temperature=temperature
                # max_tokens removed - let model generate as much as needed
            )

            combined_caption = response.choices[0].message.content.strip()

            if verbose:
                print(f"✅ Video analysis complete: {combined_caption[:150]}...")

        except Exception as e:
            error_msg = f"Failed to analyze video: {e}"
            print(f"❌ {error_msg}")
            return (error_msg, "[]", len(images))

        print(f"\n✅ Video description: {combined_caption}\n")

        if verbose:
            print("="*80)
            print("📋 FULL VIDEO DESCRIPTION")
            print("="*80)
            print(combined_caption)
            print("="*80)

        # Clean up temporary files
        try:
            for frame_path in frame_paths:
                if frame_path.exists():
                    frame_path.unlink()
            if frame_paths and frame_paths[0].parent.exists():
                frame_paths[0].parent.rmdir()
        except Exception as e:
            print(f"⚠️ Error cleaning up temp files: {e}")

        # Return results
        # Note: frame_captions is now the combined description (single request approach)
        return (combined_caption, combined_caption, len(images))


class LLMStudioPictureDescribe:
    """
    A ComfyUI custom node for describing images using LM Studio with vision-language models.
    Analyzes single images using models like Qwen3-VL.
    """

    def __init__(self):
        self.client = None
        self.base_url = None
        self.model_name = "qwen/qwen3-vl-30b"

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define input parameters for the node.
        """
        return {
            "required": {
                "base_url": ("STRING", {
                    "default": "http://192.168.50.41:1234",
                    "multiline": False,
                    "tooltip": "LM Studio server URL (e.g. http://192.168.50.41:1234)"
                }),
                "model_name": ("STRING", {
                    "default": "qwen/qwen3-vl-30b",
                    "multiline": False,
                    "tooltip": "Model name in LM Studio (e.g. qwen/qwen3-vl-30b)"
                }),
                "image": ("IMAGE", {
                    "tooltip": "Input image to analyze"
                }),
                "caption_prompt": ("STRING", {
                    "default": "Please analyze the image and provide a detailed description of the the person's hair and facial features. Focus especially on texture, style, length, flow, facial structure, eyes, brows, nose, lips, skin tone, any visible markings (freckles, moles, etc.), and how light or shading affects their face. Use precise, descriptive language. Return description as one paragraph",
                    "multiline": True,
                    "tooltip": "Prompt for image caption"
                }),
                "temperature": ("FLOAT", {
                    "default": 0.2,
                    "min": 0.0,
                    "max": 2.0,
                    "step": 0.1,
                    "tooltip": "Temperature for text generation"
                }),
                "verbose": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Show detailed processing information in console"
                }),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("caption",)
    FUNCTION = "describe_image"
    CATEGORY = "Swiss Army Knife 🔪/Media Caption"
    DESCRIPTION = (
        "Captions a single IMAGE tensor by relaying it to an LM Studio vision-language model, returning the generated paragraph "
        "for downstream prompt or logging nodes."
    )

    def encode_image(self, image_path: Path) -> str:
        """Encode image to base64 string."""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def initialize_client(self, base_url: str, model_name: str) -> bool:
        """
        Initialize OpenAI client for LM Studio.

        Args:
            base_url: LM Studio server URL
            model_name: Model name to use

        Returns:
            True if successful, False otherwise
        """
        try:
            self.base_url = base_url
            self.model_name = model_name
            self.client = OpenAI(base_url=f"{base_url}/v1", api_key="lm-studio")
            print(f"✅ Connected to LM Studio at {base_url}")
            print(f"📦 Using model: {model_name}")
            return True
        except Exception as e:
            print(f"❌ Error connecting to LM Studio: {e}")
            print(f"Make sure LM Studio is running at {base_url}")
            return False

    def caption_image(
        self,
        image_data: dict,
        prompt: str,
        temperature: float
    ) -> str:
        """
        Caption a single image using LM Studio API.

        Args:
            image_data: Image data in base64 format
            prompt: Prompt for captioning
            temperature: Temperature for generation

        Returns:
            Generated caption text
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful image captioner."
                    },
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            image_data
                        ]
                    }
                ],
                temperature=temperature
                # max_tokens removed - let model generate as much as needed
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"❌ Error processing image: {e}")
            return f"[Error: {e}]"

    def describe_image(
        self,
        base_url: str,
        model_name: str,
        image,
        caption_prompt: str,
        temperature: float,
        verbose: bool
    ) -> Tuple[str]:
        """
        Main function to describe image using LM Studio model.

        Returns:
            Tuple containing the caption string
        """
        # Initialize LM Studio client
        if not self.initialize_client(base_url, model_name):
            error_msg = f"Failed to connect to LM Studio at {base_url}"
            print(f"❌ {error_msg}")
            return (error_msg,)

        print("🖼️ Processing image...")

        # Convert ComfyUI image tensor to base64
        try:
            import torch
            import numpy as np
            from PIL import Image
            import io

            # ComfyUI images are in format [B, H, W, C] with values 0-1
            # Convert to PIL Image
            if isinstance(image, torch.Tensor):
                # Take first image if batch
                img_array = image[0].cpu().numpy()
                # Convert from 0-1 to 0-255
                img_array = (img_array * 255).astype(np.uint8)
                pil_image = Image.fromarray(img_array)
            else:
                error_msg = "Invalid image format"
                print(f"❌ {error_msg}")
                return (error_msg,)

            # Encode to base64
            buffered = io.BytesIO()
            pil_image.save(buffered, format="JPEG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            image_data = {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{img_base64}"
                }
            }

            if verbose:
                print("✅ Image encoded successfully")

        except Exception as e:
            error_msg = f"Error encoding image: {e}"
            print(f"❌ {error_msg}")
            return (error_msg,)

        # Caption the image
        print("\n🤖 Generating caption...")

        caption = self.caption_image(image_data, caption_prompt, temperature)

        if "[Error" in caption:
            error_msg = "Failed to caption image"
            print(f"❌ {error_msg}")
            return (caption,)

        print(f"\n✅ Caption: {caption}\n")

        if verbose:
            print("="*80)
            print("📋 FULL CAPTION")
            print("="*80)
            print(caption)
            print("="*80)

        return (caption,)


# Node registration
NODE_CLASS_MAPPINGS = {
    "LLMStudioVideoDescribe": LLMStudioVideoDescribe,
    "LLMStudioPictureDescribe": LLMStudioPictureDescribe
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "LLMStudioVideoDescribe": "LLM Studio Video Describe",
    "LLMStudioPictureDescribe": "LLM Studio Picture Describe"
}
