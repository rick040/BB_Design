# Idee 1 · "Eén dag gekocht, negen dagen betalen" (Reel)

Campagne "Buddy houdt het lijstje bij" · fase Na Black Friday · TOFU · organisch plus betaald · posten 28 november t/m 3 december.

**In twee zinnen:** op vrijdag 27 november valt een stapel pakketjes op een kalendertegel. De stapel valt uiteen, elk pakketje rolt naar een eigen betaaldag in december; dan stuur je de betaalmails door en krijgt elke betaaldag twee vlaggetjes ervoor (7 en 2 dagen vooraf). Negen is een voorbeeld in beeld, geen statistiek.

| | |
|---|---|
| Composities | `DEC01-Pakketjes-Reel` (9:16, 1080×1920) · `DEC01-Pakketjes-Feed` (4:5, 1080×1350) |
| Lengte | 15,0 s (450 frames, 30 fps), 4 scènes |
| Bestanden | `renders/december/DEC01-Pakketjes-Reel.mp4`, `DEC01-Pakketjes-Feed.mp4`, `DEC01-Pakketjes-Reel-cover.png` (frame 50) |
| Code | `src/december/d01-pakketjes/` (schema in `schema.ts`, scènes in `scenes/`) |
| Ad | Ja (campagnebestand: organisch plus betaald, TOFU) |

## Storyboard en gemeten tijden

Tijden zijn gemeten met `timeline.py` op de scènelengtes (3,4 · 4,4 · 4,8 · 3,6 s, overgang 0,4 s) en de beat-constanten in `scenes/`.

| Scène | Start (s) | Overgang | Wat je ziet |
|---|---|---|---|
| 1 · Gekocht op één dag (ice) | 0,00 | Iris naar scène 2 (3,00 tot 3,40) | Kop "Gekocht op één dag." staat op frame 0. Kalendertegel **vrijdag 27 november**. Pakketjes vallen als stapel op de tegel (onderste laag ligt er al; middelste laag 0,10 s; bovenste laag 0,47 s). Vanaf 2,07 s kantelt de stapel en valt uiteen. |
| 2 · Betalen op negen dagen (blauw) | 3,00 | Slide van rechts (7,00 tot 7,40) | Kop "Betalen op negen dagen." Decemberkalender ploft in beeld (3,13 s). Vanaf 3,67 s rolt om de 0,2 s één pakketje naar zijn betaaldag (9, 11, 14, 17, 21, 23, 25, 28 en 30 december); het laatste landt op 5,80 s. Subregel op 6,07 s. |
| 3 · Doorsturen (ice) | 7,00 | Wipe van onder (11,40 tot 11,80) | Kop "Stuur ze door. Buddy plant ze in." Betaalmail van "Webshop" komt binnen (7,20 s), **Doorsturen** wordt ingedrukt op 8,00 s, de mail vliegt naar Buddy (8,13 s), Buddy slikt hem op 8,73 s. Vanaf 8,93 s ploppen per betaaldag twee vlaggetjes op de kalender: blauw = 7 dagen vooraf, zwart = 2 dagen vooraf. Legenda op 9,00 s, subregel op 10,33 s. |
| 4 · CTA (blauw) | 11,40 | n.v.t. | Kop "Stuur ze door en geniet van je spullen." Knop **activeer buddy** op 11,80 s. Drie nette pakketjes vormen een stapel, Buddy hupt er bovenop (12,07 s) en knippert (12,87 s). Woordmerk 12,93 s, "Geen app. Geen bankkoppeling." 12,67 s, tap op de knop 13,87 s. |

Productmoment in beeld: doorsturen, agenda met vlaggetjes 7 en 2 dagen vooraf. Slotbeeld: Buddy zit op een stapel pakketjes **onder** de knop (de knop staat bovenaan), geen Buddy op de knop.

Overgangen (alleen CSS): iris, slide, wipe.

<!-- copycheck:off -->
## Copyregels voor dit idee
Geen merknamen van webshops of betaalpartijen (afzender is "Webshop"), geen "gratis", geen prijs in de uiting, geen WhatsApp/Telegram, geen "scant je inbox", geen gedachtestreepjes. "Achteraf betalen" komt alleen generiek voor, nooit met een merknaam. Tegen elk getal "negen" geldt: voorbeeld in beeld, geen statistiek.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1,0)

```
<break time="0.3s" /> Eén dag. Een hele stapel pakketjes. <break time="0.6s" /> Maar je betaalt op negen verschillende dagen. <break time="1.0s" /> Stuur de betaalmails door naar Buddy. Zeven en twee dagen vooraf een seintje. <break time="0.2s" /> Geniet van je spullen. Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,3 | Eén dag. Een hele stapel pakketjes. | Stapel valt op kalendertegel vr 27 november (laatste laag 0,47 s), kantelt vanaf 2,07 s |
| 3,2 | Maar je betaalt op negen verschillende dagen. | Iris 3,00 tot 3,40 s, kalender 3,13 s, pakketjes rollen 3,67 tot 5,80 s |
| 7,1 | Stuur de betaalmails door naar Buddy. | Slide 7,00 tot 7,40 s, mail 7,20 s, Doorsturen 8,00 s, mail vliegt 8,13 s |
| 9,2 | Zeven en twee dagen vooraf een seintje. | Buddy slikt 8,73 s, vlaggetjes vanaf 8,93 s, legenda 9,00 s |
| 11,9 | Geniet van je spullen. Activeer Buddy. | Knop 11,80 s, Buddy op de stapel 12,07 s, tap 13,87 s |

**Doellengte mp3:** ~14,1 s (32 woorden). De beeldmomenten zijn gemeten; de spreektijden zijn een schatting (5 lettergrepen per seconde, Speed 1,0). Een andere Speed verschuift alle latere zinnen, want de breaks zijn absoluut. Zet de mp3 in `public/`, vul de naam in bij de prop `music` en zet `musicVolume` op 1.

## Caption (Reels)

```
Eén dag shoppen, een hele december vol betaaldagen. Zo houd je het lijstje bij 📦

Buddy doet dat voor je:
📩 Stuur elke betaalmail door naar je eigen Buddy-adres
🔍 Buddy haalt er bedrag, vervaldatum en betaallink uit
⏰ Seintje 7 en 2 dagen vooraf
📅 De datum staat ook in je agenda

Geen app. Geen bankkoppeling.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #blackfriday #achterafbetalen #rekeningen #opjezelfwonen
```

## Ads Manager

- **Primaire tekst (≤125):** Eén dag shoppen, negen dagen betalen. Stuur de betaalmails door en Buddy geeft je seintjes.
- **Kop (≤40):** Stuur ze door en geniet van je spullen.
- **Knop:** Aanmelden
- **Poort voor betaald:** pas achter budget als de Reel organisch 8.000+ weergaven haalt en meer dan 30 % 3 seconden kijkt (groeiplan).

## Open controles
- Naar welke pagina "activeer buddy", "link in bio" en de advertentielink wijzen: `/start-met-betaalbuddy/` uit het campagnebestand, of de landingspagina "achteraf betalen" (die noemt nog prijzen en een terugbetaalgarantie).
- Hoe de afzender in de mail heet is generiek ("Webshop"); niets aan te passen, wel in het schema als je een andere generieke afzender wilt.
- Vlaggetjes worden bij 7 en 2 dagen vooraf getoond. Kies je andere betaaldagen in het schema, houd dan elke dag minstens 8 en maximaal de laatste dag van de maand aan.

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map December-Lijstje → D01-Pakketjes, composities `DEC01-Pakketjes-Reel` en `-Feed`. Alle teksten, kleuren, scènelengtes en de negen betaaldagen staan in de Props.
- **Blijvend:** defaults in `src/december/d01-pakketjes/schema.ts` (`defaultPakketjesProps`).
- **Exporteren:** `node scripts/render-december.cjs DEC01-Pakketjes-Reel,DEC01-Pakketjes-Feed`; cover: `node scripts/render-december.cjs DEC01-Pakketjes-Reel@50`.
