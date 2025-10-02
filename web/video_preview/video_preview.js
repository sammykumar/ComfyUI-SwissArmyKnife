/**
 * Video Preview Widget for ComfyUI-SwissArmyKnife
 * Displays video preview for reference_vid input similar to VHS nodes
 */

import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

function addVideoPreviewWidget(node) {
    // Create video element container
    const element = document.createElement("div");
    const previewNode = node;

    // Add DOM widget for video preview
    const previewWidget = node.addDOMWidget("videopreview", "preview", element, {
        serialize: false,
        hideOnZoom: false,
        getValue() {
            return element.value;
        },
        setValue(v) {
            element.value = v;
        },
    });

    // Compute widget size based on video aspect ratio
    previewWidget.computeSize = function (width) {
        if (this.aspectRatio && !this.parentEl.hidden) {
            let height = (previewNode.size[0] - 20) / this.aspectRatio + 10;
            if (!(height > 0)) {
                height = 0;
            }
            this.computedHeight = height + 10;
            return [width, height];
        }
        return [width, -4]; // No loaded src, widget should not display
    };

    // Prevent context menu on video element
    element.addEventListener(
        "contextmenu",
        (e) => {
            e.preventDefault();
            return app.canvas._mousedown_callback(e);
        },
        true
    );

    // Create video element
    previewWidget.videoEl = document.createElement("video");
    previewWidget.videoEl.controls = true;
    previewWidget.videoEl.loop = true;
    previewWidget.videoEl.muted = true;
    previewWidget.videoEl.style["width"] = "100%";
    previewWidget.videoEl.className = "vhs_preview";
    previewWidget.videoEl.hidden = true;

    // Handle video loaded event
    previewWidget.videoEl.addEventListener("loadedmetadata", () => {
        previewWidget.aspectRatio =
            previewWidget.videoEl.videoWidth / previewWidget.videoEl.videoHeight;
        node.setSize(node.computeSize());
    });

    // Handle video error event
    previewWidget.videoEl.addEventListener("error", () => {
        previewWidget.parentEl.hidden = true;
        node.setSize(node.computeSize());
    });

    // Mute/unmute on hover
    previewWidget.videoEl.onmouseenter = () => {
        previewWidget.videoEl.muted = previewWidget.value?.muted ?? true;
    };

    previewWidget.videoEl.onmouseleave = () => {
        previewWidget.videoEl.muted = true;
    };

    // Append video element to parent
    previewWidget.parentEl.appendChild(previewWidget.videoEl);

    // Initialize widget value
    if (typeof previewWidget.value !== "object") {
        previewWidget.value = { hidden: false, paused: false, muted: true };
    }

    // Update video source based on parameters
    let timeout = null;
    node.updateParameters = (params, force_update) => {
        if (!previewWidget.value.params) {
            previewWidget.value.params = {};
        }
        Object.assign(previewWidget.value.params, params);

        if (timeout) {
            clearTimeout(timeout);
        }

        if (force_update) {
            previewWidget.updateSource();
        } else {
            timeout = setTimeout(() => previewWidget.updateSource(), 100);
        }
    };

    previewWidget.updateSource = function () {
        if (!this.value.params?.filename) {
            return;
        }

        const params = { ...this.value.params };
        params.timestamp = Date.now();

        this.parentEl.hidden = this.value.hidden;

        // Show video preview
        if (params.format?.split("/")[0] === "video" || params.format?.split("/")[0] === "image") {
            this.videoEl.src = api.apiURL("/view?" + new URLSearchParams(params));
            this.videoEl.hidden = false;
        }
    };

    previewWidget.callback = previewWidget.updateSource;

    return previewWidget;
}

// Register extension
app.registerExtension({
    name: "SwissArmyKnife.VideoPreview",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData?.name === "VideoPreview") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;

            nodeType.prototype.onNodeCreated = function () {
                const r = onNodeCreated?.apply(this, arguments);

                // Add video preview widget
                const previewWidget = addVideoPreviewWidget(this);

                // Handle execution results
                const onExecuted = this.onExecuted;
                this.onExecuted = function (message) {
                    const r = onExecuted?.apply(this, arguments);

                    // Update preview when node executes
                    if (message?.images && message.images.length > 0) {
                        const img = message.images[0];
                        this.updateParameters(
                            {
                                filename: img.filename,
                                subfolder: img.subfolder,
                                type: img.type,
                                format: img.format || "video/mp4",
                            },
                            true
                        );
                    }

                    return r;
                };

                // Add menu options for preview control
                const getExtraMenuOptions = this.getExtraMenuOptions;
                this.getExtraMenuOptions = function (_, options) {
                    getExtraMenuOptions?.apply(this, arguments);

                    const optNew = [];

                    const visDesc = (previewWidget.value.hidden ? "Show" : "Hide") + " preview";
                    optNew.push({
                        content: visDesc,
                        callback: () => {
                            if (!previewWidget.videoEl.hidden && !previewWidget.value.hidden) {
                                previewWidget.videoEl.pause();
                            } else if (
                                previewWidget.value.hidden &&
                                !previewWidget.videoEl.hidden &&
                                !previewWidget.value.paused
                            ) {
                                previewWidget.videoEl.play();
                            }
                            previewWidget.value.hidden = !previewWidget.value.hidden;
                            previewWidget.parentEl.hidden = previewWidget.value.hidden;
                            this.setSize(this.computeSize());
                        },
                    });

                    const muteDesc = (previewWidget.value.muted ? "Unmute" : "Mute") + " Preview";
                    optNew.push({
                        content: muteDesc,
                        callback: () => {
                            previewWidget.value.muted = !previewWidget.value.muted;
                        },
                    });

                    if (options.length > 0 && options[0] != null && optNew.length > 0) {
                        optNew.push(null);
                    }
                    options.unshift(...optNew);
                };

                return r;
            };
        }
    },
});
