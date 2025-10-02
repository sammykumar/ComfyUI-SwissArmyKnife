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
- Documentation in `docs/` directory for all project documentation

**IMPORTANT**: Both backend and web extension components are required for the custom node to function properly. Changes to backend Python files require restarting the ComfyUI server, while changes to web JavaScript files require refreshing the browser cache.

**DOCUMENTATION REQUIREMENT**: All documentation, guides, troubleshooting notes, implementation details, and technical specifications must be added to the `docs/` directory. Never document directly in code comments when a separate documentation file would be more appropriate.

**Note: The React UI component (`ui-react_backup/`) is currently disabled and not in active development.**

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

```bash
# Always add new documentation to the docs/ directory
ls docs/  # Check existing documentation files

# Create new documentation files in docs/
touch docs/NEW_FEATURE_GUIDE.md
touch docs/TROUBLESHOOTING_ISSUE_NAME.md
touch docs/IMPLEMENTATION_DETAILS.md

# Update existing documentation when making changes
vim docs/EXISTING_GUIDE.md

# Documentation file naming convention:
# - Use ALL_CAPS with underscores
# - Be descriptive: SEED_WIDGET_IMPLEMENTATION.md
# - Include purpose: TROUBLESHOOTING_, GUIDE_, IMPLEMENTATION_
```

**CRITICAL**: Whenever you implement a new feature, fix a bug, or solve a technical problem:

1. Document the solution in `docs/FEATURE_NAME.md` or `docs/ISSUE_NAME_FIX.md`
2. Include implementation details, gotchas, and future considerations
3. Reference the documentation file in commit messages
4. Update related documentation files when making changes

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
touch docs/NEW_FEATURE_NAME.md

# Document a bug fix or implementation detail
touch docs/BUG_NAME_FIX.md
touch docs/TECHNICAL_IMPLEMENTATION_DETAILS.md

# Update existing documentation after changes
vim docs/EXISTING_FEATURE.md

# Search for documentation gaps
grep -r "TODO\|FIXME\|INCOMPLETE" docs/

# List all documentation files
ls -la docs/

# Common documentation file types:
# - FEATURE_NAME.md - Feature implementation guides
# - ISSUE_NAME_FIX.md - Bug fixes and solutions
# - IMPLEMENTATION_STATUS.md - Project status tracking
# - TROUBLESHOOTING_*.md - Problem resolution guides
# - *_GUIDE.md - User or developer guides
```

### File Structure Overview

```
comfyui_swissarmyknife/
├── .github/workflows/react-build.yml  # CI/CD automation
├── __init__.py                         # Python entry point
├── pyproject.toml                      # Project metadata & publishing config
├── docs/                              # ALL PROJECT DOCUMENTATION (REQUIRED)
│   ├── IMPLEMENTATION_STATUS.md       # Feature implementation tracking
│   ├── WIDGET_INVESTIGATION_AND_FIXES.md  # Technical troubleshooting
│   ├── SEED_WIDGET_IMPLEMENTATION.md  # Specific feature documentation
│   └── *.md                          # All other documentation files
├── nodes/nodes.py                      # Main Python custom nodes
├── web/js/gemini_widgets.js           # JavaScript widgets
└── ui-react_backup/                   # React UI extension
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
