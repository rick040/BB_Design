# Idee 8 · Aftellen naar 31 december (Story-reeks)

Campagne "Buddy houdt het lijstje bij". Fase: Volle agenda. Funnel: MOFU. Kanaal: organisch. Posten: woensdag 9, 16 en 23 december (deel 1, 2 en 3 in de postplanning).

## Idee
Vier Story-slides rond één echte datum: zorgverzekering overstappen kan t/m 31 december. Poll, twee feitkaarten en een aftelslide met de opdracht om je nieuwe premienota door te sturen zodra hij binnen is. Aftellen alleen naar een echte datum, zoals het Meta-beleid vraagt.

## Composities (1080 × 1920, Stories)
| Id | Slide | Bestand |
|---|---|---|
| `DEC08-Aftellen-1` | 1 · Poll "Ga jij overstappen van zorgverzekering?" | `renders/december/DEC08-Aftellen-1.png` |
| `DEC08-Aftellen-2` | 2 · Feitkaart: overstappen kan t/m 31 december | `renders/december/DEC08-Aftellen-2.png` |
| `DEC08-Aftellen-3` | 3 · Feitkaart: openstaande premie kan je overstap blokkeren | `renders/december/DEC08-Aftellen-3.png` |
| `DEC08-Aftellen-4` | 4 · Aftellen (standaard 22 dagen) | `renders/december/DEC08-Aftellen-4.png` |
| `DEC08-Aftellen-4-9dec` | 4 · "Nog 22 dagen", voor 9 december | `renders/december/DEC08-Aftellen-4-9dec.png` |
| `DEC08-Aftellen-4-16dec` | 4 · "Nog 15 dagen", voor 16 december | `renders/december/DEC08-Aftellen-4-16dec.png` |
| `DEC08-Aftellen-4-23dec` | 4 · "Nog 8 dagen", voor 23 december | `renders/december/DEC08-Aftellen-4-23dec.png` |

Code: `src/december/d08-aftellen/` (`schema.ts`: alle teksten en `countdown.daysLeft`). Het aantal dagen is een prop; 31 december min de postdatum geeft 22, 15 en 8.

## Slides en tekst
1. **Poll.** Kop: "Ga jij overstappen van zorgverzekering?" Opties: Ja / Nee / Weet ik nog niet. De opties zijn een getekende poll. Wil je stemmen laten tellen, leg dan de echte Instagram-pollsticker over de drie balken of laat ze staan als niet-klikbare reeks.
2. **Feit.** "Overstappen kan t/m 31 december." Daaronder: "Zeg je zelf op voor 1 januari, dan heb je tot 1 februari voor een nieuwe polis."
3. **Feit.** "Een openstaande premie kan je overstap blokkeren." Kaart met slot ter illustratie.
4. **Aftellen.** "Nog 22 / 15 / 8 dagen tot 31 december" met de regel "Stuur je nieuwe premienota door zodra hij binnen is." Chip: "Stuur door · seintje 7 en 2 dagen vooraf".
Bronregel op de feitkaarten: "Bron: Rijksoverheid, zorgverzekeringbesparen.nl" (dezelfde bronnen als static #34 in de lijst van 43).

## Alternatief voor slide 4
Je kunt ook de native Instagram-aftelsticker naar 31 december gebruiken in plaats van het getal in beeld. Zet dan `countdown.daysLeft` niet in beeld (laat de kop "Nog" en het getal weg of dek ze af) en plaats de sticker op de plek van het getal. Het getal in beeld is bewust gebakken, zodat de slide ook zonder sticker klopt en in de reeks past.

## Story-teksten bij het plaatsen
Een Story heeft geen caption. Plak eventueel als tekststicker op slide 4: "Link in bio" met een linksticker naar de instappagina. Wil je "Geen app. Geen bankkoppeling." erbij zetten, doe dat dan in een tekststicker.

## NOG TE CONTROLEREN VOOR 9 DECEMBER
De zorgverzekering-feiten op slide 2 en 3 staan letterlijk zo in het campagnebestand, met de aantekening dat ze voor publicatie nog één keer gecontroleerd moeten worden:
- overstappen kan t/m 31 december;
- zelf opgezegd voor 1 januari: tot 1 februari voor een nieuwe polis;
- een openstaande premie kan je overstap blokkeren.
Check ze bij Rijksoverheid en zorgverzekeringbesparen.nl voor 9 december en pas de teksten aan in `schema.ts` (`fact1`, `fact2`).

## Open controles
- De bronregel noemt beide bronnen; bevestig dat beide de feiten dragen.
- De kaart op slide 3 is een generieke illustratie met "Zorgverzekeraar", geen merknaam en geen echte klant.
- Welke instappagina de linksticker krijgt.

## Aanpassen en exporteren
Studio: `npm run dev`, map December-Lijstje, D08-Aftellen. Blijvend: defaults in `src/december/d08-aftellen/schema.ts`. Render alles: `node scripts/render-december.cjs DEC08-Aftellen-1,DEC08-Aftellen-2,DEC08-Aftellen-3,DEC08-Aftellen-4,DEC08-Aftellen-4-9dec,DEC08-Aftellen-4-16dec,DEC08-Aftellen-4-23dec`.
