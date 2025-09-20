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
"*" = ["web/js/*.js"]
```

This tells setuptools to:

-   Only include the `utils` Python package
-   Include JavaScript files from `web/js/` for all packages (using `"*"` wildcard)
-   Ignore problematic directories like `example_nodes` and `ui-react_backup`

### 3. Fixed Package Data Key Format

The `tool.setuptools.package-data` keys must be either:

-   A valid Python module name (e.g., `"utils"`)
-   The wildcard `"*"` for all packages

Using an empty string `""` is invalid and causes validation errors.

### 4. Added MANIFEST.in

Created a `MANIFEST.in` file to explicitly control what files are included in the distribution package:

-   Includes essential files: `__init__.py`, `utils/`, `web/js/*.js`
-   Excludes development artifacts: `__pycache__`, `example_nodes`, `ui-react_backup`, etc.

## Files Modified

-   `pyproject.toml` - Updated license format and added setuptools configuration
-   `MANIFEST.in` - New file for explicit package content control

## Additional Fix Required

After the initial fix, a second validation error occurred:

```
configuration error: `tool.setuptools.package-data` keys must be named by python-module-name or '*'
```

This was fixed by changing the package-data key from `""` (empty string) to `"*"` (wildcard), which is the correct format for including files across all packages.

## Validation

The package should now build successfully with:

```bash
pip install -e .
```

## Related Documentation

-   [setuptools package discovery](https://setuptools.pypa.io/en/latest/userguide/package_discovery.html)
-   [SPDX License Expressions](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/#license)
-   [MANIFEST.in format](https://packaging.python.org/en/latest/guides/using-manifest-in/)
