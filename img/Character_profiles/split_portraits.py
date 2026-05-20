"""Slice the 4x5 portrait grid into 20 PNGs along the white seams between cells."""
from PIL import Image
import numpy as np
import os

SRC = r"C:\Users\Mark\Desktop\Character_profiles\portraits\ChatGPT Image May 11, 2026, 12_10_26 PM.png"
OUT_DIR = os.path.dirname(SRC)

ROWS, COLS = 4, 5

LABELS = {
    (0, 0): "female_11", (0, 1): "male_11",   (0, 2): "female_12", (0, 3): "male_12",   (0, 4): "female_13",
    (1, 0): "male_13",   (1, 1): "female_14", (1, 2): "female_15", (1, 3): "male_14",   (1, 4): "female_16",
    (2, 0): "female_17", (2, 1): "male_15",   (2, 2): "female_18", (2, 3): "male_16",   (2, 4): "female_19",
    (3, 0): "male_17",   (3, 1): "female_20", (3, 2): "male_18",   (3, 3): "female_21", (3, 4): "male_19",
}


def seam_centers(values: np.ndarray, n_seams: int, threshold: float = 245.0) -> list[int]:
    """Return the n_seams interior seam center positions where mean brightness is high.

    Groups contiguous bright indices into runs, drops the leading and trailing runs
    (the image's outer borders), and returns the median of each remaining run.
    """
    bright = np.where(values > threshold)[0]
    if len(bright) == 0:
        raise RuntimeError("No bright seams found - threshold too high?")

    runs: list[list[int]] = [[bright[0]]]
    for i in bright[1:]:
        if i == runs[-1][-1] + 1:
            runs[-1].append(int(i))
        else:
            runs.append([int(i)])

    L = len(values)
    interior = [r for r in runs if r[0] > 0 and r[-1] < L - 1]

    if len(interior) != n_seams:
        interior = sorted(runs, key=len, reverse=True)[:n_seams]
        interior.sort(key=lambda r: r[0])

    return [int(np.median(r)) for r in interior]


def main():
    src = Image.open(SRC)
    W, H = src.size
    gray = np.array(src.convert("L"))

    row_centers = seam_centers(gray.mean(axis=1), ROWS - 1)
    col_centers = seam_centers(gray.mean(axis=0), COLS - 1)
    print(f"row seam centers: {row_centers}")
    print(f"col seam centers: {col_centers}")

    y_bounds = [0] + row_centers + [H]
    x_bounds = [0] + col_centers + [W]

    for row in range(ROWS):
        for col in range(COLS):
            box = (x_bounds[col], y_bounds[row], x_bounds[col + 1], y_bounds[row + 1])
            tile = src.crop(box)
            name = LABELS[(row, col)] + ".png"
            tile.save(os.path.join(OUT_DIR, name))
            print(f"  {name}  {box}  size={tile.size}")

    print(f"\nDone. {ROWS * COLS} files in {OUT_DIR}")


if __name__ == "__main__":
    main()
