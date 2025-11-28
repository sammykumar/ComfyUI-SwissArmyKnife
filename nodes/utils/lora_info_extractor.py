"""
LoRA Info Extractor node.

Traverses WanVideo LoRA stacks, hashes each referenced file, optionally
fetches CivitAI metadata, and emits both structured JSON plus a human-readable
summary while passing the original stack through unchanged.
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict, List, Optional, Tuple

from ..civitai_service import CivitAIService
from ..debug_utils import Logger
from ..lora_hash_cache import get_cache as get_lora_hash_cache

logger = Logger("LoRAInfoExtractor")


class LoRAInfoExtractor:
    """Enriched LoRA metadata extraction with persistent hashing and CivitAI lookup."""

    PATH_ATTRIBUTES: Tuple[str, ...] = (
        "path",
        "file",
        "file_path",
        "filepath",
        "filename",
        "model_path",
        "lora_path",
    )
    NAME_ATTRIBUTES: Tuple[str, ...] = (
        "civitai_name",
        "display_name",
        "name",
        "model_name",
        "title",
        "filename",
    )
    STACK_KEYS: Tuple[str, ...] = ("stack", "loras", "children", "items", "chain")

    def __init__(self):
        self.hash_cache = get_lora_hash_cache()

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "lora": (
                    "WANVIDLORA",
                    {
                        "tooltip": "LoRA stack from WanVideo LoRA Select (or compatible) nodes",
                    },
                ),
            },
            "optional": {
                "fallback_name": (
                    "STRING",
                    {
                        "default": "",
                        "tooltip": "Used when no LoRA metadata can be determined",
                    },
                ),
                "use_civitai_api": (
                    "BOOLEAN",
                    {
                        "default": True,
                        "tooltip": "Disable to skip remote lookups and rely on local metadata only",
                    },
                ),
                "wan_model_type": (
                    ["high", "low", "none"],
                    {
                        "default": "high",
                        "tooltip": "Specify whether this LoRA is paired with Wan 2.2 High/Low Noise models",
                    },
                ),
            },
        }

    RETURN_TYPES = ("STRING", "STRING", "WANVIDLORA")
    RETURN_NAMES = ("lora_json", "lora_info", "lora_passthrough")
    FUNCTION = "extract_lora_info"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    DESCRIPTION = (
        "Traverses the Wan LoRA stack, hashes each file, optionally queries CivitAI, emits structured metadata plus a summary, "
        "and passes the original stack through."
    )

    def extract_lora_info(
        self,
        lora: Any,
        fallback_name: str = "",
        use_civitai_api: bool = True,
        wan_model_type: str = "high",
    ):
        """Extract LoRA stack metadata and return JSON plus human readable summary."""

        debug_repr = repr(lora)
        logger.log("LoRAInfoExtractor.extract_lora_info called")
        logger.log(f"  - use_civitai_api: {use_civitai_api}")
        logger.log(f"  - fallback_name: '{fallback_name}'")
        logger.log(f"  - wan_model_type: '{wan_model_type}'")
        logger.log(f"  - lora type: {type(lora)}")
        logger.log(
            f"  - lora repr: {debug_repr[:300]}{'...' if len(debug_repr) > 300 else ''}"
        )

        try:
            civitai_service = None
            if use_civitai_api:
                # Get API key from ComfyUI settings only (no environment variable fallback)
                from ..config_api import get_setting_value

                effective_api_key = get_setting_value(
                    "swiss_army_knife.civitai.api_key"
                )

                logger.log(f"  - effective_api_key provided: {bool(effective_api_key)}")
                civitai_service = CivitAIService(api_key=effective_api_key)

            entries = self._discover_lora_entries(lora)
            if not entries:
                synthetic = self._coerce_single_lora(lora)
                if synthetic:
                    logger.log("No stack entries found, using synthetic single LoRA entry")
                    entries = [synthetic]
            logger.log(f"Discovered {len(entries)} LoRA entries in stack")

            processed_entries: List[Dict[str, Any]] = []
            info_lines: List[str] = []
            missing_files = 0
            civitai_matches = 0
            cache_hits = 0
            tags_accumulator = set()

            for index, entry in enumerate(entries):
                metadata = self._process_entry(
                    entry,
                    index,
                    civitai_service,
                    use_civitai_api,
                )

                processed_entries.append(metadata)

                if not metadata["file"]["exists"]:
                    missing_files += 1

                if metadata["civitai"]:
                    civitai_matches += 1
                    if metadata["civitai"].get("cache_hit"):
                        cache_hits += 1
                    civitai_tags = metadata["civitai"].get("tags", [])
                    if civitai_tags:
                        tags_accumulator.update(civitai_tags)

                info_lines.append(self._format_info_line(metadata))

            summary = self._build_summary(
                count=len(processed_entries),
                missing_files=missing_files,
                civitai_matches=civitai_matches,
                cache_hits=cache_hits,
                tags=sorted(tag for tag in tags_accumulator if tag),
            )

            if processed_entries:
                combined_display = " + ".join(
                    entry["display_name"] for entry in processed_entries
                )
                summary_line = self._format_summary_line(summary)
                info_block = "\n".join([summary_line] + info_lines)
                payload = {
                    "loras": processed_entries,
                    "summary": summary,
                    "combined_display": combined_display,
                    "wan_model_type": wan_model_type,
                }
                return (json.dumps(payload, indent=2), info_block, lora)

            # No entries found, return fallback response
            fallback_label = fallback_name.strip() or "No LoRAs Detected"
            empty_payload = {
                "loras": [],
                "summary": summary,
                "combined_display": fallback_label,
                "wan_model_type": wan_model_type,
                "error": "LoRA stack did not contain any LoRA dictionaries",
            }
            return (json.dumps(empty_payload, indent=2), f"Fallback: {fallback_label}", lora)

        except Exception as exc:  # pylint: disable=broad-except
            logger.error(f"Error in extract_lora_info: {exc}")
            fallback_label = fallback_name.strip() or "Error Extracting LoRA"
            error_payload = {
                "loras": [],
                "summary": {"count": 0},
                "combined_display": fallback_label,
                "wan_model_type": wan_model_type,
                "error": str(exc),
            }
            return (json.dumps(error_payload, indent=2), f"Error: {exc}", lora)

    def _discover_lora_entries(self, data: Any) -> List[Dict[str, Any]]:
        """Recursively walk WanVideo LoRA stack and collect unique LoRA dicts."""

        results: List[Dict[str, Any]] = []
        visited_ids = set()

        def visit(node: Any):
            if isinstance(node, (list, tuple, set)):
                for item in node:
                    visit(item)
                return

            if not isinstance(node, dict):
                return

            node_id = id(node)
            if node_id in visited_ids:
                return
            visited_ids.add(node_id)

            if self._looks_like_lora(node):
                results.append(node)

            for key in self.STACK_KEYS:
                if key in node and isinstance(node[key], (list, tuple)):
                    for child in node[key]:
                        visit(child)

            for value in node.values():
                if isinstance(value, (list, tuple, dict)):
                    visit(value)

        visit(data)

        deduped: List[Dict[str, Any]] = []
        seen_keys = set()
        for entry in results:
            path = self._extract_first(entry, self.PATH_ATTRIBUTES)
            name = self._extract_first(entry, self.NAME_ATTRIBUTES)
            key = (path or "", name or "")
            if key not in seen_keys:
                deduped.append(entry)
                seen_keys.add(key)

        return deduped

    def _coerce_single_lora(self, lora_input: Any) -> Optional[Dict[str, Any]]:
        if isinstance(lora_input, dict):
            return lora_input
        if isinstance(lora_input, str):
            return {"path": lora_input, "name": os.path.basename(lora_input)}
        if hasattr(lora_input, "__dict__"):
            return dict(lora_input.__dict__)
        if isinstance(lora_input, (list, tuple)) and lora_input:
            first = lora_input[0]
            if isinstance(first, dict):
                return first
            if isinstance(first, str):
                return {"path": first, "name": os.path.basename(first)}
        return None

    def _looks_like_lora(self, candidate: Dict[str, Any]) -> bool:
        if any(candidate.get(attr) for attr in self.PATH_ATTRIBUTES):
            return True
        if any(candidate.get(attr) for attr in self.NAME_ATTRIBUTES):
            return True
        if "strength" in candidate or "stack" in candidate:
            return True
        return False

    def _process_entry(
        self,
        entry: Dict[str, Any],
        index: int,
        civitai_service: Optional[CivitAIService],
        use_civitai_api: bool,
    ) -> Dict[str, Any]:
        file_path = self._extract_first(entry, self.PATH_ATTRIBUTES)
        if isinstance(file_path, str):
            file_path = file_path.strip()

        normalized_path = os.path.abspath(file_path) if file_path else None
        file_exists = bool(normalized_path and os.path.exists(normalized_path))

        strength = entry.get("strength")
        if isinstance(strength, str):
            try:
                strength = float(strength)
            except ValueError:
                strength = None

        raw_name = self._extract_first(entry, self.NAME_ATTRIBUTES)
        name_from_filename = (
            self._clean_name(os.path.basename(file_path)) if file_path else None
        )
        display_name = self._select_display_name(raw_name, name_from_filename)

        file_hashes = self.hash_cache.get_hashes(normalized_path) if file_exists else None
        legacy_hash = file_hashes.get("sha256") if file_hashes else None

        civitai_data = None
        if file_exists and use_civitai_api and civitai_service:
            civitai_data = civitai_service.get_model_info_by_hash(normalized_path)
            if civitai_data and civitai_data.get("civitai_name"):
                display_name = self._select_display_name(
                    civitai_data.get("civitai_name"), display_name
                )

        file_info = {
            "exists": file_exists,
            "path": normalized_path or file_path,
        }

        filtered_raw = {
            k: v
            for k, v in entry.items()
            if k not in ["path", "blocks", "layer_filter", "low_mem_load", "merge_loras"]
        }

        return {
            "index": index,
            "display_name": display_name,
            "hash": legacy_hash,
            "hashes": file_hashes,
            "file": file_info,
            "strength": strength,
            "original": {
                "raw": filtered_raw,
            },
            "civitai": self._filter_civitai_data(civitai_data) if civitai_data else None,
        }

    def _build_summary(
        self,
        *,
        count: int,
        missing_files: int,
        civitai_matches: int,
        cache_hits: int,
        tags: List[str],
    ) -> Dict[str, Any]:
        return {
            "count": count,
            "missing_files": missing_files,
            "civitai_matches": civitai_matches,
            "civitai_cache_hits": cache_hits,
            "local_only": max(count - civitai_matches, 0),
            "tags": tags[:25],
        }

    def _format_summary_line(self, summary: Dict[str, Any]) -> str:
        parts = [
            f"Summary: {summary['count']} LoRAs",
            f"CivitAI matches: {summary['civitai_matches']}",
        ]
        if summary["missing_files"]:
            parts.append(f"Missing: {summary['missing_files']}")
        if summary.get("civitai_cache_hits", 0) > 0:
            parts.append(f"Cache hits: {summary['civitai_cache_hits']}")
        return " • ".join(parts)

    def _format_info_line(self, metadata: Dict[str, Any]) -> str:
        segments: List[str] = []
        civitai = metadata.get("civitai") or {}

        if civitai:
            version = civitai.get("version_name")
            creator = civitai.get("creator", "Unknown")
            version_fragment = (
                f" ({version})" if version and version != metadata["display_name"] else ""
            )
            matched_hash_type = civitai.get("matched_hash_type", "unknown")
            segments.append(f"CivitAI{version_fragment} by {creator} [{matched_hash_type}]")
        else:
            segments.append("Local metadata")

        if metadata.get("hash"):
            segments.append(f"SHA256 {metadata['hash'][:10]}…")

        hashes = metadata.get("hashes", {})
        if hashes:
            hash_count = sum(1 for v in hashes.values() if v is not None)
            segments.append(f"{hash_count} hash types")

        file_info = metadata["file"]
        if not file_info["exists"]:
            segments.append("missing file")

        joined_segments = " | ".join(segments)
        return (
            f"• {metadata['display_name']} — {joined_segments}"
            if joined_segments
            else f"• {metadata['display_name']}"
        )

    def _filter_civitai_data(self, civitai_data: Dict[str, Any]) -> Dict[str, Any]:
        """Filter CivitAI data to keep only essential fields."""
        if not civitai_data:
            return None

        filtered: Dict[str, Any] = {}
        keep_fields = [
            "civitai_name",
            "version_name",
            "civitai_url",
            "model_id",
            "version_id",
            "fetched_at",
            "creator",
            "tags",
        ]
        for field in keep_fields:
            if field in civitai_data:
                filtered[field] = civitai_data[field]

        api_response = civitai_data.get("api_response", {})
        if "air" in api_response:
            filtered["air"] = api_response["air"]

        if "all_hashes" in civitai_data:
            filtered["hashes"] = civitai_data["all_hashes"]

        for key in ("matched_hash_type", "matched_hash_value", "cache_hit"):
            if key in civitai_data:
                filtered[key] = civitai_data[key]

        return filtered

    def _extract_first(self, source: Dict[str, Any], keys: Tuple[str, ...]) -> Optional[str]:
        for key in keys:
            value = source.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
        return None

    def _select_display_name(self, *names: Optional[str]) -> str:
        for name in names:
            cleaned = self._clean_name(name)
            if cleaned != "Unknown LoRA":
                return cleaned
        return "Unknown LoRA"

    def _clean_name(self, name: Optional[str]) -> str:
        if not name:
            return "Unknown LoRA"
        cleaned = (
            str(name)
            .replace(".safetensors", "")
            .replace(".ckpt", "")
            .replace(".pt", "")
        )
        cleaned = cleaned.replace("_", " ").strip()
        cleaned = " ".join(word.capitalize() for word in cleaned.split())
        return cleaned or "Unknown LoRA"


NODE_CLASS_MAPPINGS = {
    "LoRAInfoExtractor": LoRAInfoExtractor,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "LoRAInfoExtractor": "LoRA Info Extractor",
}
