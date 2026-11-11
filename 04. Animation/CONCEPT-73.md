# BetaalBuddy · Instagram ad, concept 73

## "Jij kiest het moment." (broodrooster)

**In één zin:** een rekening die je laat liggen brandt aan in de broodrooster en springt eruit als aanmaning; stuur hem door, draai zelf de knop naar de dag die jij wilt, en op dat moment springt hij in je agenda; aan het eind stampt Buddy op de broodrooster en springt de knop "activeer buddy" er als toast uit.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Broodrooster-Reel`) · 4:5 feed 1080×1350 (`BB-Broodrooster-Feed`) |
| Lengte | 11,00 s (330 frames, 30 fps): stem 9,77 s plus ruim 1 s CTA |
| USP en vorm | `agenda` (jij kiest wanneer je een herinnering krijgt) · één doorlopend shot zonder scènewissel |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/broodrooster/schema.ts` (teksten, dagen, kleuren, `withVoice`); timing uit `public/vo/broodrooster/timing.json` |
| Render | `npm run render:broodrooster` en `:feed`, daarna loudnorm (I -14, TP -1, LRA 11, video gekopieerd) naar `renders/broodrooster-*-vo.mp4`; `npm run render:broodrooster:stil` voor de stille versies |

### Waarom deze keuze
Rotatieregel: de laatste concepten (63 tot 72) gebruikten geen-ai, inzage, prijs, geen-app, overzicht, doelgroep en geen-koppeling; `agenda` (laatst 62) is het langst niet gebruikt. Binnen agenda kiest dit concept de nieuwe invalshoek uit onboarding v5.1: **jij kiest het moment**. Vorm: één doorlopend shot (laatste drie waren vraag en antwoord, vraag en antwoord, mythe tegenover feit). Metafoor: de lift met knoppenpaneel was al concept 44; de broodrooster met draaiknop is nooit gebruikt.

### Uniciteit
| | 44 Lift | 62 Boemerang | 72 Sleutel | **73 Broodrooster** |
|---|---|---|---|---|
| Invalshoek | Stap uit vóór de aanmaning | Weggelegd komt terug | Geen koppeling | **Te lang laten liggen brandt aan; jij draait de knop** |
| Visueel systeem | Liftschacht, knoppenpaneel | Vluchtbanen | Deur, sloten, brievenbus | **Eén vast shot van een broodrooster, camera duwt in en kantelt** |
| Buddy | Liftboy | Vangt in een sprong | Schudt nee, kijkt door de gleuf | **Kijkt mee bij de knop, springt mee met de pop, stampt de CTA eruit** |
| Einde | Uitstappen op tijd | Omkering | Brief uit de brievenbus | **Uitkomst: herinnering op jouw dag** |
| Slotbeeld | | Boemerang rond de knop | Knipoog in de gleuf | **Knop springt als toast uit de gleuf, Buddy erboven** |
| Overgangen | Liftdeuren | swing, spin-return | sleutelgat, grendel, brievenbus | **Geen: push-in op de knop, achtergrond ademt licht/blauw, camera-tilt naar de CTA** |

Verschilt op minstens 5 van 6 punten met elk concept in de index en met concept 44.

---

## Storyboard (scènestarts = eerste gesproken woord per marker)

### 1 · Hook (0,00 tot 2,87 s) · licht
- Frame 0: kop "Laat je hem liggen, dan brandt hij aan." staat al, de rekening Energieleverancier €87,60 steekt uit de gleuf, de gleuf gloeit oranje.
- De rekening kleurt bruin aan de randen, rook stijgt op. Op "brandt" (1,80 s) springt de hendel omhoog en schiet de aangebrande rekening omhoog; op "aan" (2,17 s) stempel AANMANING, label Te laat, schok; chip "Kan uitlopen op €40" (2,43 s).

### 2 · Doorsturen en kiezen (2,87 tot 6,07 s) · achtergrond ademt naar blauw
- Kop "Stuur hem door. Jij draait de knop." De aangebrande rekening glijdt weg, een verse rekening vliegt de gleuf in (hendel omlaag op "door", 3,50 s). Buddy springt op de broodrooster op "Buddy" (3,67 s).
- Camera duwt in op de draaiknop; op "draait" (4,63 s) een tik, de knop draait van **vr** (rood, vervalt) terug naar **di**; op "knop" (5,47 s) licht di geel op. Subregel "Jij kiest wanneer je een herinnering krijgt."

### 3 · Agenda (6,07 tot 8,40 s) · licht
- Camera zoomt uit, de agendaweek ma 14 tot vr 18 zakt in beeld. Kop "Precies op tijd in je agenda."
- Op "springt" (6,37 s) springt de rekening uit de broodrooster in een boog naar vr 18 (Vervalt €87,60), Buddy springt mee; di 15 wordt geel met belletje Herinnering (6,80 s); op "agenda" (7,43 s) knijpt Buddy blij zijn ogen dicht.

### 4 · CTA (8,40 tot 11,00 s) · blauw
- Camera kantelt omhoog, agenda verdwijnt. Tagline "Jij kiest het moment."
- Buddy springt op en stampt op de broodrooster (8,60 s), de hendel gaat omlaag en de knop "activeer buddy" springt als toast uit de gleuf (8,80 s); woordmerk eronder; tik op de knop (9,90 s).

---

<!-- copycheck:off -->
## Copyregels
Volgt onboarding v5.1 uit de changelog: herinnering in je agenda op een moment dat jij kiest. Geen prijs, pakketnaam, "gratis", betaallink of "mail op 7 en 2 dagen". €40 alleen met "kan". De dagen op de knop (ma tot vr) zijn een voorbeeld, geen belofte over welke momenten je precies kunt kiezen.
<!-- copycheck:on -->

## Voice-over (ElevenLabs eleven_v4, één take, 31 woorden, 9,77 s)

Zoals naar ElevenLabs gestuurd (zonder markers):
```
Laat je een rekening liggen, dan brandt hij aan. Stuur hem door naar Buddy, en jij draait zelf aan de knop. Dan springt hij op tijd in je agenda. Activeer Buddy.
```

Met scènemarkers:
```
[S1] Laat je een rekening liggen, dan brandt hij aan. [S2] Stuur hem door naar Buddy, en jij draait zelf aan de knop. [S3] Dan springt hij op tijd in je agenda. [S4] Activeer Buddy.
```

| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Laat je een rekening liggen, dan brandt hij aan. | Rekening brandt aan, springt eruit op "brandt" (54), stempel op "aan" (65) |
| S2 | 2,87 | 86 | Stuur hem door naar Buddy, en jij draait zelf aan de knop. | Verse rekening in de gleuf (105), Buddy (110), knop draait op "draait" (139), di licht op bij "knop" (164) |
| S3 | 6,07 | 182 | Dan springt hij op tijd in je agenda. | Pop op "springt" (191), landt op vr 18 (209), herinnering di 15 (204), Buddy blij op "agenda" (223) |
| S4 | 8,40 | 252 | Activeer Buddy. | Buddy stampt (258), knop springt uit de gleuf (264), tik (297) |

Luistertoets: langste pauze tussen woorden 0,40 s (alignment, na "aan."); silencedetect -35 dB/0,2 s max 0,55 s (voor "Activeer"). Vier zinsstarts gevonden voor vier markers. Niet versneld.

## Caption (Reels)
Zie `renders/broodrooster-caption.md`.

## Ads Manager
Zie `renders/broodrooster-caption.md`.

## Open controles
- Welke herinnermomenten je in pakket Buddy precies kunt kiezen; de dagen ma tot vr op de knop zijn een voorbeeld. Datums staan op december 2026.
- Instappagina voor knop en link in bio: "aanmaning en incassokosten" past het best bij de hook; waar die live komt, staat nog open.
- De ad is 11,0 s, korter dan de 12 tot 16 s uit de skill, omdat de stem 9,8 s duurt en de video de stem volgt.
