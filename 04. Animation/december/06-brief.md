# Idee 6 · Brief van de maker (static, vertrouwen)

Campagne "Buddy houdt het lijstje bij". Fase: Lijstjestijd t/m Vriendenweek. Funnel: BOFU. Kanaal: betaald (retargeting) plus één keer organisch.

## Idee
Een brief op papier in vlakke stijl, ondertekend door Rick, met een kleine Buddy in de hoek. Vertrouwen is probleem 1 uit het masterplan: dit is de retargetingadvertentie voor wie de site zag maar niet betaalde. Het productmoment (doorsturen, seintje 7 en 2 dagen vooraf) staat in de chip onderaan.

## Compositie
| Id | Formaat | Bestand |
|---|---|---|
| `DEC06-Brief` | 1080 × 1350 (4:5) | `renders/december/DEC06-Brief.png` |

Code: `src/december/d06-brief/` (`schema.ts` heeft alle teksten). Posten: vanaf 3 december als ad, één keer organisch.

## Beeld en tekst
- Achtergrond Betaalbuddy-blauw `#013bff`, wit papier met harde schaduw in `#0026a8`, lichte kanteling.
- Kicker: "Brief van de maker".
- Brieftekst (letterlijk uit het campagnebestand): "Ik ben Rick en ik maak Betaalbuddy in Eindhoven." / "Buddy leest je mail niet: hij pakt de betaaldatum en gooit de rest weg." / "Geen bankkoppeling, geen inbox-toegang."
- Handtekening "Rick" in Space Grotesk 500 cursief, daaronder "Maker van Betaalbuddy".
- Chip: "Stuur door · seintje 7 en 2 dagen vooraf".

## Caption (organisch)
```
Ik ben Rick en ik maak Betaalbuddy in Eindhoven. 👋

Buddy leest je mail niet: hij pakt de betaaldatum en gooit de rest weg.

Zo werkt het:
1️⃣ Rekening in je mail? Stuur hem door naar je eigen Buddy-adres.
2️⃣ Buddy haalt bedrag en vervaldatum eruit.
3️⃣ Jij krijgt een seintje 7 en 2 dagen voor de vervaldatum, en de datum staat in je agenda.

Geen app. Geen bankkoppeling.
Link in bio 👆

#betaalbuddy #rekeningen #geldzaken #overzicht #decembermaand
```
Alt-tekst: Een brief op papier van Rick, de maker van Betaalbuddy, met een kleine blauwe Buddy in de hoek, op een blauwe achtergrond.

## Ads Manager (retargeting)
- Primaire tekst: `Ik ben Rick, maker van Betaalbuddy. Geen bankkoppeling, geen inbox-toegang. Jij stuurt door, Buddy let op de datum.`
- Kop: `Een brief van de maker`
- Knop: Meer informatie
- Doelgroep: sitebezoekers en video-kijkers van de laatste 30 dagen. Bestemming: `/start-met-betaalbuddy/` zodra de fixweek klaar is.

## Open controles
- **Bedrijfsnaam en KvK-nummer** staan er niet in (open beslissing voor Rick). Zodra ze bekend zijn: vul `footerLine` in het schema in, dan komt er een kleine regel onder de handtekening.
- De zin "gooit de rest weg" komt letterlijk uit het campagnebestand. Gegevens van een rekening blijven volgens het referentiebestand tot 14 dagen na de vervaldatum bewaard; laat Rick bevestigen dat de zin zo kan, of kies "negeert de rest".
- Welke instappagina "link in bio" krijgt.

## Aanpassen en exporteren
Studio: `npm run dev`, map December-Lijstje, D06-Brief. Blijvend: defaults in `src/december/d06-brief/schema.ts`. Render: `node scripts/render-december.cjs DEC06-Brief`.
