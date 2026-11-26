# BetaalBuddy · Instagram ad, concept 123

## "Alles op tafel."

**In één zin:** Je vraagt je af wat Buddy van je heeft; hij keert zijn rugzak voor je om, je ziet de vier velden uit je rekening, en veertien dagen na de vervaldatum is de rugzak weer leeg.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Rugzak-Reel`) · 4:5 feed 1080×1350 (`BB-Rugzak-Feed`) |
| Lengte | 13,0 s (390 frames, 4 scènes, 30 fps): stem 12,0 s plus 1,0 s CTA |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. De animatie volgt de voice-overtekst (`public/vo/rugzak/timing.json`) |
| Code | `src/rugzak/` (schema, `RugzakAd.tsx`, `scenes/`, `components/Rugzak.tsx`, `components/ItemCard.tsx`, `wipes.ts`) |

**Keuze.** USP `inzage`: volgens de changelog het langst niet gebruikt (laatst 115; 116 tot 122 alle andere USP's). Vorm: vraag en antwoord (niet in 120, 121, 122; laatst 116). Metafoor: Buddy keert zijn rugzak om, "alles op tafel". Afgevallen: röntgenfoto (doet denken aan scannen), etalage (te dicht op glazen la 65 en garderobe 115).

### Hoe dit verschilt van de eerdere concepten

| | 1 | 2 | 3 | 62 | 107 (inzage) | 115 (inzage) | 122 | **123** |
|---|---|---|---|---|---|---|---|---|
| Invalshoek | agenda, volle inbox | agenda, timing | geen koppeling | agenda, boemerang | inzage, houdbaarheid | inzage, garderobe | agenda, duveltje | **inzage, wat zit er in de tas** |
| Visueel systeem | UI | typografisch | focus | vluchtbanen | vershoudbakje, rekensom | één doorlopend shot, camerapan | gesplitst scherm, speelgoed | **props: rugzak, kaartjes in raster, dagteller** |
| Rol van Buddy | slikt rekening op | rijdt mee op aftellen | slaapmasker | vangt en gooit | stampt deksel dicht | gluurt over balie, baliebel | draait de slinger | **gooit de rugzak omhoog en keert hem om** |
| Einde | belofte | uitkomst | regie | omkering | weg | weg | regie | **openheid** |
| Slotbeeld (CTA) | knop | Buddy op knop | Buddy op knop | boemerang rond knop | Buddy in leeg bakje | knop op balie | Buddy springt uit doosje | **knop valt uit de omgekeerde rugzak** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | peel, vullen | geen cuts | split, deksel | **rits, omkiep** |

Ook binnen USP `inzage` verschilt 123 met 107 en 115 op vijf van de zes rijen (alleen de invalshoek overlapt).

---

## Storyboard (frames gemeten uit `timing.json`; schatting op lettergrepen, zie Voice-over)

### 1 · Hook: "Wat heeft Buddy van je?" (0,00 tot 1,77 s) · licht
- Frame 0: de kop staat er al, met de blauwe Buddy en een dichte blauwe rugzak.
- 0,50 s ("Buddy"): de rugzak wiebelt. 0,93 s ("van"): Buddy kijkt naar de tas. 1,07 s ("je?"): geel vraagteken ploft boven de rugzak.

### 2 · "Mail gegevens@. Dit heeft Buddy." (1,77 tot 7,47 s) · rits naar blauw
- Overgang **rits**: de blauwe scène ritst van boven naar beneden open langs een zigzagnaad.
- 2,00 s ("mailtje"): geel label gegevens@ met envelop vliegt in de rugzak, die veert even in.
- 3,43 s ("rugzak"): Buddy springt en gooit de rugzak omhoog. 3,90 s ("om"): de rugzak draait ondersteboven, de klep gaat open.
- Op "bedrag" (5,03 s), "datum" (5,63 s), "link" (6,23 s) en "kenmerk" (6,73 s) valt telkens een kaartje in een 2×2-raster: Bedrag €128,95, Vervaldatum vr 18 dec, Betaallink, Kenmerk. Subregel "Dit haalt Buddy uit je rekening."

### 3 · "En hoe lang?" (7,47 tot 11,00 s) · omkiep naar licht
- Overgang **omkiep**: de blauwe scène wordt ondersteboven gekeerd en kiept uit beeld, zoals je een tas leegschudt.
- Datumtegel 18 dec; vanaf "dagen" (7,93 s) lopen 14 streepjes vol tot de tegel 1 jan, label "+ 14 dagen".
- 10,43 s ("leeg"): de papiertjes in de rugzak verdwijnen in een pufje, de tas zakt in, chip "Leeg" met vinkje. Subregel "Tot 14 dagen na de vervaldatum. Daarna is de rugzak leeg."

### 4 · CTA: "Alles op tafel." (11,00 tot 13,00 s) · rits naar blauw
- Buddy kijkt naar de omgekeerde rugzak die nog schudt; op "Activeer" (+0,2 s) valt de knop "activeer buddy" eruit en stuitert op zijn plek. Woordmerk en "Geen app. Geen bankkoppeling.", tik op de knop bij 12,1 s.

---

<!-- copycheck:off -->
## Copyregels
- Geen "bewaart niets" of "direct verwijderd": de ad zegt "tot 14 dagen na de vervaldatum" (brand §2).
- Geen gratis, geen prijs, geen WhatsApp, geen AI-claim, geen merknamen (generieke "betalen.nl/…" in het kaartje is een voorbeeld-URL).
- Copycheck (`check_copy.py`) op schema, voice-over, caption en Ads Manager-teksten: geen treffers.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, eleven_v4, stem `7qdUFMklKPaaAVMsBTBt`)

Doorlopende tekst, 32 woorden, één take. De markers gaan niet mee naar ElevenLabs (`public/vo/rugzak/vo-tekst.txt` heeft ze wel).

```
[S1] Wat heeft Buddy van je? [S2] Eén mailtje en hij keert zijn rugzak om, dus je ziet bedrag, datum, link en kenmerk. [S3] Veertien dagen na de vervaldatum is hij weer leeg. [S4] Activeer Buddy.
```

| Cue | Start (frame / s) | Zin | Beeld |
|---|---|---|---|
| S1 | 0 / 0,00 | Wat heeft Buddy van je? | Kop, Buddy naast dichte rugzak, vraagteken |
| S2 | 53 / 1,77 | Eén mailtje en hij keert zijn rugzak om, dus je ziet bedrag, datum, link en kenmerk. | Rits naar blauw, gegevens@ in de tas, tas omgekeerd, vier kaartjes |
| S3 | 224 / 7,47 | Veertien dagen na de vervaldatum is hij weer leeg. | Omkiep naar licht, 18 dec + 14 dagen = 1 jan, rugzak leeg |
| S4 | 330 / 11,00 | Activeer Buddy. | Rits naar blauw, knop valt uit de rugzak |

**Status op 26 november 2026: niet gegenereerd.** De API gaf 401 `quota_exceeded` (0 van 10000 credits over; de key mist ook `voices_read`), de ElevenLabs-connector faalde met dezelfde quotafout. `timing.json` is daarom een schatting op lettergrepen (~5 per seconde).

**Zodra er credits zijn:**
1. Genereer de tekst hierboven (zonder markers) in één request via `/with-timestamps`, model `eleven_v4`, `language_code: nl`, stability 0.5, similarity 0.75, naar `public/vo/rugzak/vo.json`; decodeer `audio_base64` naar `public/vo/rugzak/voice-over.mp3`.
2. `python3 tools/vo_to_timing.py public/vo/rugzak/vo-tekst.txt public/vo/rugzak/timing.json --alignment public/vo/rugzak/vo.json --cta 1.0`. Alle scènes en beats schuiven mee (ze hangen aan woorden via `wordAt`).
3. `npm run render:rugzak:vo`, daarna loudnorm (I=-14, TP=-1, LRA=11) met `-c:v copy`.

## Caption (Reels)

```
Weet jij eigenlijk wat Buddy van je rekening heeft? Hij laat het je gewoon zien. 🎒

Buddy keert zijn rugzak voor je om 👀
📩 Stuur je rekening door naar je eigen doorstuuradres
🔎 Mail gegevens@ en je ziet bedrag, vervaldatum, betaallink en kenmerk
🗓️ Tot 14 dagen na de vervaldatum, daarna is het weg

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #privacy #budgetteren
```

**Advertentie (Ads Manager):** primaire tekst "Mail gegevens@ en je ziet precies wat Buddy van je rekening heeft. Tot 14 dagen na de vervaldatum, dan is het weg." (114 tekens) · Kop "Alles op tafel." (15) · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden".

## Renders
- `renders/rugzak-reel-stil.mp4`, `renders/rugzak-feed-stil.mp4` (h264, yuv420p, bt709, 13,0 s, geen audio), `renders/rugzak-cover.png` (frame 40).
- Geen VO-versies: de stem ontbreekt.

## Open controles
- Stem genereren zodra er ElevenLabs-credits zijn (zie hierboven).
- Bevestigen dat een mail naar gegevens@ de bewaarde velden per rekening terugstuurt zoals de ad laat zien (staat ook open bij 107 en 115).
- Instappagina: de privacy-pagina (zonder mailboxkoppeling) past het best; pad nog niet bevestigd.
