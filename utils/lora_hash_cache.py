"""Persistent cache for LoRA SHA256 hashes.

The cache stores mappings of absolute LoRA file paths to their SHA256 digests
along with file metadata (modification time and size) so hashes are automatically
invalidated when files change.
"""

from __future__ import annotations

import json
import os
import threading
import time
import zlib
from pathlib import Path
from typing import Dict, Optional

import hashlib

try:
    import blake3
    BLAKE3_AVAILABLE = True
except ImportError:
    BLAKE3_AVAILABLE = False


class LoRAHashCache:
    """File-backed cache for LoRA SHA256 hashes."""

    _CACHE_FILENAME = "lora_hash_cache.json"

    def __init__(self, cache_path: Optional[Path] = None) -> None:
        base_dir = Path(__file__).resolve().parent.parent
        cache_dir = base_dir / "cache"
        cache_dir.mkdir(parents=True, exist_ok=True)

        if cache_path is None:
            cache_path = cache_dir / self._CACHE_FILENAME

        self._cache_path = cache_path
        self._lock = threading.RLock()
        self._data: Dict[str, Dict[str, object]] = {}
        self._load()

    def _load(self) -> None:
        if not self._cache_path.exists():
            return

        try:
            with self._cache_path.open("r", encoding="utf-8") as fh:
                data = json.load(fh)
            if isinstance(data, dict):
                self._data = data
        except (json.JSONDecodeError, OSError) as exc:
            print(f"[LoRAHashCache] Failed to load cache: {exc}. Rebuilding cache file.")
            self._data = {}

    def _save(self) -> None:
        tmp_path = self._cache_path.with_suffix(".tmp")
        try:
            with tmp_path.open("w", encoding="utf-8") as fh:
                json.dump(self._data, fh, indent=2, sort_keys=True)
            tmp_path.replace(self._cache_path)
        except OSError as exc:
            print(f"[LoRAHashCache] Failed to write cache: {exc}")
            if tmp_path.exists():
                try:
                    tmp_path.unlink()
                except OSError:
                    pass

    def _stat_file(self, file_path: str) -> Optional[os.stat_result]:
        try:
            return os.stat(file_path)
        except FileNotFoundError:
            return None
        except OSError as exc:
            print(f"[LoRAHashCache] Unable to stat file '{file_path}': {exc}")
            return None

    def _is_entry_valid(self, file_path: str, entry: Dict[str, object]) -> bool:
        stat_result = self._stat_file(file_path)
        if stat_result is None:
            return False

        cached_mtime = entry.get("mtime")
        cached_size = entry.get("size")
        if not isinstance(cached_mtime, (int, float)) or not isinstance(cached_size, int):
            return False

        return (
            abs(stat_result.st_mtime - float(cached_mtime)) < 0.001
            and stat_result.st_size == cached_size
        )

    def _calculate_hashes(self, file_path: str) -> Optional[Dict[str, str]]:
        """Calculate all supported hash types for a file.
        
        Returns dict with keys: sha256, crc32, blake3, autov1, autov2
        AutoV1 and AutoV2 are specialized hash formats used by CivitAI.
        """
        try:
            with open(file_path, "rb") as fh:
                # Read file in chunks for memory efficiency
                sha256_hasher = hashlib.sha256()
                crc32_value = 0
                blake3_hasher = blake3.blake3() if BLAKE3_AVAILABLE else None

                # For AutoV1/AutoV2, we need specific byte ranges
                file_size = os.path.getsize(file_path)
                fh.seek(0)

                # Read full file content for comprehensive hash calculation
                file_content = fh.read()

                # Calculate standard hashes from full content
                sha256_hasher.update(file_content)
                crc32_value = zlib.crc32(file_content)
                if blake3_hasher:
                    blake3_hasher.update(file_content)

        except FileNotFoundError:
            print(f"[LoRAHashCache] File missing during hashing: {file_path}")
            return None
        except OSError as exc:
            print(f"[LoRAHashCache] Error hashing '{file_path}': {exc}")
            return None

        # Calculate standard hashes
        hashes = {
            "sha256": sha256_hasher.hexdigest().upper(),
            "crc32": f"{crc32_value & 0xffffffff:08X}",  # Ensure positive 32-bit value
        }

        if blake3_hasher:
            hashes["blake3"] = blake3_hasher.hexdigest().upper()
        else:
            hashes["blake3"] = None

        # Calculate AutoV1 and AutoV2 (CivitAI specific formats)
        hashes["autov1"] = self._calculate_autov1(file_content)
        hashes["autov2"] = self._calculate_autov2(file_content)

        return hashes

    def _calculate_autov1(self, file_content: bytes) -> str:
        """Calculate AutoV1 hash (CivitAI format).
        
        AutoV1 uses first 8KB of file with SHA256.
        """
        # Take first 8KB for AutoV1
        chunk = file_content[:8192]
        return hashlib.sha256(chunk).hexdigest().upper()[:10]  # CivitAI uses first 10 chars

    def _calculate_autov2(self, file_content: bytes) -> str:
        """Calculate AutoV2 hash (CivitAI format).
        
        AutoV2 uses a more complex sampling strategy across the file.
        """
        # AutoV2: Sample strategically from different parts of the file
        file_len = len(file_content)
        if file_len <= 8192:  # Small files - use full content
            chunk = file_content
        else:
            # CivitAI AutoV2 algorithm: sample from beginning, skip some, sample middle, skip some, sample end
            samples = []
            # Take first 2KB
            samples.append(file_content[:2048])
            # Take 2KB from 25% position
            pos_25 = file_len // 4
            samples.append(file_content[pos_25:pos_25 + 2048])
            # Take 2KB from 75% position  
            pos_75 = (file_len * 3) // 4
            samples.append(file_content[pos_75:pos_75 + 2048])
            # Take last 2KB
            samples.append(file_content[-2048:])
            chunk = b''.join(samples)

        return hashlib.sha256(chunk).hexdigest().upper()[:10]  # CivitAI uses first 10 chars

    def get_hashes(self, file_path: str, *, use_cache: bool = True) -> Optional[Dict[str, str]]:
        """Return all hash types for *file_path* using persistent cache."""
        normalized_path = os.path.abspath(file_path)

        with self._lock:
            entry = self._data.get(normalized_path)
            if use_cache and entry and self._is_entry_valid(normalized_path, entry):
                # Return cached hashes if available
                cached_hashes = entry.get("hashes")
                if cached_hashes and isinstance(cached_hashes, dict):
                    # Ensure all hash types are present (for older cache entries)
                    complete_hashes = {
                        "sha256": cached_hashes.get("sha256"),
                        "crc32": cached_hashes.get("crc32"),
                        "blake3": cached_hashes.get("blake3"),
                        "autov1": cached_hashes.get("autov1"),
                        "autov2": cached_hashes.get("autov2"),
                    }
                    # If any hash type is missing, recalculate
                    if any(v is None for v in complete_hashes.values() if v != cached_hashes.get("blake3")):
                        print(f"[LoRAHashCache] Incomplete hash cache for {normalized_path}, recalculating...")
                    else:
                        return complete_hashes

                # Fallback to legacy single hash format
                legacy_hash = entry.get("hash")
                if legacy_hash:
                    print(f"[LoRAHashCache] Converting legacy hash cache for {normalized_path}")
                    # Don't return incomplete data, force recalculation

            file_stat = self._stat_file(normalized_path)
            if file_stat is None:
                # Remove stale entry if necessary
                if normalized_path in self._data:
                    self._data.pop(normalized_path, None)
                    self._save()
                return None

            print(f"[LoRAHashCache] Computing hashes for {os.path.basename(normalized_path)}...")
            file_hashes = self._calculate_hashes(normalized_path)
            if not file_hashes:
                return None

            entry = {
                "hashes": file_hashes,
                "hash": file_hashes.get("sha256"),  # Keep legacy field for compatibility
                "mtime": file_stat.st_mtime,
                "size": file_stat.st_size,
                "updated_at": time.time(),
            }
            self._data[normalized_path] = entry
            self._save()
            return file_hashes

    def invalidate(self, file_path: str) -> None:
        normalized_path = os.path.abspath(file_path)
        with self._lock:
            if normalized_path in self._data:
                self._data.pop(normalized_path, None)
                self._save()

    def clear(self) -> None:
        with self._lock:
            self._data.clear()
            self._save()

    def get_hash(self, file_path: str, *, use_cache: bool = True) -> Optional[str]:
        """Return SHA256 hash for *file_path* using persistent cache (legacy compatibility)."""
        hashes = self.get_hashes(file_path, use_cache=use_cache)
        return hashes.get("sha256") if hashes else None

    def get_cache_info(self) -> Dict[str, object]:
        with self._lock:
            return {
                "entries": len(self._data),
                "cache_path": str(self._cache_path),
                "blake3_available": BLAKE3_AVAILABLE,
            }


_default_cache: Optional[LoRAHashCache] = None
_cache_lock = threading.Lock()


def get_cache() -> LoRAHashCache:
    """Return module-level singleton cache instance."""
    global _default_cache
    with _cache_lock:
        if _default_cache is None:
            _default_cache = LoRAHashCache()
        return _default_cache