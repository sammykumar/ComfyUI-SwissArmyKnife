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
from pathlib import Path
from typing import Dict, Optional

import hashlib


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

    def _calculate_hash(self, file_path: str) -> Optional[str]:
        sha = hashlib.sha256()
        try:
            with open(file_path, "rb") as fh:
                for chunk in iter(lambda: fh.read(1024 * 1024), b""):
                    sha.update(chunk)
        except FileNotFoundError:
            print(f"[LoRAHashCache] File missing during hashing: {file_path}")
            return None
        except OSError as exc:
            print(f"[LoRAHashCache] Error hashing '{file_path}': {exc}")
            return None

        return sha.hexdigest().upper()

    def get_hash(self, file_path: str, *, use_cache: bool = True) -> Optional[str]:
        """Return SHA256 hash for *file_path* using persistent cache."""
        normalized_path = os.path.abspath(file_path)

        with self._lock:
            entry = self._data.get(normalized_path)
            if use_cache and entry and self._is_entry_valid(normalized_path, entry):
                return entry.get("hash")  # type: ignore[return-value]

            file_stat = self._stat_file(normalized_path)
            if file_stat is None:
                # Remove stale entry if necessary
                if normalized_path in self._data:
                    self._data.pop(normalized_path, None)
                    self._save()
                return None

            file_hash = self._calculate_hash(normalized_path)
            if not file_hash:
                return None

            entry = {
                "hash": file_hash,
                "mtime": file_stat.st_mtime,
                "size": file_stat.st_size,
                "updated_at": time.time(),
            }
            self._data[normalized_path] = entry
            self._save()
            return file_hash

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

    def get_cache_info(self) -> Dict[str, object]:
        with self._lock:
            return {
                "entries": len(self._data),
                "cache_path": str(self._cache_path),
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