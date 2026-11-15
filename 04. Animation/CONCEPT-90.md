# BetaalBuddy · Instagram ad, concept 90

## "Geen verrassingen. Gewoon je agenda." (adventskalender)

**In één zin:** achter elk deurtje van een adventskalender zit een verrassing, tot er achter deurtje 17 een aanmaning zit; stuur je rekening door, Buddy stopt hem achter het deurtje van zijn vervaldag in je agenda, jij tikt het deurtje van je herinnering aan en daar springt Buddy met een belletje uit.

| | |
|---|---|
| Formaat | 9:16 Reel 1080×1920 (`BB-Advent-Reel`) · 4:5 feed 1080×1350 (`BB-Advent-Feed`) |
| Lengte | 12,53 s (376 frames, 30 fps): stem 11,52 s plus 1 s CTA |
| Stem | ElevenLabs API `/with-timestamps`, stem `7qdUFMklKPaaAVMsBTBt` (uit `ELEVENLABS_VOICE_ID`), eleven_v4, nl, stability 0,5, similarity 0,75, één take, 32 woorden |
| Aanpassen | `src/advent/schema.ts` (teksten, kleuren, `withVoice`, `transitionFrames`); timing uit `public/vo/advent/timing.json` |
| Render | `npm run render:advent`, `render:advent:feed`, `render:advent:stil`, `render:advent:feed:stil`, `still:advent` (frame 140); VO-versies daarna loudnorm (I -14, TP -1, LRA 11) |

### Keuze
USP `agenda` met de rotatieregel: laatst gebruikt in concept 82; daarna kwamen inzage (83), prijs (84), geen-app (85), overzicht (86), doelgroep (87), geen-koppeling (88) en geen-ai (89). Vorm: mythe tegenover feit ("een rekening is een verrassing" tegenover "jij kiest de dag"); niet in 87, 88, 89. Metafoor adventskalender: past bij december en komt in geen van de 89 concepten voor (afgevallen: split-flap bord, al in 71; wekker en kookwekker, te dicht op 2 en 58).

### Uniciteit
| | 62 boemerang | 74 broodrooster | 82 domino | **90 advent** |
|---|---|---|---|---|
| Invalshoek | Wegleggen werkt niet | Jij draait de knop | Herinnering komt nooit gelegen | **Een rekening hoort geen verrassing te zijn** |
| Visueel systeem | Vluchtbanen | Keukenapparaat | Vallende stenen | **Raster van deurtjes, agenda als deurtjesrij** |
| Buddy | Vangt en gooit | Draait knop | Geeft een duwtje | **Stopt de rekening achter een deurtje; springt er op jouw dag uit met een belletje** |
| Einde | Omkering | Regie | Uitkomst | **Geruststelling: geen verrassingen** |
| Slotbeeld | Gooit boemerang rond knop | n.v.t. | Stenen drukken knop in | **Deurtje 24 zwaait open, Buddy zit erachter** |
| Overgangen | swing, spin-return | | topple, slab | **scharnierdeur, deurtjesraster** (`src/lib/doorWipes.ts`, CSS) |

Verschilt op minstens 5 van 6 punten met elk concept in de index.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) | 0,00 tot 5,03 s | Kop "Verrassing achter elk deurtje?" en een blauwe adventskalender met twaalf deurtjes op frame 0. Op "deurtje" kiert deurtje 5 even open, op "Leuk" (2,17 s) gaat deurtje 3 open met een gele ster. Op "aanmaning" (3,83 s) zwaait deurtje 17 open en vliegt de rekening van de Energieleverancier eruit: Te laat, stempel AANMANING, schok; chip "Kan uitlopen op €40". |
| 2 · Doorsturen (blauw, scharnierdeur) | 5,03 tot 7,93 s | "Stuur hem door naar Buddy." Tik op Doorsturen bij "door" (5,97 s); de rekening vliegt naar Buddy, die hem vangt op "dan", naar do 17 springt op "zet" en hem achter dat deurtje stopt op "in je agenda"; het deurtje sluit met het label €87,60. |
| 3 · Kiezen (licht, deurtjesraster) | 7,93 tot 10,23 s | "En jij kiest wanneer." Je tikt op ma 14 bij "kies" (8,13 s), het deurtje krijgt een gele rand; op "herinnert" (9,27 s) gaat het open en springt Buddy eruit met een gouden belletje, melding "Herinnering · Energieleverancier €87,60 · vervalt do 17". Subregel "Jij kiest wanneer je een herinnering krijgt." |
| 4 · CTA (blauw, scharnierdeur) | 10,23 tot 12,53 s | "Geen verrassingen. Gewoon je agenda." Deurtje 24 zwaait open, Buddy zit erachter met een ster; knop "activeer buddy" op "Activeer", woordmerk op "Buddy", tik op 11,40 s. |

## Voice-over (ElevenLabs, één take, 32 woorden, 11,47 s)

```
[S1] Verrassing achter elk deurtje? Leuk, maar niet als het een aanmaning is. [S2] Stuur je rekening door, dan zet Buddy hem in je agenda [S3] en kies jij wanneer hij je herinnert. [S4] Activeer Buddy.
```

| Marker | Start (s) | Frame | Eerste woorden | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Verrassing achter | Adventskalender, kop staat |
| S2 | 5,03 | 151 | Stuur je rekening door | Scharnierdeur naar blauw, rekening en Doorsturen |
| S3 | 7,93 | 238 | en kies jij | Deurtjesraster naar licht, tik op ma 14 |
| S4 | 10,23 | 307 | Activeer Buddy | Scharnierdeur, deurtje 24, knop |

Luistertoets: langste pauze tussen woorden 0,40 s (alignment), silencedetect -35 dB max 0,49 s. Niet versneld. Genormaliseerd: `renders/advent-voice-over.mp3` (loudnorm I -14).

## Caption
Zie `renders/advent-caption.md`.

## Ads Manager
- Primaire tekst (100): Een verrassing achter elk deurtje? Niet bij je rekeningen. Stuur ze door, Buddy zet ze in je agenda.
- Kop (36): Geen verrassingen. Gewoon je agenda.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Volgt onboarding v5.1: herinnering in je agenda op een moment dat jij kiest. Geen prijs, pakketnaam, "gratis" of "mail op 7 en 2 dagen". €40 alleen met "Kan uitlopen op". Geen rood: waarschuwingen in #111827.
<!-- copycheck:on -->

## Open punten
- Instappagina voor knop en link in bio: aanmaning en incassokosten past het best; pad nog niet bevestigd.
- "ma 14" is een voorbeeld van een gekozen herinnermoment; datums staan op december 2026 (do 17 dec klopt).
- Seizoensgebonden: plaatsen tussen eind november en 24 december.
