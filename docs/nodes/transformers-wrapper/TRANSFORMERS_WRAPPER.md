# Transformers VLM Wrapper Node

## Overview

The Transformers VLM Wrapper node enables dynamic loading and inference with transformer-based vision-language models (VLMs) in ComfyUI workflows. It supports JoyCaption, Qwen2.5-VL, and Qwen3-VL models with automatic VRAM management through quantization and model unloading.

## Table of Contents

- [Features](#features)
- [Supported Models](#supported-models)
- [Input Parameters](#input-parameters)
- [Output](#output)
- [Quantization Modes](#quantization-modes)
- [VRAM Management](#vram-management)
- [Usage Examples](#usage-examples)
- [Model Loading Behavior](#model-loading-behavior)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)
- [Technical Implementation](#technical-implementation)

## Features

- **Dynamic Model Loading**: Load and switch between different VLM models on-demand
- **Automatic Model Unloading**: Free GPU VRAM by unloading models when switching or after inference
- **Quantization Support**: Reduce VRAM usage with fp16, int8, or int4 quantization
- **Multi-modal Inference**: Generate captions from images with optional text prompts
- **CUDA OOM Protection**: Gracefully handle out-of-memory errors with automatic cleanup
- **Generation Controls**: Configurable temperature and token limits for caption generation
- **ComfyUI Integration**: Seamless integration with ComfyUI's image tensor format

## Supported Models

The node supports three vision-language model families:

| Model Name | Model ID | Description |
|------------|----------|-------------|
| **joycaption** | `fancyfeast/llama-joycaption-alpha-two-hf-llava` | Specialized image captioning model with detailed descriptions |
| **qwen2.5-vl** | `Qwen/Qwen2.5-VL-7B-Instruct` | Qwen 2.5 Vision-Language model (7B parameters) |
| **qwen3-vl** | `Qwen/Qwen3-VL-7B-Instruct` | Qwen 3 Vision-Language model (7B parameters) |

All models are loaded from Hugging Face Hub and support quantization for VRAM optimization.

## Input Parameters

### Required Inputs

#### image (IMAGE)
- **Type**: ComfyUI IMAGE tensor
- **Format**: BHWC (Batch, Height, Width, Channels)
- **Description**: Input image to generate captions for
- **Note**: First image from batch will be used

#### model_name (Dropdown)
- **Options**: `joycaption`, `qwen2.5-vl`, `qwen3-vl`
- **Default**: `joycaption`
- **Description**: Select which vision-language model to load
- **Note**: Switching models triggers automatic unloading of previous model

#### quant (Dropdown)
- **Options**: `fp16`, `int8`, `int4`
- **Default**: `fp16`
- **Description**: Quantization mode for model loading
- **VRAM Impact**:
  - `fp16`: Full precision (highest VRAM, best quality)
  - `int8`: 8-bit quantization (~50% VRAM reduction)
  - `int4`: 4-bit quantization (~75% VRAM reduction)

### Optional Inputs

#### prompt (STRING)
- **Type**: Multiline text
- **Default**: Empty
- **Description**: Optional text prompt to guide caption generation
- **Example**: "Describe this image in detail, focusing on colors and composition"

#### max_new_tokens (INT)
- **Range**: 1 to 2048
- **Default**: 256
- **Description**: Maximum number of tokens to generate in the caption
- **Note**: Higher values allow longer captions but take more time

#### temperature (FLOAT)
- **Range**: 0.1 to 2.0
- **Default**: 0.7
- **Step**: 0.1
- **Description**: Sampling temperature for generation
- **Effect**:
  - Lower (0.1-0.5): More focused and deterministic
  - Medium (0.6-0.9): Balanced creativity
  - Higher (1.0-2.0): More creative and diverse

#### unload_after_inference (BOOLEAN)
- **Default**: False
- **Description**: Unload model from GPU after inference to free VRAM
- **Use Case**: Enable when running multiple different models in sequence

## Output

### caption (STRING)
- **Type**: Text string
- **Description**: Generated caption or description of the input image
- **Format**: Plain text without special tokens
- **Content**: Depends on model and prompt used

## Quantization Modes

### FP16 (Float16)
- **VRAM Usage**: Highest (~14GB for 7B models)
- **Quality**: Best possible quality
- **Speed**: Fastest inference
- **Use When**: VRAM is not a constraint

### INT8 (8-bit)
- **VRAM Usage**: Medium (~7GB for 7B models)
- **Quality**: Minimal quality loss
- **Speed**: Slightly slower than fp16
- **Use When**: Moderate VRAM constraints (12-16GB GPU)

### INT4 (4-bit)
- **VRAM Usage**: Lowest (~4GB for 7B models)
- **Quality**: Slight quality degradation acceptable
- **Speed**: Slower than fp16 and int8
- **Use When**: Severe VRAM constraints (<12GB GPU)

## VRAM Management

The node implements several VRAM management strategies:

### Automatic Model Switching
When switching between models or quantization modes:
1. Current model is unloaded from GPU
2. Python garbage collection is triggered
3. CUDA cache is cleared
4. New model is loaded with specified quantization

### Manual Unloading
Enable `unload_after_inference` to:
- Free VRAM immediately after caption generation
- Allow other models to use GPU memory
- Prevent OOM errors in complex workflows

### Emergency Cleanup
On CUDA Out of Memory errors:
- Automatically unload current model
- Clear CUDA cache
- Return error message instead of crashing

### Memory Tips
- Use `device_map="auto"` for automatic GPU/CPU memory distribution
- Models are shared across node instances (class-level storage)
- Only one model configuration can be loaded at a time

## Usage Examples

### Basic Caption Generation

```
[Load Image] → [Transformers VLM Wrapper] → [Display Text]
                     ↓
                model_name: joycaption
                quant: fp16
```

Simple workflow to generate captions for images using JoyCaption model.

### Multi-Model Workflow with VRAM Management

```
[Load Image] → [Transformers VLM Wrapper] → [Display Text]
                     ↓
                model_name: joycaption
                quant: int8
                unload_after_inference: True

[Same Image] → [Transformers VLM Wrapper] → [Display Text]
                     ↓
                model_name: qwen2.5-vl
                quant: int8
                unload_after_inference: True
```

Use multiple models on the same image with automatic VRAM management.

### Guided Caption Generation

```
[Load Image] → [Transformers VLM Wrapper] → [Display Text]
                     ↓
                model_name: qwen3-vl
                prompt: "Describe this image focusing on artistic style and mood"
                temperature: 0.8
                max_new_tokens: 512
```

Generate detailed, creative captions with custom prompts.

### Low-VRAM Setup (8GB GPU)

```
[Load Image] → [Transformers VLM Wrapper] → [Display Text]
                     ↓
                model_name: joycaption
                quant: int4
                max_new_tokens: 128
```

Run on GPUs with limited VRAM using aggressive quantization.

## Model Loading Behavior

### First Load
- Model and processor downloaded from Hugging Face Hub
- Cached in `~/.cache/huggingface/hub/`
- Subsequent loads use cached files

### Model Switching
Triggers reload when:
- `model_name` changes (e.g., joycaption → qwen2.5-vl)
- `quant` mode changes (e.g., fp16 → int8)
- Model is `None` (first run or after manual unload)

Does NOT reload when:
- Only `prompt`, `temperature`, or `max_new_tokens` change
- Same model and quantization used in consecutive runs

### Loading Time
- First download: 5-15 minutes (model size dependent)
- Cached load: 30-90 seconds
- Model switching: 20-60 seconds (unload + reload)

## Error Handling

### CUDA Out of Memory
**Symptom**: Error message starting with "❌ CUDA Out of Memory"

**Solutions**:
1. Use lower quantization mode (int8 or int4)
2. Enable `unload_after_inference`
3. Reduce `max_new_tokens`
4. Close other GPU-intensive applications

**Automatic Behavior**:
- Model automatically unloaded
- CUDA cache cleared
- Error message returned (workflow continues)

### Import Errors
**Symptom**: "Failed to import transformers"

**Solution**: Install dependencies:
```bash
pip install transformers accelerate bitsandbytes
```

### Model Download Failures
**Symptom**: Connection errors or timeout during first load

**Solutions**:
1. Check internet connection
2. Verify Hugging Face Hub access
3. Manually pre-download models
4. Use HF_HUB_OFFLINE=1 environment variable with cached models

### Invalid Model Selection
**Symptom**: KeyError or model not found

**Solution**: Verify model_name is one of: `joycaption`, `qwen2.5-vl`, `qwen3-vl`

## Troubleshooting

### Model loads but generates poor captions

**Check**:
- Is quantization too aggressive? (Try fp16 or int8)
- Is temperature appropriate? (0.7 is balanced)
- Does the model understand your prompt?
- Are you using the right model for your task?

### Inference is very slow

**Possible Causes**:
- First run (model loading overhead)
- Heavy quantization (int4 slower than fp16)
- Large `max_new_tokens` value
- CPU offloading active (check VRAM)

**Solutions**:
- Wait for first inference to complete
- Use int8 instead of int4
- Reduce `max_new_tokens`
- Ensure model fits in GPU VRAM

### Model doesn't unload / VRAM not freed

**Try**:
1. Enable `unload_after_inference`
2. Manually trigger unload by switching models
3. Restart ComfyUI server
4. Check for other nodes holding references

### Caption includes prompt text

**Explanation**: Some models echo the prompt in output

**Solution**: Node automatically removes prompt prefix from output

## Technical Implementation

### Architecture

- **Class-level model storage**: Single model instance shared across all node instances
- **Lazy loading**: Models loaded only when needed
- **Automatic cleanup**: Models unloaded during switching
- **Error recovery**: Graceful degradation on CUDA OOM

### Image Preprocessing

ComfyUI images (BHWC format, float [0,1]) converted to PIL:
1. Extract first image from batch
2. Scale from [0,1] to [0,255]
3. Convert to numpy uint8
4. Create PIL Image

### Inference Pipeline

1. **Input Processing**: Image + optional prompt → processor
2. **Device Transfer**: Move tensors to model device
3. **Generation**: Model.generate() with parameters
4. **Decoding**: Tokenizer.decode() with special token removal
5. **Cleanup**: Remove prompt prefix if present

### Quantization Implementation

Uses `bitsandbytes` library:
- **INT8**: `load_in_8bit=True`
- **INT4**: BitsAndBytesConfig with NF4 quantization
- **FP16**: torch.float16 dtype (no quantization)

### Memory Management

```python
# Unload sequence
del model, processor
gc.collect()
torch.cuda.empty_cache()
torch.cuda.synchronize()
```

Ensures complete VRAM release before loading new model.

## Future Enhancements

Potential improvements for future versions:

- **Async Loading**: Background model loading to reduce UI freeze
- **Model Caching**: Keep multiple models in memory (if VRAM allows)
- **Batch Processing**: Process multiple images in one inference call
- **Progress Indicators**: Show download and loading progress
- **Model Metadata**: Display model info (size, parameters, etc.)
- **Separate Unload Node**: Dedicated node for manual model unloading
- **CPU Offload Controls**: Fine-grained control over device placement
- **Custom Model Support**: Allow users to specify custom Hugging Face model IDs

## Dependencies

Required Python packages:
- `transformers>=4.30.0` - Hugging Face transformers library
- `accelerate>=0.20.0` - Hugging Face model acceleration
- `bitsandbytes>=0.41.0` - Quantization support
- `torch` - PyTorch (must be compatible with CUDA)
- `pillow` - Image processing
- `numpy` - Array operations

## Related Nodes

- **JoyCaption Media Describe**: vLLM-based JoyCaption inference (server required)
- **Media Describe**: Gemini-based image/video description
- **Video Preview**: Display video content in ComfyUI

## Implementation Notes

- Models are stateless (no conversation history)
- Thread-safe for single-threaded ComfyUI execution
- Not suitable for concurrent inference (one model at a time)
- First inference includes model loading time
- Subsequent inferences with same model are faster

## Version History

- **v1.0.0** (2025-10-14): Initial implementation
  - Support for JoyCaption, Qwen2.5-VL, Qwen3-VL
  - FP16, INT8, INT4 quantization modes
  - Automatic VRAM management
  - Optional model unloading
