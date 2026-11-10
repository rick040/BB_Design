# BetaalBuddy: merk, product en copyregels

Stand van 10 november 2026 (prijzen, 'geen AI' en USP-rotatie toegevoegd). Check de BetaalBuddy-changelog in Drive voor wijzigingen. Wint de changelog, werk dit bestand dan bij.

## Inhoud
1. Merk (kleuren, fonts, Buddy, assets)
2. Product: wat waar is
3. Copyregels: wat niet mag en waarom
4. Invalshoeken (en waar je ziet wat al gemaakt is)

---

## 1. Merk

### Kleuren (gemeten uit de assets; staan als tokens in `src/theme.ts`)
| Token | Hex | Gebruik |
|---|---|---|
| blue | `#013BFF` | Hoofdachtergrond, koppen op licht |
| blueMid | `#2459FD` | Pijlcirkel CTA, kalendertegel, middenlaag app-icoon |
| blueMascot | `#0046E2` | Ogen van witte Buddy, lijf van blauwe Buddy (logo) |
| blueSoft | `#B6C7FF` | "betaal" in woordmerk, reuzengetallen, accenten op blauw |
| blueText | `#99B1FF` | Lopende tekst op blauw |
| light | `#FAFBFF` | Lichte achtergrond |
| grey | `#E8EDF2` | Icoon-cirkel, skeleton-balken, chips |
| greyText | `#B1AFB2` | Subtitel en tijd in meldingen |
| yellow / red / teal | `#FFCE31` / `#FF5A79` / `#4FD1D9` | Waarschuwing, urgent, NEW-badge |

Ritme: wissel blauwe en lichte scènes af. Een lichte scène voelt als "probleem" of "uitkomst", een blauwe als "Buddy aan het werk".

### Typografie
- **Koppen:** Space Grotesk Medium (500), tracking −0.06em, line-height ~1.0, gecentreerd. Woordmerk: Space Grotesk Bold (700).
- **Lopende tekst:** Space Grotesk Regular, licht positieve tracking.
- **UI (meldingen, kaarten):** Geist (400 tot 600).
- Beide fonts zitten in `public/fonts` (SIL OFL) en worden geladen in `src/theme.ts`. Gebruik geen Google Fonts-CDN, zodat renderen offline werkt.

### Buddy (mascotte)
- **Vorm:** een "B"-vorm met twee ogen en een lichtpuntje onderin elk oog. Pad en ooggeometrie komen uit `01. Logo/SVG/Asset 19vector.svg`. Hij heeft geen mond.
- **Op blauw:** wit lijf met blauwe ogen (`#0046E2`). **Op licht:** blauw lijf met witte ogen.
- **Animatie:** squash en stretch (de `squash`-prop), knipperen (`blinkScale`), kijken (de `look`-prop, −1 tot 1), en "blij" = ogen bijna dicht (blink ~0.18).
- **Persoonlijkheid:** behulpzaam, een beetje grappig, nooit belerend. Hij doet iets (vangen, springen, op iets staan) in plaats van alleen te staan.

### Assets in de repo
- `01. Logo/`: mascotte (wit en blauw), woordmerk met mascotte, app-icoonvarianten.
- `02. Elements/`:
  - meldingen (Asset 21 tot 23);
  - knop "activeer buddy" (Asset 34);
  - app-icoon op grijze cirkel (Asset 35);
  - "Laatste aanmaning +€60"-kaart (Asset 33);
  - mail-rij (Asset 30);
  - telefoon-mockups (Asset 31, Mockup3);
  - kalender (Mockup2, datevector);
  - stapels meldingen (Stack1 tot 3).
- `03. Mockups/`: bestaande statische ads en stories. Gebruik ze **alleen als stijlreferentie, niet voor tekst**: ze bevatten verouderde claims, zoals "probeer gratis" (Ad1 tot Ad3), "Buddy scant en labelt al je emails" (Story3) en WhatsApp-meldingen (Story2 en Story5).
- Alles is als React/SVG nagebouwd in `04. Animation/src/components`. Bouw nieuwe elementen op dezelfde manier na, zodat de tekst bewerkbaar blijft.

### Toon
Nederlands, plat en gesproken. Spreek de lezer aan met je/jij, in korte zinnen. Liever concreet ("€128,95", "vervalt morgen") dan abstract. Gebruik geen gedachtestreepjes.

## 2. Product: wat waar is

- **Doorsturen.** Je stuurt een rekening door naar je eigen doorstuuradres (op `in.betaalbuddy.nl`). Er is **geen** mailbox-koppeling en geen "inbox scannen".
- **Wat Buddy leest:** bedrag, vervaldatum, betaallink en kenmerk uit de doorgestuurde mail.
- **Geen AI.** Buddy leest je rekening met vaste, standaard regels. Er gaat geen AI-model over je mail. Bevestigd door Rick op 10 november 2026.
- **Herinnering in je agenda**, op een moment dat jij kiest (onboarding v5.1, changelog november 2026). Noem in ads niet meer "mail op 7 en 2 dagen".
- **Agenda:** een ICS-agendalink, zodat de vervaldatum in je agenda staat.
- **Wekelijks overzicht.**
- **Geen app, geen bankkoppeling.** Buddy ziet alleen wat jij doorstuurt; dat is ook een privacy-argument.
- **Betaalmodel (sinds 5 oktober 2026):** je betaalt bij aanmelding en hebt dan de eerste maand. Er is **geen** proefperiode en niets gratis.
- **Pakketten en prijzen** (prijspagina, bevestigd door Rick op 10 november 2026):

  | Pakket | Prijs | Wat erin zit |
  |---|---|---|
  | Buddy lite | €2,99 per maand | Al je rekeningen in één overzicht, export naar CSV of JSON. **Geen automatische reminder.** |
  | Buddy | €3,49 per maand | Alles uit Lite plus **reminder in je agenda** |
  | Buddy pro | €4,99 per maand | Alles uit Buddy plus prioriteit support. De pagina noemt ook WhatsApp/Telegram-meldingen, maar die zijn **niet live**: noem ze nooit |

  Gaat een ad over herinneringen of de agenda, dan is de prijs **€3,49 per maand (Buddy)**, nooit "vanaf €2,99".
- **Kanalen niet beschikbaar:** WhatsApp, Telegram en Signal.

### Privacy en gegevens (belangrijk voor een privacy-invalshoek)
- **Geen koppeling.** Buddy krijgt alleen wat jij doorstuurt; er is geen koppeling met je mailbox.
- **Retentie.** Gegevens van een rekening blijven bewaard tot **14 dagen na de vervaldatum**, daarna worden ze verwijderd. Claim dus **niet** "Buddy bewaart niets" of "wordt direct verwijderd".
- **Links** in mails zijn ondertekend en **60 dagen** geldig.
- **Adressen:**
  - `start@` om te beginnen;
  - `vul-in+<id>@` om ontbrekende gegevens aan te vullen;
  - `gegevens@` om je gegevens in te zien;
  - `stop@` om te stoppen of alles te laten verwijderen.
- **Bron:** de docs-site, zie de changelog van 10 september 2026.

### Instappagina's per invalshoek
Er zijn zes landingspagina's, elk rond één invalshoek:
- achteraf betalen;
- net op jezelf wonen;
- aanmaning en incassokosten;
- privacy zonder mailboxkoppeling;
- verkeersboetes;
- zorgnota's.

Ze staan in het EmailTool-project onder `landingspaginas/`. Waar ze live komen te staan, is nog niet besloten. Noem in je oplevering welke pagina het best bij de ad past, als open punt voor de link in bio en de CTA. Let op: volgens de changelog noemen die pagina's nog prijzen en "30 dagen geld terug"; ook dat is een open punt.

## 3. Copyregels

| Niet zeggen | Waarom |
|---|---|
| "gratis", "probeer gratis", "proefperiode", "X dagen gratis" | Er is geen gratis periode meer; de conversiecampagne mag de site niet tegenspreken |
| WhatsApp, Telegram, Signal | Niet beschikbaar |
| "scant je inbox", "koppel je Gmail", "labelt je mails" | Oude versie; het product werkt nu met doorsturen |
| "vanaf €2,99" of €2,99 in een ad over herinneringen of de agenda | Lite heeft geen reminder; gebruik €3,49 (pakket Buddy) |
| "AI", "slimme AI", "AI-gestuurd" als eigenschap van Buddy | Buddy werkt met vaste regels; alleen "geen AI" mag |
| "30 dagen geld terug" | Staat nog open in de changelog; niet gebruiken tot het bevestigd is |
| Logo's of namen van andere merken (Gmail, Netflix, PostNL, Klarna…) | Merkrecht; gebruik generieke afzenders |
| Buddy "betaalt voor je" | Buddy herinnert; jij betaalt |
| "Buddy bewaart niets", "wordt direct verwijderd" | Gegevens blijven tot 14 dagen na de vervaldatum (§2) |
| Gedachtestreepjes (—) in copy | Huisstijl; gebruik een punt, komma of dubbele punt |
| Gebruikersaantallen, quotes, testimonials | Staat op de weglijst van HOMEPAGE-COPY §14 |

**Wel toegestaan, mits precies geformuleerd:**
- **€40 incassokosten:** het wettelijk minimum, maar pas na een veertiendagenbrief. Schrijf "kan uitlopen op €40" of "kost je zo €40", niet "kost €40".
- **Getallen met bron** (AFM BNPL 2025, WAHV) alleen als de bron in de caption of op de landingspagina staat.

**Nog te bevestigen** (benoem dit als open controle als je het gebruikt):
- dat herinneringsmails de betaallink bevatten;
- welke instappagina de CTA en "link in bio" krijgen. `/probeer-betaalbuddy-gratis/` botst met het model zonder gratis periode.

**Generieke afzenders:** Zorgverzekeraar, Energieleverancier, Telefoonprovider, Gemeente, Verhuurder, Sportschool, Webshop, Pakketdienst, Incassobureau, Bank.

`references/copy-rules.txt` is de machineleesbare versie van deze tabel voor `scripts/check_copy.py`.

## 4. USP's en invalshoeken (rotatie)

Een concept begint bij **één USP**, niet bij een beeld. Bijna alle eerdere concepten vertellen hetzelfde verhaal (rekening vergeten, doorsturen, in je agenda). Kies daarom eerst de USP en pas daarna de metafoor.

**Rotatieregel:** kijk in de kolom USP van `04. Animation/CONCEPTEN.md` en kies de USP die **het langst niet** gebruikt is (nooit gebruikt telt als langst). Bij gelijkspel: de bovenste in deze tabel. Het verhaal van de ad gaat dan over die USP; de agenda mag hooguit een bijrol hebben.

| Code | USP | Feit (§2) | Mag in copy | Mag niet | Vormideeën |
|---|---|---|---|---|---|
| `geen-ai` | Geen AI | Buddy leest met vaste regels | "Geen AI. Gewoon vaste regels.", "Er gaat geen AI over je mail." | "slimme AI", Buddy als AI-assistent | Mythe tegenover feit; regel-voor-regel uitlezen als checklist |
| `inzage` | Je ziet altijd wat er bewaard is | Inzage via gegevens@, bewaard tot 14 dagen na de vervaldatum, verwijderen via stop@ | "Mail gegevens@ en je ziet precies wat Buddy van je heeft.", "Na veertien dagen na de vervaldatum is het weg." | "Buddy bewaart niets", "direct verwijderd" | Glazen la of doorzichtige doos; een bon met alles wat bewaard is; een timer van 14 dagen |
| `prijs` | Prijs tegenover een aanmaning | Buddy €3,49 per maand met reminder in je agenda; aanmaning kan uitlopen op €40 | "€3,49 per maand. Een aanmaning kan uitlopen op €40." | "vanaf €2,99", "gratis", Lite of Pro noemen bij reminders | Rekensom of kassabon; weegschaal; twee prijskaartjes naast elkaar |
| `geen-koppeling` | Geen mailbox- of bankkoppeling | Alleen wat jij doorstuurt; geen app, geen bank | "Buddy ziet alleen wat jij doorstuurt." | "scant je inbox" | Toestemmingsscherm dat je niet hoeft te klikken |
| `geen-app` | Geen app | Werkt via doorsturen en je agenda | "Geen app. Je mail en je agenda zijn genoeg." | | Volle telefoon met apps tegenover één doorgestuurde mail |
| `overzicht` | Alles in één overzicht, export naar CSV of JSON | Lite en hoger | "Al je rekeningen in één overzicht." | | Spreadsheet die zichzelf vult; lade die netjes sorteert |
| `agenda` | Herinnering in je agenda, wanneer jij kiest | Buddy en Pro | "Jij kiest wanneer je een herinnering krijgt." | "mail op 7 en 2 dagen" | Wordt nu al veel gebruikt; kies alleen als de rest recent aan bod was |
| `doelgroep` | Een doelgroep: net op jezelf, achteraf betalen, zorgnota's, verkeersboetes | Instappagina's per doelgroep | Generieke afzenders | Merknamen, getallen zonder bron | Eerste eigen sleutel; stapel nota's van tandarts en fysio |

**Verhaalvormen.** Wissel ook de vorm af, niet alleen het beeld. Kies een andere vorm dan de laatste drie concepten in de index:
- probleem, doorsturen, uitkomst (de standaard; nu overgebruikt);
- mythe tegenover feit ("Dus Buddy gebruikt AI?" "Nee.");
- rekensom of kassabon (prijs);
- vraag en antwoord in drie korte vragen;
- twee schermen naast elkaar (met en zonder Buddy);
- één doorlopend shot zonder scènewissel, met tekst op de stem.

De instappagina's per invalshoek staan in §2. Noem in de oplevering welke pagina het best bij de USP past.
