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
                
                // Give a brief moment for the toast to show, then hard reload
                setTimeout(() => {
                    // Force a hard reload that bypasses the cache
                    // Using multiple approaches for maximum browser compatibility
                    
                    // Method 1: Add cache-busting parameter
                    const url = new URL(window.location.href);
                    url.searchParams.set('_reload', Date.now());
                    
                    // Method 2: Set cache control headers via meta tag
                    const meta = document.createElement('meta');
                    meta.httpEquiv = 'Cache-Control';
                    meta.content = 'no-cache, no-store, must-revalidate';
                    document.head.appendChild(meta);
                    
                    // Method 3: Use location.replace with cache-busting URL
                    window.location.replace(url.href);
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
            
            // Position popup to the left of the action buttons
            const actionButtonsRect = document.getElementById("swissarmyknife-action-buttons").getBoundingClientRect();
            
            popup.style.right = `${window.innerWidth - actionButtonsRect.left + 12}px`;
            popup.style.top = `50%`;
            popup.style.transform = `translateY(-50%)`;
            popup.style.left = 'auto';
            popup.style.bottom = 'auto';
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
 * Loads CSS stylesheet for the resource monitor
 */
function loadResourceMonitorStyles() {
    debugLog("Loading resource monitor stylesheet");

    const linkId = "swissarmyknife-resource-monitor-styles";
    
    // Check if stylesheet already exists
    if (document.getElementById(linkId)) {
        debugLog("Resource monitor stylesheet already loaded");
        return;
    }

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "extensions/ComfyUI-SwissArmyKnife/css/resource-monitor.css";

    document.head.appendChild(link);
    debugLog("Resource monitor stylesheet loaded");
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
 * Create GPU tooltip showing loaded models
 */
function createGPUTooltip(gpuId) {
    const tooltip = document.createElement("div");
    tooltip.className = "swissarmyknife-gpu-tooltip";
    tooltip.id = `swissarmyknife-gpu-tooltip-${gpuId}`;
    tooltip.style.display = "none";
    
    tooltip.innerHTML = `
        <div class="gpu-tooltip-header">GPU ${gpuId}</div>
        <div class="gpu-tooltip-content" id="gpu-tooltip-content-${gpuId}">
            <div class="gpu-tooltip-loading">Loading...</div>
        </div>
    `;
    
    document.body.appendChild(tooltip);
    return tooltip;
}

/**
 * Update GPU tooltip with loaded models data
 */
async function updateGPUTooltip(gpuId, monitorElement) {
    debugLog(`[updateGPUTooltip] Starting update for GPU ${gpuId}`);
    try {
        const response = await fetchWithRetry("/swissarmyknife/profiler/loaded_models", 1);
        debugLog(`[updateGPUTooltip] Response status: ${response.status} ${response.ok ? 'OK' : 'FAILED'}`);
        if (!response.ok) {
            throw new Error("Failed to fetch loaded models");
        }
        
        const result = await response.json();
        debugLog(`[updateGPUTooltip] API response:`, result);
        debugLog(`[updateGPUTooltip] Available GPU IDs:`, Object.keys(result.data || {}));
        if (!result.success || !result.data) {
            debugLog(`[updateGPUTooltip] ❌ Invalid response from API`);
            throw new Error("Invalid response");
        }
        
        const gpuData = result.data[gpuId];
        debugLog(`[updateGPUTooltip] GPU ${gpuId} data:`, gpuData);
        const contentEl = document.getElementById(`gpu-tooltip-content-${gpuId}`);
        
        if (!gpuData || !gpuData.models || gpuData.models.length === 0) {
            debugLog(`[updateGPUTooltip] ⚠️  No models found for GPU ${gpuId}`);
            debugLog(`[updateGPUTooltip]   - gpuData exists: ${!!gpuData}`);
            debugLog(`[updateGPUTooltip]   - models array exists: ${!!(gpuData && gpuData.models)}`);
            debugLog(`[updateGPUTooltip]   - models length: ${gpuData && gpuData.models ? gpuData.models.length : 0}`);
            contentEl.innerHTML = `
                <div class="gpu-tooltip-empty">No models loaded</div>
            `;
            return;
        }
        
        // Sort models by VRAM usage (descending)
        const sortedModels = [...gpuData.models].sort((a, b) => b.vram_mb - a.vram_mb);
        debugLog(`[updateGPUTooltip] ✅ Found ${sortedModels.length} models on GPU ${gpuId}:`);
        sortedModels.forEach((model, idx) => {
            debugLog(`[updateGPUTooltip]   ${idx + 1}. ${model.name} (${model.type}): ${model.vram_mb} MB [${model.class_name}]`);
        });
        
        // Build models list HTML
        let modelsHTML = '<div class="gpu-tooltip-section">📦 Loaded Models:</div>';
        modelsHTML += '<div class="gpu-tooltip-models">';
        
        sortedModels.forEach(model => {
            const icon = getModelIcon(model.type);
            const vramGB = (model.vram_mb / 1024).toFixed(1);
            modelsHTML += `
                <div class="gpu-tooltip-model">
                    <div class="gpu-tooltip-model-info">
                        <span class="gpu-tooltip-model-icon">${icon}</span>
                        <span class="gpu-tooltip-model-name" title="${model.name}">${model.name}</span>
                    </div>
                    <div class="gpu-tooltip-model-vram">${vramGB} GB</div>
                </div>
            `;
        });
        
        modelsHTML += '</div>';
        
        // Add summary
        const totalVRAM = (gpuData.total_vram_mb / 1024).toFixed(1);
        modelsHTML += `
            <div class="gpu-tooltip-summary">
                <div class="gpu-tooltip-summary-item">
                    <span>📊 Total Model VRAM:</span>
                    <span class="gpu-tooltip-summary-value">${totalVRAM} GB</span>
                </div>
                <div class="gpu-tooltip-summary-item">
                    <span>🔢 Model Count:</span>
                    <span class="gpu-tooltip-summary-value">${gpuData.model_count}</span>
                </div>
            </div>
        `;
        
        contentEl.innerHTML = modelsHTML;
        
    } catch (error) {
        debugLog("❌ [updateGPUTooltip] Error updating GPU tooltip:", error);
        debugLog(`[updateGPUTooltip] Error stack:`, error.stack);
        const contentEl = document.getElementById(`gpu-tooltip-content-${gpuId}`);
        if (contentEl) {
            contentEl.innerHTML = `
                <div class="gpu-tooltip-error">Failed to load model data</div>
            `;
        }
    }
}

/**
 * Get icon for model type
 */
function getModelIcon(type) {
    const icons = {
        'checkpoint': '🎨',
        'lora': '🎯',
        'vae': '🔄',
        'controlnet': '🎮',
        'clip': '📝',
        'style': '✨',
        'gligen': '🔮',
        'upscaler': '⬆️',
        'model': '📦'
    };
    return icons[type] || '📦';
}

/**
 * Position tooltip near monitor element
 */
function positionTooltip(tooltip, monitorElement) {
    const rect = monitorElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Position above the monitor element
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
    tooltip.style.bottom = `${window.innerHeight - rect.top + 10}px`;
    tooltip.style.top = 'auto';
}

/**
 * Create a monitor display element with inline label and background bar
 */
function createMonitorDisplay(label, id, enableTooltip = false) {
    const monitor = document.createElement("div");
    monitor.className = "swissarmyknife-monitor";
    monitor.id = `swissarmyknife-monitor-${id}`;
    
    // Background progress bar (absolute positioned)
    const bgBar = document.createElement("div");
    bgBar.className = "swissarmyknife-monitor-bg";
    bgBar.id = `swissarmyknife-monitor-bg-${id}`;
    
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "swissarmyknife-monitor-content";
    
    // Only create label if one is provided
    if (label) {
        const labelEl = document.createElement("span");
        labelEl.className = "swissarmyknife-monitor-label";
        labelEl.textContent = label;
        contentWrapper.appendChild(labelEl);
        contentWrapper.appendChild(document.createTextNode(" "));
        
        // Add tooltip functionality for GPU labels
        if (enableTooltip && id.includes("gpu") && id.includes("-label")) {
            const gpuMatch = id.match(/gpu(\d+)-label/);
            if (gpuMatch) {
                const gpuId = parseInt(gpuMatch[1]);
                const tooltip = createGPUTooltip(gpuId);
                
                // Show tooltip on hover
                monitor.addEventListener("mouseenter", () => {
                    tooltip.style.display = "block";
                    updateGPUTooltip(gpuId, monitor);
                    // Position after a brief delay to allow content to render
                    setTimeout(() => positionTooltip(tooltip, monitor), 50);
                });
                
                monitor.addEventListener("mouseleave", () => {
                    tooltip.style.display = "none";
                });
                
                // Update tooltip position on scroll/resize
                window.addEventListener("scroll", () => {
                    if (tooltip.style.display === "block") {
                        positionTooltip(tooltip, monitor);
                    }
                });
            }
        }
    }
    
    const valueEl = document.createElement("span");
    valueEl.className = "swissarmyknife-monitor-value";
    valueEl.id = `swissarmyknife-monitor-value-${id}`;
    valueEl.textContent = "--";
    
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
            
            // Update GPU label (shows utilization percentage)
            if (device.utilization !== null && device.utilization !== undefined) {
                updateMonitorValue(`gpu${index}-label`, formatPercent(device.utilization), device.utilization);
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
        
        // Load stylesheet first
        loadResourceMonitorStyles();
        
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
                    
                    // Add CPU temp if available
                    if (hardware.cpu_temp !== null) {
                        buttonGroup.appendChild(createMonitorDisplay("", "cpu-temp"));
                    }
                    
                    buttonGroup.appendChild(createMonitorDisplay("RAM", "ram"));
                }
                
                // Add GPU monitors
                if (gpu?.devices && gpu.devices.length > 0) {
                    gpu.devices.forEach((device, index) => {
                        if (!device.available) return;
                        
                        // Extract compact GPU model name
                        const gpuModel = extractGPUModel(device.name);
                        
                        // Add GPU model label with tooltip enabled
                        buttonGroup.appendChild(createMonitorDisplay(gpuModel.toUpperCase(), `gpu${index}-label`, true));
                        
                        // Add VRAM monitor - just the value in GB (no label)
                        buttonGroup.appendChild(createMonitorDisplay("", `vram${index}`));
                        
                        // Add GPU temp if available
                        if (device.temperature !== null && device.temperature !== undefined) {
                            buttonGroup.appendChild(createMonitorDisplay("", `gpu${index}-temp`));
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

        const setExecutionGlowState = (isExecuting) => {
            if (!buttonGroup) {
                return;
            }
            buttonGroup.classList.toggle("swissarmyknife-is-executing", Boolean(isExecuting));
        };

        const clearExecutionGlow = () => setExecutionGlowState(false);

        api.addEventListener("execution_start", () => setExecutionGlowState(true));
        [
            "execution_success",
            "execution_error",
            "execution_cancelled",
            "execution_end",
        ].forEach((eventName) => {
            api.addEventListener(eventName, clearExecutionGlow);
        });
        
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
