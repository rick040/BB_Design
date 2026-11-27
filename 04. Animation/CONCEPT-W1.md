Campagnecode: W1 · Campagne: bb_warm_2612

# BetaalBuddy · Instagram Reel-ad, Meta-campagne 2612, W1

## "Zo werkt het"

**In één zin:** voor mensen die Buddy al zagen: drie stappen op een telefoon (doorsturen, in je agenda, op tijd een seintje) en dan door naar aanmelden.

| | |
|---|---|
| Formaat | 9:16 Reels 1080×1920 (`BB-W1ZoWerkt-Reel`) · 4:5 feed 1080×1350 (`BB-W1ZoWerkt-Feed`) |
| Lengte | 15,0 s (4 scènes, waarvan scène 1 twee beats heeft; 30 fps), alles aan te passen in Remotion Studio |
| Laag | Warm, campagne bb_warm_2612, retargeting, geoptimaliseerd op InitiateCheckout |
| Safe zone | `adSafeZone` aan (default): koppen, prijsregel en knop tussen y=280 en y=1250 in 9:16 |
| Geluid | Werkt zonder geluid. Voice-over is een extra laag en zegt alleen wat in beeld staat |
| Code | `src/zo-werkt-het/` · Studio-map `Campagne2612-W1-ZoWerktHet` |

Hergebruik-check: concept 1 ("Stuur door. Buddy onthoudt.") vertelt ook doorsturen en agenda, maar als probleemverhaal met een inbox en mailkaart, niet als genummerde uitleg op een telefoon met het echte adres. Aanpassen zou meer veranderen dan behouden, dus nieuw gebouwd.

### Hoe dit verschilt van de eerdere concepten

| | Concept 1 | Concept 2 | Concept 3 | Concept 62 | K1 | K2 | K3 | **W1** |
|---|---|---|---|---|---|---|---|---|
| Invalshoek | Volle inbox | Heb ik betaald? | Privacy | Wegleggen | Achteraf | Incasso | Eigen huis | **Uitleg in drie stappen (warm)** |
| Visueel systeem | UI (inbox) | Reuzengetallen | Wazig/scherp | Vluchtbanen | Kalender, pakketjes | Rollend bedrag | Uitwaaieren | **UI: telefoon-mockup met de echte flow, genummerde koppen** |
| Rol van Buddy | Slikt op | Rijdt mee | Slaapmasker | Vangt | Vangt mail | Op rekening | Vangt kaarten | **Kijkt mee naast de agenda; loopt de drie stappen af** |
| Einde | Belofte | "Betaald." | Regie | Omkering | Uitleg-CTA | Terugspoelen | Orde | **Actie: Start met Buddy + prijs** |
| Slotbeeld (CTA) | Bij knop | Op knop | Op knop | Boemerang | Uit pakketje | Naast €12 | Sleutel op hoofd | **Buddy springt over 1, 2, 3; elk wordt een vinkje** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | jaloezie | rol-cut | deuren, flip, fade | **sheet omhoog (nieuw: `src/lib/sheetUp.tsx`), slide** |

---

## Storyboard (gemeten tijden)

### 1 · Hook: "Zo werkt Buddy." (0,00 tot 2,50 s) · licht
- Frame 0: kop en telefoon met de mail "Factuur · €12,00" van Zorgverzekeraar, met "Te betalen €12,00" en "Vervaldatum 11 december 2026".
- 1,00 s: bedrag en vervaldatum krijgen een gele markeerstreep.

### 2 · "1. Doorsturen." (2,50 tot 6,00 s) · licht, zelfde shot
- 2,70 s: tik op Doorsturen; 2,90 s doorstuurscherm schuift omhoog.
- 3,30 tot 4,30 s: het aan-veld typt "jouwcode@in.betaalbuddy.nl".
- 4,50 s: tik op versturen; 4,63 s de mail vliegt weg; 4,97 s melding "Doorgestuurd naar Buddy".

### 3 · "2. Staat in je agenda." (6,00 tot 9,50 s) · sheet omhoog, blauw
- Agenda-app met de week 7 tot 13 december, vr 11 omcirkeld. Buddy kijkt mee naast de telefoon (6,33 s).
- 6,60 s: afspraak "Betaal Zorgverzekeraar · €12,00" valt op vr 11 dec; 7,07 s gele chip met belletje "Seintje vooraf".

### 4 · "3. Op tijd een seintje." (9,50 tot 12,50 s) · slide, blauw
- Vergrendelscherm (09:41, dinsdag 8 december). 9,90 s: melding van je agenda schuift in: "Betaal Zorgverzekeraar €12,00 · Vervalt vr 11 dec"; 10,30 s telefoon trilt.
- 10,63 s: subregel "Jij kiest wanneer."

### 5 · CTA (12,50 tot 15,00 s) · sheet omhoog, blauw
- Buddy springt over de stappen 1, 2 en 3; elke stap wordt een vinkje (12,63, 13,03 en 13,43 s).
- Woordmerk (12,83 s), knop "Start met Buddy" (13,23 s), subregel "€3,49 per maand · geen app · geen bankkoppeling" (13,63 s).

**Afwijkingen van de brief**
- Scène 4 toont één melding in plaats van "Over 7 dagen" en "Over 2 dagen". De changelog zegt dat je zelf kiest wanneer je herinnering komt; daarom de subregel "Jij kiest wanneer." Alle teksten van de melding zijn props (`notify.line1`, `notify.line2`).
- De melding komt van "Agenda" met een generiek agenda-icoon, niet van een BetaalBuddy-app: Buddy heeft geen app en zet het seintje in je eigen agenda. Een BetaalBuddy-app-icoon zou "geen app" tegenspreken.
- Scène 3 heeft één belletje-chip "Seintje vooraf" in plaats van twee meldingsbelletjes, om dezelfde reden.
- Scène 1 en 2 zijn één doorlopend shot op dezelfde telefoon, met een kopwissel op 2,5 s.

---

<!-- copycheck:off -->
## Copyregels
- Prijs "€3,49 per maand" alleen in de CTA-subregel; toegestaan voor Buddy in deze campagne (W1 is de enige met de prijs in beeld).
- Geen "30 dagen geld terug" in beeld.
- Afzender generiek: Zorgverzekeraar. Adres `jouwcode@in.betaalbuddy.nl` is een voorbeeld.
- "Doorgestuurd naar Buddy" en het agenda-seintje: Buddy herinnert, jij betaalt.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1.0)

```
<break time="0.2s" /> Zo werkt Buddy. <break time="1.3s" /> Eén. Doorsturen. <break time="2.5s" /> Twee. Staat in je agenda. <break time="1.8s" /> Drie. Op tijd een seintje. <break time="0.2s" /> Jij kiest wanneer. <break time="0.4s" /> Start met Buddy. Geen app.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,2 | Zo werkt Buddy. | Kop en telefoon met de rekening (frame 0) |
| 2,6 | Eén. Doorsturen. | Kop 1 (2,50 s), tik op Doorsturen, adres typt vanaf 3,30 s |
| 6,2 | Twee. Staat in je agenda. | Kop 2 (6,07 s), afspraak valt op vr 11 dec (6,60 s) |
| 9,7 | Drie. Op tijd een seintje. | Kop 3 (9,57 s), melding schuift in (9,90 s) |
| 11,4 | Jij kiest wanneer. | Subregel (10,63 s) |
| 12,9 | Start met Buddy. Geen app. | Knop (13,23 s), subregel (13,63 s) |

Doellengte mp3: ~14,1 s (23 woorden). De lange pauze na "Doorsturen" is bewust: dan typt het adres.

## Ads Manager (bb_warm_2612)

| Veld | Origineel | Voorstel |
|---|---|---|
| Primaire tekst | Zo werkt Buddy. Je krijgt een rekening per mail. Je stuurt hem door naar je eigen Buddy-adres. Buddy zet de betaaldatum in je agenda, met een seintje 7 en 2 dagen ervoor. Geen app, geen bankkoppeling, en Buddy leest je inbox niet: hij pakt de datum en gooit de mail weg. Niet blij? Binnen 30 dagen krijg je je geld terug. | Zo werkt Buddy. Je krijgt een rekening per mail. Je stuurt hem door naar je eigen Buddy-adres. Buddy zet de betaaldatum in je agenda, met een seintje op het moment dat jij kiest. Geen app, geen bankkoppeling, en Buddy leest je inbox niet: hij pakt de datum en gooit de mail weg. (Zin over geld terug pas toevoegen als die bevestigd is.) |
| Kop | Doorsturen. Buddy onthoudt de rest. | ongewijzigd |
| Beschrijving | €3,49 per maand, 30 dagen geld terug | €3,49 per maand · geen app (tot "30 dagen geld terug" bevestigd is) |
| Knop | Nu aanmelden | ongewijzigd |
| URL | https://betaalbuddy.nl/start-met-betaalbuddy/?utm_source=meta&utm_medium=paid_social&utm_campaign=bb_warm_2612&utm_content=w1_zowerkthet | ongewijzigd |

## Caption (organisch)

```
Zo werkt Buddy, in drie stappen. 👇

1️⃣ Stuur je rekening door naar je eigen Buddy-adres
2️⃣ Buddy zet de betaaldatum in je agenda
3️⃣ Je krijgt op tijd een seintje, wanneer jij wilt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #rekeningen #geldzaken #budgetteren #opjezelfwonen
```

## Open controles
- **30 dagen geld terug** (primaire tekst en beschrijving): staat in de voorwaarden van 1 nov 2026, maar de changelog bevestigt het nog niet. Niet in beeld; in Ads Manager pas na bevestiging.
- **7 en 2 dagen**: niet de standaard volgens de changelog; niet in beeld.
- **"gooit de mail weg"**: klopt met de productuitleg, maar bedrag en datum blijven tot 14 dagen na de vervaldatum bewaard. Niet uitbreiden naar "Buddy bewaart niets".
- **Instappagina** `/start-met-betaalbuddy/`: knop moet naar de checkout gaan (InitiateCheckout-event) en de pagina mag geen "gratis" noemen.
