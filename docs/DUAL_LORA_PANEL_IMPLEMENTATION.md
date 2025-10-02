# Dual LoRA Panel Implementation

## Overview

The ND Super LoRA Loader now supports selecting LoRA pairs for high noise and low noise models simultaneously through a split-panel UI interface. Additionally, the node displays LoRAs in a split-screen layout with high noise LoRAs on the left and low noise LoRAs on the right.

## Backend Changes (Python)

### Updated Node Signature

```python
class NdSuperLoraLoader:
    RETURN_TYPES = ("WANVIDLORA", "WANVIDLORA", "CLIP", "STRING")
    RETURN_NAMES = ("high_noise_lora", "low_noise_lora", "CLIP", "TRIGGER_WORDS")

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "high_noise_lora": ("WANVIDLORA", {...}),
                "low_noise_lora": ("WANVIDLORA", {...}),
            },
            "optional": {
                "clip": ("CLIP",),
                "lora_bundle": ("STRING",),
            }
        }
```

### LoRA Config ModelType Field

Each LoRA config now supports a `modelType` field:

- `'high'` - Apply only to high noise model
- `'low'` - Apply only to low noise model
- `'both'` - Apply to both models (default)

## Frontend Changes (JavaScript)

### New Dual-Panel Selection Dialog

When clicking "Add LoRA" (without selecting an existing widget), the dialog now shows:

- **Left Panel**: High Noise LoRA selection (Blue accent #1976d2)
- **Right Panel**: Low Noise LoRA selection (Purple accent #7b1fa2)

Each panel has:

- Independent search functionality
- Independent LoRA lists
- Visual distinction (different header colors)
- Selection highlighting

### Split-Screen Node Display

The node itself now displays LoRAs in a split-screen layout (can be toggled in settings):

- **Left Column**: High Noise LoRAs (with blue "H" badges)
- **Right Column**: Low Noise LoRAs (with purple "L" badges)
- **Column Headers**: "High Noise" (blue) and "Low Noise" (purple) separators
- **Full Width**: LoRAs with modelType='both' or no modelType appear below columns

This layout makes it easy to see which LoRAs are applied to which models at a glance.

### Visual Indicators

Each LoRA widget displays a badge indicating which model it targets:

- **H** badge (Blue) - High noise model only
- **L** badge (Purple) - Low noise model only
- No badge - Applied to both models

### Usage Flow

1. User clicks "Add LoRA" button (top-level action, not editing existing widget)
2. Dual-panel dialog appears with split view
3. User selects high noise LoRA from left panel
4. User selects low noise LoRA from right panel
5. Status footer updates showing selected LoRAs
6. Click "Add Pair" button to add both LoRAs
7. Both LoRAs are added as separate widgets with appropriate `modelType` values
8. Node displays them in split-screen layout (high on left, low on right)

### Settings

The split-screen node display can be toggled:

- Open Settings menu (⚙️ icon)
- Toggle "Split View (High/Low)" option
- Node layout updates immediately

### Backward Compatibility

- Editing existing LoRA widget still shows single-selection dialog
- Multi-select mode still available in single-selection dialog
- Existing workflows without modelType work normally (defaults to 'both')
- Split view can be disabled in settings for traditional single-column layout

## Implementation Details

### Method: `showDualLoraSelector`

Located in `web/js/lora_manager/extension.js` in the `OverlayService` class (lines ~1485-1790).

Key features:

- Creates two side-by-side panels (50% width each)
- Each panel has independent state management
- Shared overlay background
- Synchronized close functionality
- "Add Pair" button enabled only when both selections are made
- Real-time status updates in footer

### Method: `createLoraPanel`

Helper method to create individual LoRA selection panels.

Features:

- Configurable title and accent color
- Search functionality with real-time filtering
- Click selection with visual feedback
- Hover effects
- Disabled state for already-added LoRAs
- Truncation for long file names

### Split View Layout Methods

**`drawSplitView`**: Renders widgets in split-screen layout

- Separates LoRAs by modelType (high/low/both)
- Draws column headers with color-coded titles
- Positions high LoRAs in left column, low LoRAs in right column
- Renders 'both' LoRAs in full width below columns
- Stores widget bounds for accurate hit detection

**`drawSingleColumn`**: Traditional single-column layout (fallback)

- Used when split view is disabled or no modelTypes present
- Maintains backward compatibility

**`computeContentHeight`**: Calculates node height

- Detects split view mode and adjusts height calculation
- Accounts for column headers and side-by-side layout
- Falls back to traditional height calculation when needed

**`handleMouseEvent`**: Updated for split view hit detection

- Checks `_splitViewBounds` first for widgets in columns
- Falls back to traditional linear hit detection
- Ensures clicks work correctly in split layout

### Widget Visual Updates

The `SuperLoraWidget.drawFirstRow` method now includes:

- Badge rendering for modelType ('H' or 'L')
- Color-coded badges matching panel colors
- Automatic truncation adjustment to fit badge

### Node Properties

**`useSplitView`** (default: true)

- Controls whether to use split-screen layout
- Can be toggled in Settings menu
- Automatically enabled when high/low modelTypes detected

## Testing Scenarios

### ✅ Basic Functionality

- [ ] Click "Add LoRA" shows dual-panel dialog
- [ ] Left panel labeled "High Noise LoRA" with blue accent
- [ ] Right panel labeled "Low Noise LoRA" with purple accent
- [ ] Both panels show available LoRAs

### ✅ Selection Workflow

- [ ] Select high noise LoRA, status updates
- [ ] Select low noise LoRA, status updates
- [ ] "Add Pair" button enables when both selected
- [ ] Click "Add Pair" adds both LoRAs
- [ ] Both LoRAs show correct badges (H and L)

### ✅ Split-Screen Node Display

- [ ] High noise LoRAs appear in left column
- [ ] Low noise LoRAs appear in right column
- [ ] Column headers visible ("High Noise" blue, "Low Noise" purple)
- [ ] Columns aligned side-by-side
- [ ] LoRAs with modelType='both' appear full width below columns
- [ ] Node height adjusts correctly for split view
- [ ] Can toggle split view on/off in settings

### ✅ Search Functionality

- [ ] Search in left panel filters independently
- [ ] Search in right panel filters independently
- [ ] Clear search shows all LoRAs again

### ✅ Validation

- [ ] Already-added LoRAs show "added" badge and are disabled
- [ ] Can select same LoRA for both high and low (if desired)
- [ ] ESC key closes dialog
- [ ] Click outside dialog closes it
- [ ] Cancel button works

### ✅ Mouse Interaction in Split View

- [ ] Clicking high noise LoRA in left column works
- [ ] Clicking low noise LoRA in right column works
- [ ] Enable/disable toggle works in both columns
- [ ] Strength controls work in both columns
- [ ] Trigger word buttons work in both columns
- [ ] Remove button works in both columns

### ✅ Backend Integration

- [ ] High noise LoRAs applied to high_noise_model input
- [ ] Low noise LoRAs applied to low_noise_model input
- [ ] CLIP shared between both models
- [ ] Trigger words collected from both LoRAs
- [ ] Console logs show correct model type application

### ✅ Backward Compatibility

- [ ] Click existing widget LoRA name shows single-selection dialog
- [ ] Multi-select mode still works in single-selection
- [ ] Existing workflows load correctly
- [ ] LoRAs without modelType default to 'both'

### ✅ Visual Feedback

- [ ] Selected LoRA highlighted with panel accent color
- [ ] Hover effects on LoRA items
- [ ] Status text updates in real-time
- [ ] Badges visible on node widgets
- [ ] Badge colors match panel colors (blue/purple)

## Files Modified

1. **nodes/lora_manager/nd_super_lora_node.py**
    - Updated INPUT_TYPES to accept two WANVIDLORA inputs
    - Updated RETURN_TYPES to output two WANVIDLORA stacks
    - Modified load_loras to handle high/low model separation
    - Added modelType logic for selective LoRA application

2. **web/js/lora_manager/extension.js**
    - Added `showDualLoraSelector` method to OverlayService
    - Added `createLoraPanel` helper method
    - Modified `showLoraSelector` to use dual-panel for new additions
    - Updated `SuperLoraWidget.drawFirstRow` to display modelType badges
    - Maintains backward compatibility with single-selection mode

3. **docs/DUAL_LORA_PANEL_IMPLEMENTATION.md** (this file)
    - Complete implementation documentation
    - Usage guides and testing scenarios

## Future Enhancements

- [ ] Allow swapping high/low selections with a swap button
- [ ] Add "Copy to other panel" functionality
- [ ] Support batch pair additions
- [ ] Add preset LoRA pairs (favorites/templates)
- [ ] Folder filtering in dual-panel mode
- [ ] Visual link/connection between paired LoRAs in node
- [ ] Drag-and-drop between panels
- [ ] Quick-add button for "use same LoRA for both"

## Troubleshooting

### Issue: Dual-panel doesn't show

- **Solution**: Ensure you're clicking "Add LoRA" button, not editing existing widget
- **Solution**: Check browser console for JavaScript errors
- **Solution**: Clear browser cache and refresh

### Issue: LoRAs not applying to correct model

- **Solution**: Check console logs for "Loaded to HIGH/LOW noise model" messages
- **Solution**: Verify modelType field in widget value
- **Solution**: Restart ComfyUI server after Python changes

### Issue: Badges not showing

- **Solution**: Ensure modelType is 'high' or 'low' (not 'both')
- **Solution**: Refresh browser cache
- **Solution**: Check widget draw method is being called

### Issue: Backend receives incorrect data

- **Solution**: Check lora_bundle JSON structure in console
- **Solution**: Verify syncExecutionWidgets is being called
- **Solution**: Check node.customWidgets array structure

## Related Documentation

- `docs/IMPLEMENTATION_STATUS.md` - Overall project status
- `docs/LORA_MANAGER_INTEGRATION.md` - LoRA manager details
- `nodes/lora_manager/nd_super_lora_node.py` - Backend implementation
- `web/js/lora_manager/extension.js` - Frontend implementation
