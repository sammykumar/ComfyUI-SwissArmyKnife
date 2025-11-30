# ComfyUI-SwissArmyKnife Developer Documentation

Welcome to the ComfyUI-SwissArmyKnife **developer documentation**!

## Documentation Audience

**This directory (`dev-docs/`) is for developers and contributors.** It contains:

-   Technical implementation details
-   Architecture decisions
-   Troubleshooting guides
-   Infrastructure documentation
-   Integration guides

**Looking for user documentation?** End users should refer to:

-   **In ComfyUI**: Right-click any node → View Help (displays `web/docs/NodeName.md`)
-   **`web/docs/`**: User-facing help pages with parameters, usage tips, and examples

## 📁 Documentation Structure

## 📁 Documentation Structure

### 🎬 Nodes (`/nodes`)

Core custom nodes that extend ComfyUI functionality:

-   **[video-metadata](nodes/video-metadata/)** - Video metadata extraction and manipulation with append functionality
-   **[lm-studio-describe](nodes/lm-studio-describe/)** - Structured LM Studio describe nodes with JSON outputs
-   **[reddit-media](nodes/reddit-media/)** - Reddit and RedGifs media extraction and processing
-   **[media-selection](nodes/media-selection/)** - Media source selection and management
-   **[control-panel](nodes/control-panel/)** - Workflow information dashboard display
-   **[prompt-builder](nodes/prompt-builder/)** - Compose structured describe overrides with previewable prompt strings
-   **[lora-info-extractor](nodes/lora-info-extractor/)** - Hash LoRA stacks, query CivitAI, and emit structured metadata

### 🏗️ Infrastructure (`/infrastructure`)

Core system components and development tools:

-   **[caching](infrastructure/caching/)** - Caching strategies and optimization
-   **[debug](infrastructure/debug/)** - Debug mode and logging systems
-   **[docker](infrastructure/docker/)** - Docker setup and container configuration
-   **[build-deploy](infrastructure/build-deploy/)** - Build processes and publishing workflows
-   **[SETTINGS_INTEGRATION.md](infrastructure/SETTINGS_INTEGRATION.md)** - ComfyUI settings API integration for secure API key management

### 🔌 Integrations (`/integrations`)

External service integrations:

-   **[civitai](integrations/civitai/)** - CivitAI API integration for model metadata
-   **[reddit](integrations/reddit/)** - Reddit API integration (see also nodes/reddit-media)

### 🌐 Web JavaScript (`/web-js`)

Web JavaScript widgets and UI components:

-   **[Resource Monitor](web-js/RESOURCE_MONITOR.md)** - ⭐ **NEW** Floating HUD with live CPU/RAM/GPU/VRAM monitoring, workflow profiler, and OOM (Out of Memory) detection & analysis
-   **[Control Panel](web-js/CONTROL_PANEL.md)** - Dashboard widget with JSON data handling and multi-column layout
-   **[Dimensions Display](web-js/DIMENSIONS_DISPLAY.md)** - Automatic media dimension display with troubleshooting
-   **[Seed Widget](web-js/SEED_WIDGET.md)** - Randomization seed for reproducible workflows
-   **[Widget Fixes](web-js/WIDGET_FIXES.md)** - Visibility management, state persistence, and general fixes

### 📚 Examples (`/examples`)

Example workflows and demonstrations:

-   Sample workflow JSON files
-   Usage demonstrations
-   Integration examples

### 📦 Vendoring Notes

-   **[VENDORING.md](VENDORING.md)** — Tracks files copied/adapted from external projects (e.g., VACE-Annotators scribble generator) plus update instructions.

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

-   **Video Processing**: Check `/nodes/video-metadata/`
-   **AI/ML Features**: See `/nodes/lm-studio-describe/`
-   **External APIs**: Look in `/integrations/`
-   **Performance & Monitoring**: Check `/web-js/RESOURCE_MONITOR.md` for profiling and OOM analysis
-   **Caching**: See `/infrastructure/caching/`
-   **Debugging**: Check `/infrastructure/debug/`
-   **Web Widgets**: Review `/web-js/` for JavaScript UI components

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

-   Lists all documentation files in that directory
-   Provides brief descriptions of each document
-   Links to related documentation in other directories
-   Includes quick reference guides when applicable

## 📊 Project Status

See the repository changelog (README) for overall project status and feature completion tracking.

## 🆘 Need Help?

1. **Search**: Use your editor's search to find keywords across all docs
2. **Index Files**: Check the `README.md` in each subdirectory
3. **Status**: Review the main README for current project state
4. **Examples**: Look in `/examples/` for working implementations

## 📅 Documentation Maintenance

-   **Regular Updates**: Documentation should be updated when code changes
-   **Version Tracking**: Include implementation dates in documentation
-   **One File Per Node**: Keep node documentation consolidated in a single file
-   **Cleanup**: Outdated documentation should be archived or removed

---

**Last Updated**: November 29, 2025
**Documentation Structure Version**: 3.1 (Added OOM Detection & Profiling System)
