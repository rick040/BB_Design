# Betaalbuddy · Ideeënbacklog Reel- en Story-ads (PM-134)

Stand: 11 oktober 2026. Voorraad voor de dagelijkse taak met `/instagram-reel-ad`. Geef per dag de **ideeregel** van het idee mee in plaats van "bedenk er een". Na gebruik: zet het idee op "gemaakt" in de tabel en voeg het nieuwe concept toe aan de verzadigingskaart.

## A. Bronnencheck

| Bron | Gelezen | Wat opviel |
|---|---|---|
| Changelog (Drive, `CHANGELOG - BetaalBuddy`) | Ja | Nieuwste entry 11 okt (concept 1 en 2). "30 dagen geld terug" is nog niet gelijkgetrokken; betaallink in herinneringsmails nog niet bevestigd; geen proefperiode sinds 5 okt. |
| Repo `rick040/BB_Design`, `04. Animation` | Ja | Twee concepten: `CONCEPT.md` en `CONCEPT-2.md`. Het merkreferentiebestand staat niet in deze map maar in de skill (`references/brand-betaalbuddy.md`); die is gelezen. |
| Skill `/instagram-reel-ad` | Ja | Uniciteitstoets, letterlijk: "invalshoek, visueel systeem (UI-gedreven, typografisch, personage-gedreven…), wat Buddy doet, het soort einde en de overgangen". Minder dan 3 van 5 anders = terug. |
| betaalbuddy.nl | Deels | Home gelezen: nog "7 dagen gratis", "Probeer gratis", WhatsApp/Telegram, pakketnamen Buddy lite/Buddy/Buddy pro en cijfers zonder bron (€657, 73%). `/docs` is een leeg iframe naar de Vercel-docs; die en een losse prijzenpagina niet gelezen. Ads mogen de site dus nog niet volgen. |

Gebruikte productfeiten (changelog en skill winnen van de site): doorsturen naar je eigen adres, geen mailboxkoppeling, geen AI; Buddy leest bedrag en vervaldatum; mail op 7 en 2 dagen vooraf plus agenda (ICS); mailinhoud wordt niet bewaard; kan Buddy een rekening niet betrouwbaar lezen, dan komt er niets in je agenda en vraagt hij het je; filterregel per mailprovider kan het doorsturen automatisch doen; wekelijks overzicht; geen app, geen bankkoppeling.

Niet gebruikt: "30 dagen geld terug" (onbevestigd), betaallink in de herinnering (onbevestigd), prijzen, "gratis", WhatsApp/Telegram/Signal.

## B. Verzadigingskaart

| Concept | Invalshoek | Visueel systeem | Wat Buddy doet | Soort einde | Overgangen |
|---|---|---|---|---|---|
| 1 · "Stuur door. Buddy onthoudt." | Overzicht: volle inbox, aanmaning +€40 | UI-gedreven (inbox, mailkaart, chips, meldingen) | Slikt de rekening op | Belofte ("Nooit meer een betaling missen.") | Iris, slide |
| 2 · "7 · 2 · Betaald." | Timing: "heb ik dat al betaald?" | Typografisch (reuzengetal 7 naar 2) | Rijdt mee op het getal | Uitkomst ("Betaald.") | Clock-wipe, slide |

**Verzadigd**
- De inbox en de mailkaart als decor, en de stapel lockscreen-meldingen (in beide concepten).
- Aanmaning en "vervalt morgen" als pijn; de getallen 7 en 2 als visueel motief.
- Slide-overgangen (beide), en Buddy die iets "doet met de rekening zelf" (eten, erop staan).
- Haaktype: directe vraag aan de kijker.

**Kansen (leeg)**
- Levensmomenten: verhuizen, eerste huurhuis, net uit huis, achteraf betalen, zorgnota's, vakantie. Nog niets mee gedaan.
- Invalshoeken privacy, mental load, "één keer instellen", eerlijkheid ("kon ik niet lezen").
- Animatievormen kalender als hoofdrol, tijdlijn, split screen, objectanimatie (papier, dozen, post-its), lus.
- Haaktypes POV, visuele grap, tegenstelling, herkenbare situatie zonder vraag.
- Eindes zonder belofte: punchline, rust, lus, contrast dat oplost.

## Stap 3 en 4 · 40 ruwe ideeën en het filter

| # | Idee | Uitslag |
|---|---|---|
| 1 | Verhuurdermail van 3 weken geleden (zoekbalk) | Door |
| 2 | Verhuisdoos vol post | Door |
| 3 | POV: je eerste eigen brievenbus | Door |
| 4 | Split screen zonder en met Buddy | Door |
| 5 | Je hoofd is geen agenda | Door |
| 6 | Salaris de 25e, rekening de 20e | Af: juistheid en beleid. Een herinnering lost geldgebrek niet op en het raakt aan financiële krapte |
| 7 | Achteraf-betaal-toren | Door |
| 8 | Buddy blijft buiten de deur (privacy) | Door |
| 9 | Maandagochtend weekoverzicht | Door, maar onder de streep (reserve). Inhoud en dag van het overzicht niet bevestigd |
| 10 | Tandarts in juni, nota in augustus | Door |
| 11 | Ping, ping, vinkje als ritme-lus | Af: uniciteit. Getallen 7/2 als typografie lijken te veel op concept 2 |
| 12 | "Doorsturen kost 3 seconden" | Af: juistheid. Tijdclaim zonder bron |
| 13 | Huisgenoten-chat: wie betaalde energie? | Af: juistheid. Suggereert een gedeelde-huishouden-functie; chat-UI lijkt op een ander merk |
| 14 | Post-its op de koelkast | Door |
| 15 | "Kon ik niet lezen" (Buddy vraagt het je) | Door |
| 16 | Eerste loonstrook naast vaste lasten | Af: uniciteit, te dicht op 6 en 32 |
| 17 | Gemeentelijke belastingen in termijnen | Af: juistheid. Niet bevestigd dat termijnen goed gelezen worden |
| 18 | Abonnement loopt door na proefmaand | Af: juistheid. Betaalbuddy herinnert niet aan verlengingen |
| 19 | "Ben jij ook slecht met geld?" | Af: Meta-beleid (persoonlijke financiële eigenschap) |
| 20 | "€657 per jaar aan boetes" | Af: cijfer zonder bron |
| 21 | Buddy de postbode op de fiets | Door, maar onder de streep (reserve). Lage pijn, zwaar om te bouwen |
| 22 | Eén keer instellen (lus) | Door |
| 23 | Vakantie: rekening vervalt als je weg bent | Door |
| 24 | Verhuischecklist met één leeg vakje | Door |
| 25 | "Je pakket is onderweg" lijkt op "je termijn loopt af" | Af: uniciteit. Meldingenstapel is verzadigd en het lijkt op 7 |
| 26 | Herinnering ondergesneeuwd door nieuwsbrieven | Af: uniciteit, is concept 1 |
| 27 | Aftellen naar de vervaldatum | Af: uniciteit, is concept 2 |
| 28 | Agenda-zoom: het staat er gewoon | Door |
| 29 | "Geen app. Geen bankkoppeling. Geen meelezen." | Door |
| 30 | Eerste werkdag en de eindafrekening van je oude huis | Af: uniciteit, te dicht op 4 en 24 |
| 31 | Later, later, later (wegswipen) | Door |
| 32 | De kassabon van op jezelf wonen | Door |
| 33 | "Wie onthoudt dit allemaal?" | Af: uniciteit, te dicht op 5 |
| 34 | Sleutelbos: elke sleutel een rekening | Af: haak. Zonder geluid niet te snappen |
| 35 | Zoeken in je bankapp | Af: uniciteit met 1 en een bank-UI lijkt op een merk |
| 36 | 02:14, wakker van een rekening | Door |
| 37 | Envelop-Jenga | Af: uniciteit, te dicht op 7 |
| 38 | Je moeder belt: "al betaald?" | Door |
| 39 | Rekeningen aan een waslijn | Af: haak. Beeld zegt niets in 1,5 s |
| 40 | Wat Buddy ziet en niet ziet (split) | Door |

Over: 22 ideeën. Na scoren gaan de 20 hoogste door; 9 en 21 blijven reserve. Ruim de helft (onder meer 2, 3, 4, 6, 7, 10, 12, 13, 15, 16, 18, 19, 20 hieronder) zit op een lege plek uit de kaart.

## C. Top 20

Score = haakkracht + herkenbaarheid pijn + helderheid product + bouwgemak (elk 1 tot 5).

| # | Titel | Plaatsing | Bewustzijn | Levensmoment | Haaktype | Animatievorm | Score |
|---|---|---|---|---|---|---|---|
| 1 | De verhuurdermail van 3 weken geleden | Reel | Probleem bewust | Op jezelf | Herkenbare situatie | UI-mockup (zoekbalk) | 18 |
| 2 | "Ja mam" | Reel | Probleem niet bewust | Net uit huis | POV | UI-mockup (inkomend gesprek) | 18 |
| 3 | Later, later, later | Story | Probleem bewust | Dagelijkse drukte | Visuele grap | Telefoonnotificaties (swipe) | 17 |
| 4 | De kassabon van op jezelf wonen | Reel | Probleem niet bewust | Op jezelf | Visuele grap | Objectanimatie (papier) | 17 |
| 5 | 02:14 | Reel | Probleem niet bewust | Dagelijkse drukte | Herkenbare situatie | Objectanimatie (nachtscène) | 17 |
| 6 | De wiebeltoren | Reel | Probleem niet bewust | Achteraf betalen | Visuele grap | Objectanimatie (dozen) | 17 |
| 7 | Tandarts in juni, nota in augustus | Reel | Probleem bewust | Zorgkosten | Tegenstelling | Tijdlijn | 17 |
| 8 | Zonder of met | Reel | Oplossing bewust | Aanmaning | Tegenstelling | Split screen | 16 |
| 9 | De koelkastdeur | Beide | Probleem bewust | Op jezelf | Herkenbare situatie | Objectanimatie (post-its) | 16 |
| 10 | POV: je eerste eigen brievenbus | Story | Probleem niet bewust | Op jezelf | POV | Kinetische typografie | 16 |
| 11 | De verhuischecklist | Story | Probleem niet bewust | Verhuizen | Herkenbare situatie | Kinetische typografie (checklist) | 16 |
| 12 | Rekening in je vakantie | Reel | Probleem niet bewust | Vakantie | Getal (datum) | Kalender | 16 |
| 13 | Het staat er gewoon | Beide | Product bewust | Dagelijkse drukte | Visuele grap | Kalender (camera-zoom) | 16 |
| 14 | Geen. Geen. Geen. | Story | Oplossing bewust | Twijfel bij aanmelden | Ritme | Kinetische typografie (stempels) | 16 |
| 15 | Wat Buddy ziet | Story | Product bewust | Privacy | Tegenstelling | Split screen (blur) | 16 |
| 16 | De verhuisdoos | Reel | Probleem niet bewust | Verhuizen | Visuele grap | Objectanimatie (dozen) | 15 |
| 17 | "Kon ik niet lezen" | Reel | Product bewust | Twijfel bij aanmelden | Vraag | UI-mockup (mail + cursor) | 15 |
| 18 | Eén keer instellen | Story | Oplossing bewust | Dagelijkse drukte | Ritme | Lus | 15 |
| 19 | Je hoofd is geen agenda | Reel | Probleem niet bewust | Dagelijkse drukte | Tegenstelling | Objectanimatie (morph) | 14 |
| 20 | Buddy blijft buiten | Story | Oplossing bewust | Privacy | Tegenstelling | Objectanimatie (huis, deur) | 14 |

### Uniciteitsmatrix (vijf punten per idee)

| # | Invalshoek | Visueel systeem | Wat Buddy doet | Soort einde | Overgangen |
|---|---|---|---|---|---|
| 1 | Kwijt, terugzoeken | UI-gedreven (zoekbalk) | Prikt een agenda-item vast | Uitkomst: staat in je agenda | Zoom-through |
| 2 | Ouders checken je | UI-gedreven (gesprek, ondertitels) | Fluistert het antwoord voor | Punchline | Call-swipe omhoog |
| 3 | Uitstel | UI-gebaar (lockscreen) | Komt steeds terug (boemerang) | Lus die breekt | Swipe-push |
| 4 | Nieuwe vaste lasten | Objectanimatie (papier) | Knipt de bon in stukken | Orde | Papierscheur |
| 5 | Onrust 's nachts | Personage-scène (nacht) | Slaapt met slaapmasker | Rust (licht uit) | Lamp aan/uit |
| 6 | Achteraf betalen stapelt | Objectanimatie (dozen) | Plakt datumstickers | Orde (kast) | Toren valt om |
| 7 | Vertraagde rekening | Tijdlijn | Loopt mee, zet een vlag | Uitkomst (vlag op tijd) | Doorlopende pan |
| 8 | Contrast | Split screen | Duwt de scheidslijn weg | Contrast lost op | Split-merge |
| 9 | Eigen systeem faalt | Objectanimatie (koelkast) | Trekt post-its eraf | Lege deur | Page-curl |
| 10 | Eerste keer zelf | Kinetische typografie (POV) | Kruipt uit de brievenbus | Vraag en antwoord | Hard cuts op de beat |
| 11 | Het vergeten puntje | Typografische checklist | Springt in het lege vakje | Alles afgevinkt | Doorhaal-wipe |
| 12 | Afwezigheid | Kalender | Pakt een koffer | Geregeld vóór vertrek | Kalenderblad-flip |
| 13 | Agenda als vaste plek | Kalender + camera | Woont in de agendacel | Uitkomst | Zoom-out |
| 14 | Drempel weg | Kinetische typografie (stempels) | Stempelt met zijn lijf | Belofte | Stempel-impact |
| 15 | Privacy | Split screen (blur) | Handen voor zijn ogen | Belofte | Blur-wipe |
| 16 | Verhuischaos | Objectanimatie (dozen) | Duikt in een doos | Contrast (dozen dicht, rekening geregeld) | Doosklep-mask |
| 17 | Eerlijkheid, geen gok | UI-gedreven (mail, cursor) | Krabt zich, vraagteken | Vraag en antwoord | Cursor-reveal |
| 18 | Eén keer instellen | Lus | Vangt, steeds sneller | Naadloze lus | Geen (lus) |
| 19 | Mental load | Vorm-morph (hoofd) | Vangt vallende datums | Rust (adem) | Morph |
| 20 | Privacy | Objectanimatie (huis) | Wacht buiten, krijgt envelop | Belofte | Deur-wipe |

Elk paar verschilt op minimaal 3 van de 5 punten, ook ten opzichte van concept 1 en 2. De krapste paren (precies 3): 1 en 13, 10 en 14, 15 en 20.

## D. Ideekaarten

Vaste afsluiter voor alle ideeën: knop "activeer buddy" met woordmerk en "Geen app. Geen bankkoppeling.", Ads Manager-knop "Aanmelden".

### 1 · De verhuurdermail van 3 weken geleden
- **Kerninzicht:** "Ik weet dat die mail er is, maar ik vind hem niet meer."
- **Haak 0 tot 1,5 s:** telefoon, zoekbalk in een mailapp (generiek), typt "verhuurder". Tekst: "Waar was die mail nou?" Resultaat: 0 in de juiste maand.
- **Verloop:** 0 tot 3 s zoeken en scrollen, niets; 3 tot 6 s zelfde mail, maar nu "Doorsturen" naar jouwcode@in.betaalbuddy.nl; 6 tot 10 s zoom door de zoekbalk heen de agenda in, Buddy prikt het item vast op de vervaldag; 10 tot 14 s CTA.
- **Productmoment:** doorsturen, en de vervaldatum verschijnt als agenda-item (ICS).
- **Uniciteit:** wijkt op 4 punten af van concept 1 (invalshoek, Buddy, einde, overgang).
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Een zoekbalk vindt de mail van de verhuurder niet terug; na één keer doorsturen staat de vervaldatum gewoon in je agenda, Buddy prikt hem vast, overgang is een zoom door de zoekbalk."

### 2 · "Ja mam"
- **Kerninzicht:** "Elke keer als mijn moeder belt, vraagt ze of ik mijn zorgverzekering al betaald heb."
- **Haak 0 tot 1,5 s:** inkomend gesprek "Mam", ondertitel verschijnt al: "Heb je die rekening al…"
- **Verloop:** 0 tot 3 s gesprek met ondertitels; 3 tot 7 s jij twijfelt, Buddy duikt op en fluistert "Staat in je agenda, 7 dagen vooraf krijg je een mail"; 7 tot 10 s agenda flitst in beeld; 10 tot 12 s punchline-ondertitel: "Ja mam. Geregeld."; 12 tot 15 s CTA.
- **Productmoment:** mail op 7 en 2 dagen vooraf plus agenda.
- **Uniciteit:** 4 punten anders dan concept 1, 5 dan concept 2.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "POV-gesprek met 'Mam' als ondertitels die vraagt of je al betaald hebt; Buddy fluistert het antwoord voor (agenda plus mail 7 en 2 dagen vooraf) en het eindigt op de punchline 'Ja mam. Geregeld.', overgang is een call-swipe omhoog."

### 3 · Later, later, later
- **Kerninzicht:** "Ik swipe die herinnering weg en denk: doe ik straks."
- **Haak 0 tot 1,5 s:** duim swipet een melding "Rekening Energieleverancier" weg. Tekst: "Later."
- **Verloop:** 0 tot 4 s drie keer wegswipen, tekst "Later. Later. Later."; 4 tot 8 s de melding komt als boemerang terug met Buddy erop: "Nog 7 dagen" en daarna "Nog 2 dagen"; 8 tot 11 s duim tikt eindelijk; 11 tot 14 s CTA.
- **Productmoment:** de tweede herinnering op T-2, zonder te beloven dat Buddy blijft zeuren.
- **Uniciteit:** 5 punten anders dan concept 2, 4 dan concept 1.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Story: een duim swipet een rekeningmelding steeds weg ('Later. Later.') en Buddy komt als boemerang terug op 7 en 2 dagen vooraf, de lus breekt als de duim tikt, overgangen zijn swipe-pushes."

### 4 · De kassabon van op jezelf wonen
- **Kerninzicht:** "Ik wist niet dat op jezelf wonen zoveel losse rekeningen betekende."
- **Haak 0 tot 1,5 s:** een kassabon rolt van boven het beeld in, eindeloos lang. Tekst: "Op jezelf wonen:"
- **Verloop:** 0 tot 4 s bon rolt: Huur, Energie, Water, Internet, Zorg, Gemeente, Telefoon; 4 tot 8 s Buddy knipt de bon in stukjes; 8 tot 11 s elk stukje vliegt naar een dag in de kalender; 11 tot 14 s CTA.
- **Productmoment:** elke doorgestuurde rekening krijgt zijn eigen datum in de agenda.
- **Uniciteit:** 5 punten anders dan concept 1 en 2.
- **Bronnen:** geen bedragen, alleen generieke posten.
- **Ideeregel:** "Een eindeloze kassabon van vaste lasten bij op jezelf wonen; Buddy knipt hem in stukjes en elk stukje landt als datum in de agenda, overgang is een papierscheur."

### 5 · 02:14
- **Kerninzicht:** "Ik lig wakker en denk ineens: was die rekening nou de 20e?"
- **Haak 0 tot 1,5 s:** donkerblauwe (#111827) slaapkamer in vlakke vormen, wekker 02:14, gedachtewolk "Was die nou de 20e?"
- **Verloop:** 0 tot 4 s woelen; 4 tot 7 s lamp aan, op de telefoon stuur je de rekening door; 7 tot 10 s agenda-item verschijnt, Buddy zet zijn slaapmasker op; 10 tot 12 s lamp uit, rust; 12 tot 15 s CTA.
- **Productmoment:** doorsturen en agenda.
- **Uniciteit:** 5 punten anders dan beide concepten.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Nachtscène om 02:14 met de gedachte 'Was die nou de 20e?'; na doorsturen staat hij in de agenda, Buddy zet zijn slaapmasker op en het licht gaat uit, overgangen zijn lamp aan/uit."

### 6 · De wiebeltoren
- **Kerninzicht:** "Al die keren achteraf betalen voelen los klein, maar samen wordt het een stapel."
- **Haak 0 tot 1,5 s:** pakketdozen vallen op elkaar, elk met een label "Betaal later". Toren wiebelt.
- **Verloop:** 0 tot 4 s toren groeit; 4 tot 6 s toren valt om (de overgang); 6 tot 10 s Buddy plakt op elke doos een datumsticker, dozen schuiven als vakken in een kalenderkast; 10 tot 14 s CTA.
- **Productmoment:** factuur van een achterafbetaalpartij doorsturen, datum in de agenda.
- **Uniciteit:** 5 punten anders dan beide concepten.
- **Bronnen:** geen cijfers, geen merknamen.
- **Ideeregel:** "Pakketdozen met 'Betaal later' stapelen tot een wiebeltoren die omvalt; Buddy plakt datumstickers en de dozen worden een nette kalenderkast, overgang is de vallende toren."

### 7 · Tandarts in juni, nota in augustus
- **Kerninzicht:** "Die nota komt pas als ik allang vergeten ben dat ik er was."
- **Haak 0 tot 1,5 s:** horizontale tijdlijn, links "Tandarts · juni", rechts "Nota · augustus".
- **Verloop:** 0 tot 3 s camera pant over de tijdlijn; 3 tot 6 s nota komt binnen, doorsturen; 6 tot 10 s Buddy loopt mee en zet vlaggen op 7 en 2 dagen vóór de vervaldatum; 10 tot 14 s CTA.
- **Productmoment:** herinneringen op T-7 en T-2 als vlaggen op de tijdlijn.
- **Uniciteit:** 5 punten anders dan concept 1, 4 dan concept 2.
- **Bronnen:** geen cijfers ("weken later" in plaats van een termijn).
- **Ideeregel:** "Een tijdlijn van tandartsbezoek in juni tot de nota in augustus; Buddy loopt mee en zet vlaggen op 7 en 2 dagen voor de vervaldatum, één doorlopende camerapan zonder harde overgangen."

### 8 · Zonder of met
- **Kerninzicht:** "Het is dezelfde rekening, alleen weet ik het de ene keer op tijd."
- **Haak 0 tot 1,5 s:** twee identieke telefoons naast elkaar, links "zonder", rechts "met". Zelfde rekening.
- **Verloop:** 0 tot 4 s links stilte, dan een kaart "Aanmaning" (donker, geen rood); rechts "Nog 7 dagen"; 4 tot 8 s rechts "Nog 2 dagen", betaald; 8 tot 11 s Buddy duwt de scheidslijn naar links tot alleen "met" overblijft; 11 tot 14 s CTA.
- **Productmoment:** de twee herinneringen naast elkaar tegenover niets.
- **Uniciteit:** 4 punten anders dan concept 1 (invalshoek, visueel, Buddy, overgang).
- **Bronnen:** optioneel "kan uitlopen op €40". Bron: Besluit vergoeding voor buitengerechtelijke incassokosten, art. 2 (minimum €40) en art. 6:96 lid 6 BW (eerst een veertiendagenbrief). Zet de bron dan in de caption.
- **Ideeregel:** "Split screen met twee telefoons en dezelfde rekening: links komt een aanmaning, rechts herinneringen 7 en 2 dagen vooraf; Buddy duwt de scheidslijn weg tot alleen 'met' overblijft."

### 9 · De koelkastdeur
- **Kerninzicht:** "Mijn systeem is een post-it op de koelkast, en die valt eraf."
- **Haak 0 tot 1,5 s:** koelkastdeur vol post-its ("Zorg 20e?", "Energie!!"), één dwarrelt naar beneden.
- **Verloop:** 0 tot 4 s post-its vallen een voor een; 4 tot 8 s Buddy trekt ze eraf, elk krult om (page-curl) en wordt een agenda-item; 8 tot 11 s lege deur met één magneet: Buddy; 11 tot 14 s CTA.
- **Productmoment:** agenda in plaats van briefjes.
- **Uniciteit:** 5 punten anders dan beide concepten.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Een koelkastdeur vol post-its met rekeningen die eraf vallen; Buddy trekt ze eraf en elk krult om tot agenda-item, het eindigt met een lege deur, overgang is een page-curl."

### 10 · POV: je eerste eigen brievenbus
- **Kerninzicht:** "Niemand vertelde me dat de post nu van mij is."
- **Haak 0 tot 1,5 s:** grote tekst "POV: je eerste eigen brievenbus". Klep klapt.
- **Verloop:** hard cuts op de beat, 0 tot 6 s: "Rekening." "Nog een." "Wie regelt dit?"; 6 tot 9 s Buddy kruipt uit de brievenbus: "Stuur ze door."; 9 tot 11 s "Ik onthoud de datum."; 11 tot 13 s CTA.
- **Productmoment:** doorsturen, Buddy onthoudt de vervaldatum.
- **Uniciteit:** 4 punten anders dan concept 2 (invalshoek, Buddy, einde, overgang).
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Story met kinetische typografie 'POV: je eerste eigen brievenbus', korte zinnen op harde cuts, en Buddy die aan het eind uit de brievenbus kruipt met 'Stuur ze door.'"

### 11 · De verhuischecklist
- **Kerninzicht:** "Ik had alles geregeld voor de verhuizing, behalve de rekeningen."
- **Haak 0 tot 1,5 s:** checklist: ✓ Dozen ✓ Sleutels ✓ Internet ☐ Rekeningen.
- **Verloop:** 0 tot 3 s vinkjes ploppen; 3 tot 6 s het lege vakje knippert; 6 tot 9 s Buddy springt in het vakje, tekst "Stuur ze door naar Buddy"; 9 tot 11 s vinkje, doorhaal-wipe naar CTA; 11 tot 13 s CTA.
- **Productmoment:** doorsturen als het ontbrekende vinkje.
- **Uniciteit:** 5 punten anders dan concept 1, 4 dan concept 2.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Story: verhuischecklist met alles afgevinkt behalve 'Rekeningen'; Buddy springt in het lege vakje en vinkt het af, overgang is een doorhaal-wipe."

### 12 · Rekening in je vakantie
- **Kerninzicht:** "De vervaldatum valt precies in de week dat ik weg ben."
- **Haak 0 tot 1,5 s:** kalender met een vakantieblok (zon-icoon), midden erin een rekening-chip.
- **Verloop:** 0 tot 3 s rekening valt in het vakantieblok; 3 tot 6 s kalenderblad flipt terug naar 7 dagen eerder: mail "Nog 7 dagen"; 6 tot 9 s Buddy legt de herinnering bovenop je koffer, jij betaalt; 9 tot 11 s vakantieblok zonder chip; 11 tot 14 s CTA.
- **Productmoment:** herinnering 7 dagen vooraf, dus vóór vertrek.
- **Uniciteit:** 5 punten anders dan concept 1, 4 dan concept 2.
- **Bronnen:** geen cijfers. Werkt voor herfstvakantie en kerst.
- **Ideeregel:** "Kalender met een vakantieblok waarin een rekening vervalt; het blad flipt terug naar de herinnering 7 dagen vooraf en Buddy legt hem op je koffer, zodat hij geregeld is vóór vertrek."

### 13 · Het staat er gewoon
- **Kerninzicht:** "Ik kijk toch al elke dag in mijn agenda."
- **Haak 0 tot 1,5 s:** extreem close-up van één agendacel met Buddy die erin zit te zwaaien. Tekst: "Wie woont hier?"
- **Verloop:** 0 tot 4 s zoom-out: dag, week, maand; 4 tot 8 s in elke rekeningcel zit een mini-Buddy met bedrag en naam; 8 tot 11 s tekst "Je vervaldatums staan gewoon in je agenda."; 11 tot 14 s CTA.
- **Productmoment:** de ICS-agendalink.
- **Uniciteit:** 4 punten anders dan concept 1, 5 dan concept 2.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Buddy woont in een agendacel; de camera zoomt uit van dag naar maand en in elke rekeningcel zit een mini-Buddy, tekst 'Je vervaldatums staan gewoon in je agenda.'"

### 14 · Geen. Geen. Geen.
- **Kerninzicht:** "Weer een app, weer een koppeling met mijn bank? Nee dank je."
- **Haak 0 tot 1,5 s:** woord "Geen app." slaat in beeld met een impact-frame.
- **Verloop:** 0 tot 4 s Buddy stempelt met zijn lijf: "Geen app." "Geen bankkoppeling." "Geen meelezen."; 4 tot 8 s "Wel: je stuurt een rekening door."; 8 tot 11 s "Buddy zet hem in je agenda."; 11 tot 13 s CTA.
- **Productmoment:** doorsturen als enige handeling.
- **Uniciteit:** 4 punten anders dan concept 2.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Story met stempeltypografie: Buddy stempelt met zijn lijf 'Geen app.', 'Geen bankkoppeling.', 'Geen meelezen.' en dan 'Wel: je stuurt een rekening door.'"

### 15 · Wat Buddy ziet
- **Kerninzicht:** "Ik wil niet dat iets mijn hele mailbox leest."
- **Haak 0 tot 1,5 s:** split screen. Links "Jouw inbox" (geblurde blokken), rechts "Wat Buddy ziet" (leeg).
- **Verloop:** 0 tot 3 s Buddy houdt zijn handen voor zijn ogen bij links; 3 tot 6 s één doorgestuurde rekening verschijnt rechts; 6 tot 9 s Buddy haalt bedrag en datum eruit, de mail zelf lost op; 9 tot 11 s "Alleen wat jij doorstuurt."; 11 tot 14 s CTA.
- **Productmoment:** geen inbox-scan, mailinhoud wordt weggegooid.
- **Uniciteit:** 5 punten anders dan concept 1 en 2.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Story in split screen: links je geblurde inbox waar Buddy zijn handen voor zijn ogen houdt, rechts alleen de ene doorgestuurde rekening, waarna de mail zelf oplost; overgang is een blur-wipe."

### 16 · De verhuisdoos
- **Kerninzicht:** "Ergens in die dozen zit een rekening die nu al loopt."
- **Haak 0 tot 1,5 s:** doos klapt open, post vliegt eruit.
- **Verloop:** 0 tot 4 s dozen stapelen, een envelop "Gemeente" verdwijnt in een doos; 4 tot 8 s Buddy duikt de doos in en vist hem eruit, doorsturen; 8 tot 11 s contrast: dozen nog dicht, rekening staat in je agenda; 11 tot 14 s CTA via een doosklep-mask.
- **Productmoment:** doorsturen en agenda.
- **Uniciteit:** 5 punten anders dan concept 1, 5 dan concept 2.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Verhuisdozen waarin een rekening van de gemeente verdwijnt; Buddy duikt erin en vist hem eruit, eindbeeld: dozen nog dicht, rekening al in de agenda, overgang via doosflappen."

### 17 · "Kon ik niet lezen"
- **Kerninzicht:** "Wat als zo'n ding een verkeerde datum pakt?"
- **Haak 0 tot 1,5 s:** mail met een rommelige vervaldatum, Buddy met een vraagteken boven zijn hoofd.
- **Verloop:** 0 tot 3 s Buddy krabt zich; 3 tot 6 s tekst "Niet zeker? Dan zet Buddy niets in je agenda."; 6 tot 9 s mail aan jou: "Wat is de vervaldatum?", cursor typt "28 oktober"; 9 tot 11 s agenda-item verschijnt; 11 tot 14 s CTA.
- **Productmoment:** bij twijfel vraagt Buddy het je in plaats van te gokken (vul-in-adres).
- **Uniciteit:** 4 punten anders dan concept 1.
- **Bronnen:** geen cijfers; claim staat op de homepage en in de docs.
- **Ideeregel:** "Buddy krijgt een rekening met een onduidelijke datum, krabt zich en zet niets in je agenda; hij mailt je de vraag, een cursor typt de datum en pas dan verschijnt het agenda-item."

### 18 · Eén keer instellen
- **Kerninzicht:** "Ik ga echt niet elke rekening met de hand doorsturen."
- **Haak 0 tot 1,5 s:** envelop valt, Buddy vangt hem, agenda-item. Tekst: "Rekening 1."
- **Verloop:** naadloze lus, telkens sneller: "Rekening 2", "Rekening 3", "Rekening 12"; halverwege tekst "Eén filterregel. Daarna gaat het vanzelf."; eindigt in hetzelfde beeld als frame 0, met CTA erover.
- **Productmoment:** automatische filterregel bij je mailprovider.
- **Uniciteit:** 5 punten anders dan concept 1 en 2.
- **Bronnen:** geen cijfers; filterregels staan in de docs.
- **Ideeregel:** "Story als naadloze lus: enveloppen vallen, Buddy vangt ze en zet ze in de agenda, steeds sneller, met 'Eén filterregel. Daarna gaat het vanzelf.'"

### 19 · Je hoofd is geen agenda
- **Kerninzicht:** "Ik probeer alle datums te onthouden en dat lukt gewoon niet."
- **Haak 0 tot 1,5 s:** hoofdsilhouet in vlakke vormen vol datums. Tekst: "Je hoofd is geen agenda."
- **Verloop:** 0 tot 4 s datums vallen uit het hoofd; 4 tot 8 s Buddy vangt ze en het hoofd morpht naar een kalender; 8 tot 11 s het hoofd is leeg, één rustige ademhaling; 11 tot 14 s CTA.
- **Productmoment:** agenda in plaats van onthouden.
- **Uniciteit:** 5 punten anders dan concept 1 en 2.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Een hoofdsilhouet vol datums die eruit vallen; Buddy vangt ze en het hoofd morpht naar een kalender, het eindigt op rust."

### 20 · Buddy blijft buiten
- **Kerninzicht:** "Ik laat niemand zomaar binnen in mijn mail."
- **Haak 0 tot 1,5 s:** huisje met een dichte deur, Buddy staat buiten op de stoep. Tekst: "Hij komt niet binnen."
- **Verloop:** 0 tot 4 s Buddy wacht; 4 tot 7 s door de brievenbus wordt een rekening naar buiten geschoven; 7 tot 10 s Buddy pakt hem, haalt de datum eruit, de deur blijft dicht; 10 tot 12 s "Alleen wat jij doorstuurt."; 12 tot 14 s CTA via een deur-wipe.
- **Productmoment:** geen mailboxkoppeling.
- **Uniciteit:** 5 punten anders dan concept 1 en 2; 3 punten anders dan idee 15.
- **Bronnen:** geen cijfers.
- **Ideeregel:** "Story: Buddy staat buiten een huis met een dichte deur en krijgt alleen de rekening die door de brievenbus wordt geschoven, tekst 'Alleen wat jij doorstuurt.', overgang is een deur-wipe."

### Reserves (filters gehaald, onder de streep)
- **R1 · Buddy de postbode:** Buddy fietst door een straat en bezorgt herinneringen. Score 11.
- **R2 · Maandagochtend:** het wekelijkse overzicht als rustmoment. Score 13. Eerst bevestigen wat er in het overzicht staat en op welke dag het komt.

## E. Rotatieplan 4 weken

Opeenvolgende dagen hebben nooit hetzelfde levensmoment of dezelfde animatievorm.

| Datum | Idee | Levensmoment | Animatievorm |
|---|---|---|---|
| ma 12 okt | 1 | Op jezelf | UI-mockup |
| di 13 okt | 7 | Zorgkosten | Tijdlijn |
| wo 14 okt | 4 | Op jezelf | Objectanimatie |
| do 15 okt | 2 | Net uit huis | UI-mockup |
| vr 16 okt | 6 | Achteraf betalen | Objectanimatie |
| za 17 okt | 8 | Aanmaning | Split screen |
| zo 18 okt | 5 | Dagelijkse drukte | Objectanimatie |
| ma 19 okt | 10 | Op jezelf | Kinetische typografie |
| di 20 okt | 3 | Dagelijkse drukte | Telefoonnotificaties |
| wo 21 okt | 16 | Verhuizen | Objectanimatie |
| do 22 okt | 12 | Vakantie | Kalender |
| vr 23 okt | 9 | Op jezelf | Objectanimatie |
| za 24 okt | 15 | Privacy | Split screen |
| zo 25 okt | 19 | Dagelijkse drukte | Objectanimatie |
| ma 26 okt | 11 | Verhuizen | Kinetische typografie |
| di 27 okt | 20 | Privacy | Objectanimatie |
| wo 28 okt | 13 | Dagelijkse drukte | Kalender |
| do 29 okt | 17 | Twijfel bij aanmelden | UI-mockup |
| vr 30 okt | 18 | Dagelijkse drukte | Lus |
| za 31 okt | 14 | Twijfel bij aanmelden | Kinetische typografie |
| zo 1 nov | R1 | Algemeen | Personage-scène |
| ma 2 nov | R2 | Dagelijkse drukte | UI-mockup |
| di 3 t/m zo 8 nov | Nieuwe ronde | Draai PM-134 opnieuw rond 30 okt | |

## F. Open punten

1. **Huisstijl botst.** PM-134 zegt Archivo Black en Poppins, #E8EEFF en geen rood. Het Remotion-project en de skill gebruiken Space Grotesk en Geist, #FAFBFF en #B6C7FF, en een rode urgentiekleur (#FF5A79, onder meer "Vervalt morgen" in concept 2). Welke is leidend? Deze ideeën gebruiken geen rood.
2. **30 dagen geld terug.** Staat in PM-134 als feit, maar is volgens de changelog nog niet gelijkgetrokken en de skill verbiedt het. Niet gebruikt.
3. **Website spreekt de ads tegen.** De homepage zegt nog "7 dagen gratis", WhatsApp/Telegram, Buddy lite/pro en cijfers zonder bron. Zolang dat zo is, landt een kijker op een andere belofte dan de ad. Deadline in de changelog: 21 oktober.
4. **Betaallink in de herinnering** is niet bevestigd; geen idee leunt erop.
5. **Wekelijks overzicht:** inhoud en dag niet bevestigd (daarom R2 als reserve).
6. **Idee 1** werkt alleen als de verhuurder een factuur mailt (bijvoorbeeld servicekosten); huur gaat vaak via een vaste overboeking.
7. **Meta speciale advertentiecategorie:** in Ads Manager controleren of Betaalbuddy onder "financiële producten en diensten" valt. Ik heb dat niet kunnen verifiëren.
8. **Niet gelezen:** de Vercel-docs en een losse prijzenpagina.
9. **Instappagina** voor "activeer buddy" en link in bio staat nog open.
