/**
 * Gemini Util Options Security Extension
 *
 * Prevents API keys from being saved in cleartext to workflow JSON files.
 * The API key widget will only save the placeholder value, not actual API keys.
 */

import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "swiss.army.knife.gemini.options.security",

    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "GeminiUtilOptions") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;

            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Find the gemini_api_key widget and configure secure serialization
                const apiKeyWidget = this.widgets?.find((w) => w.name === "gemini_api_key");
                if (apiKeyWidget) {
                    // Override serialization to prevent saving actual API keys
                    apiKeyWidget.serializeValue = () => {
                        // Only serialize if it's the default placeholder
                        if (
                            apiKeyWidget.value === "YOUR_GEMINI_API_KEY_HERE" ||
                            apiKeyWidget.value === "" ||
                            !apiKeyWidget.value
                        ) {
                            return apiKeyWidget.value;
                        }
                        // Otherwise, don't save actual API key - return placeholder instead
                        console.log(
                            "[SECURITY] Gemini API key not saved to workflow (using placeholder)"
                        );
                        return "YOUR_GEMINI_API_KEY_HERE";
                    };
                }

                return result;
            };
        }
    },
});
