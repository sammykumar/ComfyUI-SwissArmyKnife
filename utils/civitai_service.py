"""
CivitAI API integration for fetching LoRA metadata
"""

import hashlib
import requests
import os
from typing import Optional, Dict, Any


class CivitAIService:
    """Service for fetching LoRA metadata from CivitAI API"""

    BASE_URL = "https://civitai.com/api/v1"

    def __init__(self, api_key=None):
        self.cache = {}
        # Use provided API key, otherwise fallback to environment variables (try both variants)
        self.api_key = api_key or os.environ.get("CIVITAI_API_KEY") or os.environ.get("CIVIT_API_KEY", "")
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

            # Calculate SHA256 hash of the file
            file_hash = self._calculate_file_hash(file_path)
            if not file_hash:
                return None

            # Check cache first
            if file_hash in self.cache:
                print(f"Using cached CivitAI data for hash: {file_hash[:16]}...")
                return self.cache[file_hash]

            # Query CivitAI API
            url = f"{self.BASE_URL}/model-versions/by-hash/{file_hash}"
            headers = {}

            # Add API key if available
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"

            print(f"[DEBUG] Querying CivitAI API")
            print(f"[DEBUG] URL: {url}")
            print(f"[DEBUG] Headers: {headers}")
            print(f"[DEBUG] Full hash: {file_hash}")
            
            response = requests.get(url, headers=headers, timeout=10)
            print(f"[DEBUG] Response status: {response.status_code}")
            print(f"[DEBUG] Response headers: {dict(response.headers)}")
            if response.text:
                print(f"[DEBUG] Response text (first 500 chars): {response.text[:500]}")

            if response.status_code == 200:
                model_data = response.json()

                # Extract relevant information
                result = {
                    "civitai_name": model_data.get("model", {}).get("name", "Unknown"),
                    "version_name": model_data.get("name", ""),
                    "description": model_data.get("description", ""),
                    "creator": model_data.get("model", {}).get("creator", {}).get("username", "Unknown"),
                    "civitai_url": f"https://civitai.com/models/{model_data.get('modelId', '')}",
                    "model_id": model_data.get("modelId", ""),
                    "version_id": model_data.get("id", ""),
                    "hash": file_hash,
                    "tags": [tag.get("name", "") for tag in model_data.get("model", {}).get("tags", [])],
                    "type": model_data.get("model", {}).get("type", ""),
                    "nsfw": model_data.get("model", {}).get("nsfw", False)
                }

                # Cache the result
                self.cache[file_hash] = result
                print(f"Found CivitAI model: {result['civitai_name']} by {result['creator']}")
                return result
            elif response.status_code == 404:
                print(f"Model not found on CivitAI for hash: {file_hash[:16]}...")
                # Cache negative results to avoid repeated queries
                self.cache[file_hash] = None
                return None
            else:
                print(f"CivitAI API error: {response.status_code} - {response.text}")
                return None

        except requests.RequestException as e:
            print(f"Network error fetching CivitAI data for {file_path}: {e}")
        except Exception as e:
            print(f"Error fetching CivitAI data for {file_path}: {e}")

        return None

    def _calculate_file_hash(self, file_path: str) -> str:
        """
        Calculate SHA256 hash of file for CivitAI lookup

        Args:
            file_path: Path to the file

        Returns:
            SHA256 hash as uppercase hex string
        """
        hash_sha256 = hashlib.sha256()

        try:
            print(f"Calculating hash for: {os.path.basename(file_path)}")
            with open(file_path, "rb") as f:
                # Read file in chunks to handle large files efficiently
                chunk_size = 65536  # 64KB chunks
                while chunk := f.read(chunk_size):
                    hash_sha256.update(chunk)

            file_hash = hash_sha256.hexdigest().upper()
            print(f"File hash: {file_hash}")
            return file_hash

        except Exception as e:
            print(f"Error calculating hash for {file_path}: {e}")
            return ""

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