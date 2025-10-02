# Build & Deployment Documentation

Documentation for building, packaging, and publishing ComfyUI-SwissArmyKnife.

## 📄 Documentation Files

- **[PUBLISHING_WORKFLOW.md](PUBLISHING_WORKFLOW.md)** - Complete publishing workflow and process
- **[PYTHON_PACKAGE_BUILD_FIX.md](PYTHON_PACKAGE_BUILD_FIX.md)** - Python package build fixes
- **[GET_VERSION_IMPORT_FIX.md](GET_VERSION_IMPORT_FIX.md)** - Version import and detection fixes

## 🎯 Quick Reference

### Build Process

1. **Update Version**: Increment version in `pyproject.toml`
2. **Run Tests**: Ensure all tests pass
3. **Build Package**: `python -m build`
4. **Publish**: Via GitHub Actions or manual upload

### Publishing Workflow

```bash
# 1. Update version in pyproject.toml
# 2. Commit changes
git add pyproject.toml
git commit -m "Bump version to X.Y.Z"

# 3. Tag release
git tag vX.Y.Z
git push origin vX.Y.Z

# 4. GitHub Actions automatically builds and publishes
```

## 🔧 Package Configuration

### pyproject.toml

Key configuration sections:

- `[project]` - Package metadata
- `[project.dependencies]` - Python dependencies
- `[build-system]` - Build tool configuration
- `[tool.*]` - Development tool settings

### Files Included

- Python source code (`nodes/`, `web/`)
- JavaScript widgets (`web/js/`)
- CSS styles (`web/css/`)
- Documentation (`docs/`)
- Examples (`examples/`)

## 🐛 Common Issues

1. **Version Import Fails**: See GET_VERSION_IMPORT_FIX.md
2. **Build Fails**: Check Python version and dependencies
3. **Package Too Large**: Review included files in MANIFEST.in
4. **GitHub Action Fails**: Check workflow file syntax

## 📚 Related Documentation

- [Docker](../docker/) - For Docker image publishing
- [Debug System](../debug/) - For build debugging

---

**Category**: Infrastructure
**Status**: Stable
