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
                window.location.reload();
            }, 2000);
            
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
        /* Swiss Army Knife - Restart Button in Top Bar */
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
    `;

    document.head.appendChild(style);
    debugLog("Restart button styles injected");
}

/**
 * Resource Monitor class - matches Crystools pattern
 */
class SwissArmyKnifeResourceMonitor {
    constructor() {
        this.buttonGroup = null;
    }

    /**
     * Setup function called by ComfyUI extension system
     * This matches the Crystools pattern exactly - using plain DOM
     */
    setup = async () => {
        debugLog("Resource Monitor extension setup started");
        
        // Inject styles first
        injectRestartButtonStyles();
        
        // Create button group DIV (plain DOM, no deprecated imports)
        this.buttonGroup = document.createElement("div");
        this.buttonGroup.id = "swissarmyknife-resource-monitor";
        this.buttonGroup.className = "comfyui-button-group"; // Same class as Crystools
        
        // Add restart button to the button group
        const restartButton = createRestartButton();
        this.buttonGroup.appendChild(restartButton);
        
        // Insert before settingsGroup (same as Crystools: app.menu?.settingsGroup.element.before())
        if (app.menu?.settingsGroup?.element) {
            app.menu.settingsGroup.element.before(this.buttonGroup);
            debugLog("Resource monitor inserted before settings group");
        } else {
            console.error("[SwissArmyKnife][ResourceMonitor] Could not find app.menu.settingsGroup.element");
        }
        
        debugLog("Resource Monitor extension setup completed");
    }
}

// Register extension - instance creation deferred to setup
app.registerExtension({
    name: EXTENSION_NAME,
    setup() {
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
        
        // Insert before settingsGroup (same as Crystools: app.menu?.settingsGroup.element.before())
        if (app.menu?.settingsGroup?.element) {
            app.menu.settingsGroup.element.before(buttonGroup);
            debugLog("Resource monitor inserted before settings group");
        } else {
            console.error("[SwissArmyKnife][ResourceMonitor] Could not find app.menu.settingsGroup.element");
        }
        
        debugLog("Resource Monitor extension setup completed");
    }
});
