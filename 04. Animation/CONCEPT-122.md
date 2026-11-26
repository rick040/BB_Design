# BetaalBuddy · Instagram ad, concept 122

## "Hij springt pas als jij draait."

**In één zin:** een rekening is een duveltje uit een doosje dat eruit springt wanneer het hem uitkomt (als aanmaning); met Buddy draai jij aan de slinger en springt hij eruit op het moment dat jij kiest, in je agenda.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Duveltje-Reel`). Geen Feed-versie in deze run |
| Lengte | 13,2 s (395 frames, 30 fps), stem plus 1 s CTA |
| USP | `agenda` (rotatieregel: laatst gebruikt in 114; 115 tot 121 alle andere USP's) |
| Vorm | Twee schermen naast elkaar (niet in 119, 120, 121) |
| Metafoor | Duveltje uit een doosje. Afgevallen: kookwekker (te dicht op broodrooster 74) en wekkerradio |
| Geluid | Werkt zonder geluid. Stem nog niet gegenereerd (ElevenLabs-quota op 0, zie Open controles) |

### Uniciteit (zes punten)
| | 62 Boemerang | 106 Halte | 114 Rekenmachine | **122 Duveltje** |
|---|---|---|---|---|
| Invalshoek | Wegleggen werkt niet | Jij kiest je halte | Terugrekenen vanaf vervaldatum | Wie bepaalt wanneer hij eruit springt |
| Visueel systeem | Vluchtbanen | Bus en lijnkaart | Zakrekenmachine | Speelgoed, gesplitst scherm |
| Buddy | Vangt en gooit | | Rekent | Zit op het deksel, draait de slinger |
| Einde | Omkering | | Rekensom | Regie: jij draait |
| Slotbeeld | Gooit boemerang rond knop | | | Buddy springt zelf als duveltje uit het doosje |
| Overgangen | swing, spin-return | schuifdeuren, lijn | | split (hook breekt in twee deuren), deksel (CTA klapt neer) |

## Storyboard (frames uit `public/vo/duveltje/timing.json`, nu een schatting)

### S1 · Hook (0,0 tot 3,3 s) · licht
- Frame 0: kop "Wanneer springt jouw rekening eruit?" en een blauw doosje "rekening" dat rammelt; de slinger draait vanzelf.
- 1,1 s en 2,1 s: het deksel wipt op, het bedrag €87,60 piept eruit.

### S2 · Twee schermen (3,3 tot 5,7 s) · overgang split
- Links licht "Zonder Buddy": slinger draait steeds sneller; op "aanmaning" knalt het deksel open, de rekening springt eruit met stempel AANMANING, chip "Niet jouw moment".
- Rechts blauw "Met Buddy": doosje "doorgestuurd", Buddy zit rustig op het deksel en kijkt opzij.

### S3 · Jij kiest (5,7 tot 9,3 s)
- De scheidslijn schuift naar links, links dimt. Buddy springt van het deksel naar de slinger, chip "Jij kiest: wo 16 dec" op "kies".
- Op "agenda" springt een agendategel eruit: wo 16 dec, 09:00, Energieleverancier €87,60 betalen, met vinkje.

### S4 · CTA (9,3 tot 13,2 s) · overgang deksel
- "Hij springt pas als jij draait." woord voor woord op de stem. Op "draait" springt Buddy zelf als duveltje uit een doosje.
- Knop "activeer buddy" op "Activeer", "Geen app. Geen bankkoppeling.", woordmerk.

<!-- copycheck:off -->
## Copyregels
Volgens brand §3. Geen prijs, geen gratis, alleen generieke afzender (Energieleverancier). Aanmaning als beeld, geen bedrag aan incassokosten.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, eleven_v4, stem uit ELEVENLABS_VOICE_ID)
Plaktekst (markers niet meesturen), 30 woorden, geschat 12,2 s:
```
[S1] Springt jouw rekening eruit wanneer het hem uitkomt? [S2] Zonder Buddy? Als aanmaning. [S3] Met Buddy kies jij het moment. In je agenda. [S4] Hij springt pas als jij draait. Activeer Buddy.
```
Na genereren: `vo.json` en `voice-over.mp3` in `public/vo/duveltje/`, dan
`python3 tools/vo_to_timing.py public/vo/duveltje/vo-tekst.txt public/vo/duveltje/timing.json --alignment public/vo/duveltje/vo.json`,
`withVoice: true` in `src/duveltje/schema.ts` en `npm run render:duveltje`. Alle scènes en beats schuiven dan vanzelf mee.

## Caption (Reels)
Zie `renders/duveltje-caption.md`.

**Ads Manager:** primaire tekst "Springt je rekening eruit als aanmaning? Met Buddy kies jij wanneer hij in je agenda opduikt." (93) · Kop "Hij springt pas als jij draait." (31) · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden".

## Open controles
- Stem ontbreekt: ElevenLabs-quota 0 credits (API 401 quota_exceeded, connector idem).
- Instappagina voor CTA en link in bio: algemene startpagina (pad nog niet bevestigd).
