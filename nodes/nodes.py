import os
import subprocess
import json

from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from .civitai_service import CivitAIService
from .lora_hash_cache import get_cache as get_lora_hash_cache
from .media_describe import GeminiUtilOptions, MediaDescribe
from .utils.video_preview import VideoPreview
from .vue_example_node import VueExampleNode



class FilenameGenerator:
    """
    A ComfyUI custom node that generates structured filenames based on workflow parameters.
    Creates filenames with optional date subdirectory and all parameter values included.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "scheduler": ("STRING", {
                    "forceInput": True,
                    "tooltip": "Scheduler input from WanVideo Scheduler Selector or other scheduler nodes"
                }),
                "shift": ("FLOAT", {
                    "default": 12.0,
                    "min": 0.0,
                    "max": 100.0,
                    "step": 0.01,
                    "tooltip": "Shift value"
                }),
                "total_steps": ("INT", {
                    "default": 40,
                    "min": 1,
                    "max": 10000,
                    "tooltip": "Total number of steps"
                }),
                "shift_step": ("INT", {
                    "default": 25,
                    "min": 1,
                    "max": 10000,
                    "tooltip": "Shift step value"
                }),
                "high_cfg": ("FLOAT", {
                    "default": 3.0,
                    "min": 0.0,
                    "max": 30.0,
                    "step": 0.01,
                    "tooltip": "High CFG value"
                }),
                "low_cfg": ("FLOAT", {
                    "default": 4.0,
                    "min": 0.0,
                    "max": 30.0,
                    "step": 0.01,
                    "tooltip": "Low CFG value"
                }),
                "base_filename": ("STRING", {
                    "default": "base",
                    "tooltip": "Base filename (without extension)"
                }),
                "subdirectory_prefix": ("STRING", {
                    "default": "",
                    "tooltip": "Optional subdirectory prefix (e.g., 'project_name'). Will be added before date subdirectory."
                }),
                "add_date_subdirectory": ("BOOLEAN", {
                    "default": True,
                    "tooltip": "Add date subdirectory (YYYY-MM-DD format)"
                }),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("filename",)
    FUNCTION = "generate_filename"
    CATEGORY = "Swiss Army Knife 🔪"

    def generate_filename(self, scheduler, shift, total_steps, shift_step, high_cfg, low_cfg, base_filename, subdirectory_prefix, add_date_subdirectory):
        """
        Generate a structured filename based on the provided parameters.        
        Args:
            scheduler: Scheduler string from scheduler node
            shift: Shift value
            total_steps: Total number of steps
            shift_step: Shift step value
            high_cfg: High CFG value
            low_cfg: Low CFG value
            base_filename: Base filename
            subdirectory_prefix: Optional subdirectory prefix
            add_date_subdirectory: Whether to add date subdirectory
        Returns:
            Generated filename string
        """
        try:
            # Format float values to replace decimal points with underscores
            shift_str = f"{shift:.2f}".replace(".", "_")
            high_cfg_str = f"{high_cfg:.2f}".replace(".", "_")
            low_cfg_str = f"{low_cfg:.2f}".replace(".", "_")

            # Clean scheduler string to ensure it's filename-safe
            scheduler_clean = str(scheduler).strip().replace(" ", "_").lower()

            # Clean base filename to ensure it's filename-safe
            base_clean = base_filename.strip().replace(" ", "_")

            # Generate the filename components
            filename_parts = [
                base_clean,
                "scheduler", scheduler_clean,
                "shift", shift_str,
                "total_steps", str(total_steps),
                "shift_step", str(shift_step),
                "highCFG", high_cfg_str,
                "lowCFG", low_cfg_str
            ]

            # Join all parts with underscores
            filename = "_".join(filename_parts)

            # Build directory structure with optional subdirectory prefix and date
            directory_parts = []

            # Add subdirectory prefix if provided
            if subdirectory_prefix and subdirectory_prefix.strip():
                prefix_clean = subdirectory_prefix.strip().replace(" ", "_")
                directory_parts.append(prefix_clean)

            # Add date subdirectory if requested
            if add_date_subdirectory:
                current_date = datetime.now().strftime("%Y-%m-%d")
                directory_parts.append(current_date)

            # Combine directory parts with filename
            if directory_parts:
                full_path = "/".join(directory_parts) + "/" + filename
            else:
                full_path = filename

            return (full_path,)

        except Exception as e:
            raise Exception(f"Filename generation failed: {str(e)}")


class LoRAInfoExtractor:
    """Enriched LoRA metadata extraction with persistent hashing and CivitAI lookup."""

    PATH_ATTRIBUTES = ("path", "file", "file_path", "filepath", "filename", "model_path", "lora_path")
    NAME_ATTRIBUTES = ("civitai_name", "display_name", "name", "model_name", "title", "filename")
    STACK_KEYS = ("stack", "loras", "children", "items", "chain")

    def __init__(self):
        self.civitai_service = CivitAIService()
        self.hash_cache = get_lora_hash_cache()

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "lora": ("WANVIDLORA", {
                    "tooltip": "LoRA stack from WanVideo Lora Select or compatible nodes"
                }),
            },
            "optional": {
                "civitai_api_key": ("STRING", {
                    "multiline": False,
                    "default": os.environ.get("CIVITAI_API_KEY") or os.environ.get("CIVIT_API_KEY", "YOUR_CIVITAI_API_KEY_HERE"),
                    "tooltip": "Override CivitAI API key (falls back to CIVITAI_API_KEY/CIVIT_API_KEY env vars)"
                }),
                "fallback_name": ("STRING", {
                    "default": "",
                    "tooltip": "Used when no LoRA metadata can be determined"
                }),
                "use_civitai_api": ("BOOLEAN", {
                    "default": True,
                    "tooltip": "Disable to skip remote lookups and rely on local metadata only"
                }),
                "wan_model_type": (["high", "low", "none"], {
                    "default": "high",
                    "tooltip": "Specify whether this LoRA is used with Wan 2.2 High Noise, Low Noise model, or none/other"
                }),
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "WANVIDLORA")
    RETURN_NAMES = ("lora_json", "lora_info", "lora_passthrough")
    FUNCTION = "extract_lora_info"
    CATEGORY = "Swiss Army Knife 🔪"

    def extract_lora_info(self, lora: Any, civitai_api_key: str = "", fallback_name: str = "", use_civitai_api: bool = True, wan_model_type: str = "high"):
        """Extract LoRA stack metadata and return JSON plus human readable summary."""

        debug_repr = repr(lora)
        print("[DEBUG] LoRAInfoExtractor.extract_lora_info called")
        print(f"  - use_civitai_api: {use_civitai_api}")
        print(f"  - civitai_api_key provided: {bool(civitai_api_key and civitai_api_key != 'YOUR_CIVITAI_API_KEY_HERE')}")
        print(f"  - fallback_name: '{fallback_name}'")
        print(f"  - wan_model_type: '{wan_model_type}'")
        print(f"  - lora type: {type(lora)}")
        print(f"  - lora repr: {debug_repr[:300]}{'...' if len(debug_repr) > 300 else ''}")

        try:
            civitai_service = None
            if use_civitai_api:
                effective_api_key = civitai_api_key if civitai_api_key and civitai_api_key != "YOUR_CIVITAI_API_KEY_HERE" else None
                civitai_service = CivitAIService(api_key=effective_api_key)

            entries = self._discover_lora_entries(lora)
            if not entries:
                synthetic = self._coerce_single_lora(lora)
                if synthetic:
                    print("[DEBUG] No stack entries found, using synthetic single LoRA entry")
                    entries = [synthetic]
            print(f"[DEBUG] Discovered {len(entries)} LoRA entries in stack")

            processed_entries = []
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
                    # Extract tags from the filtered civitai data or fall back to empty list
                    civitai_tags = metadata["civitai"].get("tags", [])
                    if civitai_tags:
                        tags_accumulator.update(civitai_tags)

                info_lines.append(self._format_info_line(metadata))

            summary = self._build_summary(
                count=len(processed_entries),
                missing_files=missing_files,
                civitai_matches=civitai_matches,
                cache_hits=cache_hits,
                tags=sorted(tag for tag in tags_accumulator if tag)
            )

            if processed_entries:
                combined_display = " + ".join(entry["display_name"] for entry in processed_entries)
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
            print(f"[DEBUG] Error in extract_lora_info: {exc}")
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
            # Attempt to treat first element as meaningful metadata
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

    def _process_entry(self, entry: Dict[str, Any], index: int, civitai_service: Optional[CivitAIService], use_civitai_api: bool) -> Dict[str, Any]:
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
        name_from_filename = self._clean_name(os.path.basename(file_path)) if file_path else None
        display_name = self._select_display_name(raw_name, name_from_filename)

        # Get all hash types
        file_hashes = self.hash_cache.get_hashes(normalized_path) if file_exists else None
        legacy_hash = file_hashes.get('sha256') if file_hashes else None  # For backward compatibility

        civitai_data = None
        if file_exists and use_civitai_api and civitai_service:
            civitai_data = civitai_service.get_model_info_by_hash(normalized_path)
            if civitai_data and civitai_data.get("civitai_name"):
                display_name = self._select_display_name(civitai_data.get("civitai_name"), display_name)

        file_info = {
            "exists": file_exists,
            "path": normalized_path or file_path,
        }

        # Filter raw entry to remove unwanted fields
        filtered_raw = {k: v for k, v in entry.items() if k not in ['path', 'blocks', 'layer_filter', 'low_mem_load', 'merge_loras']}

        return {
            "index": index,
            "display_name": display_name,
            "hash": legacy_hash,  # Keep for backward compatibility
            "hashes": file_hashes,  # All computed hash types
            "file": file_info,
            "strength": strength,
            "original": {
                "raw": filtered_raw,
            },
            "civitai": self._filter_civitai_data(civitai_data) if civitai_data else None,
        }

    def _build_summary(self, *, count: int, missing_files: int, civitai_matches: int, cache_hits: int, tags: List[str]) -> Dict[str, Any]:
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
            version_fragment = f" ({version})" if version and version != metadata["display_name"] else ""

            # Show which hash type was used for the match
            matched_hash_type = civitai.get("matched_hash_type", "unknown")
            segments.append(f"CivitAI{version_fragment} by {creator} [{matched_hash_type}]")
        else:
            segments.append("Local metadata")

        # Show primary hash for backward compatibility
        if metadata.get("hash"):
            segments.append(f"SHA256 {metadata['hash'][:10]}…")

        # Show count of available hash types
        hashes = metadata.get("hashes", {})
        if hashes:
            hash_count = sum(1 for v in hashes.values() if v is not None)
            segments.append(f"{hash_count} hash types")

        file_info = metadata["file"]
        if not file_info["exists"]:
            segments.append("missing file")

        joined_segments = " | ".join(segments)
        return f"• {metadata['display_name']} — {joined_segments}" if joined_segments else f"• {metadata['display_name']}"

    def _filter_civitai_data(self, civitai_data: Dict[str, Any]) -> Dict[str, Any]:
        """Filter CivitAI data to keep only essential fields."""
        if not civitai_data:
            return None

        # Keep only specified fields
        filtered = {}

        # Required fields from the original response
        keep_fields = ['civitai_name', 'version_name', 'civitai_url', 'model_id', 'version_id', 'fetched_at']
        for field in keep_fields:
            if field in civitai_data:
                filtered[field] = civitai_data[field]

        # Special handling for air - check if it exists in api_response
        api_response = civitai_data.get('api_response', {})
        if 'air' in api_response:
            filtered['air'] = api_response['air']

        # Include hash information
        if 'all_hashes' in civitai_data:
            filtered['hashes'] = civitai_data['all_hashes']

        # Include matched hash info and cache status
        if 'matched_hash_type' in civitai_data:
            filtered['matched_hash_type'] = civitai_data['matched_hash_type']
        if 'matched_hash_value' in civitai_data:
            filtered['matched_hash_value'] = civitai_data['matched_hash_value']
        if 'cache_hit' in civitai_data:
            filtered['cache_hit'] = civitai_data['cache_hit']

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

    def _human_readable_size(self, size_bytes: int) -> str:
        if size_bytes <= 0:
            return "0 B"
        units = ["B", "KB", "MB", "GB", "TB"]
        size = float(size_bytes)
        for unit in units:
            if size < 1024 or unit == units[-1]:
                return f"{size:.2f} {unit}"
            size /= 1024
        return f"{size_bytes} B"

    def _clean_name(self, name: Optional[str]) -> str:
        if not name:
            return "Unknown LoRA"
        cleaned = str(name).replace('.safetensors', '').replace('.ckpt', '').replace('.pt', '')
        cleaned = cleaned.replace('_', ' ').strip()
        cleaned = ' '.join(word.capitalize() for word in cleaned.split())
        return cleaned or "Unknown LoRA"


class VideoMetadataNode:
    """
    A ComfyUI custom node for adding metadata to video files.
    Takes a filename input (typically from VHS_VideoCombine) and adds custom metadata
    using FFmpeg. Supports common metadata fields like title, description, artist, and keywords.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(s):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "filenames": ("VHS_FILENAMES", {
                    "forceInput": True,
                    "tooltip": "Video filenames from VHS_VideoCombine (VHS_FILENAMES type)"
                }),
            },
            "optional": {
                "comment": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "tooltip": "Additional comments metadata"
                }),
                "lora_json": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "LoRA JSON data from LoRAInfoExtractor (contains structured LoRA metadata)"
                }),
                "overwrite_original": (["Yes", "No"], {
                    "default": "No",
                    "tooltip": "Whether to overwrite the original file or create a new one with '_metadata' suffix"
                }),
            }
        }

    RETURN_TYPES = ("VHS_FILENAMES",)
    RETURN_NAMES = ("Filenames",)
    FUNCTION = "add_metadata"
    CATEGORY = "Swiss Army Knife 🔪"

    def add_metadata(self, filenames, artist="", comment="", lora_json="", overwrite_original="No"):
        """
        Update metadata in a video file using FFmpeg, appending to existing metadata.

        Args:
            filenames: Input video filenames from VHS_VideoCombine (will process first file)
            artist: Artist/Creator name (appends to existing artist info)
            comment: Additional comments (appends to existing comments)
            lora_json: JSON string containing LoRA metadata from LoRAInfoExtractor
            overwrite_original: Whether to overwrite original file

        Returns:
            Output filenames (original or new file with updated metadata)
        """
        try:
            # Extract filename from filenames input (VHS_VideoCombine may output multiple files or special format)
            # Handle both single filename string and potential list/array formats
            if isinstance(filenames, list) and len(filenames) > 0:
                filename = filenames[0]  # Use first file if multiple
            elif isinstance(filenames, str):
                filename = filenames  # Direct string filename
            else:
                raise Exception(f"Invalid filenames input: {filenames}")

            # Validate input file exists
            if not os.path.exists(filename):
                raise Exception(f"Input video file not found: {filename}")

            # Read existing metadata first
            existing_metadata = self._get_existing_metadata(filename)

            # Determine output filename
            if overwrite_original == "Yes":
                output_filename = filename
                temp_filename = filename + ".tmp"
            else:
                # Create new filename with _metadata suffix
                name, ext = os.path.splitext(filename)
                output_filename = f"{name}_metadata{ext}"
                temp_filename = output_filename

            # Build FFmpeg command with metadata
            cmd = [
                'ffmpeg',
                '-i', filename,
                '-c', 'copy',  # Copy streams without re-encoding
                '-y'  # Overwrite output file if it exists
            ]

            # Add basic metadata options if provided (append to existing)
            if artist.strip():
                existing_artist = existing_metadata.get('artist', '')
                combined_artist = self._combine_metadata_field(existing_artist, artist.strip())
                cmd.extend(['-metadata', f'artist={combined_artist}'])

            if comment.strip():
                existing_comment = existing_metadata.get('comment', '')
                combined_comment = self._combine_metadata_field(existing_comment, comment.strip())
                cmd.extend(['-metadata', f'comment={combined_comment}'])

            # Process LoRA JSON metadata (append to existing)
            if lora_json.strip():
                try:
                    import json
                    lora_data = json.loads(lora_json)

                    # Extract title from combined_display for video title (append to existing)
                    if 'combined_display' in lora_data and lora_data['combined_display']:
                        existing_title = existing_metadata.get('title', '')
                        combined_title = self._combine_metadata_field(existing_title, lora_data['combined_display'])
                        cmd.extend(['-metadata', f'title={combined_title}'])

                    # Create description from LoRA info (append to existing)
                    if 'loras' in lora_data and lora_data['loras']:
                        descriptions = []
                        keywords = []

                        for lora in lora_data['loras']:
                            if 'info' in lora and lora['info']:
                                descriptions.append(lora['info'])
                            if 'name' in lora and lora['name']:
                                keywords.append(lora['name'])

                        if descriptions:
                            description_text = '\n'.join([f'• {desc}' for desc in descriptions])
                            lora_description = f'LoRA Information:\n{description_text}'
                            existing_description = existing_metadata.get('description', '')
                            combined_description = self._combine_metadata_field(existing_description, lora_description)
                            cmd.extend(['-metadata', f'description={combined_description}'])

                        if keywords:
                            lora_keywords = ', '.join(keywords)
                            existing_keywords = existing_metadata.get('keywords', '')
                            # For keywords, use comma separation
                            if existing_keywords.strip():
                                combined_keywords = f'{existing_keywords.strip()}, LoRA: {lora_keywords}'
                            else:
                                combined_keywords = f'LoRA: {lora_keywords}'
                            cmd.extend(['-metadata', f'keywords={combined_keywords}'])

                    # Add raw LoRA JSON as custom metadata for advanced use
                    cmd.extend(['-metadata', f'lora_json={lora_json.strip()}'])

                except json.JSONDecodeError:
                    # If JSON parsing fails, treat as simple string
                    cmd.extend(['-metadata', f'lora={lora_json.strip()}'])
                except Exception as e:
                    print(f"Warning: Could not process LoRA JSON: {e}")
                    cmd.extend(['-metadata', f'lora={lora_json.strip()}'])

            # Add output filename
            cmd.append(temp_filename)

            # Execute FFmpeg command
            subprocess.run(cmd, capture_output=True, text=True, check=True)

            # If we're overwriting the original, move temp file to original location
            if overwrite_original == "Yes":
                os.replace(temp_filename, output_filename)

            print(f"Successfully updated metadata in video: {output_filename}")
            return (output_filename,)

        except subprocess.CalledProcessError as e:
            raise Exception(f"FFmpeg metadata operation failed: {e.stderr}")
        except Exception as e:
            raise Exception(f"Video metadata operation failed: {str(e)}")

    def _get_existing_metadata(self, filename):
        """
        Read existing metadata from video file using ffprobe.

        Args:
            filename: Path to video file

        Returns:
            Dictionary of existing metadata fields
        """
        try:
            cmd = [
                'ffprobe',
                '-v', 'quiet',
                '-print_format', 'json',
                '-show_format',
                filename
            ]

            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            metadata_info = json.loads(result.stdout)

            # Extract metadata tags from format section
            if 'format' in metadata_info and 'tags' in metadata_info['format']:
                return metadata_info['format']['tags']
            else:
                return {}

        except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
            # If we can't read metadata, return empty dict (metadata will be created fresh)
            return {}

    def _combine_metadata_field(self, existing, new):
        """
        Combine existing metadata field with new content.

        Args:
            existing: Existing metadata content (string)
            new: New metadata content to append (string)

        Returns:
            Combined metadata string
        """
        existing = existing.strip() if existing else ''
        new = new.strip() if new else ''

        if not existing:
            return new
        elif not new:
            return existing
        else:
            # Separate with double newline for readability
            return f'{existing}\n\n{new}'


# A dictionary that contains all nodes you want to export with their names
# NOTE: names should be globally unique
NODE_CLASS_MAPPINGS = {
    "MediaDescribe": MediaDescribe,
    "GeminiUtilOptions": GeminiUtilOptions,
    "FilenameGenerator": FilenameGenerator,
    "VideoMetadataNode": VideoMetadataNode,
    "LoRAInfoExtractor": LoRAInfoExtractor,
    "VideoPreview": VideoPreview,
    "VueExampleNode": VueExampleNode
}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {
    "MediaDescribe": "Media Describe",
    "GeminiUtilOptions": "Gemini Util - Options",
    "FilenameGenerator": "Filename Generator",
    "VideoMetadataNode": "Update Video Metadata",
    "LoRAInfoExtractor": "LoRA Info Extractor",
    "VideoPreview": "🎬 Video Preview",
    "VueExampleNode": "🎨 Vue Example Widget"
}
