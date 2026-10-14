#!/usr/bin/env python3
"""Register van gemaakte posts (gedaan.json), zodat er nooit dubbele worden gemaakt.

  python3 registry.py list
  python3 registry.py check <nr> "<kop>" "<hoek>" "<idee>"   # exit 1 = al gedaan of te veel gelijk
  python3 registry.py add <nr> <slug> "<kop>" "<hoek>" "<idee>"
"""
import datetime
import difflib
import json
import pathlib
import re
import sys

F = pathlib.Path(__file__).resolve().parent / "gedaan.json"


def load():
    return json.loads(F.read_text(encoding="utf-8")) if F.exists() else []


def norm(s):
    return re.sub(r"[^a-z0-9€ ]", "", s.lower()).strip()


def sim(a, b):
    return difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "list"
    rows = load()
    if cmd == "list":
        for r in rows:
            print(f'{r["nr"]}  {r["datum"]}  {r["kop"]}  [{r["hoek"]}]')
    elif cmd == "check":
        nr, kop, hoek, idee = (sys.argv[2:6] + ["", "", "", ""])[:4]
        for r in rows:
            if r["nr"] == nr:
                print(f"AL GEDAAN: nr {nr} staat in het register ({r['kop']})")
                sys.exit(1)
            if sim(kop, r["kop"]) > 0.6 or (idee and sim(idee, r["idee"]) > 0.7):
                print(f"TE GELIJK: lijkt op nr {r['nr']} ({r['kop']})")
                sys.exit(1)
        print("OK: nieuw")
    elif cmd == "add":
        nr, slug, kop, hoek, idee = sys.argv[2:7]
        if any(r["nr"] == nr for r in rows):
            sys.exit(f"nr {nr} bestaat al")
        rows.append({"nr": nr, "slug": slug, "kop": kop, "hoek": hoek, "idee": idee,
                     "datum": datetime.date.today().isoformat(), "bestand": f"BB-Post-{nr}-{slug}.png"})
        F.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("toegevoegd", nr)
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
