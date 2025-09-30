# JoyCaption Integration Guide

## Overview

JoyCaption has been successfully integrated into ComfyUI-SwissArmyKnife, providing advanced image captioning capabilities using LLaVA (Large Language and Vision Assistant) models. This integration offers multiple caption styles, model quantization options, and batch processing features.

## Features

### Core Capabilities

- **Multiple Caption Styles**: Descriptive, Training Prompt, MidJourney, Booru tags, and more
- **Model Support**: Both HuggingFace transformers and GGUF quantized models
- **Memory Optimization**: Support for fp32, bf16, fp16, 8-bit, and 4-bit quantization
- **Batch Processing**: Process multiple images efficiently
- **Flexible Output**: Save captions in TXT, JSON, or CSV formats

### Available Nodes

#### Basic Nodes

1. **JoyCaption (`JC`)** - Simple image captioning with preset options
2. **JoyCaption (Advanced) (`JC_adv`)** - Full parameter control for advanced users
3. **JoyCaption Extra Options (`JC_ExtraOptions`)** - Additional customization options

#### GGUF Quantized Models

4. **JoyCaption (GGUF) (`JC_GGUF`)** - Memory-efficient quantized models
5. **JoyCaption (GGUF Advanced) (`JC_GGUF_adv`)** - Advanced GGUF with full control

#### Batch Processing Tools

6. **Load Images from Path (`ImageBatchPath`)** - Load multiple images from folder
7. **Save Captions (`CaptionSaver`)** - Save captions to various formats
8. **Batch Caption Images (`ImageCaptionBatch`)** - Process multiple images automatically

## Installation

### Required Dependencies

The following dependencies are automatically included in the main package:

```toml
# Core ML libraries
"torch>=2.0.0"
"torchvision>=0.15.0"
"transformers>=4.35.0"
"accelerate>=0.20.0"
"huggingface-hub>=0.16.0"
"bitsandbytes>=0.41.0"
"numpy>=1.21.0"
```

### Optional Dependencies

For GGUF quantized model support, install the optional package:

```bash
pip install "ComfyUI-SwissArmyKnife[joycaption-gguf]"
```

Or manually:

```bash
pip install llama-cpp-python>=0.2.0
```

## Usage Guide

### Basic Image Captioning

1. **Add JoyCaption Node**: Place a `JoyCaption` node in your workflow
2. **Connect Image**: Connect an image input to the node
3. **Select Model**: Choose from available HuggingFace models
4. **Choose Style**: Select caption style (Descriptive, Training Prompt, etc.)
5. **Set Quantization**: Choose memory/speed balance (8-bit recommended)
6. **Run**: Execute to generate caption

### Advanced Configuration

Use `JoyCaption (Advanced)` for fine-tuned control:

- **Temperature**: Control randomness (0.0-2.0)
- **Top-p**: Control diversity (0.0-1.0)
- **Top-k**: Limit token choices (0-100)
- **Max Tokens**: Set caption length (1-2048)
- **Custom Prompt**: Override default prompts

### GGUF Models

For lower memory usage, use GGUF nodes:

1. **Select GGUF Model**: Choose quantized model variant
2. **Set GPU Layers**: Balance between CPU/GPU processing
3. **Configure Memory**: Use "Clear After Run" for limited VRAM

### Batch Processing Workflow

1. **Load Images**: Use `Load Images from Path` to load folder of images
2. **Process Batch**: Connect to `Batch Caption Images` node
3. **Save Results**: Use `Save Captions` to save in desired format

## Caption Styles

### Available Styles

1. **Descriptive**: Natural language description
2. **Training Prompt**: Optimized for AI training datasets
3. **MidJourney**: Style prompts for MidJourney AI
4. **Booru tag list**: Comma-separated tags like image boards
5. **Booru-like tag list**: More detailed tagging format
6. **Art Critic**: Professional art analysis style
7. **Product Listing**: E-commerce product descriptions
8. **Social Media Post**: Casual, engaging descriptions

### Extra Options

Configure additional parameters:

- **Character Name**: Specify character in image
- **Custom Options**: Add style modifiers and constraints

## Memory Management

### Quantization Options

1. **Full Precision (bf16)**: Best quality, high memory usage
2. **Balanced (8-bit)**: Recommended for most users
3. **Maximum Savings (4-bit)**: Lowest memory usage

### Memory Strategies

- **Keep in Memory**: Faster processing for multiple images
- **Clear After Run**: Free memory after each operation

## Model Information

### HuggingFace Models

- **llava-hf/llava-v1.6-mistral-7b-hf**: Standard vision-language model
- **llava-hf/llava-v1.6-vicuna-7b-hf**: Alternative base model
- Additional models can be added to configuration

### GGUF Models

Support for 12 quantization formats:

- Q2_K, Q3_K_S, Q3_K_M, Q3_K_L
- Q4_0, Q4_K_S, Q4_K_M, Q5_0
- Q5_K_S, Q5_K_M, Q6_K, F16

## File Structure

```
utils/media_describe/joycaption/
├── __init__.py                 # Module initialization
├── jc_data.json               # Configuration and model settings
├── joy_caption_hf.py          # HuggingFace model nodes
├── joy_caption_gguf.py        # GGUF quantized model nodes
├── caption_tools.py           # Batch processing tools
└── requirements.txt           # Specific dependencies
```

## Configuration

Settings are stored in `jc_data.json`:

- **Caption Types**: Style definitions and prompts
- **Model Settings**: Default parameters and configurations
- **GGUF Models**: Quantized model repository information
- **Extra Options**: Additional customization features

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed
2. **CUDA Out of Memory**: Use higher quantization or "Clear After Run"
3. **Model Download Fails**: Check internet connection and HuggingFace access
4. **Slow Performance**: Adjust GPU layers for GGUF models

### Performance Tips

- Use 8-bit quantization for best speed/quality balance
- Keep models in memory for batch processing
- Use GGUF models for limited VRAM systems
- Adjust max tokens based on desired caption length

## Integration Notes

### Code Organization

JoyCaption nodes are conditionally imported to prevent errors if dependencies are missing:

```python
try:
    from .media_describe.joycaption.joy_caption_hf import JC, JC_adv, JC_ExtraOptions
    JOYCAPTION_AVAILABLE = True
except ImportError:
    JOYCAPTION_AVAILABLE = False
```

### Node Categories

All JoyCaption nodes are categorized under:

- **Category**: "Swiss Army Knife 🔪/JoyCaption"

### ComfyUI Integration

Nodes follow ComfyUI conventions:

- Proper INPUT_TYPES definitions
- Appropriate RETURN_TYPES
- Tooltip documentation
- Error handling

## Future Enhancements

Potential improvements:

- Additional model support
- Custom fine-tuned models
- More caption styles
- Advanced batch processing features
- Integration with other Swiss Army Knife nodes

## Credits

Based on [ComfyUI-JoyCaption](https://github.com/1038lab/ComfyUI-JoyCaption) by 1038lab.
Licensed under GPL-3.0.

## Support

For issues specific to JoyCaption integration:

1. Check dependencies are properly installed
2. Verify model access and permissions
3. Review memory requirements for chosen quantization
4. Consult the original JoyCaption documentation for model-specific issues
