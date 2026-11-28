# BetaalBuddy · Instagram ad, concept 129
## "Geen AI. Gewoon vaste regels."

**USP:** `geen-ai` (rotatieregel: laatst gebruikt in 121; 122 tot 128 alle andere USP's).
**Verhaalvorm:** mythe tegenover feit (niet in 126, 127, 128).
**Metafoor:** een speeldoos. Die improviseert niet: hij speelt precies wat er in de rol geponst staat, elke keer hetzelfde. Afgevallen: kristallen bol (te dicht op gelukskoekje 105) en spoorwissel (te abstract in 13 s).

Gemaakt op 28 november 2026 door de dagelijkse taak. Code in `src/speeldoos/`, Studio-map `Concept-129-Speeldoos`, composities `BB-Speeldoos-Reel` (1080×1920) en `BB-Speeldoos-Feed` (1080×1350).

### Hoe dit verschilt van de eerdere concepten
| Punt | Dit concept | Dichtstbij (121 recept, 113 vormenstoof, 105 gelukskoekje, 62 boemerang) |
|---|---|---|
| Invalshoek | Geen AI, als mythe die ontkracht wordt | 121 en 113 zijn ook geen-ai, maar rekensom en twee schermen |
| Visueel systeem | Mechanisch object: speeldoos met ponsrol, kam en slinger | Keuken (121), speelgoedvorm (113), vluchtbanen (62) |
| Wat Buddy doet | Kopt de AI-badge uit beeld, draait aan de slinger | Kopt strooibus (121, verwant), vangt en gooit (62) |
| Soort einde | Feit tegenover mythe: "Geen AI. Gewoon vaste regels." | Belofte/uitkomst |
| Slotbeeld | Buddy draait pirouettes als danseresje op de speeldoos | Buiging met koksmuts (121), boemerang rond de knop (62) |
| Overgangen | deksel open, kam (tand voor tand), deksel dicht (alle drie nieuw, CSS) | kaartflip, deegroller, swing, spin-return |

Verschilt op 5 van de 6 punten met elk concept (alleen "Buddy kopt iets weg" lijkt op 121).

## Storyboard
Tijden komen uit `public/vo/speeldoos/timing.json`. **Let op: die timing is nu een schatting (5 lettergrepen per seconde), omdat de stem niet gegenereerd kon worden.** Zodra er een echte take is, schuift alles mee (zie "Stem toevoegen").

### 1 · Hook: "Gaat er AI over je rekening?" (0,0 tot 3,5 s) · licht
Rekening Energieleverancier (€87,60, vervalt do 17 dec) met een gele AI-badge met sterretjes en een glinstering die over de kaart veegt. Op "AI" begint de AI te gokken: gele briefjes "± €80?", "ergens in dec?", "link…?". Op "gaat" slaat het stempel MYTHE erop. Frame 0 toont kop, kaart en badge (cover: frame 92).

### 2 · "Nee. Buddy werkt als een speeldoos." (3,5 tot 5,6 s) · deksel open naar blauw
De hookscène klapt als een speeldoosdeksel omhoog weg. Buddy springt op "Nee" in beeld en kopt de AI-badge op "Buddy" uit beeld. Op "werkt" ploft de speeldoos neer en gaat het deksel open; op "speeldoos" het label FEIT.

### 3 · "Vaste regels. Elke keer hetzelfde." (5,6 tot 12,0 s) · kam naar licht
Overgang tand voor tand, als de kam van een speeldoos. De rekening loopt als ponsstrook de speeldoos in, Buddy draait de slinger. Op elk gesproken veld springt een kaartje uit de doos naar zijn plek met een vinkje en een muzieknoot: Bedrag €87,60 ("bedrag"), Vervaldatum do 17 dec ("vervaldatum"), Betaallink gevonden ("betaallink"), Kenmerk 4021 8837 ("elke"). Op "hetzelfde": subregel "Zelfde mail? Zelfde uitkomst."

### 4 · CTA (12,0 tot 14,0 s) · deksel dicht naar blauw
Nieuwe scène klapt als deksel naar beneden. Tagline "Geen AI. / Gewoon vaste regels.", Buddy rijst op een spindel uit de speeldoos en draait pirouettes, noten zweven omhoog, knop "activeer buddy" met tik, "Geen app. Geen bankkoppeling." en het woordmerk.

<!-- copycheck:off -->
## Copyregels
Geen gratis, geen proefperiode, geen WhatsApp, geen "scant je inbox", geen prijs, geen andere merknamen, geen "Buddy bewaart niets", geen gedachtestreepjes. "AI" alleen ontkennend ("Geen AI").
<!-- copycheck:on -->

## Voice-over (ElevenLabs)
Model eleven_v4, taal nl, stem uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), stability 0.5, similarity 0.75, geen andere instellingen. Eén take voor de hele tekst.

Tekst met scènemarkers (`public/vo/speeldoos/script.txt`; de markers gaan niet naar ElevenLabs):
```
[S1] Denk je dat er AI over je rekening gaat? [S2] Nee, Buddy werkt als een speeldoos [S3] en leest met vaste regels je bedrag, vervaldatum en betaallink, elke keer hetzelfde. [S4] Activeer Buddy.
```
Te plakken in ElevenLabs (30 woorden):
```
Denk je dat er AI over je rekening gaat? Nee, Buddy werkt als een speeldoos en leest met vaste regels je bedrag, vervaldatum en betaallink, elke keer hetzelfde. Activeer Buddy.
```

Cue-tabel (geschatte tijden, frame = 1/30 s):
| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Denk je dat er AI over je rekening gaat? | Rekening met AI-badge; gokbriefjes, stempel MYTHE |
| S2 | 3,50 | 105 | Nee, Buddy werkt als een speeldoos | Deksel open; Buddy kopt de badge weg; speeldoos, FEIT |
| S3 | 5,63 | 169 | en leest met vaste regels je bedrag, vervaldatum en betaallink, elke keer hetzelfde. | Kam-overgang; Buddy draait, vier velden springen eruit |
| S4 | 11,97 | 359 | Activeer Buddy. | Deksel dicht; tagline, pirouette, knop |

**Status 28 november 2026: stem niet gegenereerd.** De API gaf `quota_exceeded` (0 van 10.000 credits; de voices-check gaf 401), de ElevenLabs-connector faalde met dezelfde quotafout.

### Stem toevoegen (zodra er credits zijn)
```bash
cd "04. Animation"
# 1. één take met tijdstempels (tekst zonder markers)
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID/with-timestamps?output_format=mp3_44100_128" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" -H "Content-Type: application/json" \
  -d '{"text":"Denk je dat er AI over je rekening gaat? Nee, Buddy werkt als een speeldoos en leest met vaste regels je bedrag, vervaldatum en betaallink, elke keer hetzelfde. Activeer Buddy.","model_id":"eleven_v4","language_code":"nl","voice_settings":{"stability":0.5,"similarity_boost":0.75}}' \
  -o public/vo/speeldoos/vo.json
jq -r .audio_base64 public/vo/speeldoos/vo.json | base64 -d > public/vo/speeldoos/voice-over.mp3
# 2. timing uit de alignment (alle beats schuiven mee)
python3 scripts/vo_to_timing.py speeldoos --from-alignment
# 3. renderen met en zonder stem, VO-versies loudnormen
npm run render:speeldoos:vo && npm run render:speeldoos && npm run render:speeldoos:feed
for f in reel feed; do ffmpeg -i out/speeldoos-$f-vo.mp4 -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -c:a aac -b:a 192k out/speeldoos-$f-vo-ln.mp4 && mv out/speeldoos-$f-vo-ln.mp4 out/speeldoos-$f-vo.mp4; done
ffmpeg -i public/vo/speeldoos/voice-over.mp3 -af loudnorm=I=-14:TP=-1:LRA=11 -ar 44100 -b:a 128k out/speeldoos-voice-over.mp3
```
Luistertoets: geen pauze langer dan 0,7 s tussen eerste en laatste woord; anders korter herschrijven (nooit versnellen).

## Caption (Reels)
```
Denk je dat er AI over je rekening gaat als je hem doorstuurt? Bij Buddy niet. 🎶

Buddy werkt als een speeldoos: hij speelt alleen wat er staat. 📄
📩 Stuur je rekening door naar Buddy
🔍 Buddy leest bedrag, vervaldatum, betaallink en kenmerk met vaste regels
✅ Zelfde mail? Zelfde uitkomst. Elke keer.

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #budgetteren #privacy
```

## Ads Manager
- **Primaire tekst:** Geen AI over je mail. Buddy leest je rekening met vaste regels: bedrag, vervaldatum en betaallink.
- **Kop:** Geen AI. Gewoon vaste regels.
- **Beschrijving:** Geen app. Geen bankkoppeling.
- **Knop:** Aanmelden

## Open controles
- Stem genereren zodra ElevenLabs-credits zijn aangevuld (stappen hierboven); de timing is nu een schatting.
- Uitspraak van "AI" door eleven_v4 in het Nederlands controleren ("aa-ie").
- "Kenmerk 4021 8837" en "Betaallink gevonden" zijn voorbeeldwaarden.
- Instappagina: er is geen pagina voor geen-ai; "privacy zonder mailboxkoppeling" past het best.
