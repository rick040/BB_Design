# BetaalBuddy · Instagram ad, concept 102

## "Alles aan één draad."

**In één zin:** je rekeningen liggen los zonder volgorde; je stuurt ze door, Buddy rijgt ze als kralen aan één draad op vervaldatum, en met één export heb je ze als spreadsheet.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Kralen-Reel`) · 4:5 feed 1080×1350 (`BB-Kralen-Feed`) |
| Lengte | 12,0 s (359 frames, 4 scènes, 30 fps). De animatie volgt de stem: scènestarts uit `public/vo/kralen/timing.json` |
| USP | `overzicht` (langst ongebruikt in de changelog-reeks: laatst concept 94) |
| Vorm | vraag en antwoord (niet in 99, 100, 101) |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. Stem in één take (ElevenLabs, eleven_v4), aan en uit met de prop `withVoice` |

**Keuze in één zin:** USP overzicht via de rotatieregel, vorm vraag en antwoord, metafoor kralenketting. Afgevallen: vertrekbord (concept 20 en de split-flap van 71) en radar (concept 18, verkeersleider in een later concept).

### Hoe dit verschilt van de eerdere concepten

| | Concept 1 | Concept 2 | Concept 3 | Concept 62 | Concept 94 (kudde, laatste overzicht) | **Dit concept** |
|---|---|---|---|---|---|---|
| Invalshoek | Volle inbox, aanmaning | Heb ik dat betaald? | Privacy | Wegleggen werkt niet | Rekeningen lopen overal rond | **Wat moet je betalen, en wanneer? Op volgorde plus export** |
| Visueel systeem | UI (inbox, chips) | Reuzengetallen | Focus wazig/scherp | Vluchtbanen | Wei met schapen | **Kralen aan een doorhangende draad, daarna tabel met draad als kantlijn** |
| Rol van Buddy | Slikt de rekening op | Rijdt mee op het aftellen | Slaapmasker | Vangt en gooit | Herdershond | **Rijgt en trekt aan de draad, duwt op Exporteer** |
| Einde | Belofte | "Betaald." | Regie | Omkering | Rust in de lucht | **Bezit: alles aan één draad** |
| Slotbeeld (CTA) | Buddy bij de knop | Buddy op de knop | Buddy op de knop | Buddy gooit boemerang rond de knop | Buddy ligt naast een schaap | **Buddy draagt de ketting met vijf kralen** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | doorlopend shot | **draad (golvende rand), kraalrol (ronde kraal rolt in)** |

Uniciteit: op zes van zes punten anders dan 1, 2, 3 en 62; op vijf van zes anders dan 94 (zelfde USP).

---

## Storyboard (gemeten)

### 1 · Hook: "Wat moet je betalen, en wanneer?" (0,00 tot 2,87 s) · licht
- Frame 0: kop staat, vijf kralen liggen los en dobberen, elk met datum, afzender en bedrag (Energie 17 dec, Sport 28 dec, Zorg 1 dec, Telefoon 22 dec, Gemeente 9 dec).
- 1,03 s ("betalen"): de kralen trillen. 2,00 s ("wanneer"): vraagtekens ploppen boven elke kraal; 2,27 s chip "Welke eerst?".

### 2 · "Buddy rijgt ze op datum." (2,87 tot 6,73 s) · overgang draad naar blauw
- 3,40 s ("door"): chip "Doorgestuurd" met vinkje.
- 3,83 s: een gele draad trekt over het beeld van een knoop links naar Buddy rechts.
- 4,00 tot 5,07 s ("rijgt Buddy ze aan één draad"): de kralen vliegen een voor een op de draad, op volgorde van vervaldatum (1, 9, 17, 22, 28 dec); Buddy trekt bij elke kraal.
- 5,83 s: subregel "Al je rekeningen in één overzicht." 6,07 s ("datum"): de kralen veren in een golf, Buddy kijkt blij.

### 3 · "Wil je een spreadsheet?" (6,73 tot 9,67 s) · overgang kraalrol naar licht
- Kaart "Jouw rekeningen" met kolommen Vervalt, Van, Bedrag; de draad loopt verticaal als kantlijn.
- 7,13 tot 7,93 s: de kralen glijden de draad af, elke kraal vult een rij.
- 8,37 s ("exporteer"): Buddy duwt op Exporteer, chips CSV en JSON. 9,13 s ("zo"): chip "rekeningen.csv" met vinkje.

### 4 · CTA (9,67 tot 12,0 s) · overgang draad (van rechts) naar blauw
- Tagline "Alles aan / één draad." Buddy springt in, een ketting tekent zich over zijn lijf en vijf kralen klikken erop; hij maakt een trots sprongetje.
- 9,87 s knop "activeer buddy", 10,33 s woordmerk, 10,53 s "Geen app. Geen bankkoppeling.", 11,03 s tik op de knop.

---

<!-- copycheck:off -->
## Copyregels
Volgens brand §3: geen gratis, geen prijs (overzicht-concept), geen AI, geen merknamen, generieke afzenders. Het overzicht en de export naar CSV of JSON zitten vanaf Lite in elk pakket. De agenda speelt geen rol.
Aanname om te bevestigen: dat het overzicht de rekeningen op volgorde van vervaldatum toont (ook gebruikt in concept 94).
<!-- copycheck:on -->

## Voice-over (ElevenLabs, één take)

Stem: `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model `eleven_v4`, taal nl, stability 0,5, similarity 0,75, geen andere instellingen. Route: API `/v1/text-to-speech/{voice}/with-timestamps` (HTTP 200). 31 woorden, 10,92 s, langste pauze 0,58 s (silencedetect, -35 dB). Genormaliseerd naar -14 LUFS.

Tekst met scènemarkers (markers gaan niet naar ElevenLabs):
```
[S1] Wat moet je deze maand betalen, en wanneer? [S2] Stuur ze door, dan rijgt Buddy ze aan één draad, op datum. [S3] Wil je een spreadsheet, dan exporteer je ze zo. [S4] Activeer Buddy.
```

| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Wat moet je deze maand betalen, en wanneer? | Losse kralen, vraagtekens op "wanneer" (2,00 s) |
| S2 | 2,87 | 86 | Stuur ze door, dan rijgt Buddy ze aan één draad, op datum. | Doorgestuurd (3,40 s), kralen op de draad (4,00 tot 5,07 s), golf op "datum" (6,07 s) |
| S3 | 6,73 | 202 | Wil je een spreadsheet, dan exporteer je ze zo. | Tabel vult zich, Exporteer op "exporteer" (8,37 s), rekeningen.csv op "zo" (9,13 s) |
| S4 | 9,67 | 290 | Activeer Buddy. | Ketting om, knop (9,87 s), woordmerk (10,33 s) |

Bestanden: `public/vo/kralen/voice-over.mp3` (origineel), `vo.json` (API-antwoord met alignment), `timing.json` (scènestarts en woorden in frames), `renders/kralen-voice-over.mp3` (-14 LUFS).

## Caption (Reels)
```
Weet jij wat je deze maand nog moet betalen, en wanneer? 🧵

Buddy rijgt al je rekeningen aan één draad. 💙
📩 Stuur je rekening door naar je Buddy-adres
📅 Buddy zet ze op volgorde van vervaldatum
📊 Alles in één overzicht, ook als CSV of JSON

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #budgetteren #overzicht
```

**Advertentie (Ads Manager):** primaire tekst (119 tekens) "Al je rekeningen in één overzicht, op volgorde van vervaldatum. Stuur ze door naar Buddy en exporteer naar CSV of JSON." · Kop (20) "Alles aan één draad." · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden". Copycheck: geen treffers.

## Aanpassen en exporteren
- Studio: `npm run dev`, map `Concept-102-Kralen`. Teksten, kralen (afzender, bedrag, datum), kleuren en `withVoice` staan in `src/kralen/schema.ts`.
- Timing komt uit `public/vo/kralen/timing.json`; nieuwe stem = nieuwe timing.json, de beats schuiven mee (`wordAt`).
- `npm run render:kralen`, `render:kralen:feed`, `render:kralen:stil`, `still:kralen` (frame 70).
- Overgangen in `src/lib/kralenWipes.ts`; geen gedeelde code aangepast.

## Open controles
- Instappagina: er is geen overzicht-pagina; algemene startpagina gebruiken.
- Bevestigen dat het overzicht op vervaldatum gesorteerd is.
- Datums staan op december; na december aanpassen in het schema.
- De stem is 10,9 s (doel was ongeveer 13 s); de video is daardoor 12,0 s. Woordaantal (31) zat wel in de marge.
