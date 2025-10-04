# Development Workflow

## Quick Start

### Install Dependencies

```bash
npm install
```

This will install:

- `concurrently` - Run multiple npm scripts in parallel
- `nodemon` - Watch Python files for changes
- Vue build tools (Vite, TypeScript, etc.)

### Start Development Watch Mode

```bash
npm run dev
```

This single command will:

- ✅ **Watch Vue components** - Automatically rebuild when `.vue`, `.ts` files change
- ✅ **Watch Python nodes** - Automatically restart ComfyUI when `.py` files change
- ✅ **Run in parallel** - Both watchers run simultaneously

## Individual Scripts

### Vue Development

```bash
# Watch and rebuild Vue components
npm run vue:dev

# One-time build
npm run vue:build

# Install Vue dependencies
npm run vue:install
```

### Python Development

```bash
# Watch Python files and restart ComfyUI
npm run dev:python
```

This watches:

- `nodes/**/*.py` - All Python files in the nodes directory
- `__init__.py` - Main initialization file

On change, it executes:

```bash
docker restart comfyui-swiss-army-knife-comfyui-1
```

### Legacy React UI (Backup)

```bash
# Watch React UI
npm run watch

# Build React UI
npm run build
```

### Testing

```bash
# Run tests
npm run test

# Install test dependencies
npm run test:install
```

## Development Workflow

### Typical Development Session

1. **Start the dev watcher:**

    ```bash
    npm run dev
    ```

2. **Make changes to Vue components:**
    - Edit files in `vue-components/src/`
    - Vite will automatically rebuild
    - Refresh browser to see changes

3. **Make changes to Python nodes:**
    - Edit files in `nodes/`
    - Nodemon detects changes
    - ComfyUI server automatically restarts
    - Refresh browser to reload nodes

### What Gets Watched

#### Vue Files (Vite)

- `vue-components/src/**/*.vue`
- `vue-components/src/**/*.ts`
- `vue-components/src/**/*.js`

Output: `web/js/vue-components.js`

#### Python Files (Nodemon)

- `nodes/**/*.py`
- `__init__.py`

Action: Restarts ComfyUI server in Docker

## Docker Requirements

The Python watcher assumes:

- ✅ Docker container named `comfyui-swiss-army-knife-comfyui-1` is running
- ✅ Container runs ComfyUI with `python main.py`
- ✅ Container can be restarted with `docker restart`

If your setup is different, modify the `dev:python` script in `package.json`:

```json
"dev:python": "nodemon --watch nodes --watch __init__.py --ext py --exec 'YOUR_RESTART_COMMAND'"
```

### Alternative Restart Commands

**Docker Compose:**

```bash
docker-compose restart comfyui
```

**Direct Python restart (if running locally):**

```bash
pkill -f 'python.*main.py' && python main.py
```

**Kubernetes:**

```bash
kubectl rollout restart deployment/comfyui
```

## Troubleshooting

### "Cannot find module 'concurrently'"

```bash
npm install
```

### Vue build not updating

- Check that `npm run dev` is running
- Look for Vite build success messages
- Hard refresh browser (Cmd+Shift+R)

### Python changes not restarting server

- Verify Docker container is running: `docker ps | grep comfyui`
- Check container name matches `comfyui-swiss-army-knife-comfyui-1`
- Test manual restart: `docker restart comfyui-swiss-army-knife-comfyui-1`
- Check nodemon is watching: Look for "watching extensions: py"

### Both watchers conflict

- Run them separately in different terminals:
    - Terminal 1: `npm run vue:dev`
    - Terminal 2: `npm run dev:python`

## Output Examples

### Successful Dev Start

```
$ npm run dev

> comfyui-swissarmyknife@1.0.0 dev
> concurrently "npm:dev:vue" "npm:dev:python"

[0] > comfyui-swissarmyknife@1.0.0 dev:vue
[0] > npm run vue:dev
[1] > comfyui-swissarmyknife@1.0.0 dev:python
[1] > nodemon --watch nodes --watch __init__.py --ext py --exec ...
[0]
[0] vite v6.3.5 building for production...
[1] [nodemon] 3.1.9
[1] [nodemon] watching path(s): nodes/**/* __init__.py
[1] [nodemon] watching extensions: py
[0] ✓ built in 342ms
```

### On Vue File Change

```
[0] file change detected: vue-components/src/components/ExampleComponent.vue
[0] vite v6.3.5 building for production...
[0] ✓ built in 158ms
```

### On Python File Change

```
[1] [nodemon] restarting due to changes...
[1] [nodemon] starting `docker restart comfyui-swiss-army-knife-comfyui-1`
[1] comfyui-swiss-army-knife-comfyui-1
[1] [nodemon] clean exit - waiting for changes before restart
```

## Tips

- 💡 **Use one terminal** - `npm run dev` handles everything
- 💡 **Check console output** - Both watchers show their status
- 💡 **Hard refresh browser** - After changes, use Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
- 💡 **Monitor logs** - Watch for Vite build success and supervisor restart confirmations
- 💡 **Test in isolation** - If issues arise, run `vue:dev` and `dev:python` separately

## Related Documentation

- [Vue Components README](./vue-components/README.md)
- [Vue Testing Guide](./vue-components/TESTING.md)
- [Vue Quick Reference](./vue-components/QUICK_REFERENCE.md)
