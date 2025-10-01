#!/bin/bash

# ComfyUI-SwissArmyKnife Cache Busting Utility
# This script helps with cache busting during development

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Change to project directory for consistent file access
cd "$PROJECT_DIR"

echo "🔧 ComfyUI-SwissArmyKnife Cache Busting Utility"
echo "================================================"

# Get current version from pyproject.toml
VERSION=$(python3 -c "import tomllib; f=open('pyproject.toml', 'rb'); data=tomllib.load(f); print(data['project']['version']); f.close()" 2>/dev/null || echo "unknown")

echo "📦 Current version: $VERSION"

# Update version in JavaScript file
JS_FILE="$PROJECT_DIR/web/js/swiss-army-knife.js"
if [ -f "$JS_FILE" ]; then
    echo "🔄 Updating version in JavaScript file..."
    
    # Use sed to update the version in the JavaScript file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/const EXTENSION_VERSION = \"[^\"]*\"/const EXTENSION_VERSION = \"$VERSION\"/" "$JS_FILE"
    else
        # Linux
        sed -i "s/const EXTENSION_VERSION = \"[^\"]*\"/const EXTENSION_VERSION = \"$VERSION\"/" "$JS_FILE"
    fi
    
    echo "✅ Updated JavaScript version to $VERSION"
else
    echo "❌ JavaScript file not found: $JS_FILE"
    exit 1
fi

# Generate cache busting hash based on file content
if command -v sha256sum >/dev/null 2>&1; then
    HASH=$(sha256sum "$JS_FILE" | cut -d' ' -f1 | head -c 8)
elif command -v shasum >/dev/null 2>&1; then
    HASH=$(shasum -a 256 "$JS_FILE" | cut -d' ' -f1 | head -c 8)
else
    HASH=$(date +%s)
fi

echo "🔐 File hash: $HASH"

# Create cache busting info file
cat > "$PROJECT_DIR/cache_info.json" << EOF
{
  "version": "$VERSION",
  "hash": "$HASH",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "files": {
    "swiss-army-knife.js": {
      "path": "web/js/swiss-army-knife.js",
      "hash": "$HASH"
    }
  }
}
EOF

echo "📝 Created cache_info.json"

echo ""
echo "🎯 Cache Busting Complete!"
echo "   Version: $VERSION" 
echo "   Hash: $HASH"
echo ""
echo "💡 To force browser cache refresh:"
echo "   • Hard refresh: Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)"
echo "   • Or clear browser cache and reload ComfyUI"
echo ""
echo "🔄 For development, restart ComfyUI server to ensure changes are loaded."