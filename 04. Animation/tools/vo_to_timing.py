#!/usr/bin/env python3
"""Build public/vo/<slug>/timing.json from a voice-over text with [S1].. markers.

Modes:
  alignment  vo.json from ElevenLabs /with-timestamps (character_start_times_seconds)
  estimate   no audio yet: syllable-based estimate (~5 syllables/s, pause after . and ?)

usage: vo_to_timing.py <vo-tekst.txt> <out timing.json> [--alignment vo.json] [--cta 1.0]
"""
import json, re, sys

FPS = 30
args = sys.argv[1:]
text_path, out_path = args[0], args[1]
align = args[args.index("--alignment") + 1] if "--alignment" in args else None
cta = float(args[args.index("--cta") + 1]) if "--cta" in args else 1.0

raw = open(text_path, encoding="utf-8").read().strip()
tokens = re.findall(r"\[S\d+\]|\S+", raw)
markers, words, marker_word = [], [], []
for t in tokens:
    if re.fullmatch(r"\[S\d+\]", t):
        markers.append(t[1:-1]); marker_word.append(len(words))
    else:
        words.append(t)
spoken = " ".join(words)

def syl(w):
    return max(1, len(re.findall(r"[aeiouy]+", w.lower().replace("ij", "y"))))

out_words = []
if align:
    data = json.load(open(align))
    a = data.get("alignment") or data.get("normalized_alignment")
    chars, starts, ends = a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]
    s = "".join(chars)
    assert s.strip() == spoken.strip(), "alignment text differs from vo-tekst"
    pos = 0
    for w in words:
        i = s.index(w, pos); j = i + len(w) - 1
        out_words.append({"w": w, "start": round(starts[i] * FPS), "end": round(ends[j] * FPS)})
        pos = j + 1
    source = "alignment.character_start_times_seconds"
else:
    t = 0.0
    for w in words:
        d = syl(w) * 0.19
        out_words.append({"w": w, "start": round(t * FPS), "end": round((t + d) * FPS)})
        t += d + 0.06
        if w[-1] in ".?!": t += 0.32
        elif w[-1] == ",": t += 0.15
    source = "estimate (geen audio; ~5 lettergrepen/s)"

starts = [out_words[i]["start"] for i in marker_word]
voice_end = out_words[-1]["end"]
gaps = [(out_words[k + 1]["start"] - out_words[k]["end"]) / FPS for k in range(len(out_words) - 1)]
res = {
    "fps": FPS, "source": source, "text": spoken, "markers": markers,
    "sceneStarts": starts, "voiceEnd": voice_end,
    "durationInFrames": voice_end + round(cta * FPS),
    "maxGapSeconds": round(max(gaps), 2) if gaps else 0,
    "words": out_words,
}
json.dump(res, open(out_path, "w"), indent=1, ensure_ascii=False)
print(f"{source}: {len(words)} woorden, scènes {starts}, stem eindigt {voice_end} ({voice_end/FPS:.2f}s), totaal {res['durationInFrames']}, langste pauze {res['maxGapSeconds']}s")
