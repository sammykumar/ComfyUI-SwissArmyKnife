import os
import subprocess
import tempfile
from pathlib import Path
from PIL import Image


def _create_test_images(tmpdir: Path):
    img = Image.new('RGB', (64, 64), color=(255, 255, 255))
    for x in range(16, 48):
        for y in range(16, 48):
            img.putpixel((x, y), (0, 0, 0))
    img_path = tmpdir / 'input.png'
    img.save(img_path)

    mask = Image.new('L', (64, 64), color=0)
    for x in range(16, 48):
        for y in range(16, 48):
            mask.putpixel((x, y), 255)
    mask_path = tmpdir / 'mask.png'
    mask.save(mask_path)

    return img_path, mask_path


def test_runner_creates_output(tmp_path: Path):
    tmpdir = tmp_path
    (img_path, mask_path) = _create_test_images(tmpdir)
    out_dir = tmpdir / 'out'
    out_dir.mkdir()

    # Use a subprocess to run the runner script
    py = os.environ.get('PYTHON', 'python')
    cmd = [py, 'scripts/run_scribble_node.py', '--image', str(img_path), '--mask', str(mask_path), '--inference_mode', 'fallback', '--outputDir', str(out_dir)]
    proc = subprocess.run(cmd, cwd=str(Path(__file__).resolve().parents[1]), capture_output=True)
    assert proc.returncode == 0, f"Runner failed: {proc.stderr.decode()[:200]}"
    # Expect at least one output file
    expected = out_dir / f"{img_path.stem}_scribble.png"
    assert expected.exists(), f"Runner did not create expected output file: {expected}"
