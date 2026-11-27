Campagnecode: W2 · Campagne: bb_warm_2612

# BetaalBuddy · Instagram-ad, Meta-campagne 2612, W2

## "Brief van de maker"

**In één zin:** voor mensen die Buddy al zagen maar twijfelen: een korte brief van Rick zelf, die laat zien wie erachter zit en wat Buddy wel en niet met je mail doet.

| | |
|---|---|
| Formaat | Static 4:5 1080×1350 (`BB_W2_Brief_static.png`, zoals in het campagneplan) · plus Reel 9:16 1080×1920 (`BB-W2Brief-Reel`) en 4:5 video (`BB-W2Brief-Feed`) |
| Lengte video | 15,0 s, één doorlopend shot (30 fps), alles aan te passen in Remotion Studio |
| Laag | Warm, campagne bb_warm_2612, retargeting, geoptimaliseerd op InitiateCheckout. Doel: vertrouwen |
| Safe zone | `adSafeZone` aan (default): kop, brief en knop tussen y=280 en y=1250 in 9:16 |
| Geluid | Werkt zonder geluid. Voice-over is een extra laag en zegt alleen wat op de brief staat |
| Code | `src/brief-maker/` · Studio-map `Campagne2612-W2-Brief` |

W2 stond niet in PM-150 (die had zeven Reel-briefs). De brief komt uit het campagneplan "Betaalbuddy Meta-campagne op €2 per dag", sectie Advertenties. Het plan vraagt een static; omdat Rick er een voice-over bij wil, is er ook een videoversie. De static is het laatste beeld van de video zonder knop.

### Hoe dit verschilt van de eerdere concepten

| | K1 | K2 | K3 | W1 | **W2** |
|---|---|---|---|---|---|
| Invalshoek | Achteraf betalen | Incassokosten | Eigen huis | Uitleg in stappen | **Vertrouwen: wie maakt dit** |
| Visueel systeem | Kalender, pakketjes | Rollend bedrag | Uitwaaieren | Telefoon-UI | **Eén brief die zichzelf typt, handtekening** |
| Rol van Buddy | Vangt mail | Op rekening | Vangt kaarten | Kijkt mee | **Klein in de hoek, springt erbij als de brief getekend is** |
| Einde | Uitleg-CTA | Terugspoelen | Orde | Actie + prijs | **Persoonlijk: handtekening van de maker** |
| Overgangen | jaloezie | rol-cut | deuren, flip, fade | sheet, slide | **geen: één doorlopend shot** |

---

## Storyboard (gemeten tijden)

- **0,00 s (cover):** kop "Wie maakt Betaalbuddy?" en een witte brief op #E8EEFF met "Hoi," en de eerste zin al getypt: "Ik ben Rick en ik maak Betaalbuddy in Geldrop."
- **3,30 s:** "Buddy leest je mail niet. Hij pakt de betaaldatum en gooit de rest weg." typt zichzelf.
- **7,60 s:** "Geen bankkoppeling, geen toegang tot je inbox."
- **10,40 s:** "Vragen? Mail me gewoon."
- **11,60 s:** de handtekening "Rick" tekent zich, met daaronder "Rick, maker van Betaalbuddy".
- **12,30 s:** Buddy springt klein in de rechterhoek van de brief.
- **12,90 s tot 15,00 s:** knop "Wie maakt dit?" onder de brief.

**Afwijkingen van het plan**
- Naast de static is er een video met typende brief, zodat de voice-over erbij past. De tekst op de brief is letterlijk die uit het plan.
- Bovenaan staat de kop "Wie maakt Betaalbuddy?" (de Ads Manager-kop), zodat frame 0 meteen de vraag stelt.
- In de video staat onderaan een knop "Wie maakt dit?" (de naam van de bestemmingspagina). De static heeft geen knop, zoals in het plan.
- De handtekening is een getekend pad in merkblauw, geen lettertype; het blijft dus scherp en rendert overal gelijk.

---

<!-- copycheck:off -->
## Copyregels
- "Buddy leest je mail niet. Hij pakt de betaaldatum en gooit de rest weg." Klopt met de productuitleg; niet uitbreiden naar "Buddy bewaart niets" (bedrag en datum blijven tot 14 dagen na de vervaldatum).
- Geen prijs, geen "gratis", geen geld-terug in beeld.
<!-- copycheck:on -->

## Voice-over (ElevenLabs, Multilingual v2, Speed 1.0)

De brief is in de ik-vorm van Rick. Het mooiste is dat Rick hem zelf inspreekt (of met een eigen stemkloon). Met de stem Roos past de derde persoon beter.

**Ik-vorm (Rick zelf):**
```
<break time="0.3s" /> Ik ben Rick en ik maak Betaalbuddy in Geldrop. <break time="0.2s" /> Buddy leest je mail niet. Hij pakt de betaaldatum en gooit de rest weg. <break time="0.4s" /> Geen bankkoppeling, geen toegang tot je inbox. Vragen? Mail me gewoon.
```

**Derde persoon (stem Roos):**
```
<break time="0.3s" /> Dit is Rick. Hij maakt Betaalbuddy in Geldrop. <break time="0.2s" /> Buddy leest je mail niet. Hij pakt de betaaldatum en gooit de rest weg. <break time="0.4s" /> Geen bankkoppeling, geen toegang tot je inbox. Vragen? Mail Rick gewoon.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,3 | Ik ben Rick en ik maak Betaalbuddy in Geldrop. | Brief met de eerste zin staat (frame 0) |
| 3,4 | Buddy leest je mail niet. Hij pakt de betaaldatum en gooit de rest weg. | Zin 2 typt vanaf 3,30 s |
| 7,7 | Geen bankkoppeling, geen toegang tot je inbox. | Zin 3 typt vanaf 7,60 s |
| 10,6 | Vragen? Mail me gewoon. | Zin 4 typt vanaf 10,40 s; handtekening 11,60 s |

Doellengte mp3: ~11,8 s (34 woorden). Daarna 3 s stilte voor handtekening, Buddy en knop.

## Ads Manager (bb_warm_2612)

Letterlijk uit het campagneplan; geen afwijkingen nodig.

| Veld | Tekst |
|---|---|
| Primaire tekst | Achter Betaalbuddy zit geen groot bedrijf, maar één maker uit Geldrop. Ik bouwde het omdat een betaalmail zo makkelijk wegzakt tussen de rest. Je stuurt alleen de mails door die je wilt onthouden, de rest van je inbox blijft van jou. |
| Kop | Wie maakt Betaalbuddy? |
| Beschrijving | Klein bedrijf, KvK 89078802 |
| Knop | Meer informatie |
| URL | https://betaalbuddy.nl/wie-maakt-dit/?utm_source=meta&utm_medium=paid_social&utm_campaign=bb_warm_2612&utm_content=w2_brief |

## Caption (organisch)

```
Wie zit er eigenlijk achter Buddy? Geen groot bedrijf. Ik. 👋

Ik ben Rick en ik maak Betaalbuddy in Geldrop.
📩 Je stuurt alleen de rekeningen door die je wilt onthouden
📌 Buddy pakt de betaaldatum en zet hem in je agenda
🗑️ De rest van de mail gooit hij weg

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Lees wie het maakt via de link in bio

#betaalbuddy #maker #rekeningen #geldzaken #privacy
```

## Open controles
- **"Mail me gewoon":** er staat geen mailadres op de brief. Wil je er een op (bijvoorbeeld een start@- of contactadres), zet het dan in `paragraphs` in het schema.
- **Pagina** `/wie-maakt-dit/`: checken of die zo live staat (het plan noemt de paden als bestandsnamen uit het project).
- **Merknaam:** het campagneplan schrijft "Betaalbuddy"; de rest van de repo "BetaalBuddy". De brief volgt het plan.
