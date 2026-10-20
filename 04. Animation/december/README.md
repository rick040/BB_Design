# Decembercampagne "Buddy houdt het lijstje bij"

Alle 16 ideeën uit het campagnebestand (23 november t/m 4 januari), gebouwd in Remotion in de BetaalBuddy-huisstijl: Space Grotesk voor koppen en tekst, Geist voor UI in de mockups, kleuren #013bff, #0026a8, #111827 en #E8EEFF, geen rood, geen gradients, geen foto's.

Elk idee heeft een eigen map in `src/december/<slug>/` en een eigen document in deze map met de gemeten tijden, het voice-overscript (Reels), de caption, alt-teksten, Ads Manager-teksten en de open controles. Alle teksten, kleuren en timings zijn props in Remotion Studio (map `December-Lijstje`).

## Overzicht

| # | Idee | Vorm | Composities | Bestanden in `renders/december/` | Doc |
|---|---|---|---|---|---|
| 1 | Eén dag gekocht, negen dagen betalen | Reel 15,0 s | `DEC01-Pakketjes-Reel`, `-Feed` | MP4 9:16 en 4:5, cover | [01](./01-pakketjes.md) |
| 2 | De adventskalender | Reel 14,4 s + 24 Stories | `DEC02-Advent-Reel`, `-Feed`, `DEC02-Advent-Story-01` t/m `-24` | MP4 9:16 en 4:5, cover, 24 PNG's 1080×1920 | [02](./02-advent.md) |
| 3 | Sint heeft zijn boek | Reel 14,8 s | `DEC03-Sint-Reel`, `-Feed` | MP4 9:16 en 4:5, cover | [03](./03-sint.md) |
| 4 | Het Buddy-rijm | Carrousel 4 | `DEC04-Rijm-1` t/m `-4` | 4 PNG's 1080×1350 | [04](./04-rijm.md) |
| 5 | Lijstjesmaand | Carrousel 5 | `DEC05-Lijstjes-1` t/m `-5` | 5 PNG's 1080×1350 | [05](./05-lijstjes.md) |
| 6 | Brief van de maker | Static | `DEC06-Brief` | PNG 1080×1350 | [06](./06-brief.md) |
| 7 | De volle decemberagenda | Reel 12,2 s | `DEC07-Agenda-Reel`, `-Feed` | MP4 9:16 en 4:5, cover | [07](./07-agenda.md) |
| 8 | Aftellen naar 31 december | Story-reeks 4 | `DEC08-Aftellen-1` t/m `-4`, `-4-9dec`, `-4-16dec`, `-4-23dec` | 7 PNG's 1080×1920 | [08](./08-aftellen.md) |
| 9 | €3,49 rust | Static | `DEC09-Rust` | PNG 1080×1350 | [09](./09-rust.md) |
| 10 | Kersttafel-bingo | Static | `DEC10-Bingo` | PNG 1080×1350 | [10](./10-bingo.md) |
| 11 | De kerstkaart van Buddy | Static + Story | `DEC11-Kerstkaart-1`, `-2`, `-Story` | 2 PNG's 1080×1350, 1 PNG 1080×1920 | [11](./11-kerstkaart.md) |
| 12 | Vriend mee de feestdagen door | Reel 15,0 s | `DEC12-Vriend-Reel`, `-Feed` | MP4 9:16 en 4:5, cover | [12](./12-vriend.md) |
| 13 | Januari staat al klaar | Carrousel 6 | `DEC13-Januari-1` t/m `-6` | 6 PNG's 1080×1350 | [13](./13-januari.md) |
| 14 | Die rare week | Static | `DEC14-RareWeek` | PNG 1080×1350 | [14](./14-rare-week.md) |
| 15 | Aftellen naar 2027 | Reel 13,4 s | `DEC15-Aftellen2027-Reel`, `-Feed` | MP4 9:16 en 4:5, cover | [15](./15-aftellen-2027.md) |
| 16 | Een voornemen in 30 seconden | Reel 14,4 s + Story | `DEC16-Voornemen-Reel`, `-Feed`, `DEC16-Voornemen-Story` | MP4 9:16 en 4:5, cover, PNG 1080×1920 | [16](./16-voornemen.md) |

De MP4's zijn h264, yuv420p, bt709 (gecontroleerd met ffprobe). De Reels hebben ook een 4:5-versie voor feed en ads.

## Meta-advertenties

- [`META-ADS-PLAN.md`](./META-ADS-PLAN.md): setup, campagnestructuur, budget, schema en beslisregels voor de betaalde kant van de campagne.
- [`META-ADS-STAPPENPLAN.md`](./META-ADS-STAPPENPLAN.md): het hoe, voor iemand die nog nooit met Meta Ads werkte: accounts, Pixel, doelgroepen en de eerste campagne, in volgorde.
- [`META-ADS-PLANNING.xlsx`](./META-ADS-PLANNING.xlsx): dag-voor-dag schema met bedragen (verandert mee met de pot in 'Instellingen'), advertentielijst met beslissing per advertentie, meetplan, rekensom en preflight-checklist.

## Aanpassen en opnieuw renderen

```bash
cd "04. Animation"
npm install                       # eenmalig
npm run dev                       # Studio, map "December-Lijstje"
npm run render:december           # alle DEC*-composities naar renders/december/
node scripts/render-december.cjs DEC04-Rijm-1,DEC01-Pakketjes-Reel   # alleen deze ids
node scripts/render-december.cjs DEC01-Pakketjes-Reel@50              # cover van frame 50
```

Een Still wordt een PNG, al het andere een MP4. Blijvende tekstwijzigingen zet je in de defaults van `src/december/<slug>/schema.ts`.

## Open beslissingen en controles (verzameld uit de documenten)

**Besluiten voor Rick uit het campagnebestand**
- Garantie "30 dagen geld terug": staat nergens in. Raakt idee 9.
- Werf-aanbieding "jij een maand gratis, je vriend niets extra": staat in 11 en 12 zoals in het campagnebestand. De copycheck flagt "gratis" (bewust). Voorwaarden moeten op de instappagina staan.
- Prijs voor het beste rijm (idee 4): niets in de uiting genoemd.
- Brief van de maker (idee 6): bedrijfsnaam en KvK ontbreken; optionele prop `footerLine` is leeg. Ook "gooit de rest weg" botst mogelijk met de bewaartermijn van 14 dagen na de vervaldatum.
- Zorgverzekering-feiten in idee 8 nog laten controleren voor 9 december.
- Lettertype: de uitingen staan nu in Space Grotesk en Geist (BetaalBuddy-huisstijl), niet in Archivo Black en Poppins uit het campagnebestand.

**Mijn voorstellen om goed te keuren**
- Deurtjes 1, 2, 4 t/m 8, 10 t/m 13, 15 t/m 24 van de Story-reeks (idee 2): rekening of tip per dag is mijn invulling, met verzonnen voorbeeldbedragen.
- De overige vakken van de bingo (idee 10), de items in de lijstjes (idee 5) en de namen en data in het boek (idee 3) zijn voorbeelden.

**Productcontrole**
- Zet het echte product een rekening als hele-dag-item met twee seintjes in de agenda (ideeën 3, 7 en 2)?
- Welke pagina krijgt de knop en "link in bio" (het campagnebestand noemt `/start-met-betaalbuddy/`)?
- De voice-over-tijden in de documenten zijn schattingen (beeldmomenten zijn gemeten). Noteer de ElevenLabs-Speed die erbij hoort.
- Idee 8 slide 1: de poll is getekend; leg de echte pollsticker erover.
