// Main entry point for Vue-based ComfyUI components
// @ts-expect-error - This module is provided by ComfyUI at runtime
import { app } from '../../../scripts/app.js';
// @ts-expect-error - This module is provided by ComfyUI at runtime
import { addWidget, ComponentWidgetImpl } from '../../../scripts/domWidget.js';
import type { ComfyApp } from '@comfyorg/comfyui-frontend-types';
import VideoComparisonWidget from './components/VideoComparisonWidget.vue';

const comfyApp: ComfyApp = app;

// Register Vue-based extension
comfyApp.registerExtension({
    name: 'comfyui-swissarmyknife.vue-components',

    async setup() {
        console.log('Vue components for ComfyUI Swiss Army Knife loaded');
    },

    getCustomWidgets(_app) {
        return {
            VIDEO_COMPARISON_WIDGET(node: any) {
                const inputSpec = {
                    name: 'video_widget',
                    type: 'video-widget',
                };

                const widget = new ComponentWidgetImpl({
                    node,
                    name: inputSpec.name,
                    component: VideoComparisonWidget,
                    inputSpec,
                    options: {},
                });

                addWidget(node, widget);
                return { widget };
            },
        };
    },

    nodeCreated(_node) {
        // Handle node creation events
        // Example: Adjust node size for Vue components
    },
});

export { comfyApp };
