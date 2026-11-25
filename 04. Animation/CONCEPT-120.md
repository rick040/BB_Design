# BetaalBuddy · Instagram ad, concept 120

## "Houd je sleutels."

**In één zin:** een mailboxkoppeling is je hele sleutelbos afgeven; Buddy hoeft geen sleutels, jij stuurt alleen die ene rekening door en hij leest bedrag en datum.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Sleutelbos-Reel`) · 4:5 feed 1080×1350 (`BB-Sleutelbos-Feed`) |
| Lengte | 12,4 s (373 frames, 4 scènes, 30 fps). Timing volgt `public/vo/sleutelbos/timing.json` |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de instappagina privacy |
| Geluid | Werkt zonder geluid. Stem kon op 25 november niet gemaakt worden (zie Voice-over) |

**Keuze:** USP `geen-koppeling`, het langst niet gebruikt volgens de changelog (laatst concept 112; 113 tot 119 gebruikten alle andere USP's). Vorm probleem, doorsturen, uitkomst (niet in 117, 118, 119; laatst 111). Metafoor: sleutelbos. Afgevallen: kluis met code (te dicht op slot/brievenbus 104) en sleepnet (112).

### Hoe dit verschilt van de eerdere concepten

| | Concept 1 | Concept 2 | Concept 3 | Concept 62 | 96 / 104 / 112 (geen-koppeling) | **Dit concept** |
|---|---|---|---|---|---|---|
| Invalshoek | Overzicht, volle inbox | Timing, aftellen | Privacy, slaapmasker | Wegleggen werkt niet | Ketting, brievenbus, sleepnet | **Koppeling = je hele sleutelbos afgeven** |
| Visueel systeem | UI (inbox) | Typografisch | Focus, wazig/scherp | Vluchtbanen | Mailbox-UI, brievenbus, onderwater | **Voorwerp: sleutelbos met labels en een donker slot** |
| Rol van Buddy | Slikt rekening op | Rijdt mee op getallen | Slaapmasker op/af | Vangt boemerang | Kiest/vangt alleen de ene mail | **Weigert de sleutels (nee schudden, wegkoppen)** |
| Einde | Belofte | "Betaald." | Regie | Omkering | Alleen die ene | **Teruggave: jij houdt je sleutels** |
| Slotbeeld (CTA) | Buddy naast knop | Buddy op knop | Buddy op knop | Buddy gooit boemerang | divers | **Buddy gooit je sleutelbos terug aan je eigen haakje** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | maas, bubbels, … | **sleutelgat-masker, sleutelomdraai** |

---

## Storyboard (frames op de geschatte stem)

### 1 · Hook: "Je mailbox koppelen?" (0,00 tot 3,57 s) · licht
- Frame 0: kop staat al, sleutelbos met vier labels (Mailbox, Werk, Familie, Foto's) zwaait, rechts een donker slot met sleutelgat en label "Koppeling".
- 2,00 s ("sleutelbos"): chip "Alle sleutels?".
- 2,60 s ("afgeven"): de hele sleutelbos vliegt in een boog het slot in, het slot klopt na.

### 2 · "Buddy hoeft geen sleutels." (3,57 tot 7,10 s) · sleutelgat naar blauw
- De sleutelbos wordt Buddy van links voorgehouden; 3,93 s ("hoeft") Buddy schudt nee; 4,37 s ("sleutels") hij springt en kopt de bos uit beeld.
- 5,13 s ("jij"): subregel "Jij stuurt alleen de rekening door."; 5,53 s ("alleen") één doorgestuurde mail van de Zorgverzekeraar vliegt binnen; 6,73 s ("door") Buddy neemt hem aan.

### 3 · "Hij leest bedrag en datum." (7,10 tot 9,07 s) · sleutelomdraai naar licht
- Rekening Zorgverzekeraar €128,95, vervalt vr 12 dec; Buddy zit op de kaart.
- 7,70 s ("bedrag"): rij "Bedrag €128,95" met vinkje; 8,30 s ("datum"): rij "Datum vr 12 dec".

### 4 · CTA: "Houd je sleutels." (9,07 tot 12,43 s) · sleutelgat naar blauw
- Kop woord voor woord op de stem. Buddy gooit je sleutelbos in een boog terug aan je eigen haakje (landt op "sleutels", 9,67 s) en springt blij.
- 10,43 s ("activeer"): knop activeer buddy, woordmerk, "Geen app. Geen bankkoppeling."; tik op de knop aan het eind van de stem.

---

<!-- copycheck:off -->
## Copyregels
- Alleen bevestigde feiten: geen mailboxkoppeling, Buddy ziet alleen wat jij doorstuurt, leest bedrag en vervaldatum, geen app, geen bankkoppeling.
- Niet gebruikt: gratis, proefperiode, prijzen, WhatsApp, "scant je inbox", "bewaart niets", AI, merknamen. Geen rood (Meta-strategie 15 november): het slot en de chips zijn #111827.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, eleven_v4, één take)

Status 25 november 2026: **niet gegenereerd.** `/v1/voices/<id>` gaf 401 (sleutel mist `voices_read`), `/with-timestamps` en het gewone endpoint gaven 401 `quota_exceeded` (0 van 10.000 credits over), en de ElevenLabs-connector faalde met dezelfde quotafout. De timing hieronder is een schatting (`tools/vo_estimate.py`, 5 lettergrepen per seconde).

Tekst voor ElevenLabs (zonder markers, 32 woorden):
```
Je mailbox koppelen is je hele sleutelbos afgeven. Buddy hoeft geen sleutels, want jij stuurt alleen de rekening door, en hij leest bedrag en datum. Dus houd je sleutels, en activeer Buddy.
```

Met scènemarkers (`public/vo/sleutelbos/vo-tekst.txt`):
```
[S1] Je mailbox koppelen is je hele sleutelbos afgeven. [S2] Buddy hoeft geen sleutels, want jij stuurt alleen de rekening door, [S3] en hij leest bedrag en datum. [S4] Dus houd je sleutels, en activeer Buddy.
```

| Scène | Start (geschat) | Zin | Beeld |
|---|---|---|---|
| S1 | 0,00 s | Je mailbox koppelen is je hele sleutelbos afgeven. | Sleutelbos, slot "Koppeling"; bos vliegt het slot in op "afgeven" (2,60 s) |
| S2 | 3,57 s | Buddy hoeft geen sleutels, want jij stuurt alleen de rekening door, | Buddy schudt nee (3,93), kopt de bos weg (4,37), neemt de ene mail aan (6,73) |
| S3 | 7,10 s | en hij leest bedrag en datum. | Rijen Bedrag (7,70) en Datum (8,30) |
| S4 | 9,07 s | Dus houd je sleutels, en activeer Buddy. | Bos aan je haakje (9,67), knop (10,43), tik aan het eind |

**Stem maken zodra er credits zijn** (in `04. Animation`):
```bash
T="Je mailbox koppelen is je hele sleutelbos afgeven. Buddy hoeft geen sleutels, want jij stuurt alleen de rekening door, en hij leest bedrag en datum. Dus houd je sleutels, en activeer Buddy."
jq -n --arg t "$T" '{text:$t,model_id:"eleven_v4",language_code:"nl",voice_settings:{stability:0.5,similarity_boost:0.75}}' > /tmp/body.json
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$ELEVENLABS_VOICE_ID/with-timestamps?output_format=mp3_44100_128" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" -H "Content-Type: application/json" -d @/tmp/body.json -o public/vo/sleutelbos/vo.json
jq -r .audio_base64 public/vo/sleutelbos/vo.json | base64 -d > public/vo/sleutelbos/voice-over.mp3
```
Zet daarna de scènestarts uit `alignment.character_start_times_seconds` (eerste teken van "Je", "Buddy", "en hij", "Dus") in `timing.json` (zelfde formaat als `public/vo/boemerang/timing.json`), draai `npm run render:sleutelbos` en `render:sleutelbos:feed` en normaliseer met `ffmpeg -af loudnorm=I=-14:TP=-1:LRA=11 -c:v copy`. De animatie hertimet zichzelf op de nieuwe timing.

## Caption (Reels)
```
Je mailbox koppelen voor je rekeningen? Dan geef je eigenlijk je hele sleutelbos weg. 🔑

Buddy hoeft geen sleutels. 💙
📩 Stuur alleen die ene rekening door
👀 Buddy leest het bedrag en de vervaldatum
📅 Jij kiest wanneer je een herinnering krijgt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #privacy #rekeningen #geldzaken #budgetteren
```

**Advertentie (Ads Manager):**
- Primaire tekst: "Geen koppeling met je mailbox. Stuur alleen die ene rekening door en Buddy leest bedrag en vervaldatum." (103 tekens)
- Kop: "Houd je sleutels." (17 tekens)
- Beschrijving: "Geen app. Geen bankkoppeling."
- Knop: "Aanmelden"

## Bewerken en exporteren
- Studio: `npx remotion studio`, map `Concept-120-Sleutelbos`. Teksten, labels op de sleutels, kleuren en `withVoice` staan in `src/sleutelbos/schema.ts`.
- Zonder stem: `npm run render:sleutelbos:stil` en `npm run render:sleutelbos:feed:stil`. Met stem: `npm run render:sleutelbos` en `npm run render:sleutelbos:feed`. Cover: `npm run still:sleutelbos` (frame 30).

## Open controles
- Stem maken zodra er ElevenLabs-credits zijn (of de sleutel een hoger tegoed krijgt), dan timing.json vervangen en de VO-versies renderen.
- Instappagina: privacy zonder mailboxkoppeling; pad nog niet bevestigd.
- De caption noemt "Jij kiest wanneer je een herinnering krijgt": dat is pakket Buddy (agenda-reminder). Er staat geen prijs in de ad.
