# ComfyUI-SwissArmyKnife - Copilot Coding Agent Instructions

This file provides specific guidance for the GitHub Copilot coding agent when working on the ComfyUI-SwissArmyKnife repository.

## Quick Reference

### Repository Structure

-   **Python Backend**: `utils/nodes.py`, `utils/helper_nodes.py` - Gemini AI video/image analysis nodes
-   **JavaScript Web Extension**: `web/js/gemini_widgets.js`, `web/css/gemini_widgets.css` - ComfyUI widgets
-   **Dev Container**: `.devcontainer/` - GPU-enabled development environment using `mmartial/comfyui-nvidia-docker`
-   **Configuration**: `pyproject.toml` - Python project config with dev dependencies

### Safe Agent Commands

**Always safe and fast (< 5 seconds):**

```bash
# Python linting
ruff check .
ruff check --fix .

# Test Python imports
python -c "from utils.nodes import NODE_CLASS_MAPPINGS; print('✓ Nodes:', list(NODE_CLASS_MAPPINGS.keys()))"

# JavaScript linting
cd web && npm run lint

# Check file structure
ls -la web/js/ && ls -la web/css/
```

**Dependency installation (set timeouts appropriately):**

```bash
# Basic Python setup (12 seconds)
pip install -e .

# ML dependencies (2-3 minutes - SET TIMEOUT 300+ seconds)
pip install opencv-python pillow

# Dev tools (30 seconds)
pip install ruff black mypy pytest

# Node.js dependencies (40 seconds - SET TIMEOUT 60+ seconds)
cd web && npm install
```

**Testing:**

```bash
# Python tests (< 30 seconds)
pytest

# JavaScript tests (requires running ComfyUI server)
cd web/tests && npm test
```

## Development Environment

### Dev Container Setup

The repository includes a complete dev container configuration:

-   **Image**: `mmartial/comfyui-nvidia-docker:ubuntu24_cuda12.8-latest`
-   **GPU Support**: `--gpus all` for CUDA acceleration
-   **Auto Setup**: `.devcontainer/postCreate.sh` installs all dependencies
-   **ComfyUI Integration**: Repository is symlinked to `/opt/ComfyUI/custom_nodes/comfyui_swissarmyknife`

### Local Development Commands

```bash
# Start dev container setup
./.devcontainer/postCreate.sh

# Start ComfyUI with custom nodes
./.devcontainer/run-comfy.sh
# → Available at http://localhost:8188
```

## Code Quality & Linting

### Python (Backend)

```bash
# Lint (very fast < 1 second)
ruff check .

# Auto-fix issues
ruff check --fix .

# Format code
black .

# Type checking
mypy .
```

**Expected warnings to ignore:**

-   Unused imports in `__init__.py` files (intentional for ComfyUI integration)
-   Some import-related warnings in UI backup files

### JavaScript (Web Extension)

```bash
cd web

# Lint JavaScript
npm run lint
npm run lint:fix

# Format code
npm run format
```

**No build step required** - JavaScript widgets are plain JS files loaded directly by ComfyUI.

## Testing Strategy

### Python Backend Testing

```bash
# Verify nodes load correctly
python -c "from utils.nodes import NODE_CLASS_MAPPINGS; print('Available nodes:', list(NODE_CLASS_MAPPINGS.keys()))"

# Expected output: ['GeminiUtilVideoDescribe', 'GeminiUtilImageDescribe', 'GeminiUtilMediaDescribe']

# Run existing tests
pytest
```

### JavaScript Web Extension Testing

```bash
# Playwright tests (requires running ComfyUI server)
cd web/tests
npm test
```

### System Dependencies Validation

```bash
# Verify FFmpeg (required for video processing)
ffmpeg -version | head -1

# Verify Python ML libraries
python -c "import cv2, PIL; print('✓ OpenCV and PIL available')"
```

## File Change Guidelines

### Python Changes

-   **Scope**: Modify files in `utils/` directory only for backend changes
-   **Restart Required**: ComfyUI server must be restarted after Python changes
-   **Testing**: Always run `python -c "from utils.nodes import NODE_CLASS_MAPPINGS; print(list(NODE_CLASS_MAPPINGS.keys()))"` after changes

### JavaScript Changes

-   **Scope**: Modify files in `web/js/` and `web/css/` directories
-   **No Build Step**: Files are loaded directly by ComfyUI
-   **Testing**: Browser cache refresh required to see changes in ComfyUI

### Configuration Changes

-   `pyproject.toml`: Python project metadata, dependencies, and tool configuration
-   `web/package.json`: JavaScript development dependencies and scripts
-   `.devcontainer/`: Development environment configuration

## CI/CD Integration

### GitHub Actions

-   **Static Analysis Only**: CI does not require GPU - runs linting, type checking, and tests
-   **Automatic Publishing**: Updates to `pyproject.toml` trigger publishing to ComfyUI Registry
-   **Required Secret**: `REGISTRY_ACCESS_TOKEN` for registry publishing

### Pre-commit Hooks

```bash
# Install hooks
pre-commit install

# Run manually on all files
pre-commit run --all-files

# Skip for emergency commits
git commit --no-verify
```

## Architecture Notes

### ComfyUI Integration Points

-   **Backend Entry**: `__init__.py` exports `NODE_CLASS_MAPPINGS`, `NODE_DISPLAY_NAME_MAPPINGS`, `WEB_DIRECTORY`
-   **Web Directory**: `WEB_DIRECTORY = "./web"` tells ComfyUI where to find JavaScript/CSS files
-   **Node Registration**: Python nodes are automatically loaded via the mappings
-   **Widget Registration**: JavaScript widgets register via `app.registerExtension()`

### Current Node Implementations

-   **GeminiUtilVideoDescribe**: Video analysis using Google Gemini AI
-   **GeminiUtilImageDescribe**: Image analysis using Google Gemini AI
-   **GeminiUtilMediaDescribe**: Multi-media analysis functionality
-   **Helper Nodes**: Additional utility nodes in `utils/helper_nodes.py`

## Performance Notes

### Expected Command Timing

-   `ruff check .`: < 1 second (very fast)
-   `pip install -e .`: ~12 seconds (basic dependencies)
-   `pip install opencv-python`: 2-3 minutes (large ML binaries)
-   `npm install`: ~40 seconds (JavaScript dependencies)
-   `pytest`: < 30 seconds (minimal test suite)

### Memory and GPU Usage

-   **Development**: GPU passthrough via dev container for testing
-   **CI/CD**: No GPU required - static analysis only
-   **Production**: GPU acceleration available for Gemini AI processing

## Troubleshooting

### Common Issues

1. **Python Import Errors**: Missing dependencies (opencv-python, pillow, google-genai)
2. **JavaScript Widget Not Loading**: Browser cache needs refresh after changes
3. **ComfyUI Not Finding Nodes**: Check symlink in `/opt/ComfyUI/custom_nodes/comfyui_swissarmyknife`
4. **FFmpeg Not Found**: Install via `apt-get install ffmpeg` or similar

### Debug Commands

```bash
# Check Python environment
python -c "import sys; print('Python path:', sys.path)"

# Verify symlink in dev container
ls -la /opt/ComfyUI/custom_nodes/comfyui_swissarmyknife

# Check ComfyUI web directory registration
python -c "import __init__; print('WEB_DIRECTORY:', __init__.WEB_DIRECTORY)"
```

## Agent Workflow Recommendations

1. **Start with linting**: Always run `ruff check .` first to understand current state
2. **Test imports early**: Verify Python nodes load before making changes
3. **Make minimal changes**: Focus on surgical modifications rather than large refactors
4. **Test incrementally**: Run tests after each logical change
5. **Use pre-commit**: Let automation catch style issues
6. **Document changes**: Update this file if workflow changes

## References

-   [ComfyUI Custom Node Documentation](https://docs.comfy.org/custom-nodes/overview)
-   [mmartial/ComfyUI-Nvidia-Docker](https://github.com/mmartial/ComfyUI-Nvidia-Docker)
-   [GitHub Copilot Agent Customization](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment)
-   [Dev Container Specification](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers)
