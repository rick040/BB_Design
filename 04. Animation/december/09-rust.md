# Idee 9 · €3,49 rust (static, conversie)

Campagne "Buddy houdt het lijstje bij". Fase: Volle agenda + Vriendenweek. Funnel: BOFU. Kanaal: betaald (retargeting vanaf 8 december).

## Idee
Een kassabonnetje met één regel: "Rust in december, €3,49 per maand". De kop zegt dat het het kleinste is dat je deze maand koopt, de knop zegt "Start met je Buddy." Alleen Standard wordt genoemd. Het productmoment (doorsturen, seintje 7 en 2 dagen vooraf) staat in de chip onderaan.

## Compositie
| Id | Formaat | Bestand |
|---|---|---|
| `DEC09-Rust` | 1080 × 1350 (4:5) | `renders/december/DEC09-Rust.png` |

Code: `src/december/d09-rust/` (`schema.ts` heeft alle teksten, ook de bonregels).

## Beeld en tekst
- Lichte achtergrond `#E8EEFF`, kop in Space Grotesk Medium `#013bff`, bonregels in Geist.
- Kop: "Het kleinste dat je deze maand koopt."
- Bon: "Rust in december €3,49", "Standard, per maand", totaal €3,49, streepjescode, "Jij viert. Buddy onthoudt." (kernzin van de campagne). Kleine Buddy kijkt over de rand.
- Knop: "Start met je Buddy."
- Chip: "Stuur door · seintje 7 en 2 dagen vooraf".

## Caption (organisch of als ad-tekst onder het beeld)
```
Het kleinste dat je deze maand koopt: €3,49 voor Standard. 🧾

Jij viert december. Buddy onthoudt de rest.

1️⃣ Stuur een rekening door naar je eigen Buddy-adres.
2️⃣ Buddy zet de vervaldatum in je agenda.
3️⃣ Jij krijgt een seintje 7 en 2 dagen vooraf.

Geen app. Geen bankkoppeling.
Link in bio 👆

#betaalbuddy #rekeningen #decembermaand #overzicht #geldzaken
```
Alt-tekst: Een kassabon van Betaalbuddy met één regel, "Rust in december €3,49", en een blauwe knop "Start met je Buddy." Een kleine blauwe Buddy kijkt over de rand van de bon.

## Ads Manager (retargeting vanaf 8 december)
- Primaire tekst: `Standard kost €3,49 per maand. Stuur een rekening door en Buddy zet het seintje in je agenda.`
- Kop: `Rust in december, €3,49`
- Knop: Meer informatie (of Aanmelden)
- Doelgroep: sitebezoekers en video-kijkers van de laatste 30 dagen. Bestemming: `/start-met-betaalbuddy/` zodra de fixweek klaar is.

## Open controles
- "30 dagen geld terug" staat er bewust niet in. Komt besluit 1 uit het masterplan er wel, voeg dan een regel toe op de bon (prop `receipt.thanks` of een extra regel).
- Alleen Standard is genoemd; prijs en pakketnaam kloppen met de changelog van dit moment. Controleer ze voor plaatsing.
- Copycheck: alle treffers zijn de prijs. Dat is bewust: het campagnebestand wil in deze conversie-ad "alleen Standard noemen", en Standard heeft herinneringen en agenda, dus de prijsregel voor herinnerings-ads is hier niet misleidend.
- Welke instappagina "link in bio" en de knop krijgen.

## Aanpassen en exporteren
Studio: `npm run dev`, map December-Lijstje, D09-Rust. Blijvend: defaults in `src/december/d09-rust/schema.ts`. Render: `node scripts/render-december.cjs DEC09-Rust`.
