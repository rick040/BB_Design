# BetaalBuddy · Instagram ad, concept 87

## "Later is gewoon een datum."

**In één zin:** bij achteraf betalen heeft "later" geen datum, dus vergeet je de betaalmail tot de aanmaning komt; je stuurt hem door, Buddy trekt de sticker "Betaal later" eraf en de vervaldatum die eronder zat vliegt naar je agenda.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Later-Reel`) · 4:5 feed 1080×1350 (`BB-Later-Feed`) |
| Lengte | 13,27 s (398 frames, 5 scènes, 30 fps). De animatie volgt de stem: scènestarts uit `public/vo/later/timing.json` |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de instappagina "achteraf betalen" |
| Geluid | Werkt zonder geluid (alle zinnen staan als kop in beeld). Voice-over in één take, prop `withVoice` |
| Code | `src/later/` · Studio-map `Concept-87-Later` · `npm run render:later`, `render:later:feed`, `still:later` |

**Keuze:** USP `doelgroep`, het langst niet gebruikt (laatst 79). Doelgroep achteraf betalen, nog nooit gebruikt. Vorm twee schermen naast elkaar (niet in 84, 85, 86). Metafoor: een verzendetiket-achtige sticker "Betaal later" die de vervaldatum afdekt.

### Hoe dit verschilt van de eerdere concepten

| | 62 Boemerang | 79 Plattegrond (net op jezelf) | 81 Rolcijfers (twee schermen) | 85 Puzzel | 86 Prikbord | **87 Later** |
|---|---|---|---|---|---|---|
| Invalshoek | agenda, wegleggen werkt niet | doelgroep net op jezelf | geen AI | geen app | overzicht | **doelgroep achteraf betalen: later heeft geen datum** |
| Visueel systeem | vluchtbanen | plattegrond | tellerrollen, split | puzzelstukjes | prikbord, draden | **split Nu/Later, pakketje, gele sticker** |
| Rol van Buddy | vangt en gooit | slikt rekeningen | zet rollen stil | wordt middenstuk | rukt draden los | **trekt de sticker eraf** |
| Einde | omkering | thuis op orde | zekerheid | som klopt | lijst | **onthulling: er zat altijd een datum onder** |
| Slotbeeld (CTA) | gooit boemerang | veegt voeten op deurmat | drukt pin in | knop klikt vast | trekt knop aan draadje | **springt uit een pakketdoos; knop wordt het verzendlabel** |
| Overgangen | swing, spin-return | (doorlopend shot) | split | jigsaw iris, split | lamellen, opstijgen | **tape rip, box flaps** |

Op 6 van 6 punten anders dan elk concept in de index; geen eerder concept over achteraf betalen.

---

## Storyboard (gemeten tijden)

### 1 · Hook: "Nu besteld. Later betalen." (0,00 tot 4,67 s) · licht
- Frame 0: kop staat er al, split screen Nu | Later. Links een pakketje met "Bezorgd", rechts de betaalmail van de Webshop met gele sticker "Betaal later" over de vervaldatum.
- Op "later" (1,77 s) licht de kant Later op; op het tweede "later" wiebelt de mail; op "datum" (3,93 s) springt een rode "?" op de sticker en zakt de mail grijs weg.

### 2 · Aanmaning: "Dan komt er een aanmaning." (4,67 tot 6,40 s) · tape rip van rechts
- De mail valt groot in beeld; op "aanmaning" (5,43 s) stempel AANMANING en schok, roze waas, chip "Kan uitlopen op €40".

### 3 · Doorsturen: "Stuur de betaalmail door." (6,40 tot 7,87 s) · tape rip van links naar blauw
- Mail met knop Doorsturen; op "door" (7,37 s) drukt de knop in en vliegt de mail weg.

### 4 · Sticker eraf: "Buddy maakt van later een datum." (7,87 tot 10,97 s) · box flaps naar licht
- Buddy (blauw) springt op "maakt", grijpt de sticker op "van" (8,63 s) en trekt hem eraf; daaronder "Vervalt do 17 dec".
- Op "datum" (9,63 s) een blauwe ring om de datum, drie agendategels (wo 16, do 17, vr 18) komen op.
- Op "in" vliegt de datum naar do 17; op "agenda" (10,33 s) kleurt de tegel blauw met €64,95. Buddy knipoogt.

### 5 · CTA: "Later is gewoon een datum." (10,97 tot 13,27 s) · box flaps naar blauw
- Een pakketdoos klapt open, Buddy springt eruit; op "Activeer" (10,97 s) slaat de knop "activeer buddy" als verzendlabel op de doos.
- "Geen app. Geen bankkoppeling." en het woordmerk.

---

<!-- copycheck:off -->
## Copyregels
- Geen gratis, geen proefperiode, geen WhatsApp, geen merknamen: afzender is "Webshop", niet een betaalaanbieder.
- €40 alleen als "Kan uitlopen op €40".
- Geen prijs in deze ad. Agenda-herinnering zit in pakket Buddy (€3,49); niet "vanaf €2,99".
- Buddy herinnert, jij betaalt.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, één take)

Stem `7qdUFMklKPaaAVMsBTBt` (uit ELEVENLABS_VOICE_ID), model `eleven_v4`, language_code nl, stability 0.5, similarity_boost 0.75, geen andere instellingen. Route: API `/with-timestamps` (HTTP 200). 32 woorden, 12,20 s, langste pauze 0,46 s. Bestanden: `public/vo/later/voice-over.mp3`, `vo.json` (alignment), `timing.json` (frames).

Met scènemarkers (de markers gaan niet naar ElevenLabs):
```
[S1] Je bestelt iets en betaalt later, maar later heeft geen datum, [S2] dus komt er een aanmaning. [S3] Stuur de betaalmail door, [S4] en Buddy maakt van later een datum in je agenda. [S5] Activeer Buddy.
```

Zoals naar ElevenLabs gestuurd:
```
Je bestelt iets en betaalt later, maar later heeft geen datum, dus komt er een aanmaning. Stuur de betaalmail door, en Buddy maakt van later een datum in je agenda. Activeer Buddy.
```

| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Je bestelt iets en betaalt later, maar later heeft geen datum, | Split Nu/Later, "?" op de sticker bij "datum" (f118) |
| S2 | 4,67 | 140 | dus komt er een aanmaning. | Stempel AANMANING op "aanmaning" (f163) |
| S3 | 6,40 | 192 | Stuur de betaalmail door, | Knop Doorsturen drukt in op "door" (f221) |
| S4 | 7,87 | 236 | en Buddy maakt van later een datum in je agenda. | Sticker eraf op "van" (f259), datum in agenda op "agenda" (f310) |
| S5 | 10,97 | 329 | Activeer Buddy. | Knop slaat als label op de doos (f329) |

## Caption (Reels)
```
Nu besteld, later betalen. Maar wanneer is later eigenlijk? 📦

Buddy maakt van later een datum. 🗓️
📩 Stuur de betaalmail van je bestelling door naar Buddy
🔎 Buddy haalt het bedrag en de vervaldatum eruit
⏰ De vervaldatum staat in je agenda, met een herinnering wanneer jij kiest

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #achterafbetalen #geldzaken #rekeningen #budgetteren
```

**Advertentie (Ads Manager):** primaire tekst "Achteraf betaald? Stuur de betaalmail door en Buddy zet de vervaldatum in je agenda. Zo vergeet je hem niet." (108 tekens) · Kop "Later is gewoon een datum." (26) · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden".

Copycheck: één treffer, "Kan uitlopen op €40" in het schema; toegestaan want met "kan".

## Renders
`renders/later-reel-vo.mp4`, `later-feed-vo.mp4` (loudnorm -14 LUFS, video gekopieerd), `later-reel-stil.mp4`, `later-feed-stil.mp4` (geen audiostream), `later-voice-over.mp3` (genormaliseerd), `later-cover.png` (frame 125).

## Open controles
- Instappagina voor knop en link in bio: de pagina "achteraf betalen" past het best. Controleren dat die geen prijs of "30 dagen geld terug" noemt die niet klopt.
- Bevestigen dat betaalmails van achteraf-betaaldiensten door Buddy goed gelezen worden (bedrag, vervaldatum, betaallink).
- Datums staan op december; na half december omzetten.
