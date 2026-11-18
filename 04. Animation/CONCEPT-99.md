# BetaalBuddy · Instagram ad, concept 99

## "Alles in het zicht." (waslijn)

**In één zin:** een app is een dichte, donkere doos waar je rekening in verdwijnt; bij Buddy hangt alles wat hij van je rekening heeft gewoon aan de waslijn (bedrag, vervaldatum, betaallink, kenmerk), en veertien dagen na de vervaldatum haalt hij het er weer af.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Waslijn-Reel`) · 4:5 feed 1080×1350 (`BB-Waslijn-Feed`) |
| Lengte | 13,97 s (419 frames, 30 fps): stem 12,96 s plus 1 s CTA |
| USP | `inzage` (langst ongebruikt volgens de changelog: laatst concept 91; 92 tot 98 alle andere USP's) |
| Vorm | Eén doorlopend shot (niet in 96, 97, 98) |
| Stem | ElevenLabs-API, voice uit `ELEVENLABS_VOICE_ID` (7qdUFMklKPaaAVMsBTBt), model eleven_v4, nl, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/waslijn/schema.ts` (teksten, kleuren, `withVoice`); timing uit `public/vo/waslijn/timing.json` |
| Render | `npm run render:waslijn`, `render:waslijn:feed`, `render:waslijn:stil`, `render:waslijn:feed:stil`; daarna loudnorm (I -14, TP -1, LRA 11) |

Gekozen metafoor: waslijn met knijpers. Afgevallen: zandloper van veertien dagen (te dicht op teller-concepten) en aquarium (te dicht op glazen la). "Waslijn" en "wasknijper" komen niet voor in de changelog-map.

### Uniciteit
| | 91 Uitleenkaart (inzage) | 94 Kudde (één shot) | 97 Kruiswoord | 98 Zakdoek | **99 Waslijn** |
|---|---|---|---|---|---|
| Invalshoek | inzage | overzicht | geen-ai | agenda | **inzage: alles hangt in het zicht, en gaat weer weg** |
| Visueel systeem | uitleenkaart, stempels | wei met schapen | kruiswoordraster | zakdoek, twee schermen | **dichte donkere doos tegenover open waslijn** |
| Buddy | stempelt | herdershond | vult hokjes | trekt knopen los | **hangt velden op, haalt ze weer af** |
| Einde | lege kaart terug | samen liggen | vinkje | vlaggetje | **"Lijn leeg", daarna Buddy zelf aan de lijn** |
| Slotbeeld CTA | kaart in zakje | Buddy en schaap | potlood-vinkje | zwaaiende zakdoek | **Buddy hangt met een knijper op zijn hoofd aan de lijn en zwaait uit** |
| Overgangen | kaartenbak, inktstempel | tilt naar de lucht | hokjes, arcering | split, overname | **horizontale camerapan met meekleurende achtergrond, waaiend laken** |

Verschilt op minstens vijf van zes punten met elk concept in de index en met de laatste concepten uit de changelog.

---

## Storyboard (scènestart = eerste gesproken woord per marker)

| Scène | Tijd | Beeld |
|---|---|---|
| 1 · Hook (licht) | 0,00 tot 2,33 s | Kop "Wat bewaart een app van je rekening?" staat op frame 0, met de rekening van de Energieleverancier (€87,60) boven een dichte donkere doos met hangslot en label "app". De rekening zakt de gleuf in (weg op "app", 1,07 s), de doos rammelt op "rekening" (1,37 s), drie vraagtekens en chip "Geen idee." |
| 2 · Waslijn (pan naar blauw) | 2,33 tot 8,40 s | De camera pant naar rechts en de achtergrond kleurt mee naar blauw. Buddy hopt binnen op "Buddy" (2,47 s), de rekening verschijnt boven hem op "zie". Kop "Je ziet precies wat er hangt." woord voor woord op de stem. Elk veld vliegt uit de rekening en hangt met een gele knijper aan de lijn op het gesproken woord: Bedrag €87,60 (4,63 s), Vervaldatum do 17 dec (5,43 s), Betaallink (6,53 s), Kenmerk (7,37 s). Subregel "Wat heeft Buddy van je? Mail gegevens@." |
| 3 · Weg (zelfde lijn) | 8,40 tot 11,67 s | Kop wisselt naar "Veertien dagen na de vervaldatum: weg." op de stem. Teller onder "Vervalt do 17 dec" telt +0 tot +14 dagen. Op "haalt" (10,47 s) springen de knijpers eraf en vallen de kaartjes; op "weg" (11,13 s) wordt de teller "Lijn leeg" met vinkje. Subregel "Eerder weg? Mail stop@." |
| 4 · CTA (blauw, laken) | 11,67 tot 13,97 s | Een waslaken waait van links naar rechts door beeld en laat de CTA achter zich. Slotkop "Alles in het zicht.", Buddy hangt met een knijper op zijn hoofd aan de lijn en zwaait uit, knop "activeer buddy" op "Activeer", woordmerk op "Buddy", tik op 12,90 s. |

## Voice-over (ElevenLabs, één take, 32 woorden, 12,96 s)

Naar ElevenLabs gestuurd (zonder markers):
```
Wat bewaart een app van je rekening? Bij Buddy zie je precies wat er hangt: bedrag, vervaldatum, betaallink en kenmerk. En veertien dagen na de vervaldatum haalt hij het weg. Activeer Buddy.
```
Met scènemarkers:
```
[S1] Wat bewaart een app van je rekening? [S2] Bij Buddy zie je precies wat er hangt: bedrag, vervaldatum, betaallink en kenmerk. [S3] En veertien dagen na de vervaldatum haalt hij het weg. [S4] Activeer Buddy.
```

| Marker | Start (s) | Frame | Zin | Beeld |
|---|---|---|---|---|
| S1 | 0,00 | 0 | Wat bewaart een app van je rekening? | Rekening zakt in de dichte doos, doos rammelt |
| S2 | 2,33 | 70 | Bij Buddy zie je precies wat er hangt: bedrag, vervaldatum, betaallink en kenmerk. | Pan naar de waslijn, vier velden aan de lijn op hun woord (139, 163, 196, 221) |
| S3 | 8,40 | 252 | En veertien dagen na de vervaldatum haalt hij het weg. | Teller +14 dagen, knijpers eraf vanaf "haalt" (314), "Lijn leeg" op "weg" (334) |
| S4 | 11,67 | 350 | Activeer Buddy. | Laken waait de CTA in, knop op "Activeer" |

Luistertoets: langste pauze tussen woorden 0,20 s (alignment); silencedetect -35 dB langste stilte 0,48 s. Eerste take had 33 woorden ("eigenlijk" erin, 13,44 s) en is vervangen door deze take van 32 woorden.

## Caption
Zie `renders/waslijn-caption.md`.

## Ads Manager
- Primaire tekst (110): Wat bewaart een app van je rekening? Bij Buddy zie je precies wat er is, tot veertien dagen na de vervaldatum.
- Kop (19): Alles in het zicht.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Volgt brand §2 en §3: retentie tot 14 dagen na de vervaldatum (geen "bewaart niets" of "direct verwijderd"), inzage via gegevens@, eerder verwijderen via stop@. Geen prijs, geen "gratis", geen AI-claim, geen merknamen, geen rood (waarschuwingen in #111827).
<!-- copycheck:on -->

## Open controles
- Bevestigen dat Buddy van een rekening echt alleen bedrag, vervaldatum, betaallink en kenmerk bewaart (de caption zegt "alleen"); bewaart hij ook de afzender, zet die dan als vijfde kaartje erbij of haal "alleen" weg.
- Bevestigen dat een mail naar gegevens@ dit overzicht terugstuurt.
- Instappagina voor knop en link in bio: privacy zonder mailboxkoppeling past het best; pad nog niet bevestigd.
- Datums staan op december.
