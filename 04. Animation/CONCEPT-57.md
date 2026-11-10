# BetaalBuddy · Instagram ad, concept 57

## "Vloed komt. Jij staat droog."

**In één zin:** je hoopt dat die ene rekening vanzelf wegspoelt, maar de golf neemt hem mee en spoelt hem terug als aanmaning; stuur hem door, dan dobbert Buddy in zijn zwemband naar je, pakt bedrag en vervaldatum eruit, zet hem in je agenda met een herinnering op het moment dat jij kiest, en de vloed kan komen: jij staat droog.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Vloed-Reel`) · 4:5 feed 1080×1350 (`BB-Vloed-Feed`) |
| Lengte | 15,2 s (4 scènes, 30 fps, 456 frames), alles aan te passen in Remotion Studio |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. Met voice-over (ElevenLabs, stem Roos) via de prop `withVoice` |

### Hoe dit verschilt van de eerdere concepten
Code van concept 1 tot 3 staat op main; concept 4 tot 56 staan op losse branches en in de changelog. Gecontroleerd op de changelogtitels: strand, getijden, vloed, zandkasteel en zwemband komen in geen enkel concept voor. Concept 35 ("stresslijn") laat Buddy surfen; daarom surft Buddy hier niet maar dobbert hij in een zwemband.

| | Concept 1 | Concept 2 | Concept 3 | **Dit concept** |
|---|---|---|---|---|
| Invalshoek | Overzicht (volle inbox) | Timing (aftellen) | Privacy | **Struisvogelgedrag:** "het lost zichzelf wel op" (wegspoelen), de vervaldatum komt zo zeker als de vloed |
| Visueel systeem | UI-gedreven | Typografisch (reuzengetal) | Focus, wazig tegenover scherp | **Natuur-illustratie:** bewegende waterlijn in merkblauw die stijgt en zakt, de zee loopt door alle scènes heen |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het aftellen | Slaapmasker op en af | **Dobbert in een rood-witte zwemband,** vangt de rekening uit de lucht en peddelt naar de herinneringsdag |
| Einde | Belofte | Uitkomst "Betaald." | Regie | **Rust bij hoogwater:** "Vloed komt. Jij staat droog." |
| Slotbeeld (CTA) | Buddy kijkt van rechts het beeld in | Buddy bovenop de knop | Buddy boven de knop, masker omlaag | **Buddy dobbert onder het woordmerk, een deining tilt hem op en hij blijft blij droog** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | **Eigen golf-wipe** (`src/lib/waveWipe.tsx`): nieuwe scène spoelt binnen achter een golvende waterlijn, omhoog en van rechts |

Verschilt op alle zes punten met concept 1, 2 en 3.

---

## Storyboard

### 1 · Hook: "Die rekening spoelt niet weg." (0,0 tot 3,4 s) · licht
- Frame 0: de kop staat al volledig in beeld, een rekening (Energieleverancier, €87,60, "Vervalt do 17 dec") ligt op het strand, de zee onderaan.
- 0,2 tot 0,7 s: een golf kruipt over de rekening en trekt hem de zee in (0,6 tot 1,07 s).
- 1,33 s: een nieuwe golf rolt hoog op en trekt weer terug.
- **1,73 s:** waar de rekening lag, ligt nu een **Aanmaning** ("Te laat betaald", rood), het beeld schudt.
- **2,00 s:** rode chip **"Kan uitlopen op €40"**.
- Cover = frame 66 (2,2 s): kop, aanmaning en €40-chip.

### 2 · "Stuur hem door naar Buddy." (3,0 tot 6,8 s) · golf-wipe omhoog naar blauw
- De mail "Energieleverancier · Je factuur van december · €87,60" met knop **Doorsturen**. Buddy (wit) dobbert in zijn zwemband in de zee eronder.
- **3,80 s:** tik op Doorsturen; de mail vouwt zich klein en vliegt in een boog naar Buddy.
- **4,53 s:** Buddy vangt hem (squash).
- **4,93 s / 5,13 s:** chips **€87,60** en **do 17 dec**.
- **5,40 s:** subregel "Buddy haalt er bedrag en vervaldatum uit."

### 3 · "Buddy zet hem in je agenda." (6,4 tot 11,0 s) · golf-wipe van rechts naar licht
- Een weekstrook december, ma 14 tot zo 20 (8 tot 20 frames na de start ploppen de dagen in).
- **7,60 s:** de rekening valt op **do 17** en de tegel wordt blauw met "Energie €87,60".
- 8,07 tot 8,93 s: Buddy (blauw) peddelt in zijn zwemband naar ma 14.
- **9,20 s:** een belletje plopt op **ma 14** en slingert, label **"Herinnering"**; Buddy springt op en kijkt blij.
- **9,47 s:** subregel "Jij kiest wanneer je een herinnering krijgt."

### 4 · CTA (10,6 tot 15,2 s) · golf-wipe omhoog naar blauw
- Buddy dobbert al vanaf het begin in de zee onderaan.
- **11,47 tot 12,13 s:** tagline woord voor woord: **"Vloed komt."** (wit) **"Jij staat droog."** (zachtblauw).
- **12,27 s:** knop **"activeer buddy"**; 12,60 s "Geen app. Geen bankkoppeling."; 12,87 s woordmerk.
- **13,07 tot 14,07 s:** een deining tilt de zee en Buddy op; hij knijpt zijn ogen blij dicht en blijft droog.
- **13,73 s:** tap-ripple op de knop. Einde op 15,2 s.

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3 en de changelog (stand 10 november 2026, onboarding v5.1):
- Geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs of pakketnaam, geen logo's of namen van andere merken (afzender is generiek: Energieleverancier).
- Herinnering = in je agenda op een moment dat jij kiest (pakket Buddy volgens onboarding v5.1). Bewust **geen** "mail op 7 en 2 dagen", want dat is sinds v5.1 alleen Buddy pro.
- €40 alleen als "Kan uitlopen op €40" (wettelijk minimum na een veertiendagenbrief).
- Buddy betaalt niet; hij zet de rekening in je agenda en herinnert je.

**Afwijking tussen changelog en merkreferentie:** de merkreferentie van de skill noemt nog "herinneringen per mail op 7 en 2 dagen" en pakketten Basic, Standard en Premium. De changelog (onboarding v5.1, 4 november 2026) zegt: Basic = online overzicht en CSV, Buddy = herinnering in je agenda op zelfgekozen momenten, Buddy pro = ook per mail. Deze ad volgt de changelog.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2)

Stem: **Roos, Kind, Articulate and Confident** (voice ID `7qdUFMklKPaaAVMsBTBt`), model `eleven_multilingual_v2`, stability 0,5, similarity 0,75, style 0,2, speaker boost aan, Speed 1,0 (niet versneld). Gegenereerd via de ElevenLabs-API, één clip per cue met `previous_text` en `next_text`, in `public/vo/vloed/cue-01.mp3` tot `cue-07.mp3`. In beide composities geplaatst met `<Sequence from={startframe}>` en `<Audio>`; aan en uit met de prop `withVoice`.

Plakblok (doorlopend, ter referentie):
```
Die rekening spoelt niet weg. Hij komt gewoon terug. Stuur hem door naar Buddy. Hij pakt het bedrag en de datum eruit. En zet hem in je agenda. Een herinnering? Jij kiest wanneer. Vloed komt. Jij staat droog. Activeer Buddy.
```

| Cue | Startframe | Starttijd | Tekst | Duur clip | Lucht tot volgende | Beeld (frame-exact) |
|---|---|---|---|---|---|---|
| 1 | 0 | 0,00 s | Die rekening spoelt niet weg. Hij komt gewoon terug. | 3,06 s | 0,31 s | Kop op frame 0, rekening de zee in 0,6 tot 1,07 s, aanmaning op 1,73 s, €40-chip op 2,00 s |
| 2 | 101 | 3,37 s | Stuur hem door naar Buddy. | 1,38 s | 0,32 s | Golf-wipe 3,0 tot 3,4 s, kop vanaf 3,2 s, tik op Doorsturen op 3,80 s |
| 3 | 152 | 5,07 s | Hij pakt het bedrag en de datum eruit. | 2,22 s | 0,31 s | Buddy vangt op 4,53 s, chips op 4,93 en 5,13 s, subregel op 5,40 s |
| 4 | 228 | 7,60 s | En zet hem in je agenda. | 1,62 s | 0,31 s | Rekening landt op do 17 op 7,60 s |
| 5 | 286 | 9,53 s | Een herinnering? Jij kiest wanneer. | 1,93 s | 0,30 s | Belletje op ma 14 op 9,20 s, subregel op 9,47 s |
| 6 | 354 | 11,80 s | Vloed komt. Jij staat droog. | 1,62 s | 0,31 s | Tagline 11,47 tot 12,13 s |
| 7 | 412 | 13,73 s | Activeer Buddy. | 1,10 s | 0,37 s tot het einde | Tap op de knop op 13,73 s, einde op 15,20 s |

Gemeten in de render: de stiltes in de VO-MP4 vallen precies tussen de cues (bijvoorbeeld stilte 3,02 tot 3,39 s en 13,34 tot 13,82 s). Luidheid na loudnorm: -14,8 LUFS geïntegreerd.

## Caption (Reels)

```
Die rekening laten liggen en hopen dat hij vanzelf wegspoelt? Hij komt terug. Als aanmaning. 🌊

Buddy houdt je droog 🛟
📩 Stuur je rekening door naar je eigen doorstuuradres
🔎 Buddy haalt er het bedrag en de vervaldatum uit
📅 Hij zet hem in je agenda, met een herinnering op het moment dat jij kiest

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #vastelasten #opjezelfwonen
```

**Advertentie (Ads Manager):**
- Primaire tekst: "Hopen dat die rekening vanzelf wegspoelt? Hij komt terug als aanmaning. Stuur hem door, Buddy zet hem in je agenda." (115 tekens)
- Kop: "Vloed komt. Jij staat droog." (28 tekens)
- Beschrijving: "Geen app. Geen bankkoppeling." (29 tekens)
- Knop: "Aanmelden"

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-57-Vloed**, composities `BB-Vloed-Reel` en `BB-Vloed-Feed`.
- **Blijvend aanpassen:** `src/vloed/schema.ts` (`defaultVloedProps`): teksten, rekening, weekdagen, welke dag de rekening en de herinnering krijgen, kleuren, scènelengtes, `withVoice`, `voiceVolume` en de cue-frames (`voiceCues`).
- **Beats:** `HOOK_T`, `FORWARD_T`, `AGENDA_T`, `CTA_T` bovenin de bestanden in `src/vloed/scenes/`. Verschuif je beats, verschuif dan ook de cue-frames.
- **Exporteren:** `npm run render:vloed` (9:16 met stem), `npm run render:vloed:feed` (4:5 met stem), `npm run render:vloed:stil` (9:16 zonder stem), `npm run still:vloed` (cover, frame 66). De stille feedversie: `npx remotion render BB-Vloed-Feed out/vloed-feed-stil.mp4 --props='{"withVoice":false}'`. Loudnorm daarna: `ffmpeg -i in.mp4 -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -ar 48000 -c:a aac out.mp4`.
- **Renders:** `renders/vloed-reel-vo.mp4`, `vloed-feed-vo.mp4`, `vloed-reel-stil.mp4`, `vloed-feed-stil.mp4`, `vloed-voice-over.mp3`, `vloed-cover.png`.

## Open controles
- Welke herinnermomenten je in pakket Buddy kunt kiezen; "ma 14" is een voorbeeld. Datums staan op december 2026 (ma 14 en do 17 kloppen met de kalender); na half december omzetten.
- Instappagina voor de knop en link in bio staat nog open; "aanmaning en incassokosten" past het best bij deze hook.
- Clips beluisteren op de uitspraak van "Buddy" door stem Roos.
- Een vrouwelijke stem noemt Buddy "hij"; dat past bij de mascotte, maar check of dat de gewenste toon is.
