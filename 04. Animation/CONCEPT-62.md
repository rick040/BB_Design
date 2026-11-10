# BetaalBuddy · Instagram ad, concept 62

## "Laat de rest maar dwarrelen."

**In één zin:** je maand is een sneeuwbol vol papiertjes en die ene rekening van de Energieleverancier dwarrelt weg tot er een aanmaning ligt; je stuurt hem door, Buddy vangt hem in de sneeuwbol en zet hem in je agenda, en als de bol aan het eind hard geschud wordt, blijft Buddy rustig op zijn datum staan.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Sneeuwbol-Reel`) · 4:5 feed 1080×1350 (`BB-Sneeuwbol-Feed`) |
| Lengte | 11,2 s (4 scènes, 30 fps, 336 frames): stem 9,95 s plus 1,25 s voor de CTA |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. Voice-over in één take zit erin (prop `withVoice`), stille versie apart |

### Hoe dit verschilt van de eerdere concepten
| | Concept 1 | Concept 2 | Concept 3 | **Dit concept** |
|---|---|---|---|---|
| Invalshoek | Overzicht (volle inbox) | Timing (aftellen) | Privacy | **Wegdwarrelen:** die ene rekening raakt kwijt in alles wat door je hoofd waait |
| Visueel systeem | UI-gedreven (inbox, chips) | Typografisch (reuzengetal) | Focus: wazig tegenover scherp | **Fysiek object:** een sneeuwbol waarin papieren rekeningetjes als sneeuw dwarrelen |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het aftellen | Slaapmasker | **Woont in de sneeuwbol:** springt op en vangt de rekening op zijn hoofd |
| Einde | Belofte | Uitkomst "Betaald." | Regie | **Rust:** alles mag dwarrelen, jouw datum staat vast |
| Slotbeeld (CTA) | Buddy bij de knop | Buddy op de knop | Buddy op de knop, masker omlaag | **Buddy staat in de geschudde sneeuwbol op zijn datumtegel "do 17"**, de knop staat eronder |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | **globe shake** (scène wordt geschud, nieuwe zakt neer) en **flurry wipe** (nieuwe scène verschijnt door vallende vlokken), allebei eigen CSS |

Sneeuwbol, sneeuw en schudden komen in geen van de 61 eerdere concepten voor (gecontroleerd in de changelog). Het dichtst in de buurt: 61 (dun ijs, winter maar geen sneeuwbol) en 33 (sneeuwbal, invalshoek "klein begonnen"). Met die twee verschilt dit concept op invalshoek, visueel systeem, rol van Buddy, slotbeeld en overgangen.

---

## Voice-over (ElevenLabs, één take)

Stem Roos (voice ID `7qdUFMklKPaaAVMsBTBt`), model `eleven_v4`, stability 0,5, similarity 0,75, taal nl. Route: API met-timestamps. 32 woorden, 9,95 s, langste pauze 0,48 s.

Zo getypt in ElevenLabs (markers gaan niet mee):

```
Dwarrelt die ene rekening ook altijd weg, tot er een aanmaning ligt? Stuur hem door naar Buddy, want die vangt hem en zet hem in je agenda, dus de rest mag dwarrelen.
```

Met scènemarkers:

> [S1] Dwarrelt die ene rekening ook altijd weg, tot er een aanmaning ligt? [S2] Stuur hem door naar Buddy, [S3] want die vangt hem en zet hem in je agenda, [S4] dus de rest mag dwarrelen.

Bestanden: `public/vo/sneeuwbol/voice-over.mp3` (in de video), `vo.json` (ElevenLabs-antwoord met alignment), `timing.json` (scènestarts en elk woord in frames). Genormaliseerd (-14 LUFS): `renders/sneeuwbol-voice-over.mp3`.

### Cue-tabel (gemeten uit de alignment)

| Marker | Start | Frame | Gesproken | Beeld |
|---|---|---|---|---|
| S1 | 0,00 s | 0 | Dwarrelt die ene rekening ook altijd weg, | Sneeuwbol vol papiertjes, briefje Energie €87,60 draait mee en verdwijnt bij "weg" (2,07 s) |
| | 3,08 s | 92 | tot er een aanmaning ligt? | Aanmaning slaat neer, stempel AANMANING, chip "Kan uitlopen op €40" bij "ligt" (3,53 s) |
| S2 | 4,32 s | 130 | Stuur hem door naar Buddy, | Globe shake naar blauw; tik op Doorsturen, mail vliegt bij "door" (4,80 s), Buddy slikt hem bij "Buddy" (5,13 s) |
| S3 | 5,80 s | 174 | want die vangt hem en zet hem in je agenda, | Flurry wipe naar licht; Buddy springt en vangt het briefje bij "vangt" (6,17 s), briefje vliegt naar do 17 bij "zet" (6,87 s), landt bij "agenda" (7,43 s), belletje op ma 14 |
| S4 | 8,24 s | 247 | dus de rest mag dwarrelen. | Globe shake naar blauw; knop bij "rest" (8,80 s), sneeuwbol wordt geschud bij "dwarrelen" (9,23 s), Buddy blijft op zijn datum staan |

---

## Storyboard (gemeten)

Elke overgang (0,4 s) ligt gecentreerd op de cue. Beats hangen via `wordAt()` in `src/sneeuwbol/vo.ts` aan gesproken woorden.

### 1 · Hook: "Dwarrelt jouw rekening ook weg?" (0,00 tot 4,53 s) · licht
- Frame 0: complete kop, sneeuwbol vol papieren rekeningetjes, het briefje *Energie €87,60* draait duidelijk mee.
- 1,07 tot 2,40 s: het briefje drijft naar de rand, kantelt en lost op in de sneeuw.
- 3,07 s: de aanmaning van de Energieleverancier slaat voor de bol neer, met stempel en schok. 3,53 s: chip "Kan uitlopen op €40".
- Cover: frame 112 (3,73 s).

### 2 · "Stuur hem door naar Buddy." (4,13 tot 6,00 s) · globe shake naar blauw
- Mailkaart *Van: Energieleverancier · Je factuur van november · €87,60* met knop Doorsturen.
- Tik op 4,57 s, de kaart vliegt in een boog naar Buddy (4,80 s) en hij slikt hem bij "Buddy" (5,13 s).

### 3 · "Buddy zet hem in je agenda." (5,60 tot 8,43 s) · flurry wipe naar licht
- Kleinere sneeuwbol met blauwe Buddy erin, de sneeuw komt tot rust.
- Het briefje valt; Buddy springt en vangt het op zijn hoofd (6,17 s).
- Het briefje zweeft uit de bol naar een weekstrook ma 14 tot vr 18 en landt op **do 17** (7,43 s). Belletje met "Herinnering" op ma 14 (7,70 s).
- Subregel: "Met een herinnering wanneer jij dat wilt."

### 4 · CTA (8,03 tot 11,20 s) · globe shake naar blauw
- Tagline "Laat de rest / maar dwarrelen." (tweede regel zachtblauw).
- Witte Buddy staat in een blauwe sneeuwbol op een datumtegel "do 17".
- Knop "activeer buddy" bij "rest" (8,80 s). Bij "dwarrelen" (9,23 s) wordt de bol hard geschud: alle papiertjes wervelen, Buddy en zijn datum blijven staan, hij knijpt blij zijn ogen dicht.
- Subregel "Geen app. Geen bankkoppeling.", woordmerk, tik op de knop (10,57 s).

---

<!-- copycheck:off -->
## Copyregels
- Geen gratis, proefperiode, prijzen, pakketnamen, WhatsApp of andermans merknamen. Afzender generiek: Energieleverancier.
- Volgt onboarding v5.1 (changelog 4 november 2026): herinnering in je agenda op een moment dat jij kiest. Geen "mail op 7 en 2 dagen", geen betaallink.
- €40 alleen als "Kan uitlopen op €40".
- Het merkreferentiebestand van de skill noemt nog "mail op 7 en 2 dagen" en Basic/Standard/Premium; de changelog wint.
<!-- copycheck:on -->

## Caption (Reels)

```
Die ene rekening die altijd wegdwarrelt tussen al je andere post? Tot er ineens een aanmaning ligt. ❄️

Zo houd je hem vast:
📩 Stuur de rekening door naar Buddy
🔍 Buddy haalt er het bedrag en de vervaldatum uit
📅 Hij zet hem in je agenda
🔔 Met een herinnering op het moment dat jij kiest

Geen app. Geen bankkoppeling. Laat de rest maar dwarrelen.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #vastelasten #geldzaken #rekeningen #opjezelfwonen
```

**Advertentie (Ads Manager):**
- Primaire tekst: "Dwarrelt die ene rekening steeds weg tot de aanmaning? Stuur hem door, Buddy zet hem in je agenda." (98 tekens)
- Kop: "Laat de rest maar dwarrelen." (28 tekens)
- Beschrijving: "Geen app. Geen bankkoppeling."
- Knop: Aanmelden

Copycheck: alleen de €40-regel, met "kan".

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-62-Sneeuwbol**.
- **Blijvend aanpassen:** `src/sneeuwbol/schema.ts` (`defaultSneeuwbolProps`): teksten, rekening, weekdagen, kleuren, scènestarts, `withVoice`, `voiceFile`.
- **Nieuwe stem:** vervang `public/vo/sneeuwbol/`, maak `vo.ts` opnieuw uit `timing.json`; scènes en beats schuiven vanzelf mee.
- **Exporteren:** `npm run render:sneeuwbol`, `npm run render:sneeuwbol:feed`, `npm run still:sneeuwbol` (cover, frame 112). Stille versie: `--props='{"withVoice":false}'`.
- **Renders:** `renders/sneeuwbol-reel-vo.mp4`, `sneeuwbol-feed-vo.mp4`, `sneeuwbol-reel-stil.mp4`, `sneeuwbol-feed-stil.mp4`, `sneeuwbol-voice-over.mp3`, `sneeuwbol-cover.png`.

## Open controles
- Take op `eleven_v4` beluisteren, vooral de uitspraak van "Buddy".
- Video is 11,2 s: de woordgrens van 28 tot 32 woorden levert bij deze stem ongeveer 10 s spraak op, niet 13 s.
- Welke herinnermomenten je in pakket Buddy kiest; "ma 14" is een voorbeeld. Datums staan op december.
- Instappagina voor knop en link in bio staat nog open.
