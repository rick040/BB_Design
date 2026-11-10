# BetaalBuddy · Instagram ad, concept 68

## "Alles op één lijst." (overzicht, twee schermen naast elkaar)

**In één zin:** links "Zonder Buddy" liggen je rekeningen overal (briefje, envelop, mail, bonnetje, elk met een rood "Vervalt?"), rechts "Met Buddy" wacht een lege lijst; je stuurt ze door, Buddy staat op de scheidslijn en geeft ze één voor één door, de lijst duwt het rommelpaneel uit beeld, sorteert zich op datum met het bedrag erbij en vouwt aan het eind op tot één stapel waar Buddy op springt.

**Keuze:** USP `overzicht` (nooit gebruikt; gelijkspel met `doelgroep`, bovenste in brand §4 wint). Vorm "twee schermen naast elkaar" (niet in 65, 66, 67). Metafoor split screen rommel tegenover lijst, gekozen boven "spreadsheet die zichzelf vult" en "lade die sorteert" omdat geen enkel concept in de index een split screen heeft.

| | |
|---|---|
| Formaat | Alleen 9:16 Reel 1080×1920 met stem (`BB-Overzicht-Reel`) |
| Lengte | 12,60 s (378 frames, 30 fps): stem 11,53 s plus ruim 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID`, model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/overzicht/schema.ts` (rekeningen, teksten, kleuren, `withVoice`); beats in `OVZ_T` in `src/overzicht/OverzichtAd.tsx`; timing uit `public/vo/overzicht/timing.json` |
| Render | `npm run render:overzicht`, daarna loudnorm (I -14, TP -1, LRA 11) naar `renders/overzicht-reel-vo.mp4` |

### Uniciteit (zie CONCEPTEN.md)
Verschilt op 6 van 6 punten (USP, visueel systeem, Buddy, einde, slotbeeld, overgangen) met elk concept in de index: niemand gebruikte `overzicht`, een split screen, Buddy als doorgever op een scheidslijn, een slot op een opgevouwen stapel, of de overgangen divider-slide en list-fold.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook | 0,00 tot 3,27 s | Kop "Waar staan al je rekeningen?" staat op frame 0. Links licht paneel "Zonder Buddy" met vier scheve rekeningen (Zorgverzekeraar €138,50, Gemeente €96,00, Telefoonprovider €24,99, Sportschool €29,95); rechts blauw paneel "Met Buddy" met lege stippelvakken; Buddy op de scheidslijn. Op "Overal" (1,93 s) schudden de briefjes, subregel "Overal een beetje.", op "beetje" rode chips "Vervalt?". |
| 2 · Doorsturen | 3,27 tot 4,63 s | "Stuur ze door naar Buddy." Vanaf 3,47 s vliegen de vier rekeningen om de 0,23 s in een boog over Buddy (hij veert bij elke) en landen als rij in de lijst. |
| 3 · Overzicht (divider-slide) | 4,63 tot 8,63 s | Het lijstpaneel duwt het lege rommelpaneel weg en wordt schermbreed; Buddy rijdt mee naar de rechterhoek. "Alles in één overzicht." Op "datum" (6,63 s) schuiven datumchips in en sorteert de lijst zich (20 nov, 28 nov, 1 dec, 5 dec); op "bedrag" (7,60 s) lichten de bedragen geel op; op "erbij" chip "Exporteer naar CSV of JSON". |
| 4 · CTA (list-fold) | 8,63 tot 12,60 s | De lijst vouwt op tot één stapel "4 rekeningen · op datum". Tagline "Alles op één lijst." woord voor woord op de stem; Buddy springt op de stapel; knop "activeer buddy" op "Activeer" (10,33 s), woordmerk, subregel "Geen app. Geen bankkoppeling.", tik op 11,47 s. |

## Voice-over (ElevenLabs, één take, 31 woorden, 11,47 s)

```
[S1] Waar staan al je rekeningen? Overal een beetje. [S2] Stuur ze door naar Buddy. [S3] Dan staan ze in één overzicht, op datum, met het bedrag erbij. [S4] Alles op één lijst. Activeer Buddy.
```
Scènestarts (frames): 0, 98, 139, 259; einde stem 346. Luistertoets: langste pauze 0,48 s (alignment, na "rekeningen?"); silencedetect -35 dB max 0,47 s.

## Caption
Zie `renders/overzicht-caption.md`.

## Ads Manager
- Primaire tekst (107): Rekeningen overal? Stuur ze door naar Buddy en je ziet ze in één overzicht, op datum, met het bedrag erbij.
- Kop (19): Alles op één lijst.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Overzicht en export naar CSV of JSON zitten in elk pakket (vanaf Lite), dus geen prijs nodig en geen claim over herinneringen. Geen "gratis", geen AI, geen merknamen (generieke afzenders).
<!-- copycheck:on -->

## Open punten
- Instappagina voor knop en link in bio: er is geen pagina voor "overzicht"; "net op jezelf wonen" past het best.
- Datums (20 nov tot 5 dec) en bedragen zijn voorbeelden.
