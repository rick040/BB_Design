# BetaalBuddy · Instagram ad, concept 63

## "Geen AI. Gewoon vaste regels."

**In één zin:** de mythe "er leest een AI mee met je rekeningen" wordt met een groot "Nee." ontkracht, waarna Buddy een sjabloon op de rekening slaat met vier gaten: bedrag, vervaldatum, betaallink en kenmerk, en meer niet.

| | |
|---|---|
| USP | `geen-ai` (nog nooit gebruikt; bovenaan de rotatie in brand §4) |
| Verhaalvorm | Mythe tegenover feit |
| Formaat | Alleen 9:16 Reel 1080×1920 (`BB-GeenAi-Reel`), met stem |
| Lengte | 14,67 s (440 frames, 30 fps): stem 13,6 s plus ~1 s CTA |
| Geluid | Werkt zonder geluid: elke zin staat ook in beeld |
| Code | `src/geenai/`, overgangen in `src/lib/stencilWipes.ts`, stem en timing in `public/vo/geenai/` |

### Hoe dit verschilt van de index (CONCEPTEN.md)

| | 1, 2, 62 (agenda) | 3 (geen-koppeling) | **63** |
|---|---|---|---|
| Invalshoek | Rekening vergeten, agenda | Privacy, geen mailboxkoppeling | Geen AI, vaste regels |
| Vorm | Probleem, doorsturen, uitkomst | Probleem, doorsturen, uitkomst | Mythe tegenover feit |
| Visueel systeem | UI, typografisch, vluchtbanen | Focus, wazig tegenover scherp | Sjabloon met gaten over een factuur, AI-bol |
| Buddy | Slikt op, rijdt mee, vangt | Slaapmasker | Schudt nee, slaat het sjabloon neer, kijkt elk gat langs |
| Einde | Belofte, uitkomst, omkering | Regie | Ontkrachting plus regel |
| Slotbeeld | Op of rond de CTA-knop | Bovenop de knop | Knop in het gat van een sjabloon, Buddy gluurt over de rand |
| Overgangen | iris, slide, clock-wipe, swing, spin | wipe, focus pull | slam, stencil holes, plate drop |

## Storyboard (tijden gemeten uit de ElevenLabs-alignment)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Mythe (licht) | 0,00 tot 2,73 s | Kop "Leest er een AI mee met je rekeningen?" staat op frame 0. Een AI-bol scant de factuur van de Energieleverancier; chip "Mythe?" op 1,53 s |
| 2 · Feit (blauw), slam | 2,73 tot 5,27 s | Reuzen-"Nee." slaat in. Chip "Feit". Buddy springt op (3,43 s) en schudt nee; rode streep door de AI-bol op "AI" (4,47 s) |
| 3 · Regels (licht), stencil holes | 5,27 tot 11,37 s | "Gewoon vaste regels." Buddy springt, het sjabloon landt op "vaste" (5,83 s). Gaten lichten op met vinkje: bedrag 7,60 s, vervaldatum 8,40 s, betaallink 9,57 s, kenmerk 10,60 s |
| 4 · CTA (blauw), plate drop | 11,37 tot 14,67 s | "Geen AI. Vaste regels." Plaat met één gat valt in, de knop "activeer buddy" verschijnt in het gat op "Activeer" (12,33 s); Buddy gluurt over de rand; subregel en woordmerk; tik op 13,47 s |

## Voice-over

ElevenLabs, stem uit `ELEVENLABS_VOICE_ID`, model `eleven_v4`, `language_code` nl, stability 0,5, similarity 0,75, één take via `/with-timestamps`. 30 woorden, 13,6 s. Langste pauze (silencedetect -35 dB) 0,56 s.

```
[S1] Leest er een AI mee met je rekeningen? [S2] Nee. Buddy gebruikt geen AI. [S3] Gewoon vaste regels. Hij pakt het bedrag, de vervaldatum, de betaallink en het kenmerk. [S4] Meer niet. Activeer Buddy.
```

Scènestarts (frames): 0, 82, 158, 341; einde stem 408.

<!-- copycheck:off -->
## Copyregels
Alleen "geen AI" als eigenschap; de vraag "Leest er een AI mee?" is de mythe en wordt meteen ontkend. Geen prijs, geen gratis, geen merknamen. Wat Buddy leest (bedrag, vervaldatum, betaallink, kenmerk) komt uit brand §2.
<!-- copycheck:on -->

## Caption (Reels)

Zie `renders/geenai-caption.md`.

**Ads Manager:** primaire tekst "Leest er een AI mee met je rekeningen? Bij Buddy niet: vaste regels, alleen bedrag, datum, link en kenmerk." (107 tekens) · Kop "Geen AI. Gewoon vaste regels." (29) · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden".

## Open controles
- Take op eleven_v4 beluisteren, vooral "AI" en "Buddy".
- Instappagina voor knop en link in bio: de privacypagina (zonder mailboxkoppeling) past het best.
