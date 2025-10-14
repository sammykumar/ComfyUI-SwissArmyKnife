"""
TransformersWrapper Node

A ComfyUI custom node for dynamic loading and inference with transformer-based
vision-language models (JoyCaption, Qwen2.5-VL, Qwen3-VL).

This node enables:
- On-demand model loading and unloading
- Quantization support (fp16, int8, int4)
- VRAM optimization through automatic model management
- Multi-modal image captioning and text inference
"""

import gc
import torch
from typing import Tuple
from PIL import Image
import numpy as np


# Model ID mapping
MODEL_MAP = {
    "joycaption": "fancyfeast/llama-joycaption-alpha-two-hf-llava",
    "qwen2.5-vl": "Qwen/Qwen2.5-VL-7B-Instruct",
    "qwen3-vl": "Qwen/Qwen3-VL-7B-Instruct"
}


class TransformersWrapperNode:
    """
    A ComfyUI custom node for loading and running transformer-based vision-language models.
    Supports dynamic model switching with automatic VRAM management.
    """

    # Class-level storage for models (shared across instances)
    _model = None
    _processor = None
    _current_model = None
    _current_quant = None

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define input parameters for the node.
        """
        return {
            "required": {
                "image": ("IMAGE", {
                    "tooltip": "Input image tensor from ComfyUI (BHWC format)"
                }),
                "model_name": (["joycaption", "qwen2.5-vl", "qwen3-vl"], {
                    "default": "joycaption",
                    "tooltip": "Select which vision-language model to load"
                }),
                "quant": (["fp16", "int8", "int4"], {
                    "default": "fp16",
                    "tooltip": "Quantization mode for model loading (lower = less VRAM)"
                }),
            },
            "optional": {
                "prompt": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Optional text prompt for guided caption generation"
                }),
                "max_new_tokens": ("INT", {
                    "default": 256,
                    "min": 1,
                    "max": 2048,
                    "step": 1,
                    "tooltip": "Maximum number of tokens to generate"
                }),
                "temperature": ("FLOAT", {
                    "default": 0.7,
                    "min": 0.1,
                    "max": 2.0,
                    "step": 0.1,
                    "tooltip": "Sampling temperature (higher = more creative)"
                }),
                "unload_after_inference": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Unload model from GPU after inference to free VRAM"
                }),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("caption",)
    FUNCTION = "generate_caption"
    CATEGORY = "Swiss Army Knife 🔪/AI Models"

    def generate_caption(
        self,
        image,
        model_name: str,
        quant: str,
        prompt: str = "",
        max_new_tokens: int = 256,
        temperature: float = 0.7,
        unload_after_inference: bool = False
    ) -> Tuple[str]:
        """
        Generate caption for input image using selected transformer model.

        Args:
            image: Input image tensor (ComfyUI format: BHWC)
            model_name: Model to use (joycaption, qwen2.5-vl, qwen3-vl)
            quant: Quantization mode (fp16, int8, int4)
            prompt: Optional text prompt
            max_new_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            unload_after_inference: Whether to unload model after inference

        Returns:
            Tuple containing generated caption text
        """
        try:
            # Check if we need to load or switch models
            need_reload = (
                self._current_model != model_name or 
                self._current_quant != quant or
                self._model is None
            )

            if need_reload:
                print(f"🔄 Loading model: {model_name} with {quant} quantization...")
                self._load_model(model_name, quant)

            # Convert ComfyUI image tensor to PIL Image
            pil_image = self._tensor_to_pil(image)

            # Generate caption
            caption = self._run_inference(pil_image, prompt, max_new_tokens, temperature)

            # Optionally unload model to free VRAM
            if unload_after_inference:
                print("🗑️  Unloading model to free VRAM...")
                self._unload_model()

            return (caption,)

        except torch.cuda.OutOfMemoryError as e:
            error_msg = f"❌ CUDA Out of Memory: {str(e)}\nTry using a lower quantization mode (int8 or int4) or enable 'unload_after_inference'."
            print(error_msg)
            self._unload_model()  # Emergency cleanup
            return (error_msg,)
        except Exception as e:
            error_msg = f"❌ Error during caption generation: {str(e)}"
            print(error_msg)
            import traceback
            traceback.print_exc()
            return (error_msg,)

    @classmethod
    def _load_model(cls, model_name: str, quant: str):
        """
        Load the specified model with given quantization settings.

        Args:
            model_name: Model identifier
            quant: Quantization mode
        """
        # Unload existing model if any
        if cls._model is not None:
            cls._unload_model()

        # Import transformers here to avoid import errors if not installed
        try:
            from transformers import AutoProcessor, AutoModelForVision2Seq, BitsAndBytesConfig
        except ImportError as e:
            raise ImportError(
                f"Failed to import transformers: {e}\n"
                "Please install: pip install transformers accelerate bitsandbytes"
            )

        model_id = MODEL_MAP[model_name]
        print(f"📦 Loading model from: {model_id}")

        # Configure quantization
        quantization_config = None
        load_in_8bit = False
        load_in_4bit = False
        torch_dtype = torch.float16

        if quant == "int8":
            load_in_8bit = True
            print("  ⚙️  Using 8-bit quantization")
        elif quant == "int4":
            load_in_4bit = True
            quantization_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_use_double_quant=True,
                bnb_4bit_quant_type="nf4"
            )
            print("  ⚙️  Using 4-bit quantization")
        else:
            print("  ⚙️  Using fp16 (no quantization)")

        try:
            # Load processor
            cls._processor = AutoProcessor.from_pretrained(
                model_id,
                trust_remote_code=True
            )

            # Load model with appropriate settings
            model_kwargs = {
                "device_map": "auto",
                "torch_dtype": torch_dtype,
                "trust_remote_code": True,
            }

            if load_in_8bit:
                model_kwargs["load_in_8bit"] = True
            elif load_in_4bit:
                model_kwargs["quantization_config"] = quantization_config

            cls._model = AutoModelForVision2Seq.from_pretrained(
                model_id,
                **model_kwargs
            )

            cls._current_model = model_name
            cls._current_quant = quant
            print(f"✅ Model loaded successfully: {model_name}")

        except Exception as e:
            cls._model = None
            cls._processor = None
            cls._current_model = None
            cls._current_quant = None
            raise RuntimeError(f"Failed to load model {model_id}: {str(e)}")

    @classmethod
    def _unload_model(cls):
        """
        Unload the current model and free GPU memory.
        """
        if cls._model is not None:
            del cls._model
            cls._model = None
        if cls._processor is not None:
            del cls._processor
            cls._processor = None

        cls._current_model = None
        cls._current_quant = None

        # Force garbage collection and clear CUDA cache
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.synchronize()

        print("🗑️  Model unloaded and VRAM cleared")

    def _tensor_to_pil(self, tensor) -> Image.Image:
        """
        Convert ComfyUI image tensor to PIL Image.

        ComfyUI uses BHWC format (Batch, Height, Width, Channels) with values in [0, 1].

        Args:
            tensor: ComfyUI image tensor

        Returns:
            PIL Image
        """
        # Take first image from batch
        if len(tensor.shape) == 4:
            tensor = tensor[0]

        # Convert from [0, 1] to [0, 255]
        if tensor.dtype == torch.float32 or tensor.dtype == torch.float16:
            tensor = (tensor * 255.0).clamp(0, 255)

        # Convert to numpy and uint8
        img_np = tensor.cpu().numpy().astype(np.uint8)

        # Convert to PIL
        pil_image = Image.fromarray(img_np)

        return pil_image

    def _run_inference(
        self,
        image: Image.Image,
        prompt: str,
        max_new_tokens: int,
        temperature: float
    ) -> str:
        """
        Run inference on the image with the loaded model.

        Args:
            image: PIL Image
            prompt: Text prompt (optional)
            max_new_tokens: Maximum tokens to generate
            temperature: Sampling temperature

        Returns:
            Generated caption text
        """
        if self._model is None or self._processor is None:
            raise RuntimeError("Model not loaded. This should not happen.")

        print(f"🎨 Generating caption with {self._current_model}...")

        # Prepare inputs
        if prompt:
            # For models that support text prompts
            inputs = self._processor(
                text=prompt,
                images=image,
                return_tensors="pt"
            )
        else:
            # Just image input
            inputs = self._processor(
                images=image,
                return_tensors="pt"
            )

        # Move inputs to same device as model
        device = next(self._model.parameters()).device
        inputs = {k: v.to(device) if isinstance(v, torch.Tensor) else v 
                  for k, v in inputs.items()}

        # Generate caption
        with torch.no_grad():
            outputs = self._model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                do_sample=temperature > 0.0,
                pad_token_id=self._processor.tokenizer.eos_token_id
            )

        # Decode output
        caption = self._processor.decode(outputs[0], skip_special_tokens=True)

        # Remove prompt from output if present
        if prompt and caption.startswith(prompt):
            caption = caption[len(prompt):].strip()

        print(f"✨ Caption generated: {caption[:100]}...")
        return caption


# Node registration
NODE_CLASS_MAPPINGS = {
    "TransformersWrapperNode": TransformersWrapperNode
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "TransformersWrapperNode": "🤖 Transformers VLM Wrapper"
}
