# Control Panel Data Population Debugging (Archived)

**Status:** Archived on November 30, 2025. The `ControlPanelOverview` node was removed, so this guide is kept only for legacy workflows that still reference the retired node. Modern workflows should use `ControlPanelPromptBreakdown` and the steps documented in `CONTROL_PANEL.md`.

Legacy troubleshooting checklist (for reference only):

1. Enable `DEBUG=true` so the Python logger prints incoming kwargs from `ControlPanelOverview`.
2. Check browser DevTools for `[ControlPanel DEBUG]` logs verifying that `message.output.all_media_describe_data` exists.
3. Ensure upstream nodes emit `all_media_describe_data` JSON strings; otherwise the UI displayed "No inputs connected".
4. Validate FFmpeg/metadata helpers if the right column stayed empty—most issues stemmed from missing `media_info`, `height`, or `width` keys.

> If you still have a workflow that uses `ControlPanelOverview`, delete the node or swap it for `ControlPanelPromptBreakdown`. Keeping the old node in the graph will now show a missing-node placeholder inside ComfyUI.
