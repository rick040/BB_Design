# Idee 4 · Het Buddy-rijm

Carrousel van 4 slides (1080 × 1350), alleen organisch. Vier coupletten van een eigen Sinterklaasrijm op gedichtenpapier (#E8EEFF): de webshopmail die wegzakt, en wat Buddy eraan doet. Slide 4 sluit af met de seintjes 7 en 2 dagen vooraf. Fase Lijstjestijd, funnel TOFU. Posten: 2 t/m 5 december (planning: wo 2 dec).

## Bestanden en composities

| Slide | Composition | Beeld |
|---|---|---|
| 1 | `DEC04-Rijm-1` | Buddy met potlood en cadeau, gedachtewolk "cadeau, cadeau…", "veeg door" |
| 2 | `DEC04-Rijm-2` | Inbox: de webshopmail zakt naar beneden onder nieuwere mails |
| 3 | `DEC04-Rijm-3` | Webshopmail gaat naar het Buddy-adres (doorsturen), Buddy kijkt tevreden |
| 4 | `DEC04-Rijm-4` | Twee seintjes (7 en 2 dagen vooraf) en de vervaldatum, chip met het productmoment |

PNG's: `renders/december/DEC04-Rijm-1.png` t/m `-4.png`. Code: `src/december/d04-rijm/` (`schema.ts` bevat alle teksten).

## Teksten (letterlijk uit het campagnebestand)

1. De surprise is af, het gedicht ook bijna klaar, / je rijmt al een uur op "cadeau" en op "jaar".
2. Maar die mail van de webshop, van vrijdag of zo, / die zakt naar beneden. En weg is hij. Oh.
3. Dus hier een advies, voor nu en voor later: / stuur hem door naar je Buddy, die let op de data.
4. Zeven dagen vooraf, en twee dagen ervoor, / krijg jij een seintje. Dan kom je er wel door.

Alleen de regelafbrekingen en de markeringen (weg is hij, stuur hem door, seintje) zijn toegevoegd. Geen figuren, geen Pieten: alleen een cadeau en het rijm.

## Instagram-caption

```
De surprise is af, maar die betaalmail van de webshop is zoek. 📜 Wij schreven er een rijm over, in vier slides.

Zo houd je de rekeningen bij:
1️⃣ Rekening in je mail? Stuur hem door naar je eigen Buddy-adres.
2️⃣ Buddy haalt bedrag en vervaldatum eruit.
3️⃣ Jij krijgt een seintje, 7 en 2 dagen vooraf. 📅

Kan jij het beter? Schrijf jouw slotregel in de reacties. ✍️

Geen app. Geen bankkoppeling.
Link in bio 👆

#sinterklaas #gedicht #rekeningen #geldzaken #betaalbuddy
```

## Alt-tekst

1. Blauwe Buddy met een potlood en een gedachtewolk met "cadeau, cadeau…", naast een ingepakt cadeau, op gedichtenpapier. Bovenaan het eerste couplet van het rijm.
2. Een inbox met drie mails van Mam, Werk en Buurvrouw. Daaronder zakt de mail van de webshop weg. Bovenaan het tweede couplet.
3. De mail van de webshop met een pijl naar het doorstuuradres van Buddy. Blauwe Buddy kijkt tevreden toe. Bovenaan het derde couplet.
4. Twee meldingen van BetaalBuddy, 7 en 2 dagen voor de vervaldatum, en een chip "Vervalt vr 18 dec". Bovenaan het vierde couplet.

## Open controles

- **Prijs voor het beste rijm** (open beslissing in het campagnebestand): in de uiting staat bewust geen prijs en geen "gratis". Beslis eerst, voeg dan eventueel een zin aan de caption toe.
- **Doorstuuradres** op slide 3 (`jouw-adres@in.betaalbuddy.nl`) en de datums op slide 4 (11, 16 en 18 december) zijn voorbeelden, geen echte gegevens. Het adres staat als tekst in het schema.
- **Link in bio**: welke instappagina de link krijgt is nog niet besloten.
- Reacties met slotregels: bedenk vooraf hoe je ze beantwoordt (geen prijs beloven voor de beste).

## Aanpassen en renderen

- Studio: `npm run dev`, map `December-Lijstje` → `D04-Rijm` → `DEC04-Rijm-1` t/m `-4`. Alle teksten staan in het Props-paneel (veld `couplets`).
- Blijvend wijzigen: `src/december/d04-rijm/schema.ts` (`defaultRijmProps`).
- Renderen: `node scripts/render-december.cjs DEC04-Rijm-1,DEC04-Rijm-2,DEC04-Rijm-3,DEC04-Rijm-4` → `renders/december/`.
