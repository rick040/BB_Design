# BetaalBuddy · Instagram ad, concept 70

## "Elke nota op zijn beurt." (wachtkamer)

**In één zin:** tandarts, fysio en eigen risico komen tegelijk binnen en schuiven als drie nota's in een wachtkamer zonder dat iemand weet wie wanneer moet; je stuurt ze door, Buddy leest van elke nota de vervaldatum en hangt er een nummertje aan, op tijd springt hij op de oproepknop zodat het bord "Fysio €37,00" omklapt en de herinnering in je agenda staat; aan het eind scheurt Buddy een nummertje van de automaat dat de knop wordt.

| | |
|---|---|
| USP | `doelgroep` (zorgnota's), de enige USP die nog nooit gebruikt was (rotatieregel brand §4) |
| Vorm | vraag en antwoord (niet in de laatste drie: 67 één shot, 68 en 69 twee schermen) |
| Metafoor | wachtkamer met nummertjesautomaat en oproepbord (gekozen boven "stapel op de mat" en "medicijnkastje", die te dicht bij 56 en 65 lagen) |
| Formaat | Reel 1080×1920 (`BB-Wachtkamer-Reel`) en Feed 1080×1350 (`BB-Wachtkamer-Feed`) |
| Lengte | 13,90 s (417 frames, 30 fps): stem 12,90 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` (API) |
| Aanpassen | `src/wachtkamer/schema.ts` (teksten, bedragen, datums, kleuren, `withVoice`, `transitionFrames`); timing uit `public/vo/wachtkamer/timing.json` |
| Render | `npm run render:wachtkamer` / `render:wachtkamer:feed` (met stem), `render:wachtkamer:stil` / `render:wachtkamer:feed:stil`, cover `npm run still:wachtkamer` (frame 150); daarna loudnorm (I -14, TP -1, LRA 11) met `-c:v copy` |

### Uniciteit (zie CONCEPTEN.md)
<!-- copycheck:off -->
| | 1 tot 61 (agenda/privacy) | 63/64 geen-ai | 65 inzage | 66 prijs | 67 geen-app | 68/69 overzicht | **70** |
|---|---|---|---|---|---|---|---|
| Invalshoek | rekening vergeten | AI? nee | wat weet Buddy | €3,49 tegen €40 | geen app | alles op één plek | **doelgroep: zorgnota's komen tegelijk** |
| Visueel systeem | UI, typografie, focus, vluchtbanen | liniaal, sjabloon | glazen la | weegschaal | volle telefoon | split screen | **wachtkamer: stoelen, nummertjes, split-flap oproepbord** |
| Buddy | slikt, vangt, rijdt mee | vinkt af, slaat sjabloon | trekt la open | springt op schaal | duwt telefoon om | duwt schuifgreep | **slikt de nota's, leest en hangt nummertjes, springt op de oproepknop** |
| Einde | belofte, uitkomst | feit | transparantie | som | opgeruimd | ordening | **oproep: jij bent op tijd aan de beurt** |
| Slotbeeld CTA | diverse | gluurt, vinkt | raamwisser | zit op prijs | schopt app weg | leunt tegen kaart | **scheurt een nummertje van de automaat dat de knop wordt** |
| Overgangen | iris, slide, wipe, swing... | flip, slam | lade, wisser | kantel | screen-dive | sweep, fold | **ticket-tear (geperforeerde scheurrand), split-flap (bord klapt om)** |
<!-- copycheck:on -->

Verschilt op 6 van 6 punten met elk concept in de index.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) | 0,00 tot 5,27 s | Kop "Komen je zorgnota's ook altijd tegelijk?" staat op frame 0, boven een oproepbord "Nu aan de beurt ? ? ?" dat rood knippert. Nota's vallen op hun woord op de wachtkamerstoelen: Tandarts €84,50 (0,00 s), Fysio €37,00 (0,67 s), Zorgverzekeraar eigen risico €385,00 (1,83 s), alle drie "Vervalt ?". Op "tegelijk" (4,33 s) dringen ze samen, schudden, chips worden rood; chip "Drie nota's, drie datums". |
| 2 · Doorsturen (blauw, ticket-tear) | 5,27 tot 8,63 s | "Stuur ze door naar Buddy." Tik op Doorsturen op "door" (5,77 s), de drie nota's vliegen in Buddy. Op "leest" (7,13 s) spuugt hij ze één voor één terug met een geel nummertje "vervalt di 22 dec / vr 18 dec / ma 28 dec"; subregel "Buddy leest het bedrag en de vervaldatum." |
| 3 · Oproep (licht, split-flap) | 8,63 tot 11,60 s | Kop "Je bent op tijd aan de beurt." woord voor woord op de stem. Het bord klapt om naar "Fysio €37,00" vanaf "tijd" (9,07 s); Buddy springt op de oproepknop op "beurt" (9,73 s), bord gloeit, ringen. Agendakaart "do 17 dec · Fysio €37,00 betalen · Vervalt vr 18 dec" met belletje op "agenda" (10,73 s); subregel "Jij kiest wanneer je een herinnering krijgt." |
| 4 · CTA (blauw, ticket-tear van onder) | 11,60 tot 13,90 s | Tagline "Elke nota op zijn beurt." Nummertje komt uit de automaat, Buddy scheurt het af op "Activeer" (11,73 s), het vliegt omlaag en wordt de knop "activeer buddy"; woordmerk op "Buddy" (12,23 s), tik op 12,83 s. |

## Voice-over (ElevenLabs, één take, 31 woorden, 12,83 s)

```
[S1] Tandarts, fysio, eigen risico, komen die zorgnota's altijd tegelijk? [S2] Stuur ze door naar Buddy, want hij leest de vervaldatum. [S3] En je bent op tijd aan de beurt, via je agenda. [S4] Activeer Buddy.
```

| Marker | Start | Frame | Beeld |
|---|---|---|---|
| S1 | 0,00 s | 0 | Kop en oproepbord, Tandarts valt op de stoel |
| S2 | 5,27 s | 158 | Ticket-tear naar blauw, "Stuur ze door naar Buddy." |
| S3 | 8,63 s | 259 | Split-flap naar het oproepbord |
| S4 | 11,60 s | 348 | Ticket-tear naar CTA, nummertje wordt knop |

Luistertoets: langste pauze tussen woorden 0,40 s (alignment), 0,49 s (silencedetect -35 dB). Eerste take goed, niet versneld. Voice-over-mp3 genormaliseerd met loudnorm.

## Caption
Zie `renders/wachtkamer-caption.md`.

## Ads Manager
- Primaire tekst: Tandarts, fysio, eigen risico. Stuur je zorgnota's door, Buddy zet elke vervaldatum op tijd in je agenda.
- Kop: Elke nota op zijn beurt.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Volgt onboarding v5.1 uit de changelog: herinnering in je agenda wanneer jij kiest. Buddy leest bedrag en vervaldatum uit de doorgestuurde mail. Geen prijs, geen gratis, geen AI-claim, geen merknamen (alleen generieke afzenders Tandarts, Fysio, Zorgverzekeraar). Geen claim dat Buddy op datum sorteert (nog niet bevestigd); de nummertjes tonen alleen de gelezen vervaldatum.
<!-- copycheck:on -->

## Open punten
- Instappagina voor knop en link in bio: "zorgnota's" past precies.
- Datums staan op december 2026 (do 17, vr 18, di 22, ma 28); "do 17" als herinnermoment is een voorbeeld.
- Bedragen zijn voorbeelden; €385,00 is het wettelijk eigen risico 2026, maar staat er alleen als voorbeeldnota.
