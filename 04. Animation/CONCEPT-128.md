# BetaalBuddy · Instagram ad, concept 128

## "Alleen wat jij erin stopt." (buizenpost)

**In één zin:** een stekker met "Volledige toegang" wil in je mailbox, maar dat hoeft niet; jij haalt er één rekening uit, die schiet in een buizenpostcapsule door een buis naar Buddy, en Buddy leest alleen wat er aankomt.

| | |
|---|---|
| USP | `geen-koppeling` (rotatieregel: laatst gebruikt in 120, daarna 121 tot 127 alle andere USP's) |
| Vorm | één doorlopend shot, geen scènewissel (125 rekensom, 126 twee schermen, 127 vraag en antwoord) |
| Formaat | Alleen 9:16 Reel 1080×1920 (`BB-Buizenpost-Reel`, map `Concept-128-Buizenpost`) |
| Lengte | 12,30 s (369 frames, 30 fps): stem (geschat) 11,3 s plus 1 s CTA |
| Stem | **Nog niet gegenereerd** (ElevenLabs: 0 credits). `timing.json` is een schatting; zie "Stem toevoegen" |
| Aanpassen | `src/buizenpost/schema.ts` (teksten, bedragen, kleuren, `withVoice`); geometrie in `src/buizenpost/parts.tsx` |
| Render | `npm run render:buizenpost` |

Afgevallen metaforen: doorgeefluik (te dicht bij brievenbus 104), zaklamp in het donker (te dicht bij focus 3 en röntgen 75).

### Uniciteit
| | 3 | 72 | 80 | 104 | 120 | **128** |
|---|---|---|---|---|---|---|
| Vorm | probleem | mythe | vraag en antwoord | twee schermen | probleem | **één shot** |
| Visueel | focus | object | tafeltennis | voordeur | sleutels | **buizenpost: buis met S-bocht, camera rijdt mee** |
| Buddy | slaapmasker | | | | | **vangt de capsule onder de buis, leest vier vakjes af** |
| Einde | regie | | | | | **tweede capsule bezorgt de knop** |
| Overgangen | wipe, focus pull | | | | | **geen: camerarit van licht naar blauw onder een vaste kopband** |

## Storyboard (geschatte tijden, volgen de stem via timing.json)

| Beat | Tijd | Beeld |
|---|---|---|
| S1 Hook (licht) | 0,00 tot 2,60 s | Kop "Toegang tot je hele mailbox?" op frame 0; mailbox met acht afzenders, stekker "Volledige toegang" nadert. Op "Hoeft" (1,90 s) stempel "Hoeft niet.", stekker wordt weggerukt. |
| S2 Kiezen | 2,60 tot 4,50 s | "Jij stopt er één rekening in." Rij Zorgverzekeraar €128,95 komt los (2,73 s), vliegt naar de trechter op "één" (3,20 s) en wordt een capsule die erin valt op "in" (4,00 s). |
| S3 Buis | 4,50 tot 6,50 s | "Die gaat door de buis. Meer niet." Capsule raast door de S-bocht, camera volgt, achtergrond en kopband gaan van licht naar blauw. |
| S4 Lezen (blauw) | 6,50 tot 8,60 s | Capsule schiet uit de buis, Buddy vangt hem (6,77 s); kaart met Bedrag, Vervaldatum, Betaallink, Kenmerk vinkt af op de stem. |
| S5 CTA | 8,60 tot 12,30 s | Tagline "Alleen wat jij erin stopt." woord voor woord; Buddy springt opzij, tweede capsule valt en springt open: knop "activeer buddy" op "Activeer" (10,30 s), subregel, woordmerk, tik op 11,23 s. |

## Voice-over (ElevenLabs, één take, 33 woorden)

```
[S1] Toegang tot je hele mailbox? Hoeft niet. [S2] Jij stopt er één rekening in. [S3] Die gaat door de buis. Meer niet. [S4] Buddy leest alleen wat er aankomt. [S5] Alleen wat jij erin stopt. Activeer Buddy.
```
Staat ook in `public/vo/buizenpost/script.txt`.

### Stem toevoegen (zodra er credits zijn)
1. Genereer de tekst zonder markers via `/v1/text-to-speech/$ELEVENLABS_VOICE_ID/with-timestamps` (model eleven_v4, nl, stability 0,5, similarity 0,75) naar `public/vo/buizenpost/vo.json`, en decodeer `audio_base64` naar `public/vo/buizenpost/voice-over.mp3`.
2. `python3 scripts/vo_to_timing.py public/vo/buizenpost/script.txt public/vo/buizenpost/timing.json --alignment public/vo/buizenpost/vo.json`
3. Controleer `maxGapSeconds` ≤ 0,7 en render met `npm run render:buizenpost`; daarna loudnorm (I -14, TP -1, LRA 11). De `<Audio>` speelt automatisch zodra timing.json uit een alignment komt.

## Caption
Zie `renders/buizenpost-caption.md`.

## Ads Manager
- Primaire tekst (112): Geen toegang tot je mailbox nodig. Stuur alleen je rekening door. Buddy leest bedrag, vervaldatum en betaallink.
- Kop (26): Alleen wat jij erin stopt.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Geen prijs, pakket, agenda, "gratis" of AI. Alleen bevestigde feiten: doorsturen, geen mailbox- of bankkoppeling, Buddy leest bedrag, vervaldatum, betaallink en kenmerk, overzicht (alle pakketten).
<!-- copycheck:on -->

## Open punten
- Stem genereren (ElevenLabs-credits op) en opnieuw renderen.
- Instappagina: "privacy zonder mailboxkoppeling".
