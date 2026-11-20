# BetaalBuddy · Instagram ad, concept 105

## "Geen AI. Geen gok." (gelukskoekje)

**USP:** `geen-ai` (langst ongebruikt volgens de changelog: laatst concept 97). **Vorm:** mythe tegenover feit (niet in 102, 103, 104). **Metafoor:** een gelukskoekje. Een AI wordt vaak gezien als iets dat voorspelt, en een gelukskoekje doet precies dat: vaag en algemeen. Buddy voorspelt niets; hij leest de doorgestuurde rekening met vaste regels. Afgevallen metaforen: waarzegster met glazen bol (te dicht op de AI-bol uit 63) en rad van fortuin (te dicht op de rolcijfers uit 81).

**Gedachte:** "Zit er een AI in die gokt?" Nee: vaste regels, dus je krijgt het echte bedrag en de echte datum in plaats van een voorspelling.

Composities: `BB-Gelukskoekje-Reel` (1080×1920) en `BB-Gelukskoekje-Feed` (1080×1350) in de Studio-map `Concept-105-Gelukskoekje`. Code in `src/gelukskoekje/`, overgangen in `src/lib/cookieWipes.ts`. Geen gedeelde code aangepast.

### Uniciteit (zie CONCEPTEN.md en de changelog)
| Punt | Dit concept | Eerdere geen-ai-concepten (63, 64, 73, 81, 89, 97) |
|---|---|---|
| Invalshoek | AI als voorspeller tegenover echte gegevens | 63/64 mythe en sjabloon, 73 knikkerbaan, 81 rolcijfers, 89 metronoom, 97 kruiswoord |
| Visueel systeem | Object en papier: gelukskoekje, voorspellingsstrookje, regels als lijst | sjabloon, knikkerbaan, gokkast, metronoom, puzzelrooster |
| Wat Buddy doet | Kijkt sceptisch naar het strookje, springt de vier regels af, stuitert bij elk echt gegeven | stempelen, sjabloon slaan, vinkje zetten |
| Soort einde | Omkering: het strookje uit Buddy's eigen koekje zegt "Vaste regels." | uitkomst of regie |
| Slotbeeld CTA | Buddy springt, breekt een koekje boven zijn hoofd, strookje komt omhoog | potlood en vinkje (97), boemerang (62) |
| Overgangen | kraak (gekartelde scheur die openbreekt), uitrollen (papierrol van boven naar beneden) | swing, spin, brievenbus, draad, kraalrol, zeskant |

Verschilt op zes van zes punten met de vorige geen-ai-concepten.

## Storyboard (scènestarts = eerste gesproken woord per marker)
| # | Start | Scène | Beeld |
|---|---|---|---|
| S1 | 0,00 s (f0) | Mythe, licht | Kop "Een AI die je rekening raadt?", label MYTHE, gelukskoekje wiebelt, chip "AI" ploft erbij op "AI" (f18). Op "voorspelt" (f64) breekt het koekje en rolt een strookje uit: "Ergens in december? Rond de €80?". Vraagtekens, Buddy kijkt sceptisch (halfdichte ogen). |
| S2 | 3,20 s (f96) | Feit, blauw (overgang kraak) | "Nee." op "Nee", label FEIT, rekening van de Energieleverancier (€87,60, vervalt do 17 dec) valt in, chip "Doorgestuurd" op "doorgestuurde" (f138). Op "vaste regels" vinken vier regels af: Bedrag €87,60, Vervaldatum do 17 dec, Betaallink gevonden, Kenmerk 3021 4471 (f172, 184, 194, 204); Buddy springt per regel mee. |
| S3 | 7,17 s (f215) | Uitkomst, licht (overgang uitrollen) | "Het echte bedrag. De echte datum." landt woord voor woord op de stem. Op het strookje wordt "Rond de €80?" doorgestreept op "echte" (f245) en vervangen door €87,60 op "bedrag" (f254); "Ergens in december?" wordt "Vervalt do 17 dec" op "datum" (f293). Buddy stuitert, de koekjeshelften liggen ernaast. |
| S4 | 10,57 s (f317) | CTA, blauw (overgang kraak) | "Geen AI. Geen gok.", knop "activeer buddy" op "Activeer", Buddy springt en breekt een koekje op zijn hoofd op "Buddy" (f332), strookje "Vaste regels." komt omhoog, blije ogen, "Geen app. Geen bankkoppeling.", woordmerk, tik op de knop (f353). |

Totaal 12,83 s (385 frames): stem 11,81 s plus ongeveer 1 s voor de CTA. Cover: frame 82 (`npm run still:gelukskoekje`).

## Voice-over (ElevenLabs, één take, 32 woorden)
Stem: ELEVENLABS_VOICE_ID `7qdUFMklKPaaAVMsBTBt`, model `eleven_v4`, `language_code` nl, stability 0,5, similarity_boost 0,75. Route: API, `/with-timestamps` (HTTP 200, met alignment). Langste pauze tussen woorden 0,53 s (silencedetect), stem 11,81 s.

```
[S1] Zit er een AI in Buddy die maar wat voorspelt? [S2] Nee hoor, hij leest je doorgestuurde rekening met vaste regels, [S3] dus je krijgt het echte bedrag en de echte datum. [S4] Activeer Buddy.
```

| Marker | Start | Frame | Woord | Beeld |
|---|---|---|---|---|
| S1 | 0,00 s | 0 | Zit | Mythe: koekje, kop staat er al |
| | 0,67 s | 20 | AI | Chip "AI" ploft naast het koekje |
| | 2,13 s | 64 | voorspelt | Koekje breekt, strookje met de gok |
| S2 | 3,20 s | 96 | Nee | Kraak naar blauw, "Nee.", FEIT |
| | 4,60 s | 138 | doorgestuurde | Chip "Doorgestuurd" |
| | 5,93 s | 178 | vaste | Regels vinken af |
| S3 | 7,17 s | 215 | dus | Uitrollen naar het strookje |
| | 8,47 s | 254 | bedrag | €87,60 vervangt "Rond de €80?" |
| | 9,77 s | 293 | datum | "Vervalt do 17 dec" vervangt de gok |
| S4 | 10,57 s | 317 | Activeer | Knop, Buddy breekt zijn koekje |

Bestanden: `public/vo/gelukskoekje/voice-over.mp3` (ruwe take, zit in de compositie), `vo.json` (API-antwoord met alignment), `timing.json` (scènestarts en woorden in frames). Genormaliseerde versie: `renders/gelukskoekje-voice-over.mp3`.

## Caption
```
Denk je dat er een AI meekijkt en maar wat gokt? 🥠 Nee. Buddy leest je rekening met vaste regels, dus je krijgt het echte bedrag en de echte datum.

📩 Stuur je rekening door naar Buddy
🔎 Buddy leest bedrag, vervaldatum, betaallink en kenmerk
📅 De vervaldatum staat in je agenda, met een herinnering wanneer jij wilt

Geen app. Geen bankkoppeling. Geen AI.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #vastelasten #budgetteren
```

## Ads Manager
- **Primaire tekst:** Geen AI die gokt. Buddy leest je doorgestuurde rekening met vaste regels: het echte bedrag, de echte datum.
- **Kop:** Geen AI. Geen gok.
- **Beschrijving:** Geen app. Geen bankkoppeling.
- **Knop:** Aanmelden

<!-- copycheck:off -->
## Copyregels
Alleen "geen AI" en "AI" als mythe die met "Nee" ontkracht wordt. Geen prijs, geen pakketnaam, geen "gratis", geen proefperiode, geen WhatsApp, geen merknamen. Wat Buddy leest (bedrag, vervaldatum, betaallink, kenmerk) komt uit brand §2. Geen rood in beeld (PM-149): de mythe-chips zijn #111827.
<!-- copycheck:on -->

## Open punten
- Instappagina: er is geen geen-ai-pagina; algemene startpagina gebruiken voor link in bio en CTA.
- Datums in beeld staan op december (do 17 dec); bij een latere inzet aanpassen via het schema.
- De rekening in beeld en de regels zijn voorbeeldwaarden (Energieleverancier, kenmerk 3021 4471).
