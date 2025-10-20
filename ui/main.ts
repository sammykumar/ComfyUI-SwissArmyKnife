// @ts-expect-error - ComfyUI runtime module, provided at runtime
import { app } from '../../../../scripts/app.js';
// @ts-expect-error - ComfyUI runtime module, provided at runtime
import { api } from '../../../../scripts/api.js';

import { ComfyApp } from '@comfyorg/comfyui-frontend-types';

import VueExampleComponent from '@/components/VueExampleComponent.vue';

// Globals
const comfyApp: ComfyApp = app;
let latestPromptBreakdown: any = null; //Storing latest prompt breakdown data globally

// Listen for workflow execution start
api.addEventListener('execution_start', (event: any) => {
    console.log('workflow started', event);
});

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
    async setup() {
        console.log('Swiss-Army-Knife Vue Basic Extension Loaded');
    },
    nodeCreated(node) {
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
