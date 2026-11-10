# BetaalBuddy · Instagram ad, concept 61

## "Van dun ijs naar vaste grond."

**In één zin:** die ene rekening staat op dun ijs; het kraakt, hij zakt erdoor en komt terug als aanmaning. Stuur hem door, Buddy schaatst erheen met muts en schaatsen, remt en vangt hem, schaatst langs je week en zet hem met een herinnering in je agenda, en aan het eind wordt het ijs onder hem vaste grond.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Ijs-Reel`) · 4:5 feed 1080×1350 (`BB-Ijs-Feed`) |
| Lengte | 10,33 s (4 scènes, 30 fps, 310 frames): stem 9,28 s plus ongeveer 1 s CTA |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de instappagina |
| Geluid | Werkt zonder geluid (alles staat in beeld). Voice-over als één take, aan en uit met de prop `withVoice` |
| Werkwijze | De animatie volgt de stem: scènestarts en beats komen uit `public/vo/ijs/timing.json` |

### Hoe dit verschilt van de eerdere concepten

Gekozen uit drie richtingen (dun ijs, kookwekker, blokkentoren): "dun ijs" komt in geen van de 60 concepten in de changelog voor (geen ijs, schaatsen, scheuren of winterbeeld), past bij december en is een bekend Nederlands gezegde. Kookwekker viel af (te dicht op thee, concept 58, en aftellen, concept 2), blokkentoren (te dicht op bordjes draaien, 51).

| | Concept 1 | Concept 2 | Concept 3 | **Dit concept** |
|---|---|---|---|---|
| Invalshoek | Overzicht (volle inbox) | Timing (heb ik betaald?) | Privacy | **Risico als gezegde:** je staat op dun ijs met die ene rekening |
| Visueel systeem | UI-gedreven | Typografisch (reuzengetal) | Focus, wazig tegen scherp | **Objectwereld: een bevroren vijver** met scheuren, een wak, een ijsbaan en een week als ijstegels |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het aftellen | Slaapmasker | **Schaatser** met muts: schaatst, maakt een remstop met ijsgruis, vangt en schaatst langs je week |
| Einde | Belofte | Uitkomst "Betaald." | Regie | **Omslag in de grond:** het ijs onder Buddy wordt vaste grond |
| Slotbeeld bij de CTA | Buddy piept vanaf de rand | Buddy op de knop | Buddy boven de knop met masker | **Buddy schaatst van rechts in, remt onder de knop en het ijs onder hem wordt een vast blok** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | **crack shatter** (nieuwe scène breekt door een stervormige scheur) en **skate carve** (S-bocht als een schaatsslag) |

Op alle zes punten anders dan concept 1 tot 3. Ten opzichte van 57 (vloed, Buddy in zwemband) en 35 (stresslijn, Buddy surft) is alleen "Buddy glijdt" verwant; invalshoek, decor, einde, slotbeeld en overgangen verschillen.

---

## Voice-over (ElevenLabs, één take)

Stem **Roos** (voice ID `7qdUFMklKPaaAVMsBTBt`, uit `ELEVENLABS_VOICE_ID`), model `eleven_v4`, `language_code: nl`, stability 0,5, similarity 0,75, verder niets. Route: API, endpoint `with-timestamps`. 32 woorden, duur 9,25 s (mp3), laatste woord eindigt op 9,28 s. Langste pauze tussen woorden 0,48 s (na "kraakt").

Tekst zoals naar ElevenLabs gestuurd (zonder markers):

```
Sta jij met die rekening op dun ijs, tot het kraakt? Stuur hem door naar Buddy, en hij zet hem met een herinnering in je agenda. Zo sta je op vaste grond.
```

Met scènemarkers:

```
[S1] Sta jij met die rekening op dun ijs, tot het kraakt? [S2] Stuur hem door naar Buddy, [S3] en hij zet hem met een herinnering in je agenda. [S4] Zo sta je op vaste grond.
```

### Cue-tabel (tijden uit de ElevenLabs-alignment, beelden op het frame)

| Start (s) | Frame | Zin | Beeld |
|---|---|---|---|
| 0,00 | 0 | [S1] Sta jij met die rekening op dun ijs, | Kop en rekening op het ijs op frame 0; haarscheurtjes vanaf "dun" (1,47 s) |
| 2,47 | 74 | tot het kraakt? | Op "kraakt" breekt het ijs (2,47 s), de rekening zakt erdoor (2,53 s), komt terug als Aanmaning (2,77 s), chip "Kan uitlopen op €40" (2,97 s) |
| 3,44 | 103 | [S2] Stuur hem door naar Buddy, | Crack shatter 3,23 tot 3,63 s; tik op Doorsturen op "door" (3,83 s); Buddy remt en vangt de mail op "Buddy" (4,13 s) |
| 4,76 | 142 | [S3] en hij zet hem met een herinnering in je agenda. | Skate carve 4,53 tot 4,93 s; Buddy schaatst vanaf "zet" (5,13 s); belletje op ma 14 op "herinnering" (5,73 s); rekening landt op do 17 op "agenda" (6,70 s) |
| 7,44 | 223 | [S4] Zo sta je op vaste grond. | Skate carve 7,23 tot 7,63 s; tagline "Van dun ijs" vanaf 7,37 s, "naar vaste grond." 8,10 tot 8,53 s; Buddy remt op "grond" (8,63 s) en het ijs wordt vaste grond; tap op de knop 9,37 s; einde 10,33 s |

Scènes (globaal, inclusief overlap van de overgangen): 1 · Dun ijs 0,00 tot 3,63 s · 2 · Doorsturen 3,23 tot 4,93 s · 3 · Agenda 4,53 tot 7,63 s · 4 · CTA 7,23 tot 10,33 s. Elke overgang (12 frames) ligt gecentreerd op de eerste klank van de volgende zin.

Bestanden: `public/vo/ijs/vo.json` (respons met alignment), `public/vo/ijs/timing.json` (scènestarts en woordframes), `public/vo/ijs/voice-over.mp3` (loudnorm I=-14, TP=-1, LRA=11), `public/vo/ijs/text.txt`.

---

## Storyboard

### 1 · Hook: "Sta jij met die rekening op dun ijs?" (0,00 tot 3,63 s) · licht
- Frame 0: volledige kop en een bevroren vijver met de rekening Energieleverancier · Je rekening van december · €87,60 · Vervalt do 17 dec. De rekening wiebelt steeds meer.
- "dun ijs": haarscheurtjes groeien onder de rekening.
- "kraakt": het ijs breekt met een schok, er opent een wak en de rekening zakt erdoor. Hij komt terug met een rode rand en het label **Aanmaning**; op het ijs ploft de chip **Kan uitlopen op €40**.
- Cover = frame 92 (3,07 s): kop, aanmaning, wak met scheuren en de €40-chip.

### 2 · "Stuur hem door naar Buddy." (3,23 tot 4,93 s) · crack shatter naar blauw
- De blauwe scène breekt door een stervormige scheur door het hookbeeld heen.
- Mailkaart met de knop **Doorsturen**; tik op "door". Buddy (wit, muts, schaatsen) schaatst van links in, de mail vliegt in een boog naar hem toe, Buddy maakt een remstop met ijsgruis en vangt hem op "Buddy".

### 3 · "Buddy zet hem in je agenda." (4,53 tot 7,63 s) · skate carve naar licht
- Een week in december als ijstegels (ma 14 tot zo 20) boven een ijsbaan. Buddy (nu blauw) schaatst met de rekening boven zijn hoofd langs de week en laat een schaatsspoor achter.
- Op "herinnering": belletje op **ma 14** met label Herinnering. Op "agenda": de rekening vliegt in **do 17**, de tegel wordt blauw met €87,60.
- Subregel: "Met een herinnering wanneer jij wilt."

### 4 · CTA (7,23 tot 10,33 s) · skate carve van rechts naar blauw
- Tagline: **"Van dun ijs"** in wit, **"naar vaste grond."** in zachtblauw, getimed op "vaste grond".
- Knop **activeer buddy** (7,70 s), subregel "Geen app. Geen bankkoppeling.", woordmerk.
- Slotbeeld: Buddy schaatst van rechts in, remt op "grond" met ijsgruis, en onder zijn schaatsen groeit een vast blok: vaste grond. Hij knijpt blij zijn ogen dicht. Tap-ripple op de knop na het laatste woord.

---

<!-- copycheck:off -->
## Copyregels

Volgens `brand-betaalbuddy.md` §3 en de changelog (onboarding v5.1, 4 november 2026): geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs of pakketnaam, geen logo's of namen van andere merken. Geen belofte van "mail op 7 en 2 dagen": in pakket Buddy is de herinnering een agenda-herinnering op zelfgekozen momenten. €40 alleen als "Kan uitlopen op €40". Geen betaallink in de copy (nog niet bevestigd).
<!-- copycheck:on -->

---

## Caption (Reels)

```
Die ene rekening waar je niet meer naar kijkt? Daar sta je op dun ijs. Eén vergeten betaling kan uitlopen op €40 incassokosten. 🧊

Buddy brengt je terug op vaste grond ⛸️
📩 Stuur je rekening door naar Buddy
🔎 Buddy haalt er het bedrag en de vervaldatum uit
📅 Hij zet hem in je agenda, met een herinnering wanneer jij wilt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #vastelasten #opjezelfwonen
```

## Ads Manager

- **Primaire tekst** (125 tekens): "Op dun ijs met die ene rekening? Stuur hem door naar Buddy en hij zet hem in je agenda, met een herinnering wanneer jij wilt."
- **Kop** (29 tekens): "Van dun ijs naar vaste grond."
- **Beschrijving**: "Geen app. Geen bankkoppeling."
- **Knop**: Aanmelden

Copycheck (`check_copy.py --lengths`): twee treffers, allebei de €40-regel met "kan" (caption en chip). Geen andere treffers.

## Open controles

- Bevestigen welke herinnermomenten je in pakket Buddy kunt kiezen; "ma 14" (drie dagen voor do 17 dec) is een voorbeeld. Datums staan op december.
- Video is 10,3 s, korter dan de gebruikelijke 12 tot 16 s, door de woordgrens van 28 tot 32 woorden; voor 13 s zijn ongeveer 40 woorden nodig.
- Take beluisteren op "Buddy" en op `eleven_v4` (eerste run met dit model).
- Instappagina voor knop en link in bio staat nog open; "aanmaning en incassokosten" past het best.

## Aanpassen en exporteren

- **Studio:** `npm run dev`, map **Concept-61-Dun-ijs**, composities `BB-Ijs-Reel` en `BB-Ijs-Feed`.
- **Teksten en kleuren:** `src/ijs/schema.ts` (`defaultIjsProps`). Stem aan of uit: prop `withVoice`.
- **Timing:** komt uit `public/vo/ijs/timing.json`. Nieuwe take? Vervang `voice-over.mp3`, `vo.json` en `timing.json`; scènes en beats (`src/ijs/scenes/*`, functies `forwardBeats`, `agendaBeats`, `ctaBeats`, object `HOOK_T`) schuiven vanzelf mee via `wordAt()` in `src/ijs/vo.ts`.
- **Nieuw gedeeld:** `src/lib/crackShatter.tsx` en `src/lib/skateCarve.tsx` (CSS-overgangen). Concept-eigen: `src/ijs/components` (IceSheet, SkaterBuddy met muts en schaatsen, IceSpray, BillSlip).
- **Exporteren:** `npm run render:ijs` en `npm run render:ijs:feed` (met stem), `npm run render:ijs:stil` en `npm run render:ijs:feed:stil` (zonder), `npm run still:ijs` (cover, frame 92).
