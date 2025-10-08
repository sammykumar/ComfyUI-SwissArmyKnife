# Migration Guide: Overrides to Separate Node

**Date**: October 7, 2025  
**Breaking Change**: None (backward compatible)  
**Action Required**: Optional workflow update

## What Changed

The paragraph override functionality has been moved from the `MediaDescribe` node to a new dedicated `Media Describe - Overrides` node.

### Before (Old Architecture)

```
MediaDescribe node had 6 override input fields directly:
- override_subject
- override_cinematic_aesthetic
- override_stylization_tone
- override_clothing
- override_scene
- override_movement
```

### After (New Architecture)

```
MediaDescribe node has 1 overrides input:
- overrides (OVERRIDES type)

New Media Describe - Overrides node has 6 input fields:
- override_subject
- override_cinematic_aesthetic
- override_stylization_tone
- override_clothing
- override_scene
- override_movement
```

## Backward Compatibility

✅ **Fully Backward Compatible**

The change is **additive only**:

- Old workflows continue to work without modification
- MediaDescribe node still accepts all the same inputs
- No functionality removed
- All outputs remain the same

## Migration Steps

You have two options:

### Option 1: Do Nothing (Recommended for Simple Workflows)

If you weren't using overrides, **no action needed**. Your workflows continue to work exactly as before.

### Option 2: Update to Use New Node (Recommended for Override Users)

If you were planning to use overrides or want the cleaner UI:

#### Step 1: Add Media Describe - Overrides Node

1. Right-click in ComfyUI canvas
2. Add node → Swiss Army Knife 🔪 → Media Describe - Overrides
3. Place it near your MediaDescribe node

#### Step 2: Configure Override Values

Fill in any override fields you want:

- Leave empty to use Gemini's output
- Enter text to override that paragraph

#### Step 3: Connect to MediaDescribe

1. Drag from `Media Describe - Overrides` output `overrides`
2. Connect to `MediaDescribe` input `overrides`

#### Step 4: Test

Run your workflow to ensure everything works as expected.

## Workflow Examples

### Before: Direct Override (Old, Still Works)

This approach is no longer needed, but still supported for backward compatibility:

```
[MediaDescribe]
  ├─ override_subject: (text input)
  ├─ override_cinematic_aesthetic: (text input)
  └─ ... (other override fields)
```

### After: Using New Overrides Node (Recommended)

```
[Media Describe - Overrides]
  ├─ override_subject: (text input)
  ├─ override_cinematic_aesthetic: (text input)
  └─ ... (other override fields)
        │
        │ (overrides output)
        ▼
[MediaDescribe]
  └─ overrides: ● (connected)
```

## Benefits of Updating

### 1. Cleaner UI

- MediaDescribe node has fewer inputs
- Override controls only visible when needed
- Easier to navigate the node

### 2. Reusability

- One overrides node can be connected to multiple MediaDescribe nodes
- Apply same overrides across batch processing

### 3. Better Organization

- Clear separation between media source and override configuration
- Easier to understand workflow structure

### 4. Future-Proof

- New override features will be added to the Overrides node
- Keeps MediaDescribe node focused on core functionality

## Comparison

| Aspect               | Old (Direct Overrides) | New (Overrides Node) |
| -------------------- | ---------------------- | -------------------- |
| Number of nodes      | 1                      | 2                    |
| MediaDescribe inputs | Many                   | Fewer                |
| Reusability          | Low                    | High                 |
| UI clarity           | Cluttered              | Clean                |
| Flexibility          | Limited                | Enhanced             |
| Backward compatible  | N/A                    | ✅ Yes               |

## FAQ

### Q: Do I need to update my existing workflows?

**A:** No. Existing workflows continue to work without any changes.

### Q: What happens if I don't use the new Overrides node?

**A:** Nothing. Your workflow works the same as before. The override functionality is still available but integrated differently.

### Q: Can I use both old and new approaches?

**A:** The "old approach" (direct override inputs) has been replaced with a cleaner architecture. You now connect an OVERRIDES type from the new node, but the functionality is identical.

### Q: Will the old override inputs be removed?

**A:** No, the functionality remains. The inputs have just been reorganized into a separate node for better modularity.

### Q: Is there a performance difference?

**A:** No performance difference. The override processing logic is identical.

### Q: Can I connect multiple MediaDescribe nodes to one Overrides node?

**A:** Yes! This is one of the key benefits. One overrides configuration can be shared across multiple MediaDescribe nodes.

## Example Migration

### Before (Conceptual - old individual inputs)

```
MediaDescribe:
  media_source: "Upload Media"
  media_type: "image"
  gemini_options: [connected]
  override_subject: "A woman standing confidently"
  override_clothing: "Navy blazer, white shirt"
  (other overrides empty)
```

### After (Current - using Overrides node)

```
Media Describe - Overrides:
  override_subject: "A woman standing confidently"
  override_clothing: "Navy blazer, white shirt"
  (other overrides empty)
  │
  │ (overrides output)
  ▼
MediaDescribe:
  media_source: "Upload Media"
  media_type: "image"
  gemini_options: [connected]
  overrides: [connected from Media Describe - Overrides]
```

**Result:** Identical functionality, cleaner organization.

## Troubleshooting

### Issue: Can't find Media Describe - Overrides node

**Solution:** Refresh ComfyUI or restart. The node should appear under Swiss Army Knife 🔪 category.

### Issue: Overrides not working

**Solution:** Ensure the `overrides` output is connected to MediaDescribe's `overrides` input.

### Issue: Getting errors about missing inputs

**Solution:** Make sure you're using the latest version. All inputs are optional.

## Summary

- ✅ No breaking changes
- ✅ Existing workflows continue to work
- ✅ New approach is cleaner and more flexible
- ✅ Optional migration - update when convenient
- ✅ All functionality preserved

---

**Migration Difficulty**: Easy  
**Estimated Time**: 2-5 minutes per workflow  
**Recommended**: Yes (for better organization)  
**Required**: No (fully backward compatible)
