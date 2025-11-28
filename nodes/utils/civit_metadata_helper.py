from __future__ import annotations

import json
import textwrap
from typing import Any, Dict, List, Tuple

from ..debug_utils import Logger

logger = Logger("CivitMetadataHelper")


class CivitMetadataHelper:
    """
    Collects generation parameters (steps, CFG, samplers, LoRAs, prompts) into
    both human-readable and structured outputs for CivitAI submissions.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "steps": (
                    "INT",
                    {
                        "default": 20,
                        "min": 1,
                        "max": 200,
                        "step": 1,
                        "tooltip": "Number of sampling steps",
                    },
                ),
                "cfg": (
                    "FLOAT",
                    {
                        "default": 7.0,
                        "min": 0.0,
                        "max": 30.0,
                        "step": 0.1,
                        "tooltip": "CFG Scale (Classifier Free Guidance)",
                    },
                ),
                "seed": (
                    "INT",
                    {
                        "default": 0,
                        "min": 0,
                        "max": 0xFFFFFFFFFFFFFFFF,
                        "tooltip": "Random seed for generation",
                        "control_after_generate": False,
                    },
                ),
                "high_sampler": (
                    "STRING",
                    {
                        "default": "euler",
                        "tooltip": "High resolution sampler name",
                    },
                ),
                "low_sampler": (
                    "STRING",
                    {
                        "default": "euler",
                        "tooltip": "Low resolution sampler name",
                    },
                ),
                "lora_high": (
                    "STRING",
                    {
                        "default": "",
                        "tooltip": "High resolution LoRA model name",
                    },
                ),
                "lora_low": (
                    "STRING",
                    {
                        "default": "",
                        "tooltip": "Low resolution LoRA model name",
                    },
                ),
                "positive_prompt": (
                    "STRING",
                    {
                        "default": "",
                        "multiline": True,
                        "tooltip": "Positive prompt text",
                    },
                ),
                "negative_prompt": (
                    "STRING",
                    {
                        "default": "",
                        "multiline": True,
                        "tooltip": "Negative prompt text",
                    },
                ),
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING")
    RETURN_NAMES = ("formatted_metadata", "json_metadata", "summary")
    FUNCTION = "collect_metadata"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    OUTPUT_NODE = True
    DESCRIPTION = (
        "Collects steps/CFG/seeds, sampler names, LoRA identifiers, and prompts, then emits formatted text plus JSON summaries "
        "that match CivitAI’s metadata expectations."
    )

    def collect_metadata(
        self,
        steps: int,
        cfg: float,
        seed: int,
        high_sampler: str,
        low_sampler: str,
        lora_high: str,
        lora_low: str,
        positive_prompt: str,
        negative_prompt: str,
    ) -> Tuple[str, str, str]:
        # Normalize all free-form text inputs in case upstream nodes send dicts or numbers
        high_sampler_clean = self._normalize_text(high_sampler)
        low_sampler_clean = self._normalize_text(low_sampler)
        lora_high_clean = self._normalize_text(lora_high)
        lora_low_clean = self._normalize_text(lora_low)
        positive_clean = self._normalize_text(positive_prompt)
        negative_clean = self._normalize_text(negative_prompt)

        metadata = self._build_metadata_dict(
            steps,
            cfg,
            seed,
            high_sampler_clean,
            low_sampler_clean,
            lora_high_clean,
            lora_low_clean,
            positive_clean,
            negative_clean,
        )

        formatted_metadata = self._format_for_display(metadata)
        json_metadata = json.dumps(metadata, indent=2)
        summary = self._build_summary(metadata)

        self._log_summary(metadata)

        return (formatted_metadata, json_metadata, summary)

    def _build_metadata_dict(
        self,
        steps: int,
        cfg: float,
        seed: int,
        high_sampler: str,
        low_sampler: str,
        lora_high: str,
        lora_low: str,
        positive_prompt: str,
        negative_prompt: str,
    ) -> Dict[str, Any]:
        positive = positive_prompt.strip()
        negative = negative_prompt.strip()

        return {
            "generation_parameters": {
                "steps": steps,
                "cfg_scale": cfg,
                "seed": seed,
                "samplers": {
                    "high_res": high_sampler.strip(),
                    "low_res": low_sampler.strip(),
                },
                "loras": {
                    "high_res": lora_high.strip(),
                    "low_res": lora_low.strip(),
                },
            },
            "prompts": {"positive": positive, "negative": negative},
            "prompt_lengths": {
                "positive_chars": len(positive),
                "negative_chars": len(negative),
            },
        }

    def _build_summary(self, metadata: Dict[str, Any]) -> str:
        params = metadata["generation_parameters"]
        prompt_lengths = metadata["prompt_lengths"]
        lora_high = params["loras"]["high_res"] or "(none)"
        lora_low = params["loras"]["low_res"] or "(none)"
        lora_fragment = ""
        if params["loras"]["high_res"] or params["loras"]["low_res"]:
            lora_fragment = f" | LoRAs: {lora_high}/{lora_low}"

        return (
            f"Steps: {params['steps']} | CFG: {params['cfg_scale']} | Seed: {params['seed']} | "
            f"Samplers: {params['samplers']['high_res']}/{params['samplers']['low_res']}"
            f"{lora_fragment} | Pos: {prompt_lengths['positive_chars']} chars | "
            f"Neg: {prompt_lengths['negative_chars']} chars"
        )

    def _log_summary(self, metadata: Dict[str, Any]) -> None:
        params = metadata["generation_parameters"]
        prompts = metadata["prompts"]
        lengths = metadata["prompt_lengths"]

        lines = [
            "",
            "=" * 60,
            "CIVITAI METADATA HELPER - Generation Parameters",
            "=" * 60,
            f"Steps: {params['steps']}",
            f"CFG Scale: {params['cfg_scale']}",
            f"Seed: {params['seed']}",
            f"High Sampler: {params['samplers']['high_res']}",
            f"Low Sampler: {params['samplers']['low_res']}",
            f"High LoRA: {params['loras']['high_res'] or '(none)'}",
            f"Low LoRA: {params['loras']['low_res'] or '(none)'}",
            f"Positive Prompt ({lengths['positive_chars']} chars):",
            self._preview_prompt(prompts['positive']),
            f"Negative Prompt ({lengths['negative_chars']} chars):",
            self._preview_prompt(prompts['negative']),
            "=" * 60,
            "",
        ]

        for line in lines:
            logger.log(line)

    def _preview_prompt(self, prompt: str) -> str:
        return f"   {prompt[:200]}..." if prompt else "   (empty)"

    def _format_for_display(self, metadata: Dict[str, Any]) -> str:
        params = metadata["generation_parameters"]
        prompts = metadata["prompts"]
        lengths = metadata["prompt_lengths"]

        lines: List[str] = [
            "=" * 50,
            "🎯 CIVITAI METADATA HELPER",
            "=" * 50,
            "",
            "📊 GENERATION PARAMETERS",
            "-" * 30,
            f"Steps: {params['steps']}",
            f"CFG Scale: {params['cfg_scale']}",
            f"Seed: {params['seed']}",
            f"High Sampler: {params['samplers']['high_res']}",
            f"Low Sampler: {params['samplers']['low_res']}",
            f"High LoRA: {params['loras']['high_res'] or '(none)'}",
            f"Low LoRA: {params['loras']['low_res'] or '(none)'}",
            "",
            "📝 PROMPTS",
            "-" * 30,
            f"Positive ({lengths['positive_chars']} chars):",
        ]

        lines.extend(self._wrap_prompt(prompts["positive"]))
        lines.append("")
        lines.append(f"Negative ({lengths['negative_chars']} chars):")
        lines.extend(self._wrap_prompt(prompts["negative"]))
        lines.append("")
        lines.append("=" * 50)

        return "\n".join(lines)

    def _wrap_prompt(self, prompt: str) -> List[str]:
        if not prompt:
            return ["  (empty)"]
        wrapped = textwrap.wrap(prompt, width=60)
        return [f"  {line}" for line in wrapped]

    def _normalize_text(self, value: Any) -> str:
        """
        Ensure node inputs are coerced into strings before trimming so upstream nodes
        can safely pass numeric values or dictionaries (e.g., via JSON widgets).
        """
        if value is None:
            return ""
        if isinstance(value, str):
            return value.strip()
        if isinstance(value, (int, float, bool)):
            return str(value).strip()
        if isinstance(value, (dict, list)):
            try:
                return json.dumps(value, ensure_ascii=False)
            except TypeError:
                return str(value).strip()
        return str(value).strip()


CIVIT_METADATA_HELPER_NODE_CLASS_MAPPINGS = {
    "CivitMetadataHelper": CivitMetadataHelper
}

CIVIT_METADATA_HELPER_NODE_DISPLAY_NAME_MAPPINGS = {
    "CivitMetadataHelper": "🏷️ CivitAI Metadata Helper"
}
