# BetaalBuddy · Instagram ad, concept 70

## "Wie is de volgende?" (wachtkamer)

**In één zin:** je zorgnota's van tandarts, fysio en eigen risico zitten in een wachtkamer en wachten tot de aanmaning komt; stuur ze door, Buddy geeft ze een wachtnummer en roept ze één voor één op, zodat elke nota op zijn dag in je agenda vliegt, en aan het eind trekt Buddy een kaartje uit de nummertjesautomaat dat de knop "activeer buddy" wordt.

**Keuze:** USP `doelgroep` (zorgnota's), want het is de enige USP in `CONCEPTEN.md` die nog nooit gebruikt is. Vorm: vraag en antwoord, met als slot de oproep "Wie is de volgende?" (niet in de laatste drie: rekensom, één shot, twee schermen). Metafoor: een wachtkamer. Die past letterlijk bij zorg en verschilt van alle beelden in de index (andere opties waren een EHBO-doos en een receptenmap).

| | |
|---|---|
| Formaat | `BB-Wachtkamer-Reel` (1080×1920) en `BB-Wachtkamer-Feed` (1080×1350), map `Concept-70-Wachtkamer` |
| Lengte | 12,83 s (385 frames, 30 fps): stem 11,83 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/wachtkamer/schema.ts` (teksten, nota's, kleuren, `withVoice`, `transitionFrames`); timing uit `public/vo/wachtkamer/timing.json` |
| Render | `npm run render:wachtkamer` en `npm run render:wachtkamer:feed`, daarna loudnorm (I -14, TP -1, LRA 11); stil met `--props='{"withVoice":false}'`; cover `npm run still:wachtkamer` (frame 125) |
| Instappagina | "zorgnota's" |

### Uniciteit (zie CONCEPTEN.md)
| | Dichtstbij (62, 66, 68, 69) | **70** |
|---|---|---|
| Invalshoek | agenda, prijs, overzicht | **doelgroep: zorgnota's die blijven liggen** |
| Visueel systeem | vluchtbanen, weegschaal, split screen | **wachtkamer: stoelen, LED-wachtnummerdisplay, nummertjesautomaat** |
| Buddy | vangt, weegt, duwt schuifgreep | **deelt wachtnummers uit en roept nota's op** |
| Einde | omkering, rekensom, samenvatting | **oproep: jij bent aan de beurt** |
| Slotbeeld | boemerang, zit op prijs, leunt tegen kaart | **trekt een kaartje dat de knop wordt** |
| Overgangen | swing, kantel, schuifgreep | **schuifdeur, nummerrol** (CSS, `src/lib/wachtkamerWipes.ts`) |

Verschilt op 6 van 6 punten met elk concept in de index, ook met 69 "Alles op één lijst." (overzicht, split screen) van een parallelle run. Eerst als 69 gebouwd en hernummerd naar 70 toen bleek dat die run 69 al had gebruikt.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) | 0,00 tot 4,97 s | Kop "Tandarts geweest? Fysio gehad?" staat op frame 0. Drie nota's op wachtkamerstoelen (Tandarts €84,20, Fysiotherapeut €112,50, Zorgverzekeraar eigen risico €165,00), LED-display "WACHTTIJD 1 WEEK". Fysio wipt op bij "fysio" (1,23 s), de verzekeraar bij "nota's" (2,63 s); bij "wachten" (3,13 s) springt de wachttijd naar 2 en 3 weken; bij "aanmaning" (3,77 s) krijgt de tandartsnota het stempel AANMANING, label Te laat, schok, chip "Kan uitlopen op €40". |
| 2 · Doorsturen (blauw, schuifdeur) | 4,97 tot 6,37 s | "Stuur ze door naar Buddy." Tik op Doorsturen bij "door" (5,43 s); de drie nota's schuiven in de rij voor Buddy; Buddy springt op "Buddy" (5,77 s) en ze krijgen gele wachtnummers 1, 2, 3. |
| 3 · Agenda (licht, nummerrol) | 6,37 tot 9,27 s | "Elke nota op tijd in je agenda." Het display roept 1, 2 en 3 op bij "elke" (6,87 s), "nota" (7,20 s) en "tijd" (7,80 s); Buddy drukt telkens op de knop en de nota vliegt naar zijn dag (di 15, do 17, vr 18). Bij "agenda" (8,33 s) belletje Herinnering op ma 14 en subregel "Jij kiest wanneer je een herinnering krijgt." |
| 4 · CTA (blauw, nummerrol) | 9,27 tot 12,83 s | Tagline "Wie is de volgende?" woord voor woord op de stem. Buddy drukt op de nummertjesautomaat (10,23 s), er rolt een kaartje "Nr. 1" uit dat bij "Activeer" (10,57 s) de knop "activeer buddy" wordt; woordmerk, tik op 11,77 s. |

## Voice-over (ElevenLabs, één take, 32 woorden)

```
[S1] Tandarts geweest, fysio gehad, en de nota's wachten tot de aanmaning komt. [S2] Stuur ze door naar Buddy, [S3] dan staat elke nota op tijd in je agenda. [S4] Wie is de volgende? Activeer Buddy.
```

| Cue | Start | Tekst | Beeld |
|---|---|---|---|
| S1 | 0,00 s (frame 0) | Tandarts geweest, fysio gehad, en de nota's wachten tot de aanmaning komt. | Wachtkamer, stempel op "aanmaning" (frame 113) |
| S2 | 4,97 s (frame 149) | Stuur ze door naar Buddy, | Schuifdeur, tik op Doorsturen, wachtnummers |
| S3 | 6,37 s (frame 191) | dan staat elke nota op tijd in je agenda. | Nummerrol, oproepen, nota's naar hun dag |
| S4 | 9,27 s (frame 278) | Wie is de volgende? Activeer Buddy. | Kaartje wordt de knop (frame 317) |

Luistertoets: 11,81 s, langste pauze tussen woorden 0,24 s (alignment); silencedetect -35 dB max 0,56 s. Niet versneld.

## Caption
Zie `renders/wachtkamer-caption.md`.

## Ads Manager
- Primaire tekst (100): Tandarts, fysio, eigen risico: stuur je zorgnota's door en Buddy zet elke nota op tijd in je agenda.
- Kop (19): Wie is de volgende?
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Geen prijs, pakketnaam, "gratis", WhatsApp of merknamen; zorgafzenders zijn generiek (Tandarts, Fysiotherapeut, Zorgverzekeraar). €40 alleen met "kan". Herinnering "wanneer jij kiest" volgens onboarding v5.1.
<!-- copycheck:on -->

## Open punten
- Instappagina "zorgnota's" voor knop en link in bio; waar die live komt is nog niet besloten.
- Bedragen en datums zijn voorbeelden; datums staan op december.
- Of €40 incassokosten realistisch is bij een tandartsnota van €84,20 (wettelijk minimum, alleen na een veertiendagenbrief) is met "kan" geformuleerd.
