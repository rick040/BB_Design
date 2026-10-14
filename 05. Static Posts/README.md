# 05. Static Posts

Statische Instagram-posts voor BetaalBuddy in 1080×1350 (4:5).

- `build.py`: alle posts staan in `POSTS`. `python3 build.py` bouwt alles, `python3 build.py 03 05` alleen die posts. Vereist Python met `playwright` en Chromium.
- `src/`: bewerkbare HTML per post.
- `renders/`: PNG's om te posten.
- `captions.md`: captions, alt-tekst en open controles per post.

Merk, fonts en Buddy komen uit `04. Animation` (zelfde paden en kleuren). Skill: `.claude/skills/instagram-static-post`.
