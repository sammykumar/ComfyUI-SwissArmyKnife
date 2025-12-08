**Summary**:  
Parses a JSON-style bounding box string into integer coordinates and returns width and height. The node expects the exact nested-list format: `[[x1, y1, x2, y2]]`.

**Inputs**
- **bboxString**: `STRING` — A JSON string containing one inner list with four numeric values. Example: `[[170.64, 71.72, 300.56, 238.28]]`.

**Outputs**
- **x1**: `INT` — Rounded x1 coordinate
- **y1**: `INT` — Rounded y1 coordinate
- **x2**: `INT` — Rounded x2 coordinate
- **y2**: `INT` — Rounded y2 coordinate
- **width**: `INT` — Rounded width computed as `x2 - x1`
- **height**: `INT` — Rounded height computed as `y2 - y1`

**Usage Tips**
- The node strictly parses JSON. Provide a properly formatted JSON string (including the outer and inner brackets) — other formats are not accepted.
- If parsing fails or the structure is incorrect, the node raises a `ValueError` (this will show as an error when executing the node).
- Coordinates are parsed as floats internally then rounded to the nearest integer before being returned.
- Use the returned `width` and `height` if you need integer sizes (e.g., for cropping or annotations).

**Example**
Input string:

```
[[170.6425323486328, 71.72273254394531, 300.5597229003906, 238.28350830078125]]
```

Outputs:

- `x1`: `171`
- `y1`: `72`
- `x2`: `301`
- `y2`: `238`
- `width`: `130`
- `height`: `166`

See developer documentation for implementation notes and examples: `../../dev-docs/nodes/parse-string-to-bbox/PARSE_STRING_TO_BBOX.md`
