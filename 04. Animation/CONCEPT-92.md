# Concept 92 · "Vast tarief. Geen meter." (taximeter)

**USP:** `prijs` (rotatieregel: laatst in 84; daarna 85 tot 91 alle andere USP's).
**Vorm:** rekensom (de meter telt de extra kosten op, niet in 89, 90, 91).
**Metafoor:** een vergeten rekening is een taxi met de meter aan. Afgevallen: parkeerautomaat (te dicht op aftellen) en kassarol (te dicht op 78, bon).
**Uniek t.o.v. 66 (weegschaal), 76 (spaarpot), 84 (ballon):** ander visueel systeem (taximeter met lichtcijfers), Buddy springt op de vlag en zet de meter stil, einde is een vast tarief op dezelfde meter, slotbeeld Buddy als daklicht op de meter, overgangen cijferrol en koplamp. Op 5 of 6 van 6 punten anders dan elk concept in de index.

Compositie `BB-Taximeter-Reel` (1080×1920, 30 fps, 403 frames = 13,43 s), map `Concept-92-Taximeter`, code in `src/taximeter/`, render `npm run render:taximeter`. Alleen Reel met stem (geen Feed, geen stille versie, geen cover).

## Storyboard (tijden gemeten uit de ElevenLabs-alignment, `public/vo/taximeter/timing.json`)

| # | Tijd | Beeld | Stem |
|---|---|---|---|
| 1 | 0,00 s | Licht. Kop "Vergeten rekening? De meter loopt." Rekening van de Energieleverancier (€87,60) boven een taximeter EXTRA KOSTEN die per tik oploopt vanaf €0,00. | Een vergeten rekening is een taxi met de meter aan. |
| 2 | 3,20 s | Kop "En hij tikt door." Stempel AANMANING, "Te laat"; de meter versnelt en slaat op 5,03 s ("veertig") vast op €40,00, chip "Kan uitlopen op €40". | Een aanmaning kan uitlopen op veertig euro. |
| 3 | 6,23 s (cijferrol) | Blauw. "Stuur hem door." Tik op Doorsturen, de rekening vliegt in Buddy. "Buddy herinnert je.": Buddy springt op de vlag (7,7 s), meter METER STIL €0,00. 8,17 s chip "14 · Herinnering in je agenda". | Stuur hem door. Buddy herinnert je op tijd. |
| 4 | 9,03 s (koplamp) | "Vast tarief." De meter rolt naar €3,49, label PER MAAND op 10,4 s. Buddy zit als daklicht op de meter. Knop "activeer buddy" 11,27 s, "Geen app. Geen bankkoppeling.", woordmerk, tik op de knop. | Drie euro negenenveertig per maand. Activeer Buddy. |

## Voice-over (ElevenLabs, één take)
Stem uit `ELEVENLABS_VOICE_ID`, model `eleven_v4`, `nl`, stability 0.5, similarity 0.75. 32 woorden, 12,43 s, langste pauze 0,40 s.

```
[S1] Een vergeten rekening is een taxi met de meter aan. [S2] Een aanmaning kan uitlopen op veertig euro. [S3] Stuur hem door. Buddy herinnert je op tijd. [S4] Drie euro negenenveertig per maand. Activeer Buddy.
```

## Caption
Zie `renders/taximeter-caption.md`.

## Ads Manager
- Primaire tekst (106): Een vergeten rekening tikt door als een taximeter. Buddy zet je herinnering in je agenda. €3,49 per maand.
- Kop: Vast tarief. Geen meter.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Geen gratis of proefperiode, geen WhatsApp, geen "vanaf €2,99", €40 alleen met "kan uitlopen op", geen rood (waarschuwingen in #111827).
<!-- copycheck:on -->

## Open punten
- Instappagina: "aanmaning en incassokosten" past het best; pad nog niet bevestigd.
- De meter toont €40,00 als bedrag; de chip "Kan uitlopen op €40" nuanceert dat.
