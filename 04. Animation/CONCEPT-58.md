# BetaalBuddy · Instagram ad, concept 58

## "Thee laat je trekken. Rekeningen niet."

**In één zin:** een rekening is net thee: het theezakje "Energie €87,60" hangt in de mok, de thee wordt steeds donkerder en het label wordt een aanmaning; stuur hem door, Buddy trekt het zakje er op tijd uit en zet de rekening in je agenda, met een herinnering wanneer jij kiest.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Thee-Reel`) · 4:5 feed 1080×1350 (`BB-Thee-Feed`) |
| Lengte | 10,1 s (4 scènes, 30 fps, 303 frames). Lengte volgt de stem: 9,1 s stem plus 1,0 s voor de CTA |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Eén doorlopende ElevenLabs-take onder de hele video (prop `withVoice`). Zonder geluid volledig te volgen |

### Hoe dit verschilt van de eerdere concepten
Vergeleken met concept 1 tot 3 en met de concepten die er qua soort beeld het dichtst bij zitten (51 bordjes, 55 zeef, 57 vloed). "Thee", "mok" en "theezakje" komen in geen van de 57 concepten voor (gecontroleerd in alle CONCEPT-bestanden op alle branches en in de changelog).

| | Concept 1 | Concept 2 | Concept 3 | Concept 55 | Concept 57 | **Dit concept** |
|---|---|---|---|---|---|---|
| Invalshoek | Overzicht | Timing | Privacy | Geheugen als zeef | Struisvogel, wegspoelen | **Laten liggen maakt het bitter:** hoe langer, hoe erger (kosten lopen stil op) |
| Visueel systeem | UI | Typografisch | Focus | Keukenzeef | Waterlijn | **Eén mok thee** die van licht naar bijna zwart kleurt, met een tijdchip "Ligt er 2 dagen / 1 week / 3 weken" |
| Rol van Buddy | Slikt de rekening | Rijdt op het aftellen | Slaapmasker | Zeeft | Zwemband | **Trekt het theezakje er op tijd uit** aan het touwtje, terwijl de thee nog licht is |
| Einde | Belofte | Uitkomst | Regie | Punchline | Rust | **Contrast met een gewoonte:** "Thee laat je trekken. Rekeningen niet." |
| Slotbeeld (CTA) | Buddy gluurt | Op de knop | Masker omlaag | Zeef als helm | Dobbert | **Buddy zit in een mok lichte thee**, ogen blij dicht, stoom krult tot een hartje |
| Overgangen | iris, slide | clock-wipe | wipe, focus pull | gatenwipe, kantelen | golf-wipe | **Trek-wipe** (`src/lib/steepWipe.tsx`: nieuwe scène trekt in als thee uit een zakje) en **stoom** (`src/lib/steamRise.tsx`: oude scène stijgt op en vervaagt) |

Uniciteitstoets: op alle zes punten anders dan concept 1, 2 en 3; ook op alle zes anders dan 55 en 57.

---

## Storyboard (tijden gemeten, scènestarts uit `public/vo/thee/timing.json`)

De animatie volgt de stem. Elke overgang begint 8 frames vóór het woord waar de marker [Sx] staat en duurt 10 frames (`timing.leadIn`, `timing.transition`).

### 1 · Hook: "Een rekening is net thee." (0,00 tot 3,93 s) · licht
- Frame 0: kop compleet, mok met theezakje en label "Energie €87,60", stoom, chip "Ligt er 2 dagen".
- De thee kleurt in 3,3 s van licht naar bijna zwart; uit het zakje trekt een donkere wolk.
- 1,47 s: chip "Ligt er 1 week". 1,67 s: subregel "Hoe langer hij ligt, hoe bitterder." 2,33 s: chip geel, "Ligt er 3 weken".
- **2,80 s:** het label wordt rood, "Aanmaning €87,60", en de mok schudt. **3,33 s:** chip "Kan uitlopen op €40".
- Cover = frame 104 (3,47 s): zwarte thee, aanmaning, €40-chip.

### 2 · "Stuur hem door." (3,60 tot 5,03 s) · trek-wipe naar blauw
- Mailkaart "Energieleverancier · Je factuur van november". **4,00 s:** tik op Doorsturen, chip "Naar Buddy".
- 4,20 tot 4,67 s: de kaart draait, krimpt en vliegt naar Buddy (wit), die hem opvangt met een squash (4,67 s).

### 3 · "Buddy zet hem op tijd in je agenda." (4,70 tot 7,00 s) · stoom naar licht
- Dezelfde mok, maar de thee is licht. **5,17 s:** Buddy (blauw) springt en trekt het zakje aan het touwtje uit de thee; het druppelt na.
- 5,63 s: agendategel "dec · do 17". **5,97 s:** "Energie €87,60" valt erin. **6,30 s:** belletje "Herinnering · ma 14 dec"; Buddy kijkt blij.
- Subregel (6,03 s): "Met een herinnering wanneer jij kiest."

### 4 · CTA (6,67 tot 10,10 s) · trek-wipe naar blauw
- De tagline landt woord voor woord op de stem: "Thee" (6,83 s), "laat" (7,30 s), "je" (7,50 s), "trekken." (7,60 s), "Rekeningen" (8,13 s), "niet." (8,67 s).
- Buddy ploft in een mok lichte thee (7,20 s) en zit er tevreden in; stoom krult tot een hartje (8,13 s).
- Knop "activeer buddy" (8,73 s), "Geen app. Geen bankkoppeling." (9,07 s), woordmerk (9,20 s), tap-ripple (9,67 s).

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3 en de changelog (onboarding v5.1, 4 november 2026): geen "gratis" of proefperiode, geen WhatsApp, geen "scant je inbox", geen prijs of pakketnaam, geen betaallink, geen "mail op 7 en 2 dagen". De herinnering staat in je agenda op een moment dat jij kiest (pakket Buddy). €40 alleen als "Kan uitlopen op €40". Afzender generiek (Energieleverancier).
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, één take)

**Stem:** Roos (voice ID `7qdUFMklKPaaAVMsBTBt`, uit `ELEVENLABS_VOICE_ID`), route: ElevenLabs-API `with-timestamps`. Instellingen: stability 0.4, similarity 0.75, style 0.3, speed 1.0, speaker boost aan. 32 woorden, 9,14 s.

Tekst met scènemarkers (de markers gaan niet naar ElevenLabs; bron: `public/vo/thee/vo-marked.txt`):
```
[S1] Een rekening is net thee, hoe langer je hem laat liggen, hoe bitterder. [S2] Dus stuur hem door, [S3] dan zet Buddy hem op tijd in je agenda. [S4] Thee laat je trekken, rekeningen niet.
```

| Cue | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Een rekening is net thee, hoe langer je hem laat liggen, hoe bitterder. | Kop en mok op frame 0; aanmaning op 2,80 s, €40-chip op 3,33 s ("bitterder" 3,37 s) |
| S2 | 3,88 | 116 | Dus stuur hem door, | Trek-wipe 3,60 tot 3,93 s; tik op Doorsturen op 4,00 s ("stuur" 4,08 s) |
| S3 | 4,97 | 149 | dan zet Buddy hem op tijd in je agenda. | Stoom 4,70 tot 5,03 s; Buddy trekt het zakje eruit op 5,17 s ("Buddy" 5,35 s); agenda 5,63 tot 6,30 s ("agenda" 6,37 s) |
| S4 | 6,93 | 208 | Thee laat je trekken, rekeningen niet. | Trek-wipe 6,67 tot 7,00 s; tagline woord voor woord op de stem, einde stem 9,10 s, video 10,10 s |

**Luistertoets** (ffmpeg silencedetect, noise −35 dB): langste pauze 0,10 s (eis: max 0,6 s); geen digitale stilte onder −60 dB in de tekst. Genormaliseerd met loudnorm I=−14, TP=−1, LRA=11.

Bestanden: `public/vo/thee/vo.json` (antwoord van de API met alignment), `voice-over.mp3`, `timing.json` (cue-frames, die de scènelengtes bepalen).

## Caption (Reels)
```
Een rekening is net thee: laat je hem liggen, dan wordt hij alleen maar bitterder. Eén vergeten rekening kan uitlopen op €40 incassokosten. ☕

Haal hem er op tijd uit, met Buddy 💙
📩 Stuur je rekening door naar je eigen doorstuuradres
🔎 Buddy haalt er het bedrag en de vervaldatum uit
📅 Hij zet hem in je agenda, met een herinnering wanneer jij kiest

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #vastelasten #budgetteren
```

**Advertentie (Ads Manager):**
- Primaire tekst (117 tekens): "Een rekening is net thee: hoe langer hij ligt, hoe bitterder. Stuur hem door, dan zet Buddy hem op tijd in je agenda."
- Kop (38 tekens): "Thee laat je trekken. Rekeningen niet."
- Beschrijving: "Geen app. Geen bankkoppeling."
- Knop: "Aanmelden"

Copycheck: alleen de €40-regel (caption en chip), beide met "kan".

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-58-Thee**.
- **Blijvend aanpassen:** `src/thee/schema.ts` (`defaultTheeProps`): teksten, rekening, theekleuren, `withVoice`, `voiceVolume`, `timing.leadIn/transition/tail`.
- **Nieuwe stem:** zet een nieuwe take in `public/vo/thee/` en schrijf `timing.json` opnieuw (cue-frames en `voice_end_frame`); de scènelengtes en de totale duur rekenen dan vanzelf mee.
- **Beats:** `HOOK_T`, `FWD_T`, `AGENDA_T`, `CTA_T` bovenin de scènes.
- **Exporteren:** `npm run render:thee`, `render:thee:feed`, `render:thee:stil`, `render:thee:feed:stil`, `still:thee` (cover, frame 104).

## Open controles
- Video is 10,1 s, korter dan de gebruikelijke 12 tot 16 s: de stem van Roos haalt 32 woorden in 9,1 s. Wil je langer, voeg dan woorden toe (boven de 32 van de briefing) of kies een rustigere stem; niet de audio vertragen.
- Welke herinnermomenten je in pakket Buddy kunt kiezen; "ma 14 dec" is een voorbeeld. Datums staan op december.
- Instappagina voor knop en link in bio: "aanmaning en incassokosten" past het best.
- Uitspraak van "Buddy" in de take nog even beluisteren.
