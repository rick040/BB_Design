# BetaalBuddy · Instagram ad, concept 29

## "Geen truc. Gewoon op tijd."

**In één zin:** een goochelshow waarin je rekening met een tik van de toverstaf verdwijnt en als aanmaning terug uit de hoge hoed schiet; de volgende rekening stuur je door, Buddy komt als het konijn uit de hoed, trekt bedrag en vervaldatum eruit als een sliert sjaaltjes, en zijn verzegelde "voorspelling" blijkt gewoon je seintjes op 7 en 2 dagen vooraf plus je agenda te zijn.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Goochel-Reel`) · 4:5 feed 1080×1350 (`BB-Goochel-Feed`) |
| Lengte | 13,5 s (4 scènes, 30 fps, 405 frames), alles aan te passen in Remotion Studio |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. Voice-over en caption staan onderaan |

### Hoe dit verschilt van de eerdere concepten
Deze branch heeft concept 1 tot 3; concept 4 tot 28 staan op losse branches en in de changelog. Hieronder concept 1 tot 3 en de vier die er inhoudelijk het dichtst bij liggen. Ten opzichte van alle 28 verschilt dit concept op minstens 5 van de 6 punten.

| | Concept 1 | Concept 2 | Concept 3 | Concept 15 | Concept 21 | Concept 22 | Concept 28 | **Dit concept** |
|---|---|---|---|---|---|---|---|---|
| Invalshoek | Overzicht (volle inbox) | Timing ("al betaald?") | Privacy | Uitstel ("doe ik later") | Recept voor een aanmaning | Rekening uit het oog in je inbox | Gestuntel, telshop | **Vergeten als verdwijntruc:** wat uit je hoofd verdwijnt, komt terug als aanmaning |
| Visueel systeem | UI (inbox, chips) | Typografisch (reuzengetal) | Focus (wazig/scherp) | Lockscreen, swipende hand | Keuken | Camcorder-zoeker, gras | Zwart-wit, starbursts | **Goochelshow:** toneeldoek, tafel, hoge hoed, toverstaf, rookwolk, verzegelde envelop |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het getal | Slaapmasker op/af | Boemerang | Kok | Op de loer in camouflage | Demonstrateur | **Het konijn uit de hoed** dat de gegevens als sjaaltjes eruit trekt, daarna goochelaar met een voorspelling |
| Einde | Belofte | Uitkomst "Betaald." | Regie | "Buddy komt terug" | Onthulling | REC wordt STOP | "Niet bellen" | **Ontmaskering:** "Geen truc. Gewoon op tijd." |
| Slotbeeld (CTA) | Buddy gluurt van rechts | Buddy op de knop | Buddy boven de knop, masker omlaag | Buddy landt naast de knop | Buddy onder een cloche | Buddy in het gras | Buddy stampt een balk door | **Buddy met hoge hoed maakt een buiging** in een spotlight, het doek gaat langzaam dicht |
| Overgangen | Iris, slide | Clock-wipe, slide | Wipe, focus pull | Swipe-push | Pan-deksel, stoom | Verrekijker, crash zoom | Starburst, crt-switch | **Toneeldoek** (`src/lib/curtain.tsx`) en **toverstaf-veeg** met sterretjes (`src/lib/wandSwish.tsx`) |

Afgevallen richtingen: een puzzel (te dicht op memory van concept 24) en een postbode op de fiets (lage pijn, staat als reserve in de backlog).

---

## Storyboard

### 1 · Hook: "De verdwijntruc van je rekening." (0,0 tot 3,4 s) · licht, toneel met doek aan de zijkanten
- Op frame 0 staan de kop, een rekening (Energieleverancier · Je eindafrekening · €86,40), een hoge hoed op een goocheltafel en een toverstaf al in beeld.
- **0,33 s:** de toverstaf tikt op de rekening. **0,60 s:** poef, rookwolk, de rekening is weg. **0,73 s:** "Poef. Weg."
- **1,27 s:** de hoed begint te schudden, met sterretjes. **1,67 s:** de rekening schiet terug uit de hoed, nu als zwarte kaart **AANMANING · Energieleverancier**.
- **2,07 s:** chip "Kan uitlopen op €40". **2,33 s:** subregel "Uit het oog. Maar niet uit de wereld."
- Cover = frame 66 (2,2 s): kop, hoed, aanmaning en de €40-chip.

### 2 · "De volgende? Stuur hem door." (2,9 tot 6,5 s) · toneeldoek naar blauw
- Een doorgestuurde mail (label Doorgestuurd, Zorgverzekeraar · Premie november) zweeft boven de hoed en valt erin (3,50 s). De hoed springt op (3,97 s).
- **4,17 s:** Buddy komt als het konijn uit de hoed, kijkt links en rechts.
- **4,97 / 5,23 / 5,50 s:** Buddy trekt een sliert chips uit de hoed: **€138,50**, **Vervalt 24 nov** (geel) en **Kenmerk**, aan een stippellijn.
- **5,70 s:** subregel "Buddy haalt er bedrag en vervaldatum uit."

### 3 · "Buddy voorspelt je seintjes." (6,0 tot 10,2 s) · toverstaf-veeg naar licht
- Een verzegelde envelop **VOORSPELLING** met een lakzegel. Buddy (blauw) hupt op en tikt ertegen (6,53 s).
- **6,80 s:** de klep gaat open. **7,13 s:** de voorspellingskaart schuift eruit.
- **7,60 s** 17 nov · Mail: nog 7 dagen · **7,93 s** 22 nov · Mail: nog 2 dagen · **8,27 s** 24 nov · In je agenda. Sterretjes op 8,47 s, Buddy knijpt zijn ogen blij dicht.
- **8,73 s:** subregel "7 en 2 dagen vooraf in je mail. De vervaldatum in je agenda."

### 4 · CTA (9,7 tot 13,5 s) · toneeldoek naar blauw
- Tagline woord voor woord vanaf 9,93 s: **"Geen truc."** in wit, **"Gewoon op tijd."** in zachtblauw.
- **10,23 s:** Buddy ploept op een klein podium in een spotlight, met een hoge hoed op. Knop **"activeer buddy"** op 10,50 s, "Geen app. Geen bankkoppeling." op 10,90 s, woordmerk op 11,23 s.
- **11,63 s:** Buddy maakt een buiging, zijn hoed komt even los en landt weer, met sterretjes.
- **12,63 s:** tap-ripple op de knop. **12,77 s:** het doek begint langzaam dicht te gaan (alleen de randen, de tekst blijft vrij).

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3 en de changelog (stand 29 oktober 2026): geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs, geen namen of logo's van andere merken (alleen generieke afzenders).

Productclaims in deze ad en waar ze op rusten:
- "Stuur hem door" en "Buddy haalt er bedrag en vervaldatum uit": doorsturen naar je eigen doorstuuradres; Buddy leest bedrag, vervaldatum en kenmerk.
- "7 en 2 dagen vooraf in je mail" en "De vervaldatum in je agenda": herinneringen op T-7 en T-2 en de ICS-agendalink. Dat zit in de pakketten Buddy en Buddy pro, niet in Basic; daarom staat er geen prijs in deze ad.
- "Kan uitlopen op €40": wettelijk minimum voor incassokosten, pas na een veertiendagenbrief; daarom met "kan".
- De betaallink wordt bewust niet genoemd (nog niet bevestigd dat die in de herinneringsmail staat).
- "Voorspelt" is beeldspraak voor de seintjes die al ingepland staan; de ad belooft niet dat Buddy elke rekening kan lezen.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1,0)

```
Je rekening? Poef. Weg. <break time="0.3s" /> Tot hij terugkomt als aanmaning. Stuur hem door. Buddy haalt de datum eruit. <break time="0.5s" /> Zeven en twee dagen vooraf een mail. <break time="0.5s" /> Geen truc. Gewoon op tijd. <break time="0.3s" /> Activeer Buddy.
```

De beeldmomenten kloppen op het frame (`timeline.py` op de scène-timings en de constanten in `src/goochel/scenes/`). De starttijden van de zinnen zijn een schatting (~5 lettergrepen per seconde) en hangen af van de stem.

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Je rekening? Poef. Weg. | Kop, rekening en hoed op frame 0; tik met toverstaf 0,33 s, poef 0,60 s |
| 1,8 | Tot hij terugkomt als aanmaning. | Hoed schudt 1,27 s, aanmaning schiet eruit 1,67 s, chip "Kan uitlopen op €40" 2,07 s |
| 3,9 | Stuur hem door. | Doek 2,90 tot 3,40 s, doorgestuurde mail valt in de hoed 3,50 s |
| 4,8 | Buddy haalt de datum eruit. | Buddy komt uit de hoed 4,17 s, chips 4,97 / 5,23 / 5,50 s |
| 7,2 | Zeven en twee dagen vooraf een mail. | Envelop open 6,80 s, kaart 7,13 s, regels 7,60 / 7,93 / 8,27 s |
| 10,0 | Geen truc. Gewoon op tijd. | Doek 9,70 tot 10,20 s, tagline vanaf 9,93 s, knop 10,50 s |
| 11,8 | Activeer Buddy. | Buiging 11,63 s, tap op de knop 12,63 s, einde 13,50 s |

**Doellengte:** de mp3 duurt ongeveer 12,8 s (31 woorden). Langer dan 13,2 s? Zet de speed op 1,05 of maak de breaks 0,1 s korter. Korter? Maak de breaks iets langer. Lukt het niet in één keer, genereer dan per zin en zet de zinnen op de starttijden hierboven.

**Onder de video zetten:** zet de mp3 in `public/` (bijvoorbeeld `vo-goochel.mp3`), vul die naam in bij de prop `music` en zet `musicVolume` op 1.

## Caption (Reels)

```
Je rekening verdwijnt uit je hoofd. En komt terug als aanmaning. 🎩

Buddy doet een ander kunstje 🪄
📩 Stuur je rekening door naar je eigen doorstuuradres
🔍 Buddy haalt er bedrag en vervaldatum uit
⏰ 7 en 2 dagen van tevoren krijg je een mail
📅 De vervaldatum staat ook in je agenda

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #aanmaning #geldzaken #rekeningen #opjezelfwonen
```

**Advertentie (Ads Manager):** primaire tekst "Een vergeten rekening kan terugkomen als aanmaning. Stuur hem door naar Buddy en krijg 7 en 2 dagen vooraf een mail." (117 tekens) · Kop "Geen truc. Gewoon op tijd." (26 tekens) · Knop "Aanmelden".

Copycheck: één treffer, de €40-chip, en die staat er bewust met "kan".

## Open controles
- Instappagina voor de knop en "link in bio" staat nog open. Het best past "aanmaning en incassokosten"; die noemt volgens de changelog nog prijzen en "30 dagen geld terug".
- De datums staan op november (mails 17 en 22 nov, vervaldatum 24 nov); na half november omzetten in `src/goochel/schema.ts`.
- Voice-over genereren en de lengte controleren.

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-29-Goochel**, composities `BB-Goochel-Reel` en `BB-Goochel-Feed`.
- **Blijvend aanpassen:** `src/goochel/schema.ts` (`defaultGoochelProps`): alle teksten, de rekeningen, de chips, de drie regels van de voorspelling, kleuren en scènelengtes.
- **Timing van de beats:** de constanten bovenin elk bestand in `src/goochel/scenes/` (`HOOK_T`, `HAT_T`, `PREDICT_T`, `CTA_T`). Verander je die, reken de cue-tabel opnieuw uit met `timeline.py`.
- **Exporteren:** `npm run render:goochel` (9:16), `npm run render:goochel:feed` (4:5), `npm run still:goochel` (cover, frame 66).
- **Nieuw en herbruikbaar:** `src/goochel/components/Magic.tsx` (hoed in twee lagen, toverstaf, rookwolk, sterretje, envelop, toneeldoek) en de overgangen `src/lib/curtain.tsx` en `src/lib/wandSwish.tsx`. Geen wijziging aan bestaande gedeelde code.
