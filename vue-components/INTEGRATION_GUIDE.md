# Vue Components Integration Guide

## Quick Start

This guide shows you how to integrate the Vue component system with your ComfyUI custom nodes.

## Architecture

```
┌─────────────────────────────────────────────┐
│           ComfyUI Frontend                  │
│  ┌────────────────────────────────────────┐ │
│  │   Vue Components (vue-components/)     │ │
│  │   - Built to web/js/vue-components.js  │ │
│  │   - Uses external Vue/PrimeVue         │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │   ComfyUI Scripts (web/js/)            │ │
│  │   - app.js, domWidget.js, etc.         │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
           ▲
           │ WebSocket
           ▼
┌─────────────────────────────────────────────┐
│           ComfyUI Backend                   │
│  ┌────────────────────────────────────────┐ │
│  │   Python Nodes (nodes/)                │ │
│  │   - Define INPUT_TYPES with widgets    │ │
│  │   - Process widget data                │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Step-by-Step Integration

### 1. Install Dependencies

From the **root directory**:

```bash
npm install
```

### 2. Build Vue Components

```bash
npm run vue:build
```

This outputs to `web/js/vue-components.js`.

### 3. Create a Vue Component

**File: `vue-components/src/components/VideoPreview.vue`**

```vue
<template>
    <div class="video-preview">
        <video
            ref="videoElement"
            :src="videoUrl"
            controls
            @loadedmetadata="onMetadata"
        />
        <div class="info">Duration: {{ duration }}s | Size: {{ fileSize }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { ComponentWidget } from '@/types/comfyui';

const { widget } = defineProps<{
    widget: ComponentWidget;
}>();

const videoElement = ref<HTMLVideoElement>();
const videoUrl = ref('');
const duration = ref(0);
const fileSize = ref('');

// Watch for widget value changes
watch(
    () => widget.value,
    (newValue) => {
        if (newValue?.url) {
            videoUrl.value = newValue.url;
        }
    },
    { immediate: true },
);

function onMetadata() {
    if (videoElement.value) {
        duration.value = Math.round(videoElement.value.duration);
    }
}

onMounted(() => {
    // Expose methods to parent if needed
    widget.getVideoElement = () => videoElement.value;
});
</script>

<style scoped>
.video-preview {
    width: 100%;
}

video {
    width: 100%;
    border-radius: 4px;
}

.info {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
}
</style>
```

### 4. Register the Component

**File: `vue-components/src/main.ts`**

```typescript
import { app } from '../../../scripts/app.js';
import type { ComfyApp } from '@comfyorg/comfyui-frontend-types';
import { addWidget, ComponentWidgetImpl } from '../../../scripts/domWidget.js';

import VideoPreview from '@/components/VideoPreview.vue';

const comfyApp: ComfyApp = app;

comfyApp.registerExtension({
    name: 'comfyui-swissarmyknife.vue-components',

    async setup() {
        console.log('Vue components loaded');
    },

    getCustomWidgets() {
        return {
            VIDEO_PREVIEW_WIDGET(node: any) {
                const inputSpec = {
                    name: 'video_preview',
                    type: 'video-preview',
                };

                const widget = new ComponentWidgetImpl({
                    node,
                    name: inputSpec.name,
                    component: VideoPreview,
                    inputSpec,
                    options: {},
                });

                addWidget(node, widget);
                return { widget };
            },
        };
    },

    nodeCreated(node: any) {
        // Adjust node size for specific components
        if (node.comfyClass === 'VideoPreviewNode') {
            const [oldWidth, oldHeight] = node.size;
            node.setSize([Math.max(oldWidth, 400), Math.max(oldHeight, 300)]);
        }
    },
});
```

### 5. Create Python Node

**File: `nodes/video_nodes.py`**

```python
import os

class VideoPreviewNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "video_path": ("STRING", {"default": ""}),
                "video_preview": ("VIDEO_PREVIEW_WIDGET", {}),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("video_info",)
    FUNCTION = "preview_video"
    CATEGORY = "swiss-army-knife/video"

    def preview_video(self, video_path, video_preview):
        # The video_preview widget data will be passed here
        print(f"Video preview data: {video_preview}")

        if os.path.exists(video_path):
            size = os.path.getsize(video_path)
            return (f"Video: {video_path}, Size: {size} bytes",)

        return ("No video found",)

NODE_CLASS_MAPPINGS = {
    "VideoPreviewNode": VideoPreviewNode
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "VideoPreviewNode": "Video Preview"
}
```

### 6. Register Python Node

**File: `nodes/__init__.py`** (or main `__init__.py`)

```python
from .video_nodes import NODE_CLASS_MAPPINGS as VIDEO_NODES

NODE_CLASS_MAPPINGS = {
    **VIDEO_NODES,
    # ... other nodes
}
```

### 7. Rebuild and Test

```bash
# Rebuild Vue components
npm run vue:build

# Restart ComfyUI and test
```

## Advanced Patterns

### Serializing Widget Data

For widgets that need to send data to the backend:

```typescript
import { onMounted } from 'vue';

const { widget } = defineProps<{ widget: ComponentWidget }>();

onMounted(() => {
    widget.serializeValue = async (node: any, index: number) => {
        // Return data to be sent to Python node
        return {
            videoUrl: videoUrl.value,
            duration: duration.value,
            timestamp: Date.now(),
        };
    };
});
```

### Uploading Files

```typescript
async function uploadFile(file: File) {
    if (!window.app?.api) {
        throw new Error('ComfyUI API not available');
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('subfolder', 'videos');
    formData.append('type', 'temp');

    const response = await window.app.api.fetchApi('/upload/image', {
        method: 'POST',
        body: formData,
    });

    return response.json();
}
```

### Using PrimeVue Components

```vue
<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { ref } from 'vue';

const showDialog = ref(false);
</script>

<template>
    <div>
        <Button
            label="Open Settings"
            icon="pi pi-cog"
            @click="showDialog = true"
        />

        <Dialog v-model:visible="showDialog" header="Settings" :modal="true">
            <p>Dialog content here</p>
        </Dialog>
    </div>
</template>
```

## Common Patterns

### 1. File Upload Widget

```vue
<template>
    <div class="file-upload">
        <input type="file" @change="handleFileUpload" :accept="acceptedTypes" />
        <div v-if="uploading">Uploading...</div>
        <div v-if="uploadedFile">{{ uploadedFile.name }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ComponentWidget } from '@/types/comfyui';

const { widget } = defineProps<{ widget: ComponentWidget }>();

const uploading = ref(false);
const uploadedFile = ref<any>(null);
const acceptedTypes = ref('.mp4,.mov,.avi');

async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !window.app?.api) return;

    uploading.value = true;

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await window.app.api.fetchApi('/upload/file', {
            method: 'POST',
            body: formData,
        });

        uploadedFile.value = await response.json();
        widget.value = uploadedFile.value;
    } finally {
        uploading.value = false;
    }
}
</script>
```

### 2. Real-time Preview

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';

const { widget } = defineProps<{ widget: ComponentWidget }>();

const previewData = ref('');

// Listen for updates from backend
watch(
    () => widget.value,
    (newValue) => {
        if (newValue?.preview) {
            previewData.value = newValue.preview;
        }
    },
    { deep: true },
);
</script>
```

### 3. Interactive Canvas

```vue
<template>
    <canvas
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const canvas = ref<HTMLCanvasElement>();
const ctx = ref<CanvasRenderingContext2D>();
const isDrawing = ref(false);

onMounted(() => {
    if (canvas.value) {
        ctx.value = canvas.value.getContext('2d') ?? undefined;
    }
});

function startDrawing(e: MouseEvent) {
    isDrawing.value = true;
    // Drawing logic
}

function draw(e: MouseEvent) {
    if (!isDrawing.value || !ctx.value) return;
    // Drawing logic
}

function stopDrawing() {
    isDrawing.value = false;
}
</script>
```

## Troubleshooting

### Component Not Showing

1. Check that `web/js/vue-components.js` exists
2. Verify ComfyUI loaded the extension (check browser console)
3. Ensure Python node type matches widget type exactly

### Type Errors

```bash
cd vue-components
npm run type-check
```

### Build Errors

```bash
# Clean and rebuild
rm -rf node_modules
npm install
npm run vue:build
```

## Next Steps

- Explore the [example component](src/components/ExampleComponent.vue)
- Review the [PrimeVue documentation](https://primevue.org/)
- Check the [reference implementation](https://github.com/jtydhr88/ComfyUI_frontend_vue_basic)
