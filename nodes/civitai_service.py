"""CivitAI API integration for fetching LoRA metadata."""

from __future__ import annotations

import asyncio
import os
from datetime import datetime
from typing import Any, Dict, Optional, List

import httpx

from .lora_hash_cache import get_cache as get_lora_hash_cache

# Optional ComfyUI imports for trigger word extraction
try:
    import folder_paths
    COMFYUI_AVAILABLE = True
except ImportError:
    folder_paths = None
    COMFYUI_AVAILABLE = False


class CivitAIService:
    """Service for fetching LoRA metadata from CivitAI API"""

    BASE_URL = "https://civitai.com/api/v1"

    MAX_RETRIES = 2

    def __init__(self, api_key=None, *, timeout: float = 10.0):
        self.cache: Dict[str, Optional[Dict[str, Any]]] = {}
        # Use provided API key only (no environment variable fallback)
        self.api_key = api_key or ""
        self.timeout = timeout
        self._hash_cache = get_lora_hash_cache()
        # Only log if there's an issue with API key detection
        if not self.api_key:
            print("[DEBUG] ❌ No CivitAI API key found (this may be normal during startup before settings sync)")
        # Successful API key detection is logged silently

    def get_model_info_by_hash(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Get model information from CivitAI using file hash
        Tries multiple hash types in order: SHA256, AutoV1, AutoV2, Blake3, CRC32

        Args:
            file_path: Path to the LoRA file

        Returns:
            Model information from CivitAI or None if not found
        """
        try:
            if not os.path.exists(file_path):
                print(f"File not found: {file_path}")
                return None

            # Get all hash types
            file_hashes = self._hash_cache.get_hashes(file_path)
            if not file_hashes:
                print(f"Could not compute hashes for {file_path}")
                return None

            # Check cache for any previously successful hash
            cache_key = os.path.abspath(file_path)
            if cache_key in self.cache:
                print(f"Using cached CivitAI data for file: {os.path.basename(file_path)}")
                cached_result = self.cache[cache_key]
                if cached_result:
                    cached_result['cache_hit'] = True
                return cached_result

            # Try hash types in priority order
            hash_priority = [
                ('sha256', file_hashes.get('sha256')),
                ('autov1', file_hashes.get('autov1')),
                ('autov2', file_hashes.get('autov2')),
                ('blake3', file_hashes.get('blake3')),
                ('crc32', file_hashes.get('crc32')),
            ]

            result = None
            for hash_type, hash_value in hash_priority:
                if not hash_value:
                    continue

                print(f"Trying CivitAI lookup with {hash_type}: {hash_value[:16]}...")
                result = self._run_async(self._get_model_info_by_hash_async(hash_value, hash_type))
                if result:
                    print(f"✅ Found CivitAI match using {hash_type} hash")
                    # Add hash information to result
                    result['matched_hash_type'] = hash_type
                    result['matched_hash_value'] = hash_value
                    result['all_hashes'] = file_hashes
                    result['cache_hit'] = False  # This is a fresh API call
                    break
                else:
                    print(f"❌ No CivitAI match for {hash_type} hash")

            # Cache the result (even if None) to avoid repeated API calls
            self.cache[cache_key] = result
            return result

        except Exception as e:  # pylint: disable=broad-except
            print(f"Error fetching CivitAI data for {file_path}: {e}")
            return None

    def _run_async(self, coro):
        import concurrent.futures

        try:
            # Check if we're in an event loop
            asyncio.get_running_loop()
            # If we are, we need to run the coroutine in a separate thread
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(self._run_in_thread, coro)
                return future.result()
        except RuntimeError:
            # No event loop running, we can use asyncio.run directly
            return asyncio.run(coro)

    def _run_in_thread(self, coro):
        """Run coroutine in a new event loop in the current thread."""
        new_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(new_loop)
        try:
            return new_loop.run_until_complete(coro)
        finally:
            new_loop.close()
            asyncio.set_event_loop(None)

    async def _get_model_info_by_hash_async(self, file_hash: str, hash_type: str = "unknown", attempt: int = 0) -> Optional[Dict[str, Any]]:
        url = f"{self.BASE_URL}/model-versions/by-hash/{file_hash}"
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        timeout = httpx.Timeout(self.timeout, read=self.timeout)
        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                response = await client.get(url, headers=headers)
            except httpx.RequestError as exc:
                print(f"Network error fetching CivitAI data for {hash_type} hash {file_hash[:16]}...: {exc}")
                return None

        # Only log response status for errors or rate limiting
        if response.status_code == 429 and attempt < self.MAX_RETRIES:
            retry_after = response.headers.get("Retry-After")
            delay = min(float(retry_after) if retry_after else 1.0, 5.0)
            print(f"[DEBUG] Rate limited by CivitAI, retrying in {delay} seconds")
            await asyncio.sleep(delay)
            return await self._get_model_info_by_hash_async(file_hash, hash_type, attempt=attempt + 1)

        if response.status_code == 404:
            print(f"Model not found on CivitAI for {hash_type} hash: {file_hash[:16]}...")
            return None

        if response.status_code != 200:
            print(f"CivitAI API error: {response.status_code} - {response.text[:200]}")
            return None

        try:
            model_data = response.json()
        except ValueError as exc:
            print(f"[DEBUG] Failed to decode CivitAI response: {exc}")
            return None

        model = model_data.get("model", {})
        creator = model.get("creator", {})
        tags = [tag.get("name", "") for tag in model.get("tags", []) if tag.get("name")]
        metrics = model_data.get("stats", {})

        result = {
            # Processed/legacy fields for backward compatibility
            "civitai_name": model.get("name", "Unknown"),
            "version_name": model_data.get("name", ""),
            "description": model_data.get("description", ""),
            "creator": creator.get("username", "Unknown"),
            "civitai_url": f"https://civitai.com/models/{model_data.get('modelId', '')}",
            "model_id": model_data.get("modelId", ""),
            "version_id": model_data.get("id", ""),
            "hash": file_hash,
            "tags": tags,
            "type": model.get("type", ""),
            "nsfw": model.get("nsfw", False),
            "stats": metrics,
            "fetched_at": datetime.utcnow().isoformat() + "Z",

            # Full API response for comprehensive access
            "api_response": model_data,
        }

        print(f"Found CivitAI model: {result['civitai_name']} by {result['creator']}")
        return result

    def clear_cache(self):
        """Clear the internal cache of CivitAI results"""
        self.cache.clear()
        print("CivitAI cache cleared")

    def get_cache_info(self) -> Dict[str, Any]:
        """Get information about the current cache state"""
        return {
            "cached_models": len(self.cache),
            "has_api_key": bool(self.api_key),
            "api_key_preview": f"{self.api_key[:8]}..." if self.api_key else "Not set"
        }

    def get_trigger_words(self, file_path: str, max_words: int = 3) -> List[str]:
        """
        Get trigger words for a LoRA file from CivitAI.

        Args:
            file_path: Path to the LoRA file
            max_words: Maximum number of trigger words to return

        Returns:
            List of trigger words
        """
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return []

        try:
            # Get model info from CivitAI
            model_info = self.get_model_info_by_hash(file_path)
            if not model_info:
                return []

            # Extract trigger words from API response
            trigger_words = []

            # Try to get trained words from the model version
            api_response = model_info.get("api_response", {})
            trained_words = api_response.get("trainedWords", [])

            if trained_words:
                # Take up to max_words most common trigger words
                for word in trained_words[:max_words]:
                    if isinstance(word, str):
                        trigger_words.append(word)
                    elif isinstance(word, dict) and "word" in word:
                        trigger_words.append(word["word"])

            return trigger_words[:max_words]

        except Exception as e:
            print(f"Error getting trigger words for {file_path}: {e}")
            return []

    def get_trigger_words_by_filename(self, lora_filename: str, max_words: int = 3) -> List[str]:
        """
        Get trigger words for a LoRA file by filename (resolves full path).

        Args:
            lora_filename: Name of the LoRA file
            max_words: Maximum number of trigger words to return

        Returns:
            List of trigger words
        """
        if not COMFYUI_AVAILABLE or folder_paths is None:
            print("CivitAI Service: Cannot resolve LoRA path - ComfyUI not available")
            return []

        try:
            # Import lora_utils for path resolution
            from .lora_manager.lora_utils import resolve_lora_full_path

            full_path = resolve_lora_full_path(lora_filename)
            if not full_path:
                print(f"CivitAI Service: LoRA file '{lora_filename}' not found in configured directories")
                return []

            return self.get_trigger_words(full_path, max_words)

        except Exception as e:
            print(f"CivitAI Service: Error getting trigger words for '{lora_filename}': {e}")
            return []


# Global service instance
_civitai_service: Optional[CivitAIService] = None


def get_civitai_service() -> CivitAIService:
    """Get the global CivitAI service instance."""
    global _civitai_service
    if _civitai_service is None:
        # Get API key from settings only (no environment variable fallback)
        api_key = None
        try:
            from .config_api import get_setting_value
            api_key = get_setting_value("swiss_army_knife.civitai.api_key")
        except ImportError:
            # config_api not available, no API key
            pass
        
        _civitai_service = CivitAIService(api_key=api_key)
    return _civitai_service


def refresh_civitai_service():
    """Refresh the global CivitAI service instance with updated API keys."""
    global _civitai_service
    _civitai_service = None  # Clear cached instance
    return get_civitai_service()  # Create new instance with current API key