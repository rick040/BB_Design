# Idee 15 · Aftellen naar 2027 (Reel)

Campagne "Buddy houdt het lijstje bij", fase Januari klaarzetten. Hoek: het aftellen van oud en nieuw, maar bij elk getal flitst een rekening langs die Buddy al heeft ingepland. Bij nul geen vuurwerk maar een rustige januari-agenda met vlaggetjes. Slot: "Dit jaar knalt alleen het vuurwerk."

Posten: 30 en 31 december. Kanaal: alleen organisch (TOFU). Er is dus geen Ads Manager-tekst; wil je hem toch als ad draaien, pas dan eerst de poort voor betaald toe (8.000+ weergaven en meer dan 30 % kijkt 3 seconden).

## Composities

| Id | Formaat | Gebruik | Lengte |
|---|---|---|---|
| `DEC15-Aftellen2027-Reel` | 1080×1920 (9:16) | Reel, Story | 13,4 s (402 frames) |
| `DEC15-Aftellen2027-Feed` | 1080×1350 (4:5) | Feed | 13,4 s |

Bestanden: `renders/december/DEC15-Aftellen2027-Reel.mp4`, `DEC15-Aftellen2027-Feed.mp4` en `DEC15-Aftellen2027-Reel-cover.png` (frame 8, de 10 met de eerste rekening).

## Scènes en gemeten tijden (30 fps, overgang 0,4 s)

| # | Scène | Start (s) | Eind (s) | Frames | Kleur | Overgang erin |
|---|---|---|---|---|---|---|
| 1 | Aftellen 10 tot 0 | 0,00 | 5,00 | 0 tot 150 | donker (#111827) | n.v.t. |
| 2 | Rustige januari | 4,60 | 9,20 | 138 tot 276 | licht | iris (de nul gaat open) |
| 3 | Dit jaar knalt alleen het vuurwerk (CTA) | 8,80 | 13,40 | 264 tot 402 | blauw | clock wipe |

| Tijd (s) | Beeld |
|---|---|
| 0,00 | Kop "Aftellen naar 2027" en een groot getal 10 |
| 0,10 | Eerste rekening schuift binnen: Huur, met seintje 7 en 2 |
| 0,43 tot 3,90 | Elke 0,43 s een nieuw getal (9 tot 1), elk met een andere rekening (zie tabel `bills` in het schema) |
| 4,33 | De nul, geen rekening |
| 4,60 | Een cirkel groeit uit het midden: januari 2027 als rustige agenda |
| 5,27 / 6,13 / 7,00 / 7,87 | Huur (4 jan), Zorgpremie (14 jan), Webshop (22 jan), Abonnement (30 jan) worden gemarkeerd; 7 en 2 dagen eerder komt een vlaggetje |
| 6,93 | Subregel "Elke rekening staat er al, met seintjes 7 en 2 dagen vooraf." |
| 9,27 / 9,73 / 10,20 | Drie vuurwerkknallen boven Buddy, die rustig blijft (ogen dicht) |
| 10,67 | Knop "activeer buddy" |
| 12,13 | Tik op de knop |

Slotbeeld: Buddy kijkt rustig naar het vuurwerk (niet op de knop). Het getal 10 staat op #111827 zoals het idee vraagt. Alles is zonder geluid te volgen.

## Voice-over (ElevenLabs Multilingual v2, Speed 0,9)

Beelden zijn gemeten, spreektijden zijn een schatting (4,5 lettergrepen per seconde). Cijfers staan uitgeschreven.

```
Tien, negen, acht. Elke rekening staat al in je agenda. <break time="0.2s" /> Bij nul geen knal. Gewoon een rustige agenda. <break time="0.7s" /> Dit jaar knalt alleen het vuurwerk. <break time="0.3s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Tien, negen, acht. | Getal 10, 9, 8 flitsen langs, rekeningen Huur, Zorgpremie, Webshop achteraf |
| 1,6 | Elke rekening staat al in je agenda. | Getallen 7 tot 1, een rekening per getal met seintje 7 en 2 |
| 4,8 | Bij nul geen knal. | De nul (4,33 s), de cirkel opent de januari-agenda (4,6 s) |
| 6,0 | Gewoon een rustige agenda. | Vier rekeningen gemarkeerd, vlaggetjes 7 en 2 (5,27 s tot 8,2 s) |
| 9,0 | Dit jaar knalt alleen het vuurwerk. | Slotkop, drie knallen van vuurwerk (9,27 / 9,73 / 10,20 s) |
| 11,4 | Activeer Buddy. | Knop (10,67 s) en woordmerk (11,27 s), tik op 12,13 s |

Doellengte mp3: ongeveer 12,5 s (de video duurt 13,4 s). Zet de mp3 in `public/` en de bestandsnaam in de prop `music` (`musicVolume` op 1).

## Instagram-caption (Reel)

```
Tien, negen, acht… 🎆 Bij nul geen knal, maar een rustige januari.

Buddy houdt het lijstje bij, ook in het nieuwe jaar. 🗓️
📩 Stuur je rekeningen door naar je eigen Buddy-adres
🚩 Je krijgt een seintje 7 en 2 dagen vooraf
✅ Zo staat januari al klaar voor je het weet

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #oudennieuw #2027 #rekeningen #geldzaken
```

## Open controles

- Link in bio moet naar de gekozen instappagina wijzen (`/start-met-betaalbuddy/`).
- De rekeningen in het aftellen en de januari-agenda zijn voorbeelden (generieke afzenders, geen bedragen). Geen merknamen, geen cijfers als statistiek.
- Het aftellen "10 tot 0" is het gebruikelijke aftellen naar middernacht; er wordt geen datum beloofd die niet klopt.

## Aanpassen en exporteren

- Studio: `npm run dev`, map December-Lijstje, D15-Aftellen-2027. Teksten, de tien rekeningen, de vier januari-items, kleuren en timings staan in `src/december/d15-2027/schema.ts` (`defaultAftellenProps`).
- Het raster klopt voor januari 2027 (1 januari is een vrijdag). Wijzig je de maand, pas dan `FIRST_JAN` aan in `scenes/JanuaryScene.tsx`.
- Renderen: `node scripts/render-december.cjs DEC15-Aftellen2027-Reel,DEC15-Aftellen2027-Feed`; cover: `node scripts/render-december.cjs DEC15-Aftellen2027-Reel@8`.
