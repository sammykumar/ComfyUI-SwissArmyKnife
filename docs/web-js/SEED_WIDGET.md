# Seed Widget

**Last Updated**: October 8, 2025  
**Node**: MediaSelection

The seed widget enables reproducible randomization for the MediaSelection node when using "Randomize Media from Path" mode. It solves the ComfyUI execution caching issue where the same media_path wouldn't trigger re-execution.

---

## Table of Contents

1. [Overview](#overview)
2. [Problem Solved](#problem-solved)
3. [Implementation](#implementation)
4. [Usage](#usage)
5. [Technical Details](#technical-details)

---

## Overview

### Key Features

1. **Forces Re-execution**: Changing the seed value makes ComfyUI recognize inputs have changed
2. **Smart Visibility**: Only appears when "Randomize Media from Path" is selected
3. **Easy Randomization**: Includes a "🎲 Randomize Seed" button for quick seed generation
4. **Reproducible Results**: Same seed produces same file selection for reproducible workflows
5. **Standard Pattern**: Follows the same approach as built-in ComfyUI nodes (KSampler, etc.)

### UI Behavior

**Upload Media Mode:**

- Seed widget: **Hidden**
- Randomize seed button: **Hidden**
- Upload widgets: **Visible**

**Randomize Media from Path Mode:**

- Seed widget: **Visible** (number input, 0 to 18446744073709551615)
- Randomize seed button: **Visible** (🎲 Randomize Seed)
- Media path widget: **Visible**
- Upload widgets: **Hidden**

---

## Problem Solved

When using "Randomize Media from Path" mode, ComfyUI's execution engine would skip re-running the node if the `media_path` input stayed the same, because ComfyUI only re-executes nodes when their inputs change. This is standard ComfyUI behavior designed to optimize workflow execution.

### The Issue

**Before the fix:**

- User sets `media_path` to `/path/to/media/`
- Node executes and selects a random file
- User clicks "Queue Prompt" again
- ComfyUI sees: `media_path` hasn't changed → skips re-execution
- Result: Same file is used, no actual randomization happens

### The Solution

**After the fix:**

- User sets `media_path` to `/path/to/media/`
- User sets `seed` to `12345`
- Node executes and selects a random file (using seed 12345)
- User clicks "🎲 Randomize Seed" to change seed to `67890`
- ComfyUI sees: `seed` has changed → triggers re-execution
- Result: Different file is selected, true randomization works

---

## Implementation

### Python Backend Changes

**File:** `nodes/nodes.py`

#### Added Seed Parameter

```python
"seed": ("INT", {
    "default": 0,
    "min": 0,
    "max": 0xFFFFFFFFFFFFFFFF,
    "tooltip": "Seed for randomization when using 'Randomize Media from Path'. Use different seeds to force re-execution."
}),
```

#### Updated Function Signature

```python
def describe_media(self, gemini_api_key, gemini_model, model_type, description_mode,
                   prefix_text, media_source, media_type, seed, image=None, ...):
```

#### Seed-Based File Selection

```python
# Randomly select a file using the seed for reproducible selection
# When seed changes, a different file may be selected, forcing re-execution
random.seed(seed)
selected_media_path = random.choice(all_files)

# Reset random state to avoid affecting other operations
random.seed(None)
```

### JavaScript Frontend Changes

**File:** `web/js/swiss-army-knife.js`

#### Conditional Widget Visibility

The seed widget is managed in the `updateMediaWidgets()` function:

```javascript
// Show seed widget only for "Randomize Media from Path"
if (mediaSource === 'Randomize Media from Path') {
    seedWidget.hidden = false;
    randomizeSeedButton.hidden = false;
    console.log('[STATE] Showing seed widget for randomization');
} else {
    seedWidget.hidden = true;
    randomizeSeedButton.hidden = true;
    console.log('[STATE] Hiding seed widget for upload mode');
}
```

#### Randomize Seed Button

```javascript
// Add randomize seed button for convenience
this.randomizeSeedWidget = this.addWidget(
    'button',
    '🎲 Randomize Seed',
    'randomize_seed',
    () => {
        this.onRandomizeSeedButtonPressed();
    },
);
```

#### Random Seed Generation

```javascript
nodeType.prototype.onRandomizeSeedButtonPressed = function () {
    const seedWidget = this.widgets.find((w) => w.name === 'seed');
    if (seedWidget) {
        // Generate a random seed (large integer)
        const randomSeed = Math.floor(Math.random() * 0xffffffffffffffff);
        seedWidget.value = randomSeed;
        console.log(`[SEED] Generated random seed: ${randomSeed}`);

        // Trigger widget update to ensure ComfyUI recognizes the change
        if (seedWidget.callback) {
            seedWidget.callback(randomSeed);
        }
    }
};
```

### Console Logging

The implementation includes debug logging for verification:

```
[STATE] Showing seed widget for randomization
[STATE] Hiding seed widget for upload mode
[SEED] Generated random seed: 1234567890123456789
```

---

## Usage

### For "Randomize Media from Path" Mode

1. **Set media_source** to "Randomize Media from Path"
2. **Specify media_path** to your directory containing images/videos
3. **Use the seed widget** to control randomization:

    **Option A - Manual Entry:**
    - Enter any number (0 to 18,446,744,073,709,551,615)
    - Same seed = same file selection (reproducible)

    **Option B - Automatic Randomization:**
    - Click "🎲 Randomize Seed" button
    - Instantly generates a random seed value
    - Forces new file selection on next execution

4. **Execute workflow**:
    - Click "Queue Prompt"
    - Node selects a file based on seed
    - Change seed and re-queue for different file

### For "Upload Media" Mode

- Seed widget is automatically hidden (not relevant for uploaded files)
- Upload your own media files directly

### Workflow Tips

**For Random Selection Every Time:**

- Click "🎲 Randomize Seed" before each execution
- Each execution will select a potentially different file

**For Reproducible Workflows:**

- Set a specific seed value (e.g., 42)
- Share workflows with that seed
- Others will get the same file selection from their directories

---

## Technical Details

### Why This Works

ComfyUI's execution engine compares all input values to determine if a node needs re-execution:

**Before the seed widget:**

- Only `media_path` was checked → same path = no re-execution

**After the seed widget:**

- Both `media_path` AND `seed` are checked → different seed = re-execution

This follows the same pattern used by other ComfyUI nodes like samplers (KSampler, KSamplerAdvanced, etc.) that include seed parameters for reproducible randomization.

### Technical Benefits

1. **Standard Pattern**: Uses the same approach as built-in ComfyUI nodes
2. **Performance**: Only shows seed widget when needed (clean UI)
3. **User-Friendly**: One-click randomization with the dice button (🎲)
4. **Persistent**: Seed value is properly saved/restored with workflows
5. **Reproducible**: Same seed always selects the same file from a directory
6. **Large Range**: Supports seeds from 0 to 2^64-1 (18 quintillion values)

### Seed Range

- **Min**: 0
- **Max**: 18,446,744,073,709,551,615 (0xFFFFFFFFFFFFFFFF)
- **Default**: 0
- **Type**: Integer (INT)

### Random File Selection Logic

```python
# Get all files from directory
all_files = [list of media files from media_path]

# Use seed for reproducible randomization
random.seed(seed)
selected_media_path = random.choice(all_files)

# Reset random state to avoid affecting other operations
random.seed(None)
```

This ensures:

- Same seed + same directory = same file selection
- Different seed + same directory = potentially different file
- Reproducible workflows across different systems

---

## Testing Verification

All functionality has been verified through:

1. **Unit Tests**: Python parameter validation and function signature
2. **Integration Tests**: Full node execution with seed parameter
3. **UI Tests**: Widget visibility and button functionality simulation
4. **Code Quality**: Linting with ruff (all checks passed)

### Test Scenarios

✅ **Seed changes trigger re-execution**

- Same media_path, different seed → node re-executes

✅ **Seed visibility toggles correctly**

- "Upload Media" → seed hidden
- "Randomize Media from Path" → seed visible

✅ **Randomize button works**

- Click button → seed value changes
- Widget callback triggers → ComfyUI recognizes change

✅ **Workflow persistence**

- Save workflow with seed value
- Load workflow → seed value restored

---

## Related Documentation

- [LM Studio Structured Describe Nodes](../nodes/lm-studio-describe/) - Main node documentation
- [Dimensions Display Widget](DIMENSIONS_DISPLAY.md) - Another dynamic widget implementation
- [JavaScript Improvements](../features/JAVASCRIPT_IMPROVEMENTS.md) - Widget development patterns
