# Publishing Workflow

This document explains the automated GitHub Actions workflow for publishing ComfyUI-SwissArmyKnife to the ComfyUI Registry and managing releases.

## Overview

The publishing workflow is designed to automatically publish your custom node to the ComfyUI Registry whenever you update the version in `pyproject.toml` and push to the `master` branch. It also creates git tags for release tracking.

## Workflow Components

### 1. Registry Publishing Workflow (`.github/workflows/publish-to-registry.yml`)

This is the main publishing workflow that follows the [official ComfyUI Registry documentation](https://docs.comfy.org/registry/publishing#option-2%3A-github-actions).

#### Triggers

The workflow runs automatically when:

-   **Version updates**: Changes to `pyproject.toml` are pushed to the `master` branch
-   **Manual trigger**: Can be run manually via GitHub Actions UI (`workflow_dispatch`)

#### Workflow Steps

1. **Checkout code**: Fetches the full git history for tagging
2. **Extract version**: Reads the current version from `pyproject.toml`
3. **Check existing tags**: Prevents duplicate tags if version already exists
4. **Publish to Registry**: Uses the official ComfyUI publishing action
5. **Create git tag**: Automatically creates a version tag (e.g., `v1.0.2`)
6. **Push tag**: Pushes the new tag to GitHub for release tracking

#### Required Secrets

The workflow requires a GitHub repository secret:

-   **`REGISTRY_ACCESS_TOKEN`**: Your ComfyUI Registry API key

### 2. Code Quality Workflow (`.github/workflows/ci.yml`)

A lightweight CI workflow that runs code quality checks without interfering with publishing.

#### Triggers

The workflow runs on:

-   **Push events**: To `master` or `develop` branches
-   **Pull requests**: Targeting `master` or `develop` branches

#### Quality Checks

1. **Python setup**: Uses Python 3.11
2. **System dependencies**: Installs FFmpeg for video processing
3. **Code linting**: Runs `ruff` for code quality
4. **Import validation**: Ensures custom nodes load correctly
5. **ComfyUI integration**: Verifies all required exports exist
6. **Configuration validation**: Checks `pyproject.toml` structure

## Usage Instructions

### Initial Setup

1. **Set up ComfyUI Registry account**:

    - Visit [ComfyUI Registry](https://registry.comfy.org/)
    - Create a publisher account
    - Generate an API key for publishing

2. **Configure GitHub repository**:

    - Go to Settings → Secrets and Variables → Actions
    - Create a new repository secret named `REGISTRY_ACCESS_TOKEN`
    - Set the value to your ComfyUI Registry API key

3. **Ensure pyproject.toml is configured**:

    ```toml
    [project]
    name = "comfyui-swissarmyknife"
    version = "0.0.1"  # This triggers publishing when changed
    description = "A collection of custom nodes for ComfyUI"

    [tool.comfy]
    PublisherId = "your-publisher-id"  # From ComfyUI Registry
    DisplayName = "ComfyUI-SwissArmyKnife"
    ```

### Publishing a New Version

1. **Develop your changes** on a feature branch
2. **Test thoroughly** using the Docker development environment
3. **Update the version** in `pyproject.toml`:
    ```toml
    version = "0.0.2"  # Increment the version number
    ```
4. **Commit and push to master**:
    ```bash
    git add pyproject.toml
    git commit -m "Release version 0.0.2"
    git push origin master
    ```
5. **Automatic publishing** kicks in:
    - GitHub Actions detects the `pyproject.toml` change
    - Publishes to ComfyUI Registry
    - Creates git tag `v0.0.2`
    - Users can discover and install the new version

### Manual Publishing

You can also trigger publishing manually:

1. Go to GitHub Actions tab in your repository
2. Select "Publish to ComfyUI Registry" workflow
3. Click "Run workflow"
4. Choose the branch (usually `master`)

## Version Management

### Semantic Versioning

Follow [semantic versioning](https://semver.org/) for version numbers:

-   **MAJOR**: Breaking changes (e.g., `1.0.0` → `2.0.0`)
-   **MINOR**: New features, backward compatible (e.g., `1.0.0` → `1.1.0`)
-   **PATCH**: Bug fixes, backward compatible (e.g., `1.0.0` → `1.0.1`)

### Git Tags

The workflow automatically creates git tags:

-   **Format**: `v{version}` (e.g., `v1.0.2`)
-   **Prevents duplicates**: Won't create a tag if it already exists
-   **Release tracking**: Makes it easy to track releases and rollback if needed

## Monitoring and Troubleshooting

### Viewing Workflow Status

1. **GitHub Actions tab**: See all workflow runs and their status
2. **Commit badges**: Green checkmark indicates successful publishing
3. **ComfyUI Registry**: Verify your node appears at `registry.comfy.org`

### Common Issues

#### Publishing Fails

-   **Check API key**: Ensure `REGISTRY_ACCESS_TOKEN` is correctly set
-   **Check permissions**: Verify your ComfyUI Registry account can publish
-   **Check version format**: Must be valid semantic version (e.g., `1.0.0`)

#### Tag Creation Fails

-   **Check permissions**: GitHub Actions needs write access to create tags
-   **Duplicate tags**: The workflow skips if tag already exists

#### CI Checks Fail

-   **Import errors**: Usually indicates missing dependencies
-   **Linting errors**: Run `ruff check .` locally to see issues
-   **Integration errors**: Verify `__init__.py` exports are correct

### Debug Mode

To debug issues, you can add debug output to the workflow:

```yaml
- name: Debug environment
  run: |
      echo "Current directory: $(pwd)"
      echo "Python version: $(python --version)"
      echo "Installed packages:"
      pip list
```

## Best Practices

### Development Workflow

1. **Feature branches**: Develop new features on separate branches
2. **Pull requests**: Use PRs to trigger CI checks before merging
3. **Version bumping**: Only update version when ready to publish
4. **Testing**: Use Docker environment to test before publishing

### Release Process

1. **Update CHANGELOG.md**: Document what's new in each release
2. **Test thoroughly**: Ensure all features work as expected
3. **Update documentation**: Keep docs in sync with new features
4. **Version bump**: Update `pyproject.toml` version as final step
5. **Monitor publishing**: Check GitHub Actions and ComfyUI Registry

This automated workflow ensures consistent, reliable publishing while maintaining code quality and proper release tracking.
