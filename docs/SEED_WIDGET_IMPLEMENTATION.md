# Seed Widget Implementation - Documentation

## Overview

This document describes the completed implementation of the seed widget functionality for the GeminiMediaDescribe node, which was restored after being accidentally removed in a previous commit.

## Problem Solved

When using "Randomize Media from Path" mode, ComfyUI's execution engine would skip re-running the node if the `media_path` input stayed the same, because ComfyUI only re-executes nodes when their inputs change. This is standard ComfyUI behavior.

## Solution Implemented

Added a `seed` parameter that:

1. **Forces Re-execution**: When the seed value changes, ComfyUI recognizes the node inputs have changed and re-executes
2. **Smart Visibility**: Only appears when "Randomize Media from Path" is selected
3. **Easy Randomization**: Includes a "🎲 Randomize Seed" button for quick seed generation
4. **Reproducible Results**: Same seed produces same file selection for reproducible workflows

## Technical Implementation

### Python Backend Changes (`utils/nodes.py`)

1. **Added seed parameter to INPUT_TYPES**:
```python
"seed": ("INT", {
    "default": 0,
    "min": 0,
    "max": 0xFFFFFFFFFFFFFFFF,
    "tooltip": "Seed for randomization when using 'Randomize Media from Path'. Use different seeds to force re-execution."
}),
```

2. **Updated function signature**:
```python
def describe_media(self, gemini_api_key, gemini_model, model_type, description_mode, prefix_text, media_source, media_type, seed, image=None, ...):
```

3. **Implemented seed-based file selection**:
```python
# Randomly select a file using the seed for reproducible selection
# When seed changes, a different file may be selected, forcing re-execution
random.seed(seed)
selected_media_path = random.choice(all_files)

# Reset random state to avoid affecting other operations
random.seed(None)
```

### JavaScript Frontend Changes (`web/js/gemini_widgets.js`)

1. **Conditional Widget Visibility**:
   - Seed widget shows only when `media_source = "Randomize Media from Path"`
   - Seed widget is hidden when `media_source = "Upload Media"`

2. **Randomize Seed Button**:
```javascript
// Add randomize seed button for convenience
this.randomizeSeedWidget = this.addWidget(
    "button",
    "🎲 Randomize Seed",
    "randomize_seed",
    () => {
        this.onRandomizeSeedButtonPressed();
    }
);
```

3. **Random Seed Generation**:
```javascript
nodeType.prototype.onRandomizeSeedButtonPressed = function () {
    const seedWidget = this.widgets.find((w) => w.name === "seed");
    if (seedWidget) {
        // Generate a random seed (large integer)
        const randomSeed = Math.floor(Math.random() * 0xFFFFFFFFFFFFFFFF);
        seedWidget.value = randomSeed;
        console.log(`[SEED] Generated random seed: ${randomSeed}`);
        
        // Trigger widget update to ensure ComfyUI recognizes the change
        if (seedWidget.callback) {
            seedWidget.callback(randomSeed);
        }
    }
};
```

## User Interface Behavior

### Upload Media Mode
- Seed widget: **Hidden**
- Randomize seed button: **Hidden**
- Upload widgets: **Visible**

### Randomize Media from Path Mode  
- Seed widget: **Visible** (number input, 0 to 18446744073709551615)
- Randomize seed button: **Visible** (🎲 Randomize Seed)
- Media path widget: **Visible**
- Upload widgets: **Hidden**

## Usage Instructions

### For "Randomize Media from Path" Mode:

1. **Set media_source** to "Randomize Media from Path"
2. **Specify media_path** to your directory containing images/videos
3. **Use the seed widget** to control randomization:
   - **Manual**: Enter any number (0 to 18446744073709551615)
   - **Automatic**: Click "🎲 Randomize Seed" for instant random generation
4. **Change the seed** to force ComfyUI to re-select a different random file

### For "Upload Media" Mode:

- Seed widget is automatically hidden (not relevant for uploaded files)

## Why This Works

ComfyUI's execution engine compares all input values to determine if a node needs re-execution:

- **Before**: Only `media_path` was checked → same path = no re-execution
- **After**: Both `media_path` AND `seed` are checked → different seed = re-execution

This follows the same pattern used by other ComfyUI nodes like samplers (KSampler, etc.) that include seed parameters.

## Technical Benefits

1. **Standard Pattern**: Uses the same approach as built-in ComfyUI nodes
2. **Performance**: Only shows seed widget when needed (clean UI)
3. **User-Friendly**: One-click randomization with the dice button
4. **Persistent**: Seed value is properly saved/restored with workflows
5. **Reproducible**: Same seed always selects the same file from a directory

## Testing Verification

All functionality has been verified through:

1. **Unit Tests**: Python parameter validation and function signature
2. **Integration Tests**: Full node execution with seed parameter
3. **UI Tests**: Widget visibility and button functionality simulation
4. **Code Quality**: Linting with ruff (all checks passed)

## Console Logging

The implementation includes debug logging:

```
[STATE] Showing seed widget for randomization
[STATE] Hiding seed widget for upload mode
[SEED] Generated random seed: 1234567890123456789
```

This ensures proper debugging and verification of widget behavior in ComfyUI.