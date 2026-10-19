# Idee 5 · Lijstjesmaand

Carrousel van 5 slides (1080 × 1350), organisch. December is de maand van lijstjes: drie lijstjes zijn afgevinkt, het vierde (wat je nog moet betalen) houdt Buddy bij. De vinkjes zijn in vectoren getekend, de teksten zijn bewerkbaar. Fase Lijstjestijd, funnel TOFU. Posten: zo 6 of ma 7 december (planning: zo 6 dec).

## Bestanden en composities

| Slide | Composition | Achtergrond | Beeld |
|---|---|---|---|
| 1 | `DEC05-Lijstjes-1` | blauw | "December is de maand van lijstjes." met een waaier van drie afgevinkte lijstjes, Buddy kijkt mee, "veeg door" |
| 2 | `DEC05-Lijstjes-2` | licht | Verlanglijst, afgevinkt |
| 3 | `DEC05-Lijstjes-3` | blauw | Boodschappen voor kerst, afgevinkt |
| 4 | `DEC05-Lijstjes-4` | licht | Wie je nog moet appen, afgevinkt |
| 5 | `DEC05-Lijstjes-5` | blauw | Het lijstje "Betalen" (huur, webshop achteraf, zorgpremie) met vlaggetjes, CTA en chip met het productmoment |

PNG's: `renders/december/DEC05-Lijstjes-1.png` t/m `-5.png`. Code: `src/december/d05-lijstjes/` (`schema.ts` bevat alle teksten en de lijstitems).

## Tekst op de slides

1. December is de maand van lijstjes.
2. Verlanglijst, afgevinkt.
3. Boodschappen voor kerst, afgevinkt.
4. Wie je nog moet appen, afgevinkt.
5. Wat je nog moet betalen? Dat lijstje houdt Buddy bij. Bewaar dit en stuur je eerste rekening door. Chip: Stuur door · seintje 7 en 2 dagen vooraf.

De items in de lijstjes (sokken, puzzel, gourmetset, Oma, de buren…) zijn mijn voorstel en staan als props in het schema. De drie betalingen op slide 5 komen overeen met deurtje 3, 9 en 14 van de adventskalender (idee 2).

## Instagram-caption

```
December is de maand van lijstjes. Eén lijstje valt makkelijk weg: wat je nog moet betalen. 📝

Dat houdt Buddy bij:
1️⃣ Rekening in je mail? Stuur hem door naar je eigen Buddy-adres.
2️⃣ Buddy zet de vervaldatum in je agenda.
3️⃣ Jij krijgt een seintje, 7 en 2 dagen vooraf. 📅

Bewaar dit en stuur je eerste rekening door. 🔖

Geen app. Geen bankkoppeling.
Link in bio 👆

#december #lijstjes #rekeningen #geldzaken #betaalbuddy
```

## Alt-tekst

1. Blauwe achtergrond met de tekst "December is de maand van lijstjes." Drie afgevinkte lijstjes (Verlanglijst, Boodschappen, Appen) waaieren uit, witte Buddy kijkt erachter vandaan.
2. Lichte slide met een afgevinkt lijstje "Verlanglijst": warme sokken, grote puzzel, thermosfles, leesboek. Blauwe Buddy leunt op de kaart.
3. Blauwe slide met een afgevinkt lijstje "Kerstboodschappen": gourmetset, stol, mandarijnen, kaarsjes.
4. Lichte slide met een afgevinkt lijstje "Nog te appen": Oma, de buren, oude collega, beste vriend.
5. Blauwe slide: "Wat je nog moet betalen? Dat lijstje houdt Buddy bij." Een nog niet afgevinkt lijstje met huur (3 dec), webshop achteraf (9 dec) en zorgpremie (14 dec), elk met een vlaggetje. Witte Buddy staat naast de tekst "Bewaar dit en stuur je eerste rekening door."

## Open controles

- Datums en lijstitems zijn voorbeelden, geen echte gegevens; geen merknamen.
- **Link in bio**: welke instappagina de link krijgt is nog niet besloten.
- Slide 1 t/m 4 tonen het productmoment niet zelf; dat staat op slide 5 (chip) en in de caption. Wil je het op elke slide, zet dan `chip` in `StaticPage` ook voor slide 2 t/m 4.

## Aanpassen en renderen

- Studio: `npm run dev`, map `December-Lijstje` → `D05-Lijstjes` → `DEC05-Lijstjes-1` t/m `-5`.
- Blijvend wijzigen: `src/december/d05-lijstjes/schema.ts` (`defaultLijstjesProps`).
- Renderen: `node scripts/render-december.cjs DEC05-Lijstjes-1,DEC05-Lijstjes-2,DEC05-Lijstjes-3,DEC05-Lijstjes-4,DEC05-Lijstjes-5`.
