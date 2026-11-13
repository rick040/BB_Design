# BetaalBuddy · Instagram ad, concept 83

## "Afgemeten. Altijd in te zien." (rolmaat)

**In één zin:** Buddy trekt een rolmaat uit met jouw rekening als label aan het uiteinde, meet af tot de vervaldatum en dan veertien dagen verder, waar de velden van het label oplossen; de rolmaat schiet terug naar vandaag en één mail naar gegevens@ laat precies zien wat Buddy nu van je heeft.

| | |
|---|---|
| USP | `inzage` (het langst niet gebruikt: laatst concept 75 volgens de changelog) |
| Vorm | Eén doorlopend shot zonder scènewissel, tekst op de stem (niet in 80, 81, 82) |
| Formaat | Alleen 9:16 Reel 1080×1920 met stem (`BB-Rolmaat-Reel`) |
| Lengte | 13,07 s (392 frames, 30 fps): stem 12,04 s plus 1 s CTA |
| Stem | ElevenLabs, voice uit `ELEVENLABS_VOICE_ID`, model eleven_v4, stability 0,5, similarity 0,75, één take via `/with-timestamps` |
| Aanpassen | `src/rolmaat/schema.ts` (teksten, velden, datums, kleuren); beats in `ROL_T` (`src/rolmaat/RolmaatAd.tsx`) uit `public/vo/rolmaat/timing.json` |
| Render | `npm run render:rolmaat`, daarna loudnorm (I -14, TP -1, LRA 11) naar `renders/rolmaat-reel-vo.mp4` |

### Uniciteit (zie CONCEPTEN.md en changelog voor 63 tot 82)
| | 1 | 2 | 3 | 62 | 65 / 75 (inzage) | **83** |
|---|---|---|---|---|---|---|
| Invalshoek | Overzicht | Timing | Privacy | Wegleggen | Inzage | **Inzage: hoe lang, en zelf zien** |
| Visueel systeem | UI | Typografisch | Focus | Vluchtbanen | Glazen la / röntgenscanner | **Rolmaat over een dagliniaal, camera volgt** |
| Buddy | Slikt rekening | Rijdt mee | Slaapmasker | Vangt en gooit | Trekt la open / zet koffer op band | **Trekt de rolmaat uit, wordt teruggerukt** |
| Einde | Belofte | Uitkomst | Regie | Omkering | Inzage-overzicht | **Knop komt als meetlint uit de rolmaat** |
| Overgangen | iris, slide | clock-wipe, slide | wipe, focus pull | swing, spin-return | diverse | **geen cuts: volgcamera, zoom-out, terugschiet-whip, blauwe vloed** |

Verschilt op 5 van 5 punten met elk concept in de index.

## Storyboard (één shot; segmenten = eerste gesproken woord per marker)

| Segment | Tijd | Beeld |
|---|---|---|
| S1 · Hook | 0,00 tot 2,17 s | Kop "Hoe lang bewaart Buddy jouw rekening?" staat op frame 0. Rekeninglabel Energieleverancier met vier velden (bedrag, vervaldatum, betaallink, kenmerk) hangt aan het uiteinde van een rolmaat; Buddy kijkt op naar het label. |
| S2 · Afmeten | 2,17 tot 4,77 s | "Hij meet het af." Buddy trekt het lint uit, camera volgt; op "vervaldatum" (3,67 s) licht het label vervaldatum op de dagliniaal op (do 17 dec). |
| S3 · Plus 14 | 4,77 tot 7,60 s | "Plus 14 dagen. Daarna is het weg." Teller +0 tot +14 dagen, camera zoomt uit tot vervaldatum en do 31 dec allebei in beeld zijn; op "weg" (7,03 s) lossen de velden op en blijft een gestippeld label "Weg." over. |
| S4 · Inzage | 7,60 tot 10,80 s | Buddy laat los en wordt met het lint teruggerukt naar vandaag; het label vult zich weer. "Eén mail" (8,87 s): pil gegevens@; label draait om naar "Dit heeft Buddy van je" met de vier velden gemarkeerd op "ziet" (10,03 s) en "Bewaard tot do 31 dec". |
| S5 · CTA | 10,80 tot 13,07 s | Blauwe vloed vanuit de rolmaat. Tagline "Afgemeten. Altijd in te zien.", knop "activeer buddy" rolt als meetlint uit een witte rolmaat, Buddy trekt aan het eind en geeft een ruk op "Buddy" (11,7 s); woordmerk en "Geen app. Geen bankkoppeling." |

## Voice-over (ElevenLabs, één take, 32 woorden)

```
[S1] Hoe lang bewaart Buddy jouw rekening? [S2] Hij meet het af. Tot de vervaldatum, [S3] plus veertien dagen. Daarna is het weg. [S4] Wat hij nu heeft? Eén mailtje, en je ziet het. [S5] Activeer Buddy.
```
Luistertoets: langste pauze tussen woorden 0,32 s (alignment); silencedetect -35 dB max 0,48 s. Scènestarts frames 0, 65, 143, 228, 324; einde stem 362.

## Caption
Zie `renders/rolmaat-caption.md`.

## Ads Manager
- Primaire tekst (116): Hoe lang bewaart Buddy je rekening? Tot 14 dagen na de vervaldatum. Daarna is het weg, en je kunt het altijd inzien.
- Kop (29): Afgemeten. Altijd in te zien.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

<!-- copycheck:off -->
## Copyregels
Retentie volgens brand §2: bewaard tot 14 dagen na de vervaldatum, geen "bewaart niets" of "direct verwijderd". Geen prijs, geen pakket, geen "gratis", geen AI-claim.
<!-- copycheck:on -->

## Open punten
- Bevestigen dat een mail naar gegevens@ een overzicht terugstuurt zoals het label in S4 (open sinds 65) en het volledige adres.
- Of Buddy naast de vier velden ook afzender of naam bewaart; dan het label aanvullen.
- Instappagina voor knop en link in bio: "privacy zonder mailboxkoppeling" past het best.
- Datums staan op december (vandaag di 8 dec, vervaldatum do 17 dec, weg do 31 dec).
