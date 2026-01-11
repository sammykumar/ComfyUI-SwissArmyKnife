"""
LM Studio Structured Output Nodes

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
from ..config_api import get_setting_value
from ..execution_hooks import get_current_prompt_id
from ..utils.cosmos_utils import update_job_metadata, upload_subject_image
from .prompts import IMAGE_SYSTEM_PROMPT, IMAGE_USER_PROMPT, VIDEO_SYSTEM_PROMPT, VIDEO_USER_PROMPT

logger = Logger("LLMStudioStructured")

DEFAULT_LMSTUDIO_BASE_URL = "http://127.0.0.1:1234"


def resolve_lmstudio_base_url() -> str:
    """Resolve LM Studio base URL from settings, env, or fallback."""
    base_url = ""
    try:
        base_url = get_setting_value("swiss_army_knife.lmstudio.base_url") or ""
    except Exception as exc:
        logger.warning(f"⚠️ Failed to read LM Studio base URL from settings: {exc}")

    env_override = os.environ.get("LMSTUDIO_BASE_URL", "")
    chosen = (base_url or env_override or DEFAULT_LMSTUDIO_BASE_URL).strip()

    if not (base_url or env_override):
        logger.warning(
            f"⚠️ LM Studio base URL not set in settings/env; defaulting to {DEFAULT_LMSTUDIO_BASE_URL}"
        )

    return chosen


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
                    "description": "Detailed description of the main subject"
                },
                "clothing": {
                    "type": "string",
                    "description": "Clothing and style details"
                },
                "action": {
                    "type": "string",
                    "description": "Pose, gesture, or implied motion"
                },
                "scene": {
                    "type": "string",
                    "description": "Setting, environment, and background elements"
                },
                "visual_style": {
                    "type": "string",
                    "description": "Combined lighting, camera details, rendering cues, mood/genre descriptors, and overall aesthetic direction"
                },
                "nsfw": {
                    "type": "string",
                    "description": "Textual description of any NSFW (Not Safe For Work) elements such as nudity, sexual content, or explicit material. If no NSFW content is present, provide an empty string or 'sfw'."
                }
            },
            "required": ["subject", "clothing", "action", "scene", "visual_style", "nsfw"],
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
                },
                "nsfw": {
                    "type": "string",
                    "description": "Textual description of any NSFW (Not Safe For Work) elements such as nudity, sexual content, or explicit material. If no NSFW content is present, provide an empty string or 'sfw'."
                }
            },
            "required": ["caption", "tags", "nsfw"],
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
                },
                "nsfw": {
                    "type": "string",
                    "description": "Textual description of any NSFW (Not Safe For Work) elements such as nudity, sexual content, or explicit material. If no NSFW content is present, provide an empty string or 'sfw'."
                }
            },
            "required": ["appearance", "expression", "pose", "clothing", "nsfw"],
            "additionalProperties": False
        }
    }
}

SUBJECT_APPEARANCE_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "subject_appearance",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "appearance": {
                    "type": "string",
                    "description": "Detailed description of the subject's physical appearance, including face, body, skin, and notable traits"
                }
            },
            "required": ["appearance"],
            "additionalProperties": False
        }
    }
}

VIDEO_FRAME_ARCHITECT_SCHEMA = {
    "type": "json_schema",
    "json_schema": {
        "name": "video_frame_architect",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "subject": {
                    "type": "string",
                    "description": "Detailed description of the main subject"
                },
                "clothing": {
                    "type": "string",
                    "description": "Clothing and style details observed throughout the clip"
                },
                "action": {
                    "type": "string",
                    "description": "Pose, gestures, and kinetic sequencing across frames"
                },
                "scene": {
                    "type": "string",
                    "description": "Environment, set dressing, and lighting context"
                },
                "visual_style": {
                    "type": "string",
                    "description": "Cinematic and technical aesthetic treatment"
                },
                "nsfw": {
                    "type": "object",
                    "description": "Frame-by-frame NSFW analysis metadata",
                    "properties": {
                        "summary": {
                            "type": "string",
                            "description": "High-level summary of the NSFW content"
                        },
                        "frames": {
                            "type": "array",
                            "minItems": 1,
                            "maxItems": 20,
                            "items": {
                                "type": "object",
                                "properties": {
                                    "frame_index": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "description": "Zero-based index of the frame in the sample set"
                                    },
                                    "timestamp_seconds": {
                                        "type": "number",
                                        "minimum": 0,
                                        "description": "Timestamp of the frame relative to the start of the source video (seconds)"
                                    },
                                    "description": {
                                        "type": "string",
                                        "description": "Detailed clinical description of what happens in this frame"
                                    }
                                },
                                "required": ["frame_index", "timestamp_seconds", "description"],
                                "additionalProperties": False
                            },
                            "description": "Per-frame NSFW notes (max 20 frames)"
                        }
                    },
                    "required": ["summary", "frames"],
                    "additionalProperties": False
                }
            },
            "required": ["subject", "clothing", "action", "scene", "visual_style", "nsfw"],
            "additionalProperties": False
        }
    }
}

SCHEMA_PRESETS = {
    "video_description": VIDEO_DESCRIPTION_SCHEMA,
    "simple_description": SIMPLE_DESCRIPTION_SCHEMA,
    "character_analysis": CHARACTER_ANALYSIS_SCHEMA,
    "subject_appearance": SUBJECT_APPEARANCE_SCHEMA,
    "video_frame_architect": VIDEO_FRAME_ARCHITECT_SCHEMA
}

SUBJECT_APPEARANCE_SYSTEM_PROMPT = (
    "You are an elite portrait analyst. Your only job is to study the provided reference image and "
    "describe the subject's physical appearance with high fidelity, including face, skin, body, "
    "posture, notable traits, and grooming details. You do not describe the actions, scene, or clothing."
)

SUBJECT_APPEARANCE_USER_PROMPT = (
    "Analyze this subject reference image and return a single JSON object containing only the "
    "'appearance' field with a dense paragraph about the subject's physical characteristics."
)

VIDEO_FRAME_ARCHITECT_SYSTEM_PROMPT = (
    "Role: You are the supreme Visionary Video Frame Architect. Your job is to take supplied video-frame "
    "input and output a sequential, frame-by-frame descriptive breakdown, optimized for the Wan 2.2 "
    "workflow. You coordinate six subordinate expert agents (analyst, lighting-specialist, "
    "motion-director, composition-artist, effects-engineer, post-processing master), who work behind the "
    "scenes.\n\n"
    "Output Protocol:\n"
    "Do not summarize the scene. You must output a structured list strictly following this format:\n"
    "Frame [N]: [The synthesized, definitive description for this specific moment]\n\n"
    "Core Protocol:\n"
    "Scan Sequence: Analyze the inputs as a progression of time.\n"
    "Isolate Frame: Freeze the specific moment.\n"
    "Synthesize Experts: Combine all six perspectives into one dense, factual block of text for that frame.\n"
    "Verbalize: Output strictly in the Frame X: format. No conversational filler.\n\n"
    "When you receive user input (which will be one or more video frames), your output must be a single, "
    "consolidated prompt that:\n\n"
    "The Six Specialist Experts (always consulted in this exact order):\n\n"
    "Subject Architect: hyper-real character & body expert (non-genital focus)\n"
    "Fashion Architect: clothing & fabric physics expert\n"
    "Action Architect: kinetic & mechanical movement expert\n"
    "Scene Architect: environmental & atmospheric expert\n"
    "Visual Style Architect: cinematic & technical aesthetic expert\n"
    "Erotic Narrative Architect: All adult, erotic, or NSFW themes, regardless of their prominence, "
    "intensity, or whether the act is explicit or implied.\n\n"
    "Output Structure (always exactly these six numbered sections, in order):\n\n"
    "Subject\n"
    "Photorealistic description of every visible human: exact age appearance, skin texture and tone, "
    "muscle definition and tension, facial structure, hair (head, body, armpits), hands, feet, posture, "
    "sweat beads, gooseflesh, scars, tattoos. Genitals and secondary sexual characteristics are mentioned "
    "only in passing (e.g., \"fully nude,\" \"erect,\" \"aroused\") until the Erotic Act section.\n\n"
    "Clothing\n"
    "Every garment and accessory described with named materials, exact colors, fit, stretch, transparency, "
    "displacement, tearing, fluid saturation, etc.\n\n"
    "Action\n"
    "Full chronological sequence of all movement (walking, stripping, pinning, spanking, choking, "
    "hair-pulling, etc.) with mechanical precision. Leads seamlessly into or out of intercourse.\n\n"
    "Scene\n"
    "Complete environment: architecture, surfaces, light sources, reflections, particulate matter, "
    "temperature cues, spatial scale.\n\n"
    "Visual Style\n"
    "Exact cinematic treatment: lens, lighting, color grade, camera movement, grain, aspect ratio, shutter "
    "angle, etc.\n\n"
    "Erotic Act\n"
    "Apply a high-resolution, frame-by-frame analytical lens to all adult, erotic, or NSFW themes, "
    "regardless of their prominence or intensity. Deconstruct interactions into sequential micro-moments "
    "rather than broad summaries.\n"
    "Treat every erotic action, touch, or sensation as a progression of distinct visual and physical frames. "
    "For every instance of contact or arousal, capture the immediate transition from anticipation to "
    "contact to reaction:\n"
    "Micro-Physics of Touch: detailed analysis of skin deformation the millisecond contact is made; the "
    "specific vectors of pressure; visible stretching of labia, vulva, anus, or skin as it happens; the "
    "exact rebound of flesh (breasts, buttocks, thighs) following an impact or thrust; and the dynamic "
    "rippling of shockwaves through body fat and muscle.\n"
    "Vascular & Anatomical Progression: The precise moment-to-moment darkening of skin flush; the visible "
    "expansion of veins; the progressive swelling of labia or glans flaring; the tightening of the scrotum; "
    "and the distinct stages of nipple hardening or cervical/prostate engagement.\n"
    "Kinetic Sequencing: The trajectory, speed, and deceleration of every thrust, grind, or caress; the "
    "detailed rotation of hips and pelvic tilt captured in increments; and the specific cadence of skin-" 
    "slapping or friction sounds synchronized with motion.\n"
    "Fluid Dynamics: The formation, release, and trajectory of fluids frame-by-frame—from the initial bead "
    "of sweat or pre-cum to the stretching of saliva/mucus strands during withdrawal, the arc and velocity "
    "of squirt or ejaculate, and the gravitational flow of creampie seepage or overflow.\n"
    "Involuntary Reaction: The split-second onset of goosebumps; the progression of a muscle spasm or "
    "full-body tremor; the widening of pupils; and the sequential contortion of facial muscles (mouth "
    "opening, throat contracting, nostrils flaring) that visually construct every moan, scream, or gasp."
)

VIDEO_FRAME_ARCHITECT_USER_PROMPT = (
    "Describe this video"
)


class LLMStudioStructuredDescribe:
    """
    A ComfyUI custom node for describing images using LM Studio with structured JSON output.
    Uses JSON Schema to guarantee valid, parseable responses.
    """

    def __init__(self):
        self.base_url = resolve_lmstudio_base_url()

    @classmethod
    def get_available_models(cls, base_url: str | None = None) -> List[str]:
        """Fetch available models from LM Studio."""
        base = base_url or resolve_lmstudio_base_url()
        try:
            response = requests.get(f"{base}/v1/models", timeout=5)
            response.raise_for_status()
            models_data = response.json()
            model_ids = [model["id"] for model in models_data.get("data", [])]
            return model_ids if model_ids else ["qwen3-vl-8b-thinking-mlx"]
        except Exception as e:
            logger.warning(f"⚠️ Could not fetch models from {base}: {e}")
            return ["qwen3-vl-8b-thinking-mlx"]

    @classmethod
    def INPUT_TYPES(cls):
        """Define input parameters for the node."""
        return {
            "required": {
                "model_name": (cls.get_available_models(), {
                    "tooltip": "Model name in LM Studio"
                }),
                "image": ("IMAGE", {
                    "tooltip": "Input image to analyze"
                }),
                "schema_preset": (["simple_description", "character_analysis"], {
                    "default": "character_analysis",
                    "tooltip": "JSON schema preset to use for structured output"
                }),
                "system_prompt": ("STRING", {
                    "default": IMAGE_SYSTEM_PROMPT,
                    "multiline": True,
                    "tooltip": "System prompt that sets the AI's role and behavior"
                }),
                "user_prompt": ("STRING", {
                    "default": IMAGE_USER_PROMPT,
                    "multiline": True,
                    "tooltip": "User prompt with specific instructions for the analysis"
                }),
                "temperature": ("FLOAT", {
                    "default": 0.7,
                    "min": 0.0,
                    "max": 2.0,
                    "step": 0.1,
                    "tooltip": "Temperature for text generation"
                }),
                "top_p": ("FLOAT", {
                    "default": 0.8,
                    "min": 0.0,
                    "max": 1.0,
                    "step": 0.1,
                    "tooltip": "Nucleus sampling probability threshold"
                }),
                "max_tokens": ("INT", {
                    "default": 262144,
                    "min": 1,
                    "max": 262144,
                    "step": 1,
                    "tooltip": "Maximum number of tokens to generate"
                }),
                "verbose": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Show detailed processing information in console"
                }),
            },
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("json_output", "field_1", "field_2", "field_3", "field_4", "field_5", "nsfw")
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
        system_prompt: str,
        user_prompt: str,
        image_base64: str,
        schema: Dict[str, Any],
        temperature: float,
        top_p: float,
        max_tokens: int
    ) -> Dict[str, Any]:
        """
        Call LM Studio with structured output using JSON Schema.

        Returns:
            Parsed JSON object matching the schema
        """
        # Use OpenAI-compatible chat completions format with vision
        # System message first, then user message with text and image
        payload = {
            "model": model_name,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            "response_format": schema,
            "temperature": temperature,
            "top_p": top_p,
            "max_tokens": max_tokens
        }

        # Structured output requires /v1/chat/completions endpoint
        endpoint_url = f"{base_url}/v1/chat/completions"

        response = requests.post(
            endpoint_url,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=120
        )

        response.raise_for_status()
        result = response.json()

        # Parse the structured output from message content
        raw_text = result["choices"][0]["message"]["content"]
        parsed = json.loads(raw_text)

        return parsed

    def describe_image(
        self,
        model_name: str,
        image,
        schema_preset: str,
        system_prompt: str,
        user_prompt: str,
        temperature: float,
        top_p: float,
        max_tokens: int,
        verbose: bool
    ) -> Tuple[str, str, str, str, str, str]:
        """
        Main function to describe image using LM Studio with structured output.

        Returns:
            Tuple of (json_output, field_1, field_2, field_3, field_4, field_5, nsfw)
        """
        resolved_base_url = resolve_lmstudio_base_url()
        self.base_url = resolved_base_url

        logger.log(f"📡 Connecting to LM Studio at {resolved_base_url}")
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
        logger.log("📡 Using endpoint: /v1/chat/completions (required for structured output)")

        try:
            result = self.call_lmstudio_structured(
                base_url=resolved_base_url,
                model_name=model_name,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                image_base64=image_base64,
                schema=schema,
                temperature=temperature,
                top_p=top_p,
                max_tokens=max_tokens
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
            nsfw = result.get("nsfw", "")

            if schema_preset == "video_frame_architect":
                field_1 = result.get("clothing", "")
                field_2 = result.get("action", "")
                field_3 = result.get("scene", "")
                field_4 = result.get("visual_style", "")
                field_5 = ""
            elif schema_preset == "video_description":
                field_1 = result.get("subject", "")
                field_2 = result.get("clothing", "")
                field_3 = result.get("action", "")
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

            logger.log("\n✅ Analysis complete\n")

            # Push results to CosmosDB if this is part of a job
            current_job_id = get_current_prompt_id()
            if current_job_id:
                logger.log(f"📡 Pushing structured analysis to CosmosDB for job {current_job_id}...")
                
                # Upload subject image
                subject_url = upload_subject_image(current_job_id, image)
                
                # Construct legacy positive prompt
                positive_prompt = ""
                if schema_preset == "simple_description":
                    positive_prompt = result.get("caption", "")
                elif "appearance" in result:
                    positive_prompt = result.get("appearance", "")
                elif "subject" in result:
                    positive_prompt = result.get("subject", "")
                
                cosmos_meta = {
                    "prompts": {
                        "positive": positive_prompt or json_output,
                        "subjectJson": result
                    },
                    "subjectImageUrl": subject_url
                }
                update_job_metadata(current_job_id, cosmos_meta)

            # Return both ui field (for JavaScript display) and result tuple (for node outputs)
            return {
                "ui": {"json_output": [json_output]},
                "result": (json_output, field_1, field_2, field_3, field_4, field_5, nsfw)
            }

        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to connect to LM Studio: {e}"
            logger.error(f"❌ {error_msg}")
            return {
                "ui": {"json_output": [error_msg]},
                "result": (error_msg, "", "", "", "", "", "")
            }
        except json.JSONDecodeError as e:
            error_msg = f"Failed to parse JSON response: {e}"
            logger.error(f"❌ {error_msg}")
            return {
                "ui": {"json_output": [error_msg]},
                "result": (error_msg, "", "", "", "", "", "")
            }
        except Exception as e:
            error_msg = f"Error: {e}"
            logger.error(f"❌ {error_msg}")
            return {
                "ui": {"json_output": [error_msg]},
                "result": (error_msg, "", "", "", "", "", "")
            }


class LLMStudioStructuredVideoDescribe:
    """
    A ComfyUI custom node for describing videos using LM Studio with structured JSON output.
    Extracts frames from video and generates structured descriptions.
    """

    def __init__(self):
        self.base_url = resolve_lmstudio_base_url()

    @classmethod
    def get_available_models(cls, base_url: str | None = None) -> List[str]:
        """Fetch available models from LM Studio."""
        base = base_url or resolve_lmstudio_base_url()
        try:
            response = requests.get(f"{base}/v1/models", timeout=5)
            response.raise_for_status()
            models_data = response.json()
            model_ids = [model["id"] for model in models_data.get("data", [])]
            return model_ids if model_ids else ["qwen3-vl-8b-thinking-mlx"]
        except Exception as e:
            logger.warning(f"⚠️ Could not fetch models from {base}: {e}")
            return ["qwen3-vl-8b-thinking-mlx"]

    @classmethod
    def INPUT_TYPES(cls):
        """Define input parameters for the node."""
        return {
            "required": {
                "model_name": (cls.get_available_models(), {
                    "tooltip": "Model name in LM Studio"
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
                "schema_preset": (["video_frame_architect", "video_description", "simple_description", "character_analysis"], {
                    "default": "video_frame_architect",
                    "tooltip": "JSON schema preset to use for structured output"
                }),
                "system_prompt": ("STRING", {
                    "default": VIDEO_FRAME_ARCHITECT_SYSTEM_PROMPT,
                    "multiline": True,
                    "tooltip": "System prompt that sets the AI's role and behavior"
                }),
                "user_prompt": ("STRING", {
                    "default": VIDEO_FRAME_ARCHITECT_USER_PROMPT,
                    "multiline": True,
                    "tooltip": "User prompt with specific instructions for the analysis"
                }),
                "temperature": ("FLOAT", {
                    "default": 0.7,
                    "min": 0.0,
                    "max": 2.0,
                    "step": 0.1,
                    "tooltip": "Temperature for text generation"
                }),
                "top_p": ("FLOAT", {
                    "default": 0.8,
                    "min": 0.0,
                    "max": 1.0,
                    "step": 0.1,
                    "tooltip": "Nucleus sampling probability threshold"
                }),
                "max_tokens": ("INT", {
                    "default": 262144,
                    "min": 1,
                    "max": 262144,
                    "step": 1,
                    "tooltip": "Maximum number of tokens to generate"
                }),
                "verbose": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Show detailed processing information"
                }),
            },
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("json_output", "field_1", "field_2", "field_3", "field_4", "field_5", "nsfw")
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
    ) -> Tuple[List[Dict[str, Any]], float]:
        """Extract frames from video at specified sampling rate."""
        cap = cv2.VideoCapture(str(video_path))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        video_fps = cap.get(cv2.CAP_PROP_FPS)
        duration = total_frames / video_fps if video_fps > 0 else 0

        extracted_frames: List[Dict[str, Any]] = []
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
                timestamp = frame_num / video_fps if video_fps > 0 else idx / sample_rate
                extracted_frames.append({
                    "path": frame_path,
                    "index": idx,
                    "timestamp": timestamp,
                })

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
        system_prompt: str,
        user_prompt: str,
        images_base64: List[str],
        schema: Dict[str, Any],
        temperature: float,
        top_p: float,
        max_tokens: int,
        custom_content: List[Dict[str, Any]] | None = None
    ) -> Dict[str, Any]:
        """Call LM Studio with structured output for multiple images."""
        # Build content array with text prompt followed by all images unless overridden
        if custom_content is not None:
            content = custom_content
        else:
            content = [{"type": "text", "text": user_prompt}]
            for img_base64 in images_base64:
                content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{img_base64}"
                    }
                })

        # Use OpenAI-compatible chat completions format with vision
        # System message first, then user message with text and images
        payload = {
            "model": model_name,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": content
                }
            ],
            "response_format": schema,
            "temperature": temperature,
            "top_p": top_p,
            "max_tokens": max_tokens
        }

        # Structured output requires /v1/chat/completions endpoint
        response = requests.post(
            f"{base_url}/v1/chat/completions",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=180
        )

        response.raise_for_status()
        result = response.json()

        # Parse the structured output from message content
        raw_text = result["choices"][0]["message"]["content"]
        parsed = json.loads(raw_text)

        return parsed

    def describe_video(
        self,
        model_name: str,
        video_path: str,
        sample_rate: float,
        max_duration: float,
        schema_preset: str,
        system_prompt: str,
        user_prompt: str,
        temperature: float,
        top_p: float,
        max_tokens: int,
        verbose: bool
    ) -> Tuple[str, str, str, str, str, str, str]:
        """
        Main function to describe video using LM Studio with structured output.

        Returns:
            Tuple of (json_output, field_1, field_2, field_3, field_4, field_5, nsfw)
        """
        resolved_base_url = resolve_lmstudio_base_url()
        self.base_url = resolved_base_url

        logger.log(f"📡 Connecting to LM Studio at {resolved_base_url}")
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
            return (error_msg, "", "", "", "", "", "")

        # Extract frames from video
        try:
            frame_metas, video_duration = self.extract_frames_from_video(
                video_path, 
                sample_rate=sample_rate,
                max_duration=max_duration
            )

            if not frame_metas:
                error_msg = "No frames extracted from video"
                logger.error(f"❌ {error_msg}")
                return (error_msg, "", "", "", "", "", "")

            sampling_duration = min(video_duration, max_duration)
            logger.log(f"📹 Video duration: {video_duration:.2f}s, sampling {sampling_duration:.2f}s")
            logger.log(f"📸 Extracted {len(frame_metas)} frames ({sample_rate} fps)")

        except Exception as e:
            error_msg = f"Error extracting frames: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "", "")

        # Encode frames
        try:
            images_base64: List[Dict[str, Any]] = []
            for meta in frame_metas:
                encoded = self.encode_image(meta["path"])
                images_base64.append({
                    "base64": encoded,
                    "index": meta["index"],
                    "timestamp": meta["timestamp"],
                })
            if verbose:
                logger.log(f"✅ Encoded {len(images_base64)} frames")
        except Exception as e:
            error_msg = f"Error encoding frames: {e}"
            logger.error(f"❌ {error_msg}")
            return (error_msg, "", "", "", "", "", "")

        # Call LM Studio with structured output
        logger.log(f"\n🤖 Analyzing {len(images_base64)} frames with structured output...")

        try:
            custom_content = None
            if schema_preset == "video_frame_architect":
                custom_content = [{"type": "text", "text": user_prompt}]
                for payload in images_base64:
                    timestamp = payload.get("timestamp", 0.0)
                    index = payload.get("index", 0)
                    custom_content.append({
                        "type": "text",
                        "text": f"Frame {index} ({timestamp:.2f}s)"
                    })
                    custom_content.append({
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{payload['base64']}"
                        }
                    })

            base64_list = [item["base64"] for item in images_base64]

            result = self.call_lmstudio_structured(
                base_url=resolved_base_url,
                model_name=model_name,
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                images_base64=base64_list,
                schema=schema,
                temperature=temperature,
                top_p=top_p,
                max_tokens=max_tokens,
                custom_content=custom_content
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
            nsfw = result.get("nsfw", "")

            if schema_preset == "video_description":
                field_1 = result.get("subject", "")
                field_2 = result.get("clothing", "")
                field_3 = result.get("action", "")
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
                for meta in frame_metas:
                    if meta["path"].exists():
                        meta["path"].unlink()
                if frame_metas and frame_metas[0]["path"].parent.exists():
                    frame_metas[0]["path"].parent.rmdir()
            except Exception as e:
                logger.warning(f"⚠️ Error cleaning up temp files: {e}")

            logger.log("\n✅ Video analysis complete\n")

            # Push results to CosmosDB if this is part of a job
            current_job_id = get_current_prompt_id()
            if current_job_id:
                logger.log(f"📡 Pushing video structured analysis to CosmosDB for job {current_job_id}...")
                
                # Construct legacy positive prompt
                positive_prompt = ""
                if schema_preset == "video_description":
                    parts = []
                    for f in ["subject", "clothing", "action", "scene", "visual_style"]:
                        val = result.get(f)
                        if val:
                            parts.append(val)
                    positive_prompt = "\n\n".join(parts)
                elif schema_preset == "simple_description":
                    positive_prompt = result.get("caption", "")
                
                cosmos_meta = {
                    "prompts": {
                        "positive": positive_prompt or json_output,
                        "videoJson": result
                    }
                }
                update_job_metadata(current_job_id, cosmos_meta)

            # Return both ui field (for JavaScript display) and result tuple (for node outputs)
            return {
                "ui": {"json_output": [json_output]},
                "result": (json_output, field_1, field_2, field_3, field_4, field_5, nsfw)
            }

        except requests.exceptions.RequestException as e:
            error_msg = f"Failed to connect to LM Studio: {e}"
            logger.error(f"❌ {error_msg}")
            return {
                "ui": {"json_output": [error_msg]},
                "result": (error_msg, "", "", "", "", "", "")
            }
        except json.JSONDecodeError as e:
            error_msg = f"Failed to parse JSON response: {e}"
            logger.error(f"❌ {error_msg}")
            return {
                "ui": {"json_output": [error_msg]},
                "result": (error_msg, "", "", "", "", "", "")
            }
        except Exception as e:
            error_msg = f"Error: {e}"
            logger.error(f"❌ {error_msg}")
            return {
                "ui": {"json_output": [error_msg]},
                "result": (error_msg, "", "", "", "", "", "")
            }


class LMStudioCombinedStructuredDescribe:
    """Two-pass workflow: extract subject appearance first, then describe video frames."""

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("subject_json", "video_json", "combined_text", "formatted_response")
    FUNCTION = "describe_combined"
    CATEGORY = "Swiss Army Knife 🔪/Media Caption"

    def __init__(self):
        self.base_url = resolve_lmstudio_base_url()

    @classmethod
    def get_available_models(cls, base_url: str | None = None) -> List[str]:
        base = base_url or resolve_lmstudio_base_url()
        try:
            response = requests.get(f"{base}/v1/models", timeout=5)
            response.raise_for_status()
            data = response.json()
            return [m["id"] for m in data.get("data", [])] or ["qwen3-vl-8b-thinking-mlx"]
        except Exception as exc:
            logger.warning(f"⚠️ Could not fetch models from {base}: {exc}")
            return ["qwen3-vl-8b-thinking-mlx"]

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "model_name": (cls.get_available_models(), {
                    "tooltip": "Model name exposed by LM Studio"
                }),
                "subject_image_path": ("STRING", {
                    "default": "",
                    "tooltip": "Path to subject reference image"
                }),
                "video_path": ("STRING", {
                    "default": "",
                    "tooltip": "Path to the video clip for structured analysis"
                }),
                "sample_rate": ("FLOAT", {
                    "default": 2.0,
                    "min": 0.1,
                    "max": 30.0,
                    "step": 0.1,
                    "tooltip": "Frames per second to sample from the video"
                }),
                "max_duration": ("FLOAT", {
                    "default": 5.0,
                    "min": 1.0,
                    "max": 60.0,
                    "step": 0.5,
                    "tooltip": "Maximum duration (seconds) of the video to analyze"
                }),
                "subject_system_prompt": ("STRING", {
                    "default": SUBJECT_APPEARANCE_SYSTEM_PROMPT,
                    "multiline": True,
                    "tooltip": "System prompt for the subject appearance pass"
                }),
                "subject_user_prompt": ("STRING", {
                    "default": SUBJECT_APPEARANCE_USER_PROMPT,
                    "multiline": True,
                    "tooltip": "User prompt for the subject appearance pass"
                }),
                "video_system_prompt": ("STRING", {
                    "default": VIDEO_FRAME_ARCHITECT_SYSTEM_PROMPT,
                    "multiline": True,
                    "tooltip": "System prompt for the video description pass"
                }),
                "video_user_prompt": ("STRING", {
                    "default": VIDEO_FRAME_ARCHITECT_USER_PROMPT,
                    "multiline": True,
                    "tooltip": "User prompt for the video description pass"
                }),
                "temperature": ("FLOAT", {
                    "default": 0.7,
                    "min": 0.0,
                    "max": 2.0,
                    "step": 0.1,
                    "tooltip": "LM Studio temperature"
                }),
                "top_p": ("FLOAT", {
                    "default": 0.8,
                    "min": 0.0,
                    "max": 1.0,
                    "step": 0.1,
                    "tooltip": "LM Studio nucleus sampling cutoff"
                }),
                "max_tokens": ("INT", {
                    "default": 262144,
                    "min": 1,
                    "max": 262144,
                    "step": 1,
                    "tooltip": "Maximum tokens for each completion"
                }),
                "verbose": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Print debugging info"
                })
            }
        }

    def encode_file_to_base64(self, file_path: Path) -> str:
        with open(file_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")

    def extract_frames(
        self,
        video_path: Path,
        sample_rate: float,
        max_duration: float
    ) -> Tuple[List[Dict[str, Any]], float]:
        cap = cv2.VideoCapture(str(video_path))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        duration = total_frames / fps if fps > 0 else 0

        frames_meta: List[Dict[str, Any]] = []
        temp_dir = Path(tempfile.mkdtemp())
        sampling_window = min(duration, max_duration)
        frames_needed = max(1, int(sampling_window * sample_rate))
        if fps <= 0:
            fps = 30.0  # fallback to 30 FPS if video fps is invalid
        
        # Calculate time interval between frames (in seconds)
        time_interval = 1.0 / sample_rate if sample_rate > 0 else 1.0
        
        # Generate frame indices based on timestamps
        frame_indices = []
        for i in range(frames_needed):
            timestamp = i * time_interval
            frame_num = int(timestamp * fps)
            # Ensure we don't exceed video bounds
            if frame_num < total_frames:
                frame_indices.append(frame_num)

        # Track successful frame index separately from video frame number
        successful_idx = 0
        for frame_num in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
            ret, frame = cap.read()
            if not ret:
                continue
            frame_path = temp_dir / f"frame_{successful_idx:03d}.jpg"
            cv2.imwrite(str(frame_path), frame)
            timestamp = frame_num / fps if fps > 0 else successful_idx / sample_rate
            frames_meta.append({
                "path": frame_path,
                "index": successful_idx,
                "timestamp": timestamp
            })
            successful_idx += 1

        cap.release()
        return frames_meta, duration

    def cleanup_temp_frames(self, frames_meta: List[Dict[str, Any]]):
        if not frames_meta:
            return
        temp_dir = frames_meta[0]["path"].parent
        for meta in frames_meta:
            try:
                if meta["path"].exists():
                    meta["path"].unlink()
            except Exception as exc:
                logger.warning(f"⚠️ Failed to delete {meta['path']}: {exc}")
        try:
            temp_dir.rmdir()
        except Exception:
            pass

    def call_structured_completion(
        self,
        base_url: str,
        model_name: str,
        system_prompt: str,
        content: List[Dict[str, Any]],
        schema: Dict[str, Any],
        temperature: float,
        top_p: float,
        max_tokens: int,
        timeout: int = 180
    ) -> Dict[str, Any]:
        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content},
            ],
            "response_format": schema,
            "temperature": temperature,
            "top_p": top_p,
            "max_tokens": max_tokens,
        }

        response = requests.post(
            f"{base_url}/v1/chat/completions",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=timeout,
        )
        response.raise_for_status()
        raw = response.json()
        return json.loads(raw["choices"][0]["message"]["content"])

    def describe_combined(
        self,
        model_name: str,
        subject_image_path: str,
        video_path: str,
        sample_rate: float,
        max_duration: float,
        subject_system_prompt: str,
        subject_user_prompt: str,
        video_system_prompt: str,
        video_user_prompt: str,
        temperature: float,
        top_p: float,
        max_tokens: int,
        verbose: bool
    ) -> Tuple[str, str, str, str]:
        resolved_base_url = resolve_lmstudio_base_url()
        self.base_url = resolved_base_url

        if not subject_image_path or not os.path.exists(subject_image_path):
            error_msg = f"Subject image not found: {subject_image_path}"
            logger.error(error_msg)
            return (error_msg, "", "", "")
        if not video_path or not os.path.exists(video_path):
            error_msg = f"Video file not found: {video_path}"
            logger.error(error_msg)
            return ("", error_msg, "", "")

        try:
            subject_b64 = self.encode_file_to_base64(Path(subject_image_path))
        except Exception as exc:
            error_msg = f"Failed to encode subject image: {exc}"
            logger.error(error_msg)
            return (error_msg, "", "", "")

        subject_content = [
            {"type": "text", "text": subject_user_prompt},
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{subject_b64}"}
            },
        ]

        try:
            subject_result = self.call_structured_completion(
                resolved_base_url,
                model_name,
                subject_system_prompt,
                subject_content,
                SUBJECT_APPEARANCE_SCHEMA,
                temperature,
                top_p,
                max_tokens,
                timeout=120,
            )
        except Exception as exc:
            error_msg = f"Subject appearance request failed: {exc}"
            logger.error(error_msg)
            return (error_msg, "", "", "")

        subject_json = json.dumps(subject_result, indent=2)

        try:
            frames_meta, video_duration = self.extract_frames(
                Path(video_path), sample_rate, max_duration
            )
            if not frames_meta:
                error_msg = "No frames extracted from video"
                logger.error(error_msg)
                return (subject_json, error_msg, "", "")
        except Exception as exc:
            error_msg = f"Failed to extract frames: {exc}"
            logger.error(error_msg)
            return (subject_json, error_msg, "", "")

        if verbose:
            logger.log(
                f"🎬 Extracted {len(frames_meta)} frames over {min(video_duration, max_duration):.2f}s"
            )
            # Debug: show frame indices
            frame_indices = [meta['index'] for meta in frames_meta]
            logger.log(f"📊 Frame indices: {frame_indices}")

        try:
            frames_content = [{"type": "text", "text": video_user_prompt}]
            for meta in frames_meta:
                frame_path = meta["path"]
                if verbose:
                    file_exists = frame_path.exists()
                    file_size = frame_path.stat().st_size if file_exists else 0
                    logger.log(f"📁 Frame {meta['index']}: exists={file_exists}, size={file_size} bytes")
                
                frame_b64 = self.encode_file_to_base64(frame_path)
                if verbose and len(frame_b64) < 100:
                    logger.warning(f"⚠️ Frame {meta['index']} base64 encoding is suspiciously short: {len(frame_b64)} chars")
                
                frames_content.append({
                    "type": "text",
                    "text": f"Frame {meta['index']} at {meta['timestamp']:.2f}s",
                })
                frames_content.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{frame_b64}"},
                })

            video_result = self.call_structured_completion(
                resolved_base_url,
                model_name,
                video_system_prompt,
                frames_content,
                VIDEO_FRAME_ARCHITECT_SCHEMA,
                temperature,
                top_p,
                max_tokens,
                timeout=300,
            )
        except Exception as exc:
            self.cleanup_temp_frames(frames_meta)
            error_msg = f"Video analysis request failed: {exc}"
            logger.error(error_msg)
            return (subject_json, error_msg, "", "")

        self.cleanup_temp_frames(frames_meta)

        video_json = json.dumps(video_result, indent=2)

        # Use appearance from subject reference image, override video's subject field
        appearance_text = subject_result.get("appearance", "")
        clothing = video_result.get("clothing", "")
        action = video_result.get("action", "")
        scene = video_result.get("scene", "")
        visual_style = video_result.get("visual_style", "")
        nsfw = video_result.get("nsfw", {})
        nsfw_plain_parts: List[str] = []
        nsfw_formatted_parts: List[str] = []

        if isinstance(nsfw, dict):
            summary = nsfw.get("summary", "").strip()
            if summary:
                nsfw_plain_parts.append(summary)
                nsfw_formatted_parts.append(f"NSFW Summary:\n{summary}")

            frames_notes = nsfw.get("frames") or []
            for entry in frames_notes:
                desc = entry.get("description", "").strip()
                if not desc:
                    continue
                header_parts = []
                idx = entry.get("frame_index")
                ts = entry.get("timestamp_seconds")
                if isinstance(idx, int):
                    header_parts.append(f"Frame {idx}")
                if isinstance(ts, (int, float)):
                    header_parts.append(f"({ts:.2f}s)")
                header = " ".join(header_parts).strip()
                if header:
                    nsfw_formatted_parts.append(f"{header}\n{desc}")
                else:
                    nsfw_formatted_parts.append(desc)
                nsfw_plain_parts.append(desc)

        nsfw_body = "\n\n".join([part for part in nsfw_plain_parts if part])
        formatted_nsfw_section = "\n\n".join([part for part in nsfw_formatted_parts if part])

        text_sections = [appearance_text, clothing, action, scene, visual_style, nsfw_body]
        combined_text = "\n\n".join([section for section in text_sections if section.strip()])

        formatted_sections = []
        if appearance_text.strip():
            formatted_sections.append(f"Subject Appearance:\n{appearance_text}")
        if clothing.strip():
            formatted_sections.append(f"Clothing & Style:\n{clothing}")
        if action.strip():
            formatted_sections.append(f"Action & Motion:\n{action}")
        if scene.strip():
            formatted_sections.append(f"Scene:\n{scene}")
        if visual_style.strip():
            formatted_sections.append(f"Visual Style:\n{visual_style}")
        if formatted_nsfw_section.strip():
            formatted_sections.append(f"NSFW:\n{formatted_nsfw_section}")

        formatted_response = "\n\n".join(formatted_sections)

        if verbose:
            logger.log("✅ Combined structured description ready")

        # Push results to CosmosDB if this is part of a job
        current_job_id = get_current_prompt_id()
        if current_job_id:
            logger.log(f"📡 Pushing combined structured analysis to CosmosDB for job {current_job_id}...")
            
            # Upload subject image
            subject_url = upload_subject_image(current_job_id, subject_image_path)
            
            cosmos_meta = {
                "prompts": {
                    "positive": combined_text,
                    "subjectJson": subject_result,
                    "videoJson": video_result
                },
                "subjectImageUrl": subject_url
            }
            update_job_metadata(current_job_id, cosmos_meta)

        return {
            "ui": {"json_output": [subject_json, video_json, combined_text, formatted_response]},
            "result": (subject_json, video_json, combined_text, formatted_response)
        }


# Node registration
NODE_CLASS_MAPPINGS = {
    "LLMStudioStructuredDescribe": LLMStudioStructuredDescribe,
    "LLMStudioStructuredVideoDescribe": LLMStudioStructuredVideoDescribe,
    "LMStudioCombinedStructuredDescribe": LMStudioCombinedStructuredDescribe,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "LLMStudioStructuredDescribe": "LM Studio Structured Describe (Image)",
    "LLMStudioStructuredVideoDescribe": "LM Studio Structured Describe (Video)",
    "LMStudioCombinedStructuredDescribe": "LM Studio Combined Structured Describe",
}
