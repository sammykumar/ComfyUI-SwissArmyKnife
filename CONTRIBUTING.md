# Contributing to ComfyUI-SwissArmyKnife

Welcome to ComfyUI-SwissArmyKnife! This document provides guidelines for contributors and the Copilot coding agent.

## Development Environment Setup

### Dev Container (Recommended)

The easiest way to get started is using the provided dev container with GPU support:

1. **Prerequisites:**
    - Docker with NVIDIA GPU support
    - VS Code with Dev Containers extension
    - NVIDIA GPU drivers

2. **Quick Start:**

    ```bash
    # Open in VS Code and use "Reopen in Container"
    # OR run directly with Docker:
    docker run --gpus all -v $(pwd):/workspaces/repo -p 8188:8188 mmartial/comfyui-nvidia-docker:ubuntu24_cuda12.8-latest
    ```

3. **Start ComfyUI:**
    ```bash
    ./.devcontainer/run-comfy.sh
    # ComfyUI will be available at http://localhost:8188
    ```

### Manual Setup

If you prefer to set up locally:

1. **Install Python dependencies:**

    ```bash
    pip install -e .
    pip install ruff black mypy pytest opencv-python pillow
    ```

2. **Install JavaScript tooling:**

    ```bash
    cd web
    npm install
    ```

3. **Install FFmpeg:**

    ```bash
    # Ubuntu/Debian
    sudo apt-get install ffmpeg

    # macOS
    brew install ffmpeg
    ```

## Development Workflow

### Python Backend Development

The backend nodes are located in `nodes/`:

- `nodes/nodes.py` - Main Gemini AI integration nodes
- `nodes/helper_nodes.py` - Helper/utility nodes
- `nodes/lora_manager/` - LoRA Manager (forked from nd-super-nodes)

**Development commands:**

```bash
# Lint Python code
ruff check .
ruff check --fix .  # Auto-fix issues

# Format Python code
black .

# Type checking
mypy .

# Run tests
pytest

# Test imports work
python -c "from nodes.nodes import NODE_CLASS_MAPPINGS; print('Nodes:', list(NODE_CLASS_MAPPINGS.keys()))"
```

### JavaScript Web Extension Development

The web extension consists of plain JavaScript widgets in `web/`:

- `web/js/gemini_widgets.js` - Main widget implementation
- `web/css/gemini_widgets.css` - Widget styling

**No build step required** - files are loaded directly by ComfyUI.

**Development commands:**

```bash
cd web

# Lint JavaScript
npm run lint
npm run lint:fix  # Auto-fix issues

# Format code
npm run format

# Test (Playwright tests)
cd tests
npm test
```

**Important:** After making changes to JavaScript files, refresh the browser cache in ComfyUI to see changes.

### Pre-commit Hooks

This project uses pre-commit hooks to maintain code quality:

```bash
# Install hooks
pre-commit install

# Run manually
pre-commit run --all-files

# Skip hooks (for testing)
git commit --no-verify
```

## Testing

### Python Testing

```bash
pytest  # Run all Python tests
```

### JavaScript Testing

```bash
cd web/tests
npm test  # Run Playwright tests against hosted ComfyUI
```

**Note:** JavaScript tests require a running ComfyUI server with the custom node installed.

## Code Style Guidelines

### Python

- Use `ruff` for linting (configured in `pyproject.toml`)
- Use `black` for formatting
- Follow type hints with `mypy`
- Maximum line length: 140 characters

### JavaScript

- Use ESLint for linting
- Use Prettier for formatting
- Follow ComfyUI widget conventions
- No build step - plain JavaScript files

## Project Structure

```
comfyui_swissarmyknife/
├── .devcontainer/          # Dev container configuration
│   ├── devcontainer.json   # Main dev container config
│   ├── postCreate.sh       # Setup script
│   └── run-comfy.sh        # ComfyUI start script
├── nodes/                  # Python backend nodes
│   ├── nodes.py           # Main Gemini AI nodes
│   ├── helper_nodes.py    # Helper nodes
│   └── lora_manager/      # LoRA Manager (forked from nd-super-nodes)
│       ├── __init__.py
│       ├── nd_super_lora_node.py
│       ├── lora_utils.py
│       ├── civitai_service.py
│       ├── template_manager.py
│       ├── web_api.py
│       ├── file_api.py
│       └── version_utils.py
├── web/                   # JavaScript web extension
│   ├── js/                # Widget JavaScript files
│   │   └── lora_manager/  # LoRA Manager web extension
│   ├── css/               # Widget CSS files
│   │   └── lora_manager/  # LoRA Manager styles
│   ├── tests/             # Playwright tests
│   └── package.json       # Node.js dependencies
├── docs/                  # Project documentation
│   └── LORA_MANAGER_INTEGRATION.md  # LoRA Manager docs
├── __init__.py            # ComfyUI entry point
├── pyproject.toml         # Python project configuration
└── README.md              # Project documentation
```

## ComfyUI Integration

### Backend Nodes

- Exported via `NODE_CLASS_MAPPINGS` and `NODE_DISPLAY_NAME_MAPPINGS` in `__init__.py`
- Require ComfyUI server restart after changes

### Web Extension

- Loaded via `WEB_DIRECTORY = "./web"` in `__init__.py`
- Changes require browser cache refresh only

## CI/CD

### Continuous Integration

- Automated linting and testing via GitHub Actions
- **No GPU required** for CI - only static analysis
- Runs on Python and JavaScript code changes

### Publishing

- Automatic publishing to ComfyUI Registry via GitHub Actions
- Triggered by `pyproject.toml` version updates
- Requires `REGISTRY_ACCESS_TOKEN` secret

## Common Tasks

### Adding a New Python Node

1. Add node class to `nodes/nodes.py` or `nodes/helper_nodes.py`
2. Export in `NODE_CLASS_MAPPINGS`
3. Add tests in `tests/` directory
4. Update documentation

### Adding JavaScript Widgets

1. Add widget code to `web/js/`
2. Add styling to `web/css/`
3. Register with ComfyUI using `app.registerExtension()`
4. Test with browser refresh

### Working with LoRA Manager

The LoRA Manager is a forked sub-module from [nd-super-nodes](https://github.com/HenkDz/nd-super-nodes). See [docs/LORA_MANAGER_INTEGRATION.md](docs/LORA_MANAGER_INTEGRATION.md) for detailed information.

**Key files:**

- Backend: `nodes/lora_manager/*.py`
- Frontend: `web/js/lora_manager/extension.js`
- Styles: `web/css/lora_manager/style.css`

**Testing lora_manager:**

```bash
# Test imports
python -c "from nodes.lora_manager import NODE_CLASS_MAPPINGS; print('LoRA Manager nodes:', list(NODE_CLASS_MAPPINGS.keys()))"

# With ComfyUI running, check console for:
# "Swiss Army Knife LoRA Manager: API routes registered"
```

### Running Local Tests

```bash
# Python
python -c "from nodes.nodes import NODE_CLASS_MAPPINGS; print('Available nodes:', list(NODE_CLASS_MAPPINGS.keys()))"
ruff check .
pytest

# JavaScript
cd web
npm run lint
cd tests && npm test  # Requires running ComfyUI server
```

## Copilot Coding Agent Guidelines

For the GitHub Copilot coding agent working on this repository:

### Safe Commands to Run

```bash
# Linting (fast, safe)
ruff check .
ruff check --fix .

# Testing imports (fast)
python -c "from nodes.nodes import NODE_CLASS_MAPPINGS; print(list(NODE_CLASS_MAPPINGS.keys()))"

# JavaScript linting
cd web && npm run lint

# Run tests
pytest
cd web/tests && npm test
```

### Expected Timeouts

- `ruff check .`: < 1 second
- `pip install -e .`: ~12 seconds
- `pip install opencv-python`: 2-3 minutes (large downloads)
- `npm install`: ~40 seconds
- `pytest`: < 30 seconds

### Key Development Points

- Backend changes require ComfyUI server restart
- Web extension changes require browser cache refresh only
- JavaScript widgets are plain JS files (no build step)
- Focus on minimal, surgical changes
- Use pre-commit hooks to maintain quality

## Getting Help

- Check existing issues on GitHub
- Review ComfyUI custom node documentation: https://docs.comfy.org/custom-nodes/overview
- Review `docs/README.md` for the latest project status notes

## License

This project is licensed under the GNU General Public License v3. See `LICENSE` for details.
