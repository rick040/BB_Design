#!/usr/bin/env python3
"""Tile rendered stills into one contact sheet so you can review many frames at once.

Usage: contact_sheet.py <dir> <filename-prefix> <out.png> [cols=5] [thumb_width=340]
"""
import glob
import os
import sys

from PIL import Image, ImageDraw


def main() -> None:
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(2)
    src, prefix, out = sys.argv[1], sys.argv[2], sys.argv[3]
    cols = int(sys.argv[4]) if len(sys.argv) > 4 else 5
    tw = int(sys.argv[5]) if len(sys.argv) > 5 else 340

    files = sorted(glob.glob(os.path.join(src, prefix + "*.png")))
    if not files:
        print(f"No files matching {prefix}*.png in {src}")
        sys.exit(1)
    images = [Image.open(f).convert("RGB") for f in files]
    th = int(images[0].height * tw / images[0].width)
    rows = (len(images) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (tw + 10) + 10, rows * (th + 40) + 10), (40, 40, 48))
    draw = ImageDraw.Draw(sheet)
    for i, (f, im) in enumerate(zip(files, images)):
        x = 10 + (i % cols) * (tw + 10)
        y = 10 + (i // cols) * (th + 40)
        sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y))
        draw.text((x, y + th + 8), os.path.basename(f), fill=(255, 255, 0))
    sheet.save(out)
    print(out, sheet.size)


if __name__ == "__main__":
    main()
