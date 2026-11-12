# BetaalBuddy · Instagram ad, concept 80

## "Alleen wat jij toespeelt." (tafeltennis)

**In één zin:** Buddy leunt nieuwsgierig over het net naar jouw mailbox, maar nee: het net schiet omhoog tot een muur, want je mailbox blijft van jou; jij speelt hem alleen die ene rekening toe, en Buddy slaat hem terug, recht op de vervaldatum in je agenda.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Tafeltennis-Reel`) · 4:5 feed 1080×1350 (`BB-Tafeltennis-Feed`) |
| Lengte | 11,9 s (357 frames, 30 fps): stem 10,9 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` (API) |
| Aanpassen | `src/tafeltennis/schema.ts` (teksten, kleuren, `withVoice`, `transitionFrames`); scènestarts uit `public/vo/tafeltennis/timing.json` |
| Render | `npm run render:tafeltennis` en `:feed`, daarna loudnorm (I -14, TP -1, LRA 11) naar `renders/tafeltennis-*-vo.mp4`; stil met `--props='{"withVoice":false}'` |
| Geluid | Werkt zonder geluid: elke zin staat ook als kop in beeld |

### Keuze
USP **geen-koppeling**: volgens de changelog het langst niet gebruikt (laatst concept 72; geen-ai was 73, de rest 74 tot 79). Vorm **vraag en antwoord** (niet in de laatste drie: 77 twee banen, 78 kassabon, 79 één shot). Metafoor **tafeltennis**: je speelt Buddy alleen de bal toe die jij kiest. Afgevallen: serveerluik en kluisje (te dicht bij de brievenbus van 72).

### Hoe dit verschilt
| | 3 (privacy) | 72 (sleutel) | 62 (boemerang) | **80** |
|---|---|---|---|---|
| Invalshoek | Jij kiest wat Buddy ziet | Geen sleutel van je mailbox | Wegleggen werkt niet | **Kijkt Buddy mee? Nee: jij speelt toe** |
| Vorm | probleem, doorsturen, uitkomst | mythe tegenover feit | probleem, doorsturen, uitkomst | **vraag en antwoord** |
| Visueel systeem | Focus, wazig tegenover scherp | Deuren, hangsloten, brievenbus | Vluchtbanen | **Tafeltennistafel in zijaanzicht** |
| Rol van Buddy | Slaapmasker op en af | Schuift sleutel terug | Vangt en gooit | **Leunt over het net, schudt nee, slaat terug** |
| Einde | Regie | Geen sleutel nodig | Omkering | **Regie: alleen wat jij toespeelt** |
| Slotbeeld (CTA) | Buddy op de knop | Sleutel terug | Boemerang om de knop | **Hooghouden; laatste slag op de pijl van de knop** |
| Overgangen | wipe, focus pull | slam, slot | swing, spin-return | **net-sweep, bounce-drop** (CSS, `src/lib/tableWipes.ts`) |

Op 6 van 6 punten anders dan 62 en de agenda-concepten; op minstens 5 van 6 anders dan 3 en 72 (zelfde USP).

---

## Storyboard (scènestart = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) | 0,00 tot 2,17 s | Kop "Kijkt Buddy mee in je mailbox?" staat op frame 0. Tafel met net; links "Je mailbox" met vier afzenders, rechts Buddy met geel batje. Op "mee" (0,63 s) leunt hij over het net, op "mailbox" (1,13 s) staart hij naar je mail. |
| 2 · Nee (blauw, net-sweep) | 2,17 tot 4,77 s | Kop "Nee. Je mailbox blijft van jou." woord voor woord op de stem. Het net schiet omhoog tot een muur, Buddy schudt nee en springt terug naar zijn helft (3,17 s); chip "Van jou" op "jou" (4,07 s). |
| 3 · Toespelen (licht, bounce-drop) | 4,77 tot 9,60 s | Kop "Jij kiest wat je toespeelt." Op "rekening" (6,00 s) licht Energieleverancier geel op en komt eruit als rekening €87,60; jouw rode batje slaat hem over het net op "toe" (6,43 s), Buddy slaat terug op "kiest" (7,07 s); de agendastrook komt op "en" (7,80 s) en de rekening landt op do 17 op "agenda" (8,63 s). Subregel "Buddy zet hem in je agenda." |
| 4 · CTA (blauw, net-sweep) | 9,60 tot 11,90 s | Tagline "Alleen wat jij toespeelt." Buddy houdt een balletje hoog, knop "activeer buddy" op "Activeer" (9,80 s), de laatste slag landt op de pijl en tikt hem aan (10,83 s); subregel "Geen app. Geen bankkoppeling." en woordmerk. |

Cover: frame 34 (Buddy leunt over het net, kop volledig in beeld).

---

<!-- copycheck:off -->
## Copyregels
Volgt brand §2 en §3: alleen doorsturen, geen mailbox- of bankkoppeling, geen prijs, pakketnaam, "gratis", AI of retentieclaim. "Herinnering wanneer jij wilt" in de caption hoort bij pakket Buddy (onboarding v5.1).
<!-- copycheck:on -->

## Voice-over (ElevenLabs eleven_v4, één take, 31 woorden, 10,84 s)

```
[S1] Kijkt Buddy mee in je mailbox? [S2] Nee, je mailbox blijft van jou. [S3] Je speelt Buddy alleen de rekening toe die jij kiest, en hij zet hem in je agenda. [S4] Activeer Buddy.
```

Naar ElevenLabs (zonder markers):
```
Kijkt Buddy mee in je mailbox? Nee, je mailbox blijft van jou. Je speelt Buddy alleen de rekening toe die jij kiest, en hij zet hem in je agenda. Activeer Buddy.
```

| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Kijkt Buddy mee in je mailbox? | Buddy leunt over het net naar je mailbox |
| S2 | 2,17 | 65 | Nee, je mailbox blijft van jou. | Net wordt een muur, Buddy schudt nee, chip "Van jou" |
| S3 | 4,77 | 143 | Je speelt Buddy alleen de rekening toe die jij kiest, en hij zet hem in je agenda. | Jij slaat de rekening over het net, Buddy slaat hem op do 17 |
| S4 | 9,60 | 288 | Activeer Buddy. | Hooghouden, bal op de pijl van de knop |

Luistertoets: langste pauze tussen woorden 0,28 s (alignment), 0,58 s (silencedetect -35 dB). Stem niet versneld. De stem is korter dan de beoogde 13 s; de video is daarom 11,9 s.

## Caption en Ads Manager
Zie `renders/tafeltennis-caption.md`.
- Primaire tekst (111): Kijkt Buddy mee in je mailbox? Nee. Je stuurt alleen de rekening door die jij kiest, en die staat in je agenda.
- Kop (25): Alleen wat jij toespeelt.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

Copycheck: geen treffers (schema, voice-over, caption, Ads Manager).

## Open controles
- Instappagina: "privacy zonder mailboxkoppeling" past precies; URL voor knop en link in bio nog vastleggen.
- Agendadatums staan op december (ma 14 tot vr 18); na half december omzetten. Bedrag is een voorbeeld.
