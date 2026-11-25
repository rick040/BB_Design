#!/usr/bin/env python3
"""Schat woord- en scènetijden voor een voice-over zonder audio.

Gebruik: python3 tools/vo_estimate.py vo-tekst.txt public/vo/<slug>/timing.json
De tekst bevat [S1], [S2] ... markers. Uitkomst heeft hetzelfde formaat als
een timing.json uit de ElevenLabs-alignment (source = "schatting"), zodat de
animatie er al op kan draaien. Vervang hem door de echte timing zodra de take er is.
"""
import json, re, sys

FPS = 30
SYL_PER_S = 5.0      # ~ ElevenLabs Speed 1.0
PAUSE_STOP = 0.35    # na . ? !
PAUSE_COMMA = 0.18
CTA_TAIL = 1.0       # seconden na het laatste woord

def syllables(word):
    w = re.sub(r"[^a-zäëïöüé]", "", word.lower())
    groups = re.findall(r"[aeiouyäëïöüé]+", w)
    return max(1, len(groups))

def main(src, dst):
    text = open(src, encoding="utf-8").read().strip()
    tokens = re.findall(r"\[S\d+\]|\S+", text)
    t = 0.0
    words, starts, markers, pending = [], [], [], None
    for tok in tokens:
        if re.fullmatch(r"\[S\d+\]", tok):
            pending = tok[1:-1]
            continue
        dur = syllables(tok) / SYL_PER_S
        start = t
        if pending:
            markers.append(pending); starts.append(round(start * FPS)); pending = None
        t += dur
        words.append({"w": tok, "start": round(start * FPS), "end": round(t * FPS)})
        if tok[-1] in ".?!":
            t += PAUSE_STOP
        elif tok[-1] == ",":
            t += PAUSE_COMMA
    voice_end = words[-1]["end"]
    out = {"fps": FPS, "source": "schatting (geen audio; vervang door alignment)",
           "markers": markers, "sceneStarts": starts, "voiceEnd": voice_end,
           "durationInFrames": voice_end + round(CTA_TAIL * FPS), "words": words}
    json.dump(out, open(dst, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(f"{len(words)} woorden, stem {voice_end/FPS:.2f} s, totaal {out['durationInFrames']/FPS:.2f} s, scènes {starts}")

if __name__ == "__main__":
    main(*sys.argv[1:3])
