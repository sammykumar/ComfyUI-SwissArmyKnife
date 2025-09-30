"""
Caption Tools for batch processing and saving.
Based on ComfyUI-JoyCaption by 1038lab.
"""

import os
import json
from pathlib import Path
import folder_paths
from PIL import Image

class ImageBatchPath:
    """Load images from a folder path for batch processing."""
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "folder_path": ("STRING", {"default": "", "placeholder": "Path to folder containing images"}),
                "file_filter": ("STRING", {"default": "*.jpg,*.jpeg,*.png,*.webp,*.bmp", "tooltip": "Comma-separated file extensions to include"}),
                "max_images": ("INT", {"default": 100, "min": 1, "max": 1000, "tooltip": "Maximum number of images to load"}),
            }
        }
    
    RETURN_TYPES = ("IMAGE", "STRING")
    RETURN_NAMES = ("images", "filenames")
    FUNCTION = "load_images"
    CATEGORY = "Swiss Army Knife 🔪/JoyCaption"
    OUTPUT_IS_LIST = (True, True)

    def load_images(self, folder_path, file_filter, max_images):
        if not folder_path or not os.path.exists(folder_path):
            raise ValueError(f"Folder path does not exist: {folder_path}")
        
        # Parse file extensions
        extensions = [ext.strip().lower() for ext in file_filter.split(',')]
        extensions = [ext if ext.startswith('.') else f'.{ext}' for ext in extensions]
        extensions = [ext.replace('*', '') for ext in extensions]
        
        # Find image files
        image_files = []
        folder = Path(folder_path)
        
        for file_path in folder.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in extensions:
                image_files.append(file_path)
        
        # Sort files for consistent ordering
        image_files.sort()
        
        # Limit to max_images
        if len(image_files) > max_images:
            image_files = image_files[:max_images]
        
        if not image_files:
            raise ValueError(f"No image files found in {folder_path} with extensions {file_filter}")
        
        # Load images
        images = []
        filenames = []
        
        for file_path in image_files:
            try:
                image = Image.open(str(file_path))
                
                # Convert to RGB if necessary
                if image.mode != 'RGB':
                    image = image.convert('RGB')
                
                # Convert PIL to tensor format (H, W, C) with values in [0, 1]
                import torch
                from torchvision.transforms import ToTensor
                tensor_image = ToTensor()(image).permute(1, 2, 0)  # (C, H, W) -> (H, W, C)
                
                images.append(tensor_image)
                filenames.append(file_path.name)
                
            except Exception as e:
                print(f"Warning: Could not load image {file_path}: {e}")
                continue
        
        if not images:
            raise ValueError("No valid images could be loaded from the folder")
        
        return (images, filenames)

class CaptionSaver:
    """Save captions to text files with various formats."""
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "captions": ("STRING", {"forceInput": True}),
                "filenames": ("STRING", {"forceInput": True}),
                "output_folder": ("STRING", {"default": "", "placeholder": "Path to save caption files"}),
                "save_format": (["txt", "json", "csv"], {"default": "txt", "tooltip": "File format for saving captions"}),
                "filename_prefix": ("STRING", {"default": "", "tooltip": "Optional prefix for output files"}),
                "filename_suffix": ("STRING", {"default": "", "tooltip": "Optional suffix for output files"}),
                "overwrite_existing": ("BOOLEAN", {"default": False, "tooltip": "Whether to overwrite existing files"}),
            },
            "optional": {
                "metadata": ("STRING", {"default": "", "tooltip": "Additional metadata to include (JSON format)"}),
            }
        }
    
    RETURN_TYPES = ("STRING", "INT")
    RETURN_NAMES = ("output_paths", "files_saved")
    FUNCTION = "save_captions"
    CATEGORY = "Swiss Army Knife 🔪/JoyCaption"
    OUTPUT_IS_LIST = (True, False)

    def save_captions(self, captions, filenames, output_folder, save_format, filename_prefix, filename_suffix, overwrite_existing, metadata=""):
        if not output_folder:
            raise ValueError("Output folder path is required")
        
        # Ensure lists are the same length
        if not isinstance(captions, list):
            captions = [captions]
        if not isinstance(filenames, list):
            filenames = [filenames]
        
        if len(captions) != len(filenames):
            raise ValueError(f"Number of captions ({len(captions)}) must match number of filenames ({len(filenames)})")
        
        # Create output folder if it doesn't exist
        output_path = Path(output_folder)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Parse metadata if provided
        metadata_dict = {}
        if metadata.strip():
            try:
                metadata_dict = json.loads(metadata)
            except json.JSONDecodeError:
                print(f"Warning: Invalid JSON metadata, ignoring: {metadata}")
        
        output_paths = []
        files_saved = 0
        
        for caption, filename in zip(captions, filenames):
            # Generate output filename
            base_name = Path(filename).stem
            output_filename = f"{filename_prefix}{base_name}{filename_suffix}.{save_format}"
            output_file_path = output_path / output_filename
            
            # Check if file exists and overwrite setting
            if output_file_path.exists() and not overwrite_existing:
                print(f"Skipping existing file: {output_file_path}")
                output_paths.append(str(output_file_path))
                continue
            
            try:
                if save_format == "txt":
                    # Simple text format
                    with open(output_file_path, 'w', encoding='utf-8') as f:
                        f.write(caption)
                
                elif save_format == "json":
                    # JSON format with metadata
                    data = {
                        "filename": filename,
                        "caption": caption,
                        "metadata": metadata_dict
                    }
                    with open(output_file_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                
                elif save_format == "csv":
                    # CSV format (append mode for multiple files)
                    csv_path = output_path / f"{filename_prefix}captions{filename_suffix}.csv"
                    file_exists = csv_path.exists()
                    
                    import csv
                    with open(csv_path, 'a', newline='', encoding='utf-8') as f:
                        writer = csv.writer(f)
                        
                        # Write header if new file
                        if not file_exists:
                            headers = ["filename", "caption"]
                            if metadata_dict:
                                headers.extend(metadata_dict.keys())
                            writer.writerow(headers)
                        
                        # Write data row
                        row = [filename, caption]
                        if metadata_dict:
                            row.extend(metadata_dict.values())
                        writer.writerow(row)
                    
                    output_file_path = csv_path
                
                output_paths.append(str(output_file_path))
                files_saved += 1
                
            except Exception as e:
                print(f"Error saving caption for {filename}: {e}")
                continue
        
        return (output_paths, files_saved)

class ImageCaptionBatch:
    """Batch process images with JoyCaption and save results."""
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "images": ("IMAGE", {"forceInput": True}),
                "filenames": ("STRING", {"forceInput": True}),
                "joycaption_node": ("STRING", {"default": "JC", "tooltip": "JoyCaption node type to use"}),
                "output_folder": ("STRING", {"default": "", "placeholder": "Path to save results"}),
                "save_format": (["txt", "json", "csv"], {"default": "txt"}),
                "batch_size": ("INT", {"default": 1, "min": 1, "max": 10, "tooltip": "Number of images to process simultaneously"}),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING", "INT")
    RETURN_NAMES = ("captions", "output_paths", "processed_count")
    FUNCTION = "batch_caption"
    CATEGORY = "Swiss Army Knife 🔪/JoyCaption"
    OUTPUT_IS_LIST = (True, True, False)

    def batch_caption(self, images, filenames, joycaption_node, output_folder, save_format, batch_size):
        """Batch process images for captioning."""
        if not isinstance(images, list):
            images = [images]
        if not isinstance(filenames, list):
            filenames = [filenames]
        
        if len(images) != len(filenames):
            raise ValueError("Number of images must match number of filenames")
        
        captions = []
        output_paths = []
        processed_count = 0
        
        # Process images in batches
        for i in range(0, len(images), batch_size):
            batch_images = images[i:i + batch_size]
            batch_filenames = filenames[i:i + batch_size]
            
            for image, filename in zip(batch_images, batch_filenames):
                try:
                    # Note: In actual implementation, this would call the JoyCaption node
                    # For now, we'll return a placeholder caption
                    caption = f"[Caption for {filename} - would be generated by {joycaption_node}]"
                    captions.append(caption)
                    
                    # Save individual caption if output folder is specified
                    if output_folder:
                        saver = CaptionSaver()
                        paths, _ = saver.save_captions(
                            [caption], [filename], output_folder, save_format, 
                            "", "", True, ""
                        )
                        output_paths.extend(paths)
                    
                    processed_count += 1
                    
                except Exception as e:
                    print(f"Error processing {filename}: {e}")
                    captions.append(f"[Error processing {filename}: {e}]")
                    continue
        
        return (captions, output_paths, processed_count)

# Node mappings for ComfyUI
NODE_CLASS_MAPPINGS = {
    "ImageBatchPath": ImageBatchPath,
    "CaptionSaver": CaptionSaver,
    "ImageCaptionBatch": ImageCaptionBatch,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ImageBatchPath": "Load Images from Path",
    "CaptionSaver": "Save Captions",
    "ImageCaptionBatch": "Batch Caption Images",
}