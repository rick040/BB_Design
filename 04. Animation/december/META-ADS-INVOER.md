# Meta Ads Manager: invoerlijst per campagne en advertentie

Bij `META-ADS-STAPPENPLAN.md` (de volgorde en uitleg) en `META-ADS-PLAN.md` (het waarom). Dit bestand is om naast Ads Manager te leggen: per veld wat je typt of kiest. Teksten kopieer je letterlijk.

De uploadmap `META-UPLOAD-december.zip` heeft per advertentie een map met de bestanden en een `TEKST.txt` met dezelfde teksten als hieronder.

Meta noemt dingen soms net anders dan hier. Staat er een ander woord, zoek dan het veld met dezelfde functie.

## Eén keer: instellingen die voor alles gelden

| Waar | Instelling |
|---|---|
| Advertentieaccount | Valuta EUR, tijdzone Amsterdam, uitgavenlimiet gelijk aan de pot |
| Elke campagne | Meta-aanbevelingen niet automatisch toepassen |
| Elke advertentie | **Advantage+ creative-verbeteringen: alles uit**, vooral tekstverbeteringen en overlays |
| Elke advertentie | Website-URL en URL-parameters (hieronder), Pixel aan |
| Nooit | 'Bericht promoten' (Boost), interesses toevoegen, een draaiende advertentie bewerken |

**Website-URL (voor alle advertenties):**
```
https://betaalbuddy.nl/start-met-betaalbuddy/
```
**URL-parameters (voor alle advertenties, plak dit in het veld 'URL-parameters' onder 'Opties weergeven'):**
```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}
```

## Campagne 1: Bereik (Verkeer)

| Veld in Ads Manager | Invullen |
|---|---|
| Campagnenaam | `META_Traffic_Broad-NL-21-34_Standard349_2026Dec` |
| Campagnedoel | **Verkeer** |
| Speciale advertentiecategorieën | Waarschijnlijk niets aanvinken (zie het plan, 4.1) |
| Advantage-campagnebudget | **Aan** |
| Budgettype | **Dagbudget** |
| Dagbudget | Week 1 (30 nov t/m 6 dec): **€10,40**. Daarna per week aanpassen, zie 'Dagbudget per week' hieronder |
| Biedstrategie | **Hoogste volume** (geen kostenlimiet) |

**Advertentieset** (binnen campagne 1)

| Veld | Invullen |
|---|---|
| Naam | `AS_Broad-NL-21-34_Auto` |
| Conversielocatie | **Website** |
| Prestatiedoel | **Aantal weergaven van de landingspagina maximaliseren** |
| Dataset/Pixel | Je Betaalbuddy-Pixel |
| Dynamische creatieve variatie | Uit |
| Startdatum | **30 november 2026**, 00:00. Einddatum: leeg (je stopt zelf, zie het schema) |
| Locaties | **Nederland** |
| Leeftijd | **21 tot 34** |
| Geslacht | Alle |
| Detailgerichte targeting | **Leeg laten** |
| Aangepaste doelgroepen | **Uitsluiten:** `Kopers-180d` |
| Plaatsingen | **Advantage+ plaatsingen** aan, daarna **Audience Network** en **Messenger** uitzetten |

## Campagne 2: Retargeting (Verkoop)

Maak deze pas als de lijsten uit het stappenplan (deel 4) groter zijn dan 100 mensen. Start: donderdag 3 december.

| Veld | Invullen |
|---|---|
| Campagnenaam | `META_Sales_RT-30d_Standard349_2026Dec` |
| Campagnedoel | **Verkoop** |
| Advantage-campagnebudget | **Aan**, dagbudget week 1 (3 t/m 6 dec): **€3,50** |
| Advertentieset-naam | `AS_RT-30d_Auto` |
| Conversielocatie | Website |
| Conversiegebeurtenis | **InitiateCheckout** (Start aanmelding). Later `Purchase`, zie plan sectie 8 |
| Doelgroep | Aangepaste doelgroepen: `Site-30d`, `Start-30d`, `IG-90d`, `Video-50`. **Uitsluiten:** `Kopers-180d` |
| Locaties | Nederland. Geen leeftijd, geen interesses |
| Plaatsingen | Advantage+ plaatsingen, Audience Network en Messenger uit |

## Campagne 3: Doorverwijzen (alleen bij 20+ klanten)

Besluit op maandag 14 december. Is het antwoord nee, dan maak je deze niet aan.

| Veld | Invullen |
|---|---|
| Campagnenaam | `META_Sales_Referral_2026Dec` |
| Campagnedoel / conversie | Zoals campagne 2 |
| Dagbudget | ±€6,40 (15 t/m 19 dec) |
| Doelgroep | `IG-90d` en `Video-50`. **Uitsluiten:** `Kopers-180d` |

## Dagbudget per week (campagnebudget aanpassen elke maandag)

| Week | Campagne 1 Bereik | Campagne 2 Retargeting |
|---|---|---|
| 30 nov t/m 6 dec | €10,40 | €3,50 (vanaf 3 dec) |
| 7 t/m 13 dec | €9,66 | €5,00 |
| 14 t/m 19 dec | €9,10 | €8,17 |
| 20 t/m 25 dec | €3,47 (t/m 22 dec) | €3,50 |
| 26 dec t/m 4 jan | €5,46 | €2,10 |

Dit zijn de bedragen bij een pot van €400 en referral dicht. Verandert de pot, dan staan de nieuwe bedragen in tab 'Kalender' van `META-ADS-PLANNING.xlsx`.

## Per advertentie

Voor elke advertentie in het scherm 'Advertentie' (derde scherm):

1. **Identiteit:** je Pagina en je Instagram-account.
2. **Advertentie-opzet:** Maak advertentie. Formaat: enkele afbeelding of video, of Carrousel (A6).
3. **Media:** upload de bestanden uit de uploadmap. Bij video's twee bestanden: het `Reel`-bestand (9:16) voor Reels en Stories, het `Feed`-bestand (4:5) voor de feed. Gebruik 'Plaatsingen aanpassen' (of 'Assets per plaatsing') als Meta dat aanbiedt.
4. Plak **Primaire tekst**, **Kop** en kies de **Knop**.
5. **Website-URL** en **URL-parameters** zoals bovenaan.
6. Controleer de **voorbeelden** rechts voor Instagram-feed, Reels en Stories.

### A1 · 1 · Eén dag gekocht, negen dagen betalen

| Veld | Invullen |
|---|---|
| Campagne | `META_Traffic_Broad-NL-21-34_Standard349_2026Dec` |
| Naam advertentie | `DEC01-Pakketjes-Reel` |
| Bestanden | `DEC01-Pakketjes-Reel.mp4`, `DEC01-Pakketjes-Feed.mp4` |
| Primaire tekst | Eén dag shoppen, negen dagen betalen. Stuur de betaalmails door en Buddy geeft je seintjes. |
| Kop | Stuur ze door en geniet van je spullen. |
| Knop | Aanmelden |
| Aanmaken op | di 24 nov |
| Live zetten op | ma 30 nov |
| Stoppen op | zo 6 dec |

Eerste advertentie. Begin hiermee.

### A2 · 2 · De adventskalender (hero)

| Veld | Invullen |
|---|---|
| Campagne | `META_Traffic_Broad-NL-21-34_Standard349_2026Dec` |
| Naam advertentie | `DEC02-Advent-Reel` |
| Bestanden | `DEC02-Advent-Reel.mp4`, `DEC02-Advent-Feed.mp4` |
| Extra bestanden (later) | `DEC02-Advent-Story-03.png`, `DEC02-Advent-Story-09.png`, `DEC02-Advent-Story-14.png` |
| Primaire tekst | Niet elk deurtje is chocola. Buddy zet je rekeningen in je agenda, met een seintje 7 en 2 dagen vooraf. |
| Kop | Buddy houdt het lijstje bij |
| Knop | Aanmelden |
| Aanmaken op | di 24 nov |
| Live zetten op | wo 2 dec |
| Stoppen op | wo 23 dec 23:59 |

De drie Story-beelden (Extra bestanden) zijn voor de verversing op 16 dec: dan maak je daarvan nieuwe advertenties, nooit de draaiende aanpassen.

### A3 · 3 · Sint heeft zijn boek

| Veld | Invullen |
|---|---|
| Campagne | `META_Traffic_Broad-NL-21-34_Standard349_2026Dec` |
| Naam advertentie | `DEC03-Sint-Reel` |
| Bestanden | `DEC03-Sint-Reel.mp4`, `DEC03-Sint-Feed.mp4` |
| Primaire tekst | Sint heeft zijn grote boek. Jij hebt Buddy: stuur een rekening door en hij zet de datum in je agenda. |
| Kop | Jij hebt Buddy. |
| Knop | Aanmelden |
| Aanmaken op | di 24 nov |
| Live zetten op | wo 2 dec |
| Stoppen op | za 5 dec 23:59 |

Korte vlucht tot Pakjesavond.

### A4 · 7 · De volle decemberagenda

| Veld | Invullen |
|---|---|
| Campagne | `META_Traffic_Broad-NL-21-34_Standard349_2026Dec` |
| Naam advertentie | `DEC07-Agenda-Reel` |
| Bestanden | `DEC07-Agenda-Reel.mp4`, `DEC07-Agenda-Feed.mp4` |
| Primaire tekst | Je agenda zit vol. Stuur je rekening door: Buddy zet de datum erin, met seintje 7 en 2 dagen vooraf. |
| Kop | Vol? Buddy maakt nog plek. |
| Knop | Aanmelden |
| Aanmaken op | do 10 dec |
| Live zetten op | vr 11 dec |
| Stoppen op | za 19 dec |

Pas aanzetten na 24 uur organische proef (post 10 dec).

### A5 · 10 · Kersttafel-bingo (static)

| Veld | Invullen |
|---|---|
| Campagne | `META_Traffic_Broad-NL-21-34_Standard349_2026Dec` |
| Naam advertentie | `DEC10-Bingo` |
| Bestanden | `DEC10-Bingo.png` |
| Primaire tekst | Kersttafel-bingo. Het middenvak vult Buddy voor je in: "Ja, staat in mijn agenda." |
| Kop | Kersttafel-bingo |
| Knop | Meer informatie |
| Aanmaken op | do 17 dec |
| Live zetten op | vr 18 dec |
| Stoppen op | di 22 dec 23:59 |

Alleen een 4:5-beeld. Controleer het voorbeeld voor Stories en Reels (zie 'Als het beeld wordt bijgesneden').

### A6 · 13 · Januari staat al klaar (carrousel)

| Veld | Invullen |
|---|---|
| Campagne | `META_Traffic_Broad-NL-21-34_Standard349_2026Dec` |
| Naam advertentie | `DEC13-Januari-Carrousel` |
| Bestanden | `DEC13-Januari-1.png`, `DEC13-Januari-2.png`, `DEC13-Januari-3.png`, `DEC13-Januari-4.png`, `DEC13-Januari-5.png`, `DEC13-Januari-6.png` |
| Primaire tekst | Zorgpremie, termijnen, jaarabonnementen: in januari komt er veel tegelijk. Zet je rekeningen nu klaar. |
| Kop | Januari staat al klaar |
| Knop | Aanmelden |
| Aanmaken op | vr 25 dec |
| Live zetten op | za 26 dec |
| Stoppen op | ma 4 jan |

Carrousel van 6 kaarten, in volgorde 1 t/m 6. Kaartkoppen: 1 Januari staat al klaar, 2 Je nieuwe zorgpremie, 3 Termijnen uit december, 4 Jaarabonnementen, 5 Check je eigen post, 6 Stuur door, Buddy onthoudt. Kaarten zijn 4:5; accepteert jouw account alleen 1:1, zeg het me.

### A7 · 16 · Een voornemen in 30 seconden

| Veld | Invullen |
|---|---|
| Campagne | `META_Traffic_Broad-NL-21-34_Standard349_2026Dec` |
| Naam advertentie | `DEC16-Voornemen-Reel` |
| Bestanden | `DEC16-Voornemen-Reel.mp4`, `DEC16-Voornemen-Feed.mp4` |
| Primaire tekst | Sporten 3 %, eerder naar bed 0 %. Eén mail doorsturen haal je wél in 30 seconden: rekeningen op tijd. |
| Kop | Het voornemen van 30 seconden |
| Knop | Aanmelden |
| Aanmaken op | do 31 dec |
| Live zetten op | za 2 jan |
| Stoppen op | ma 4 jan |

Pas aanzetten als de 30-secondenclaim is gecontroleerd.

### B1 · 6 · Brief van de maker (static)

| Veld | Invullen |
|---|---|
| Campagne | `META_Sales_RT-30d_Standard349_2026Dec` |
| Naam advertentie | `DEC06-Brief` |
| Bestanden | `DEC06-Brief.png` |
| Primaire tekst | Ik ben Rick, maker van Betaalbuddy. Geen bankkoppeling, geen inbox-toegang. Jij stuurt door, Buddy let op de datum. |
| Kop | Een brief van de maker |
| Knop | Meer informatie |
| Aanmaken op | di 24 nov |
| Live zetten op | do 3 dec |
| Stoppen op | do 31 dec |

Alleen voor retargeting (campagne 2).

### B2 · 9 · €3,49 rust (static)

| Veld | Invullen |
|---|---|
| Campagne | `META_Sales_RT-30d_Standard349_2026Dec` |
| Naam advertentie | `DEC09-Rust` |
| Bestanden | `DEC09-Rust.png` |
| Primaire tekst | Standard kost €3,49 per maand. Stuur een rekening door en Buddy zet het seintje in je agenda. |
| Kop | Rust in december, €3,49 |
| Knop | Meer informatie |
| Aanmaken op | ma 7 dec |
| Live zetten op | di 8 dec |
| Stoppen op | do 31 dec |

Alleen voor retargeting. Geen '30 dagen geld terug' in de tekst.

### R1 · 12 · Vriend mee de feestdagen door

| Veld | Invullen |
|---|---|
| Campagne | `META_Sales_Referral_2026Dec` |
| Naam advertentie | `DEC12-Vriend-Reel` |
| Bestanden | `DEC12-Vriend-Reel.mp4`, `DEC12-Vriend-Feed.mp4` |
| Primaire tekst | Die ene vriend onder de enveloppen? Stuur hem je link. Wordt hij lid, dan krijg jij een maand gratis. |
| Kop | Vriend mee de feestdagen door |
| Knop | Aanmelden |
| Aanmaken op | ma 14 dec |
| Live zetten op | di 15 dec |
| Stoppen op | za 19 dec |

Alleen als je 20 of meer klanten hebt. Zet de voorwaarden van de werf-aanbieding eerst op de instappagina.

## Aanmaken, goedkeuren en live zetten

Meta keurt elke advertentie eerst goed. Dat duurt meestal uren, soms een dag.

**De eerste drie bereik-advertenties en B1 (week van 24 november)**
1. Bouw campagne 1 met de advertentieset (startdatum 30 november) en maak A1, A2 en A3 aan. Laat ze **Aan** staan en publiceer.
2. Meta laat ze beoordelen. Zodra ze goedgekeurd zijn, zet je **A2 en A3 uit**. Een advertentie die al eens goedgekeurd is, hoeft niet opnieuw beoordeeld te worden als je hem later weer aanzet.
3. Op woensdag 2 december zet je A2 en A3 weer **Aan** (vroeg in de ochtend).
4. Maak campagne 2 aan met B1, startdatum 3 december, en zet B2 erbij op maandag 7 december (uit laten tot dinsdag 8 december).

**Latere advertenties (A4 tot en met A7, B2, R1)**
Maak ze de dag vóór de lanceerdag aan en zet ze **Uit**. Op de lanceerdag vroeg in de ochtend zet je ze **Aan**. De beoordeling start dan pas en duurt meestal uren. Zo verlies je hooguit een halve dag.

**Stoppen:** zet de advertentie **Uit** op de datum uit de tabel. Pauzeer nooit zonder dat er een vervanger klaarstaat (zie het plan, sectie 8).

## Als het beeld wordt bijgesneden

- Twee video-bestanden per advertentie (9:16 en 4:5) vangen dit voor de Reels op. Zie je toch afgesneden tekst: kies in de plaatsingsinstellingen van die ene advertentie die plaatsing weg.
- Statics (A5, B1, B2) zijn 4:5 en hebben geen 9:16-versie. Bij Stories en Reels kan Meta bijsnijden. Zie je afgesneden tekst in het voorbeeld, haal dan Stories en Reels weg voor die ene advertentie, of zeg het me: dan render ik een 9:16-versie.
- De Story-beelden van idee 2 (1080×1920) zijn voor Stories en Reels. Gebruik ze niet in de feed.
- Carrousel A6 is 4:5. Accepteert jouw account alleen 1:1, zeg het me, dan render ik die kaarten opnieuw.

## Veelgestelde vragen

**Moet er geluid onder de video's?** Nee. De Reels zijn gemaakt om zonder geluid te werken. De voice-over staat in de documenten van elk idee en is nog niet ingesproken. Dat kan later.

**Wat als Meta een advertentie afkeurt?** Lees de reden in Ads Manager. Vraag eventueel beroep aan en leg uit dat het product rekeningen onthoudt en geen krediet geeft. Stuur me de tekst, dan help ik met de formulering.

**Wanneer begin ik?** Alles in dit bestand pas na poort G0 (zie het stappenplan, deel 3). Eerder mag je alles klaarzetten, maar niet aanzetten.
