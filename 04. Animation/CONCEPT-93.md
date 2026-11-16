# BetaalBuddy · Instagram ad, concept 93

## "Geen app. Je hebt het al."

**In één zin:** nog een app met account, wachtwoord en meldingen hoeft niet, want je mail en je agenda heb je al: Buddy is het embleem op een zakmes dat precies die twee onderdelen uitklapt, en aan het eind klapt het mes dicht en wordt het handvat de knop.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Zakmes-Reel`) · 4:5 feed 1080×1350 (`BB-Zakmes-Feed`) |
| Lengte | 11,6 s (4 scènes, 30 fps, 348 frames). Scènestarts komen uit de stem: `public/vo/zakmes/timing.json` |
| USP | `geen-app` (rotatieregel: laatst gebruikt in concept 85; daarna 86 tot 92 alle andere USP's) |
| Vorm | Vraag en antwoord ("Nog een app?" "Hoeft niet.") · niet gebruikt in 90, 91 en 92 |
| Metafoor | Zakmes. Afgevallen: gereedschapskist (te dicht op de puzzel van 85) en sleutelbos (te dicht op 72) |
| Geluid | Werkt zonder geluid. Met stem: prop `withVoice` (aan in de VO-renders, uit in de stille) |

### Hoe dit verschilt van de eerdere concepten

| | 67 Geen app. Je mail is genoeg. | 77 Klaar voordat die app laadt. | 85 Geen app. Het past al. | **93 (dit concept)** |
|---|---|---|---|---|
| Invalshoek | Volle telefoon, opslag vol | Race: app laadt, Buddy niet | Stappen passen niet als puzzel | Wat je nodig hebt zit al in je zak: mail en agenda als uitklapbaar gereedschap |
| Visueel systeem | Telefoon met apps | Twee racebanen | Puzzelstukjes, rekensom | Mechanisch object: zakmes met handvat en twee onderdelen |
| Rol van Buddy | Duwt de telefoon om, vangt rekening | Sprint over de finish | Legt stukjes | Is het embleem op het handvat; klapt bij elke sprong een onderdeel uit, slikt de rekening, stuurt de datum naar het agenda-onderdeel |
| Einde | Camera duikt het scherm in | Finish | Puzzel past | Het mes klapt dicht |
| Slotbeeld (CTA) | n.v.t. | n.v.t. | n.v.t. | Het handvat wordt de knop; Buddy springt eruit en staat links naast de knop |
| Overgangen | n.v.t. | n.v.t. | n.v.t. | snede (diagonale snee die openklapt), lemmet (uitschuivend lemmet met punt) |

Op vijf of zes van zes punten anders dan 67, 77 en 85; en anders dan 1, 2, 3 en 62 in `CONCEPTEN.md`.

---

## Storyboard (tijden gemeten uit de ElevenLabs-alignment)

### 1 · Hook: "Nog een app voor je rekeningen?" (0,00 tot 1,83 s) · licht
- Frame 0: de kop staat er al, met een installatiekaart "Rekeningen" die blijft hangen op 9 tot 12 procent.
- Drie zwarte taken stapelen scheef op: 1 Account aanmaken (0,13 s), 2 Wachtwoord bedenken (0,57 s), 3 Meldingen aanzetten? (1,03 s); de laatste schudt.

### 2 · "Hoeft niet." (1,83 tot 4,93 s) · snede naar blauw
- Een gesloten zakmes met wit handvat; Buddy is het embleem en schudt nee op "niet".
- Op "mail" (3,03 s) springt Buddy en klapt het mail-onderdeel uit; op "agenda" (3,43 s) het agenda-onderdeel. Labels Mail en Agenda.
- Subregel: "Je mail en je agenda heb je al."

### 3 · "Stuur je rekening door." (4,93 tot 9,13 s) · lemmet naar licht
- Het open mes met blauw handvat. Bij het mail-onderdeel verschijnt de rekening (Energieleverancier, €87,60) met de knop Doorsturen.
- Op "door" (5,93 s) vliegt de rekening in Buddy, die hem doorslikt (6,33 s).
- Op "vervaldatum" (7,20 s) schiet een gele chip "do 17 dec" naar het agenda-onderdeel; op "agenda" (8,03 s) springt daar een kalendertegel 17 dec in beeld, met daaronder "Herinnering ma 14".
- Subregel: "Buddy zet de vervaldatum in je agenda."

### 4 · CTA (9,13 tot 11,60 s) · snede naar blauw
- Slotkop "Geen app. Je hebt het al."; het mes klikt dicht (9,20 tot 9,57 s).
- Buddy springt op "Buddy" uit het handvat en landt links naast de knop; het handvat wordt de knop "activeer buddy" (9,63 s). Subregel "Werkt met je mail en je agenda.", woordmerk. Tik op de knop op 10,33 s.

---

<!-- copycheck:off -->
## Copyregels
- Geen gratis, geen proefperiode, geen prijs, geen andere merknamen, geen rood (waarschuwingen in #111827).
- "Jij kiest wanneer je een herinnering krijgt" en "Herinnering ma 14" vallen onder pakket Buddy; er staat geen prijs in de ad.
- De zakmesvorm is generiek: geen kruis of schild van een bestaand merk.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, eleven_v4, één take)

Stem: ELEVENLABS_VOICE_ID `7qdUFMklKPaaAVMsBTBt`, `language_code` nl, stability 0.5, similarity_boost 0.75. Route: API `/with-timestamps` (200). Lengte 10,45 s, 32 woorden, langste pauze tussen woorden 0,24 s.

Tekst met scènemarkers (de markers gaan niet naar ElevenLabs):

```
[S1] Nog een app voor je rekeningen? [S2] Hoeft niet, want je mail en je agenda heb je al. [S3] Dus stuur je rekening door, en Buddy zet de vervaldatum in je agenda. [S4] Activeer Buddy.
```

| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Nog een app voor je rekeningen? | Installatiekaart, taken stapelen op |
| S2 | 1,83 | 55 | Hoeft niet, want je mail en je agenda heb je al. | Snede naar blauw; mail-onderdeel op 91, agenda-onderdeel op 103 |
| S3 | 4,93 | 148 | Dus stuur je rekening door, en Buddy zet de vervaldatum in je agenda. | Lemmet naar licht; rekening in Buddy 178 tot 190, datum vliegt 216, tegel 241 |
| S4 | 9,13 | 274 | Activeer Buddy. | Snede naar blauw; mes dicht, knop 289, Buddy springt 283 |

Bestanden: `public/vo/zakmes/voice-over.mp3` (ruw), `vo.json` (API-antwoord met alignment), `timing.json` (frames), `renders/zakmes-voice-over.mp3` (loudnorm -14 LUFS).

## Caption (Reels)

```
Nog een app voor je rekeningen, met weer een account en een wachtwoord? Hoeft niet. Je hebt alles al in je zak. 🧰

Buddy werkt met wat je al gebruikt: je mail en je agenda. 💙
📩 Stuur je rekening door naar Buddy
📅 Buddy zet de vervaldatum in je agenda
🔔 Jij kiest wanneer je een herinnering krijgt

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #geenapp #budgetteren
```

**Advertentie (Ads Manager):** primaire tekst "Nog een app voor je rekeningen? Hoeft niet. Stuur je rekening door en Buddy zet de vervaldatum in je agenda." (108 tekens) · Kop "Geen app. Je hebt het al." (25) · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden". Copycheck: geen treffers.

## Exporteren
- Studio: `npm run dev`, map `Concept-93-Zakmes`. Teksten en kleuren in `src/zakmes/schema.ts`; timing volgt `public/vo/zakmes/timing.json`.
- `npm run render:zakmes`, `render:zakmes:feed`, `render:zakmes:stil`, `render:zakmes:feed:stil`, `still:zakmes` (frame 40). Daarna loudnorm op de VO-versies (zie CONCEPT-62).

## Open controles
- Instappagina voor knop en link in bio: er is geen geen-app-pagina; algemene startpagina gebruiken.
- "Herinnering ma 14" is een voorbeeld van een gekozen herinnermoment.
- Lengte 11,6 s, iets onder de 12 tot 16 s uit de skill, omdat de stem in één take 10,45 s duurde.
