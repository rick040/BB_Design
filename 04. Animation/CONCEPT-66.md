# Concept 66 · "Reken maar uit." (weegschaal)

**USP:** `prijs` (nooit gebruikt; bij gelijkspel met geen-app, overzicht en doelgroep wint de bovenste in brand §4).
**Vorm:** rekensom (niet in de laatste drie: 63 en 64 mythe tegenover feit, 65 vraag en antwoord).
**Beeld:** een weegschaal. Gekozen boven kassabon (te dicht op de bon uit 65) en twee prijskaartjes (statisch).

**Idee.** Een vergeten rekening ligt op de weegschaal; dan valt er een zwaar gewicht van €40 bij en slaat de balk door. Buddy springt met een prijskaartje van €3,49 op de lege schaal, weegt zwaarder en het gewicht glijdt eraf. Het slot is de som zelf: €3,49 < €40, met de knop onder de streep als uitkomst.

## Scènes (gemeten op de stem, 30 fps, totaal 434 frames = 14,47 s)

| # | Start | Beeld | Kop |
|---|---|---|---|
| 1 | 0,00 s | Weegschaal, rekening Energieleverancier €87,60 op de rechterschaal, wordt bleek op "vergeten" | Wat kost een vergeten rekening? |
| 2 | 2,23 s | Stempel Aanmaning (2,60 s); gewicht €40 valt op de schaal en de balk slaat door (4,07 s) | Eén aanmaning kan uitlopen op €40. |
| 3 | 5,37 s | Overgang kantel. Buddy springt op de linkerschaal, de balk kantelt, het gewicht glijdt eraf; prijskaartje €3,49 op "drie" (6,03 s) | Buddy: €3,49 per maand. |
| 4 | 8,33 s | Overgang rekenstreep. Agenda-tegel do 17 dec, chip Herinnering op 9,37 s, rekening springt in de agenda op 10,33 s | Met een herinnering in je agenda. |
| 5 | 10,97 s | Overgang rekenstreep. Som €3,49 < €40, streep, knop, woordmerk; Buddy zit op zijn eigen prijs; tik op 13,40 s | Reken maar uit. |

Uniciteit: verschilt op 6 van 6 punten van elk concept in CONCEPTEN.md (USP, weegschaal, Buddy weegt de boete weg, einde als rekensom, Buddy op zijn prijs bij de CTA, overgangen kantel en rekenstreep).

## Voice-over (ElevenLabs, één take)

Stem uit `ELEVENLABS_VOICE_ID`, model `eleven_v4`, stability 0,5, similarity 0,75, route `with-timestamps`. 32 woorden, 13,40 s, langste pauze 0,53 s. Scènetijden in `public/vo/weegschaal/timing.json`.

```
[S1] Wat kost een vergeten rekening? [S2] Eén aanmaning kan uitlopen op veertig euro. [S3] Buddy kost drie euro negenenveertig per maand. [S4] Daarvoor krijg je een herinnering in je agenda. [S5] Reken maar uit. Activeer Buddy.
```

## Caption

Zie `renders/weegschaal-caption.md`.

## Ads Manager

- Primaire tekst (96 tekens): Eén aanmaning kan uitlopen op €40. Buddy kost €3,49 per maand, met een herinnering in je agenda.
- Kop: Reken maar uit.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

## Bouwen

`src/weegschaal/` (schema, `WeegschaalAd.tsx`, `components/Scale.tsx`, vier scènes), overgangen in `src/lib/scaleWipes.ts`. Compositie `BB-Weegschaal-Reel` (1080×1920), `npm run render:weegschaal`. Alleen de Reel met stem; geen Feed, geen stille versie, geen cover.

<!-- copycheck:off -->
## Copyregels
- €40 alleen met "kan" (wettelijk minimum na een veertiendagenbrief).
- €3,49 per maand is pakket Buddy (met reminder in de agenda); nooit "vanaf €2,99".
<!-- copycheck:on -->

## Open punten
- Instappagina voor knop en link in bio: 'aanmaning en incassokosten' past het best; die pagina noemt volgens de changelog nog prijzen en "30 dagen geld terug".
- Prijs €3,49 controleren vlak voor livegang.
