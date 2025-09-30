"""
JoyCaption HuggingFace model nodes for image captioning.
Based on ComfyUI-JoyCaption by 1038lab.
"""

import torch
from transformers import AutoProcessor, LlavaForConditionalGeneration, BitsAndBytesConfig
import folder_paths
from pathlib import Path
from PIL import Image
from torchvision.transforms import ToPILImage
import json

# Load configuration from JSON file
with open(Path(__file__).parent / "jc_data.json", "r", encoding="utf-8") as f:
    config = json.load(f)
    CAPTION_TYPE_MAP = config["caption_type_map"]
    EXTRA_OPTIONS = config["extra_options"]
    MEMORY_EFFICIENT_CONFIGS = config["memory_efficient_configs"]
    MODEL_SETTINGS = config["model_settings"]
    CAPTION_LENGTH_CHOICES = config["caption_length_choices"]
    HF_MODELS = config["hf_models"]

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

class JC_Models:
    """Model management class for HuggingFace models."""
    
    def __init__(self, model: str, memory_mode: str):
        checkpoint_path = Path(folder_paths.models_dir) / "LLM" / Path(model).stem
        if not checkpoint_path.exists():
            from huggingface_hub import snapshot_download
            snapshot_download(repo_id=model, local_dir=str(checkpoint_path), force_download=False, local_files_only=False)
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.processor = AutoProcessor.from_pretrained(
            str(checkpoint_path), 
            use_fast=True,
            image_processor_type="CLIPImageProcessor",
            image_size=336
        )

        if memory_mode == "Full Precision (bf16)":
            self.model = LlavaForConditionalGeneration.from_pretrained(
                str(checkpoint_path), 
                torch_dtype=torch.bfloat16,
                device_map="auto"
            )
        elif memory_mode == "Balanced (8-bit)":
            qnt_config = BitsAndBytesConfig(
                load_in_8bit=True,
                bnb_8bit_compute_dtype=torch.float16,
                bnb_8bit_use_double_quant=True,
                llm_int8_skip_modules=["vision_tower", "multi_modal_projector"]
            )
            self.model = LlavaForConditionalGeneration.from_pretrained(
                str(checkpoint_path), 
                torch_dtype=torch.float16,
                device_map="auto", 
                quantization_config=qnt_config
            )
        else:  # Maximum Savings (4-bit)
            qnt_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_use_double_quant=True,
                llm_int8_skip_modules=["vision_tower", "multi_modal_projector"]
            )
            self.model = LlavaForConditionalGeneration.from_pretrained(
                str(checkpoint_path), 
                torch_dtype="auto", 
                device_map="auto", 
                quantization_config=qnt_config
            )
        self.model.eval()

    @torch.inference_mode()
    def generate(self, image: Image.Image, system: str, prompt: str, max_new_tokens: int, temperature: float, top_p: float, top_k: int) -> str:
        """Generate caption for image."""
        convo = [
            {"role": "system", "content": system.strip()},
            {"role": "user", "content": prompt.strip()},
        ]

        convo_string = self.processor.apply_chat_template(convo, tokenize=False, add_generation_prompt=True)
        assert isinstance(convo_string, str)

        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        if hasattr(self.processor, 'image_processor') and hasattr(self.processor.image_processor, 'size'):
            expected_size = self.processor.image_processor.size
            if isinstance(expected_size, dict):
                target_size = (expected_size.get('height', 336), expected_size.get('width', 336))
            elif isinstance(expected_size, (list, tuple)):
                target_size = tuple(expected_size) if len(expected_size) == 2 else (expected_size[0], expected_size[0])
            else:
                target_size = (expected_size, expected_size)
        else:
            target_size = (336, 336)
        
        image = image.resize(target_size, Image.Resampling.LANCZOS)
        inputs = self.processor(text=[convo_string], images=[image], return_tensors="pt").to(self.device)
        
        if hasattr(inputs, 'pixel_values') and inputs['pixel_values'] is not None:
            inputs['pixel_values'] = inputs['pixel_values'].to(self.model.dtype)

        generate_ids = self.model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=True if temperature > 0 else False,
            suppress_tokens=None,
            use_cache=True,
            temperature=temperature,
            top_k=None if top_k == 0 else top_k,
            top_p=top_p,
        )[0]

        generate_ids = generate_ids[inputs['input_ids'].shape[1]:]
        caption = self.processor.tokenizer.decode(generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)
        return caption.strip()

class JC_ExtraOptions:
    """JoyCaption Extra Options node for additional customization."""
    
    @classmethod
    def INPUT_TYPES(cls):
        inputs = {"required": {}}
        for key, value in EXTRA_OPTIONS.items():
            inputs["required"][key] = ("BOOLEAN", {"default": value["default"]})
        inputs["required"]["character_name"] = ("STRING", {"default": "", "multiline": True, "placeholder": "Character Name"})
        return inputs

    RETURN_TYPES = ("JOYCAPTION_EXTRA_OPTIONS",)
    RETURN_NAMES = ("extra_options",)
    FUNCTION = "get_extra_options"
    CATEGORY = "Swiss Army Knife 🔪/JoyCaption"

    def get_extra_options(self, character_name, **kwargs):
        ret_list = []
        for key, value in EXTRA_OPTIONS.items():
            if kwargs.get(key, False):
                ret_list.append(value["description"])
        return ([ret_list, character_name],)

class JC:
    """Basic JoyCaption node for image captioning."""
    
    @classmethod
    def INPUT_TYPES(cls):
        model_list = list(HF_MODELS.keys())
        return {
            "required": {
                "image":          ("IMAGE",),
                "model":          (model_list, {"default": model_list[0], "tooltip": "Select the AI model to use for caption generation"}),
                "quantization":   (list(MEMORY_EFFICIENT_CONFIGS.keys()), {"default": "Balanced (8-bit)", "tooltip": "Choose between speed and quality. 8-bit is recommended for most users"}),
                "prompt_style":   (list(CAPTION_TYPE_MAP.keys()), {"default": "Descriptive", "tooltip": "Select the style of caption you want to generate"}),
                "caption_length": (CAPTION_LENGTH_CHOICES, {"default": "any", "tooltip": "Control the length of the generated caption"}),
                "memory_management": (["Keep in Memory", "Clear After Run"], {"default": "Keep in Memory", "tooltip": "Choose how to manage model memory. 'Keep in Memory' for faster processing, 'Clear After Run' for limited VRAM"}),
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
        self.current_memory_mode = None
        self.current_model = None

    def generate(self, image, model, quantization, prompt_style, caption_length, memory_management, extra_options=None):
        try:
            if self.predictor is None or self.current_memory_mode != quantization or self.current_model != model:
                if self.predictor is not None:
                    del self.predictor
                    self.predictor = None
                    torch.cuda.empty_cache()
                
                try:
                    model_name = HF_MODELS[model]["name"]
                    self.predictor = JC_Models(model_name, quantization)
                    self.current_memory_mode = quantization
                    self.current_model = model
                except Exception as e:
                    return (f"Error loading model: {e}",)
            
            prompt = build_prompt(prompt_style, caption_length, extra_options[0] if extra_options else [], extra_options[1] if extra_options else "{NAME}")
            system_prompt = MODEL_SETTINGS["default_system_prompt"]
            
            pil_image = ToPILImage()(image[0].permute(2, 0, 1))
            response = self.predictor.generate(
                image=pil_image,
                system=system_prompt,
                prompt=prompt,
                max_new_tokens=MODEL_SETTINGS["default_max_tokens"],
                temperature=MODEL_SETTINGS["default_temperature"],
                top_p=MODEL_SETTINGS["default_top_p"],
                top_k=MODEL_SETTINGS["default_top_k"],
            )

            if memory_management == "Clear After Run":
                del self.predictor
                self.predictor = None
                torch.cuda.empty_cache()
                import gc
                gc.collect()

            return (response,)
        except Exception as e:
            if memory_management == "Clear After Run":
                del self.predictor
                self.predictor = None
                torch.cuda.empty_cache()
                import gc
                gc.collect()
            raise e

class JC_adv:
    """Advanced JoyCaption node with full parameter control."""
    
    @classmethod
    def INPUT_TYPES(cls):
        model_list = list(HF_MODELS.keys())
        return {
            "required": {
                "image":          ("IMAGE",),
                "model":          (model_list, {"default": model_list[0], "tooltip": "Select the AI model to use for caption generation"}),
                "quantization":   (list(MEMORY_EFFICIENT_CONFIGS.keys()), {"default": "Balanced (8-bit)", "tooltip": "Choose between speed and quality. 8-bit is recommended for most users"}),
                "prompt_style":   (list(CAPTION_TYPE_MAP.keys()), {"default": "Descriptive", "tooltip": "Select the style of caption you want to generate"}),
                "caption_length": (CAPTION_LENGTH_CHOICES, {"default": "any", "tooltip": "Control the length of the generated caption"}),
                "max_new_tokens": ("INT",    {"default": MODEL_SETTINGS["default_max_tokens"], "min": 1,   "max": 2048, "tooltip": "Maximum number of tokens to generate. Higher values allow longer captions"}),
                "temperature":    ("FLOAT",  {"default": MODEL_SETTINGS["default_temperature"], "min": 0.0, "max": 2.0, "step": 0.05, "tooltip": "Control the randomness of the output. Higher values make the output more creative but less predictable"}),
                "top_p":          ("FLOAT",  {"default": MODEL_SETTINGS["default_top_p"], "min": 0.0, "max": 1.0, "step": 0.01, "tooltip": "Control the diversity of the output. Higher values allow more diverse word choices"}),
                "top_k":          ("INT",    {"default": MODEL_SETTINGS["default_top_k"], "min": 0,   "max": 100, "tooltip": "Limit the number of possible next tokens. Lower values make the output more focused"}),
                "custom_prompt":  ("STRING", {"default": "", "multiline": True, "tooltip": "Custom prompt template. If empty, will use the selected prompt style"}),
                "memory_management": (["Keep in Memory", "Clear After Run"], {"default": "Keep in Memory", "tooltip": "Choose how to manage model memory. 'Keep in Memory' for faster processing, 'Clear After Run' for limited VRAM"}),
            },
            "optional": {
                "extra_options": ("JOYCAPTION_EXTRA_OPTIONS", {"tooltip": "Additional options to customize the caption generation"}),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING")
    RETURN_NAMES = ("PROMPT", "STRING")
    FUNCTION = "generate"
    CATEGORY = "Swiss Army Knife 🔪/JoyCaption"

    def __init__(self):
        self.predictor = None
        self.current_memory_mode = None
        self.current_model = None

    def generate(self, image, model, quantization, prompt_style, caption_length, max_new_tokens, temperature, top_p, top_k, custom_prompt, memory_management, extra_options=None):
        try:
            if self.predictor is None or self.current_memory_mode != quantization or self.current_model != model:
                if self.predictor is not None:
                    del self.predictor
                    self.predictor = None
                    torch.cuda.empty_cache()
                
                try:
                    model_name = HF_MODELS[model]["name"]
                    self.predictor = JC_Models(model_name, quantization)
                    self.current_memory_mode = quantization
                    self.current_model = model
                except Exception as e:
                    return (f"Error loading model: {e}", "")
            
            if custom_prompt and custom_prompt.strip():
                prompt = custom_prompt.strip()
            else:
                prompt = build_prompt(prompt_style, caption_length, extra_options[0] if extra_options else [], extra_options[1] if extra_options else "{NAME}")
            
            system_prompt = MODEL_SETTINGS["default_system_prompt"]
            
            pil_image = ToPILImage()(image[0].permute(2, 0, 1))
            response = self.predictor.generate(
                image=pil_image,
                system=system_prompt,
                prompt=prompt,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                top_k=top_k,
            )

            if memory_management == "Clear After Run":
                del self.predictor
                self.predictor = None
                torch.cuda.empty_cache()
                import gc
                gc.collect()

            return (prompt, response)
        except Exception as e:
            if memory_management == "Clear After Run":
                del self.predictor
                self.predictor = None
                torch.cuda.empty_cache()
                import gc
                gc.collect()
            raise e

# Node mappings for ComfyUI
NODE_CLASS_MAPPINGS = {
    "JC": JC,
    "JC_adv": JC_adv,
    "JC_ExtraOptions": JC_ExtraOptions,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "JC": "JoyCaption",
    "JC_adv": "JoyCaption (Advanced)",
    "JC_ExtraOptions": "JoyCaption Extra Options",
}