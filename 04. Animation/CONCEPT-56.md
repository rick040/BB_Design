# BetaalBuddy · Instagram ad, concept 56

## "Niks onder het kleed. Alles op tijd."

**In één zin:** je veegt een rekening onder het kleed, de bult groeit en hij komt terug als aanmaning; stuur hem door, Buddy rolt het kleed op, haalt bedrag en vervaldatum eruit en zet hem in je agenda, en aan het eind veegt hij met zijn bezem de knop in beeld.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Kleed-Reel`) · 4:5 feed 1080×1350 (`BB-Kleed-Feed`) |
| Lengte | 13,4 s (4 scènes, 30 fps, 402 frames), alles aan te passen in Remotion Studio |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. Voice-over (ElevenLabs, stem Daan) zit erin als losse clips per cue, aan en uit met de prop `withVoice` |

### Waarom dit idee
Gekozen uit drie richtingen. "Onder het kleed vegen" is een gezegde dat iedereen kent en dat precies de pijn raakt: je stopt een rekening weg en hij komt groter terug. Het woord "kleed" komt in geen van de 55 eerdere concepten voor. Afgevallen: vuurtoren in de mist (al twee keer afgewezen, te dicht op 22) en kompas (te dicht op 39, navigatie).

### Hoe dit verschilt van de eerdere concepten
Ten opzichte van concept 1 tot 3 (code in deze branch) verschilt het op alle zes punten. Ten opzichte van concept 15 (uitstel, boemerang) en 26 (de mail die je niet durft te openen) deelt het alleen de vermijdingshoek; beeld, rol van Buddy, slotbeeld en overgangen zijn anders.

| | Concept 1 | Concept 2 | Concept 3 | **Dit concept** |
|---|---|---|---|---|
| Invalshoek | Overzicht | Timing | Privacy | **Wegstoppen:** onder het kleed vegen |
| Visueel systeem | UI-gedreven | Typografisch | Focus wazig/scherp | **Objecten in huis:** kleed met bult, bezem, papieren rekening; de agenda is zelf een kleedje met franje |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het aftellen | Slaapmasker | **Rolt het kleed op** en vindt de rekening |
| Einde | Belofte | Uitkomst "Betaald." | Regie | **Gezegde omgedraaid:** "Niks onder het kleed. Alles op tijd." |
| Slotbeeld (CTA) | Buddy gluurt vanaf de rand | Buddy op de knop | Masker weer omlaag | **Buddy veegt de knop met zijn bezem in beeld**, met stofwolkjes |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | **Bezemveeg** (schuine rand met borstelharen, `src/lib/broomSweep.tsx`) en **uitrollen** als een kleed (`src/lib/unroll.tsx`) |

---

## Storyboard (gemeten tijden)

### 1 · Hook: "Rekening onder het kleed geveegd?" (0,0 tot 3,2 s) · licht
- Frame 0: de volledige kop, een blauw kleed en de rekening Energieleverancier €87,60 op de vloer, met een bezem die al veegt.
- 0,0 tot 0,73 s: de bezem veegt de rekening onder het kleed. Op 0,53 s groeit er een bult, die steeds dikker wordt en wiebelt.
- **1,67 s:** de bult barst open; de rekening schiet terug omhoog als **Aanmaning · Energieleverancier · Te laat · €87,60**, met een schok.
- **2,00 s:** chip **"Kan uitlopen op €40"**.
- Cover = frame 75 (2,5 s): kop, aanmaning, €40-chip en het kleed.

### 2 · "Stuur hem door naar Buddy." (2,8 tot 6,8 s) · bezemveeg naar blauw
- 3,20 s: knop **Doorsturen**, tik op **3,60 s**.
- 3,80 s: Buddy springt binnen aan de rechterkant van het kleed (dat nog een bult heeft).
- **4,33 tot 5,47 s:** Buddy rolt het kleed op, van rechts naar links; de rekening komt eronder vandaan.
- **5,60 s:** de rekening staat op als kaart (Energieleverancier · Je factuur van november · Vervalt do 17 dec · €87,60).
- 6,00 en 6,20 s: chips **€87,60** en **do 17 dec**. Subregel op 6,27 s: "Hij haalt er bedrag en vervaldatum uit."

### 3 · "Buddy zet hem in je agenda." (6,4 tot 10,0 s) · kleed rolt uit naar licht
- De lichte scène rolt binnen als een kleed. De agenda (december, ma 14 tot zo 20) heeft dezelfde franje.
- 6,87 s: de rekening vliegt in, **7,33 s** landt hij op **do 17** (tegel wordt blauw met €87,60). Buddy springt blij.
- 7,67 tot 8,13 s: een gele ring springt over de dagen naar **ma 14**; **8,20 s** belletje en label **Herinnering**.
- Subregel op 8,47 s: "Jij kiest wanneer je een herinnering krijgt."

### 4 · CTA (9,6 tot 13,4 s) · bezemveeg naar blauw
- Tagline woord voor woord (9,73 s): **"Niks onder / het kleed. / Alles op tijd."** (laatste regel zachtblauw).
- **10,07 tot 11,00 s:** Buddy veegt met zijn bezem de knop **"activeer buddy"** van links in beeld, met stofwolkjes.
- 10,93 s "Geen app. Geen bankkoppeling.", 11,20 s woordmerk, 11,47 s knipoog, **12,00 s** tap op de knop.

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3 en de changelog (onboarding v5.1, 4 november 2026): geen gratis of proefperiode, geen WhatsApp, Telegram of Signal, geen inbox scannen, geen prijs of pakketnaam, geen andere merknamen. Volgens v5.1 geeft pakket Buddy een herinnering in je agenda op zelfgekozen momenten; mailherinneringen zitten alleen in Buddy pro. Deze ad belooft daarom geen "mail op 7 en 2 dagen", alleen de agenda en "Jij kiest wanneer je een herinnering krijgt". €40 staat er alleen met "kan uitlopen op".

Productclaims en waar ze op rusten:
- Doorsturen naar Buddy: het product werkt met doorsturen naar je eigen doorstuuradres.
- Bedrag en vervaldatum: wat Buddy uit de doorgestuurde mail haalt.
- In je agenda, herinnering wanneer jij kiest: onboarding v5.1, pakket Buddy.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2)

**Stem:** Daan, Energetic and natural (voice ID `SFlhmoT9q6x81D3fl3dp`, uit `ELEVENLABS_VOICE_ID`). **Route:** ElevenLabs API, per cue een losse clip met `previous_text` en `next_text`, stability 0,5, similarity 0,75, style 0,2, speaker boost aan, Speed 1,0. Niet versneld. Clips staan in `public/vo/kleed/cue-01.mp3` tot `cue-07.mp3` en worden met `<Sequence from>` op de frames hieronder gezet (prop `voiceCues` in `src/kleed/schema.ts`).

| Cue | Startframe | Starttijd | Tekst | Cliplengte | Lucht tot volgende cue | Beeld |
|---|---|---|---|---|---|---|
| 01 | 0 | 0,00 s | Rekening onder het kleed geveegd? | 1,75 s | 0,32 s | Kop en kleed op frame 0, bezem veegt, bult op 0,53 s |
| 02 | 62 | 2,07 s | Tot de aanmaning komt. | 1,20 s | 0,33 s | Aanmaning op 1,67 s, €40-chip op 2,00 s |
| 03 | 108 | 3,60 s | Stuur hem door naar Buddy. | 1,20 s | 0,80 s | Tik op Doorsturen op 3,60 s |
| 04 | 168 | 5,60 s | Buddy vindt bedrag en datum. | 1,44 s | 0,36 s | Rekening staat op 5,60 s, chips 6,00 en 6,20 s |
| 05 | 222 | 7,40 s | En zet hem in je agenda. | 1,33 s | 1,13 s | Rekening landt op do 17 op 7,33 s |
| 06 | 296 | 9,87 s | Niks onder het kleed. Alles op tijd. | 1,80 s | 0,33 s | Tagline vanaf 9,73 s |
| 07 | 360 | 12,00 s | Activeer Buddy. | 1,20 s | 0,20 s tot het einde | Tap op de knop op 12,00 s, einde 13,40 s |

Gemeten in de render (silencedetect): de spraak begint op 0,0 · 2,13 · 3,61 · 5,66 · 7,45 · 9,94 · 12,08 s. De audio is genormaliseerd naar -14 LUFS (gemeten -14,3), true peak -1 dB.

Plakblok (als je hem in één keer wilt genereren, Speed 1,0):
```
Rekening onder het kleed geveegd? <break time="0.3s" /> Tot de aanmaning komt. <break time="0.3s" /> Stuur hem door naar Buddy. <break time="0.8s" /> Buddy vindt bedrag en datum. <break time="0.3s" /> En zet hem in je agenda. <break time="1.1s" /> Niks onder het kleed. Alles op tijd. <break time="0.3s" /> Activeer Buddy.
```

## Caption (Reels)

```
Die ene rekening even onder het kleed geveegd? Hij komt terug. Meestal als aanmaning. 🧹

Buddy rolt het kleed voor je op 💙
📩 Stuur je rekening door naar Buddy
🔎 Buddy haalt er het bedrag en de vervaldatum uit
📅 Hij zet de rekening in je agenda
⏰ Jij kiest wanneer je een herinnering krijgt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #vastelasten #opjezelfwonen
```

**Advertentie (Ads Manager):** primaire tekst "Rekening onder het kleed geveegd? Stuur hem door naar Buddy. Hij zet hem in je agenda, met een herinnering wanneer jij kiest." · Kop "Niks onder het kleed. Alles op tijd." · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden".

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-56-Kleed**, composities `BB-Kleed-Reel` en `BB-Kleed-Feed`.
- **Blijvend aanpassen:** `src/kleed/schema.ts` (`defaultKleedProps`): teksten, rekening, agenda-dagen, kleuren, scènelengtes, `withVoice`, `voiceVolume` en `voiceCues` (bestand plus startframe per cue).
- **Beats:** de objecten `HOOK_T`, `LIFT_T`, `AGENDA_T` en `CTA_T` bovenin `src/kleed/scenes/`. Verschuif je die, reken de cue-tabel opnieuw uit met `timeline.py` en pas `voiceCues` aan.
- **Exporteren:** `npm run render:kleed` en `render:kleed:feed` (met stem), `render:kleed:stil` en `render:kleed:feed:stil` (zonder stem), `npm run still:kleed` (cover, frame 75). Normaliseren: `ffmpeg -i in.mp4 -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac out.mp4`.

## Open controles
- Welke herinnermomenten je in pakket Buddy kunt kiezen; "ma 14" is een voorbeeld. De datums staan op december; na half december omzetten.
- Instappagina voor de knop en "link in bio" staat nog open. "Aanmaning en incassokosten" past het best.
- Uitspraak "Buddy" en "kleed" in de clips even beluisteren; de lengtes zijn gemeten, de klank niet door een mens gecontroleerd.
