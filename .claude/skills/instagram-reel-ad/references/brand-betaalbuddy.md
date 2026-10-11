# BetaalBuddy: merk, product en copyregels

Stand van 11 oktober 2026. Check de BetaalBuddy-changelog in Drive voor wijzigingen. Wint de changelog, werk dit bestand dan bij.

## Inhoud
1. Merk (kleuren, fonts, Buddy, assets)
2. Product: wat waar is
3. Copyregels: wat niet mag en waarom
4. Gemaakte concepten en nog ongebruikte invalshoeken

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
- `03. Mockups/`: bestaande statische ads en stories, handig als stijlreferentie.
- Alles is als React/SVG nagebouwd in `04. Animation/src/components`. Bouw nieuwe elementen op dezelfde manier na, zodat de tekst bewerkbaar blijft.

### Toon
Nederlands, plat en gesproken. Spreek de lezer aan met je/jij, in korte zinnen. Liever concreet ("€128,95", "vervalt morgen") dan abstract. Gebruik geen gedachtestreepjes.

## 2. Product: wat waar is

- **Doorsturen.** Je stuurt een rekening door naar je eigen doorstuuradres (op `in.betaalbuddy.nl`). Er is **geen** mailbox-koppeling en geen "inbox scannen".
- **Wat Buddy leest:** bedrag, vervaldatum, betaallink en kenmerk uit de doorgestuurde mail.
- **Herinneringen per mail** op **7 en 2 dagen** voor de vervaldatum (T-7 en T-2).
- **Agenda:** een ICS-agendalink, zodat de vervaldatum in je agenda staat.
- **Wekelijks overzicht.**
- **Geen app, geen bankkoppeling.** Buddy ziet alleen wat jij doorstuurt; dat is ook een privacy-argument.
- **Betaalmodel (sinds 5 oktober 2026):** je betaalt bij aanmelding en hebt dan de eerste maand. Er is **geen** proefperiode en niets gratis.
- **Pakketten:** Basic, Standard en Premium. **Basic heeft geen agenda en geen herinneringen.** Premium noemt alleen "melding op je telefoon naast de mail", en dat is nog niet live.
- **Kanalen niet beschikbaar:** WhatsApp, Telegram en Signal.

## 3. Copyregels

| Niet zeggen | Waarom |
|---|---|
| "gratis", "probeer gratis", "proefperiode", "X dagen gratis" | Er is geen gratis periode meer; de conversiecampagne mag de site niet tegenspreken |
| WhatsApp, Telegram, Signal | Niet beschikbaar |
| "scant je inbox", "koppel je Gmail", "labelt je mails" | Oude versie; het product werkt nu met doorsturen |
| Prijs in een herinnerings-ad ("vanaf €2,99") | Basic heeft geen herinneringen, dus dat is misleidend |
| "30 dagen geld terug" | Staat nog open in de changelog; niet gebruiken tot het bevestigd is |
| Logo's of namen van andere merken (Gmail, Netflix, PostNL, Klarna…) | Merkrecht; gebruik generieke afzenders |
| Buddy "betaalt voor je" | Buddy herinnert; jij betaalt |
| Gebruikersaantallen, quotes, testimonials | Staat op de weglijst van HOMEPAGE-COPY §14 |

**Wel toegestaan, mits precies geformuleerd:**
- **€40 incassokosten:** het wettelijk minimum, maar pas na een veertiendagenbrief. Schrijf "kan uitlopen op €40" of "kost je zo €40", niet "kost €40".
- **Getallen met bron** (AFM BNPL 2025, WAHV) alleen als de bron in de caption of op de landingspagina staat.

**Nog te bevestigen** (benoem dit als open controle als je het gebruikt):
- dat herinneringsmails de betaallink bevatten;
- welke instappagina de CTA en "link in bio" krijgen. `/probeer-betaalbuddy-gratis/` botst met het model zonder gratis periode.

**Generieke afzenders:** Zorgverzekeraar, Energieleverancier, Telefoonprovider, Gemeente, Verhuurder, Sportschool, Webshop, Pakketdienst, Incassobureau, Bank.

`references/copy-rules.txt` is de machineleesbare versie van deze tabel voor `scripts/check_copy.py`.

## 4. Gemaakte concepten en nog ongebruikte invalshoeken

| # | Concept | Invalshoek | Visueel systeem | Overgangen |
|---|---|---|---|---|
| 1 | "Stuur door. Buddy onthoudt." (`BB-Ad-*`) | Overzicht: volle inbox, aanmaning +€40 | UI-gedreven (inbox, mailkaart, chips, meldingen); Buddy "slikt" de rekening | iris, slide |
| 2 | "7 · 2 · Betaald." (`BB-Countdown-*`) | Timing: "heb ik dat betaald?", aftellen | Typografisch: reuzengetal rolt van 7 naar 2, Buddy staat erop; vinkje en stempel | clock-wipe, slide |

**Ongebruikte invalshoeken** (uit de landingspagina's en de Meta-strategie):
- **Privacy:** "Buddy leest alleen wat jij doorstuurt" (geen mailbox-koppeling).
- **Mental load:** "Je hoofd is geen agenda."
- **Net op jezelf wonen:** de eerste eigen rekeningen.
- **Kosten eerst:** één vergeten rekening kan uitlopen op €40 incassokosten.
- **Achteraf betalen:** zonder merknamen.
- **Zorgnota's:** van tandarts en fysio.
- **Wekelijks overzicht:** rust op maandagochtend.
- **Verkeersboetes:** alleen digitale boetes; de WAHV-volgorde klopt alleen zoals op de landingspagina.
