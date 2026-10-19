# Idee 11 · De kerstkaart van Buddy (static + Story, referral)

Campagne "Buddy houdt het lijstje bij". Fase: Vriendenweek. Funnel: referral. Kanaal: organisch. Posten: 15 december (post), en dezelfde dag als Story-sjabloon om te delen.

## Idee
Een kerstkaart in twee slides. Voorkant: Buddy met sjaal op Betaalbuddy-blauw, "Fijne feestdagen. Ik let wel op de rekeningen." Achterkant: "Voor: die vriend die altijd 'o ja, die rekening' zegt." De kaart wordt doorgestuurd naar die vriend; wordt die lid, dan krijgt de werver een maand gratis (aanbod uit het campagnebestand, handmatig uit het masterplan).

## Composities
| Id | Formaat | Bestand |
|---|---|---|
| `DEC11-Kerstkaart-1` | 1080 × 1350, voorkant | `renders/december/DEC11-Kerstkaart-1.png` |
| `DEC11-Kerstkaart-2` | 1080 × 1350, achterkant | `renders/december/DEC11-Kerstkaart-2.png` |
| `DEC11-Kerstkaart-Story` | 1080 × 1920, Story-sjabloon | `renders/december/DEC11-Kerstkaart-Story.png` |

Code: `src/december/d11-kerstkaart/` (`schema.ts` heeft alle teksten, `Scarf.tsx` is de sjaal als Buddy-accessory, `Snow.tsx` de vaste sneeuwstippen).

## Beeld en tekst
- Voorkant: witte Buddy met blauwe ogen en een sjaal in `#0026a8` met zachtblauwe strepen, sneeuwstippen, kop "Fijne feestdagen." en "Ik let wel op de rekeningen."
- Achterkant: lichte achtergrond, postzegel met het app-icoon, "Voor:" en de zin in Archivo Black, "Stuur dit door." als handschrift-achtige regel, kleine Buddy met sjaal. Chip: "Stuur door · seintje 7 en 2 dagen vooraf".
- Story: dezelfde kaart met een vrije "Voor:"-balk waar je een @-vermelding of mention-sticker op kunt zetten. Bovenste 250 px en onderste 330 px blijven vrij.

## Caption
```
Fijne feestdagen van Buddy. 🎄 Hij let wel op de rekeningen.

Stuur dit door. Wordt die vriend lid? Dan krijg jij een maand gratis.

Voor wie de rekening ook altijd "o ja" zegt:
1️⃣ Stuur de rekening door naar je eigen Buddy-adres.
2️⃣ Buddy zet de datum in je agenda.
3️⃣ Jij krijgt een seintje 7 en 2 dagen vooraf.

Geen app. Geen bankkoppeling.
Link in bio 👆

#kerstkaart #feestdagen #betaalbuddy #rekeningen #vriendenweek
```
Alt-tekst slide 1: Een witte Buddy met een gestreepte blauwe sjaal op een blauwe achtergrond met sneeuwstippen, met de tekst "Fijne feestdagen. Ik let wel op de rekeningen."
Alt-tekst slide 2: De achterkant van een kaart met een postzegel en de tekst "Voor: die vriend die altijd 'o ja, die rekening' zegt." Een kleine blauwe Buddy met sjaal staat in de hoek.

## Open controles
- **Aanbod:** "Per vriend die lid wordt: jij een maand gratis" komt uit het campagnebestand (referral, handmatig). De copycheck flagt "gratis", en terecht: het is een beloning voor de werver en geen proefperiode. Open beslissing van Rick: blijft het "jij een maand gratis, je vriend niets extra"? Pas anders de caption aan; het beeld noemt het aanbod niet.
- Referralregels (voorwaarden, wanneer telt een vriend) moeten op de instappagina staan voor dit uitgaat.
- Welke instappagina "link in bio" krijgt.

## Aanpassen en exporteren
Studio: `npm run dev`, map December-Lijstje, D11-Kerstkaart. Blijvend: defaults in `src/december/d11-kerstkaart/schema.ts`. Render: `node scripts/render-december.cjs DEC11-Kerstkaart-1,DEC11-Kerstkaart-2,DEC11-Kerstkaart-Story`.
