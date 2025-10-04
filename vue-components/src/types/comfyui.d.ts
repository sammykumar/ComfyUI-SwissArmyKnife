// Global type declarations for ComfyUI integration
import type { ComfyApp } from '@comfyorg/comfyui-frontend-types';

declare global {
    interface Window {
        app?: ComfyApp;
    }
}

// ComponentWidget type definition
export interface ComponentWidget<T = any> {
    node: any;
    name: string;
    type: string;
    value?: T;
    serializeValue?: (node: any, index: number) => Promise<any> | any;
    options?: Record<string, any>;
}

export {};
