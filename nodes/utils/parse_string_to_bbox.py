"""
ParseStringToBBox Node

Accepts a single `bboxString` of the exact JSON-list format:
[
  [x1, y1, x2, y2]
]

Returns four floats: x1, y1, x2, y2
"""
from typing import Tuple
import json


class ParseStringToBBox:
    """Parse a string containing a nested list of 4 floats into separate bbox floats.

    The node expects the input to be a JSON array containing one inner array
    with four numeric values, for example:

    [
      [170.6425323486328, 71.72273254394531, 300.5597229003906, 238.28350830078125]
    ]

    If parsing fails or the structure is not as expected, this node raises a
    ValueError consistent with other nodes in the repository.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "bboxString": (
                    "STRING",
                    {
                        "multiline": True,
                        "default": "",
                        "tooltip": "A JSON string of the form [[x1, y1, x2, y2]]",
                    },
                ),
            },
            "optional": {},
        }

    # Return integer coordinates and width/height (rounded to nearest int)
    RETURN_TYPES = ("INT", "INT", "INT", "INT", "INT", "INT")
    RETURN_NAMES = ("x1", "y1", "x2", "y2", "width", "height")
    FUNCTION = "parse_bbox"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    DESCRIPTION = "Parse a JSON-style bbox string into x1, y1, x2, y2 floats."

    def parse_bbox(self, bboxString: str) -> Tuple[float, float, float, float]:
        """Parse the provided bbox string and return four floats.

        This function expects the exact nested-list JSON structure shown above.
        """
        try:
            data = json.loads(bboxString)
        except Exception as e:
            raise ValueError(f"Failed to parse bboxString as JSON: {e}")

        if not isinstance(data, list) or len(data) == 0:
            raise ValueError("bboxString must be a non-empty JSON list containing one inner list of four numbers")

        inner = data[0]
        if not isinstance(inner, list) or len(inner) != 4:
            raise ValueError("bboxString must contain an inner list with exactly four numeric values")

        try:
            # Parse floats then round to nearest int for internal integer outputs
            x1f = float(inner[0])
            y1f = float(inner[1])
            x2f = float(inner[2])
            y2f = float(inner[3])
        except Exception as e:
            raise ValueError(f"BBox coordinates must be numeric: {e}")

        x1 = int(round(x1f))
        y1 = int(round(y1f))
        x2 = int(round(x2f))
        y2 = int(round(y2f))

        width = int(round(x2 - x1))
        height = int(round(y2 - y1))

        return (x1, y1, x2, y2, width, height)


NODE_CLASS_MAPPINGS = {
    "ParseStringToBBox": ParseStringToBBox,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ParseStringToBBox": "Parse String To BBox",
}
