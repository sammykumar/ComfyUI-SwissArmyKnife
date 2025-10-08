import torch
import os
import json
from pathlib import Path
from PIL import Image
from torchvision.transforms import ToPILImage
import folder_paths
from contextlib import contextmanager

@contextmanager
def _local_torch_backend():
    if not torch.cuda.is_available():
        yield
        return
    
    old_bench = torch.backends.cudnn.benchmark
    old_tf32_matmul = getattr(torch.backends.cuda, "matmul", None)
    old_tf32_matmul_flag = getattr(old_tf32_matmul, "allow_tf32", None) if old_tf32_matmul else None
    old_tf32_flag = getattr(torch.backends.cuda, "allow_tf32", None)
    try:
        torch.backends.cudnn.benchmark = True
        if old_tf32_matmul is not None:
            old_tf32_matmul.allow_tf32 = True
        if old_tf32_flag is not None:
            torch.backends.cuda.allow_tf32 = True
        yield
    finally:
        torch.backends.cudnn.benchmark = old_bench
        if old_tf32_matmul is not None and old_tf32_matmul_flag is not None:
            old_tf32_matmul.allow_tf32 = old_tf32_matmul_flag
        if old_tf32_flag is not None:
            torch.backends.cuda.allow_tf32 = old_tf32_flag

# Load configuration from JSON file
with open(Path(__file__).parent / "jc_data.json", "r", encoding="utf-8") as f:
    config = json.load(f)
    CAPTION_TYPE_MAP = config["caption_type_map"]
    EXTRA_OPTIONS = config["extra_options"]
    GGUF_MODELS = config["gguf_models"]
    MODEL_SETTINGS = config["model_settings"]
    CAPTION_LENGTH_CHOICES = config["caption_length_choices"]

def build_prompt(caption_type: str, caption_length: str | int, extra_options: list[str], name_input: str) -> str:
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
    def __init__(self, model_name: str, model_repo: str, n_ctx: int, n_gpu_layers: int, verbose: bool):
        try:
            from llama_cpp import Llama
            from llama_cpp.llama_chat_format import Llava15ChatHandler
        except ImportError:
            raise ImportError("llama-cpp-python is required for GGUF models. Please install it with: pip install llama-cpp-python")
        
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.verbose = verbose
        
        # Determine model path
        gguf_dir = Path(folder_paths.models_dir) / "LLM" / "GGUF"
        gguf_dir.mkdir(parents=True, exist_ok=True)
        
        model_path = gguf_dir / f"{model_name}.gguf"
        
        if not model_path.exists():
            # Download model if not found
            from huggingface_hub import hf_hub_download
            print(f"Downloading GGUF model: {model_name}")
            hf_hub_download(
                repo_id=model_repo,
                filename=f"{model_name}.gguf",
                local_dir=str(gguf_dir),
                local_dir_use_symlinks=False
            )
        
        # Initialize chat handler
        self.chat_handler = Llava15ChatHandler(
            clip_model_path=str(model_path),
            verbose=verbose
        )
        
        # Initialize Llama model
        if torch.cuda.is_available() and "PYTORCH_CUDA_ALLOC_CONF" not in os.environ:
            os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "max_split_size_mb:128"
        
        with _local_torch_backend():
            self.llm = Llama(
                model_path=str(model_path),
                chat_handler=self.chat_handler,
                n_ctx=n_ctx,
                n_gpu_layers=n_gpu_layers,
                verbose=verbose,
                logits_all=True,
            )

    def generate(self, image: Image.Image, system: str, prompt: str, max_tokens: int, temperature: float, top_p: float, top_k: int) -> str:
        # Ensure image is in RGB mode
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Prepare the conversation
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
        
        # Generate response
        with _local_torch_backend():
            response = self.llm.create_chat_completion(
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=top_p,
                top_k=None if top_k == 0 else top_k,
                stop=[
                    "<|eot_id|>", "</s>",
                    "<|start_header_id|>assistant<|end_header_id|>",
                    "<|start_header_id|>user<|end_header_id|>",
                    "ASSISTANT:", "Assistant:",
                    "USER:", "User:",
                    "### Assistant:", "### Human:",
                    "HUMAN:", "Human:"
                ],
                stream=False,
                repeat_penalty=1.1,
                mirostat_mode=0
            )
        
        text = response["choices"][0]["message"]["content"] or ""
        
        # Clean up any leaked role markers
        banned_markers = (
            "<|start_header_id|>assistant<|end_header_id|>",
            "<|start_header_id|>user<|end_header_id|>",
            "ASSISTANT:", "Assistant:",
            "USER:", "User:",
            "### Assistant:", "### Human:",
            "HUMAN:", "Human:"
        )
        first_hit = len(text)
        for m in banned_markers:
            pos = text.find(m)
            if pos != -1 and pos < first_hit:
                first_hit = pos
        if first_hit != len(text):
            text = text[:first_hit].rstrip()
        
        # Clean up end-of-turn tokens
        for cut in ("<|eot_id|>", "</s>"):
            if cut in text:
                text = text.split(cut, 1)[0].rstrip()
        
        return text.strip()

class JC_GGUF:
    @classmethod
    def INPUT_TYPES(cls):
        model_list = list(GGUF_MODELS.keys())
        return {
            "required": {
                "image":          ("IMAGE",),
                "model":          (model_list, {"default": model_list[0], "tooltip": "Select the GGUF model to use for caption generation"}),
                "prompt_style":   (list(CAPTION_TYPE_MAP.keys()), {"default": "Descriptive", "tooltip": "Select the style of caption you want to generate"}),
                "caption_length": (CAPTION_LENGTH_CHOICES, {"default": "any", "tooltip": "Control the length of the generated caption"}),
                "context_length": ("INT", {"default": 4096, "min": 512, "max": 32768, "tooltip": "Context window size. Higher values allow longer conversations but use more memory"}),
                "gpu_layers":     ("INT", {"default": 35, "min": 0, "max": 100, "tooltip": "Number of layers to offload to GPU. Set to 0 for CPU-only processing"}),
                "memory_management": (["Keep in Memory", "Clear After Run"], {"default": "Keep in Memory", "tooltip": "Choose how to manage model memory. 'Keep in Memory' for faster processing, 'Clear After Run' for limited VRAM"}),
            },
            "optional": {
                "extra_options": ("JOYCAPTION_EXTRA_OPTIONS", {"tooltip": "Additional options to customize the caption generation"}),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("STRING",)
    FUNCTION = "generate"
    CATEGORY = "🧪AILab/📝JoyCaption"

    def __init__(self):
        self.predictor = None
        self.current_model = None
        self.current_context_length = None
        self.current_gpu_layers = None

    def generate(self, image, model, prompt_style, caption_length, context_length, gpu_layers, memory_management, extra_options=None):
        try:
            # Check if we need to reload the model
            if (self.predictor is None or 
                self.current_model != model or 
                self.current_context_length != context_length or 
                self.current_gpu_layers != gpu_layers):
                
                if self.predictor is not None:
                    del self.predictor
                    self.predictor = None
                    torch.cuda.empty_cache()
                
                try:
                    model_config = GGUF_MODELS[model]
                    self.predictor = JC_GGUF_Models(
                        model_name=model_config["name"],
                        model_repo=model_config["repo"],
                        n_ctx=context_length,
                        n_gpu_layers=gpu_layers,
                        verbose=False
                    )
                    self.current_model = model
                    self.current_context_length = context_length
                    self.current_gpu_layers = gpu_layers
                except Exception as e:
                    return (f"Error loading GGUF model: {e}",)
            
            prompt = build_prompt(prompt_style, caption_length, extra_options[0] if extra_options else [], extra_options[1] if extra_options else "{NAME}")
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
                torch.cuda.empty_cache()
                import gc
                gc.collect()

            return (response,)
        except Exception as e:
            if memory_management == "Clear After Run" and self.predictor is not None:
                del self.predictor
                self.predictor = None
                torch.cuda.empty_cache()
                import gc
                gc.collect()
            raise e

class JC_GGUF_adv:
    @classmethod
    def INPUT_TYPES(cls):
        model_list = list(GGUF_MODELS.keys())
        return {
            "required": {
                "image":          ("IMAGE",),
                "model":          (model_list, {"default": model_list[0], "tooltip": "Select the GGUF model to use for caption generation"}),
                "prompt_style":   (list(CAPTION_TYPE_MAP.keys()), {"default": "Descriptive", "tooltip": "Select the style of caption you want to generate"}),
                "caption_length": (CAPTION_LENGTH_CHOICES, {"default": "any", "tooltip": "Control the length of the generated caption"}),
                "max_new_tokens": ("INT",    {"default": MODEL_SETTINGS["default_max_tokens"], "min": 1,   "max": 2048, "tooltip": "Maximum number of tokens to generate. Higher values allow longer captions"}),
                "temperature":    ("FLOAT",  {"default": MODEL_SETTINGS["default_temperature"], "min": 0.0, "max": 2.0, "step": 0.05, "tooltip": "Control the randomness of the output. Higher values make the output more creative but less predictable"}),
                "top_p":          ("FLOAT",  {"default": MODEL_SETTINGS["default_top_p"], "min": 0.0, "max": 1.0, "step": 0.01, "tooltip": "Control the diversity of the output. Higher values allow more diverse word choices"}),
                "top_k":          ("INT",    {"default": MODEL_SETTINGS["default_top_k"], "min": 0,   "max": 100, "tooltip": "Limit the number of possible next tokens. Lower values make the output more focused"}),
                "context_length": ("INT",    {"default": 4096, "min": 512, "max": 32768, "tooltip": "Context window size. Higher values allow longer conversations but use more memory"}),
                "gpu_layers":     ("INT",    {"default": 35, "min": 0, "max": 100, "tooltip": "Number of layers to offload to GPU. Set to 0 for CPU-only processing"}),
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
    CATEGORY = "🧪AILab/📝JoyCaption"

    def __init__(self):
        self.predictor = None
        self.current_model = None
        self.current_context_length = None
        self.current_gpu_layers = None

    def generate(self, image, model, prompt_style, caption_length, max_new_tokens, temperature, top_p, top_k, context_length, gpu_layers, custom_prompt, memory_management, extra_options=None):
        try:
            # Check if we need to reload the model
            if (self.predictor is None or 
                self.current_model != model or 
                self.current_context_length != context_length or 
                self.current_gpu_layers != gpu_layers):
                
                if self.predictor is not None:
                    del self.predictor
                    self.predictor = None
                    torch.cuda.empty_cache()
                
                try:
                    model_config = GGUF_MODELS[model]
                    self.predictor = JC_GGUF_Models(
                        model_name=model_config["name"],
                        model_repo=model_config["repo"],
                        n_ctx=context_length,
                        n_gpu_layers=gpu_layers,
                        verbose=False
                    )
                    self.current_model = model
                    self.current_context_length = context_length
                    self.current_gpu_layers = gpu_layers
                except Exception as e:
                    return (f"Error loading GGUF model: {e}", "")
            
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
                max_tokens=max_new_tokens,
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
            if memory_management == "Clear After Run" and self.predictor is not None:
                del self.predictor
                self.predictor = None
                torch.cuda.empty_cache()
                import gc
                gc.collect()
            raise e

NODE_CLASS_MAPPINGS = {
    "JC_GGUF": JC_GGUF,
    "JC_GGUF_adv": JC_GGUF_adv,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "JC_GGUF": "JoyCaption GGUF",
    "JC_GGUF_adv": "JoyCaption GGUF (Advanced)",
}