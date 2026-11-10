# BetaalBuddy · Instagram ad, concept 59

## "Ruis eruit. Datum erin."

**In één zin:** je hoofd en je inbox staan vol ruis, en tussen de nieuwsbrieven, sales en groepsapps mis je die ene rekening tot er een aanmaning ligt; stuur hem door, Buddy krijgt een antenne, stemt de radio af tot alleen bedrag en vervaldatum helder doorkomen, en zet die in je agenda met een herinnering wanneer jij wilt.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Radio-Reel`) · 4:5 feed 1080×1350 (`BB-Radio-Feed`) |
| Lengte | 11,0 s (4 scènes, 30 fps, 330 frames): stem 9,9 s plus 1,1 s voor de CTA |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid (alle tekst staat in beeld). Voice-over is één doorlopende ElevenLabs-take; de animatie is op de stem gebouwd |

### Hoe dit verschilt van de eerdere concepten
In deze repo staan concept 1 tot 3; concept 4 tot 58 staan op losse branches en in de changelog. Radio, ruis, afstemmen en een antenne komen in geen van de 58 concepten voor. Het dichtst in de buurt: concept 22 (natuurdocumentaire, "uit het oog") en 39 (navigatie-app); beide gebruiken een ander beeld, een andere rol voor Buddy en andere overgangen.

| | Concept 1 | Concept 2 | Concept 3 | **Dit concept** |
|---|---|---|---|---|
| Invalshoek | Overzicht (volle inbox) | Timing (twijfel) | Privacy | **Ruis:** je hóórt die ene rekening niet tussen alle andere prikkels |
| Visueel systeem | UI-gedreven | Typografisch (reuzengetal) | Focus wazig/scherp | **Object-gedreven: een retro radio** met zenderschaal, naald en oscilloscoop (ruis wordt een zuivere sinus) |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het aftellen | Slaapmasker | **Krijgt een antenne:** vangt de doorgestuurde mail op en draait de afstemknop |
| Einde | Belofte | Uitkomst "Betaald." | Regie | **Helderheid:** "Ruis eruit. Datum erin." |
| Slotbeeld (CTA) | Buddy gluurt van rechts | Buddy op de knop | Buddy boven de knop, masker omlaag | **Buddy als zender:** antenne licht geel op en zendt ringen uit boven de knop |
| Overgangen | iris, slide | klok-wipe, slide | wipe, focus pull | **needle sweep** (een afstemnaald veegt over het beeld) en **signal rings** (het nieuwe beeld komt binnen als radiogolven); beide eigen CSS-overgangen |

Uniciteitstoets op de vijf punten van de taak (invalshoek, visueel systeem, wat Buddy doet, soort einde, overgangen): op alle vijf anders dan concept 1, 2 en 3.

---

## Werkwijze: animatie op de stem

1. De voice-over is in **één take** gegenereerd via de ElevenLabs-API (`/with-timestamps`), stem uit `ELEVENLABS_VOICE_ID` (`7qdUFMklKPaaAVMsBTBt`), Multilingual v2, Speed 1,0. Geen losse clips, geen geplakte stilte.
2. Uit `alignment.character_start_times_seconds` zijn de scènestarts en de woordmomenten gehaald: `public/vo/radio/timing.json`.
3. `src/radio/schema.ts` leest dat bestand. Elke overgang is gecentreerd op het frame waarop de stem de scène begint; de beats in de scènes hangen aan de gesproken woorden (`VO_WORDS`).
4. De stem staat als één `<Audio>` vanaf frame 0, aan en uit met de prop `withVoice`.

---

## Storyboard

### 1 · Hook: "Mis jij die rekening in alle ruis?" (0,0 tot 3,4 s) · licht
- Frame 0: kop staat al bijna helemaal, de radio staat in beeld met ruis op de oscilloscoop. Rondom flikkeren generieke chips: Nieuwsbrief, Groepsapp (14), Je pakket komt, Sale, Update.
- De naald zwerft over de zenders (Nieuws, Sale, Pakket, Apps). **1,50 s** ("rekening"): de naald schiet over een verborgen zender "Energie", die even rood oplicht en weer wegvalt.
- **2,40 s** ("aanmaning"): kaart *Aanmaning · Energieleverancier · €87,60* slaat op de radio, beeld schudt. **2,73 s:** chip "Kan uitlopen op €40".
- Cover = frame 85 (2,83 s).

### 2 · "Stuur hem door naar Buddy." (3,4 tot 4,9 s) · needle sweep (rode naald van links) naar blauw
- Mailkaart *Energieleverancier · Je factuur van november* met knop Doorsturen; tik op **3,70 s** ("stuur").
- De kaart krimpt tot een stip en vliegt naar de antenne van Buddy; **4,47 s** ("Buddy"): vangst, squash, antennetip wordt geel en zendt ringen uit.

### 3 · "Buddy stemt af op je vervaldatum." (4,9 tot 8,8 s) · signal rings naar licht
- Buddy duwt drie keer tegen de afstemknop; de ruis wordt een zuivere golf. **5,40 s** ("vervaldatum"): het scherm toont helder **€87,60**, chip "Vervalt do 17 dec".
- **6,07 s:** weekstrip ma 14 tot vr 18 springt in; **6,47 s** ("agenda"): €87,60 landt op do 17.
- **7,23 s** ("herinnering"): gele chip met belletje "Herinnering" op ma 14. **7,80 s** ("wanneer jij wilt"): subregel "Jij kiest wanneer je een herinnering krijgt."

### 4 · CTA (8,8 tot 11,0 s) · needle sweep (zachtblauw, van rechts) naar blauw
- Tagline stapelt: **"Ruis eruit."** wit, **"Datum erin."** zachtblauw.
- **8,77 s** ("Activeer Buddy"): Buddy gaat "in de lucht", antenne geel met zendringen. Knop "activeer buddy", tap-ripple op 9,70 s.
- "Geen app. Geen bankkoppeling." en het woordmerk.

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3, aangevuld met de changelog (onboarding v5.1, 4 november 2026): herinnering in je agenda op een moment dat jij kiest. Geen "mail op 7 en 2 dagen", geen prijs, geen pakketnaam, geen betaallink, niets gratis, geen WhatsApp, geen merknamen. €40 alleen als "Kan uitlopen op €40". Datums in december zijn voorbeelden.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, één take)

Stem: Roos (voice ID `7qdUFMklKPaaAVMsBTBt`), stability 0,4, similarity 0,75, style 0,3, Speed 1,0, speaker boost aan. 32 woorden, 9,9 s. Bestand: `public/vo/radio/voice-over.mp3` (genormaliseerd: `renders/radio-voice-over.mp3`).

Tekst met scènemarkers (de markers gaan niet naar ElevenLabs):
```
[S1] Tussen alle ruis mis je die rekening, tot de aanmaning komt. [S2] Dus stuur hem door naar Buddy, [S3] dan staat de vervaldatum in je agenda, met een herinnering wanneer jij wilt. [S4] Activeer Buddy.
```

| Cue | Start (s) | Frame | Gesproken | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Tussen alle ruis mis je die rekening, tot de aanmaning komt. | Radio vol ruis; Energie flitst op 1,50 s; aanmaning op 2,40 s |
| S2 | 3,38 | 101 | Dus stuur hem door naar Buddy, | Midden van de needle sweep; tik op Doorsturen 3,70 s; vangst 4,47 s |
| S3 | 4,85 | 146 | dan staat de vervaldatum in je agenda, met een herinnering wanneer jij wilt. | Midden signal rings; helder signaal 5,40 s; do 17 op 6,47 s; herinnering 7,23 s |
| S4 | 8,75 | 263 | Activeer Buddy. | Midden needle sweep; Buddy zendt; tap 9,70 s; einde 11,0 s |

Luistertoets (ffmpeg silencedetect, -35 dB): geen pauze van 0,3 s of langer tussen eerste en laatste woord (de langste ademruimte is 0,15 s bij "Buddy,"); geen digitale stilte van 0,25 s of langer onder -60 dB.

## Caption (Reels)
```
Tussen alle meldingen hoor je die ene rekening niet. Tot de aanmaning komt. 📻

Buddy filtert de ruis eruit 🔵
📩 Stuur je rekening door naar Buddy
🔎 Hij haalt bedrag en vervaldatum eruit
📅 Hij zet de datum in je agenda, met een herinnering wanneer jij wilt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #vastelasten #opjezelfwonen
```

**Advertentie (Ads Manager):**
- Primaire tekst: "Mis jij die ene rekening tussen alle ruis? Stuur hem door, Buddy zet de vervaldatum in je agenda."
- Kop: "Ruis eruit. Datum erin."
- Beschrijving: "Geen app. Geen bankkoppeling."
- Knop: "Aanmelden"

## Aanpassen en exporteren
- Studio: `npm run dev`, map **Concept-59-Radio**. Teksten, kleuren en cues in `src/radio/schema.ts` (`defaultRadioProps`).
- Nieuwe take? Zet `vo.json` en `voice-over.mp3` in `public/vo/radio/`, maak `timing.json` opnieuw; de cues volgen vanzelf.
- `npm run render:radio`, `render:radio:feed`, `render:radio:stil`, `render:radio:feed:stil`, `still:radio` (cover frame 85).

## Open controles
- Instappagina voor de knop en link in bio staat nog open; "aanmaning en incassokosten" past het best.
- Bevestigen welke herinnermomenten je in pakket Buddy kunt kiezen; "ma 14" is een voorbeeld. Datums staan op december.
- Take beluisteren op de uitspraak van "Buddy".
- Video is 11,0 s: 32 woorden duren bij deze stem 9,9 s. Voor 13 s zijn ongeveer 40 woorden nodig.
