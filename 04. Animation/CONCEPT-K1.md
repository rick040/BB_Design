Campagnecode: K1 · Campagne: bb_koud_2612

# BetaalBuddy · Instagram Reel-ad, Meta-campagne 2612, K1

## "Eén dag gekocht, negen dagen betalen"

**In één zin:** op Black Friday koop je alles op één dag, maar de betaalverzoeken van achteraf betalen komen verspreid over december; stuur de betaalmail door en Buddy zet elke datum in je agenda, met een seintje.

| | |
|---|---|
| Formaat | 9:16 Reels 1080×1920 (`BB-K1Achteraf-Reel`) · 4:5 feed 1080×1350 (`BB-K1Achteraf-Feed`) |
| Lengte | 11,0 s (3 scènes, waarvan scène 1 twee beats heeft; 30 fps), alles aan te passen in Remotion Studio |
| Laag | Koud, campagne bb_koud_2612, geoptimaliseerd op ThruPlay: kort genoeg om af te kijken |
| Safe zone | `adSafeZone` aan (default): kop, bedragen en knop tussen y=280 en y=1250 in 9:16 |
| Geluid | Werkt zonder geluid. Voice-over is een extra laag en zegt alleen wat in beeld staat |
| Code | `src/achteraf-bf/` · Studio-map `Campagne2612-K1-Achteraf` |

Hergebruik-check: geen bestaand concept op deze branch dekt achteraf betalen met een kalender (1, 2, 3 en 62 gaan over agenda, aftellen, privacy en een boemerang), dus nieuw gebouwd.

### Hoe dit verschilt van de eerdere concepten

| | Concept 1 | Concept 2 | Concept 3 | Concept 62 | **K1** |
|---|---|---|---|---|---|
| Invalshoek | Volle inbox | Heb ik betaald? | Privacy | Wegleggen werkt niet | **Achteraf betalen na Black Friday** |
| Visueel systeem | UI (inbox, chips) | Reuzengetallen | Wazig/scherp | Vluchtbanen | **Kalender en objecten: stapel pakketjes die uiteenvalt** |
| Rol van Buddy | Slikt rekening op | Rijdt mee op aftellen | Slaapmasker | Vangt boemerang | **Vangt de betaalmail, zet de datums in de agenda** |
| Einde | Belofte | "Betaald." | Regie | Omkering | **Uitleg-CTA "Zo werkt het"** |
| Slotbeeld (CTA) | Buddy bij knop | Buddy op knop | Buddy op knop | Boemerang rond knop | **Buddy springt uit een pakketje** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | **jaloezie in rijen, jaloezie in kolommen (nieuw: `src/lib/blinds.tsx`)** |

---

## Storyboard (gemeten tijden)

### 1 · Hook: "Gekocht op één dag." (0,00 tot 2,50 s) · licht
- Frame 0: kop staat al, maandraster eind november en december, de stapel van negen pakketjes (eenvoudige dozen, geen logo's) ligt op vr 27 nov, chip "Black Friday" erboven.
- 2,17 tot 2,50 s: de stapel wiebelt (aanloop).

### 2 · "Betalen op negen dagen." (2,50 tot 6,00 s) · licht, zelfde shot
- 2,50 s: de stapel valt om; elk pakketje vliegt in een boog naar een eigen datum in december (2, 4, 8, 11, 15, 17, 21, 24, 28 dec) en wordt daar een geel bolletje. Laatste landt op ~3,7 s.
- 2,67 s: kop wisselt naar "Betalen op negen dagen."

### 3 · "Stuur de betaalmail door." (6,00 tot 9,50 s) · jaloezie (rijen) naar blauw
- 6,20 s: mailrij "Webshop · Betaalverzoek" schuift in, knop "Doorsturen".
- 6,73 s: tik op Doorsturen; 6,87 s mail vliegt naar Buddy; 7,33 s Buddy vangt hem (squash).
- 7,53 s: de negen betaaldatums lichten één voor één wit op in de agenda; 7,70 s op elke datum ploppen een geel belletje (seintje).
- 7,67 s: subregel "Buddy zet hem in je agenda."

### 4 · CTA (9,50 tot 11,00 s) · jaloezie (kolommen), blauw
- 9,63 s: een pakketje gaat open, 9,77 s Buddy springt eruit. Woordmerk (9,70 s) en knop "Zo werkt het" (9,90 s).

**Afwijkingen van de brief**
- Scène 1 en 2 zijn één doorlopend shot op dezelfde kalender, met een kopwissel op 2,5 s. Zo zie je dat het dezelfde pakketjes zijn die uiteenvallen; een scènewissel zou dat breken.
- Geen vlaggetjes "7" en "2" maar één geel belletje per betaaldatum. De Drive-changelog (nov 2026) en het merkbestand zeggen dat je zelf kiest wanneer de herinnering komt; "7 en 2 dagen" is niet meer de standaard.
- Urgentie in geel (`alert` = #FFCE31), geen rood, conform deze campagne.
- De kop- en tekstgrootte in 9:16 is iets kleiner (96 px) omdat alles binnen y=280 tot 1250 moet blijven.

---

<!-- copycheck:off -->
## Copyregels
- Geen namen of logo's van achteraf-betaaldiensten of webshops: afzender is "Webshop", dozen zijn blanco.
- "negen" is een voorbeeld (negen pakketjes, negen datums), geen statistiek.
- Geen "gratis", geen proefperiode, geen "Buddy betaalt". Buddy zet de datum in je agenda; jij betaalt.
- Geen "7 en 2 dagen" in beeld of voice-over (zie open controles).
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1.0)

```
<break time="0.2s" /> Gekocht op één dag. <break time="1.1s" /> Betalen op negen dagen. <break time="1.7s" /> Stuur de betaalmail door. Buddy zet hem in je agenda. Zo werkt het.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,2 | Gekocht op één dag. | Kop staat, stapel pakketjes op vr 27 nov (frame 0) |
| 2,6 | Betalen op negen dagen. | Stapel valt om, pakketjes rollen naar december (2,50 s) |
| 6,2 | Stuur de betaalmail door. | Mailrij Webshop, tik op Doorsturen (6,73 s) |
| 7,7 | Buddy zet hem in je agenda. | Buddy vangt (7,33 s), datums lichten op met belletje (7,53 s) |
| 9,8 | Zo werkt het. | Woordmerk en knop (9,70 s) |

Doellengte mp3: ~10,4 s (21 woorden). Beeldmomenten zijn gemeten, spreektijden zijn een schatting. Te lang: Speed 1.05 of de break van 1,7 s korter. Onder de video: mp3 in `public/`, bestandsnaam in de prop `music`, `musicVolume` op 1.

## Ads Manager (bb_koud_2612)

Origineel uit het campagneplan, met voorstel waar het niet klopt met beeld of changelog:

| Veld | Origineel | Voorstel |
|---|---|---|
| Primaire tekst | Black Friday was één dag. De betaalmails komen de hele maand door, elk met een andere datum, en ze zakken weg tussen de rest van je mail. Stuur zo'n betaalmail door naar je eigen Buddy-adres. Buddy zet de betaaldatum in je agenda en geeft je 7 en 2 dagen van tevoren een seintje. Geen bankkoppeling, en Buddy leest je inbox niet. | Black Friday was één dag. De betaalmails komen de hele maand door, elk met een andere datum, en ze zakken weg tussen de rest van je mail. Stuur zo'n betaalmail door naar je eigen Buddy-adres. Buddy zet de betaaldatum in je agenda en geeft je op tijd een seintje, op het moment dat jij kiest. Geen bankkoppeling, en Buddy leest je inbox niet. |
| Kop | Eén dag gekocht, negen dagen betalen | ongewijzigd |
| Beschrijving | Buddy, €3,49 per maand | ongewijzigd |
| Knop | Meer informatie | ongewijzigd |
| URL | https://betaalbuddy.nl/achteraf-betalen/?utm_source=meta&utm_medium=paid_social&utm_campaign=bb_koud_2612&utm_content=k1_achteraf | ongewijzigd |

Reden voorstel: "7 en 2 dagen" staat niet meer in de changelog als standaard; daar staat "jij kiest wanneer je een herinnering krijgt". De primaire tekst is langer dan 125 tekens; Meta kapt hem af na de eerste regels met "meer". De hook ("Black Friday was één dag.") staat vooraan, dus dat is prima.

## Caption (organisch, als de Reel ook op het profiel komt)

```
Op Black Friday alles in één keer gekocht, en nu druppelen de betaalverzoeken binnen. Elk met een eigen datum. 📦

Buddy houdt die datums voor je bij. 🗓️
📩 Stuur de betaalmail door naar je eigen Buddy-adres
📌 Buddy zet de betaaldatum in je agenda
🔔 Je krijgt op tijd een seintje, wanneer jij wilt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #achterafbetalen #blackfriday #rekeningen #geldzaken
```

## Open controles
- **7 en 2 dagen:** de changelog bevestigt dit niet als standaard (wel: "jij kiest wanneer"). Beeld en voice-over noemen het niet; de primaire tekst wel, zie voorstel.
- **Instappagina** `/achteraf-betalen/`: moet live zijn met een knop naar start en zonder "gratis" (open punt in de changelog van 27 nov).
- **Prijs** "Buddy, €3,49 per maand" in de beschrijving: toegestaan in deze campagne; staat niet in beeld.
