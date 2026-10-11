#!/usr/bin/env python3
"""Turn scene lengths + scene-local beat frames into global times, the same
way Remotion's TransitionSeries lays them out (each transition overlaps the
end of one scene with the start of the next).

Use it to write a voice-over cue sheet that matches the animation exactly.

Examples:
  timeline.py --scenes 3.2,5.4,3.2,3.4 --transition 0.4
  timeline.py --scenes 3.2,5.4,3.2,3.4 --transition 0.4 --events "1:58,2:8,2:32,2:44,3:36,4:60"
  timeline.py --scenes 3.2,5.4 --events "2:32=Buddy lands,2:44=Notification 1"

--events uses scene:frame (scenes counted from 1, frame = the scene-local
frame constant from the scene file), optionally followed by =label.
"""
import argparse
import math


def to_frames(seconds: float, fps: int) -> int:
    # Same as Math.round(s * fps) in the schema helpers.
    return int(math.floor(seconds * fps + 0.5))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--scenes", required=True, help="scene lengths in seconds, comma separated")
    ap.add_argument("--transition", type=float, default=0.4, help="transition length in seconds")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--events", default="", help='scene:frame[=label], comma separated, e.g. "2:32=Buddy lands"')
    args = ap.parse_args()

    fps = args.fps
    lengths = [to_frames(float(s), fps) for s in args.scenes.split(",") if s.strip()]
    t = to_frames(args.transition, fps)

    starts = []
    cursor = 0
    for i, n in enumerate(lengths):
        starts.append(cursor)
        cursor += n - (t if i < len(lengths) - 1 else 0)
    total = cursor

    print(f"Total: {total} frames = {total / fps:.2f} s  (fps {fps}, transition {t} frames)")
    print()
    print("| Scene | Start (s) | End (s) | Frames | Transition in |")
    print("|---|---|---|---|---|")
    for i, (s, n) in enumerate(zip(starts, lengths), start=1):
        tin = f"{s / fps:.2f}–{(s + t) / fps:.2f} s" if i > 1 else "—"
        print(f"| {i} | {s / fps:.2f} | {(s + n) / fps:.2f} | {s}–{s + n} | {tin} |")

    if args.events.strip():
        print()
        print("| Event | Scene:frame | Global frame | Time (s) |")
        print("|---|---|---|---|")
        for raw in args.events.split(","):
            raw = raw.strip()
            if not raw:
                continue
            spec, _, label = raw.partition("=")
            scene_s, _, frame_s = spec.partition(":")
            scene, frame = int(scene_s), int(frame_s)
            if not 1 <= scene <= len(lengths):
                raise SystemExit(f"Scene {scene} out of range 1..{len(lengths)}")
            g = starts[scene - 1] + frame
            print(f"| {label or '-'} | {scene}:{frame} | {g} | {g / fps:.2f} |")


if __name__ == "__main__":
    main()
