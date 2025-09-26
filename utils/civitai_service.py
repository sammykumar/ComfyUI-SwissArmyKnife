"""CivitAI API integration for fetching LoRA metadata."""

from __future__ import annotations

import asyncio
import os
from datetime import datetime
from typing import Any, Dict, Optional

import httpx

from .lora_hash_cache import get_cache as get_lora_hash_cache


class CivitAIService:
    """Service for fetching LoRA metadata from CivitAI API"""

    BASE_URL = "https://civitai.com/api/v1"

    MAX_RETRIES = 2

    def __init__(self, api_key=None, *, timeout: float = 10.0):
        self.cache: Dict[str, Optional[Dict[str, Any]]] = {}
        # Use provided API key, otherwise fallback to environment variables (try both variants)
        self.api_key = api_key or os.environ.get("CIVITAI_API_KEY") or os.environ.get("CIVIT_API_KEY", "")
        self.timeout = timeout
        self._hash_cache = get_lora_hash_cache()
        print(f"[DEBUG] CivitAI Service initialized")
        if self.api_key:
            print(f"[DEBUG] ✅ CivitAI API key found: {self.api_key[:8]}...{self.api_key[-4:]}")
        else:
            print(f"[DEBUG] ❌ No CivitAI API key found (neither provided nor in environment)")
            print(f"[DEBUG] Available env vars: {[k for k in os.environ.keys() if 'CIVIT' in k.upper()]}")

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
        import threading
        
        try:
            # Check if we're in an event loop
            loop = asyncio.get_running_loop()
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

        print(f"[DEBUG] CivitAI response for {hash_type} hash: {response.status_code}")
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