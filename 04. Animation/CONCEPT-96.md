# BetaalBuddy · Instagram ad, concept 96

## "Alleen wat jij doorstuurt." (papieren vliegtuig)

**In één zin:** je mailbox hangt aan een ketting naar een onbekende app, de ketting breekt ("hoeft niet"), je stuurt alleen die ene rekening door als papieren vliegtuigje, Buddy vangt hem en vliegt ermee naar de vervaldatum in je agenda.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Vliegtuig-Reel`) · 4:5 feed 1080×1350 (`BB-Vliegtuig-Feed`) |
| Lengte | 12,87 s (386 frames, 30 fps): stem 11,84 s plus 1 s CTA |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de instappagina |
| Stem | ElevenLabs, stem uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, nl, stability 0,5, similarity 0,75, één take via `/with-timestamps` (API) |
| Aanpassen | `src/vliegtuig/schema.ts` (teksten, kleuren, `withVoice`, `transitionFrames`); timing uit `public/vo/vliegtuig/timing.json` |
| Render | `npm run render:vliegtuig` en `render:vliegtuig:feed` (met stem, daarna loudnorm I -14, TP -1, LRA 11), `render:vliegtuig:stil` en `render:vliegtuig:feed:stil` (zonder stem), `still:vliegtuig` (cover, frame 78) |
| Geluid | Werkt zonder geluid: elke zin staat ook als kop of chip in beeld |

**Keuze:** USP `geen-koppeling` met de rotatieregel (laatst in 88; 89 tot 95 gebruikten alle andere USP's). Vorm probleem, doorsturen, uitkomst (niet in 93, 94, 95). Beeld: ketting en papieren vliegtuig; afgevallen: brievenbus (te dicht op doorgeefluik) en stofzuiger (te dicht op de magneet van 88).

### Hoe dit verschilt van de eerdere concepten

| | Concept 3 | Concept 62 | Concept 88 | **Dit concept** |
|---|---|---|---|---|
| Invalshoek | geen-koppeling: jij kiest wat Buddy ziet | agenda: wegleggen werkt niet | geen-koppeling: trekt Buddy al je mail naar zich toe? | **geen-koppeling: een hele mailbox koppelen hoeft niet** |
| Visueel systeem | Focus: wazig tegenover scherp | Vluchtbanen, boemerang | Magneet en stekker | **Ketting die breekt, rekening als papieren vliegtuigje** |
| Rol van Buddy | Slaapmasker omlaag en omhoog | Vangt en gooit de boemerang | Trekt de stekker eruit | **Vangt het vliegtuigje op zijn hoofd, vliegt erop mee, springt op do 17** |
| Einde | Regie | Omkering | Alleen wat jij doorstuurt | **Hoedje: jouw rekening, netjes gevouwen** |
| Slotbeeld (CTA) | Buddy bovenop de knop | Boemerang rond de knop | Buddy laat de stekker vallen | **Buddy met een papieren hoedje boven de knop** |
| Overgangen | wipe, focus pull | swing, spin-return | ruk, stroomstoot | **breuk (zigzagscheur), vouw (papier vouwt open)** |

Verschilt op vijf of zes van de zes punten met elk van deze concepten. Het einde-type "alleen wat jij doorstuurt" lijkt op 88; de rest niet.

---

## Storyboard (gemeten tijden)

### 1 · Hook: "Je hele mailbox koppelen?" (0,00 tot 3,77 s) · licht
- Frame 0: kop compleet, een mailbox (Huisgenoot, Werk, Vakantie, Bank, Energieleverancier) hangt met een ketting aan een donkere app-tegel "?" met label Koppeling.
- 1,93 s ("koppelen"): de rijen lichten één voor één geel op met een oogje, de ketting staat strak.
- 2,87 s ("hoeft"): de ketting breekt in het midden, schok, beide helften zwaaien omlaag, de tegel schuift weg.
- 3,13 s ("niet"): chip "Hoeft niet."

### 2 · Doorsturen (3,77 tot 8,00 s) · overgang breuk naar blauw
- Kop "Stuur alleen die ene door."; de andere mails dimmen, Buddy ploft rechts in beeld.
- 4,27 s ("alleen"): knop Doorsturen op de rij van de Energieleverancier.
- 5,53 s ("door"): tik, de rij vouwt zich tot papieren vliegtuigje en vliegt in een boog.
- 6,23 s ("Buddy"): Buddy vangt hem op zijn hoofd (squash).
- 6,87 s ("niks"): de rest van de mailbox wordt wazig; subregel "Buddy ziet alleen wat jij doorstuurt."

### 3 · Agenda (8,00 tot 10,47 s) · overgang vouw (van boven) naar licht
- Kop "Buddy zet hem in je agenda."; Buddy vliegt op het vliegtuigje van links over de week ma 14 tot vr 18 december.
- 8,73 s: Buddy springt eraf, 9,00 s landt op do 17, de tegel wordt blauw met €87,60 en chip Energieleverancier; het vliegtuigje vliegt verder.
- 9,53 s ("agenda"): chip Herinnering bij ma 14; subregel "Jij kiest wanneer je een herinnering krijgt."

### 4 · CTA (10,47 tot 12,87 s) · overgang vouw (van links) naar blauw
- Tagline "Alleen wat jij doorstuurt." woord voor woord; knop "activeer buddy" op "Activeer" (10,53 s).
- 11,07 s: het vliegtuigje komt binnen en wordt een papieren hoedje op Buddy's hoofd, blije ogen.
- Woordmerk en "Geen app. Geen bankkoppeling."; tik op de knop op 12,00 s.

---

<!-- copycheck:off -->
## Copyregels
Volgens `references/brand-betaalbuddy.md` §3: geen gratis, geen proefperiode, geen WhatsApp, geen "scant je inbox", geen andere merknamen, geen rood (Meta-strategie Gate 1; waarschuwingen in #111827). "Veel apps willen je hele mailbox koppelen" is een algemene uitspraak zonder merknaam.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, eleven_v4, één take)

Zoals naar ElevenLabs gestuurd (32 woorden, zonder markers):
```
Veel apps willen je hele mailbox koppelen, maar dat hoeft niet. Je stuurt alleen die ene rekening door, dus Buddy ziet niks anders. Hij zet de vervaldatum in je agenda. Activeer Buddy.
```

Met scènemarkers:
```
[S1] Veel apps willen je hele mailbox koppelen, maar dat hoeft niet. [S2] Je stuurt alleen die ene rekening door, dus Buddy ziet niks anders. [S3] Hij zet de vervaldatum in je agenda. [S4] Activeer Buddy.
```

| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Veel apps willen je hele mailbox koppelen, maar dat hoeft niet. | Ketting licht de mails uit (1,93 s), breekt op "hoeft" (2,87 s), chip "Hoeft niet." (3,13 s) |
| S2 | 3,77 | 113 | Je stuurt alleen die ene rekening door, dus Buddy ziet niks anders. | Doorsturen (4,27 s), tik en vouw (5,53 s), vangst (6,23 s), mailbox wazig (6,87 s) |
| S3 | 8,00 | 240 | Hij zet de vervaldatum in je agenda. | Buddy springt op do 17 (9,00 s), Herinnering ma 14 (9,53 s) |
| S4 | 10,47 | 314 | Activeer Buddy. | Knop (10,53 s), hoedje (11,07 s), tik (12,00 s) |

Stem 11,84 s, langste pauze 0,53 s (silencedetect -35 dB), geen versnelling. Bron: alignment uit `public/vo/vliegtuig/vo.json`, omgezet in `timing.json`.

## Caption (Reels)
```
Moet een app echt in je hele mailbox kunnen kijken voor één rekening? Nee hoor. 📬

Buddy werkt zonder koppeling met je mail ✈️
📩 Stuur alleen die ene rekening door naar je eigen Buddy-adres
👀 Buddy leest bedrag, vervaldatum, betaallink en kenmerk, verder niks
📅 De vervaldatum staat in je agenda, en jij kiest wanneer je een herinnering krijgt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #privacy #geldzaken #rekeningen #opjezelfwonen
```

**Advertentie (Ads Manager):** primaire tekst "Je hele mailbox koppelen voor één rekening? Hoeft niet. Stuur hem door, Buddy zet de vervaldatum in je agenda." (110 tekens) · Kop "Alleen wat jij doorstuurt." (26) · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden".

Copycheck (`check_copy.py`): geen treffers.

## Open controles
- Instappagina: privacy zonder mailboxkoppeling past het best; pad nog niet bevestigd.
- Datums staan op december (do 17 dec); na december aanpassen in het schema. "ma 14" is een voorbeeld van een gekozen herinnermoment.
- De overgangen breuk en vouw en het papieren vliegtuig zijn uniek ten opzichte van de concepten op deze branch en in de changelog; concepten 4 tot 61 zijn niet allemaal gelezen.
