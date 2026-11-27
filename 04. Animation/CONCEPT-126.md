# BetaalBuddy · Instagram ad, concept 126

## "Geen app. Gewoon rechtdoor." (doolhof)

**In één zin:** nog een app voor je rekeningen is een doolhof van downloaden, account, wachtwoord en updates waar je geel stipje blijft dwalen; ernaast, in de blauwe helft, gaat Buddy in één rechte lijn van je mail naar je agenda, en dat wint: stuur je rekening door en hij staat in je agenda.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Doolhof-Reel`) · 4:5 feed 1080×1350 (`BB-Doolhof-Feed`) |
| Lengte | 13,03 s (391 frames, 30 fps): stem ~12,03 s plus 1 s CTA. **Timing is nu geschat**, zie Voice-over |
| USP en vorm | `geen-app` (laatst 117 in de changelog, langst niet gebruikt) · twee schermen naast elkaar (niet in 123, 124, 125; nooit eerder bij geen-app) |
| Aanpassen | `src/doolhof/schema.ts` (teksten, kleuren, `mazeSeed`, `withVoice`, `transitionFrames`); beats uit `public/vo/doolhof/timing.json` |
| Render | `npm run render:doolhof`, `npm run render:doolhof:feed`, `npm run still:doolhof`; met stem `npm run render:doolhof:vo` en daarna loudnorm |
| Geluid | Werkt zonder geluid. Stem nog niet gegenereerd (ElevenLabs zonder credits op 27 november 2026) |

### Hoe dit verschilt van de eerdere concepten
Metafoor gekozen uit drie: doolhof (gekozen), batterij die leegloopt (claim lastig), rode meldingsbolletjes op een thuisscherm (te dicht op ballon 117 en koffer 101). Doolhof komt in geen eerder concept voor.

| | 3 (privacy) | 62 (boemerang) | 101 (koffer, geen-app) | 117 (ballon, geen-app) | **126 (doolhof)** |
|---|---|---|---|---|---|
| Invalshoek | Geen mailboxkoppeling | Wegleggen werkt niet | Geen app, mythe en feit | Geen app, mythe en feit | **Een app is een omweg; Buddy is de rechte weg** |
| Visueel systeem | Focus, wazig en scherp | Vluchtbanen | Koffer met app-tegels | Ballon blaast telefoon op | **Lijntekening van bovenaf: doolhof tegenover één rechte stippellijn, gesplitst beeld** |
| Rol van Buddy | Slaapmasker | Vangt en gooit | Schopt app uit koffer | Prikt ballon | **Glijdt en rijdt in één rechte lijn naar de agenda** |
| Einde | Regie | Omkering | Feit | Feit | **Contrast opgelost: de blauwe helft neemt het hele beeld over** |
| Slotbeeld (CTA) | Buddy op knop | Boemerang rond knop | n.v.t. | n.v.t. | **Buddy aan het begin van een rechte lijn die in de knop eindigt** |
| Overgangen | wipe, focus pull | swing, spin-return | rits | n.v.t. | **naad (beeld splitst), naadduw (blauwe helft wint), rechte wipe met gele lijn** (CSS, `src/doolhof/wipes.ts`) |

Verschilt op 6 van 6 punten met de concepten in `CONCEPTEN.md` en met de eerdere geen-app-concepten uit de changelog (85, 93, 101, 109, 117).

---

## Storyboard (scènestarts = eerste woord per marker; nu geschat)

### 1 · Hook: "Nog een app voor je rekeningen?" (0,00 tot 5,23 s) · licht
- Frame 0: kop staat, doolhof van 8 bij 6 vakken met geel stipje bij de ingang.
- Chip "Downloaden" bij de ingang op "app" (0,47 s); het stipje dwaalt en loopt vast in doodlopende gangen op "account" (2,70 s), "wachtwoord" (3,57 s) en "updates" (4,23 s), telkens met een schokje en een donkere chip.

### 2 · Twee schermen (5,23 tot 8,07 s) · naad
- Op "Hoeft" splitst het beeld: het doolhof krimpt naar de linkerhelft, rechts schuift blauw in. Links "Nog een app" wordt doorgestreept, chip "Hoeft niet." op "niet".
- Rechts "Met Buddy", één rechte stippellijn van envelop naar kalender. Buddy ploft bovenaan op "Buddy" (6,37 s) en glijdt op "rechtdoor" (7,30 s) in één keer naar beneden; kalender krijgt een vinkje. Links dwaalt het stipje nog.

### 3 · Doorsturen (8,07 tot 11,00 s) · naadduw naar blauw
- De blauwe helft duwt de naad naar links en neemt het beeld over. "Stuur hem door. Hij staat in je agenda."
- Rekening Telefoonprovider €24,95, vervalt do 17 dec. Tik op Doorsturen op "door" (8,57 s); de kaart krimpt, Buddy springt erop en rijdt recht naar beneden op do 17 (landt op "agenda", 10,00 s); tegel wordt wit met €24,95, Buddy springt eraf.
- Subregel "Je mail en je agenda zijn genoeg."

### 4 · CTA (11,00 tot 13,03 s) · rechte wipe met gele lijn
- "Geen app. Gewoon rechtdoor." Buddy staat links; op "Activeer" ploft de knop "activeer buddy" en trekt een rechte stippellijn van Buddy naar de knop. "Geen app. Geen bankkoppeling.", woordmerk, tik op de knop.

---

<!-- copycheck:off -->
## Copyregels
Volgt brand §2 en §3 en de changelog: geen app, geen bankkoppeling, doorsturen, in je agenda. Geen prijs, geen pakketnaam, geen "gratis", geen merknamen (generieke afzender Telefoonprovider), geen gedachtestreepjes.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, eleven_v4, één take)

Stem: `ELEVENLABS_VOICE_ID` = 7qdUFMklKPaaAVMsBTBt, stability 0,5, similarity 0,75. 32 woorden, 4 zinnen. Markers gaan niet naar ElevenLabs (`public/vo/doolhof/script.txt`).

```
[S1] Nog een app voor je rekeningen, met een account, een wachtwoord en updates? [S2] Hoeft niet, want met Buddy ga je rechtdoor. [S3] Stuur hem door en hij staat in je agenda. [S4] Activeer Buddy.
```

Tekst voor ElevenLabs:
```
Nog een app voor je rekeningen, met een account, een wachtwoord en updates? Hoeft niet, want met Buddy ga je rechtdoor. Stuur hem door en hij staat in je agenda. Activeer Buddy.
```

**Status:** niet gegenereerd. API `/with-timestamps` en het gewone endpoint gaven 401 `quota_exceeded` (0 van 10000 credits, 39 nodig); de sleutel mist ook `voices_read` (401 op `/v1/voices`). De ElevenLabs-connector startte de generatie maar die faalde met dezelfde quotafout (177 credits nodig).

**Zo zet je de stem erop zodra er credits zijn:**
1. Genereer met de curl uit de routine naar `public/vo/doolhof/vo.json`, decodeer `audio_base64` naar `public/vo/doolhof/voice-over.mp3`.
2. `python3 scripts/vo_timing.py doolhof` (leest de alignment, of valt terug op silencedetect -35 dB/0,2 s) overschrijft `timing.json`; alle beats en de lengte volgen de echte take.
3. `npm run render:doolhof:vo`, daarna loudnorm (I -14, TP -1, LRA 11) met `-c:v copy`.

### Cue-tabel (geschat, ~5 lettergrepen per seconde)
| Marker | Start | Zin | Beeld |
|---|---|---|---|
| S1 | 0,00 s (f 0) | Nog een app voor je rekeningen, met een account, een wachtwoord en updates? | Doolhof; chips op app f 14, account f 81, wachtwoord f 107, updates f 127 |
| S2 | 5,23 s (f 157) | Hoeft niet, want met Buddy ga je rechtdoor. | Naad splitst; "Hoeft niet." f 164; Buddy f 191; glijdt op rechtdoor f 219 |
| S3 | 8,07 s (f 242) | Stuur hem door en hij staat in je agenda. | Tik f 257; landt op do 17 f 300 |
| S4 | 11,00 s (f 330) | Activeer Buddy. | Knop f 330, lijn naar knop, tik f 363 |

## Caption (Reels)
Zie `renders/doolhof-caption.md`.

## Ads Manager
- Primaire tekst: Nog een app voor je rekeningen? Hoeft niet. Stuur je rekening door en Buddy zet hem in je agenda.
- Kop: Geen app. Gewoon rechtdoor.
- Beschrijving: Je mail en je agenda zijn genoeg.
- Knop: Aanmelden

## Open controles
- Stem genereren zodra er ElevenLabs-credits zijn (zie hierboven); de sleutel mist ook `voices_read`.
- Instappagina: er is geen geen-app-pagina; algemene startpagina gebruiken voor knop en link in bio.
- "Hij staat in je agenda": via de ICS-agendalink; het herinneringsmoment kies je zelf (pakket Buddy).
