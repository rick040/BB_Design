# BetaalBuddy · hero-VSL voor de homepage

## "Stuur door. Buddy seint. Jij betaalt op tijd."

**In één zin:** een korte video die in de hero van betaalbuddy.nl automatisch (zonder geluid) in een lus speelt. In de eerste 5 seconden zie je het hele verhaal: je stuurt je rekening door, Buddy seint je op tijd, jij betaalt op tijd zonder aanmaning of extra kosten. Daarna legt hij de drie stappen uit en sluit af met de belofte en de knop.

| | |
|---|---|
| Formaat | 16:9 desktop 1920×1080 (`BB-HeroVSL-Desktop`) · 4:5 mobiel 1080×1350 (`BB-HeroVSL-Mobile`) |
| Lengte | 17,6 s (5 scènes, 30 fps, 528 frames), naadloze lus |
| Doel | Bezoekers snappen binnen 5 seconden wat BetaalBuddy is, hoe het werkt en wat het ze oplevert, en klikken op aanmelden |
| Geluid | Geen. Autoplay mag in browsers alleen zonder geluid, dus alles staat in beeld |
| Webbestanden | `renders/hero-vsl/web/`: mp4 desktop 1,25 MB, mp4 mobiel 1,05 MB, posters en samenvattingen als webp en jpg |
| Embed | `renders/hero-vsl/embed-snippet.html` (plakken in een Oxygen Code Block) · testpagina `renders/hero-vsl/preview.html` |

### Waarom zo
- **De eerste 5 seconden zijn de hele pitch.** Drie genummerde regels die onder elkaar blijven staan: *Stuur je rekening door.* · *Buddy seint je op tijd.* · *Jij betaalt op tijd.* Rechts speelt elke regel zich af met dezelfde rekening. Wie na 5 seconden wegkijkt, heeft het product gezien: actie, mechaniek en winst.
- **Het eindbeeld van de pitch is een complete samenvatting.** Dat frame (5,0 s, frame 150) is ook het stilstaande beeld voor bezoekers die "verminderde beweging" aan hebben staan.
- **Daarna de details, als carrousel.** Een vaste stappenbalk (1 Stuur door · 2 Buddy onthoudt · 3 Seintje op tijd) blijft staan terwijl de scènes van rechts inschuiven. Dat geeft houvast en herhaalt de pitch met meer bewijs: doorstuuradres en filterregel, welke gegevens Buddy eruit haalt, 7 en 2 dagen vooraf plus de agenda.
- **Vertrouwen zonder kleine lettertjes:** "Je mailbox ziet hij nooit." en "Geen app. Geen bankkoppeling."
- **Licht begin, blauwe uitleg.** De pitch is licht, zodat de video als een kaart in de blauwe hero ligt. De uitleg is blauw ("Buddy aan het werk"), volgens het ritme uit de huisstijl.
- **Naadloze lus.** In de laatste 0,4 s schuift frame 0 van rechts in beeld, net als de andere stappen. Het laatste frame wijkt minder dan 1% af van het eerste, dus de lus is niet te zien.

---

## Storyboard (gemeten tijden)

### 1 · Pitch (0,0 tot 5,6 s) · licht
- **0,0 s:** "Zo werkt BetaalBuddy", regel **1 Stuur je rekening door.**, de mail *Energieleverancier · Je factuur van november · €86,40 · Vervalt 27 nov* met de knop **Doorsturen**, en Buddy (blauw) die naar de mail kijkt. Dit is ook de poster.
- **0,40 s:** een vinger tikt op Doorsturen. **0,53 tot 1,20 s:** de mail vliegt in een boog naar Buddy, die hem vangt (squash).
- **1,53 s:** regel **2 Buddy seint je op tijd.**, regel 1 krijgt een vinkje. Buddy zendt (signaalboogjes): **1,80 s** *Nog 7 dagen · €86,40* (20 nov), **2,40 s** *Nog 2 dagen · betaal op tijd* (25 nov) bovenop.
- **3,33 s:** regel **3 Jij betaalt op tijd.** De seintjes schuiven weg, de kaart **Betaald · €86,40** ploft erin (3,47 s) en het vinkje tekent zich (3,67 s). Buddy springt van blijdschap en kijkt tevreden.
- **3,93 en 4,13 s:** de chips *Aanmaning* en *Extra kosten* verschijnen en worden rood doorgestreept (4,27 tot 4,73 s).
- 4,7 tot 5,2 s: rust om te lezen. Samenvattingsframe op 5,0 s.

### 2 · Stuur door (5,2 tot 8,6 s) · slide naar blauw
- Stappenbalk verschijnt, stap 1 actief. Titel **"Stuur je rekening door naar je eigen Buddy-adres."**, onder: "Met de hand, of automatisch met één filterregel in je mail."
- Doorstuurvenster: het adres *jouwnaam@in.betaalbuddy.nl* typt zichzelf (5,6 tot 6,3 s), onderwerp *Fwd: Je factuur van november*, de geciteerde rekening.
- **6,73 s:** tik op **Verstuur**; een envelop vliegt naar Buddy (wit), die hem vangt (7,33 s).
- **7,4 s:** kaart *Automatisch doorsturen · Voor je vaste afzenders*; de schakelaar gaat aan op 7,8 s.

### 3 · Buddy onthoudt (8,2 tot 11,4 s) · slide
- Stap 2 actief. Titel **"Buddy haalt eruit wat telt."**, onder: "Alleen uit wat jij doorstuurt. Je mailbox ziet hij nooit."
- De doorgestuurde mail; vier regels krijgen een markering (8,6 · 8,9 · 9,2 · 9,5 s): Te betalen €86,40 · Vervaldatum 27 november · Kenmerk · Betaallink. Per regel ploft een chip met vinkje eronder. Buddy knikt op 10,0 s.

### 4 · Seintje op tijd (11,0 tot 14,6 s) · slide
- Stap 3 actief. Titel **"Jij krijgt op tijd een seintje."**, onder: "7 en 2 dagen vooraf in je mail. De vervaldatum staat in je agenda."
- Agenda van twee weken (16 tot 29 november). Op 11,33 s valt het agenda-item *Energie €86,40* op vrijdag 27.
- **11,73 s:** de 20e licht op (−7) en het seintje *Nog 7 dagen* komt binnen (11,9 s). **12,47 s:** de 25e (−2) met *Nog 2 dagen · betaal op tijd* (12,63 s). Buddy zendt bij elk seintje.

### 5 · Belofte en knop (14,2 tot 17,6 s) · slide
- **"Nooit meer een / rekening vergeten."** (wit en zachtblauw, 14,4 s), "Geen app. Geen bankkoppeling." (15,2 s).
- Buddy hupt naast de knop **activeer buddy** (15,0 s) en kijkt ernaar (15,67 s), zodat het oog naar de knop gaat. Tik-ripple op 16,4 s. Woordmerk op 15,47 s.
- **17,2 tot 17,6 s:** frame 0 schuift van rechts in beeld; de lus begint opnieuw.

---

<!-- copycheck:off -->
## Copyregels en claims
Volgens `brand-betaalbuddy.md` §3 en de changelog (stand 31 oktober 2026): geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs, geen logo's of namen van andere merken (generieke afzender "Energieleverancier"), geen gebruikersaantallen. `check_copy.py` op schema en embed: geen treffers.

Waar de claims op rusten:
- Doorsturen naar je eigen adres op in.betaalbuddy.nl, met de hand of met een filterregel: docs-site en FAQ op de homepage.
- Bedrag, vervaldatum, kenmerk en betaallink: wat Buddy uit de doorgestuurde mail haalt.
- 7 en 2 dagen vooraf per mail, vervaldatum in je agenda: pakket Buddy en Buddy pro (Basic heeft geen seintjes en geen agenda, daarom geen prijs of pakketnaam in de video).
- "Je mailbox ziet hij nooit": er is geen mailboxkoppeling.
- "Jij betaalt op tijd": Buddy herinnert, jij betaalt. Buddy betaalt nergens zelf.
<!-- copycheck:on -->

## Op de site zetten
1. Upload de zes bestanden uit `renders/hero-vsl/web/` naar de WordPress-mediabibliotheek: `betaalbuddy-hero-desktop.mp4`, `betaalbuddy-hero-mobile.mp4`, en per formaat een `-poster.webp` en een `-summary.webp`. De jpg's zijn reserve.
2. Open de homepage in Oxygen en zet een **Code Block** op de plek van de drie zwevende kaartjes (tussen de kop "Rekeningen vergeten is geen personality trait meer." en de regel eronder).
3. Plak de inhoud van `embed-snippet.html` erin en vervang de zes URL's door die uit de mediabibliotheek.
4. Controleer op telefoon en desktop, en meet PageSpeed mobiel opnieuw.

Wat de snippet doet:
- `muted`, `loop`, `playsinline`: autoplay werkt in Chrome, Safari (ook iOS) en Firefox.
- Laadt alleen het formaat dat past: onder 768 px de 4:5-versie, anders 16:9.
- `preload="none"` met een poster van ~34 KB: de video telt niet mee voor de eerste paint. Pas als de video in beeld is, laadt hij (~1 MB) en speelt hij. Uit beeld pauzeert hij.
- Bij "verminderde beweging" laadt er geen video en staat de samenvatting met alle drie de stappen.
- Een verborgen tekst beschrijft de video voor schermlezers.
- De hele video linkt naar `/start-met-betaalbuddy/`. Haal de `<a>` weg als je dat niet wilt.

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Hero-VSL-Homepage**. Alle teksten, de voorbeeldrekening, de agenda (maand, eerste dag, vervaldag), kleuren en timings zijn props. Blijvend aanpassen doe je in `src/herovsl/schema.ts` (`defaultHeroVslProps`); beide formaten delen die.
- **Renderen:** `npm run render:herovsl` (16:9) en `npm run render:herovsl:mobile` (4:5), naar `out/`.
- **Webversies maken** (vanuit `04. Animation`):
  ```bash
  ffmpeg -i out/BB-HeroVSL-Desktop.mp4 -an -c:v libx264 -preset slow -crf 25 -profile:v high -level 4.0 \
    -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart \
    renders/hero-vsl/web/betaalbuddy-hero-desktop.mp4
  ```
  Hetzelfde voor `Mobile`. Posters: `npx remotion still BB-HeroVSL-Desktop out/poster.png --frame=0` en `--frame=150` voor de samenvatting.
- **Code:** `src/herovsl/` (schema, `HeroVsl.tsx`, `layout.tsx`, `scenes/`, `components/ui.tsx`). Gedeelde componenten zijn niet aangepast.

<!-- copycheck:off -->
## Open controles
- **Hero-tekst onder de video** zegt nog "7 dagen gratis ✦ Geen bankkoppeling ✦ Geen AI", en lager op de pagina staan "Stel gratis je buddy in", WhatsApp en "Labelt al je emails". Dat botst met het betaalmodel van 5 oktober en met deze video. Gelijktrekken voordat de video live gaat.
- **Doorstuuradres** `jouwnaam@in.betaalbuddy.nl` is een voorbeeld. Klopt de vorm van de echte adressen, of moet het anders (prop `send.address`)?
- **Seintjes en agenda** horen bij Buddy en Buddy pro, niet bij Basic. Op de homepage is dat verdedigbaar (Buddy is de "Aanrader"), maar houd het consistent met de prijzensectie.
- **Datums** staan op november. Na de winter eventueel omzetten (props `bill`, `pitch.remind7/2`, `remind`).
- **Linkdoel** van de video: `/start-met-betaalbuddy/` (de onboarding). Aanpassen in de snippet als de CTA ergens anders heen moet.
- **Remotion-licentie:** gratis voor bedrijven tot 3 medewerkers; daarboven een company license.
<!-- copycheck:on -->
