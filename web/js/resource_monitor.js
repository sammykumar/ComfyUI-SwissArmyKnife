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
            
            // Show notification immediately
            if (app.extensionManager?.toast?.add) {
                app.extensionManager.toast.add({
                    severity: "warn",
                    summary: "Server Restarting",
                    detail: "ComfyUI server is restarting...",
                    life: 3000,
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
            
            // Wait a moment then try to reconnect
            setTimeout(() => {
                debugLog("Reloading page...");
                window.location.reload(true); // true = hard reload (bypass cache)
            }, 5000);
            
        } catch (error) {
            console.error("[SwissArmyKnife][ResourceMonitor] Error restarting server:", error);
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
        /* Swiss Army Knife - Resource Monitor in Top Bar */
        #swissarmyknife-resource-monitor {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 8px;
        }

        #swissarmyknife-restart-button {
            background-color: #dc3545;
            color: white;
            font-weight: bold;
            border: 1px solid #c82333;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
        }

        #swissarmyknife-restart-button:hover {
            background-color: #c82333;
            border-color: #bd2130;
        }

        #swissarmyknife-restart-button:active {
            background-color: #bd2130;
            border-color: #b21f2d;
            transform: scale(0.98);
        }

        #swissarmyknife-restart-button:disabled {
            background-color: #6c757d;
            border-color: #5a6268;
            cursor: not-allowed;
            opacity: 0.6;
        }

        /* Monitor Display */
        .swissarmyknife-monitor {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 4px 8px;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            min-width: 60px;
        }
        
        .swissarmyknife-monitor-label {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 2px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .swissarmyknife-monitor-value {
            font-size: 13px;
            font-weight: 600;
            color: #ffffff;
            transition: color 0.3s ease;
        }
        
        /* Color coding for resource levels */
        .swissarmyknife-monitor-value.level-low {
            color: #28a745; /* Green - healthy */
        }
        
        .swissarmyknife-monitor-value.level-medium {
            color: #ffc107; /* Yellow - moderate */
        }
        
        .swissarmyknife-monitor-value.level-high {
            color: #fd7e14; /* Orange - high */
        }
        
        .swissarmyknife-monitor-value.level-critical {
            color: #dc3545; /* Red - critical */
        }
    `;

    document.head.appendChild(style);
    debugLog("Restart button styles injected");
}

/**
 * Create a monitor display element
 */
function createMonitorDisplay(label, id) {
    const monitor = document.createElement("div");
    monitor.className = "swissarmyknife-monitor";
    monitor.id = `swissarmyknife-monitor-${id}`;
    
    const labelEl = document.createElement("div");
    labelEl.className = "swissarmyknife-monitor-label";
    labelEl.textContent = label;
    
    const valueEl = document.createElement("div");
    valueEl.className = "swissarmyknife-monitor-value";
    valueEl.id = `swissarmyknife-monitor-value-${id}`;
    valueEl.textContent = "--";
    
    monitor.appendChild(labelEl);
    monitor.appendChild(valueEl);
    
    return monitor;
}

/**
 * Update monitor value with color coding based on percentage
 */
function updateMonitorValue(id, value, percent = null) {
    const valueEl = document.getElementById(`swissarmyknife-monitor-value-${id}`);
    if (!valueEl) return;
    
    valueEl.textContent = value;
    
    // Color code based on percentage if provided
    if (percent !== null) {
        valueEl.classList.remove("level-low", "level-medium", "level-high", "level-critical");
        
        if (percent < 50) {
            valueEl.classList.add("level-low");
        } else if (percent < 70) {
            valueEl.classList.add("level-medium");
        } else if (percent < 90) {
            valueEl.classList.add("level-high");
        } else {
            valueEl.classList.add("level-critical");
        }
    }
}

/**
 * Format bytes to GB
 */
function formatGB(bytes) {
    if (bytes === null || bytes === undefined) return "N/A";
    const gb = bytes / (1024 ** 3);
    return gb.toFixed(1) + "GB";
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
 * Handle monitor data update
 */
function handleMonitorUpdate(data) {
    debugLog("Monitor update received:", data);
    
    const { hardware, gpu } = data;
    
    // Update CPU
    if (hardware?.cpu_percent !== null && hardware?.cpu_percent !== undefined) {
        updateMonitorValue("cpu", formatPercent(hardware.cpu_percent), hardware.cpu_percent);
    }
    
    // Update RAM
    if (hardware?.memory) {
        const mem = hardware.memory;
        const value = `${formatPercent(mem.percent)}`;
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
            
            // Update VRAM
            if (device.vram) {
                const vram = device.vram;
                const value = `${formatPercent(vram.percent)}`;
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
        
        // Add restart button to the button group
        const restartButton = createRestartButton();
        buttonGroup.appendChild(restartButton);
        
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
                        buttonGroup.appendChild(createMonitorDisplay("Temp", "cpu-temp"));
                    }
                }
                
                // Add GPU monitors
                if (gpu?.devices && gpu.devices.length > 0) {
                    gpu.devices.forEach((device, index) => {
                        if (!device.available) return;
                        
                        // Add GPU utilization monitor if pynvml available
                        if (gpu.pynvml_available) {
                            buttonGroup.appendChild(createMonitorDisplay(`GPU ${index}`, `gpu${index}`));
                        }
                        
                        // Add VRAM monitor
                        buttonGroup.appendChild(createMonitorDisplay(`VRAM ${index}`, `vram${index}`));
                        
                        // Add GPU temp if available
                        if (device.temperature !== null && device.temperature !== undefined) {
                            buttonGroup.appendChild(createMonitorDisplay(`Temp ${index}`, `gpu${index}-temp`));
                        }
                    });
                }
                
                // Update with initial data
                handleMonitorUpdate(result.data);
            }
        } catch (error) {
            console.error("[SwissArmyKnife][ResourceMonitor] Error fetching initial status:", error);
        }
        
        // Insert before settingsGroup (same as Crystools: app.menu?.settingsGroup.element.before())
        if (app.menu?.settingsGroup?.element) {
            app.menu.settingsGroup.element.before(buttonGroup);
            debugLog("Resource monitor inserted before settings group");
        } else {
            console.error("[SwissArmyKnife][ResourceMonitor] Could not find app.menu.settingsGroup.element");
        }
        
        // Listen for monitor updates via WebSocket
        api.addEventListener("swissarmyknife.monitor", (event) => {
            handleMonitorUpdate(event.detail);
        });
        
        debugLog("Resource Monitor extension setup completed");
    }
});
