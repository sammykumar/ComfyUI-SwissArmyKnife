"""
JoyCaption GGUF quantized model nodes for image captioning.
Based on ComfyUI-JoyCaption by 1038lab.
"""

import json
from pathlib import Path
from PIL import Image
from torchvision.transforms import ToPILImage
import folder_paths

# Load configuration from JSON file
with open(Path(__file__).parent / "jc_data.json", "r", encoding="utf-8") as f:
    config = json.load(f)
    CAPTION_TYPE_MAP = config["caption_type_map"]
    EXTRA_OPTIONS = config["extra_options"]
    MODEL_SETTINGS = config["model_settings"]
    CAPTION_LENGTH_CHOICES = config["caption_length_choices"]
    GGUF_MODELS = config["gguf_models"]

def build_prompt(caption_type: str, caption_length: str | int, extra_options: list[str], name_input: str) -> str:
    """Build the caption prompt based on parameters."""
    if caption_length == "any":
        map_idx = 0
    elif isinstance(caption_length, str) and caption_length.isdigit():
        map_idx = 1
    else:
        map_idx = 2
    
    prompt = CAPTION_TYPE_MAP[caption_type][map_idx]

    if extra_options:
        prompt += " " + " ".join(extra_options)
    
    return prompt.format(
        name=name_input or "{NAME}",
        length=caption_length,
        word_count=caption_length,
    )

class JC_GGUF_Models:
    """Model management class for GGUF quantized models."""
    
    def __init__(self, repo_id: str, filename: str, gpu_layers: int):
        self.repo_id = repo_id
        self.filename = filename
        self.gpu_layers = gpu_layers
        
        # Download model if not exists
        model_dir = Path(folder_paths.models_dir) / "LLM" / Path(repo_id).name
        model_file = model_dir / filename
        
        if not model_file.exists():
            from huggingface_hub import hf_hub_download
            model_dir.mkdir(parents=True, exist_ok=True)
            hf_hub_download(
                repo_id=repo_id,
                filename=filename,
                local_dir=str(model_dir),
                force_download=False,
                local_files_only=False
            )
        
        # Initialize llama.cpp
        try:
            from llama_cpp import Llama
            from llama_cpp.llama_chat_format import Llava15ChatHandler
        except ImportError:
            raise ImportError("llama-cpp-python is required for GGUF models. Install with: pip install llama-cpp-python")
        
        # Check if CUDA is available for GPU acceleration
        import torch
        self.use_gpu = torch.cuda.is_available() and gpu_layers > 0
        
        self.chat_handler = Llava15ChatHandler(clip_model_path=str(model_file))
        self.llm = Llama(
            model_path=str(model_file),
            chat_handler=self.chat_handler,
            n_ctx=4096,
            verbose=False,
            n_gpu_layers=gpu_layers if self.use_gpu else 0,
        )

    def generate(self, image: Image.Image, system: str, prompt: str, max_tokens: int, temperature: float, top_p: float, top_k: int) -> str:
        """Generate caption for image using GGUF model."""
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image for optimal processing
        image = image.resize((336, 336), Image.Resampling.LANCZOS)
        
        messages = [
            {"role": "system", "content": system.strip()},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": image}},
                    {"type": "text", "text": prompt.strip()}
                ]
            }
        ]
        
        response = self.llm.create_chat_completion(
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p,
            top_k=top_k if top_k > 0 else -1,
        )
        
        return response["choices"][0]["message"]["content"].strip()

class JC_GGUF:
    """GGUF JoyCaption node for quantized model inference."""
    
    @classmethod
    def INPUT_TYPES(cls):
        model_list = list(GGUF_MODELS.keys())
        return {
            "required": {
                "image":          ("IMAGE",),
                "model":          (model_list, {"default": model_list[0], "tooltip": "Select the GGUF quantized model to use"}),
                "prompt_style":   (list(CAPTION_TYPE_MAP.keys()), {"default": "Descriptive", "tooltip": "Select the style of caption you want to generate"}),
                "caption_length": (CAPTION_LENGTH_CHOICES, {"default": "any", "tooltip": "Control the length of the generated caption"}),
                "gpu_layers":     ("INT", {"default": 35, "min": 0, "max": 50, "tooltip": "Number of layers to offload to GPU. Higher values use more VRAM but are faster"}),
                "memory_management": (["Keep in Memory", "Clear After Run"], {"default": "Keep in Memory", "tooltip": "Choose how to manage model memory"}),
            },
            "optional": {
                "extra_options": ("JOYCAPTION_EXTRA_OPTIONS", {"tooltip": "Additional options to customize the caption generation"}),
            }
        }
    
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("STRING",)
    FUNCTION = "generate"
    CATEGORY = "Swiss Army Knife 🔪/JoyCaption"

    def __init__(self):
        self.predictor = None
        self.current_model = None
        self.current_gpu_layers = None

    def generate(self, image, model, prompt_style, caption_length, gpu_layers, memory_management, extra_options=None):
        try:
            # Check if we need to reload the model
            if (self.predictor is None or 
                self.current_model != model or 
                self.current_gpu_layers != gpu_layers):
                
                if self.predictor is not None:
                    del self.predictor
                    self.predictor = None
                    import gc
                    gc.collect()
                
                try:
                    model_config = GGUF_MODELS[model]
                    self.predictor = JC_GGUF_Models(
                        repo_id=model_config["repo_id"],
                        filename=model_config["filename"],
                        gpu_layers=gpu_layers
                    )
                    self.current_model = model
                    self.current_gpu_layers = gpu_layers
                except Exception as e:
                    return (f"Error loading GGUF model: {e}",)
            
            prompt = build_prompt(
                prompt_style, 
                caption_length, 
                extra_options[0] if extra_options else [], 
                extra_options[1] if extra_options else "{NAME}"
            )
            system_prompt = MODEL_SETTINGS["default_system_prompt"]
            
            pil_image = ToPILImage()(image[0].permute(2, 0, 1))
            response = self.predictor.generate(
                image=pil_image,
                system=system_prompt,
                prompt=prompt,
                max_tokens=MODEL_SETTINGS["default_max_tokens"],
                temperature=MODEL_SETTINGS["default_temperature"],
                top_p=MODEL_SETTINGS["default_top_p"],
                top_k=MODEL_SETTINGS["default_top_k"],
            )

            if memory_management == "Clear After Run":
                del self.predictor
                self.predictor = None
                import gc
                gc.collect()

            return (response,)
        except Exception as e:
            if memory_management == "Clear After Run" and self.predictor is not None:
                del self.predictor
                self.predictor = None
                import gc
                gc.collect()
            raise e

class JC_GGUF_adv:
    """Advanced GGUF JoyCaption node with full parameter control."""
    
    @classmethod
    def INPUT_TYPES(cls):
        model_list = list(GGUF_MODELS.keys())
        return {
            "required": {
                "image":          ("IMAGE",),
                "model":          (model_list, {"default": model_list[0], "tooltip": "Select the GGUF quantized model to use"}),
                "prompt_style":   (list(CAPTION_TYPE_MAP.keys()), {"default": "Descriptive", "tooltip": "Select the style of caption you want to generate"}),
                "caption_length": (CAPTION_LENGTH_CHOICES, {"default": "any", "tooltip": "Control the length of the generated caption"}),
                "max_tokens":     ("INT",    {"default": MODEL_SETTINGS["default_max_tokens"], "min": 1,   "max": 2048, "tooltip": "Maximum number of tokens to generate"}),
                "temperature":    ("FLOAT",  {"default": MODEL_SETTINGS["default_temperature"], "min": 0.0, "max": 2.0, "step": 0.05, "tooltip": "Control randomness"}),
                "top_p":          ("FLOAT",  {"default": MODEL_SETTINGS["default_top_p"], "min": 0.0, "max": 1.0, "step": 0.01, "tooltip": "Control diversity"}),
                "top_k":          ("INT",    {"default": MODEL_SETTINGS["default_top_k"], "min": 0,   "max": 100, "tooltip": "Limit token choices"}),
                "gpu_layers":     ("INT",    {"default": 35, "min": 0, "max": 50, "tooltip": "GPU layers for acceleration"}),
                "custom_prompt":  ("STRING", {"default": "", "multiline": True, "tooltip": "Custom prompt template"}),
                "memory_management": (["Keep in Memory", "Clear After Run"], {"default": "Keep in Memory", "tooltip": "Memory management strategy"}),
            },
            "optional": {
                "extra_options": ("JOYCAPTION_EXTRA_OPTIONS", {"tooltip": "Additional customization options"}),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING")
    RETURN_NAMES = ("PROMPT", "STRING")
    FUNCTION = "generate"
    CATEGORY = "Swiss Army Knife 🔪/JoyCaption"

    def __init__(self):
        self.predictor = None
        self.current_model = None
        self.current_gpu_layers = None

    def generate(self, image, model, prompt_style, caption_length, max_tokens, temperature, top_p, top_k, gpu_layers, custom_prompt, memory_management, extra_options=None):
        try:
            # Check if we need to reload the model
            if (self.predictor is None or 
                self.current_model != model or 
                self.current_gpu_layers != gpu_layers):
                
                if self.predictor is not None:
                    del self.predictor
                    self.predictor = None
                    import gc
                    gc.collect()
                
                try:
                    model_config = GGUF_MODELS[model]
                    self.predictor = JC_GGUF_Models(
                        repo_id=model_config["repo_id"],
                        filename=model_config["filename"],
                        gpu_layers=gpu_layers
                    )
                    self.current_model = model
                    self.current_gpu_layers = gpu_layers
                except Exception as e:
                    return (f"Error loading GGUF model: {e}", "")
            
            if custom_prompt and custom_prompt.strip():
                prompt = custom_prompt.strip()
            else:
                prompt = build_prompt(
                    prompt_style, 
                    caption_length, 
                    extra_options[0] if extra_options else [], 
                    extra_options[1] if extra_options else "{NAME}"
                )
            
            system_prompt = MODEL_SETTINGS["default_system_prompt"]
            
            pil_image = ToPILImage()(image[0].permute(2, 0, 1))
            response = self.predictor.generate(
                image=pil_image,
                system=system_prompt,
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=top_p,
                top_k=top_k,
            )

            if memory_management == "Clear After Run":
                del self.predictor
                self.predictor = None
                import gc
                gc.collect()

            return (prompt, response)
        except Exception as e:
            if memory_management == "Clear After Run" and self.predictor is not None:
                del self.predictor
                self.predictor = None
                import gc
                gc.collect()
            raise e

# Node mappings for ComfyUI
NODE_CLASS_MAPPINGS = {
    "JC_GGUF": JC_GGUF,
    "JC_GGUF_adv": JC_GGUF_adv,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "JC_GGUF": "JoyCaption (GGUF)",
    "JC_GGUF_adv": "JoyCaption (GGUF Advanced)",
}