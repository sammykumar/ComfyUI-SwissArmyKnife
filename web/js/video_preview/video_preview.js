/**
 * Video Preview Widget for ComfyUI-SwissArmyKnife
 * Displays video preview for reference_vid input similar to VHS nodes
 */

import { app as app$2 } from "/scripts/app.js";

console.log(`Loading video_preview.js extension`);

app$2.registerExtension({
    name: "video_preview",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeType.comfyClass == "VideoPreview") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const r = onNodeCreated?.apply(this, arguments);

                // --- 1) Default node size for 3 videos side-by-side in 9:16 aspect ratio
                // Each video: 9:16 ratio, so if each is ~160px wide, height = 160 * (16/9) = ~284px
                // Total width: 3 * 160 + 2 * 10 (gaps) = 500px content + padding = ~520px
                // Height: 284px + margins/padding = ~320px
                const desired = [520, 800];
                this.setSize?.(desired) || (this.size = desired); // set once when created

                // --- 2) Build the preview DOM container (3x 9:16 panes)
                const container = document.createElement("div");
                container.style.display = "flex";
                container.style.gap = "10px";
                container.style.width = "100%";
                container.style.marginTop = "5px";
                container.style.border = "1px solid var(--border-color)";
                container.style.borderRadius = "8px";
                container.style.overflow = "hidden";
                container.style.background = "var(--comfy-menu-bg)";

                // helper to recompute container height to maintain 9:16 per column
                const resizeContainer = () => {
                    const nodeInnerWidth = (this.size?.[0] ?? 800) - 20; // padding margin for node content
                    const columns = 3;
                    const colW = Math.max((nodeInnerWidth - 10 * (columns - 1)) / columns, 10);
                    const h = Math.round(colW * (16 / 9));
                    container.style.height = `${h}px`;
                };

                for (let i = 0; i < 3; i++) {
                    const div = document.createElement("div");
                    div.className = "swiss-knife-video-preview";
                    div.style.flex = "1";
                    div.style.aspectRatio = "9/16";
                    div.style.display = "flex";
                    div.style.alignItems = "center";
                    div.style.justifyContent = "center";
                    div.style.background = "var(--descrip-bg, #333)";
                    div.style.color = "white";
                    div.style.fontSize = "14px";
                    div.style.position = "relative";

                    // Create video element
                    const video = document.createElement("video");
                    video.style.width = "100%";
                    video.style.height = "100%";
                    video.style.objectFit = "contain";
                    video.controls = true;
                    video.loop = true;
                    video.muted = true;
                    video.style.display = "none"; // Hidden until src is set

                    // Placeholder text
                    const placeholder = document.createElement("div");
                    placeholder.textContent = `Preview ${i + 1}`;
                    placeholder.style.position = "absolute";
                    placeholder.style.top = "50%";
                    placeholder.style.left = "50%";
                    placeholder.style.transform = "translate(-50%, -50%)";

                    div.appendChild(video);
                    div.appendChild(placeholder);
                    container.appendChild(div);
                }

                // --- 3) Add DOM widget (doesn't serialize large DOM content)
                // ComfyUI exposes addDOMWidget for mounting real DOM inside nodes.
                // Docs enumerate addDOMWidget and node methods. :contentReference[oaicite:0]{index=0}
                const w = this.addDOMWidget?.("preview", "div", container, { serialize: false });

                // store for later resizing and video elements access
                const videoElements = Array.from(container.querySelectorAll("video"));
                const placeholders = Array.from(
                    container.querySelectorAll(".swiss-knife-video-preview > div")
                );
                this.__vp = { container, widget: w, resizeContainer, videoElements, placeholders };

                // --- 4) Update video preview when input changes
                const updateVideoPreview = () => {
                    // Find the reference_vid input widget
                    const refVidWidget = this.widgets?.find((w) => w.name === "reference_vid");
                    if (!refVidWidget) return;

                    const videoPath = refVidWidget.value;
                    if (videoPath && videoPath.trim() !== "") {
                        // Update first video element (Preview 1)
                        const video = videoElements[0];
                        const placeholder = placeholders[0];

                        // Construct the video URL - ComfyUI serves files from /view?filename=...
                        // Adjust the path construction based on your ComfyUI setup
                        const videoUrl = `/view?filename=${encodeURIComponent(videoPath)}`;

                        video.src = videoUrl;
                        video.style.display = "block";
                        if (placeholder) placeholder.style.display = "none";
                    } else {
                        // Clear video if no path
                        const video = videoElements[0];
                        const placeholder = placeholders[0];
                        video.src = "";
                        video.style.display = "none";
                        if (placeholder) placeholder.style.display = "block";
                    }
                };

                // Listen for widget value changes
                const originalCallback = this.callback;
                this.callback = function () {
                    updateVideoPreview();
                    return originalCallback?.apply(this, arguments);
                };

                // Also check on initial load
                queueMicrotask(() => {
                    updateVideoPreview();
                    resizeContainer();
                });

                return r;
            };
        }
    },
});
