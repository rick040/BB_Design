# BetaalBuddy · Walkthrough "Stel je Buddy in"

**In één zin:** een video van ongeveer een minuut die de vijf stappen van de instelpagina [/stel-je-buddy-in/](https://betaalbuddy.nl/stel-je-buddy-in/) voordoet: links (of boven) de instructies die één voor één afvinken, rechts (of onder) een telefoon die precies laat zien waar je tikt.

| | |
|---|---|
| Formaat | 16:9 1920×1080 (`BB-Walkthrough`, voor de instelpagina, YouTube en de welkomstmail) · 9:16 1080×1920 (`BB-Walkthrough-Vertical`, voor telefoon, WhatsApp en Stories) |
| Lengte | 61,8 s (7 scènes, 30 fps, 1854 frames), alles aan te passen in Remotion Studio |
| Doel | Mensen die net betaald hebben in één keer door de instelling heen helpen, en minder vragen als "ik krijg geen mail" |
| Geluid | Werkt zonder geluid: alle uitleg staat in beeld. Een voice-over-script staat onderaan |
| Bron | De instelpagina v2 (14 okt 2026, aangepast 19 okt). Kleuren, lettertypes, knoppen en teksten op de telefoon komen letterlijk van die pagina |

**Dit is geen advertentie.** Het is uitleg voor mensen die al klant zijn. Daarom staan de namen van mailprogramma's en agenda's (Gmail, Outlook, iCloud, Proton, Apple Agenda, Google Agenda) in beeld, net als op de pagina zelf: alleen als tekst, zonder logo's.

---

## Opbouw

Elke stap heeft dezelfde vorm: de voortgangsbalk (zoals op de pagina), "STAP n VAN 5", de titel en een genummerd lijstje. De regel waar je nu bent licht blauw op; zodra de telefoon hem heeft voorgedaan, wordt hij groen afgevinkt. Een tip of waarschuwing komt eronder in het blauwe infovak, net als op de pagina.

De telefoon wisselt tussen drie apps, zodat duidelijk is waar je bent:
- **de website** (met adresbalk "betaalbuddy.nl"), in de stijl van de pagina;
- **je eigen mail**, een neutrale mail-app zonder merk;
- **je agenda**, idem.

Een vingertop met een rimpeling laat zien waar je tikt.

### 1 · Intro (0,0 tot 5,0 s) · blauw
- Frame 0 is al compleet (dat is de thumbnail): "Stel je Buddy in", "5 korte stappen, samen ongeveer 5 minuten." en de stappenlijst van de pagina.
- Buddy springt op (0,33 s) en kijkt naar de lijst; de stapnummers tikken één voor één aan (1,13 tot 2,2 s).

### 2 · Stap 1: Vraag je eigen adres aan (4,5 tot 13,9 s)
- Tik op **Open mijn mail** (6,03 s); de klaargezette mail aan start@in.betaalbuddy.nl schuift omhoog.
- De regel **Van:** wordt geel gemarkeerd (7,57 s), samen met het infovak: stuur hem vanaf het adres waar je je herinneringen wilt krijgen.
- Tik op Verstuur (9,77 s), scroll naar **Verstuurd, volgende stap** en tik (12,37 s).

### 3 · Stap 2: Plak wat je van ons terugkrijgt (13,4 tot 24,0 s)
- De mail van Betaalbuddy komt binnen (14,40 s) en gaat open: doorstuuradres en agendalink.
- Lang drukken, alles selecteren, **Kopieer** (17,87 s).
- Terug naar de pagina, tik in het eerste vakje, **Plak** (20,60 s): beide vakjes vullen zich met een groen vinkje en de melding "Allebei gevonden en ingevuld".
- Infovak: "Geen mail? Wacht een paar minuten en kijk ook in je spam." (21,60 s)

### 4 · Stap 3: Stuur je rekeningen door (23,5 tot 36,5 s)
- Open de rekening van de Energieleverancier (24,83 s), tik op **Doorsturen** (26,70 s).
- Tik in "Aan", **Plak** (28,97 s): je doorstuuradres staat erin. Verstuur (30,03 s).
- Infovak "Optioneel: liever automatisch?" (31,23 s); de telefoon gaat naar het deel **Automatisch** van de pagina, tikt op Gmail (33,50 s) en toont de eerste stappen voor een regel.

### 5 · Stap 4: Zet je vervaldatums in je agenda (36,0 tot 45,2 s)
- Tik op **Apple Agenda** (37,67 s, met het label "Voor dit apparaat"); de agenda vraagt of je wilt abonneren, tik op **Abonneer** (39,47 s).
- De agenda opent en de vervaldatums ploppen erin (40,67 tot 41,5 s).
- Infovak "Mag ook later: geen agenda? Sla deze stap over. De mails zijn genoeg." (42,53 s)

### 6 · Stap 5: Doe één test (44,7 tot 55,9 s)
- Tik op **Open proefmail** (46,30 s): de proefmail van € 1,00 met dezelfde tekst als op de pagina. Verstuur (48,43 s).
- In de inbox komt de bevestiging binnen (50,43 s) en gaat open: bedrag en vervaldatum.
- Infovak "Proefmail? Tik dan op Al betaald en hij is weg." (52,63 s), tik op **Al betaald** (53,77 s).

### 7 · Klaar (55,4 tot 61,8 s) · blauw
- "Klaar. Je Buddy let op." met de samenvatting van de pagina (vijf groene vinkjes, 56,13 tot 57,2 s).
- Buddy springt van blijdschap; onderaan het woordmerk en betaalbuddy.nl/stel-je-buddy-in.

Overgangen: wipe van blauw naar de stappen en terug, en tussen de stappen een slide van rechts ("volgende stap"). Alleen CSS-overgangen, dus het rendert overal hetzelfde.

---

<!-- copycheck:off -->
## Copy en productclaims

Alle teksten volgen de instelpagina. Geen "gratis", geen WhatsApp of Telegram, geen "scant je inbox", geen prijzen, geen gedachtestreepjes.

- **Merknamen:** Gmail, Outlook, iCloud, Proton, Apple en Google staan alleen in beeld omdat de pagina ze als keuze noemt. `check_copy.py` meldt ze; dat is hier bewust.
- **Herinneringen:** de video belooft nergens "7 en 2 dagen van tevoren", want Basic heeft geen herinneringen. In de bevestigingsmail staat alleen "Klopt dit? Dan hoef je niets te doen."
- **Voorbeelddata:** sanne@mijnmail.nl, a8f3k@in.betaalbuddy.nl (het voorbeeld van de pagina), de agendalink, de rekening van de Energieleverancier (€ 84,20, 28 oktober 2026) en de proefmail met vervaldatum 02-11-2026 (vandaag + 14 dagen, zoals de pagina rekent). Allemaal aan te passen onder `example`.

## Open controles
- **De twee mails van Betaalbuddy zijn nagemaakt.** De welkomstmail (onderwerp "Je Buddy staat klaar") en de bevestiging ("Genoteerd: Betaalbuddy test", met de knop "Al betaald") laten zien wat erin staat, maar niet hoe de echte mails eruitzien. Vergelijk ze met de echte mails van noreply@betaalbuddy.nl en pas onderwerp en tekst aan in `src/walkthrough/scenes/Step2Scene.tsx` en `Step5Scene.tsx`.
- **Agenda en Basic.** Basic heeft geen agenda. De pagina laat stap 4 aan iedereen zien (met "Sla over"), en de video doet dat ook. Moet stap 4 voor Basic weg, dan geldt dat voor de pagina én de video.
- **Lettertype.** De titels in de video gebruiken Poppins, net als de instelpagina, zodat de video en de pagina er hetzelfde uitzien. De ads gebruiken Space Grotesk. Liever Space Grotesk? Verander één regel: `heading` in `src/walkthrough/tokens.ts`.
- **Waar de video komt.** Voorstel: de 16:9-versie bovenaan de instelpagina (of achter "Hulp nodig?") en als link in de welkomstmail; de 9:16-versie voor WhatsApp en support.
<!-- copycheck:on -->

---

## Voice-over (optioneel, ElevenLabs, Multilingual v2)

De video werkt zonder geluid. Wil je toch een stem eronder, gebruik dan dit script. Rustig tempo, vriendelijk en zakelijk.

```
Zo stel je je Buddy in. <break time="0.4s" /> Vijf korte stappen, samen ongeveer vijf minuten.
<break time="0.8s" />
Stap één. Tik op Open mijn mail. <break time="0.5s" /> Er staat al een mail klaar. Stuur hem vanaf het adres waar je je herinneringen wilt krijgen. <break time="0.3s" /> Druk op Verstuur, en ga naar de volgende stap.
<break time="0.8s" />
Stap twee. Je krijgt een mail terug met je doorstuuradres en je agendalink. <break time="0.3s" /> Kopieer de hele mail, <break time="0.3s" /> en plak hem op de pagina. Wij vullen alles voor je in. <break time="0.3s" /> Geen mail? Kijk ook in je spam.
<break time="0.8s" />
Stap drie. Open een rekening in je mail. <break time="0.4s" /> Kies Doorsturen, <break time="0.4s" /> plak je doorstuuradres en verstuur. <break time="0.5s" /> Liever automatisch? Op de pagina staat per mailprogramma hoe dat moet.
<break time="0.8s" />
Stap vier. Kies je agenda en tik op Abonneer. <break time="0.3s" /> Vanaf nu komen je vervaldatums er vanzelf in. <break time="0.3s" /> Geen agenda? Sla deze stap gerust over.
<break time="0.8s" />
Stap vijf: doe één test. Tik op Open proefmail en druk op Verstuur. <break time="0.4s" /> Binnen een paar minuten krijg je een mail met het bedrag en de vervaldatum. <break time="0.3s" /> Was het de proefmail? Tik op Al betaald, en hij is weg.
<break time="0.8s" />
Klaar. Je Buddy let op. <break time="0.3s" /> Stuur voortaan gewoon je rekeningen door. Wij seinen je op tijd.
```

De beeldmomenten kloppen op het frame (`timeline.py` op de scène-timings en de constanten in `src/walkthrough/scenes/`). De starttijden van de zinnen zijn een richtwaarde; ze hangen af van de stem.

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,2 | Zo stel je je Buddy in. Vijf korte stappen… | Titel en stappenlijst op frame 0, nummers tikken aan 1,13 tot 2,2 s |
| 5,0 | Stap één. Tik op Open mijn mail. | Tik 6,03 s, mail schuift op 6,23 s |
| 7,4 | Er staat al een mail klaar. Stuur hem vanaf het adres… | "Van" gemarkeerd 7,57 s |
| 10,3 | Druk op Verstuur, en ga naar de volgende stap. | Tik Verstuur 9,77 s, volgende stap 12,37 s |
| 14,0 | Stap twee. Je krijgt een mail terug… | Mail komt binnen 14,40 s, geopend 15,60 s |
| 16,8 | Kopieer de hele mail, | Selectie 16,60 s, Kopieer 17,87 s |
| 18,6 | en plak hem op de pagina. Wij vullen alles voor je in. | Naar de pagina 18,67 s, Plak 20,60 s, ingevuld 20,73 s |
| 21,7 | Geen mail? Kijk ook in je spam. | Infovak 21,60 s |
| 24,0 | Stap drie. Open een rekening in je mail. | Tik 24,83 s |
| 26,0 | Kies Doorsturen, plak je doorstuuradres en verstuur. | Doorsturen 26,70 s, Plak 28,97 s, Verstuur 30,03 s |
| 31,2 | Liever automatisch? Op de pagina staat per mailprogramma hoe dat moet. | Infovak 31,23 s, tegel 33,50 s |
| 36,6 | Stap vier. Kies je agenda en tik op Abonneer. | Apple Agenda 37,67 s, Abonneer 39,47 s |
| 40,2 | Vanaf nu komen je vervaldatums er vanzelf in. | Vervaldatums 40,67 tot 41,5 s |
| 42,6 | Geen agenda? Sla deze stap gerust over. | Infovak 42,53 s |
| 45,2 | Stap vijf: doe één test. Tik op Open proefmail en druk op Verstuur. | Proefmail 46,30 s, Verstuur 48,43 s |
| 49,4 | Binnen een paar minuten krijg je een mail… | Bevestiging komt binnen 50,43 s, geopend 51,50 s |
| 52,7 | Was het de proefmail? Tik op Al betaald, en hij is weg. | Infovak 52,63 s, tik 53,77 s |
| 55,9 | Klaar. Je Buddy let op. Stuur voortaan… | Vinkjes 56,13 tot 57,2 s, woordmerk 57,73 s |

**Doellengte:** de mp3 mag tot ongeveer 61 s duren (zo'n 150 woorden). Te lang? Zet de speed op 1,05 of maak de breaks van 0,8 s korter. Lukt het niet in één keer, genereer dan per stap en zet elk stuk op zijn starttijd.

**Onder de video zetten:** zet de mp3 in `public/` (bijvoorbeeld `vo-walkthrough.mp3`) en vul die naam in bij de prop `voiceover`. Muziek kan er los bij via `music` en `musicVolume` (standaard 0,25, zodat de stem erboven blijft).

---

## Aanpassen en exporteren
- **Studio:** `npm run dev`, map **Walkthrough-Stel-je-Buddy-in**, composities `BB-Walkthrough` (16:9) en `BB-Walkthrough-Vertical` (9:16).
- **Blijvend aanpassen:** `src/walkthrough/schema.ts` (`defaultWalkthroughProps`): de titels, instructies en infovakken per stap, de intro en het slot, de voorbeelddata en de lengte per scène. `**vet**` maakt een woord vet, `\n` breekt de regel.
- **Teksten op de telefoon** (knoppen, labels) komen van de pagina en staan in `src/walkthrough/scenes/` en `src/walkthrough/screens/page.tsx`. Verandert de pagina, pas ze daar aan.
- **Timing van de beats:** de constanten bovenin elke scène (`INTRO_T`, `STEP1_T` … `STEP5_T`, `DONE_T`). Waar de vinger tikt, zoekt hij zelf op (`data-tap` op het element), dus na een layoutwijziging hoeft er niets te worden uitgemeten. Verander je de beats, reken de cue-tabel opnieuw uit met `timeline.py`.
- **Exporteren:** `npm run render:walkthrough` (16:9), `npm run render:walkthrough:vertical` (9:16), `npm run still:walkthrough` (cover, frame 60).
