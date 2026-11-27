Campagnecode: K3 · Campagne: bb_koud_2612

# BetaalBuddy · Instagram Reel-ad, Meta-campagne 2612, K3

## "Eén huurcontract, zeven rekeningen"

**In één zin:** je tekent één huurcontract en krijgt er zeven afzenders met zeven datums bij; stuur ze door en Buddy zet ze allemaal netjes in één maand.

| | |
|---|---|
| Formaat | 9:16 Reels 1080×1920 (`BB-K3EigenHuis-Reel`) · 4:5 feed 1080×1350 (`BB-K3EigenHuis-Feed`) |
| Lengte | 12,0 s (4 scènes, 30 fps), alles aan te passen in Remotion Studio |
| Laag | Koud, campagne bb_koud_2612, geoptimaliseerd op ThruPlay |
| Safe zone | `adSafeZone` aan (default): kop, datums en knop tussen y=280 en y=1250 in 9:16 |
| Geluid | Werkt zonder geluid. Voice-over is een extra laag en zegt alleen wat in beeld staat |
| Code | `src/eigen-huis/` · Studio-map `Campagne2612-K3-EigenHuis` |

Hergebruik-check: geen concept op deze branch gaat over op jezelf wonen of over uitwaaieren en verzamelen, dus nieuw gebouwd.

### Hoe dit verschilt van de eerdere concepten

| | Concept 1 | Concept 2 | Concept 3 | Concept 62 | K1 | K2 | **K3** |
|---|---|---|---|---|---|---|---|
| Invalshoek | Volle inbox | Heb ik betaald? | Privacy | Wegleggen | Achteraf betalen | Incassokosten | **Op jezelf wonen** |
| Visueel systeem | UI | Reuzengetallen | Wazig/scherp | Vluchtbanen | Kalender en pakketjes | Rollend bedrag | **Uitwaaieren en verzamelen: één kaart wordt zeven, die als tegels in een maand vallen** |
| Rol van Buddy | Slikt rekening op | Rijdt mee | Slaapmasker | Vangt boemerang | Vangt mail | Springt op rekening | **Vangt zeven kaarten na elkaar en gooit ze op hun datum** |
| Einde | Belofte | "Betaald." | Regie | Omkering | Uitleg-CTA | Terugspoelen | **Orde: één volle maand, alles op zijn plek** |
| Slotbeeld (CTA) | Buddy bij knop | Buddy op knop | Buddy op knop | Boemerang | Uit pakketje | Naast "€12,00 ✓" | **De huissleutel valt op Buddy's hoofd en wiebelt** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | jaloezie | rol-cut | **deuren (nieuw: `src/lib/doors.tsx`), flip, fade** |

---

## Storyboard (gemeten tijden)

### 1 · Hook: "Eerste eigen huis." (0,00 tot 2,50 s) · licht
- Frame 0: kop, contractkaart "Huurcontract" en een sleutel staan al.
- 0,33 s: de handtekening tekent zichzelf; 1,47 s de sleutel wiebelt.

### 2 · "Zeven rekeningen. Zeven datums." (2,50 tot 6,00 s) · deuren naar licht
- Het getekende contract splitst als twee deuren open.
- 2,63 s: zeven kaarten waaieren uit (Verhuurder, Energieleverancier, Waterbedrijf, Internetprovider, Gemeente, Zorgverzekeraar, Verzekeraar).
- 3,37 s: op elke kaart ploppen gele datumchips (1, 5, 9, 12, 17, 23 en 26 feb).

### 3 · "Doorsturen." (6,00 tot 10,00 s) · flip naar blauw
- De kaarten liggen als stapel naast Buddy. Vanaf 6,33 s springt er elke 0,4 s één naar Buddy; hij vangt hem (squash) en gooit hem op zijn datum, waar hij een witte tegel met label wordt (Huur, Energie, Water, Internet, Gemeente, Zorg, Inboedel).
- 7,33 s: subregel "Buddy onthoudt de datums." Laatste tegel ligt op ~9,2 s.

### 4 · CTA (10,00 tot 12,00 s) · fade, blauw
- De huissleutel valt van boven op Buddy's hoofd (10,47 s) en blijft wiebelend liggen. Woordmerk (10,20 s), knop "Zo werkt het" (10,47 s).

**Afwijkingen van de brief**
- De kaarten vliegen niet via een `pushedSlots`-stapel binnen maar liggen als stapel naast Buddy die korter wordt per kaart. Zo zie je in één beeld hoeveel er nog komen.
- De overgang van scène 1 naar 2 is "deuren": het contract splitst letterlijk open. De maand is februari 2027 (begint op maandag, vier nette weken); in Studio aan te passen via `gather.startDate` en de datums in `bills`.
- Verzekeraar heet op de tegel "Inboedel" zodat hij niet op Zorg lijkt; aan te passen via `bills[].short`.

---

<!-- copycheck:off -->
## Copyregels
- Alleen generieke afzenders, geen merknamen. Geen bedragen in beeld (de invalshoek is aantal en datums).
- Geen "7 en 2 dagen" in beeld; de subregel zegt "Buddy onthoudt de datums."
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1.0)

```
<break time="0.2s" /> Eerste eigen huis. <break time="1.1s" /> Zeven rekeningen. Zeven datums. <break time="1.3s" /> Doorsturen. <break time="0.3s" /> Buddy onthoudt de datums. <break time="1.2s" /> Zo werkt het.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,2 | Eerste eigen huis. | Kop, contract en sleutel (frame 0), handtekening vanaf 0,33 s |
| 2,6 | Zeven rekeningen. Zeven datums. | Kaarten waaieren uit (2,63 s), datumchips vanaf 3,37 s |
| 6,2 | Doorsturen. | Kaarten springen één voor één naar Buddy (6,33 s) |
| 7,4 | Buddy onthoudt de datums. | Subregel (7,33 s), tegels vallen in februari |
| 10,3 | Zo werkt het. | Sleutel landt op Buddy, knop (10,47 s) |

Doellengte mp3: ~10,9 s (15 woorden). Rustig tempo; laat de beelden ademen.

## Ads Manager (bb_koud_2612)

| Veld | Origineel | Voorstel |
|---|---|---|
| Primaire tekst | Je tekent één huurcontract en krijgt er zeven rekeningen bij. Allemaal van een andere afzender, met een andere datum, in een andere mail. Stuur ze door naar je eigen Buddy-adres en Buddy zet ze in je agenda, met een seintje 7 en 2 dagen voordat je moet betalen. Geen bankkoppeling, Buddy leest je inbox niet. | Je tekent één huurcontract en krijgt er zeven rekeningen bij. Allemaal van een andere afzender, met een andere datum, in een andere mail. Stuur ze door naar je eigen Buddy-adres en Buddy zet ze in je agenda, met een seintje op het moment dat jij kiest. Geen bankkoppeling, Buddy leest je inbox niet. |
| Kop | Eerste eigen huis, zeven nieuwe rekeningen | ongewijzigd |
| Beschrijving | Buddy, €3,49 per maand | ongewijzigd |
| Knop | Meer informatie | ongewijzigd |
| URL | https://betaalbuddy.nl/op-jezelf-wonen/?utm_source=meta&utm_medium=paid_social&utm_campaign=bb_koud_2612&utm_content=k3_eigenhuis | ongewijzigd |

## Caption (organisch)

```
Eén handtekening onder je huurcontract, en ineens heb je zeven afzenders met zeven datums. 🔑

Buddy houdt ze voor je bij. 🗓️
📩 Stuur elke rekening door naar je eigen Buddy-adres
📌 Buddy zet de datum in je agenda
🔔 Je krijgt op tijd een seintje, wanneer jij wilt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #opjezelfwonen #eersteeigenhuis #rekeningen #geldzaken
```

## Open controles
- **7 en 2 dagen**: niet de standaard volgens de changelog; niet in beeld, wel in de originele primaire tekst (voorstel ernaast).
- **Instappagina** `/op-jezelf-wonen/`: moet live zijn met knop naar start en zonder "gratis".
