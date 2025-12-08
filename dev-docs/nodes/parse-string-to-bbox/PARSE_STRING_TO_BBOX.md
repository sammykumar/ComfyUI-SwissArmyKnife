# PARSE_STRING_TO_BBOX — Developer Documentation

## Summary

`ParseStringToBBox` is a small utility node that parses a string-encoded bounding box
and emits integer coordinates together with computed width and height. The node
expects a strict JSON nested-list format:

```
[[x1, y1, x2, y2]]
```

Coordinate parsing rules
- The node calls `json.loads(...)` on the input string.
- It expects a top-level list with at least one element.
- The first element must be a list of exactly four numeric values.
- Values are parsed as floats and then rounded to the nearest integer for the
  node outputs.

## Node definition (summary)

- File: `nodes/utils/parse_string_to_bbox.py`
- Class: `ParseStringToBBox`
- Inputs: `bboxString: STRING` (multiline allowed)
- Returns: `x1, y1, x2, y2, width, height` — all `INT` return types
- Behavior: Raises `ValueError` on parse or validation errors (consistent with repo style)

## Implementation notes

- Keep the parser strict: only JSON nested-list format is accepted. This reduces
  ambiguity and makes the node predictable in piped workflows.
- Rounding: the node rounds the parsed float values to the nearest integer
  using Python's built-in `round()` then converts to `int` before returning.
- Width/height calculation uses the rounded coordinates: `width = x2 - x1`, `height = y2 - y1`.

## Error handling

- `json.loads()` exceptions are caught and re-raised as `ValueError` with a helpful message.
- Structural problems (missing inner list, wrong number of values, non-numeric values)
  also raise `ValueError`.

## Tests

- Tests live under `tests/` — the important test file is `tests/test_parse_string_to_bbox.py`.
- Test cases should include:
  - Valid example (the sample provided in this project's docs).
  - Invalid JSON string → expect `ValueError`.
  - Incorrect structure (not nested list or wrong element count) → expect `ValueError`.
  - Numeric values that require rounding — validate integer outputs and computed `width`/`height`.

## Registration

- Export the node by adding it to `nodes/nodes.py` and mapping the display name in
  `NODE_CLASS_MAPPINGS` and `NODE_DISPLAY_NAME_MAPPINGS` (follow the pattern used by
  other utility nodes such as `PromptBuilder`).

## Developer workflow

1. Activate the venv: `source .venv/bin/activate`
2. Make code changes in `nodes/utils/parse_string_to_bbox.py`.
3. Run lint/format: `ruff check .` and `ruff check --fix` (or `black .` as needed).
4. Run the node unit tests: `pytest -q tests/test_parse_string_to_bbox.py` (see note below about package install).
5. After any Python node file modification, restart the ComfyUI dev server so the
   new node is picked up:

```
cd /mnt/nfs_share/gen-ai-image/comfyui-containers && docker compose restart dev-comfyui
```

## Notes

- The repository's top-level `__init__.py` performs package-relative imports which
  require the package to be importable (installing the project in editable mode
  using `pip install -e .` is the easiest way to run tests and import nodes during
  development without running the full ComfyUI server).
