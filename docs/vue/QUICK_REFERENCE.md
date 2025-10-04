# Quick Reference: Creating New Vue Widgets

## Step-by-Step Process

### 1. Create the Vue Component

Create `vue-components/src/components/YourWidget.vue`:

```vue
<template>
    <div class="your-widget">
        <h3>{{ t('yourWidget.title') }}</h3>
        <!-- Your UI here -->
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ComponentWidget } from '@/types/comfyui';

const { t } = useI18n();
const { widget } = defineProps<{ widget: ComponentWidget }>();

// Your component logic
</script>

<style scoped>
.your-widget {
    padding: 16px;
}
</style>
```

### 2. Add Translations

Update `vue-components/src/locales/en.ts`:

```typescript
yourWidget: {
    title: 'Your Widget Title',
    // ... more translations
}
```

### 3. Register in main.ts

Add to `vue-components/src/main.ts`:

```typescript
import YourWidget from './components/YourWidget.vue';

// In getCustomWidgets():
YOUR_WIDGET_NAME(node: any) {
    const inputSpec = {
        name: 'your_widget_name',
        type: 'your-widget-type',
    };

    const widget = new ComponentWidgetImpl({
        node,
        name: inputSpec.name,
        component: YourWidget,
        inputSpec,
        options: {},
    });

    addWidget(node, widget);
    return { widget };
}
```

### 4. Create Python Node

Create `nodes/your_node.py`:

```python
class YourNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "your_widget_name": ("YOUR_WIDGET_NAME", {}),
            },
        }

    RETURN_TYPES = ("STRING",)
    FUNCTION = "process"
    CATEGORY = "swiss-army-knife"

    def process(self, your_widget_name):
        # Process widget data
        return (str(your_widget_name),)
```

### 5. Register Python Node

In `nodes/nodes.py`:

```python
from .your_node import YourNode

NODE_CLASS_MAPPINGS = {
    # ... existing nodes ...
    "YourNode": YourNode
}

NODE_DISPLAY_NAME_MAPPINGS = {
    # ... existing names ...
    "YourNode": "Your Node Display Name"
}
```

### 6. Build and Test

```bash
# The build is auto-running with vue:dev
# Just restart ComfyUI to see your new node
```

## Naming Conventions

| Item                 | Format            | Example                |
| -------------------- | ----------------- | ---------------------- |
| Widget Type (Python) | `UPPERCASE_SNAKE` | `EXAMPLE_WIDGET`       |
| Widget Type (TS)     | Same as Python    | `EXAMPLE_WIDGET`       |
| Component File       | `PascalCase.vue`  | `ExampleComponent.vue` |
| Python Node File     | `snake_case.py`   | `vue_example_node.py`  |
| Python Class         | `PascalCase`      | `VueExampleNode`       |

## Key Points

✅ Widget type name must match **exactly** between Python and TypeScript
✅ Use `@ts-expect-error` for ComfyUI runtime imports
✅ Component receives `widget` prop with ComfyUI integration
✅ Update `widget.value` to send data back to Python
✅ Build runs automatically with `npm run vue:dev`
✅ Must restart ComfyUI to load new Python nodes

## Common Patterns

### Send Data to Python

```typescript
// In your Vue component
widget.value = { someData: 'value' };
```

### Receive Data in Python

```python
def process(self, your_widget_name):
    data = your_widget_name  # dict: {'someData': 'value'}
    return (str(data),)
```

### Use PrimeVue Components

```vue
<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
</script>

<template>
    <Button label="Click Me" @click="handleClick" />
    <InputText v-model="value" />
</template>
```

## File Locations

```
├── nodes/
│   ├── your_node.py              # Python node
│   └── nodes.py                   # Registration
├── vue-components/
│   └── src/
│       ├── components/
│       │   └── YourWidget.vue    # Vue component
│       ├── locales/
│       │   └── en.ts             # Translations
│       └── main.ts               # Widget registration
└── web/
    └── js/
        └── vue-components.js     # Auto-built (don't edit)
```
