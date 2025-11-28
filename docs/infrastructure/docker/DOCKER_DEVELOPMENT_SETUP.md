# Docker Development Environment Setup

This guide explains how to set up a local ComfyUI development environment using Docker for testing your ComfyUI-SwissArmyKnife custom nodes without affecting your production setup.

## Overview

The Docker development environment provides:

- **CPU-only ComfyUI**: No GPU drivers needed, perfect for UI and functionality testing
- **Isolated environment**: Won't interfere with your production ComfyUI installation
- **Auto-mounted custom nodes**: Your custom nodes are automatically available in ComfyUI
- **Environment variable integration**: Automatically uses your API keys from `.env` file
- **Fresh start capability**: Easy to rebuild if something breaks

## Quick Start

### 1. Set up environment variables

```bash
# Copy the environment template (if it doesn't exist)
cp .env.example .env

# Edit .env and add your actual API key
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
```

### 2. Start the development environment

```bash
# Build and start ComfyUI in Docker
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access ComfyUI

- Open your browser to: **http://localhost:8188**
- Your custom nodes will be automatically loaded
- The Gemini API key will be automatically populated from your `.env` file

### 4. Stop the environment

```bash
# Stop the containers
docker-compose down

# Stop and remove volumes (for complete reset)
docker-compose down -v
```

## Environment Variable Configuration

### Automatic API Key Loading

Your custom nodes now **automatically use environment variables**:

- **Environment variable**: `GEMINI_API_KEY` from your `.env` file
- **Docker integration**: Passed through `docker-compose.yml` to the container
- **Node integration**: Automatically populates the `gemini_api_key` field in your nodes
- **Fallback**: Shows `"YOUR_GEMINI_API_KEY_HERE"` if no environment variable is found

### Security Benefits

- **No hardcoded keys**: API keys never committed to version control
- **Local development**: Each developer can use their own API keys
- **Environment isolation**: Development and production keys stay separate

## File Structure & Volume Mounts

### Docker Setup Files

```
├── docker-compose.yml     # Docker service configuration
├── Dockerfile            # ComfyUI container setup
├── .env                  # Your API keys (not committed to git)
└── .env.example         # Template for environment variables
```

### Volume Mounts

```yaml
# In docker-compose.yml
volumes:
    # Your custom nodes mounted into ComfyUI
    - .:/workspace/ComfyUI/custom_nodes/ComfyUI-SwissArmyKnife
```

This mounts your **entire project directory** into the ComfyUI container, making your custom nodes immediately available.

### Directory Structure Inside Container

```
/workspace/ComfyUI/                              # ComfyUI installation
├── custom_nodes/
│   └── ComfyUI-SwissArmyKnife/                 # Your mounted project
│       ├── nodes/nodes.py                      # Your custom nodes
│       ├── web/js/gemini_widgets.js           # Your JavaScript widgets
│       └── __init__.py                        # ComfyUI integration
├── models/                                     # ComfyUI models (in container only)
├── input/                                      # Input files (in container only)
└── output/                                     # Generated outputs (in container only)
```

## Development Workflow

### Making Changes to Custom Nodes

#### Python Backend Changes

1. **Edit** your Python files in `nodes/nodes.py` or related files
2. **Restart** the container to see changes:
    ```bash
    docker-compose restart
    ```
3. **Refresh** ComfyUI in your browser

#### JavaScript Widget Changes

1. **Edit** your JavaScript files in `web/js/gemini_widgets.js`
2. **Refresh** your browser (no container restart needed)
3. **Clear cache** if changes don't appear immediately

### Testing Your Custom Nodes

1. **Load workflows**: Import test workflows that use your custom nodes
2. **Check API integration**: Verify Gemini API calls work with your environment variables
3. **Test UI components**: Ensure widgets and interfaces function correctly
4. **Validate outputs**: Confirm your nodes produce expected results

### Debugging

#### View Container Logs

```bash
# View real-time logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f comfyui
```

#### Access Container Shell

```bash
# Get shell access to running container
docker-compose exec comfyui bash

# Check Python environment
python3 -c "import os; print(os.environ.get('GEMINI_API_KEY', 'Not found'))"
```

#### Common Issues

**Container won't start:**

- Check that port 8188 isn't already in use: `lsof -i :8188`
- Ensure Docker has enough resources allocated

**Custom nodes not loading:**

- Verify your `.env` file has the correct `GEMINI_API_KEY`
- Check container logs for Python import errors
- Ensure all dependencies are listed in `pyproject.toml`

**API key not working:**

- Verify the environment variable is set: `echo $GEMINI_API_KEY`
- Check the `.env` file format (no quotes around the value)
- Restart the container after changing `.env`

## VS Code Integration

You can create VS Code tasks for common Docker operations:

### .vscode/tasks.json

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Docker: Start ComfyUI Dev Environment",
            "type": "shell",
            "command": "docker-compose up --build",
            "group": "build",
            "problemMatcher": [],
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            }
        },
        {
            "label": "Docker: Stop ComfyUI Dev Environment",
            "type": "shell",
            "command": "docker-compose down",
            "group": "build",
            "problemMatcher": []
        },
        {
            "label": "Docker: Restart ComfyUI (after Python changes)",
            "type": "shell",
            "command": "docker-compose restart",
            "group": "build",
            "problemMatcher": []
        }
    ]
}
```

## Production vs Development

### Development Environment (This Setup)

- **Purpose**: Testing custom nodes and UI functionality
- **Performance**: CPU-only, slower generation
- **Isolation**: Completely separate from production
- **API keys**: Local environment variables
- **Models**: Minimal/none installed

### Production Environment

- **Purpose**: Actual image/video generation
- **Performance**: GPU-accelerated
- **Persistence**: Permanent installation
- **API keys**: Production API keys
- **Models**: Full model library

## Advanced Configuration

### Custom ComfyUI Version

To use a specific ComfyUI version, modify the Dockerfile:

```dockerfile
# Use specific commit instead of latest
RUN git clone https://github.com/comfyanonymous/ComfyUI.git && \
    cd ComfyUI && \
    git checkout SPECIFIC_COMMIT_HASH
```

### Additional Dependencies

Add custom dependencies to the Dockerfile:

```dockerfile
# Install additional Python packages
RUN pip3 install --no-cache-dir \
    your-custom-package \
    another-dependency
```

### Port Configuration

Change the port in `docker-compose.yml` if 8188 conflicts:

```yaml
ports:
    - '8189:8188' # Use port 8189 instead
```

## Security Notes

- **Never commit `.env`**: Contains sensitive API keys
- **Use development keys**: Don't use production API keys in development
- **Limit API access**: Consider API key restrictions/quotas for development
- **Container isolation**: The container runs as root - keep it isolated

## Cleanup

### Remove All Docker Resources

```bash
# Stop and remove containers, networks, and volumes
docker-compose down -v

# Remove Docker images (optional)
docker rmi $(docker images -q comfyui-swiss-army-knife*)

# Clean up Docker system (optional)
docker system prune -a
```

This setup provides a clean, isolated environment for developing and testing your ComfyUI custom nodes without affecting your production workflow.
