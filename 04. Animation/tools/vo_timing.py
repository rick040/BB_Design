#!/usr/bin/env python3
"""Build public/vo/<slug>/timing.json from a voice-over script with [S1]..[Sn] markers.

  python3 tools/vo_timing.py <script.txt> <out timing.json> [--alignment vo.json] [--cta-seconds 1.0]

With --alignment (ElevenLabs /with-timestamps response) the word and scene starts are
measured from alignment.character_start_times_seconds. Without it they are an estimate
(about 2.6 words per second plus pauses at punctuation), marked "source": "estimate",
so the animation can be built before the voice exists and re-timed later by rerunning
this script with the real alignment.
"""
import json, re, sys

FPS = 30
args = sys.argv[1:]
script_path, out_path = args[0], args[1]
align = None
cta = 1.0
if "--alignment" in args:
    align = json.load(open(args[args.index("--alignment") + 1]))["alignment"]
if "--cta-seconds" in args:
    cta = float(args[args.index("--cta-seconds") + 1])

raw = open(script_path, encoding="utf-8").read().strip()
parts = re.split(r"\[(S\d+)\]", raw)
markers, words, marker_word = [], [], []
for i in range(1, len(parts), 2):
    markers.append(parts[i])
    marker_word.append(len(words))
    words += parts[i + 1].split()
text = " ".join(words)

starts, ends = [], []
if align:
    chars = align["characters"]
    cs = align["character_start_times_seconds"]
    ce = align["character_end_times_seconds"]
    spoken = "".join(chars)
    assert spoken.strip() == text, "alignment text differs from script"
    pos = 0
    for w in words:
        k = spoken.index(w, pos)
        starts.append(cs[k]); ends.append(ce[k + len(w) - 1]); pos = k + len(w)
    source = "alignment.character_start_times_seconds"
else:
    t = 0.0
    for w in words:
        core = re.sub(r"[^\wÀ-ÿ]", "", w)
        d = 0.09 + 0.048 * len(core)
        starts.append(t); ends.append(t + d)
        t += d + (0.30 if w[-1] in ".?!" else 0.12 if w[-1] == "," else 0.04)
    source = "estimate"

f = lambda s: int(round(s * FPS))
voice_end = f(ends[-1])
out = {
    "fps": FPS,
    "source": source,
    "markers": markers,
    "sceneStarts": [f(starts[i]) for i in marker_word],
    "voiceEnd": voice_end,
    "durationInFrames": voice_end + f(cta),
    "words": [{"w": w, "start": f(s), "end": f(e)} for w, s, e in zip(words, starts, ends)],
}
json.dump(out, open(out_path, "w"), indent=1, ensure_ascii=False)
gaps = [starts[i + 1] - ends[i] for i in range(len(words) - 1)]
print(f"{source}: {len(words)} words, voice {ends[-1]:.2f}s, total {out['durationInFrames']/FPS:.2f}s, "
      f"scenes {out['sceneStarts']}, longest pause {max(gaps):.2f}s")
