#!/usr/bin/env python3
"""Turn scene lengths + scene-local beat frames into global times, the same
way Remotion's TransitionSeries lays them out (each transition overlaps the
end of one scene with the start of the next).

Use it to write a voice-over cue sheet that matches the animation exactly.

Examples:
  timeline.py --scenes 3.2,5.4,3.2,3.4 --transition 0.4
  timeline.py --scenes 3.2,5.4,3.2,3.4 --events "1:58=Aanmaning,2:32=Buddy landt"
  timeline.py --scenes 3.2,5.4,3.2,3.4 --beats-from "1=src/x/scenes/HookScene.tsx,2=src/x/scenes/MainScene.tsx"

--events      scene:frame[=label], scenes counted from 1.
--beats-from  scene=file pairs. Reads beat constants from scene files:
              - the preferred convention, an exported object per scene:
                  export const HOOK_T = { flag: 44, seen: 52, seenStagger: 4 };
                (keys ending in Len, Stagger, Dur or Duration are durations and are skipped);
              - scalars named T_* (e.g. `const T_LAND = 32;`, `const T_HOP = T_LAND + 8;`);
              - number arrays named ARRIVALS / HOPS / T_* (e.g. `const ARRIVALS = [20, 40, 60];`).
All beats are printed sorted by time.
"""
import argparse
import ast
import math
import operator
import re

OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
       ast.Div: operator.truediv, ast.FloorDiv: operator.floordiv}


def to_frames(seconds: float, fps: int) -> int:
    # Same as Math.round(s * fps) in the schema helpers.
    return int(math.floor(seconds * fps + 0.5))


def safe_eval(expr: str, env: dict):
    def ev(node):
        if isinstance(node, ast.Expression):
            return ev(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return node.value
        if isinstance(node, ast.Name) and node.id in env:
            return env[node.id]
        if isinstance(node, ast.BinOp) and type(node.op) in OPS:
            return OPS[type(node.op)](ev(node.left), ev(node.right))
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub):
            return -ev(node.operand)
        raise ValueError(expr)
    return ev(ast.parse(expr.strip(), mode="eval"))


SCALAR = re.compile(r"^\s*(?:export\s+)?const\s+(T_[A-Z0-9_]+)\s*=\s*([^;\n]+);", re.M)
OBJECT = re.compile(r"^\s*(?:export\s+)?const\s+([A-Z][A-Z0-9_]*_T)\s*=\s*\{(.*?)\}\s*(?:as\s+const\s*)?;", re.M | re.S)
OBJ_ENTRY = re.compile(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([^,\n]+?)\s*,?\s*(?://.*)?$", re.M)
DURATION_KEY = re.compile(r"(Len|Stagger|Dur|Duration)$")
ARRAY = re.compile(r"^\s*(?:export\s+)?const\s+(ARRIVALS|HOPS|T_[A-Z0-9_]+)\s*=\s*\[([^\]]*)\]", re.M)


def beats_from_file(path: str):
    text = open(path, encoding="utf-8").read()
    env, out = {}, []
    for m in OBJECT.finditer(text):
        obj, body = m.group(1), m.group(2)
        local = {}
        for e in OBJ_ENTRY.finditer(body):
            key, expr = e.group(1), e.group(2)
            try:
                v = int(round(safe_eval(expr, {**env, **local})))
            except (ValueError, SyntaxError):
                continue
            local[key] = v
            if not DURATION_KEY.search(key):
                out.append((f"{obj}.{key}", v))
    for m in sorted(list(SCALAR.finditer(text)) + list(ARRAY.finditer(text)), key=lambda m: m.start()):
        name, body = m.group(1), m.group(2)
        if m.re is ARRAY:
            vals = []
            for item in body.split(","):
                if item.strip():
                    try:
                        vals.append(int(round(safe_eval(item, env))))
                    except (ValueError, SyntaxError):
                        pass
            for i, v in enumerate(vals):
                out.append((f"{name}[{i}]", v))
        else:
            try:
                v = int(round(safe_eval(body, env)))
            except (ValueError, SyntaxError):
                continue
            env[name] = v
            out.append((name, v))
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--scenes", required=True, help="scene lengths in seconds, comma separated")
    ap.add_argument("--transition", type=float, default=0.4, help="transition length in seconds")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--events", default="", help='scene:frame[=label], comma separated')
    ap.add_argument("--beats-from", default="", help='scene=file pairs, comma separated')
    args = ap.parse_args()

    fps = args.fps
    lengths = [to_frames(float(s), fps) for s in args.scenes.split(",") if s.strip()]
    t = to_frames(args.transition, fps)

    starts, cursor = [], 0
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

    beats = []  # (global_frame, label, scene, local)
    for raw in filter(None, (r.strip() for r in args.events.split(","))):
        spec, _, label = raw.partition("=")
        scene_s, _, frame_s = spec.partition(":")
        scene, frame = int(scene_s), int(frame_s)
        if not 1 <= scene <= len(lengths):
            raise SystemExit(f"Scene {scene} out of range 1..{len(lengths)}")
        beats.append((starts[scene - 1] + frame, label or "-", scene, frame))
    for raw in filter(None, (r.strip() for r in args.beats_from.split(","))):
        scene_s, _, path = raw.partition("=")
        scene = int(scene_s)
        if not 1 <= scene <= len(lengths):
            raise SystemExit(f"Scene {scene} out of range 1..{len(lengths)}")
        for name, frame in beats_from_file(path.strip()):
            beats.append((starts[scene - 1] + frame, name, scene, frame))

    if beats:
        print()
        print("| Time (s) | Beat | Scene:frame | Global frame |")
        print("|---|---|---|---|")
        for g, label, scene, frame in sorted(beats):
            flag = "  (in overgang)" if scene > 1 and frame < t else ""
            print(f"| {g / fps:.2f} | {label}{flag} | {scene}:{frame} | {g} |")


if __name__ == "__main__":
    main()
