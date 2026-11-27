Campagnecode: K2 · Campagne: bb_koud_2612

# BetaalBuddy · Instagram Reel-ad, Meta-campagne 2612, K2

## "Twaalf wordt tweeënvijftig"

**In één zin:** een vergeten rekening van €12 kan na een aanmaning en veertien dagen €52 worden; spoel terug en kies voor een seintje vooraf.

| | |
|---|---|
| Formaat | 9:16 Reels 1080×1920 (`BB-K2Twaalf-Reel`) · 4:5 feed 1080×1350 (`BB-K2Twaalf-Feed`) |
| Lengte | 11,0 s (5 scènes, 30 fps), alles aan te passen in Remotion Studio |
| Laag | Koud, campagne bb_koud_2612, geoptimaliseerd op ThruPlay |
| Safe zone | `adSafeZone` aan (default): kop, bedragen en knop tussen y=280 en y=1250 in 9:16 |
| Geluid | Werkt zonder geluid. Voice-over is een extra laag en zegt alleen wat in beeld staat |
| Code | `src/twaalf-52/` · Studio-map `Campagne2612-K2-Twaalf` |

Hergebruik-check: concept 2 (aftellen 7 naar 2) gebruikt ook `RollingNumber`, maar gaat over timing, niet over incassokosten; concept 62 (boemerang) gaat over een terugkerende aanmaning met een ander beeld. Geen van beide dekt deze brief, dus nieuw gebouwd.

### Hoe dit verschilt van de eerdere concepten

| | Concept 1 | Concept 2 | Concept 3 | Concept 62 | K1 | **K2** |
|---|---|---|---|---|---|---|
| Invalshoek | Volle inbox | Heb ik betaald? | Privacy | Wegleggen werkt niet | Achteraf betalen | **Aanmaning en incassokosten** |
| Visueel systeem | UI | Reuzengetallen (aftellen) | Wazig/scherp | Vluchtbanen | Kalender en pakketjes | **Typografisch: één bedrag dat oploopt en terugspoelt** |
| Rol van Buddy | Slikt rekening op | Rijdt mee | Slaapmasker | Vangt boemerang | Vangt mail | **Springt op de rekening, seintje vooraf** |
| Einde | Belofte | "Betaald." | Regie | Omkering | Uitleg-CTA | **Terugspoelen: het blijft €12** |
| Slotbeeld (CTA) | Buddy bij knop | Buddy op knop | Buddy op knop | Boemerang | Buddy uit pakketje | **Buddy naast chip "€12,00 ✓"** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | jaloezie | **rol-cut omhoog, rol-cut omlaag bij het terugspoelen (nieuw: `src/lib/rollCut.tsx`)** |

---

## Storyboard (gemeten tijden)

### 1 · Hook: "Rekening vergeten." (0,00 tot 2,00 s) · licht
- Frame 0: kop, groot "€12" en de BillCard "Zorgverzekeraar · €12,00 · vervallen" staan al.
- 0,53 s: subregel "Nog geen ramp."

### 2 · "Aanmaning. Veertien dagen." (2,00 tot 4,50 s) · rol-cut omhoog, licht
- 2,13 s: een kale envelop valt in (geen tekst, geen nagemaakte brief); 2,53 s geel bolletje erop.
- 2,60 s: dagblaadjes van een scheurkalender slaan om, 2 tot 16 december (veertien dagen).

### 3 · "€12 kan €52 worden." (4,50 tot 7,00 s) · rol-cut omhoog, licht
- 4,90 tot 6,03 s: het bedrag rolt op van €12 naar €52 als een fruitautomaat; een gele markeerstreep groeit erachter mee. 6,03 s: shake op €52.
- 5,90 s: subregel "Er kan €40 incassokosten bij."

### 4 · "Of: een seintje vooraf." (7,00 tot 9,50 s) · rol-cut omlaag (terugspoelen), blauw
- 7,20 tot 8,00 s: het bedrag spoelt terug naar €12.
- 7,60 s: BillCard schuift in; 7,87 s Buddy springt erop.
- 8,27 s: gele chip met belletje "seintje vooraf"; 8,80 s vinkje naast €12.

### 5 · CTA (9,50 tot 11,00 s) · rol-cut omhoog, blauw
- Buddy naast een chip "€12,00 ✓", woordmerk (9,63 s), knop "Zo werkt het" (9,83 s).

**Afwijkingen van de brief**
- Het oplopende bedrag is blauw op een gele markeerstreep, niet geel op licht: gele tekst op een lichte achtergrond is niet leesbaar. Geel blijft de urgentiekleur.
- Geen vlaggetjes "7 dagen" en "2 dagen" maar één chip "seintje vooraf". De changelog zegt dat je zelf kiest wanneer de herinnering komt. In Studio is `rewind.reminders` een lijst: zet er `["7 dagen", "2 dagen"]` in als dat toch de standaard blijkt.
- De vervaldatum op de BillCard is "vervallen" (grijze chip), niet urgent: de urgente BillCard-chip gebruikt witte tekst op de alertkleur en dat leest niet op geel.

---

<!-- copycheck:off -->
## Copyregels
- €40 altijd met "kan": "€12 kan €52 worden.", "Er kan €40 incassokosten bij." Geen belofte dat Buddy incassokosten voorkomt; de CTA-scène zegt alleen dat het €12 blijft als je op tijd betaalt.
- Asset 33 ("Laatste aanmaning +€60") niet gebruikt; de aanmaning is een kale envelop zonder tekst.
- Afzender generiek: Zorgverzekeraar.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1.0)

```
<break time="0.1s" /> Rekening vergeten. Nog geen ramp. <break time="0.1s" /> Aanmaning. Veertien dagen. <break time="0.7s" /> Twaalf euro kan tweeënvijftig worden. <break time="0.6s" /> Of: een seintje vooraf. <break time="0.7s" /> Zo werkt het.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,1 | Rekening vergeten. Nog geen ramp. | Kop en €12 staan (frame 0), subregel 0,53 s |
| 2,3 | Aanmaning. Veertien dagen. | Envelop valt in (2,13 s), blaadjes slaan om vanaf 2,60 s |
| 4,7 | Twaalf euro kan tweeënvijftig worden. | Kop (4,57 s), bedrag rolt op 4,90 tot 6,03 s |
| 7,4 | Of: een seintje vooraf. | Terugspoelen (7,20 s), chip seintje vooraf (8,27 s) |
| 9,8 | Zo werkt het. | Knop (9,83 s) |

Doellengte mp3: ~10,4 s (20 woorden). De €40-subregel staat alleen in beeld; de stem laat hem weg om binnen 11 s te blijven. Te lang: Speed 1.05.

## Ads Manager (bb_koud_2612)

| Veld | Origineel | Voorstel |
|---|---|---|
| Primaire tekst | Een rekening van €12 vergeten is zo gebeurd. Komt daarna de aanmaning en blijft die ook liggen, dan mag er minimaal €40 incassokosten bij. Stuur je rekening door naar Buddy en je krijgt een seintje in je agenda, 7 en 2 dagen voordat je moet betalen. Geen app, geen bankkoppeling. | Een rekening van €12 vergeten is zo gebeurd. Komt daarna de aanmaning en blijft die ook liggen, dan kan er minimaal €40 incassokosten bij. Stuur je rekening door naar Buddy en je krijgt een seintje in je agenda, op het moment dat jij kiest. Geen app, geen bankkoppeling. |
| Kop | Een rekening van €12 kan €52 worden | ongewijzigd |
| Beschrijving | Buddy, €3,49 per maand. 30 dagen geld terug. | Buddy, €3,49 per maand. (tot "30 dagen geld terug" bevestigd is) |
| Knop | Meer informatie | ongewijzigd |
| URL | https://betaalbuddy.nl/aanmaning-incassokosten/?utm_source=meta&utm_medium=paid_social&utm_campaign=bb_koud_2612&utm_content=k2_incasso | ongewijzigd |

Redenen: "7 en 2 dagen" is volgens de changelog niet meer de standaard. "mag er" naar "kan er" sluit aan op de copyregel voor €40. "30 dagen geld terug" staat in de voorwaarden van 1 nov 2026 maar is in de changelog nog niet bevestigd.

## Caption (organisch)

```
€12 vergeten is zo gebeurd. Komt er een aanmaning en blijft die ook liggen, dan kan het zo €52 worden. 😬

Met een seintje vooraf betaal je gewoon die €12. 🙌
📩 Stuur je rekening door naar je eigen Buddy-adres
📌 Buddy zet de betaaldatum in je agenda
🔔 Je krijgt op tijd een seintje, wanneer jij wilt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #aanmaning #incassokosten #rekeningen #geldzaken
```

## Open controles
- **30 dagen geld terug** (beschrijving): niet bevestigd in de changelog; alleen gebruiken na bevestiging, nooit in beeld.
- **7 en 2 dagen**: niet de standaard volgens de changelog; niet in beeld, wel in de originele primaire tekst.
- **Instappagina** `/aanmaning-incassokosten/`: noemt volgens de changelog nog prijzen en "30 dagen geld terug"; checken voor livegang.
- **€40**: wettelijk minimum na een veertiendagenbrief; overal met "kan" geformuleerd.
