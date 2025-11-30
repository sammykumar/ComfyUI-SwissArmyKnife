# VACE Annotators - Quick Reference

Quick reference guide for VACE Annotator nodes in SwissArmyKnife.

## Available Nodes

- **VACE Annotator - Depth**: Generates depth maps from images/video frames
- **VACE Annotator - Flow**: Generates optical flow maps between video frames
- **VACE Annotator - Scribble**: Generates scribble/edge maps for stylized effects

## Model Downloads

Download models from HuggingFace: https://huggingface.co/ali-vilab/VACE-Annotators

## Default Model Locations

Place downloaded models in one of these locations:

```
models/vace_annotators/depth/     # Depth models (midas.pth, depth_anything_v2.pth)
models/vace_annotators/flow/      # Flow model (raft.pth)
models/vace_annotators/scribble/  # Scribble models (anime_style/netG_A_latest.pth, etc.)
```

## Complete Documentation

See [VACE_ANNOTATORS.md](./VACE_ANNOTATORS.md) for comprehensive documentation including:
- Detailed node descriptions
- Input/output specifications
- Usage examples and workflows
- Model architecture details
- Performance considerations
- Troubleshooting guide
