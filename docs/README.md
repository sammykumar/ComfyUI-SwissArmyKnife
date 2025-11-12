# ComfyUI-SwissArmyKnife Documentation

Welcome to the ComfyUI-SwissArmyKnife documentation! This directory contains comprehensive documentation for all nodes, integrations, infrastructure components, and web JavaScript widgets.

## 📁 Documentation Structure

### 🎬 Nodes (`/nodes`)

Core custom nodes that extend ComfyUI functionality:

- **[video-preview](nodes/video-preview/)** - Video preview widget for comparing multiple videos side-by-side
- **[video-metadata](nodes/video-metadata/)** - Video metadata extraction and manipulation with append functionality
- **[media-describe](nodes/media-describe/)** - AI-powered media description using Gemini API
- **[lora-loader](nodes/lora-loader/)** - Advanced LoRA loading with metadata integration
- **[reddit-media](nodes/reddit-media/)** - Reddit and RedGifs media extraction and processing
- **[media-selection](nodes/media-selection/)** - Media source selection and management
- **[control-panel](nodes/control-panel/)** - Workflow information dashboard display

### 🏗️ Infrastructure (`/infrastructure`)

Core system components and development tools:

- **[caching](infrastructure/caching/)** - Caching strategies and optimization
- **[debug](infrastructure/debug/)** - Debug mode and logging systems
- **[docker](infrastructure/docker/)** - Docker setup and container configuration
- **[build-deploy](infrastructure/build-deploy/)** - Build processes and publishing workflows
- **[SETTINGS_INTEGRATION.md](infrastructure/SETTINGS_INTEGRATION.md)** - ComfyUI settings API integration for secure API key management

### 🔌 Integrations (`/integrations`)

External service integrations:

- **[civitai](integrations/civitai/)** - CivitAI API integration for model metadata
- **[reddit](integrations/reddit/)** - Reddit API integration (see also nodes/reddit-media)

### 🌐 Web JavaScript (`/web-js`)

Web JavaScript widgets and UI components:

- **[Control Panel](web-js/CONTROL_PANEL.md)** - Dashboard widget with JSON data handling and multi-column layout
- **[Dimensions Display](web-js/DIMENSIONS_DISPLAY.md)** - Automatic media dimension display with troubleshooting
- **[Seed Widget](web-js/SEED_WIDGET.md)** - Randomization seed for reproducible workflows
- **[Widget Fixes](web-js/WIDGET_FIXES.md)** - Visibility management, state persistence, and general fixes

### 📚 Examples (`/examples`)

Example workflows and demonstrations:

- Sample workflow JSON files
- Usage demonstrations
- Integration examples

### 📦 Vendoring Notes

- **[VENDORING.md](VENDORING.md)** — Tracks files copied/adapted from external projects (e.g., VACE-Annotators scribble generator) plus update instructions.

## 🚀 Quick Start

### For Developers

1. **Node Development**: See individual node documentation in `/nodes/[node-name]/`
2. **Integration**: Review `/integrations/` for external API integration guides
3. **Infrastructure**: Consult `/infrastructure/` for system-level changes
4. **Web Widgets**: Check `/web-js/` for JavaScript widget development

### For Users

1. **Node Usage**: Each node folder contains usage guides and examples
2. **Troubleshooting**: Look for troubleshooting sections in node documentation
3. **Examples**: Check `/examples/` for workflow demonstrations

## 📖 Documentation Conventions

### Consolidated Documentation

Each node should have a single comprehensive markdown file that includes:

1. **Overview** - What the node does
2. **Features** - Key capabilities
3. **Configuration** - Input/output parameters
4. **Usage** - How to use the node
5. **Implementation Details** - Technical specifics
6. **Troubleshooting** - Common issues and solutions
7. **Related Documentation** - Links to relevant docs

## 🔍 Finding Documentation

### By Topic

- **Video Processing**: Check `/nodes/video-preview/` and `/nodes/video-metadata/`
- **AI/ML Features**: See `/nodes/media-describe/` and `/nodes/lora-loader/`
- **External APIs**: Look in `/integrations/`
- **Performance**: Check `/infrastructure/caching/`
- **Debugging**: See `/infrastructure/debug/`
- **Web Widgets**: Review `/web-js/` for JavaScript UI components

## 📝 Contributing Documentation

When adding new documentation:

1. **Choose the Right Location**:
    - Node-specific → `/nodes/[node-name]/`
    - Infrastructure → `/infrastructure/[category]/`
    - Integration → `/integrations/[service]/`
    - Web JavaScript widget → `/web-js/`

2. **One File Per Node**: Create a single comprehensive markdown file for each node

3. **Update Index Files**: Add your documentation to the relevant `README.md` in the subdirectory

4. **Cross-Reference**: Link to related documentation files

5. **Include Examples**: Add code snippets and usage examples

## 🗂️ Index Files

Each subdirectory contains a `README.md` that:

- Lists all documentation files in that directory
- Provides brief descriptions of each document
- Links to related documentation in other directories
- Includes quick reference guides when applicable

## 📊 Project Status

See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for overall project status and feature completion tracking.

## 🆘 Need Help?

1. **Search**: Use your editor's search to find keywords across all docs
2. **Index Files**: Check the `README.md` in each subdirectory
3. **Status**: Review `IMPLEMENTATION_STATUS.md` for current project state
4. **Examples**: Look in `/examples/` for working implementations

## 📅 Documentation Maintenance

- **Regular Updates**: Documentation should be updated when code changes
- **Version Tracking**: Include implementation dates in documentation
- **One File Per Node**: Keep node documentation consolidated in a single file
- **Cleanup**: Outdated documentation should be archived or removed

---

**Last Updated**: October 13, 2025
**Documentation Structure Version**: 3.0
