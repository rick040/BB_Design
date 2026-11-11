# BetaalBuddy · Instagram ad, concept 72

## "Geen sleutel nodig."

**In één zin:** je denkt dat Buddy de sleutel van je mailbox nodig heeft, maar Buddy schudt nee, je mailbox en je bank gaan op slot, en je gooit alleen die ene rekening door zijn brievenbus; daar leest hij bedrag, vervaldatum, betaallink en kenmerk, en meer ziet hij niet.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Sleutel-Reel`) · 4:5 feed 1080×1350 (`BB-Sleutel-Feed`) |
| Lengte | 12,20 s (366 frames, 4 scènes, 30 fps); stem 11,08 s plus ~1 s CTA |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. Stem in één take (ElevenLabs), aan en uit met de prop `withVoice` |
| Code | `src/sleutel/` · overgangen in `src/lib/keyWipes.ts` · stem en timing in `public/vo/sleutel/` |

**Keuze:** USP `geen-koppeling` (in de rotatie het langst niet gebruikt: laatst bij concept 3; 62 tot 71 deden agenda, geen-ai, inzage, prijs, geen-app, overzicht en doelgroep). Vorm mythe tegenover feit (niet in de laatste drie: 69 twee schermen, 70 en 71 vraag en antwoord). Metafoor: sleutel en brievenbus, omdat die het meest verschilt van het toestemmingsvenster en de focus-blur van concept 3.

### Hoe dit verschilt van de eerdere concepten

| | Concept 3 (zelfde USP) | Concept 62 | Concepten 63 tot 71 | **Dit concept** |
|---|---|---|---|---|
| Invalshoek | Privacy: jij kiest wat Buddy ziet | Wegleggen werkt niet | Geen AI, inzage, prijs, geen app, overzicht, zorgnota's | Buddy krijgt geen sleutel: mailbox én bank blijven dicht |
| Visueel systeem | Focus: wazig tegenover scherp, toestemmingsvenster | Vluchtbanen | Sjabloon, glazen la, weegschaal, telefoon, split screen, wachtkamer | Voorwerpen: deuren met hangslot, sleutel, brievenbus |
| Rol van Buddy | Slaapmasker op en af | Vangt de boemerang | Schudt nee, poetst glas, weegt, deelt nummers uit | Schuift de sleutel terug naar jou en kijkt door de brievenbus |
| Einde | Regie | Omkering | Diverse | Feit: "Geen sleutel. Alleen wat jij stuurt." |
| Slotbeeld (CTA) | Buddy op de knop | Buddy gooit een boemerang rond de knop | Sjabloon, raamwisser, som, schop, stapel, nummertje | De knop schuift als een brief uit de brievenbus, Buddy's ogen in de gleuf knipogen |
| Overgangen | wipe, focus pull | swing, spin-return | slam, stencil, schuifdeur, ticket-tear, split-flap… | **sleutelgat** (scène opent door een groeiend sleutelgat), **grendel** (scène schuift in en klikt vast), **brievenbus** (scène opent uit een smalle gleuf) |

Verschilt op 6 van 6 punten met concept 3 en met elk concept in de index.

---

## Storyboard (tijden gemeten uit de stem)

### 1 · Hook: "Krijgt Buddy de sleutel van je mailbox?" (0,00 tot 2,57 s) · licht
- Frame 0: de kop staat er al, een blauwe deur met label "Mailbox" en een open geel hangslot, een gele sleutel bij het slot en blauwe Buddy rechts.
- 0,2 tot 1,5 s: de sleutel zweeft in een boog naar Buddy; Buddy kijkt hem na.
- 1,83 s ("mailbox"): Buddy deinst terug.

### 2 · "Nee. Die houd je zelf." (2,57 tot 5,97 s) · overgang sleutelgat naar blauw
- 2,57 s ("Nee"): kop woord voor woord op de stem; twee witte deuren, Mailbox en Bank; Buddy schudt nee.
- 3,1 s ("die"): Buddy duwt de sleutel terug; die vliegt naar de kijker toe uit beeld.
- 3,60 s ("zelf"): het hangslot op Mailbox klikt dicht.
- 4,27 s ("en"): subregel "En je bank blijft dicht."; 5,23 s ("dicht"): het slot op Bank klikt dicht, Buddy tevreden.

### 3 · "Je stuurt alleen die ene rekening door." (5,97 tot 9,83 s) · overgang grendel naar licht
- Kop woord voor woord op de stem. Rekening (Telefoonprovider, €34,50, vervalt vr 18 dec) zweeft boven een brievenbusplaat "Doorstuuradres".
- 7,27 s ("rekening"): de rekening glijdt door de gleuf.
- 8,20 s ("dus"): Buddy's ogen verschijnen in de gleuf; subregel "Buddy ziet alleen wat jij doorstuurt."
- 8,57 s ("meer"): vier vinkjes: Bedrag, Vervaldatum, Betaallink, Kenmerk.

### 4 · CTA (9,83 tot 12,20 s) · overgang brievenbus naar blauw
- "Geen sleutel. Alleen wat jij stuurt." en een witte brievenbusplaat met Buddy's ogen.
- 9,90 s ("Activeer"): de knop "activeer buddy" schuift als een brief uit de gleuf.
- Subregel "Geen app. Geen bankkoppeling.", woordmerk; tik op de knop bij 11,07 s, Buddy knipoogt.

---

<!-- copycheck:off -->
## Copyregels
- Alleen bevestigde feiten: doorsturen naar je eigen doorstuuradres, geen mailbox- of bankkoppeling, geen app, Buddy leest bedrag, vervaldatum, betaallink en kenmerk.
- Geen claim over bewaren of verwijderen (retentie is 14 dagen na de vervaldatum); geen gratis, geen prijs, geen andere merknamen, geen AI-claim.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, één take)

Stem uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model `eleven_v4`, `language_code` nl, stability 0,5, similarity_boost 0,75. Route: API `/with-timestamps`. 32 woorden, 11,08 s, langste pauze 0,32 s (alignment) of 0,53 s (silencedetect). Niet versneld. Genormaliseerd naar -14 LUFS.

Tekst met scènemarkers (markers gaan niet naar ElevenLabs):
```
[S1] Krijgt Buddy dan de sleutel van je mailbox? [S2] Nee, die houd je zelf, en je bank blijft dicht. [S3] Je stuurt alleen die ene rekening door, dus meer ziet hij niet. [S4] Activeer Buddy.
```

| Cue | Start | Frame | Gesproken | Beeld |
|---|---|---|---|---|
| S1 | 0,00 s | 0 | Krijgt Buddy dan de sleutel van je mailbox? | Sleutel zweeft van je deur naar Buddy |
| S2 | 2,57 s | 77 | Nee, die houd je zelf, | Sleutelgat opent, Buddy schudt nee, sleutel terug, Mailbox op slot (frame 108) |
| | 4,27 s | 128 | en je bank blijft dicht. | Subregel, Bank op slot (frame 157) |
| S3 | 5,97 s | 179 | Je stuurt alleen die ene rekening door, | Grendel schuift in, rekening door de gleuf (frame 218) |
| | 8,20 s | 246 | dus meer ziet hij niet. | Ogen in de gleuf, vier vinkjes (frame 257) |
| S4 | 9,83 s | 295 | Activeer Buddy. | Knop schuift uit de brievenbus; stem eindigt frame 334 |

## Caption (Reels)
```
Moet je Buddy de sleutel van je mailbox geven? Nee hoor, die houd je gewoon zelf 🔑

Buddy werkt met wat jij hem stuurt, meer niet 📮
📩 Stuur die ene rekening door naar je doorstuuradres
👀 Buddy leest bedrag, vervaldatum, betaallink en kenmerk
📅 De vervaldatum staat op tijd in je agenda

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #privacy #rekeningen #geldzaken #budgetteren
```

**Ads Manager:**
- **Primaire tekst:** Buddy krijgt geen sleutel van je mailbox of je bank. Je stuurt alleen die ene rekening door, meer ziet hij niet.
- **Kop:** Geen sleutel nodig.
- **Beschrijving:** Geen app. Geen bankkoppeling.
- **Knop:** Aanmelden

Copycheck: geen treffers in voice-over, caption en Ads Manager (primaire tekst 112 tekens, kop 19).

## Open controles
- Instappagina voor knop en link in bio: "privacy zonder mailboxkoppeling" past precies; waar die live komt staat nog open.
- Bedrag en datum zijn voorbeelden; datum staat op december 2026.
