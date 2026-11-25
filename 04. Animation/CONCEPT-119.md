# Concept 119 · "Eén lijst. Geen doos."

**USP:** `overzicht` (rotatieregel: laatst gebruikt in 110 volgens de changelog; 111 tot 118 alle andere USP's).
**Vorm:** één doorlopend shot zonder scènewissel, tekst op de stem (niet in 116, 117, 118; laatst 115).
**Metafoor:** de schoenendoos vol losse rekeningen. Afgevallen: archiefkast (te dicht op la 65) en wasknijperlijn (te druk).
**Instappagina:** er is geen overzicht-pagina; algemene startpagina (pad nog niet bevestigd).

## Verhaal (13,6 s, 409 frames, 1080×1920, één shot)
| Tijd | Stem | Beeld |
|---|---|---|
| 0,00 [S1] | Rekeningen in een schoenendoos? Dan weet je nooit wat er openstaat. | Licht. Kop staat op frame 0. Kartonnen doos "rekeningen" met zes losse briefjes (bedrag "€ ?"), ze wiebelen. Op "openstaat" (3,77 s) chip "Wat staat er nog open?". |
| 4,60 [S2] | Stuur ze door naar Buddy. | Achtergrond loopt door naar blauw. Buddy springt uit de doos; vanaf "door" vliegen de briefjes één voor één in hem, hij slikt elk briefje met een squash. |
| 6,47 [S3] | Hij zet ze in één overzicht. Exporteren kan ook. | De kaart "Jouw rekeningen · 6 open" groeit uit Buddy, Buddy hipt op de hoek. Vanaf "zet" landen zes rijen (afzender, vervaldatum, bedrag), gesorteerd op datum. De doos zakt naar onder. Op "Exporteren" (8,57 s) ploppen de chips CSV en JSON. |
| 9,97 [S4] | Eén lijst. Geen doos. Activeer Buddy. | Kop "Eén lijst. Geen doos.", de kaart krimpt. Op "Geen" valt het deksel op de doos, op "doos" valt de doos uit beeld. Op "Activeer" de knop activeer buddy, woordmerk en "Geen app. Geen bankkoppeling."; tik met ripple, Buddy kijkt blij vanaf de kaart. |

Tijden zijn een **schatting** (`timing.json` met `"source": "estimate"`): de ElevenLabs-take kon niet gemaakt worden (quota op). Zodra de stem er is, draai `tools/vo_timing.py` met `--alignment` en alle beats schuiven mee.

## Uniciteit
Verschilt van 1, 2, 3, 62 en 110 (koelkast, ook overzicht) op invalshoek of vorm, visueel systeem (objectscène in één shot met doos en lijstkaart), Buddy (springt uit de doos en slikt de briefjes, zit daarna op de lijst), einde (opruimen: de doos verdwijnt), slotbeeld (Buddy op de hoek van de lijst, geen sprong op de knop) en overgangen (geen: kleurverloop, kopwissel en objecten die doorbewegen).

## Voice-over (ElevenLabs, eleven_v4, nl, stability 0,5, similarity 0,75, stem uit ELEVENLABS_VOICE_ID)
```
[S1] Rekeningen in een schoenendoos? Dan weet je nooit wat er openstaat. [S2] Stuur ze door naar Buddy. [S3] Hij zet ze in één overzicht. Exporteren kan ook. [S4] Eén lijst. Geen doos. Activeer Buddy.
```
31 woorden. Bronbestand: `public/vo/doos/script.txt`.

Stem later toevoegen:
```bash
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID/with-timestamps?output_format=mp3_44100_128" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" -H "Content-Type: application/json" \
  -d '{"text":"Rekeningen in een schoenendoos? Dan weet je nooit wat er openstaat. Stuur ze door naar Buddy. Hij zet ze in één overzicht. Exporteren kan ook. Eén lijst. Geen doos. Activeer Buddy.","model_id":"eleven_v4","language_code":"nl","voice_settings":{"stability":0.5,"similarity_boost":0.75}}' \
  -o public/vo/doos/vo.json
python3 -c "import json,base64;open('public/vo/doos/voice-over.mp3','wb').write(base64.b64decode(json.load(open('public/vo/doos/vo.json'))['audio_base64']))"
python3 tools/vo_timing.py public/vo/doos/script.txt public/vo/doos/timing.json --alignment public/vo/doos/vo.json
# zet withVoice op true in src/doos/schema.ts en render met: npm run render:doos
```

## Code
`src/doos/` (`schema.ts`, `DoosAd.tsx`, `Parts.tsx`), compositie `BB-Doos-Reel` in map `Concept-119-Doos`, `npm run render:doos`. Geen gedeelde code aangepast.

## Caption
Zie `doos-caption.md` in de Drive-map. Ads Manager: primaire tekst "Rekeningen in een schoenendoos? Stuur ze door naar Buddy en je hebt ze allemaal in één overzicht." (97 tekens), kop "Eén lijst. Geen doos.", beschrijving "Geen app. Geen bankkoppeling.", knop Aanmelden.

<!-- copycheck:off -->
## Copyregels
Geen gratis, geen prijs, geen AI-claim, geen merknamen (generieke afzenders), geen gedachtestreepjes. Overzicht en export zitten in alle pakketten (Lite en hoger).
<!-- copycheck:on -->

## Open punten
- Stem nog maken (ElevenLabs-quota op 0).
- Bevestigen dat het overzicht per rekening afzender, bedrag en vervaldatum toont zoals in beeld.
