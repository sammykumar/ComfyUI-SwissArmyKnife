"""
LLM Studio Structured Output Nodes

This module contains nodes for using LM Studio with JSON Schema structured output.
Provides guaranteed valid JSON responses without manual parsing or cleanup.
"""

import base64
import json
import requests
import cv2
import tempfile
import os
from pathlib import Path
from typing import Tuple, List, Dict, Any
from ..debug_utils import Logger

logger = Logger("LLMStudioStructured")


# JSON Schema Presets
VIDEO_DESCRIPTION_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "video_description",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "subject": {
                    "type": "string",
                    "description": "Detailed description of the main subject including posture, gestures, facial expressions, and body positioning"
                },
                "clothing": {
                    "type": "string",
                    "description": "Detailed clothing and accessories with specific colors, materials, textures, fit, construction details"
                },
                "movement": {
                    "type": "string",
                    "description": "Body-part-specific movement across frames with precise action verbs and transitions"
                },
                "scene": {
                    "type": "string",
                    "description": "Physical environment details including walls, floors, furniture, lighting, spatial layout"
                },
                "visual_style": {
                    "type": "string",
                    "description": "Combined lighting, camera techniques, color grading, mood, genre aesthetics"
                }
            },
            "required": ["subject", "clothing", "movement", "scene", "visual_style"],
            "additionalProperties": False
        }
    }
}

SIMPLE_DESCRIPTION_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "simple_description",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "caption": {
                    "type": "string",
                    "description": "Single paragraph description of the image/video"
                },
                "tags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of relevant tags/keywords"
                }
            },
            "required": ["caption", "tags"],
            "additionalProperties": False
        }
    }
}

CHARACTER_ANALYSIS_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "character_analysis",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "appearance": {
                    "type": "string",
                    "description": "Physical appearance details"
                },
                "expression": {
                    "type": "string",
                    "description": "Facial expression and emotion"
                },
                "pose": {
                    "type": "string",
                    "description": "Body position and posture"
                },
                "clothing": {
                    "type": "string",
                    "description": "Clothing and accessories"
                }
            },
            "required": ["appearance", "expression", "pose", "clothing"],
            "additionalProperties": False
        }
    }
}

SCHEMA_PRESETS = {
    "video_description": VIDEO_DESCRIPTION_SCHEMA,
    "simple_description": SIMPLE_DESCRIPTION_SCHEMA,
    "character_analysis": CHARACTER_ANALYSIS_SCHEMA
}


class LLMStudioStructuredDescribe:
    """
    A ComfyUI custom node for describing images using LM Studio with structured JSON output.
    Uses JSON Schema to guarantee valid, parseable responses.
    """

    def __init__(self):
        self.base_url = None

    @classmethod
    def INPUT_TYPES(cls):
        """Define input parameters for the node."""
        return {
            "required": {
                "base_url": ("STRING", {
                    "default": "http://192.168.50.41:1234",
                    "multiline": False,
                    "tooltip": "LM Studio server URL (e.g. http://192.168.50.41:1234)"
                }),
                "model_name": ("STRING", {
                    "default": "qwen3-vl-8b-thinking-mlx",
                    "multiline": False,
                    "tooltip": "Model name in LM Studio (e.g. qwen3-vl-8b-thinking-mlx)"
                }),
                "image": ("IMAGE", {
                    "tooltip": "Input image to analyze"
                }),
                "schema_preset": (["video_description", "simple_description", "character_analysis"], {
                    "default": "video_description",
                    "tooltip": "JSON schema preset to use for structured output"
                }),
                "prompt": ("STRING", {
                    "default": "Analyze this image and provide a detailed description following the schema.",
                    "multiline": True,
                    "tooltip": "Prompt for image analysis"
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

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("json_output", "field_1", "field_2", "field_3", "field_4", "field_5")
    FUNCTION = "describe_image"
    CATEGORY = "Swiss Army Knife 🔪/Media Caption"
    DESCRIPTION = (
        "Analyzes an image using LM Studio with JSON Schema structured output. "
        "Guarantees valid JSON responses without manual parsing. "
        "Returns both full JSON and individual fields."
    )

    def encode_image(self, image) -> str:
        """Encode ComfyUI image tensor to base64 string."""
        import torch
        import numpy as np
        from PIL import Image
        import io

        # ComfyUI images are in format [B, H, W, C] with values 0-1
        if isinstance(image, torch.Tensor):
            # Take first image if batch
            img_array = image[0].cpu().numpy()
            # Convert from 0-1 to 0-255
            img_array = (img_array * 255).astype(np.uint8)
            pil_image = Image.fromarray(img_array)
        else:
            raise ValueError("Invalid image format")

        # Encode to base64
        buffered = io.BytesIO()
        pil_image.save(buffered, format="JPEG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

        return img_base64

    def call_lmstudio_structured(
        self,
        base_url: str,
        model_name: str,
        prompt: str,
        image_base64: str,
        schema: Dict[str, Any],
        temperature: float
    ) -> Dict[str, Any]:
        """
        Call LM Studio with structured output using JSON Schema.
        
        Returns:
            Parsed JSON object matching the schema
        """
        payload = {
            "model": model_name,
            "prompt": prompt,
            "images": [f"data:image/jpeg;base64,{image_base64}"],
            "response_format": schema,
            "temperature": temperature
        }

        response = requests.post(
            f"{base_url}/v0/completions",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=120
        )
        
        response.raise_for_status()
        result = response.json()
        
        # Parse the structured output
        raw_text = result["choices"][0]["text"]
        parsed = json.loads(raw_text)
        
        return parsed

    def describe_image(
        self,
        base_url: str,
        model_name: str,
        image,
        schema_preset: str,
        prompt: str,
        temperature: float,
        verbose: bool
    ) -> Tuple[str, str, str, str, str, str]:
        """
        Main function to describe image using LM Studio with structured output.

        Returns:
            Tuple of (json_output, field_1, field_2, field_3, field_4, field_5)
        """
        self.base_url = base_url
        
        logger.log(f"📡 Connecting to LM Studio at {base_url}")
        logger.log(f"🤖 Using model: {model_name}")
        logger.log(f"📋 Schema preset: {schema_preset}")
        logger.log("🖼️ Processing image...")

        # Get schema
        schema = SCHEMA_PRESETS.get(schema_preset)
        if not schema:
            error_msg = f"Unknown schema preset: {schema_preset}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "")

        # Encode image
        try:
            image_base64 = self.encode_image(image)
            if verbose:
                logger.log(f"✅ Image encoded ({len(image_base64)} chars)")
        except Exception as e:
            error_msg = f"Error encoding image: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "")

        # Call LM Studio with structured output
        logger.log("\n🤖 Generating structured output...")
        
        try:
            result = self.call_lmstudio_structured(
                base_url=base_url,
                model_name=model_name,
                prompt=prompt,
                image_base64=image_base64,
                schema=schema,
                temperature=temperature
            )

            # Convert to JSON string
            json_output = json.dumps(result, indent=2)
            
            logger.log("✅ Structured output received")
            
            if verbose:
                logger.log("="*80)
                logger.log("📋 STRUCTURED OUTPUT")
                logger.log("="*80)
                logger.log(json_output)
                logger.log("="*80)

            # Extract fields based on schema preset
            if schema_preset == "video_description":
                field_1 = result.get("subject", "")
                field_2 = result.get("clothing", "")
                field_3 = result.get("movement", "")
                field_4 = result.get("scene", "")
                field_5 = result.get("visual_style", "")
            elif schema_preset == "simple_description":
                field_1 = result.get("caption", "")
                field_2 = ", ".join(result.get("tags", []))
                field_3 = ""
                field_4 = ""
                field_5 = ""
            elif schema_preset == "character_analysis":
                field_1 = result.get("appearance", "")
                field_2 = result.get("expression", "")
                field_3 = result.get("pose", "")
                field_4 = result.get("clothing", "")
                field_5 = ""
            else:
                field_1 = field_2 = field_3 = field_4 = field_5 = ""

            logger.log(f"\n✅ Analysis complete\n")

            return (json_output, field_1, field_2, field_3, field_4, field_5)

        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to connect to LM Studio: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "")
        except json.JSONDecodeError as e:
            error_msg = f"Failed to parse JSON response: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "")
        except Exception as e:
            error_msg = f"Error: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "")


class LLMStudioStructuredVideoDescribe:
    """
    A ComfyUI custom node for describing videos using LM Studio with structured JSON output.
    Extracts frames from video and generates structured descriptions.
    """

    def __init__(self):
        self.base_url = None

    @classmethod
    def INPUT_TYPES(cls):
        """Define input parameters for the node."""
        return {
            "required": {
                "base_url": ("STRING", {
                    "default": "http://192.168.50.41:1234",
                    "multiline": False,
                    "tooltip": "LM Studio server URL (e.g. http://192.168.50.41:1234)"
                }),
                "model_name": ("STRING", {
                    "default": "qwen3-vl-8b-thinking-mlx",
                    "multiline": False,
                    "tooltip": "Model name in LM Studio (e.g. qwen3-vl-8b-thinking-mlx)"
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
                    "tooltip": "Frames per second to extract"
                }),
                "max_duration": ("FLOAT", {
                    "default": 5.0,
                    "min": 1.0,
                    "max": 60.0,
                    "step": 0.5,
                    "tooltip": "Maximum duration in seconds to sample from"
                }),
                "schema_preset": (["video_description", "simple_description", "character_analysis"], {
                    "default": "video_description",
                    "tooltip": "JSON schema preset to use for structured output"
                }),
                "prompt": ("STRING", {
                    "default": "Analyze this video sequence and provide a detailed description following the schema.",
                    "multiline": True,
                    "tooltip": "Prompt for video analysis"
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
                    "tooltip": "Show detailed processing information"
                }),
            },
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "INT")
    RETURN_NAMES = ("json_output", "field_1", "field_2", "field_3", "field_4", "field_5", "frames_processed")
    FUNCTION = "describe_video"
    CATEGORY = "Swiss Army Knife 🔪/Media Caption"
    DESCRIPTION = (
        "Analyzes a video using LM Studio with JSON Schema structured output. "
        "Extracts frames and generates guaranteed valid JSON responses."
    )

    def extract_frames_from_video(
        self, 
        video_path: str, 
        sample_rate: float = 1.0, 
        max_duration: float = 5.0
    ) -> Tuple[List[Path], float]:
        """Extract frames from video at specified sampling rate."""
        cap = cv2.VideoCapture(str(video_path))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        video_fps = cap.get(cv2.CAP_PROP_FPS)
        duration = total_frames / video_fps if video_fps > 0 else 0

        extracted_frames = []
        temp_dir = Path(tempfile.mkdtemp())

        sampling_duration = min(duration, max_duration)
        num_frames_to_extract = int(sampling_duration * sample_rate)
        if num_frames_to_extract == 0:
            num_frames_to_extract = 1

        frame_interval = video_fps / sample_rate if sample_rate > 0 else video_fps
        frame_indices = [int(i * frame_interval) for i in range(num_frames_to_extract)]
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

    def call_lmstudio_structured(
        self,
        base_url: str,
        model_name: str,
        prompt: str,
        images_base64: List[str],
        schema: Dict[str, Any],
        temperature: float
    ) -> Dict[str, Any]:
        """Call LM Studio with structured output for multiple images."""
        image_urls = [f"data:image/jpeg;base64,{img}" for img in images_base64]
        
        payload = {
            "model": model_name,
            "prompt": prompt,
            "images": image_urls,
            "response_format": schema,
            "temperature": temperature
        }

        response = requests.post(
            f"{base_url}/v0/completions",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=180
        )
        
        response.raise_for_status()
        result = response.json()
        
        # Parse the structured output
        raw_text = result["choices"][0]["text"]
        parsed = json.loads(raw_text)
        
        return parsed

    def describe_video(
        self,
        base_url: str,
        model_name: str,
        video_path: str,
        sample_rate: float,
        max_duration: float,
        schema_preset: str,
        prompt: str,
        temperature: float,
        verbose: bool
    ) -> Tuple[str, str, str, str, str, str, int]:
        """
        Main function to describe video using LM Studio with structured output.

        Returns:
            Tuple of (json_output, field_1, field_2, field_3, field_4, field_5, frames_processed)
        """
        self.base_url = base_url
        
        logger.log(f"📡 Connecting to LM Studio at {base_url}")
        logger.log(f"🤖 Using model: {model_name}")
        logger.log(f"📋 Schema preset: {schema_preset}")

        # Validate video path
        if not video_path or not os.path.exists(video_path):
            error_msg = f"Video file not found: {video_path}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "", 0)

        logger.log(f"🎬 Processing video: {video_path}")

        # Get schema
        schema = SCHEMA_PRESETS.get(schema_preset)
        if not schema:
            error_msg = f"Unknown schema preset: {schema_preset}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "", 0)

        # Extract frames from video
        try:
            frame_paths, video_duration = self.extract_frames_from_video(
                video_path, 
                sample_rate=sample_rate,
                max_duration=max_duration
            )

            if not frame_paths:
                error_msg = "No frames extracted from video"
                logger.error(f"❌ {error_msg}")
                return (error_msg, "", "", "", "", "", 0)

            sampling_duration = min(video_duration, max_duration)
            logger.log(f"📹 Video duration: {video_duration:.2f}s, sampling {sampling_duration:.2f}s")
            logger.log(f"📸 Extracted {len(frame_paths)} frames ({sample_rate} fps)")

        except Exception as e:
            error_msg = f"Error extracting frames: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "", 0)

        # Encode frames
        try:
            images_base64 = [self.encode_image(frame) for frame in frame_paths]
            if verbose:
                logger.log(f"✅ Encoded {len(images_base64)} frames")
        except Exception as e:
            error_msg = f"Error encoding frames: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "", len(frame_paths))

        # Call LM Studio with structured output
        logger.log(f"\n🤖 Analyzing {len(images_base64)} frames with structured output...")
        
        try:
            result = self.call_lmstudio_structured(
                base_url=base_url,
                model_name=model_name,
                prompt=prompt,
                images_base64=images_base64,
                schema=schema,
                temperature=temperature
            )

            # Convert to JSON string
            json_output = json.dumps(result, indent=2)
            
            logger.log("✅ Structured output received")
            
            if verbose:
                logger.log("="*80)
                logger.log("📋 STRUCTURED VIDEO DESCRIPTION")
                logger.log("="*80)
                logger.log(json_output)
                logger.log("="*80)

            # Extract fields based on schema preset
            if schema_preset == "video_description":
                field_1 = result.get("subject", "")
                field_2 = result.get("clothing", "")
                field_3 = result.get("movement", "")
                field_4 = result.get("scene", "")
                field_5 = result.get("visual_style", "")
            elif schema_preset == "simple_description":
                field_1 = result.get("caption", "")
                field_2 = ", ".join(result.get("tags", []))
                field_3 = ""
                field_4 = ""
                field_5 = ""
            elif schema_preset == "character_analysis":
                field_1 = result.get("appearance", "")
                field_2 = result.get("expression", "")
                field_3 = result.get("pose", "")
                field_4 = result.get("clothing", "")
                field_5 = ""
            else:
                field_1 = field_2 = field_3 = field_4 = field_5 = ""

            # Clean up temporary files
            try:
                for frame_path in frame_paths:
                    if frame_path.exists():
                        frame_path.unlink()
                if frame_paths and frame_paths[0].parent.exists():
                    frame_paths[0].parent.rmdir()
            except Exception as e:
                logger.warning(f"⚠️ Error cleaning up temp files: {e}")

            logger.log(f"\n✅ Video analysis complete\n")

            return (json_output, field_1, field_2, field_3, field_4, field_5, len(images_base64))

        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to connect to LM Studio: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "", len(frame_paths))
        except json.JSONDecodeError as e:
            error_msg = f"Failed to parse JSON response: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "", len(frame_paths))
        except Exception as e:
            error_msg = f"Error: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "", len(frame_paths))


# Node registration
NODE_CLASS_MAPPINGS = {
    "LLMStudioStructuredDescribe": LLMStudioStructuredDescribe,
    "LLMStudioStructuredVideoDescribe": LLMStudioStructuredVideoDescribe
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "LLMStudioStructuredDescribe": "LLM Studio Structured Describe (Image)",
    "LLMStudioStructuredVideoDescribe": "LLM Studio Structured Describe (Video)"
}
