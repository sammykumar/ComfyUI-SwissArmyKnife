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
    button.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
    `;
    button.title = "Restart ComfyUI Server";
    
    // Add click handler with restart functionality
    button.addEventListener("click", async () => {
        debugLog("Restart button clicked");
        
        try {
            debugLog("Sending restart request...");
            
            // Disable button to prevent double-clicks and show loading state
            button.disabled = true;
            button.style.opacity = "0.6";
            button.title = "Restarting...";
            
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
 * Creates the profiler button element
 */
function createProfilerButton() {
    debugLog("Creating profiler button");

    const button = document.createElement("button");
    button.id = "swissarmyknife-profiler-button";
    button.className = "comfyui-button";
    button.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
    `;
    button.title = "View Workflow Profiler";
    
    // Create popup container
    const popup = createProfilerPopup();
    button._profilerPopup = popup;
    button._profilerData = null;
    
    // Add click handler to toggle popup
    button.addEventListener("click", async (e) => {
        e.stopPropagation();
        debugLog("Profiler button clicked");
        
        const isVisible = popup.style.display === "block";
        
        if (!isVisible) {
            // Always fetch latest data on open
            try {
                debugLog("Fetching profiler data...");
                const response = await fetchWithRetry("/swissarmyknife/profiler/stats");
                const result = await response.json();
                
                debugLog("Profiler data received:", result);
                
                if (result.success && result.data) {
                    button._profilerData = result.data;
                    updateProfilerPopupContent(popup, result.data);
                } else {
                    console.warn("[SwissArmyKnife][Profiler] No data in response:", result);
                }
            } catch (error) {
                console.error("[SwissArmyKnife][Profiler] Error fetching profiler data:", error);
            }
            
            // Position and show popup above the profiler button
            const rect = button.getBoundingClientRect();
            const actionButtonsRect = document.getElementById("swissarmyknife-action-buttons").getBoundingClientRect();
            
            popup.style.left = `${actionButtonsRect.left + actionButtonsRect.width / 2}px`;
            popup.style.bottom = `${window.innerHeight - actionButtonsRect.top + 12}px`;
            popup.style.display = "block";
            
            debugLog("Profiler popup opened");
        } else {
            popup.style.display = "none";
            debugLog("Profiler popup closed");
        }
    });
    
    // Close popup when clicking outside
    document.addEventListener("click", (e) => {
        if (popup.style.display === "block" && 
            !popup.contains(e.target) && 
            !button.contains(e.target)) {
            popup.style.display = "none";
        }
    });
    
    // Append popup to body
    document.body.appendChild(popup);

    return button;
}

/**
 * Injects CSS styles for the resource monitor (restart button + profiler)
 */
function injectResourceMonitorStyles() {
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
            justify-content: center;
            padding: 0 1rem;
            height: 100%;
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

        /* Profiler Button */
        #swissarmyknife-profiler-button {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 1rem;
            height: 100%;
            background-color: rgba(99, 102, 241, 0.8);
            color: white;
            font-size: 1.25rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        #swissarmyknife-profiler-button::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            height: 2rem;
            width: 1px;
            background-color: rgba(255, 255, 255, 0.1);
        }

        #swissarmyknife-profiler-button:hover {
            background-color: rgba(79, 70, 229, 0.9);
        }

        #swissarmyknife-profiler-button:active {
            background-color: rgba(67, 56, 202, 1);
        }

        /* Profiler Popup */
        #swissarmyknife-profiler-popup {
            position: fixed;
            display: none;
            width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            background-color: rgba(0, 0, 0, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            transform: translateX(-50%);
            padding: 1.5rem;
        }

        /* Arrow pointer for popup */
        #swissarmyknife-profiler-popup::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(0, 0, 0, 0.85);
        }

        /* Popup Header */
        .profiler-popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }

        .profiler-popup-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: white;
        }

        .profiler-popup-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1.25rem;
            line-height: 1;
            transition: all 0.2s ease;
        }

        .profiler-popup-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* Progress Gauge */
        .profiler-gauge-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
        }

        .profiler-gauge-svg {
            width: 120px;
            height: 120px;
            transform: rotate(-90deg);
        }

        .profiler-gauge-circle-bg {
            fill: none;
            stroke: rgba(255, 255, 255, 0.1);
            stroke-width: 8;
        }

        .profiler-gauge-circle-progress {
            fill: none;
            stroke: #fbbf24;
            stroke-width: 8;
            stroke-linecap: round;
            transition: stroke-dashoffset 0.5s ease;
        }

        .profiler-gauge-text {
            position: absolute;
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
        }

        .profiler-gauge-label {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.6);
        }

        /* Stats Grid */
        .profiler-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }

        .profiler-stat-card {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 0.75rem;
            transition: all 0.2s ease;
        }

        .profiler-stat-card:hover {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .profiler-stat-label {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 0.25rem;
        }

        .profiler-stat-value {
            font-size: 1.125rem;
            font-weight: 700;
            color: white;
        }

        .profiler-stat-icon {
            margin-right: 0.25rem;
        }

        /* Node Table */
        .profiler-node-table-container {
            margin-bottom: 1rem;
        }

        .profiler-node-table-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 0.75rem;
        }

        .profiler-node-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.75rem;
        }

        .profiler-node-table th {
            text-align: left;
            padding: 0.5rem;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 600;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
        }

        .profiler-node-table th:hover {
            color: rgba(255, 255, 255, 0.9);
        }

        .profiler-node-table td {
            padding: 0.5rem;
            color: rgba(255, 255, 255, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .profiler-node-table tr:hover {
            background: rgba(255, 255, 255, 0.05);
        }

        .profiler-cache-icon {
            font-size: 0.875rem;
        }

        /* Footer Actions */
        .profiler-popup-footer {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .profiler-btn {
            flex: 1;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .profiler-btn-primary {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
        }

        .profiler-btn-primary:hover {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }

        .profiler-btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }

        .profiler-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .profiler-btn-danger {
            background: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
        }

        .profiler-btn-danger:hover {
            background: rgba(239, 68, 68, 0.3);
        }

        /* Profiler Modal */
        #swissarmyknife-profiler-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: none;
            z-index: 11000;
            padding: 2rem;
        }

        .profiler-modal-content {
            background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .profiler-modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .profiler-modal-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
        }

        .profiler-modal-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1.5rem;
            line-height: 1;
            transition: all 0.2s ease;
        }

        .profiler-modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* Tabs */
        .profiler-tabs {
            display: flex;
            gap: 0.5rem;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.2);
        }

        .profiler-tab {
            padding: 0.5rem 1rem;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 600;
            cursor: pointer;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
        }

        .profiler-tab:hover {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.9);
        }

        .profiler-tab.active {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
        }

        .profiler-tab-content {
            flex: 1;
            padding: 1.5rem;
            overflow-y: auto;
        }

        .profiler-tab-panel {
            display: none;
        }

        .profiler-tab-panel.active {
            display: block;
        }

        /* Action Button Group - Separate floating container for Profiler and Restart */
        #swissarmyknife-action-buttons {
            position: fixed;
            bottom: 20px;
            left: calc(63% + 12%);
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
            height: 3rem;
        }

        /* Action buttons - shared styles */
        #swissarmyknife-action-buttons .comfyui-button {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 1rem;
            height: 100%;
            background-color: transparent;
            color: rgba(255, 255, 255, 0.8);
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        #swissarmyknife-action-buttons .comfyui-button svg {
            display: block;
        }

        #swissarmyknife-action-buttons .comfyui-button:hover {
            color: rgba(255, 255, 255, 1);
            background-color: rgba(255, 255, 255, 0.1);
        }

        #swissarmyknife-action-buttons .comfyui-button:active {
            background-color: rgba(255, 255, 255, 0.15);
        }

        #swissarmyknife-action-buttons .comfyui-button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        /* Separator between action buttons */
        #swissarmyknife-action-buttons .comfyui-button:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            height: 2rem;
            width: 1px;
            background-color: rgba(255, 255, 255, 0.1);
        }

        /* Override profiler button styles when in action group */
        #swissarmyknife-action-buttons #swissarmyknife-profiler-button {
            background-color: transparent;
            font-size: 1rem;
        }

        #swissarmyknife-action-buttons #swissarmyknife-profiler-button::before {
            display: none;
        }

        #swissarmyknife-action-buttons #swissarmyknife-profiler-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        #swissarmyknife-action-buttons #swissarmyknife-profiler-button:active {
            background-color: rgba(255, 255, 255, 0.15);
        }

        /* Override restart button styles when in action group */
        #swissarmyknife-action-buttons #swissarmyknife-restart-button {
            background-color: transparent;
        }

        #swissarmyknife-action-buttons #swissarmyknife-restart-button::before {
            display: none;
        }

        #swissarmyknife-action-buttons #swissarmyknife-restart-button:hover {
            background-color: rgba(220, 53, 69, 0.2);
            color: rgba(255, 255, 255, 1);
        }

        #swissarmyknife-action-buttons #swissarmyknife-restart-button:active {
            background-color: rgba(220, 53, 69, 0.3);
        }
    `;

    document.head.appendChild(style);
    debugLog("Resource monitor styles injected");
}

/**
 * Fetch with retry logic
 */
async function fetchWithRetry(url, maxAttempts = 3) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return response;
            }
        } catch (error) {
            if (i < maxAttempts - 1) {
                await new Promise(r => setTimeout(r, 100 * Math.pow(2, i)));
                continue;
            }
            throw error;
        }
    }
    throw new Error(`Failed to fetch ${url} after ${maxAttempts} attempts`);
}

/**
 * Format milliseconds to readable string
 */
function formatMs(ms) {
    if (ms === null || ms === undefined) return "N/A";
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (bytes === null || bytes === undefined) return "N/A";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Create profiler popup
 */
function createProfilerPopup() {
    const popup = document.createElement("div");
    popup.id = "swissarmyknife-profiler-popup";
    
    popup.innerHTML = `
        <div class="profiler-popup-header">
            <div class="profiler-popup-title">Workflow Profiler</div>
            <button class="profiler-popup-close">✕</button>
        </div>
        
        <div class="profiler-stats-grid" id="profiler-stats-grid">
            <!-- Stats cards will be inserted here -->
        </div>
        
        <div class="profiler-node-table-container">
            <div class="profiler-node-table-title">Top 10 Slowest Nodes</div>
            <table class="profiler-node-table" id="profiler-node-table">
                <thead>
                    <tr>
                        <th>Node Type</th>
                        <th>Time</th>
                        <th>VRAM</th>
                        <th>Cache</th>
                    </tr>
                </thead>
                <tbody id="profiler-node-table-body">
                    <tr><td colspan="4" style="text-align: center; padding: 1rem;">No data available</td></tr>
                </tbody>
            </table>
        </div>
        
        <div class="profiler-popup-footer">
            <button class="profiler-btn profiler-btn-primary" id="profiler-view-full">View Full History</button>
            <button class="profiler-btn profiler-btn-danger" id="profiler-clear-history">Clear History</button>
        </div>
    `;
    
    // Close button handler
    popup.querySelector(".profiler-popup-close").addEventListener("click", (e) => {
        e.stopPropagation();
        popup.style.display = "none";
    });
    
    // View Full History button handler
    popup.querySelector("#profiler-view-full").addEventListener("click", (e) => {
        e.stopPropagation();
        openProfilerModal();
    });
    
    // Clear History button handler
    popup.querySelector("#profiler-clear-history").addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to clear profiler history?")) {
            try {
                await fetch("/swissarmyknife/profiler/archive", { method: "POST" });
                if (app.extensionManager?.toast?.add) {
                    app.extensionManager.toast.add({
                        severity: "success",
                        summary: "History Cleared",
                        detail: "Profiler history has been archived",
                        life: 3000,
                    });
                }
                // Refresh data
                const button = document.getElementById("swissarmyknife-profiler-button");
                if (button) {
                    button._profilerData = null;
                }
            } catch (error) {
                console.error("[SwissArmyKnife][Profiler] Error clearing history:", error);
            }
        }
    });
    
    return popup;
}

/**
 * Update profiler popup content with latest data
 */
function updateProfilerPopupContent(popup, data) {
    debugLog("Updating profiler popup content", data);
    
    if (!data || !data.latest) {
        return;
    }
    
    const latest = data.latest;
    
    // Update stats grid
    const statsGrid = popup.querySelector("#profiler-stats-grid");
    statsGrid.innerHTML = `
        <div class="profiler-stat-card">
            <div class="profiler-stat-label">⏱️ Total Time</div>
            <div class="profiler-stat-value">${formatMs(latest.executionTime)}</div>
        </div>
        <div class="profiler-stat-card">
            <div class="profiler-stat-label">🎮 VRAM Peak</div>
            <div class="profiler-stat-value">${formatBytes(latest.totalVramPeak)}</div>
        </div>
        <div class="profiler-stat-card">
            <div class="profiler-stat-label">💾 RAM Peak</div>
            <div class="profiler-stat-value">${formatBytes(latest.totalRamPeak)}</div>
        </div>
        <div class="profiler-stat-card">
            <div class="profiler-stat-label">✅ Cache Hits</div>
            <div class="profiler-stat-value">${latest.cacheHits}</div>
        </div>
        <div class="profiler-stat-card">
            <div class="profiler-stat-label">⚡ Executed</div>
            <div class="profiler-stat-value">${latest.cacheMisses}</div>
        </div>
        <div class="profiler-stat-card">
            <div class="profiler-stat-label">📦 Total Nodes</div>
            <div class="profiler-stat-value">${latest.cacheHits + latest.cacheMisses}</div>
        </div>
    `;
    
    // Update node table (top 10 slowest)
    const tbody = popup.querySelector("#profiler-node-table-body");
    
    if (latest.nodes && Object.keys(latest.nodes).length > 0) {
        const nodeArray = Object.values(latest.nodes)
            .filter(n => n.executionTime !== null)
            .sort((a, b) => (b.executionTime || 0) - (a.executionTime || 0))
            .slice(0, 10);
        
        if (nodeArray.length > 0) {
            tbody.innerHTML = nodeArray.map(node => `
                <tr>
                    <td>${node.nodeType}</td>
                    <td>${formatMs(node.executionTime)}</td>
                    <td>${formatBytes(node.vramDelta)}</td>
                    <td class="profiler-cache-icon">${node.cacheHit ? '🟢' : '⚡'}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 1rem;">No executed nodes in latest workflow</td></tr>';
        }
    } else {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 1rem;">No node data available</td></tr>';
    }
}

/**
 * Open profiler modal with full details
 */
function openProfilerModal() {
    debugLog("Opening profiler modal");
    
    // Create modal if it doesn't exist
    let modal = document.getElementById("swissarmyknife-profiler-modal");
    if (!modal) {
        modal = createProfilerModal();
        document.body.appendChild(modal);
    }
    
    modal.style.display = "block";
    
    // Fetch latest data
    fetchProfilerDataForModal();
}

/**
 * Create profiler modal
 */
function createProfilerModal() {
    const modal = document.createElement("div");
    modal.id = "swissarmyknife-profiler-modal";
    
    modal.innerHTML = `
        <div class="profiler-modal-content">
            <div class="profiler-modal-header">
                <div class="profiler-modal-title">📊 Workflow Profiler</div>
                <button class="profiler-modal-close">✕</button>
            </div>
            
            <div class="profiler-tabs">
                <button class="profiler-tab active" data-tab="latest">📊 Latest Run</button>
                <button class="profiler-tab" data-tab="previous">📈 Previous Runs</button>
                <button class="profiler-tab" data-tab="analytics">🔍 Node Analytics</button>
                <button class="profiler-tab" data-tab="settings">⚙️ Settings</button>
            </div>
            
            <div class="profiler-tab-content">
                <div class="profiler-tab-panel active" id="profiler-tab-latest">
                    <h3>Latest Workflow Execution</h3>
                    <div id="profiler-latest-content">Loading...</div>
                </div>
                
                <div class="profiler-tab-panel" id="profiler-tab-previous">
                    <h3>Previous Workflow Runs</h3>
                    <div id="profiler-previous-content">Loading...</div>
                </div>
                
                <div class="profiler-tab-panel" id="profiler-tab-analytics">
                    <h3>Node Performance Analytics</h3>
                    <div id="profiler-analytics-content">Loading...</div>
                </div>
                
                <div class="profiler-tab-panel" id="profiler-tab-settings">
                    <h3>Profiler Settings</h3>
                    <div id="profiler-settings-content">Loading...</div>
                </div>
            </div>
        </div>
    `;
    
    // Close button
    modal.querySelector(".profiler-modal-close").addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    // Tab switching
    modal.querySelectorAll(".profiler-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            const tabId = tab.dataset.tab;
            
            // Update active tab
            modal.querySelectorAll(".profiler-tab").forEach(t => t.classList.remove("active"));
            modal.querySelectorAll(".profiler-tab-panel").forEach(p => p.classList.remove("active"));
            
            tab.classList.add("active");
            modal.querySelector(`#profiler-tab-${tabId}`).classList.add("active");
        });
    });
    
    // Close on outside click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
    
    return modal;
}

/**
 * Fetch profiler data for modal
 */
async function fetchProfilerDataForModal() {
    try {
        const response = await fetchWithRetry("/swissarmyknife/profiler/stats");
        const result = await response.json();
        
        if (result.success && result.data) {
            updateModalContent(result.data);
        }
    } catch (error) {
        console.error("[SwissArmyKnife][Profiler] Error fetching modal data:", error);
    }
}

/**
 * Update modal content with profiler data
 */
function updateModalContent(data) {
    // TODO: Implement full modal content updates for all tabs
    // For now, show basic data
    
    const latestContent = document.getElementById("profiler-latest-content");
    if (latestContent && data.latest) {
        latestContent.innerHTML = `
            <pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; color: white;">
${JSON.stringify(data.latest, null, 2)}
            </pre>
        `;
    }
    
    const previousContent = document.getElementById("profiler-previous-content");
    if (previousContent && data.history) {
        previousContent.innerHTML = `
            <p style="color: rgba(255,255,255,0.7);">Total workflows: ${data.history.length}</p>
            <pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; max-height: 400px; color: white;">
${JSON.stringify(data.history.slice(0, 10), null, 2)}
            </pre>
        `;
    }
    
    const analyticsContent = document.getElementById("profiler-analytics-content");
    if (analyticsContent && data.node_averages) {
        analyticsContent.innerHTML = `
            <pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; max-height: 400px; color: white;">
${JSON.stringify(data.node_averages, null, 2)}
            </pre>
        `;
    }
    
    const settingsContent = document.getElementById("profiler-settings-content");
    if (settingsContent) {
        settingsContent.innerHTML = `
            <p style="color: rgba(255,255,255,0.7);">Profiler is currently enabled and running.</p>
            <p style="color: rgba(255,255,255,0.5); font-size: 0.875rem;">Settings and archive management coming soon.</p>
        `;
    }
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
        injectResourceMonitorStyles();
        
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
        
        // Append monitors to body as floating element
        document.body.appendChild(buttonGroup);
        debugLog("Resource monitor inserted as floating bar");
        
        // Create separate button group for profiler and restart
        const actionButtonGroup = document.createElement("div");
        actionButtonGroup.id = "swissarmyknife-action-buttons";
        actionButtonGroup.className = "comfyui-button-group";
        
        // Add profiler button
        const profilerButton = createProfilerButton();
        actionButtonGroup.appendChild(profilerButton);
        
        // Add restart button
        const restartButton = createRestartButton();
        actionButtonGroup.appendChild(restartButton);
        
        // Append action buttons to body as separate floating element
        document.body.appendChild(actionButtonGroup);
        debugLog("Action buttons inserted as separate floating bar");
        
        // Listen for monitor updates via WebSocket
        api.addEventListener("swissarmyknife.monitor", (event) => {
            handleMonitorUpdate(event.detail);
        });
        
        // Listen for profiler updates via WebSocket
        api.addEventListener("swissarmyknife.profiler", (event) => {
            debugLog("Profiler update received", event.detail);
            
            // Update cached data
            if (profilerButton._profilerData) {
                profilerButton._profilerData = event.detail;
                
                // Update popup if visible
                const popup = profilerButton._profilerPopup;
                if (popup && popup.style.display === "block") {
                    updateProfilerPopupContent(popup, event.detail);
                }
            }
        });
        
        // Listen for ComfyUI executed events to refresh profiler
        api.addEventListener("executed", () => {
            debugLog("Node executed, refreshing profiler data");
            
            // Refresh profiler data after a short delay to ensure backend has processed
            setTimeout(async () => {
                try {
                    const response = await fetchWithRetry("/swissarmyknife/profiler/stats");
                    const result = await response.json();
                    
                    if (result.success && result.data) {
                        profilerButton._profilerData = result.data;
                        
                        // Update popup if visible
                        const popup = profilerButton._profilerPopup;
                        if (popup && popup.style.display === "block") {
                            updateProfilerPopupContent(popup, result.data);
                        }
                    }
                } catch (error) {
                    debugLog("Error refreshing profiler data:", error);
                }
            }, 500);
        });
        
        debugLog("Resource Monitor extension setup completed");
    }
});
