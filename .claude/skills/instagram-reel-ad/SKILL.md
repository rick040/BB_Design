---
name: instagram-reel-ad
description: Maakt van een idee, of van de vraag "bedenk er een", een complete Instagram Reels-advertentie voor BetaalBuddy. Je krijgt een uniek concept met storyboard, een bewerkbare Remotion-animatie (9:16 voor Reels en Stories, 4:5 voor de feed) met MP4-export, een ElevenLabs voice-overscript dat op de seconde op de animatie is getimed, en een Instagram-caption plus Ads Manager-teksten. Gebruik deze skill altijd als iemand een geanimeerde Instagram-, Reels-, Stories- of Meta-advertentie wil, een idee voor een animatie of motion ad deelt, vraagt of iets als animatie gemaakt of bedacht kan worden, of om "nog een concept" vraagt. Ook als Remotion, ElevenLabs of caption niet genoemd worden, en ook voor alleen een voice-over of caption bij een bestaand concept in de map 04. Animation van de BB_Design-repo.
---

# Instagram Reel-ad: van idee tot MP4, voice-over en caption

Deze skill legt de werkwijze vast waarmee concept 1 ("Stuur door. Buddy onthoudt.") en concept 2 ("7 · 2 · Betaald.") gemaakt zijn. Het resultaat van één run bestaat uit vijf dingen:

1. **Concept en storyboard** in `04. Animation/CONCEPT-N.md`.
2. **Bewerkbare Remotion-animatie** in twee formaten, met alle teksten, kleuren en timings als props in Remotion Studio.
3. **MP4's en een cover** in `04. Animation/renders/`.
4. **Voice-overscript voor ElevenLabs**: een plakklaar blok plus een cue-tabel met frame-exacte beeldmomenten.
5. **Instagram-caption** plus primaire tekst, kop en knop voor Ads Manager.

Werk de stappen in volgorde af. Elke stap leunt op de vorige: de voice-over hangt aan de gemeten frames uit stap 3, en de caption hangt aan de claims uit het concept.

## Voordat je begint

- **Repo.** Werk in `rick040/BB_Design`, map `04. Animation`. Daar staat het Remotion-project met gedeelde merkcomponenten en de bestaande concepten als voorbeeld. Ontbreekt de repo, voeg hem toe of clone hem. Ontbreekt `node_modules`, draai `npm install` in `04. Animation`.
- **Merk en product.** Lees `references/brand-betaalbuddy.md`. Daar staan de kleuren, fonts, Buddy, de assets, de producttaal en de copyregels.
- **Changelog.** Lees de actuele stand in de BetaalBuddy-changelog in Drive, via de changelog-skill als die er is. Het product verandert snel: een proefperiode, WhatsApp, prijzen en pakketten zijn al eens veranderd. Botst de changelog met het referentiebestand, dan wint de changelog. Werk het referentiebestand dan bij in dezelfde commit.
- **Bestaande concepten.** Lees de bestaande `CONCEPT*.md`-bestanden. Een nieuw concept moet echt anders zijn, niet een variant van wat er al is.
- **Omgeving.** Renderen vraagt Node 18+ en een headless Chrome. Dat werkt in Claude Code, zowel lokaal als in de cloud. Kun je niet renderen, zoals in een gewone chat zonder shell? Bouw en lever dan de code, het concept, de voice-over en de caption, schat de beeldtijden met `timeline.py`, en zeg eerlijk dat de MP4 lokaal gerenderd moet worden met `npm run render:<slug>`.
- **Ander merk?** De skill is gebouwd op BetaalBuddy. Vraag bij een ander merk om de merkbestanden en de producttaal, en maak eerst een eigen `references/brand-<merk>.md` voordat je bouwt.

## Stap 1 · Concept

**Met een idee van de gebruiker:** scherp het aan tot één heldere gedachte, met een pijn of hook, een visueel systeem, de rol van Buddy en een uitkomst. Past iets niet bij het product of de copyregels, zeg dat en stel een eerlijk alternatief voor.

**Zonder idee ("bedenk er een"):** bedenk in stilte drie richtingen, kies de richting die het meest verschilt van de bestaande concepten, en noem in één zin waarom. In het referentiebestand staat een lijst nog ongebruikte invalshoeken.

**Toets het concept op uniciteit.** Vergelijk met elk bestaand concept: invalshoek, visueel systeem (UI-gedreven, typografisch, personage-gedreven…), wat Buddy doet, het soort einde en de overgangen. Verschilt het op minder dan drie van de vijf punten, ga dan terug.

**Advertentieregels** (hookrate en 3-seconden-retentie zijn de testcijfers):
- **Hook.** De pijn moet binnen 2 seconden herkenbaar zijn. Frame 0 is nooit leeg (kop plus visual), want dat frame is vaak ook de cover.
- **Opbouw.** 3 tot 5 scènes, 12 tot 16 seconden, één gedachte per scène.
- **Geluid.** Alles moet zonder geluid te volgen zijn.
- **Einde.** Sluit af met de CTA-knop en het woordmerk.
- **Safe zones.** Houd de belangrijke tekst buiten de bovenste ~250 px en onderste ~330 px van 9:16.

Schrijf het concept uit volgens `references/concept-template.md`. Vraagt de gebruiker alleen of iets "kan" of "bedacht kan worden", geef dan het concept en ga door met bouwen. Alleen bij een expliciete brainstormvraag stop je na het concept.

## Stap 2 · Bouwen in Remotion

Lees `references/remotion-playbook.md`; daar staat het hoe en waarom. In het kort:

1. Maak `src/<slug>/` met `schema.ts`, `<Naam>Ad.tsx` en `scenes/`. Gebruik `src/countdown/` als sjabloon.
2. Zet in het schema alles wat iemand wil aanpassen: teksten, voorbeeldbedragen, kleuren, scène-timings, music en showSafeZones. De totale lengte volgt via `calculateMetadata` uit de timings.
3. Hergebruik de gedeelde componenten (Buddy, Notification, CtaPill, Wordmark, BillCard, RollingNumber, Checkmark, Headline/Subline, Stage). Maak een nieuw onderdeel in `src/components/` als het herbruikbaar is.
4. Kies overgangen die bij het concept passen, en niet dezelfde als het vorige concept.
5. Registreer `BB-<Naam>-Reel` (1080×1920) en `BB-<Naam>-Feed` (1080×1350) in `src/Root.tsx`, in een Folder `Concept-N-<Naam>`.
6. Voeg npm-scripts toe (`render:<slug>`, `render:<slug>:feed`, `still:<slug>`) en breid `render:all` uit.
7. Draai `npx tsc --noEmit` tot hij groen is.

## Stap 3 · Controleren: kijk naar je eigen frames

Je ziet de animatie alleen door frames te renderen en ze te bekijken. Sla deze stap niet over; elk concept had hier fouten die de code niet liet zien.

```bash
P="<repo>/04. Animation"; SK="<pad naar deze skill>"
NODE_PATH="$P/node_modules" node "$SK/scripts/render_stills.cjs" "$P" BB-<Naam>-Reel <outdir> 0,30,60,...
python3 "$SK/scripts/contact_sheet.py" <outdir> BB-<Naam>-Reel <sheet.png> 5 340
```

- Render 15 tot 20 frames verspreid over de tijdlijn: frame 0, elk belangrijk moment, het midden van elke overgang en het laatste frame. Bekijk de contact sheet.
- Doe hetzelfde voor de Feed-compositie.
- Gebruik de lijst "Bekende fouten" in de playbook. Herstel, render opnieuw en bekijk opnieuw.
- Render daarna de MP4's met de CLI (zie de playbook voor de browser-optie in de cloud). Controleer ze met `ffprobe` (h264, yuv420p, bt709, juiste lengte). Trek een paar bewegingsframes uit de MP4 zelf.
- Render een cover-still van het sterkste hookframe.

## Stap 4 · Voice-over (ElevenLabs)

Lees `references/voiceover-and-caption.md`. Bereken eerst de echte tijden van de beeldmomenten:

```bash
python3 "$SK/scripts/timeline.py" --scenes 3.2,5.4,3.2,3.4 --transition 0.4 --events "2:8,2:32,3:36"
```

Schrijf daarna korte, spreekbare Nederlandse zinnen die op die momenten landen. Lever drie dingen op:
- een plakklaar blok voor Multilingual v2, met `break`-tags;
- een cue-tabel (start, zin, beeldmoment);
- de doellengte van de mp3.

Zeg eerlijk wat exact is: de beeldmomenten zijn gemeten, de spreektijden zijn een schatting.

## Stap 5 · Caption en Ads Manager

Volg het format in `references/voiceover-and-caption.md`:
- een hook in de eerste ~125 tekens;
- korte stappen met emoji;
- "Geen app. Geen bankkoppeling.";
- "link in bio" en 5 hashtags;
- daarnaast primaire tekst, kop en knop voor de betaalde versie.

Elke claim moet kloppen met het product.

## Stap 6 · Copycheck

```bash
python3 "$SK/scripts/check_copy.py" "$P/src/<slug>/schema.ts" "$P/CONCEPT-N.md"
```

De copycheck zoekt naar verboden claims (gratis, proefperiode, WhatsApp, inbox scannen, prijzen, merknamen van anderen). Een treffer is niet automatisch fout; de regel "€40" mag bijvoorbeeld met "kan". Beoordeel elke treffer en herstel wat niet klopt. Werk `references/copy-rules.txt` bij als het product verandert.

## Stap 7 · Opleveren

1. Vul `CONCEPT-N.md` aan met de gemeten tijden, de voice-over en de caption. Werk de tabel en de scripts in `README.md` bij. Kopieer de MP4's en de cover naar `renders/`.
2. Commit naar de werkbranch en push. Maak geen PR tenzij de gebruiker erom vraagt.
3. Stuur de twee MP4's naar de gebruiker (SendUserFile, render).
4. Antwoord in het Nederlands, kort:
   - het idee in een paar zinnen;
   - de scènes met hun tijden;
   - het voice-overblok en de caption in codeblokken, zodat ze te kopiëren zijn;
   - de Ads Manager-teksten;
   - hoe je het aanpast en exporteert (map in Studio, npm-scripts, schema-bestand);
   - eventuele open controles, zoals een productclaim die nog bevestigd moet worden.
5. Werk de BetaalBuddy-changelog bij via de changelog-skill, als die beschikbaar is.

## Gedeeltelijke verzoeken

- **Alleen voice-over of caption bij een bestaand concept:** lees de scène-timings uit het schema en de framemomenten uit de scènes, reken met `timeline.py`, en schrijf. Er hoeft niets gebouwd te worden.
- **Alleen een concept of brainstorm:** stap 1, en bied aan om het te bouwen.
- **Een bestaand concept aanpassen:** werk in die conceptmap. Render, controleer en lever opnieuw op zoals hierboven, maar alleen voor wat veranderd is.
