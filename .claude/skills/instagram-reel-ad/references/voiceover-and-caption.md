# Voice-over (ElevenLabs) en Instagram-caption

## Voice-over

**Model:** ElevenLabs **Multilingual v2** (ook Flash/Turbo v2.5). Daar werkt `<break time="0.4s" />` voor pauzes tot 3 s. Eleven v3 ondersteunt geen break-tags; zeg dat erbij als de gebruiker v3 noemt.

**Werkwijze:**
1. **Meet de beelden.** Haal de scène-timings uit het schema en de beat-frames uit de constanten bovenin de scènes. Reken ze om naar globale seconden:
   ```bash
   python3 scripts/timeline.py --scenes 3.2,5.4,3.2,3.4 --transition 0.4 --events "1:58,2:8,2:32,2:44"
   ```
   (`--events scène:frame`, met scènes vanaf 1.) Dit is exact: het rekent op dezelfde manier als `TransitionSeries`.
2. **Schrijf per beat één korte zin.** Spreektempo-schatting voor Nederlands in een reclametempo:
   - ~5 lettergrepen per seconde;
   - plus ~0.3 s natuurlijke pauze na elke punt of vraagteken;
   - een komma of dubbele punt is ~0.2 s.

   Begroting: een video van 14 s draagt ~30 tot 38 woorden. Minder is beter; laat de beelden ademen.
3. **Laat elke zin 0 tot 0.4 s ná zijn beeldmoment starten.** Een zin die het beeld aankondigt voordat het er is, voelt verkeerd. De laatste zin eindigt ≥ 0.3 s voor het einde.
4. **Zet extra breaks waar het gat groter is dan de natuurlijke pauze.** Break = gewenste start − (vorige eind + 0.3 s).
5. **Schrijf getallen en bedragen uit** ("veertig euro", "zeven", "twee") voor een betrouwbare uitspraak. "Buddy" mag zo blijven staan.
6. **Hergebruik koppen waar het kan.** Stem en beeld die hetzelfde zeggen, versterken elkaar. Waar het beeld al uitlegt, mag de stem aanvullen.

**Opleveren (in deze volgorde):**
- **Paste-blok:** één alinea, zonder regeleindes (een regeleinde geeft extra pauze), in een codeblok.
- **Cue-tabel:** `| Start (s) | Zin | Beeld (frame-exact) |`.
- **Doellengte van de mp3**, en wat te doen bij afwijking: speed 1.05 tot 1.1, breaks korter of langer, of per zin genereren en op de cue-tijden zetten.
- **Onder de video zetten:** mp3 in `public/`, bestandsnaam in de prop `music`, `musicVolume` op 1. Muziek en voice-over tegelijk kan nog niet; bied een aparte voiceover-prop aan als dat nodig is.

**Voorbeeld (concept 2, 14.0 s):**
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
