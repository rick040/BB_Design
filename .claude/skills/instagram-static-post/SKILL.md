---
name: instagram-static-post
description: Maakt van een idee, of van "bedenk er een", een statische Instagram-post voor BetaalBuddy in 1080x1350 (4:5 portret), als PNG plus bewerkbare HTML, met caption en alt-tekst. Gebruik deze skill als iemand een statische post, afbeelding, feedpost, carrousel-slide of "geen animatie, gewoon een plaatje" voor BetaalBuddy wil, of een idee uit de statische postlijst wil uitwerken. Voor animaties en Reels gebruik je instagram-reel-ad.
---

# Instagram statische post (1080×1350)

Zelfde merk, producttaal en copyregels als `instagram-reel-ad`. Lees eerst `../instagram-reel-ad/references/brand-betaalbuddy.md` en de actuele changelog; bij een botsing wint de changelog.

## Werkwijze
1. **Idee scherpen.** Eén gedachte per post: hoek (levensmoment, mentale belasting, kosten, achteraf betalen, privacy, demo, humor, relaties, zorg), één kop van maximaal ~8 woorden, één beeld. Zonder idee: kies de hoek die het verst afstaat van de posts in `05. Static Posts/captions.md`.
2. **Meta-regel.** Beschrijf situaties of schrijf in de ik-vorm; spreek de kijker nooit aan op schulden, achterstand of rood staan. Geen gebruikersaantallen, quotes of reviews.
3. **Bouwen.** Voeg in `05. Static Posts/build.py` een functie `pNN()` toe en een regel in `POSTS`. Gebruik de bestaande helpers (`buddy`, `bill`, `glyph`, `app_icon`, `page`). Licht of blauw afwisselen. Kop: Space Grotesk 500, tracking −0.06em. Houd tekst tussen x 90 en 990 en laat onder y 1180 ruimte voor woordmerk en chip.
4. **Renderen en kijken.** `python3 build.py NN` en bekijk de PNG (of een contact sheet). Let op: tekst die in twee regels breekt op een slechte plek (gebruik `<br>`), overlap met de footer, lege gaten tussen kop en beeld.
5. **Copycheck.** `python3 ../.claude/skills/instagram-reel-ad/scripts/check_copy.py captions.md build.py`. Beoordeel elke treffer.
6. **Caption.** Hook in de eerste ~125 tekens, korte stappen met emoji, "Geen app. Geen bankkoppeling.", "link in bio", 5 hashtags, plus alt-tekst. Zet alles in `captions.md`.
7. **Opleveren.** Commit naar de werkbranch, geen PR tenzij gevraagd. Stuur de PNG's naar de gebruiker. Nederlands antwoord, kort.

## Uitvoer
`05. Static Posts/renders/BB-Post-NN-slug.png` (1080×1350) en `src/NN-slug.html` (open in een browser om tekst aan te passen en daarna opnieuw te renderen).
