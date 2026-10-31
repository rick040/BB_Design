# BetaalBuddy · hero-VSL voor de homepage

## "Stuur door. Buddy seint. Jij betaalt op tijd."

**In één zin:** een rustige, korte video die in de hero van betaalbuddy.nl automatisch (zonder geluid) in een lus speelt. In drie stappen zie je wat BetaalBuddy is en wat het je oplevert: je stuurt je rekening door, Buddy seint je op tijd, jij betaalt op tijd. Rond 5 seconden staat de winst in beeld; daarna de belofte en de knop.

| | |
|---|---|
| Formaat | 16:9 desktop 1920×1080 (`BB-HeroVSL-Desktop`) · 4:5 mobiel 1080×1350 (`BB-HeroVSL-Mobile`) |
| Lengte | 10,6 s (30 fps, 318 frames), naadloze lus |
| Doel | Bezoekers snappen binnen 5 seconden wat BetaalBuddy is, hoe het werkt en wat het ze oplevert, en klikken op aanmelden |
| Geluid | Geen. Autoplay mag in browsers alleen zonder geluid, dus alles staat in beeld |
| Webbestanden | `renders/hero-vsl/web/`: mp4 desktop 0,52 MB, mp4 mobiel 0,48 MB, posters en slotbeelden als webp en jpg |
| Embed | `renders/hero-vsl/embed-snippet.html` (plakken in een Oxygen Code Block) · testpagina `renders/hero-vsl/preview.html` |

### Versie 2: rustiger (31 oktober 2026)
Versie 1 was te druk: veel tekst en elementen tegelijk, en te snel, waardoor je niet wist waar je moest kijken. Wat er veranderd is:
- **Eén plek om te kijken.** Alles staat in één gecentreerde kolom: bovenaan één korte regel, in het midden één object, Buddy eronder, steeds op dezelfde plek. Geen tekst links en beeld rechts meer.
- **Eén ding per stap.** Rekening → één seintje → Betaald. Weg: de opgestapelde regels, "Zo werkt BetaalBuddy", de vinger, signaalboogjes, de doorgestreepte chips, de stappenbalk en de drie uitlegscènes (doorstuurvenster, uitleesscherm, agenda). Die uitleg staat al in "Hoe werkt het" op de pagina.
- **Rustiger tempo.** Hele regels faden in (geen woord-voor-woord-pop met blur), de oude regel is weg voordat de nieuwe komt, zachtere veren en meer rust tussen de stappen.
- **Korter en lichter:** 10,6 s in plaats van 17,6 s; de webbestanden zijn half zo groot.

Versie 1 staat nog in git (commit `389b52f`) als je de uitlegscènes ergens anders wilt gebruiken.

---

## Storyboard (gemeten tijden)

Licht decor, één gecentreerde kolom. Buddy (blauw) staat de hele tijd onderin het midden.

### 1 · "Stuur je rekening door." (0,0 tot 2,3 s)
- **Op frame 0** staan de regel met badge **1**, de rekening (*Energieleverancier · Vervalt 27 nov · €86,40* met een grote knop **Doorsturen**) en Buddy. Dit is ook de poster.
- **0,73 s:** de knop wordt ingedrukt (zachte ring).
- **0,93 tot 1,73 s:** de rekening glijdt omlaag en verdwijnt in Buddy; Buddy veert mee.

### 2 · "Buddy seint je op tijd." (2,3 tot 4,5 s)
- De regel wisselt: de oude fadet weg, daarna komt **2** in (2,57 tot 2,97 s).
- **2,7 s:** één seintje stijgt uit Buddy op naar het midden: *BetaalBuddy · Nog 2 dagen · €86,40* (25 nov). Buddy kijkt ernaar.

### 3 · "Jij betaalt op tijd." (4,5 tot 7,5 s)
- Het seintje fadet weg, regel **3** komt in (4,77 tot 5,17 s).
- **4,77 s:** de kaart **Betaald · Op tijd, zonder extra kosten** komt in beeld; het vinkje tekent zich (5,03 tot 5,5 s). Buddy hupt één keer en kijkt tevreden.
- Ruim 2 seconden rust om de winst te laten landen.

### 4 · Belofte en knop (7,0 tot 10,6 s) · slide naar blauw
- **"Nooit meer een / rekening vergeten."** regel voor regel (wit en zachtblauw).
- Buddy (wit) naast de knop **activeer buddy**; hij kijkt naar de knop, zodat het oog daarheen gaat. Daarna het woordmerk.
- **10,1 tot 10,6 s:** frame 0 schuift van rechts in beeld; de lus begint opnieuw.

---

<!-- copycheck:off -->
## Copyregels en claims
Volgens `brand-betaalbuddy.md` §3 en de changelog (stand 31 oktober 2026): geen "gratis" of proefperiode, geen WhatsApp, Telegram of Signal, geen "scant je inbox", geen prijs, geen logo's of namen van andere merken (generieke afzender "Energieleverancier"), geen gebruikersaantallen. `check_copy.py` op schema en embed: geen treffers.

Waar de claims op rusten:
- Doorsturen: het product werkt met doorsturen naar je eigen adres; geen mailboxkoppeling.
- "Buddy seint je op tijd", "Nog 2 dagen": herinneringen per mail 7 en 2 dagen voor de vervaldatum (pakket Buddy en Buddy pro; Basic heeft geen seintjes, daarom geen prijs of pakketnaam in de video).
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
- `preload="none"` met een poster van ~30 KB: de video telt niet mee voor de eerste paint. Pas als de video in beeld is, laadt hij (~0,5 MB) en speelt hij. Uit beeld pauzeert hij.
- Bij "verminderde beweging" laadt er geen video en staat het slotbeeld (belofte en knop).
- Een verborgen tekst beschrijft de video voor schermlezers.
- De hele video linkt naar `/start-met-betaalbuddy/`. Haal de `<a>` weg als je dat niet wilt.

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Hero-VSL-Homepage**. De drie regels, de voorbeeldrekening, het seintje, de Betaald-kaart, de slottekst (met een optionele subregel), kleuren en timings per stap zijn props. Blijvend aanpassen doe je in `src/herovsl/schema.ts` (`defaultHeroVslProps`); beide formaten delen die.
- **Renderen:** `npm run render:herovsl` (16:9) en `npm run render:herovsl:mobile` (4:5), naar `out/`. Slotbeeld: `npm run still:herovsl`.
- **Webversies maken** (vanuit `04. Animation`):
  ```bash
  ffmpeg -i out/BB-HeroVSL-Desktop.mp4 -an -c:v libx264 -preset slow -crf 22 -profile:v high -level 4.0 \
    -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart \
    renders/hero-vsl/web/betaalbuddy-hero-desktop.mp4
  ```
  Hetzelfde voor `Mobile`. Posters: `npx remotion still BB-HeroVSL-Desktop out/poster.png --frame=0`, slotbeeld met `--frame=290`.
- **Code:** `src/herovsl/` (schema, `HeroVsl.tsx`, `layout.tsx`, `scenes/StepsScene.tsx` en `scenes/EndScene.tsx`, `components/ui.tsx`). Gedeelde componenten zijn niet aangepast.

<!-- copycheck:off -->
## Open controles
- **Hero-tekst onder de video** zegt nog "7 dagen gratis ✦ Geen bankkoppeling ✦ Geen AI", en lager op de pagina staan "Stel gratis je buddy in", WhatsApp en "Labelt al je emails". Dat botst met het betaalmodel van 5 oktober en met deze video. Gelijktrekken voordat de video live gaat.
- **Seintjes** horen bij Buddy en Buddy pro, niet bij Basic. Op de homepage is dat verdedigbaar (Buddy is de "Aanrader"), maar houd het consistent met de prijzensectie.
- **Datums** staan op november. Na de winter eventueel omzetten (props `bill.dueLabel`, `reminder`).
- **Linkdoel** van de video: `/start-met-betaalbuddy/` (de onboarding). Aanpassen in de snippet als de CTA ergens anders heen moet.
- **Remotion-licentie:** gratis voor bedrijven tot 3 medewerkers; daarboven een company license.
<!-- copycheck:on -->
