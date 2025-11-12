"""Pytest configuration for the SwissArmyKnife repo."""

# Prevent pytest from importing the repository root package (./__init__.py).
# The file relies on relative imports that only work when the repo is installed
# as a package via ComfyUI, so collecting it during tests just explodes.
collect_ignore = ["__init__.py"]

