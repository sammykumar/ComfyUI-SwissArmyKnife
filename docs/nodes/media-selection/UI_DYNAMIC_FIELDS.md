# Media Selection Node - Dynamic Field Visibility

## Overview

The Media Selection node now has dynamic field visibility based on the selected `media_source`. This provides a cleaner UI that only shows relevant fields for each selection mode.

## Implementation

The dynamic field visibility is implemented in `/web/js/swiss-army-knife.js` using the same pattern as the MediaDescribe node.

## Field Visibility Rules

### Upload Media Mode (default)

**Visible fields:**

- `media_source` (dropdown)
- `media_type` (dropdown)
- `uploaded_image_file` (upload widget)
- `uploaded_video_file` (upload widget)
- `max_duration` (float)

**Hidden fields:**

- `media_path`
- `seed`
- `reddit_url`
- `subreddit_url`

### Randomize Media from Path Mode

**Visible fields:**

- `media_source` (dropdown)
- `media_type` (dropdown)
- `media_path` (text input)
- `seed` (integer)
- `max_duration` (float)

**Hidden fields:**

- `uploaded_image_file`
- `uploaded_video_file`
- `reddit_url`
- `subreddit_url`

### Reddit Post Mode

**Visible fields:**

- `media_source` (dropdown)
- `media_type` (dropdown)
- `reddit_url` (text input)
- `max_duration` (float)

**Hidden fields:**

- `media_path`
- `seed`
- `uploaded_image_file`
- `uploaded_video_file`
- `subreddit_url`

### Randomize from Subreddit Mode

**Visible fields:**

- `media_source` (dropdown)
- `media_type` (dropdown)
- `subreddit_url` (text input) ⭐ **Only shown in this mode**
- `seed` (integer)
- `max_duration` (float)

**Hidden fields:**

- `media_path`
- `reddit_url`
- `uploaded_image_file`
- `uploaded_video_file`

## Key Feature: Subreddit URL Visibility

As requested, the `subreddit_url` field **only appears** when the user selects **"Randomize from Subreddit"** as the media source. This prevents UI clutter and makes it clear which field is needed for each mode.

## Technical Details

### Widget Management

The implementation uses ComfyUI's widget system to:

1. Find all relevant widgets by name
2. Toggle visibility by changing widget `type` between `"text"/"number"` (visible) and `"hidden"` (invisible)
3. Use `computeSize` function to collapse hidden widgets (`[0, -4]`)
4. Force UI refresh after visibility changes

### Update Triggers

The widget visibility updates automatically when:

- The node is first created (initial setup)
- The user changes the `media_source` dropdown value

### Code Location

The MediaSelection node handler is registered in:

```javascript
// In /web/js/swiss-army-knife.js
else if (nodeData.name === "MediaSelection") {
    // ... implementation ...
}
```

## Ported from MediaDescribe

This implementation follows the same pattern used in the MediaDescribe node, which has been working reliably. The key differences:

- MediaSelection doesn't need the complex upload button widgets (uses ComfyUI's built-in upload)
- Simplified logic since there's no media processing in this node
- Same widget hiding/showing approach for consistency

## Testing

To verify the implementation:

1. Add a MediaSelection node to your workflow
2. Change the `media_source` dropdown
3. Observe that only relevant fields appear for each mode
4. Specifically verify that `subreddit_url` only appears for "Randomize from Subreddit"

## Benefits

- **Cleaner UI**: Only shows fields relevant to current mode
- **Less confusion**: Users see exactly what they need
- **Consistent UX**: Matches MediaDescribe node behavior
- **Reduced errors**: Can't accidentally fill wrong fields
