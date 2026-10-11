# Voice-over (ElevenLabs) en Instagram-caption

## Voice-over

**Model:** ElevenLabs **Multilingual v2** (ook Flash/Turbo v2.5). Daar werkt `<break time="0.4s" />` voor pauzes tot 3 s. Eleven v3 ondersteunt geen break-tags; zeg dat erbij als de gebruiker v3 noemt.

**Werkwijze:**
1. **Meet de beelden.** Haal de scène-timings uit het schema en lees de beats direct uit de scènes:
   ```bash
   python3 "$SK/scripts/timeline.py" --scenes 3.2,3.4,4.6,3.6 --transition 0.4 \
     --beats-from "1=$P/src/privacy/scenes/HookScene.tsx,2=$P/src/privacy/scenes/BlindScene.tsx,3=...,4=..."
   ```
   Heeft een scène geen beat-object, gebruik dan `--events "scène:frame=label"`. De uitkomst is exact: het script rekent op dezelfde manier als `TransitionSeries`.
2. **Schrijf per beat één korte zin** en zet hem op de tijd van zijn beat (+0 tot 0,4 s) in een bestand `vo.txt`:
   ```
   0.0 | Moet een app echt al je mail lezen?
   3.1 | Buddy niet.
   4.0 | Hij kijkt niet in je mailbox.
   ```
   Een zin die het beeld aankondigt voordat het er is, voelt verkeerd. Een video van 14 s draagt ~30 tot 38 woorden. Minder is beter; laat de beelden ademen. Hergebruik koppen waar het kan: stem en beeld die hetzelfde zeggen, versterken elkaar.
3. **Laat het script het blok maken:**
   ```bash
   python3 "$SK/scripts/vo_timing.py" vo.txt --total 13.6
   ```
   Het script telt lettergrepen (~5 per seconde), rekent de pauzes (0,3 s na een zin, 0,2 s per komma) en zet de breaks precies goed. Het waarschuwt bij:
   - overlap: een zin start later dan zijn beat;
   - cijfers;
   - een einde dat minder dan 0,3 s voor het eind van de video ligt.

   Los elke waarschuwing op door in te korten of de start te verschuiven, en draai het script opnieuw.
4. **Schrijf getallen en bedragen uit** ("veertig euro", "zeven", "twee") voor een betrouwbare uitspraak. "Buddy" mag zo blijven staan.

**Opleveren (in deze volgorde):**
- **Paste-blok:** één alinea, zonder regeleindes (een regeleinde geeft extra pauze), in een codeblok.
- **Cue-tabel:** `| Start (s) | Zin | Beeld (frame-exact) |`. `vo_timing.py` maakt hem, als je in `vo.txt` een derde kolom met het beeld zet.
- **Doellengte van de mp3**, en wat te doen bij afwijking: speed 1.05 tot 1.1, breaks korter of langer, of per zin genereren en op de cue-tijden zetten.
- **Onder de video zetten:** mp3 in `public/`, bestandsnaam in de prop `music`, `musicVolume` op 1. Muziek en voice-over tegelijk kan nog niet; bied een aparte voiceover-prop aan als dat nodig is.

**Tempo:**

| Gevoel | Woorden per ~14 s | `--rate` | ElevenLabs Speed |
|---|---|---|---|
| Rustig | 25 tot 30 | 4.5 | 0.9 |
| Normaal (reclame) | 30 tot 36 | 5.0 | 1.0 |
| Snel | 34 tot 40 | 5.5 | 1.1 |

Breaks zijn absoluut. Genereer je op een andere Speed dan de rate waarmee je rekende, dan schuiven alle latere zinnen. Noem daarom altijd de Speed bij het blok.

**Voorbeeld (concept 2, 14.0 s). Ter illustratie van het format; neem de zinnen niet over in een ander concept:**
```
Heb jij die rekening al betaald? <break time="0.3s" /> Stuur hem door. Buddy telt af. Zeven dagen vooraf: een seintje. Twee dagen vooraf: nog een. Betaald. Zonder stress. <break time="0.5s" /> Zeven. Twee. Betaald. Activeer Buddy.
```

## Instagram-caption (Reels, organisch)

**Opbouw:**
```
<Hook-vraag of -herkenning, in de eerste ~125 tekens; die zie je vóór "meer"> <1 emoji>

<Eén zin die Buddy introduceert> <emoji>
<emoji> <stap 1: doorsturen>
<emoji> <stap 2>
<emoji> <stap 3 / uitkomst>

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #budgetteren #opjezelfwonen
```

**Regels:**
- De hook sluit aan op de hook van de video, maar is geen letterlijke kopie.
- Elke claim moet kloppen met `brand-betaalbuddy.md` §2 en §3, zoals "kan uitlopen op €40" en "7 en 2 dagen van tevoren".
- Gebruik 5 hashtags. Mag er één wisselen naar de invalshoek (bijvoorbeeld `#privacy` of `#zorgnota`)? Ja, maar houd `#betaalbuddy`.
- Gebruik geen "gratis", geen prijs en geen andere merknamen.

## Ads Manager (betaalde versie)

Hashtags en "link in bio" werken niet in een advertentie. Lever daarom apart:
- **Primaire tekst:** ≤ 125 tekens, met de hook en het hoofdvoordeel.
- **Kop:** ≤ 40 tekens, vaak de tagline of de slotkop van de video.
- **Knop:** "Aanmelden". Er is geen gratis proef, dus geen "Probeer gratis".

Herinner de gebruiker eraan dat de link naar de gekozen instappagina moet wijzen.
