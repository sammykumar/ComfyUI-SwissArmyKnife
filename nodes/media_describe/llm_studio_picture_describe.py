"""
LLM Studio Picture Describe Node

This node uses LM Studio with vision-language models (like Qwen3-VL) to analyze image content.
"""

import base64
from openai import OpenAI
from pathlib import Path
from typing import Tuple


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
                    "default": 0.5,
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
                max_tokens=500,
                temperature=temperature
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
    "LLMStudioPictureDescribe": LLMStudioPictureDescribe
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "LLMStudioPictureDescribe": "LLM Studio Picture Describe"
}
