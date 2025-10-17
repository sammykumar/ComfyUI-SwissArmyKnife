/**
 * Gemini Util Options Security Extension
 *
 * NOTE: This extension is no longer needed as of version 2.8.11+
 * The GeminiUtilOptions node now uses ComfyUI settings for API keys instead of text widgets.
 * API keys are stored in ComfyUI settings: swiss_army_knife.gemini.api_key
 *
 * This file is kept for backward compatibility but the extension is disabled.
 */

import { app } from "../../scripts/app.js";

// Extension disabled - no longer needed since we use ComfyUI settings
// app.registerExtension({
//     name: "swiss.army.knife.gemini.options.security",
//     async beforeRegisterNodeDef(nodeType, nodeData, app) {
//         // Security handling no longer needed - API keys are in settings
//     },
// });
