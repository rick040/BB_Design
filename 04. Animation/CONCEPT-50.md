# BetaalBuddy · Instagram ad, concept 50

## "Knoop eruit. Datum erin."

**In één zin:** je hebt een knoop in je zakdoek gelegd, maar weet niet meer waarvoor; de knoop gaat open en er schiet een aanmaning uit. Stuur de rekening door, Buddy hangt er een label aan met bedrag en vervaldatum en knoopt dat vast in je agenda, met een herinnering op het moment dat jij kiest.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Zakdoek-Reel`) · 4:5 feed 1080×1350 (`BB-Zakdoek-Feed`) |
| Lengte | 13,4 s (4 scènes, 30 fps, 402 frames), alles aan te passen in Remotion Studio |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. Voice-over en caption staan onderaan |

### Waarom dit idee
"Een knoop in je zakdoek leggen" kent iedereen in Nederland, en ook het probleem ervan: de knoop zegt dát je iets moet onthouden, niet wát of wanneer. Dat is precies wat Buddy wel doet. De zakdoek als beeldtaal (stof, ruitjes, knopen, een label aan een draadje) en Buddy met een zakdoek-hoedje met vier knopen als slotgrap komen in geen van de 49 eerdere concepten voor (gecontroleerd in de changelog). Afgevallen richtingen: een wekker met snooze (te dicht op concept 15, uitstel) en een theeketel die te laat fluit (te dicht op 21, kookprogramma).

### Hoe dit verschilt van de eerdere concepten
| | Concept 1 | Concept 2 | Concept 3 | 13 · koelkast | 31 · ballonnen | **Dit concept** |
|---|---|---|---|---|---|---|
| Invalshoek | Overzicht | Timing | Privacy | Eigen systeem faalt (briefjes vallen) | Eentje glipt weg | **Geheugensteun zonder inhoud:** je weet dát het moest, niet wát of wanneer |
| Visueel systeem | UI-gedreven | Typografisch | Focus (wazig/scherp) | Objecten (post-its) | Objecten (ballonnen) | **Textiel:** gingham-zakdoek, knopen, een label aan een draadje |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het getal | Slaapmasker | Trekt post-its eraf | Houdt het touwtje vast | **Knoopt het label vast** met bedrag en datum, eerst aan zichzelf, dan aan je agenda |
| Einde | Belofte | Uitkomst "Betaald." | Regie | Lege deur | Vasthouden | **Omkering:** "Knoop eruit. Datum erin." |
| Slotbeeld (CTA) | Buddy gluurt van rechts | Buddy op de knop | Buddy boven de knop, masker | | | **Buddy naast de knop met de zakdoek als hoedje** (knopen in de hoeken) |
| Overgangen | Iris, slide | Klok-wipe, slide | Wipe, focus pull | Page-curl | | **Doekwipe:** een eigen CSS-overgang met golvende stofrand (`src/lib/clothWipe.tsx`), omhoog, van links en omlaag |

---

## Storyboard

### 1 · Hook: "Knoop in je zakdoek. Maar waarvoor?" (0,0 tot 3,4 s) · licht
- Frame 0: de hele kop en een geruite zakdoek met drie knopen staan al in beeld.
- 0,20 tot 0,60 s: boven elke knoop plopt een blauw vraagteken.
- 1,00 tot 1,40 s: de grote middelste knoop wiebelt en gaat open.
- 1,53 s: uit de knoop schiet een rekeningkaart naar voren, "Zorgverzekeraar · Aanmaning · Te laat betaald · €96,40", met een schok.
- 2,00 s: chip **"Kan uitlopen op €40"**.
- Cover = frame 72 (2,4 s).

### 2 · "Stuur hem door. Buddy weet waarvoor." (3,0 tot 6,6 s) · doekwipe omhoog naar blauw
- Mail "Zorgverzekeraar · Je nota van november · €96,40" met knop Doorsturen; tik op 3,60 s.
- 3,87 s: de mail vliegt omlaag en wordt een label (landt op 4,40 s). Buddy (wit) springt op (4,00 s).
- 4,53 s: een draadje loopt van Buddy naar het label; 4,80 s: Buddy knoopt het vast (squash, knoop op zijn hoofd).
- 4,93 tot 5,53 s: op het label verschijnen Zorgverzekeraar, **€96,40**, "vervalt **do 17 dec**".
- Subregel 5,53 s: "Hij leest het bedrag en de vervaldatum."

### 3 · "Nu weet je wél waarvoor." (6,2 tot 10,2 s) · doekwipe van links naar licht
- Een agendaweek December, ma 14 tot zo 20.
- 6,60 s: het label komt van onder; 7,07 s: het draadje loopt omhoog naar do 17; 7,40 s: geknoopt, do 17 krijgt een rand.
- 7,87 s: Buddy (blauw) springt; 8,07 s: di 15 kleurt blauw met een belletje en **"Nog 2 dagen"**.
- Subregel 8,87 s: "Jij kiest wanneer je een herinnering krijgt."

### 4 · CTA (9,8 tot 13,4 s) · doekwipe omlaag naar blauw
- Tagline 9,93 tot 10,40 s: **"Knoop eruit."** (wit) **"Datum erin."** (zachtblauw).
- Knop "activeer buddy" op 10,40 s, Buddy springt ernaast op 10,60 s.
- 11,47 s: de zakdoek valt als hoedje met geknoopte hoeken op Buddy's hoofd; hij knijpt zijn ogen blij dicht.
- "Geen app. Geen bankkoppeling." (10,93 s), woordmerk (11,27 s), tap op de knop 12,47 s.

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3 en de changelog (onboarding v5.1, 4 november 2026): geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs of pakketnaam, geen logo's of namen van andere merken (generieke afzender "Zorgverzekeraar"). Geen "mail op 7 en 2 dagen" en geen betaallink: in pakket Buddy staat de herinnering in je agenda op het moment dat jij kiest. De €40 staat er met "kan". "Nog 2 dagen" is een voorbeeld van een gekozen moment.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1.0)
```
Knoop gelegd. Maar waarvoor? <break time="0.5s" /> Een aanmaning. <break time="0.3s" /> Stuur hem door. <break time="0.3s" /> Buddy leest bedrag en datum. Nu weet je waarvoor. <break time="0.1s" /> In je agenda. Jij kiest wanneer. Knoop eruit. Datum erin. <break time="0.1s" /> Activeer Buddy.
```
De beeldmomenten kloppen op het frame (`timeline.py` op de scène-timings en de constanten in `src/zakdoek/scenes/`). De starttijden van de zinnen zijn een schatting (5 lettergrepen per seconde) en hangen af van de stem.

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Knoop gelegd. Maar waarvoor? | Kop en zakdoek op frame 0; de grote knoop gaat open van 1,00 tot 1,40 s |
| 2,0 | Een aanmaning. | Aanmaning schiet uit de knoop op 1,53 s, chip "Kan uitlopen op €40" op 2,00 s |
| 3,4 | Stuur hem door. | Doekwipe 3,00 tot 3,40 s, tik op Doorsturen op 3,60 s |
| 4,6 | Buddy leest bedrag en datum. | Label landt op 4,40 s, knoop op Buddy op 4,80 s, regels 4,93 tot 5,53 s |
| 6,5 | Nu weet je waarvoor. | Doekwipe 6,20 tot 6,60 s, label knoopt aan do 17 op 7,40 s |
| 7,9 | In je agenda. Jij kiest wanneer. | Buddy springt op 7,87 s, "Nog 2 dagen" op di 15 op 8,07 s, subregel op 8,87 s |
| 10,0 | Knoop eruit. Datum erin. | Doekwipe 9,80 tot 10,20 s, tagline 9,93 tot 10,40 s, knop op 10,40 s |
| 11,8 | Activeer Buddy. | Zakdoekhoedje op Buddy op 11,47 s, tap op 12,47 s, einde op 13,40 s |

**Doellengte:** de mp3 duurt ongeveer 12,8 s (30 woorden). Langer dan 13,2 s? Zet de Speed op 1,05 of maak de eerste break korter. Onder de video zetten: mp3 in `public/`, naam invullen bij de prop `music`, `musicVolume` op 1.

## Caption (Reels)
```
Een knoop in je zakdoek gelegd. Maar waarvoor ook alweer? 🤔 Tot de aanmaning binnenkomt.

Buddy weet wél waarvoor 💙

📩 Stuur je rekening door naar je eigen doorstuuradres
🏷️ Buddy leest het bedrag en de vervaldatum
📅 De rekening staat in je agenda, met een herinnering op het moment dat jij kiest

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #vastelasten #rekeningen #geldzaken #opjezelfwonen
```

**Advertentie (Ads Manager):** primaire tekst "Knoop in je zakdoek, maar geen idee meer waarvoor? Stuur de rekening door en Buddy zet hem in je agenda." (104 tekens) · Kop "Knoop eruit. Datum erin." (24 tekens) · Knop "Aanmelden".

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-50-Zakdoek**, composities `BB-Zakdoek-Reel` en `BB-Zakdoek-Feed`.
- **Blijvend aanpassen:** `src/zakdoek/schema.ts` (`defaultZakdoekProps`): alle teksten, de rekening (afzender, bedrag, vervaldatum), de agendaweek (`firstDay`, `dueDay`, `remindDay`, `remindLabel`), kleuren en scènelengtes.
- **Timing van de beats:** `HOOK_T`, `FORWARD_T`, `AGENDA_T`, `CTA_T` bovenin de bestanden in `src/zakdoek/scenes/`.
- **Nieuw en herbruikbaar:** `src/lib/clothWipe.tsx` (doekwipe, alleen CSS), `src/zakdoek/components/Cloth.tsx` (zakdoek, knoop, zakdoek-hoedje), `HangTag.tsx`, `AgendaWeek.tsx`, `MailRow.tsx`.
- **Exporteren:** `npm run render:zakdoek` (9:16), `npm run render:zakdoek:feed` (4:5), `npm run still:zakdoek` (cover, frame 72).

## Open controles
- Bevestigen welke herinnermomenten je in pakket Buddy kunt kiezen; "Nog 2 dagen" is een voorbeeld.
- Datums staan op december (vervalt do 17 dec); na half december omzetten in het schema.
- Instappagina voor de knop en "link in bio" staat nog open; "aanmaning en incassokosten" past het best, mits die pagina het huidige betaalmodel volgt.
- Voice-over genereren en de lengte controleren.
