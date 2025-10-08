import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

// Version and cache busting info
const EXTENSION_VERSION = "2.5.6"; // Should match pyproject.toml version
const LOAD_TIMESTAMP = new Date().toISOString();

// DEBUG mode - will be loaded from server config
let DEBUG_ENABLED = false; // Default to false, will be set by server config

// Conditional logging wrapper
const debugLog = (...args) => {
    if (DEBUG_ENABLED) {
        console.log("[SwissArmyKnife]", ...args);
    }
};

// Load DEBUG setting from server
async function loadDebugConfig() {
    try {
        const response = await fetch("/swissarmyknife/config");
        if (response.ok) {
            const config = await response.json();
            DEBUG_ENABLED = config.debug || false;
            console.log(`Swiss Army Knife Debug Mode: ${DEBUG_ENABLED ? "ENABLED" : "DISABLED"}`);
        } else {
            console.warn("Failed to load Swiss Army Knife config, defaulting to DEBUG=false");
        }
    } catch (error) {
        console.warn("Error loading Swiss Army Knife config:", error);
    }
}

// Load config immediately
loadDebugConfig();

console.log(`Loading swiss-army-knife.js extension v${EXTENSION_VERSION} at ${LOAD_TIMESTAMP}`);

// Register custom widgets for Swiss Army Knife nodes
app.registerExtension({
    name: "comfyui_swissarmyknife.swiss_army_knife",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Handle GeminiUtilOptions node
        if (nodeData.name === "GeminiUtilOptions") {
            debugLog("Registering GeminiUtilOptions node");

            // This node doesn't need special widgets - it just provides configuration
            // The existing ComfyUI widgets are sufficient for this node
        }

        // Handle FilenameGenerator node
        else if (nodeData.name === "FilenameGenerator") {
            debugLog("Registering FilenameGenerator node");

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Add a preview widget to show the generated filename
                this.addWidget(
                    "text",
                    "filename_preview",
                    "",
                    (value) => {
                        // This is a read-only preview widget
                    },
                    { multiline: true }
                );

                // Function to update the filename preview
                this.updateFilenamePreview = function () {
                    try {
                        // For scheduler, check if it's connected via input first
                        let scheduler = "scheduler_input";
                        const schedulerInput = this.inputs?.find(
                            (input) => input.name === "scheduler"
                        );
                        if (schedulerInput && schedulerInput.link) {
                            scheduler = "scheduler_connected";
                        } else {
                            // Fallback to widget if no connection (shouldn't happen with SAMPLER type, but for safety)
                            const schedulerWidget = this.widgets.find(
                                (w) => w.name === "scheduler"
                            );
                            if (schedulerWidget) {
                                scheduler = schedulerWidget.value || "scheduler_input";
                            }
                        }

                        const shift = this.widgets.find((w) => w.name === "shift")?.value || 12.0;
                        const total_steps =
                            this.widgets.find((w) => w.name === "total_steps")?.value || 40;
                        const shift_step =
                            this.widgets.find((w) => w.name === "shift_step")?.value || 25;
                        const high_cfg =
                            this.widgets.find((w) => w.name === "high_cfg")?.value || 3.0;
                        const low_cfg =
                            this.widgets.find((w) => w.name === "low_cfg")?.value || 4.0;
                        const base_filename =
                            this.widgets.find((w) => w.name === "base_filename")?.value || "base";
                        const subdirectory_prefix =
                            this.widgets.find((w) => w.name === "subdirectory_prefix")?.value || "";
                        const add_date_subdirectory =
                            this.widgets.find((w) => w.name === "add_date_subdirectory")?.value !==
                            false;

                        // Format float values to replace decimal points with underscores
                        const shift_str = shift.toFixed(2).replace(".", "_");
                        const high_cfg_str = high_cfg.toFixed(2).replace(".", "_");
                        const low_cfg_str = low_cfg.toFixed(2).replace(".", "_");

                        // Clean scheduler string to ensure it's filename-safe
                        const scheduler_clean = scheduler
                            .toString()
                            .trim()
                            .replace(/\s/g, "_")
                            .toLowerCase();

                        // Clean base filename to ensure it's filename-safe
                        const base_clean = base_filename.toString().trim().replace(/\s/g, "_");

                        // Generate the filename components
                        const filename_parts = [
                            base_clean,
                            "scheduler",
                            scheduler_clean,
                            "shift",
                            shift_str,
                            "total_steps",
                            total_steps.toString(),
                            "shift_step",
                            shift_step.toString(),
                            "highCFG",
                            high_cfg_str,
                            "lowCFG",
                            low_cfg_str,
                        ];

                        // Join all parts with underscores
                        let filename = filename_parts.join("_");

                        // Build directory structure with optional subdirectory prefix and date
                        const directory_parts = [];

                        // Add subdirectory prefix if provided
                        if (subdirectory_prefix && subdirectory_prefix.trim()) {
                            const prefix_clean = subdirectory_prefix.trim().replace(/\s/g, "_");
                            directory_parts.push(prefix_clean);
                        }

                        // Add date subdirectory if requested
                        if (add_date_subdirectory) {
                            const current_date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
                            directory_parts.push(current_date);
                        }

                        // Combine directory parts with filename
                        let full_path;
                        if (directory_parts.length > 0) {
                            full_path = directory_parts.join("/") + "/" + filename;
                        } else {
                            full_path = filename;
                        }

                        // Update the preview widget
                        const previewWidget = this.widgets.find(
                            (w) => w.name === "filename_preview"
                        );
                        if (previewWidget) {
                            previewWidget.value = `Preview:\n${full_path}`;
                        }
                    } catch (error) {
                        console.log("Error updating filename preview:", error);
                        const previewWidget = this.widgets.find(
                            (w) => w.name === "filename_preview"
                        );
                        if (previewWidget) {
                            previewWidget.value = "Preview:\nError generating filename";
                        }
                    }
                };

                // Set up listeners for all input widgets to update the preview
                const inputWidgetNames = [
                    "shift",
                    "total_steps",
                    "shift_step",
                    "high_cfg",
                    "low_cfg",
                    "base_filename",
                    "subdirectory_prefix",
                    "add_date_subdirectory",
                ];

                for (const widgetName of inputWidgetNames) {
                    const widget = this.widgets.find((w) => w.name === widgetName);
                    if (widget) {
                        const originalCallback = widget.callback;
                        widget.callback = (...args) => {
                            if (originalCallback) {
                                originalCallback.apply(widget, args);
                            }
                            // Update preview after a small delay to ensure the value is set
                            setTimeout(() => this.updateFilenamePreview(), 10);
                        };
                    }
                }

                // Listen for input connections/disconnections to update preview
                const originalOnConnectionsChange = this.onConnectionsChange;
                this.onConnectionsChange = function (type, slotIndex, connected, linkInfo, ioSlot) {
                    if (originalOnConnectionsChange) {
                        originalOnConnectionsChange.call(
                            this,
                            type,
                            slotIndex,
                            connected,
                            linkInfo,
                            ioSlot
                        );
                    }
                    // Update preview when scheduler input changes
                    if (type === 1 && ioSlot && ioSlot.name === "scheduler") {
                        // type 1 = input
                        setTimeout(() => this.updateFilenamePreview(), 10);
                    }
                };

                // Initial preview update
                setTimeout(() => this.updateFilenamePreview(), 100);

                return result;
            };
        }

        // Handle Control Panel node
        else if (nodeData.name === "ControlPanel") {
            debugLog("Registering ControlPanel node");

            // Augment prototype to add helpers and context menu
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function (info) {
                const result = onConfigure?.call(this, info);
                // Ensure we have a counter for dynamic inputs
                this._cp_inputCount = this._cp_inputCount ?? 0;
                return result;
            };

            // Add context menu entry to add wildcard inputs
            const getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
            nodeType.prototype.getExtraMenuOptions = function (_, options) {
                getExtraMenuOptions?.call(this, _, options);
                options.push(
                    {
                        content: "➕ Add input",
                        callback: () => {
                            this._cp_inputCount = (this._cp_inputCount ?? 0) + 1;
                            const name = `in${this._cp_inputCount}`;
                            // "*" accepts any datatype (except primitives)
                            this.addInput(name, "*");
                            this.setDirtyCanvas(true, true);
                            // Update summary after adding input
                            if (this.updateControlPanelSummary) {
                                this.updateControlPanelSummary();
                            }
                        },
                    },
                    {
                        content: "♻︎ Rebuild summary",
                        callback: () => {
                            if (this.updateControlPanelSummary) {
                                this.updateControlPanelSummary();
                            }
                        },
                    }
                );
            };

            // When links are made/broken, refresh the DOM widget
            const onConnectionsChange = nodeType.prototype.onConnectionsChange;
            nodeType.prototype.onConnectionsChange = function (
                type,
                index,
                connected,
                link_info,
                io_slot
            ) {
                const result = onConnectionsChange?.call(
                    this,
                    type,
                    index,
                    connected,
                    link_info,
                    io_slot
                );
                // Small debounce
                queueMicrotask(() => {
                    if (this.updateControlPanelSummary) {
                        this.updateControlPanelSummary();
                    }
                });
                return result;
            };

            // On resize, keep DOM width sensible
            const onResize = nodeType.prototype.onResize;
            nodeType.prototype.onResize = function (size) {
                const result = onResize?.call(this, size);
                if (this._cp_dom) {
                    this._cp_dom.style.width = this.size[0] - 20 + "px";
                }
                return result;
            };

            // Node creation
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Note: The node already has "all_media_describe_data" input from Python
                // We don't need to add default inputs since it has a predefined input
                // Users can still add more inputs via context menu if needed

                // Initialize input counter based on existing inputs
                this._cp_inputCount = this.inputs?.length || 0;

                // Create a DOM widget area with two-column layout
                if (!this._cp_dom) {
                    // Main container
                    const dom = document.createElement("div");
                    dom.style.fontFamily =
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
                    dom.style.fontSize = "11px";
                    dom.style.lineHeight = "1.35";
                    dom.style.overflow = "auto";
                    dom.style.maxHeight = "100%";
                    dom.style.padding = "8px";
                    dom.style.borderRadius = "6px";
                    dom.style.background = "var(--comfy-menu-bg, #1e1e1e)";
                    dom.style.border = "1px solid var(--border-color, #333)";
                    dom.style.color = "var(--fg-color, #d4d4d4)";
                    dom.style.display = "flex";
                    dom.style.gap = "12px";

                    // Left column (media_info, gemini_status, processed_media_path)
                    const leftColumn = document.createElement("div");
                    leftColumn.style.flex = "1";
                    leftColumn.style.minWidth = "0"; // Allow flex to shrink below content size
                    leftColumn.style.whiteSpace = "pre-wrap";
                    leftColumn.style.wordBreak = "break-word";
                    leftColumn.style.overflow = "auto";

                    // Right column (description, final_string, height, width)
                    const rightColumn = document.createElement("div");
                    rightColumn.style.flex = "1";
                    rightColumn.style.minWidth = "0"; // Allow flex to shrink below content size
                    rightColumn.style.whiteSpace = "pre-wrap";
                    rightColumn.style.wordBreak = "break-word";
                    rightColumn.style.overflow = "auto";

                    dom.appendChild(leftColumn);
                    dom.appendChild(rightColumn);

                    // Add a DOM widget
                    const widget = this.addDOMWidget("ControlPanel", "cp_display", dom, {
                        serialize: false, // Don't store big text in workflow JSON
                        hideOnZoom: false,
                    });

                    // Store references
                    this._cp_dom = dom;
                    this._cp_leftColumn = leftColumn;
                    this._cp_rightColumn = rightColumn;
                    this._cp_widget = widget;
                }

                // Function to update summary display
                this.updateControlPanelSummary = function () {
                    if (!this._cp_leftColumn || !this._cp_rightColumn) return;

                    const lines = [];
                    const inputs = this.inputs || [];

                    for (let i = 0; i < inputs.length; i++) {
                        const slot = inputs[i];
                        const link = this.getInputLink(i);

                        if (!link) {
                            lines.push(`${slot.name}: (not connected)`);
                            continue;
                        }

                        // Get origin node information - with null checks
                        const graph = this.graph || app.graph;
                        if (!graph) {
                            lines.push(`${slot.name}: (connected, graph not ready)`);
                            continue;
                        }

                        const originNode = graph.getNodeById?.(link.origin_id);
                        const originName = originNode?.title || `Node#${link.origin_id}`;
                        const outName =
                            originNode?.outputs?.[link.origin_slot]?.name ??
                            `out${link.origin_slot}`;

                        lines.push(`${slot.name} ⇐ ${originName}.${outName}`);
                    }

                    const summaryText = lines.length
                        ? lines.join("\n")
                        : "No inputs yet. Right-click → ➕ Add input";

                    // Display summary in left column, leave right column empty
                    this._cp_leftColumn.textContent = summaryText;
                    this._cp_rightColumn.textContent = "Awaiting execution...";
                    this.setDirtyCanvas(true, true);
                };

                // Function to update with execution data
                this.updateControlPanelData = function (data) {
                    if (!this._cp_leftColumn || !this._cp_rightColumn || !data) return;

                    // Helper function to format field display
                    const formatField = (emoji, label, value, skipTruncate = false) => {
                        let valueStr = String(value);
                        // Truncate very long values unless skipTruncate is true
                        if (!skipTruncate && valueStr.length > 500) {
                            valueStr = valueStr.substring(0, 500) + "... (truncated)";
                        }
                        return `${emoji} ${label}:\n${valueStr}\n\n`;
                    };

                    const leftLines = [];
                    const rightLines = [];

                    leftLines.push("═══ LEFT PANEL ═══\n\n");
                    rightLines.push("═══ RIGHT PANEL ═══\n\n");

                    // Check if we have all_media_describe_data and it's JSON
                    if (data.all_media_describe_data) {
                        try {
                            const jsonValue = Array.isArray(data.all_media_describe_data)
                                ? data.all_media_describe_data[0]
                                : data.all_media_describe_data;
                            const parsedData = JSON.parse(jsonValue);

                            debugLog("[ControlPanel] Parsed JSON data:", parsedData);

                            // Left column: media_info, gemini_status (with prompts), processed_media_path, height, width
                            const leftFields = [
                                { key: "media_info", emoji: "📊", label: "Media Info" },
                                { key: "gemini_status", emoji: "🔄", label: "Gemini Status" },
                                {
                                    key: "processed_media_path",
                                    emoji: "📁",
                                    label: "Processed Media Path",
                                },
                                { key: "height", emoji: "📐", label: "Height" },
                                { key: "width", emoji: "📐", label: "Width" },
                            ];

                            // Right column: final_string only (no truncation)
                            const rightFields = [
                                { key: "final_string", emoji: "✨", label: "Final String" },
                            ];

                            // Populate left column
                            for (const field of leftFields) {
                                if (parsedData.hasOwnProperty(field.key)) {
                                    let fieldValue = parsedData[field.key];

                                    leftLines.push(
                                        formatField(field.emoji, field.label, fieldValue)
                                    );
                                }
                            }

                            // Populate right column (without truncation)
                            for (const field of rightFields) {
                                if (parsedData.hasOwnProperty(field.key)) {
                                    rightLines.push(
                                        formatField(
                                            field.emoji,
                                            field.label,
                                            parsedData[field.key],
                                            true
                                        )
                                    );
                                }
                            }
                        } catch (e) {
                            debugLog("[ControlPanel] Error parsing JSON:", e);
                            // Fall back to displaying raw data in left column only
                            for (const [key, value] of Object.entries(data)) {
                                const displayValue = Array.isArray(value) ? value[0] : value;
                                leftLines.push(formatField("📊", key, displayValue));
                            }
                            rightLines.push("(Error parsing data)");
                        }
                    } else {
                        // No all_media_describe_data, display all fields in left column
                        for (const [key, value] of Object.entries(data)) {
                            const displayValue = Array.isArray(value) ? value[0] : value;
                            leftLines.push(formatField("📊", key, displayValue));
                        }
                        rightLines.push("(No media describe data)");
                    }

                    this._cp_leftColumn.textContent = leftLines.join("");
                    this._cp_rightColumn.textContent = rightLines.join("");
                    debugLog("[ControlPanel] Updated display with execution data");
                };

                // Add onExecuted handler to update display with execution results
                const originalOnExecuted = this.onExecuted;
                this.onExecuted = function (message) {
                    debugLog("[ControlPanel] onExecuted called with message:", message);

                    if (message && message.output) {
                        this.updateControlPanelData(message.output);
                    }

                    // Call original onExecuted if it exists
                    return originalOnExecuted?.call(this, message);
                };

                // Initial summary update - defer to ensure graph is ready
                setTimeout(() => {
                    if (this.updateControlPanelSummary) {
                        this.updateControlPanelSummary();
                    }
                }, 100);

                return result;
            };
        }

        // Handle MediaSelection node
        else if (nodeData.name === "MediaSelection") {
            debugLog("Registering MediaSelection node with dynamic media widgets");

            // Add custom widget after the node is created
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Find the media_source widget
                this.mediaSourceWidget = this.widgets.find((w) => w.name === "media_source");

                // Find the media_type widget
                this.mediaTypeWidget = this.widgets.find((w) => w.name === "media_type");

                // Find the resize_mode widget
                this.resizeModeWidget = this.widgets.find((w) => w.name === "resize_mode");

                // Function to update resize widgets based on resize_mode
                this.updateResizeWidgets = function () {
                    const resizeMode = this.resizeModeWidget?.value || "None";

                    debugLog(`[MediaSelection] ========== updateResizeWidgets CALLED ==========`);
                    debugLog(`[MediaSelection] Current resize_mode value: "${resizeMode}"`);

                    // Find the resize widgets
                    const resizeWidthWidget = this.widgets.find((w) => w.name === "resize_width");
                    const resizeHeightWidget = this.widgets.find((w) => w.name === "resize_height");

                    debugLog(`[MediaSelection] Found resize_width widget: ${!!resizeWidthWidget}`);
                    debugLog(
                        `[MediaSelection] Found resize_height widget: ${!!resizeHeightWidget}`
                    );

                    if (resizeWidthWidget) {
                        debugLog(
                            `[MediaSelection] resize_width current type: "${resizeWidthWidget.type}", value: ${resizeWidthWidget.value}`
                        );
                    }
                    if (resizeHeightWidget) {
                        debugLog(
                            `[MediaSelection] resize_height current type: "${resizeHeightWidget.type}", value: ${resizeHeightWidget.value}`
                        );
                    }

                    // Show/hide based on resize_mode
                    if (resizeMode === "Custom") {
                        // Show width and height widgets
                        debugLog(
                            `[MediaSelection] MODE IS CUSTOM - Showing resize width and height widgets`
                        );
                        if (resizeWidthWidget) {
                            resizeWidthWidget.type = "number";
                            resizeWidthWidget.computeSize =
                                resizeWidthWidget.constructor.prototype.computeSize;
                            resizeWidthWidget.hidden = false;
                            if (resizeWidthWidget.options) {
                                resizeWidthWidget.options.serialize = true;
                            }
                            debugLog(`[MediaSelection] Set resize_width visible`);
                        }
                        if (resizeHeightWidget) {
                            resizeHeightWidget.type = "number";
                            resizeHeightWidget.computeSize =
                                resizeHeightWidget.constructor.prototype.computeSize;
                            resizeHeightWidget.hidden = false;
                            if (resizeHeightWidget.options) {
                                resizeHeightWidget.options.serialize = true;
                            }
                            debugLog(`[MediaSelection] Set resize_height visible`);
                        }
                    } else {
                        // Hide width and height widgets for "None" and "Auto (by orientation)"
                        debugLog(
                            `[MediaSelection] MODE IS "${resizeMode}" - Hiding resize width and height widgets`
                        );
                        if (resizeWidthWidget) {
                            resizeWidthWidget.type = "hidden";
                            resizeWidthWidget.computeSize = () => [0, -4];
                            resizeWidthWidget.hidden = true;
                            if (resizeWidthWidget.options) {
                                resizeWidthWidget.options.serialize = false;
                            }
                            debugLog(
                                `[MediaSelection] Set resize_width hidden (type: ${resizeWidthWidget.type}, hidden: ${resizeWidthWidget.hidden})`
                            );
                        }
                        if (resizeHeightWidget) {
                            resizeHeightWidget.type = "hidden";
                            resizeHeightWidget.computeSize = () => [0, -4];
                            resizeHeightWidget.hidden = true;
                            if (resizeHeightWidget.options) {
                                resizeHeightWidget.options.serialize = false;
                            }
                            debugLog(
                                `[MediaSelection] Set resize_height hidden (type: ${resizeHeightWidget.type}, hidden: ${resizeHeightWidget.hidden})`
                            );
                        }
                    }

                    debugLog(`[MediaSelection] Calling setSize to recalculate node size`);
                    // Force node to recalculate size and refresh UI
                    const newSize = this.computeSize();
                    debugLog(`[MediaSelection] Computed size: [${newSize[0]}, ${newSize[1]}]`);
                    this.setSize(newSize);

                    // Additional UI refresh
                    if (this.graph && this.graph.setDirtyCanvas) {
                        this.graph.setDirtyCanvas(true, true);
                        debugLog(`[MediaSelection] Called setDirtyCanvas to refresh UI`);
                    }

                    // Force canvas redraw
                    if (this.setDirtyCanvas) {
                        this.setDirtyCanvas(true, true);
                    }

                    debugLog(`[MediaSelection] ========== updateResizeWidgets COMPLETE ==========`);
                };

                // Function to update widgets based on media_source
                this.updateMediaWidgets = function () {
                    const mediaSource = this.mediaSourceWidget?.value || "Upload Media";

                    debugLog(`[MediaSelection] Updating widgets: mediaSource=${mediaSource}`);

                    // Find the widgets we need to control
                    const originalMediaPathWidget = this.widgets.find(
                        (w) => w.name === "media_path"
                    );
                    const originalSeedWidget = this.widgets.find((w) => w.name === "seed");
                    const originalRedditUrlWidget = this.widgets.find(
                        (w) => w.name === "reddit_url"
                    );
                    const originalSubredditUrlWidget = this.widgets.find(
                        (w) => w.name === "subreddit_url"
                    );
                    const originalUploadedImageWidget = this.widgets.find(
                        (w) => w.name === "uploaded_image_file"
                    );
                    const originalUploadedVideoWidget = this.widgets.find(
                        (w) => w.name === "uploaded_video_file"
                    );

                    // Manage visibility based on media_source
                    if (mediaSource === "Randomize Media from Path") {
                        debugLog("[MediaSelection] Showing media path widget");

                        // Show media_path
                        if (originalMediaPathWidget) {
                            originalMediaPathWidget.type = "text";
                            originalMediaPathWidget.computeSize =
                                originalMediaPathWidget.constructor.prototype.computeSize;
                        }

                        // Show seed for randomization
                        if (originalSeedWidget) {
                            originalSeedWidget.type = "number";
                            originalSeedWidget.computeSize =
                                originalSeedWidget.constructor.prototype.computeSize;
                        }

                        // Hide reddit_url
                        if (originalRedditUrlWidget) {
                            originalRedditUrlWidget.type = "hidden";
                            originalRedditUrlWidget.computeSize = () => [0, -4];
                        }

                        // Hide subreddit_url
                        if (originalSubredditUrlWidget) {
                            originalSubredditUrlWidget.type = "hidden";
                            originalSubredditUrlWidget.computeSize = () => [0, -4];
                        }

                        // Hide upload widgets
                        if (originalUploadedImageWidget) {
                            originalUploadedImageWidget.type = "hidden";
                            originalUploadedImageWidget.computeSize = () => [0, -4];
                        }
                        if (originalUploadedVideoWidget) {
                            originalUploadedVideoWidget.type = "hidden";
                            originalUploadedVideoWidget.computeSize = () => [0, -4];
                        }
                    } else if (mediaSource === "Randomize from Subreddit") {
                        debugLog(
                            "[MediaSelection] Randomize from Subreddit mode - showing Subreddit URL widget"
                        );

                        // Show subreddit_url
                        if (originalSubredditUrlWidget) {
                            originalSubredditUrlWidget.type = "text";
                            originalSubredditUrlWidget.computeSize =
                                originalSubredditUrlWidget.constructor.prototype.computeSize;
                        }

                        // Show seed for randomization
                        if (originalSeedWidget) {
                            originalSeedWidget.type = "number";
                            originalSeedWidget.computeSize =
                                originalSeedWidget.constructor.prototype.computeSize;
                        }

                        // Hide media_path
                        if (originalMediaPathWidget) {
                            originalMediaPathWidget.type = "hidden";
                            originalMediaPathWidget.computeSize = () => [0, -4];
                        }

                        // Hide reddit_url
                        if (originalRedditUrlWidget) {
                            originalRedditUrlWidget.type = "hidden";
                            originalRedditUrlWidget.computeSize = () => [0, -4];
                        }

                        // Hide upload widgets
                        if (originalUploadedImageWidget) {
                            originalUploadedImageWidget.type = "hidden";
                            originalUploadedImageWidget.computeSize = () => [0, -4];
                        }
                        if (originalUploadedVideoWidget) {
                            originalUploadedVideoWidget.type = "hidden";
                            originalUploadedVideoWidget.computeSize = () => [0, -4];
                        }
                    } else if (mediaSource === "Reddit Post") {
                        debugLog("[MediaSelection] Reddit Post mode - showing Reddit URL widget");

                        // Show reddit_url
                        if (originalRedditUrlWidget) {
                            originalRedditUrlWidget.type = "text";
                            originalRedditUrlWidget.computeSize =
                                originalRedditUrlWidget.constructor.prototype.computeSize;
                        }

                        // Hide media_path
                        if (originalMediaPathWidget) {
                            originalMediaPathWidget.type = "hidden";
                            originalMediaPathWidget.computeSize = () => [0, -4];
                        }

                        // Hide seed (not needed for single Reddit post)
                        if (originalSeedWidget) {
                            originalSeedWidget.type = "hidden";
                            originalSeedWidget.computeSize = () => [0, -4];
                        }

                        // Hide subreddit_url
                        if (originalSubredditUrlWidget) {
                            originalSubredditUrlWidget.type = "hidden";
                            originalSubredditUrlWidget.computeSize = () => [0, -4];
                        }

                        // Hide upload widgets
                        if (originalUploadedImageWidget) {
                            originalUploadedImageWidget.type = "hidden";
                            originalUploadedImageWidget.computeSize = () => [0, -4];
                        }
                        if (originalUploadedVideoWidget) {
                            originalUploadedVideoWidget.type = "hidden";
                            originalUploadedVideoWidget.computeSize = () => [0, -4];
                        }
                    } else {
                        // Upload Media mode
                        debugLog("[MediaSelection] Upload Media mode");

                        // Hide media_path
                        if (originalMediaPathWidget) {
                            originalMediaPathWidget.type = "hidden";
                            originalMediaPathWidget.computeSize = () => [0, -4];
                        }

                        // Hide seed (not needed for upload)
                        if (originalSeedWidget) {
                            originalSeedWidget.type = "hidden";
                            originalSeedWidget.computeSize = () => [0, -4];
                        }

                        // Hide reddit_url
                        if (originalRedditUrlWidget) {
                            originalRedditUrlWidget.type = "hidden";
                            originalRedditUrlWidget.computeSize = () => [0, -4];
                        }

                        // Hide subreddit_url
                        if (originalSubredditUrlWidget) {
                            originalSubredditUrlWidget.type = "hidden";
                            originalSubredditUrlWidget.computeSize = () => [0, -4];
                        }

                        // Show upload widgets (these are managed by the upload widget system in ComfyUI)
                        if (originalUploadedImageWidget) {
                            originalUploadedImageWidget.type = "text";
                            originalUploadedImageWidget.computeSize =
                                originalUploadedImageWidget.constructor.prototype.computeSize;
                        }
                        if (originalUploadedVideoWidget) {
                            originalUploadedVideoWidget.type = "text";
                            originalUploadedVideoWidget.computeSize =
                                originalUploadedVideoWidget.constructor.prototype.computeSize;
                        }
                    }

                    debugLog(
                        `[MediaSelection] Widget update complete. Total widgets: ${
                            this.widgets?.length || 0
                        }`
                    );

                    // Update resize widgets to ensure proper visibility
                    this.updateResizeWidgets();

                    // Force node to recalculate size and refresh UI
                    this.setSize(this.computeSize());

                    // Additional UI refresh
                    if (this.graph && this.graph.setDirtyCanvas) {
                        this.graph.setDirtyCanvas(true, true);
                    }

                    // Force a render update
                    setTimeout(() => {
                        if (this.setDirtyCanvas) {
                            this.setDirtyCanvas(true);
                        }
                        this.setSize(this.computeSize());
                    }, 10);
                };

                // Initial setup - call updateResizeWidgets first, then updateMediaWidgets
                // (updateMediaWidgets will call updateResizeWidgets at the end)
                debugLog(`[MediaSelection] onNodeCreated - Running initial setup`);
                this.updateResizeWidgets();
                this.updateMediaWidgets();

                // Hook into media_source widget changes
                if (this.mediaSourceWidget) {
                    const originalSourceCallback = this.mediaSourceWidget.callback;
                    this.mediaSourceWidget.callback = (value) => {
                        debugLog(`[MediaSelection] media_source changed to: "${value}"`);
                        if (originalSourceCallback)
                            originalSourceCallback.call(this.mediaSourceWidget, value);
                        this.updateMediaWidgets();
                    };
                }

                // Hook into resize_mode widget changes
                if (this.resizeModeWidget) {
                    const originalResizeModeCallback = this.resizeModeWidget.callback;
                    this.resizeModeWidget.callback = (value) => {
                        debugLog(`[MediaSelection] resize_mode changed to: "${value}"`);
                        if (originalResizeModeCallback)
                            originalResizeModeCallback.call(this.resizeModeWidget, value);
                        this.updateResizeWidgets();
                    };
                }

                debugLog(`[MediaSelection] onNodeCreated complete`);
                return result;
            };

            // Add onConfigure to handle widget visibility when loading from a saved workflow
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function (info) {
                debugLog("[MediaSelection] ========== onConfigure CALLED ==========");
                debugLog("[MediaSelection] Config info:", info);

                const result = onConfigure?.call(this, info);

                debugLog(
                    "[MediaSelection] onConfigure - updating widget visibility after config load"
                );

                // Update widget visibility after configuration is loaded
                // Use setTimeout to ensure widgets are fully restored first
                setTimeout(() => {
                    debugLog("[MediaSelection] onConfigure setTimeout - updating widgets now");
                    if (this.updateResizeWidgets) {
                        this.updateResizeWidgets();
                    }
                    if (this.updateMediaWidgets) {
                        this.updateMediaWidgets();
                    }
                    debugLog("[MediaSelection] onConfigure setTimeout - updates complete");
                }, 10);

                debugLog("[MediaSelection] ========== onConfigure COMPLETE ==========");
                return result;
            };
        }

        // Handle MediaDescribePromptBreakdown node
        else if (nodeData.name === "MediaDescribePromptBreakdown") {
            debugLog("Registering MediaDescribePromptBreakdown node");

            // On resize, keep DOM width sensible
            const onResize = nodeType.prototype.onResize;
            nodeType.prototype.onResize = function (size) {
                const result = onResize?.call(this, size);
                if (this._breakdown_dom) {
                    this._breakdown_dom.style.width = this.size[0] - 20 + "px";
                }
                return result;
            };

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Create a DOM widget for custom display (no text field)
                if (!this._breakdown_dom) {
                    const dom = document.createElement("div");
                    dom.style.fontFamily =
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
                    dom.style.fontSize = "13px";
                    dom.style.lineHeight = "1.5";
                    dom.style.overflow = "auto";
                    dom.style.maxHeight = "100%";
                    dom.style.padding = "12px";
                    dom.style.borderRadius = "6px";
                    dom.style.background = "var(--comfy-menu-bg, #1e1e1e)";
                    dom.style.border = "1px solid var(--border-color, #333)";
                    dom.style.color = "var(--fg-color, #d4d4d4)";
                    dom.style.whiteSpace = "pre-wrap";
                    dom.style.wordBreak = "break-word";
                    dom.textContent = "Waiting for data...";

                    // Add a DOM widget
                    const widget = this.addDOMWidget(
                        "MediaDescribePromptBreakdown",
                        "breakdown_display",
                        dom,
                        {
                            serialize: false, // Don't store in workflow JSON
                            hideOnZoom: false,
                        }
                    );

                    // Store references
                    this._breakdown_dom = dom;
                    this._breakdown_widget = widget;
                }

                // Method to format and display breakdown
                this.displayBreakdown = function (jsonData) {
                    if (!this._breakdown_dom) return;

                    try {
                        const data = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

                        debugLog("[PromptBreakdown] ===== FULL DATA DUMP =====");
                        debugLog("[PromptBreakdown] Parsed data:", data);
                        debugLog("[PromptBreakdown] Data keys:", Object.keys(data));

                        // Log each field with its first 150 characters
                        const fields = [
                            "subject",
                            "cinematic_aesthetic",
                            "stylization_tone",
                            "clothing",
                            "scene",
                            "movement",
                        ];
                        fields.forEach((field) => {
                            const value = data[field];
                            if (value) {
                                debugLog(
                                    `[PromptBreakdown] ${field}: "${value.substring(0, 150)}..."`
                                );
                            } else {
                                debugLog(`[PromptBreakdown] ${field}: EMPTY or MISSING`);
                            }
                        });
                        debugLog("[PromptBreakdown] ===== END DATA DUMP =====");

                        let displayText = "";
                        const sections = [
                            { key: "subject", label: "🎯 SUBJECT", divider: "=" },
                            {
                                key: "cinematic_aesthetic",
                                label: "🎬 CINEMATIC AESTHETIC",
                                divider: "=",
                            },
                            {
                                key: "stylization_tone",
                                label: "🎨 STYLIZATION & TONE",
                                divider: "=",
                            },
                            { key: "clothing", label: "👔 CLOTHING", divider: "=" },
                            { key: "scene", label: "🏞️ SCENE", divider: "=" },
                            { key: "movement", label: "🎭 MOVEMENT", divider: "=" },
                        ];

                        for (const section of sections) {
                            if (data[section.key] && data[section.key].trim()) {
                                const dividerLine = section.divider.repeat(50);
                                displayText += `${dividerLine}\n`;
                                displayText += `${section.label}\n`;
                                displayText += `${dividerLine}\n`;
                                displayText += `${data[section.key]}\n\n`;
                            } else {
                                debugLog(
                                    `[PromptBreakdown] ⚠️ Section ${section.key} is empty or missing`
                                );
                            }
                        }

                        this._breakdown_dom.textContent =
                            displayText.trim() || "No paragraph data available";
                        this.setDirtyCanvas(true, true);
                    } catch (e) {
                        debugLog("[PromptBreakdown] ❌ Error parsing JSON:", e);
                        this._breakdown_dom.textContent =
                            "Error: Invalid JSON data\n\n" + e.message;
                        this.setDirtyCanvas(true, true);
                    }
                };

                return result;
            };

            // Update display when executed
            const onExecuted = nodeType.prototype.onExecuted;
            nodeType.prototype.onExecuted = function (message) {
                const result = onExecuted?.apply(this, arguments);

                debugLog("[PromptBreakdown] onExecuted called");
                debugLog("[PromptBreakdown] Message:", message);
                debugLog(
                    "[PromptBreakdown] Message keys:",
                    message ? Object.keys(message) : "null"
                );

                // Check for data in the UI field (standard ComfyUI pattern for display nodes)
                if (message && message.all_media_describe_data) {
                    const jsonData = Array.isArray(message.all_media_describe_data)
                        ? message.all_media_describe_data[0]
                        : message.all_media_describe_data;

                    debugLog(
                        "[PromptBreakdown] Found data in message.all_media_describe_data:",
                        jsonData?.substring(0, 200)
                    );
                    this.displayBreakdown(jsonData);
                    return result;
                }

                // Fallback: check widgets
                const dataWidget = this.widgets?.find((w) => w.name === "all_media_describe_data");
                if (dataWidget && dataWidget.value) {
                    debugLog(
                        "[PromptBreakdown] Found widget data:",
                        dataWidget.value.substring(0, 200)
                    );
                    this.displayBreakdown(dataWidget.value);
                    return result;
                }

                debugLog("[PromptBreakdown] No data found in message or widgets");
                return result;
            };
        }
    },

    // Hook to handle workflow loading
    loadedGraphNode(node, app) {
        if (node.comfyClass === "MediaDescribe") {
            debugLog("[LOADED] loadedGraphNode called for MediaDescribe");

            // Check if this node has saved UI state with uploaded file data
            const hasSavedVideoData = node.ui_state?.uploaded_file_info?.video?.file;
            const hasSavedImageData = node.ui_state?.uploaded_file_info?.image?.file;

            debugLog(
                "[LOADED] hasSavedVideoData:",
                !!hasSavedVideoData,
                "hasSavedImageData:",
                !!hasSavedImageData
            );
            debugLog("[LOADED] Saved video file:", hasSavedVideoData);
            debugLog("[LOADED] Saved image file:", hasSavedImageData);

            // Only call updateMediaWidgets if we don't have any saved uploaded file data
            // If we have saved data, onConfigure will handle the restoration
            if (!hasSavedVideoData && !hasSavedImageData && node.updateMediaWidgets) {
                debugLog("[LOADED] No saved uploaded file data found, applying default UI state");
                setTimeout(() => {
                    node.updateMediaWidgets();
                    debugLog("[LOADED] Applied default UI state for loaded workflow node");
                }, 100); // Small delay to ensure all widgets are properly initialized
            } else {
                debugLog(
                    "[LOADED] Saved uploaded file data found, skipping updateMediaWidgets to preserve onConfigure restoration"
                );
            }
        }
    },

    // Setup app-level execution handler for MediaDescribe and ControlPanel
    async setup() {
        // Hook into API events to catch execution results
        api.addEventListener("executed", ({ detail }) => {
            const { node: nodeId, output } = detail;

            debugLog("[API] Execution event received for node:", nodeId);
            debugLog("[API] Output data:", output);
            debugLog("[API] Output keys:", output ? Object.keys(output) : "null");

            // Find the node by ID
            const node = app.graph.getNodeById(parseInt(nodeId));
            debugLog("[API] Node found:", !!node, "comfyClass:", node?.comfyClass);

            // Log ALL execution events to see what's happening
            debugLog(
                "[API] All execution event - nodeId:",
                nodeId,
                "comfyClass:",
                node?.comfyClass
            );

            // Handle MediaDescribe execution
            if (node && node.comfyClass === "MediaDescribe") {
                debugLog("[API] ✅ Found MediaDescribe execution result");
                debugLog("[API] Full output structure:", JSON.stringify(output, null, 2));

                // Extract dimensions from output
                // Output structure: {height: [1080], width: [1920], ...}
                let height = null;
                let width = null;

                if (output && output.height && output.width) {
                    height = Array.isArray(output.height) ? output.height[0] : output.height;
                    width = Array.isArray(output.width) ? output.width[0] : output.width;
                    debugLog("[API] Extracted dimensions from API event:", width, "x", height);

                    // Update the dimensions display using the helper method
                    if (node.updateDimensionsDisplay) {
                        node.updateDimensionsDisplay(height, width);
                    } else {
                        debugLog(
                            "[API] WARNING: updateDimensionsDisplay method not found on node!"
                        );
                    }
                } else {
                    debugLog("[API] ⚠️ No height/width in output. Output structure:", output);
                }
            }
            // Handle MediaDescribePromptBreakdown execution
            else if (node && node.comfyClass === "MediaDescribePromptBreakdown") {
                debugLog("[API] ✅ Found MediaDescribePromptBreakdown execution result");
                debugLog("[API] Prompt Breakdown output:", output);

                // The node receives all_media_describe_data via its input widget
                // Check the widget for the data
                const dataWidget = node.widgets?.find((w) => w.name === "all_media_describe_data");
                if (dataWidget && dataWidget.value) {
                    debugLog(
                        "[API] Found all_media_describe_data in widget:",
                        dataWidget.value.substring(0, 100)
                    );
                    if (node.displayBreakdown) {
                        node.displayBreakdown(dataWidget.value);
                    } else {
                        debugLog("[API] WARNING: displayBreakdown method not found on node!");
                    }
                } else {
                    debugLog("[API] WARNING: all_media_describe_data widget not found or empty!");

                    // Fallback: try to get from connected source node
                    if (node.inputs && node.inputs.length > 0) {
                        const input = node.inputs[0];
                        if (input.link !== null) {
                            const link = app.graph.links[input.link];
                            if (link) {
                                const sourceNode = app.graph.getNodeById(link.origin_id);
                                debugLog("[API] Source node:", sourceNode?.comfyClass);

                                // Check if we can get the data from the source node's last execution
                                if (sourceNode && sourceNode.comfyClass === "MediaDescribe") {
                                    // Try to find cached output data
                                    const sourceWidget = sourceNode.widgets?.find(
                                        (w) => w.name === "all_media_describe_data_cache"
                                    );
                                    if (sourceWidget && sourceWidget.value) {
                                        debugLog("[API] Found data from source node cache");
                                        if (node.displayBreakdown) {
                                            node.displayBreakdown(sourceWidget.value);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // Handle ControlPanel execution
            else if (node && node.comfyClass === "ControlPanel") {
                debugLog("[API] ✅ Found ControlPanel execution result");
                debugLog("[API] Full output structure:", JSON.stringify(output, null, 2));

                // Update the control panel display with execution data
                if (node.updateControlPanelData && output) {
                    node.updateControlPanelData(output);
                } else {
                    debugLog(
                        "[API] WARNING: updateControlPanelData method not found or no output!"
                    );
                }
            } else {
                debugLog("[API] ❌ Not a MediaDescribe or ControlPanel node, skipping");
            }
        });
    },
});

// Cache busting and development utility extension
app.registerExtension({
    name: "comfyui_swissarmyknife.cache_control",

    async setup() {
        // Log cache busting info for debugging
        debugLog(`Swiss Army Knife Cache Info: v${EXTENSION_VERSION}, loaded at ${LOAD_TIMESTAMP}`);

        // Add cache busting utilities for development
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            console.log("Development mode detected - cache busting utilities available");

            // Add global cache clearing function
            window.clearSwissArmyKnifeCache = function () {
                console.log("Clearing Swiss Army Knife extension cache...");

                // Clear localStorage items related to our extension
                Object.keys(localStorage).forEach((key) => {
                    if (key.includes("swissarmyknife") || key.includes("swiss_army_knife")) {
                        localStorage.removeItem(key);
                        console.log(`Cleared localStorage: ${key}`);
                    }
                });

                // Clear sessionStorage items
                Object.keys(sessionStorage).forEach((key) => {
                    if (key.includes("swissarmyknife") || key.includes("swiss_army_knife")) {
                        sessionStorage.removeItem(key);
                        console.log(`Cleared sessionStorage: ${key}`);
                    }
                });

                console.log("Swiss Army Knife cache cleared. Refreshing page...");
                setTimeout(() => {
                    window.location.reload(true);
                }, 1000);
            };

            // Add reload function for development
            window.reloadSwissArmyKnife = function () {
                console.log("Reloading Swiss Army Knife extension...");
                window.location.reload(true);
            };

            console.log("Development utilities added:");
            console.log("- clearSwissArmyKnifeCache() - Clear extension cache and reload");
            console.log("- reloadSwissArmyKnife() - Force page reload with cache bypass");
        }

        // Add version check mechanism
        this.checkVersionUpdates();
    },

    checkVersionUpdates() {
        const lastSeenVersion = localStorage.getItem("swissarmyknife_last_version");

        if (lastSeenVersion && lastSeenVersion !== EXTENSION_VERSION) {
            console.log(
                `Swiss Army Knife updated from v${lastSeenVersion} to v${EXTENSION_VERSION}`
            );

            // Show update notification if available
            if (app.extensionManager?.toast?.add) {
                app.extensionManager.toast.add({
                    severity: "info",
                    summary: "Extension Updated",
                    detail: `Swiss Army Knife updated to v${EXTENSION_VERSION}`,
                    life: 5000,
                });
            }
        }

        // Store current version
        localStorage.setItem("swissarmyknife_last_version", EXTENSION_VERSION);
    },
});

// LoRAInfoExtractor workflow serialization extension
// app.registerExtension({
//     name: "comfyui_swissarmyknife.lora_info_extractor",

//     async setup() {
//         // Listen for execution results at the app level
//         const original_onExecuted = app.onExecuted;
//         app.onExecuted = function (nodeId, data) {
//             debugLog("[DEBUG] App execution completed for node:", nodeId, "data:", data);

//             // Find the node by ID and check if it's LoRAInfoExtractor
//             const node = app.graph.getNodeById(nodeId);
//             if (node && node.comfyClass === "LoRAInfoExtractor") {
//                 debugLog("[DEBUG] Found LoRAInfoExtractor execution result");

//                 // Try to extract lora_json from the execution data
//                 if (data && data[0]) {
//                     // First output should be lora_json
//                     node._cached_lora_json = data[0];
//                     debugLog(
//                         "[DEBUG] Cached lora_json from app execution:",
//                         data[0].substring(0, 100) + "..."
//                     );
//                 }
//             }

//             // Call original handler
//             return original_onExecuted?.call(this, nodeId, data);
//         };
//     },

//     async beforeRegisterNodeDef(nodeType, nodeData, app) {
//         if (nodeData.name === "LoRAInfoExtractor") {
//             debugLog("[DEBUG] Registering LoRAInfoExtractor widget extensions");

//             // Add onSerialize method to save lora_json output to workflow
//             const onSerialize = nodeType.prototype.onSerialize;
//             nodeType.prototype.onSerialize = function (o) {
//                 const result = onSerialize?.apply(this, arguments);

//                 debugLog("[DEBUG] LoRAInfoExtractor onSerialize called for node:", this.id);
//                 debugLog("[DEBUG] Current cached lora_json:", !!this._cached_lora_json);
//                 debugLog("[DEBUG] Serialization object before:", JSON.stringify(o, null, 2));

//                 // Save the cached lora_json output if available
//                 if (this._cached_lora_json) {
//                     o.lora_json_output = this._cached_lora_json;
//                     debugLog(
//                         "[SERIALIZE] Saved lora_json to workflow:",
//                         typeof this._cached_lora_json === "string"
//                             ? this._cached_lora_json.substring(0, 100) + "..."
//                             : JSON.stringify(this._cached_lora_json).substring(0, 100) + "..."
//                     );
//                 } else {
//                     debugLog("[SERIALIZE] No cached lora_json to save");
//                 }

//                 debugLog("[DEBUG] Serialization object after:", JSON.stringify(o, null, 2));
//                 return result;
//             };

//             // Add onConfigure method to restore lora_json from workflow
//             const onConfigure = nodeType.prototype.onConfigure;
//             nodeType.prototype.onConfigure = function (o) {
//                 const result = onConfigure?.apply(this, arguments);

//                 debugLog("[DEBUG] LoRAInfoExtractor onConfigure called");

//                 // Restore the cached lora_json output if available
//                 if (o.lora_json_output) {
//                     this._cached_lora_json = o.lora_json_output;
//                     debugLog(
//                         "[CONFIGURE] Restored lora_json from workflow:",
//                         o.lora_json_output?.substring(0, 100) + "..."
//                     );
//                 }

//                 return result;
//             };
//         }
//     },

//     async nodeCreated(node) {
//         if (node.comfyClass === "LoRAInfoExtractor") {
//             debugLog("[DEBUG] LoRAInfoExtractor node created, ID:", node.id);

//             // Listen for node execution results
//             const originalOnExecuted = node.onExecuted;
//             node.onExecuted = function (message) {
//                 debugLog("[DEBUG] LoRAInfoExtractor onExecuted called");
//                 debugLog("[DEBUG] Full message object:", JSON.stringify(message, null, 2));

//                 // Try different possible message structures
//                 let loraJsonValue = null;

//                 // Try different paths where the lora_json might be
//                 if (message && message.output) {
//                     debugLog("[DEBUG] message.output exists:", message.output);

//                     // Check if it's directly in output
//                     if (message.output.lora_json) {
//                         debugLog("[DEBUG] Found lora_json in message.output.lora_json");
//                         loraJsonValue = Array.isArray(message.output.lora_json)
//                             ? message.output.lora_json[0]
//                             : message.output.lora_json;
//                     }
//                     // Check if it's in a different structure
//                     else if (message.output[0]) {
//                         debugLog("[DEBUG] Found output[0]:", message.output[0]);
//                         loraJsonValue = message.output[0];
//                     }
//                 }

//                 // Also check if message itself has the data
//                 if (!loraJsonValue && message.lora_json) {
//                     debugLog("[DEBUG] Found lora_json in message.lora_json");
//                     loraJsonValue = Array.isArray(message.lora_json)
//                         ? message.lora_json[0]
//                         : message.lora_json;
//                 }

//                 if (loraJsonValue) {
//                     this._cached_lora_json = loraJsonValue;
//                     debugLog(
//                         "[DEBUG] Cached lora_json from execution:",
//                         typeof loraJsonValue === "string"
//                             ? loraJsonValue.substring(0, 100) + "..."
//                             : JSON.stringify(loraJsonValue).substring(0, 100) + "..."
//                     );
//                 } else {
//                     debugLog("[DEBUG] No lora_json found in execution message");
//                 }

//                 // Call original onExecuted if it exists
//                 return originalOnExecuted?.call(this, message);
//             };
//         }

//         // Handle Control Panel node
//         if (nodeData.name === "ControlPanel") {
//             debugLog("Registering ControlPanel node");

//             const onNodeCreated = nodeType.prototype.onNodeCreated;
//             nodeType.prototype.onNodeCreated = function () {
//                 const result = onNodeCreated?.apply(this, arguments);

//                 // Create container div for all the display elements
//                 const containerEl = document.createElement("div");
//                 containerEl.style.cssText = `
//                     padding: 10px;
//                     background: #1e1e1e;
//                     border-radius: 4px;
//                     font-family: monospace;
//                     font-size: 12px;
//                     line-height: 1.5;
//                     color: #d4d4d4;
//                     width: 100%;
//                     box-sizing: border-box;
//                 `;

//                 // Create individual display sections
//                 const createSection = (label, id) => {
//                     const section = document.createElement("div");
//                     section.style.cssText = `
//                         margin-bottom: 10px;
//                         border-bottom: 1px solid #333;
//                         padding-bottom: 8px;
//                     `;

//                     const labelEl = document.createElement("div");
//                     labelEl.textContent = label;
//                     labelEl.style.cssText = `
//                         font-weight: bold;
//                         color: #569cd6;
//                         margin-bottom: 4px;
//                     `;

//                     const valueEl = document.createElement("div");
//                     valueEl.textContent = "(not connected)";
//                     valueEl.style.cssText = `
//                         color: #888;
//                         word-wrap: break-word;
//                         white-space: pre-wrap;
//                     `;
//                     valueEl.dataset.field = id;

//                     section.appendChild(labelEl);
//                     section.appendChild(valueEl);
//                     return section;
//                 };

//                 // Add all sections to container
//                 containerEl.appendChild(createSection("📝 Description", "description"));
//                 containerEl.appendChild(createSection("📊 Media Info", "media_info"));
//                 containerEl.appendChild(createSection("🔄 Gemini Status", "gemini_status"));
//                 containerEl.appendChild(
//                     createSection("📁 Processed Media", "processed_media_path")
//                 );
//                 containerEl.appendChild(createSection("✨ Final String", "final_string"));
//                 containerEl.appendChild(createSection("📐 Dimensions", "dimensions"));

//                 // Add as a DOM widget
//                 const displayWidget = this.addDOMWidget("controlpanel", "display", containerEl, {
//                     serialize: false,
//                     hideOnZoom: false,
//                 });

//                 // Compute size based on content
//                 displayWidget.computeSize = function (width) {
//                     // Calculate approximate height based on content
//                     // Each section is roughly 60px minimum
//                     return [width, 400]; // Fixed height for now
//                 };

//                 // Store reference to container for easy updates
//                 this.controlPanelContainer = containerEl;

//                 // Helper function to update display
//                 this.updateControlPanel = function (data) {
//                     if (!data || !this.controlPanelContainer) return;

//                     const fields = [
//                         "description",
//                         "media_info",
//                         "gemini_status",
//                         "processed_media_path",
//                         "final_string",
//                         "dimensions",
//                     ];

//                     fields.forEach((field) => {
//                         const valueEl = this.controlPanelContainer.querySelector(
//                             `[data-field="${field}"]`
//                         );
//                         if (valueEl && data[field]) {
//                             const value = Array.isArray(data[field]) ? data[field][0] : data[field];
//                             valueEl.textContent = value || "(not connected)";
//                             valueEl.style.color =
//                                 value && value !== "(not connected)" ? "#d4d4d4" : "#888";
//                         }
//                     });

//                     debugLog("[ControlPanel] Updated display with execution data");
//                 };

//                 // Add onExecuted handler to update display with execution results
//                 const originalOnExecuted = this.onExecuted;
//                 this.onExecuted = function (message) {
//                     debugLog("[ControlPanel] onExecuted called with message:", message);

//                     if (message && message.output) {
//                         this.updateControlPanel(message.output);
//                     }

//                     // Call original onExecuted if it exists
//                     return originalOnExecuted?.call(this, message);
//                 };

//                 return result;
//             };
//         }
//     },
// });
