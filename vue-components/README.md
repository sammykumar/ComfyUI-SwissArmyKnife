# Vue Components for ComfyUI Swiss Army Knife

This directory contains Vue 3-based components for building interactive UI widgets in ComfyUI custom nodes. The setup is based on the [ComfyUI Frontend Vue Basic](https://github.com/jtydhr88/ComfyUI_frontend_vue_basic) reference implementation.

## 🎯 Overview

This Vue component system provides:

- **Vue 3** - Modern reactive framework with Composition API
- **TypeScript** - Type-safe component development
- **Vite** - Fast build system with HMR support
- **PrimeVue** - Rich UI component library (peer dependency)
- **vue-i18n** - Internationalization support (peer dependency)
- **ComfyUI Types** - Full TypeScript support for ComfyUI APIs

## 📁 Project Structure

```
vue-components/
├── src/
│   ├── components/        # Vue components
│   │   └── ExampleComponent.vue
│   ├── locales/          # i18n translations
│   │   ├── en.ts
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   └── comfyui.d.ts
│   ├── env.d.ts          # Vite environment types
│   └── main.ts           # Entry point & ComfyUI extension registration
├── vite.config.mts       # Vite build configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Local package config
```

## 🚀 Getting Started

### Installation

From the **root of the project**, install dependencies:

```bash
npm install
```

This will install all dependencies defined in the root `package.json`, including Vue, Vite, and related tools.

### Development

Build the Vue components:

```bash
# From root directory
npm run vue:build

# Or with watch mode for development
npm run vue:dev
```

The built files will be output to `../web/js/vue-components.js` where ComfyUI can load them.

### Type Checking

Run TypeScript type checking:

```bash
# From root directory
cd vue-components && npm run type-check
```

## 🔧 Creating a New Component

### 1. Create the Vue Component

Create a new `.vue` file in `src/components/`:

```vue
<!-- src/components/MyWidget.vue -->
<template>
    <div class="my-widget">
        <h3>{{ t('myWidget.title') }}</h3>
        <button @click="handleAction">{{ t('myWidget.button') }}</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ComponentWidget } from '@/types/comfyui';

const { t } = useI18n();

const { widget } = defineProps<{
    widget: ComponentWidget;
}>();

function handleAction() {
    // Your logic here
    console.log('Action triggered');
}
</script>

<style scoped>
.my-widget {
    padding: 16px;
}
</style>
```

### 2. Add Translations

Update `src/locales/en.ts`:

```typescript
export default {
    en: {
        myWidget: {
            title: 'My Custom Widget',
            button: 'Click Me',
        },
    },
};
```

### 3. Register the Widget

Update `src/main.ts` to register your component:

```typescript
import MyWidget from '@/components/MyWidget.vue'
import { addWidget, ComponentWidgetImpl } from '../../../scripts/domWidget.js'

// Inside registerExtension:
getCustomWidgets(app) {
  return {
    MY_CUSTOM_WIDGET(node) {
      const inputSpec = {
        name: 'my_custom_widget',
        type: 'my-widget-type',
      }

      const widget = new ComponentWidgetImpl({
        node,
        name: inputSpec.name,
        component: MyWidget,
        inputSpec,
        options: {}
      })

      addWidget(node, widget)
      return { widget }
    }
  }
}
```

### 4. Create Python Node

Create a corresponding Python node in your main nodes directory:

```python
class MyCustomNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "my_custom_widget": ("MY_CUSTOM_WIDGET", {}),
            },
        }

    RETURN_TYPES = ("STRING",)
    FUNCTION = "process"
    CATEGORY = "swiss-army-knife"

    def process(self, **kwargs):
        widget_data = kwargs["my_custom_widget"]
        # Process the widget data
        return (str(widget_data),)
```

## 🏗️ Build System

### Vite Configuration

The `vite.config.mts` is configured to:

- **Bundle as ES module** for ComfyUI
- **Externalize dependencies** that ComfyUI provides (Vue, PrimeVue, vue-i18n)
- **Externalize ComfyUI scripts** (`app.js`, `domWidget.js`, etc.)
- **Output to `../web/js/`** for ComfyUI to load

### Key Externals

These are NOT bundled (provided at runtime):

- `vue`, `vue-i18n`, `primevue/*`
- ComfyUI scripts: `../../../scripts/app.js`, etc.
- `@comfyorg/comfyui-frontend-types`

## 📦 Dependencies

### Peer Dependencies (Required)

Install these in the main ComfyUI environment (already in root package.json):

- `vue` ^3.5.13
- `vue-i18n` ^9.14.3
- `primevue` ^4.2.5

### Dev Dependencies

- `vite` ^6.3.5
- `@vitejs/plugin-vue` ^5.2.3
- `vite-plugin-vue-devtools` ^7.7.2
- `@comfyorg/comfyui-frontend-types` ^1.24.4
- `typescript` ^5.7.3
- `vue-tsc` ^2.3.0

## 🎨 Using PrimeVue Components

Import and use PrimeVue components in your Vue files:

```vue
<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
</script>

<template>
    <div>
        <Button label="Submit" @click="handleSubmit" />
        <InputText v-model="value" placeholder="Enter text" />
    </div>
</template>
```

## 🌐 Internationalization

Add translations in `src/locales/`:

```typescript
// src/locales/en.ts
export default {
    en: {
        component: {
            key: 'Translation',
        },
    },
};
```

Use in components:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
    <div>{{ t('component.key') }}</div>
</template>
```

## 🔍 TypeScript Support

### Component Types

Use the `ComponentWidget` type for widget props:

```typescript
import type { ComponentWidget } from '@/types/comfyui';

const { widget } = defineProps<{
    widget: ComponentWidget;
}>();
```

### ComfyUI API Access

Access the ComfyUI API through `window.app`:

```typescript
if (window.app?.api) {
    const response = await window.app.api.fetchApi('/endpoint', {
        method: 'POST',
        body: formData,
    });
}
```

## 📝 Best Practices

1. **Keep components focused** - One component per widget type
2. **Use TypeScript** - Leverage type safety
3. **Follow Vue 3 patterns** - Use Composition API with `<script setup>`
4. **Externalize heavy dependencies** - Don't bundle what ComfyUI provides
5. **Test in ComfyUI** - Always test in the actual ComfyUI environment
6. **Document your components** - Add JSDoc comments for complex logic

## 🔗 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [PrimeVue Components](https://primevue.org/)
- [Vite Documentation](https://vitejs.dev/)
- [ComfyUI Frontend Types](https://www.npmjs.com/package/@comfyorg/comfyui-frontend-types)
- [Reference Implementation](https://github.com/jtydhr88/ComfyUI_frontend_vue_basic)

## 🐛 Troubleshooting

### Build Errors

If you see module resolution errors:

```bash
# From root directory
npm install
cd vue-components
npm run type-check
```

### Runtime Errors

Check that:

- ComfyUI is version 1.24.4 or higher
- Vue components are properly registered in `main.ts`
- Python node types match the widget types

### Hot Module Replacement

For development with HMR:

```bash
npm run vue:dev
```

Then refresh ComfyUI to see changes.

## 📄 License

MIT
