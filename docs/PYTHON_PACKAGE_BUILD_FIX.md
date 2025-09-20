# Python Package Build Configuration Fix

## Issue

CI was failing during the "Python Code Quality" step with the following errors:

1. **Deprecated license format**: `project.license` as a TOML table is deprecated
2. **Multiple top-level packages**: setuptools discovered multiple top-level packages (`web`, `example_nodes`) in flat-layout, which is not allowed

## Solution

### 1. Fixed License Format

Changed from the deprecated table format:

```toml
license = { file = "LICENSE" }
```

To the new SPDX string format:

```toml
license = "MIT"
```

### 2. Explicit Package Configuration

Added explicit setuptools configuration to control package discovery:

```toml
[tool.setuptools]
packages = ["utils"]

[tool.setuptools.package-data]
"" = ["web/js/*.js"]
```

This tells setuptools to:

-   Only include the `utils` Python package
-   Include JavaScript files from `web/js/` as package data
-   Ignore problematic directories like `example_nodes` and `ui-react_backup`

### 3. Added MANIFEST.in

Created a `MANIFEST.in` file to explicitly control what files are included in the distribution package:

-   Includes essential files: `__init__.py`, `utils/`, `web/js/*.js`
-   Excludes development artifacts: `__pycache__`, `example_nodes`, `ui-react_backup`, etc.

## Files Modified

-   `pyproject.toml` - Updated license format and added setuptools configuration
-   `MANIFEST.in` - New file for explicit package content control

## Validation

The package should now build successfully with:

```bash
pip install -e .
```

## Related Documentation

-   [setuptools package discovery](https://setuptools.pypa.io/en/latest/userguide/package_discovery.html)
-   [SPDX License Expressions](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/#license)
-   [MANIFEST.in format](https://packaging.python.org/en/latest/guides/using-manifest-in/)
