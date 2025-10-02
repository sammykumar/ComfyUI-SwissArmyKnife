# Dimensions Display Widget Troubleshooting Guide

## Quick Verification Steps

### Step 1: Clear Browser Cache (CRITICAL!)

You **MUST** hard refresh your browser to see the changes:

**Chrome/Edge (macOS):**

```
Cmd + Shift + R
```

**Chrome/Edge (Windows/Linux):**

```
Ctrl + Shift + R
```

**Firefox:**

```
Cmd + Shift + R (macOS)
Ctrl + F5 (Windows/Linux)
```

**Safari:**

```
Cmd + Option + R
```

### Step 2: Check Console Logs

After hard refreshing, open the browser console (F12 or Cmd+Option+I) and look for these messages:

#### On Page Load:

```
Loading swiss-army-knife.js extension v1.4.0 at [timestamp]
```

#### When Adding the Node:

```
Registering GeminiUtilMediaDescribe node with dynamic media widgets
```

#### When Executing the Workflow:

Look for **BOTH** of these log sequences:

**From API Event Handler:**

```
[API] Execution event received for node: [nodeId]
[API] Output data: {description: ..., height: [1080], width: [1920], ...}
[API] Found GeminiUtilMediaDescribe execution result
[API] Extracted dimensions from API event: 1920 x 1080
[GeminiMediaDescribe] updateDimensionsDisplay called with: 1080 1920
[GeminiMediaDescribe] Created dimensions display widget
```

**From onExecuted Method:**

```
[GeminiMediaDescribe] onExecuted called
[GeminiMediaDescribe] Message type: object
[GeminiMediaDescribe] Message keys: [array of keys]
[GeminiMediaDescribe] Found dimensions in [format]: [height] [width]
[GeminiMediaDescribe] updateDimensionsDisplay called with: [height] [width]
[GeminiMediaDescribe] Updated dimensions display: [width] x [height]
```

### Step 3: Verify Widget Appears

After executing the workflow, you should see a new text field on the node that displays:

```
📐 1920 x 1080
```

(or whatever the actual dimensions of your media are)

## Common Issues

### Issue 1: No Console Logs at All

**Problem:** The extension file hasn't loaded or browser cache not cleared.

**Solution:**

1. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
2. Check that `/web/js/swiss-army-knife.js` file exists
3. Verify ComfyUI server restarted if needed
4. Check browser console for JavaScript errors

### Issue 2: Logs Show "Could not extract dimensions"

**Problem:** Message structure is different than expected.

**Solution:**

1. Check the full console log for `[GeminiMediaDescribe] Message keys:`
2. Look at what keys are available in the message object
3. Report the message structure for further debugging

### Issue 3: Widget Creates But Doesn't Show

**Problem:** Widget is hidden or node size not updating.

**Solution:**

1. Try manually resizing the node in ComfyUI
2. Check if the widget name conflicts with another widget
3. Look for console errors about widget creation
4. Try reloading the workflow

### Issue 4: "api is not defined" Error

**Problem:** The API import statement is missing.

**Solution:**
Check that the file has this import at the top:

```javascript
import { api } from '../../../scripts/api.js';
```

## What Changed in Latest Update

### New API Event Handler

Added a robust app-level API event handler that catches execution results directly from ComfyUI's execution API:

```javascript
api.addEventListener('executed', ({ detail }) => {
    // Extract dimensions from API event
    // This runs for EVERY node execution
});
```

### Helper Function

Created a reusable `updateDimensionsDisplay()` function that both handlers use:

- Creates widget if it doesn't exist
- Updates existing widget value
- Forces UI refresh

### Enhanced onExecuted Method

Improved message structure detection with 4 different possible formats:

1. Array format: `[desc, info, status, path, string, height, width]`
2. Property format: `{height: [1080], width: [1920]}`
3. Output array format: `{output: [desc, info, ..., height, width]}`
4. Output property format: `{output: {height: [1080], width: [1920]}}`

### More Debug Logging

Added extensive logging to help troubleshoot:

- Message type detection
- Message keys listing
- Which format was matched
- Widget creation/update confirmation

## Testing Procedure

1. **Clear cache** (Cmd+Shift+R / Ctrl+Shift+R)
2. **Open console** (F12)
3. **Add node** to workflow
4. **Connect** gemini_options input
5. **Set** media_source to "Reddit Post" (or upload media)
6. **Enter** a Reddit URL (or upload file)
7. **Execute** the workflow (Queue Prompt)
8. **Watch console** for the log messages above
9. **Check node** for the 📐 widget

## Expected Behavior

### Before Execution

- Node shows normal widgets (media_source, media_type, reddit_url, etc.)
- No dimensions widget visible

### During Execution

- Node shows green border
- Console logs execution events

### After Execution

- Node shows green border (completed)
- **📐 1920 x 1080** widget appears at bottom of node
- Widget shows actual width x height of processed media
- Console shows success messages

## Still Not Working?

If after following all these steps the widget still doesn't appear:

1. **Check browser console** and copy ALL `[GeminiMediaDescribe]` and `[API]` log messages
2. **Check for JavaScript errors** (red text in console)
3. **Verify Python node** is returning height and width correctly:
    ```python
    # In nodes/nodes.py, the describe_media method should return:
    return (description, media_info, gemini_status, processed_media_path,
            final_string, height, width)
    ```
4. **Try a simple test**: Connect the `height` and `width` outputs to a "Show Any" node to verify values are being returned

5. **Report the issue** with:
    - Full console log output
    - Screenshot of the node
    - Browser and version
    - Operating system

## Date Updated

October 2, 2025
