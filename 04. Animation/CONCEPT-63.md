# Concept 63 · "Geen AI. Gewoon vaste regels."

**USP:** `geen-ai` (nog nooit gebruikt; bovenste in de rotatietabel). **Vorm:** mythe tegenover feit.
**Idee:** de ad begint met de vraag die mensen stellen ("Dus Buddy leest je rekening met AI?") en ontkracht die meteen. Daarna zie je wat Buddy wel doet: met een liniaal regel voor regel de doorgestuurde rekening aflezen en vier vaste velden afvinken.

| | |
|---|---|
| Compositie | `BB-Regels-Reel` (1080×1920), map `Concept-63-Regels` in Studio |
| Code | `src/regels/` (schema, `RegelsAd.tsx`, scènes, `components/Ruler.tsx`, `transitions.ts`) |
| Stem | `public/vo/regels/` (vo.json, voice-over.mp3, timing.json), één take, eleven_v4 |
| Lengte | 496 frames = 16,53 s (stem 15,52 s + 1 s CTA) |
| Render | `npm run render:regels`, daarna loudnorm (I=-14, TP=-1, LRA=11) |

## Storyboard (tijden gemeten uit de alignment)

| Scène | Start | Beeld | Beats |
|---|---|---|---|
| 1 Mythe (licht) | 0,00 s | Kop "Dus Buddy leest je rekening met AI?", blauwe Buddy met sterretjes om zich heen en een chip "✦ AI" als aureool | label "Mythe?" klapt erop bij "AI?" (1,83 s) |
| 2 Feit (blauw) | 2,80 s | Kaartflip. Reuzen-"Nee.", kop "Er gaat geen AI over je mail." woord voor woord | streep door AI-chip bij "geen" (3,83 s), chip en sterretjes vallen eraf (4,17 s), label "Feit" bij "mail" (5,13 s) |
| 3 Vaste regels (licht) | 5,77 s | Gelinieerd vel van de Energieleverancier; Buddy rijdt op een liniaal regel voor regel omlaag | vinkjes op bedrag 7,93 s, vervaldatum 8,63 s, betaallink 9,67 s, kenmerk 10,47 s; subregel "Alleen wat jij doorstuurt." |
| 4 CTA (blauw) | 11,43 s | Liniaal-sweep. Tagline "Geen AI. Gewoon vaste regels." op de stem; Buddy loopt over de liniaal als evenwichtsbalk | knop "activeer buddy" 14,40 s, woordmerk, tik 15,47 s |

Overgangen (alleen CSS): kaartflip (rotateY), gelinieerde lijnen (masker van groeiende strepen), liniaal-sweep (clip-path met liniaal als rand).

## Voice-over (ElevenLabs, zoals ingetypt; markers niet meegestuurd)

```
[S1] Dus Buddy leest je rekening met AI? [S2] Nee. Er gaat geen AI over je mail. [S3] Buddy leest met vaste regels: bedrag, vervaldatum, betaallink en kenmerk. [S4] Geen AI. Gewoon vaste regels. Activeer Buddy.
```
32 woorden, stem uit ELEVENLABS_VOICE_ID, eleven_v4, stability 0,5, similarity 0,75. Langste pauze 0,24 s.

## Caption

Zie `renders/regels-caption.md`.

## Ads Manager

- Primaire tekst (95): Er gaat geen AI over je mail. Buddy leest je rekening met vaste regels en zet hem in je agenda.
- Kop (29): Geen AI. Gewoon vaste regels.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
- "AI" staat alleen in de mythevraag die direct met "Nee." wordt ontkracht, of als "geen AI". De AI-chip wordt in beeld doorgestreept.
- Geen prijs, geen gratis, geen merknamen. Betaallink en kenmerk zijn velden die Buddy uit de doorgestuurde mail leest (brand §2).
<!-- copycheck:on -->
