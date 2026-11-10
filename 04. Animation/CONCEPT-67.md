# BetaalBuddy · Instagram ad, concept 67

## "Geen app. Je mail is genoeg." (volle telefoon)

**In één zin:** een telefoon vol apps met badges wil er nog een rekeningen-app bij installeren terwijl de opslag vol is; Buddy zegt "hoeft niet", geeft de telefoon een duw zodat alle apps eruit vallen, en laat zien dat doorsturen genoeg is: de vervaldatum belandt in je agenda, waarna de camera het scherm in duikt en Buddy aan het eind de laatste app uit beeld schopt.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-GeenApp-Reel`) · 4:5 feed 1080×1350 (`BB-GeenApp-Feed`) |
| Lengte | 12,33 s (370 frames, 30 fps): stem 11,31 s plus 1 s CTA. Eén doorlopend shot, geen scènewissel |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| USP | `geen-app` (nooit gebruikt; gelijkspel met `overzicht` en `doelgroep`, bovenste in brand §4 wint) |
| Vorm | één doorlopend shot zonder scènewissel, met tekst op de stem (niet in de laatste drie: 64 mythe, 65 vraag en antwoord, 66 rekensom) |
| Aanpassen | `src/geenapp/schema.ts` (teksten, kleuren, `withVoice`, `voiceVolume`); beats in `BEATS`, timing uit `public/vo/geenapp/timing.json` |
| Render | `npm run render:geenapp` en `render:geenapp:feed` (met stem, daarna loudnorm I -14, TP -1, LRA 11), `render:geenapp:stil` en `render:geenapp:feed:stil`, `still:geenapp` (cover frame 80) |

Gekozen: USP geen-app via de rotatieregel, vorm "één doorlopend shot" omdat geen enkel concept zonder scènewissel werkt, metafoor "volle telefoon die leeggeschud wordt" (afgevallen: een la vol opladers, een appstore-downloadbalk die nooit hoeft te lopen).

### Uniciteit (zie CONCEPTEN.md)
| | 1 | 2 | 3 | 62 | 63/64 | 65 | 66 | **67** |
|---|---|---|---|---|---|---|---|---|
| Invalshoek | Overzicht | Timing | Privacy | Wegleggen werkt niet | Geen AI | Inzage | Prijs | **Geen app: je telefoon zit al vol** |
| Visueel systeem | UI | Typografisch | Focus | Vluchtbanen | Kaart/sjabloon | Glas | Weegschaal | **Eén telefoon in één shot, apps met fysica** |
| Buddy | Slikt rekening | Rijdt mee | Slaapmasker | Vangt en gooit | Vinkt af / sjabloon | Trekt la open | Weegt het gewicht eraf | **Schudt nee, duwt de telefoon om, vangt de mail, gooit de datum in de agenda** |
| Einde | Belofte | Uitkomst | Regie | Omkering | Ontkrachting | Transparantie | Rekensom | **Reductie: scherm leeg, alleen mail en agenda** |
| Slotbeeld | | | | Boemerang | Liniaal / gluurt | Raamwisser | Zit op prijs | **Schopt de laatste app uit beeld** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | flip, slam | lade, raamwisser | kantel, rekenstreep | **geen cuts: kantel-duw en screen-dive (camera duikt het scherm in, wallpaper wordt de CTA-achtergrond)** |

Verschilt op 6 van 6 punten met elk concept in de index.

## Storyboard (één shot; beats op gesproken woorden)

| Deel | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) | 0,00 tot 3,43 s | Kop "Nog een app voor je rekeningen?" staat op frame 0, met een telefoon vol wiebelende apps met rode badges. Sheet "Rekeningen-app · Installeren" schuift omhoog; chip "Opslag vol" plus schok op "vol" (2,47 s). Subregel "Je telefoon zit al vol." |
| 2 · Hoeft niet (licht) | 3,43 tot 6,23 s | Kop "Hoeft niet." Buddy springt erin, telefoon schuift opzij; op "niet" (3,73 s) schudt Buddy nee en valt het installatiesheet weg. Op "Buddy" (4,57 s) duwt hij de telefoon, die kantelt en alle zestien apps tuimelen eruit; leeg op "app" (5,60 s), Buddy blij. Subregel "Buddy werkt zonder app." |
| 3 · Doorsturen (licht) | 6,23 tot 10,07 s | Kop "Doorsturen. Dat is alles." Mail Energieleverancier €87,60 verschijnt; tik op Doorsturen op "door" (7,27 s); de mail vliegt naar Buddy (vangst 7,80 s), chip "do 17 dec" op "vervaldatum" (7,93 s), Buddy gooit hem op "komt" (8,73 s) in de agenda-tegel; agendawidget do 17 met de rekening en "Herinnering wanneer jij kiest" op "agenda" (9,13 s). Subregel "Je mail en je agenda zijn genoeg." Vanaf 9,60 s duikt de camera het scherm in (screen-dive, tot 10,20 s). |
| 4 · CTA (blauw) | 10,07 tot 12,33 s | Tagline "Geen app. Je mail is genoeg." Witte Buddy, de laatste app rolt binnen en Buddy schopt hem uit beeld (11,07 s); knop "activeer buddy" met tik op "Buddy" (10,73 s), woordmerk, subregel "Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt." |

## Voice-over (ElevenLabs, één take, 32 woorden, 11,31 s)

Naar ElevenLabs (zonder markers):
```
Nog een app voor je rekeningen, terwijl je telefoon vol zit? Hoeft niet, want Buddy werkt zonder app. Je stuurt je rekening door en de vervaldatum komt in je agenda. Activeer Buddy.
```
Met scènemarkers:
```
[S1] Nog een app voor je rekeningen, terwijl je telefoon vol zit? [S2] Hoeft niet, want Buddy werkt zonder app. [S3] Je stuurt je rekening door en de vervaldatum komt in je agenda. [S4] Activeer Buddy.
```

| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Nog een app voor je rekeningen, terwijl je telefoon vol zit? | Volle telefoon, sheet Installeren, "Opslag vol" op "vol" (frame 74) |
| S2 | 3,44 | 103 | Hoeft niet, want Buddy werkt zonder app. | Buddy springt erin (103), sheet weg (112), duw en apps vallen (137), leeg (168) |
| S3 | 6,24 | 187 | Je stuurt je rekening door en de vervaldatum komt in je agenda. | Mail (192), tik (218), vangst (234), chip (238), worp (262), agenda (274) |
| S4 | 10,08 | 302 | Activeer Buddy. | CTA, knop (306), tik (322), schop (332) |

Eerste take had 33 woorden ("vanzelf") en is opnieuw gegenereerd. Luistertoets: langste pauze tussen woorden 0,32 s (alignment), silencedetect -35 dB max 0,54 s. Niet versneld.

## Caption en Ads Manager
Zie `renders/geenapp-caption.md`.
- Primaire tekst (104): Nog een app voor je rekeningen? Hoeft niet. Stuur je rekening door en de vervaldatum staat in je agenda.
- Kop (28): Geen app. Je mail is genoeg.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Brand §2 en §3: geen prijs, geen "gratis", geen merknamen (alle apps zijn generieke tegels zonder naam), geen "scant je inbox". "Herinnering wanneer jij kiest" volgt onboarding v5.1. Copycheck: geen treffers.
<!-- copycheck:on -->

## Open punten
- Instappagina voor knop en link in bio; er is geen aparte pagina voor "geen app". "Privacy zonder mailboxkoppeling" of "net op jezelf wonen" past het best.
- Agendadatum staat op december (do 17); na half december omzetten.
- Take beluisteren op de uitspraak van "Buddy".
