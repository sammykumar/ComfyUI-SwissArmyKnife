# JoyCaption for ComfyUI Swiss Army Knife

This module provides AI-powered image captioning functionality using LLaVA vision-language models, ported from the original [ComfyUI-JoyCaption](https://github.com/1038lab/ComfyUI-JoyCaption) repository.

## Features

- **Multiple Model Types**: Support for both HuggingFace transformers and efficient GGUF quantized models
- **Flexible Caption Styles**: 6 different caption types (Descriptive, Descriptive (Informal), Training Prompt, MidJourney, Booru tag style, Booru-like tag style)
- **Memory Management**: Configurable memory modes for different VRAM capacities
- **Batch Processing**: Tools for processing multiple images efficiently
- **Customizable Options**: Extra options for enhanced descriptions and character naming
- **Performance Optimizations**: Scoped PyTorch backend settings and improved stop token handling (PR #22)

## Node Types

### Core Captioning Nodes

1. **JoyCaption** - Basic image captioning with HuggingFace models
2. **JoyCaption (Advanced)** - Full control over generation parameters
3. **JoyCaption GGUF** - Efficient quantized model inference
4. **JoyCaption GGUF (Advanced)** - Advanced quantized model controls

### Utility Nodes

5. **JoyCaption Extra Options** - Additional caption customization options
6. **Image Batch Path** - Load images from folders for batch processing
7. **Caption Saver** - Save generated captions to files

## Installation

The core JoyCaption functionality is included with ComfyUI Swiss Army Knife. For full functionality, you may need to install additional dependencies:

```bash
pip install -r nodes/joycaption/requirements.txt
```

### GGUF Support (Optional)

For GGUF model support, install llama-cpp-python:

```bash
pip install llama-cpp-python
```

## Usage

### Basic Usage

1. Add a **JoyCaption** node to your workflow
2. Connect an image input
3. Select your preferred model and caption style
4. Generate captions

### Advanced Usage

1. Use **JoyCaption Extra Options** to customize caption behavior
2. Use **JoyCaption (Advanced)** for fine-tuned control over generation parameters
3. Use **Image Batch Path** and **Caption Saver** for batch processing workflows

### Memory Management

- **Keep in Memory**: Faster processing, requires more VRAM
- **Clear After Run**: Slower but uses less VRAM
- **Quantization Options**:
    - Full Precision (bf16): Best quality, most VRAM
    - Balanced (8-bit): Good balance of quality and memory
    - Memory Efficient (4-bit): Lowest memory usage

## Model Support

### HuggingFace Models

- Various pre-configured LLaVA models with automatic downloading
- Support for custom model specifications

### GGUF Models

- Efficient quantized models (Q2_K to F16)
- Lower memory usage and faster inference
- Automatic model downloading from HuggingFace Hub

## Caption Types

1. **Descriptive**: Detailed, natural language descriptions
2. **Descriptive (Informal)**: Casual, conversational descriptions
3. **Training Prompt**: Optimized for AI training datasets
4. **MidJourney**: Style optimized for MidJourney prompts
5. **Booru tag style**: Comma-separated tags
6. **Booru-like tag style**: Alternative tag format

## Extra Options

- Include information about lighting and camera angle
- Add details about what the subject is doing
- Specify emotional tone and atmosphere
- Include style and medium information
- Add character name substitution
- Include background and environment details

## File Structure

```
nodes/joycaption/
├── __init__.py              # Module initialization
├── JC.py                    # HuggingFace transformer nodes
├── JC_GGUF.py              # GGUF quantized model nodes
├── CaptionTools.py         # Batch processing utilities
├── jc_data.json            # Configuration data
├── requirements.txt        # Python dependencies
└── README.md              # This documentation
```

## Configuration

Model settings, caption types, and other configurations are stored in `jc_data.json`. This file contains:

- Caption type mappings and templates
- Extra option descriptions
- Memory efficient configurations
- Model settings and defaults
- GGUF model specifications

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed via requirements.txt
2. **Memory Issues**: Try lower quantization settings or "Clear After Run" memory management
3. **Model Download Failures**: Check internet connection and HuggingFace Hub access
4. **GGUF Not Working**: Install llama-cpp-python with proper GPU support

### Performance Tips

- Use GGUF models for better memory efficiency
- Enable "Keep in Memory" for faster repeated processing
- Use appropriate quantization levels for your hardware
- Consider batch processing for multiple images
- GGUF improvements: Enhanced stop token handling prevents double responses and role marker leakage
- Scoped backend settings: PyTorch optimizations are now locally scoped to prevent global slowdowns

## Recent Improvements (PR #22)

### Performance Optimizations

- **Scoped PyTorch Backend Settings**: TF32 and cuDNN optimizations are now locally scoped to prevent global first-run slowdowns in other ComfyUI nodes
- **Improved Stop Tokens**: Switched to Llama-3 End-of-Turn tokens (`<|eot_id|>`) and enhanced role marker detection
- **Response Cleaning**: Added automatic cleanup of leaked role markers and double responses

### Technical Details

- PyTorch backend settings (cuDNN benchmark, TF32) are applied only during model operations
- Enhanced stop token list includes Llama-3 format tokens and common role markers
- Automatic text cleaning removes any stray "ASSISTANT:" headers or incomplete responses
- CUDA memory allocation configuration is conditionally set to prevent conflicts

## License

This module is part of ComfyUI Swiss Army Knife and follows the same licensing terms. Original JoyCaption functionality is based on the work from 1038lab/ComfyUI-JoyCaption.
