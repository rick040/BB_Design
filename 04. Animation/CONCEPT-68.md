# BetaalBuddy · Instagram ad, concept 68

## "Alles op één plek." (split screen)

**In één zin:** het beeld is in tweeën gesplitst: links (licht, "Zonder Buddy") liggen losse rekeningen overal en nergens, rechts (blauw, "Met Buddy") wacht één leeg overzicht; je stuurt ze door, de briefjes vliegen over de scheidslijn in de rijen, Buddy duwt de schuifgreep naar links zodat het overzicht het hele beeld krijgt, sorteert op vervaldatum, markeert bedrag en datum en laat CSV en JSON zien; aan het eind klapt het overzicht in tot één kaart en leunt Buddy er tevreden tegenaan.

| | |
|---|---|
| USP | `overzicht` (nog nooit gebruikt; gelijkspel met `doelgroep`, bovenste in brand §4 wint) |
| Vorm | twee schermen naast elkaar, met en zonder Buddy (niet in de laatste drie: 65 vraag en antwoord, 66 rekensom, 67 één doorlopend shot) |
| Formaat | Alleen 9:16 Reel 1080×1920 met stem (`BB-Eenplek-Reel`) |
| Lengte | 15,87 s (476 frames, 30 fps): stem 14,87 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID`, model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/eenplek/schema.ts` (rekeningen, teksten, kleuren, `withVoice`); timing uit `public/vo/eenplek/timing.json` |
| Render | `npm run render:eenplek`, daarna loudnorm (I -14, TP -1, LRA 11) naar `renders/eenplek-reel-vo.mp4` |

### Uniciteit (zie CONCEPTEN.md)
Verschilt van elk concept in de index op minimaal 5 van de 6 punten. Nieuw: USP overzicht, split screen als visueel systeem, Buddy die de schuifgreep van een voor/na-slider wegduwt, einde als samenvatting (overzicht klapt in tot één kaart), slotbeeld Buddy leunt tegen de kaart, overgangen schuifgreep-sweep en rij-collapse.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Split (licht en blauw) | 0,00 tot 5,67 s | Kop "Waar was die rekening ook alweer?" op frame 0, in blauw op de lichte helft en wit op de blauwe. Links vijf losse briefjes (Sportschool, Zorgverzekeraar, Energieleverancier, Telefoonprovider, Gemeente) en een geel briefje "nog betalen??"; ze schudden op "nergens" (2,97 s). Rechts een leeg overzicht, label "Met Buddy" op "Rechts" (3,93 s), Buddy springt erin op "Buddy" (4,97 s). |
| 2 · Doorsturen | 5,67 tot 6,87 s | "Stuur ze door." De vijf briefjes vliegen een voor een in een boog over de scheidslijn en worden rijen in het overzicht; Buddy veert bij elke landing. |
| 3 · Overzicht (schuifgreep-sweep) | 6,87 tot 12,07 s | "Buddy zet ze onder elkaar." Buddy duwt de schuifgreep naar links, de lichte helft verdwijnt en het overzicht wordt beeldvullend. Op "onder" (7,60 s) sorteren de rijen op vervaldatum; op "bedrag" (8,63 s) een gele markering over de bedragen, op "vervaldatum" (9,27 s) een blauwe over de datums; op "Exporteren" (10,47 s) poppen de chips CSV en JSON. |
| 4 · CTA (rij-collapse) | 12,07 tot 15,87 s | Rijen schuiven in elkaar tot één kaart "Overzicht · 5 rekeningen"; tagline "Alles op één plek." woord voor woord op de stem; Buddy leunt tegen de kaart; knop "activeer buddy" op "Activeer" (13,67 s), tik op 14,80 s, subregel en woordmerk. |

## Voice-over (ElevenLabs, één take, 30 woorden)

```
[S1] Links: jouw rekeningen. Overal en nergens. Rechts: met Buddy. [S2] Stuur ze door. [S3] Buddy zet ze onder elkaar, met bedrag en vervaldatum. Exporteren kan ook. [S4] Alles op één plek. Activeer Buddy.
```
Luistertoets: langste pauze tussen woorden 0,40 s (alignment); silencedetect -35 dB max 0,52 s. Geslaagd in de eerste take.

## Caption
Zie `renders/eenplek-caption.md`.

## Ads Manager
- Primaire tekst (97): Rekeningen overal en nergens? Stuur ze door, Buddy zet ze onder elkaar met bedrag en vervaldatum.
- Kop (18): Alles op één plek.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Overzicht en export naar CSV of JSON zitten in alle pakketten (vanaf Lite). Geen prijs, geen pakketnaam, geen herinnering of agenda als belofte, geen "gratis". Generieke afzenders.
<!-- copycheck:on -->

## Open punten
- Instappagina voor knop en link in bio: er is geen pagina voor "overzicht"; "net op jezelf wonen" past het best.
- Bevestigen dat het overzicht de rekeningen op vervaldatum sorteert zoals in de animatie; de kolommen zijn een nagebouwde weergave.
