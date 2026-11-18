# BetaalBuddy · Instagram ad, concept 98

## "Geen knopen meer." (zakdoek)

**In één zin:** een knoop in je zakdoek onthoudt dát er iets was, niet wélke rekening; in twee schermen boven elkaar loopt de week bij "Zonder Buddy" voorbij do 17 met een vraagteken, terwijl bij "Met Buddy" de doorgestuurde rekening op do 17 in je agenda landt met een herinnering op het moment dat jij kiest. Aan het eind trekt Buddy de knopen uit de zakdoek en zwaait hem als vlaggetje.

| | |
|---|---|
| USP | `agenda` (rotatie over de volledige reeks uit de changelog: 90 agenda, 91 inzage, 92 prijs, 93 geen-app, 94 overzicht, 95 doelgroep, 96 geen-koppeling, 97 geen-ai) |
| Vorm | Twee schermen naast elkaar (boven elkaar in 9:16): zonder en met Buddy. Niet in 95, 96, 97 |
| Metafoor | Knoop in je zakdoek. Afgevallen: kookwekker (te dicht op broodrooster) en post-it (te dicht op prikbord) |
| Formaat | Alleen 9:16 Reel 1080×1920 met stem (`BB-Zakdoek-Reel`) |
| Lengte | 12,20 s (366 frames, 30 fps): stem 11,20 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID`, model eleven_v4, nl, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/zakdoek/schema.ts` (teksten, dagen, kleuren, `withVoice`); timing uit `public/vo/zakdoek/timing.json` |
| Render | `npm run render:zakdoek`, daarna loudnorm (I -14, TP -1, LRA 11) naar `renders/zakdoek-reel-vo.mp4` |

### Uniciteit (zie CONCEPTEN.md en de changelog)
| | 62 boemerang | 90 advent | 97 kruiswoord | **98 zakdoek** |
|---|---|---|---|---|
| USP | agenda | agenda | geen-ai | **agenda** |
| Visueel systeem | Vluchtbanen | Deurtjeskalender | Kruiswoordraster | **Gesplitst scherm: zakdoek met knopen tegenover weekstrook** |
| Buddy | Vangt en gooit | Springt uit deurtje | Stempelt letters | **Slikt de rekening, spuugt het bedrag op do 17 en hopt erachteraan; trekt aan het eind de knopen los** |
| Einde | Omkering | Deurtje 24 | Vinkje over puzzel | **Opgeloste metafoor: geen knopen meer, zakdoek als vlaggetje** |
| Overgangen | swing, spin-return | scharnierdeur, deurtjesraster | hokjes, arcering | **split (blauw scherm schuift onder het lichte), overname (blauw duwt het bovenscherm weg)** |

Verschilt op minstens vier van de zes punten met elk concept in de index en met 90 en 97 uit de changelog.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht, vol scherm) | 0,00 tot 3,77 s | Kop "Een knoop in je zakdoek?" staat op frame 0, met een geruite zakdoek met drie knopen. Op "Welke" (1,83 s) springen vraagteken-labels bij de knopen; subregel "Welke rekening was dat alweer?". |
| 2 · Split, doorsturen | 3,77 tot 5,13 s | Overgang split: het blauwe scherm "Met Buddy" schuift onder het lichte "Zonder Buddy". Onder: "Stuur hem door.", rekening Energieleverancier €87,60, tik op Doorsturen bij "door" (4,17 s), de rekening vliegt in een boog in Buddy. |
| 3 · Twee weken naast elkaar | 5,13 tot 8,73 s | Onder: "In je agenda.", vijf dagtegels; Buddy spuugt €87,60 op do 17 (landt op "agenda", 5,83 s) en hopt erop; op "kiest" (6,97 s) een belletje met "Herinnering" op ma 14, regel "Jij kiest wanneer.". Boven: dezelfde week, een vandaag-streepje loopt langs do 17, die kleurt donker met "Welke was het?". |
| 4 · CTA (blauw, overname) | 8,73 tot 12,20 s | Overgang overname: blauw duwt het bovenscherm weg. "Geen knopen meer." woord voor woord op de stem; Buddy houdt de zakdoek als vlaggetje en trekt op "knopen" (8,97 s) de knopen los; knop "activeer buddy" op "Activeer" (10,00 s), tik op 11,13 s, subregel en woordmerk. |

## Voice-over (ElevenLabs, één take, 32 woorden, 11,20 s)

```
[S1] Een knoop in je zakdoek? Welke rekening was dat alweer? [S2] Stuur hem door naar Buddy. [S3] Hij zet hem in je agenda. Jij kiest wanneer hij je herinnert. [S4] Geen knopen meer. Activeer Buddy.
```
Luistertoets: langste pauze tussen woorden 0,40 s (alignment); silencedetect -35 dB max 0,46 s.

## Caption
Zie `renders/zakdoek-caption.md`.

## Ads Manager
- Primaire tekst (112): Een knoop in je zakdoek? Stuur je rekening door. Buddy zet hem in je agenda, jij kiest wanneer hij je herinnert.
- Kop (17): Geen knopen meer.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Volgt onboarding v5.1: herinnering in je agenda op een moment dat jij kiest; geen prijs, pakketnaam, "gratis" of "mail op 7 en 2 dagen". Geen rood: "zonder Buddy" in #111827. Copycheck: geen treffers.
<!-- copycheck:on -->

## Open punten
- Instappagina: er is geen agenda-pagina; algemene startpagina of "aanmaning en incassokosten".
- Datums staan op december; "ma 14" is een voorbeeld van een gekozen herinnermoment.
