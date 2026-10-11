#!/usr/bin/env python3
"""Scan ad copy (schema.ts, CONCEPT-N.md, a caption file) for claims that break
the BetaalBuddy copy rules. A hit is a prompt to look, not an automatic error:
judge each one (e.g. "€40" is fine when phrased as "kan uitlopen op").

Usage: check_copy.py <file> [<file> ...] [--rules path/to/copy-rules.txt]
Exit code: 0 = no hits, 1 = hits to review.
"""
import argparse
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_RULES = os.path.join(HERE, "..", "references", "copy-rules.txt")
NEGATIONS = re.compile(r"\b(geen|niet|nooit|zonder|no|not|never)\b[^.\n]{0,40}$", re.IGNORECASE)


def load_rules(path: str):
    rules = []
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            pattern, _, reason = line.partition("||")
            rules.append((re.compile(pattern.strip(), re.IGNORECASE), reason.strip()))
    return rules


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+")
    ap.add_argument("--rules", default=DEFAULT_RULES)
    args = ap.parse_args()

    rules = load_rules(args.rules)
    hits = 0
    for path in args.files:
        with open(path, encoding="utf-8") as fh:
            for n, line in enumerate(fh, start=1):
                for rx, reason in rules:
                    for m in rx.finditer(line):
                        before = line[: m.start()]
                        negated = bool(NEGATIONS.search(before))
                        tag = "  (ontkend, waarschijnlijk ok)" if negated else ""
                        print(f"{path}:{n}: '{m.group(0)}' -> {reason}{tag}")
                        print(f"    {line.strip()[:160]}")
                        hits += 1
    if hits == 0:
        print("Geen treffers.")
        return 0
    print(f"\n{hits} treffer(s) om te beoordelen.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
