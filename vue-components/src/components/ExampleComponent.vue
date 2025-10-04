<template>
    <div class="example-component">
        <h3>{{ t('example.title') }}</h3>
        <p>{{ t('example.description') }}</p>
        <button @click="handleClick">{{ t('example.button') }}</button>
        <div v-if="clickCount > 0" class="counter">
            Clicked {{ clickCount }} times
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ComponentWidget } from '@/types/comfyui';

// i18n support
const { t } = useI18n();

// Component props - receives the widget from ComfyUI
const { widget } = defineProps<{
    widget: ComponentWidget;
}>();

// Component state
const clickCount = ref(0);

// Event handlers
function handleClick() {
    clickCount.value++;
    console.log('Button clicked:', clickCount.value);

    // Example: Update widget value
    if (widget) {
        widget.value = { clicks: clickCount.value };
    }
}
</script>

<style scoped>
.example-component {
    padding: 16px;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    border-radius: 8px;
}

.example-component h3 {
    margin: 0 0 12px 0;
    color: #333;
}

.example-component p {
    margin: 0 0 16px 0;
    color: #666;
}

.example-component button {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
}

.example-component button:hover {
    background-color: #45a049;
}

.example-component button:active {
    background-color: #3d8b40;
}

.counter {
    margin-top: 16px;
    padding: 8px;
    background-color: #e3f2fd;
    border-left: 4px solid #2196f3;
    border-radius: 4px;
    color: #1976d2;
    font-weight: bold;
}
</style>
