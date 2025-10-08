import cv2
import os
import random
import tempfile
import numpy as np
from PIL import Image
import hashlib


class FrameExtractor:
    """
    A ComfyUI custom node for extracting frames from videos.
    Supports multiple extraction methods: Evenly Spaced, Random, Start/Middle/End.
    """

    def __init__(self):
        pass

    @classmethod
    def INPUT_TYPES(cls):
        """
        Return a dictionary which contains config for all input fields.
        """
        return {
            "required": {
                "video_path": ("STRING", {
                    "multiline": False,
                    "default": "",
                    "tooltip": "Path to video file (from Media Selection node)"
                }),
                "num_frames": ("INT", {
                    "default": 3,
                    "min": 1,
                    "max": 20,
                    "tooltip": "Number of frames to extract"
                }),
                "extraction_method": (["Evenly Spaced", "Random", "Start/Middle/End"], {
                    "default": "Evenly Spaced",
                    "tooltip": "Method for selecting which frames to extract"
                }),
            },
            "optional": {
                "seed": ("INT", {
                    "default": 0,
                    "min": 0,
                    "max": 0xFFFFFFFFFFFFFFFF,
                    "tooltip": "Seed for random extraction (used when extraction_method is 'Random')"
                }),
                "start_time": ("FLOAT", {
                    "default": 0.0,
                    "min": 0.0,
                    "max": 1000.0,
                    "step": 0.1,
                    "tooltip": "Start time in seconds for frame extraction window (0 = start of video)"
                }),
                "end_time": ("FLOAT", {
                    "default": 0.0,
                    "min": 0.0,
                    "max": 1000.0,
                    "step": 0.1,
                    "tooltip": "End time in seconds for frame extraction window (0 = end of video)"
                }),
                "output_format": (["png", "jpg"], {
                    "default": "png",
                    "tooltip": "Output image format for extracted frames"
                }),
            }
        }

    RETURN_TYPES = ("STRING", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("frame_paths", "frame_timestamps", "frame_info", "frames_directory")
    FUNCTION = "extract_frames"
    CATEGORY = "Swiss Army Knife 🔪"

    def extract_frames(self, video_path, num_frames, extraction_method, seed=0, start_time=0.0, end_time=0.0, output_format="png"):
        """
        Extract frames from a video file.

        Args:
            video_path: Path to video file
            num_frames: Number of frames to extract
            extraction_method: Method for frame selection
            seed: Seed for random extraction
            start_time: Start time for extraction window (seconds)
            end_time: End time for extraction window (seconds, 0 = end of video)
            output_format: Output image format (png or jpg)

        Returns:
            Tuple of (frame_paths_str, frame_timestamps_str, frame_info, frames_directory)
        """
        try:
            # Validate video path
            if not video_path or not os.path.exists(video_path):
                raise ValueError(f"Video file not found: {video_path}")

            # Open video
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError(f"Failed to open video: {video_path}")

            # Get video properties
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            duration = total_frames / fps if fps > 0 else 0
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

            print(f"Video properties: {total_frames} frames, {fps:.2f} fps, {duration:.2f}s, {width}x{height}")

            # Determine extraction window
            if end_time <= 0 or end_time > duration:
                end_time = duration
            
            start_frame = int(start_time * fps)
            end_frame = int(end_time * fps)
            
            if start_frame >= end_frame:
                raise ValueError(f"Invalid extraction window: start_time ({start_time}s) must be less than end_time ({end_time}s)")

            # Calculate frame indices to extract
            frame_indices = self._calculate_frame_indices(
                extraction_method, num_frames, start_frame, end_frame, total_frames, seed
            )

            # Create named directory for frames based on video file
            frames_dir = self._create_frames_directory(video_path)
            
            # Extract frames
            frame_paths = []
            frame_timestamps = []
            
            for idx, frame_idx in enumerate(frame_indices):
                # Seek to frame
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                
                if not ret:
                    print(f"Warning: Failed to read frame {frame_idx}, skipping")
                    continue
                
                # Calculate timestamp
                timestamp = frame_idx / fps
                
                # Save frame
                frame_filename = f"frame_{idx:03d}_t{timestamp:.2f}s.{output_format}"
                frame_path = os.path.join(frames_dir, frame_filename)
                
                # Convert BGR to RGB for PIL
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pil_image = Image.fromarray(frame_rgb)
                
                if output_format == "jpg":
                    pil_image.save(frame_path, "JPEG", quality=95)
                else:
                    pil_image.save(frame_path, "PNG")
                
                frame_paths.append(frame_path)
                frame_timestamps.append(timestamp)
                
                print(f"Extracted frame {idx + 1}/{num_frames}: {frame_filename} at {timestamp:.2f}s")

            cap.release()

            # Create output strings
            frame_paths_str = ",".join(frame_paths)
            frame_timestamps_str = ",".join([f"{ts:.2f}" for ts in frame_timestamps])
            
            # Create info text
            frame_info = f"🎞️ Frame Extraction Info:\n"
            frame_info += f"• Video: {os.path.basename(video_path)}\n"
            frame_info += f"• Method: {extraction_method}\n"
            frame_info += f"• Frames Extracted: {len(frame_paths)}\n"
            frame_info += f"• Extraction Window: {start_time:.1f}s - {end_time:.1f}s\n"
            frame_info += f"• Output Format: {output_format}\n"
            frame_info += f"• Timestamps: {', '.join([f'{ts:.2f}s' for ts in frame_timestamps])}\n"
            frame_info += f"• Output Directory: {frames_dir}"

            print(frame_info)

            return (frame_paths_str, frame_timestamps_str, frame_info, frames_dir)

        except Exception as e:
            raise Exception(f"Frame extraction failed: {str(e)}")

    def _create_frames_directory(self, video_path):
        """
        Create a uniquely named directory for frames based on the video file.
        Uses video filename and a hash of the full path to ensure uniqueness.
        """
        # Get base temp directory
        base_temp_dir = tempfile.gettempdir()
        
        # Extract video filename without extension
        video_filename = os.path.splitext(os.path.basename(video_path))[0]
        
        # Create a short hash of the full video path to ensure uniqueness
        path_hash = hashlib.md5(video_path.encode()).hexdigest()[:8]
        
        # Create directory name: video_filename_hash
        dir_name = f"frames_{video_filename}_{path_hash}"
        frames_dir = os.path.join(base_temp_dir, "comfyui_frames", dir_name)
        
        # Create directory if it doesn't exist
        os.makedirs(frames_dir, exist_ok=True)
        
        print(f"Created frames directory: {frames_dir}")
        return frames_dir

    def _calculate_frame_indices(self, method, num_frames, start_frame, end_frame, total_frames, seed):
        """Calculate which frame indices to extract based on the method."""
        available_frames = end_frame - start_frame
        
        if num_frames > available_frames:
            print(f"Warning: Requested {num_frames} frames but only {available_frames} available. Adjusting to {available_frames}.")
            num_frames = available_frames

        if method == "Evenly Spaced":
            # Divide the window into equal segments
            if num_frames == 1:
                indices = [start_frame + available_frames // 2]
            else:
                step = available_frames / num_frames
                indices = [int(start_frame + step * i + step / 2) for i in range(num_frames)]
        
        elif method == "Random":
            # Randomly select frames
            random.seed(seed)
            all_frame_indices = list(range(start_frame, end_frame))
            indices = sorted(random.sample(all_frame_indices, min(num_frames, len(all_frame_indices))))
            random.seed(None)
        
        elif method == "Start/Middle/End":
            # Always extract from start, middle, and end (up to 3 frames)
            if num_frames >= 3:
                indices = [
                    start_frame,  # Start
                    start_frame + available_frames // 2,  # Middle
                    end_frame - 1,  # End
                ]
                # If more than 3 requested, fill in between
                if num_frames > 3:
                    remaining = num_frames - 3
                    step = available_frames / (remaining + 1)
                    additional = [int(start_frame + step * i) for i in range(1, remaining + 1)]
                    # Combine and sort
                    indices = sorted(indices + additional)
                    indices = indices[:num_frames]  # Trim to exact count
            elif num_frames == 2:
                indices = [start_frame, end_frame - 1]
            else:
                indices = [start_frame + available_frames // 2]
        
        else:
            raise ValueError(f"Unknown extraction method: {method}")

        # Ensure indices are within bounds
        indices = [max(0, min(idx, total_frames - 1)) for idx in indices]
        
        return indices
