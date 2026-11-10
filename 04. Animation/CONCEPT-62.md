# BetaalBuddy · Instagram ad, concept 62

## "Nu komt hij op tijd terug." (boemerang)

**In één zin:** je gooit een rekening weg, maar hij vliegt als een boemerang een lus en komt terug als aanmaning; stuur hem door, dan vangt Buddy hem in een sprong en gooit hem precies op de vervaldatum in je agenda, en aan het eind gooit Buddy zelf een boemerang die netjes terugkomt.

| | |
|---|---|
| Formaat | Alleen 9:16 Reel 1080×1920 met stem (`BB-Boemerang-Reel`) |
| Lengte | 11,73 s (352 frames, 30 fps): stem 10,73 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID`, model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/boemerang/schema.ts` (teksten, kleuren, `withVoice`, `transitionFrames`); timing uit `public/vo/boemerang/timing.json` |
| Render | `npm run render:boemerang`, daarna loudnorm (I -14, TP -1, LRA 11) naar `renders/boemerang-reel-vo.mp4` |

### Uniciteit (zie CONCEPTEN.md)
| | 1 | 2 | 3 | **62** |
|---|---|---|---|---|
| Invalshoek | Overzicht | Timing | Privacy | **Wegleggen werkt niet: hij komt terug** |
| Visueel systeem | UI | Typografisch | Focus | **Vluchtbanen met stippelspoor** |
| Buddy | Slikt rekening | Rijdt mee op aftellen | Slaapmasker | **Vangt in een sprong, gooit op de datum** |
| Einde | Belofte | Uitkomst | Regie | **Omkering van de hook** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | **swing, spin-return** (CSS, `src/lib/boomerangWipes.ts`) |

Verschilt op 5 van 5 punten met elk concept in de index.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) | 0,00 tot 3,77 s | Kop "Gooi je die rekening weg?" staat op frame 0, met de rekening Energieleverancier €87,60. Vanaf 0,27 s vliegt hij draaiend een lus uit beeld met stippelspoor, komt bij "terug" van links terug en landt op "aanmaning" (2,73 s): label Te laat, stempel AANMANING, schok, chip "Kan uitlopen op €40". |
| 2 · Doorsturen (blauw, swing) | 3,77 tot 5,23 s | "Stuur hem door naar Buddy." Tik op Doorsturen bij "door" (4,23 s); de kaart wordt draaiend weggegooid, Buddy kijkt hem na. |
| 3 · Agenda (licht, spin-return) | 5,23 tot 7,67 s | "Buddy zet hem in je agenda." De kaart komt terug, Buddy vangt hem in een sprong op "vangt" (5,53 s), gooit hem in een boog op do 17 (landt op "agenda", 6,73 s); belletje Herinnering op ma 14; subregel "Jij kiest wanneer je een herinnering krijgt." |
| 4 · CTA (blauw, swing) | 7,67 tot 11,73 s | Tagline "Nu komt hij op tijd terug." woord voor woord op de stem. Buddy gooit een gele boemerang die een lus om de knopzone maakt en terugkomt in zijn hand; knop "activeer buddy" op "Activeer" (9,73 s), tik op 10,67 s, woordmerk. |

## Voice-over (ElevenLabs, één take, 32 woorden)

```
[S1] Gooi je die rekening weg? Hij komt terug. Als aanmaning. [S2] Stuur hem door naar Buddy. [S3] Buddy vangt hem en zet hem in je agenda. [S4] Nu komt hij op tijd terug. Activeer Buddy.
```
Luistertoets: langste pauze tussen woorden 0,20 s (alignment); silencedetect -35 dB max 0,52 s.

## Caption
Zie `renders/boemerang-caption.md`.

## Ads Manager
- Primaire tekst (101): Rekening weggelegd? Hij komt terug als aanmaning. Stuur hem door, Buddy zet hem op tijd in je agenda.
- Kop (26): Nu komt hij op tijd terug.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Volgt onboarding v5.1 uit de changelog: herinnering in je agenda wanneer jij kiest; geen prijs, pakketnaam, betaallink, "gratis" of "mail op 7 en 2 dagen". €40 alleen met "kan".
<!-- copycheck:on -->

## Open punten
- Welke herinnermomenten je kunt kiezen; "ma 14" is een voorbeeld. Datums staan op december.
- Instappagina voor knop en link in bio; "aanmaning en incassokosten" past het best.
