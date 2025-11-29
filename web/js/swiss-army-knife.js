import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

// Version and cache busting info
const EXTENSION_VERSION = "3.0.0"; // Should match pyproject.toml version
const LOAD_TIMESTAMP = new Date().toISOString();

// Version indicator - check console for this on page load
console.log("%c[🔪SwissArmyKnife] Version 3.0.0 - Main Extension Loaded", "color: #10b981; font-weight: bold; font-size: 14px;");

// DEBUG mode - check setting dynamically
const isDebugEnabled = () => {
    try {
        return app.extensionManager?.setting?.get("SwissArmyKnife.debug_mode") || false;
    } catch (error) {
        return false;
    }
};

// Conditional logging wrapper - checks setting dynamically
const debugLog = (...args) => {
    if (isDebugEnabled()) {
        console.log("%c[🔪SwissArmyKnife]", "color: #3b82f6; font-weight: bold;", ...args);
    }
};

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

const getAzureStorageConnectionString = () => {
    try {
        const value =
            app.extensionManager.setting.get("SwissArmyKnife.azure_storage.connection_string") ||
            "";
        debugLog(`getAzureStorageConnectionString called, value length: ${value.length}`);
        return value;
    } catch (error) {
        console.warn("Failed to get Azure Storage connection string from settings:", error);
        return "";
    }
};

// Function to sync API keys to backend
const syncApiKeysToBackend = async () => {
    debugLog("syncApiKeysToBackend called");
    try {
        const geminiKey = getGeminiApiKey();
        const civitaiKey = getCivitaiApiKey();
        const azureConnectionString = getAzureStorageConnectionString();
        const debugMode = isDebugEnabled();
        const profilerEnabled = app.extensionManager?.setting?.get("SwissArmyKnife.profiler_enabled") ?? true;

        debugLog("Azure connection string length:", azureConnectionString.length);
        debugLog("Debug mode:", debugMode);
        debugLog("Profiler enabled:", profilerEnabled);

        const response = await fetch("/swissarmyknife/set_api_keys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gemini_api_key: geminiKey,
                civitai_api_key: civitaiKey,
                azure_storage_connection_string: azureConnectionString,
                debug_mode: debugMode,
                profiler_enabled: profilerEnabled,
            }),
        });

        if (response.ok) {
            debugLog("[Settings] API keys and settings synced to backend successfully");
        } else {
            console.warn("[Settings] Failed to sync API keys to backend:", response.status);
        }
    } catch (error) {
        console.warn("[Settings] Error syncing API keys to backend:", error);
    }
};

console.log("%c[🔪SwissArmyKnife]", "color: #3b82f6; font-weight: bold;", `Loading extension v${EXTENSION_VERSION} at ${LOAD_TIMESTAMP}`);

// Register custom widgets for Swiss Army Knife nodes
app.registerExtension({
    name: "comfyui_swissarmyknife.swiss_army_knife",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Handle FilenameGenerator node
        if (nodeData.name === "FilenameGenerator") {
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
                        console.error("%c[🔪SwissArmyKnife]", "color: #ef4444; font-weight: bold;", "Error updating filename preview:", error);
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
                    debugLog("🔍 [ControlPanelOverview DEBUG] updateControlPanelData called");
                    debugLog("🔍 [ControlPanelOverview DEBUG] data received:", data);
                    debugLog("🔍 [ControlPanelOverview DEBUG] data keys:", Object.keys(data || {}));

                    if (
                        !this._cp_leftColumn ||
                        !this._cp_middleColumn ||
                        !this._cp_rightColumn ||
                        !data
                    ) {
                        debugLog(
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
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] Found data.all_media_describe_data"
                        );
                        rawData = Array.isArray(data.all_media_describe_data)
                            ? data.all_media_describe_data[0]
                            : data.all_media_describe_data;
                    } else if (data.all_media_describe_data_copy) {
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] Found data.all_media_describe_data_copy"
                        );
                        rawData = Array.isArray(data.all_media_describe_data_copy)
                            ? data.all_media_describe_data_copy[0]
                            : data.all_media_describe_data_copy;
                    } else {
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] No all_media_describe_data found in:",
                            Object.keys(data)
                        );
                    }

                    debugLog("🔍 [ControlPanelOverview DEBUG] rawData:", rawData);
                    debugLog("🔍 [ControlPanelOverview DEBUG] rawData type:", typeof rawData);

                    if (rawData) {
                        try {
                            // Parse JSON if it's a string
                            mediaData = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
                            debugLog(
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
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] No mediaData, showing 'no data available'"
                        );
                        this._cp_leftColumn.textContent = "(No data available)";
                        this._cp_middleColumn.textContent = "(No data available)";
                        this._cp_rightColumn.textContent = "(No data available)";
                        return;
                    }

                    debugLog(
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
                        debugLog(
                            "🔍 [ControlPanel DEBUG] Setting positive prompt:",
                            finalText.substring(0, 50)
                        );
                        this._cp_leftColumn.textContent = formatValue(finalText, 2000);
                    } else {
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] No positive_prompt/final_prompt/description in mediaData"
                        );
                        this._cp_leftColumn.textContent = "(No final text in data)";
                    }

                    // Middle column: Gemini Status
                    if (mediaData.gemini_status) {
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] Setting gemini_status:",
                            mediaData.gemini_status.substring(0, 50)
                        );
                        this._cp_middleColumn.textContent = formatValue(
                            mediaData.gemini_status,
                            2000
                        );
                    } else {
                        debugLog(
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
                        debugLog("🔍 [ControlPanelOverview DEBUG] No right column data");
                        this._cp_rightColumn.textContent = "(No media info in data)";
                    } else {
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] Setting right column with",
                            rightLines.length,
                            "lines"
                        );
                        this._cp_rightColumn.textContent = rightLines.join("\n");
                    }

                    debugLog("🔍 [ControlPanelOverview DEBUG] Display update complete");
                    debugLog("[ControlPanelOverview] Updated display with execution data");
                };

                // Add onExecuted handler to update display with execution results
                const originalOnExecuted = this.onExecuted;
                this.onExecuted = function (message) {
                    debugLog("🔍 [ControlPanelOverview DEBUG] onExecuted called");
                    debugLog("🔍 [ControlPanelOverview DEBUG] Full message object:", message);
                    debugLog(
                        "🔍 [ControlPanelOverview DEBUG] message keys:",
                        Object.keys(message || {})
                    );

                    if (message) {
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] message.output:",
                            message.output
                        );
                        if (message.output) {
                            debugLog(
                                "🔍 [ControlPanelOverview DEBUG] message.output keys:",
                                Object.keys(message.output)
                            );
                        }
                    }

                    debugLog("[ControlPanelOverview] onExecuted called with message:", message);

                    // Try multiple data sources - data might be at root or in output
                    if (message && message.output) {
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] Calling updateControlPanelData with message.output:",
                            message.output
                        );
                        this.updateControlPanelData(message.output);
                    } else if (
                        message &&
                        (message.all_media_describe_data || message.all_media_describe_data_copy)
                    ) {
                        debugLog(
                            "🔍 [ControlPanelOverview DEBUG] Calling updateControlPanelData with message (root level):",
                            message
                        );
                        this.updateControlPanelData(message);
                    } else {
                        debugLog(
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
                    debugLog(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] updatePromptBreakdownData called"
                    );
                    debugLog("🔍 [ControlPanelPromptBreakdown DEBUG] data received:", data);
                    debugLog(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] data keys:",
                        Object.keys(data || {})
                    );

                    debugLog("[ControlPanelPromptBreakdown] updatePromptBreakdownData called");
                    debugLog("[ControlPanelPromptBreakdown] data received:", data);

                    if (!this._cpb_subject || !data) {
                        debugLog(
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
                        debugLog(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Found data.prompt_breakdown"
                        );
                        rawData = Array.isArray(data.prompt_breakdown)
                            ? data.prompt_breakdown[0]
                            : data.prompt_breakdown;
                    }
                    // Then try all_media_describe_data (current format from MediaDescribe node)
                    else if (data.all_media_describe_data) {
                        debugLog(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Found data.all_media_describe_data"
                        );
                        rawData = Array.isArray(data.all_media_describe_data)
                            ? data.all_media_describe_data[0]
                            : data.all_media_describe_data;
                    }
                    // Finally try all_media_describe_data_copy (backup)
                    else if (data.all_media_describe_data_copy) {
                        debugLog(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Found data.all_media_describe_data_copy"
                        );
                        rawData = Array.isArray(data.all_media_describe_data_copy)
                            ? data.all_media_describe_data_copy[0]
                            : data.all_media_describe_data_copy;
                    }

                    debugLog("🔍 [ControlPanelPromptBreakdown DEBUG] rawData:", rawData);
                    debugLog(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] rawData type:",
                        typeof rawData
                    );

                    if (rawData) {
                        try {
                            promptBreakdown =
                                typeof rawData === "string" ? JSON.parse(rawData) : rawData;
                            debugLog(
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
                        debugLog(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] No promptBreakdown, showing 'no data available'"
                        );
                        this._cpb_subject.textContent = "(No data available)";
                        this._cpb_clothing.textContent = "(No data available)";
                        this._cpb_movement.textContent = "(No data available)";
                        this._cpb_scene.textContent = "(No data available)";
                        this._cpb_visual_style.textContent = "(No data available)";
                        return;
                    }

                    debugLog(
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

                    debugLog("🔍 [ControlPanelPromptBreakdown DEBUG] Display update complete");
                    debugLog("[ControlPanelPromptBreakdown] Display update complete");
                };

                // Add onExecuted handler
                const originalOnExecuted = this.onExecuted;
                this.onExecuted = function (message) {
                    debugLog("🔍 [ControlPanelPromptBreakdown DEBUG] onExecuted called");
                    debugLog(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] Full message object:",
                        message
                    );
                    debugLog(
                        "🔍 [ControlPanelPromptBreakdown DEBUG] message keys:",
                        Object.keys(message || {})
                    );

                    debugLog("[ControlPanelPromptBreakdown] onExecuted called");

                    if (message && message.output) {
                        debugLog(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Calling updatePromptBreakdownData with message.output"
                        );
                        this.updatePromptBreakdownData(message.output);
                    } else if (message && message.prompt_breakdown) {
                        debugLog(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Calling updatePromptBreakdownData with message (root level)"
                        );
                        this.updatePromptBreakdownData(message);
                    } else if (
                        message &&
                        (message.all_media_describe_data || message.all_media_describe_data_copy)
                    ) {
                        debugLog(
                            "🔍 [ControlPanelPromptBreakdown DEBUG] Calling updatePromptBreakdownData with all_media_describe_data"
                        );
                        this.updatePromptBreakdownData(message);
                    } else {
                        debugLog(
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
                        debugLog(`🔍 [MediaSelection] Removed widget: ${widget.name}`);
                    }

                    // Remove DOM element if it exists
                    if (widget.element && widget.element.parentNode) {
                        widget.element.parentNode.removeChild(widget.element);
                        debugLog(`🔍 [MediaSelection] Removed DOM element for: ${widget.name}`);
                    }
                };

                this.updateMediaWidgets = function () {
                    const mediaSource = this.mediaSourceWidget?.value || "Reddit Post";

                    debugLog(
                        `🔍 [MediaSelection UPLOAD DEBUG] ========== updateMediaWidgets START ==========`
                    );
                    debugLog(`🔍 [MediaSelection UPLOAD DEBUG] mediaSource: "${mediaSource}"`);
                    debugLog(
                        `🔍 [MediaSelection UPLOAD DEBUG] Total widgets before update: ${
                            this.widgets?.length || 0
                        }`
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

                    debugLog(
                        `🔍 [MediaSelection UPLOAD DEBUG] Found existing buttons: image=${!!existingImageButton}, video=${!!existingVideoButton}`
                    );

                    // If NOT in Upload Media mode, remove all upload buttons completely
                    if (mediaSource !== "Upload Media") {
                        debugLog(
                            `🔍 [MediaSelection UPLOAD DEBUG] � NOT in Upload Media mode - removing all upload buttons`
                        );

                        if (existingImageButton) {
                            this.removeWidgetSafely(existingImageButton);
                            debugLog(
                                `🔍 [MediaSelection UPLOAD DEBUG] 🗑️ Removed imageUploadButton`
                            );
                        }
                        if (existingVideoButton) {
                            this.removeWidgetSafely(existingVideoButton);
                            debugLog(
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
                        debugLog(
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

                        debugLog(
                            `🔍 [MediaSelection UPLOAD DEBUG] Randomize Mode - upload buttons already removed`
                        );
                        // Upload buttons are automatically removed by the logic above since mediaSource !== "Upload Media"
                    } else if (mediaSource === "Randomize from Subreddit") {
                        debugLog(
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

                        debugLog(
                            `🔍 [MediaSelection UPLOAD DEBUG] Subreddit Mode - upload buttons already removed`
                        );
                        // Upload buttons are automatically removed by the logic above since mediaSource !== "Upload Media"
                    } else if (mediaSource === "Reddit Post") {
                        debugLog(
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

                        debugLog(
                            `🔍 [MediaSelection UPLOAD DEBUG] Reddit Post Mode - upload buttons already removed`
                        );
                        // Upload buttons are automatically removed by the logic above since mediaSource !== "Upload Media"
                    } else {
                        // Upload Media mode
                        debugLog(`🔍 [MediaSelection UPLOAD DEBUG] === UPLOAD MEDIA MODE ===`);
                        debugLog("[MediaSelection] Upload Media mode - setting up upload widgets");

                        const mediaType = this.mediaTypeWidget?.value || "image";
                        debugLog(
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

                            debugLog(
                                `🔍 [MediaSelection UPLOAD DEBUG] Image mode - imageUploadButton exists: ${!!imageUploadButton}`
                            );

                            if (!imageUploadButton) {
                                debugLog(
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
                                                    const uploadResponse = await api.uploadImage(
                                                        file
                                                    );
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

                                debugLog(
                                    `🔍 [MediaSelection UPLOAD DEBUG] ✅ Created imageUploadButton with type: ${imageUploadButton.type}`
                                );
                            } else {
                                debugLog(
                                    `🔍 [MediaSelection UPLOAD DEBUG] ♻️ Making existing imageUploadButton visible`
                                );
                                // Make sure existing button is visible
                                imageUploadButton.type = "button";
                                imageUploadButton.computeSize =
                                    imageUploadButton.constructor.prototype.computeSize;

                                debugLog(
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
                                debugLog(
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
                                debugLog(
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
                    debugLog(
                        `🔍 [MediaSelection UPLOAD DEBUG] VERIFICATION for mode "${mediaSource}"`
                    );

                    // Final state logging
                    const finalImageButton = this.widgets.find(
                        (w) => w.name === "upload_image_button"
                    );
                    const finalVideoButton = this.widgets.find(
                        (w) => w.name === "upload_video_button"
                    );

                    debugLog(
                        `🔍 [MediaSelection UPLOAD DEBUG] ========== FINAL STATE ==========`
                    );
                    debugLog(`🔍 [MediaSelection UPLOAD DEBUG] mediaSource: "${mediaSource}"`);
                    debugLog(
                        `🔍 [MediaSelection UPLOAD DEBUG] Total widgets: ${
                            this.widgets?.length || 0
                        }`
                    );
                    debugLog(
                        `🔍 [MediaSelection UPLOAD DEBUG] Final imageUploadButton exists: ${!!finalImageButton}`
                    );
                    debugLog(
                        `🔍 [MediaSelection UPLOAD DEBUG] Final videoUploadButton exists: ${!!finalVideoButton}`
                    );

                    if (mediaSource === "Upload Media") {
                        debugLog(
                            `🔍 [MediaSelection UPLOAD DEBUG] ✅ Upload Media mode - buttons should exist`
                        );
                    } else {
                        debugLog(
                            `🔍 [MediaSelection UPLOAD DEBUG] ✅ Non-Upload mode - buttons should be removed`
                        );
                        if (finalImageButton || finalVideoButton) {
                            debugLog(
                                `🔍 [MediaSelection UPLOAD DEBUG] ⚠️ ERROR: Upload buttons still exist in non-upload mode!`
                            );
                        } else {
                            debugLog(
                                `🔍 [MediaSelection UPLOAD DEBUG] ✅ SUCCESS: No upload buttons found in non-upload mode`
                            );
                        }
                    }

                    debugLog(
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
                debugLog(
                    `🔍 [MediaSelection UPLOAD DEBUG] ========== INITIAL SETUP START ==========`
                );
                debugLog(
                    `🔍 [MediaSelection UPLOAD DEBUG] Default media_source: ${
                        this.mediaSourceWidget?.value || "undefined"
                    }`
                );

                debugLog(`[MediaSelection] onNodeCreated - Running initial setup`);
                this.updateResizeWidgets();
                this.updateMediaWidgets();

                debugLog(
                    `🔍 [MediaSelection UPLOAD DEBUG] ========== INITIAL SETUP COMPLETE ==========`
                );

                // Hook into media_source widget changes
                if (this.mediaSourceWidget) {
                    const originalSourceCallback = this.mediaSourceWidget.callback;
                    this.mediaSourceWidget.callback = (value) => {
                        debugLog(
                            `🔍 [MediaSelection UPLOAD DEBUG] ========== MEDIA_SOURCE CHANGED ==========`
                        );
                        debugLog(
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

        // CivitMetadataHelper node - no custom widgets needed
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

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Handle LLMStudioStructuredDescribe node - dynamic output labels
        if (nodeData.name === "LLMStudioStructuredDescribe") {
            debugLog("Registering LLMStudioStructuredDescribe node with dynamic output labels");

            // Define schema field mappings
            const SCHEMA_OUTPUT_LABELS = {
                "video_description": ["subject", "clothing", "movement", "scene", "visual_style"],
                "simple_description": ["caption", "tags", "", "", ""],
                "character_analysis": ["appearance", "expression", "pose", "clothing", ""]
            };

            // Add resize handler to adjust DOM widget width
            const onResize = nodeType.prototype.onResize;
            nodeType.prototype.onResize = function (size) {
                const result = onResize?.call(this, size);
                if (this._json_display_dom) {
                    this._json_display_dom.style.width = this.size[0] - 20 + "px";
                    // Trigger recompute after width change to handle content reflow
                    requestAnimationFrame(() => {
                        const sz = this.computeSize();
                        if (sz[0] < this.size[0]) sz[0] = this.size[0];
                        if (sz[1] < this.size[1]) sz[1] = this.size[1];
                        this.onResize?.(sz);
                        if (this.graph) {
                            this.graph.setDirtyCanvas(true, false);
                        }
                    });
                }
                return result;
            };

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Create DOM display widget for JSON output
                if (!this._json_display_dom) {
                    // Create main container
                    const dom = document.createElement("div");
                    dom.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
                    dom.style.fontSize = "11px";
                    dom.style.lineHeight = "1.35";
                    dom.style.overflow = "auto";
                    dom.style.minHeight = "300px";
                    dom.style.padding = "8px";
                    dom.style.borderRadius = "6px";
                    dom.style.background = "var(--comfy-menu-bg, #1e1e1e)";
                    dom.style.border = "1px solid var(--border-color, #333)";
                    dom.style.color = "var(--fg-color, #d4d4d4)";

                    // Create content div
                    const content = document.createElement("div");
                    content.style.whiteSpace = "pre-wrap";
                    content.style.wordBreak = "break-word";
                    content.style.overflow = "auto";
                    content.style.flex = "1";
                    content.textContent = "Awaiting execution...";

                    dom.appendChild(content);

                    // Add DOM widget
                    const widget = this.addDOMWidget("json_display", "json_display", dom, {
                        serialize: false,
                        hideOnZoom: false,
                    });

                    // Add custom computeSize to measure actual content height
                    widget.computeSize = function(width) {
                        if (!dom) return [width || 400, 300];
                        
                        // Measure actual content height (scrollHeight includes all content)
                        const contentHeight = dom.scrollHeight;
                        const minHeight = 100;
                        const maxHeight = 800;  // Max 800px height
                        
                        // Clamp between min and max, add padding
                        const finalHeight = Math.max(minHeight, Math.min(maxHeight, contentHeight + 16));
                        
                        return [width || 400, finalHeight];
                    };

                    // Store references
                    this._json_display_dom = dom;
                    this._json_display_content = content;
                    this._json_display_widget = widget;

                    debugLog("Created JSON display widget for LLMStudioStructuredDescribe");
                }

                // Function to update JSON display from execution output
                this.updateJsonDisplay = function(jsonString) {
                    console.log("[SwissArmyKnife][updateJsonDisplay] Called with data:", jsonString);
                    console.log("[SwissArmyKnife][updateJsonDisplay] Has content div:", !!this._json_display_content);
                    debugLog("[updateJsonDisplay] Called with data:", jsonString);
                    debugLog("[updateJsonDisplay] Has content div:", !!this._json_display_content);
                    
                    if (!this._json_display_content) {
                        console.error("[SwissArmyKnife][updateJsonDisplay] No content div found!");
                        return;
                    }
                    
                    try {
                        // Parse JSON string
                        debugLog("[updateJsonDisplay] Type of input:", typeof jsonString);
                        const jsonData = typeof jsonString === "string" 
                            ? JSON.parse(jsonString) 
                            : jsonString;
                        
                        debugLog("[updateJsonDisplay] Parsed JSON data:", jsonData);
                        debugLog("[updateJsonDisplay] JSON keys:", Object.keys(jsonData));
                        
                        // Build formatted output with each key-value pair
                        const lines = [];
                        for (const [key, value] of Object.entries(jsonData)) {
                            // Capitalize first letter of key for display
                            const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                            
                            // Format value (handle strings, arrays, objects)
                            let displayValue;
                            if (typeof value === "string") {
                                displayValue = value;
                            } else if (Array.isArray(value)) {
                                displayValue = value.join(', ');
                            } else if (typeof value === "object" && value !== null) {
                                displayValue = JSON.stringify(value, null, 2);
                            } else {
                                displayValue = String(value);
                            }
                            
                            lines.push(`${displayKey}: ${displayValue}`);
                        }
                        
                        const finalText = lines.join('\n\n');
                        debugLog("[updateJsonDisplay] Final text length:", finalText.length);
                        debugLog("[updateJsonDisplay] Final text preview:", finalText.substring(0, 200));
                        
                        this._json_display_content.textContent = finalText;
                        debugLog("[updateJsonDisplay] ✅ Successfully updated display");
                        
                        // Trigger node resize after content update (wait for browser reflow)
                        requestAnimationFrame(() => {
                            const sz = this.computeSize();
                            if (sz[0] < this.size[0]) sz[0] = this.size[0];
                            if (sz[1] < this.size[1]) sz[1] = this.size[1];
                            this.onResize?.(sz);
                            if (this.graph) {
                                this.graph.setDirtyCanvas(true, false);
                            }
                        });
                    } catch (error) {
                        const errorMsg = `Error parsing JSON: ${error.message}`;
                        this._json_display_content.textContent = errorMsg;
                        console.error("[updateJsonDisplay] Failed to parse JSON:", error);
                        console.error("[updateJsonDisplay] Input was:", jsonString);
                    }
                };

                // Hook onExecuted to capture execution results
                const originalOnExecuted = this.onExecuted;
                this.onExecuted = function (message) {
                    debugLog("LLMStudioStructuredDescribe onExecuted called", message);
                    
                    if (message && message.json_output) {
                        // Extract json_output (first element if array)
                        const jsonOutput = Array.isArray(message.json_output)
                            ? message.json_output[0]
                            : message.json_output;
                        
                        debugLog("Received json_output:", jsonOutput);
                        this.updateJsonDisplay(jsonOutput);
                    }
                    
                    return originalOnExecuted?.call(this, message);
                };

                // Function to update output labels based on schema preset
                this.updateOutputLabels = function(schemaPreset) {
                    const labels = SCHEMA_OUTPUT_LABELS[schemaPreset] || ["", "", "", "", ""];
                    
                    debugLog(`[LLMStudioStructured] Updating output labels for schema: ${schemaPreset}`);
                    debugLog(`[LLMStudioStructured] New labels:`, labels);

                    // Update output slot labels (outputs 1-5, skip 0 which is json_output)
                    for (let i = 0; i < 5; i++) {
                        const outputIndex = i + 1; // Skip first output (json_output)
                        if (this.outputs && this.outputs[outputIndex]) {
                            const label = labels[i] || `field_${i + 1}`;
                            this.outputs[outputIndex].label = label;
                            this.outputs[outputIndex].name = label;
                            debugLog(`[LLMStudioStructured] Updated output ${outputIndex}: ${label}`);
                        }
                    }

                    // Force visual update
                    if (this.graph && this.graph.canvas) {
                        this.setDirtyCanvas(true, true);
                    }
                };

                // Find schema_preset widget and add callback
                const schemaWidget = this.widgets?.find(w => w.name === "schema_preset");
                if (schemaWidget) {
                    debugLog("[LLMStudioStructured] Found schema_preset widget");
                    
                    // Update labels on initial creation
                    this.updateOutputLabels(schemaWidget.value);

                    // Store original callback
                    const originalCallback = schemaWidget.callback;
                    
                    // Add our callback
                    schemaWidget.callback = (value) => {
                        debugLog(`[LLMStudioStructured] Schema preset changed to: ${value}`);
                        this.updateOutputLabels(value);
                        
                        // Call original callback if exists
                        if (originalCallback) {
                            originalCallback.apply(schemaWidget, arguments);
                        }
                    };
                } else {
                    debugLog("[LLMStudioStructured] WARNING: schema_preset widget not found");
                }

                return result;
            };
        }

        // Handle LLMStudioStructuredVideoDescribe node - dynamic output labels and JSON display
        else if (nodeData.name === "LLMStudioStructuredVideoDescribe") {
            debugLog("Registering LLMStudioStructuredVideoDescribe node with dynamic output labels and JSON display");

            // Define schema field mappings (video has all schemas including video_description)
            const SCHEMA_OUTPUT_LABELS = {
                "video_description": ["subject", "clothing", "action", "scene", "visual_style"],
                "simple_description": ["caption", "tags", "", "", ""],
                "character_analysis": ["appearance", "expression", "pose", "clothing", ""]
            };

            // Add resize handler to adjust DOM widget width
            const onResize = nodeType.prototype.onResize;
            nodeType.prototype.onResize = function (size) {
                const result = onResize?.call(this, size);
                if (this._json_display_dom) {
                    this._json_display_dom.style.width = this.size[0] - 20 + "px";
                    // Trigger recompute after width change to handle content reflow
                    requestAnimationFrame(() => {
                        const sz = this.computeSize();
                        if (sz[0] < this.size[0]) sz[0] = this.size[0];
                        if (sz[1] < this.size[1]) sz[1] = this.size[1];
                        this.onResize?.(sz);
                        if (this.graph) {
                            this.graph.setDirtyCanvas(true, false);
                        }
                    });
                }
                return result;
            };

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Create DOM display widget for JSON output
                if (!this._json_display_dom) {
                    // Create main container
                    const dom = document.createElement("div");
                    dom.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
                    dom.style.fontSize = "11px";
                    dom.style.lineHeight = "1.35";
                    dom.style.overflow = "auto";
                    dom.style.minHeight = "300px";
                    dom.style.padding = "8px";
                    dom.style.borderRadius = "6px";
                    dom.style.background = "var(--comfy-menu-bg, #1e1e1e)";
                    dom.style.border = "1px solid var(--border-color, #333)";
                    dom.style.color = "var(--fg-color, #d4d4d4)";

                    // Create content div
                    const content = document.createElement("div");
                    content.style.whiteSpace = "pre-wrap";
                    content.style.wordBreak = "break-word";
                    content.style.overflow = "auto";
                    content.style.flex = "1";
                    content.textContent = "Awaiting execution...";

                    dom.appendChild(content);

                    // Add DOM widget
                    const widget = this.addDOMWidget("json_display", "json_display", dom, {
                        serialize: false,
                        hideOnZoom: false,
                    });

                    // Add custom computeSize to measure actual content height
                    widget.computeSize = function(width) {
                        if (!dom) return [width || 400, 300];
                        
                        // Measure actual content height (scrollHeight includes all content)
                        const contentHeight = dom.scrollHeight;
                        const minHeight = 100;
                        const maxHeight = 800;  // Max 800px height
                        
                        // Clamp between min and max, add padding
                        const finalHeight = Math.max(minHeight, Math.min(maxHeight, contentHeight + 16));
                        
                        return [width || 400, finalHeight];
                    };

                    // Store references
                    this._json_display_dom = dom;
                    this._json_display_content = content;
                    this._json_display_widget = widget;

                    debugLog("Created JSON display widget for LLMStudioStructuredVideoDescribe");
                }

                // Function to update JSON display from execution output
                this.updateJsonDisplay = function(jsonString) {
                    console.log("[SwissArmyKnife][updateJsonDisplay] Called with data:", jsonString);
                    console.log("[SwissArmyKnife][updateJsonDisplay] Has content div:", !!this._json_display_content);
                    debugLog("[updateJsonDisplay] Called with data:", jsonString);
                    debugLog("[updateJsonDisplay] Has content div:", !!this._json_display_content);
                    
                    if (!this._json_display_content) {
                        console.error("[SwissArmyKnife][updateJsonDisplay] No content div found!");
                        return;
                    }
                    
                    try {
                        // Parse JSON string
                        debugLog("[updateJsonDisplay] Type of input:", typeof jsonString);
                        const jsonData = typeof jsonString === "string" 
                            ? JSON.parse(jsonString) 
                            : jsonString;
                        
                        debugLog("[updateJsonDisplay] Parsed JSON data:", jsonData);
                        debugLog("[updateJsonDisplay] JSON keys:", Object.keys(jsonData));
                        
                        // Build formatted output with each key-value pair
                        const lines = [];
                        for (const [key, value] of Object.entries(jsonData)) {
                            // Capitalize first letter of key for display
                            const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                            
                            // Format value (handle strings, arrays, objects)
                            let displayValue;
                            if (typeof value === "string") {
                                displayValue = value;
                            } else if (Array.isArray(value)) {
                                displayValue = value.join(', ');
                            } else if (typeof value === "object" && value !== null) {
                                displayValue = JSON.stringify(value, null, 2);
                            } else {
                                displayValue = String(value);
                            }
                            
                            lines.push(`${displayKey}: ${displayValue}`);
                        }
                        
                        const finalText = lines.join('\n\n');
                        debugLog("[updateJsonDisplay] Final text length:", finalText.length);
                        debugLog("[updateJsonDisplay] Final text preview:", finalText.substring(0, 200));
                        
                        this._json_display_content.textContent = finalText;
                        debugLog("[updateJsonDisplay] ✅ Successfully updated display");
                        
                        // Trigger node resize after content update (wait for browser reflow)
                        requestAnimationFrame(() => {
                            const sz = this.computeSize();
                            if (sz[0] < this.size[0]) sz[0] = this.size[0];
                            if (sz[1] < this.size[1]) sz[1] = this.size[1];
                            this.onResize?.(sz);
                            if (this.graph) {
                                this.graph.setDirtyCanvas(true, false);
                            }
                        });
                    } catch (error) {
                        const errorMsg = `Error parsing JSON: ${error.message}`;
                        this._json_display_content.textContent = errorMsg;
                        console.error("[updateJsonDisplay] Failed to parse JSON:", error);
                        console.error("[updateJsonDisplay] Input was:", jsonString);
                    }
                };

                // Hook onExecuted to capture execution results
                const originalOnExecuted = this.onExecuted;
                this.onExecuted = function (message) {
                    debugLog("LLMStudioStructuredVideoDescribe onExecuted called", message);
                    
                    if (message && message.json_output) {
                        // Extract json_output (first element if array)
                        const jsonOutput = Array.isArray(message.json_output)
                            ? message.json_output[0]
                            : message.json_output;
                        
                        debugLog("Received json_output:", jsonOutput);
                        this.updateJsonDisplay(jsonOutput);
                    }
                    
                    return originalOnExecuted?.call(this, message);
                };

                // Function to update output labels based on schema preset
                this.updateOutputLabels = function(schemaPreset) {
                    const labels = SCHEMA_OUTPUT_LABELS[schemaPreset] || ["", "", "", "", ""];
                    
                    debugLog(`[LLMStudioStructuredVideo] Updating output labels for schema: ${schemaPreset}`);
                    debugLog(`[LLMStudioStructuredVideo] New labels:`, labels);

                    // Update output slot labels (outputs 1-5, skip 0 which is json_output)
                    for (let i = 0; i < 5; i++) {
                        const outputIndex = i + 1; // Skip first output (json_output)
                        if (this.outputs && this.outputs[outputIndex]) {
                            const label = labels[i] || `field_${i + 1}`;
                            this.outputs[outputIndex].label = label;
                            this.outputs[outputIndex].name = label;
                            debugLog(`[LLMStudioStructuredVideo] Updated output ${outputIndex}: ${label}`);
                        }
                    }

                    // Force visual update
                    if (this.graph && this.graph.canvas) {
                        this.setDirtyCanvas(true, true);
                    }
                };

                // Find schema_preset widget and add callback
                const schemaWidget = this.widgets?.find(w => w.name === "schema_preset");
                if (schemaWidget) {
                    debugLog("[LLMStudioStructuredVideo] Found schema_preset widget");
                    
                    // Update labels on initial creation
                    this.updateOutputLabels(schemaWidget.value);

                    // Store original callback
                    const originalCallback = schemaWidget.callback;
                    
                    // Add our callback
                    schemaWidget.callback = (value) => {
                        debugLog(`[LLMStudioStructuredVideo] Schema preset changed to: ${value}`);
                        this.updateOutputLabels(value);
                        
                        // Call original callback if exists
                        if (originalCallback) {
                            originalCallback.apply(schemaWidget, arguments);
                        }
                    };
                } else {
                    debugLog("[LLMStudioStructuredVideo] WARNING: schema_preset widget not found");
                }

                return result;
            };
        }
    },

    // Setup app-level execution handler for MediaDescribe and ControlPanel
    async setup() {
        // Log ALL API events to debug
        const originalAddEventListener = api.addEventListener.bind(api);
        console.log("%c[🔪SwissArmyKnife]", "color: #3b82f6; font-weight: bold;", "Setting up API event listeners...");
        
        // Listen for execution_cached events - this fires when nodes use cached results
        // The onExecuted hook will still receive the cached ui data, so no special handling needed
        api.addEventListener("execution_cached", ({ detail }) => {
            console.log("[SwissArmyKnife][API] execution_cached event:", detail);
            // Cached nodes will still trigger onExecuted with their ui field data
        });
        
        // Listen for 'executing' event for logging
        api.addEventListener("executing", ({ detail }) => {
            const nodeId = detail;
            if (nodeId !== null && nodeId !== undefined) {
                const node = app.graph.getNodeById(parseInt(nodeId));
                console.log("[SwissArmyKnife][API] Executing node:", nodeId, "type:", node?.type, "comfyClass:", node?.comfyClass);
            } else {
                console.log("[SwissArmyKnife][API] Execution complete for current node");
            }
        });
        
        // Listen for execution complete
        api.addEventListener("execution_success", ({ detail }) => {
            console.log("[SwissArmyKnife][API] Workflow execution completed successfully", detail);
            // onExecuted hooks have already received the ui data and updated displays
        });
        
        // Listen for execution start to update LLMStudioStructuredDescribe and Video nodes to "Pending response..."
        api.addEventListener("execution_start", ({ detail }) => {
            console.log("[SwissArmyKnife] [API] Workflow execution started", detail);
            debugLog("[API] Workflow execution started", detail);
            
            // Find all LLMStudioStructuredDescribe and LLMStudioStructuredVideoDescribe nodes in the current graph and update to pending state
            if (app.graph && app.graph._nodes) {
                for (const node of app.graph._nodes) {
                    if ((node.comfyClass === "LLMStudioStructuredDescribe" || node.comfyClass === "LLMStudioStructuredVideoDescribe") && node._json_display_content) {
                        const currentContent = node._json_display_content.textContent;
                        if (currentContent === "Awaiting execution...") {
                            node._json_display_content.textContent = "Pending response...";
                            debugLog(`[API] Updated ${node.comfyClass} node to pending state`);
                        }
                    }
                }
            }
        });

        // Hook into API executed events for logging
        api.addEventListener("executed", ({ detail }) => {
            const { node: nodeId, output } = detail;
            const node = app.graph.getNodeById(parseInt(nodeId));

            console.log("[SwissArmyKnife][API] Execution event received for node:", nodeId);
            console.log("[SwissArmyKnife][API] Output data:", output);
            console.log("[SwissArmyKnife][API] Node type:", node?.type, "comfyClass:", node?.comfyClass);
            
            debugLog("[API] Execution event received for node:", nodeId);
            debugLog("[API] Output data:", output);
            debugLog("[API] Node found:", !!node, "comfyClass:", node?.comfyClass);

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
            // Handle LLMStudioStructuredDescribe execution
            // Check both comfyClass and type to be sure we catch it
            else if (node && (node.comfyClass === "LLMStudioStructuredDescribe" || node.type === "LLMStudioStructuredDescribe")) {
                console.log("[SwissArmyKnife][API] ✅ Found LLMStudioStructuredDescribe execution result");
                console.log("[SwissArmyKnife][API] Node comfyClass:", node.comfyClass, "type:", node.type);
                console.log("[SwissArmyKnife][API] Full output structure:", JSON.stringify(output, null, 2));
                debugLog("[API] ✅ Found LLMStudioStructuredDescribe execution result");
                debugLog("[API] Full output structure:", JSON.stringify(output, null, 2));

                // Extract json_output from output
                if (output && output.json_output) {
                    const jsonOutput = Array.isArray(output.json_output)
                        ? output.json_output[0]
                        : output.json_output;
                    
                    console.log("[SwissArmyKnife][API] Extracted json_output:", jsonOutput);
                    debugLog("[API] Extracted json_output:", jsonOutput);
                    
                    // Update the display using the node's method
                    if (node.updateJsonDisplay) {
                        console.log("[SwissArmyKnife][API] Calling updateJsonDisplay...");
                        node.updateJsonDisplay(jsonOutput);
                        console.log("[SwissArmyKnife][API] ✅ Updated JSON display via global listener");
                        debugLog("[API] ✅ Updated JSON display via global listener");
                    } else {
                        console.error("[SwissArmyKnife][API] ⚠️ updateJsonDisplay method not found on node!");
                        console.error("[SwissArmyKnife][API] Node properties:", Object.keys(node));
                        debugLog("[API] ⚠️ updateJsonDisplay method not found on node!");
                    }
                } else {
                    console.warn("[SwissArmyKnife][API] ⚠️ No json_output in output. Output structure:", output);
                    debugLog("[API] ⚠️ No json_output in output. Output structure:", output);
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
            debugLog(
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
        {
            id: "SwissArmyKnife.azure_storage.connection_string",
            name: "Azure Storage Connection String",
            type: "text",
            defaultValue: "",
            tooltip: "Your Azure Storage connection string (includes account name and key)",
            onChange: (newVal, oldVal) => {
                debugLog(`[Settings] Azure Storage connection string changed, syncing to backend`);
                syncApiKeysToBackend();
            },
        },
        {
            id: "SwissArmyKnife.debug_mode",
            name: "Debug Mode",
            type: "boolean",
            defaultValue: false,
            tooltip: "Enable debug mode for detailed logging",
            onChange: (newVal, oldVal) => {
                debugLog(`Debug mode changed from ${oldVal} to ${newVal}`);
                syncApiKeysToBackend(); // Sync debug mode to backend
            },
        },
        {
            id: "SwissArmyKnife.profiler_enabled",
            name: "Workflow Profiler",
            type: "boolean",
            defaultValue: true,
            tooltip: "Enable workflow profiler to track execution times and resource usage",
            onChange: (newVal, oldVal) => {
                debugLog(`Profiler enabled changed from ${oldVal} to ${newVal}`);
                syncApiKeysToBackend(); // Sync profiler setting to backend
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
