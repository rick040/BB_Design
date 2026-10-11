#!/usr/bin/env python3
"""Tile rendered stills into one contact sheet so you can review many frames at once.

Only picks up frame stills named <prefix>-<number>.png (what render_stills.cjs
writes), so covers and other PNGs in the same folder are ignored. Each still
keeps its own aspect ratio, so Reel and Feed frames can share a folder.

Usage: contact_sheet.py <dir> <filename-prefix> <out.png> [cols=5] [thumb_width=340]
"""
import os
import re
import sys

from PIL import Image, ImageDraw


def main() -> None:
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(2)
    src, prefix, out = sys.argv[1], sys.argv[2], sys.argv[3]
    cols = int(sys.argv[4]) if len(sys.argv) > 4 else 5
    tw = int(sys.argv[5]) if len(sys.argv) > 5 else 340

    pat = re.compile(rf"^{re.escape(prefix)}.*-\d+\.png$")
    files = sorted(os.path.join(src, f) for f in os.listdir(src) if pat.match(f))
    if not files:
        print(f"No files matching {prefix}*-<frame>.png in {src}")
        sys.exit(1)
    images = [Image.open(f).convert("RGB") for f in files]
    thumbs = [im.resize((tw, int(im.height * tw / im.width)), Image.LANCZOS) for im in images]
    rows = [thumbs[i:i + cols] for i in range(0, len(thumbs), cols)]
    row_h = [max(t.height for t in r) for r in rows]
    sheet = Image.new("RGB", (cols * (tw + 10) + 10, sum(h + 40 for h in row_h) + 10), (40, 40, 48))
    draw = ImageDraw.Draw(sheet)
    y = 10
    idx = 0
    for r, h in zip(rows, row_h):
        for c, th in enumerate(r):
            x = 10 + c * (tw + 10)
            sheet.paste(th, (x, y))
            draw.text((x, y + h + 8), os.path.basename(files[idx]), fill=(255, 255, 0))
            idx += 1
        y += h + 40
    sheet.save(out)
    print(out, sheet.size)


if __name__ == "__main__":
    main()
