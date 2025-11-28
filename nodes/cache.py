"""
Cache utility for Gemini media descriptions.

Provides transparent caching of Gemini API responses based on media content and prompts.
Cache keys combine media identifiers with configurable option flags to ensure unique storage
per media+prompt combination.
"""

import os
import json
import hashlib
import time
from typing import Optional, Dict, Any


class GeminiCache:
    """
    Simple file-based cache for Gemini media descriptions.

    Cache key format: hash(media_identifier + gemini_model + model_type + options_hash)
    Where:
    - media_identifier is file_path+mtime for files, or content_hash for tensors
    - gemini_model is the model name (e.g., "models/gemini-2.5-flash")
    - model_type is for images only (e.g., "Text2Image", "ImageEdit")
    - options_hash is an MD5 hash of the JSON-serialized options dictionary

    This design scales to unlimited options without requiring code changes.
    """

    def __init__(self, cache_dir: Optional[str] = None):
        """Initialize cache with specified directory."""
        if cache_dir is None:
            # Use a cache directory in the same location as this module
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            cache_dir = os.path.join(base_dir, "cache", "gemini_descriptions")

        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)

    def _get_file_identifier(self, file_path: str) -> str:
        """Get unique identifier for a file based on path and modification time."""
        if not os.path.exists(file_path):
            return f"missing:{file_path}"

        mtime = os.path.getmtime(file_path)
        size = os.path.getsize(file_path)
        return f"file:{file_path}:mtime:{mtime}:size:{size}"

    def _get_tensor_identifier(self, tensor_data: Any) -> str:
        """Get unique identifier for tensor data by hashing its content."""
        # Convert tensor to string representation and hash it
        tensor_str = str(tensor_data)
        hash_obj = hashlib.sha256(tensor_str.encode('utf-8'))
        return f"tensor:{hash_obj.hexdigest()[:16]}"

    def _get_cache_key(self, media_identifier: str, gemini_model: str, 
                      model_type: str = "", options: Dict[str, Any] = None) -> str:
        """Generate cache key from media identifier and configurable option settings."""
        # Hash the options dict for scalable cache keys
        if options is None:
            options = {}

        # Sort keys to ensure deterministic hashing regardless of dict order
        options_hash = hashlib.md5(json.dumps(options, sort_keys=True).encode()).hexdigest()[:8]

        key_components = [
            media_identifier,
            gemini_model,
            model_type,
            f"options:{options_hash}"
        ]
        key_string = "|".join(key_components)
        hash_obj = hashlib.sha256(key_string.encode('utf-8'))
        return hash_obj.hexdigest()

    def _get_cache_file_path(self, cache_key: str) -> str:
        """Get the file path for storing cache entry."""
        return os.path.join(self.cache_dir, f"{cache_key}.json")

    def get(self, media_identifier: str, gemini_model: str, 
            model_type: str = "", options: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """
        Retrieve cached description if available.

        Args:
            media_identifier: Unique identifier for the media
            gemini_model: The Gemini model being used
            model_type: The model type (e.g., "Text2Image", "ImageEdit")
            options: Dictionary of configurable options (e.g., describe_clothing, describe_hair_style, etc.)

        Returns:
            Cached result dictionary or None if not found
        """
        cache_key = self._get_cache_key(media_identifier, gemini_model, model_type, options)
        cache_file = self._get_cache_file_path(cache_key)

        if not os.path.exists(cache_file):
            return None

        try:
            with open(cache_file, 'r', encoding='utf-8') as f:
                cached_data = json.load(f)

            # Verify cache entry has required fields
            if not all(key in cached_data for key in ['description', 'timestamp', 'cache_key']):
                return None

            return cached_data

        except (json.JSONDecodeError, IOError) as e:
            # If cache file is corrupted, remove it
            print(f"[CACHE] Corrupted cache file {cache_file}, removing: {e}")
            try:
                os.remove(cache_file)
            except OSError:
                pass
            return None

    def set(self, media_identifier: str, gemini_model: str, description: str,
            model_type: str = "", options: Dict[str, Any] = None,
            extra_data: Optional[Dict[str, Any]] = None) -> None:
        """
        Store description in cache.

        Args:
            media_identifier: Unique identifier for the media
            gemini_model: The Gemini model being used
            description: The generated description text
            model_type: The model type (e.g., "Text2Image", "ImageEdit")
            options: Dictionary of configurable options (e.g., describe_clothing, describe_hair_style, etc.)
            extra_data: Additional data to store (e.g., status, video_info)
        """
        cache_key = self._get_cache_key(media_identifier, gemini_model, model_type, options)
        cache_file = self._get_cache_file_path(cache_key)

        if options is None:
            options = {}

        cache_entry = {
            'cache_key': cache_key,
            'media_identifier': media_identifier,
            'gemini_model': gemini_model,
            'model_type': model_type,
            'options': options,
            'description': description,
            'timestamp': time.time(),
            'human_timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        }

        # Add any extra data
        if extra_data:
            cache_entry.update(extra_data)

        try:
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(cache_entry, f, indent=2, ensure_ascii=False)
        except IOError as e:
            print(f"[CACHE] Failed to write cache file {cache_file}: {e}")

    def get_cache_info(self) -> Dict[str, Any]:
        """Get information about the cache."""
        if not os.path.exists(self.cache_dir):
            return {'cache_dir': self.cache_dir, 'entries': 0, 'total_size': 0}

        entries = 0
        total_size = 0

        for filename in os.listdir(self.cache_dir):
            if filename.endswith('.json'):
                entries += 1
                file_path = os.path.join(self.cache_dir, filename)
                try:
                    total_size += os.path.getsize(file_path)
                except OSError:
                    pass

        return {
            'cache_dir': self.cache_dir,
            'entries': entries,
            'total_size': total_size,
            'total_size_mb': round(total_size / (1024 * 1024), 2)
        }


# Utility functions for different media types
def get_file_media_identifier(file_path: str) -> str:
    """Get media identifier for a file path."""
    cache = GeminiCache()
    return cache._get_file_identifier(file_path)


def get_tensor_media_identifier(tensor_data: Any) -> str:
    """Get media identifier for tensor data."""
    cache = GeminiCache()
    return cache._get_tensor_identifier(tensor_data)


# Global cache instance
_global_cache = None


def get_cache() -> GeminiCache:
    """Get the global cache instance."""
    global _global_cache
    if _global_cache is None:
        _global_cache = GeminiCache()
    return _global_cache