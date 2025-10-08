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

**All project documentation is organized in a hierarchical folder structure:**

```
docs/
├── README.md                    # Main documentation index and navigation
├── IMPLEMENTATION_STATUS.md     # Overall project status
├── DOCUMENTATION_REORGANIZATION.md # Documentation structure guide
│
├── nodes/                       # Node-specific documentation
│   ├── video-preview/          # Video Preview node (6 files + README)
│   ├── video-metadata/         # Video Metadata node (4 files + README)
│   ├── media-describe/         # Gemini AI Media Description (6 files + README)
│   ├── lora-loader/            # LoRA Loader node (14 files + README)
│   └── reddit-media/           # Reddit Media Extraction (6 files + README)
│
├── infrastructure/              # Infrastructure & system components
│   ├── caching/                # Caching system (6 files + README)
│   ├── debug/                  # Debug & logging (2 files + README)
│   ├── docker/                 # Docker setup (2 files + README)
│   └── build-deploy/           # Build & deployment (3 files + README)
│
├── integrations/                # External service integrations
│   └── civitai/                # CivitAI API integration (3 files + README)
│
├── ui-widgets/                  # UI widget documentation (10 files + README)
├── features/                    # Feature implementations (13 files + README)
└── examples/                    # Example workflows (3 files + README)
```

### Documentation Rules

1. **Node-specific docs** → `docs/nodes/[node-name]/`
2. **Infrastructure docs** → `docs/infrastructure/[category]/`
3. **Integration docs** → `docs/integrations/[service]/`
4. **Widget docs** → `docs/ui-widgets/`
5. **Feature docs** → `docs/features/`
6. **Examples** → `docs/examples/`

### Finding Documentation

- **Start here**: `docs/README.md` - Main index with links to all categories
- **Category indexes**: Each folder has a `README.md` listing all files
- **By node**: `docs/nodes/[node-name]/README.md`
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

**Documentation is now organized by category. Always place documentation in the appropriate folder:**

```bash
# Documentation structure
docs/
├── README.md                    # Main documentation index
├── IMPLEMENTATION_STATUS.md     # Overall project status
├── nodes/                       # Node-specific documentation
│   ├── video-preview/          # Video Preview node docs
│   ├── video-metadata/         # Video Metadata node docs
│   ├── media-describe/         # Gemini AI Media Description docs
│   ├── lora-loader/            # LoRA Loader node docs
│   └── reddit-media/           # Reddit Media Extraction docs
├── infrastructure/              # Infrastructure components
│   ├── caching/                # Caching system docs
│   ├── debug/                  # Debug & logging docs
│   ├── docker/                 # Docker setup docs
│   └── build-deploy/           # Build & deployment docs
├── integrations/                # External service integrations
│   └── civitai/                # CivitAI API integration docs
├── ui-widgets/                  # UI widget documentation
├── features/                    # Feature implementations
└── examples/                    # Example workflows
```

**Adding New Documentation:**

```bash
# For node-specific documentation
touch docs/nodes/[node-name]/NEW_FEATURE.md

# For infrastructure documentation
touch docs/infrastructure/[category]/NEW_SYSTEM.md

# For UI widgets
touch docs/ui-widgets/NEW_WIDGET_IMPLEMENTATION.md

# For features
touch docs/features/NEW_FEATURE_GUIDE.md

# For integrations
touch docs/integrations/[service]/NEW_INTEGRATION.md
```

**Documentation file naming convention:**

- Use ALL_CAPS with underscores
- Be descriptive: `SEED_WIDGET_IMPLEMENTATION.md`
- Include purpose: `TROUBLESHOOTING_`, `GUIDE_`, `IMPLEMENTATION_`, `_FIX`
- Node docs go in `docs/nodes/[node-name]/`
- Infrastructure docs go in `docs/infrastructure/[category]/`

**CRITICAL**: Whenever you implement a new feature, fix a bug, or solve a technical problem:

1. Identify the correct documentation folder:
    - Node changes → `docs/nodes/[node-name]/`
    - System changes → `docs/infrastructure/[category]/`
    - Widget changes → `docs/ui-widgets/`
    - Feature additions → `docs/features/`
    - Integration work → `docs/integrations/[service]/`
2. Create documentation file with descriptive name
3. Include implementation details, gotchas, and future considerations
4. Update the folder's `README.md` index if needed
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
# Create new feature documentation
touch docs/nodes/[node-name]/NEW_FEATURE.md
touch docs/features/NEW_FEATURE_IMPLEMENTATION.md

# Document a bug fix or implementation detail
touch docs/nodes/[node-name]/BUG_NAME_FIX.md
touch docs/infrastructure/[category]/TECHNICAL_IMPLEMENTATION_DETAILS.md

# Update existing documentation after changes
vim docs/nodes/video-preview/EXISTING_FEATURE.md

# Search for documentation gaps
grep -r "TODO\|FIXME\|INCOMPLETE" docs/

# Browse documentation by category
ls -la docs/nodes/           # Node-specific docs
ls -la docs/infrastructure/  # System/infrastructure docs
ls -la docs/integrations/    # External service integrations
ls -la docs/ui-widgets/      # UI widget documentation
ls -la docs/features/        # Feature implementations
ls -la docs/examples/        # Example workflows

# View category index
cat docs/nodes/video-preview/README.md  # See what docs exist for Video Preview node

# Common documentation file types and locations:
# - docs/nodes/[node-name]/FEATURE_NAME.md - Node feature implementations
# - docs/nodes/[node-name]/ISSUE_NAME_FIX.md - Node-specific bug fixes
# - docs/infrastructure/[category]/SYSTEM_NAME.md - Infrastructure documentation
# - docs/integrations/[service]/INTEGRATION_GUIDE.md - Integration guides
# - docs/ui-widgets/WIDGET_IMPLEMENTATION.md - UI widget documentation
# - docs/features/FEATURE_GUIDE.md - Cross-cutting feature documentation
# - docs/IMPLEMENTATION_STATUS.md - Overall project status (root level)
```

### File Structure Overview

```
comfyui_swissarmyknife/
├── .github/workflows/react-build.yml  # CI/CD automation
├── __init__.py                         # Python entry point
├── pyproject.toml                      # Project metadata & publishing config
├── docs/                              # ALL PROJECT DOCUMENTATION (ORGANIZED)
│   ├── README.md                      # Main documentation index
│   ├── IMPLEMENTATION_STATUS.md       # Overall project status
│   ├── DOCUMENTATION_REORGANIZATION.md # Documentation structure guide
│   ├── nodes/                         # Node-specific documentation
│   │   ├── video-preview/            # Video Preview node docs
│   │   ├── video-metadata/           # Video Metadata node docs
│   │   ├── media-describe/           # Gemini AI Media Description docs
│   │   ├── lora-loader/              # LoRA Loader node docs
│   │   └── reddit-media/             # Reddit Media Extraction docs
│   ├── infrastructure/                # Infrastructure components
│   │   ├── caching/                  # Caching system docs
│   │   ├── debug/                    # Debug & logging docs
│   │   ├── docker/                   # Docker setup docs
│   │   └── build-deploy/             # Build & deployment docs
│   ├── integrations/                  # External service integrations
│   │   └── civitai/                  # CivitAI API integration docs
│   ├── ui-widgets/                    # UI widget documentation
│   ├── features/                      # Feature implementations
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
