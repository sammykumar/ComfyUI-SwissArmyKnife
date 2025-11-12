# FilenameGenerator
Build deterministic filename strings (and optional date folders) based on scheduler/CFG parameters so saved assets stay organized.

## Inputs
- `scheduler`, `shift`, `total_steps`, `shift_step` – core Wan scheduler metadata.
- `high_cfg`, `low_cfg` – capture CFG pairs used in dual-noise workflows.
- `base_filename`, `subdirectory_prefix`, `add_date_subdirectory` – control the resulting folder structure.

## Outputs
- `filename` – sanitized path fragment that downstream save nodes can use.

## Usage Tips
1. Connect scheduler/CFG values from your workflow, then feed the result into save nodes or metadata helpers.
2. Enable date folders when batching multiple runs to avoid overwriting.

## Additional Resources
- [Full documentation](docs/nodes/media-describe/MEDIA_DESCRIBE.md#filenamegenerator)
