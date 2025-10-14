"""
JoyCaption Media Describe Node

This node uses a local vLLM server running JoyCaption model to analyze video content.
"""

import base64
import requests
import cv2
import tempfile
import os
from pathlib import Path
from typing import Tuple, List


class JoyCaptionMediaDescribe:
    """
    A ComfyUI custom node for describing videos using local JoyCaption vLLM model.
    Extracts frames from video and generates captions using vision-language model.
    """

    def __init__(self):
        self.vllm_base_url = None
        self.vllm_url = None
        self.model_name = "fancyfeast/llama-joycaption-beta-one-hf-llava"

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define input parameters for the node.
        """
        return {
            "required": {
                "endpoint": ("STRING", {
                    "default": "http://localhost:8023",
                    "multiline": False,
                    "tooltip": "vLLM API endpoint URL (e.g. http://localhost:8023)"
                }),
                "video_path": ("STRING", {
                    "default": "",
                    "multiline": False,
                    "tooltip": "Path to video file to analyze"
                }),
                "fps_sample": ("FLOAT", {
                    "default": 1.0,
                    "min": 0.1,
                    "max": 10.0,
                    "step": 0.1,
                    "tooltip": "Extract 1 frame every N seconds"
                }),
                "max_duration": ("FLOAT", {
                    "default": 5.0,
                    "min": 1.0,
                    "max": 60.0,
                    "step": 0.5,
                    "tooltip": "Maximum duration in seconds to sample from"
                }),
                "caption_prompt": ("STRING", {
                    "default": "Describe only the specific sexual act being performed in 30 words or less. Focus exclusively on the physical actions and positions. Do not describe physical appearance, clothing, setting, or background.",
                    "multiline": True,
                    "tooltip": "Prompt for individual frame captions"
                }),
                "max_caption_words": ("INT", {
                    "default": 40,
                    "min": 10,
                    "max": 200,
                    "step": 5,
                    "tooltip": "Maximum words for final combined caption"
                }),
                "temperature": ("FLOAT", {
                    "default": 0.5,
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

    def extract_frames_from_video(
        self, 
        video_path: str, 
        fps_sample: float = 1.0, 
        max_duration: float = 5.0
    ) -> Tuple[List[Path], float]:
        """
        Extract frames from video at specified sampling rate.

        Args:
            video_path: Path to video file
            fps_sample: Extract 1 frame every N seconds
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

        # Calculate frames to extract based on sampling rate
        sampling_duration = min(duration, max_duration)
        num_frames_to_extract = int(sampling_duration / fps_sample)
        if num_frames_to_extract == 0:
            num_frames_to_extract = 1

        frame_indices = [int(i * fps_sample * video_fps) for i in range(num_frames_to_extract)]
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

    def check_sleep_status(self) -> bool:
        """Check if the vLLM model is sleeping."""
        try:
            response = requests.get(f"{self.vllm_base_url}/is_sleeping", timeout=5)
            if response.status_code == 200:
                return response.json().get("is_sleeping", False)
            return False
        except Exception as e:
            print(f"⚠️ Could not check sleep status: {e}")
            return False

    def wake_up_model(self) -> bool:
        """Wake up the vLLM model from sleep."""
        try:
            response = requests.post(f"{self.vllm_base_url}/wake_up", timeout=30)
            if response.status_code == 200:
                print("✅ Model woken up successfully")
                return True
            else:
                print(f"⚠️ Failed to wake up model: {response.status_code}")
                return False
        except Exception as e:
            print(f"⚠️ Error waking up model: {e}")
            return False

    def put_model_to_sleep(self, level: int = 1) -> bool:
        """
        Put the vLLM model to sleep.

        Args:
            level: Sleep level (1 or 2)
                   Level 1: Offload weights to CPU, discard KV cache
                   Level 2: Discard weights and KV cache completely
        """
        try:
            response = requests.post(f"{self.vllm_base_url}/sleep?level={level}", timeout=10)
            if response.status_code == 200:
                print("✅ Model put to sleep successfully")
                return True
            else:
                print(f"⚠️ Failed to put model to sleep: {response.status_code}")
                return False
        except Exception as e:
            print(f"⚠️ Error putting model to sleep: {e}")
            return False

    def caption_frame(
        self, 
        image_data: dict, 
        prompt: str, 
        temperature: float
    ) -> str:
        """
        Caption a single frame using vLLM API.

        Args:
            image_data: Image data in base64 format
            prompt: Prompt for captioning
            temperature: Temperature for generation

        Returns:
            Generated caption text
        """
        try:
            response = requests.post(
                self.vllm_url,
                json={
                    "model": self.model_name,
                    "messages": [
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
                    "max_tokens": 300,
                    "temperature": temperature
                },
                timeout=60
            )

            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            else:
                print(f"❌ Error captioning frame: {response.status_code}")
                print(response.text)
                return "[Error captioning frame]"

        except Exception as e:
            print(f"❌ Error processing frame: {e}")
            return f"[Error: {e}]"

    def combine_captions(
        self, 
        captions: List[str], 
        max_words: int, 
        temperature: float
    ) -> str:
        """
        Combine individual frame captions into a coherent video description.

        Args:
            captions: List of individual frame captions
            max_words: Maximum words for final caption
            temperature: Temperature for generation

        Returns:
            Combined caption text
        """
        num_frames = len(captions)
        frame_descriptions = "\n".join([f"Frame {i+1}: {captions[i]}" for i in range(num_frames)])

        summary_prompt = f"""Given these descriptions of {num_frames} frames from a video in chronological order:

{frame_descriptions}

Create a single, natural-flowing sentence that describes the complete video sequence. Remove redundancy and focus on progression of actions. Maximum {max_words} words."""

        try:
            response = requests.post(
                self.vllm_url,
                json={
                    "model": self.model_name,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a helpful assistant that creates concise, natural video descriptions."
                        },
                        {
                            "role": "user",
                            "content": summary_prompt
                        }
                    ],
                    "max_tokens": 100,
                    "temperature": temperature * 0.6  # Lower temperature for more consistent output
                },
                timeout=30
            )

            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"].strip()
            else:
                print(f"❌ LLM summarization failed (status {response.status_code})")
                print(response.text)
                return " ".join(captions)  # Fallback to simple concatenation

        except Exception as e:
            print(f"❌ LLM summarization error: {e}")
            return " ".join(captions)  # Fallback to simple concatenation

    def describe_video(
        self,
        endpoint: str,
        video_path: str,
        fps_sample: float,
        max_duration: float,
        caption_prompt: str,
        max_caption_words: int,
        temperature: float,
        verbose: bool
    ) -> Tuple[str, str, int]:
        """
        Main function to describe video using JoyCaption model.

        Returns:
            Tuple of (combined_caption, frame_captions_json, frames_processed)
        """
        # Set endpoint
        self.vllm_base_url = endpoint
        self.vllm_url = f"{self.vllm_base_url}/v1/chat/completions"

        # Validate video path
        if not video_path or not os.path.exists(video_path):
            error_msg = f"Video file not found: {video_path}"
            print(f"❌ {error_msg}")
            return (error_msg, "[]", 0)

        print(f"🎬 Processing video: {video_path}")

        # Check if model is sleeping and wake it up if needed
        if self.check_sleep_status():
            print("⏰ Model is sleeping, waking it up...")
            self.wake_up_model()

        # Extract frames from video
        try:
            frame_paths, video_duration = self.extract_frames_from_video(
                video_path, 
                fps_sample=fps_sample,
                max_duration=max_duration
            )

            if not frame_paths:
                error_msg = "No frames extracted from video"
                print(f"❌ {error_msg}")
                return (error_msg, "[]", 0)

            sampling_duration = min(video_duration, max_duration)
            print(f"📹 Video duration: {video_duration:.2f}s, sampling {sampling_duration:.2f}s")
            print(f"📸 Extracted {len(frame_paths)} frames (1 frame per {fps_sample}s)")

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

        # Caption individual frames
        print(f"\n🤖 Captioning {len(images)} frames...")
        captions = []

        for i, image in enumerate(images, 1):
            if verbose:
                print(f"📸 Processing frame {i}/{len(images)}...")

            caption = self.caption_frame(image, caption_prompt, temperature)
            captions.append(caption)

            if verbose:
                print(f"✅ Frame {i}: {caption[:100]}...")

        # Check for errors in captions
        if not captions or all("[Error" in c for c in captions):
            error_msg = "Failed to caption any frames"
            print(f"❌ {error_msg}")
            return (error_msg, str(captions), len(images))

        # Combine captions into final description
        print("\n🎭 Creating refined video caption...")
        combined_caption = self.combine_captions(captions, max_caption_words, temperature)

        print(f"\n✅ Combined caption: {combined_caption}\n")

        if verbose:
            print("="*80)
            print("📋 INDIVIDUAL FRAME CAPTIONS")
            print("="*80)
            for i, caption in enumerate(captions, 1):
                print(f"Frame {i}: {caption}")
            print("="*80)

        # Put model to sleep after processing
        print("\n💤 Putting model to sleep...")
        self.put_model_to_sleep(level=1)

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
        frame_captions_json = str(captions)
        return (combined_caption, frame_captions_json, len(images))


# Node registration
NODE_CLASS_MAPPINGS = {
    "JoyCaptionMediaDescribe": JoyCaptionMediaDescribe
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "JoyCaptionMediaDescribe": "JoyCaption Media Describe"
}
