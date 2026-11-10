# BetaalBuddy · Instagram ad, concept 59

## "Geen ruis. Gewoon op tijd."

**In één zin:** je mailbox is een radio vol ruis en je energierekening verdwijnt erin tot hij terugkomt als aanmaning; stuur hem door, Buddy springt op de afstemknop, draait naar zijn eigen zender tot de ruis weg is en de rekening scherp staat, en zet hem in je agenda.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Ruis-Reel`) · 4:5 feed 1080×1350 (`BB-Ruis-Feed`) |
| Lengte | 10,3 s (4 scènes, 30 fps, 310 frames): stem 9,33 s plus 1 s CTA |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Eerste concept dat op de stem gebouwd is: één ElevenLabs-take, de scènes volgen `public/vo/ruis/timing.json`. Werkt ook zonder geluid (stille versie apart gerenderd) |

### Hoe dit verschilt van de eerdere concepten
In de code staan concept 1 tot 3; concepten 4 tot 58 staan op losse branches en in de changelog. Radio, afstemmen, ruis en zenders komen in geen van die 58 voor.

| | Concept 1 | Concept 2 | Concept 3 | **Dit concept** |
|---|---|---|---|---|
| Invalshoek | Overzicht (volle inbox) | Timing (aftellen) | Privacy | **Ruis:** de rekening verdwijnt tussen al het andere |
| Visueel systeem | UI-gedreven | Typografisch (reuzengetal) | Focus (wazig tegen scherp) | **Radio-afstemmer:** frequentieschaal, naald, beeldruis die oplost in een schone golf |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het aftellen | Slaapmasker | **Springt op de afstemknop** en draait hem met zijn gewicht naar de zender "Buddy" |
| Einde | Belofte | Uitkomst "Betaald." | Regie | **Rust:** "Geen ruis. Gewoon op tijd." |
| Slotbeeld (CTA) | Logo en knop | Buddy op de knop | Buddy met masker boven de knop | **Buddy met koptelefoon, ogen blij dicht, knikt mee op een rustige golf** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | **eigen static wipe** (band beeldruis, `src/lib/staticWipe.tsx`) en **CRT squeeze** (beeld klapt in tot een lijn, `src/lib/crtSqueeze.tsx`) |

---

## Storyboard (gemeten op de stem)

### 1 · Hook: "Raakt jouw rekening zoek in de ruis?" (0,00 tot 4,67 s) · licht
- Frame 0: kop compleet, een radio met frequentieschaal; in het scherm vier mails (Webshop, Pakketdienst, Energieleverancier, Sportschool) onder beeldruis. De naald zoekt heen en weer.
- 1,67 tot 2,80 s (stem: "energierekening zoek"): de mail van de Energieleverancier vervaagt in de ruis, de ruis wordt dichter.
- 3,33 s (stem: "aanmaning"): de rekening knalt terug als aanmaning (€87,60, stempel), het beeld schudt. Chip "Kan uitlopen op €40" op 3,73 s.
- Cover = frame 118 (3,93 s).

### 2 · "Stuur hem door naar Buddy." (4,27 tot 6,17 s) · static wipe naar blauw
- Scènestart [S2] op frame 134 (4,47 s, "Stuur").
- 4,47 s: Buddy springt in een lage boog op de afstemknop. 4,87 tot 5,53 s: zijn gewicht draait de knop, de naald schuift naar de zender **Buddy**, de ruis verdwijnt en de doorgestuurde rekening (Doorgestuurd · Energieleverancier · €87,60) wordt scherp. 5,47 s: zender licht op, chip "Vervalt do 17 dec".

### 3 · "Buddy zet hem in je agenda." (5,77 tot 7,70 s) · CRT squeeze naar licht
- Scènestart [S3] op frame 179 (5,97 s, "want").
- De schone golf wordt een rechte lijn, daar groeien zeven dagen uit (ma 14 tot zo 20). 6,63 s: de rekening landt op do 17 (stem: "agenda" op 6,83 s). 6,97 s: geel belletje "Herinnering" op ma 14.
- Subregel: "Jij kiest wanneer je een herinnering krijgt."

### 4 · CTA (7,30 tot 10,33 s) · static wipe omhoog naar blauw
- Scènestart [S4] op frame 225 (7,50 s, "Geen"). De tagline valt woord voor woord op de stem: Geen 7,50 · ruis 7,83 · Gewoon 8,30 · op 8,67 · tijd 8,83 s.
- Buddy met koptelefoon knikt mee op een rustige golf. Knop "activeer buddy" op 8,97 s, "Geen app. Geen bankkoppeling." en het woordmerk, tap op 9,77 s.

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3 en de changelog (onboarding v5.1, 4 november 2026): geen gratis of proefperiode, geen WhatsApp, geen prijs of pakketnaam, geen "mail op 7 en 2 dagen" als belofte, geen betaallink-belofte, geen andere merknamen (afzenders zijn generiek). €40 alleen als "Kan uitlopen op €40".

Productclaims: doorsturen naar je eigen doorstuuradres; Buddy haalt bedrag en vervaldatum eruit; hij zet de rekening in je agenda met een herinnering op een moment dat jij kiest (pakket Buddy); geen app, geen bankkoppeling.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, één take)

- Stem: Roos (voice ID `7qdUFMklKPaaAVMsBTBt`, uit `ELEVENLABS_VOICE_ID`), model `eleven_multilingual_v2`, stability 0,4, similarity 0,75, style 0,3, speed 1,0, speaker boost aan. Route: API `text-to-speech/<voice>/with-timestamps`.
- Bestanden: `public/vo/ruis/vo.json` (antwoord met alignment), `voice-over.mp3` (9,38 s), `timing.json` (scènestarts in frames). Genormaliseerde versie (-14 LUFS): `renders/ruis-voice-over.mp3`.
- Luistertoets (ffmpeg silencedetect): geen pauze boven 0,2 s tussen eerste en laatste woord (grens 0,6 s); digitale stilte (onder -60 dB) alleen na het laatste woord. Niet versneld.

Tekst met markers (de markers gaan niet naar ElevenLabs), 31 woorden:

```
[S1] Tussen al je mail raakt je energierekening zoek, tot er een aanmaning ligt. [S2] Stuur hem dus door naar Buddy, [S3] want die zet hem in je agenda. [S4] Geen ruis, gewoon op tijd.
```

| Cue | Start (s) | Frame | Gesproken | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Tussen al je mail raakt je energierekening zoek, tot er een aanmaning ligt. | Radio vol ruis, rekening vervaagt (1,67 tot 2,80 s), aanmaning op 3,33 s |
| S2 | 4,47 | 134 | Stuur hem dus door naar Buddy, | Static wipe, Buddy op de knop, ruis weg, zender Buddy |
| S3 | 5,97 | 179 | want die zet hem in je agenda. | CRT squeeze, week groeit uit de lijn, rekening op do 17 |
| S4 | 7,50 | 225 | Geen ruis, gewoon op tijd. | Tagline op de woorden, Buddy met koptelefoon, knop |

In Remotion: één `<Audio>` vanaf frame 0, aan en uit met de prop `voice.withVoice`. De scènestarts staan als `voice.s2/s3/s4/end` in het schema (default uit `timing.json`); overgangen beginnen `timing.lead` (6) frames voor het gesproken woord.

## Caption (Reels)

```
Tussen alle mail, meldingen en reclame raakt die ene rekening zoek. Tot er ineens een aanmaning ligt. 📻

Zo verdwijnt hij niet meer in de ruis 🎧
📩 Stuur een rekening door naar je eigen doorstuuradres
🔍 Buddy haalt er bedrag en vervaldatum uit
📅 Hij zet hem in je agenda, met een herinnering wanneer jij kiest

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #vastelasten #opjezelfwonen
```

**Advertentie (Ads Manager):** primaire tekst "Raakt je rekening zoek tussen al je mail? Stuur hem door naar Buddy. Hij zet hem in je agenda, met een herinnering." (115 tekens) · Kop "Geen ruis. Gewoon op tijd." (26) · Beschrijving "Geen app. Geen bankkoppeling." (29) · Knop "Aanmelden".

Copycheck: alleen de €40-regel ("Kan uitlopen op €40", toegestaan met "kan").

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-59-Ruis**.
- **Blijvend aanpassen:** `src/ruis/schema.ts` (`defaultRuisProps`). Nieuwe take? Overschrijf `public/vo/ruis/voice-over.mp3` en `timing.json`; de scènes schuiven mee.
- **Beats:** `HOOK_T`, `TUNE_T`, `AGENDA_T`, `CTA_T` bovenin de scènes in `src/ruis/scenes/`.
- **Exporteren:** `npm run render:ruis`, `render:ruis:feed`, `render:ruis:stil`, `render:ruis:feed:stil`, `still:ruis` (cover, frame 118). Normaliseer VO-versies daarna met `ffmpeg -i in.mp4 -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac out.mp4`.

## Open controles
- Lengte 10,3 s, korter dan de gebruikelijke 12 tot 16 s: 31 woorden duren bij Roos 9,3 s. Voor ongeveer 13 s zijn ruim 40 woorden nodig.
- Welke herinnermomenten je in pakket Buddy kunt kiezen; "ma 14" is een voorbeeld. Datums staan op december.
- Take beluisteren op de uitspraak van "Buddy" en "energierekening".
- Instappagina voor knop en link in bio staat nog open; "aanmaning en incassokosten" past het best.
