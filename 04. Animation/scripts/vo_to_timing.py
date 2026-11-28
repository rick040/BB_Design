#!/usr/bin/env python3
"""Build public/vo/<concept>/timing.json from a marked voice-over script.

The script file holds the voice-over text with [S1], [S2] ... markers where
each scene starts (markers are never sent to ElevenLabs).

Two modes:
  --alignment vo.json   measured: uses alignment.character_start_times_seconds
                        from the ElevenLabs /with-timestamps response
  (no --alignment)      estimate: ~5 syllables per second (Speed 1.0),
                        0.3 s after a sentence, 0.15 s after a comma

Usage:
  python3 scripts/vo_to_timing.py public/vo/buizenpost/script.txt \
      public/vo/buizenpost/timing.json [--alignment public/vo/buizenpost/vo.json] \
      [--tail 1.0] [--fps 30]
"""
import argparse
import json
import math
import re


def syllables(word: str) -> int:
    w = re.sub(r"[^a-zà-ÿ]", "", word.lower())
    groups = re.findall(r"[aeiouyàáâäèéêëìíîïòóôöùúûü]+", w)
    return max(1, len(groups))


def parse(script: str):
    tokens = script.split()
    words, markers = [], []
    for t in tokens:
        m = re.fullmatch(r"\[(S\d+)\]", t)
        if m:
            markers.append((m.group(1), len(words)))
        else:
            words.append(t)
    return words, markers


def estimate(words, rate=5.0):
    t, out = 0.0, []
    for w in words:
        d = syllables(w) / rate
        out.append((t, t + d))
        t += d
        if w[-1] in ".?!":
            t += 0.3
        elif w[-1] == ",":
            t += 0.15
    return out


def measured(words, alignment):
    chars = alignment["characters"]
    starts = alignment["character_start_times_seconds"]
    ends = alignment["character_end_times_seconds"]
    text = "".join(chars)
    out, pos = [], 0
    for w in words:
        i = text.index(w, pos)
        j = i + len(w) - 1
        out.append((starts[i], ends[j]))
        pos = j + 1
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("out")
    ap.add_argument("--alignment")
    ap.add_argument("--tail", type=float, default=1.0)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--rate", type=float, default=5.0)
    a = ap.parse_args()

    words, markers = parse(open(a.script, encoding="utf-8").read())
    if a.alignment:
        data = json.load(open(a.alignment, encoding="utf-8"))
        al = data.get("normalized_alignment") or data.get("alignment")
        times = measured(words, data.get("alignment") or al)
        source = "alignment.character_start_times_seconds"
    else:
        times = estimate(words, a.rate)
        source = f"estimate ({a.rate} syllables/s); replace with --alignment once the voice exists"

    f = lambda s: int(round(s * a.fps))
    voice_end = f(times[-1][1])
    gaps = [times[i + 1][0] - times[i][1] for i in range(len(times) - 1)]
    res = {
        "fps": a.fps,
        "source": source,
        "markers": [m for m, _ in markers],
        "sceneStarts": [f(times[i][0]) for _, i in markers],
        "voiceEnd": voice_end,
        "durationInFrames": voice_end + int(math.ceil(a.tail * a.fps)),
        "maxGapSeconds": round(max(gaps), 3) if gaps else 0,
        "words": [{"w": w, "start": f(s), "end": f(e)} for w, (s, e) in zip(words, times)],
    }
    json.dump(res, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps({k: res[k] for k in ("source", "sceneStarts", "voiceEnd", "durationInFrames", "maxGapSeconds")}))


if __name__ == "__main__":
    main()
