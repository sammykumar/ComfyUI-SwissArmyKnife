# Vue Component Documentation

Documentation for Vue 3 component development and integration in ComfyUI-SwissArmyKnife.

## 📄 Documentation Files

### Getting Started

- **[VUE_SETUP_SUMMARY.md](VUE_SETUP_SUMMARY.md)** - Initial Vue 3 integration setup and configuration
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete guide to creating Vue components for ComfyUI
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick reference for Vue development patterns
- **[TESTING.md](TESTING.md)** - Testing strategies for Vue components

### Video Comparison Component

- **[VIDEO_COMPARISON_WIDGET.md](VIDEO_COMPARISON_WIDGET.md)** - Full API documentation for Video.js comparison widget
- **[QUICK_START_VIDEO_COMPARISON.md](QUICK_START_VIDEO_COMPARISON.md)** - Getting started with the video comparison component
- **[INTEGRATION_WITH_EXISTING_VIDEO_PREVIEW.md](INTEGRATION_WITH_EXISTING_VIDEO_PREVIEW.md)** - Migration guide from JavaScript to Vue

## 🎯 Overview

The Vue integration provides a modern, reactive component framework for building ComfyUI widgets with:

- **Vue 3.5.13** - Composition API with TypeScript support
- **PrimeVue 4.2.5** - Professional UI component library
- **Vue-i18n 9.14.3** - Internationalization support
- **Vite** - Fast build tool with HMR
- **TypeScript** - Type safety and IDE support

## 🚀 Quick Start

### Prerequisites

```bash
# Install Node.js dependencies
cd vue-components
npm install
```

### Build Components

```bash
# One-time build
npm run vue:build

# Watch mode (development)
npm run vue:dev
```

### Create a New Component

1. Create component file: `vue-components/src/components/YourComponent.vue`
2. Register in `vue-components/src/main.ts`
3. Add translations to `vue-components/src/locales/en.ts`
4. Build and test

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed steps.

## 📦 Available Components

### VideoComparisonWidget

Professional video comparison component using Video.js:

- Side-by-side display of up to 3 videos
- Synchronized playback controls
- Progressive loading support
- Responsive grid layout
- Full Video.js features

**Documentation**: [VIDEO_COMPARISON_WIDGET.md](VIDEO_COMPARISON_WIDGET.md)

### ExampleComponent

Template component demonstrating:

- Vue 3 Composition API
- TypeScript integration
- PrimeVue components
- i18n support
- ComfyUI widget integration

**Code**: `vue-components/src/components/ExampleComponent.vue`

## 🏗️ Architecture

```
vue-components/
├── src/
│   ├── components/          # Vue components
│   │   ├── ExampleComponent.vue
│   │   └── VideoComparisonWidget.vue
│   ├── locales/             # i18n translations
│   │   ├── en.ts
│   │   └── index.ts
│   ├── types/               # TypeScript types
│   │   └── comfyui.ts
│   └── main.ts              # Entry point & registration
├── package.json
├── tsconfig.json
├── vite.config.mts
└── README.md                # Component development guide
```

### Build Output

```
web/js/
├── vue-components.js        # Compiled bundle (~925 KB)
└── assets/
    └── vue-components.css   # Styles (~43 KB)
```

## 🎨 Development Workflow

### 1. Create Component

```vue
<template>
    <div class="my-component">
        <h3>{{ t('myComponent.title') }}</h3>
        <Button @click="handleClick" :label="t('myComponent.button')" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import type { ComponentWidget } from '@/types/comfyui';

const { t } = useI18n();
const { widget } = defineProps<{ widget: ComponentWidget }>();

function handleClick() {
    console.log('Button clicked');
}
</script>

<style scoped>
.my-component {
    padding: 16px;
}
</style>
```

### 2. Register Component

In `vue-components/src/main.ts`:

```typescript
import MyComponent from './components/MyComponent.vue';

getCustomWidgets(_app) {
  return {
    MY_WIDGET(node: any) {
      const widget = new ComponentWidgetImpl({
        node,
        name: 'my_widget',
        component: MyComponent,
        inputSpec: { name: 'my_widget', type: 'my-widget' },
        options: {},
      });

      addWidget(node, widget);
      return { widget };
    },
  };
}
```

### 3. Add Translations

In `vue-components/src/locales/en.ts`:

```typescript
export default {
    en: {
        myComponent: {
            title: 'My Component',
            button: 'Click Me',
        },
    },
};
```

### 4. Build & Test

```bash
npm run vue:build
# Restart ComfyUI
# Test in browser
```

## 🧪 Testing

### Component Testing

```typescript
// In vue-components/tests/MyComponent.test.ts
import { mount } from '@vue/test-utils';
import MyComponent from '@/components/MyComponent.vue';

describe('MyComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(MyComponent);
        expect(wrapper.find('h3').text()).toBe('My Component');
    });
});
```

See [TESTING.md](TESTING.md) for comprehensive testing guide.

## 🎯 Best Practices

### Component Design

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition API**: Use `<script setup>` with Composition API
3. **TypeScript**: Always use TypeScript for type safety
4. **Props Validation**: Define clear prop types
5. **Scoped Styles**: Use scoped CSS to avoid conflicts

### State Management

1. **Local State**: Use `ref` and `reactive` for component state
2. **Props**: Pass data down from parent
3. **Events**: Emit events for parent communication
4. **Widget Integration**: Update `widget.value` for ComfyUI

### Performance

1. **Lazy Loading**: Load heavy components only when needed
2. **Code Splitting**: Use dynamic imports for large dependencies
3. **Computed Properties**: Cache expensive calculations
4. **v-show vs v-if**: Use v-show for frequently toggled elements

### Styling

1. **CSS Variables**: Use ComfyUI theme variables
2. **Scoped Styles**: Prevent style leakage
3. **Responsive**: Design for all screen sizes
4. **Dark Theme**: Ensure compatibility with dark theme

## 📚 Related Documentation

### Node Documentation

- [Video Comparison Node](../nodes/video-comparison/) - Node using VideoComparisonWidget
- [Video Preview Node](../nodes/video-preview/) - JavaScript-based video preview

### Infrastructure

- [Build & Deploy](../infrastructure/build-deploy/) - Build and publishing workflows
- [Debug System](../infrastructure/debug/) - Debugging Vue components

## 🔧 Troubleshooting

### Build Issues

```bash
# Clean and rebuild
cd vue-components
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Component Not Loading

1. Check browser console for errors
2. Verify component registration in `main.ts`
3. Ensure build output exists in `web/js/`
4. Clear browser cache
5. Restart ComfyUI server

### Type Errors

```bash
# Run type checking
cd vue-components
npm run type-check
```

### Styling Issues

1. Check CSS variable names match ComfyUI theme
2. Verify scoped styles are working
3. Use browser DevTools to inspect styles
4. Check for CSS specificity conflicts

## 🚀 Future Enhancements

### Planned Features

- [ ] More UI components (dialogs, forms, tables)
- [ ] State management with Pinia
- [ ] Component library/storybook
- [ ] Hot module replacement
- [ ] Enhanced testing utilities

### Component Ideas

- [ ] Image comparison widget
- [ ] Timeline/keyframe editor
- [ ] Advanced settings panel
- [ ] Workflow visualizer
- [ ] Performance monitor

## 📖 External Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [PrimeVue Documentation](https://primevue.org/)
- [Vue-i18n Guide](https://vue-i18n.intlify.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Framework**: Vue 3.5.13  
**UI Library**: PrimeVue 4.2.5  
**Build Tool**: Vite 6.3.5  
**Last Updated**: October 4, 2025
