"""
Installation script for ComfyUI-SwissArmyKnife custom nodes.
This script is automatically run by ComfyUI-Manager during node installation.
"""
import subprocess
import sys
import os


def install_requirements():
    """Install required packages from requirements.txt"""
    requirements_path = os.path.join(os.path.dirname(__file__), "requirements.txt")

    if not os.path.exists(requirements_path):
        print("[ComfyUI-SwissArmyKnife] requirements.txt not found, skipping installation")
        return

    print("[ComfyUI-SwissArmyKnife] Installing dependencies from requirements.txt...")

    try:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "-r", requirements_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("[ComfyUI-SwissArmyKnife] ✓ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"[ComfyUI-SwissArmyKnife] ✗ Failed to install dependencies: {e}")
        print("[ComfyUI-SwissArmyKnife] Please manually run: pip install -r requirements.txt")
        sys.exit(1)


if __name__ == "__main__":
    install_requirements()
