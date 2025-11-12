# VACEFlowAnnotator
Compute forward/backward optical flow between frames using VACE's flow model to capture motion cues.

## Inputs
- `images` – IMAGE batch with ≥2 frames.
- `flow_direction` (forward/backward/bidirectional) and `resolution`.
- Optional `model_path`.

## Outputs
- `flow_maps` – IMAGE tensor encoding motion vectors.

## Usage Tips
1. Only feed batches produced by VHS loaders or custom frame stacks.
2. Use bidirectional mode when you need symmetric motion guidance.

## Additional Resources
- [Full documentation](docs/nodes/vace-annotators/VACE_ANNOTATORS.md#vace-annotator-flow)
