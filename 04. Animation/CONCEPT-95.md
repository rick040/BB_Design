# BetaalBuddy · Instagram ad, concept 95

## "Elke nota op zijn dag." (weekdoos)

**In één zin:** de mythe "zorgnota's onthoud je vanzelf" wordt doorgestreept terwijl de nota's als een vervagende herinnering wegglijden; het feit is dat tandarts, fysio en apotheek elk een andere datum hebben, en Buddy legt elke nota in het juiste vakje van een weekdoos (pillendoos) met de vervaldata als vakjes, in je agenda.

| | |
|---|---|
| USP | `doelgroep` (zorgnota's), gekozen met de rotatieregel: laatst in concept 87; 88 tot 94 gebruikten alle andere USP's |
| Vorm | Mythe tegenover feit (niet in 92 rekensom, 93 vraag en antwoord, 94 één doorlopend shot) |
| Metafoor | Weekdoos met vakjes per vervaldatum. Afgevallen: wachtkamernummer (al gebruikt, "wachtkamer") en een receptenbriefje (te dicht op bon) |
| Formaat | Alleen 9:16 Reel 1080×1920 met stem (`BB-Weekdoos-Reel`) |
| Lengte | 14,93 s (448 frames, 30 fps): stem 13,87 s plus ongeveer 1 s CTA |
| Stem | ElevenLabs, stem uit `ELEVENLABS_VOICE_ID`, eleven_v4, nl, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/weekdoos/schema.ts` (teksten, nota's, kleuren, `withVoice`, `transitionFrames`); timing uit `public/vo/weekdoos/timing.json` |
| Render | `npm run render:weekdoos`, daarna loudnorm (I -14, TP -1, LRA 11) naar `renders/weekdoos-reel-vo.mp4` |

### Uniciteit (zie CONCEPTEN.md)
| | 1 | 2 | 3 | 62 | **95** |
|---|---|---|---|---|---|
| USP | agenda | agenda | geen-koppeling | agenda | **doelgroep (zorgnota's)** |
| Visueel systeem | UI | Typografisch | Focus | Vluchtbanen | **Object: weekdoos met datumvakjes, doorgestreepte kop** |
| Buddy | Slikt rekening | Rijdt mee op aftellen | Slaapmasker | Vangt en gooit | **Hopt van vakje naar vakje en vult elk vakje op de stem; gaat als deksel op de dichte doos zitten** |
| Einde | Belofte | Uitkomst | Regie | Omkering | **Feit tegenover de mythe: "Elke nota op zijn dag."** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | **streep, capsule, deksel** (CSS, `src/lib/pillWipes.ts`) |

Verschilt op 5 van 5 punten met elk concept in de index. Geen rood (Gate 1): de doorhaling is #111827.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Mythe (licht) | 0,00 tot 3,37 s | Kop "Mythe: zorgnota's onthoud je vanzelf." staat op frame 0 met drie nota's (Tandarts €68,40, Fysio €42,00, Apotheek €12,95). De nota's vervagen en glijden uit elkaar als een herinnering; op "vanzelf" (2,23 s) wordt de kop doorgestreept, schok. |
| 2 · Feit (blauw, streep) | 3,37 tot 8,17 s | De doorhaling opent zich tot de blauwe scène. "Feit: elk een andere datum." De nota's vallen erin op "tandarts", "fysio" en "apotheek"; op "andere" (7,03 s) lichten de datumchips do 3, ma 14 en vr 18 geel op. |
| 3 · Doorsturen (licht, capsule) | 8,17 tot 12,63 s | "Stuur ze door naar Buddy." Chip Doorgestuurd, de nota's vliegen in Buddy op "door". Buddy hopt naar elk vakje van de weekdoos: deksel open, nota erin, deksel dicht met vinkje op "elke" (10,17 s), "nota" (10,57 s) en "dag" (11,27 s). Op "agenda" (11,77 s) lichten de datums op, chip "In je agenda", subregel "Elke nota op zijn eigen dag." |
| 4 · CTA (blauw, deksel) | 12,63 tot 14,93 s | Scène klapt als een deksel naar beneden. "Elke nota op zijn dag." Buddy valt op de dichte doos en zit erop als extra deksel; knop "activeer buddy" op "Activeer", woordmerk, "Geen app. Geen bankkoppeling.", tik op 13,87 s. |

## Voice-over (ElevenLabs, één take, 30 woorden)

```
[S1] Mythe: zorgnota's onthoud je vanzelf. [S2] Feit: tandarts, fysio en apotheek hebben elk een andere datum. [S3] Stuur ze door. Buddy zet elke nota op zijn dag in je agenda. [S4] Activeer Buddy.
```
Luistertoets: langste pauze tussen woorden 0,56 s (alignment, na "vanzelf."); silencedetect -35 dB max 0,63 s. Onder de grens van 0,7 s.

## Caption
Zie `renders/weekdoos-caption.md`.

## Ads Manager
- Primaire tekst (108): Tandarts, fysio, apotheek: elke zorgnota een andere datum. Stuur ze door, Buddy zet ze op tijd in je agenda.
- Kop (22): Elke nota op zijn dag.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Geen prijs, geen pakketnaam, geen "gratis", geen merknamen (alleen generieke zorgafzenders). Agenda als bijrol, met "jij kiest wanneer". Bedragen en datums zijn voorbeelden.
<!-- copycheck:on -->

## Open punten
- Instappagina voor knop en link in bio: de zorgnota-pagina past het best; pad nog niet bevestigd.
- Datums staan op december; voor plaatsing na december de nota's in het schema aanpassen.
