# Vendoring Notes

This repository vendors a minimal subset of the VACE-Annotators project (Apache-2.0) so ComfyUI users can run the scribble annotator without installing the full upstream repo.

## Vendored Components

| File | Description | Upstream Source |
| --- | --- | --- |
| `nodes/vace_annotators/annotator_models/scribble.py` | ResNet generator architecture plus preprocessing/postprocessing helpers. As of this update it also vendors the official `ContourInference` graph to mirror upstream behavior. | Derived from the `scribble` generator in [ali-vilab/VACE-Annotators](https://github.com/ali-vilab/VACE-Annotators) (Apache-2.0). |
| `nodes/vace_annotators/annotator_models/__init__.py` | Shim exporting loader + helpers. | Local glue code referencing the vendored generator. |
| `nodes/vace_annotators/scribble_loader.py` | Loader, device handling, caching, and error plumbing. | Local adaptation based on SwissArmyKnife requirements. |

## Updating the Vendored Code

1. Fetch the latest `scribble` generator implementation from the upstream repository.
2. Preserve the Apache-2.0 license header and attribution when copying/updating files.
3. Keep imports self-contained (no upstream-relative imports remain after vendoring).
4. Run `tests/annotators/test_scribble_inference.py` to ensure fallback + optional model inference still work.
5. Document changes in `docs/nodes/vace-annotators/scribble/README.md` when the vendored code diverges from upstream behavior.

## Additional Assets

- `tests/data/sample_scribble_input.png` is a synthetic 128×128 RGB gradient used by the smoke tests to create deterministic scribble outputs.
- Test artifacts are written to `tests/output/` for visual inspection.

> The upstream project is licensed under Apache-2.0. See the repository license for full terms.
