import importlib.util
import os
import math
import pytest

# Load module directly by path to avoid importing the package top-level __init__.py
MODULE_PATH = os.path.join(os.path.dirname(__file__), "..", "nodes", "utils", "parse_string_to_bbox.py")
spec = importlib.util.spec_from_file_location("parse_string_to_bbox", os.path.abspath(MODULE_PATH))
parse_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(parse_mod)
ParseStringToBBox = parse_mod.ParseStringToBBox


def test_valid_bbox_string():
    s = "[ [170.6425323486328, 71.72273254394531, 300.5597229003906, 238.28350830078125] ]"
    node = ParseStringToBBox()
    x1, y1, x2, y2, width, height = node.parse_bbox(s)

    # Values are rounded to nearest int
    assert x1 == 171
    assert y1 == 72
    assert x2 == 301
    assert y2 == 238

    # width = x2 - x1, height = y2 - y1
    assert width == 130
    assert height == 166


def test_invalid_json_raises():
    s = "not a json"
    node = ParseStringToBBox()
    with pytest.raises(ValueError):
        node.parse_bbox(s)


def test_wrong_structure_raises():
    s = "[1,2,3,4]"  # not nested
    node = ParseStringToBBox()
    with pytest.raises(ValueError):
        node.parse_bbox(s)
