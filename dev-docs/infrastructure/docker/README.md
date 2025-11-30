# Docker Documentation

Docker setup, configuration, and troubleshooting for ComfyUI-SwissArmyKnife development.

## 📄 Documentation Files

- **[DOCKER_DEVELOPMENT_SETUP.md](DOCKER_DEVELOPMENT_SETUP.md)** - Docker development environment setup
- **[DOCKER_COMFYUI_MANAGER_FIX.md](DOCKER_COMFYUI_MANAGER_FIX.md)** - ComfyUI Manager compatibility fixes

## 🎯 Quick Reference

### Docker Files

- `Dockerfile` - Main Docker image configuration
- `docker-compose.yml` - Multi-container orchestration

### Quick Start

```bash
# Build Docker image
docker-compose build

# Start container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down
```

## 🔧 Configuration

### Volume Mounts

- ComfyUI models
- Custom node directories
- Output directories
- Cache directories

### Environment Variables

- `COMFYUI_PORT` - ComfyUI server port
- `DEBUG_ENABLED` - Enable debug mode
- `GEMINI_API_KEY` - Gemini API key
- `CIVITAI_API_KEY` - CivitAI API key

## 🐛 Common Issues

1. **ComfyUI Manager Not Working**: See DOCKER_COMFYUI_MANAGER_FIX.md
2. **Permission Issues**: Ensure proper volume permissions
3. **Port Conflicts**: Check if port is already in use
4. **GPU Access**: Verify NVIDIA Docker runtime setup

## 📚 Related Documentation

- [Build & Deploy](../build-deploy/) - For publishing Docker images
- [Debug System](../debug/) - For debugging in Docker containers

---

**Category**: Infrastructure
**Status**: Stable
