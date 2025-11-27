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
    
from nodes.debug_utils import setup_logging, get_logger

setup_logging()
logger = get_logger(__name__)
    if not os.path.exists(requirements_path):
        print("[ComfyUI-SwissArmyKnife] requirements.txt not found, skipping installation")
        return
    
    print("[ComfyUI-SwissArmyKnife] Installing dependencies from requirements.txt...")
    
        logger.warning("[ComfyUI-SwissArmyKnife] requirements.txt not found, skipping installation")
        subprocess.check_call(
    logger.info("[ComfyUI-SwissArmyKnife] Installing dependencies from requirements.txt...")
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("[ComfyUI-SwissArmyKnife] ✓ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"[ComfyUI-SwissArmyKnife] ✗ Failed to install dependencies: {e}")
        print("[ComfyUI-SwissArmyKnife] Please manually run: pip install -r requirements.txt")
        logger.info("[ComfyUI-SwissArmyKnife] ✓ Dependencies installed successfully")

        logger.error(f"[ComfyUI-SwissArmyKnife] ✗ Failed to install dependencies: {e}")
        logger.error("[ComfyUI-SwissArmyKnife] Please manually run: pip install -r requirements.txt")
    install_requirements()
