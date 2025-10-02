# ComfyUI-SwissArmyKnife Documentation

Welcome to the ComfyUI-SwissArmyKnife documentation! This directory contains comprehensive documentation for all nodes, features, integrations, and infrastructure components.

## 📁 Documentation Structure

### 🎬 Nodes (`/nodes`)

Core custom nodes that extend ComfyUI functionality:

- **[video-preview](nodes/video-preview/)** - Video preview widget for comparing multiple videos side-by-side
- **[video-metadata](nodes/video-metadata/)** - Video metadata extraction and manipulation
- **[media-describe](nodes/media-describe/)** - AI-powered media description using Gemini API
- **[lora-loader](nodes/lora-loader/)** - Advanced LoRA loading with metadata integration
- **[reddit-media](nodes/reddit-media/)** - Reddit and RedGifs media extraction and processing

### 🏗️ Infrastructure (`/infrastructure`)

Core system components and development tools:

- **[caching](infrastructure/caching/)** - Caching strategies and optimization
- **[debug](infrastructure/debug/)** - Debug mode and logging systems
- **[docker](infrastructure/docker/)** - Docker setup and container configuration
- **[build-deploy](infrastructure/build-deploy/)** - Build processes and publishing workflows

### 🔌 Integrations (`/integrations`)

External service integrations:

- **[civitai](integrations/civitai/)** - CivitAI API integration for model metadata
- **[reddit](integrations/reddit/)** - Reddit API integration (see also nodes/reddit-media)

### 🎨 UI Widgets (`/ui-widgets`)

Reusable UI components and widgets:

- Control panels and configuration interfaces
- Dimension display widgets
- Seed randomization widgets
- Custom widget implementations and fixes

### ✨ Features (`/features`)

Feature implementations and enhancements:

- Clothing color modification
- Text exclusion and filtering
- Prompt improvements and decisiveness
- JavaScript utilities and fixes

### 📚 Examples (`/examples`)

Example workflows and demonstrations:

- Sample workflow JSON files
- Usage demonstrations
- Integration examples

## 🚀 Quick Start

### For Developers

1. **Node Development**: See individual node documentation in `/nodes/[node-name]/`
2. **Adding Features**: Check `/features/` for implementation patterns
3. **Integration**: Review `/integrations/` for external API integration guides
4. **Infrastructure**: Consult `/infrastructure/` for system-level changes

### For Users

1. **Node Usage**: Each node folder contains usage guides and examples
2. **Troubleshooting**: Look for `*_FIX.md` or `*_TROUBLESHOOTING.md` files
3. **Examples**: Check `/examples/` for workflow demonstrations

## 📖 Documentation Conventions

### File Naming

- **Implementation Guides**: `[FEATURE]_IMPLEMENTATION.md` or `[NODE]_NODE.md`
- **Bug Fixes**: `[ISSUE]_FIX.md`
- **Troubleshooting**: `[FEATURE]_TROUBLESHOOTING.md`
- **Integration Guides**: `[SERVICE]_INTEGRATION.md`
- **API Documentation**: `[FEATURE]_API.md`

### Document Structure

Each documentation file should include:

1. **Problem Statement** - What issue does this address?
2. **Solution** - How was it solved?
3. **Implementation Details** - Technical specifics
4. **Usage/Testing** - How to use or test the feature
5. **Related Files** - Links to relevant code files
6. **Implementation Date** - When was this implemented?

## 🔍 Finding Documentation

### By Topic

- **Video Processing**: Check `/nodes/video-preview/` and `/nodes/video-metadata/`
- **AI/ML Features**: See `/nodes/media-describe/` and `/nodes/lora-loader/`
- **External APIs**: Look in `/integrations/`
- **Performance**: Check `/infrastructure/caching/`
- **Debugging**: See `/infrastructure/debug/`

### By Issue Type

- **Bugs/Fixes**: Search for `*_FIX.md` files
- **New Features**: Look for `*_IMPLEMENTATION.md` files
- **API Changes**: Check `*_INTEGRATION.md` or `*_API.md` files
- **Performance**: See `/infrastructure/caching/` and optimization docs

## 📝 Contributing Documentation

When adding new documentation:

1. **Choose the Right Location**:
    - Node-specific → `/nodes/[node-name]/`
    - Infrastructure → `/infrastructure/[category]/`
    - Integration → `/integrations/[service]/`
    - UI widget → `/ui-widgets/`
    - Feature → `/features/`

2. **Follow Naming Conventions**: Use clear, descriptive names with appropriate suffixes

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
- **Consolidation**: Related documents should be merged when appropriate
- **Cleanup**: Outdated documentation should be archived or removed

---

**Last Updated**: October 2, 2025
**Documentation Structure Version**: 2.0
