# Restart Button Implementation

## Overview

Added a red restart button to the ComfyUI topbar menu that allows users to restart the ComfyUI server.

## Files Created/Modified

### 1. `nodes/restart_api.py` (NEW)

- Created a new API endpoint `/swissarmyknife/restart` (POST)
- Handles server restart by sending SIGTERM signal
- Gracefully shuts down and exits the process

### 2. `__init__.py` (MODIFIED)

- Imported and registered the restart API routes
- The restart endpoint is now available when ComfyUI starts

### 3. `web/js/swiss-army-knife.js` (MODIFIED)

- Added new extension `comfyui_swissarmyknife.restart_button`
- Defined restart command with ID `swissarmyknife.restart`
- Added command to topbar menu under "Swiss Army Knife" menu
- Injected CSS styles to make the button red
- Includes confirmation dialog before restarting
- Shows toast notifications for restart status

### 4. `web/css/restart-button.css` (NEW)

- Standalone CSS file for restart button styling (optional, styles are also injected via JS)

## Features

### Button Appearance

- **Red background** (#dc3545) with white text
- **Bold font** for prominence
- **Hover effect** - darker red (#c82333)
- **Active effect** - even darker red (#bd2130)
- 🔴 emoji prefix for visual indication

### User Experience

1. User clicks "Swiss Army Knife" → "🔴 Restart ComfyUI Server" in topbar
2. Confirmation dialog appears
3. If confirmed, sends POST request to `/swissarmyknife/restart`
4. Shows "Server Restarting" toast notification
5. Waits 2 seconds then reloads the page
6. ComfyUI server restarts in background

### Error Handling

- Shows error toast if restart fails
- Falls back to alert() if toast notifications unavailable
- Logs all events to browser console

## Usage

After ComfyUI restarts with this extension:

1. Look for "Swiss Army Knife" in the topbar menu
2. Click to expand the menu
3. Click "🔴 Restart ComfyUI Server"
4. Confirm the restart
5. Wait for server to restart and page to reload

## Notes

- Restart works by sending SIGTERM to the server process
- Requires ComfyUI to be running under a process manager or restart script for automatic restart
- If running manually, the server will shut down and need manual restart
- The 2-second delay before page reload allows the server to begin shutdown
