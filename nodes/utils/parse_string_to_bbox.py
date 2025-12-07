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

    RETURN_TYPES = ("FLOAT", "FLOAT", "FLOAT", "FLOAT")
    RETURN_NAMES = ("x1", "y1", "x2", "y2")
    FUNCTION = "parse_bbox"
    CATEGORY = "Swiss Army Knife 🔪/Utils"
    DESCRIPTION = "Parse a JSON-style bbox string into x1, y1, x2, y2 floats."

    def parse_bbox(self, bboxString: str) -> Tuple[float, float, float, float]:
        """Parse the provided bbox string and return four floats.

        This function expects the exact nested-list JSON structure shown above.
        """
        try:
            # json.loads will accept the multi-line JSON string shown in examples
            data = json.loads(bboxString)
        except Exception as e:
            raise ValueError(f"Failed to parse bboxString as JSON: {e}")

        if not isinstance(data, list) or len(data) == 0:
            raise ValueError("bboxString must be a non-empty JSON list containing one inner list of four numbers")

        inner = data[0]
        if not isinstance(inner, list) or len(inner) != 4:
            raise ValueError("bboxString must contain an inner list with exactly four numeric values")

        try:
            x1 = float(inner[0])
            y1 = float(inner[1])
            x2 = float(inner[2])
            y2 = float(inner[3])
        except Exception as e:
            raise ValueError(f"BBox coordinates must be numeric: {e}")

        return (x1, y1, x2, y2)


NODE_CLASS_MAPPINGS = {
    "ParseStringToBBox": ParseStringToBBox,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "ParseStringToBBox": "Parse String To BBox",
}
