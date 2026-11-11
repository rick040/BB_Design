# Concept 76 · "Zonde? Reken even mee." (spaarpot)

**USP:** `prijs` (het langst niet gebruikt: laatst concept 66). **Vorm:** mythe tegenover feit (niet in de laatste drie: 73 en 74 één shot, 75 vraag en antwoord). **Metafoor:** spaarvarken dat leegloopt.

**Idee.** De mythe: "Weer een abonnement? Zonde van je geld." Het feit: een aanmaning kan uitlopen op €40, en dan loopt je spaarpot leeg. Buddy springt op de gleuf, zet een herinnering in je agenda op het moment dat jij kiest, en kost zelf €3,49 per maand: één muntje.

Composition `BB-Spaarpot-Reel` (1080×1920, 30 fps, 455 frames = 15,17 s), map Studio `Concept-76-Spaarpot`, code in `src/spaarpot/`, overgangen in `src/lib/slotWipes.ts`. Render: `npm run render:spaarpot`.

## Scènes (gemeten op de stem, `public/vo/spaarpot/timing.json`)

| # | Start | Beeld | Stem |
|---|---|---|---|
| 1 | 0,00 s | Licht. Kop "Weer een abonnement?", geel prijskaartje €3,49 per maand bungelt boven een blauw spaarvarken; bij "Zonde" schudt het varken en schiet het kaartje omhoog, bij "geld" gaat er een rode streep door de prijs | Weer een abonnement? Zonde van je geld. |
| 2 | 3,13 s (coin flip) | Licht. "Zonde?" in rood. Stempel AANMANING slaat op het varken, het kantelt ondersteboven en de munten vallen uit de gleuf; de teller rolt van €0 naar €40 op "veertig" | Zonde? Een aanmaning kan uitlopen op veertig euro. |
| 3 | 7,13 s (gleuf-reveal) | Blauw. Buddy springt op het varken en gaat op de gleuf zitten; een muntje stuitert van hem af. Agendategel di 16 bij "herinnering", chip "Herinnering" bij "agenda", tijd rolt 09:00 → 19:00 op "Wanneer jij wilt" | Buddy zet een herinnering in je agenda. Wanneer jij wilt. |
| 4 | 10,60 s (coin flip) | Blauw. "€3,49 per maand" groot; Buddy wipt één muntje in een klein varken; knop "activeer buddy" bij "Activeer", subregel en woordmerk, tik op de knop aan het eind | Drie euro negenenveertig per maand. Activeer Buddy. |

Overgangen: **coin flip** (inkomende scène draait als een opgeworpen munt in, rotateY) en **gleuf-reveal** (nieuwe scène verschijnt door een spleet in de vorm van een muntgleuf). Beide CSS.

## Voice-over (ElevenLabs, eleven_v4, één take, stem uit ELEVENLABS_VOICE_ID)

```
[S1] Weer een abonnement? Zonde van je geld. [S2] Zonde? Een aanmaning kan uitlopen op veertig euro. [S3] Buddy zet een herinnering in je agenda. Wanneer jij wilt. [S4] Drie euro negenenveertig per maand. Activeer Buddy.
```

32 woorden, 14,1 s, langste pauze 0,55 s. Genormaliseerd naar −14 LUFS.

## Caption

Zie `spaarpot-caption.md`.

## Ads Manager

- Primaire tekst (112): Weer een abonnement? Een aanmaning kan uitlopen op €40. Buddy zet je rekening in je agenda voor €3,49 per maand.
- Kop (22): Zonde? Reken even mee.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

## Uniciteit

Op 6 van 6 punten anders dan 1, 2, 3 en 62. Tegenover 66 (ook `prijs`, weegschaal, rekensom): andere vorm, ander visueel systeem, Buddy doet iets anders (zit op de gleuf, wipt een muntje), ander slotbeeld en andere overgangen: 5 van 6.

<!-- copycheck:off -->
## Copyregels
€3,49 alleen als pakket Buddy (met reminder in je agenda); €40 alleen met "kan uitlopen op"; geen gratis, geen proefperiode, geen Lite of Pro.
<!-- copycheck:on -->

## Open punten
- Instappagina: "aanmaning en incassokosten" past het best; die pagina noemt volgens de changelog nog prijzen en "30 dagen geld terug".
