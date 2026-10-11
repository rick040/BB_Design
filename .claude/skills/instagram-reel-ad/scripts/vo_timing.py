#!/usr/bin/env python3
"""Build an ElevenLabs paste block (with <break> tags) from voice-over lines and
the second each line should start, and warn where lines will overlap.

Input: a text file (or stdin with "-"), one line per sentence group:
    0.0 | Moet een app echt al je mail lezen?
    3.1 | Buddy niet.
    4.0 | Hij kijkt niet in je mailbox.
Start times come from timeline.py (the visual beat each line belongs to,
plus 0 to 0.4 s).

Usage:
    vo_timing.py lines.txt --total 13.6 [--rate 5.0] [--pause 0.3]

Estimates: Dutch ad read is ~5 syllables/s, plus ~0.3 s natural pause after
. ? ! and ~0.2 s per comma or colon. These are estimates: the visual beats
are exact, the spoken timing is not. Check the generated mp3 length.
"""
import argparse
import re
import sys

VOWELS = re.compile(r"[aeiouyàáâäèéêëìíîïòóôöùúûü]+", re.IGNORECASE)


def syllables(text: str) -> int:
    count = 0
    for word in re.findall(r"[A-Za-zÀ-ÿ]+", text):
        count += max(1, len(VOWELS.findall(word)))
    return count


def speak_seconds(text: str, rate: float) -> float:
    commas = len(re.findall(r"[,:;]", text))
    return syllables(text) / rate + 0.2 * commas


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", help='lines file, or "-" for stdin')
    ap.add_argument("--total", type=float, required=True, help="video length in seconds")
    ap.add_argument("--rate", type=float, default=5.0, help="syllables per second (default 5.0)")
    ap.add_argument("--pause", type=float, default=0.3, help="natural pause after a sentence (s)")
    args = ap.parse_args()

    src = sys.stdin if args.file == "-" else open(args.file, encoding="utf-8")
    rows = []
    for raw in src:
        raw = raw.strip()
        if not raw or raw.startswith("#"):
            continue
        start_s, _, text = raw.partition("|")
        rows.append((float(start_s.strip().replace(",", ".")), text.strip()))
    rows.sort(key=lambda r: r[0])
    if not rows:
        print("Geen regels gevonden.")
        return 2

    parts, table, warnings = [], [], []
    cursor = 0.0  # when the voice is free again (end of previous line + natural pause)
    for i, (target, text) in enumerate(rows):
        if re.search(r"\d", text):
            warnings.append(f"Regel {i + 1} bevat cijfers: schrijf getallen en bedragen uit voor een goede uitspraak.")
        gap = target - cursor
        if gap > 0.05:
            b = gap
            while b > 0.05:
                chunk = min(b, 3.0)
                parts.append(f'<break time="{chunk:.1f}s" />')
                b -= chunk
            actual = target
        else:
            actual = cursor
            if gap < -0.15:
                warnings.append(
                    f"Regel {i + 1} start ~{-gap:.1f} s later dan zijn beat ({target:.1f} s → ~{actual:.1f} s). "
                    "Kort de vorige zin in of schuif de beat op."
                )
        dur = speak_seconds(text, args.rate)
        end = actual + dur
        ends_sentence = text.rstrip()[-1:] in ".?!"
        cursor = end + (args.pause if ends_sentence else 0.1)
        parts.append(text)
        table.append((target, actual, end, syllables(text), text))

    final_end = table[-1][2]
    if final_end > args.total - 0.3:
        warnings.append(
            f"De voice-over eindigt rond {final_end:.1f} s, te dicht op of na het einde ({args.total:.1f} s). "
            "Haal woorden weg of verhoog de snelheid."
        )

    print("PASTE-BLOK (ElevenLabs Multilingual v2):")
    print()
    print(" ".join(parts))
    print()
    print("| Doel (s) | Geschat start (s) | Geschat eind (s) | Lettergrepen | Zin |")
    print("|---|---|---|---|---|")
    for target, actual, end, syl, text in table:
        print(f"| {target:.1f} | {actual:.1f} | {end:.1f} | {syl} | {text} |")
    words = sum(len(t[4].split()) for t in table)
    print()
    print(f"Geschatte mp3-lengte: ~{final_end:.1f} s ({words} woorden, {args.rate} lettergrepen/s). Video: {args.total:.1f} s.")
    for w in warnings:
        print(f"WAARSCHUWING: {w}")
    return 1 if warnings else 0


if __name__ == "__main__":
    sys.exit(main())
