# Idee 7 · "De volle decemberagenda" (Reel)

Campagne "Buddy houdt het lijstje bij" · fase Volle agenda · TOFU · organisch plus betaald · posten 8 t/m 12 december.

**In twee zinnen:** de weekweergave van december loopt vol (borrel, kerstmarkt, lootjes, diner met de schoonfamilie) en een klein blokje "Zorgpremie" wordt van het scherm geduwd. Buddy vangt het op en zet het terug als hele-dag-item met twee vlaggetjes (7 en 2 dagen vooraf); slot: "Vol? Buddy maakt nog plek."

| | |
|---|---|
| Composities | `DEC07-Agenda-Reel` (9:16, 1080×1920) · `DEC07-Agenda-Feed` (4:5, 1080×1350) |
| Lengte | 12,2 s (366 frames, 30 fps), 3 scènes |
| Bestanden | `renders/december/DEC07-Agenda-Reel.mp4`, `DEC07-Agenda-Feed.mp4`, `DEC07-Agenda-Reel-cover.png` (frame 85) |
| Code | `src/december/d07-agenda/` (schema in `schema.ts`, scènes in `scenes/`, weekkaart in `WeekCard.tsx`, baan van het blokje in `flight.ts`) |
| Ad | Ja (campagnebestand: organisch plus betaald, TOFU) |

## Storyboard en gemeten tijden

Gemeten met `timeline.py` (scènes 4,2 · 4,6 · 4,2 s, overgang 0,4 s) en de beat-constanten in `scenes/`.

| Scène | Start (s) | Overgang | Wat je ziet |
|---|---|---|---|
| 1 · Je agenda in december (ice) | 0,00 | Klokveeg naar blauw (3,80 tot 4,20) | Kop "Je agenda in december." op frame 0. De week 14 t/m 20 december vult zich blok voor blok (op frame 0 staat al ruim de helft; compleet rond 2,0 s). Het zwarte blokje **Zorgpremie** zit er al tussengepropt. Op 3,00 s valt "Diner schoonfamilie" van boven op zijn plek, op 3,47 s wordt het blokje weggeduwd en tolt naar beneden. |
| 2 · Buddy vangt het op (blauw) | 3,80 | Slide van links (8,00 tot 8,40) | Kop "Buddy vangt het op." Buddy springt onder de agenda omhoog (3,80 s); het blokje valt op zijn kop (4,27 s). Op 4,87 s gooit hij het omhoog naar de hele-dag-rij (landt 5,47 s). Twee vlaggetjes poppen erop: blauw = 7 dagen vooraf (5,67 s), zwart = 2 dagen vooraf (5,90 s). Subregel op 6,00 s: "Hele dag in je agenda, seintje 7 en 2 dagen vooraf." |
| 3 · CTA (blauw) | 8,00 | n.v.t. | Kop "Vol? Buddy maakt nog plek." Knop **activeer buddy** op 8,33 s. De agenda schuift uit elkaar (8,53 s) en Buddy komt in de ruimte omhoog (9,13 s). Subregel "Stuur je rekening door. Geen app. Geen bankkoppeling." op 9,53 s, woordmerk 9,73 s, tap op de knop 11,07 s. |

Productmoment in beeld: de agenda met het hele-dag-item en de seintjes 7 en 2 dagen vooraf; "Stuur je rekening door" in de CTA. Slotbeeld: de agenda splitst open en Buddy staat in de gelaten ruimte, onder de knop (geen Buddy op de knop). Overgangen (alleen CSS): clockWipe, slide.

Het blokje vliegt over de scène-overgang heen met één gedeelde baan (`flight.ts`). Verander je `timing.hook` of `timing.transition`, dan schuift de duw mee (de duw valt altijd 10 frames voor het begin van scène 2), zodat het blokje blijft aansluiten.

<!-- copycheck:off -->
## Copyregels voor dit idee
Geen merknamen, geen prijs, geen "gratis", geen WhatsApp. De agenda toont generieke gebeurtenissen (Werk, Borrel, Lootjes, Kerstlunch, Kerstmarkt, Kerstborrel, Kerstfilm, Brunch, Yoga, Kapper...). Zorgpremie is een voorbeeld van een rekening, geen aanbeveling.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1,0)

```
<break time="0.2s" /> Borrel, kerstmarkt, lootjes. <break time="0.2s" /> Je zorgpremie past er niet meer tussen. Buddy vangt hem op, met twee seintjes erbij. <break time="1.1s" /> Vol? Buddy maakt nog plek. Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,2 | Borrel, kerstmarkt, lootjes. | Week vult zich, op frame 0 al ruim half vol |
| 2,3 | Je zorgpremie past er niet meer tussen. | Diner valt erin 3,00 s, blokje wordt weggeduwd 3,47 s |
| 4,6 | Buddy vangt hem op, met twee seintjes erbij. | Buddy vangt 4,27 s, gooit 4,87 s, vlaggetjes 5,67 en 5,90 s, subregel 6,00 s |
| 8,4 | Vol? Buddy maakt nog plek. Activeer Buddy. | Knop 8,33 s, agenda schuift open 8,53 s, Buddy 9,13 s |

**Doellengte mp3:** ~10,6 s (25 woorden); de video is 12,2 s, dus er blijft ruimte aan het eind voor de tap. De beeldmomenten zijn gemeten; de spreektijden zijn een schatting (5 lettergrepen per seconde, Speed 1,0). Een andere Speed verschuift alle latere zinnen, want de breaks zijn absoluut. Zet de mp3 in `public/`, vul de naam in bij `music`, zet `musicVolume` op 1.

## Caption (Reels)

```
Borrel, kerstmarkt, lootjes, diner met de schoonfamilie. Waar past je zorgpremie nog tussen? 📅

Buddy maakt plek:
📩 Stuur de rekening door naar je eigen Buddy-adres
🔍 Buddy haalt er bedrag, vervaldatum en betaallink uit
📅 De datum komt als hele dag in je agenda
⏰ Seintje 7 en 2 dagen vooraf

Geen app. Geen bankkoppeling.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #decembermaand #agenda #rekeningen #opjezelfwonen
```

## Ads Manager

- **Primaire tekst (≤125):** Je agenda zit vol. Stuur je rekening door: Buddy zet de datum erin, met seintje 7 en 2 dagen vooraf.
- **Kop (≤40):** Vol? Buddy maakt nog plek.
- **Knop:** Aanmelden
- **Poort voor betaald:** pas achter budget als de Reel organisch 8.000+ weergaven haalt en meer dan 30 % 3 seconden kijkt (groeiplan).

## Open controles
- Welke pagina "activeer buddy", "link in bio" en de advertentielink krijgen: `/start-met-betaalbuddy/` of een bestaande landingspagina.
- Of een rekening in de echte agenda als **hele dag** verschijnt met twee afzonderlijke seintjes: het campagnebestand zegt het zo, de bron is het product (ICS-agendalink, herinneringen per mail op 7 en 2 dagen). Bevestig dit voor je de ad opschaalt.
- De week (14 t/m 20 december) is een voorbeeld; de gebeurtenissen staan in het schema (`week.events`) en kunnen anders.

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map December-Lijstje → D07-Agenda, composities `DEC07-Agenda-Reel` en `-Feed`. Alle teksten, de dagen, elke gebeurtenis (dag, tijdvak, lengte, tint), kleuren en scènelengtes staan in de Props.
- **Blijvend:** defaults in `src/december/d07-agenda/schema.ts` (`defaultAgendaProps`).
- **Exporteren:** `node scripts/render-december.cjs DEC07-Agenda-Reel,DEC07-Agenda-Feed`; cover: `node scripts/render-december.cjs DEC07-Agenda-Reel@85`.
