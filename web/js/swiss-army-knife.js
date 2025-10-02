import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

// Version and cache busting info
const EXTENSION_VERSION = "1.4.0"; // Should match pyproject.toml version
const LOAD_TIMESTAMP = new Date().toISOString();

console.log(`Loading swiss-army-knife.js extension v${EXTENSION_VERSION} at ${LOAD_TIMESTAMP}`);

// Register custom widgets for Swiss Army Knife nodes
app.registerExtension({
    name: "comfyui_swissarmyknife.swiss_army_knife",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        // Handle GeminiUtilOptions node
        if (nodeData.name === "GeminiUtilOptions") {
            console.log("Registering GeminiUtilOptions node");

            // This node doesn't need special widgets - it just provides configuration
            // The existing ComfyUI widgets are sufficient for this node
        }

        // Handle FilenameGenerator node
        else if (nodeData.name === "FilenameGenerator") {
            console.log("Registering FilenameGenerator node");

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

        // Handle GeminiUtilMediaDescribe node
        else if (nodeData.name === "GeminiUtilMediaDescribe") {
            console.log("Registering GeminiUtilMediaDescribe node with dynamic media widgets");

            // Add custom widget after the node is created
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Hide the optional input widgets that shouldn't be directly visible
                // These will be managed by our dynamic widget system
                this.hideOptionalInputWidgets = function () {
                    const widgetsToHide = [
                        "media_path",
                        "uploaded_image_file",
                        "uploaded_video_file",
                        "seed",
                        "reddit_url",
                    ];

                    for (const widgetName of widgetsToHide) {
                        const widget = this.widgets.find((w) => w.name === widgetName);
                        if (widget) {
                            // Hide the widget by setting its type to 'hidden'
                            widget.type = "hidden";
                            widget.computeSize = () => [0, -4]; // Make it take no space
                            console.log(`[WIDGET] Hidden optional input widget: ${widgetName}`);
                        }
                    }
                };

                // Hide the optional input widgets immediately
                this.hideOptionalInputWidgets();

                // Find the media_source widget
                this.mediaSourceWidget = this.widgets.find((w) => w.name === "media_source");

                // Find the media_type widget
                this.mediaTypeWidget = this.widgets.find((w) => w.name === "media_type");

                // Define clearVideoPreview early so it can be used by clearAllMediaState
                this.clearVideoPreview = function () {
                    // For the media node, we don't have complex video preview
                    // This is just a placeholder method
                    console.log("Video preview cleared for media node");
                };

                // Method to clear all media state (images, videos, previews, file data)
                this.clearAllMediaState = function () {
                    console.log("[DEBUG] clearAllMediaState called");
                    console.log("[DEBUG] _pendingFileRestore exists:", !!this._pendingFileRestore);

                    // Clear video state and preview
                    this.clearVideoPreview();
                    this.uploadedVideoFile = null;
                    this.uploadedVideoSubfolder = null;

                    // Clear image state
                    this.uploadedImageFile = null;
                    this.uploadedImageSubfolder = null;

                    // Reset widget values to defaults (only upload-related widgets)
                    // FIXED: Only clear if widgets exist and we're not in restoration mode
                    if (this.videoInfoWidget && !this._pendingFileRestore) {
                        console.log("[DEBUG] Clearing videoInfoWidget");
                        this.videoInfoWidget.value = "No video selected";
                    } else if (this.videoInfoWidget && this._pendingFileRestore) {
                        console.log(
                            "[DEBUG] Skipping videoInfoWidget clear due to pending restore"
                        );
                    }

                    if (this.imageInfoWidget && !this._pendingFileRestore) {
                        console.log("[DEBUG] Clearing imageInfoWidget");
                        this.imageInfoWidget.value = "No image selected";
                    } else if (this.imageInfoWidget && this._pendingFileRestore) {
                        console.log(
                            "[DEBUG] Skipping imageInfoWidget clear due to pending restore"
                        );
                    }

                    // Don't clear media_path as it's not related to upload state
                    // if (this.mediaPathWidget) {
                    //     this.mediaPathWidget.value = "";
                    // }

                    // Clear hidden widgets that store file paths for Python node
                    if (this.videoFileWidget && !this._pendingFileRestore) {
                        console.log("[DEBUG] Clearing videoFileWidget");
                        this.videoFileWidget.value = "";
                    } else if (this.videoFileWidget && this._pendingFileRestore) {
                        console.log(
                            "[DEBUG] Skipping videoFileWidget clear due to pending restore"
                        );
                    }

                    if (this.imageFileWidget && !this._pendingFileRestore) {
                        console.log("[DEBUG] Clearing imageFileWidget");
                        this.imageFileWidget.value = "";
                    } else if (this.imageFileWidget && this._pendingFileRestore) {
                        console.log(
                            "[DEBUG] Skipping imageFileWidget clear due to pending restore"
                        );
                    }

                    // Also clear the original input widgets if not restoring
                    if (!this._pendingFileRestore) {
                        const originalUploadedImageWidget = this.widgets.find(
                            (w) => w.name === "uploaded_image_file"
                        );
                        const originalUploadedVideoWidget = this.widgets.find(
                            (w) => w.name === "uploaded_video_file"
                        );

                        if (originalUploadedImageWidget) {
                            console.log("[DEBUG] Clearing uploaded_image_file widget");
                            originalUploadedImageWidget.value = "";
                        }
                        if (originalUploadedVideoWidget) {
                            console.log("[DEBUG] Clearing uploaded_video_file widget");
                            originalUploadedVideoWidget.value = "";
                        }
                    } else {
                        console.log(
                            "[DEBUG] Skipping original widget clear due to pending restore"
                        );
                    }

                    console.log("[DEBUG] clearAllMediaState completed");
                };

                // Function to safely remove a widget
                this.removeWidgetSafely = function (widget) {
                    if (widget) {
                        const index = this.widgets.indexOf(widget);
                        if (index !== -1) {
                            this.widgets.splice(index, 1);
                        }
                    }
                };

                // Function to update widgets based on media_source and media_type
                this.updateMediaWidgets = function () {
                    const mediaSource = this.mediaSourceWidget?.value || "Upload Media";
                    const mediaType = this.mediaTypeWidget?.value || "image";

                    console.log(
                        `[STATE] Updating widgets: mediaSource=${mediaSource}, mediaType=${mediaType}`
                    );
                    console.log("[DEBUG] _pendingFileRestore exists:", !!this._pendingFileRestore);

                    // Find the original input widgets that we want to control
                    const originalMediaPathWidget = this.widgets.find(
                        (w) => w.name === "media_path"
                    );
                    const originalUploadedImageWidget = this.widgets.find(
                        (w) => w.name === "uploaded_image_file"
                    );
                    const originalUploadedVideoWidget = this.widgets.find(
                        (w) => w.name === "uploaded_video_file"
                    );
                    const originalSeedWidget = this.widgets.find((w) => w.name === "seed");

                    console.log("[DEBUG] Found widgets:");
                    console.log("  originalMediaPathWidget:", !!originalMediaPathWidget);
                    console.log(
                        "  originalUploadedImageWidget:",
                        !!originalUploadedImageWidget,
                        originalUploadedImageWidget?.value
                    );
                    console.log(
                        "  originalUploadedVideoWidget:",
                        !!originalUploadedVideoWidget,
                        originalUploadedVideoWidget?.value
                    );
                    console.log("  originalSeedWidget:", !!originalSeedWidget);

                    // Clear all previous media state when switching configurations
                    console.log("[STATE] About to call clearAllMediaState");
                    this.clearAllMediaState();

                    // Remove all upload-related widgets first to ensure clean state
                    console.log("[STATE] Removing existing widgets...");
                    this.removeWidgetSafely(this.imageUploadWidget);
                    this.removeWidgetSafely(this.imageInfoWidget);
                    this.removeWidgetSafely(this.videoUploadWidget);
                    this.removeWidgetSafely(this.videoInfoWidget);
                    // Don't remove the original media_path widget, just manage its visibility
                    // this.removeWidgetSafely(this.mediaPathWidget);

                    // Reset widget references
                    console.log("[STATE] Resetting widget references");
                    this.imageUploadWidget = null;
                    this.imageInfoWidget = null;
                    this.videoUploadWidget = null;
                    this.videoInfoWidget = null;
                    // this.mediaPathWidget = null;

                    // Find the reddit_url widget
                    const originalRedditUrlWidget = this.widgets.find(
                        (w) => w.name === "reddit_url"
                    );
                    console.log(
                        `[DEBUG] originalRedditUrlWidget found: ${!!originalRedditUrlWidget}`
                    );
                    if (originalRedditUrlWidget) {
                        console.log(
                            `[DEBUG] Reddit URL widget current type: ${originalRedditUrlWidget.type}, value: "${originalRedditUrlWidget.value}"`
                        );
                    }

                    // Debug: List all widget names
                    console.log(
                        `[DEBUG] All widget names: ${this.widgets.map((w) => w.name).join(", ")}`
                    );

                    // Manage visibility of original input widgets
                    if (mediaSource === "Randomize Media from Path") {
                        console.log("[STATE] Showing media path widget");

                        // Show the original media_path widget
                        if (originalMediaPathWidget) {
                            originalMediaPathWidget.type = "text";
                            originalMediaPathWidget.computeSize =
                                originalMediaPathWidget.constructor.prototype.computeSize;
                            this.mediaPathWidget = originalMediaPathWidget; // Reference the original
                        }

                        // Show the seed widget for randomization
                        if (originalSeedWidget) {
                            originalSeedWidget.type = "number";
                            originalSeedWidget.computeSize =
                                originalSeedWidget.constructor.prototype.computeSize;
                            console.log("[STATE] Showing seed widget for randomization");
                        }

                        // Completely remove Reddit URL widget from DOM for randomize mode
                        if (originalRedditUrlWidget) {
                            // Store widget for potential restoration
                            this._hiddenRedditWidget = originalRedditUrlWidget;

                            // Completely remove the widget from the widgets array
                            const widgetIndex = this.widgets.indexOf(originalRedditUrlWidget);
                            if (widgetIndex > -1) {
                                this.widgets.splice(widgetIndex, 1);
                                console.log(
                                    "[STATE] Completely removed Reddit URL widget from widgets array"
                                );
                            }

                            // Remove DOM element if it exists
                            if (
                                originalRedditUrlWidget.element &&
                                originalRedditUrlWidget.element.parentNode
                            ) {
                                originalRedditUrlWidget.element.parentNode.removeChild(
                                    originalRedditUrlWidget.element
                                );
                                console.log("[STATE] Removed Reddit URL widget DOM element");
                            }

                            // Force node to recompute size and refresh
                            if (this.setSize) {
                                setTimeout(() => {
                                    this.setSize(this.computeSize());
                                }, 10);
                            }

                            console.log(
                                "[STATE] Completely removed Reddit URL widget for randomize mode"
                            );
                        } else {
                            console.log(
                                "[DEBUG] Reddit URL widget not found for hiding in randomize mode"
                            );
                        }

                        // Hide upload file widgets
                        if (originalUploadedImageWidget) {
                            originalUploadedImageWidget.type = "hidden";
                            originalUploadedImageWidget.computeSize = () => [0, -4];
                        }
                        if (originalUploadedVideoWidget) {
                            originalUploadedVideoWidget.type = "hidden";
                            originalUploadedVideoWidget.computeSize = () => [0, -4];
                        }
                    } else if (mediaSource === "Reddit Post") {
                        console.log("[STATE] Reddit Post mode - showing Reddit URL widget");

                        // Show the Reddit URL widget (restore if it was removed)
                        if (originalRedditUrlWidget) {
                            originalRedditUrlWidget.type = "text";
                            originalRedditUrlWidget.computeSize =
                                originalRedditUrlWidget.constructor.prototype.computeSize;
                            this.redditUrlWidget = originalRedditUrlWidget; // Reference the original
                            // Ensure the widget is fully visible (reverse ultra-aggressive hiding)
                            if (originalRedditUrlWidget.element) {
                                originalRedditUrlWidget.element.style.display = "";
                                originalRedditUrlWidget.element.style.visibility = "";
                                originalRedditUrlWidget.element.style.height = "";
                                originalRedditUrlWidget.element.style.overflow = "";
                                // Restore parent visibility if it was hidden
                                if (originalRedditUrlWidget.element.parentNode) {
                                    originalRedditUrlWidget.element.parentNode.style.display = "";
                                }
                            }
                            originalRedditUrlWidget.options = originalRedditUrlWidget.options || {};
                            originalRedditUrlWidget.options.serialize = true;
                            console.log(
                                "[STATE] Showing Reddit URL widget for Reddit Post mode (with display reset)"
                            );
                        } else if (this._hiddenRedditWidget) {
                            // Restore widget that was completely removed
                            this.widgets.push(this._hiddenRedditWidget);
                            this._hiddenRedditWidget.type = "text";
                            this._hiddenRedditWidget.computeSize =
                                this._hiddenRedditWidget.constructor.prototype.computeSize;
                            this.redditUrlWidget = this._hiddenRedditWidget;
                            this._hiddenRedditWidget.options =
                                this._hiddenRedditWidget.options || {};
                            this._hiddenRedditWidget.options.serialize = true;
                            console.log(
                                "[STATE] Restored previously removed Reddit URL widget for Reddit Post mode"
                            );
                            // Clear the stored reference
                            this._hiddenRedditWidget = null;
                        } else {
                            console.log(
                                "[DEBUG] Reddit URL widget not found for showing in Reddit Post mode"
                            );
                        }

                        // Hide other widgets
                        if (originalMediaPathWidget) {
                            originalMediaPathWidget.type = "hidden";
                            originalMediaPathWidget.computeSize = () => [0, -4];
                        }
                        if (originalSeedWidget) {
                            originalSeedWidget.type = "hidden";
                            originalSeedWidget.computeSize = () => [0, -4];
                            console.log("[STATE] Hiding seed widget for Reddit mode");
                        }
                        if (originalUploadedImageWidget) {
                            originalUploadedImageWidget.type = "hidden";
                            originalUploadedImageWidget.computeSize = () => [0, -4];
                        }
                        if (originalUploadedVideoWidget) {
                            originalUploadedVideoWidget.type = "hidden";
                            originalUploadedVideoWidget.computeSize = () => [0, -4];
                        }
                    } else {
                        // Upload Media mode - Show appropriate upload widgets based on media_type
                        console.log("[STATE] Upload Media mode - hiding media_path widget");

                        // Hide the original media_path widget
                        if (originalMediaPathWidget) {
                            originalMediaPathWidget.type = "hidden";
                            originalMediaPathWidget.computeSize = () => [0, -4];
                        }

                        // Hide the seed widget when not randomizing
                        if (originalSeedWidget) {
                            originalSeedWidget.type = "hidden";
                            originalSeedWidget.computeSize = () => [0, -4];
                            console.log("[STATE] Hiding seed widget for upload mode");
                        }

                        // Completely remove Reddit URL widget from DOM for upload mode
                        if (originalRedditUrlWidget) {
                            // Store widget for potential restoration
                            this._hiddenRedditWidget = originalRedditUrlWidget;

                            // Completely remove the widget from the widgets array
                            const widgetIndex = this.widgets.indexOf(originalRedditUrlWidget);
                            if (widgetIndex > -1) {
                                this.widgets.splice(widgetIndex, 1);
                                console.log(
                                    "[STATE] Completely removed Reddit URL widget from widgets array"
                                );
                            }

                            // Remove DOM element if it exists
                            if (
                                originalRedditUrlWidget.element &&
                                originalRedditUrlWidget.element.parentNode
                            ) {
                                originalRedditUrlWidget.element.parentNode.removeChild(
                                    originalRedditUrlWidget.element
                                );
                                console.log("[STATE] Removed Reddit URL widget DOM element");
                            }

                            console.log(
                                "[STATE] Completely removed Reddit URL widget for upload mode"
                            );
                        } else {
                            console.log(
                                "[DEBUG] Reddit URL widget not found for hiding in upload mode"
                            );
                        }

                        if (mediaType === "image") {
                            console.log("[STATE] Creating image upload widgets");

                            // Hide the video upload widget, show image upload widget reference
                            if (originalUploadedVideoWidget) {
                                originalUploadedVideoWidget.type = "hidden";
                                originalUploadedVideoWidget.computeSize = () => [0, -4];
                            }
                            if (originalUploadedImageWidget) {
                                originalUploadedImageWidget.type = "hidden"; // Keep hidden, we'll use a custom widget
                                originalUploadedImageWidget.computeSize = () => [0, -4];
                            }

                            // Add image upload widgets
                            this.imageUploadWidget = this.addWidget(
                                "button",
                                "📁 Choose Image to Upload",
                                "upload_image",
                                () => {
                                    this.onImageUploadButtonPressed();
                                }
                            );
                            this.imageUploadWidget.serialize = false;

                            // Add a widget to display the selected image info
                            this.imageInfoWidget = this.addWidget(
                                "text",
                                "image_file",
                                "No image selected",
                                () => {},
                                {}
                            );
                            this.imageInfoWidget.serialize = false;
                        } else if (mediaType === "video") {
                            console.log("[STATE] Creating video upload widgets");

                            // Hide the image upload widget, show video upload widget reference
                            if (originalUploadedImageWidget) {
                                originalUploadedImageWidget.type = "hidden";
                                originalUploadedImageWidget.computeSize = () => [0, -4];
                            }
                            if (originalUploadedVideoWidget) {
                                originalUploadedVideoWidget.type = "hidden"; // Keep hidden, we'll use a custom widget
                                originalUploadedVideoWidget.computeSize = () => [0, -4];
                            }

                            // Add video upload widgets
                            this.videoUploadWidget = this.addWidget(
                                "button",
                                "📁 Choose Video to Upload",
                                "upload_video",
                                () => {
                                    this.onVideoUploadButtonPressed();
                                }
                            );
                            this.videoUploadWidget.serialize = false;

                            // Add a widget to display the selected video info
                            this.videoInfoWidget = this.addWidget(
                                "text",
                                "video_file",
                                "No video selected",
                                () => {},
                                {}
                            );
                            this.videoInfoWidget.serialize = false;
                        }
                    }

                    console.log(
                        `[STATE] Widget update complete. Total widgets: ${
                            this.widgets?.length || 0
                        }`
                    );

                    // Final debug check for Reddit URL widget state
                    const finalRedditUrlWidget = this.widgets.find((w) => w.name === "reddit_url");
                    if (finalRedditUrlWidget) {
                        console.log(
                            `[DEBUG] Final Reddit URL widget state - type: ${finalRedditUrlWidget.type}, visible: ${finalRedditUrlWidget.type !== "hidden"}, value: "${finalRedditUrlWidget.value}"`
                        );
                    }

                    // Force node to recalculate size and refresh UI (aggressive refresh)
                    this.setSize(this.computeSize());

                    // Additional UI refresh signals
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

                // Initial setup
                this.updateMediaWidgets();

                // Hook into media_source widget changes
                if (this.mediaSourceWidget) {
                    const originalSourceCallback = this.mediaSourceWidget.callback;
                    this.mediaSourceWidget.callback = (value) => {
                        if (originalSourceCallback)
                            originalSourceCallback.call(this.mediaSourceWidget, value);
                        this.updateMediaWidgets();
                    };
                }

                // Hook into media_type widget changes
                if (this.mediaTypeWidget) {
                    const originalTypeCallback = this.mediaTypeWidget.callback;
                    this.mediaTypeWidget.callback = (value) => {
                        if (originalTypeCallback)
                            originalTypeCallback.call(this.mediaTypeWidget, value);
                        this.updateMediaWidgets();
                    };
                }

                return result;
            };

            // Add onSerialize method to save UI state
            const onSerialize = nodeType.prototype.onSerialize;
            nodeType.prototype.onSerialize = function (o) {
                const result = onSerialize?.apply(this, arguments);

                console.log("[DEBUG] onSerialize called - collecting state data");
                console.log("[DEBUG] uploadedVideoFile:", this.uploadedVideoFile);
                console.log("[DEBUG] uploadedVideoSubfolder:", this.uploadedVideoSubfolder);
                console.log("[DEBUG] videoInfoWidget value:", this.videoInfoWidget?.value);
                console.log("[DEBUG] uploadedImageFile:", this.uploadedImageFile);
                console.log("[DEBUG] uploadedImageSubfolder:", this.uploadedImageSubfolder);
                console.log("[DEBUG] imageInfoWidget value:", this.imageInfoWidget?.value);

                // Find the reddit_url widget for persistence
                const redditUrlWidget = this.widgets.find((w) => w.name === "reddit_url");
                const redditUrlValue = redditUrlWidget?.value || "";
                console.log("[DEBUG] reddit_url widget value:", redditUrlValue);

                // Save current widget state for persistence
                o.widgets_values = o.widgets_values || [];
                o.ui_state = {
                    media_source: this.mediaSourceWidget?.value || "Upload Media",
                    media_type: this.mediaTypeWidget?.value || "image",
                    reddit_url: redditUrlValue,
                    // Add uploaded file persistence
                    uploaded_file_info: {
                        image: {
                            file: this.uploadedImageFile,
                            subfolder: this.uploadedImageSubfolder,
                            display: this.imageInfoWidget?.value,
                        },
                        video: {
                            file: this.uploadedVideoFile,
                            subfolder: this.uploadedVideoSubfolder,
                            display: this.videoInfoWidget?.value,
                        },
                    },
                };

                console.log("[SERIALIZE] Saving UI state:", JSON.stringify(o.ui_state, null, 2));

                // Also check the actual widget values in widgets_values array
                console.log("[DEBUG] widgets_values array:", o.widgets_values);

                // Check if any widgets have video file info
                if (this.widgets) {
                    const videoWidget = this.widgets.find((w) => w.name === "uploaded_video_file");
                    const imageWidget = this.widgets.find((w) => w.name === "uploaded_image_file");
                    console.log("[DEBUG] uploaded_video_file widget value:", videoWidget?.value);
                    console.log("[DEBUG] uploaded_image_file widget value:", imageWidget?.value);
                }

                return result;
            };

            // Add onConfigure method to restore UI state
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function (o) {
                const result = onConfigure?.apply(this, arguments);

                console.log("[DEBUG] onConfigure called with data:", o);
                console.log("[DEBUG] ui_state found:", !!o.ui_state);
                console.log("[DEBUG] widgets_values found:", !!o.widgets_values);

                // Restore UI state after widgets are created
                if (o.ui_state) {
                    console.log(
                        "[CONFIGURE] Restoring UI state:",
                        JSON.stringify(o.ui_state, null, 2)
                    );

                    // Set widget values if they exist
                    if (this.mediaSourceWidget && o.ui_state.media_source) {
                        console.log(
                            "[DEBUG] Setting mediaSourceWidget to:",
                            o.ui_state.media_source
                        );
                        this.mediaSourceWidget.value = o.ui_state.media_source;
                    }
                    if (this.mediaTypeWidget && o.ui_state.media_type) {
                        console.log("[DEBUG] Setting mediaTypeWidget to:", o.ui_state.media_type);
                        this.mediaTypeWidget.value = o.ui_state.media_type;
                    }

                    // Store upload file info and reddit_url for later restoration (after updateMediaWidgets clears state)
                    this._pendingFileRestore = o.ui_state.uploaded_file_info;
                    this._pendingRedditUrlRestore = o.ui_state.reddit_url;
                    console.log(
                        "[DEBUG] Stored _pendingFileRestore:",
                        JSON.stringify(this._pendingFileRestore, null, 2)
                    );

                    // Update UI to match restored state
                    setTimeout(() => {
                        console.log("[DEBUG] First timeout - calling updateMediaWidgets");
                        this.updateMediaWidgets();

                        // FIXED: Restore uploaded file information after updateMediaWidgets has run
                        // Need a second timeout to ensure widgets are fully created
                        setTimeout(() => {
                            console.log("[DEBUG] Second timeout - starting file restoration");
                            console.log(
                                "[DEBUG] _pendingFileRestore still exists:",
                                !!this._pendingFileRestore
                            );
                            console.log(
                                "[DEBUG] _pendingRedditUrlRestore:",
                                this._pendingRedditUrlRestore
                            );

                            // Restore reddit_url first if available
                            if (this._pendingRedditUrlRestore !== undefined) {
                                const redditUrlWidget = this.widgets.find(
                                    (w) => w.name === "reddit_url"
                                );
                                if (redditUrlWidget) {
                                    redditUrlWidget.value = this._pendingRedditUrlRestore;
                                    console.log(
                                        "[CONFIGURE] Restored reddit_url to:",
                                        this._pendingRedditUrlRestore
                                    );
                                } else {
                                    console.log(
                                        "[DEBUG] Reddit URL widget not found for restoration"
                                    );
                                }
                                // Clean up
                                delete this._pendingRedditUrlRestore;
                            }

                            if (this._pendingFileRestore) {
                                const fileInfo = this._pendingFileRestore;
                                console.log(
                                    "[DEBUG] Processing fileInfo:",
                                    JSON.stringify(fileInfo, null, 2)
                                );

                                // Debug: List all current widgets
                                console.log(
                                    "[DEBUG] Current widgets:",
                                    this.widgets.map((w) => ({
                                        name: w.name,
                                        type: w.type,
                                        value: w.value,
                                    }))
                                );

                                // Restore image upload state
                                if (fileInfo.image?.file) {
                                    console.log("[DEBUG] Restoring image state:", fileInfo.image);
                                    this.uploadedImageFile = fileInfo.image.file;
                                    this.uploadedImageSubfolder = fileInfo.image.subfolder;
                                    if (this.imageInfoWidget && fileInfo.image.display) {
                                        this.imageInfoWidget.value = fileInfo.image.display;
                                        console.log(
                                            "[DEBUG] Updated imageInfoWidget:",
                                            this.imageInfoWidget.value
                                        );
                                    }

                                    // Update the hidden widget with file path
                                    const originalUploadedImageWidget = this.widgets.find(
                                        (w) => w.name === "uploaded_image_file"
                                    );
                                    if (originalUploadedImageWidget) {
                                        originalUploadedImageWidget.value = `${this.uploadedImageSubfolder}/${this.uploadedImageFile}`;
                                        console.log(
                                            `[CONFIGURE] Restored image file: ${originalUploadedImageWidget.value}`
                                        );
                                    } else {
                                        console.log(
                                            "[DEBUG] WARNING: uploaded_image_file widget not found!"
                                        );
                                    }
                                }

                                // FIXED: Restore video upload state with proper widget handling
                                if (fileInfo.video?.file) {
                                    console.log("[DEBUG] Restoring video state:", fileInfo.video);
                                    this.uploadedVideoFile = fileInfo.video.file;
                                    this.uploadedVideoSubfolder = fileInfo.video.subfolder;

                                    console.log(
                                        "[DEBUG] Set uploadedVideoFile:",
                                        this.uploadedVideoFile
                                    );
                                    console.log(
                                        "[DEBUG] Set uploadedVideoSubfolder:",
                                        this.uploadedVideoSubfolder
                                    );

                                    // Ensure video info widget exists and update it
                                    if (this.videoInfoWidget) {
                                        if (fileInfo.video.display) {
                                            this.videoInfoWidget.value = fileInfo.video.display;
                                        } else {
                                            // Fallback display if display info is missing
                                            this.videoInfoWidget.value = `${this.uploadedVideoFile} (restored)`;
                                        }
                                        console.log(
                                            `[CONFIGURE] Restored video info widget: ${this.videoInfoWidget.value}`
                                        );
                                    } else {
                                        console.log("[DEBUG] WARNING: videoInfoWidget not found!");
                                    }

                                    // Update the hidden widget with file path
                                    const originalUploadedVideoWidget = this.widgets.find(
                                        (w) => w.name === "uploaded_video_file"
                                    );
                                    if (originalUploadedVideoWidget) {
                                        const filePath = `${this.uploadedVideoSubfolder}/${this.uploadedVideoFile}`;
                                        originalUploadedVideoWidget.value = filePath;
                                        console.log(
                                            `[CONFIGURE] Restored video file widget: ${originalUploadedVideoWidget.value}`
                                        );
                                    } else {
                                        console.log(
                                            "[DEBUG] WARNING: uploaded_video_file widget not found!"
                                        );
                                    }

                                    // Also ensure the videoFileWidget is updated if it exists
                                    if (this.videoFileWidget) {
                                        this.videoFileWidget.value = `${this.uploadedVideoSubfolder}/${this.uploadedVideoFile}`;
                                        console.log(
                                            `[CONFIGURE] Updated videoFileWidget: ${this.videoFileWidget.value}`
                                        );
                                    } else {
                                        console.log(
                                            "[DEBUG] videoFileWidget not found (this might be OK)"
                                        );
                                    }
                                } else {
                                    console.log("[DEBUG] No video file info to restore");
                                }

                                // Clean up temporary storage
                                delete this._pendingFileRestore;
                                console.log("[DEBUG] Cleaned up _pendingFileRestore");
                            } else {
                                console.log(
                                    "[DEBUG] No _pendingFileRestore found in second timeout"
                                );
                            }

                            console.log("[CONFIGURE] File state restoration complete");
                        }, 50); // Small delay to ensure widget creation is complete

                        console.log("[CONFIGURE] UI state restored and widgets updated");
                    }, 0);
                } else {
                    console.log("[CONFIGURE] No UI state found, using defaults");
                    // Ensure initial state is applied even without saved state
                    setTimeout(() => {
                        this.updateMediaWidgets();
                    }, 0);
                }

                return result;
            };

            // Helper function to update dimensions display
            nodeType.prototype.updateDimensionsDisplay = function (height, width) {
                console.log(
                    "[GeminiMediaDescribe] updateDimensionsDisplay called with:",
                    height,
                    width
                );

                if (height != null && width != null) {
                    let dimensionsWidget = this.widgets.find(
                        (w) => w.name === "dimensions_display"
                    );

                    if (!dimensionsWidget) {
                        // Create the widget if it doesn't exist
                        dimensionsWidget = this.addWidget(
                            "text",
                            "dimensions_display",
                            `📐 ${width} x ${height}`,
                            () => {}, // Read-only widget
                            { serialize: false }
                        );
                        console.log("[GeminiMediaDescribe] Created dimensions display widget");
                    } else {
                        // Update existing widget
                        dimensionsWidget.value = `📐 ${width} x ${height}`;
                        console.log(
                            "[GeminiMediaDescribe] Updated dimensions display:",
                            width,
                            "x",
                            height
                        );
                    }

                    // Force UI refresh to show the updated widget
                    this.setSize(this.computeSize());
                    if (this.graph && this.graph.setDirtyCanvas) {
                        this.graph.setDirtyCanvas(true, true);
                    }
                } else {
                    console.log("[GeminiMediaDescribe] Invalid dimensions, not updating display");
                }
            };

            // Add onExecuted method to update the dimensions display
            const onExecutedMedia = nodeType.prototype.onExecuted;
            nodeType.prototype.onExecuted = function (message) {
                const result = onExecutedMedia?.apply(this, arguments);

                console.log("[GeminiMediaDescribe] onExecuted called");
                console.log("[GeminiMediaDescribe] Message type:", typeof message);
                console.log(
                    "[GeminiMediaDescribe] Message keys:",
                    message ? Object.keys(message) : "null"
                );

                // Update dimensions display widget with height and width from execution results
                if (message) {
                    let height = null;
                    let width = null;

                    // Try to extract from different possible message structures
                    // Structure 1: message is an array of outputs [description, media_info, status, path, final_string, height, width]
                    if (Array.isArray(message) && message.length >= 7) {
                        height = message[5]; // Index 5 is height
                        width = message[6]; // Index 6 is width
                        console.log(
                            "[GeminiMediaDescribe] Found dimensions in array format:",
                            height,
                            width
                        );
                    }
                    // Structure 2: message has height/width properties
                    else if (message.height && message.width) {
                        height = Array.isArray(message.height) ? message.height[0] : message.height;
                        width = Array.isArray(message.width) ? message.width[0] : message.width;
                        console.log(
                            "[GeminiMediaDescribe] Found dimensions in message properties:",
                            height,
                            width
                        );
                    }
                    // Structure 3: Check if message has output property
                    else if (message.output) {
                        console.log("[GeminiMediaDescribe] Checking message.output");
                        if (Array.isArray(message.output) && message.output.length >= 7) {
                            height = message.output[5];
                            width = message.output[6];
                            console.log(
                                "[GeminiMediaDescribe] Found dimensions in message.output array:",
                                height,
                                width
                            );
                        } else if (message.output.height && message.output.width) {
                            height = Array.isArray(message.output.height)
                                ? message.output.height[0]
                                : message.output.height;
                            width = Array.isArray(message.output.width)
                                ? message.output.width[0]
                                : message.output.width;
                            console.log(
                                "[GeminiMediaDescribe] Found dimensions in message.output properties:",
                                height,
                                width
                            );
                        }
                    }

                    // Use the helper function to update the display
                    this.updateDimensionsDisplay(height, width);
                }

                return result;
            };

            // Method to clear current media type state only
            nodeType.prototype.clearCurrentMediaState = function () {
                const mediaType = this.mediaTypeWidget?.value || "image";

                if (mediaType === "video") {
                    // Clear video state
                    this.clearVideoPreview();
                    this.uploadedVideoFile = null;
                    this.uploadedVideoSubfolder = null;

                    if (this.videoInfoWidget) {
                        this.videoInfoWidget.value = "No video selected";
                    }
                    if (this.videoFileWidget) {
                        this.videoFileWidget.value = "";
                    }
                } else if (mediaType === "image") {
                    // Clear image state
                    this.uploadedImageFile = null;
                    this.uploadedImageSubfolder = null;

                    if (this.imageInfoWidget) {
                        this.imageInfoWidget.value = "No image selected";
                    }
                    if (this.imageFileWidget) {
                        this.imageFileWidget.value = "";
                    }
                }
            };

            // Add image upload handler
            nodeType.prototype.onImageUploadButtonPressed = function () {
                console.log("Image upload button pressed!");

                // Clear current image state before starting new upload
                this.clearCurrentMediaState();

                // Create file input element
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.style.display = "none";

                fileInput.onchange = async (event) => {
                    const file = event.target.files[0];
                    if (!file) {
                        return;
                    }

                    // Validate file type
                    if (!file.type.startsWith("image/")) {
                        app.ui.dialog.show("Please select a valid image file.");
                        return;
                    }

                    // Show loading state
                    this.imageInfoWidget.value = "Uploading image...";

                    try {
                        // Upload the image file
                        const formData = new FormData();
                        formData.append("image", file);
                        formData.append("subfolder", "swiss_army_knife_images");
                        formData.append("type", "input");

                        const uploadResponse = await fetch("/upload/image", {
                            method: "POST",
                            body: formData,
                        });

                        if (!uploadResponse.ok) {
                            throw new Error(`Upload failed: ${uploadResponse.statusText}`);
                        }

                        const uploadResult = await uploadResponse.json();

                        // Update the image info widget
                        this.imageInfoWidget.value = `${file.name} (${(
                            file.size /
                            1024 /
                            1024
                        ).toFixed(2)} MB)`;

                        // Store image info for processing
                        this.uploadedImageFile = uploadResult.name;
                        this.uploadedImageSubfolder =
                            uploadResult.subfolder || "swiss_army_knife_images";

                        // Use the original uploaded_image_file widget to store the file path
                        const originalUploadedImageWidget = this.widgets.find(
                            (w) => w.name === "uploaded_image_file"
                        );
                        if (originalUploadedImageWidget) {
                            originalUploadedImageWidget.value = `${this.uploadedImageSubfolder}/${this.uploadedImageFile}`;
                            console.log(
                                `[UPLOAD] Updated original uploaded_image_file widget: ${originalUploadedImageWidget.value}`
                            );
                        } else {
                            // Fallback: create a hidden widget if the original doesn't exist
                            if (!this.imageFileWidget) {
                                this.imageFileWidget = this.addWidget(
                                    "text",
                                    "uploaded_image_file",
                                    "",
                                    () => {},
                                    {}
                                );
                                this.imageFileWidget.serialize = true;
                                this.imageFileWidget.type = "hidden";
                            }
                            this.imageFileWidget.value = `${this.uploadedImageSubfolder}/${this.uploadedImageFile}`;
                        }

                        // Show success notification
                        app.extensionManager?.toast?.add({
                            severity: "success",
                            summary: "Image Upload",
                            detail: `Successfully uploaded ${file.name}`,
                            life: 3000,
                        });

                        console.log("Image uploaded:", uploadResult);
                    } catch (error) {
                        console.error("Upload error:", error);

                        // Clear everything on error
                        this.imageInfoWidget.value = "Upload failed";
                        this.uploadedImageFile = null;
                        this.uploadedImageSubfolder = null;

                        if (this.imageFileWidget) {
                            this.imageFileWidget.value = "";
                        }

                        app.ui.dialog.show(`Upload failed: ${error.message}`);
                    }

                    // Clean up
                    document.body.removeChild(fileInput);
                };

                // Trigger file selection
                document.body.appendChild(fileInput);
                fileInput.click();
            };

            // Add video upload handler (reuse from existing video node)
            nodeType.prototype.onVideoUploadButtonPressed = function () {
                console.log("Video upload button pressed!");

                // Clear current video state before starting new upload
                this.clearCurrentMediaState();

                // Create file input element
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "video/*";
                fileInput.style.display = "none";

                fileInput.onchange = async (event) => {
                    const file = event.target.files[0];
                    if (!file) {
                        // User cancelled, keep cleared state
                        return;
                    }

                    // Validate file type
                    if (!file.type.startsWith("video/")) {
                        app.ui.dialog.show("Please select a valid video file.");
                        return;
                    }

                    // Show loading state
                    this.videoInfoWidget.value = "Uploading video...";

                    try {
                        // Upload the video file
                        const formData = new FormData();
                        formData.append("image", file);
                        formData.append("subfolder", "swiss_army_knife_videos");
                        formData.append("type", "input");

                        const uploadResponse = await fetch("/upload/image", {
                            method: "POST",
                            body: formData,
                        });

                        if (!uploadResponse.ok) {
                            throw new Error(`Upload failed: ${uploadResponse.statusText}`);
                        }

                        const uploadResult = await uploadResponse.json();

                        console.log("[DEBUG] Video upload successful, result:", uploadResult);

                        // Update the video info widget
                        this.videoInfoWidget.value = `${file.name} (${(
                            file.size /
                            1024 /
                            1024
                        ).toFixed(2)} MB)`;

                        // Store video info for processing
                        this.uploadedVideoFile = uploadResult.name;
                        this.uploadedVideoSubfolder =
                            uploadResult.subfolder || "swiss_army_knife_videos";

                        console.log("[DEBUG] Set uploadedVideoFile to:", this.uploadedVideoFile);
                        console.log(
                            "[DEBUG] Set uploadedVideoSubfolder to:",
                            this.uploadedVideoSubfolder
                        );
                        console.log("[DEBUG] Set videoInfoWidget to:", this.videoInfoWidget.value);

                        // Use the original uploaded_video_file widget to store the file path
                        const originalUploadedVideoWidget = this.widgets.find(
                            (w) => w.name === "uploaded_video_file"
                        );
                        if (originalUploadedVideoWidget) {
                            originalUploadedVideoWidget.value = `${this.uploadedVideoSubfolder}/${this.uploadedVideoFile}`;
                            console.log(
                                `[UPLOAD] Updated original uploaded_video_file widget: ${originalUploadedVideoWidget.value}`
                            );
                        } else {
                            console.log(
                                "[DEBUG] WARNING: uploaded_video_file widget not found during upload!"
                            );
                            // Fallback: create a hidden widget if the original doesn't exist
                            if (!this.videoFileWidget) {
                                this.videoFileWidget = this.addWidget(
                                    "text",
                                    "uploaded_video_file",
                                    "",
                                    () => {},
                                    {}
                                );
                                this.videoFileWidget.serialize = true;
                                this.videoFileWidget.type = "hidden";
                                console.log("[DEBUG] Created fallback videoFileWidget");
                            }
                            this.videoFileWidget.value = `${this.uploadedVideoSubfolder}/${this.uploadedVideoFile}`;
                            console.log(
                                "[DEBUG] Updated fallback videoFileWidget:",
                                this.videoFileWidget.value
                            );
                        }

                        // Debug: Show all widget states after upload
                        console.log("[DEBUG] All widgets after upload:");
                        this.widgets.forEach((w) => {
                            console.log(`  ${w.name}: ${w.value} (type: ${w.type})`);
                        });

                        // Show success notification
                        app.extensionManager?.toast?.add({
                            severity: "success",
                            summary: "Video Upload",
                            detail: `Successfully uploaded ${file.name}`,
                            life: 3000,
                        });

                        console.log("Video uploaded:", uploadResult);
                    } catch (error) {
                        console.error("Upload error:", error);

                        // Clear everything on error
                        this.clearVideoPreview();
                        this.videoInfoWidget.value = "Upload failed";
                        this.uploadedVideoFile = null;
                        this.uploadedVideoSubfolder = null;

                        if (this.videoFileWidget) {
                            this.videoFileWidget.value = "";
                        }

                        app.ui.dialog.show(`Upload failed: ${error.message}`);
                    }

                    // Clean up
                    document.body.removeChild(fileInput);
                };

                // Trigger file selection
                document.body.appendChild(fileInput);
                fileInput.click();
            };
        }
    },

    // Hook to handle workflow loading
    loadedGraphNode(node, app) {
        if (node.comfyClass === "GeminiUtilMediaDescribe") {
            console.log("[LOADED] loadedGraphNode called for GeminiUtilMediaDescribe");

            // Check if this node has saved UI state with uploaded file data
            const hasSavedVideoData = node.ui_state?.uploaded_file_info?.video?.file;
            const hasSavedImageData = node.ui_state?.uploaded_file_info?.image?.file;

            console.log(
                "[LOADED] hasSavedVideoData:",
                !!hasSavedVideoData,
                "hasSavedImageData:",
                !!hasSavedImageData
            );
            console.log("[LOADED] Saved video file:", hasSavedVideoData);
            console.log("[LOADED] Saved image file:", hasSavedImageData);

            // Only call updateMediaWidgets if we don't have any saved uploaded file data
            // If we have saved data, onConfigure will handle the restoration
            if (!hasSavedVideoData && !hasSavedImageData && node.updateMediaWidgets) {
                console.log(
                    "[LOADED] No saved uploaded file data found, applying default UI state"
                );
                setTimeout(() => {
                    node.updateMediaWidgets();
                    console.log("[LOADED] Applied default UI state for loaded workflow node");
                }, 100); // Small delay to ensure all widgets are properly initialized
            } else {
                console.log(
                    "[LOADED] Saved uploaded file data found, skipping updateMediaWidgets to preserve onConfigure restoration"
                );
            }
        }
    },

    // Setup app-level execution handler for GeminiUtilMediaDescribe
    async setup() {
        // Hook into API events to catch execution results
        api.addEventListener("executed", ({ detail }) => {
            const { node: nodeId, output } = detail;

            console.log("[API] Execution event received for node:", nodeId);
            console.log("[API] Output data:", output);

            // Find the node by ID
            const node = app.graph.getNodeById(parseInt(nodeId));
            if (node && node.comfyClass === "GeminiUtilMediaDescribe") {
                console.log("[API] Found GeminiUtilMediaDescribe execution result");

                // Extract dimensions from output
                // Output structure: {height: [1080], width: [1920], ...}
                let height = null;
                let width = null;

                if (output && output.height && output.width) {
                    height = Array.isArray(output.height) ? output.height[0] : output.height;
                    width = Array.isArray(output.width) ? output.width[0] : output.width;
                    console.log("[API] Extracted dimensions from API event:", width, "x", height);

                    // Update the dimensions display using the helper method
                    if (node.updateDimensionsDisplay) {
                        node.updateDimensionsDisplay(height, width);
                    }
                }
            }
        });
    },
});

// Cache busting and development utility extension
app.registerExtension({
    name: "comfyui_swissarmyknife.cache_control",

    async setup() {
        // Log cache busting info for debugging
        console.log(
            `Swiss Army Knife Cache Info: v${EXTENSION_VERSION}, loaded at ${LOAD_TIMESTAMP}`
        );

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
app.registerExtension({
    name: "comfyui_swissarmyknife.lora_info_extractor",

    async setup() {
        // Listen for execution results at the app level
        const original_onExecuted = app.onExecuted;
        app.onExecuted = function (nodeId, data) {
            console.log("[DEBUG] App execution completed for node:", nodeId, "data:", data);

            // Find the node by ID and check if it's LoRAInfoExtractor
            const node = app.graph.getNodeById(nodeId);
            if (node && node.comfyClass === "LoRAInfoExtractor") {
                console.log("[DEBUG] Found LoRAInfoExtractor execution result");

                // Try to extract lora_json from the execution data
                if (data && data[0]) {
                    // First output should be lora_json
                    node._cached_lora_json = data[0];
                    console.log(
                        "[DEBUG] Cached lora_json from app execution:",
                        data[0].substring(0, 100) + "..."
                    );
                }
            }

            // Call original handler
            return original_onExecuted?.call(this, nodeId, data);
        };
    },

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "LoRAInfoExtractor") {
            console.log("[DEBUG] Registering LoRAInfoExtractor widget extensions");

            // Add onSerialize method to save lora_json output to workflow
            const onSerialize = nodeType.prototype.onSerialize;
            nodeType.prototype.onSerialize = function (o) {
                const result = onSerialize?.apply(this, arguments);

                console.log("[DEBUG] LoRAInfoExtractor onSerialize called for node:", this.id);
                console.log("[DEBUG] Current cached lora_json:", !!this._cached_lora_json);
                console.log("[DEBUG] Serialization object before:", JSON.stringify(o, null, 2));

                // Save the cached lora_json output if available
                if (this._cached_lora_json) {
                    o.lora_json_output = this._cached_lora_json;
                    console.log(
                        "[SERIALIZE] Saved lora_json to workflow:",
                        typeof this._cached_lora_json === "string"
                            ? this._cached_lora_json.substring(0, 100) + "..."
                            : JSON.stringify(this._cached_lora_json).substring(0, 100) + "..."
                    );
                } else {
                    console.log("[SERIALIZE] No cached lora_json to save");
                }

                console.log("[DEBUG] Serialization object after:", JSON.stringify(o, null, 2));
                return result;
            };

            // Add onConfigure method to restore lora_json from workflow
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function (o) {
                const result = onConfigure?.apply(this, arguments);

                console.log("[DEBUG] LoRAInfoExtractor onConfigure called");

                // Restore the cached lora_json output if available
                if (o.lora_json_output) {
                    this._cached_lora_json = o.lora_json_output;
                    console.log(
                        "[CONFIGURE] Restored lora_json from workflow:",
                        o.lora_json_output?.substring(0, 100) + "..."
                    );
                }

                return result;
            };
        }
    },

    async nodeCreated(node) {
        if (node.comfyClass === "LoRAInfoExtractor") {
            console.log("[DEBUG] LoRAInfoExtractor node created, ID:", node.id);

            // Listen for node execution results
            const originalOnExecuted = node.onExecuted;
            node.onExecuted = function (message) {
                console.log("[DEBUG] LoRAInfoExtractor onExecuted called");
                console.log("[DEBUG] Full message object:", JSON.stringify(message, null, 2));

                // Try different possible message structures
                let loraJsonValue = null;

                // Try different paths where the lora_json might be
                if (message && message.output) {
                    console.log("[DEBUG] message.output exists:", message.output);

                    // Check if it's directly in output
                    if (message.output.lora_json) {
                        console.log("[DEBUG] Found lora_json in message.output.lora_json");
                        loraJsonValue = Array.isArray(message.output.lora_json)
                            ? message.output.lora_json[0]
                            : message.output.lora_json;
                    }
                    // Check if it's in a different structure
                    else if (message.output[0]) {
                        console.log("[DEBUG] Found output[0]:", message.output[0]);
                        loraJsonValue = message.output[0];
                    }
                }

                // Also check if message itself has the data
                if (!loraJsonValue && message.lora_json) {
                    console.log("[DEBUG] Found lora_json in message.lora_json");
                    loraJsonValue = Array.isArray(message.lora_json)
                        ? message.lora_json[0]
                        : message.lora_json;
                }

                if (loraJsonValue) {
                    this._cached_lora_json = loraJsonValue;
                    console.log(
                        "[DEBUG] Cached lora_json from execution:",
                        typeof loraJsonValue === "string"
                            ? loraJsonValue.substring(0, 100) + "..."
                            : JSON.stringify(loraJsonValue).substring(0, 100) + "..."
                    );
                } else {
                    console.log("[DEBUG] No lora_json found in execution message");
                }

                // Call original onExecuted if it exists
                return originalOnExecuted?.call(this, message);
            };
        }
    },
});
