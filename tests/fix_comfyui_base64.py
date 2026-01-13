#!/usr/bin/env python3
"""Fix ComfyUI base64 payloads by locating the real JPEG start and writing a preview.

This script accepts a base64 string (or a path to a file containing it) and
attempts to find the JPEG magic bytes (FF D8 FF). When found it writes the
JPEG data starting at that offset to an output file (default: `preview.jpg`).
"""

import argparse
import base64
import sys
from typing import Optional


def find_jpeg_start(data: bytes) -> Optional[int]:
    """Find where JPEG data actually starts (FF D8 FF magic bytes).

    Returns the index where 0xFF 0xD8 0xFF sequence begins or None if not found.
    """
    for i in range(len(data) - 2):
        if data[i] == 0xFF and data[i + 1] == 0xD8 and data[i + 2] == 0xFF:
            return i
    return None


def _strip_data_uri_prefix(s: str) -> str:
    if s.startswith("data:") and "," in s:
        return s.split(",", 1)[1]
    return s


def _read_input(input_arg: Optional[str]) -> str:
    """Read base64 from a file, from stdin (if input_arg is '-') or treat the
    argument as the base64 content itself."""
    if input_arg is None:
        return sys.stdin.read().strip()

    if input_arg == "-":
        return sys.stdin.read().strip()

    try:
        with open(input_arg, "r", encoding="utf-8") as fh:
            return fh.read().strip()
    except FileNotFoundError:
        # Not a file path — treat as literal base64
        return input_arg.strip()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Locate JPEG start inside a ComfyUI base64 payload and write a preview image."
    )
    parser.add_argument(
        "input",
        nargs="?",
        help="Path to file with base64 or raw base64 string. Use '-' or omit to read stdin.",
    )
    parser.add_argument("-o", "--out", default="preview.jpg", help="Output image path")
    parser.add_argument(
        "--print-hex",
        action="store_true",
        help="Print first 32 decoded bytes in hex for debugging",
    )
    args = parser.parse_args()

    raw = _read_input(args.input)
    raw = _strip_data_uri_prefix(raw)

    try:
        full_bytes = base64.b64decode(raw)
    except Exception as e:
        print(f"Error decoding base64: {e}", file=sys.stderr)
        sys.exit(2)

    print(f"Total decoded bytes: {len(full_bytes)}")

    if args.print_hex:
        print("\nFirst 32 bytes:")
        for i in range(min(32, len(full_bytes))):
            print(f"Byte {i:2d}: 0x{full_bytes[i]:02X} ({full_bytes[i]:3d})")

    jpeg_start = find_jpeg_start(full_bytes)
    if jpeg_start is not None:
        print(f"\n✅ Found JPEG header at byte {jpeg_start}!")
        image_bytes = full_bytes[jpeg_start:]
        try:
            with open(args.out, "wb") as fh:
                fh.write(image_bytes)
        except Exception as e:
            print(f"Error writing output file: {e}", file=sys.stderr)
            sys.exit(3)
        print(f"Saved {len(image_bytes)} bytes to {args.out}")
        sys.exit(0)

    print("\n❌ Could not find JPEG header (FF D8 FF) in decoded payload", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
