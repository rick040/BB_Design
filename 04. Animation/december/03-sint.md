# Idee 3 · "Sint heeft zijn boek" (Reel)

Campagne "Buddy houdt het lijstje bij" · fase Lijstjestijd · TOFU · organisch plus betaald · posten 30 november t/m 5 december.

**In twee zinnen:** een groot blauw boek slaat open en toont een keurige lijst met namen en data: "Sint heeft zijn grote boek." Harde wissel naar een telefoon met een volle inbox en de zoekbalk "factuur"; je stuurt één mail door en de agenda vult zich net zo netjes als het boek. Slot: "Jij hebt Buddy." Alleen het boek is in beeld, geen figuren of Pieten.

| | |
|---|---|
| Composities | `DEC03-Sint-Reel` (9:16, 1080×1920) · `DEC03-Sint-Feed` (4:5, 1080×1350) |
| Lengte | 14,8 s (444 frames, 30 fps), 4 scènes |
| Bestanden | `renders/december/DEC03-Sint-Reel.mp4`, `DEC03-Sint-Feed.mp4`, `DEC03-Sint-Reel-cover.png` (frame 60) |
| Code | `src/december/d03-sint/` (schema in `schema.ts`, scènes in `scenes/`, boek in `Book.tsx`, telefoon in `Phone.tsx`, harde wissel in `hardCut.tsx`) |
| Lettertypen | BetaalBuddy-huisstijl: Space Grotesk (koppen en lopende tekst), Geist (UI in de mockups), woordmerk Space Grotesk Bold |
| Ad | Ja (campagnebestand: organisch plus betaald, TOFU) |

## Storyboard en gemeten tijden

Tijden gemeten met `timeline.py` (scènes 3,4 · 3,8 · 5,0 · 3,8 s, overgang 0,4 s) en de beat-constanten in `scenes/`.

| Scène | Start (s) | Overgang | Wat je ziet |
|---|---|---|---|
| 1 · Het grote boek (ice) | 0,00 | **Harde wissel** (3,00 tot 3,40, springt op 3,20) | Kop "Sint heeft zijn grote boek." op frame 0. De blauwe kaft staat al half open en draait helemaal open (CSS 3D, 0,0 tot 0,93 s). Vanaf 0,87 s krijgt elke regel een vinkje: eerst de linker, dan de rechter pagina (namen en data, 0,10 s per regel). Het boek ademt na op 2,33 s. |
| 2 · Volle inbox (blauw) | 3,00 | Flip (6,40 tot 6,80), als een bladzijde omslaan | Kop "Jij hebt een volle inbox." Telefoon ploft in beeld (3,07 s), "factuur" wordt getypt (3,40 tot 3,90 s), resultaten verschijnen met het woord gemarkeerd (4,27 s) en scrollen door (4,73 tot 6,27 s). Subregel "Waar stond die factuur ook alweer?" op 5,47 s. |
| 3 · Eén mail door (ice) | 6,40 | Fade (11,00 tot 11,40) | Kop "Eén mail door. Netjes in je agenda." Open mail van Zorgverzekeraar. **Doorsturen** ingedrukt op 7,27 s, het kaartje vliegt naar Buddy (7,40 s), Buddy slikt het (8,00 s). Op 8,20 s wisselt het scherm naar de agenda; drie regels vullen zich, net als in het boek (8,47 / 8,87 / 9,27 s): 21 dec zorgpremie over 7 dagen (blauw vlaggetje), 26 dec over 2 dagen (zwart vlaggetje), 28 dec vervalt. Subregel "Seintje 7 en 2 dagen vooraf." op 9,87 s. |
| 4 · CTA (blauw) | 11,00 | n.v.t. | Kop "Jij hebt Buddy." Knop **activeer buddy** op 11,47 s. Het boek komt terug, kleiner (11,20 s), en Buddy kijkt erachter vandaan over de rand (11,73 s). Knippert 12,73 s, woordmerk 12,53 s, "Geen app. Geen bankkoppeling." 12,33 s, tap op de knop 13,60 s. |

Productmoment in beeld: doorsturen, agenda met seintje 7 en 2 dagen vooraf. Slotbeeld: Buddy gluurt over de rand van het boek **onder** de knop. Overgangen: eigen harde wissel, flip, fade (alleen CSS).

<!-- copycheck:off -->
## Copyregels voor dit idee
Sinterklaas alleen via het boek en (in een ander idee) het rijm: geen figuren, geen Pieten, geen merknamen. De namen in het boek (Lotte, Daan, Fleur, Sem, Noor, Milan, Julia, Thijs, Eva, Luuk) zijn verzonnen voorbeelden. Generieke afzenders in de inbox (Webshop, Verhuurder, Zorgverzekeraar, Energieleverancier, Telefoonprovider, Sportschool, Pakketdienst). Geen "gratis", geen prijs, geen WhatsApp, geen "scant je inbox".
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1,0)

```
<break time="0.2s" /> Sint heeft zijn grote boek. <break time="1.6s" /> Jij hebt een volle inbox. Waar was die factuur ook alweer? <break time="0.2s" /> Stuur één mail door, Buddy plant hem in. <break time="0.3s" /> Seintje een week en twee dagen eerder. <break time="0.3s" /> Jij hebt Buddy. Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,2 | Sint heeft zijn grote boek. | Kaft draait open (tot 0,93 s), vinkjes vanaf 0,87 s |
| 3,3 | Jij hebt een volle inbox. | Harde wissel 3,20 s, telefoon 3,07 s, "factuur" getypt 3,40 s |
| 5,0 | Waar was die factuur ook alweer? | Resultaten 4,27 s, scrollen 4,73 s, subregel 5,47 s |
| 7,1 | Stuur één mail door, Buddy plant hem in. | Flip 6,40 tot 6,80 s, Doorsturen 7,27 s, mail naar Buddy 7,40 s |
| 9,7 | Seintje een week en twee dagen eerder. | Agenda-regels 8,47 / 8,87 / 9,27 s, subregel 9,87 s |
| 12,3 | Jij hebt Buddy. Activeer Buddy. | Fade 11,00 tot 11,40 s, knop 11,47 s, Buddy gluurt 11,73 s, tap 13,60 s |

**Doellengte mp3:** ~14,1 s (36 woorden). De beeldmomenten zijn gemeten; de spreektijden zijn een schatting (5 lettergrepen per seconde, Speed 1,0). Een andere Speed verschuift alle latere zinnen, want de breaks zijn absoluut. Zet de mp3 in `public/`, vul de naam in bij de prop `music`, zet `musicVolume` op 1.

## Caption (Reels)

```
Sint heeft zijn grote boek, met alle namen en data netjes op een rij. Jij hebt Buddy 📖

Zo houd jij je rekeningen net zo netjes bij:
📩 Stuur een rekening door naar je eigen Buddy-adres
🔍 Buddy haalt er bedrag, vervaldatum en betaallink uit
📅 De datum staat in je agenda
⏰ Seintje 7 en 2 dagen vooraf

Geen app. Geen bankkoppeling.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #sinterklaas #rekeningen #opjezelfwonen #decembermaand
```

## Ads Manager

- **Primaire tekst (≤125):** Sint heeft zijn grote boek. Jij hebt Buddy: stuur een rekening door en hij zet de datum in je agenda.
- **Kop (≤40):** Jij hebt Buddy.
- **Knop:** Aanmelden
- **Poort voor betaald:** pas achter budget als de Reel organisch 8.000+ weergaven haalt en meer dan 30 % 3 seconden kijkt (groeiplan).

## Open controles
- Welke pagina "activeer buddy", "link in bio" en de advertentielink krijgen: `/start-met-betaalbuddy/` of een bestaande landingspagina.
- Het voorbeeld van de zorgpremie (21, 26 en 28 december) is een illustratie, geen echte premiedatum. De data staan in het schema (`forward.agenda`) als je een ander voorbeeld wilt.
- De agenda toont de vervaldatum als aparte regel naast de twee seintjes: dat kan kloppen met de agenda-link (ICS), maar bevestig hoe de agenda-items er in het echte product uitzien voordat je de ad opschaalt.

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map December-Lijstje → D03-Sint, composities `DEC03-Sint-Reel` en `-Feed`. Alle teksten, de tien namen met data, de inboxrijen, het agenda-voorbeeld, kleuren en scènelengtes staan in de Props.
- **Blijvend:** defaults in `src/december/d03-sint/schema.ts` (`defaultSintProps`).
- **Exporteren:** `node scripts/render-december.cjs DEC03-Sint-Reel,DEC03-Sint-Feed`; cover: `node scripts/render-december.cjs DEC03-Sint-Reel@60`.
