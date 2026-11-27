#!/usr/bin/env python3
"""Build public/vo/<slug>/timing.json from the voice-over script.

Usage: python3 scripts/vo_timing.py <slug> [--fps 30] [--tail 30]

Reads public/vo/<slug>/script.txt (the voice-over with [S1], [S2] ... scene
markers; the markers are never sent to ElevenLabs).
- If public/vo/<slug>/vo.json exists (ElevenLabs /with-timestamps response),
  word starts come from alignment.character_start_times_seconds (exact).
- Otherwise, if voice-over.mp3 exists, sentence starts come from
  ffmpeg silencedetect (noise=-35dB, d=0.2) and words are spread inside them.
- Otherwise the timing is ESTIMATED (~5 syllables per second) so the
  animation can be built before the voice exists. Re-run this script after
  generating the voice and the whole animation follows the real take.
"""
import json, re, subprocess, sys
from pathlib import Path

args = sys.argv[1:]
slug = args[0]
fps = int(args[args.index("--fps") + 1]) if "--fps" in args else 30
tail = int(args[args.index("--tail") + 1]) if "--tail" in args else 30
root = Path(__file__).resolve().parent.parent / "public" / "vo" / slug
raw = (root / "script.txt").read_text(encoding="utf-8").strip()

# Split into words, remembering which word each marker precedes.
tokens = re.findall(r"\[S\d+\]|\S+", raw)
words, markers, marker_word = [], [], []
for t in tokens:
    if re.fullmatch(r"\[S\d+\]", t):
        markers.append(t[1:-1])
        marker_word.append(len(words))
    else:
        words.append(t)
text = " ".join(words)

def syllables(w):
    return max(1, len(re.findall(r"[aeiouyáéëïóöüè]+", w.lower())))

def estimate():
    out, t = [], 0.0
    for w in words:
        d = 0.2 * syllables(w)
        out.append((t, t + d))
        t += d + 0.04
        if w.endswith((".", "?", "!")):
            t += 0.35
        elif w.endswith(","):
            t += 0.18
    return out, "estimate (~5 syllables/s); replace by re-running after generating the voice"

def from_alignment(al):
    chars, starts, ends = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    out, i = [], 0
    for w in words:
        while i < len(chars) and chars[i].isspace():
            i += 1
        s = starts[i]
        i += len(w)
        out.append((s, ends[i - 1]))
    assert "".join(chars).split() == words, "alignment text differs from script.txt"
    return out, "alignment.character_start_times_seconds"

def from_silence(mp3):
    log = subprocess.run(["ffmpeg", "-i", str(mp3), "-af", "silencedetect=noise=-35dB:d=0.2", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)],
                               capture_output=True, text=True).stdout)
    sent = [i for i, w in enumerate(words) if i == 0 or words[i - 1].endswith((".", "?", "!"))]
    first = ends[0] if ends and ends[0] < 0.6 else 0.0
    starts = [first] + [e for e in ends if e > first + 0.1][: len(sent) - 1]
    assert len(starts) == len(sent), f"silencedetect found {len(starts)} sentence starts, expected {len(sent)}"
    out, est = [], estimate()[0]
    bounds = starts + [dur]
    for k, si in enumerate(sent):
        ei = sent[k + 1] if k + 1 < len(sent) else len(words)
        a, b = est[si][0], est[ei - 1][1]
        for j in range(si, ei):
            f = lambda x: bounds[k] + (x - a) / (b - a) * (bounds[k + 1] - bounds[k] - 0.15)
            out.append((f(est[j][0]), f(est[j][1])))
    return out, "ffmpeg silencedetect (noise=-35dB, d=0.2)"

if (root / "vo.json").exists() and "alignment" in json.loads((root / "vo.json").read_text()):
    times, source = from_alignment(json.loads((root / "vo.json").read_text())["alignment"])
elif (root / "voice-over.mp3").exists():
    times, source = from_silence(root / "voice-over.mp3")
else:
    times, source = estimate()

F = lambda s: int(round(s * fps))
scene_starts = [F(times[i][0]) for i in marker_word]
scene_starts[0] = 0 if scene_starts[0] < 6 else scene_starts[0]
voice_end = F(times[-1][1])
data = {
    "fps": fps,
    "source": source,
    "estimated": source.startswith("estimate"),
    "text": text,
    "markers": markers,
    "sceneStarts": scene_starts,
    "voiceEnd": voice_end,
    "durationInFrames": voice_end + tail,
    "words": [{"w": w, "start": F(a), "end": F(b)} for w, (a, b) in zip(words, times)],
}
(root / "timing.json").write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n")
gaps = [times[i + 1][0] - times[i][1] for i in range(len(times) - 1)]
print(f"{source}: {len(words)} words, scenes {scene_starts}, voice end {voice_end} f ({voice_end / fps:.2f} s), "
      f"total {voice_end + tail} f, longest gap {max(gaps):.2f} s")
