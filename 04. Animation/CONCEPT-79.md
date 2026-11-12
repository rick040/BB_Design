# Concept 79 · "Je eigen huis. Meteen op orde."

**Slug:** `eigenhuis` · **Compositie:** `BB-EigenHuis-Reel` (1080×1920, 30 fps, 448 frames, 14,93 s) · **Map in Studio:** `Concept-79-EigenHuis`

## Keuze
- **USP:** `doelgroep`, net op jezelf wonen. Volgens de changelog het langst niet gebruikt (laatst 70 en 71, zorgnota's); daarna kwamen geen-koppeling (72), geen-ai (73), agenda (74), inzage (75), prijs (76), geen-app (77), overzicht (78).
- **Vorm:** één doorlopend shot zonder scènewissel. Niet in de laatste drie (76 mythe tegenover feit, 77 twee banen, 78 kassabon).
- **Beeld:** de plattegrond van je eerste eigen huis, van bovenaf. De camera knipt nooit, hij beweegt alleen over die ene plattegrond.

## Uniciteit (zes punten)
| Punt | Dit concept | Dichtstbij (70/71 wachtkamer, 73/74 één shot) |
|---|---|---|
| Invalshoek | doelgroep: net op jezelf wonen | 70/71: zorgnota's |
| Visueel systeem | bovenaanzicht-plattegrond, camera vliegt over kamers | wachtkamer / knikkerbaan / broodrooster |
| Buddy | duikt op in de gang, slikt de rekeningen uit alle kamers, springt op de agenda in de keuken | deelt nummertjes uit / stoot dobbelsteen weg |
| Einde | "Je eigen huis. Meteen op orde." (nieuwe start) | wachtnummer, toast |
| Slotbeeld | de deurmat WELKOM wordt de knop, Buddy veegt er zijn voeten op en springt | nummertje van automaat, toast uit rooster |
| Overgangen | geen; camerabeweging (inzoomen, uitzoomen, pannen) en kleurwissel naar blauw | split-flap, knikkerbaan-zoom |

Verschilt op minstens 5 van 6 punten van elk concept in de index.

## Verloop (frames uit `public/vo/eigenhuis/timing.json`)
| Cue | Start | Beeld |
|---|---|---|
| S1 | 0,00 s (f0) | Gang van dichtbij. Post valt door de brievenbus: Huur, Energie, Internet, Zorgverzekering, elk met "vervalt ?". Kop "Net op jezelf?" |
| S2 | 3,37 s (f101) | Camera zoomt uit naar de hele plattegrond; elke rekening vliegt naar zijn kamer op het gesproken woord. Kop "Alles op jouw naam." |
| S3 | 6,80 s (f204) | Buddy duikt op in de gang en slikt de vier rekeningen één voor één. Kop "Stuur ze door naar Buddy." |
| S4 | 8,40 s (f252) | Buddy springt op de agenda in de keuken; per rekening een regel met datum en bedrag (december, di 1 tot di 15); bij "seintje" gaan de belletjes. Koppen "Elke vervaldatum in je agenda." en "Met een seintje wanneer jij wilt." |
| S5 | 12,57 s (f377) | Camera terug naar de voordeur, alles wordt blauw, de deurmat wordt de knop "activeer buddy". Buddy landt erop, veegt zijn voeten en springt. Tagline, "Geen app. Geen bankkoppeling.", woordmerk. Einde stem 13,8 s, video 14,93 s. |

## Voice-over (ElevenLabs, stem uit ELEVENLABS_VOICE_ID, model eleven_v4, één take)
```
[S1] Net op jezelf? Dan zijn de rekeningen ook van jou. [S2] Huur, energie, internet, zorgverzekering. [S3] Stuur ze door naar Buddy. [S4] Elke vervaldatum in je agenda. Met een seintje wanneer jij wilt. [S5] Activeer Buddy.
```
32 woorden, 13,79 s. Langste pauze 0,47 s. Genormaliseerd op -14 LUFS.

## Caption
Zie `renders/eigenhuis-caption.md`.

## Ads Manager
- Primaire tekst (90): Net op jezelf? Stuur je rekeningen door naar Buddy en elke vervaldatum staat in je agenda.
- Kop (30): Je eigen huis. Meteen op orde.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

## Open punten
- Instappagina: "net op jezelf wonen" past precies; de URL voor knop en link in bio staat nog open.
- Agendadatums staan op december; na half december omzetten in `schema.ts`.
- Bedragen (huur €925,00 enz.) zijn voorbeelden.
