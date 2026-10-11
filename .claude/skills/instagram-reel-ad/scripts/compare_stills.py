#!/usr/bin/env python3
"""Regression check for shared components: compare two folders of stills
rendered before and after a change (same file names). Reports per file how
many pixels differ.

Workflow (see references/remotion-playbook.md §5b):
  1. Before touching src/components or src/lib: render 2 frames of every
     existing composition to  before/  (render_stills.cjs accepts a comma
     separated list of composition ids).
  2. Make the change, render the same frames to  after/.
  3. compare_stills.py before/ after/

Usage: compare_stills.py <before_dir> <after_dir> [--tolerance 0]
Exit code 0 = identical (within tolerance), 1 = differences.
"""
import argparse
import os
import sys

from PIL import Image, ImageChops


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("before")
    ap.add_argument("after")
    ap.add_argument("--tolerance", type=int, default=0, help="max per-channel difference to ignore")
    args = ap.parse_args()

    names = sorted(n for n in os.listdir(args.before) if n.lower().endswith(".png"))
    if not names:
        print("Geen PNG's in", args.before)
        return 2
    bad = 0
    for n in names:
        b = os.path.join(args.before, n)
        a = os.path.join(args.after, n)
        if not os.path.exists(a):
            print(f"ONTBREEKT  {n}")
            bad += 1
            continue
        ib, ia = Image.open(b).convert("RGB"), Image.open(a).convert("RGB")
        if ib.size != ia.size:
            print(f"ANDERS     {n}: formaat {ib.size} vs {ia.size}")
            bad += 1
            continue
        r, g, bl = ImageChops.difference(ib, ia).split()
        diff = ImageChops.lighter(ImageChops.lighter(r, g), bl)  # max channel difference per pixel
        hist = diff.histogram()
        px = sum(hist[args.tolerance + 1:])
        if px:
            peak = max(i for i, c in enumerate(hist) if c)
            print(f"ANDERS     {n}: {px} pixels ({100 * px / (ib.width * ib.height):.3f}%), max verschil {peak}")
            bad += 1
        else:
            print(f"IDENTIEK   {n}")
    print(f"\n{len(names) - bad}/{len(names)} identiek.")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
