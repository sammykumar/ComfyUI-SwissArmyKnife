import torch

from nodes.vace_annotators.vace_scribble_annotator import VACEScribbleAnnotator


def create_test_image(h=32, w=32):
    img = torch.ones((1, h, w, 3), dtype=torch.float32)
    # Draw a black square in the center (creates edges)
    img[0, 10:22, 10:22, :] = 0.0
    return img


def test_scribble_with_mask_inside_area():
    annot = VACEScribbleAnnotator()
    img = create_test_image()
    # Mask covering the black square
    mask = torch.zeros((1, img.shape[1], img.shape[2]), dtype=torch.float32)
    mask[0, 10:22, 10:22] = 1.0

    scribble_maps, = annot.generate_scribble(
        img,
        style="anime",
        inference_mode="fallback",
        resolution=64,
        edge_threshold=0.05,
        batch_size=0,
        mask=mask,
    )

    # Expect edges inside masked area (some values < 1) and white outside (close to 1)
    inside_mean = scribble_maps[0, 10:22, 10:22, 0].mean().item()
    outside_min = scribble_maps[0, :10, :, 0].min().item()

    assert inside_mean < 0.99, "Expected edges inside mask"
    assert outside_min > 0.999, "Expected no edges outside mask"


def test_scribble_with_mask_excluding_area():
    annot = VACEScribbleAnnotator()
    img = create_test_image()
    # Mask excluding the black square -> should be all white
    mask = torch.zeros((1, img.shape[1], img.shape[2]), dtype=torch.float32)

    scribble_maps, = annot.generate_scribble(
        img,
        style="anime",
        inference_mode="fallback",
        resolution=64,
        edge_threshold=0.05,
        batch_size=0,
        mask=mask,
    )

    # All values should be white (1.0)
    all_min = scribble_maps.min().item()
    assert all_min > 0.999, "Expected all-white scribble map with empty mask"


def test_scribble_mask_broadcast_batch():
    annot = VACEScribbleAnnotator()
    img = torch.cat([create_test_image(), create_test_image()], dim=0)  # batch size 2
    # Single mask (shape [1, H, W]) should be broadcast to both frames
    mask = torch.zeros((1, img.shape[1], img.shape[2]), dtype=torch.float32)
    mask[0, 10:22, 10:22] = 1.0

    scribble_maps, = annot.generate_scribble(
        img,
        style="anime",
        inference_mode="fallback",
        resolution=64,
        edge_threshold=0.05,
        batch_size=0,
        mask=mask,
    )

    # Both frames should have edges inside the masked area
    for i in range(2):
        inside_mean = scribble_maps[i, 10:22, 10:22, 0].mean().item()
        assert inside_mean < 0.99, f"Expected edges in frame {i} inside mask"
