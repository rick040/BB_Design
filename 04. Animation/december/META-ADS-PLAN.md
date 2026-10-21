# Meta-advertenties decembercampagne: setup en schema

Opgesteld op 20 oktober 2026 voor "Buddy houdt het lijstje bij" (23 november t/m 4 januari). Bij dit plan hoort `META-ADS-PLANNING.xlsx` (zelfde map): daar staan het dag-voor-dag schema met bedragen, de advertentielijst met beslisregels, het meetplan, de rekensom en de preflight-checklist. Verandert de pot, zet dan alleen cel B4 in 'Instellingen' om.

## 0. Kort

1. **Dit is een leerbudget, geen groeimotor.** Bij Standard €3,49 (€2,88 excl. btw) mag een betalende abonnee ongeveer €15 kosten voor 6 maanden terugverdientijd, en €30 voor 12 maanden. Het masterplan rekent met ±13 abonnees uit €508: dat is ±€39 per abonnee. Zonder retentiecijfers rechtvaardigt dat de uitgaven alleen als de pot tegelijk de funnel leert kennen.
2. **De funnel moet eerst werken.** 20 aanmeldingen gaven 0 betalingen, 32 % van het verkeer komt via de Instagram-browser en Clarity zag daar een JavaScript-fout. Geen euro uitgeven voordat een echte betaling via een echte advertentie in die browser is gelukt (poort G0, sectie 3).
3. **Eén pot, drie lagen, geen versnippering.** Bereik 65 %, retargeting 27 %, doorverwijzen 8 % en alleen als er 20 klanten zijn. Dat wijkt af van het campagnebestand (60/25/15); de reden staat in sectie 5.
4. **Maximaal 3 bereik-advertenties tegelijk.** Met ±€10 per dag kan Meta er niet meer eerlijk beoordelen (rekensom in sectie 8). De 10 uitingen draaien dus in golven, niet allemaal tegelijk.
5. **Optimaliseren op landingspaginaweergave voor bereik, op Start aanmelding voor retargeting.** Aankopen zijn te zeldzaam voor het leerproces van Meta (de drempel is ±50 per week; deze pot haalt er in totaal tien tot twintig).
6. **Eerst organisch laten bewijzen, dan betaald.** Het account heeft 14 volgers, dus de poort uit het campagnebestand (8.000 weergaven) is zwak. Daarom geldt ook: een betaalde hooktest op dag 3 met 30 % 3-seconden-kijkers mag de poort vervangen.
7. **Beslissen op vaste dagen.** Maandag beslissen, woensdag lanceren, vrijdag opschalen of terugdraaien (op feestdagen donderdag). Checkpoints zondag 6 en zaterdag 19 december.
8. **Wat ik niet weet staat in sectie 1.** Zo verbergt geen aanname zich in een cijfer.

## 1. Wat dit plan aanneemt

| Feit | Bron | Zekerheid |
|---|---|---|
| Doel: 35 betalende abonnees op 19 december, 27 op 6 december, 12 op 15 november | Masterplan in de changelog van 19 okt | Gerapporteerd |
| Meta-budget €508 voor drie haken (12 nov, Black Friday, januari) | Masterplan | Gerapporteerd |
| Standard €3,49 per maand, vooraf betalen, geen proefperiode | Campagnebestand, merkbestand | Gerapporteerd |
| GA4 21 sep t/m 18 okt: 58 gebruikers, 0 aankopen. Clarity: 20 starts, 0 betalingen, 32 % Instagram-browser, 23 % bots, 14 % dode klikken | Changelog | Gerapporteerd |
| Instagram heeft 14 volgers | Changelog | Gerapporteerd |
| Homepage belooft nog 7 dagen gratis en WhatsApp of Telegram; `/start-met-betaalbuddy/` draait v4 met "30 dagen niet blij? Geld terug" | Changelog | Gerapporteerd, daarna mogelijk aangepast |
| Pot december €400 (€508 min €108 voor de test van 12 nov) | **Mijn aanname** | Aanname |
| Brutomarge 85 % | **Mijn aanname** (Mollie-kosten, hosting) | Aanname |
| Checkout naar betaald 35 % | **Mijn aanname** | Aanname |
| Kosten per Start aanmelding doel €15 | Masterplan ("minstens 1 checkout per €15") | Gerapporteerd |
| Pixel- en CAPI-status, conversiegeschiedenis, accountgeschiedenis van het advertentieaccount | Niet gezien | **Ontbreekt** |
| Werkelijke besteding tot nu toe, aantal klanten, retentie, Mollie-transactiekosten, consent-opzet | Niet gezien | **Ontbreekt** |

Omdat de aankoopgeschiedenis ontbreekt, behandel ik het account als koude start voor conversies. Dat betekent: geen benchmarks uit andere accounts als maatstaf, kleine omkeerbare stappen, en cijfers die als gevoeligheidscase zijn gelabeld.

## 2. De rekensom

Opbrengst per maand excl. btw = €3,49 / 1,21 = **€2,88**. Marge 85 % (aanname) = **€2,45 per maand**.

| Terugverdientijd | Max. kosten per betaalde abonnee |
|---|---|
| 6 maanden | €14,70 |
| 12 maanden | €29,40 |
| Masterplan (€400 / 13 abonnees) | ±€31 = 12,6 maanden |
| Eén maand voor de werver bij een referral | €2,88 = 1,2 maanden |

Wat dat betekent:

- **Referral is het goedkoopste kanaal.** Eén werf-maand kost €2,88 aan opbrengst, betaald verkeer minstens tien keer zoveel. Het product moet dus een zichtbare "stuur door naar een vriend"-route hebben voordat er veel in betaald verkeer gaat.
- **De sensitiviteitstabel** (tab 'Rekensom') laat zien wat kosten per echte bezoeker en conversie van bezoeker naar betaald samen doen. Voorbeeld: €0,80 per bezoeker en 3 % conversie geeft ±€27 per abonnee (±11 maanden terugverdientijd) en 15 abonnees uit €400. Bij 1 % conversie is het €80 per abonnee en 5 abonnees.
- **Aanbeveling:** noem de eerste €400 een funnel-test met een hard doel (kosten per abonnee en conversiecijfers leren), niet een groeikanaal. Pas na twee weken echte cijfers bepalen of er een tweede pot komt.

## 3. Poort: eerst de funnel, dan het geld

Eén rode regel betekent geen uitgaven. De volledige lijst met eigenaar en deadline staat in tab 'Preflight'.

**G0, voor 11 november (vóór de zorgpremie-test van 12 nov)**

1. Een echte iDEAL-betaling vanuit een echte advertentie-preview in de Instagram-browser, op iOS én Android, tot en met het bevestigde abonnement. Dit is de belangrijkste test: Clarity zag 20 starts en 0 betalingen en een postMessage-fout in die browser. Ook de terugkeer vanuit de bank-app moet in de Instagram-browser landen.
2. `Purchase` via de Conversions API vanuit de Mollie-webhook (status betaald), met `event_id` gelijk aan het betalings-ID, gehasht e-mailadres en `fbp`/`fbc` uit de aanmelding (meegegeven als Mollie-metadata). Geen browser-redirect met `?bb_status=paid` als enige bewijs: die is te spoofen en te herladen.
3. `ViewContent` en `InitiateCheckout` op de instappagina, op het juiste moment.
4. Domein geverifieerd, cookiebanner die de Pixel pas na toestemming laadt zonder de betaling te blokkeren.
5. GA4: intern verkeer en bots eruit, anders zijn de toetsen uit het masterplan niet te lezen.
6. Instappagina zegt hetzelfde als de advertentie: geen "gratis", geen 7 dagen proef, geen WhatsApp of Telegram. Standard €3,49.

**G1, 23 t/m 26 november (specifiek voor december)**

Audiences aangemaakt (≥100 mensen per lijst), accountlimiet gelijk aan de pot, adverteerdersverificatie voor de EU, alle advertenties gepauzeerd klaargezet en goedgekeurd. Op vrijdag 27 november (Black Friday) staat een tweede Go/No-go.

**Als G0 faalt:** niets uitgeven en de december-ads schuiven op. Dat kost minder dan €400 uitgeven aan klikken die niet kunnen betalen.

## 4. Meta-setup

### 4.1 Account en beleid

- **Bedrijfsaccount:** Pagina en Instagram-professioneel account gekoppeld aan het advertentieaccount, valuta EUR, tijdzone Europe/Amsterdam, **uitgavenlimiet gelijk aan de pot**.
- **EU-verificatie:** vul handelaarsgegevens en "Betaald door" en begunstigde in. Controleer in Ads Manager of er nog iets openstaat; zonder kan levering stoppen.
- **Speciale categorie:** Betaalbuddy leent niet, betaalt niet en geeft geen financieel advies, dus waarschijnlijk geen "financiële producten en diensten". Woorden als "rekeningen", "betalen" en "achteraf betalen" kunnen toch de classificatie raken. Leg de keuze vast en houd de beroepsroute klaar.
- **Persoonlijke kenmerken:** nooit iemands geldsituatie aanspreken ("Heb jij schulden?"). Alle uitingen beschrijven situaties of gebruiken de ik-vorm.
- **Aftellen** alleen naar echte data (31 december, Pakjesavond 5 december).
- **Standaardverbeteringen (Advantage+ creative):** tekst en overlays uit. De copyregels zijn strak en Meta mag niets herschrijven.

### 4.2 Pixel en Conversions API

| Gebeurtenis | Wanneer | Waar vandaan | Gebruik |
|---|---|---|---|
| `PageView` | Elke pagina na toestemming | Browser | Basis |
| `ViewContent` | Instappagina bekeken | Browser | Retargeting-doelgroep |
| `InitiateCheckout` ("Start aanmelding") | Aanmeldformulier gestart | Browser | **Optimalisatie** voor retargeting en maat voor kosten |
| `Purchase` | Betaling bevestigd (Mollie: betaald) | **Server (CAPI)**, ontdubbeld met browser via `event_id` | Waarheid voor conversies en uitsluiting van kopers |

Waarde 3,49 EUR (of 2,88 excl. btw: kies er één en houd die aan). Controleer in Events Manager de matchkwaliteit van `Purchase` en of de gebeurtenissen na domeinverificatie de juiste prioriteit hebben.

### 4.3 Doelgroepen

| Doelgroep | Bron | Gebruik |
|---|---|---|
| Sitebezoekers 30 dagen | Pixel | Retargeting |
| Instappagina bekeken 30 dagen | Pixel (`ViewContent`) | Retargeting |
| Start aanmelding 30 dagen | Pixel | Retargeting (warm) |
| **Kopers 180 dagen** | Pixel en CAPI (`Purchase`) | **Uitsluiten overal** |
| Instagram-interactie 90 dagen | Instagram | Retargeting en referral |
| Video-kijkers 50 % of ThruPlay | Advertenties en Reels | Retargeting |

Maak ze aan vóór de eerste uitgave en controleer de grootte (≥100). Een lookalike vraagt een bron van minstens 100 mensen uit één land; bij minder dan 20 klanten kan dat niet, dus dit plan gebruikt er geen. Bereik gaat breed.

### 4.4 UTM en naamgeving

Bestemming: `https://betaalbuddy.nl/start-met-betaalbuddy/` voor alle uitingen (één pagina, zoals het campagnebestand zegt).

```
?utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}
```

Naamgeving: `[Platform]_[Doel]_[Doelgroep]_[Aanbod]_[Datum]`, en de advertentienaam is gelijk aan de compositie-ID uit `renders/december/`, zodat `utm_content` direct naar het bestand wijst.

### 4.5 Campagnes

| | **C1 Bereik** | **C2 Retargeting** | **C3 Doorverwijzen** |
|---|---|---|---|
| Naam | `META_Traffic_Broad-NL-21-34_Standard349_2026Dec` | `META_Sales_RT-30d_Standard349_2026Dec` | `META_Sales_Referral_2026Dec` |
| Doel | Verkeer | Verkoop | Verkoop |
| Optimalisatie | Landingspaginaweergaven | Start aanmelding (zie 8) | Start aanmelding |
| Budgettype | Campagnebudget (CBO), één advertentieset | CBO, één advertentieset | CBO, één advertentieset |
| Doelgroep | Nederland, 21 t/m 34, breed. Kopers uitsluiten | Sitebezoekers, instappagina, interactie, video-kijkers; kopers uitsluiten | Volgers, klanten en betrokken kijkers; kopers uitsluiten |
| Plaatsingen | Automatisch, **Audience Network en Messenger uit** | Idem | Idem |
| Advertenties | A1, A2, A3, A4, A5, A6, A7 (max 3 tegelijk) | B1, B2 | R1 (alleen bij 20+ klanten) |
| Biedstrategie | Hoogste volume, geen kostenlimiet de eerste 14 dagen | Idem | Idem |
| Attributie | 7 dagen klik | 7 dagen klik | 7 dagen klik |

Waarom Verkeer voor bereik: de aankoop (±10 tot 20 in totaal) en zelfs Start aanmelding (±1 per €15, dus ±25 in totaal) halen de ±50 per week niet waarmee Meta uit de leerfase komt. Landingspaginaweergave is de dichtstbijzijnde gebeurtenis met genoeg volume. Het risico is bezoekers die niet doorpakken: daarom beoordelen we advertenties op kosten per Start aanmelding en niet op kosten per klik.

Zodra de eerste advertentie voldoet aan de graduatieregel (sectie 8), splitst C1 in een Scaling-campagne (80 % van het bereikbudget) en een Test-campagne (20 %). Daarvoor bestaat er één Test-campagne.

## 5. Budget

Pot €400 (aanname, B4 in het bestand). Verdeling en waarom:

| Laag | Aandeel | Bedrag | Campagnebestand | Reden voor de afwijking |
|---|---|---|---|---|
| Bereik | 65 % | €260 | 60 % | Het bereik moet de retargeting-pool voeden |
| Retargeting | 27 % | €108 (+€32 als referral dicht blijft = €140) | 25 % | De pool is klein: veel meer dan €140 op ±100 tot 1.500 mensen is frequentie, geen resultaat |
| Doorverwijzen | 8 % | €32 | 15 % | Alleen een publiek van 14 volgers en <20 klanten: €60 zou frequentie 10+ geven. Niet vrijgegeven? Dan naar retargeting |

Per fase (bij referral dicht):

| Fase | Datums | Bereik | Retargeting | Totaal | Per dag |
|---|---|---|---|---|---|
| F0 Voorbereiding | 23 t/m 29 nov | €0 | €0 | €0 | 0 |
| F1 Na Black Friday | 30 nov t/m 6 dec | €72,80 | €14,00 | €86,80 | ±€12,40 |
| F2 Volle agenda | 7 t/m 13 dec | €67,60 | €35,00 | €102,60 | ±€14,66 |
| F3 Vriendenweek | 14 t/m 19 dec | €54,60 | €49,00 | €103,60 | ±€17,27 |
| F4 Kerst | 20 t/m 25 dec | €10,40 | €21,00 | €31,40 | ±€5,23 |
| F5 Januari klaarzetten | 26 dec t/m 4 jan | €54,60 | €21,00 | €75,60 | ±€7,56 |
| **Totaal** | | **€260** | **€140** | **€400** | |

Waarom zo:
- **Black Friday niet bieden.** Op vrijdag 27 november zit de veiling vol retailers en is de funnel nog onbewezen. Eerste uitgave maandag 30 november, na 48 uur organische data van idee 1. (Dat Q4 duurder is, is een patroon uit de praktijk en geen cijfer voor dit account: meet CPM vanaf de eerste euro.)
- **Vooral vóór 19 december.** Het meeste budget valt vóór het checkpoint, want een bezoeker van 18 december betaalt zelden dezelfde dag.
- **Na 19 december** is het doel gehaald of niet; daarna blijft retargeting en een klein bereik-deel voor januari. Q1 is traditioneel de goedkoopste maand: hypothese om te meten.
- **Referral vrijgeven** (cel B14): maandag 14 december, bij 20 of meer klanten.

## 6. Creatief

Meta's algoritme beloont veel, verschillend en rauw creatief. De tien betaalde uitingen zijn bewust verschillende concepten: dat is wat Andromeda ziet als diversiteit (veel varianten van één beeld tellen als één concept).

| Advertentie | Idee | Concept en hoek | Laag | Looptijd | Poort |
|---|---|---|---|---|---|
| A1 `DEC01-Pakketjes` | 1 | Eén dag kopen, negen dagen betalen | Bereik | 30 nov t/m 6 dec | Hooktest |
| A2 `DEC02-Advent` | 2 | Niet elk deurtje is chocola (hero) | Bereik | 2 t/m 23 dec | Hooktest |
| A3 `DEC03-Sint` | 3 | Sint heeft zijn boek | Bereik | 2 t/m 5 dec | Alleen hook rate en CTR |
| A4 `DEC07-Agenda` | 7 | De volle decemberagenda | Bereik | 11 t/m 19 dec | 24 uur organisch |
| A5 `DEC10-Bingo` | 10 | Kersttafel-bingo (static) | Bereik | 18 t/m 22 dec | Goedkoop volume |
| A6 `DEC13-Januari` | 13 | Januari staat al klaar (carrousel) | Bereik | 26 dec t/m 4 jan | Hooktest |
| A7 `DEC16-Voornemen` | 16 | Een voornemen in 30 seconden | Bereik | 2 t/m 4 jan | 24 uur organisch |
| B1 `DEC06-Brief` | 6 | Brief van de maker (vertrouwen) | Retargeting | 3 t/m 31 dec | Alleen sitebezoekers en kijkers |
| B2 `DEC09-Rust` | 9 | €3,49 rust (aanbod) | Retargeting | 8 t/m 31 dec | Alleen sitebezoekers en kijkers |
| R1 `DEC12-Vriend` | 12 | Vriend mee de feestdagen door | Doorverwijzen | 15 t/m 19 dec | 20+ klanten |

- **De Ads Manager-teksten** (primaire tekst ≤125, kop ≤40, knop) staan per idee in de documenten `01-pakketjes.md` enzovoort, en samengevat in tab 'Advertenties'.
- **Verversing zonder extra productie:** de 24 Story-deurtjes van idee 2 zijn losse beelden. Deurtje 3 (huur), 9 (webshop achteraf) en 14 (zorgpremie) komen vanaf 16 december als statics binnen hetzelfde concept, als verversing tegen vermoeidheid. Dat is "volume boven glans".
- **Reel en Feed:** upload 9:16 voor Reels en Stories en 4:5 voor de feed als twee uitvoeringen in één advertentie, met Meta's automatische plaatsingen.
- **Het vertrouwensbezwaar** (geen bankkoppeling, geen toegang tot je inbox) beantwoordt B1 voor mensen die de site al zagen. Zij haakten juist af op dat bezwaar, dus de brief van de maker hoort in retargeting en niet in het bereik.
- **Niet gebruiken:** nep-reviews of gebruikersaantallen, merknamen van webshops en betaalpartijen, "gratis" (behalve de werf-aanbieding in R1), "30 dagen geld terug", WhatsApp of Telegram.

## 7. Schema

Details per dag en per laag staan in tab 'Kalender'. Het ritme: **maandag beslissen, woensdag lanceren, vrijdag schalen of terugdraaien**; in feestdagenweken verschuift het naar donderdag.

| Week | Organisch | Betaald |
|---|---|---|
| 23 t/m 29 nov | Eerste feedpost za 28 nov: #1 | Poort G1, Go/No-go 23 en 27 nov. Geen uitgaven |
| 30 nov t/m 6 dec | #2 Advent (1 dec), #4 rijm (2 dec), #3 Sint en #6 brief (3 dec), #5 lijstjes (6 dec) | Ma 30 nov: C1 start met A1. Wo 2 dec: A2 en A3 erbij. Do 3 dec: C2 start met B1. Za 5 dec: A3 stopt. **Zo 6 dec: checkpoint 27 betaald** |
| 7 t/m 13 dec | #9 (8 dec), #8 deel 1 (9 dec), #7 agenda (10 dec) | Ma 7 dec: toets 1, A1 stopt. Di 8 dec: B2 start. Vr 11 dec: A4 live, winnaars max +20 % |
| 14 t/m 19 dec | #12 (14 dec), #11 (15 dec), #8 deel 2 (16 dec), #10 bingo (18 dec) | Ma 14 dec: referral-poort. Wo 16 dec: verversing met Advent-statics. Vr 18 dec: A5 live. **Za 19 dec: checkpoint 35 betaald** |
| 20 t/m 25 dec | #8 deel 3 (23 dec), deurtje 24 (24 dec) | Ma 21 dec: toets 2. Di 22 dec: A5 stopt. Wo 23 dec: A2 stopt. 24 en 25 dec: niets wijzigen |
| 26 dec t/m 4 jan | #13 (26 dec), #14 (28 dec), #15 (30 en 31 dec), #16 (1 jan) | Za 26 dec: A6 live. Za 2 jan: A7 live. Ma 4 jan: eindread en lessenbestand |

## 8. Beslisregels

Alle drempels hangen aan één getal: **€15 per Start aanmelding** (masterplan). Ze zijn aangepast aan een kleine, korte pot en komen uit de Meta-decision-aanpak van de ads-skill.

**Leesvolgorde per advertentie, in volgorde van beschikbaarheid**

| Moment | Meting | Doorgaan als | Anders |
|---|---|---|---|
| Dag 3 | Hook rate (3-seconden-weergaven / vertoningen) en link-CTR | Hook rate ≥30 % en CTR ≥0,8 % | Alleen hook of beeld vervangen: de kijker is nog niet verder gekomen |
| Dag 7 | Eerlijk aandeel: verwachte besteding = (campagnebudget / aantal advertenties) × 7 × 0,5 | Besteding erboven | Opgeven, Meta deprioriteert hem |
| Dag 7 | Kosten per bezoeker | ≤€1,50 | Hook of aanbod aanpassen |
| Zodra uitgegeven ≥3× €15 = €45 | Starts en kosten per start | Kosten per start ≤€15: kandidaat-winnaar | 0 starts bij ≥€45: vervangen. €15 tot €22,50: nog een week. Boven €22,50 (1,5×): vervangen of 20 % terug |
| Graduatie | ≥3 starts, kosten per start ≤€15, ≥7 dagen live, ≥1 betaling met deze `utm_content` in Mollie | Naar de Scaling-campagne | Blijft in Test |

De standaarddrempel in de ads-skill is 14 dagen en 5 gekwalificeerde leads. Die past niet in een campagne van zes weken en een pot van €400. De korte versie hierboven is dus een bewuste aanpassing: de bewijskracht is kleiner en je moet dat zo noemen.

**Ad-ceiling.** (dagbudget × 14) / (2 × €15). Bij €10,40 bereik per dag in week 1 is dat 4,9; bij €9,10 in week 3 is dat 4,2; in januari bij €5,46 is dat 2,5. Dus nooit meer dan 3 bereik-advertenties tegelijk, en in januari twee.

**Vermoeidheid.** Koud: frequentie 1,0 tot 2,5 is veilig, 2,5 tot 4,0 waarschuwing, boven 4,0 kritiek. Retargeting: 2,0 tot 4,0 veilig, boven 6,0 kritiek. Andere signalen: link-CTR 20 % onder de top over 7 dagen, CPM 30 % omhoog over 2 weken. Statics gaan 14 tot 28 dagen mee, Reels 21 tot 35.

**Opschalen.** Alleen met winnende advertenties, frequentie <3,0 en vervangers klaar. Maximaal +20 % per 5 dagen, nooit +30 % in één keer. Is de kosten per start na een stap meer dan 1,5× het doel, dan direct 20 tot 30 % terug en twee weken stabiliseren.

**Vervangen zonder te resetten.** Pas nooit een draaiende advertentie aan: dat reset het leren. Zet een nieuwe naast de oude. Pauzeer niet zonder vervanger.

**Checkpoints (campagnebestand).** Zondag 6 december: 27 betaald. Zaterdag 19 december: 35 betaald. Loopt het achter, dan schuift budget van bereik naar retargeting, met een maximum van 20 % van het weekbudget per keer (dezelfde stapgrootte als bij opschalen).

**Toets per twee weken (masterplan).** Maandag 7 en 21 december: link-CTR ≥0,8 %, ≤€1,50 per echte bezoeker, ≥1 checkout per €15, ≥1 aankoop.

**Optimalisatiegebeurtenis voor retargeting.** Begin op Start aanmelding. Pas na 10 echte aankopen (CAPI) overstappen op `Purchase` voor die advertentieset.

## 9. Meten

- **Drie bronnen naast elkaar, nooit optellen:** Meta (7 dagen klik), GA4 (UTM) en Mollie/Supabase (de waarheid over betalingen). Meta zal hoger rapporteren dan GA4; verschillen van 10 tot 30 % zijn normaal.
- **Elke maandag** vult tab 'Meetplan' met de weekcijfers. De bestaande geplande scorebordtaak (maandag 7:54) krijgt dezelfde drie bronnen.
- **De laatste 3 dagen van een week niet als eindoordeel gebruiken:** conversies lopen tot 72 uur achter.
- **Landingspagina testen kan niet bij ±300 bezoekers.** Gebruik Clarity-sessies en één gerichte aanpassing per week; een A/B-test op de pagina is bij dit volume niet te beslissen.
- **Leesvolgorde bij een afwijking:** uitgaven, verkeer, conversies, creatief, landingspagina, tracking. Een oorzaak hoger in de lijst verklaart de symptomen eronder.
- **Vrijdagrapport (<200 woorden):** resultaat tegen doel (groen, oranje, rood), de grootste bewegingen met oorzaak en zekerheid, en de keuzes voor volgende week.

## 10. Risico's en plan B

| Risico | Gevolg | Plan B |
|---|---|---|
| G0 faalt (funnel) | Betaald verkeer kan niet betalen | Geen uitgaven; poort opnieuw op de volgende maandag |
| Instagram-browser breekt checkout | 32 % van het verkeer valt weg | Eerst oplossen; geen uitgaven tot de test slaagt |
| Advertentie afgekeurd | Eén dag levering kwijt | Beroep met uitleg van het product; vervanger klaar |
| CPM piekt rond Black Friday of Kerst | Minder bereik per euro | Geen uitgaven op 27 nov; geen nieuwe bereik-ads na 22 dec |
| Pot kleiner dan €400 | Minder dagbudget | Cel B4 aanpassen; vervang het aantal gelijktijdige advertenties volgens het ad-ceiling |
| Retargeting-pool onder 100 | Kan niet leveren | Eerst bereik laten lopen; start RT pas als de pool er is |
| Nul betalingen na €45 | Het probleem zit na de klik | Terug naar G0, niet naar nieuw creatief |
| Referral-poort faalt (<20 klanten) | R1 draait niet | €32 naar retargeting (automatisch in het bestand) |

## 11. Open besluiten voor Rick

- Klopt de pot van €400? (Staat in B4.)
- Garantie "30 dagen geld terug" (idee 9): ja of nee, en in welke advertentie.
- Werf-aanbieding "jij een maand gratis" (idee 11 en 12): blijft het zo, en staan de voorwaarden op de instappagina?
- Welke instappagina krijgt de knop en "link in bio" (campagnebestand: `/start-met-betaalbuddy/`).
- Mag de verdeling 65/27/8 in plaats van 60/25/15?
- Zorgverzekering-feiten van idee 8 laten controleren voor 9 december.
- Bevestigen dat het product een rekening als hele-dag-item met twee seintjes in de agenda zet (ideeën 2, 3 en 7).
