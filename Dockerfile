FROM python:3.11-slim

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    wget \
    ffmpeg \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Create workspace directory
WORKDIR /workspace

# Clone ComfyUI
RUN git clone https://github.com/comfyanonymous/ComfyUI.git

# Set ComfyUI as working directory
WORKDIR /workspace/ComfyUI

# Install PyTorch CPU version first
RUN pip install --no-cache-dir \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install ComfyUI dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install additional dependencies needed for ComfyUI-SwissArmyKnife
RUN pip install --no-cache-dir \
    google-genai \
    opencv-python

# Create directories for models and custom nodes if they don't exist
RUN mkdir -p models custom_nodes input output

# Expose ComfyUI port
EXPOSE 8188

# Default command (can be overridden in docker-compose.yml)
CMD ["python", "main.py", "--listen", "0.0.0.0", "--port", "8188", "--cpu"]