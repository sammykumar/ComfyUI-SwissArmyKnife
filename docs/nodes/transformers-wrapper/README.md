# Transformers VLM Wrapper

Quick reference for the Transformers VLM Wrapper node.

## Quick Start

The Transformers VLM Wrapper enables dynamic loading of vision-language models (JoyCaption, Qwen2.5-VL, Qwen3-VL) with automatic VRAM management.

### Basic Usage

1. Connect an IMAGE input
2. Select a model (joycaption, qwen2.5-vl, qwen3-vl)
3. Choose quantization mode (fp16, int8, int4)
4. Generate captions

### Key Features

- ✅ Dynamic model loading and switching
- ✅ Automatic VRAM management
- ✅ Quantization support (fp16, int8, int4)
- ✅ Optional text prompts for guided generation
- ✅ Configurable temperature and token limits

### Documentation

For complete documentation, see [TRANSFORMERS_WRAPPER.md](./TRANSFORMERS_WRAPPER.md)

### Quick Tips

- **Low VRAM?** Use `int4` quantization
- **Multiple models?** Enable `unload_after_inference`
- **Better quality?** Use `fp16` with higher temperature
- **Out of Memory?** Try lower quantization or reduce max_new_tokens

## Files

- `TRANSFORMERS_WRAPPER.md` - Complete node documentation
- `README.md` - This file (quick reference)
