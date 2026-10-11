---
name: instagram-reel-ad
description: Maakt van een idee, of van de vraag "bedenk er een", een complete Instagram Reels-advertentie voor BetaalBuddy. Je krijgt een uniek concept met storyboard, een bewerkbare Remotion-animatie (9:16 voor Reels en Stories, 4:5 voor de feed) met MP4-export, een ElevenLabs voice-overscript dat op de seconde op de animatie is getimed, en een Instagram-caption plus Ads Manager-teksten. Gebruik deze skill altijd als iemand een geanimeerde Instagram-, Reels-, Stories- of Meta-advertentie wil, een idee voor een animatie of motion ad deelt, vraagt of iets als animatie gemaakt of bedacht kan worden, of om "nog een concept" vraagt. Ook als Remotion, ElevenLabs of caption niet genoemd worden, en ook voor alleen een voice-over of caption bij een bestaand concept in de map 04. Animation van de BB_Design-repo.
---

# Instagram Reel-ad: van idee tot MP4, voice-over en caption

Deze skill legt de werkwijze vast waarmee de concepten in `04. Animation` gemaakt zijn. Eén run levert vijf dingen op:

1. **Concept en storyboard** in `04. Animation/CONCEPT-N.md`.
2. **Bewerkbare Remotion-animatie** in twee formaten. Alle teksten, kleuren en timings zijn props in Remotion Studio.
3. **MP4's en een cover** in `04. Animation/renders/`.
4. **Voice-overscript voor ElevenLabs**: een plakklaar blok plus een cue-tabel met frame-exacte beeldmomenten.
5. **Instagram-caption** plus primaire tekst, kop en knop voor Ads Manager.

Werk de stappen in volgorde af. Elke stap leunt op de vorige: de voice-over hangt aan de gemeten frames uit stap 3, en de caption aan de claims uit het concept. In deze tekst staat `$SK` voor de basismap van deze skill en `$P` voor `<repo>/04. Animation`.

## Voordat je begint

- **Repo.** Werk in `rick040/BB_Design`, map `04. Animation`. Daar staat het Remotion-project met gedeelde merkcomponenten en de bestaande concepten als voorbeeld. Ontbreekt de repo, voeg hem toe of clone hem. Ontbreekt `node_modules`, draai `npm install` in `$P`.
- **Omgeving.** Renderen vraagt Node 18+ en een headless Chrome. Dat werkt in Claude Code, lokaal of in de cloud. Kun je niet renderen, zoals in een gewone chat zonder shell? Lever dan code, concept, voice-over en caption, reken de beeldtijden uit met `timeline.py`, en zeg eerlijk dat de MP4 lokaal gerenderd moet worden met `npm run render:<slug>`.
- **Merk en product.** Lees `references/brand-betaalbuddy.md`. Daar staan de kleuren, fonts, Buddy, de assets, de producttaal, de privacyfeiten en de copyregels.
- **Changelog.** Lees de actuele stand in de BetaalBuddy-changelog in Drive, via de changelog-skill als die er is. Het product verandert snel: een proefperiode, WhatsApp, prijzen en pakketten zijn al eens veranderd. Botst de changelog met het referentiebestand, dan wint de changelog. Noem de afwijking in je antwoord, zodat het referentiebestand bijgewerkt kan worden.
- **Bestaande concepten.** Lees alle `$P/CONCEPT*.md`-bestanden. Daar staat per concept de invalshoek, het visuele systeem, wat Buddy doet, het einde en de overgangen. Dit is de enige actuele lijst van wat er al gemaakt is.
- **Ander merk?** De skill is gebouwd op BetaalBuddy. Vraag bij een ander merk om de merkbestanden en de producttaal, en maak eerst een eigen `references/brand-<merk>.md` voordat je bouwt.

## Stap 1 · Concept

**Met een idee van de gebruiker:** scherp het aan tot één heldere gedachte, met een pijn of hook, een visueel systeem, de rol van Buddy en een uitkomst. Past iets niet bij het product of de copyregels, zeg dat en stel een eerlijk alternatief voor.

**Zonder idee ("bedenk er een"):** bedenk in stilte drie richtingen, kies de richting die het meest verschilt van de bestaande concepten, en noem in één zin waarom. In het referentiebestand (§4) staan invalshoeken om uit te kiezen; sla de invalshoeken over die al in een CONCEPT-bestand staan.

**Toets het concept op uniciteit.** Vergelijk met elk bestaand concept op zes punten:
1. invalshoek;
2. visueel systeem (UI-gedreven, typografisch, personage-gedreven, focus…);
3. wat Buddy doet;
4. het soort einde;
5. het slotbeeld bij de CTA (wat Buddy daar doet);
6. de hoofdovergangen.

Verschilt het concept met een bestaand concept op minder dan vier van de zes punten, ga dan terug.

**Advertentieregels** (hookrate en 3-seconden-retentie zijn de testcijfers):
- **Hook.** De pijn moet binnen 2 seconden herkenbaar zijn.
- **Frame 0** is nooit leeg en moet de kop grotendeels tonen, want dat frame is vaak de cover. Houd de hook-kop op ~7 woorden of minder, of start hem met delay ≈ −(woorden − 2) × stagger.
- **Opbouw.** 3 tot 5 scènes, 12 tot 16 seconden, één gedachte per scène.
- **Geluid.** Alles moet zonder geluid te volgen zijn.
- **Einde.** Sluit af met de CTA-knop en het woordmerk.
- **Safe zones.** Houd de belangrijke tekst buiten de bovenste ~250 px en onderste ~330 px van 9:16.

Schrijf het concept uit volgens `references/concept-template.md`. Vraagt de gebruiker alleen of iets "kan" of "bedacht kan worden", geef dan het concept en ga door met bouwen. Alleen bij een expliciete brainstormvraag stop je na het concept.

## Stap 2 · Bouwen in Remotion

Lees `references/remotion-playbook.md`; daar staat het hoe en waarom. In het kort:

1. **Map.** Maak `src/<slug>/` met `schema.ts`, `<Naam>Ad.tsx` en `scenes/`. Gebruik `src/privacy/` of `src/countdown/` als sjabloon.
2. **Schema.** Zet erin wat iemand wil aanpassen: teksten, voorbeeldbedragen, `colors` (precies de vijf sleutels van `PaletteColors`), scène-timings, `music` en `showSafeZones`. De totale lengte volgt via `calculateMetadata`.
3. **Beats.** Zet de beats per scène in een geëxporteerd object, bijvoorbeeld `export const HOOK_T = { flag: 44, seen: 52 }`. Laat namen van duren eindigen op `Len` of `Stagger`. Dan leest `timeline.py` ze later direct uit voor de voice-over.
4. **Componenten.** Hergebruik de gedeelde componenten (zie de API-tabel in de playbook). Iets nieuws en herbruikbaars komt in `src/components/` of `src/lib/`.
5. **Gedeelde code aanpassen?** Maak de wijziging opt-in: een optionele prop waarvan de default het oude gedrag is. Doe de regressiecheck uit de playbook (§5b): stills vóór en na, en `compare_stills.py`.
6. **Overgangen.** Kies er die nog niet de hoofdovergang van een bestaand concept zijn. Gebruik alleen CSS-overgangen; de WebGL-overgangen zijn riskant headless (zie de playbook §3). Een eigen overgang mag; `src/lib/focusPull.tsx` is het voorbeeld.
7. **Root.** Registreer `BB-<Naam>-Reel` (1080×1920) en `BB-<Naam>-Feed` (1080×1350) in `src/Root.tsx`, in een Folder `Concept-N-<Naam>`. Voeg `render:<slug>` en `render:<slug>:feed` toe aan `package.json` en breid `render:all` uit.
8. **Typecheck.** Draai `npx tsc --noEmit` tot hij groen is.

## Stap 3 · Controleren: kijk naar je eigen frames

Je ziet de animatie alleen door frames te renderen en ze te bekijken. Sla deze stap niet over; elk concept had hier fouten die de code niet liet zien.

```bash
NODE_PATH="$P/node_modules" node "$SK/scripts/render_stills.cjs" "$P" BB-<Naam>-Reel,BB-<Naam>-Feed <outdir> 0,30,60,...
python3 "$SK/scripts/contact_sheet.py" <outdir> BB-<Naam>-Reel <reel-sheet.png> 5 340
python3 "$SK/scripts/contact_sheet.py" <outdir> BB-<Naam>-Feed <feed-sheet.png> 5 340
```

- Render ~20 tot 25 frames: frame 0, elke beat (`timeline.py --beats-from` geeft de lijst), het midden van elke overgang en het laatste frame. Reel en Feed gaan in één aanroep.
- Bekijk beide sheets en zoom in op details met uitsneden.
- Gebruik de lijst "Bekende fouten" in de playbook. Herstel, render opnieuw en bekijk opnieuw.
- Render daarna de MP4's met de CLI (zie de playbook voor de browser-optie in de cloud). Controleer ze met `ffprobe` (h264, yuv420p, bt709, juiste lengte) en trek een paar bewegingsframes uit de MP4 zelf.
- Kies het sterkste hookframe als cover. Voeg pas dán `still:<slug>` met dat frame toe aan `package.json`, en render de cover.

## Stap 4 · Voice-over (ElevenLabs)

Lees `references/voiceover-and-caption.md`. Eerst de exacte beeldtijden:

```bash
python3 "$SK/scripts/timeline.py" --scenes <s1,s2,...> --transition 0.4 --beats-from "1=$P/src/<slug>/scenes/HookScene.tsx,2=..."
```

Schrijf daarna per beat een korte, spreekbare Nederlandse zin. Zet ze als `start | zin` in een tekstbestand, en laat het script het plakblok, de breaks en de waarschuwingen maken:

```bash
python3 "$SK/scripts/vo_timing.py" vo.txt --total <lengte in s>
```

Los alle waarschuwingen op (overlap, cijfers, te laat einde). Lever het plakblok, de cue-tabel en de doellengte van de mp3 op. Zeg eerlijk wat exact is: de beeldmomenten zijn gemeten, de spreektijden zijn een schatting.

## Stap 5 · Caption en Ads Manager

Volg het format in `references/voiceover-and-caption.md`:
- een hook in de eerste ~125 tekens;
- korte stappen met emoji;
- "Geen app. Geen bankkoppeling.";
- "link in bio" en 5 hashtags;
- daarnaast primaire tekst, kop en knop voor de betaalde versie.

Elke claim moet kloppen met het product; let bij privacy-invalshoeken op de retentie in §2 van het referentiebestand.

## Stap 6 · Copycheck

```bash
python3 "$SK/scripts/check_copy.py" "$P/src/<slug>/schema.ts" "$P/CONCEPT-N.md"
```

De copycheck zoekt naar verboden claims: gratis, proefperiode, WhatsApp, inbox scannen, prijzen, andermans merknamen, "bewaart niets" en gedachtestreepjes. Een treffer is niet automatisch fout; de "€40"-regel mag bijvoorbeeld met "kan". Beoordeel elke treffer. De sectie Copyregels in het CONCEPT-bestand staat tussen `copycheck:off` en `copycheck:on`, zodat die opsomming geen ruis geeft.

## Stap 7 · Opleveren

1. **Documentatie.** Vul `CONCEPT-N.md` aan met de gemeten tijden, de voice-over en de caption. Werk de tabel en de scripts in `$P/README.md` bij. Kopieer de MP4's en de cover naar `renders/`.
2. **Git.** Commit naar de werkbranch en push. Maak geen PR tenzij de gebruiker erom vraagt.
3. **Bestanden.** Heb je een tool om bestanden te delen (bijvoorbeeld SendUserFile), stuur dan de twee MP4's. Anders noem je de paden in `renders/` en de branch.
4. **Antwoord** in het Nederlands, kort:
   - het idee in een paar zinnen;
   - de scènes met hun tijden;
   - het voice-overblok en de caption in codeblokken, zodat ze te kopiëren zijn;
   - de Ads Manager-teksten;
   - hoe je het aanpast en exporteert (map in Studio, npm-scripts, schema-bestand);
   - open controles, zoals een productclaim die nog bevestigd moet worden of de instappagina.
5. **Changelog.** Werk de BetaalBuddy-changelog bij via de changelog-skill, als die beschikbaar is. Die skill maakt een nieuwe versie van het Drive-bestand en zet de oude in de prullenbak. De Drive-tools moeten soms eerst geladen worden (ToolSearch).

## Gedeeltelijke verzoeken

- **Alleen voice-over of caption bij een bestaand concept:** lees de timings uit het schema, haal de beats op met `timeline.py --beats-from` (of `--events` als een scène geen beat-object heeft), en maak het blok met `vo_timing.py`. Er hoeft niets gebouwd te worden.
- **Alleen een concept of brainstorm:** stap 1, en bied aan om het te bouwen.
- **Een bestaand concept aanpassen:** werk in die conceptmap. Render, controleer en lever opnieuw op zoals hierboven, maar alleen voor wat veranderd is.
