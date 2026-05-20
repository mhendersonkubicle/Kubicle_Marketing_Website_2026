"""Build a labeled contact sheet of all portrait PNGs for visual review."""
from PIL import Image, ImageDraw, ImageFont
import os
import glob

PORTRAITS_DIR = r"C:\Users\Mark\Desktop\Character_profiles\portraits"
OUT = r"C:\Users\Mark\Desktop\Character_profiles\contact_sheet.png"

THUMB_W = 220
THUMB_H = 180
LABEL_H = 22
COLS = 7
PAD = 4


def collect():
    paths = sorted(glob.glob(os.path.join(PORTRAITS_DIR, "*.png")))
    paths = [p for p in paths if os.path.basename(p).startswith(("male_", "female_"))]

    def key(p):
        name = os.path.splitext(os.path.basename(p))[0]
        gender_part, _, rest = name.partition("_")
        num_part, _, variant = rest.partition(".")
        return (gender_part, int(num_part), variant)

    return sorted(paths, key=key)


def main():
    paths = collect()
    n = len(paths)
    rows = (n + COLS - 1) // COLS
    sheet_w = COLS * (THUMB_W + PAD) + PAD
    sheet_h = rows * (THUMB_H + LABEL_H + PAD) + PAD
    sheet = Image.new("RGB", (sheet_w, sheet_h), "white")
    draw = ImageDraw.Draw(sheet)

    try:
        font = ImageFont.truetype("arial.ttf", 14)
    except OSError:
        font = ImageFont.load_default()

    for i, p in enumerate(paths):
        col = i % COLS
        row = i // COLS
        x = PAD + col * (THUMB_W + PAD)
        y = PAD + row * (THUMB_H + LABEL_H + PAD)

        im = Image.open(p)
        im.thumbnail((THUMB_W, THUMB_H))
        ox = x + (THUMB_W - im.size[0]) // 2
        oy = y + (THUMB_H - im.size[1]) // 2
        sheet.paste(im, (ox, oy))

        label = os.path.splitext(os.path.basename(p))[0]
        draw.text((x + 4, y + THUMB_H + 2), label, fill="black", font=font)

    sheet.save(OUT)
    print(f"Saved {OUT}  ({sheet_w}x{sheet_h}, {n} portraits)")


if __name__ == "__main__":
    main()
