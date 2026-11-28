#!/usr/bin/env python3
"""Make public/vo/<slug>/timing.json from the voice-over text with [S1]..[Sn] markers.

  python3 scripts/vo_to_timing.py <slug> --from-alignment   # uses public/vo/<slug>/vo.json (ElevenLabs with-timestamps)
  python3 scripts/vo_to_timing.py <slug> --estimate         # no audio yet: ~5 syllables/s, 0.35 s per full stop, 0.2 s per comma

Reads public/vo/<slug>/script.txt (the text WITH markers; markers never go to ElevenLabs).
Writes fps, source, markers, sceneStarts, voiceEnd, durationInFrames (voice end + ~1 s CTA), words[].
"""
import json, re, sys, pathlib

FPS = 30
TAIL = 30  # ~1 s for the CTA after the last word

def syllables(w):
    w = re.sub(r"[^a-zà-ÿ]", "", w.lower())
    if w == "ai":
        return 2
    return max(1, len(re.findall(r"[aeiouyàáâäèéêëïíîóôöúûü]+", w)))

def main():
    slug, mode = sys.argv[1], sys.argv[2]
    root = pathlib.Path(__file__).resolve().parent.parent / "public" / "vo" / slug
    script = (root / "script.txt").read_text().strip()
    tokens = script.split()
    markers, words = [], []  # words: (text, marker-index-start?)
    pending = None
    for t in tokens:
        m = re.fullmatch(r"\[(S\d+)\]", t)
        if m:
            pending = m.group(1)
            continue
        words.append({"w": t, "marker": pending})
        if pending:
            markers.append(pending)
        pending = None

    if mode == "--from-alignment":
        a = json.loads((root / "vo.json").read_text())
        al = a.get("alignment") or a.get("normalized_alignment")
        chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
        text = "".join(chars)
        clean = " ".join(w["w"] for w in words)
        if text.strip() != clean:
            print("WARNING: alignment text differs from script; matching by position", file=sys.stderr)
        pos = 0
        for w in words:
            i = text.find(w["w"], pos)
            if i < 0:
                sys.exit(f"word not found in alignment: {w['w']}")
            j = i + len(w["w"]) - 1
            w["start"], w["end"] = round(st[i] * FPS), round(en[j] * FPS)
            pos = j + 1
        source = "alignment.character_start_times_seconds"
    else:
        t = 0.0
        for w in words:
            d = syllables(w["w"]) / 5.0
            w["start"], w["end"] = round(t * FPS), round((t + d) * FPS)
            t += d + 0.06
            if w["w"][-1] in ".?!":
                t += 0.35
            elif w["w"][-1] == ",":
                t += 0.2
        source = "estimate (5 syl/s), replace with --from-alignment once audio exists"

    starts = [w["start"] for w in words if w["marker"]]
    if len(starts) != len(markers):
        sys.exit("marker count mismatch")
    starts[0] = 0
    end = words[-1]["end"]
    out = {
        "fps": FPS,
        "source": source,
        "markers": markers,
        "sceneStarts": starts,
        "voiceEnd": end,
        "durationInFrames": end + TAIL,
        "words": [{"w": w["w"], "start": w["start"], "end": w["end"]} for w in words],
    }
    (root / "timing.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
    print(json.dumps({k: out[k] for k in ("source", "sceneStarts", "voiceEnd", "durationInFrames")}))

main()
