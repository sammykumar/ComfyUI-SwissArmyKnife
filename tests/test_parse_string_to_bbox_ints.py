import importlib.util
import os
import math
import pytest

MODULE_PATH = os.path.join(os.path.dirname(__file__), "..", "nodes", "utils", "parse_string_to_bbox_ints.py")
spec = importlib.util.spec_from_file_location("parse_string_to_bbox_ints", os.path.abspath(MODULE_PATH))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
ParseStringToBBoxInts = mod.ParseStringToBBoxInts


def test_valid_bbox_ints_rounding():
    s = "[ [10.4, 20.6, 110.5, 220.2] ]"
    node = ParseStringToBBoxInts()
    x1, y1, x2, y2 = node.parse_bbox_ints(s)

    assert x1 == 10
    assert y1 == 21
    assert x2 == 110
    assert y2 == 220


def test_invalid_json_raises_ints():
    s = "invalid"
    node = ParseStringToBBoxInts()
    with pytest.raises(ValueError):
        node.parse_bbox_ints(s)
