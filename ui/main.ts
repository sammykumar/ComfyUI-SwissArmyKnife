// @ts-expect-error - ComfyUI runtime module, provided at runtime
import { app } from '../../../../scripts/app.js';
import { ComfyApp } from '@comfyorg/comfyui-frontend-types';

import VueExampleComponent from '@/components/VueExampleComponent.vue';

const comfyApp: ComfyApp = app;

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
