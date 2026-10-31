# BetaalBuddy · hero-VSL voor de homepage

## "Stuur door. Buddy seint. Jij betaalt op tijd."

**In één zin:** een korte, rustige video die in de hero van betaalbuddy.nl automatisch (zonder geluid) in een lus speelt. In drie stappen zie je wat BetaalBuddy is en wat het je oplevert (stuur je rekening door, Buddy seint je op tijd, jij betaalt op tijd); daarna drie USP's en de belofte met de knop.

| | |
|---|---|
| Formaat | 16:9 desktop 1920×1080 (`BB-HeroVSL-Desktop`) · 4:5 mobiel 1080×1350 (`BB-HeroVSL-Mobile`) |
| Lengte | 10,6 s (30 fps, 318 frames), naadloze lus |
| Doel | Bezoekers snappen binnen 5 seconden wat BetaalBuddy is, hoe het werkt en wat het ze oplevert, en klikken op aanmelden |
| Geluid | Geen. Autoplay mag in browsers alleen zonder geluid, dus alles staat in beeld |
| Webbestanden | `renders/hero-vsl/web/`: mp4 desktop 0,65 MB, mp4 mobiel 0,55 MB, posters en slotbeelden als webp en jpg |
| Embed | `renders/hero-vsl/embed-snippet.html` (plakken in een Oxygen Code Block) · testpagina `renders/hero-vsl/preview.html` |

### Versies
- **Versie 3 (huidige):** de stappen gaan sneller (winst staat er op 3,7 s in plaats van 5 s) en er is één rustige scène met drie USP's bij gekomen: *Werkt met elk mailprogramma*, *We bewaren je mail niet*, *Geen AI die je mail leest*.
- **Versie 2:** rustiger gemaakt. Versie 1 was te druk, met veel tekst en elementen tegelijk, en zo snel dat je niet wist waar je moest kijken. Sindsdien staat alles in één gecentreerde kolom: bovenaan één regel, in het midden één object, Buddy eronder. Hele regels faden in en de oude regel is weg voordat de nieuwe komt.
- **Versie 1** (17,6 s, met uitlegscènes voor doorsturen, uitlezen en agenda) staat nog in git, commit `389b52f`.

---

## Storyboard (gemeten tijden)

### 1 tot 3 · De stappen (0,0 tot 5,6 s) · licht, één doorlopend shot
Buddy (blauw) staat de hele tijd onderin het midden. Bovenaan steeds één regel met een genummerde badge.
- **1 · "Stuur je rekening door."** Op frame 0 staan de regel, de rekening (*Energieleverancier · Vervalt 27 nov · €86,40* met een grote knop **Doorsturen**) en Buddy. Dit is ook de poster. Op 0,40 s wordt de knop ingedrukt; van 0,53 tot 1,13 s glijdt de rekening in Buddy.
- **2 · "Buddy seint je op tijd."** De regel wisselt (2,0 tot 2,33 s). Op 2,07 s stijgt één seintje uit Buddy op: *BetaalBuddy · Nog 2 dagen · €86,40* (25 nov).
- **3 · "Jij betaalt op tijd."** Op 3,7 s komt de kaart **Betaald · Op tijd, zonder extra kosten**; het vinkje tekent zich (3,9 tot 4,3 s). Buddy hupt één keer en kijkt tevreden.

### 4 · USP's (5,2 tot 8,0 s) · slide naar blauw
- Drie regels met een wit icoon, één voor één (5,4 · 5,7 · 6,0 s), daarna 1,6 s om te lezen:
  - ✉ **Werkt met elk mailprogramma**
  - 🔒 **We bewaren je mail niet**
  - ✦ doorgestreept **Geen AI die je mail leest**

### 5 · Belofte en knop (7,6 tot 10,6 s) · zachte fade, blauw
- **"Nooit meer een / rekening vergeten."** regel voor regel (vanaf 7,8 s).
- Buddy (wit) naast de knop **activeer buddy** (8,2 s); hij kijkt naar de knop (8,8 s). Woordmerk op 8,5 s.
- **10,2 tot 10,6 s:** frame 0 schuift van rechts in beeld; de lus begint opnieuw.

---

<!-- copycheck:off -->
## Copyregels en claims
Volgens `brand-betaalbuddy.md` §3 en de changelog (stand 31 oktober 2026): geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs, geen logo's of namen van andere merken (generieke afzender "Energieleverancier"), geen gebruikersaantallen. `check_copy.py` op schema en embed: geen treffers.

Waar de claims op rusten:
- **"Werkt met elk mailprogramma"**: FAQ op de homepage: "Betaalbuddy werkt met elk mailprogramma dat kan doorsturen."
- **"We bewaren je mail niet"**: homepage-sectie privacy: "Precies één mail. En die bewaren we niet." De tekst, het onderwerp en de bijlage worden niet weggeschreven. Let op: bedrag, datum, naam en rekeningnummer blijven wel bewaard tot 14 dagen na de vervaldatum. Zeg daarom nooit "we slaan niets op" of "Buddy bewaart niets"; dat is niet waar.
- **"Geen AI die je mail leest"**: FAQ op de homepage: "Er zit een vast regelsysteem in … Je post gaat nooit naar een externe AI- of OCR-dienst." Volgens de changelog gebruikte de oude versie wel AI-herkenning; de huidige doorstuurversie niet.
- **"Buddy seint je op tijd", "Nog 2 dagen"**: herinneringen per mail 7 en 2 dagen voor de vervaldatum (pakket Buddy en Buddy pro; Basic heeft geen seintjes, daarom geen prijs of pakketnaam in de video).
- **"Jij betaalt op tijd"**: Buddy herinnert, jij betaalt. Buddy betaalt nergens zelf.
<!-- copycheck:on -->

## Op de site zetten
1. Upload de zes bestanden uit `renders/hero-vsl/web/` naar de WordPress-mediabibliotheek: `betaalbuddy-hero-desktop.mp4`, `betaalbuddy-hero-mobile.mp4`, en per formaat een `-poster.webp` en een `-summary.webp`. De jpg's zijn reserve.
2. Open de homepage in Oxygen en zet een **Code Block** op de plek van de drie zwevende kaartjes (tussen de kop "Rekeningen vergeten is geen personality trait meer." en de regel eronder).
3. Plak de inhoud van `embed-snippet.html` erin en vervang de zes URL's door die uit de mediabibliotheek.
4. Controleer op telefoon en desktop, en meet PageSpeed mobiel opnieuw.

Wat de snippet doet:
- `muted`, `loop`, `playsinline`: autoplay werkt in Chrome, Safari (ook iOS) en Firefox.
- Laadt alleen het formaat dat past: onder 768 px de 4:5-versie, anders 16:9.
- `preload="none"` met een poster van ~30 KB: de video telt niet mee voor de eerste paint. Pas als de video in beeld is, laadt hij (~0,6 MB) en speelt hij. Uit beeld pauzeert hij.
- Bij "verminderde beweging" laadt er geen video en staat het slotbeeld (belofte en knop).
- Een verborgen tekst beschrijft de video voor schermlezers.
- De hele video linkt naar `/start-met-betaalbuddy/`. Haal de `<a>` weg als je dat niet wilt.

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Hero-VSL-Homepage**. De drie regels, de voorbeeldrekening, het seintje, de Betaald-kaart, de drie USP's (tekst en icoon: `mail`, `privacy`, `noAi`), de slottekst (met een optionele subregel), kleuren en timings per scène zijn props. Blijvend aanpassen doe je in `src/herovsl/schema.ts` (`defaultHeroVslProps`); beide formaten delen die.
- **Renderen:** `npm run render:herovsl` (16:9) en `npm run render:herovsl:mobile` (4:5), naar `out/`. Slotbeeld: `npm run still:herovsl`.
- **Webversies maken** (vanuit `04. Animation`):
  ```bash
  ffmpeg -i out/BB-HeroVSL-Desktop.mp4 -an -c:v libx264 -preset slow -crf 22 -profile:v high -level 4.0 \
    -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart \
    renders/hero-vsl/web/betaalbuddy-hero-desktop.mp4
  ```
  Hetzelfde voor `Mobile`. Posters: `npx remotion still BB-HeroVSL-Desktop out/poster.png --frame=0`, slotbeeld met `--frame=300`.
- **Code:** `src/herovsl/` (schema, `HeroVsl.tsx`, `layout.tsx`, `scenes/StepsScene.tsx`, `scenes/UspScene.tsx`, `scenes/EndScene.tsx`, `components/ui.tsx`). Gedeelde componenten zijn niet aangepast.

<!-- copycheck:off -->
## Open controles
- **Hero-tekst onder de video** zegt nog "7 dagen gratis ✦ Geen bankkoppeling ✦ Geen AI", en lager op de pagina staan "Stel gratis je buddy in", WhatsApp en "Labelt al je emails". Dat botst met het betaalmodel van 5 oktober en met deze video. Gelijktrekken voordat de video live gaat.
- **"We bewaren je mail niet"** klopt met de privacysectie van de homepage. Als ergens anders "we slaan niets op" staat, aanpassen: bedrag, datum, naam en rekeningnummer blijven tot 14 dagen na de vervaldatum.
- **Seintjes** horen bij Buddy en Buddy pro, niet bij Basic. Op de homepage is dat verdedigbaar (Buddy is de "Aanrader"), maar houd het consistent met de prijzensectie.
- **Datums** staan op november. Na de winter eventueel omzetten (props `bill.dueLabel`, `reminder`).
- **Linkdoel** van de video: `/start-met-betaalbuddy/` (de onboarding). Aanpassen in de snippet als de CTA ergens anders heen moet.
- **Remotion-licentie:** gratis voor bedrijven tot 3 medewerkers; daarboven een company license.
<!-- copycheck:on -->
