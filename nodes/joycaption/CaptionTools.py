import os
import json
import torch
from pathlib import Path
from PIL import Image
import folder_paths

class ImageBatchPath:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "folder_path": ("STRING", {"default": "", "multiline": False, "tooltip": "Path to folder containing images"}),
                "batch_size": ("INT", {"default": 1, "min": 1, "max": 100, "tooltip": "Number of images to process in each batch"}),
                "start_index": ("INT", {"default": 0, "min": 0, "tooltip": "Index to start processing from (useful for resuming)"}),
                "extensions": ("STRING", {"default": "jpg,jpeg,png,bmp,tiff,webp", "multiline": False, "tooltip": "Comma-separated list of image extensions to include"}),
                "recursive": ("BOOLEAN", {"default": False, "tooltip": "Whether to search subdirectories recursively"}),
            }
        }

    RETURN_TYPES = ("IMAGE", "STRING", "INT", "BOOLEAN")
    RETURN_NAMES = ("images", "filenames", "batch_index", "has_more")
    FUNCTION = "load_batch"
    CATEGORY = "🧪AILab/📝JoyCaption"

    def __init__(self):
        self.image_paths = []
        self.current_folder = None
        self.current_batch_size = None
        self.current_extensions = None
        self.current_recursive = None

    def load_batch(self, folder_path, batch_size, start_index, extensions, recursive):
        # Check if we need to rescan the folder
        if (self.current_folder != folder_path or 
            self.current_batch_size != batch_size or 
            self.current_extensions != extensions or 
            self.current_recursive != recursive):
            
            self.current_folder = folder_path
            self.current_batch_size = batch_size
            self.current_extensions = extensions
            self.current_recursive = recursive
            
            # Get list of valid image files
            self.image_paths = self._get_image_paths(folder_path, extensions, recursive)
        
        if not self.image_paths:
            # Return empty batch if no images found
            return (torch.zeros(1, 64, 64, 3), [""], 0, False)
        
        # Calculate batch bounds
        end_index = min(start_index + batch_size, len(self.image_paths))
        batch_paths = self.image_paths[start_index:end_index]
        
        if not batch_paths:
            # Return empty batch if start_index is beyond available images
            return (torch.zeros(1, 64, 64, 3), [""], start_index, False)
        
        # Load images
        images = []
        filenames = []
        
        for img_path in batch_paths:
            try:
                # Load and convert image
                img = Image.open(img_path)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Convert to tensor (H, W, C) in range [0, 1]
                img_tensor = torch.from_numpy(np.array(img)).float() / 255.0
                images.append(img_tensor)
                filenames.append(str(Path(img_path).name))
                
            except Exception as e:
                print(f"Error loading image {img_path}: {e}")
                continue
        
        if not images:
            # Return empty batch if no images could be loaded
            return (torch.zeros(1, 64, 64, 3), [""], start_index, False)
        
        # Stack images into batch tensor
        # Ensure all images have the same dimensions by padding/cropping if necessary
        max_h = max(img.shape[0] for img in images)
        max_w = max(img.shape[1] for img in images)
        
        normalized_images = []
        for img in images:
            h, w, c = img.shape
            if h != max_h or w != max_w:
                # Resize image to match max dimensions
                img_pil = Image.fromarray((img.numpy() * 255).astype('uint8'))
                img_pil = img_pil.resize((max_w, max_h), Image.Resampling.LANCZOS)
                img = torch.from_numpy(np.array(img_pil)).float() / 255.0
            normalized_images.append(img)
        
        batch_tensor = torch.stack(normalized_images, dim=0)
        
        # Check if there are more batches available
        has_more = end_index < len(self.image_paths)
        
        return (batch_tensor, filenames, start_index // batch_size, has_more)
    
    def _get_image_paths(self, folder_path, extensions, recursive):
        """Get list of image file paths from the specified folder."""
        if not folder_path or not os.path.exists(folder_path):
            return []
        
        # Parse extensions
        ext_list = [ext.strip().lower() for ext in extensions.split(',')]
        ext_list = [f".{ext}" if not ext.startswith('.') else ext for ext in ext_list]
        
        image_paths = []
        folder = Path(folder_path)
        
        if recursive:
            # Search recursively
            for ext in ext_list:
                image_paths.extend(folder.rglob(f"*{ext}"))
                image_paths.extend(folder.rglob(f"*{ext.upper()}"))
        else:
            # Search only in the specified folder
            for ext in ext_list:
                image_paths.extend(folder.glob(f"*{ext}"))
                image_paths.extend(folder.glob(f"*{ext.upper()}"))
        
        # Sort paths for consistent ordering
        return sorted([str(path) for path in image_paths])

class CaptionSaver:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "captions": ("STRING", {"forceInput": True, "tooltip": "Generated captions to save"}),
                "filenames": ("STRING", {"forceInput": True, "tooltip": "Corresponding filenames for the captions"}),
                "output_folder": ("STRING", {"default": "", "multiline": False, "tooltip": "Folder to save caption files. If empty, saves next to original images"}),
                "file_extension": (["txt", "caption", "json"], {"default": "txt", "tooltip": "File extension for saved captions"}),
                "filename_template": ("STRING", {"default": "{name}", "multiline": False, "tooltip": "Template for caption filenames. Use {name} for original filename without extension"}),
                "overwrite_existing": ("BOOLEAN", {"default": False, "tooltip": "Whether to overwrite existing caption files"}),
                "save_metadata": ("BOOLEAN", {"default": False, "tooltip": "Whether to save additional metadata with the caption"}),
            },
            "optional": {
                "batch_index": ("INT", {"default": 0, "forceInput": True, "tooltip": "Current batch index for progress tracking"}),
                "metadata": ("STRING", {"default": "", "multiline": True, "tooltip": "Additional metadata to save with captions (JSON format)"}),
            }
        }

    RETURN_TYPES = ("STRING", "INT")
    RETURN_NAMES = ("status", "saved_count")
    FUNCTION = "save_captions"
    CATEGORY = "🧪AILab/📝JoyCaption"

    def save_captions(self, captions, filenames, output_folder, file_extension, filename_template, overwrite_existing, save_metadata, batch_index=0, metadata=""):
        try:
            # Handle input types - captions and filenames might be lists or single strings
            if isinstance(captions, str):
                caption_list = [captions]
            else:
                caption_list = captions if isinstance(captions, list) else [captions]
            
            if isinstance(filenames, str):
                filename_list = [filenames]
            else:
                filename_list = filenames if isinstance(filenames, list) else [filenames]
            
            # Ensure we have matching numbers of captions and filenames
            min_length = min(len(caption_list), len(filename_list))
            caption_list = caption_list[:min_length]
            filename_list = filename_list[:min_length]
            
            saved_count = 0
            errors = []
            
            # Parse metadata if provided
            metadata_dict = {}
            if metadata and save_metadata:
                try:
                    metadata_dict = json.loads(metadata)
                except json.JSONDecodeError:
                    metadata_dict = {"metadata": metadata}
            
            for i, (caption, filename) in enumerate(zip(caption_list, filename_list)):
                try:
                    # Generate output filename
                    base_name = Path(filename).stem
                    output_name = filename_template.format(name=base_name, index=i, batch=batch_index)
                    output_file = f"{output_name}.{file_extension}"
                    
                    # Determine output path
                    if output_folder and output_folder.strip():
                        output_path = Path(output_folder) / output_file
                        output_path.parent.mkdir(parents=True, exist_ok=True)
                    else:
                        # Save next to original image (assume it's in the same folder structure)
                        # This is a best-effort approach since we only have the filename
                        output_path = Path(output_file)
                    
                    # Check if file exists and handle overwrite policy
                    if output_path.exists() and not overwrite_existing:
                        continue
                    
                    # Prepare content to save
                    if file_extension == "json":
                        content_dict = {
                            "caption": caption,
                            "filename": filename,
                            "batch_index": batch_index
                        }
                        if save_metadata and metadata_dict:
                            content_dict["metadata"] = metadata_dict
                        
                        content = json.dumps(content_dict, indent=2, ensure_ascii=False)
                    else:
                        content = caption
                        if save_metadata and metadata_dict:
                            content += f"\n\n# Metadata\n{json.dumps(metadata_dict, indent=2)}"
                    
                    # Save file
                    with open(output_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    saved_count += 1
                    
                except Exception as e:
                    errors.append(f"Error saving {filename}: {str(e)}")
            
            # Prepare status message
            if errors:
                status = f"Saved {saved_count}/{len(caption_list)} captions. Errors: {'; '.join(errors[:3])}"
                if len(errors) > 3:
                    status += f" and {len(errors) - 3} more..."
            else:
                status = f"Successfully saved {saved_count} captions"
            
            return (status, saved_count)
            
        except Exception as e:
            return (f"Error in save_captions: {str(e)}", 0)

# Add numpy import for image processing
try:
    import numpy as np
except ImportError:
    print("Warning: numpy not available, ImageBatchPath functionality may be limited")
    import torch
    np = torch

NODE_CLASS_MAPPINGS = {
    "ImageBatchPath": ImageBatchPath,
    "CaptionSaver": CaptionSaver,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ImageBatchPath": "Image Batch Path",
    "CaptionSaver": "Caption Saver",
}