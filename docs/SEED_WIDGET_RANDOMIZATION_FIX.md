# Seed Widget for Randomization Fix

## Problem Solved

When using "Randomize Media from Path", ComfyUI's execution engine would skip re-running the node if the `media_path` input stayed the same, because ComfyUI only re-executes nodes when their inputs change. This is standard ComfyUI behavior.

## Solution: Seed Widget

Added a `seed` parameter that:

1. **Forces Re-execution**: When the seed value changes, ComfyUI recognizes the node inputs have changed and re-executes
2. **Smart Visibility**: Only appears when "Randomize Media from Path" is selected
3. **Easy Randomization**: Includes a "🎲 Randomize Seed" button for quick seed generation

## Implementation Details

### Python Node Changes

```python
# Added to INPUT_TYPES in required section:
"seed": ("INT", {
    "default": 0,
    "min": 0,
    "max": 0xFFFFFFFFFFFFFFFF,
    "tooltip": "Seed for randomization when using 'Randomize Media from Path'. Use different seeds to force re-execution."
}),

# Updated function signature:
def describe_media(self, ..., seed, ...):
```

### JavaScript Widget Management

1. **Conditional Visibility**: Seed widget is hidden by default and only shown when `media_source` is "Randomize Media from Path"

2. **Randomize Button**: Adds a convenient "🎲 Randomize Seed" button that generates random values

3. **State Management**: Properly managed in the `updateMediaWidgets()` function

## Usage Instructions

### For "Randomize Media from Path" Mode:

1. **Set media_source** to "Randomize Media from Path"
2. **Specify media_path** to your directory containing images/videos
3. **Use the seed widget** to control randomization:
    - **Manual**: Enter any number (0 to 18446744073709551615)
    - **Automatic**: Click "🎲 Randomize Seed" for instant random generation
4. **Change the seed** to force ComfyUI to re-select a different random file

### For "Upload Media" Mode:

-   Seed widget is automatically hidden (not relevant for uploaded files)

## Why This Works

ComfyUI's execution engine compares all input values to determine if a node needs re-execution:

-   **Before**: Only `media_path` was checked → same path = no re-execution
-   **After**: Both `media_path` AND `seed` are checked → different seed = re-execution

This follows the same pattern used by other ComfyUI nodes like samplers (KSampler, etc.) that include seed parameters.

## Technical Benefits

1. **Standard Pattern**: Uses the same approach as built-in ComfyUI nodes
2. **Performance**: Only shows seed widget when needed (clean UI)
3. **User-Friendly**: One-click randomization with the dice button
4. **Persistent**: Seed value is properly saved/restored with workflows

## Console Logging

The implementation includes debug logging:

```
[STATE] Showing seed widget for randomization
[STATE] Hiding seed widget for upload mode
[SEED] Generated random seed: 1234567890123456789
```

This ensures ComfyUI will properly re-execute your randomization workflow whenever you want to select a different random file from your directory.
