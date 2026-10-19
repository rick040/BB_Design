# Idee 10 · Kersttafel-bingo (static)

Campagne "Buddy houdt het lijstje bij". Fase: Vriendenweek. Funnel: TOFU. Kanaal: organisch plus betaald. Posten: 18 t/m 22 december (planning: vrijdag 18 december).

## Idee
Een bingokaart van 3 bij 3 met de vragen die je aan de kersttafel altijd krijgt. Eén vak is het vrije vak in het midden: "Ja, staat in mijn agenda." met Buddy. Het is de grap en het productmoment ineens: de rekening die iedereen vraagt, staat bij jou al in de agenda. CTA: tag degene naast wie je aan tafel zit.

## Compositie
| Id | Formaat | Bestand |
|---|---|---|
| `DEC10-Bingo` | 1080 × 1350 (4:5) | `renders/december/DEC10-Bingo.png` |

Code: `src/december/d10-bingo/` (`schema.ts`: de acht vragen, het middenvak, de CTA en de chip zijn props).

## Beeld en tekst
- Blauwe achtergrond, witte vakken met blauwe tekst en harde schaduw, middenvak in `#0026a8` met witte Buddy.
- Uit het campagnebestand: "Al iemand leuks?", "Hoe is het op je werk?", "Wanneer kom je weer eens langs?", "Wat doe je met oud en nieuw?", "Heb je die rekening al betaald?".
- Zelf aangevuld (vriendelijk, zonder scherpe randjes): "Is dat een nieuwe trui?", "Zullen we straks een spelletje doen?", "Nog een toetje?".
- Chip: "Stuur door · seintje 7 en 2 dagen vooraf".

## Caption
```
Kersttafel-bingo: hoeveel vakjes vink jij af? 🎄

Het middenvak kan Buddy voor je invullen: "Ja, staat in mijn agenda." 😉

Rekening in je mail? Stuur hem door naar je eigen Buddy-adres. Buddy zet de datum in je agenda en geeft een seintje 7 en 2 dagen vooraf.

Tag degene naast wie jij aan tafel zit. 👇

Geen app. Geen bankkoppeling.
Link in bio 👆

#kersttafel #bingo #feestdagen #betaalbuddy #rekeningen
```
Alt-tekst: Een bingokaart van drie bij drie met kersttafelvragen zoals "Al iemand leuks?" en "Nog een toetje?". In het midden staat een witte Buddy met de tekst "Ja, staat in mijn agenda."

## Ads Manager (draait ook als ad)
- Primaire tekst: `Kersttafel-bingo. Het middenvak vult Buddy voor je in: "Ja, staat in mijn agenda."`
- Kop: `Kersttafel-bingo`
- Knop: Meer informatie

## Open controles
- "Heb je die rekening al betaald?" komt uit het campagnebestand. Het is een grap over de vraag aan tafel, niet een aanspreking van iemands geldsituatie; toch een bewuste keuze voor het Meta-beleid (geen geldsituatie aanspreken). Wil Rick het zekerder, vervang het vak dan via `questions[4]`.
- Copycheck: het woord "bingo" en de vragen zijn onschuldig; er is geen prijs of aanbod in het beeld.
- Welke instappagina "link in bio" krijgt.

## Aanpassen en exporteren
Studio: `npm run dev`, map December-Lijstje, D10-Bingo. Blijvend: defaults in `src/december/d10-bingo/schema.ts`. Render: `node scripts/render-december.cjs DEC10-Bingo`.
