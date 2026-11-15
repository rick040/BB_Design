# BetaalBuddy · Instagram ad, concept 89

## "Geen AI. Gewoon op de maat."

**In één zin:** een wiebelende AI-wolk gokt naar je bedrag en datum, een metronoom slaat hem weg, en Buddy leest op de tik vier vaste velden van elke rekening.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Metronoom-Reel`), alleen Reel met stem |
| Lengte | 16,53 s (496 frames, 30 fps), één doorlopend shot zonder scènewissel |
| USP | `geen-ai` (langst ongebruikt: laatst in concept 81 volgens de rotatie 81 tot 88) |
| Vorm | één doorlopend shot zonder scènewissel, tekst op de stem (niet in 86, 87, 88) |
| Geluid | Voice-over in één take (ElevenLabs, eleven_v4, nl), werkt ook zonder geluid |
| Code | `src/metronoom/` (schema.ts voor teksten en kleuren, beats.ts voor de beats) |

### Uniciteit
Anders dan de eerdere geen-ai-concepten 63 (liniaal), 64 (sjabloon) en 73 (knikkerbaan) en dan 86 tot 88:
- **Visueel systeem:** metronoom met slinger, ritme als bewijs van vaste regels; rekening met vier genummerde rijen.
- **Buddy:** rijdt op het gewicht van de slinger mee, tikt de velden af, en knikt aan het eind mee op de maat.
- **Einde:** "Geen AI. Gewoon op de maat." met de slinger stil in het midden.
- **Slotbeeld:** Buddy zit op de stilstaande slinger, de knop pulseert in de maat op "Activeer" en "Buddy".
- **Overgangen:** geen cuts; blauwe vloed die met de metronoom van onder opkomt, slinger die de AI-wolk wegslaat, rekening die zijwaarts wordt doorgeschoven.

---

## Storyboard (tijden gemeten uit de alignment)

| # | Tijd | Beeld | Stem |
|---|---|---|---|
| S1 | 0,00 tot 2,47 s · licht | Kop "Leest er een AI mee met je rekening?" staat er op frame 0. Donkere AI-wolk wiebelt boven de rekening van de Zorgverzekeraar en gokt: "€12,89?", "morgen?", "volgend jaar?" | Leest er een AI mee met je rekening? |
| S2 | 2,47 tot 4,97 s · blauwe vloed | Blauw stroomt omhoog met de metronoom; de slinger slaat de AI-wolk weg (2,73 s). Buddy landt op het gewicht (3,13 s), de slinger begint (3,77 s) | Nee. Buddy leest op de maat. |
| S3 | 4,97 tot 9,20 s | Elke tik licht één rij op met nummer en vinkje: Bedrag 4,97 s, Vervaldatum 5,83 s, Betaallink 7,03 s, Kenmerk 8,17 s. Grote kop toont het veld, "tik n van 4" | Bedrag. Vervaldatum. Betaallink. Kenmerk. |
| S4 | 9,20 tot 11,83 s | Rekening schuift weg, Energieleverancier schuift in; vier snelle tikken op dezelfde rijen (10,27 tot 11,53 s) | Elke rekening, dezelfde vier tikken. |
| S5 | 11,83 tot 16,53 s | "Geen AI. Gewoon op de maat."; slinger stopt (13,87 s), knop "activeer buddy" 14,33 s, woordmerk, "Geen app. Geen bankkoppeling."; knop pulseert op de maat, Buddy knikt mee en kijkt blij | Geen AI. Gewoon op de maat. Activeer Buddy. |

<!-- copycheck:off -->
## Copyregels
- "AI" komt alleen voor in de vraag "Leest er een AI mee?" met als antwoord "Nee." en in "Geen AI". Buddy wordt nergens als AI neergezet.
- Vier velden (bedrag, vervaldatum, betaallink, kenmerk) en vaste regels: brand §2. Herinnering wanneer jij kiest: pakket Buddy.
- Geen rood (Gate 1): de AI-wolk staat in #111827. Generieke afzenders, geen echte domeinen (betaallink als "link in de mail").
<!-- copycheck:on -->

## Voice-over (ElevenLabs, eleven_v4, nl, stability 0,5, similarity 0,75, één take)
```
[S1] Leest er een AI mee met je rekening? [S2] Nee. Buddy leest op de maat. [S3] Bedrag. Vervaldatum. Betaallink. Kenmerk. [S4] Elke rekening, dezelfde vier tikken. [S5] Geen AI. Gewoon op de maat. Activeer Buddy.
```
31 woorden, stem 15,54 s, langste pauze 0,54 s. Bestanden: `public/vo/metronoom/` (vo.json, voice-over.mp3, timing.json).

## Caption (Reels)
Zie `renders/metronoom-caption.md`.

**Advertentie (Ads Manager):** primaire tekst "Leest er een AI mee met je rekening? Nee. Buddy pakt bedrag, datum, link en kenmerk met vaste regels." (101 tekens) · Kop "Geen AI. Gewoon op de maat." · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden".

## Open controles
- Instappagina voor knop en link in bio: er is geen geen-ai-pagina; algemene startpagina gebruiken.
- Stem is 15,5 s, langer dan het doel van 13 s.
