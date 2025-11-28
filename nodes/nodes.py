import os
import subprocess
import json

from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from .civitai_service import CivitAIService
from .lora_hash_cache import get_cache as get_lora_hash_cache
from .media_describe import (LLMStudioOptions, MediaDescribe, MediaDescribeOverrides, 
                              LLMStudioVideoDescribe, LLMStudioPictureDescribe,
                              LLMStudioStructuredDescribe, LLMStudioStructuredVideoDescribe)
from .debug_utils import Logger

logger = Logger("Nodes")


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
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    DESCRIPTION = (
        "Builds a structured filename/path from scheduler, CFG, and Wan parameters (plus optional prefixes/date folders) so "
        "saved outputs remain organized."
    )

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
                "overwrite_original": (["Yes", "No"], {
                    "default": "No",
                    "tooltip": "Whether to overwrite the original file or create a new one with '_metadata' suffix"
                }),
            }
        }

    RETURN_TYPES = ("VHS_FILENAMES",)
    RETURN_NAMES = ("Filenames",)
    FUNCTION = "add_metadata"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    DESCRIPTION = (
        "Adds artist/comments/LoRA metadata to videos coming from VHS_VideoCombine via ffmpeg copy, outputting the updated "
        "filename list for downstream saves."
    )

    def add_metadata(self, filenames, artist="", comment="", overwrite_original="No"):
        """
        Update metadata in a video file using FFmpeg, appending to existing metadata.

        Args:
            filenames: Input video filenames from VHS_VideoCombine (will process first file)
            artist: Artist/Creator name (appends to existing artist info)
            comment: Additional comments (appends to existing comments)
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

            # Add output filename
            cmd.append(temp_filename)

            # Execute FFmpeg command
            subprocess.run(cmd, capture_output=True, text=True, check=True)

            # If we're overwriting the original, move temp file to original location
            if overwrite_original == "Yes":
                os.replace(temp_filename, output_filename)

            logger.log(f"Successfully updated metadata in video: {output_filename}")
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
    "LLMStudioOptions": LLMStudioOptions,
    "MediaDescribeOverrides": MediaDescribeOverrides,
    "LLMStudioVideoDescribe": LLMStudioVideoDescribe,
    "LLMStudioPictureDescribe": LLMStudioPictureDescribe,
    "LLMStudioStructuredDescribe": LLMStudioStructuredDescribe,
    "LLMStudioStructuredVideoDescribe": LLMStudioStructuredVideoDescribe,
    "FilenameGenerator": FilenameGenerator,
    "VideoMetadataNode": VideoMetadataNode
}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {
    "MediaDescribe": "Media Describe",
    "LLMStudioOptions": "LLM Studio - Options",
    "MediaDescribeOverrides": "Media Describe - Overrides",
    "LLMStudioVideoDescribe": "LLM Studio Video Describe",
    "LLMStudioPictureDescribe": "LLM Studio Picture Describe",
    "LLMStudioStructuredDescribe": "LM Studio Structured Describe (Image)",
    "LLMStudioStructuredVideoDescribe": "LM Studio Structured Describe (Video)",
    "FilenameGenerator": "Filename Generator",
    "VideoMetadataNode": "Update Video Metadata"
}
