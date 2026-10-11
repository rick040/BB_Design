# Remotion-playbook voor BetaalBuddy-ads

## Inhoud
1. Projectopbouw
2. Gedeelde componenten en helpers (API)
3. Een nieuw concept toevoegen, stap voor stap
4. Layout, safe zones en timing
5. Bekende fouten (lees dit vóór je stills bekijkt)
6. Renderen en controleren

---

## 1. Projectopbouw (`04. Animation/`)

```
remotion.config.ts      h264, yuv420p, BT.709, crf 16, jpeg 95 (niet aanpassen zonder reden)
src/index.ts            registerRoot
src/Root.tsx            alle composities, per concept in een <Folder>
src/theme.ts            brand-tokens, fonts (loadFont uit public/fonts)
src/schema.ts + Ad.tsx + scenes/       concept 1 "Stuur door. Buddy onthoudt."
src/countdown/                          concept 2 "7 · 2 · Betaald."  ← beste sjabloon
  schema.ts  CountdownAd.tsx  scenes/{HookScene,CountdownScene,PaidScene,CtaScene}.tsx
src/components/         gedeelde merkonderdelen
src/lib/                anim.ts, layout.ts, palette.tsx
public/fonts/           SpaceGrotesk-Variable.woff2, Geist-Variable.woff2 (+ OFL)
renders/                opgeleverde MP4's en covers (wel in git)
out/                    lokale renders (in .gitignore)
```

Gepinde versies: remotion, @remotion/* 4.0.534; zod 4.5.4 (moet bij deze Remotion-versie passen); react 19.1.1.

## 2. Gedeelde componenten en helpers

Alle onderdelen lezen hun kleuren uit `usePalette()`. Zet ze dus binnen `<PaletteProvider colors={props.colors}>`.

| Component | Props | Notities |
|---|---|---|
| `Buddy` | `size, body, eye, blink=1, look={x,y}, squash=1, style` | `BUDDY_RATIO` = hoogte/breedte (~1.09). `squash` < 1 plat, > 1 uitgerekt (volume-behoudend, oorsprong onderkant). Positioneer via `style` (left/top van de voeten: `top = voetenY - size*BUDDY_RATIO`). |
| `AppIcon` | `size, circle=true, circleColor` | BetaalBuddy-app-icoon |
| `Notification` | `text, time, icon: "new"\|"warning"\|"alert", title="BetaalBuddy", width=900, style` | `NOTIFICATION_W/H` = 900×156 |
| `StatusIcon` | `kind, size` | SVG in plaats van emoji (emoji renderen verschillend per machine) |
| `CtaPill` / `Arrow` | `text, arrowIn 0..1, arrowNudge px, outline` | `CTA_H` = 104. Schaal via een wrapper. De pijlcirkel staat op (CTA_H/2, CTA_H/2) voor een tap-ripple. |
| `Wordmark` | `size, betaal, buddy` | "betaal" in blueSoft, "buddy" in wit of blauw |
| `BillCard` | `sender, subject, amount, dueLabel, urgent, tick 0..1, stamp, stampIn 0..1` | 860×330, met een vervaldatum-chip en een optioneel stempel |
| `RollingNumber` | `values[], progress 0..1, size, color, blur` | Fruitautomaat-rol. `rollSequence("7","2")` geeft 7,6,5,4,3,2. De bovenkant van het cijfer zit op ~0.165×size in de regelbox. |
| `Checkmark` | `size, color, progress 0..1, strokeWidth` | Tekent zichzelf |
| `Headline` | `text, color, delay, stagger, sizeFactor, top` | Woorden ploppen één voor één in. `\n` = harde regelafbreking. Een negatieve `delay` betekent "al zichtbaar op frame 0". |
| `Subline` | `text, color, delay, bottom` | Staat onderaan, boven de safe zone. Ondersteunt `\n`. |
| `SceneBg` | `color` | Full-frame achtergrond |
| `Stage` | `offsetY, style` | Ontwerpvak van 1080×900, per formaat geplaatst en geschaald. Teken je scène hierin met vaste coördinaten. |
| `SafeZones` | n.v.t. | Alleen een Studio-hulpmiddel, via de prop `showSafeZones` |

`src/lib/anim.ts`:
- `springs.{pop, smooth, bouncy}`;
- `pop(frame, fps, delay, config)`: een spring van 0 naar 1;
- `clamp`;
- `fadeIn`;
- `pushedSlots(frame, fps, arrivals[], i)`: "nieuwste bovenaan"-stapel; de oudere items schuiven één plek op;
- `shake(frame, start, length, amp)` geeft `{x,y,r}`;
- `blinkScale(frame, [frames])`: een knipper van 6 frames.

`src/lib/layout.ts`: `useLayout()` geeft `tall`, `safeTop` (250/80), `safeBottom` (330/80), `headlineSize` (104/84), `sublineSize`, `stageScale` (1/0.78), `stageCenterY` en `sidePadding`.

## 3. Een nieuw concept toevoegen

1. **Map.** Maak `src/<slug>/` (bijvoorbeeld `privacy`) met `schema.ts`, `<Naam>Ad.tsx` en `scenes/`.
2. **Schema** (kopieer de opbouw van `src/countdown/schema.ts`):
   - Groepen per scène met alle teksten. Data die in meerdere scènes terugkomt (bijvoorbeeld `bill`) krijgt een eigen groep.
   - `colors` (`zColor()`), `timing` (seconden per scène plus `transition`, met min/max), `music`, `musicVolume`, `showSafeZones`.
   - Het defaults-object plus de helpers `<naam>Frames(timing)` en `<naam>Total(timing)`. Het totaal is de som van de scènes min (aantal overgangen × transition).
   - Gebruik geen `.step()` op getallen; dat geeft afrondingsfouten in zod.
3. **Ad-component.** Bouw die met `PaletteProvider`, `TransitionSeries` (springTiming damping 200), een optionele `<Audio>` voor `music` en `SafeZones`. Importeer `"../theme"` zodat de fonts laden.
   - Beschikbare overgangen: `fade, slide, wipe, flip, clockWipe, iris, none`. Er zijn er meer in `node_modules/@remotion/transitions/dist/presentations/`; render een nieuwe overgang eerst als still.
   - `iris` en `clockWipe` hebben `{width, height}` uit `useVideoConfig()` nodig.
4. **Scènes.** Zet de timing-constanten bovenaan (scène-lokale frames, bijvoorbeeld `const T_LAND = 32`), zodat ze later makkelijk te tunen en te meten zijn voor de voice-over. Teken in `<Stage>`.
5. **Root.tsx.** Voeg een `<Folder name="Concept-N-<Naam>">` toe; foldernamen mogen alleen a-z, A-Z, 0-9 en `-` bevatten. Zet er twee `<Composition>`s in (Reel 1080×1920 en Feed 1080×1350), met `schema`, `defaultProps`, `calculateMetadata` (duur uit timing) en `fps={30}`.
6. **package.json.** Voeg `render:<slug>`, `render:<slug>:feed` en `still:<slug>` toe, en breid `render:all` uit.
7. **Typecheck.** `npx tsc --noEmit`.

Blijvende wijzigingen horen in de defaults van het schema. Beide formaten delen die defaults, daarom is de "Save props"-knop in Studio grijs. Dat is bewust; zet het in de README als iemand ernaar vraagt.

## 4. Layout, safe zones en timing

- **9:16:** de kop staat op y=250 en is twee regels × 104 px, dus de onderkant ligt rond y≈463. Het Stage-vak loopt ongeveer van y 514 tot 1414 (center 964). Content mag ~150 px onder het Stage-vak doorlopen, tot ~1590.
- **4:5:** alles schaalt naar 0.78 en de marges zijn 80 px. Controleer de Feed altijd apart.
- **Personages die springen:** reken de piek van de sprong uit. Buddy's bovenkant moet onder de onderkant van de kop blijven (globaal y > ~470 in 9:16). Gebruik lage bogen (100 tot 200 px) en zet de rustpositie zo laag dat er ruimte is.
- **Overgangen overlappen** (12 frames bij 0.4 s). Een beat in de eerste ~10 frames van een scène valt dus samen met de overgang. Zet hoofdbeats ≥ 8 frames na de start en ≥ 15 frames voor het einde.
- **Tempo:** één beat per ~0.5 tot 1 s; de hook levert de pijn binnen 2 s.

## 5. Bekende fouten (allemaal echt voorgekomen)

1. **Frame 0 is leeg** (alleen achtergrond). Zet de kop met een negatieve delay neer en laat items "al aangekomen" zijn (negatieve arrival-frames).
2. **Buddy springt door de kop heen.** Verlaag de boog of verplaats de rustpositie (zie §4).
3. **Rollende of bewegende items tekenen over koppen of meldingen heen.** Controleer de z-volgorde en de clipping (`overflow: hidden` op lijsten).
4. **Een nieuw item in een stapel komt van onder door een ouder item heen.** Laat het van boven op zijn plek ploppen (kleine negatieve offset en schaal 0.85 naar 1), met `zIndex` oplopend per item.
5. **Een stempel of label bedekt tekst op een kaart.** Zet het in een lege hoek en controleer met een uitsnede.
6. **Motion blur te sterk** (getal onleesbaar). Houd het maximum rond 12 px.
7. **Lege onderhelft in een scène zonder subregel.** Verschuif het Stage-vak met `offsetY` of maak het visual groter.
8. **Lelijke regelafbreking** ("agenda. 7 / en 2 dagen"). Gebruik `\n` in de tekst.
9. **Emoji in de UI** renderen niet overal. Gebruik `StatusIcon` of eigen SVG.
10. **Kleurafwijking** van het merkblauw door full range (`yuvj420p`). Dat lost `setColorSpace("bt709")` in de config op; laat die staan.

## 6. Renderen en controleren

**Browser.**
- **Lokaal** downloadt Remotion zelf Chrome Headless Shell.
- **In een cloudomgeving** zonder internettoegang tot die download gebruik je de lokale Chromium:
  ```bash
  B="--browser-executable=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)"
  ```
- `scripts/render_stills.cjs` zoekt deze browser zelf, of gebruikt `REMOTION_BROWSER`.

**Stills (snel, één bundle):**
```bash
NODE_PATH="$P/node_modules" node "$SK/scripts/render_stills.cjs" "$P" BB-X-Reel /tmp/stills 0,20,45,...
python3 "$SK/scripts/contact_sheet.py" /tmp/stills BB-X-Reel /tmp/sheet.png 5 340
```
Bekijk de sheet. Werk met uitsneden (PIL `crop`) als je een detail wilt controleren.

**MP4:**
```bash
cd "$P" && npx remotion render BB-X-Reel out/BB-X-Reel.mp4 $B && npx remotion render BB-X-Feed out/BB-X-Feed.mp4 $B
ffprobe -v error -show_entries stream=codec_name,width,height,pix_fmt,color_space,nb_frames -show_entries format=duration -of csv=p=0 out/BB-X-Reel.mp4
# verwacht: h264,1080,1920,yuv420p,bt709,<frames>  <duur>
ffmpeg -v error -i out/BB-X-Reel.mp4 -vf "select=eq(n\,120)" -vframes 1 /tmp/f120.png   # beweging checken uit de echte MP4
npx remotion still BB-X-Reel out/BB-X-Reel-cover.png --frame=<sterkste hookframe> $B
```

**Studio** (alleen nodig als de gebruiker het wil zien, of om te checken dat hij start): `npx remotion studio --no-open --port=3123`, dan `curl localhost:3123`.
