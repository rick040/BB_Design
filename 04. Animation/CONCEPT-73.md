# BetaalBuddy · Instagram ad, concept 73

## "Geen gok. Elke keer dezelfde baan." (knikkerbaan)

**In één zin:** gokt er een AI met je rekening? Nee: Buddy duwt hem in een knikkerbaan met vaste luiken, regel 1 leest het bedrag, regel 2 de vervaldatum, en de rekening valt netjes als regel in de bak; de volgende rekening volgt precies hetzelfde spoor.

**Keuze:** USP `geen-ai` (na `agenda`, die in brand §4 alleen mag als de rest recent was en al zo'n zestig concepten heeft, is dit de USP die het langst niet gebruikt is: concept 63 en 64). Vorm: één doorlopend shot zonder scènewissel (niet in de laatste drie: 72 mythe tegenover feit, 71 en 70 vraag en antwoord). Metafoor: knikkerbaan, gekozen boven een kassalade en een breipatroon omdat hij "vaste regels" laat zien als vaste route: voorspelbaar in plaats van slim.

| | |
|---|---|
| Formaat | `BB-Knikkerbaan-Reel` 1080×1920 en `BB-Knikkerbaan-Feed` 1080×1350, met prop `withVoice` |
| Lengte | 13,73 s (412 frames, 30 fps): stem 12,72 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/knikkerbaan/schema.ts` (teksten, bedragen, kleuren, `withVoice`); beats in `scenes/World.tsx` (`WORLD_T`), `scenes/CtaScene.tsx` (`CTA_T`), camera in `KnikkerbaanAd.tsx` (`CAMERA_T`); timing uit `public/vo/knikkerbaan/timing.json` |
| Render | `npm run render:knikkerbaan` en `:feed`, daarna loudnorm (I -14, TP -1, LRA 11) naar `renders/knikkerbaan-*-vo.mp4`; stil: `npm run render:knikkerbaan:stil`; cover `npm run still:knikkerbaan` (frame 0) |

### Uniciteit
| | 63 liniaal | 64 sjabloon | 72 sleutel | 62 boemerang | **73** |
|---|---|---|---|---|---|
| Invalshoek | geen AI leest mee | geen AI, vier velden | geen koppeling | wegleggen werkt niet | **geen AI = voorspelbaar: elke rekening dezelfde route** |
| Vorm | mythe/feit | mythe/feit | mythe/feit | probleem, doorsturen, uitkomst | **één doorlopend shot** |
| Visueel systeem | liniaal over factuur | sjabloon met gaten | deuren, hangsloten | vluchtbanen | **knikkerbaan met luiken, regelpennen en een bak** |
| Buddy | rijdt op liniaal | slaat sjabloon neer | schudt nee, schuift sleutel terug | vangt in sprong | **stoot de AI-dobbelsteen van het plateau, duwt rekeningen de baan in** |
| Einde | feit | feit | feit | omkering | **herhaling: de tweede rekening volgt het gele spoor van de eerste** |
| Slotbeeld | knop in gat | gluurt over rand | knop als brief | boemerang om knop | **Buddy sleet op de knop de laatste helling af en springt ernaast** |
| Overgangen | | | sleutelgat, grendel | swing, spin-return | **geen cuts: camera volgt, zoomt uit, kantelt omlaag de blauwe vloer in** |

Verschilt op 6 van 6 punten met 62 en 72, en op minstens 5 van 6 met 63 en 64 (zelfde USP).

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| S1 · Hook (licht) | 0,00 tot 3,13 s | Kop "Gokt er een AI met jouw rekening?" staat op frame 0. Op het plateau ligt de rekening Energieleverancier €87,60; ernaast schommelt een dobbelsteen "AI" onder een vraagteken. Op "Nee" (2,40 s) stoot Buddy de dobbelsteen van het plateau, chip "Nee." |
| S2 · De baan (licht) | 3,13 tot 8,93 s | Kop "Buddy legt hem op een vaste baan." Buddy duwt de rekening de baan in; de camera volgt. Luik 1 met gele pen "regel 1: bedrag" leest €87,60 (op "bedrag", 5,43 s), luik 2 "regel 2: vervaldatum" leest do 17 dec (op "vervaldatum", 6,07 s). De rekening valt in de bak als nette regel "€87,60 · vervalt do 17 dec" (op "netjes", 7,77 s). |
| S3 · Nog een (licht) | 8,93 tot 11,43 s | Kop "Elke rekening precies hetzelfde." De camera zoomt uit over de hele baan; het spoor van de eerste rekening licht geel op. Een tweede rekening (Zorgverzekeraar €134,20) valt op het plateau, Buddy duwt hem erin en hij volgt exact hetzelfde spoor: €134,20 op "precies", ma 21 dec op "hetzelfde". |
| S4 · CTA (blauw) | 11,43 tot 13,73 s | De camera kantelt omlaag de blauwe vloer in. Tagline "Geen gok. Elke keer dezelfde baan." Buddy sleet op de knop "activeer buddy" de laatste helling af, de knop stopt op "Buddy" (12,07 s), Buddy springt ernaast, woordmerk, "Geen app. Geen bankkoppeling.", tik op de knop. |

## Voice-over (ElevenLabs, één take, 32 woorden; markers niet meegestuurd)

```
[S1] Gokt er een AI met jouw rekening? Nee, [S2] Buddy laat hem door een vaste baan rollen, dus bedrag en vervaldatum vallen er altijd netjes uit, [S3] bij elke rekening precies hetzelfde. [S4] Activeer Buddy.
```

| Marker | Start | Frame | Gesproken | Beeld |
|---|---|---|---|---|
| S1 | 0,00 s | 0 | Gokt er een AI met jouw rekening? Nee, | Kop, rekening, AI-dobbelsteen; Buddy stoot hem weg op "Nee" (frame 72) |
| S2 | 3,13 s | 94 | Buddy laat hem door een vaste baan rollen, dus bedrag en vervaldatum vallen er altijd netjes uit, | Duw (98), luik 1 en chip €87,60 (160), luik 2 en chip do 17 dec (184 tot 186), regel in de bak (233) |
| S3 | 8,93 s | 268 | bij elke rekening precies hetzelfde. | Uitzoomen, geel spoor, tweede rekening; chips op 294 en 310 |
| S4 | 11,43 s | 343 | Activeer Buddy. | Kantelen naar blauw, knop stopt (364), Buddy landt (376), tik (388) |

Luistertoets: langste pauze tussen woorden 0,40 s (alignment, na "hetzelfde."); silencedetect -35 dB max 0,51 s. Stem past in de video (eindigt op 12,72 s, video 13,73 s). Niet versneld.

## Caption
Zie `renders/knikkerbaan-caption.md`.

## Ads Manager
- Primaire tekst (99): Gokt er een AI met je rekening? Nee. Buddy leest hem met vaste regels, elke keer precies hetzelfde.
- Kop (34): Geen gok. Elke keer dezelfde baan.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Copycheck geeft alleen treffers op "AI" in de hookvraag, die steeds direct met "Nee" of "Bij Buddy niet" beantwoord wordt (toegestaan patroon "mythe tegenover feit", brand §4). Geen prijs, pakketnaam, gratis, proefperiode, WhatsApp of merknamen. Herinnering "wanneer jij kiest" volgens onboarding v5.1.
<!-- copycheck:on -->

## Open punten
- Instappagina voor knop en link in bio: geen van de zes pagina's gaat over "geen AI"; "privacy zonder mailboxkoppeling" past het best.
- Bedragen (€87,60, €134,20) en datums (do 17 dec, ma 21 dec) zijn voorbeelden; na half december omzetten.
- "AI" wordt door de stem uitgesproken als losse letters; even naluisteren of dat goed klinkt.
