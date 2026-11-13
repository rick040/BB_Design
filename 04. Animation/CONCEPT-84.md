# BetaalBuddy · Instagram ad, concept 84

## "Laat hem niet opblazen." (ballon)

**In één zin:** een vergeten rekening blaast zich op als een rode ballon tot "€40" met een aanmaning eronder; Buddy prikt hem lek, noemt zijn prijs (€3,49 per maand) en zet de rekening in je agenda, en aan het eind zweeft de knop binnen aan een blauwe ballon die Buddy aan een touwtje vasthoudt.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Ballon-Reel`) · 4:5 feed 1080×1350 (`BB-Ballon-Feed`) |
| Lengte | 13,57 s (407 frames, 30 fps): stem 12,57 s plus 1 s CTA |
| USP en vorm | `prijs` (het langst niet gebruikt, laatst 76) · vraag en antwoord (niet in 81, 82, 83) |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` (API) |
| Aanpassen | `src/ballon/schema.ts` (teksten, kleuren, `withVoice`, `transitionFrames`); scènetijden uit `public/vo/ballon/timing.json` |
| Render | `npm run render:ballon` en `npm run render:ballon:feed`, daarna loudnorm (I -14, TP -1, LRA 11); stille versie met `--props='{"withVoice":false}'` |

### Hoe dit verschilt van de eerdere concepten
| | 1 | 2 | 3 | 62 | 66 (prijs) | 76 (prijs) | **84** |
|---|---|---|---|---|---|---|---|
| Invalshoek | Overzicht | Timing | Privacy | Hij komt terug | Weegschaal €3,49 tegen €40 | Abonnement zonde? | **Een vergeten rekening blaast zich op** |
| Visueel systeem | UI | Typografisch | Focus | Vluchtbanen | Weegschaal, som | Spaarvarken, teller | **Ballon die in ademstoten groeit op de stem** |
| Buddy | Slikt rekening | Rijdt mee | Slaapmasker | Vangt en gooit | Springt op de schaal | Springt op muntgleuf | **Prikt de ballon lek, krijgt de rekening op zijn hoofd en gooit hem op do 17** |
| Einde | Belofte | Uitkomst | Regie | Omkering | Som | Prijs | **Opdracht: "Laat hem niet opblazen."** |
| Slotbeeld | Woordmerk | Op de knop | Op de knop | Boemerang om de knop | Op zijn prijs | Muntje in het varken | **Knop hangt aan een blauwe ballon, Buddy houdt het touwtje en geeft een ruk** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | (zie 66) | (zie 76) | **burst (stervormige knal vanuit de ballon), float-up (scène stijgt op)**, CSS in `src/lib/ballonWipes.ts` |

Verschilt op minstens 5 van 6 punten met elk concept, ook met de eerdere prijsconcepten 66 en 76.

---

## Storyboard (scènestarts = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) [S1] | 0,00 tot 2,17 s | Frame 0: kop "Wat kost een vergeten rekening?", rekening Energieleverancier €87,60 met een klein rood ballonnetje eraan. Op "vergeten" (0,73 s) wordt de kaart grauwer. |
| 2 · Opblazen (licht, doorlopend) [S2] | 2,17 tot 6,80 s | Kop "Hij blaast zich op." De ballon groeit in stoten op "blaast", "op" en "aanmaning" (3,87 s: stempel AANMANING, label Te laat, schok). Op "veertig" (5,47 s) staat "€40" op de ballon en de chip "Kan uitlopen op €40". Op "euro" springt Buddy op de kaart met een speld en springt naar de ballon. |
| 3 · Prijs (blauw, burst) [S3] | 6,80 tot 11,40 s | De ballon knapt (6,60 s) en de blauwe scène knalt stervormig open. Buddy valt in beeld. "€3,49" op "drie" (7,40 s), "per maand." op "per maand". De rekening dwarrelt op Buddy's hoofd; agendastrook ma 14 tot vr 18 met chip Herinnering op di 15; op "zet" (9,83 s) gooit Buddy de rekening, die op "agenda" (10,57 s) op do 17 landt (geel, €87,60). Subregel "Herinnering in je agenda, wanneer jij kiest." |
| 4 · CTA (licht, float-up) [S4] | 11,40 tot 13,57 s | De lichte scène stijgt op. Tagline "Laat hem niet opblazen."; de knop "activeer buddy" zweeft omhoog aan een blauwe ballon op "Activeer" (11,40 s), Buddy houdt het touwtje vast en geeft een ruk op "Buddy" (11,93 s). "Geen app. Geen bankkoppeling." en woordmerk; tik op de knop bij 12,50 s. |

---

<!-- copycheck:off -->
## Copyregels
Prijs alleen als €3,49 per maand (pakket Buddy, want het gaat over een herinnering in je agenda); geen Lite of Pro, geen "vanaf", geen "gratis". €40 steeds met "kan uitlopen op"; het ballonlabel "€40" staat altijd samen met de chip "Kan uitlopen op €40" in beeld. Geen "mail op 7 en 2 dagen".
<!-- copycheck:on -->

## Voice-over (ElevenLabs eleven_v4, één take, 32 woorden, 12,51 s)

Met scènemarkers (de markers gaan niet naar ElevenLabs):
```
[S1] Wat kost een vergeten rekening? [S2] Hij blaast zich op, want een aanmaning kan uitlopen op veertig euro. [S3] Buddy kost drie euro negenenveertig per maand, en zet hem in je agenda. [S4] Activeer Buddy.
```

| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Wat kost een vergeten rekening? | Kop, rekening met ballonnetje |
| S2 | 2,16 | 65 | Hij blaast zich op, want een aanmaning kan uitlopen op veertig euro. | Ballon groeit, AANMANING op 116, €40 en chip op 164 |
| S3 | 6,80 | 204 | Buddy kost drie euro negenenveertig per maand, en zet hem in je agenda. | Knal, €3,49 op 222, rekening op do 17 op 317 |
| S4 | 11,40 | 342 | Activeer Buddy. | Knop aan de ballon, ruk aan het touwtje op 358 |

Luistertoets: langste pauze tussen woorden 0,24 s (alignment); silencedetect -35 dB max 0,53 s. Niet versneld.

## Caption (Reels)
Zie `renders/ballon-caption.md`.

**Advertentie (Ads Manager):**
- Primaire tekst (100): Een vergeten rekening blaast zich op: een aanmaning kan uitlopen op €40. Buddy kost €3,49 per maand.
- Kop (23): Laat hem niet opblazen.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

## Open controles
- Instappagina voor knop en link in bio: "aanmaning en incassokosten" past het best. Die pagina noemt volgens de changelog nog prijzen en "30 dagen geld terug"; controleer dat de prijs daar €3,49 voor Buddy is.
- Datums staan op december (do 17, herinnering di 15) als voorbeeld.
