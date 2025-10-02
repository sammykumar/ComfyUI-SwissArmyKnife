/**
 * Video Preview Widget for ComfyUI-SwissArmyKnife
 * Displays video preview for reference_vid input similar to VHS nodes
 */

import { app as app$2 } from "/scripts/app.js";
import { api } from "/scripts/api.js";

// DEBUG mode - will be loaded from server config
let DEBUG_ENABLED = false;

// Conditional logging wrapper
const debugLog = (...args) => {
    if (DEBUG_ENABLED) {
        console.log("[VideoPreview]", ...args);
    }
};

// Load DEBUG setting from server
async function loadDebugConfig() {
    try {
        const response = await fetch("/swissarmyknife/config");
        if (response.ok) {
            const config = await response.json();
            DEBUG_ENABLED = config.debug || false;
            console.log(`Video Preview Debug Mode: ${DEBUG_ENABLED ? "ENABLED" : "DISABLED"}`);
        } else {
            console.warn(
                "Failed to load Swiss Army Knife config for video preview, defaulting to DEBUG=false"
            );
        }
    } catch (error) {
        console.warn("Error loading Swiss Army Knife config for video preview:", error);
    }
}

// Load config immediately
loadDebugConfig();

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

                // --- 2) Build the main wrapper container
                const wrapper = document.createElement("div");
                wrapper.style.display = "flex";
                wrapper.style.flexDirection = "column";
                wrapper.style.width = "100%";
                wrapper.style.height = "100%";
                wrapper.style.marginTop = "5px";
                wrapper.style.gap = "8px";

                // --- 3) Build the media controls section
                const controlsDiv = document.createElement("div");
                controlsDiv.className = "swiss-knife-video-controls";
                controlsDiv.style.display = "flex";
                controlsDiv.style.gap = "8px";
                controlsDiv.style.padding = "8px";
                controlsDiv.style.background = "var(--comfy-menu-bg)";
                controlsDiv.style.border = "1px solid var(--border-color)";
                controlsDiv.style.borderRadius = "8px";
                controlsDiv.style.alignItems = "center";

                // Play/Pause All button
                const playPauseBtn = document.createElement("button");
                playPauseBtn.textContent = "▶️ Play All";
                playPauseBtn.style.padding = "6px 12px";
                playPauseBtn.style.cursor = "pointer";
                playPauseBtn.style.background = "var(--comfy-input-bg)";
                playPauseBtn.style.color = "var(--fg-color)";
                playPauseBtn.style.border = "1px solid var(--border-color)";
                playPauseBtn.style.borderRadius = "4px";

                // Sync button
                const syncBtn = document.createElement("button");
                syncBtn.textContent = "🔄 Sync";
                syncBtn.style.padding = "6px 12px";
                syncBtn.style.cursor = "pointer";
                syncBtn.style.background = "var(--comfy-input-bg)";
                syncBtn.style.color = "var(--fg-color)";
                syncBtn.style.border = "1px solid var(--border-color)";
                syncBtn.style.borderRadius = "4px";

                // Mute/Unmute All button
                const muteBtn = document.createElement("button");
                muteBtn.textContent = "🔇 Mute All";
                muteBtn.style.padding = "6px 12px";
                muteBtn.style.cursor = "pointer";
                muteBtn.style.background = "var(--comfy-input-bg)";
                muteBtn.style.color = "var(--fg-color)";
                muteBtn.style.border = "1px solid var(--border-color)";
                muteBtn.style.borderRadius = "4px";

                controlsDiv.appendChild(playPauseBtn);
                controlsDiv.appendChild(syncBtn);
                controlsDiv.appendChild(muteBtn);

                // --- 3b) Build the timeline scrubber section
                const timelineDiv = document.createElement("div");
                timelineDiv.className = "swiss-knife-video-timeline";
                timelineDiv.style.display = "flex";
                timelineDiv.style.flexDirection = "column";
                timelineDiv.style.gap = "4px";
                timelineDiv.style.padding = "8px";
                timelineDiv.style.background = "var(--comfy-menu-bg)";
                timelineDiv.style.border = "1px solid var(--border-color)";
                timelineDiv.style.borderRadius = "8px";

                // Time display
                const timeDisplay = document.createElement("div");
                timeDisplay.style.display = "flex";
                timeDisplay.style.justifyContent = "space-between";
                timeDisplay.style.fontSize = "12px";
                timeDisplay.style.color = "var(--fg-color)";
                timeDisplay.style.marginBottom = "4px";

                const currentTimeSpan = document.createElement("span");
                currentTimeSpan.textContent = "0:00";
                const durationSpan = document.createElement("span");
                durationSpan.textContent = "0:00";

                timeDisplay.appendChild(currentTimeSpan);
                timeDisplay.appendChild(durationSpan);

                // Timeline scrubber (range input)
                const scrubber = document.createElement("input");
                scrubber.type = "range";
                scrubber.min = "0";
                scrubber.max = "100";
                scrubber.value = "0";
                scrubber.style.width = "100%";
                scrubber.style.cursor = "pointer";
                scrubber.style.accentColor = "var(--comfy-input-bg)";

                timelineDiv.appendChild(timeDisplay);
                timelineDiv.appendChild(scrubber);

                // --- 4) Build the video preview container (3x 9:16 panes)
                const container = document.createElement("div");
                container.style.display = "flex";
                container.style.gap = "10px";
                container.style.width = "100%";
                container.style.flex = "1"; // Take remaining height
                container.style.border = "1px solid var(--border-color)";
                container.style.borderRadius = "8px";
                container.style.overflow = "hidden";
                container.style.background = "var(--comfy-menu-bg)";
                container.style.minHeight = "0"; // Allow flex child to shrink

                // No need for resizeContainer - CSS will handle it automatically
                for (let i = 0; i < 3; i++) {
                    const div = document.createElement("div");
                    div.className = "swiss-knife-video-preview";
                    div.style.flex = "1"; // Each takes equal width
                    div.style.aspectRatio = "9/16"; // Maintains 9:16 ratio
                    div.style.height = "100%"; // Take full container height
                    div.style.display = "flex";
                    div.style.alignItems = "center";
                    div.style.justifyContent = "center";
                    div.style.background = "var(--descrip-bg, #333)";
                    div.style.color = "white";
                    div.style.fontSize = "14px";
                    div.style.position = "relative";
                    div.style.minHeight = "0"; // Allow flex child to shrink

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

                // --- 5) Assemble the wrapper
                wrapper.appendChild(controlsDiv);
                wrapper.appendChild(timelineDiv);
                wrapper.appendChild(container);

                // --- 6) Add DOM widget (doesn't serialize large DOM content)
                // ComfyUI exposes addDOMWidget for mounting real DOM inside nodes.
                const w = this.addDOMWidget?.("preview", "div", wrapper, { serialize: false });

                // store for later resizing and video elements access
                const videoElements = Array.from(container.querySelectorAll("video"));
                const placeholders = Array.from(
                    container.querySelectorAll(".swiss-knife-video-preview > div")
                );
                this.__vp = { container, wrapper, widget: w, videoElements, placeholders };

                // --- 7) Add control button functionality
                let isPlaying = false;
                playPauseBtn.onclick = () => {
                    isPlaying = !isPlaying;
                    videoElements.forEach((video) => {
                        if (isPlaying) {
                            video.play();
                        } else {
                            video.pause();
                        }
                    });
                    playPauseBtn.textContent = isPlaying ? "⏸️ Pause All" : "▶️ Play All";
                };

                syncBtn.onclick = () => {
                    // Sync all videos to the first video's currentTime
                    const firstVideo = videoElements[0];
                    if (firstVideo && firstVideo.src) {
                        const targetTime = firstVideo.currentTime;
                        videoElements.forEach((video, i) => {
                            if (i > 0 && video.src) {
                                video.currentTime = targetTime;
                            }
                        });
                    }
                };

                let isMuted = true; // Videos start muted
                muteBtn.onclick = () => {
                    isMuted = !isMuted;
                    videoElements.forEach((video) => {
                        video.muted = isMuted;
                    });
                    muteBtn.textContent = isMuted ? "🔇 Mute All" : "🔊 Unmute All";
                };

                // --- 7b) Timeline scrubber functionality
                const formatTime = (seconds) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs.toString().padStart(2, "0")}`;
                };

                let isScrubbing = false;

                // Update scrubber position as videos play
                const updateScrubber = () => {
                    if (isScrubbing) return; // Don't update if user is scrubbing

                    const firstVideo = videoElements.find((v) => v.src && !isNaN(v.duration));
                    if (firstVideo) {
                        const percentage = (firstVideo.currentTime / firstVideo.duration) * 100;
                        scrubber.value = percentage.toString();
                        currentTimeSpan.textContent = formatTime(firstVideo.currentTime);
                        durationSpan.textContent = formatTime(firstVideo.duration);
                    }
                };

                // Update all videos when scrubbing
                scrubber.addEventListener("input", () => {
                    isScrubbing = true;
                    const percentage = parseFloat(scrubber.value);

                    videoElements.forEach((video) => {
                        if (video.src && !isNaN(video.duration)) {
                            const newTime = (percentage / 100) * video.duration;
                            video.currentTime = newTime;
                        }
                    });

                    // Update time display
                    const firstVideo = videoElements.find((v) => v.src && !isNaN(v.duration));
                    if (firstVideo) {
                        currentTimeSpan.textContent = formatTime(firstVideo.currentTime);
                    }
                });

                scrubber.addEventListener("change", () => {
                    isScrubbing = false;
                });

                // Listen to timeupdate on all videos to update scrubber
                videoElements.forEach((video) => {
                    video.addEventListener("timeupdate", updateScrubber);
                    video.addEventListener("loadedmetadata", () => {
                        scrubber.max = "100";
                        updateScrubber();
                    });
                });

                // --- 4) Helper function to process and load video paths
                const loadVideoFromPath = (inputName, videoPath, index) => {
                    const video = videoElements[index];
                    const placeholder = placeholders[index];

                    debugLog(`${inputName} raw value:`, videoPath, typeof videoPath);

                    // If videoPath is a string that looks like JSON, parse it
                    if (typeof videoPath === "string" && videoPath.startsWith("[")) {
                        try {
                            videoPath = JSON.parse(videoPath);
                            debugLog(`${inputName} parsed from JSON:`, videoPath);
                        } catch (e) {
                            debugLog(`${inputName} failed to parse JSON:`, e);
                        }
                    }

                    const originalPath = JSON.stringify(videoPath); // For debugging

                    // Handle array format: [false, ["/path/image.png", "/path/video.mp4"]]
                    // or [true, ["/path/image.png", "/path/video.mp4"]]
                    if (Array.isArray(videoPath)) {
                        debugLog(`${inputName} is array:`, videoPath);

                        // Check if it's the format [boolean, [files...]]
                        if (videoPath.length > 1 && Array.isArray(videoPath[1])) {
                            const files = videoPath[1];
                            debugLog(`${inputName} files array:`, files);

                            // Find the .mp4 file
                            const mp4File = files.find((f) => {
                                debugLog(`Checking file:`, f, typeof f);
                                return typeof f === "string" && f.endsWith(".mp4");
                            });

                            if (mp4File) {
                                videoPath = mp4File;
                                debugLog(`${inputName} extracted MP4:`, videoPath);
                            } else {
                                debugLog(`${inputName} no .mp4 found, using last file`);
                                videoPath = files[files.length - 1];
                            }
                        } else if (videoPath.length > 0) {
                            // Simple array of files
                            const mp4File = videoPath.find(
                                (f) => typeof f === "string" && f.endsWith(".mp4")
                            );
                            videoPath = mp4File || videoPath[0];
                        }
                    }

                    if (videoPath && typeof videoPath === "string" && videoPath.trim() !== "") {
                        // Parse the path to extract directory type and filename
                        // Handle multiple possible path prefixes (Docker, local, production, etc.)
                        // Examples:
                        //   /workspace/ComfyUI/output/._00003.mp4
                        //   /comfyui-nvidia/temp/._00001.mp4
                        //   /app/ComfyUI/input/video.mp4
                        let cleanPath = videoPath
                            .replace(/^\/workspace\/ComfyUI\//, "")
                            .replace(/^\/comfyui-nvidia\//, "")
                            .replace(/^\/app\/ComfyUI\//, "")
                            .replace(/^\/ComfyUI\//, "");

                        // Extract type (output, temp, input) and filename
                        const pathParts = cleanPath.split("/");
                        const type = pathParts[0] || "output"; // Default to 'output'
                        const filename = pathParts[pathParts.length - 1];
                        const subfolder = pathParts.slice(1, -1).join("/"); // Everything between type and filename

                        // Construct URL using VHS-style format with /api/view
                        const params = new URLSearchParams({
                            filename: filename,
                            type: type,
                            subfolder: subfolder,
                        });
                        const videoUrl = `/api/view?${params.toString()}`;

                        video.src = videoUrl;
                        video.style.display = "block";
                        if (placeholder) placeholder.style.display = "none";

                        // Autoplay the video when it's loaded
                        video.addEventListener(
                            "loadeddata",
                            function autoplayHandler() {
                                // Get all loaded videos
                                const loadedVideos = videoElements.filter(
                                    (v) => v.src && v.readyState >= 2
                                );

                                debugLog(
                                    `Video loaded for ${inputName}, total loaded: ${loadedVideos.length}`
                                );

                                // Play all loaded videos together
                                loadedVideos.forEach((v) => {
                                    v.play().catch((err) => {
                                        debugLog(`Autoplay prevented:`, err);
                                    });
                                });

                                // Update play/pause button state
                                isPlaying = true;
                                playPauseBtn.textContent = "⏸️ Pause All";

                                // Remove this listener after first load
                                video.removeEventListener("loadeddata", autoplayHandler);
                            },
                            { once: true }
                        );

                        debugLog(
                            `Loaded ${inputName}:`,
                            `\n  Extracted: ${videoPath}`,
                            `\n  Type: ${type}`,
                            `\n  Subfolder: ${subfolder || "(none)"}`,
                            `\n  Filename: ${filename}`,
                            `\n  URL: ${videoUrl}`,
                            `\n  Original: ${originalPath}`
                        );
                    } else {
                        // Clear video if no path
                        video.src = "";
                        video.style.display = "none";
                        if (placeholder) placeholder.style.display = "block";
                        debugLog(`No valid path for ${inputName}, original: ${originalPath}`);
                    }
                };

                // --- 5) Handle execution results to update video previews
                const onExecuted = this.onExecuted;
                this.onExecuted = function (message) {
                    // Call original onExecuted if it exists
                    onExecuted?.apply(this, arguments);

                    // Extract video paths from execution result
                    if (message?.video_paths?.[0]) {
                        const paths = message.video_paths[0];

                        // Map of input names to video element indices
                        const videoMap = {
                            reference_vid: 0,
                            base_vid: 1,
                            upscaled_vid: 2,
                        };

                        debugLog("VideoPreview onExecuted - Processing video paths:", paths);

                        // Update each video element based on the paths received
                        Object.entries(videoMap).forEach(([inputName, index]) => {
                            if (paths[inputName]) {
                                loadVideoFromPath(inputName, paths[inputName], index);
                            }
                        });
                    }
                };

                // --- 6) Listen to progressive execution updates via API events
                // This allows videos to load as soon as they're available, not just at the end
                const progressHandler = (event) => {
                    const { node, output } = event.detail || {};

                    // Check if this event is for our node
                    if (node !== this.id) return;

                    debugLog("VideoPreview progress event:", event.detail);

                    // Handle progressive updates from the node's output
                    if (output?.video_paths?.[0]) {
                        const paths = output.video_paths[0];

                        const videoMap = {
                            reference_vid: 0,
                            base_vid: 1,
                            upscaled_vid: 2,
                        };

                        debugLog(
                            "VideoPreview progress - Loading videos as they become available:",
                            paths
                        );

                        // Load any videos that have paths
                        Object.entries(videoMap).forEach(([inputName, index]) => {
                            if (paths[inputName]) {
                                loadVideoFromPath(inputName, paths[inputName], index);
                            }
                        });
                    }
                };

                // Register the progress handler with ComfyUI's API
                api.addEventListener("executed", progressHandler);

                // Clean up the event listener when the node is removed
                const onRemoved = this.onRemoved;
                this.onRemoved = function () {
                    api.removeEventListener("executed", progressHandler);
                    onRemoved?.apply(this, arguments);
                };

                // --- 7) Initial setup complete
                // Videos will load progressively as they become available via API events
                // CSS aspect-ratio and flexbox handle automatic resizing

                return r;
            };
        }
    },
});
