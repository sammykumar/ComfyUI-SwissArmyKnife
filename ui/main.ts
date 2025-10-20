// @ts-expect-error - ComfyUI runtime module, provided at runtime
import { app } from '../../../../scripts/app.js';
// @ts-expect-error - ComfyUI runtime module, provided at runtime
import { api } from '../../../../scripts/api.js';

import { ComfyApp } from '@comfyorg/comfyui-frontend-types';

import VueExampleComponent from '@/components/VueExampleComponent.vue';

// Globals
const comfyApp: ComfyApp = app;
let latestPromptBreakdown: any = null; //Storing latest prompt breakdown data globally

comfyApp.registerExtension({
    name: 'vue-basic',
    settings: [
        {
            id: 'Comfy.Frontend.VueBasic.ExampleSetting',
            category: ['Example', 'VueBasic', 'Example'],
            name: 'Vue Basic Example Setting',
            tooltip: 'An example setting for the Vue Basic extension',
            type: 'boolean',
            defaultValue: true,
            experimental: true,
        },
    ],
    setup() {
        console.log('🔧 Setting up vue-basic extension...');
        // Add execution_start listener inside setup() to ensure api is initialized
        api.addEventListener('execution_start', (event: any) => {
            console.log('workflow started', event);
        });
    },
    async beforeRegisterNodeDef(nodeType: any, nodeData: any) {
        // Hook into MediaDescribe node to capture positive_prompt_json
        if (nodeData.name === 'MediaDescribe') {
            const onNodeCreated = nodeType.prototype.onNodeCreated;

            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);

                // Override onExecuted to capture the prompt breakdown data
                const originalOnExecuted = this.onExecuted;
                this.onExecuted = function (message: any) {
                    console.log('📋 MediaDescribe onExecuted called:', message);

                    // Check for prompt_breakdown (JSON format)
                    if (
                        message &&
                        message.prompt_breakdown &&
                        Array.isArray(message.prompt_breakdown)
                    ) {
                        latestPromptBreakdown = message.prompt_breakdown[0]; // First element is the JSON string
                        console.log(
                            '📋 Captured positive_prompt_json from MediaDescribe:',
                            latestPromptBreakdown,
                        );
                    }
                    // Fallback: check raw_data
                    else if (
                        message &&
                        message.raw_data &&
                        Array.isArray(message.raw_data)
                    ) {
                        latestPromptBreakdown = message.raw_data[0];
                        console.log(
                            '📋 Captured raw_data from MediaDescribe:',
                            latestPromptBreakdown,
                        );
                    }

                    // Call original handler
                    return originalOnExecuted?.call(this, message);
                };

                return result;
            };
        }
    },
    async nodeCreated(node: any) {
        // Hook into existing MediaDescribe nodes (e.g., from loaded workflows)
        if (node.type === 'MediaDescribe') {
            console.log(
                '📋 Hooking into existing MediaDescribe node:',
                node.id,
            );

            const originalOnExecuted = node.onExecuted;
            node.onExecuted = function (message: any) {
                console.log(
                    '📋 MediaDescribe onExecuted called (existing node):',
                    message,
                );

                // Check for prompt_breakdown (JSON format)
                if (
                    message &&
                    message.prompt_breakdown &&
                    Array.isArray(message.prompt_breakdown)
                ) {
                    latestPromptBreakdown = message.prompt_breakdown[0]; // First element is the JSON string
                    console.log(
                        '📋 Captured positive_prompt_json from MediaDescribe:',
                        latestPromptBreakdown,
                    );
                }
                // Fallback: check raw_data
                else if (
                    message &&
                    message.raw_data &&
                    Array.isArray(message.raw_data)
                ) {
                    latestPromptBreakdown = message.raw_data[0];
                    console.log(
                        '📋 Captured raw_data from MediaDescribe:',
                        latestPromptBreakdown,
                    );
                }

                // Call original handler
                return originalOnExecuted?.call(this, message);
            };
        }

        // Handle vue-basic nodes
        // @ts-expect-error - comfyClass is a ComfyUI-specific property added at runtime
        if (node.constructor.comfyClass !== 'vue-basic') return;

        const [oldWidth, oldHeight] = node.size;

        node.setSize([Math.max(oldWidth, 300), Math.max(oldHeight, 520)]);
    },
});

comfyApp.extensionManager.registerSidebarTab({
    id: 'sak.prompt.sidebar',
    icon: 'mdi mdi-subtitles',
    title: 'Prompt Viewer',
    tooltip: 'View prompt breakdown',
    type: 'custom',
    render: (el) => {
        el.innerHTML = '<div>This is my custom sidebar content</div>';
    },
});
