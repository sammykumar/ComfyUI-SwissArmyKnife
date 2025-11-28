import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

/**
 * Swiss Army Knife - Resource Monitor Extension
 * 
 * This extension adds a resource monitor UI to the ComfyUI top bar,
 * similar to Crystools' resource monitor but integrated with Swiss Army Knife.
 * 
 * Features:
 * - Restart button in the top bar (using ComfyButtonGroup like Crystools)
 * - Future: CPU/RAM/GPU/VRAM monitoring
 */

const EXTENSION_NAME = "comfyui_swissarmyknife.resource_monitor";

// Debug logging
const isDebugEnabled = () => {
    try {
        return app.extensionManager?.setting?.get("SwissArmyKnife.debug_mode") || false;
    } catch (error) {
        return false;
    }
};

const debugLog = (...args) => {
    if (isDebugEnabled()) {
        console.log("[SwissArmyKnife][ResourceMonitor]", ...args);
    }
};

/**
 * Creates the restart button element
 */
function createRestartButton() {
    debugLog("Creating restart button");

    const button = document.createElement("button");
    button.id = "swissarmyknife-restart-button";
    button.className = "comfyui-button";
    button.textContent = "Restart";
    button.title = "Restart ComfyUI Server";
    
    // Add click handler with restart functionality
    button.addEventListener("click", async () => {
        debugLog("Restart button clicked");
        
        try {
            debugLog("Sending restart request...");
            
            // Disable button to prevent double-clicks
            button.disabled = true;
            button.textContent = "Restarting...";
            
            // Show notification immediately
            if (app.extensionManager?.toast?.add) {
                app.extensionManager.toast.add({
                    severity: "warn",
                    summary: "Server Restarting",
                    detail: "Waiting for ComfyUI to become available...",
                    life: 30000, // Keep visible longer during restart
                });
            }
            
            // Call the restart API endpoint
            // Note: The server may terminate before sending a complete response,
            // so we don't rely on the response - just trigger and reload
            fetch("/swissarmyknife/restart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }).catch(() => {
                // Ignore fetch errors - server is restarting
                debugLog("Fetch error (expected - server restarting)");
            });
            
            debugLog("Server restart initiated");
            
            // Wait for initial shutdown (give server time to start shutting down)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Poll for server availability with health check
            const maxAttempts = 60; // Try for up to 60 seconds
            const pollInterval = 1000; // Check every second
            let attempts = 0;
            let serverAvailable = false;
            
            debugLog("Starting health check polling...");
            
            while (attempts < maxAttempts && !serverAvailable) {
                attempts++;
                
                try {
                    // Try to fetch a simple endpoint to check if server is responding
                    const response = await fetch("/system_stats", {
                        method: "GET",
                        cache: "no-cache"
                    });
                    
                    if (response.ok) {
                        debugLog(`Server is available after ${attempts} attempts (${attempts} seconds)`);
                        serverAvailable = true;
                        break;
                    }
                } catch (error) {
                    // Server not ready yet, continue polling
                    if (attempts % 5 === 0) {
                        debugLog(`Health check attempt ${attempts}/${maxAttempts}...`);
                    }
                }
                
                // Wait before next attempt
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            }
            
            if (serverAvailable) {
                debugLog("Server is back online, reloading page...");
                
                if (app.extensionManager?.toast?.add) {
                    app.extensionManager.toast.add({
                        severity: "success",
                        summary: "Server Restarted",
                        detail: "Reloading page now...",
                        life: 2000
                    });
                }
                
                // Give a brief moment for the toast to show, then reload
                setTimeout(() => {
                    window.location.reload(true); // Hard reload (bypass cache)
                }, 500);
            } else {
                debugLog("Server did not become available within timeout");
                
                if (app.extensionManager?.toast?.add) {
                    app.extensionManager.toast.add({
                        severity: "warn",
                        summary: "Server Taking Longer Than Expected",
                        detail: "Please refresh manually if needed",
                        life: 10000
                    });
                }
                
                button.disabled = false;
                button.textContent = "Restart";
            }
            
        } catch (error) {
            console.error("[SwissArmyKnife][ResourceMonitor] Error restarting server:", error);
            button.disabled = false;
            button.textContent = "Restart";
            
            if (app.extensionManager?.toast?.add) {
                app.extensionManager.toast.add({
                    severity: "error",
                    summary: "Restart Failed",
                    detail: error.message,
                    life: 5000
                });
            }
        }
    });

    return button;
}

/**
 * Injects CSS styles for the restart button
 */
function injectRestartButtonStyles() {
    debugLog("Injecting restart button styles");

    const styleId = "swissarmyknife-restart-button-styles";
    
    // Check if styles already exist
    if (document.getElementById(styleId)) {
        debugLog("Restart button styles already exist");
        return;
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
        /* Swiss Army Knife - Resource Monitor Floating Bar */
        #swissarmyknife-resource-monitor {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 0;
            padding: 0;
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            background-color: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 9999px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            z-index: 9999;
            font-size: 0.919rem;
            line-height: 1.313rem;
            font-weight: 500;
        }

        /* Restart Button */
        #swissarmyknife-restart-button {
            position: relative;
            display: flex;
            align-items: center;
            padding-left: 1rem;
            padding-right: 1rem;
            background-color: #dc3545;
            color: white;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        #swissarmyknife-restart-button::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            height: 2rem;
            width: 1px;
            background-color: rgba(255, 255, 255, 0.1);
        }

        #swissarmyknife-restart-button:hover {
            background-color: #c82333;
        }

        #swissarmyknife-restart-button:active {
            background-color: #bd2130;
        }

        #swissarmyknife-restart-button:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
            opacity: 0.6;
        }

        /* Monitor Display - Individual Metrics Container */
        .swissarmyknife-monitor {
            position: relative;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            overflow: hidden;
        }
        
        /* Background Progress Bar - Percentage Reactive */
        .swissarmyknife-monitor-bg {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 0%;
            transition: all 500ms;
            background-color: transparent;
        }
        
        /* Divider - Separator between monitors */
        .swissarmyknife-monitor:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            height: 2rem;
            width: 1px;
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .swissarmyknife-monitor-content {
            position: relative;
            display: flex;
            align-items: baseline;
            gap: 0.5rem;
            white-space: nowrap;
            z-index: 1;
        }
        
        .swissarmyknife-monitor-label {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.875rem;
            line-height: 1.25rem;
        }
        
        .swissarmyknife-monitor-value {
            color: rgb(255, 255, 255);
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            font-size: 0.875rem;
            line-height: 1.25rem;
        }
    `;

    document.head.appendChild(style);
    debugLog("Restart button styles injected");
}

/**
 * Create a monitor display element with inline label and background bar
 */
function createMonitorDisplay(label, id) {
    const monitor = document.createElement("div");
    monitor.className = "swissarmyknife-monitor";
    monitor.id = `swissarmyknife-monitor-${id}`;
    
    // Background progress bar (absolute positioned)
    const bgBar = document.createElement("div");
    bgBar.className = "swissarmyknife-monitor-bg";
    bgBar.id = `swissarmyknife-monitor-bg-${id}`;
    
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "swissarmyknife-monitor-content";
    
    const labelEl = document.createElement("span");
    labelEl.className = "swissarmyknife-monitor-label";
    labelEl.textContent = label;
    
    const valueEl = document.createElement("span");
    valueEl.className = "swissarmyknife-monitor-value";
    valueEl.id = `swissarmyknife-monitor-value-${id}`;
    valueEl.textContent = "--";
    
    contentWrapper.appendChild(labelEl);
    contentWrapper.appendChild(document.createTextNode(" "));
    contentWrapper.appendChild(valueEl);
    
    monitor.appendChild(bgBar);
    monitor.appendChild(contentWrapper);
    
    return monitor;
}

/**
 * Update monitor value with gradient background based on percentage
 */
function updateMonitorValue(id, value, percent = null) {
    const valueEl = document.getElementById(`swissarmyknife-monitor-value-${id}`);
    if (!valueEl) return;
    
    valueEl.textContent = value;
    
    const bgBar = document.getElementById(`swissarmyknife-monitor-bg-${id}`);
    if (!bgBar) return;
    
    // Set gradient background bar based on percentage
    if (percent !== null) {
        // Determine color based on percentage thresholds
        let color;
        if (percent < 40) {
            color = "34, 197, 94"; // Green 0-40%
        } else if (percent < 60) {
            color = "234, 179, 8"; // Yellow 40-60%
        } else if (percent < 80) {
            color = "249, 115, 22"; // Orange 60-80%
        } else {
            color = "239, 68, 68"; // Red 80-100%
        }
        
        // Set width and color
        bgBar.style.width = `${percent}%`;
        bgBar.style.backgroundColor = `rgba(${color}, 0.2)`;
    } else {
        bgBar.style.width = "0%";
        bgBar.style.backgroundColor = "transparent";
    }
}

/**
 * Format bytes to GB
 */
function formatGB(bytes) {
    if (bytes === null || bytes === undefined) return "N/A";
    const gb = bytes / (1024 ** 3);
    return gb.toFixed(1) + " GB";
}

/**
 * Format CPU frequency in GHz
 */
function formatGHz(mhz) {
    if (mhz === null || mhz === undefined) return "N/A";
    const ghz = mhz / 1000;
    return ghz.toFixed(2) + " GHz";
}

/**
 * Format percentage
 */
function formatPercent(percent) {
    if (percent === null || percent === undefined) return "N/A";
    return Math.round(percent) + "%";
}

/**
 * Format temperature
 */
function formatTemp(temp) {
    if (temp === null || temp === undefined) return "N/A";
    return Math.round(temp) + "°";
}

/**
 * Extract compact GPU model name from full GPU name
 * Examples:
 *   "NVIDIA GeForce RTX 3090 Ti" -> "3090Ti"
 *   "NVIDIA GeForce RTX 3080" -> "3080"
 *   "NVIDIA RTX A6000" -> "A6000"
 *   "AMD Radeon RX 7900 XTX" -> "7900XTX"
 */
function extractGPUModel(fullName) {
    if (!fullName) return "GPU";
    
    // Remove common prefixes
    let name = fullName
        .replace(/NVIDIA\s+GeForce\s+/gi, "")
        .replace(/NVIDIA\s+/gi, "")
        .replace(/AMD\s+Radeon\s+/gi, "")
        .replace(/AMD\s+/gi, "")
        .replace(/RTX\s+/gi, "")
        .replace(/GTX\s+/gi, "");
    
    // Extract the model number/name (e.g., "3090 Ti", "A6000", "7900 XTX")
    const match = name.match(/([A-Z]?\d+\s*[A-Za-z]*)/);
    if (match) {
        // Remove spaces and capitalize properly (e.g., "3090 Ti" -> "3090Ti")
        return match[1].replace(/\s+/g, "");
    }
    
    // Fallback to first meaningful word
    const words = name.trim().split(/\s+/);
    return words[0] || "GPU";
}

/**
 * Handle monitor data update
 */
function handleMonitorUpdate(data) {
    debugLog("Monitor update received:", data);
    
    const { hardware, gpu } = data;
    
    // Update CPU - show percentage
    if (hardware?.cpu_percent !== null && hardware?.cpu_percent !== undefined) {
        updateMonitorValue("cpu", formatPercent(hardware.cpu_percent), hardware.cpu_percent);
    }
    
    // Update RAM - show used GB
    if (hardware?.memory) {
        const mem = hardware.memory;
        const value = formatGB(mem.used);
        updateMonitorValue("ram", value, mem.percent);
    }
    
    // Update CPU temperature
    if (hardware?.cpu_temp !== null && hardware?.cpu_temp !== undefined) {
        updateMonitorValue("cpu-temp", formatTemp(hardware.cpu_temp));
    }
    
    // Update GPU info
    if (gpu?.devices && gpu.devices.length > 0) {
        gpu.devices.forEach((device, index) => {
            if (!device.available) return;
            
            // Update GPU utilization
            if (device.utilization !== null && device.utilization !== undefined) {
                updateMonitorValue(`gpu${index}`, formatPercent(device.utilization), device.utilization);
            }
            
            // Update VRAM - show used GB
            if (device.vram) {
                const vram = device.vram;
                const value = formatGB(vram.used);
                updateMonitorValue(`vram${index}`, value, vram.percent);
            }
            
            // Update GPU temperature
            if (device.temperature !== null && device.temperature !== undefined) {
                updateMonitorValue(`gpu${index}-temp`, formatTemp(device.temperature));
            }
        });
    }
}

// Register extension - instance creation deferred to setup
app.registerExtension({
    name: EXTENSION_NAME,
    
    async setup() {
        debugLog("Resource Monitor extension setup started");
        
        // Inject styles first
        injectRestartButtonStyles();
        
        // Create button group DIV (plain DOM, no deprecated imports)
        const buttonGroup = document.createElement("div");
        buttonGroup.id = "swissarmyknife-resource-monitor";
        buttonGroup.className = "comfyui-button-group"; // Same class as Crystools
        
        // Fetch initial status to determine what monitors to create
        try {
            const response = await fetch("/swissarmyknife/monitor/status");
            const result = await response.json();
            
            if (result.success && result.data) {
                const { hardware, gpu } = result.data;
                
                // Add CPU monitor
                if (hardware?.available) {
                    buttonGroup.appendChild(createMonitorDisplay("CPU", "cpu"));
                    buttonGroup.appendChild(createMonitorDisplay("RAM", "ram"));
                    
                    // Add CPU temp if available
                    if (hardware.cpu_temp !== null) {
                        buttonGroup.appendChild(createMonitorDisplay("TEMP", "cpu-temp"));
                    }
                }
                
                // Add GPU monitors
                if (gpu?.devices && gpu.devices.length > 0) {
                    gpu.devices.forEach((device, index) => {
                        if (!device.available) return;
                        
                        // Extract compact GPU model name
                        const gpuModel = extractGPUModel(device.name);
                        
                        // Add VRAM monitor with index
                        buttonGroup.appendChild(createMonitorDisplay(`VRAM ${index}`, `vram${index}`));
                        
                        // Add GPU temp if available - just model name, all caps
                        if (device.temperature !== null && device.temperature !== undefined) {
                            buttonGroup.appendChild(createMonitorDisplay(gpuModel.toUpperCase(), `gpu${index}-temp`));
                        }
                    });
                }
                
                // Update with initial data
                handleMonitorUpdate(result.data);
            }
        } catch (error) {
            console.error("[SwissArmyKnife][ResourceMonitor] Error fetching initial status:", error);
        }
        
        // Add restart button at the end (after monitors)
        const restartButton = createRestartButton();
        buttonGroup.appendChild(restartButton);
        
        // Append to body as floating element
        document.body.appendChild(buttonGroup);
        debugLog("Resource monitor inserted as floating bar");
        
        // Listen for monitor updates via WebSocket
        api.addEventListener("swissarmyknife.monitor", (event) => {
            handleMonitorUpdate(event.detail);
        });
        
        debugLog("Resource Monitor extension setup completed");
    }
});
