# BetaalBuddy · Instagram ad, concept 42

## "Tante Ria op tijd. Je rekening ook."

**In één zin:** de verjaardag van tante Ria vergeet je nooit, want de verjaardagskalender hangt op de wc; je energierekening op dezelfde dag vergeet je wel. Buddy, met feestmuts en toeter, zet je rekening waar jij elke dag kijkt: in je agenda, met een mail vooraf.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Verjaardag-Reel`) · 4:5 feed 1080×1350 (`BB-Verjaardag-Feed`) |
| Lengte | 13,6 s (4 scènes, 30 fps, 408 frames), alles aan te passen in Remotion Studio |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. Voice-over en caption staan onderaan |

**Waarom deze richting.** Drie richtingen overwogen: (1) de verjaardagskalender op de wc, (2) een ijsberg (je ziet alleen het bedrag, onder water zit de aanmaning), (3) stoelendans (de rekening zonder stoel wordt een aanmaning). Gekozen voor (1): het is een typisch Nederlands, direct herkenbaar beeld, en het brengt een invalshoek die nog in geen concept zat: niet "je vergeet", maar "wat je wél onthoudt, hangt op een plek waar je elke dag kijkt". De ijsberg viel af omdat de kosten-invalshoek al in 33 (sneeuwbal) en 41 zit; stoelendans was zonder geluid lastig te volgen.

### Hoe dit verschilt van de eerdere concepten
Concept 1 tot 3 staan in deze branch; 4 tot 41 staan op losse branches en in de changelog. De nauwste buren uit die reeks staan erbij.

| | Concept 1 | Concept 2 | Concept 3 | 13 · koelkastdeur | 37 · naambordje | **Dit concept** |
|---|---|---|---|---|---|---|
| Invalshoek | Overzicht: volle inbox | Timing: heb ik betaald? | Privacy | Eigen systeem (post-its) faalt | Net op jezelf | **Geheugen en plek: wat je elke dag ziet, vergeet je niet (tegenstelling verjaardag tegenover rekening)** |
| Visueel systeem | UI-gedreven | Typografisch (reuzengetal) | Focus, wazig tegenover scherp | Objectanimatie (post-its) | Objectanimatie (naambordje) | **Objectanimatie: verjaardagskalender op de wc-deur, daarna agenda-dagweergave** |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het getal | Slaapmasker | Trekt post-its eraf | Schrijft datums | **Feestmuts op, blaast op een toeter bij elk seintje** |
| Einde | Belofte | Uitkomst "Betaald." | Regie | Lege deur | Belofte | **Punchline: "Tante Ria op tijd. Je rekening ook."** |
| Slotbeeld (CTA) | Buddy gluurt vanaf de rand | Buddy op de knop | Buddy boven de knop, masker omlaag | n.v.t. | n.v.t. | **Buddy links van de knop; zijn toeter rolt uit tot in de pijlcirkel, dat is de tap, met confetti** |
| Overgangen | Iris, slide | Klok-wipe, slide | Wipe, focus pull | Page-curl | n.v.t. | **Deur zwaait open (eigen CSS-3D) en confetti-wipe (eigen, diagonaal)** |

Op alle zes punten anders dan concept 1, 2 en 3. Ten opzichte van 13 (ook een deur met papier) verschillen invalshoek, Buddy, einde, slotbeeld en overgang.

---

## Storyboard

### 1 · Hook: "Verjaardagen vergeet je nooit." (0,0 tot 3,4 s) · licht
- Frame 0: de kop staat er al, met een verjaardagskalender ("Verjaardagen · December") aan een spijker: 16 Opa Kees, 18 Tante Ria met taartje, 20 Sanne.
- **0,67 s:** een rekening schuift erbij: Energieleverancier · Je factuur van december · €87,60 · *Vervalt 18 dec*.
- **0,93 s:** de tweede kopregel in rood: **"Je rekeningen wel."**
- **1,33 s:** een gele markeerring om de 18 op de kalender én om "Vervalt 18 dec": dezelfde dag.
- **2,13 s:** de chip springt rood naar **Aanmaning**, de kaart schudt.
- Cover = frame 84 (2,8 s): kop, ring en Aanmaning.

### 2 · "Logisch. Die hangt op de wc." (3,0 tot 6,0 s) · deur zwaait open naar blauw
- De hookscène zwaait open als een deur. Daarachter: een wc-deur met het bordje WC en dezelfde kalender eraan.
- **3,40 s:** Buddy hupt erin, met feestmuts.
- **4,33 s:** hij blaast op zijn toeter ("toet!") naar de kalender, confetti (4,50 s).
- Subregel 4,33 s: "Wat je elke dag ziet, vergeet je niet."

### 3 · "Stuur hem door. Buddy zet hem erbij." (5,6 tot 10,2 s) · confetti-wipe naar licht
- Een agenda-dagweergave *do 18 dec* met al één item: *Tante Ria jarig · hele dag*.
- **6,07 s:** tik op **Doorsturen →** op de rekening; die vliegt de agenda in.
- **6,87 s:** *Energie · €87,60 · vervaldatum* landt naast Tante Ria. Buddy toetert.
- **7,73 s:** mail *Nog 7 dagen · Energie €87,60* (11 dec), toet. **8,53 s:** *Nog 2 dagen · betaal op tijd* (16 dec), toet.
- Subregel 8,87 s: "In je agenda. Plus een mail 7 en 2 dagen vooraf."

### 4 · CTA (9,8 tot 13,6 s) · confetti-wipe naar blauw
- Tagline woord voor woord (9,93 s): **"Tante Ria op tijd."** in wit, **"Je rekening ook."** in zachtblauw.
- Knop **activeer buddy** (10,53 s), rechts van het midden. Buddy staat links, met feestmuts.
- **11,73 s:** zijn toeter rolt uit tot in de pijlcirkel; **11,90 s:** tap-ripple en confetti.
- "Geen app. Geen bankkoppeling." (10,93 s) en het woordmerk (11,27 s).

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3 en de changelog (stand 2 november 2026): geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs (Basic heeft geen herinneringen en geen agenda), geen merknamen. Afzender is generiek (Energieleverancier). De namen op de kalender zijn verzonnen.

Productclaims en waar ze op rusten:
- "Stuur hem door": doorsturen naar je eigen doorstuuradres, geen mailboxkoppeling.
- "Buddy zet hem erbij", "In je agenda": de vervaldatum komt via de agendalink (ICS) in je agenda.
- "Plus een mail 7 en 2 dagen vooraf": herinneringsmails op T-7 en T-2.
- Bewust niet genoemd: betaallink (nog niet bevestigd), €40 incassokosten, wat Buddy precies uitleest.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1,1)

```
Verjaardagen vergeet je nooit. <break time="0.1s" /> Rekeningen wel. <break time="0.2s" /> Logisch. Die hangt op de wc. <break time="0.9s" /> Stuur je rekening door. <break time="0.1s" /> Buddy zet hem erbij. Plus een mail. <break time="0.7s" /> Tante Ria op tijd. Je rekening ook. Activeer Buddy.
```

De beeldmomenten kloppen op het frame (`timeline.py` op de scène-timings en de constanten in `src/verjaardag/scenes/`). De starttijden van de zinnen zijn een schatting (5,5 lettergrepen per seconde, past bij Speed 1,1) en hangen af van de stem.

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Verjaardagen vergeet je nooit. | Kop en verjaardagskalender op frame 0 |
| 1,9 | Rekeningen wel. | "Je rekeningen wel." 0,93 s; ring om de 18e 1,33 s; Aanmaning 2,13 s |
| 3,3 | Logisch. Die hangt op de wc. | Deur zwaait open 3,00 tot 3,40 s; kop 3,27 s; Buddy 3,40 s; toet 4,33 s |
| 5,8 | Stuur je rekening door. | Confetti-wipe 5,60 tot 6,00 s; tik op Doorsturen 6,07 s |
| 7,3 | Buddy zet hem erbij. | Rekening landt naast Tante Ria op 6,87 s |
| 8,7 | Plus een mail. | Mail "Nog 7 dagen" 7,73 s, "Nog 2 dagen" 8,53 s; subregel 8,87 s |
| 10,2 | Tante Ria op tijd. Je rekening ook. | Confetti-wipe 9,80 tot 10,20 s; tagline vanaf 9,93 s; knop 10,53 s |
| 12,3 | Activeer Buddy. | Toeter raakt de knop 11,73 s; tap 11,90 s; einde 13,60 s |

**Doellengte:** de mp3 duurt ongeveer 13,2 s (32 woorden). Langer dan 13,4 s? Maak de break na "op de wc" korter (0,9 naar 0,6 s). Op Speed 1,0 komen de laatste zinnen tot ~0,4 s te laat en loopt de mp3 tegen het einde aan.

## Caption (Reels)

```
De verjaardag van tante Ria vergeet je nooit. De vervaldatum van je energierekening wel? 🎂 Logisch: alleen die eerste hangt op de wc.

Buddy zet je rekeningen waar jij elke dag kijkt 🎉
📩 Stuur je rekening door naar je eigen doorstuuradres
📅 Buddy zet de vervaldatum in je agenda
⏰ 7 en 2 dagen van tevoren krijg je een seintje in je mail

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #vastelasten #rekeningen #geldzaken #opjezelfwonen
```

**Advertentie (Ads Manager):** primaire tekst "Verjaardagen vergeet je nooit: die hangen op de wc. Stuur je rekening door en Buddy zet hem in je agenda." (105 tekens) · Kop "Tante Ria op tijd. Je rekening ook." (35 tekens) · Knop "Aanmelden".

## Open controles
- Instappagina voor de knop en "link in bio" staat nog open. "Net op jezelf wonen" past het best (eigen vaste lasten naast de verjaardagen); "aanmaning en incassokosten" kan ook.
- Datums staan op december (vervalt 18 dec, mails 11 en 16 dec); begin december omzetten, of in Studio aanpassen.
- De mails verschijnen als meldingen op de telefoon, net als in concept 1; het zijn herinneringsmails, geen pushberichten van een app.

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-42-Verjaardag**, composities `BB-Verjaardag-Reel` en `BB-Verjaardag-Feed`.
- **Blijvend aanpassen:** `src/verjaardag/schema.ts` (`defaultVerjaardagProps`): kalender (maand, namen, matchdag), rekening, alle koppen, agenda-items, mails, toeter-tekst, kleuren en scènelengtes.
- **Timing van de beats:** de constanten bovenin elk bestand in `src/verjaardag/scenes/` (`HOOK_T`, `INSIGHT_T`, `AGENDA_T`, `CTA_T`). Verander je die, reken de cue-tabel opnieuw uit met `timeline.py`.
- **Nieuw en herbruikbaar:** `src/lib/doorSwing.tsx` (deur zwaait open) en `src/lib/confettiWipe.tsx` (diagonale wipe met confetti), beide alleen CSS. `PartyBuddy` (feestmuts en toeter) staat in `src/verjaardag/components/`.
- **Exporteren:** `npm run render:verjaardag` (9:16), `npm run render:verjaardag:feed` (4:5), `npm run still:verjaardag` (cover, frame 84).
