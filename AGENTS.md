# ComfyUI-SwissArmyKnife - ComfyUI Extension Development Guide

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Official ComfyUI Documentation

For technical implementation details, reference these official ComfyUI custom node development guides:

- **Backend (Python) Development**: https://docs.comfy.org/custom-nodes/backend/server_overview
- **Web Extension (JavaScript) Development**: https://docs.comfy.org/custom-nodes/js/javascript_overview
- **Lite Graph (ComfyUi is built on top of Lite Graph)**:https://github.com/jagenjo/litegraph.js/tree/master

_Note: These are the official JavaScript widget docs, not React-based extensions._

## Project Overview

ComfyUI-SwissArmyKnife is a ComfyUI extension that consists of two essential components that work together:

### Backend (Python Custom Nodes)

- Python custom nodes in `nodes/*.py` for Gemini AI video analysis and processing
- Core business logic and AI integration
- Requires ComfyUI server restart when modified

### Web Extension (JavaScript Widgets)

- Plain JavaScript widgets in `./web/js/` for enhanced ComfyUI interaction
- UI components and client-side functionality
- Requires browser cache refresh when modified

### Additional Components

- ~~React/TypeScript UI extension with internationalization~~ **DISABLED FOR NOW**
- GitHub Actions for automated building and publishing
- Playwright tests in `./web/tests/` for testing against hosted ComfyUI server
- Documentation in `docs/` directory - organized into categorized folders (see Documentation Organization section)

**IMPORTANT**: Both backend and web extension components are required for the custom node to function properly. Changes to backend Python files require restarting the ComfyUI server, while changes to web JavaScript files require refreshing the browser cache.

**DOCUMENTATION REQUIREMENT**: All documentation, guides, troubleshooting notes, implementation details, and technical specifications must be added to the appropriate folder in the `docs/` directory. The documentation is organized by category - see the "Documentation Organization" section below for the proper folder structure. Never document directly in code comments when a separate documentation file would be more appropriate. Always attempt to update documentation for existing markdown files before creating new ones.

**Note: The React UI component (`ui-react_backup/`) is currently disabled and not in active development.**

## Documentation Organization

**All project documentation is organized in a streamlined folder structure:**

```
docs/
├── README.md                    # Main documentation index and navigation
├── IMPLEMENTATION_STATUS.md     # Overall project status
│
├── nodes/                       # Node-specific documentation (ONE file per node)
│   ├── video-preview/          # Video Preview node
│   │   ├── README.md           # Quick reference
│   │   └── VIDEO_PREVIEW.md    # Complete documentation
│   ├── video-metadata/         # Video Metadata node
│   │   ├── README.md           # Quick reference
│   │   └── VIDEO_METADATA.md   # Complete documentation
│   ├── media-describe/         # Gemini AI Media Description
│   ├── reddit-media/           # Reddit Media Extraction
│   ├── media-selection/        # Media Selection node
│   └── control-panel/          # Control Panel Display
│
├── infrastructure/              # Infrastructure & system components
│   ├── caching/                # Caching system
│   ├── debug/                  # Debug & logging
│   ├── docker/                 # Docker setup
│   └── build-deploy/           # Build & deployment
│
├── integrations/                # External service integrations
│   └── civitai/                # CivitAI API integration
│
├── web-js/                      # Web JavaScript widget documentation
└── examples/                    # Example workflows
```

### Documentation Rules

1. **Node-specific docs** → `docs/nodes/[node-name]/` - **ONE comprehensive file per node**
2. **Infrastructure docs** → `docs/infrastructure/[category]/`
3. **Integration docs** → `docs/integrations/[service]/`
4. **Web JavaScript widget docs** → `docs/web-js/`
5. **Examples** → `docs/examples/`
6. **ComfyUI help pages** → every registered node **must** have a matching help markdown file inside `web/docs/`. The filename must match the node key from `NODE_CLASS_MAPPINGS` (e.g., `web/docs/VACEScribbleAnnotator.md`). Use the help page template described at https://docs.comfy.org/custom-nodes/help_page and keep its content in sync with the canonical node doc under `docs/nodes/...`.

#### ComfyUI Help Page Structure

```
web/
└── docs/
    ├── NodeName.md        # Default help page loaded in ComfyUI
    ├── NodeName/en.md     # (Optional) locale-specific overrides
    └── NodeName/zh.md
```

- At minimum provide headings for **Summary**, **Inputs**, **Outputs**, **Usage Tips**, and link back to the full documentation under `docs/`.
- If you update a node’s behavior, update both the canonical doc (`docs/nodes/...`) **and** the corresponding `web/docs/NodeName.md` help file in the same PR.

### Finding Documentation

- **Start here**: `docs/README.md` - Main index with links to all categories
- **Category indexes**: Each folder has a `README.md` listing all files
- **By node**: `docs/nodes/[node-name]/README.md` for quick reference
- **Complete node docs**: `docs/nodes/[node-name]/[NODE_NAME].md` for comprehensive documentation
- **By topic**: Browse appropriate category folder

## Working Effectively

### Virtual Environment Activation

**CRITICAL**: Always activate the virtual environment before running any Python commands:

```bash
# Activate virtual environment (REQUIRED for all Python operations)
source /Users/samkumar/Development/dev-lab-hq/ai-image-hub/apps/comfyui-swiss-army-knife/.venv/bin/activate

# Or use relative path if in project root:
source .venv/bin/activate

# Verify activation (you should see (.venv) in your prompt)
which python3  # Should show path inside .venv directory
```

**IMPORTANT**: Run the activation command before:

- Installing Python packages (`pip3 install`)
- Running Python scripts or commands
- Running tests (`pytest`)
- Linting Python code (`ruff check`)
- Any other Python-related terminal operations

### Essential System Dependencies

Install these system dependencies first:

```bash
# FFmpeg is REQUIRED for video processing functionality
sudo apt-get update && sudo apt-get install -y ffmpeg

# Verify installation
ffmpeg -version  # Should show version 6.1.1 or newer
```

### Bootstrap React UI Development _(DISABLED)_

**⚠️ The React UI component is currently disabled and not in active development.**

```bash
# THESE COMMANDS ARE CURRENTLY DISABLED
# Navigate to React UI directory
# cd ui-react_backup/ui

# Install Node.js dependencies - takes ~40 seconds
# npm install  # NEVER CANCEL: Takes 40 seconds. Set timeout to 60+ seconds.

# Build React extension - takes ~5 seconds
# npm run build  # NEVER CANCEL: Takes 5 seconds. Set timeout to 30+ seconds.
```

### Bootstrap Python Development

```bash
# ALWAYS activate virtual environment first
source .venv/bin/activate

# Install Python package and dependencies
pip3 install -e .  # Takes ~12 seconds for basic dependencies

# Install essential Python dependencies for full functionality
# NEVER CANCEL: Takes 2-3 minutes for torch/opencv. Set timeout to 300+ seconds.
pip3 install torch opencv-python

# Install development tools
pip3 install pytest mypy coverage ruff pre-commit

# Verify Python modules work
python3 -c "from nodes.nodes import NODE_CLASS_MAPPINGS; print('Available nodes:', list(NODE_CLASS_MAPPINGS.keys()))"
# Should output: Available nodes: ['GeminiUtilVideoDescribe']
```

## Development Workflows

### Documentation Workflow

**Documentation is streamlined with ONE comprehensive file per node:**

```bash
# Documentation structure
docs/
├── README.md                    # Main documentation index
├── IMPLEMENTATION_STATUS.md     # Overall project status
├── nodes/                       # Node-specific documentation (ONE file per node)
│   ├── video-preview/
│   │   ├── README.md           # Quick reference
│   │   └── VIDEO_PREVIEW.md    # Complete consolidated documentation
│   ├── video-metadata/
│   │   ├── README.md           # Quick reference
│   │   └── VIDEO_METADATA.md   # Complete consolidated documentation
│   ├── media-describe/         # Gemini AI Media Description docs
│   ├── reddit-media/           # Reddit Media Extraction docs
│   ├── media-selection/        # Media Selection node docs
│   └── control-panel/          # Control Panel Display docs
├── infrastructure/              # Infrastructure components
│   ├── caching/                # Caching system docs
│   ├── debug/                  # Debug & logging docs
│   ├── docker/                 # Docker setup docs
│   └── build-deploy/           # Build & deployment docs
├── integrations/                # External service integrations
│   └── civitai/                # CivitAI API integration docs
├── web-js/                      # Web JavaScript widget documentation
└── examples/                    # Example workflows
```

**Adding New Documentation:**

```bash
# For new nodes - create ONE comprehensive file
touch docs/nodes/[node-name]/[NODE_NAME].md

# Update existing node documentation
vim docs/nodes/[node-name]/[NODE_NAME].md

# For infrastructure documentation
touch docs/infrastructure/[category]/NEW_SYSTEM.md

# For web JavaScript widgets
touch docs/web-js/NEW_WIDGET.md

# For integrations
touch docs/integrations/[service]/NEW_INTEGRATION.md
```

**Documentation file naming convention:**

- **Nodes**: Use descriptive all-caps names: `VIDEO_PREVIEW.md`, `MEDIA_DESCRIBE.md`
- **ONE file per node**: Consolidate all information about a node into a single comprehensive file
- Node docs go in `docs/nodes/[node-name]/`
- Infrastructure docs go in `docs/infrastructure/[category]/`
- Web JavaScript widget docs go in `docs/web-js/`

**CRITICAL**: Whenever you implement a new feature, fix a bug, or solve a technical problem:

1. Identify the correct documentation folder:
    - Node changes → `docs/nodes/[node-name]/` - **Update the single comprehensive file**
    - System changes → `docs/infrastructure/[category]/`
    - Widget changes → `docs/web-js/`
    - Integration work → `docs/integrations/[service]/`
2. **For nodes**: Update the existing comprehensive file or create one if it doesn't exist
3. **For other components**: Create or update documentation with descriptive names
4. Include implementation details, gotchas, and future considerations
5. Update the folder's `README.md` index if needed
6. Reference the documentation file in commit messages
7. Cross-reference related documentation in other folders
5. Reference the documentation file in commit messages
6. Cross-reference related documentation in other folders

### React UI Development _(DISABLED)_

**⚠️ The React UI component is currently disabled and not in active development.**

```bash
# THESE COMMANDS ARE CURRENTLY DISABLED
# cd ui-react_backup/ui

# Development with auto-reload (watches for changes)
# npm run watch

# Build for production
# npm run build  # NEVER CANCEL: Takes 5 seconds. Set timeout to 30+ seconds.

# TypeScript type checking
# npm run typecheck
```

### Backend (Python) Development

```bash
# ALWAYS activate virtual environment first
source .venv/bin/activate

# Import and test Python nodes
python3 -c "from nodes.nodes import NODE_CLASS_MAPPINGS; print(list(NODE_CLASS_MAPPINGS.keys()))"

# Run Python linting (fast, < 1 second)
ruff check .

# Fix auto-fixable linting issues
ruff check --fix .
```

### Web Extension (JavaScript) Development

```bash
# JavaScript widgets are located in ./web/js/
# No build step required - plain JavaScript files

# Verify web extension files exist
ls -la web/js/gemini_widgets.js
ls -la web/css/gemini_widgets.css

# After making changes to JavaScript widgets:
# 1. No compilation needed (plain JS)
# 2. Browser cache refresh required for changes to take effect
```

## Testing

### Backend (Python) Testing

```bash
# ALWAYS activate virtual environment first
source .venv/bin/activate

# Run pytest (currently no tests exist)
pytest  # NEVER CANCEL: Takes < 30 seconds. Set timeout to 60+ seconds.
# Expected: "no tests ran" - this is normal, no tests exist yet

# When adding tests, create them in a tests/ directory
```

### Web Extension Testing

```bash
# Playwright tests for testing against hosted ComfyUI server
cd web/tests/

# Install Playwright dependencies (if not already installed)
npm install

# Run Playwright tests against hosted ComfyUI server
npm test

# Note: Tests require a running ComfyUI server with the custom node installed
```

### React UI Testing _(DISABLED)_

**⚠️ The React UI component is currently disabled and not in active development.**

```bash
# THESE COMMANDS ARE CURRENTLY DISABLED
# cd ui-react_backup/ui

# This command WILL FAIL with ES module errors
# npm test
# Error: "Jest encountered an unexpected token" - this is a known issue

# To add working tests, fix jest.config.js ES module configuration first
```

## Linting and Code Quality

### Python Linting (Works)

```bash
# ALWAYS activate virtual environment first
source .venv/bin/activate

# Fast linting check (< 1 second)
ruff check .

# Fix automatically fixable issues
ruff check --fix .

# Note: Some unused import warnings are expected and can be ignored
# The code functions correctly despite these warnings
```

### React UI Linting _(DISABLED)_

**⚠️ The React UI component is currently disabled and not in active development.**

```bash
# THESE COMMANDS ARE CURRENTLY DISABLED
# cd ui-react_backup/ui

# This will show configuration errors but runs
# npm run lint  # Shows ESLint TypeScript project configuration issues

# Auto-fix formatting issues
# npm run lint:fix

# Format code
# npm run format
```

## Build and Publish Workflow

### Local Build Process _(DISABLED)_

**⚠️ The React UI component is currently disabled and not in active development.**

```bash
# THESE COMMANDS ARE CURRENTLY DISABLED
# Complete build from scratch
# cd ui-react_backup/ui
# npm install  # 40 seconds
# npm run build  # 5 seconds

# Verify built files exist
# ls -la ../dist/example_ext/  # Should show main.js, main.css, etc.
```

### GitHub Actions Publishing

The repository includes automated publishing via `.github/workflows/react-build.yml`:

- Triggers on `pyproject.toml` changes pushed to main branch
- Requires `REGISTRY_ACCESS_TOKEN` secret in repository settings
- Automatically builds React UI and publishes to ComfyUI Registry

## pyproject.toml Specifications

Reference: https://docs.comfy.org/registry/specifications

The `pyproject.toml` file contains two main sections for ComfyUI custom nodes: `[project]` and `[tool.comfy]`.

### [project] Section

#### name (required)

The node id uniquely identifies the custom node and will be used in URLs from the registry. Users can install the node by referencing this name:

```bash
comfy node install <node-id>
```

**Requirements:**

- Must be less than 100 characters
- Can only contain alphanumeric characters, hyphens, underscores, and periods
- Cannot have consecutive special characters
- Cannot start with a number or special character
- Case-insensitive comparison

**Best Practices:**

- Use a short, descriptive name
- Don't include "ComfyUI" in the name
- Make it memorable and easy to type

**Examples:**

```toml
name = "image-processor"      # ✅ Good: Simple and clear
name = "super-resolution"     # ✅ Good: Describes functionality
name = "ComfyUI-enhancer"    # ❌ Bad: Includes ComfyUI
name = "123-tool"            # ❌ Bad: Starts with number
```

#### version (required)

Uses [semantic versioning](https://semver.org/) with a three-digit version number X.Y.Z:

- X (MAJOR): Breaking changes
- Y (MINOR): New features (backwards compatible)
- Z (PATCH): Bug fixes

**Examples:**

```toml
version = "1.0.0"    # Initial release
version = "1.1.0"    # Added new features
version = "1.1.1"    # Bug fix
version = "2.0.0"    # Breaking changes
```

#### license (optional)

Specifies the license for your custom node. Can be specified in two ways:

1. **File Reference:**

```toml
license = { file = "LICENSE" }     # ✅ Points to LICENSE file
license = { file = "LICENSE.txt" } # ✅ Points to LICENSE.txt
license = "LICENSE"                # ❌ Incorrect format
```

2. **License Name:**

```toml
license = { text = "MIT License" }  # ✅ Correct format
license = { text = "Apache-2.0" }   # ✅ Correct format
license = "MIT LICENSE"             # ❌ Incorrect format
```

Common licenses: [MIT](https://opensource.org/license/mit), [GPL](https://www.gnu.org/licenses/gpl-3.0.en.html), [Apache](https://www.apache.org/licenses/LICENSE-2.0)

#### description (recommended)

A brief description of what your custom node does.

```toml
description = "A super resolution node for enhancing image quality"
```

#### repository (required)

Links to the repository:

```toml
[project.urls]
Repository = "https://github.com/username/repository"
```

#### urls (recommended)

Links to related resources:

```toml
[project.urls]
Documentation = "https://github.com/username/repository/wiki"
"Bug Tracker" = "https://github.com/username/repository/issues"
```

#### requires-python (recommended)

Specifies the Python versions that your node supports:

```toml
requires-python = ">=3.8"        # Python 3.8 or higher
requires-python = ">=3.8,<3.11"  # Python 3.8 up to (but not including) 3.11
```

#### Frontend Version Compatibility (optional)

If your node has specific requirements for which ComfyUI frontend versions it supports, you can specify this using the `comfyui-frontend-package` dependency. This package is published on [PyPI](https://pypi.org/project/comfyui-frontend-package/).

Use this field when:

- Your custom node uses frontend APIs that were introduced in a specific version
- You've identified incompatibilities between your node and certain frontend versions
- Your node requires specific UI features only available in newer frontend versions

```toml
[project]
dependencies = [
    "comfyui-frontend-package>=1.20.0"       # Requires frontend 1.20.0 or newer
    "comfyui-frontend-package<=1.21.6"       # Restricts to frontend versions up to 1.21.6
    "comfyui-frontend-package>=1.19,<1.22"   # Works with frontend 1.19 to 1.21.x
    "comfyui-frontend-package~=1.20.0"       # Compatible with 1.20.x but not 1.21.0
    "comfyui-frontend-package!=1.21.3"       # Works with any version except 1.21.3
]
```

#### classifiers (recommended)

Use classifiers to specify operating system compatibility and GPU accelerators. This information is used to help users find the right node for their system.

```toml
[project]
classifiers = [
    # For OS-independent nodes (works on all operating systems)
    "Operating System :: OS Independent",

    # OR for OS-specific nodes, specify the supported systems:
    "Operating System :: Microsoft :: Windows",  # Windows specific
    "Operating System :: POSIX :: Linux",        # Linux specific
    "Operating System :: MacOS",                 # macOS specific

    # GPU Accelerator support
    "Environment :: GPU :: NVIDIA CUDA",    # NVIDIA CUDA support
    "Environment :: GPU :: AMD ROCm",       # AMD ROCm support
    "Environment :: GPU :: Intel Arc",      # Intel Arc support
    "Environment :: NPU :: Huawei Ascend",  # Huawei Ascend support
    "Environment :: GPU :: Apple Metal",    # Apple Metal support
]
```

### [tool.comfy] Section

#### PublisherId (required)

Your unique publisher identifier, typically matching your GitHub username.

**Examples:**

```toml
PublisherId = "john-doe"        # ✅ Matches GitHub username
PublisherId = "image-wizard"    # ✅ Unique identifier
```

#### DisplayName (optional)

A user-friendly name for your custom node.

```toml
DisplayName = "Super Resolution Node"
```

#### Icon (optional)

URL to your custom node's icon that will be displayed on the ComfyUI Registry and ComfyUI-Manager.

**Requirements:**

- File types: SVG, PNG, JPG, or GIF
- Maximum resolution: 400px × 400px
- Aspect ratio should be square

```toml
Icon = "https://raw.githubusercontent.com/username/repo/main/icon.png"
```

#### Banner (optional)

URL to a larger banner image that will be displayed on the ComfyUI Registry and ComfyUI-Manager.

**Requirements:**

- File types: SVG, PNG, JPG, or GIF
- Aspect ratio: 21:9

```toml
Banner = "https://raw.githubusercontent.com/username/repo/main/banner.png"
```

#### requires-comfyui (optional)

Specifies which version of ComfyUI your node is compatible with. This helps users ensure they have the correct version of ComfyUI installed.

**Supported operators:** `<`, `>`, `<=`, `>=`, `~=`, `<>`, `!=` and ranges

**Examples:**

```toml
requires-comfyui = ">=1.0.0"        # ComfyUI 1.0.0 or higher
requires-comfyui = ">=1.0.0,<2.0.0"  # ComfyUI 1.0.0 up to (but not including) 2.0.0
requires-comfyui = "~=1.0.0"         # Compatible release: version 1.0.0 or newer, but not version 2.0.0
requires-comfyui = "!=1.2.3"         # Any version except 1.2.3
requires-comfyui = ">0.1.3,<1.0.0"   # Greater than 0.1.3 and less than 1.0.0
```

#### includes (optional)

Specifies whether to force include certain specific folders. For some situations, such as custom nodes in frontend projects, the final packaged output folder might be included in .gitignore. In such cases, we need to force include it for registry use.

```toml
includes = ['dist']
```

### Complete Example

```toml
[project]
name = "super-resolution-node"
version = "1.0.0"
description = "Enhance image quality using advanced super resolution techniques"
license = { file = "LICENSE" }
requires-python = ">=3.8"
dependencies = [
    "comfyui-frontend-package<=1.21.6"  # Frontend version compatibility
]
classifiers = [
    "Operating System :: OS Independent"  # Works on all operating systems
]
dynamic = ["dependencies"]

[tool.setuptools.dynamic]
dependencies = {file = ["requirements.txt"]}

[project.urls]
Repository = "https://github.com/username/super-resolution-node"
Documentation = "https://github.com/username/super-resolution-node/wiki"
"Bug Tracker" = "https://github.com/username/super-resolution-node/issues"

[tool.comfy]
PublisherId = "image-wizard"
DisplayName = "Super Resolution Node"
Icon = "https://raw.githubusercontent.com/username/super-resolution-node/main/icon.png"
Banner = "https://raw.githubusercontent.com/username/super-resolution-node/main/banner.png"
requires-comfyui = ">=1.0.0"  # ComfyUI version compatibility
```

## Validation Scenarios

### Always validate changes by running these verification steps:

#### Documentation Validation

```bash
# 1. Verify all changes are documented
ls -la docs/  # Check for relevant documentation files

# 2. Ensure documentation is up-to-date
grep -r "TODO\|FIXME\|OUTDATED" docs/  # Should return no results

# 3. Validate markdown formatting
# (Optional: install markdownlint if available)
# markdownlint docs/*.md
```

#### Python Node Validation

```bash
# ALWAYS activate virtual environment first
source .venv/bin/activate

# 1. Import test
python3 -c "from nodes.nodes import NODE_CLASS_MAPPINGS; print('✓ Python imports work')"

# 2. Linting
ruff check .  # Accept unused import warnings as normal

# 3. Verify system dependencies
ffmpeg -version | head -1  # Should show FFmpeg version
```

#### React UI Validation _(DISABLED)_

**⚠️ The React UI component is currently disabled and not in active development.**

```bash
# THESE COMMANDS ARE CURRENTLY DISABLED
# cd ui-react_backup/ui

# 1. Build test
# npm run build  # Should complete in ~5 seconds

# 2. Verify outputs
# ls -la ../dist/example_ext/main.js  # Should exist
# ls -la ../dist/locales/  # Should contain en/ and zh/ directories

# 3. TypeScript check
# npm run typecheck  # Should pass without errors
```

#### Full Integration Test _(PARTIALLY DISABLED)_

**⚠️ React UI components are disabled, but JavaScript widgets remain active.**

```bash
# 1. Clean build (DISABLED - React components only)
# cd ui-react_backup/ui
# rm -rf ../dist/
# npm run build

# 2. Verify ComfyUI integration files
# ls -la ../dist/example_ext/  # React build outputs (DISABLED)
ls -la ../../web/js/  # JavaScript widgets (ACTIVE)
ls -la ../../__init__.py  # Python entry point (ACTIVE)
```

## Known Issues and Limitations

### Jest Testing Configuration

- Jest tests fail due to ES module configuration issues
- Example test exists in `src/__tests__/dummy.test.tsx` but won't run
- Fix requires updating jest.config.js and jest.setup.js for ESM support

### ESLint Configuration

- ESLint shows TypeScript project configuration warnings
- Code builds and runs correctly despite these warnings
- Focus on functional validation rather than linting perfection

### Python Import Warnings

- Ruff reports unused imports in `__init__.py` files
- These imports are intentional for ComfyUI integration
- The warnings can be safely ignored

### System Dependencies

- FFmpeg is required for video processing features
- Without FFmpeg, video-related functionality will fail at runtime
- Always verify FFmpeg is installed in your environment

## Common Tasks

### Documentation Tasks

```bash
# Update node documentation (single comprehensive file)
vim docs/nodes/[node-name]/[NODE_NAME].md

# Create new node documentation
touch docs/nodes/[node-name]/[NODE_NAME].md

# Document infrastructure changes
touch docs/infrastructure/[category]/SYSTEM_NAME.md

# Document web JavaScript widget
touch docs/web-js/WIDGET_NAME.md

# Search for documentation gaps
grep -r "TODO\|FIXME\|INCOMPLETE" docs/

# Browse documentation by category
ls -la docs/nodes/           # Node-specific docs (ONE file per node)
ls -la docs/infrastructure/  # System/infrastructure docs
ls -la docs/integrations/    # External service integrations
ls -la docs/web-js/          # Web JavaScript widget documentation
ls -la docs/examples/        # Example workflows

# View node documentation
cat docs/nodes/video-preview/VIDEO_PREVIEW.md     # Complete video preview docs
cat docs/nodes/video-metadata/VIDEO_METADATA.md   # Complete video metadata docs

# Common documentation patterns:
# - docs/nodes/[node-name]/[NODE_NAME].md - Single comprehensive node documentation
# - docs/nodes/[node-name]/README.md - Quick reference for the node
# - docs/infrastructure/[category]/SYSTEM_NAME.md - Infrastructure documentation
# - docs/integrations/[service]/INTEGRATION_GUIDE.md - Integration guides
# - docs/web-js/WIDGET_NAME.md - Web JavaScript widget documentation
# - docs/IMPLEMENTATION_STATUS.md - Overall project status (root level)
```

### File Structure Overview

```
comfyui_swissarmyknife/
├── .github/workflows/react-build.yml  # CI/CD automation
├── __init__.py                         # Python entry point
├── pyproject.toml                      # Project metadata & publishing config
├── docs/                              # ALL PROJECT DOCUMENTATION (STREAMLINED)
│   ├── README.md                      # Main documentation index
│   ├── IMPLEMENTATION_STATUS.md       # Overall project status
│   ├── nodes/                         # Node-specific documentation (ONE file per node)
│   │   ├── video-preview/            # Video Preview node docs
│   │   │   ├── README.md             # Quick reference
│   │   │   └── VIDEO_PREVIEW.md      # Complete documentation
│   │   ├── video-metadata/           # Video Metadata node docs
│   │   │   ├── README.md             # Quick reference
│   │   │   └── VIDEO_METADATA.md     # Complete documentation
│   │   ├── media-describe/           # Gemini AI Media Description docs
│   │   ├── reddit-media/             # Reddit Media Extraction docs
│   │   ├── media-selection/          # Media Selection node docs
│   │   └── control-panel/            # Control Panel Display docs
│   ├── infrastructure/                # Infrastructure components
│   │   ├── caching/                  # Caching system docs
│   │   ├── debug/                    # Debug & logging docs
│   │   ├── docker/                   # Docker setup docs
│   │   └── build-deploy/             # Build & deployment docs
│   ├── integrations/                  # External service integrations
│   │   └── civitai/                  # CivitAI API integration docs
│   ├── web-js/                        # Web JavaScript widget documentation
│   └── examples/                      # Example workflows
├── nodes/nodes.py                      # Main Python custom nodes
├── web/js/                            # JavaScript widgets
│   ├── video_preview/                # Video preview widget
│   ├── gemini_widgets.js             # Gemini widgets
│   └── ...
└── ui-react_backup/                   # React UI extension (DISABLED)
    ├── ui/src/                        # React source code
    ├── ui/package.json                # Node.js dependencies
    └── dist/                          # Built React outputs
```

### Package Management

```bash
# React dependencies
cd ui-react_backup/ui
npm install  # Install from package.json

# Python dependencies (ALWAYS activate venv first)
source .venv/bin/activate
pip3 install -e .  # Install from pyproject.toml
pip3 install torch opencv-python  # Additional ML dependencies
```

### Environment Verification

```bash
# Verify tool versions
node --version    # Should be v20.19.4+
npm --version     # Should be 10.8.2+
python3 --version # Should be 3.12.3+
ffmpeg -version   # Should be 6.1.1+

# Verify Python dependencies (activate venv first)
source .venv/bin/activate
which python3     # Should point to .venv/bin/python3
pip3 list | grep -E "(torch|opencv|google-genai)"  # Show Python ML deps

# Verify Node dependencies
npm list --prefix ui-react_backup/ui  # Show React dependencies
```

## Timing Expectations

**NEVER CANCEL these operations - they may appear to hang but are working:**

- `npm install`: 40 seconds (normal)
- `npm run build`: 5 seconds (very fast)
- `pip3 install torch opencv-python`: 2-3 minutes (downloads large binaries)
- `npm run watch`: Runs continuously until stopped
- `ruff check`: < 1 second (very fast)
- `pytest`: < 30 seconds (but no tests exist currently)

Set appropriate timeouts: 60+ seconds for npm install, 300+ seconds for Python ML dependencies.

## Development Tips

- **Backend changes**: Restart ComfyUI server after modifying Python files in `nodes/`
- **Web extension changes**: Refresh browser cache after modifying JavaScript files in `web/js/`
- JavaScript widgets require no build step (plain JS files)
- Use Playwright tests in `web/tests/` to validate functionality against hosted ComfyUI server
- Focus on functional testing since automated tests have configuration issues
- FFmpeg must be available in PATH for video processing features to work
