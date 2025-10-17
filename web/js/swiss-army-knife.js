import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

// Version and cache busting info
const EXTENSION_VERSION = "2.8.11"; // Should match pyproject.toml version
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

// Helper functions for accessing API keys from settings
const getGeminiApiKey = () => {
    try {
        return app.extensionManager.setting.get("SwissArmyKnife.gemini.api_key") || "";
    } catch (error) {
        console.warn("Failed to get Gemini API key from settings:", error);
        return "";
    }
};

const getCivitaiApiKey = () => {
    try {
        return app.extensionManager.setting.get("SwissArmyKnife.civitai.api_key") || "";
    } catch (error) {
        console.warn("Failed to get CivitAI API key from settings:", error);
        return "";
    }
};

// Function to sync API keys to backend
const syncApiKeysToBackend = async () => {
    try {
        const geminiKey = getGeminiApiKey();
        const civitaiKey = getCivitaiApiKey();

        const response = await fetch("/swissarmyknife/set_api_keys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gemini_api_key: geminiKey,
                civitai_api_key: civitaiKey,
            }),
        });

        if (response.ok) {
            debugLog("[Settings] API keys synced to backend successfully");
        } else {
            console.warn("[Settings] Failed to sync API keys to backend:", response.status);
        }
    } catch (error) {
        console.warn("[Settings] Error syncing API keys to backend:", error);
    }
};

console.log(`Loading swiss-army-knife.js extension v${EXTENSION_VERSION} at ${LOAD_TIMESTAMP}`);

// Register custom widgets for Swiss Army Knife nodes
app.registerExtension({
    name: "comfyui_swissarmyknife.swiss_army_knife",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Handle GeminiUtilOptions node
        if (nodeData.name === "GeminiUtilOptions") {
            debugLog("Registering GeminiUtilOptions node");

            // This node no longer needs API key widgets - it uses ComfyUI settings
            // The API key is now retrieved from settings: SwissArmyKnife.gemini.api_key
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
        else if (nodeData.name === "ControlPanelOverview") {
            debugLog("Registering ControlPanelOverview node");

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

                // Create a DOM widget area with three-column layout
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

                    // Left column (final_prompt)
                    const leftColumn = document.createElement("div");
                    leftColumn.style.flex = "1";
                    leftColumn.style.minWidth = "0"; // Allow flex to shrink below content size
                    leftColumn.style.overflow = "auto";
                    leftColumn.style.borderRight = "1px solid var(--border-color, #333)";
                    leftColumn.style.paddingRight = "8px";
                    leftColumn.style.display = "flex";
                    leftColumn.style.flexDirection = "column";

                    const leftHeading = document.createElement("h3");
                    leftHeading.textContent = "Final Prompt";
                    leftHeading.style.margin = "0 0 8px 0";
                    leftHeading.style.fontSize = "14px";
                    leftHeading.style.fontWeight = "600";
                    leftHeading.style.color = "var(--fg-color, #d4d4d4)";
                    leftHeading.style.borderBottom = "2px solid var(--border-color, #333)";
                    leftHeading.style.paddingBottom = "4px";

                    const leftContent = document.createElement("div");
                    leftContent.style.whiteSpace = "pre-wrap";
                    leftContent.style.wordBreak = "break-word";
                    leftContent.style.overflow = "auto";
                    leftContent.style.flex = "1";

                    leftColumn.appendChild(leftHeading);
                    leftColumn.appendChild(leftContent);

                    // Middle column (gemini_status)
                    const middleColumn = document.createElement("div");
                    middleColumn.style.flex = "1";
                    middleColumn.style.minWidth = "0"; // Allow flex to shrink below content size
                    middleColumn.style.overflow = "auto";
                    middleColumn.style.borderRight = "1px solid var(--border-color, #333)";
                    middleColumn.style.paddingRight = "8px";
                    middleColumn.style.display = "flex";
                    middleColumn.style.flexDirection = "column";

                    const middleHeading = document.createElement("h3");
                    middleHeading.textContent = "Gemini Status";
                    middleHeading.style.margin = "0 0 8px 0";
                    middleHeading.style.fontSize = "14px";
                    middleHeading.style.fontWeight = "600";
                    middleHeading.style.color = "var(--fg-color, #d4d4d4)";
                    middleHeading.style.borderBottom = "2px solid var(--border-color, #333)";
                    middleHeading.style.paddingBottom = "4px";

                    const middleContent = document.createElement("div");
                    middleContent.style.whiteSpace = "pre-wrap";
                    middleContent.style.wordBreak = "break-word";
                    middleContent.style.overflow = "auto";
                    middleContent.style.flex = "1";

                    middleColumn.appendChild(middleHeading);
                    middleColumn.appendChild(middleContent);

                    // Right column (media_info, height, width)
                    const rightColumn = document.createElement("div");
                    rightColumn.style.flex = "1";
                    rightColumn.style.minWidth = "0"; // Allow flex to shrink below content size
                    rightColumn.style.overflow = "auto";
                    rightColumn.style.display = "flex";
                    rightColumn.style.flexDirection = "column";

                    const rightHeading = document.createElement("h3");
                    rightHeading.textContent = "Media Info";
                    rightHeading.style.margin = "0 0 8px 0";
                    rightHeading.style.fontSize = "14px";
                    rightHeading.style.fontWeight = "600";
                    rightHeading.style.color = "var(--fg-color, #d4d4d4)";
                    rightHeading.style.borderBottom = "2px solid var(--border-color, #333)";
                    rightHeading.style.paddingBottom = "4px";

                    const rightContent = document.createElement("div");
                    rightContent.style.whiteSpace = "pre-wrap";
                    rightContent.style.wordBreak = "break-word";
                    rightContent.style.overflow = "auto";
                    rightContent.style.flex = "1";

                    rightColumn.appendChild(rightHeading);
                    rightColumn.appendChild(rightContent);

                    dom.appendChild(leftColumn);
                    dom.appendChild(middleColumn);
                    dom.appendChild(rightColumn);

                    // Add a DOM widget
                    const widget = this.addDOMWidget("ControlPanelOverview", "cp_display", dom, {
                        serialize: false,
                        hideOnZoom: false,
                    });

                    // Store references to content divs
                    this._cp_dom = dom;
                    this._cp_leftColumn = leftContent;
                    this._cp_middleColumn = middleContent;
                    this._cp_rightColumn = rightContent;
                    this._cp_widget = widget;

                    // Initialize with waiting message
                    this._cp_leftColumn.textContent = "Awaiting execution...";
                    this._cp_middleColumn.textContent = "Awaiting execution...";
                    this._cp_rightColumn.textContent = "Awaiting execution...";
                }

                // Function to update with execution data
                this.updateControlPanelData = function (data) {
                    console.log("🔍 [ControlPanelOverview DEBUG] updateControlPanelData called");
                    console.log("🔍 [ControlPanelOverview DEBUG] data received:", data);
                    console.log(
                        "🔍 [ControlPanelOverview DEBUG] data keys:",
                        Object.keys(data || {})
                    );

                    if (
                        !this._cp_leftColumn ||
                        !this._cp_middleColumn ||
                        !this._cp_rightColumn ||
                        !data
                    ) {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] Missing columns or data, returning"
                        );
                        return;
                    }

                    debugLog("[ControlPanelOverview] Received data:", data);

                    // Extract all_media_describe_data - TRY MULTIPLE SOURCES
                    let mediaData = null;
                    let rawData = null;

                    // Try all possible locations for the data
                    if (data.all_media_describe_data) {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] Found data.all_media_describe_data"
                        );
                        rawData = Array.isArray(data.all_media_describe_data)
                            ? data.all_media_describe_data[0]
                            : data.all_media_describe_data;
                    } else if (data.all_media_describe_data_copy) {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] Found data.all_media_describe_data_copy"
                        );
                        rawData = Array.isArray(data.all_media_describe_data_copy)
                            ? data.all_media_describe_data_copy[0]
                            : data.all_media_describe_data_copy;
                    } else {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] No all_media_describe_data found in:",
                            Object.keys(data)
                        );
                    }

                    console.log("🔍 [ControlPanelOverview DEBUG] rawData:", rawData);
                    console.log("🔍 [ControlPanelOverview DEBUG] rawData type:", typeof rawData);

                    if (rawData) {
                        try {
                            // Parse JSON if it's a string
                            mediaData = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
                            console.log(
                                "🔍 [ControlPanelOverview DEBUG] Parsed mediaData:",
                                mediaData
                            );
                            debugLog("[ControlPanelOverview] Parsed media data:", mediaData);
                        } catch (e) {
                            console.error("🔍 [ControlPanelOverview DEBUG] Error parsing JSON:", e);
                            debugLog("[ControlPanelOverview] Error parsing JSON:", e);
                            this._cp_leftColumn.textContent = "Error parsing data";
                            this._cp_middleColumn.textContent = "Error parsing data";
                            this._cp_rightColumn.textContent = "Error parsing data";
                            return;
                        }
                    }

                    if (!mediaData) {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] No mediaData, showing 'no data available'"
                        );
                        this._cp_leftColumn.textContent = "(No data available)";
                        this._cp_middleColumn.textContent = "(No data available)";
                        this._cp_rightColumn.textContent = "(No data available)";
                        return;
                    }

                    console.log(
                        "🔍 [ControlPanelOverview DEBUG] mediaData keys:",
                        Object.keys(mediaData)
                    );

                    // Helper function to format field display
                    const formatValue = (value, maxLength = 500) => {
                        let valueStr = String(value);
                        if (valueStr.length > maxLength) {
                            valueStr = valueStr.substring(0, maxLength) + "... (truncated)";
                        }
                        return valueStr;
                    };

                    // Left column: Positive Prompt (check both field names for backwards compatibility)
                    const finalText =
                        mediaData.positive_prompt ||
                        mediaData.final_prompt ||
                        mediaData.description;
                    if (finalText) {
                        console.log(
                            "🔍 [ControlPanel DEBUG] Setting positive prompt:",
                            finalText.substring(0, 50)
                        );
                        this._cp_leftColumn.textContent = formatValue(finalText, 2000);
                    } else {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] No positive_prompt/final_prompt/description in mediaData"
                        );
                        this._cp_leftColumn.textContent = "(No final text in data)";
                    }

                    // Middle column: Gemini Status
                    if (mediaData.gemini_status) {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] Setting gemini_status:",
                            mediaData.gemini_status.substring(0, 50)
                        );
                        this._cp_middleColumn.textContent = formatValue(
                            mediaData.gemini_status,
                            2000
                        );
                    } else {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] No gemini_status in mediaData"
                        );
                        this._cp_middleColumn.textContent = "(No gemini_status in data)";
                    }

                    // Right column: Media Info (including height, width, other metadata)
                    const rightLines = [];

                    if (mediaData.media_info) {
                        rightLines.push(`📊 Media Info:\n${formatValue(mediaData.media_info)}\n`);
                    }

                    if (mediaData.height !== undefined) {
                        rightLines.push(`📐 Height: ${mediaData.height}\n`);
                    }

                    if (mediaData.width !== undefined) {
                        rightLines.push(`📐 Width: ${mediaData.width}\n`);
                    }

                    // Stop here - only show media_info, height, and width
                    // Removed loop that displayed additional fields (subject, cinematic_aesthetic, etc.)

                    if (rightLines.length === 0) {
                        console.log("🔍 [ControlPanelOverview DEBUG] No right column data");
                        this._cp_rightColumn.textContent = "(No media info in data)";
                    } else {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] Setting right column with",
                            rightLines.length,
                            "lines"
                        );
                        this._cp_rightColumn.textContent = rightLines.join("\n");
                    }

                    console.log("🔍 [ControlPanelOverview DEBUG] Display update complete");
                    debugLog("[ControlPanelOverview] Updated display with execution data");
                };

                // Add onExecuted handler to update display with execution results
                const originalOnExecuted = this.onExecuted;
                this.onExecuted = function (message) {
                    console.log("🔍 [ControlPanelOverview DEBUG] onExecuted called");
                    console.log("🔍 [ControlPanelOverview DEBUG] Full message object:", message);
                    console.log(
                        "🔍 [ControlPanelOverview DEBUG] message keys:",
                        Object.keys(message || {})
                    );

                    if (message) {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] message.output:",
                            message.output
                        );
                        if (message.output) {
                            console.log(
                                "🔍 [ControlPanelOverview DEBUG] message.output keys:",
                                Object.keys(message.output)
                            );
                        }
                    }

                    debugLog("[ControlPanelOverview] onExecuted called with message:", message);

                    // Try multiple data sources - data might be at root or in output
                    if (message && message.output) {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] Calling updateControlPanelData with message.output:",
                            message.output
                        );
                        this.updateControlPanelData(message.output);
                    } else if (
                        message &&
                        (message.all_media_describe_data || message.all_media_describe_data_copy)
                    ) {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] Calling updateControlPanelData with message (root level):",
                            message
                        );
                        this.updateControlPanelData(message);
                    } else {
                        console.log(
                            "🔍 [ControlPanelOverview DEBUG] No data found in message.output or message root"
                        );
                    }

                    // Call original onExecuted if it exists
                    return originalOnExecuted?.call(this, message);
                };

                return result;
            };
        }

        // Handle ControlPanelPromptBreakdown node
        else if (nodeData.name === "ControlPanelPromptBreakdown") {
            debugLog("Registering ControlPanelPromptBreakdown node");

            // On resize, keep DOM width sensible
            const onResize = nodeType.prototype.onResize;
            nodeType.prototype.onResize = function (size) {
                const result = onResize?.call(this, size);
                if (this._cpb_dom) {
                    this._cpb_dom.style.width = this.size[0] - 20 + "px";
                }
                return result;
            };

            // Node creation
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Create a DOM widget area with 5-column layout for prompt breakdown
                if (!this._cpb_dom) {
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
                    dom.style.gap = "8px";

                    // Helper function to create a column
                    const createColumn = (heading) => {
                        const column = document.createElement("div");
                        column.style.flex = "1";
                        column.style.minWidth = "150px";
                        column.style.overflow = "auto";
                        column.style.borderRight = "1px solid var(--border-color, #333)";
                        column.style.paddingRight = "8px";
                        column.style.display = "flex";
                        column.style.flexDirection = "column";

                        const columnHeading = document.createElement("h3");
                        columnHeading.textContent = heading;
                        columnHeading.style.margin = "0 0 8px 0";
                        columnHeading.style.fontSize = "12px";
                        columnHeading.style.fontWeight = "600";
                        columnHeading.style.color = "var(--fg-color, #d4d4d4)";
                        columnHeading.style.borderBottom = "2px solid var(--border-color, #333)";
                        columnHeading.style.paddingBottom = "4px";

                        const columnContent = document.createElement("div");
                        columnContent.style.whiteSpace = "pre-wrap";
                        columnContent.style.wordBreak = "break-word";
                        columnContent.style.overflow = "auto";
                        columnContent.style.flex = "1";
                        columnContent.textContent = "Awaiting execution...";

                        column.appendChild(columnHeading);
                        column.appendChild(columnContent);

                        return { column, content: columnContent };
                    };

                    // Create 5 columns
                    const subjectCol = createColumn("Subject");
                    const clothingCol = createColumn("Clothing");
                    const movementCol = createColumn("Movement");
                    const sceneCol = createColumn("Scene");
                    const visualStyleCol = createColumn("Visual Style");

                    // Remove border from last column
                    visualStyleCol.column.style.borderRight = "none";

                    dom.appendChild(subjectCol.column);
                    dom.appendChild(clothingCol.column);
                    dom.appendChild(movementCol.column);
                    dom.appendChild(sceneCol.column);
                    dom.appendChild(visualStyleCol.column);

                    // Add a DOM widget
                    const widget = this.addDOMWidget(
                        "ControlPanelPromptBreakdown",
                        "cpb_display",
                        dom,
                        {
                            serialize: false,
                            hideOnZoom: false,
                        }
                    );

                    // Store references
                    this._cpb_dom = dom;
                    this._cpb_subject = subjectCol.content;
                    this._cpb_clothing = clothingCol.content;
                    this._cpb_movement = movementCol.content;
                    this._cpb_scene = sceneCol.content;
                    this._cpb_visual_style = visualStyleCol.content;
                    this._cpb_widget = widget;
                }

                // Function to update with execution data
                this.updatePromptBreakdownData = function (data) {
                    console.log(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] updatePromptBreakdownData called"
                    );
                    console.log("🔍 [ControlPanelPromptBreakdown DEBUG] data received:", data);
                    console.log(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] data keys:",
                        Object.keys(data || {})
                    );

                    debugLog("[ControlPanelPromptBreakdown] updatePromptBreakdownData called");
                    debugLog("[ControlPanelPromptBreakdown] data received:", data);

                    if (!this._cpb_subject || !data) {
                        console.log(
                            "[ControlPanelPromptBreakdown DEBUG] Missing columns or data, returning"
                        );
                        debugLog(
                            "[ControlPanelPromptBreakdown] Missing columns or data, returning"
                        );
                        return;
                    }

                    // Extract prompt_breakdown data
                    let promptBreakdown = null;
                    let rawData = null;

                    // First try prompt_breakdown field (legacy)
                    if (data.prompt_breakdown) {
                        console.log(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Found data.prompt_breakdown"
                        );
                        rawData = Array.isArray(data.prompt_breakdown)
                            ? data.prompt_breakdown[0]
                            : data.prompt_breakdown;
                    }
                    // Then try all_media_describe_data (current format from MediaDescribe node)
                    else if (data.all_media_describe_data) {
                        console.log(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Found data.all_media_describe_data"
                        );
                        rawData = Array.isArray(data.all_media_describe_data)
                            ? data.all_media_describe_data[0]
                            : data.all_media_describe_data;
                    }
                    // Finally try all_media_describe_data_copy (backup)
                    else if (data.all_media_describe_data_copy) {
                        console.log(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Found data.all_media_describe_data_copy"
                        );
                        rawData = Array.isArray(data.all_media_describe_data_copy)
                            ? data.all_media_describe_data_copy[0]
                            : data.all_media_describe_data_copy;
                    }

                    console.log("🔍 [ControlPanelPromptBreakdown DEBUG] rawData:", rawData);
                    console.log(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] rawData type:",
                        typeof rawData
                    );

                    if (rawData) {
                        try {
                            promptBreakdown =
                                typeof rawData === "string" ? JSON.parse(rawData) : rawData;
                            console.log(
                                "🔍 [ControlPanelPromptBreakdown DEBUG] Parsed breakdown:",
                                promptBreakdown
                            );
                            debugLog(
                                "[ControlPanelPromptBreakdown] Parsed breakdown:",
                                promptBreakdown
                            );
                        } catch (e) {
                            console.error(
                                "🔍 [ControlPanelPromptBreakdown DEBUG] Error parsing JSON:",
                                e
                            );
                            debugLog("[ControlPanelPromptBreakdown] Error parsing JSON:", e);
                            this._cpb_subject.textContent = "Error parsing data";
                            this._cpb_clothing.textContent = "Error parsing data";
                            this._cpb_movement.textContent = "Error parsing data";
                            this._cpb_scene.textContent = "Error parsing data";
                            this._cpb_visual_style.textContent = "Error parsing data";
                            return;
                        }
                    }

                    if (!promptBreakdown) {
                        console.log(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] No promptBreakdown, showing 'no data available'"
                        );
                        this._cpb_subject.textContent = "(No data available)";
                        this._cpb_clothing.textContent = "(No data available)";
                        this._cpb_movement.textContent = "(No data available)";
                        this._cpb_scene.textContent = "(No data available)";
                        this._cpb_visual_style.textContent = "(No data available)";
                        return;
                    }

                    console.log(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] Updating columns with data"
                    );

                    // Update each column
                    this._cpb_subject.textContent = promptBreakdown.subject || "(empty)";
                    this._cpb_clothing.textContent = promptBreakdown.clothing || "(empty)";
                    this._cpb_movement.textContent = promptBreakdown.movement || "(empty)";
                    this._cpb_scene.textContent = promptBreakdown.scene || "(empty)";
                    this._cpb_visual_style.textContent =
                        promptBreakdown.visual_style ||
                        // Fallback: combine old fields for backward compatibility
                        (
                            (promptBreakdown.cinematic_aesthetic || "") +
                            " " +
                            (promptBreakdown.stylization_tone || "")
                        ).trim() ||
                        "(empty)";

                    console.log("🔍 [ControlPanelPromptBreakdown DEBUG] Display update complete");
                    debugLog("[ControlPanelPromptBreakdown] Display update complete");
                };

                // Add onExecuted handler
                const originalOnExecuted = this.onExecuted;
                this.onExecuted = function (message) {
                    console.log("🔍 [ControlPanelPromptBreakdown DEBUG] onExecuted called");
                    console.log(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] Full message object:",
                        message
                    );
                    console.log(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] message keys:",
                        Object.keys(message || {})
                    );

                    debugLog("[ControlPanelPromptBreakdown] onExecuted called");

                    if (message && message.output) {
                        console.log(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Calling updatePromptBreakdownData with message.output"
                        );
                        this.updatePromptBreakdownData(message.output);
                    } else if (message && message.prompt_breakdown) {
                        console.log(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Calling updatePromptBreakdownData with message (root level)"
                        );
                        this.updatePromptBreakdownData(message);
                    } else if (
                        message &&
                        (message.all_media_describe_data || message.all_media_describe_data_copy)
                    ) {
                        console.log(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Calling updatePromptBreakdownData with all_media_describe_data"
                        );
                        this.updatePromptBreakdownData(message);
                    } else {
                        console.log(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] No data found in message.output, message.prompt_breakdown, or all_media_describe_data"
                        );
                    }

                    return originalOnExecuted?.call(this, message);
                };

                return result;
            };
        }

        // Handle MediaSelection node
        else if (nodeData.name === "MediaSelection") {
            debugLog("Registering MediaSelection node with dynamic media widgets");

            // nodeType.prototype.size = [500, 500];

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
                // Helper function to safely remove a widget from the node
                this.removeWidgetSafely = function (widget) {
                    if (!widget) return;

                    const widgetIndex = this.widgets.indexOf(widget);
                    if (widgetIndex > -1) {
                        this.widgets.splice(widgetIndex, 1);
                        console.log(`🔍 [MediaSelection] Removed widget: ${widget.name}`);
                    }

                    // Remove DOM element if it exists
                    if (widget.element && widget.element.parentNode) {
                        widget.element.parentNode.removeChild(widget.element);
                        console.log(`🔍 [MediaSelection] Removed DOM element for: ${widget.name}`);
                    }
                };

                this.updateMediaWidgets = function () {
                    const mediaSource = this.mediaSourceWidget?.value || "Reddit Post";

                    console.log(
                        `🔍 [MediaSelection UPLOAD DEBUG] ========== updateMediaWidgets START ==========`
                    );
                    console.log(`🔍 [MediaSelection UPLOAD DEBUG] mediaSource: "${mediaSource}"`);
                    console.log(
                        `🔍 [MediaSelection UPLOAD DEBUG] Total widgets before update: ${this.widgets?.length || 0}`
                    );

                    debugLog(`[MediaSelection] Updating widgets: mediaSource=${mediaSource}`);

                    // CRITICAL FIX: Remove upload buttons completely when not in Upload Media mode
                    // This follows the working version's approach of creating/removing rather than hiding/showing
                    const existingImageButton = this.widgets.find(
                        (w) => w.name === "upload_image_button"
                    );
                    const existingVideoButton = this.widgets.find(
                        (w) => w.name === "upload_video_button"
                    );

                    console.log(
                        `🔍 [MediaSelection UPLOAD DEBUG] Found existing buttons: image=${!!existingImageButton}, video=${!!existingVideoButton}`
                    );

                    // If NOT in Upload Media mode, remove all upload buttons completely
                    if (mediaSource !== "Upload Media") {
                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] � NOT in Upload Media mode - removing all upload buttons`
                        );

                        if (existingImageButton) {
                            this.removeWidgetSafely(existingImageButton);
                            console.log(
                                `🔍 [MediaSelection UPLOAD DEBUG] 🗑️ Removed imageUploadButton`
                            );
                        }
                        if (existingVideoButton) {
                            this.removeWidgetSafely(existingVideoButton);
                            console.log(
                                `🔍 [MediaSelection UPLOAD DEBUG] �️ Removed videoUploadButton`
                            );
                        }

                        // Reset references
                        this.imageUploadButton = null;
                        this.videoUploadButton = null;
                    }

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
                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] === RANDOMIZE MEDIA FROM PATH MODE ===`
                        );
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

                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] Randomize Mode - upload buttons already removed`
                        );
                        // Upload buttons are automatically removed by the logic above since mediaSource !== "Upload Media"
                    } else if (mediaSource === "Randomize from Subreddit") {
                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] === RANDOMIZE FROM SUBREDDIT MODE ===`
                        );
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

                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] Subreddit Mode - upload buttons already removed`
                        );
                        // Upload buttons are automatically removed by the logic above since mediaSource !== "Upload Media"
                    } else if (mediaSource === "Reddit Post") {
                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] === REDDIT POST MODE (DEFAULT) ===`
                        );
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

                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] Reddit Post Mode - upload buttons already removed`
                        );
                        // Upload buttons are automatically removed by the logic above since mediaSource !== "Upload Media"
                    } else {
                        // Upload Media mode
                        console.log(`🔍 [MediaSelection UPLOAD DEBUG] === UPLOAD MEDIA MODE ===`);
                        debugLog("[MediaSelection] Upload Media mode - setting up upload widgets");

                        const mediaType = this.mediaTypeWidget?.value || "image";
                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] Upload mode - mediaType: ${mediaType}`
                        );

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

                        // Show/hide upload widgets based on media_type
                        if (mediaType === "image") {
                            debugLog("[MediaSelection] Showing image upload widget");

                            // Keep the original uploaded_image_file widget hidden for storing the file path
                            if (originalUploadedImageWidget) {
                                originalUploadedImageWidget.type = "hidden";
                                originalUploadedImageWidget.computeSize = () => [0, -4];
                            }

                            // Check if we already have an upload button, if not create one
                            let imageUploadButton = this.widgets.find(
                                (w) => w.name === "upload_image_button"
                            );

                            console.log(
                                `🔍 [MediaSelection UPLOAD DEBUG] Image mode - imageUploadButton exists: ${!!imageUploadButton}`
                            );

                            if (!imageUploadButton) {
                                console.log(
                                    `🔍 [MediaSelection UPLOAD DEBUG] 🆕 Creating new imageUploadButton`
                                );
                                // Create a separate upload button widget
                                imageUploadButton = this.addWidget(
                                    "button",
                                    "upload_image_button",
                                    "📁 Choose Image",
                                    () => {
                                        const input = document.createElement("input");
                                        input.type = "file";
                                        input.accept = "image/*";
                                        input.onchange = async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                debugLog(
                                                    "[MediaSelection] Image file selected:",
                                                    file.name
                                                );

                                                try {
                                                    // Use ComfyUI's built-in upload system
                                                    const uploadResponse =
                                                        await api.uploadImage(file);
                                                    debugLog(
                                                        "[MediaSelection] Image uploaded:",
                                                        uploadResponse
                                                    );

                                                    // Update button text to show selected file
                                                    imageUploadButton.value = `📁 ${file.name}`;

                                                    // Store the uploaded file path in the hidden text widget
                                                    if (originalUploadedImageWidget) {
                                                        originalUploadedImageWidget.value =
                                                            uploadResponse.name;
                                                    }

                                                    // Mark the node as changed so ComfyUI knows to re-execute
                                                    this.setDirtyCanvas(true);
                                                } catch (error) {
                                                    console.error(
                                                        "[MediaSelection] Image upload failed:",
                                                        error
                                                    );
                                                    imageUploadButton.value = "📁 Upload Failed";
                                                }
                                            }
                                        };
                                        input.click();
                                    }
                                );

                                // Set the button properties
                                imageUploadButton.type = "button";
                                imageUploadButton.options = imageUploadButton.options || {};
                                imageUploadButton.options.serialize = false; // Don't serialize the button state

                                console.log(
                                    `🔍 [MediaSelection UPLOAD DEBUG] ✅ Created imageUploadButton with type: ${imageUploadButton.type}`
                                );
                            } else {
                                console.log(
                                    `🔍 [MediaSelection UPLOAD DEBUG] ♻️ Making existing imageUploadButton visible`
                                );
                                // Make sure existing button is visible
                                imageUploadButton.type = "button";
                                imageUploadButton.computeSize =
                                    imageUploadButton.constructor.prototype.computeSize;

                                console.log(
                                    `🔍 [MediaSelection UPLOAD DEBUG] ✅ Made existing imageUploadButton visible with type: ${imageUploadButton.type}`
                                );
                            }

                            // Store reference to the image button
                            this.imageUploadButton = imageUploadButton;

                            // Remove video upload button if it exists (since we're in image mode)
                            const existingVideoButton = this.widgets.find(
                                (w) => w.name === "upload_video_button"
                            );
                            if (existingVideoButton) {
                                this.removeWidgetSafely(existingVideoButton);
                                this.videoUploadButton = null;
                                console.log(
                                    `🔍 [MediaSelection UPLOAD DEBUG] 🗑️ Removed videoUploadButton (image mode)`
                                );
                            }

                            // Hide video upload widget
                            if (originalUploadedVideoWidget) {
                                originalUploadedVideoWidget.type = "hidden";
                                originalUploadedVideoWidget.computeSize = () => [0, -4];
                            }
                        } else {
                            debugLog("[MediaSelection] Showing video upload widget");

                            // Keep the original uploaded_video_file widget hidden for storing the file path
                            if (originalUploadedVideoWidget) {
                                originalUploadedVideoWidget.type = "hidden";
                                originalUploadedVideoWidget.computeSize = () => [0, -4];
                            }

                            // Check if we already have an upload button, if not create one
                            let videoUploadButton = this.widgets.find(
                                (w) => w.name === "upload_video_button"
                            );
                            if (!videoUploadButton) {
                                // Create a separate upload button widget
                                videoUploadButton = this.addWidget(
                                    "button",
                                    "upload_video_button",
                                    "📹 Choose Video",
                                    () => {
                                        const input = document.createElement("input");
                                        input.type = "file";
                                        input.accept = "video/*";
                                        input.onchange = async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                debugLog(
                                                    "[MediaSelection] Video file selected:",
                                                    file.name
                                                );

                                                try {
                                                    // For videos, we'll use the general upload endpoint
                                                    // since api.uploadImage is specifically for images
                                                    const formData = new FormData();
                                                    formData.append("image", file); // ComfyUI uses "image" param for all uploads
                                                    formData.append("overwrite", "false");
                                                    formData.append("type", "input");

                                                    const response = await fetch("/upload/image", {
                                                        method: "POST",
                                                        body: formData,
                                                    });

                                                    if (!response.ok) {
                                                        throw new Error(
                                                            `Upload failed: ${response.status}`
                                                        );
                                                    }

                                                    const uploadResponse = await response.json();
                                                    debugLog(
                                                        "[MediaSelection] Video uploaded:",
                                                        uploadResponse
                                                    );

                                                    // Update button text to show selected file
                                                    videoUploadButton.value = `📹 ${file.name}`;

                                                    // Store the uploaded file path in the hidden text widget
                                                    if (originalUploadedVideoWidget) {
                                                        originalUploadedVideoWidget.value =
                                                            uploadResponse.name;
                                                    }

                                                    // Mark the node as changed so ComfyUI knows to re-execute
                                                    this.setDirtyCanvas(true);
                                                } catch (error) {
                                                    console.error(
                                                        "[MediaSelection] Video upload failed:",
                                                        error
                                                    );
                                                    videoUploadButton.value = "📹 Upload Failed";
                                                }
                                            }
                                        };
                                        input.click();
                                    }
                                );

                                // Set the button properties
                                videoUploadButton.type = "button";
                                videoUploadButton.options = videoUploadButton.options || {};
                                videoUploadButton.options.serialize = false; // Don't serialize the button state
                            } else {
                                // Make sure existing button is visible
                                videoUploadButton.type = "button";
                                videoUploadButton.computeSize =
                                    videoUploadButton.constructor.prototype.computeSize;
                            }

                            // Store reference to the video button
                            this.videoUploadButton = videoUploadButton;

                            // Remove image upload button if it exists (since we're in video mode)
                            const existingImageButton = this.widgets.find(
                                (w) => w.name === "upload_image_button"
                            );
                            if (existingImageButton) {
                                this.removeWidgetSafely(existingImageButton);
                                this.imageUploadButton = null;
                                console.log(
                                    `🔍 [MediaSelection UPLOAD DEBUG] 🗑️ Removed imageUploadButton (video mode)`
                                );
                            }

                            // Hide image upload widget
                            if (originalUploadedImageWidget) {
                                originalUploadedImageWidget.type = "hidden";
                                originalUploadedImageWidget.computeSize = () => [0, -4];
                            }
                        }
                    }

                    // Verification: Check final state of upload buttons
                    console.log(
                        `🔍 [MediaSelection UPLOAD DEBUG] VERIFICATION for mode "${mediaSource}"`
                    );

                    // Final state logging
                    const finalImageButton = this.widgets.find(
                        (w) => w.name === "upload_image_button"
                    );
                    const finalVideoButton = this.widgets.find(
                        (w) => w.name === "upload_video_button"
                    );

                    console.log(
                        `🔍 [MediaSelection UPLOAD DEBUG] ========== FINAL STATE ==========`
                    );
                    console.log(`🔍 [MediaSelection UPLOAD DEBUG] mediaSource: "${mediaSource}"`);
                    console.log(
                        `🔍 [MediaSelection UPLOAD DEBUG] Total widgets: ${this.widgets?.length || 0}`
                    );
                    console.log(
                        `🔍 [MediaSelection UPLOAD DEBUG] Final imageUploadButton exists: ${!!finalImageButton}`
                    );
                    console.log(
                        `🔍 [MediaSelection UPLOAD DEBUG] Final videoUploadButton exists: ${!!finalVideoButton}`
                    );

                    if (mediaSource === "Upload Media") {
                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] ✅ Upload Media mode - buttons should exist`
                        );
                    } else {
                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] ✅ Non-Upload mode - buttons should be removed`
                        );
                        if (finalImageButton || finalVideoButton) {
                            console.log(
                                `🔍 [MediaSelection UPLOAD DEBUG] ⚠️ ERROR: Upload buttons still exist in non-upload mode!`
                            );
                        } else {
                            console.log(
                                `🔍 [MediaSelection UPLOAD DEBUG] ✅ SUCCESS: No upload buttons found in non-upload mode`
                            );
                        }
                    }

                    console.log(
                        `🔍 [MediaSelection UPLOAD DEBUG] ========== updateMediaWidgets END ==========`
                    );

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
                console.log(
                    `🔍 [MediaSelection UPLOAD DEBUG] ========== INITIAL SETUP START ==========`
                );
                console.log(
                    `🔍 [MediaSelection UPLOAD DEBUG] Default media_source: ${this.mediaSourceWidget?.value || "undefined"}`
                );

                debugLog(`[MediaSelection] onNodeCreated - Running initial setup`);
                this.updateResizeWidgets();
                this.updateMediaWidgets();

                console.log(
                    `🔍 [MediaSelection UPLOAD DEBUG] ========== INITIAL SETUP COMPLETE ==========`
                );

                // Hook into media_source widget changes
                if (this.mediaSourceWidget) {
                    const originalSourceCallback = this.mediaSourceWidget.callback;
                    this.mediaSourceWidget.callback = (value) => {
                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] ========== MEDIA_SOURCE CHANGED ==========`
                        );
                        console.log(
                            `🔍 [MediaSelection UPLOAD DEBUG] Changed from "${this.mediaSourceWidget.value}" to "${value}"`
                        );

                        debugLog(`[MediaSelection] media_source changed to: "${value}"`);
                        if (originalSourceCallback)
                            originalSourceCallback.call(this.mediaSourceWidget, value);
                        this.updateMediaWidgets();
                    };
                }

                // Hook into media_type widget changes to update upload widgets
                if (this.mediaTypeWidget) {
                    const originalTypeCallback = this.mediaTypeWidget.callback;
                    this.mediaTypeWidget.callback = (value) => {
                        debugLog(`[MediaSelection] media_type changed to: "${value}"`);
                        if (originalTypeCallback)
                            originalTypeCallback.call(this.mediaTypeWidget, value);
                        this.updateMediaWidgets(); // Update widgets when media type changes
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

        // Handle CivitMetadataHelper node
        else if (nodeData.name === "CivitMetadataHelper") {
            debugLog("Registering CivitMetadataHelper node");

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Add a formatted display widget for metadata preview
                this.addWidget(
                    "text",
                    "metadata_preview",
                    "🏷️ Metadata preview will appear here...",
                    (value) => {
                        // Read-only preview widget
                    },
                    {
                        multiline: true,
                        serialize: false, // Don't store in workflow JSON
                    }
                );

                // Function to update the metadata preview
                this.updateMetadataPreview = function () {
                    try {
                        // Get input values
                        const steps = this.widgets.find((w) => w.name === "steps")?.value || 20;
                        const cfg = this.widgets.find((w) => w.name === "cfg")?.value || 7.0;
                        const seed = this.widgets.find((w) => w.name === "seed")?.value || 0;
                        const highSampler =
                            this.widgets.find((w) => w.name === "high_sampler")?.value || "";
                        const lowSampler =
                            this.widgets.find((w) => w.name === "low_sampler")?.value || "";
                        const loraHigh =
                            this.widgets.find((w) => w.name === "lora_high")?.value || "";
                        const loraLow =
                            this.widgets.find((w) => w.name === "lora_low")?.value || "";
                        const positivePrompt =
                            this.widgets.find((w) => w.name === "positive_prompt")?.value || "";
                        const negativePrompt =
                            this.widgets.find((w) => w.name === "negative_prompt")?.value || "";

                        // Create preview text
                        let preview = "🏷️ CIVITAI METADATA PREVIEW\n";
                        preview += "========================================\n\n";
                        preview += `📊 Steps: ${steps}\n`;
                        preview += `📊 CFG Scale: ${cfg}\n`;
                        preview += `📊 Seed: ${seed}\n`;
                        preview += `📊 High Sampler: ${highSampler || "(not set)"}\n`;
                        preview += `📊 Low Sampler: ${lowSampler || "(not set)"}\n`;
                        preview += `📊 High LoRA: ${loraHigh || "(not set)"}\n`;
                        preview += `📊 Low LoRA: ${loraLow || "(not set)"}\n\n`;
                        preview += `📝 Positive Prompt (${positivePrompt.length} chars):\n`;
                        preview += positivePrompt
                            ? `${positivePrompt.substring(0, 100)}${positivePrompt.length > 100 ? "..." : ""}\n\n`
                            : "(empty)\n\n";
                        preview += `📝 Negative Prompt (${negativePrompt.length} chars):\n`;
                        preview += negativePrompt
                            ? `${negativePrompt.substring(0, 100)}${negativePrompt.length > 100 ? "..." : ""}`
                            : "(empty)";

                        // Update the preview widget
                        const previewWidget = this.widgets.find(
                            (w) => w.name === "metadata_preview"
                        );
                        if (previewWidget) {
                            previewWidget.value = preview;
                        }
                    } catch (error) {
                        debugLog("Error updating metadata preview:", error);
                    }
                };

                // Set up listeners for input changes
                this.widgets.forEach((widget) => {
                    if (
                        [
                            "steps",
                            "cfg",
                            "seed",
                            "high_sampler",
                            "low_sampler",
                            "lora_high",
                            "lora_low",
                            "positive_prompt",
                            "negative_prompt",
                        ].includes(widget.name)
                    ) {
                        const originalCallback = widget.callback;
                        widget.callback = (value) => {
                            if (originalCallback) originalCallback(value);
                            this.updateMetadataPreview();
                        };
                    }
                });

                // Initial preview update
                setTimeout(() => {
                    this.updateMetadataPreview();
                }, 100);

                return result;
            };

            // Handle execution results to update the display
            const origOnExecuted = nodeType.prototype.onExecuted;
            nodeType.prototype.onExecuted = function (message) {
                debugLog("[CivitMetadataHelper] onExecuted called with:", message);

                if (origOnExecuted) {
                    origOnExecuted.call(this, message);
                }

                // Update preview if we have new output
                if (message?.output) {
                    // The first output is the formatted metadata
                    const formattedMetadata = message.output[0];
                    const previewWidget = this.widgets.find((w) => w.name === "metadata_preview");
                    if (previewWidget && formattedMetadata) {
                        previewWidget.value = formattedMetadata;
                    }
                }
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

// Restart server button in topbar menu
app.registerExtension({
    name: "comfyui_swissarmyknife.restart_button",

    async setup() {
        // Inject CSS for red button styling
        const style = document.createElement("style");
        style.textContent = `
            /* Swiss Army Knife - Restart Button Styling */
            .comfyui-menu-mobile button[data-command-id="swissarmyknife.restart"],
            .comfyui-menu button[data-command-id="swissarmyknife.restart"],
            button[data-command-id="swissarmyknife.restart"],
            [data-id="swissarmyknife.restart"],
            .comfy-menu-item[data-id="swissarmyknife.restart"] {
                background-color: #dc3545 !important;
                color: white !important;
                font-weight: bold !important;
                border: 1px solid #c82333 !important;
            }

            .comfyui-menu-mobile button[data-command-id="swissarmyknife.restart"]:hover,
            .comfyui-menu button[data-command-id="swissarmyknife.restart"]:hover,
            button[data-command-id="swissarmyknife.restart"]:hover,
            [data-id="swissarmyknife.restart"]:hover,
            .comfy-menu-item[data-id="swissarmyknife.restart"]:hover {
                background-color: #c82333 !important;
                border-color: #bd2130 !important;
            }

            .comfyui-menu-mobile button[data-command-id="swissarmyknife.restart"]:active,
            .comfyui-menu button[data-command-id="swissarmyknife.restart"]:active,
            button[data-command-id="swissarmyknife.restart"]:active,
            [data-id="swissarmyknife.restart"]:active,
            .comfy-menu-item[data-id="swissarmyknife.restart"]:active {
                background-color: #bd2130 !important;
                border-color: #b21f2d !important;
            }
        `;
        document.head.appendChild(style);

        debugLog("Swiss Army Knife: Injected restart button styles");
    },

    // Define the restart command
    commands: [
        {
            id: "swissarmyknife.restart",
            label: "🔴 Restart ComfyUI Server",
            function: async () => {
                // Show confirmation dialog
                const confirmed = confirm(
                    "Are you sure you want to restart the ComfyUI server?\n\n" +
                        "This will disconnect all clients and restart the server process."
                );

                if (!confirmed) {
                    return;
                }

                try {
                    console.log("Swiss Army Knife: Sending restart request...");

                    // Call the restart API endpoint
                    const response = await fetch("/swissarmyknife/restart", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const data = await response.json();

                    if (data.success) {
                        // Show notification
                        if (app.extensionManager?.toast?.add) {
                            app.extensionManager.toast.add({
                                severity: "warn",
                                summary: "Server Restarting",
                                detail: "ComfyUI server is restarting...",
                                life: 3000,
                            });
                        }

                        console.log("Swiss Army Knife: Server restart initiated");

                        // Wait a moment then try to reconnect
                        setTimeout(() => {
                            console.log("Swiss Army Knife: Reloading page...");
                            window.location.reload();
                        }, 2000);
                    } else {
                        throw new Error(data.error || "Unknown error");
                    }
                } catch (error) {
                    console.error("Swiss Army Knife: Error restarting server:", error);

                    if (app.extensionManager?.toast?.add) {
                        app.extensionManager.toast.add({
                            severity: "error",
                            summary: "Restart Failed",
                            detail: `Failed to restart server: ${error.message}`,
                            life: 5000,
                        });
                    } else {
                        alert(`Failed to restart server: ${error.message}`);
                    }
                }
            },
        },
    ],

    // Add restart button to topbar menu
    menuCommands: [
        {
            path: ["Swiss Army Knife"],
            commands: ["swissarmyknife.restart"],
        },
    ],
});

app.registerExtension({
    name: "ComfyUI-SwissArmyKnife",
    settings: [
        {
            id: "SwissArmyKnife.gemini.api_key",
            name: "Gemini API Key",
            type: "text",
            defaultValue: "",
            tooltip: "Your Gemini API key for media description and processing",
            onChange: (newVal, oldVal) => {
                debugLog(`[Settings] Gemini API key changed, syncing to backend`);
                syncApiKeysToBackend();
            },
        },
        {
            id: "SwissArmyKnife.civitai.api_key",
            name: "Civitai API Key",
            type: "text",
            defaultValue: "",
            tooltip: "Your CivitAI API key for LoRA metadata lookup",
            onChange: (newVal, oldVal) => {
                debugLog(`[Settings] CivitAI API key changed, syncing to backend`);
                syncApiKeysToBackend();
            },
        },
    ],

    async setup() {
        // Initial sync of API keys to backend when extension loads
        setTimeout(() => {
            syncApiKeysToBackend();
        }, 1000); // Small delay to ensure settings are loaded
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
