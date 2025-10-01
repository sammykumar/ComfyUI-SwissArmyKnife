# Super LoRA Loader Variants

## Overview

The Swiss Army Knife LoRA Manager now includes two variants of the Super LoRA Loader node:

1. **SuperDualLoraLoader (WanVideoWrapper)** - Dual-stream version for WanVideo workflows
2. **SuperLoraLoader** - Single-stream version for standard workflows

Both nodes share the same powerful features but differ in their input/output structure.

## SuperLoraLoader (Single Stream)

### Purpose

Single-stream LoRA loader for WanVideo workflows that use a single model stream instead of separate high/low noise streams.

### Inputs

- **lora** (WANVIDLORA, required): LoRA stack from WanVideo Lora Select or compatible nodes
- **clip** (CLIP, optional): The CLIP model to apply LoRAs to
- **lora_bundle** (STRING, optional): JSON array of LoRA configurations from the UI

### Outputs

- **WANVIDLORA**: The model with all enabled LoRAs applied
- **CLIP**: The CLIP model with all enabled LoRAs applied
- **TRIGGER_WORDS**: Comma-separated list of trigger words from enabled LoRAs

### Use Cases

- Standard WanVideo workflows with single model stream
- Simple video generation pipelines
- Workflows that don't require separate high/low noise processing

### Example Workflow

```
WanVideo Lora Select → SuperLoraLoader → WanVideo Generation
                        ↑
                     CLIP (optional)
```

## SuperDualLoraLoader (WanVideoWrapper)

### Purpose

Specialized LoRA loader for WanVideo workflows that use separate high noise and low noise model streams.

### Inputs

- **high_noise_lora** (WANVIDLORA, required): LoRA stack for high noise model
- **low_noise_lora** (WANVIDLORA, required): LoRA stack for low noise model
- **clip** (CLIP, optional): The CLIP model to apply LoRAs to
- **lora_bundle** (STRING, optional): JSON array of LoRA configurations from the UI

### Outputs

- **high_noise_lora**: The high noise model with enabled LoRAs applied
- **low_noise_lora**: The low noise model with enabled LoRAs applied
- **CLIP**: The CLIP model with all enabled LoRAs applied
- **TRIGGER_WORDS**: Comma-separated list of trigger words from enabled LoRAs

### Use Cases

- WanVideo video generation workflows
- Workflows requiring separate high/low noise processing
- Advanced video generation pipelines

### Model Type Selection

Each LoRA can be configured to apply to:

- `high` - High noise model only
- `low` - Low noise model only
- `both` - Both models (default)

### Example Workflow

```
WanVideo Lora Select → SuperDualLoraLoader → WanVideo Pipeline
                        ↑
                     CLIP (optional)
```

## Shared Features

Both variants share these powerful features:

### Multiple LoRA Loading

- Load multiple LoRAs in a single node
- Individual enable/disable controls for each LoRA
- Configurable load order

### Dual Strength Support

- **Model Strength**: Controls LoRA influence on the model
- **CLIP Strength**: Controls LoRA influence on CLIP (text encoder)
- Can be set independently for fine-grained control

### Automatic Trigger Word Extraction

- Automatically extracts trigger words from LoRA metadata
- Combines trigger words from all enabled LoRAs
- Outputs as comma-separated string ready for prompt concatenation

### Tag-based Organization

- Organize LoRAs with custom tags
- Filter and search by tags
- Categorize large LoRA collections

### Template System

- Save/load LoRA configurations as templates
- Quickly switch between different LoRA setups
- Share configurations across workflows

### CivitAI Integration

- Fetch metadata from CivitAI
- Automatic trigger word lookup
- Display LoRA information and previews

## Technical Implementation

### Backend Processing

Both nodes use the same core loading logic:

1. Parse `lora_bundle` JSON array
2. Filter enabled LoRAs
3. Apply LoRAs sequentially using ComfyUI's `LoraLoader`
4. Collect trigger words from enabled LoRAs
5. Return modified models and trigger words

### Frontend Integration

The JavaScript extension (`web/js/lora_manager/extension.js`) provides:

- Rich UI for LoRA selection and configuration
- Real-time preview and metadata display
- Drag-and-drop LoRA reordering
- Template management interface
- Tag filtering and search

### lora_bundle Format

```json
[
    {
        "lora": "example_lora.safetensors",
        "enabled": true,
        "strength": 1.0,
        "strengthClip": 1.0,
        "triggerWords": "example trigger",
        "modelType": "both" // Only used by SuperDualLoraLoader
    }
]
```

## Migration Guide

### From NdSuperLoraLoader to New Variants

**For WanVideo Dual-Stream Workflows:**
Replace `NdSuperLoraLoader` with `SuperDualLoraLoader` - they have the same interface.

**For WanVideo Single-Stream Workflows:**
If you were using `NdSuperLoraLoader` with a single model stream:

1. Replace node with `SuperLoraLoader`
2. Connect single WANVIDLORA input instead of high_noise_lora/low_noise_lora
3. Connect output to WanVideo generation nodes

## Future Enhancements

Potential future improvements:

- [ ] Multi-model support (apply same LoRAs to multiple models)
- [ ] LoRA strength scheduling (vary strength during generation)
- [ ] Advanced filtering (by trigger word, rating, etc.)
- [ ] Preset templates shared in ComfyUI Registry
- [ ] Performance profiling and optimization suggestions

## See Also

- [DUAL_LORA_PANEL_IMPLEMENTATION.md](./DUAL_LORA_PANEL_IMPLEMENTATION.md) - Original dual panel implementation
- [LORA_MANAGER_INTEGRATION.md](./LORA_MANAGER_INTEGRATION.md) - LoRA manager integration details
- [LORA_METADATA_INTEGRATION.md](./LORA_METADATA_INTEGRATION.md) - Metadata extraction and usage
