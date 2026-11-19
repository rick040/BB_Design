# BetaalBuddy · Instagram ad, concept 101

## "Geen app erbij."

**In één zin:** de mythe "voor rekeningen heb je een app nodig" wordt ontkracht met een volgepakte koffer (je telefoon): de extra app past er niet in, Buddy schopt hem eruit en wijst Mail en Agenda aan, die zitten er al in; doorsturen is genoeg.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Koffer-Reel`), alleen Reel met stem |
| Lengte | 14,37 s (431 frames, 30 fps): stem 13,36 s plus 1 s CTA |
| USP | `geen-app` (rotatie via de changelog: laatst concept 93; 94 tot 100 alle andere USP's) |
| Verhaalvorm | mythe tegenover feit (niet in 98, 99, 100) |
| Metafoor | volle koffer = je telefoon; afgevallen: app-store-wachtrij (te dicht op de installatiekaart van 93) en sleutelbos (72) |
| Geluid | Werkt zonder geluid; stem ElevenLabs eleven_v4, één take |

### Uniciteit (zes punten)
| | 93 zakmes (geen-app) | 95 weekdoos (mythe/feit) | **101 koffer** |
|---|---|---|---|
| Invalshoek | geen-app | doelgroep zorgnota's | geen-app |
| Vorm | vraag en antwoord | mythe tegenover feit | mythe tegenover feit, met flippend label MYTHE → FEIT |
| Visueel systeem | zakmes met onderdelen | weekdoos met vakjes | open koffer van boven, app-tegels als bagage |
| Buddy | embleem dat onderdelen uitklapt | legt nota's in vakjes | schopt de extra app uit de koffer, wijst Mail en Agenda aan, springt op do 17 |
| Einde / slotbeeld | handvat wordt de knop | Buddy als deksel op de doos | koffer ritst dicht, Buddy hangt als bagagelabel aan de zijkant |
| Overgangen | snede, lemmet | streep, capsule, deksel | labelflip, rits (tandjesrand), flappen (bagagebandflappen) |

## Storyboard (tijden uit de alignment, `public/vo/koffer/timing.json`)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Mythe (licht) | 0,00 tot 3,53 s | Label MYTHE, kop "Voor rekeningen heb je een app nodig." staat op frame 0. Open koffer met acht app-tegels, bagagelabel "Je telefoon". Op "app" (2,3 s) valt een donkere tegel "Rekeningen-app" erop en blijft klem zitten; koffer schudt; chip "Nog eentje erbij?" |
| 2 · Feit (licht) | 3,53 tot 7,20 s | Label flipt naar FEIT, kop "Mail en agenda staan er al op." Buddy springt op de deksel en schopt de extra app weg (4,1 s). Op "mail" (4,4 s) en "agenda" (4,9 s) lichten die tegels op met een vinkje, de rest dimt; label wiebelt op "telefoon"; chip "Al ingepakt." |
| 3 · Doorsturen (blauw) | 7,20 tot 10,93 s | Overgang rits. Kop "Doorsturen is genoeg." op de woorden. Rekening Energieleverancier €87,60, tik op Doorsturen, de rekening vliegt in Buddy; weekstrook ma 14 tot vr 18, €87,60 op do 17 bij "datum", Buddy springt erop; subregel "Buddy zet de datum in je agenda." |
| 4 · CTA (licht) | 10,93 tot 14,37 s | Overgang flappen. "Geen app erbij." op de woorden, de koffer ritst dicht, Buddy hangt als bagagelabel aan de zijkant; knop "activeer buddy" op "Activeer" (12,1 s), subregel "Geen app. Geen bankkoppeling.", woordmerk. |

## Voice-over (ElevenLabs, eleven_v4, nl, stem uit ELEVENLABS_VOICE_ID, stability 0,5, similarity 0,75)

```
[S1] Mythe: voor rekeningen heb je een app nodig. [S2] Feit: mail en agenda staan al op je telefoon. [S3] Doorsturen is genoeg: Buddy zet de datum in je agenda. [S4] Geen app erbij. Activeer Buddy.
```
32 woorden, 13,36 s, langste pauze 0,54 s (silencedetect -35 dB). Scènestarts 0 / 106 / 216 / 328 frames.

## Caption
Zie `renders/koffer-caption.md`.

## Ads Manager
- Primaire tekst (101): Geen extra app nodig. Stuur je rekening door en Buddy zet de vervaldatum in de agenda die je al hebt.
- Kop: Geen app erbij.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

Copycheck: geen treffers.

## Aanpassen en exporteren
`src/koffer/schema.ts` (teksten, kleuren), Studio-map Concept-101-Koffer, `npm run render:koffer`. Nieuwe CSS-overgangen in `src/lib/kofferWipes.ts`, componenten in `src/koffer/components/Suitcase.tsx`.

## Open punten
- Instappagina: er is geen geen-app-pagina; algemene startpagina gebruiken.
- Datums staan op december.
