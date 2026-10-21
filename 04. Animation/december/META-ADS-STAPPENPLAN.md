# Meta Ads instellen: stappenplan voor beginners

Bij `META-ADS-PLAN.md` (het waarom en het schema). Dit bestand is het hoe: de volgorde waarin je alles aanklikt, zonder voorkennis. Meta verandert zijn schermen en woorden regelmatig. Staat er in jouw scherm iets anders dan hier, zoek dan op de naam in de zoekbalk of de Meta-hulp. De volgorde en de keuzes blijven gelijk.

**Twee regels vooraf**
1. Doe niets met geld voordat deel 4 klaar is. Deel 1 tot en met 3 kosten niets.
2. Gebruik nooit de blauwe knop "Bericht promoten" ("Boost") onder een Instagram-post. Die slaat alle keuzes uit dit plan over.

## Woordenlijst

| Woord | Wat het is |
|---|---|
| Advertentieaccount | Waar de advertenties en de facturen in staan |
| Pagina | Een Facebook-pagina van Betaalbuddy. Meta wil die aan een advertentie koppelen |
| Pixel | Stukje code op je website dat Meta vertelt wie er is geweest en wat die deed |
| Conversions API (CAPI) | Dezelfde info, maar vanuit je server. Voor de echte betaling, want die gebeurt bij Mollie en niet in de browser |
| Campagne, advertentieset, advertentie | Drie lagen. Campagne = doel en budget. Advertentieset = wie, waar en wanneer. Advertentie = het beeld en de tekst |
| Plaatsingen | Waar de advertentie staat (Instagram Reels, Stories, feed, Facebook) |
| Frequentie | Hoe vaak één persoon dezelfde advertentie ziet |
| Leerfase | Eerste dagen waarin Meta uitzoekt wie het beste reageert. Niet storen: niets aanpassen aan een draaiende advertentie |
| CPM | Kosten per 1.000 vertoningen |
| CTR (link) | Percentage dat doorklikt naar je site |
| UTM | Labels in de link zodat je in GA4 ziet welke advertentie wat deed |

## Deel 1. Kijk eerst wat er al is (15 minuten)

GA4 liet eerder al "Paid Social"-verkeer zien (28 gebruikers), dus er is mogelijk al iets aangemaakt.

1. Open **business.facebook.com** en log in met je gewone Facebook-account. Zie je al een "Businessportfolio" (vroeger "Business Manager") van Betaalbuddy of ParkingYou? Gebruik dat. Maak anders een nieuwe aan met de bedrijfsnaam, je naam en je zakelijke e-mailadres.
2. Ga naar **Bedrijfsinstellingen** (Business settings). Noteer onder **Accounts** wat je ziet: Pagina's, Instagram-accounts, advertentieaccounts, datasets of Pixels.
3. Mis je een **Facebook-pagina** voor Betaalbuddy? Maak er een (gratis). Een advertentie hoort bij een pagina.
4. Zet het Instagram-account op **professioneel** (zakelijk of creator). Dat kan in de Instagram-app onder Instellingen. Koppel het in Bedrijfsinstellingen onder **Accounts > Instagram-accounts** en koppel het aan de pagina.
5. Staat er een **advertentieaccount**? Kijk of de valuta EUR is en de tijdzone Amsterdam. Zo niet: maak een nieuw account (valuta en tijdzone kun je achteraf niet meer wijzigen).

**Stuur mij na deze stap een korte lijst van wat je ziet.** Dan weet ik of we iets opnieuw moeten doen.

## Deel 2. Betaling, verificatie en limiet (30 minuten)

1. **Betaalmethode** toevoegen in Bedrijfsinstellingen of in Advertentiebeheer onder **Facturering**.
2. **Uitgavenlimiet** voor het account: zet die op het bedrag van de pot (nu €400 of €508). Dan kan een fout nooit meer kosten dan het plan. Je vindt dit onder de instellingen van het advertentieaccount.
3. **Adverteerdersgegevens voor de EU:** Meta vraagt in de EU wie de adverteerder is (naam, adres) en wie betaalt. Vul die in als Meta ernaar vraagt. Zonder kan de levering stoppen.
4. **Domein verifiëren**: Bedrijfsinstellingen > Merkveiligheid > Domeinen > toevoegen: `betaalbuddy.nl`. Meta geeft je een DNS-record of een meta-tag. Die zet je bij je domeinbeheer of in de header van de site. Wacht tot er "Geverifieerd" staat.
5. **Automatische aanbevelingen uit:** zie je in het advertentieaccount of in een campagne een optie waarmee Meta aanbevelingen automatisch toepast (budget of doelgroep aanpassen)? Laat die uit. Meta verandert dan niets zonder dat jij het weet.

## Deel 3. Pixel en gebeurtenissen (1 tot 2 uur, plus een programmeur voor één onderdeel)

Dit is het saaiste en belangrijkste deel. Zonder dit leert Meta niets en meet je niets.

**3a. De Pixel (dataset) maken**
- **Gebeurtenissenbeheer** (Events Manager) > **Gegevensbronnen koppelen** > **Web** > Meta Pixel. Geef hem een naam ("Betaalbuddy site") en vul `betaalbuddy.nl` in.
- Je krijgt een Pixel-ID. Die kopieer je.

**3b. De Pixel op de site zetten**
De site draait waarschijnlijk op WordPress met Oxygen (de changelogpagina is zo gemaakt). Kies één van deze:
- **Meta-plug-in "Facebook for WordPress"** (officieel, gratis): koppelen met je Pixel-ID.
- **Google Tag Manager**, als dat er al is. Dan zet je de Pixel daar als tag.
Welke je ook kiest: de Pixel mag pas laden **na toestemming** in de cookiebanner. Heb je nog geen cookiebanner, regel er dan eerst een (Complianz of Cookiebot).

**3c. Drie gebeurtenissen**

| Gebeurtenis | Wanneer hij afgaat | Waar |
|---|---|---|
| `PageView` | Elke pagina | Komt vanzelf met de Pixel |
| `ViewContent` | Op `/start-met-betaalbuddy/` | Plug-in of tag |
| `InitiateCheckout` | Zodra iemand het aanmeldformulier begint | Plug-in of tag, op de knop "Start" |

**3d. Aankoop vanuit de server (hier heb je hulp voor nodig)**
`Purchase` moet komen uit de Mollie-webhook (status "betaald") en niet uit de pagina waar de klant naartoe terugkeert. Die pagina kun je herladen of nabootsen. De webhook draait op jullie backend (Railway en Supabase). Daar komt een kleine functie die:
1. de betaling ophaalt,
2. een `Purchase` naar Meta stuurt met de waarde, het gehashte e-mailadres en de cookies `fbp` en `fbc` (die je bij de aanmelding als Mollie-metadata meegeeft),
3. dezelfde `event_id` gebruikt als de browser, zodat Meta hem niet dubbel telt.

Dit kan ik voor je bouwen als ik de backend-repo erbij krijg. Zeg het maar.

**3e. Testen, met je telefoon**
1. Gebeurtenissenbeheer > je Pixel > **Gebeurtenissen testen**. Daar zie je live wat er binnenkomt.
2. Open de site op je telefoon via een link in Instagram (stuur jezelf de link in een DM en tik hem in de app). Zo test je de **Instagram-browser**, waar 32 % van je verkeer vandaan komt.
3. Doe een echte aanmelding met een echte iDEAL-betaling (je kunt hem daarna opzeggen). Doe dit op **iPhone én Android**.
4. Check dat je in Gebeurtenissen testen ziet: `PageView`, `ViewContent`, `InitiateCheckout` en `Purchase`, elk één keer, met waarde 3,49 EUR.
5. Gaat er in de Instagram-browser iets mis (de betaling lukt niet, de terugkeer naar de site faalt, een witte pagina)? **Stop.** Dit is wat het plan "poort G0" noemt. Eerst oplossen, daarna pas geld uitgeven.

## Deel 4. Doelgroepen aanmaken (20 minuten)

Advertentiebeheer > **Doelgroepen** > **Doelgroep maken** > **Aangepaste doelgroep**. Maak deze zes en let op dat elke lijst groter is dan 100 mensen voordat je hem gebruikt:

| Naam | Bron | Instelling |
|---|---|---|
| `Site-30d` | Website | Alle bezoekers, laatste 30 dagen |
| `Start-30d` | Website | Mensen die `ViewContent` deden, 30 dagen |
| `Checkout-30d` | Website | Mensen die `InitiateCheckout` deden, 30 dagen |
| `Kopers-180d` | Website | Mensen die `Purchase` deden, 180 dagen. **Hiermee sluit je kopers overal uit** |
| `IG-90d` | Instagram-account | Iedereen die interactie had, 90 dagen |
| `Video-50` | Video | Mensen die minstens 50 % van een video bekeken, 30 dagen |

Telt een lijst minder dan 100 mensen? Dan kan de retargeting nog niet starten. Het bereik-deel bouwt die lijsten gewoon op.

## Deel 5. De eerste campagne bouwen (45 minuten)

Advertentiebeheer (adsmanager.facebook.com) > **+ Maken**. Je doorloopt drie schermen. Gebruik dit voor de **bereik-campagne** (C1).

**Scherm 1: Campagne**
- Campagnedoel: **Verkeer**.
- Naam: `META_Traffic_Broad-NL-21-34_Standard349_2026Dec`.
- Zet **Advantage-campagnebudget** aan. Dagbudget: zie de kalender in `META-ADS-PLANNING.xlsx` (week 1: €10,40).
- Speciale advertentiecategorieën: lees de omschrijving die Meta geeft. Betaalbuddy leent niet, betaalt niet en geeft geen financieel advies, dus waarschijnlijk vink je niets aan. Twijfel je, stuur me de tekst van Meta. Zie ook het plan, sectie 4.1.

**Scherm 2: Advertentieset**
- Naam: `AS_Broad-NL-21-34_Auto`.
- Conversielocatie: **Website**.
- Prestatiedoel: **Aantal weergaven van de landingspagina maximaliseren**. (Niet "Klikken op links": die trekt snelle klikkers.)
- Pixel/dataset: je Pixel.
- Planning: kies de startdatum uit het schema (maandag 30 november).
- Doelgroep: Locatie **Nederland**. Leeftijd **21 tot 34**. Geslacht: allemaal. Geen interesses toevoegen, laat Meta zoeken (de advertenties zelf doen het richten). **Sluit uit:** `Kopers-180d`.
- Plaatsingen: **Advantage+ plaatsingen** aan, en schakel daarna in de lijst **Audience Network** en **Messenger** uit.

**Scherm 3: Advertentie**
- Identiteit: kies je Pagina en je Instagram-account.
- Advertentie-opzet: **Maak advertentie** (niet een bestaand bericht).
- Formaat: **Enkele afbeelding of video**. Upload twee bestanden voor dezelfde advertentie: de 9:16-versie (Reels en Stories) en de 4:5-versie (feed). Meta kiest per plaatsing. Bestanden: zie `renders/december/`. Zet de naam van de advertentie gelijk aan de compositienaam (bijvoorbeeld `DEC01-Pakketjes-Reel`).
- **Primaire tekst, kop, knop:** kopieer uit tab "Advertenties" in `META-ADS-PLANNING.xlsx` of uit het document van het idee.
- **Websitebestemming:** `https://betaalbuddy.nl/start-met-betaalbuddy/`.
- **URL-parameters** (onder "Opties weergeven"):
  `utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{campaign.id}}`
- **Advantage+ creative-verbeteringen:** zet alles uit, vooral **tekstverbeteringen** en **overlays**. Meta mag je tekst niet herschrijven.
- Controleer de **voorbeelden** (Reels, Stories, feed) in de rechterkolom. Staat er belangrijke tekst achter de knoppen van Instagram, dan klopt de safe zone niet.

Klik **Publiceren**. Het advertentieaccount stuurt de advertentie ter **beoordeling** (kan tot 24 uur duren). Dat is ook waarom je ze dagen van tevoren klaarzet (gepauzeerd of met een startdatum in de toekomst).

## Deel 6. De retargeting-campagne (20 minuten, pas als de lijsten groot genoeg zijn)

Zelfde schermen, met deze verschillen:
- Doel: **Verkoop** (Sales). Naam `META_Sales_RT-30d_Standard349_2026Dec`.
- Conversielocatie: Website. Gebeurtenis: **InitiateCheckout** (later `Purchase`, zie plan sectie 8).
- Doelgroep: gebruik de aangepaste doelgroepen `Site-30d`, `Start-30d`, `IG-90d` en `Video-50`. **Sluit uit:** `Kopers-180d`. Geen leeftijd of interesses.
- Advertenties: `DEC06-Brief` en `DEC09-Rust`. Knop: **Meer informatie**.

## Deel 7. Wat je elke week doet (30 minuten)

Open elke **maandag** Advertentiebeheer en volg het schema in `META-ADS-PLANNING.xlsx`, tab Kalender.
1. Zet bij **Kolommen** een eigen voorinstelling: bestede bedrag, vertoningen, bereik, frequentie, CPM, link-CTR, klikken, weergaven landingspagina, `InitiateCheckout`, `Purchase`.
2. Vul in tab **Meetplan** de cijfers in. Haal het aantal echte betalingen uit Mollie of Supabase, niet uit Meta.
3. Kijk in tab **Advertenties** wat de kolom "Beslissing" zegt.
4. Wil je iets veranderen? Pas **nooit een draaiende advertentie aan**. Zet een nieuwe ernaast en pauzeer de oude pas als de nieuwe goedgekeurd is. Pauzeren zonder vervanger doe je niet.

## Wat beginners fout doen (en wij dus niet)

| Fout | Waarom het kwaad doet |
|---|---|
| "Bericht promoten" gebruiken | Slaat doel, doelgroep en tracking over |
| Veel interesses en leeftijden toevoegen | Maakt de doelgroep klein en duur. De advertentie doet het richten |
| Het budget elke dag aanpassen | Reset het leren. Maximaal +20 % per 5 dagen |
| Na één dag oordelen | Je kijkt naar ruis. Wacht op de leesmomenten uit het plan |
| Een draaiende advertentie bewerken | Reset de leerfase |
| Alleen kijken naar kosten per klik | Een goedkope klik is niets waard als de bezoeker niet betaalt. Kijk naar kosten per start en per betaalde abonnee |
| Meta-cijfers bij GA4-cijfers optellen | Elk systeem telt anders. Naast elkaar leggen, nooit optellen |
| "Aanbevelingen toepassen" aanklikken | Meta past budget en doelgroep aan zonder dat je het merkt |

## Een goede eerste oefening

Jullie masterplan heeft al een test op **12 november** (zorgpremie-haak). Gebruik die als **oefenronde**: dezelfde opzet, een klein dagbudget (€5), twee dagen. Zo leer je de schermen kennen terwijl er weinig op het spel staat, en krijg je de eerste echte cijfers (CPM, CTR, kosten per bezoeker) voordat de decembercampagne begint.

## Waar ik je mee kan helpen

- Deel 3d: de server-gebeurtenis bouwen als ik de backend-repo erbij krijg.
- De advertentieteksten en bestandsnamen als uploadlijstje voor Meta klaarzetten.
- Samen een scherm doorlopen: beschrijf wat je ziet of plak de tekst, dan zeg ik wat je moet kiezen.
- De cookiebanner en privacytekst laten nakijken.
