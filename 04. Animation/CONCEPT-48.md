# BetaalBuddy · Instagram ad, concept 48

## "Blader gerust. Buddy houdt de plek."

**In één zin:** je maand is een agenda vol bladzijdes en die ene met de rekening sla je zo over, tot de aanmaning; stuur hem door en Buddy wordt de bladwijzer die tussen de bladzijdes blijft zitten, zodat het boek vanzelf openvalt op de herinnering in je agenda.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Bladwijzer-Reel`) · 4:5 feed 1080×1350 (`BB-Bladwijzer-Feed`) |
| Lengte | 13,6 s (4 scènes, 30 fps, 408 frames), alles aan te passen in Remotion Studio |
| Doel | Hookrate en 3-sec retention, daarna een klik naar de startpagina |
| Geluid | Werkt zonder geluid. Voice-over en caption staan onderaan |

Gemaakt via de dagelijkse taak (modus "bedenk er een") op 6 november 2026. Nummer 48 volgt de telling in de changelog (concept 47 was de grijpautomaat); in deze branch staan alleen concept 1 tot 3 in de code.

**Waarom dit idee:** een boek en een bladwijzer kwamen in geen van de 47 eerdere concepten voor. Afgevallen in de stille brainstorm: een vuurtoren in de mist (eerder al afgewezen, te dicht op 22) en een bagageband op het vliegveld (te dicht op de lopende band van 9). De bladwijzer zegt in één beeld wat Buddy doet: hij onthoudt de plek, jij hoeft niet te zoeken.

### Hoe dit verschilt van de eerdere concepten
| | Concept 1 | Concept 2 | Concept 3 | Concept 13 (koelkast) | Concept 47 (grijpautomaat) | **Dit concept** |
|---|---|---|---|---|---|---|
| Invalshoek | Overzicht, volle inbox | Timing, "al betaald?" | Privacy | Eigen systeem (post-its) faalt | Rekening glipt tussen al je mail weg | **Overbladeren:** je ziet hem wel, maar slaat de bladzijde over |
| Visueel systeem | UI-gedreven | Typografisch | Focus, wazig tegenover scherp | Objectanimatie (koelkastdeur) | Kermisautomaat | **Objectanimatie: een agenda als boek** met bladzijdes die omslaan (CSS 3D) |
| Rol van Buddy | Slikt de rekening | Rijdt mee op het getal | Slaapmasker | Trekt post-its eraf | Is de grijper | **Is de bladwijzer:** zakt het boek in, alleen zijn ogen steken eruit |
| Einde | Belofte | Uitkomst "Betaald." | Regie | Lege deur | Rekening valt in je agenda | **Rust:** je mag doorbladeren, het boek valt vanzelf open op de juiste plek |
| Slotbeeld (CTA) | Buddy gluurt vanaf de rand | Buddy op de knop | Buddy boven de knop, masker omlaag | n.v.t. | Buddy zakt aan de grijper op de knop | **Dicht boek met Buddy als bladwijzer erin**, hij kijkt omlaag naar de knop |
| Overgangen | Iris, slide | Clock-wipe, slide | Wipe, focus pull | Page-curl | Glans-wipe, prijsluik | **Bladzijde omslaan** (eigen `pageTurn`, CSS 3D) bij elke scènewissel |

Op alle zes punten anders dan concept 1, 2 en 3, en op minstens vijf van de zes anders dan 13 en 47.

---

## Storyboard

### 1 · Hook: "Die ene bladzijde sla je over." (0,0 tot 3,4 s) · licht
- Op frame 0 staan de kop en een open agenda in beeld: *wo 2 dec · Verjaardag Sam*.
- **0,27 s:** de bladzijde slaat om naar *do 3 dec*: een kaart **Rekening · Energieleverancier · €87,60 · vervalt vr 11 dec**, met een geel gloedje.
- **1,00 s:** zonder tweede blik slaat die bladzijde ook om: *za 12 dec · Kerstinkopen*, *do 17 dec · Etentje werk*.
- **1,53 s:** de laatste bladzijde is rood: **Aanmaning · Energieleverancier · €87,60**. Het boek schudt.
- **1,87 s:** chip **"Kan uitlopen op €40"**.
- Cover = frame 66 (2,2 s): kop, rode aanmaning en de chip.

### 2 · "Stuur hem door. Buddy is je bladwijzer." (3,0 tot 6,8 s) · bladzijde omslaan naar blauw
- De hookscène slaat om als een bladzijde; eronder ligt de blauwe scène.
- Een mailkaart *Rekening · Energieleverancier · €87,60* met de knop **Doorsturen →**; tik op **3,60 s**.
- **3,80 s:** de kaart krimpt en schuift het dichte boek *december* in.
- **4,47 s:** Buddy valt er uitgerekt (als een lint) van boven in; **4,87 s:** hij landt en zakt in het boek, alleen zijn ogen steken boven de bladzijdes uit.
- Chips **€87,60** (5,20 s) en **vervalt vr 11 dec** (5,40 s). Subregel op 5,60 s: "Buddy leest bedrag en vervaldatum."

### 3 · "Blader gerust door. Buddy slaat niks over." (6,4 tot 10,4 s) · bladzijde omslaan naar licht
- De agenda ligt weer open, Buddy's kruin steekt in de rug boven het boek uit.
- **6,87 s:** de bladzijdes vliegen voorbij (*do 3 dec · Boodschappen*, *vr 4 dec · Borrel*, *za 5 dec · Pakjesavond*, *ma 7 dec · Werk*).
- **7,80 s:** het boek valt vanzelf open op Buddy's plek: *wo 9 dec*. **8,07 s:** Buddy springt omhoog uit de rug.
- **8,33 s:** op de bladzijde verschijnt de kaart **Herinnering · Energieleverancier · €87,60 · nog 2 dagen**; Buddy kijkt ernaar.
- Subregel op 8,93 s: "Een herinnering in je agenda, op het moment dat jij kiest."

### 4 · CTA (10,0 tot 13,6 s) · bladzijde omslaan naar blauw
- Tagline stapelt woord voor woord vanaf 10,13 s: **"Blader gerust."** in wit, **"Buddy houdt de plek."** in zachtblauw.
- Het dichte boek *december* landt (10,33 s), Buddy komt er als bladwijzer bovenuit (10,67 s).
- Knop **"activeer buddy"** op 11,00 s, "Geen app. Geen bankkoppeling." op 11,33 s, woordmerk op 11,60 s.
- **12,13 s:** Buddy kijkt omlaag naar de knop; tap-ripple op **12,60 s**.

---

<!-- copycheck:off -->
## Copyregels
Volgens `brand-betaalbuddy.md` §3 en de changelog (stand 6 november 2026): geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs of pakketnaam, geen logo's of namen van andere merken. "Energieleverancier" is een generieke afzender.

Onboarding v5.1 (changelog 4 november) wint van het referentiebestand: in pakket Buddy krijg je een **herinnering in je agenda op momenten die jij kiest**; herinneringen per mail horen bij Buddy pro. Deze ad belooft daarom geen "mail op 7 en 2 dagen", alleen een herinnering in je agenda. "Nog 2 dagen" op de herinneringskaart is een voorbeeld van zo'n zelfgekozen moment.

"Kan uitlopen op €40" staat met "kan": het wettelijk minimum aan incassokosten, pas na een veertiendagenbrief.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1.0)

```
Die ene rekening sla je over. <break time="0.9s" /> Stuur hem door. <break time="0.4s" /> Buddy is je bladwijzer. <break time="0.6s" /> Blader gerust. <break time="0.2s" /> Buddy slaat niks over. <break time="0.8s" /> Hij houdt de plek. <break time="0.7s" /> Activeer Buddy.
```

De beeldmomenten kloppen op het frame (`timeline.py` op de scène-timings en de constanten in `src/bladwijzer/scenes/`). De starttijden van de zinnen zijn een schatting (~5 lettergrepen per seconde) en hangen af van de stem.

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Die ene rekening sla je over. | Kop en boek op frame 0; rekening-bladzijde open op 0,27 s, omgeslagen op 1,00 s; aanmaning op 1,53 s, chip "Kan uitlopen op €40" op 1,87 s |
| 3,2 | Stuur hem door. | Bladzijde-overgang 3,00 tot 3,40 s, tik op Doorsturen op 3,60 s, mail het boek in op 3,80 s |
| 4,5 | Buddy is je bladwijzer. | Buddy valt erin op 4,47 s, landt op 4,87 s; chips op 5,20 en 5,40 s |
| 6,8 | Blader gerust. | Overgang 6,40 tot 6,80 s, bladzijden vliegen vanaf 6,87 s |
| 8,1 | Buddy slaat niks over. | Boek valt open op 7,80 s, Buddy springt op 8,07 s, herinnering in je agenda op 8,33 s |
| 10,4 | Hij houdt de plek. | Overgang 10,00 tot 10,40 s, tagline vanaf 10,13 s, Buddy omhoog op 10,67 s |
| 12,2 | Activeer Buddy. | Knop op 11,00 s, Buddy kijkt naar de knop op 12,13 s, tap op 12,60 s, einde 13,60 s |

**Doellengte:** de mp3 duurt ongeveer 13,2 s (25 woorden). Langer dan 13,4 s? Zet de speed op 1,05 of maak de eerste break korter (0,9 naar 0,6 s). Korter? Maak de breaks iets langer. Lukt het niet in één keer, genereer dan per zin en zet de zinnen op de starttijden hierboven.

**Onder de video zetten:** zet de mp3 in `public/` (bijvoorbeeld `vo-bladwijzer.mp3`), vul die naam in bij de prop `music` en zet `musicVolume` op 1.

## Caption (Reels)

```
Die ene rekening tussen al je afspraken door? Die blader je zo voorbij, tot de aanmaning komt. 📖

Buddy is je bladwijzer 💙
📩 Stuur je rekening door naar je eigen doorstuuradres
🔎 Buddy leest het bedrag en de vervaldatum
📅 Jij krijgt een herinnering in je agenda, op het moment dat jij kiest

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #vastelasten #budgetteren
```

**Advertentie (Ads Manager):** primaire tekst "Die ene rekening sla je zo over. Stuur hem door, dan zet Buddy een herinnering in je agenda. Wanneer jij wilt." (110 tekens) · Kop "Blader gerust. Buddy houdt de plek." (35 tekens) · Knop "Aanmelden".

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Concept-48-Bladwijzer**, composities `BB-Bladwijzer-Reel` en `BB-Bladwijzer-Feed`.
- **Blijvend aanpassen:** `src/bladwijzer/schema.ts` (`defaultBladwijzerProps`): de rekening (afzender, bedrag, vervaldatum), alle agendabladzijdes, koppen, kleuren en scènelengtes.
- **Timing van de beats:** de constanten bovenin elk bestand in `src/bladwijzer/scenes/` (`HOOK_T`, `MARK_T`, `FLIP_T`, `CTA_T`). Verander je die, reken de cue-tabel opnieuw uit met `timeline.py`.
- **Nieuw en herbruikbaar:** `src/bladwijzer/components/Book.tsx` (open agenda met omslaande bladzijdes, dicht boek) en de overgang `src/lib/pageTurn.tsx` (alleen CSS).
- **Exporteren:** `npm run render:bladwijzer` (9:16), `npm run render:bladwijzer:feed` (4:5), `npm run still:bladwijzer` (cover, frame 66).

## Open controles
- **Instappagina** voor "activeer buddy" en de link in bio staat nog open. Geen van de zes landingspagina's gaat over dit thema; "aanmaning en incassokosten" past het best.
- **Herinnermomenten:** bevestigen welke momenten je in pakket Buddy kunt kiezen; "nog 2 dagen" is een voorbeeld.
- **Datums** staan op december (vervalt vr 11 dec); na half december omzetten in het schema.
- Voice-over genereren en de lengte controleren.
