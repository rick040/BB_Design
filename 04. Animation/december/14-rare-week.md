# Idee 14 · Die rare week (static)

Campagne "Buddy houdt het lijstje bij". Fase: Januari klaarzetten. Funnel: TOFU. Kanaal: alleen organisch. Posten: maandag 28 december.

## Idee
Tussen kerst en oud en nieuw weet niemand welke dag het is. Een weekkalender met door elkaar staande dagnamen ("Zondag? Woensdag? Gourmet-dag?"), waarvan één datum scherp staat, met een Buddy-vlaggetje. Dat is de rekening die Buddy niet kwijtraakt. Het productmoment (seintje 7 en 2 dagen vooraf) staat in de subregel en in de chip.

## Compositie
| Id | Formaat | Bestand |
|---|---|---|
| `DEC14-RareWeek` | 1080 × 1350 (4:5) | `renders/december/DEC14-RareWeek.png` |

Code: `src/december/d14-rare-week/` (`schema.ts`: kop, dagen, scherpe dag, subregel en chip zijn props).

## Beeld en tekst
- Lichte achtergrond, blauwe kalenderkaart "December" met zeven dagen (25 t/m 31 december 2026). Zes dagen zijn wazig met een foute dagnaam, één dag (dinsdag 29 december) is scherp, blauw en heeft een Buddy-vlaggetje en het label "Betaaldatum".
- Kop (uit het campagnebestand): "Tussen kerst en oud en nieuw weet niemand welke dag het is. Je rekeningen wel."
- Subregel: "Buddy geeft je 7 en 2 dagen vooraf een seintje. Je hoeft niet te weten welke dag het is."
- De dagnamen kloppen met 2026 (25 december is een vrijdag); alleen de scherpe dag heeft zijn echte naam. "Gourmet-dag?" is bewust een grap en geen merknaam.

## Caption
```
Tussen kerst en oud en nieuw weet niemand welke dag het is. Je rekeningen wel. 🗓️

Zondag? Dinsdag? Gourmetdag? Buddy weet de datum en geeft je 7 en 2 dagen vooraf een seintje.

1️⃣ Stuur de rekening door naar je eigen Buddy-adres.
2️⃣ Buddy zet de datum in je agenda.
3️⃣ Jij mag gewoon doorgaan met gourmetten.

Geen app. Geen bankkoppeling.
Link in bio 👆

#tussenkerstennieuwjaar #feestdagen #betaalbuddy #rekeningen #overzicht
```
Alt-tekst: Een kalender van 25 tot en met 31 december met wazige dagen en door elkaar staande dagnamen. De dag 29 staat scherp in blauw, met een klein Buddy-vlaggetje en het label "Betaaldatum".

## Open controles
- Het label "Betaaldatum" op de scherpe dag is een voorbeeld, geen echte datum van een gebruiker. Wil je een andere dag benadrukken, wijzig `sharpIndex`, `days` en de dagnaam.
- Alleen organisch gepland; geen Ads Manager-teksten nodig.
- Welke instappagina "link in bio" krijgt.

## Aanpassen en exporteren
Studio: `npm run dev`, map December-Lijstje, D14-RareWeek. Blijvend: defaults in `src/december/d14-rare-week/schema.ts`. Render: `node scripts/render-december.cjs DEC14-RareWeek`.
