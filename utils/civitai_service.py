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

        Args:
            file_path: Path to the LoRA file

        Returns:
            Model information from CivitAI or None if not found
        """
        try:
            if not os.path.exists(file_path):
                print(f"File not found: {file_path}")
                return None

            file_hash = self._hash_cache.get_hash(file_path)
            if not file_hash:
                return None

            if file_hash in self.cache:
                print(f"Using cached CivitAI data for hash: {file_hash[:16]}...")
                return self.cache[file_hash]

            result = self._run_async(self._get_model_info_by_hash_async(file_hash))
            self.cache[file_hash] = result
            return result

        except Exception as e:  # pylint: disable=broad-except
            print(f"Error fetching CivitAI data for {file_path}: {e}")
            return None

    def _run_async(self, coro):
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            return asyncio.run(coro)

        # Running inside an active loop – create a dedicated loop to run synchronously.
        new_loop = asyncio.new_event_loop()
        try:
            return new_loop.run_until_complete(coro)
        finally:
            new_loop.close()

    async def _get_model_info_by_hash_async(self, file_hash: str, attempt: int = 0) -> Optional[Dict[str, Any]]:
        url = f"{self.BASE_URL}/model-versions/by-hash/{file_hash}"
        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        timeout = httpx.Timeout(self.timeout, read=self.timeout)
        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                response = await client.get(url, headers=headers)
            except httpx.RequestError as exc:
                print(f"Network error fetching CivitAI data for hash {file_hash[:16]}...: {exc}")
                return None

        print(f"[DEBUG] Response status: {response.status_code}")
        if response.status_code == 429 and attempt < self.MAX_RETRIES:
            retry_after = response.headers.get("Retry-After")
            delay = min(float(retry_after) if retry_after else 1.0, 5.0)
            print(f"[DEBUG] Rate limited by CivitAI, retrying in {delay} seconds")
            await asyncio.sleep(delay)
            return await self._get_model_info_by_hash_async(file_hash, attempt=attempt + 1)

        if response.status_code == 404:
            print(f"Model not found on CivitAI for hash: {file_hash[:16]}...")
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