"""
CivitAI Metadata Helper Node - Collects and formats metadata for CivitAI submissions
"""

import json
from typing import Dict, Any


class CivitMetadataHelper:
    """
    A helper node that collects common generation parameters used for CivitAI model submissions.
    This node aggregates sampling parameters and prompts into a structured format.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Define input fields for common CivitAI metadata parameters.
        """
        return {
            "required": {
                "steps": ("INT", {
                    "default": 20,
                    "min": 1,
                    "max": 200,
                    "step": 1,
                    "tooltip": "Number of sampling steps"
                }),
                "cfg": ("FLOAT", {
                    "default": 7.0,
                    "min": 0.0,
                    "max": 30.0,
                    "step": 0.1,
                    "tooltip": "CFG Scale (Classifier Free Guidance)"
                }),
                "seed": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 0xffffffffffffffff,
                    "tooltip": "Random seed for generation",
                    "control_after_generate": False
                }),
                "high_sampler": ("STRING", {
                    "default": "euler",
                    "tooltip": "High resolution sampler name"
                }),
                "low_sampler": ("STRING", {
                    "default": "euler",
                    "tooltip": "Low resolution sampler name"
                }),
                "lora_high": ("STRING", {
                    "default": "",
                    "tooltip": "High resolution LoRA model name"
                }),
                "lora_low": ("STRING", {
                    "default": "",
                    "tooltip": "Low resolution LoRA model name"
                }),
                "positive_prompt": ("STRING", {
                    "default": "",
                    "multiline": True,
                    "tooltip": "Positive prompt text"
                }),
                "negative_prompt": ("STRING", {
                    "default": "",
                    "multiline": True,
                    "tooltip": "Negative prompt text"
                })
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING")
   RETURN_NAMES = ("formatted_metadata", "json_metadata", "summary")
   FUNCTION = "collect_metadata"
   CATEGORY = "Swiss Army Knife 🔪/Utils"
   OUTPUT_NODE = True  # Makes this an output node that displays in the UI
    DESCRIPTION = (
        "Collects steps/CFG/seeds, sampler names, LoRA identifiers, and prompts, then emits formatted text plus JSON summaries "
        "that match CivitAI’s metadata expectations."
    )

    def collect_metadata(self, steps, cfg, seed, high_sampler, low_sampler, lora_high, lora_low, positive_prompt, negative_prompt):
        """
        Collect and format metadata for CivitAI submissions.
        
        Args:
            steps: Number of sampling steps
            cfg: CFG scale value
            seed: Random seed for generation
            high_sampler: High resolution sampler name
            low_sampler: Low resolution sampler name  
            lora_high: High resolution LoRA model name
            lora_low: Low resolution LoRA model name
            positive_prompt: Positive prompt text
            negative_prompt: Negative prompt text
            
        Returns:
            Tuple of (formatted_metadata, json_metadata, summary)
        """
        
        # Create structured metadata
        metadata = {
            "generation_parameters": {
                "steps": steps,
                "cfg_scale": cfg,
                "seed": seed,
                "samplers": {
                    "high_res": high_sampler,
                    "low_res": low_sampler
                },
                "loras": {
                    "high_res": lora_high.strip(),
                    "low_res": lora_low.strip()
                }
            },
            "prompts": {
                "positive": positive_prompt.strip(),
                "negative": negative_prompt.strip()
            },
            "prompt_lengths": {
                "positive_chars": len(positive_prompt.strip()),
                "negative_chars": len(negative_prompt.strip())
            }
        }
        
        # Create formatted text version for display
        formatted_metadata = self._format_for_display(metadata)
        
        # Create JSON version for data processing
        json_metadata = json.dumps(metadata, indent=2)
        
        # Create summary for quick reference
        lora_info = ""
        if lora_high.strip() or lora_low.strip():
            lora_info = f" | LoRAs: {lora_high.strip() or '(none)'}/{lora_low.strip() or '(none)'}"
        
        summary = (
            f"Steps: {steps} | CFG: {cfg} | Seed: {seed} | "
            f"Samplers: {high_sampler}/{low_sampler}{lora_info} | "
            f"Pos: {len(positive_prompt.strip())} chars | "
            f"Neg: {len(negative_prompt.strip())} chars"
        )
        
        # Log summary to console
        print("\n" + "="*60)
        print("CIVITAI METADATA HELPER - Generation Parameters")
        print("="*60)
        print(f"📊 Steps: {steps}")
        print(f"📊 CFG Scale: {cfg}")
        print(f"📊 Seed: {seed}")
        print(f"📊 High Sampler: {high_sampler}")
        print(f"📊 Low Sampler: {low_sampler}")
        print(f"📊 High LoRA: {lora_high.strip() or '(none)'}")
        print(f"📊 Low LoRA: {lora_low.strip() or '(none)'}")
        print(f"📊 Positive Prompt ({len(positive_prompt.strip())} chars):")
        if positive_prompt.strip():
            print(f"   {positive_prompt.strip()[:200]}...")
        else:
            print("   (empty)")
        print(f"📊 Negative Prompt ({len(negative_prompt.strip())} chars):")
        if negative_prompt.strip():
            print(f"   {negative_prompt.strip()[:200]}...")
        else:
            print("   (empty)")
        print("="*60 + "\n")
        
        return (formatted_metadata, json_metadata, summary)
    
    def _format_for_display(self, metadata: Dict[str, Any]) -> str:
        """
        Format metadata for human-readable display.
        
        Args:
            metadata: Structured metadata dictionary
            
        Returns:
            Formatted string for display
        """
        lines = []
        
        # Header
        lines.append("=" * 50)
        lines.append("🎯 CIVITAI METADATA HELPER")
        lines.append("=" * 50)
        
        # Generation Parameters
        lines.append("\n📊 GENERATION PARAMETERS")
        lines.append("-" * 30)
        gen_params = metadata["generation_parameters"]
        lines.append(f"Steps: {gen_params['steps']}")
        lines.append(f"CFG Scale: {gen_params['cfg_scale']}")
        lines.append(f"Seed: {gen_params['seed']}")
        lines.append(f"High Sampler: {gen_params['samplers']['high_res']}")
        lines.append(f"Low Sampler: {gen_params['samplers']['low_res']}")
        lines.append(f"High LoRA: {gen_params['loras']['high_res'] or '(none)'}")
        lines.append(f"Low LoRA: {gen_params['loras']['low_res'] or '(none)'}")
        
        # Prompts
        lines.append("\n📝 PROMPTS")
        lines.append("-" * 30)
        prompts = metadata["prompts"]
        prompt_lengths = metadata["prompt_lengths"]
        
        lines.append(f"Positive ({prompt_lengths['positive_chars']} chars):")
        if prompts["positive"]:
            # Split long prompts into multiple lines
            pos_lines = self._wrap_text(prompts["positive"], 60)
            for line in pos_lines:
                lines.append(f"  {line}")
        else:
            lines.append("  (empty)")
            
        lines.append(f"\nNegative ({prompt_lengths['negative_chars']} chars):")
        if prompts["negative"]:
            # Split long prompts into multiple lines
            neg_lines = self._wrap_text(prompts["negative"], 60)
            for line in neg_lines:
                lines.append(f"  {line}")
        else:
            lines.append("  (empty)")
        
        lines.append("\n" + "=" * 50)
        
        return "\n".join(lines)
    
    def _wrap_text(self, text: str, width: int) -> list:
        """
        Wrap text to specified width while preserving words.
        
        Args:
            text: Text to wrap
            width: Maximum line width
            
        Returns:
            List of wrapped lines
        """
        words = text.split()
        lines = []
        current_line = []
        current_length = 0
        
        for word in words:
            if current_length + len(word) + 1 <= width:
                current_line.append(word)
                current_length += len(word) + 1
            else:
                if current_line:
                    lines.append(" ".join(current_line))
                current_line = [word]
                current_length = len(word)
        
        if current_line:
            lines.append(" ".join(current_line))
            
        return lines


# Export node class mapping
CIVIT_METADATA_HELPER_NODE_CLASS_MAPPINGS = {
    "CivitMetadataHelper": CivitMetadataHelper
}

# Export display name mapping
CIVIT_METADATA_HELPER_NODE_DISPLAY_NAME_MAPPINGS = {
    "CivitMetadataHelper": "🏷️ CivitAI Metadata Helper"
}
