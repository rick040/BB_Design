# BetaalBuddy · Instagram ad, concept 77

## "Klaar voordat die app laadt." (wedstrijd)

**In één zin:** een rekeningen-app staat op 1% te installeren en vraagt om een account, een wachtwoord, meldingen en inloggen; Buddy hoeft dat niet: in een race met twee banen stuur je de rekening door, Buddy slikt hem in, sprint over de finish en spuugt hem op de vervaldatum in je agenda, terwijl de app op de andere baan nog op 7% laadt.

| | |
|---|---|
| USP | `geen-app` (het langst niet gebruikt, laatst in 67) |
| Verhaalvorm | Twee banen naast elkaar, met en zonder Buddy, als wedstrijd (niet in de laatste drie: 74 één shot, 75 vraag en antwoord, 76 mythe tegenover feit) |
| Formaat | `BB-Wedstrijd-Reel` 1080×1920 en `BB-Wedstrijd-Feed` 1080×1350, map Concept-77-Wedstrijd |
| Lengte | 11,10 s (333 frames, 30 fps): stem 10,10 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` (API) |
| Aanpassen | `src/wedstrijd/schema.ts` (teksten, kleuren, `withVoice`, `transitionFrames`); timing uit `public/vo/wedstrijd/timing.json` |
| Render | `npm run render:wedstrijd` en `npm run render:wedstrijd:feed`, daarna loudnorm (I -14, TP -1, LRA 11) |

### Uniciteit
Gekozen metafoor uit drie: wedstrijd met twee banen (gekozen), sleutelbos vol app-sleutels, gereedschapskist die je niet nodig hebt. De wedstrijd lijkt het minst op de index.

| | 67 (volle telefoon, ook geen-app) | 68/69 (split screen) | **77** |
|---|---|---|---|
| Invalshoek | Geen app: telefoon is vol | Overzicht | **Geen app: je bent klaar voordat een app geïnstalleerd is** |
| Visueel systeem | Telefoon vol apps, camera duikt scherm in | Links/rechts zonder en met Buddy | **Twee racebanen boven elkaar met finishlijn, laadring** |
| Buddy | Duwt de telefoon om, schopt app weg | Geeft rekeningen door over de scheidslijn | **Slikt de rekening, sprint over de finish, spuugt hem in de agenda** |
| Einde | Buddy schopt app uit beeld | Lijst vouwt op | **Buddy springt als winnaar op de knop (podium)** |
| Overgangen | | | **baanstrepen (lanes sprinten in), finishvlag (dambordreveal)**, `src/lib/raceWipes.ts` |

Verschilt met 67 op 4 van 5 punten (alles behalve de USP), met 68/69 op 5 van 5, met de rest op 5 van 5.

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) | 0,00 tot 2,17 s | Kop "Nog een app downloaden?" staat op frame 0. Installatiekaart "Rekeningen-app" op 1%, laadring draait; op "downloaden" en "rekeningen" stapelen zich de klusjes: Account aanmaken, Wachtwoord kiezen, Meldingen toestaan, Inloggen. De kaart zakt en schudt. |
| 2 · Doorsturen (blauw, baanstrepen) | 2,17 tot 5,57 s | "Hoeft niet. Stuur hem door." Twee banen: "Met een app" (laadt op 3%) en "Met Buddy" met de rekening van de Zorgverzekeraar €142,30. Tik op Doorsturen op "stuurt" (3,27 s); de kaart vliegt in Buddy op "door"; op "Buddy" (4,97 s) sprint hij weg met snelheidsstrepen. |
| 3 · Agenda (licht, finishvlag) | 5,57 tot 8,80 s | "Al in je agenda." Buddy schiet over de finish op "staat" (5,83 s); de weekstrip ma 14 tot vr 18 springt op; Buddy spuugt een geel bedragpilletje dat op "agenda" (6,60 s) op do 17 landt, vinkje. Op "app geladen" schudt de laadring (nog 7%), subregel "En die app? Die laadt nog." |
| 4 · CTA (blauw, baanstrepen van rechts) | 8,80 tot 11,10 s | Tagline "Klaar voordat die app laadt." Knop "activeer buddy" op "Activeer" (8,80 s); Buddy springt in één boog van links op de knop als op een podium (landt na "Buddy", 9,57 s), blije ogen; woordmerk en "Geen app. Geen bankkoppeling." |

## Voice-over (ElevenLabs, één take, 32 woorden)

```
[S1] Nog een app downloaden voor je rekeningen? [S2] Hoeft niet, want je stuurt je rekening gewoon door naar Buddy, [S3] en hij staat al in je agenda voordat die app geladen is. [S4] Activeer Buddy.
```

Naar ElevenLabs ging (zonder markers):
```
Nog een app downloaden voor je rekeningen? Hoeft niet, want je stuurt je rekening gewoon door naar Buddy, en hij staat al in je agenda voordat die app geladen is. Activeer Buddy.
```

| Cue | Start | Frame | Gesproken | Beeld |
|---|---|---|---|---|
| S1 | 0,00 s | 0 | Nog een app downloaden voor je rekeningen? | Installatiekaart op 1%, klusjes stapelen |
| S2 | 2,17 s | 65 | Hoeft niet, want je stuurt je rekening gewoon door naar Buddy, | Banen sprinten in; tik op Doorsturen (frame 98), Buddy slikt (131), sprint (149) |
| S3 | 5,57 s | 167 | en hij staat al in je agenda voordat die app geladen is. | Finishvlag; over de streep (175), landt op do 17 (198), laadring schudt (226) |
| S4 | 8,80 s | 264 | Activeer Buddy. | Knop (264), Buddy landt op de knop (287), tik (299) |

Luistertoets: langste pauze tussen woorden 0,28 s (alignment), silencedetect -35 dB max 0,44 s; niets versneld. MP3 10,03 s.

## Caption
Zie `renders/wedstrijd-caption.md`.

## Ads Manager
- Primaire tekst (94): Nog een app voor je rekeningen? Hoeft niet. Stuur ze door naar Buddy en ze staan in je agenda.
- Kop (28): Klaar voordat die app laadt.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Geen prijs, geen pakketnaam, geen "gratis", geen merknamen: de app in de ad is generiek ("Rekeningen-app", geen logo). De agenda volgt onboarding v5.1 (herinnering wanneer jij kiest).
<!-- copycheck:on -->

## Open punten
- Instappagina voor knop en link in bio: geen van de zes pagina's gaat over "geen app"; "aanmaning en incassokosten" of de homepage ligt het meest voor de hand.
- De vergelijking met "een app die nog laadt" is een knipoog, geen claim over een bestaande app. Laat iemand meekijken of dat zo overkomt.
- Datums staan op december (do 17 dec); na half december omzetten.
