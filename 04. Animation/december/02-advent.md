# Idee 2 · De adventskalender (Reel, Feed en Story-reeks)

Campagne "Buddy houdt het lijstje bij", fase Lijstjestijd, hero-ad. Hoek: een adventskalender waarvan niet elk deurtje chocola is. Buddy hangt bij elke rekening twee vlaggetjes (7 en 2 dagen vooraf). Dezelfde kalender is het vaste Story-ritme van 1 t/m 24 december.

Posten: Reel op di 1 december, Story dagelijks 1 t/m 24 december. Kanaal: organisch plus betaald (TOFU, hero).

## Composities

| Id | Formaat | Gebruik | Lengte |
|---|---|---|---|
| `DEC02-Advent-Reel` | 1080×1920 (9:16) | Reel, Story, ad | 14,4 s (432 frames) |
| `DEC02-Advent-Feed` | 1080×1350 (4:5) | Feed, ad | 14,4 s |
| `DEC02-Advent-Story-01` t/m `-24` | 1080×1920 stills | Story, één per dag | n.v.t. |

Bestanden: `renders/december/DEC02-Advent-Reel.mp4`, `DEC02-Advent-Feed.mp4`, `DEC02-Advent-Reel-cover.png` (frame 70) en `DEC02-Advent-Story-01.png` t/m `-24.png`.

## Scènes en gemeten tijden (30 fps, overgang 0,4 s)

| # | Scène | Start (s) | Eind (s) | Frames | Kleur |
|---|---|---|---|---|---|
| 1 | Niet elk deurtje is chocola | 0,00 | 3,40 | 0 tot 102 | licht |
| 2 | Buddy hangt vlaggetjes | 3,00 | 7,40 | 90 tot 222 | blauw |
| 3 | Mail doorsturen | 7,00 | 11,20 | 210 tot 336 | licht |
| 4 | Jij opent de chocola (CTA) | 10,80 | 14,40 | 324 tot 432 | blauw |

Overgangen: deur zwaait open (eigen CSS-overgang `doorSwing`, scène 1 naar 2 en 3 naar 4) en een slide van onder (2 naar 3).

| Tijd (s) | Beeld |
|---|---|
| 0,00 | Kop "Niet elk deurtje is chocola." staat er al, 24 deurtjes dicht |
| 0,53 en 1,00 | Deurtje 1 en 2 gaan open: chocola |
| 1,67 | Deurtje 3 gaat open en wordt groter: Huur €825 |
| 3,40 en 3,60 | Buddy gooit twee vlaggetjes (7 en 2) naar deurtje 3 |
| 4,33 | Deurtje 9 gaat open: Webshop achteraf €64,95; vlaggetjes bij 4,80 s |
| 5,67 | Deurtje 14 gaat open: Zorgpremie €139,50; vlaggetjes bij 6,13 s |
| 6,27 | Subregel "Twee seintjes per rekening: 7 en 2 dagen vooraf." |
| 7,67 | "Doorsturen" wordt ingedrukt, de mail vliegt naar "Je eigen Buddy-adres" (7,87 s) |
| 8,67 | Agenda-item Zorgpremie, 14 dec |
| 9,33 en 9,73 | Vinkje bij "7 dagen vooraf", dan bij "2 dagen vooraf" |
| 11,67 | Slotdeurtje 24 zwaait open, Buddy staat erin (11,87 s) |
| 12,40 | Knop "activeer buddy" |
| 13,73 | Tik op de knop |

Slotbeeld: Buddy staat in deurtje 24 (niet op de knop). Alles is zonder geluid te volgen.

## Voice-over (ElevenLabs Multilingual v2, Speed 0,9)

Beelden zijn gemeten, spreektijden zijn een schatting (4,5 lettergrepen per seconde). Genereer op Speed 0,9; een andere Speed verschuift de latere zinnen.

```
Niet elk deurtje is chocola. <break time="0.5s" /> Buddy hangt er vlaggetjes bij. <break time="0.1s" /> Zeven dagen vooraf, en twee. <break time="0.6s" /> Stuur de mail door. Staat in je agenda. <break time="0.4s" /> Jij opent de chocola. Buddy let op de rest.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Niet elk deurtje is chocola. | Kop, deurtje 1 en 2 (chocola), deurtje 3: huur |
| 2,6 | Buddy hangt er vlaggetjes bij. | Vlaggetjes 7 en 2 bij deurtje 3 (beat 3.4 s) |
| 4,8 | Zeven dagen vooraf, en twee. | Deurtje 9 en 14 gaan open, vlaggetjes erbij (4.8 s en 5.7 s) |
| 7,7 | Stuur de mail door. | Doorsturen wordt ingedrukt, mail vliegt naar het Buddy-adres (7.7 s) |
| 8,9 | Staat in je agenda. | Agenda-item Zorgpremie, twee vinkjes (8.7 s en 9.3 s) |
| 10,9 | Jij opent de chocola. | Slotkop, deurtje 24 (10.8 s) |
| 12,8 | Buddy let op de rest. | Buddy staat in het deurtje, knop (11.9 s en 12.4 s) |

Doellengte mp3: ongeveer 14,1 s. Zet de mp3 in `public/` en de bestandsnaam in de prop `music` (`musicVolume` op 1).

## Instagram-caption (Reel)

```
Niet elk deurtje in december is chocola. 🎄 Sommige zijn een rekening.

Buddy houdt het lijstje bij, zodat jij van december kunt genieten. 🍫
📩 Stuur je rekening door naar je eigen Buddy-adres
🗓️ Buddy zet de datum in je agenda
🚩 Je krijgt een seintje 7 en 2 dagen vooraf

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Start met je Buddy via de link in bio

#betaalbuddy #december #adventskalender #rekeningen #geldzaken
```

## Ads Manager

- Primaire tekst (105 tekens): `Niet elk deurtje is chocola. Buddy zet je rekeningen in je agenda, met een seintje 7 en 2 dagen vooraf.`
- Kop (27 tekens): `Buddy houdt het lijstje bij`
- Knop: Aanmelden
- Doelgroep: breed NL, 21 t/m 34 (TOFU). Pas achter budget nadat de Reel organisch sterk liep (8.000+ weergaven en meer dan 30 % kijkt 3 seconden).

## Story-reeks: 24 deurtjes

Eén Still per dag, ritme: dagelijks 1 t/m 24 december. Elke Story toont het deurtje, een rekening of tip, één zin en onderaan de chip "Doorsturen · seintje 7 en 2 dagen vooraf". Deurtje 3 (huur), 9 (webshop achteraf) en 14 (zorgpremie) komen uit het campagnebestand. **De andere 21 deurtjes zijn een voorstel van Claude**; lees ze door voor je ze inplant. De voorbeeldbedragen zijn verzonnen en staan niet in beeld als statistiek.

| Dag | Soort | Titel | Zin |
|---|---|---|---|
| 1 | chocola | Chocola | Deze is voor jou. Buddy let op de rest. |
| 2 | tip | Zet je lijstje klaar | Stuur elke rekening door zodra hij binnen is. |
| 3 | rekening | Huur (€825, vervalt 3 dec) | Doorsturen, en de datum staat in je agenda. |
| 4 | tip | Doorsturen duurt even | Eén mail doorsturen is zo gedaan. |
| 5 | rekening | Energieleverancier (€96,40, vervalt 5 dec) | Nota doorsturen en je krijgt een seintje. |
| 6 | tip | Zeven dagen vooraf | Het eerste seintje: ruim op tijd, zonder haast. |
| 7 | rekening | Telefoonprovider (€27,50, vervalt 8 dec) | Je factuur van december, alvast in je agenda. |
| 8 | tip | Twee dagen vooraf | Het tweede seintje, voor wie het even vergeet. |
| 9 | rekening | Webshop achteraf (€64,95, vervalt 9 dec) | Achteraf betalen komt in december terug. |
| 10 | tip | Wekelijks overzicht | Elke week zie je wat er aan komt. |
| 11 | rekening | Sportschool (€34,99, vervalt 11 dec) | Je abonnement, netjes in je agenda. |
| 12 | tip | Hele dag in je agenda | Een rekening wordt een item voor de hele dag. |
| 13 | rekening | Verzekeraar (€212,00, vervalt 13 dec) | Je jaarbedrag, met seintje 7 en 2 dagen vooraf. |
| 14 | rekening | Zorgpremie (€139,50, vervalt 14 dec) | Je premie, met een seintje 7 en 2 dagen vooraf. |
| 15 | tip | Geen app, geen bankkoppeling | Buddy ziet alleen wat jij doorstuurt. |
| 16 | rekening | Gemeente (€58,20, vervalt 16 dec) | Een nota van de gemeente? Doorsturen. |
| 17 | tip | Cadeaus met uitstel? | Stuur de betaalmail door, dan weet je wanneer. |
| 18 | rekening | Internetprovider (€44,00, vervalt 18 dec) | Je factuur, met een seintje vooraf. |
| 19 | tip | Je mailbox blijft van jou | Er is geen koppeling met je mailbox. |
| 20 | rekening | Jaarabonnement (€89,00, vervalt 20 dec) | Verlengt het in januari? Zet de datum klaar. |
| 21 | tip | Januari staat al klaar | Nieuwe premies komen eraan. Stuur ze door als ze er zijn. |
| 22 | rekening | Huur januari (€825, vervalt 3 jan) | Alvast in je agenda, voor je het weet. |
| 23 | tip | Bijna kerst | Stuur nu door wat al binnen is. Dan kun je loslaten. |
| 24 | wens | Fijne feestdagen | Jij viert december. Buddy onthoudt de rest. |

Sticker- en captionideeën voor de Story (optioneel, in de app toevoegen):
- Deurtje 1: vraagsticker "Wat zit er in jouw deurtje?"
- Deurtje 9: pollsticker "Al iets achteraf besteld deze maand?" Ja / Nee
- Deurtje 12: vraagsticker "Hoe vol is jouw agenda?"
- Deurtje 24: emoji-sliderstickers (🍫) en de tekst "Fijne feestdagen"
- Overige dagen: geen sticker nodig, het beeld is af.

## Open controles

- De 21 eigen deurtjes (zie tabel) en de voorbeeldbedragen laten goedkeuren.
- Linksticker of "link in bio" laat naar de gekozen instappagina wijzen (`/start-met-betaalbuddy/` zodra de fixweek klaar is).
- Huisstijl: de koppen staan in Archivo Black en Poppins, het woordmerk en de UI-onderdelen blijven in Space Grotesk en Geist. Zie de open beslissing over de huisstijl.
- De Story-chip onderaan staat op ~1620 px van 1920; de gewone Story-safe-zone onderaan is ~250 px (Reels 330 px), dus dat past.

## Aanpassen en exporteren

- Studio: `npm run dev`, map December-Lijstje, D02-Advent. Alle teksten, bedragen, kleuren en timings staan in `src/december/d02-advent/schema.ts` (`defaultAdventProps` en `defaultStoryDoors`).
- Renderen: `node scripts/render-december.cjs DEC02-Advent-Reel,DEC02-Advent-Feed` of voor de Story-reeks `node scripts/render-december.cjs DEC02-Advent-Story-01,...`. Cover: `node scripts/render-december.cjs DEC02-Advent-Reel@70`.
