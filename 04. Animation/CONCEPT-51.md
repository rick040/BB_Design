# BetaalBuddy · Instagram ad, concept 51

## "Alles draait. Niks valt."

**In één zin:** je houdt al je vaste lasten hoog als draaiende bordjes op stokken (Huur, Zorg, Energie, Telefoon); het bordje Energie wiebelt, valt en komt terug als aanmaning; je stuurt de rekening door, Buddy zet hem als bordje op een stok en geeft hem een zet, en als hij later weer wiebelt, staat er een herinnering in je agenda en duwt Buddy hem weer op gang.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Bordjes-Reel`) · 4:5 feed 1080×1350 (`BB-Bordjes-Feed`) |
| Lengte | 13,4 s (4 scènes, 30 fps, 402 frames), alles aan te passen in Remotion Studio |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de instappagina |
| Geluid | Werkt zonder geluid. Voice-over en caption staan onderaan |

**Waarom deze richting.** Drie richtingen overwogen: bordjes draaien (gekozen), dominostenen (een vergeten rekening laat een rij omvallen; te dicht op 33 "sneeuwbal": klein begin, groot gevolg) en een vuurtoren die de rekening de haven in leidt (te dicht op 39 "navigatie"). Bordjes draaien is de meest letterlijke vorm van mental load (alle vaste lasten tegelijk), komt in geen van de 50 eerdere concepten voor en is zonder geluid in één beeld te snappen.

### Hoe dit verschilt van de eerdere concepten

| | Concept 1 | Concept 2 | Concept 3 | **Dit concept (51)** |
|---|---|---|---|---|
| Invalshoek | Overzicht: volle inbox | Timing: heb ik al betaald? | Privacy | **Alles tegelijk hooghouden:** al je vaste lasten draaien, één valt |
| Visueel systeem | UI-gedreven (inbox, chips, meldingen) | Typografisch (reuzengetal) | Focus, wazig tegenover scherp | **Objectanimatie, circusact:** draaiende bordjes op stokken, met een streep die over de rand loopt |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het aftellen | Slaapmasker op en af | **Geeft het bordje een zet** tegen de stok, en duwt het weer op gang als het wiebelt |
| Einde | Belofte | Uitkomst "Betaald." | Regie | **Evenwicht:** "Alles draait. Niks valt." |
| Slotbeeld (CTA) | Buddy gluurt vanaf de rand | Buddy op de knop | Buddy boven de knop, masker omlaag | **Buddy naast drie draaiende bordjes**, hopt tegen de laatste stok, ogen blij dicht |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | **Omkiepen** (scène valt van zijn hoek, `tipOver`) en **draaien** (scène kantelt op zijn rand, `plateSpin`), beide eigen CSS |

Dichtstbij uit 4 tot 50: 7 "Later is ook een datum" (wiebeltoren van dozen die omvalt, achteraf betalen), 12 "Laat je hoofd maar leeg" (mental load) en 40 "Buddy denkt eraan. Niks verdort." (op tijd onderhoud). Ten opzichte van 7 anders op invalshoek, visueel systeem, rol van Buddy, einde en slotbeeld (alleen "iets valt om" lijkt); ten opzichte van 12 anders op visueel systeem, Buddy, einde, slotbeeld en overgangen; ten opzichte van 40 anders op invalshoek, visueel systeem, einde, slotbeeld en overgangen.

---

## Storyboard

### 1 · Hook: "Alle bordjes hooghouden? Er valt er altijd één." (0,0 tot 3,4 s) · licht
- Frame 0: de hele kop staat er (alleen "één." komt nog scherp), met vier draaiende bordjes op stokken: Huur, Zorg, Energie, Telefoon.
- **0,20 s:** het bordje Energie gaat wiebelen, steeds harder.
- **1,27 s:** het valt van zijn stok, **1,67 s** breekt het op de vloer (scherven, beeld schudt).
- **1,80 s:** uit de scherven komt een kaart **Aanmaning · Energieleverancier · €87,60**; **2,13 s** chip **Kan uitlopen op €40**.
- Cover = frame 72 (2,4 s): kop, lege stok, aanmaning en chip.

### 2 · "Stuur hem door naar Buddy." (3,0 tot 6,6 s) · omkiepen naar blauw
- De lichte scène kiept om van zijn rechterhoek en valt weg; eronder staat al de blauwe scène.
- Mail **Energieleverancier · Je factuur van december** met knop **Doorsturen**; tik op **3,73 s**.
- **4,00 s:** de mail krimpt en wordt het bordje Energie; er schiet een stok omhoog, het bordje landt erop (4,47 s) en wiebelt na.
- **4,67 s:** Buddy hopt tegen de stok: het bordje draait. Chips **€87,60** (5,00 s) en **vervalt do 17 dec** (5,23 s).
- Subregel op 5,47 s: "Buddy leest het bedrag en de vervaldatum."

### 3 · "Wiebelt hij? Dan staat het in je agenda." (6,2 tot 10,2 s) · draaien naar licht
- De blauwe scène draait weg op zijn rand, de lichte draait open: weer vier bordjes, Buddy (blauw) staat naast de stok van Energie.
- **6,53 s:** Energie gaat weer wiebelen.
- **7,20 s:** agenda-item ploept op: **MA 14 · Herinnering · Energie €87,60 · Vervalt do 17 dec**, met een belletje.
- **7,73 s:** Buddy hopt tegen de stok, het bordje draait weer rustig (8,13 s), Buddy knijpt blij zijn ogen dicht.
- Subregel op 8,27 s: "Jij kiest wanneer je een herinnering krijgt."

### 4 · CTA (9,8 tot 13,4 s) · omkiepen naar blauw
- Tagline stapelt woord voor woord: **"Alles draait."** in wit, **"Niks valt."** in zachtblauw.
- Drie kleine draaiende bordjes ploppen op (vanaf 10,13 s), Buddy erbij; knop **activeer buddy** op 10,53 s.
- "Geen app. Geen bankkoppeling." (10,93 s) en het woordmerk (11,27 s).
- **11,73 s:** Buddy hopt tegen de laatste stok; tap-ripple op de knop op 12,33 s.

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3 en de changelog (onboarding v5.1, 4 november 2026): geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs of pakketnaam, geen logo's of namen van andere merken (afzender is de generieke "Energieleverancier").

Productclaims in deze ad en waar ze op rusten:
- "Stuur hem door naar Buddy": het product werkt met doorsturen naar je eigen doorstuuradres.
- "Buddy leest het bedrag en de vervaldatum": dat haalt Buddy uit de doorgestuurde mail.
- "Dan staat het in je agenda", "Jij kiest wanneer je een herinnering krijgt": onboarding v5.1, pakket Buddy = herinnering in je agenda op zelfgekozen momenten. Bewust geen "mail op 7 en 2 dagen" (dat is alleen Buddy pro) en geen betaallink.
- "Kan uitlopen op €40": wettelijk minimum incassokosten na een veertiendagenbrief, daarom met "kan".
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1.0)

```
Alle bordjes hooghouden? Er valt er altijd één. <break time="0.2s" /> Stuur hem door naar Buddy. <break time="0.2s" /> Hij leest de vervaldatum. <break time="0.2s" /> Wiebelt hij? Dan staat het in je agenda. <break time="0.6s" /> Alles draait. Niks valt. <break time="0.5s" /> Activeer Buddy.
```

De beeldmomenten kloppen op het frame (`timeline.py` op de scène-timings en de constanten in `src/bordjes/scenes/`). De starttijden van de zinnen zijn een schatting (~5 lettergrepen per seconde) en hangen af van de stem.

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Alle bordjes hooghouden? | Kop en vier draaiende bordjes op frame 0; Energie gaat wiebelen vanaf 0,20 s |
| 1,7 | Er valt er altijd één. | Bordje valt op 1,27 s, breekt op 1,67 s, Aanmaning op 1,80 s, chip "Kan uitlopen op €40" op 2,13 s |
| 3,4 | Stuur hem door naar Buddy. | Omkiep-overgang 3,00 tot 3,40 s, tik op Doorsturen op 3,73 s, mail wordt een bordje op 4,00 s |
| 5,1 | Hij leest de vervaldatum. | Buddy geeft het bordje een zet op 4,67 s, chips op 5,00 en 5,23 s, subregel op 5,47 s |
| 7,0 | Wiebelt hij? Dan staat het in je agenda. | Draai-overgang 6,20 tot 6,60 s, herinnering in je agenda op 7,20 s, Buddy duwt op 7,73 s, subregel "Jij kiest wanneer…" op 8,27 s |
| 10,1 | Alles draait. Niks valt. | Omkiep-overgang 9,80 tot 10,20 s, tagline 9,93 tot 10,30 s, knop op 10,53 s |
| 11,9 | Activeer Buddy. | Buddy tikt het laatste bordje aan op 11,73 s, tap op de knop op 12,33 s, einde op 13,40 s |

**Doellengte:** de mp3 duurt ongeveer 12,9 s (31 woorden). Langer dan 13,1 s? Zet de speed op 1,05 of maak de break voor "Alles draait" korter (0,6 naar 0,4 s). Korter? Maak de breaks iets langer. Lukt het niet in één keer, genereer dan per zin en zet de zinnen op de starttijden hierboven.

**Onder de video zetten:** mp3 in `public/` (bijvoorbeeld `vo-bordjes.mp3`), naam invullen bij de prop `music`, `musicVolume` op 1.

## Caption (Reels)

```
Huur, zorg, energie, telefoon. Je houdt alle bordjes hoog, tot er eentje valt en de aanmaning binnenkomt. 🍽️

Buddy houdt ze voor je in de gaten 💙
📩 Stuur je rekening door naar je eigen doorstuuradres
🔎 Buddy leest het bedrag en de vervaldatum
📅 Je krijgt een herinnering in je agenda, op het moment dat jij kiest

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #vastelasten #rekeningen #geldzaken #opjezelfwonen
```

**Advertentie (Ads Manager):** primaire tekst "Alle bordjes hooghouden? Stuur je rekening door naar Buddy. Dan staat hij in je agenda, op het moment dat jij kiest." (116 tekens) · Kop "Alles draait. Niks valt." (24 tekens) · Knop "Aanmelden".

## Open controles
- Welke herinnermomenten je in pakket Buddy kunt kiezen, is nog niet bevestigd. "MA 14" (drie dagen voor do 17 dec) is een voorbeeld.
- Datums staan op december (vervalt do 17 dec); na half december omzetten in `src/bordjes/schema.ts`.
- Instappagina voor de knop en de link in bio staat nog open; "aanmaning en incassokosten" of "net op jezelf wonen" past het best. Die pagina's noemden volgens de changelog nog prijzen en "30 dagen geld terug".
- Voice-over genereren en de lengte controleren.

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-51-Bordjes**, composities `BB-Bordjes-Reel` en `BB-Bordjes-Feed`.
- **Blijvend aanpassen:** `src/bordjes/schema.ts` (`defaultBordjesProps`): de vier bordjes en welk bordje valt (`fallingIndex`), alle teksten, de rekening, het agenda-item, kleuren en scènelengtes.
- **Timing van de beats:** de constanten bovenin elk bestand in `src/bordjes/scenes/` (`HOOK_T`, `FWD_T`, `REMIND_T`, `CTA_T`). Verander je die, reken de cue-tabel opnieuw uit met `timeline.py`.
- **Exporteren:** `npm run render:bordjes` (9:16), `npm run render:bordjes:feed` (4:5), `npm run still:bordjes` (cover, frame 72).
