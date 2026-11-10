# BetaalBuddy · Instagram ad, concept 65

## "Niks verstopt. Alles in zicht." (glazen la)

**In één zin:** drie korte vragen over je gegevens: wat Buddy van je weet (een matglazen la met een vraagteken), wat erin zit (Buddy trekt de la open, alleen de vier velden van wat jij doorstuurt), hoe je het ziet (mail naar gegevens@, er rolt een bon uit) en hoe lang (veertien dagen na de vervaldatum lossen de velden op en poetst Buddy het lege glas); slotbeeld: Buddy wist met een raamwisser het matglas voor de knop schoon.

| | |
|---|---|
| USP | `inzage` (nooit gebruikt; `geen-ai` was op 10 november al twee keer aan de beurt, concepten 63 en 64) |
| Vorm | vraag en antwoord in drie korte vragen (niet in de laatste drie: 62 probleem-doorsturen-uitkomst, 63 en 64 mythe tegenover feit) |
| Formaat | Alleen 9:16 Reel 1080×1920 met stem (`BB-Glasla-Reel`) |
| Lengte | 12,77 s (383 frames, 30 fps): stem 11,76 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID`, model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/glasla/schema.ts` (teksten, velden, kleuren, `withVoice`, `transitionFrames`); timing uit `public/vo/glasla/timing.json` |
| Render | `npm run render:glasla`, daarna loudnorm (I -14, TP -1, LRA 11) naar `renders/glasla-reel-vo.mp4` |

### Uniciteit (zie CONCEPTEN.md)
Verschilt op USP, vorm, visueel systeem (doorzichtig glas tegenover matglas), Buddy (trekt de la open, poetst, wist het glas met een raamwisser), einde (transparantie) en overgangen (lade-uit en raamwisser, CSS in `src/lib/glassWipes.ts`) met elk concept in de index.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) | 0,00 tot 1,67 s | Kop "Wat weet Buddy van jou?" staat op frame 0. Matglazen la met groot vraagteken, de velden erachter onleesbaar. Buddy duikt op bij "Buddy" (0,53 s), kijkt naar de la en dan naar jou. |
| 2 · De la (blauw, lade-uit) | 1,67 tot 3,53 s | "Alleen wat jij doorstuurt." Buddy trekt de la open, het glas is helder; op "jij" (2,33 s) vallen er vier velden in: bedrag, vervaldatum, betaallink, kenmerk. Subregel "Van één doorgestuurde rekening." |
| 3 · Inzien (licht, raamwisser) | 3,53 tot 6,33 s | "Wil je het zien?" Mailkaart, "gegevens@" wordt getypt op "Mail naar gegevens" (4,57 tot 5,33 s), tik op Versturen; er rolt een bon uit met afzender en de vier velden. Subregel "Je ziet precies wat Buddy van je heeft." |
| 4 · Daarna (blauw, raamwisser van rechts) | 6,33 tot 10,40 s | "En daarna?" wordt "14 dagen na de vervaldatum: weg." woord voor woord op de stem. Teller "do 17 dec + 14 dagen" loopt veertien vakjes vol (7,37 tot 9,37 s); op "weg" (9,77 s) lossen de velden op en poetst Buddy het lege glas; "Verwijderd". |
| 5 · CTA (blauw, lade-uit) | 10,40 tot 12,77 s | Tagline "Niks verstopt. Alles in zicht." Knop achter matglas; Buddy wist het met een gele raamwisser schoon (10,53 tot 11,20 s) en springt op de rand. Woordmerk en "Geen app. Geen bankkoppeling." op "Buddy" (11,13 s), tik op 11,7 s. |

## Voice-over (ElevenLabs, één take, 28 woorden)

```
[S1] Wat weet Buddy van jou? [S2] Alleen wat jij doorstuurt. [S3] Wil je het zien? Mail naar gegevens. [S4] En daarna? Veertien dagen na de vervaldatum is het weg. [S5] Activeer Buddy.
```
Scènestarts (frames): 0, 50, 106, 190, 312; einde stem 353. Luistertoets: langste pauze 0,50 s (silencedetect -35 dB, 0,2 s).

## Caption
Zie `renders/glasla-caption.md`.

## Ads Manager
- Primaire tekst (98): Buddy ziet alleen wat jij doorstuurt. Mail naar gegevens@ en je ziet precies wat hij van je heeft.
- Kop (30): Niks verstopt. Alles in zicht.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Volgt brand §2 en §4 voor `inzage`: inzage via gegevens@, bewaard tot 14 dagen na de vervaldatum, verwijderen via stop@. Niet "Buddy bewaart niets" of "direct verwijderd". Geen prijs, geen "gratis". Copycheck: geen treffers.
<!-- copycheck:on -->

## Open punten
- Volledig adres van gegevens@ en stop@ (domein) bevestigen; in beeld staat alleen "gegevens@".
- Bevestigen dat een mail naar gegevens@ een overzicht als deze bon terugstuurt; de bon is een verbeelding.
- Instappagina voor knop en link in bio; "privacy zonder mailboxkoppeling" past het best.
