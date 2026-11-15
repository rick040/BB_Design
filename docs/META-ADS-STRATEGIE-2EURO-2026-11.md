# Meta Ads-strategie Betaalbuddy: €2 per dag per campagne

Stand: 15 november 2026. Status: **concept, wacht op goedkeuring (Gate 1)**. Er is nog niets gebouwd en er staat niets live.

Opdracht: PM-149. Budget €2 per dag per campagne, maximaal €8 per dag (maximaal 4 campagnes). Bedrijfsdoel: minimaal €100 MRR op 19 december 2026 (masterplan: 35 betalende abonnees zonder btw, 29 met btw). Ad account act=918691302133961, business 2250437052095585.

---

## 0. In het kort

- **Het Meta-account, de pixel, Events Manager en Instagram heb ik niet zelf kunnen bekijken.** In deze sessie werkt Chrome niet, de Facebook Ads-connector is niet afgemaakt, en betaalbuddy.nl en instagram.com worden door het netwerk geblokkeerd. Wat ik daarover schrijf, komt uit de changelog en van Rick, of staat als "onbekend". Niets is ingevuld wat niemand heeft gezien.
- **Blokkade 1:** het advertentieaccount staat sinds 11 november stil door een mislukte betaling ("Payment required"). Volgens de changelog en Rick op 15 november is dat nog zo.
- **Blokkade 2: betalen in de Instagram-browser.** Elke klik op een Instagram-advertentie opent in de browser van Instagram zelf. Volgens Clarity (12 t/m 19 oktober) kwam 32% van de bezoekers via die browser, gaf de checkout daar een JS-fout (postMessage), en leverden 20 gestarte aanmeldingen 0 betalingen op. Nergens staat dat dit is opgelost. Zonder een geslaagde testbetaling in de Instagram-browser op iPhone en Android (poort G0 uit het decemberplan) is elke euro aan advertenties waarschijnlijk weg.
- **Blokkade 3:** nergens in de changelog staat dat de pixel werkt. Volgens het Notion-logboek (5 nov, één bron) stond "pixel met PageView, InitiateCheckout en Purchase testen" nog open.
- **Blokkade 4:** bijna alle kant-en-klare Reels hebben een rood-roze chip ("Kan uitlopen op €40", "Te laat") of een rode stempel. Volgens de merkregels mag er geen rood in. Van de gekozen creatives is alleen "sleutel" schoon. De rest is met één kleurtoken in Remotion te repareren, gevolgd door een nieuwe render.
- **Eerlijke verwachting:**
  - Met de 3 campagnes waarmee we starten (€6 per dag, ongeveer €180 tot 19 december) leveren de advertenties in het middenscenario **2 à 3 betalende klanten** op, dus rond €9 MRR.
  - Ligt de CPM in Q4 op €12 in plaats van €8, dan zijn het er 1 à 2.
  - Als alles tegelijk meezit, kunnen het er ongeveer 14 zijn. Dat is een plafond, geen verwachting.
  - De 4e campagne (€240 in totaal) gaat waarschijnlijk niet draaien: op 19 oktober had het Instagram-profiel 14 volgers, dus de warme doelgroep is te klein.
  - Het masterplan rekende op ongeveer 13 klanten uit "funnel plus Meta" (met €508). Dat haal je met dit budget niet.
  - Je eigen netwerk (bet 1, ongeveer 16 klanten) en doorverwijzingen (bet 3) moeten dus meer dragen dan gepland.
- **Voorstel:**
  - Drie campagnes van €2 per dag, elk met één hoek en een eigen leeftijdsband, zodat ze niet overlappen:
    - net op jezelf wonen, 21 tot 24;
    - achteraf betalen, 25 tot 28;
    - aanmaning en incassokosten, 29 tot 34.
  - Alleen Instagram, en optimaliseren op landingspaginaweergaven.
  - Een 4e campagne (retargeting met de privacyhoek) start pas als de warme doelgroep groot genoeg is.

---

## 1. Wat ik zag

### 1.1 Wat ik wel en niet kon controleren

| Bron | Gecontroleerd? | Hoe, of waarom niet |
|---|---|---|
| Instagram-profiel, posts, Reels, inzichten | Nee | instagram.com geblokkeerd door het netwerkbeleid van deze sessie; geen Chrome |
| Meta Business Suite, ingeplande Reels | Indirect | Niet zelf gezien. Het 19:00-schema komt uit de changelog (vervolg en vervolg 2) |
| Ads Manager: status, instellingen, concepten, resultaten | Nee | Geen Chrome; Facebook Ads-connector "connect_incomplete". Status "Payment required" komt uit de changelog en van Rick |
| Events Manager: pixel, events, CAPI, domein, AEM | Nee | Idem. betaalbuddy.nl en DNS-lookups zijn geblokkeerd, dus ook geen pixelcheck op de site |
| Doelgroepen (custom audiences) | Nee | Idem |
| Creatives in Drive ("BetaalBuddy Ads", 04, 05) | Ja | Agent-inventaris van 47 regels; 8 Reels bekeken |
| Creatives in de repo (`04. Animation/renders` en concept-branches) | Ja | ffprobe en frame-voor-frame contactbladen: BB-Ad, Countdown, Privacy, boemerang, later, weegschaal, sleutel |
| Projectdocs (masterplan, META-*, december, doelgroep) | Deels | Projectopslag niet bereikbaar. Wel de inhoud of een samenvatting gevonden van 9 van de 12 docs: changelogs in Drive, artifacts, Notion-logboek, GitHub-branches (zie 7) |
| Merk- en productregels | Ja | `.claude/skills/instagram-reel-ad/references/brand-betaalbuddy.md` (stand 10 nov 2026) |
| Backendcode (pixel/CAPI) | Ja | EmailTool-repo: geen Meta-pixel en geen Conversions API. Purchase via CAPI vanuit de Mollie-webhook is nog niet gebouwd (decemberplan, 20 okt) |

### 1.2 Instagram

Niet bekeken, dus geen top 3 en bottom 3. Ik ga geen posts verzinnen.

Wat ik wel weet uit de changelog:

- Op 19 oktober had het profiel **14 volgers**.
- De bio en de posts beloofden toen nog "gratis proberen" en "inbox checken". Controleer of dat inmiddels weg is: koud verkeer kijkt vaak eerst naar je profiel.
- Vanaf 15 november staat er elke avond om 19:00 een Reel ingepland, t/m 13 december (lijst in 1.5).

Zo vul je het in 5 minuten zelf in (of geef mij toegang, zie hoofdstuk 6):

1. Instagram-app > Professioneel dashboard > Inzichten > Content die je hebt gedeeld > laatste 90 dagen, sorteer op **Bereik**.
2. Noteer de 3 beste en 3 slechtste: datum, Reel of post, eerste zin (hook), hoek, weergaven, opslagen, deelacties.
3. Kijk vooral naar **opslagen en deelacties per 1.000 weergaven**. Die voorspellen beter of een Reel als advertentie werkt dan likes.
4. Doet een van de nieuwe Reels het organisch duidelijk beter dan de rest, dan wordt die op dag 7 of 14 de vervanger in de campagne met dezelfde hoek.

### 1.3 Meta-account

| Punt | Status | Bron |
|---|---|---|
| Accountstatus | **Payment required** sinds 11 nov, na een mislukte betaling | Changelog vervolg en vervolg 2; Rick op 15 nov. Niet door mij gezien |
| Land, valuta, tijdzone | Onbekend | Controleer: Ads Manager > Instellingen advertentieaccount. Verwacht NL, EUR, Europe/Amsterdam |
| Betaalmethode | Mislukt (gemeld) | Billing hub |
| Concept-campagne "Verkoop" | Onbekend of die bestaat | Op 5 nov lukte bouwen niet; Rick zou hem "volgens de invulkaart bouwen en als concept laten staan tot de pixel werkt". Bron: alleen het Notion-logboek, niet in de changelog. Nergens bevestigd |
| Historische resultaten | Waarschijnlijk geen | Rick heeft volgens het logboek nooit een campagne gedraaid. Wel telde GA4 in sep/okt 28 gebruikers via Paid Social. Dat botst; zie 6.2 |

**Cold start:**

- Account: waarschijnlijk koud (niet geverifieerd).
- Pixel: onbekend, dus behandelen als koud.
- Conversies: koud.
  - Op 19 oktober waren er "geen aanmeldingen".
  - GA4 telde van 21 sep t/m 18 okt 58 gebruikers en 0 aankopen.
  - Clarity telde van 12 t/m 19 okt 20 gestarte aanmeldingen en 0 gelukte betalingen.
  - Er was één account met toegang tot 4 november, maar dat was compensatie van Rick, geen betalende klant.
  - Het scorebord in de 100 MRR-tracker is leeg.

Er is dus geen data om op te optimaliseren. Daarom eerst de meting valideren, dan kleine tests die je kunt terugdraaien, en geen benchmarks van volwassen accounts.

### 1.4 Tracking

Wat er volgens de docs staat: Complianz met Consent Mode v2, Google Tag Manager en GA4 (met events zoals `begin_checkout`, `tryout_open`, `home_cta`). Checkout via Mollie Forms op WordPress (geen Stripe). De Meta-pixel is gepland, maar nergens als werkend gemeld.

| Event | Werkt | Aantal laatste 28 dagen | Zo controleer je het |
|---|---|---|---|
| PageView | Onbekend | Onbekend | Events Manager > Gegevensbronnen > pixel > Overzicht. Dan "Events testen", vul betaalbuddy.nl in en laad de pagina |
| ViewContent | Onbekend | Onbekend | Idem, op een hoekpagina (optioneel event) |
| InitiateCheckout | Onbekend | Onbekend | Doorloop /start-met-betaalbuddy/ tijdens "Events testen". Volgens de changelog gaat `begin_checkout` pas af bij de eerste handeling, niet bij het laden. Dat is goed |
| Purchase | Onbekend | Onbekend | Doe een echte testbetaling, ook in de Instagram-browser op iPhone en Android (poort G0 uit het decemberplan). Purchase moet 1 keer binnenkomen, met waarde 3.49 en EUR, op de pagina na betalen (/stel-je-buddy-in/?bb_status=paid) |
| Conversions API (server) | Nee, niet gebouwd | n.v.t. | Bevestigd in decemberplan (20 okt). Voor de start geen blokkade; bij weinig data wel een gemis |
| Domein geverifieerd | Onbekend | n.v.t. | Bedrijfsinstellingen > Merkveiligheid > Domeinen > betaalbuddy.nl moet "Geverifieerd" tonen. Stond open in week 43 |
| Aggregated Event Measurement | Onbekend | n.v.t. | Events Manager > tab Aggregated Event Measurement, als die er nog is |

**Let op met cookies:** met Consent Mode vuurt de pixel alleen als een bezoeker cookies accepteert. Meta ziet dus minder dan er echt gebeurt. Vergelijk altijd met je echte aanmeldingen.

**Eigen data over de checkout** (changelog, 19 okt):

- Clarity (12 t/m 19 okt): 100 sessies, waarvan 23 bots.
- 20 gestarte aanmeldingen leverden 0 gelukte betalingen op.
- 32% van het verkeer kwam via de Instagram-browser, en daarin gaf de checkout een JS-fout (postMessage).
- 14% van de klikken was een dode klik.

De conclusie in de changelog was: "de pagina's zelf zijn het probleem". Poort G0 uit het decemberplan was een echte betaling via de Instagram-browser op iOS en Android vóór 11 november. Nergens staat dat die is gehaald. Omdat alle advertentieklikken in de Instagram-browser openen, is dit de belangrijkste test vóór livegang.

**/start-met-betaalbuddy/** draait de onboarding (v4/v5.1) met vragen en daarna het Mollie-formulier. Het is dus een werkende pagina en geen kale betaalpagina. Toch is die pagina minder geschikt als eerste kennismaking voor koud verkeer dan een hoekpagina, en de beleidsaudit ziet een risico op "slechte landingspagina-ervaring" als er direct een betaalstap opent. Daarom: **hoekpagina als die live staat, anders /start-met-betaalbuddy/** (zoals al besloten in het masterplan). Niet /probeer-betaalbuddy/: volgens het masterplan is dat de oude Gmail/WhatsApp-versie die moet doorsturen.

### 1.5 Creatives

Drive-map **"BetaalBuddy Ads"** ([link](https://drive.google.com/drive/folders/1oE8WWR14ag2QoWokd23J8hOFB5TpCxgK)): 29 conceptmappen van 10 t/m 14 november, meestal met een reel-vo (9:16), een feed-vo (4:5), stille versies, mp3, cover en caption. In 04 staat alleen oud materiaal (gratis, Gmail, WhatsApp, verloop, nep-reviews): **niet gebruiken**. In 05 staat alleen Domino (concept 82). Let op: de map-id voor 04 in de opdracht (`1UGSWbEf...`) is eigenlijk "01 Strategie & Onderzoek"; 04 is `1X0X9aMqSY6L8yHV8h-jttyMd9zDPZACF`.

**Klaar of bijna klaar, per hoek** (bron: Drive-inventaris, plus eigen frames waar "zelf gezien" staat; die contactbladen staan in `docs/bewijs-meta-ads-2026-11/`):

| Hoek | Bruikbaar | Gekozen voor de campagnes | Probleem |
|---|---|---|---|
| Aanmaning en incassokosten | 9 Reels: weegschaal, boemerang, radio, ijs, spaarpot, vloed, sneeuwbol, thee, ballon | **weegschaal** (€40 tegen €3,49), **boemerang** | Boemerang: rode chips "Te laat" en "Kan uitlopen op €40". Weegschaal: rode stempel "Aanmaning" (beide zelf gezien). Allebei alleen 9:16, dus een 4:5-feedversie moet nog gerenderd worden |
| Achteraf betalen | 1: later | **later** | Roze scène en rode chip "Kan uitlopen op €40" (zelf gezien). 4:5 is er |
| Net op jezelf wonen | 0 als video. Eigenhuis (concept 79) heeft alleen caption en mp3 in Drive | **eigenhuis** (opnieuw renderen vanaf branch `claude/peaceful-planck-5nk07m`) | Video ontbreekt; rood nog niet gecontroleerd |
| Privacy zonder mailboxkoppeling | 9, waarvan alleen sleutel en tafeltennis echt over "geen mailbox" gaan | **sleutel** (retargeting), tafeltennis als tweede | Sleutel: **geen rood** (zelf gezien), wel een gele sleutel. Alle privacy-Reels openen met een bezwaar, niet met pijn; daarom alleen voor retargeting |
| Zorgnota's | 2: wachtkamer, oproep (bijna dubbel) | Reserve (plan B voor C2) | Oproep heeft rood |
| Verkeersboetes | 0 | Geen | Alleen ideeën; bedragen eerst juridisch checken (WAHV) |

**Oudere animaties in de repo** (`04. Animation/renders`): BB-Ad (rood, "BetaalBuddy" in meldingen, herinneringen op 7 en 2 dagen), BB-Privacy (rood), BB-Countdown (draait helemaal om de 7-en-2-dagen-claim, dus niet meer bruikbaar). Die zijn vervangen door de nieuwe reeks.

**Ingeplande 19:00-reeks** (organisch; 15 nov t/m 8 dec uit changelog "vervolg", 9 t/m 13 dec uit "vervolg 2" volgens de Drive-agent, die de laatste niet zelf als export bij het bewijs heeft): 15 nov weegschaal, 19 boemerang, 21 radio, 22 eenplek, 24 geenai, 25 overzicht, 26 glasla, 27 doorlicht, 28 ijs, 29 spaarpot, 30 bon, 1 dec regels, 2 gelezen, 3 vloed, 4 rolmaat, 5 sneeuwbol, 6 prikbord, 7 geenapp, 8 thee, 9 wachtkamer, 10 oproep, 11 sleutel, 12 knikkerbaan, 13 broodrooster. Klaar maar niet ingepland: wedstrijd, tafeltennis, ballon, puzzel, later. In beeld staan december-datums ("do 17 dec"): na half december ogen ze verouderd, maar de campagne stopt op 19 december.

**Wat ontbreekt:** statics en carrousels in de nieuwe stijl, een tweede variant voor achteraf betalen en op jezelf wonen, en alles voor verkeersboetes. Een creative-audit door een aparte agent heb ik niet gedraaid. De Drive-inventaris en mijn eigen framecontroles dekken hetzelfde: wat klaar is, wat rood heeft en wat per hoek ontbreekt.

---

## 2. Wat €2 per dag kan

### 2.1 Aannames

Geen enkel getal hieronder is een resultaat van Betaalbuddy. Er is nog geen data.

| Aanname | Pessimistisch | Centraal | Alles zit mee | Basis |
|---|---|---|---|---|
| CPM Instagram NL (kosten per 1.000 vertoningen) | €12 | €8 | €5 | Searchlab 2026 (verwijst naar Hootsuite): gemiddeld ~€7,50, bandbreedte €5 tot €12; Reels ~€5,80, Feed ~€8,40. Leveranciersschatting, methode onbekend. Rond Black Friday (vr 27 nov) en in december ligt de CPM meestal hoger |
| Link-CTR | 0,6% | 1,0% | 1,5% | Vuistregel koud verkeer, geen bron |
| Landingspaginaweergave per klik | 60% | 75% | 85% | Vuistregel mobiel, geen bron |
| Aankoop per landingspaginaweergave | 0,5% | 1,5% | 3% | Vuistregel betaald abonnement zonder proefperiode, geen bron. Eigen data tot nu toe: 0 betalingen uit 20 gestarte aanmeldingen (Clarity, okt). Bij dit kleine aantal is dat geen bewijs, maar het ondersteunt ook het centrale getal niet. Het werkt pas als de checkout in de Instagram-browser werkt |
| Transactiekosten per maandbetaling | | €0,30 | | Aanname; echte Mollie-kosten onbekend |
| Opzeggers per maand | 15% | 10% | 7% | Aanname, geen data |

"Alles zit mee" zet alle vier de knoppen tegelijk op hun gunstigste stand. Dat is geen waarschijnlijk scenario, maar een plafond.

### 2.2 Per campagne per week (€14)

| | Pessimistisch | Centraal | Alles zit mee |
|---|---|---|---|
| Vertoningen | 1.167 | 1.750 | 2.800 |
| Linkklikken | 7 | 17 | 42 |
| Landingspaginaweergaven | 4 | 13 | 36 |
| Kosten per landingspaginaweergave | €3,33 | €1,07 | €0,39 |
| Kopers | 0,02 | 0,2 | 1,1 |
| Kosten per koper | ~€670 | ~€71 | ~€13 |

### 2.3 Tot 19 december (aanname: live van 20 november tot 19 december, 30 dagen)

| | Pessimistisch | Centraal | Alles zit mee |
|---|---|---|---|
| 3 campagnes (€180) | 0 klanten | 2 à 3 klanten (~€9 MRR met btw) | ~14 klanten (~€48 MRR) |
| 4 campagnes (€240), alleen als C4 draait | 0 klanten | ~3 klanten (~€12 MRR met btw, ~€10 zonder) | ~18 klanten (~€64 MRR) |
| **Gevoeligheid:** 3 campagnes, centraal maar met CPM €12 (Q4) | | 1 à 2 klanten (~€6 MRR); kosten per landingspaginaweergave €1,60, kosten per koper ~€107 | |

### 2.4 €100 MRR en het CAC-plafond

- **Klanten nodig:** 29 als €3,49 inclusief btw telt, **35** zonder 21% btw (€2,88 per klant). Het masterplan rekent met 35.
- **Wat een klant waard is** (zonder btw en min €0,30 transactiekosten blijft €2,58 per maand over):
  - €17 bij 15% opzeggers per maand;
  - €26 bij 10%;
  - €37 bij 7%.
  - Allemaal aannames.
- **CAC-plafond als je een klant in 3 maanden wilt terugverdienen: ongeveer €7,75.** Dat is het maximum dat je mag betalen om één klant binnen te halen.
- Bij de centrale kosten per landingspaginaweergave (€1,07) zou **bijna 14% van de bezoekers moeten kopen** om dat plafond te halen. Voor koud verkeer is dat niet realistisch.
- 29 klanten halen met alleen advertenties kost tegen de centrale kosten per koper ongeveer **€2.060**. Je budget is ongeveer €240.

**Conclusie.** Met €8 per dag halen advertenties het doel niet. In het middenscenario komt ongeveer 90% van de klanten uit andere kanalen. Uit het masterplan:

- bet 1: eigen netwerk en groepen;
- bet 3: vertrouwensblok en doorverwijzen;
- de dagelijkse Reels met link in bio.

De advertenties zijn hier vooral een snelle test van welke hoek en welke landingspagina werken, met een paar klanten als bonus. Het decemberplan zei het al: "een leerbudget, geen groeimotor".

### 2.5 Wat de cijfers na 7 en 14 dagen wel en niet kunnen zeggen

- **Na 7 dagen** zie je alleen of het draait:
  - wordt het budget uitgegeven;
  - zijn de advertenties goedgekeurd;
  - vuren de pixelevents;
  - komen de UTM's binnen in GA4;
  - hoe hoog is de CPM.
- **Na 14 dagen** zie je alleen grote verschillen in CTR of kosten per landingspaginaweergave. Een verschil van 1,0% tegen 1,5% CTR is na 7 dagen niet te onderscheiden (p ≈ 0,18), na 14 dagen nog net niet (p ≈ 0,06), en pas na ongeveer 30 dagen wel (p ≈ 0,007).
- **Over aankopen zegt het niets.** Met 0,2 verwachte kopers per campagne per week is de kans op 0 kopers in een week ongeveer 82%. Nul kopers na twee weken bewijst dus niet dat een hoek slecht is.
- De campagnes zijn geen gerandomiseerde test. Meta levert elke campagne anders uit. Een winnaar is dus een richting, geen bewijs.

### 2.6 Optimalisatie-event

| Event | Verwacht per campagne per week (centraal) | Haalt ~50 per week? | Oordeel |
|---|---|---|---|
| Purchase | 0,2 | Nee, bij lange na niet | Meta krijgt geen signaal; levering wordt grillig |
| InitiateCheckout | ~1 à 3 (aanname) | Nee | Beter signaal, maar te weinig |
| **Landingspaginaweergaven** | **~13** | Nee, maar het dichtst bij | **Keuze.** Diepste event met bruikbaar volume. Telt alleen als de pagina echt laadt, dus per ongeluk klikken vallen weg |
| Linkklikken | ~17 | Nee | Terugvaloptie als de pixel niet vuurt op de landingspagina |

De meeste bronnen zeggen dat een advertentieset ongeveer 50 optimalisatie-events in 7 dagen nodig heeft om uit de leerfase te komen. Sommige adverteerders zien sinds kort 10 in 3 dagen (anekdotisch). Met €2 per dag haal je geen van beide, met welk event dan ook. Reken op de status "Beperkt lerend". Bij dit budget is dat normaal en geen fout.

**Keuze:** doel **Verkeer**, prestatiedoel **Aantal landingspaginaweergaven maximaliseren**. Purchase en InitiateCheckout meten we wel (pixel, GA4, UTM), maar we sturen er niet op.

- **Nadeel:** Meta zoekt mensen die klikken, niet mensen die betalen. Daarom moeten de creative en de prijs in de tekst (€3,49 per maand) het filter zijn.
- **Overstap:** komen er over het hele account minstens 10 InitiateCheckouts per week binnen, dan stap je over op doel Verkoop met InitiateCheckout (beslispunt dag 14). Dat sluit aan bij de plannen van september en december.

### 2.7 Waarom 3 of 4 x €2 en niet 1 x €8

Eén campagne van €8 met drie hoeken als losse advertenties geeft Meta vier keer zoveel data in één advertentieset, en levert waarschijnlijk goedkoper. Dat was ook het voorstel van 5 november (1 campagne Verkoop). Jouw regel van €2 per campagne (PM-149, nieuwer) kiest voor duidelijkheid per hoek. Dat kost efficiëntie, en je leert langzamer (zie 2.5). Ik houd me aan je regel. Na dag 14 vraag ik of de beste hoek naar €4 tot €6 per dag mag. Dat is een vraag, geen wijziging.

---

## 3. De campagnes

### 3.1 Overzicht

| # | Naam | Hoek | Doel / event | Budget | Doelgroep | Uitsluitingen | Plaatsingen | Advertenties | Landingspagina | KPI | Start |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C1 | `BB_Verkeer_OpJezelf_LPV_2611` | Net op jezelf wonen | Verkeer / landingspaginaweergaven | €2/dag | NL, 21 t/m 24, breed | Kopers 180d, checkout-starters 14d | IG Feed, Stories, Reels | C1-A1 eigenhuis (na render) | Hoekpagina "net op jezelf wonen", anders /start-met-betaalbuddy/ | Kosten per LPV, link-CTR, 3-sec-kijkers | Na blokkades |
| C2 | `BB_Verkeer_Achteraf_LPV_2611` | Achteraf betalen | Verkeer / landingspaginaweergaven | €2/dag | NL, 25 t/m 28, breed | Idem | Idem | C2-A1 later (na rood-fix) | Hoekpagina "achteraf betalen", anders /start-met-betaalbuddy/ | Idem | Na blokkades |
| C3 | `BB_Verkeer_Aanmaning_LPV_2611` | Aanmaning en incassokosten | Verkeer / landingspaginaweergaven | €2/dag | NL, 29 t/m 34, breed | Idem | Idem | C3-A1 weegschaal, C3-A2 boemerang (beide na rood-fix en 4:5-render) | Hoekpagina "aanmaning en incassokosten", anders /start-met-betaalbuddy/ | Idem | Na blokkades |
| C4 | `BB_Verkeer_RetargetPrivacy_LPV_2612` | Privacy zonder mailboxkoppeling (bezwaar wegnemen) | Verkeer / landingspaginaweergaven | €2/dag | Warm: IG-interactie 90d + websitebezoekers 30d, NL, 21 t/m 44 | Kopers 180d | Idem | C4-A1 sleutel (klaar), C4-A2 tafeltennis | Hoekpagina "privacy zonder mailboxkoppeling", anders /start-met-betaalbuddy/ | Idem + InitiateCheckout | **Alleen als de warme doelgroep minstens ~1.000 mensen telt** (aanname). Anders blijft deze €2 in reserve |

Totaal bij start: **€6 per dag** (C1 t/m C3). Met C4: €8 per dag.

Kill/keep-regels per campagne: zie hoofdstuk 5. Ze gelden voor alle vier hetzelfde, zodat de hoek het enige verschil is.

### 3.2 Instellingen die voor alle campagnes gelden

- **Campagne:**
  - Doel Verkeer.
  - Geen Advantage-campagnebudget: er is maar 1 advertentieset per campagne.
  - **Speciale advertentiecategorie: niet aanvinken.** Betaalbuddy is geen krediet, verzekering, bankrekening, belegging of betaaldienst. Het is een herinneringsdienst, en ik vond geen bron die de categorie verplicht maakt voor campagnes alleen in Nederland. Dat is mijn oordeel, geen Meta-uitspraak.
  - Vraagt Meta er toch om, of keurt het C2 af als "financiële dienst"? Vervang C2 dan door de hoek zorgnota's (wachtkamer). Vink de categorie niet aan: daarmee vallen de leeftijdsbanden weg en gaan de campagnes overlappen.
- **Advertentieset:**
  - Conversielocatie Website.
  - Prestatiedoel Aantal landingspaginaweergaven maximaliseren.
  - Budget €2 per dag, geen einddatum (je pauzeert zelf).
  - Let op: Meta mag op een losse dag meer uitgeven dan het dagbudget (volgens Meta's helpcentrum tot 75% meer), maar per kalenderweek niet meer dan 7x het dagbudget. Met 3 campagnes kan een dag dus ruim €8 kosten, terwijl de week onder €42 blijft. Controleer dit getal vóór livegang in Meta's helpcentrum, want ik heb het niet in deze sessie nagekeken.
  - Biedstrategie Hoogste volume.
- **Doelgroep:**
  - Nederland, met de leeftijdsband als **harde grens**. Zet daarvoor Advantage+-doelgroep uit en kies "Oorspronkelijke doelgroepopties". Bij Advantage+-doelgroep is de maximumleeftijd alleen een suggestie, en dan overlappen de campagnes weer.
  - Geslacht: alle.
  - Gedetailleerde targeting: leeg. Dat sluit aan bij het besluit van september: "targeting gebeurt in de creative".
- **Waarom leeftijdsbanden:**
  - Je wilde geen overlap tussen prospectingcampagnes en tegelijk brede doelgroepen. Dat kan alleen met aparte leeftijdsbanden.
  - De banden passen bij het doelgroeponderzoek:
    - je gaat gemiddeld op je 23,8e uit huis;
    - achteraf betalen raakt vooral de jongste groep (AFM 2025, onder de 25);
    - een aanmaning is voor iedereen een pijnpunt.
  - Nadeel: een winnende campagne betekent "deze hoek werkt bij deze leeftijd", niet "deze hoek werkt". Bij dit budget is dat goed genoeg.
- **Uitsluitingen (C1 t/m C3):**
  - Kopers laatste 180 dagen (`Kopers-180d`, pixel Purchase).
  - Checkout-starters laatste 14 dagen (pixel InitiateCheckout).
  - Zodra C4 draait, ook de C4-doelgroep uitsluiten.
  - Werkt de pixel nog niet, dan kunnen deze uitsluitingen niet. Bij bijna nul klanten scheelt dat nu weinig, maar zet ze wel klaar.
- **Uitsluitingen (C4):** kopers laatste 180 dagen.
- **Plaatsingen:**
  - Handmatig: alleen Instagram Feed, Instagram Stories en Instagram Reels. Facebook, Audience Network, Messenger en Threads uit.
  - Waarom: de creatives zijn gemaakt als Reels, de doelgroep zit op Instagram, en Audience Network levert veel per ongeluk klikken op.
  - Dit wijkt af van het decemberplan (Advantage+-plaatsingen zonder Audience Network en Messenger). De opdracht PM-149 is nieuwer.
  - Nadeel: de CPM kan iets hoger zijn. Na dag 14 kun je Facebook Reels toevoegen als de CPM tegenvalt.
- **Advertentie:**
  - 1 à 2 advertenties per advertentieset, maximaal 3. Meer advertenties betekent bij €2 per dag dat geen enkele genoeg data krijgt.
  - Gebruik "Plaatsing-assets aanpassen": 9:16 voor Stories en Reels, 4:5 voor Feed.
  - Zet Advantage+-creatieve verbeteringen uit (geen automatische muziek, tekst of filters), zodat je merkregels heel blijven. Dat was ook het besluit in het decemberplan.
- **Toeschrijving:** standaard laten staan (7 dagen na klik, 1 dag na weergave).
- **Instagram-account:** controleer dat het Instagram-account gekoppeld is aan de Facebook-pagina en aan het advertentieaccount (Bedrijfsinstellingen > Accounts > Instagram-accounts).

### 3.3 Naamgeving en UTM

- **Campagne:** `BB_[doel]_[hoek]_[event]_[JJMM]`.
- **Advertentieset:** campagnenaam + `_NL_[leeftijd]`, bijv. `BB_Verkeer_Aanmaning_LPV_2611_NL_29-34`.
- **Advertentie:** `[code]_[creative]`, bijv. `C3-A1_weegschaal`.

In Meta vul je de link in twee velden in: **Website-URL** (de pagina) en **URL-parameters** (de UTM-tekst, zonder vraagteken). Per advertentie staan beide in hoofdstuk 4. Vorm:

```
utm_source=meta&utm_medium=paid_social&utm_campaign=[campagnenaam in kleine letters]&utm_content=[advertentiecode]
```

---

## 4. Advertenties

Regels voor alle teksten:

- gewone spreektaal, pijn eerst;
- geen "gratis" en geen "proefperiode";
- geen Basic of Lite, geen andere merknamen, geen AI als eigenschap;
- €40 altijd met "kan";
- geen gedachtestreepjes.

De teksten bouwen voort op je eigen Ads Manager-teksten uit de conceptbestanden, met de prijs erbij als filter.

"30 dagen geld terug" staat er bewust niet in. Het staat wel in de algemene voorwaarden v1.0 en in checkout v4, maar de merkreferentie noemt het nog een open punt (zie 6.2). De beschrijving "Geen app. Geen bankkoppeling." en de knop "Aanmelden" komen uit je bestaande teksten.

De beleidsaudit wees op Meta's regel over persoonlijke kenmerken: een advertentie mag niet zeggen of suggereren dat de kijker in een kwetsbare financiële situatie zit. Daarom praten de teksten over "een rekening" in het algemeen, niet over "jouw schulden" of "jouw aanmaning".

### C1 · Net op jezelf wonen · 21 t/m 24

**C1-A1 · eigenhuis** (concept 79, plattegrond; MP4 opnieuw renderen, reel + feed)

- Bestand: nog te renderen vanaf branch `claude/peaceful-planck-5nk07m` (Drive-map [2026-11-12 eigenhuis](https://drive.google.com/drive/folders/1ScaOiO4s-Ev0fwYii33heoTWx7QYOfBH) heeft alleen caption en mp3)
- Primaire tekst:

```
Eerste eigen huis betekent ook eerste eigen rekeningen. Huur, energie, internet, je zorgverzekering. Allemaal per mail, allemaal met een andere vervaldatum.

Stuur ze door naar Buddy en elke vervaldatum staat in je agenda. Jij kiest wanneer je een seintje krijgt.

Buddy kost €3,49 per maand. Geen app, geen bankkoppeling.
```

- Kop: `Je eigen huis. Meteen op orde.`
- Beschrijving: `Geen app. Geen bankkoppeling.`
- Knop: Aanmelden
- Website-URL: hoekpagina "net op jezelf wonen" (staat die niet live: `https://betaalbuddy.nl/start-met-betaalbuddy/`)
- URL-parameters: `utm_source=meta&utm_medium=paid_social&utm_campaign=bb_verkeer_opjezelf_lpv_2611&utm_content=c1-a1_eigenhuis`

**C1-A2 · nieuw (brief, optioneel vanaf dag 7)**

- Static 4:5 en 9:16, te maken met `/instagram-static-post`. Hook uit het doelgroeponderzoek: "Het duurste van op jezelf wonen is niet altijd de huur." Daaronder een stapel rekeningen met generieke afzenders (Verhuurder, Energieleverancier, Gemeente, Zorgverzekeraar). Onderaan: "Stuur ze door. Buddy zet ze in je agenda." Woordmerk en knop "activeer buddy". Kleuren alleen #013bff, #0026a8, #111827, #E8EEFF en wit.

### C2 · Achteraf betalen · 25 t/m 28

**C2-A1 · later** (concept 87, twee schermen; [reel](https://drive.google.com/file/d/12PPrnICFsPsRnGeRDzrlQSgcw7AubmIZ/view) en feed in Drive-map 2026-11-14 later; eerst rood-fix)

- Primaire tekst:

```
Nu besteld, later betalen. Maar wanneer is later eigenlijk? Die betaalmail zakt weg tussen de rest, en een aanmaning kan uitlopen op €40 aan incassokosten.

Stuur de betaalmail door naar Buddy. Hij haalt het bedrag en de vervaldatum eruit en zet ze in je agenda.

Buddy kost €3,49 per maand. Geen app, geen bankkoppeling.
```

- Kop: `Later is gewoon een datum.`
- Beschrijving: `Geen app. Geen bankkoppeling.`
- Knop: Aanmelden
- Website-URL: hoekpagina "achteraf betalen" (staat die niet live: `https://betaalbuddy.nl/start-met-betaalbuddy/`). Let op: volgens de changelog noemt die pagina merknamen (Klarna, Riverty, in3); die moeten eruit voordat er advertenties naartoe gaan.
- URL-parameters: `utm_source=meta&utm_medium=paid_social&utm_campaign=bb_verkeer_achteraf_lpv_2611&utm_content=c2-a1_later`

**C2-A2 · nieuw (brief, optioneel na Black Friday)**

- Static of korte Reel na Black Friday, te maken met `/instagram-static-post` of `/instagram-reel-ad`. Hook: "Eén dag shoppen. Daarna een maand betaalmails." Beeld: pakketjes, dan een rij betaalmails met elk een andere datum, dan één agenda waarin ze allemaal staan. Slotzin uit de decembercampagne: "Jij viert december. Buddy onthoudt de rest." Geen merknamen van betaalaanbieders.

### C3 · Aanmaning en incassokosten · 29 t/m 34

**C3-A1 · weegschaal** (concept 66, rekensom; [reel](https://drive.google.com/file/d/1NzkqHpmpR6R1_ebYe8BH3bGgNaRZvPaL/view); eerst rood-fix en een 4:5-render)

- Primaire tekst:

```
Wat kost een vergeten rekening? Eén aanmaning kan al uitlopen op €40 aan incassokosten.

Buddy kost €3,49 per maand. Je stuurt je rekening door, Buddy haalt het bedrag en de vervaldatum eruit en zet ze in je agenda. Jij kiest wanneer je een herinnering krijgt.

Reken maar uit.
```

- Kop: `€3,49 per maand. Een aanmaning kan €40 kosten.`
- Beschrijving: `Geen app. Geen bankkoppeling.`
- Knop: Aanmelden
- Website-URL: hoekpagina "aanmaning en incassokosten" (staat die niet live: `https://betaalbuddy.nl/start-met-betaalbuddy/`)
- URL-parameters: `utm_source=meta&utm_medium=paid_social&utm_campaign=bb_verkeer_aanmaning_lpv_2611&utm_content=c3-a1_weegschaal`

**C3-A2 · boemerang** (concept 62; [reel](https://drive.google.com/file/d/1hgln-z4mzpSVI5l1zdZ3LIrHjEb7MvMU/view) en repo `04. Animation/renders/boemerang-reel-vo.mp4`; eerst rood-fix en een 4:5-render)

- Primaire tekst:

```
Een rekening even wegleggen werkt zelden. Hij komt terug, vaak als aanmaning, en die kan uitlopen op €40 aan incassokosten.

Laat hem liever op tijd terugkomen. Stuur hem door naar Buddy en de vervaldatum staat in je agenda.

Buddy kost €3,49 per maand. Geen app, geen bankkoppeling.
```

- Kop: `Nu komt hij op tijd terug.`
- Beschrijving: `Geen app. Geen bankkoppeling.`
- Knop: Aanmelden
- Website-URL: zoals C3-A1
- URL-parameters: `utm_source=meta&utm_medium=paid_social&utm_campaign=bb_verkeer_aanmaning_lpv_2611&utm_content=c3-a2_boemerang`

### C4 · Retargeting, privacy · warm publiek (start alleen bij ~1.000+ mensen)

**C4-A1 · sleutel** (concept 72; [reel](https://drive.google.com/file/d/1RdVTswItZDzIQS8xczxXbdpMgzbqPrpo/view) en feed in Drive-map 2026-11-11 sleutel; **klaar**, geen rood)

- Primaire tekst:

```
Buddy krijgt geen sleutel van je mailbox of je bank. Je stuurt alleen die ene rekening door, meer ziet hij niet.

Hij leest het bedrag, de vervaldatum en de betaallink, en zet de vervaldatum in je agenda. Met vaste regels, geen AI.

Buddy kost €3,49 per maand.
```

- Kop: `Geen sleutel nodig.`
- Beschrijving: `Geen app. Geen bankkoppeling.`
- Knop: Aanmelden
- Website-URL: hoekpagina "privacy zonder mailboxkoppeling" (staat die niet live: `https://betaalbuddy.nl/start-met-betaalbuddy/`)
- URL-parameters: `utm_source=meta&utm_medium=paid_social&utm_campaign=bb_verkeer_retargetprivacy_lpv_2612&utm_content=c4-a1_sleutel`

**C4-A2 · tafeltennis** (concept 80; [reel](https://drive.google.com/file/d/13DsC2EKLH_VXnAG6UMZer8wFC0aTjrJI/view) en feed; niet zelf op rood gecontroleerd)

- Primaire tekst:

```
Kijkt Buddy mee in je mailbox? Nee. Je stuurt alleen de rekening door die jij kiest, en die staat daarna in je agenda.

Wat Buddy van je bewaart, kun je altijd inzien. Na 14 dagen na de vervaldatum is het weg.

Buddy kost €3,49 per maand.
```

- Kop: `Alleen wat jij toespeelt.`
- Beschrijving: `Geen app. Geen bankkoppeling.`
- Knop: Aanmelden
- Website-URL: zoals C4-A1
- URL-parameters: `utm_source=meta&utm_medium=paid_social&utm_campaign=bb_verkeer_retargetprivacy_lpv_2612&utm_content=c4-a2_tafeltennis`

### Reserve · Zorgnota's (plan B voor C2)

Let op: tandarts, fysio en eigen risico raken aan gezondheid. Dat ligt gevoeliger bij Meta's regel over persoonlijke kenmerken dan de andere hoeken. Houd de tekst daarom bij "de nota" en niet bij "jouw behandeling", en verwacht een strengere controle.

**R-A1 · wachtkamer** (concept 70; [reel](https://drive.google.com/file/d/1A822JcRqYSj9Dhlgw66aQ4ZsG-VgJD1l/view) en feed; niet zelf op rood gecontroleerd)

- Primaire tekst:

```
Tandarts, fysio, eigen risico. De nota's komen los van elkaar binnen en wachten rustig af. Tot er een aanmaning komt, en die kan uitlopen op €40.

Stuur je zorgnota's door naar Buddy. Hij zet elke vervaldatum in je agenda.

Buddy kost €3,49 per maand. Geen app, geen bankkoppeling.
```

- Kop: `Wie is de volgende?`
- Beschrijving: `Geen app. Geen bankkoppeling.`
- Knop: Aanmelden
- Campagnenaam als hij C2 vervangt: `BB_Verkeer_Zorg_LPV_2611`, utm_content `r-a1_wachtkamer`, hoekpagina "zorgnota's".

### Creative-reparatie vóór livegang (één renderronde)

| Creative | Wat | Waar |
|---|---|---|
| weegschaal | Rode stempel "Aanmaning" naar merkkleur; 4:5-feed renderen; controleren dat de kleine tekst onder de eindsom "€3,49 < €40" het woord "kan" bevat | branch `claude/peaceful-planck-whri2n` |
| boemerang | Rode chips "Te laat" en "Kan uitlopen op €40" naar merkkleur; 4:5-feed renderen | main, `04. Animation` |
| later | Roze scène en rode chip naar merkkleur | branch `claude/sweet-wright-oa0jgj` |
| eigenhuis | MP4 reel en feed renderen, op rood controleren | branch `claude/peaceful-planck-5nk07m` |

Voorstel voor de vervangende kleur van waarschuwingschips: `#111827` (donker) met witte tekst, of `#0026a8`. Beide staan in het palet uit de opdracht. Geel staat er niet in, maar is ook niet verboden; dat beslis jij.

---

## 5. Meetplan en beslisregels

### 5.1 De regel van 7 dagen

In de eerste 7 dagen na livegang verander je **niets** aan budget, doelgroep, plaatsingen of advertenties. Elke wijziging zet de leerfase terug op nul, en met €2 per dag kom je dan nooit verder. Uitzonderingen:

- een kapotte link;
- een afgekeurde advertentie;
- een betaalprobleem;
- een campagne die duidelijk meer uitgeeft dan €2 per dag.

Black Friday valt rond dag 7 (vr 27 november). Het decemberplan wilde daarom pas op 30 november starten. Ik start toch eerder: de tijd tot 19 december is kort, en 7 of meer dagen pauzeren zet het leren ook terug. Een hogere CPM in die week is geen reden om in te grijpen.

### 5.2 Dag 3 (rond 23 november)

- Geeft elke campagne ongeveer €2 per dag uit? Minder dan 70% na 3 dagen betekent een leveringsprobleem (betaling, goedkeuring, doelgroep), geen budgetprobleem.
- Zijn alle advertenties goedgekeurd? Bij een afkeuring: lees de reden en pas alleen de tekst aan.
- Klik zelf op elke advertentie (via het voorbeeld): opent de juiste pagina, met de UTM in de adresbalk?
- Events Manager: komen er PageViews binnen van Meta-verkeer?
- GA4 > Acquisitie: zie je sessies met bron `meta` en medium `paid_social`?

### 5.3 Dag 7 (rond 27 november)

- Per advertentie: vertoningen, link-CTR, kosten per landingspaginaweergave, en bij video het percentage dat 3 seconden kijkt.
- **Eerste schifting (hypothese):** heeft een advertentie minstens 1.500 vertoningen en een link-CTR onder 0,5% (dus hooguit 7 klikken), en doet een tweede advertentie in dezelfde set het duidelijk beter? Pauzeer dan de zwakke. 0,5% is de helft van de centrale aanname (1,0%), geen benchmark. Met minder vertoningen is het verschil toeval; laat dan staan.
- Nul linkklikken na ongeveer 1.500 vertoningen in een campagne betekent dat de creative niet haakt. Vervang hem door de volgende Reel in dezelfde hoek.
- Nog niets aan budget of doelgroep veranderen.

### 5.4 Dag 14 (rond 4 december): eerste echte beslispunt

Voorwaarde: minstens €28 uitgegeven en ongeveer 3.000 vertoningen per campagne.

- **Zwakste campagne pauzeren (hypothese):** als de kosten per landingspaginaweergave minstens 2x zo hoog zijn als bij de beste campagne, met minstens 30 klikken in beide. De vrijgekomen €2 gaat naar:
  1. C4 retargeting, als de warme doelgroep minstens ~1.000 mensen telt; anders
  2. een nieuwe advertentie in de winnende hoek (nieuwe creative, zelfde leeftijdsband); of
  3. met jouw akkoord: de winnende campagne naar €4 per dag (totaal blijft hooguit €8).
- **Elke aankoop betekent: laten draaien**, maar het is nog geen winnaar. Een winnaar roep je pas uit bij minstens 2 aankopen meer dan de rest, over minstens 14 dagen.
- **Funnelcheck:** zijn er over alle campagnes samen 100 of meer landingspaginaweergaven, maar bijna geen checkout-starts en geen aankopen? Dan ligt het aan de pagina, het aanbod of de prijs, niet aan de hoek. Stop dan met hoeken testen en repareer eerst de landingspagina.
- **Overstap naar Verkoop:** minstens 10 InitiateCheckouts per week over het hele account? Zet de winnende hoek dan opnieuw op met doel Verkoop en InitiateCheckout.
- Verhoog een budget alleen stapsgewijs (ongeveer 20 à 30% per 3 à 4 dagen), anders begint het leren opnieuw.
- Vergelijk Meta-aankopen altijd met je echte aanmeldingen (Mollie en de backend). Zolang de pixelstatus onbekend is, zijn die de waarheid.

### 5.5 Daarna (dag 21 tot 19 december)

- De advertenties uit de decembercampagne (bijvoorbeeld "Jij viert december. Buddy onthoudt de rest.") worden geen aparte campagnes. Ze vervangen vanaf dag 14 de zwakste advertentie binnen deze campagnes, zodat het budget hooguit €8 per dag blijft.
- Elke week: vervang één advertentie als de frequentie boven ~3 per week komt en de CTR daalt (hypothese).
- Na 19 december evalueer je tegen het MRR-doel en beslis je of de advertenties doorgaan.

---

## 6. Blokkades en open vragen voor Rick

### 6.1 Blokkades, in volgorde

1. **Betaling.** Het account staat op "Payment required". Los dit zelf op via de billing hub; ik pas geen betaalgegevens aan. Controleer daarna dat het account "Actief" is.
2. **Betalen in de Instagram-browser.** Open een link naar de landingspagina via een DM of je bio in Instagram, op een iPhone en een Android-telefoon. Doorloop daarna de hele aanmelding met een echte betaling, waarvoor je 30 dagen geld terug hebt. Lukt het niet (bijvoorbeeld door de postMessage-fout uit oktober), dan geen advertenties tot het is opgelost.
3. **Pixel en events.** Doorloop de tabel in 1.4.
   - Minimaal nodig: PageView op de landingspagina's.
   - Gewenst: InitiateCheckout bij de eerste stap in de checkout, en Purchase één keer per betaling, met waarde en EUR.
   - Werkt de pixel helemaal niet, dan starten we op linkklikken en meten we via UTM in GA4.
4. **Rood in de creatives.** Eén renderronde (zie de tabel aan het eind van hoofdstuk 4). Alleen sleutel is nu schoon.
5. **Landingspagina's live?** Volgens de merkreferentie (10 nov) was nog niet besloten waar de zes hoekpagina's live komen. De pagina's noemen nog prijzen en "30 dagen geld terug", en de pagina over achteraf betalen noemt ook merknamen. Zonder live hoekpagina gaan de advertenties naar /start-met-betaalbuddy/.
6. **Bouwen.** In deze sessie kan ik niet in Ads Manager bouwen. Er zijn drie opties:
   - (a) Facebook Ads-connector in claude.ai afmaken en een nieuwe sessie starten;
   - (b) dezelfde stap in Cowork met Chrome doen;
   - (c) je bouwt zelf, met hoofdstuk 3 en 4 als invulkaart (alles staat klaar om te plakken).

### 6.2 Open vragen

- Is "30 dagen geld terug" definitief? Het staat in de algemene voorwaarden v1.0, in checkout v4 en in de opdracht, maar de merkreferentie noemt het nog een open punt. Zodra jij het bevestigt, kan het in de teksten; het is een sterk argument.
- Hoeveel betalende klanten zijn er nu? Het scorebord in de tracker is leeg, en checkpoint 15 november (12 klanten) kan ik niet toetsen.
- Bestaat de concept-campagne "Verkoop" echt? Ik pas die niet aan en archiveer niets zonder jouw ja.
- GA4 telde in sep/okt 28 gebruikers via Paid Social, terwijl je volgens het logboek nooit een campagne draaide. Waren dat geboostte posts?
- Zijn in pakket Buddy de herinnermomenten echt vrij te kiezen? De teksten zeggen "jij kiest wanneer je een herinnering krijgt" (onboarding v5.1).
- Moet er een AI-label op video's met een AI-stem? Bij UGC was dat al een open vraag.

### 6.3 Conflicten tussen de merkregels in de opdracht en oudere bronnen

De merkregels uit de opdracht gaan voor. Deze bronnen wijken af:

| Bron | Wat er staat | Regel in de opdracht |
|---|---|---|
| `brand-betaalbuddy.md`, skillnaam, conceptdocs, Drive-map "BetaalBuddy Ads", changelogtitels, meldingen in BB-Ad en Countdown | "BetaalBuddy" (twee hoofdletters) | "Betaalbuddy" (één hoofdletter). De nieuwe Reels tonen het woordmerk in kleine letters; dat is goed |
| `brand-betaalbuddy.md` §1 en `src/theme.ts` | Kleurtoken red `#FF5A79` voor "urgent". Gebruikt in vrijwel alle Reels met een €40-chip, plus ballon, puzzel, prikbord, vloed, domino, oproep | Geen rood |
| Merkrichtlijnen (Drive, 3 sep) | Fonts Archivo Black en Poppins; €15 incassokosten; "Standard" als pakket | Space Grotesk; €40 (wettelijk minimum, met "kan"); Buddy €3,49 |
| `brand-betaalbuddy.md` §2, decemberdocs | Pakketnamen "Buddy lite / Buddy / Buddy pro" en "Standard" | De opdracht noemt het instappakket "Basic". Hoe dan ook: nooit noemen in creatives |
| `brand-betaalbuddy.md` §3 | "30 dagen geld terug" nog niet gebruiken | De opdracht noemt 30 dagen geld terug als feit |
| Decemberplan, advertentie R1, referralpagina, onboarding v5 ("Eerst gratis uitproberen?") | "een maand gratis", "gratis uitproberen" | Nooit "gratis". Controleer of die balk nog op de site staat |
| Decemberplan A2/A4, sheet met 43 ideeën, captions concept 1 t/m 3 | Herinnering 7 en 2 dagen vooraf | Onboarding v5.1: herinnering op een moment dat jij kiest |
| Captions van later, eigenhuis, weegschaal, sleutel, boemerang | Hashtag #budgetteren | `product-marketing.md`: "budgetteren" vermijden (klinkt als schuldhulp) |
| Doelgroeponderzoek, hook 2 | "Klarna, Riverty en in3" | Geen merknamen van derden |
| Oud materiaal in 04 (Video2-1, Video3-1, Video6-1, 1122-1, Post-reeks, Tweet-reeks) | Gratis, Gmail/WhatsApp, verloop, nep-reviews ("Sanne", "Karin"), onbewezen bedragen | Niet gebruiken |
| Homepage (volgens changelog) | Reviews van "Sanne" en "Karin", onbekend of het echte klanten zijn | Geen nep-reviews. Controleren vóór je verkeer stuurt |
| Masterplan | Budget €508 tot 19 dec; 1 campagne Verkoop op InitiateCheckout | PM-149 (nieuwer): €2 per campagne, maximaal €8 per dag, per hoek |

---

## 7. Bronnen

**Repo's**

- BB_Design: `04. Animation/renders/*`, `04. Animation/CONCEPT*.md`, `04. Animation/CONCEPTEN.md`, `.claude/skills/instagram-reel-ad/references/brand-betaalbuddy.md`.
- Concept-branches: `claude/peaceful-planck-whri2n` (weegschaal), `claude/sweet-wright-oa0jgj` (later), `claude/sweet-wright-sas4wy` (sleutel), `claude/peaceful-planck-5nk07m` (eigenhuis).
- EmailTool: `.agents/product-marketing.md` en `app/config.py` (betaal- en aanmeld-URL is /start-met-betaalbuddy/).

**Drive**

- [BetaalBuddy Ads](https://drive.google.com/drive/folders/1oE8WWR14ag2QoWokd23J8hOFB5TpCxgK).
- [Changelog hoofd](https://docs.google.com/document/d/1INYLoqPPaXk_fIeMtGqB7wOWjIAEWT9NGaYDYFSFYfQ/edit), [Changelog vervolg](https://docs.google.com/document/d/1S6f8ympzhqDm_ga-j_z4ql8io2tTS3JhvG-de7y9rUg/edit), [Changelog vervolg 2](https://docs.google.com/document/d/1IDe1zPQdp0kN35PRfT7lvpncAYiW5azZJBgfqbdW8O0/edit).
- [100 MRR tracker](https://docs.google.com/spreadsheets/d/1Y_3TdlUv13YujsZH6_dcLXIxCm1v1_Wt727wc1DvXBw/edit).
- [Merkrichtlijnen](https://docs.google.com/document/d/11T4YrX1VY99gnBJ49-JXPpJwx6qzw_sJvZ7RR-kTGww/edit).
- [Statische posts, 43 ideeën](https://docs.google.com/spreadsheets/d/1YTzDiTs2QbTJ6P5UkECf8ICMVRtjb6TjdZbirkEyIGA/edit).

**Artifacts**

- [Takenlijst €100 MRR](https://claude.ai/artifact/64i83NhR9wv1Wuo8LkAJjw).
- [Advertentiekaart](https://claude.ai/artifact/XLQXFhhUxSCwpHEbZdhn3v).
- [Doelgroeponderzoek "Welke Gen Z is de klant?"](https://claude.ai/artifact/FHypzhhTJem594kCoaawAn).
- [Decembercampagne 2026](https://claude.ai/artifact/1Y9kc2X7FAY3znF5S9aDph).

**Notion-logboek**

- [PM-149](https://app.notion.com/p/4187350a04c881d9bc9ae13a50420f04).
- [Stappenplan Meta](https://app.notion.com/p/40e7350a04c8817c87abefcdb688a2df).

**Externe bronnen**

- CPM Instagram NL: [Searchlab, Meta-advertenties statistieken 2026](https://searchlab.nl/statistieken/meta-advertenties-advantage-statistieken-2026) en [Searchlab, wat kost Instagram adverteren](https://searchlab.nl/kosten/wat-kost-instagram-adverteren).
- Leerfase: [Jon Loomer, Is the learning phase changing?](https://www.jonloomer.com/qvt/is-the-learning-phase-changing/) en [PPC Land, ad sets onder 50 conversies per week](https://ppc.land/meta-says-ad-sets-under-50-weekly-conversions-cost-28-more-per-purchase/).
- Speciale advertentiecategorie: [Meta Marketing API, Special Ad Category](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category) en [Jon Loomer, Financial products and services](https://www.jonloomer.com/qvt/financial-products-and-services/).

**Audits in deze run:** Meta-gereedheid, budget, beleid (claude-ads-agents), Drive-inventaris en projectcontext (agents), plus framecontroles van 7 video's.

**Controle (15 nov):** een aparte agent die de opbouw niet had gezien, toetste dit document aan het bewijs.

- De rekensommen klopten.
- Aangepast na de controle:
  - de verwachting gaat nu uit van 3 campagnes (€180);
  - Q4-gevoeligheid toegevoegd;
  - eigen Clarity-data en het probleem met betalen in de Instagram-browser toegevoegd;
  - de compensatieklant correct beschreven;
  - bronnen die alleen uit Notion komen gemarkeerd;
  - kop C3-A1 kreeg "kan";
  - drempel op dag 7 verhoogd naar 1.500 vertoningen;
  - zorgnota's krijgen een waarschuwing over gezondheid;
  - uitleg dat Meta op een losse dag meer kan uitgeven dan het dagbudget.

**Bewijs:** contactbladen van de gecontroleerde video's in [`docs/bewijs-meta-ads-2026-11/`](bewijs-meta-ads-2026-11/). Screenshots van Meta of Instagram zijn er niet, omdat Chrome in deze sessie niet beschikbaar was.
