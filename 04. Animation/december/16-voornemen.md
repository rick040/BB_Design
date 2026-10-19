# Idee 16 · Een voornemen in 30 seconden

Reel (9:16 en 4:5) plus een Story-poll. Voortgangsbalken van goede voornemens staan op 3 %, 1 % en 0 %. Dan komt "Rekeningen op tijd", en die springt naar 100 % zodra je één mail doorstuurt. De 30 seconden slaan op één mail doorsturen, niet op de aanmelding. Fase Januari klaarzetten, funnel MOFU. Posten: vr 1 t/m ma 4 januari (planning: vr 1 jan), organisch; daarna eventueel als ad.

Het voornemen blijft luchtig: de balken zijn illustratie, geen statistiek, en niemand wordt aangesproken op zijn geldsituatie.

## Composities en bestanden

| Composition | Formaat | Lengte | Bestand |
|---|---|---|---|
| `DEC16-Voornemen-Reel` | 1080 × 1920 | 14,4 s | `renders/december/DEC16-Voornemen-Reel.mp4` |
| `DEC16-Voornemen-Feed` | 1080 × 1350 | 14,4 s | `renders/december/DEC16-Voornemen-Feed.mp4` |
| (cover, frame 66) | 1080 × 1920 | | `renders/december/DEC16-Voornemen-Reel-cover.png` |
| `DEC16-Voornemen-Story` | 1080 × 1920 | still | `renders/december/DEC16-Voornemen-Story.png` |

Code: `src/december/d16-voornemen/` (`schema.ts` bevat alle teksten, getallen, kleuren en timings; de beats staan bovenaan elke scène). MP4's zijn gecontroleerd met ffprobe: h264, yuv420p, bt709, 432 frames, 14,4 s.

## Scènes en gemeten tijden (30 fps, overgangen 0,4 s)

| # | Scène | Start (s) | Eind (s) | Achtergrond | Inhoud |
|---|---|---|---|---|---|
| 1 | Hook | 0,0 | 3,4 | licht | "Voornemens op 4 januari." Kaart met sporten 3 %, minder scrollen 1 %, eerder naar bed 0 %, kalendertegel "4 jan", Buddy zucht, "Herkenbaar, toch?" |
| 2 | Eén mail doorsturen | 3,0 | 7,8 | blauw | Vierde balk "Rekeningen op tijd" op 0 %. Een mail ("Telefoonprovider") met label Doorsturen vliegt naar Buddy, de balk springt naar 100 %, het vinkje tekent zich, agenda-item met "Seintje 7 en 2 dagen vooraf" |
| 3 | 30 seconden | 7,4 | 11,0 | licht | "Het voornemen dat je in 30 seconden haalt." Timer loopt van 0:30 naar 0:00 terwijl drie stappen worden afgevinkt: Open de mail, Tik op doorsturen, Klaar |
| 4 | CTA | 10,6 | 14,4 | blauw | "Het makkelijkste voornemen van 2027." De balk staat op 100 %, Buddy leunt tegen de kaart, knop "activeer buddy", "Geen app. Geen bankkoppeling.", woordmerk |

Beats (globale tijd, uit `timeline.py`): Buddy zucht 2,07 s · mail verschijnt 4,07 s · mail vliegt 4,73 s · balk op 100 % 5,33 s · vinkje 6,00 s · agenda 6,20 s · timer loopt 8,13 s · stappen 8,27 / 8,93 / 9,60 s · vinkje in timer 9,93 s · knop 11,80 s · tik 13,33 s.

Overgangen: bladzijde omslaan (flip) van de lijst naar de actie, klok (clockWipe) voor de 30 seconden, schuif van boven (slide) naar de afsluiter. Slotbeeld: Buddy leunt tegen de 100 %-balk; dat verschilt van Buddy bovenop de knop in concept 2 en 3.

## Voice-over (ElevenLabs, Multilingual v2, Speed 1,0)

Plakblok (één alinea, geen regeleindes):

```
Voornemens op vier januari. <break time="1.4s" /> Eén mail doorsturen. <break time="0.4s" /> Honderd procent. <break time="0.1s" /> Buddy zet hem in je agenda. Het voornemen van dertig seconden. <break time="0.3s" /> Het makkelijkste voornemen. Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Voornemens op vier januari. | Kop en balken op drie, een en nul procent |
| 3,3 | Eén mail doorsturen. | Kop scène 2, de mail verschijnt (4,1 s) |
| 5,0 | Honderd procent. | De balk springt naar 100 % (5,3 s) |
| 6,2 | Buddy zet hem in je agenda. | Agenda-item met seintjes (6,2 s) |
| 8,3 | Het voornemen van dertig seconden. | Kop scène 3, timer loopt af (8,1 s) |
| 10,9 | Het makkelijkste voornemen. | Kop scène 4, balk op 100 % |
| 12,8 | Activeer Buddy. | Knop "activeer buddy" (11,8 s), tik (13,3 s) |

- **Doellengte van de mp3:** ~13,8 s (25 woorden) voor een video van 14,4 s. Wijkt je opname af: Speed 1,05 tot 1,1 of kortere breaks.
- **Exact en geschat:** de beeldmomenten zijn gemeten, de spreektijden zijn een schatting (5 lettergrepen per seconde). Twee zinnen starten ~0,2 s na hun beat; dat is geen probleem.
- **Onder de video zetten:** mp3 in `public/`, bestandsnaam in de prop `music`, `musicVolume` op 1.

## Instagram-caption (Reel)

```
Sporten 3 %, minder scrollen 1 %, eerder naar bed 0 %. 😅 Eén mail doorsturen haal je wél in 30 seconden.

Zo werkt het:
1️⃣ Stuur een rekening door naar je eigen Buddy-adres.
2️⃣ Buddy haalt bedrag en vervaldatum eruit en zet de datum in je agenda. 📅
3️⃣ Jij krijgt een seintje, 7 en 2 dagen vooraf. Rekeningen op tijd: 100 %. ✅

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#voornemens #nieuwjaar #rekeningen #geldzaken #betaalbuddy
```

## Story-poll

`DEC16-Voornemen-Story` is de achtergrond van de Story: de vraag "Welk voornemen houd jij het langst vol?", dezelfde drie balken en de hint "Rekeningen op tijd: één mail doorsturen." Het vlak y 1290 t/m 1520 is bewust leeg voor de poll-sticker van Instagram. Een poll heeft twee antwoorden: kies bijvoorbeeld **Sporten** en **Minder scrollen**, en laat de reacties vanzelf vragen om "Eerder naar bed". Woordmerk en chip (productmoment) staan onderaan.

## Ads Manager-teksten (als de Reel achter budget gaat)

- **Primaire tekst:** `Sporten 3 %, eerder naar bed 0 %. Eén mail doorsturen haal je wél in 30 seconden: rekeningen op tijd.`
- **Kop:** `Het voornemen van 30 seconden`
- **Knop:** Aanmelden
- Poort voor betaald (campagnebestand): eerst 8.000+ weergaven en meer dan 30 % kijkt 3 seconden organisch; laag Bereik (TOFU/MOFU).
- De link moet naar de gekozen instappagina wijzen.

## Open controles

- **"30 seconden":** de claim slaat op één mail doorsturen. Controleer voor plaatsing dat het openen en doorsturen van een mail in de praktijk binnen die tijd lukt, en dat je de aanmelding nergens als "30 seconden" noemt.
- **"Het makkelijkste voornemen van 2027":** een overtreffende trap. Houd je dat liever feitelijk, wijzig dan de tagline in `schema.ts` (bijvoorbeeld "Een voornemen dat je meteen haalt.").
- **Percentages in de balken** (3 %, 1 %, 0 %) zijn illustratief, geen cijfers uit onderzoek. Er staat geen bron bij en dat hoeft niet; zet er geen bron of "gemiddeld" bij.
- **Voorbeeldmail:** "Telefoonprovider, Je factuur van januari, 28 jan" is generiek en verzonnen.
- **Link in bio** en de bestemming van de ad: welke instappagina is nog niet besloten.

## Aanpassen en renderen

- Studio: `npm run dev`, map `December-Lijstje` → `D16-Voornemen` → `DEC16-Voornemen-Reel`, `-Feed` of `-Story`. Alle teksten, de percentages, de kleuren en de scènelengtes staan in het Props-paneel. `showSafeZones` uit voor je exporteert.
- Blijvend wijzigen: `src/december/d16-voornemen/schema.ts` (`defaultVoornemenProps`, `defaultVoornemenStoryProps`).
- Renderen: `node scripts/render-december.cjs DEC16-Voornemen-Reel,DEC16-Voornemen-Feed,DEC16-Voornemen-Story`. Cover van een ander frame: `node scripts/render-december.cjs DEC16-Voornemen-Reel@66`.
