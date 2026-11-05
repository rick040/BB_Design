# BetaalBuddy · video-backlog (34 video's)

Een voorraad kant-en-klare Reels en TikToks voor dagen waarop er niets anders te posten is. Elke video staat op één van acht herbruikbare templates; een video is alleen een set props. Alles is 9:16 (1080 × 1920, 30 fps); acht video's hebben ook een 4:5-versie voor de feed.

- **Renders:** `renders/backlog/<ID>-Reel.mp4` (+ `-Feed.mp4`) en per versie een `-cover.png`.
- **Bewerken:** `npm run dev` → map *Backlog-P1-Herkenning* … *Backlog-P6-Humor* in Remotion Studio. Teksten staan in `src/backlog/videos/p1-…p6-….ts`.
- **Opnieuw renderen:** `node scripts/render-backlog.cjs` (alles) of `node scripts/render-backlog.cjs BB-P2-03,BB-P4-01`. Coverframes staan in `renders/backlog/covers.json`.
- **Geluid:** alles is zonder geluid te volgen. Muziek: zet een rechtenvrije mp3 in `public/` en vul `music` in. Voice-over: plak het blok in ElevenLabs (Multilingual v2, Speed 1,0) en leg de mp3 in je editor onder de video.

## Templates

| Template | Bestand | Wat het doet | Overgang |
|---|---|---|---|
| POV | `src/backlog/templates/Pov.tsx` | gele POV-sticker op een scherm-moment, 1 tot 3 beats | slide van onder |
| Dingen die niemand je vertelt / tierlist | `src/backlog/templates/List.tsx` | genummerde (of tier-)kaarten stapelen in, dan payoff | wipe van boven |
| Voor/na | `src/backlog/templates/Split.tsx` | één beeld; een gele scheidslijn veegt alles om naar ‘na’ | fade |
| Countdown | `src/backlog/templates/Countdown.tsx` | reusachtig rollend getal met bijschrift en melding per stap | klok-wipe |
| Mythe vs feit / quiz | `src/backlog/templates/MythFact.tsx` | kaart met bewering draait om naar het antwoord, max. 4 | flip |
| Mini-explainer | `src/backlog/templates/Explainer.tsx` | genummerde stappen, één visual per stap | push van rechts |
| Skit | `src/backlog/templates/Skit.tsx` | geanimeerde chat met typ-puntjes, ‘niet bezorgd’, systeemregels | slide van rechts |
| Getallen-reveal | `src/backlog/templates/NumberReveal.tsx` | getal telt op, oude waarde doorgestreept, badge met verschil | iris |

Alle templates delen `common.ts` (zod-basis: kleuren, eindkaart, timing, muziek, safe zones), `EndCard.tsx` (merk altijd in beeld vanaf ~2,6 s voor het einde) en de visual-bibliotheek in `src/backlog/visuals/` (15 soorten: rekening, inbox, meldingen, agenda, doorsturen, chips, filterregel, velden, klok, Buddy, grote tekst, mail, weekoverzicht, regels, lijst). Bestaande componenten (`Buddy`, `BillCard`, `Notification`, `RollingNumber`, `CtaPill`, `Wordmark`, `Checkmark`, `SafeZones`, `Headline/Subline`) zijn hergebruikt; de drie bestaande concepten zijn niet aangeraakt.

## Bronnen en feitencheck

| Claim in de video's | Bron |
|---|---|
| Geen account, geen wachtwoord, geen inlog | EmailTool `README.md:3, 52`; `docs/MANIFEST.md:66-70` |
| Geen AI; vaste regels (bedrag achter ‘totaal’, datum achter ‘vervaldatum’) | `docs/MANIFEST.md:40-48`; `scripts/check_no_ai.py` |
| Ruwe mail alleen in het geheugen, ‘een paar honderd milliseconden’ (in beeld als ± 300 ms) | `docs/MANIFEST.md:33`; `README.md:17-19` |
| Bewaard: bedrag, datum, afzender, IBAN/kenmerk/link; niet: mailtekst, bijlagen, naam/adres, geschiedenis | `supabase/migrations/0003_obligations.sql`, `0001_profiles.sql`; `README.md:21, 190-192` |
| Betaald gemeld = direct verwijderd | `app/ingest.py:492` (`delete_obligation`) |
| Herinnering 7 en 2 dagen vooraf, met betaalgegevens als die in de rekening stonden | `app/jobs/reminders.py:117-213`; `app/templates/reminder.txt` |
| Te laat doorgestuurd → alsnog een seintje | `app/jobs/reminders.py:148-165` |
| Weekoverzicht op maandag | `app/jobs/reminders.py:69`; `app/templates/weekly.txt` |
| Agenda-abonnement ‘Facturen’, alarm 7 en 2 dagen, ververst zichzelf | `app/ics.py:57-115`; `welcome.txt` |
| Kan het niet lezen → vraagt datum en bedrag, verzint niets; scans zonder tekst niet vanzelf (geen OCR) | `app/templates/needs_info.txt`; `app/extraction/pdf.py:23-28`; `MANIFEST.md:50-56, 108-110` |
| Mail ‘gegevens’ → elk veld + JSON/CSV; mail ‘stop’ → alles direct weg | `README.md:203-213`; `gegevens.txt`; `goodbye.txt`; `MANIFEST.md:72-76` |
| Filterregel om automatisch door te sturen | `app/templates/welcome.txt` |
| Aanmelden = betalen, daarna eigen doorstuuradres | `README.md:172-176`; BB_Design `brand-betaalbuddy.md:67` |
| Incassokosten minimaal €40, pas na een kosteloze veertiendagenbrief | Besluit vergoeding voor buitengerechtelijke incassokosten, art. 2 lid 2 (Stb. 2012, 141); art. 6:96 lid 6 BW. Ook `MANIFEST.md:8` |
| Verkeersboete +50% na de eerste aanmaning, daarna ‘nog meer’ (+100%) | WAHV art. 23; CJIB position paper april 2026. Sinds 1 juli 2026 stuurt het CJIB eerst een gratis herinnering; de video zegt daarom alleen ‘na de eerste aanmaning’. Ook `MARKETINGPLAN.md:48` |
| Telefoonabonnement kan geblokkeerd worden | `docs/MARKETINGPLAN.md:51` (geformuleerd met ‘kan’) |

**Bewust weggelaten:** prijzen en ‘gratis’/proefperiode (pakketten Basic/Standard/Premium, Basic heeft geen herinneringen; `brand-betaalbuddy.md:67-68`), merknamen, BKR- en CAK-claims, WhatsApp, ‘bewaart niets’. Bedragen in beeld (€86,40, €128,95 …) zijn voorbeelden, geen statistieken.

## Volgorde om te posten

Pijlers wisselen elkaar steeds af (nooit twee keer dezelfde pijler achter elkaar). Bij 3 tot 5 posts per week is dit 7 tot 11 weken materiaal. Video's met een vast moment (Black Friday, Moederdag, januari) mag je naar voren of achteren schuiven; houd de afwisseling aan.

| # | ID | Pijler | Titel | Moment |
|---|---|---|---|---|
| 1 | [BB-P1-01](#bb-p1-01) | Herkenning | Niet slecht met geld | Een maandagochtend; extra sterk op Blue Monday (derde maandag van januari) |
| 2 | [BB-P2-01](#bb-p2-01) | Zo werkt het | 3 tikken | Direct na de lancering en vast bovenaan je profiel (pinnen) |
| 3 | [BB-P4-01](#bb-p4-01) | Geld en gevolgen | €12 wordt €52 | Eind van de maand (25e tot 31e) |
| 4 | [BB-P3-01](#bb-p3-01) | Privacy | Wat Buddy bewaart (en niet) | Rond Data Privacy Day (28 januari) of na privacynieuws |
| 5 | [BB-P6-03](#bb-p6-03) | Humor | Tierlist | Zondagmiddag (comments-magneet) |
| 6 | [BB-P5-03](#bb-p5-03) | Mythes en bezwaren | 3 dingen die Buddy niet doet | Doordeweeks; goed als eerste kennismaking voor nieuwe volgers |
| 7 | [BB-P1-02](#bb-p1-02) | Herkenning | Zoek de vervaldatum | Doordeweeks 19:00 tot 21:00 |
| 8 | [BB-P2-03](#bb-p2-03) | Zo werkt het | Last-minute doorgestuurd | Rond de 25e tot 28e van de maand, als de rekeningen zich opstapelen |
| 9 | [BB-P4-03](#bb-p4-03) | Geld en gevolgen | De hele afweging | Salarisdag (rond de 25e) |
| 10 | [BB-P3-02](#bb-p3-02) | Privacy | Een paar honderd milliseconden | Willekeurige doordeweekse dag; sterk na een datalek in het nieuws |
| 11 | [BB-P6-01](#bb-p6-01) | Humor | Zet het in je agenda | Rond Moederdag (9 mei 2027) of een zondag |
| 12 | [BB-P5-01](#bb-p5-01) | Mythes en bezwaren | Mijn bank-app doet dit al | Als reactie zodra deze vraag in de comments opduikt; anders doordeweeks |
| 13 | [BB-P1-05](#bb-p1-05) | Herkenning | Wat school vergat | Begin schooljaar (eind augustus, begin september) of tentamenweken |
| 14 | [BB-P2-02](#bb-p2-02) | Zo werkt het | Je agenda weet het eerder | Eerste week van januari (nieuw jaar, nieuwe planning) |
| 15 | [BB-P4-06](#bb-p4-06) | Geld en gevolgen | Nog 5 dagen tot salaris | De 20e tot 24e van de maand |
| 16 | [BB-P3-03](#bb-p3-03) | Privacy | Twee regels, geen AI | Als er AI-nieuws trending is |
| 17 | [BB-P6-04](#bb-p6-04) | Humor | Buddy's dagboek | Doordeweeks; goed als ‘zo werkt het’ voor nieuwe volgers |
| 18 | [BB-P5-02](#bb-p5-02) | Mythes en bezwaren | Dit is vast een scam | Als reactie op ‘is dit een scam?’-comments |
| 19 | [BB-P1-06](#bb-p1-06) | Herkenning | 03:12 | Zondagavond 21:00 tot 23:00 |
| 20 | [BB-P2-06](#bb-p2-06) | Zo werkt het | Betaald? Klik. Weg. | De 1e of 2e van de maand, net na het betalen |
| 21 | [BB-P4-04](#bb-p4-04) | Geld en gevolgen | Wat niemand je vertelt over aanmaningen | September (nieuwe studenten) en januari |
| 22 | [BB-P3-06](#bb-p3-06) | Privacy | Opzeggen zonder gedoe | Januari (de maand waarin iedereen abonnementen opruimt) |
| 23 | [BB-P6-02](#bb-p6-02) | Humor | Achievement unlocked | De 1e van de maand |
| 24 | [BB-P5-04](#bb-p5-04) | Mythes en bezwaren | Gescande rekening | Doordeweeks; als antwoord op de vraag in de comments |
| 25 | [BB-P1-03](#bb-p1-03) | Herkenning | Rekening of reclame? | Black Friday-week (23 tot 27 november 2026), als ieders inbox vol aanbiedingen zit |
| 26 | [BB-P2-05](#bb-p2-05) | Zo werkt het | De maandagmail | Maandagochtend 07:30 tot 08:30 |
| 27 | [BB-P4-02](#bb-p4-02) | Geld en gevolgen | Boete wordt duurder | Begin zomervakantie (roadtrips, flitspalen) of een willekeurige vrijdag |
| 28 | [BB-P3-05](#bb-p3-05) | Privacy | Vertrouw ons niet | Direct na BB-P3-01, of rond Data Privacy Day |
| 29 | [BB-P5-05](#bb-p5-05) | Mythes en bezwaren | Nog een abonnement? | Januari (abonnementen opruimen) of eind van de maand |
| 30 | [BB-P1-04](#bb-p1-04) | Herkenning | Net op jezelf | Eind augustus tot half september (nieuwe studenten, eerste kamer) |
| 31 | [BB-P2-07](#bb-p2-07) | Zo werkt het | Level 2: filterregel | Een tot twee weken na BB-P2-01, voor wie al één keer heeft doorgestuurd |
| 32 | [BB-P4-05](#bb-p4-05) | Geld en gevolgen | Geen bereik | Vrijdag- of zaterdagavond (uitgaan, festivals) |
| 33 | [BB-P3-04](#bb-p3-04) | Privacy | Wachtwoord vergeten? | World Password Day (eerste donderdag van mei) of een willekeurige vrijdag |
| 34 | [BB-P2-04](#bb-p2-04) | Zo werkt het | Buddy vraagt het gewoon | Doordeweeks; goed als antwoord op de vraag ‘wat als het misgaat?’ in de comments |

## De video's

### Pijler 1 · Herkenning

#### BB-P1-01

**Niet slecht met geld** · onderwerp #1 · Getallen-reveal · 8,4 s

- **Bestanden:** `renders/backlog/BB-P1-01-Reel.mp4` · `renders/backlog/BB-P1-01-Reel-cover.png` (cover = frame 70)
- **Wanneer:** Een maandagochtend; extra sterk op Blue Monday (derde maandag van januari).

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Je bent niet slecht met geld.”** · 99+ “ongelezen mails” |
| 3,0 s | **“Je hebt gewoon een volle inbox.”** · Buddy · “Buddy onthoudt je rekeningen, zodat jij dat niet hoeft.” |
| 5,8 s | eindkaart: “Stuur door. Buddy onthoudt.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Je bent niet slecht met geld. <break time="1.7s" /> Je hebt gewoon een volle inbox. <break time="0.7s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Je bent niet slecht met geld. | kop op frame 0, teller 12 → 99+ (0,27 tot 2,07 s) |
| 3,2 | Je hebt gewoon een volle inbox. | iris naar blauw 3,0 s, Buddy |
| 6,0 | Activeer Buddy. | eindkaart 5,8 s |

Geschatte mp3-lengte: ~7.0 s (14 woorden, 5.0 lettergrepen/s). Video: 8.4 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Niet slecht met geld. Gewoon 99+ ongelezen mails. 🙋 Buddy onthoudt je rekeningen, jij hoeft dat niet.

#betaalbuddy #adulting #herkenbaar #inbox
```

#### BB-P1-02

**Zoek de vervaldatum** · onderwerp #2 · POV · 9,6 s

- **Bestanden:** `renders/backlog/BB-P1-02-Reel.mp4` · `renders/backlog/BB-P1-02-Reel-cover.png` (cover = frame 0)
- **Wanneer:** Doordeweeks 19:00 tot 21:00. Geen VO: de stilte (of een tikkende klok uit een rechtenvrije bibliotheek) is de spanning.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | Sticker “POV” · **“Vind de vervaldatum. Je hebt 3 seconden.”** · mail Energieleverancier · “Je jaarafrekening 2026”, vergrootglas vindt “Te betalen vóór 22-11-2026 · € 86,40” |
| 3,8 s | **“Buddy zoekt hem voor je.”** · Buddy + chips “€86,40”, “Vervalt 22 nov”, “Betaallink” · “Stuur de rekening door. Bedrag en datum staan klaar.” |
| 7,0 s | eindkaart: “Laat Buddy zoeken.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst.

**Caption**

```
Eerlijk: hoe lang deed jij erover? 👀 De vervaldatum staat altijd onderaan, in het grijs. Buddy zoekt hem voor je.

#betaalbuddy #adulting #herkenbaar #rekeningen
```

#### BB-P1-03

**Rekening of reclame?** · onderwerp #3 · Mythe vs feit · 13,3 s

- **Bestanden:** `renders/backlog/BB-P1-03-Reel.mp4` · `renders/backlog/BB-P1-03-Reel-cover.png` (cover = frame 20)
- **Wanneer:** Black Friday-week (23 tot 27 november 2026), als ieders inbox vol aanbiedingen zit.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Rekening of reclame? Raad maar.”** · Onderwerp: ““Er staat iets voor je klaar”” → Rekening: “Een rekening. Vervalt over 5 dagen.” · Onderwerp: ““Alleen vandaag: 2 halen, 1 betalen”” → Reclame: “Reclame. Mag je negeren.” · Onderwerp: ““Je overzicht van november”” → Rekening: “Een rekening. Datum staat onderaan.” · Onderwerp: ““Mis dit niet!”” → Reclame: “Reclame. Deze keer.” |
| 7,9 s | **“Niet jouw fout. Echt niet.”** · Buddy · “Rekeningen lijken op reclame. Stuur de echte door naar Buddy.” |
| 10,7 s | eindkaart: “Hoeveel had jij goed?” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst.

**Caption**

```
Rekening of reclame? Hoeveel had jij goed? 🤔 Comment je score. De echte stuur je door naar Buddy.

#betaalbuddy #blackfriday #herkenbaar #inbox
```

#### BB-P1-04

**Net op jezelf** · onderwerp #4 · Dingen die niemand je vertelt · 11,5 s

- **Bestanden:** `renders/backlog/BB-P1-04-Reel.mp4` · `renders/backlog/BB-P1-04-Reel-cover.png` (cover = frame 150)
- **Wanneer:** Eind augustus tot half september (nieuwe studenten, eerste kamer). Ook rond de 1e van de maand.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Net op jezelf? Dit komt eraan.”** · 1. “Zorgverzekering. Elke maand, op jouw naam.” · 2. “Energie. Plus een jaarafrekening.” · 3. “Telefoon en internet.” · 4. “En ergens die ene boete.” |
| 6,1 s | **“Niemand legt je uit hoe je dat bijhoudt.”** · Buddy · “Buddy onthoudt het voor je. Jij stuurt alleen door.” |
| 8,9 s | eindkaart: “Stuur dit naar je huisgenoot.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst.

**Caption**

```
Net op jezelf en ineens komt alles op jouw naam binnen 📬 Tag je huisgenoot die dit nodig heeft.

#betaalbuddy #opjezelfwonen #studentenleven #adulting
```

#### BB-P1-05

**Wat school vergat** · onderwerp #5 · Voor/na · 9,2 s

- **Bestanden:** `renders/backlog/BB-P1-05-Reel.mp4` · `renders/backlog/BB-P1-05-Reel-cover.png` · `renders/backlog/BB-P1-05-Feed.mp4` · `renders/backlog/BB-P1-05-Feed-cover.png` (cover = frame 0)
- **Wanneer:** Begin schooljaar (eind augustus, begin september) of tentamenweken.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Op school leerde je Pythagoras.”** · “Wat je leerde”: “a² + b² = c²”; “De stelling van Pythagoras”; “Hoofdsteden van Europa” → wipe op 2,6 s → “Wat je nodig had”: “Waar staat de vervaldatum?”; “Wat is een veertiendagenbrief?”; “Hoe onthoud ik dit allemaal?” · “Dat laatste doet Buddy. Stuur door, krijg op tijd een seintje.” |
| 6,6 s | eindkaart: “Bewaar deze.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Op school leerde je Pythagoras. <break time="0.6s" /> Niet waar je vervaldatum staat. Dat laatste? Doet Buddy. <break time="0.6s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Op school leerde je Pythagoras. | kop op frame 0 |
| 2,7 | Niet waar je vervaldatum staat. | wipe 2,6 s, "Wat je nodig had" |
| 4,6 | Dat laatste? Doet Buddy. | laatste regel met vinkje, payoff 3,5 s |
| 6,7 | Activeer Buddy. | eindkaart 6,6 s |

Geschatte mp3-lengte: ~7.7 s (16 woorden, 5.0 lettergrepen/s). Video: 9.2 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
a² + b² = c². Maar waar staat die vervaldatum?? 😅 Bewaar deze.

#betaalbuddy #school #adulting #herkenbaar
```

#### BB-P1-06

**03:12** · onderwerp #6 · POV · 9,4 s

- **Bestanden:** `renders/backlog/BB-P1-06-Reel.mp4` · `renders/backlog/BB-P1-06-Reel-cover.png` (cover = frame 10)
- **Wanneer:** Zondagavond 21:00 tot 23:00.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | Sticker “POV” · **“Heb ik die nou betaald?”** · klok 03:12 met wakkere Buddy |
| 2,8 s | **“Kijk in je agenda.”** · agenda November (Facturen): 18 Betalen: Zorgverzekeraar €128,95 · “Staat hij er nog? Dan staat hij open. Betaald gemeld is eruit.” |
| 6,8 s | eindkaart: “Weet het gewoon.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Drie uur 's nachts. Heb ik die nou betaald? <break time="0.7s" /> Kijk in je agenda. Staat hij er nog? Dan staat hij open. <break time="0.3s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Drie uur 's nachts. Heb ik die nou betaald? | klok 03:12 op frame 0 |
| 3,0 | Kijk in je agenda. | slide naar agenda 2,8 s |
| 4,5 | Staat hij er nog? Dan staat hij open. | rekening op de 18e, subregel 3,4 s |
| 6,9 | Activeer Buddy. | eindkaart 6,8 s |

Geschatte mp3-lengte: ~7.9 s (23 woorden, 5.0 lettergrepen/s). Video: 9.4 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
03:12 en je brein: ‘heb je die rekening eigenlijk betaald?’ 🫠 Kijk gewoon in je agenda.

#betaalbuddy #adulting #herkenbaar #rekeningen
```

### Pijler 2 · Zo werkt het

#### BB-P2-01

**3 tikken** · onderwerp #7 · Mini-explainer · 13,8 s

- **Bestanden:** `renders/backlog/BB-P2-01-Reel.mp4` · `renders/backlog/BB-P2-01-Reel-cover.png` (cover = frame 0)
- **Wanneer:** Direct na de lancering en vast bovenaan je profiel (pinnen). Geen VO: werkt het best stil met ondertitels.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | stap 1: **“Rekeningen regelen = 3 tikken.”** · mail Zorgverzekeraar · “Je nota van november”, knop “Doorsturen” wordt getikt · “Tik 1: doorsturen.” |
| 2,8 s | stap 2: **“Plak je Buddy-adres.”** · Aan: a8f3k@in.betaalbuddy.nl wordt getypt, knop “Versturen” · “Tik 2: je eigen adres. Dat krijg je bij je aanmelding.” |
| 5,8 s | stap 3: **“Versturen.”** · mail vliegt weg, vinkje + “Verstuurd” · “Tik 3. Dat was het.” |
| 8,2 s | stap 4: **“Staat in je agenda.”** · agenda November (Facturen): 28 Betalen: Zorgverzekeraar €128,95 · “Met een seintje 7 en 2 dagen voor de vervaldatum.” |
| 11,2 s | eindkaart: “Bewaar deze voor later.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst.

**Caption**

```
Rekeningen regelen = 3 tikken. Doorsturen, adres plakken, versturen. Klaar. 📌 Bewaar deze.

#betaalbuddy #tutorial #lifehack #rekeningen
```

#### BB-P2-02

**Je agenda weet het eerder** · onderwerp #8 · Mini-explainer · 12,4 s

- **Bestanden:** `renders/backlog/BB-P2-02-Reel.mp4` · `renders/backlog/BB-P2-02-Reel-cover.png` (cover = frame 30)
- **Wanneer:** Eerste week van januari (nieuw jaar, nieuwe planning).

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | stap 1: **“Je agenda weet het eerder dan jij.”** · “Agendalink toevoegen”: “Kopieer je agendalink”; “Agenda toevoegen › via URL”; “Klaar. Hij werkt zichzelf bij.” · “Eén keer je agendalink toevoegen.” |
| 3,2 s | stap 2: **“Elke rekening op zijn vervaldatum.”** · agenda December (Facturen): 4 Betalen: Telefoon €24,50; 15 Betalen: Energie €86,40 · “In je eigen agenda. Geen extra app.” |
| 6,4 s | stap 3: **“Met een seintje 7 en 2 dagen vooraf.”** · meldingen: “Betalen: Energie €86,40 · over 7 dagen”; “Betalen: Energie €86,40 · over 2 dagen” · “Betaald gemeld? Dan verdwijnt hij uit je agenda.” |
| 9,8 s | eindkaart: “Koppel je agenda.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Je agenda weet het eerder dan jij. <break time="1.1s" /> Elke rekening op zijn vervaldatum. <break time="0.7s" /> Met een seintje vooraf. <break time="1.8s" /> Koppel je agenda.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Je agenda weet het eerder dan jij. | kop op frame 0, lijst 0,2 tot 1,0 s |
| 3,4 | Elke rekening op zijn vervaldatum. | push naar december 3,2 s |
| 6,6 | Met een seintje vooraf. | meldingen 6,7 en 7,5 s |
| 9,9 | Koppel je agenda. | eindkaart 9,8 s |

Geschatte mp3-lengte: ~11.1 s (19 woorden, 5.0 lettergrepen/s). Video: 12.4 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Je agenda weet het eerder dan jij 📅 Rekening op de vervaldatum, seintje 7 en 2 dagen vooraf.

#betaalbuddy #rekeningen #lifehack #adulting
```

#### BB-P2-03

**Last-minute doorgestuurd** · onderwerp #9 · Countdown · 11,3 s

- **Bestanden:** `renders/backlog/BB-P2-03-Reel.mp4` · `renders/backlog/BB-P2-03-Reel-cover.png` (cover = frame 30)
- **Wanneer:** Rond de 25e tot 28e van de maand, als de rekeningen zich opstapelen.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Pas op het laatst doorgestuurd?”** · “dagen tot de vervaldatum”: 7 “Hier komt normaal je eerste seintje.” → 2 “En hier je tweede. Maar hij was nog niet doorgestuurd.” → 1 “Nu pas doorgestuurd?” + melding “Vervalt morgen · €49,99” |
| 5,9 s | **“Te laat? Toch een seintje.”** · groot: “Alsnog.” met vinkje · “Buddy slaat hem niet over omdat je laat was.” |
| 8,7 s | eindkaart: “Stuur hem nu door.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Pas op het laatst doorgestuurd? <break time="0.5s" /> Zeven en twee dagen? Gemist. <break time="0.2s" /> Geen paniek. <break time="0.8s" /> Je krijgt alsnog een seintje. <break time="1.1s" /> Stuur hem nu door.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Pas op het laatst doorgestuurd? | kop op frame 0, de 7 |
| 2,2 | Zeven en twee dagen? Gemist. | rol naar 2 op 2,1 s |
| 4,3 | Geen paniek. | rol naar 1 op 4,2 s, melding 5,1 s |
| 6,0 | Je krijgt alsnog een seintje. | klok-wipe 5,9 s, "Alsnog." |
| 8,8 | Stuur hem nu door. | eindkaart 8,7 s |

Geschatte mp3-lengte: ~9.6 s (21 woorden, 5.0 lettergrepen/s). Video: 11.3 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Rekening pas op het laatst doorgestuurd? Buddy slaat hem niet over 🙌 Je krijgt alsnog een seintje.

#betaalbuddy #rekeningen #lifehack #adulting
```

#### BB-P2-04

**Buddy vraagt het gewoon** · onderwerp #10 · Skit (geanimeerde chat) · 11,2 s

- **Bestanden:** `renders/backlog/BB-P2-04-Reel.mp4` · `renders/backlog/BB-P2-04-Reel-cover.png` (cover = frame 0)
- **Wanneer:** Doordeweeks; goed als antwoord op de vraag ‘wat als het misgaat?’ in de comments.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Kan Buddy je rekening niet lezen?”** · chat “Buddy” (per mail): Buddy: “Deze kon ik niet lezen. Stuur je de datum en het bedrag even terug?” · Jij: “datum: 15-12-2026 bedrag: 49,99” · [systeem] “Staat in je agenda” · Buddy: “Ik gok liever niet. Een verkeerde datum is erger dan geen datum.” |
| 6,0 s | **“Liever vragen dan gokken.”** · Buddy · “Zonder antwoord zet Buddy niets in je agenda.” |
| 8,6 s | eindkaart: “Stuur je eerste rekening door.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst en de chat.

**Caption**

```
Kan Buddy je rekening niet lezen? Dan vraagt hij het gewoon. Liever vragen dan gokken 🤝

#betaalbuddy #rekeningen #lifehack #adulting
```

#### BB-P2-05

**De maandagmail** · onderwerp #11 · POV · 9,4 s

- **Bestanden:** `renders/backlog/BB-P2-05-Reel.mp4` · `renders/backlog/BB-P2-05-Reel-cover.png` (cover = frame 30)
- **Wanneer:** Maandagochtend 07:30 tot 08:30.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | Sticker “POV” · **“Maandag. Je weet wat er openstaat.”** · weekmail “Je openstaande rekeningen deze week”: Zorgverzekeraar €128,95 (vervalt 18 nov); Telefoon €24,50 (vervalt 20 nov); Energie €86,40 (vervalt 22 nov) |
| 4,0 s | **“Eén mail per week. Meer niet.”** · Buddy met tekstballon “Fijne week.” · “Elke maandag wat nog openstaat. Betaald gemeld = eruit.” |
| 6,8 s | eindkaart: “Link in bio.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Het is maandag. <break time="0.1s" /> En je weet precies wat er openstaat. <break time="0.6s" /> Eén mail per week. Meer niet. <break time="1.3s" /> Link in bio.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Het is maandag. | kop op frame 0 |
| 1,2 | En je weet precies wat er openstaat. | drie regels 0,3 tot 0,8 s |
| 4,1 | Eén mail per week. Meer niet. | slide 4,0 s, Buddy "Fijne week." |
| 6,9 | Link in bio. | eindkaart 6,8 s |

Geschatte mp3-lengte: ~7.5 s (19 woorden, 5.0 lettergrepen/s). Video: 9.4 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Elke maandag één mail: dit staat er nog open. Meer niet. ☕ Fijne week.

#betaalbuddy #rekeningen #lifehack #adulting
```

#### BB-P2-06

**Betaald? Klik. Weg.** · onderwerp #12 · Voor/na · 8,8 s

- **Bestanden:** `renders/backlog/BB-P2-06-Reel.mp4` · `renders/backlog/BB-P2-06-Reel-cover.png` · `renders/backlog/BB-P2-06-Feed.mp4` · `renders/backlog/BB-P2-06-Feed-cover.png` (cover = frame 30)
- **Wanneer:** De 1e of 2e van de maand, net na het betalen.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Betaald? Klik. Weg.”** · “Je herinnering”: rekeningkaart Energieleverancier, €86,40, “Vervalt 22 nov”, knop “Al betaald” → wipe op 2,2 s → “Eén klik later”: groot: “Weg.” + “Uit je overzicht. Uit je agenda. Uit de database.” met vinkje · “Geen archief. Geen geschiedenis van wat je ooit betaalde.” |
| 6,2 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Betaald? Klik. <break time="1.5s" /> Weg. <break time="0.4s" /> Uit je agenda én uit de database. <break time="0.3s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Betaald? Klik. | kop op frame 0, tik op "Al betaald" 1,5 s |
| 2,4 | Weg. | wipe 2,2 s |
| 3,3 | Uit je agenda én uit de database. | subtekst 3,1 s |
| 6,3 | Activeer Buddy. | eindkaart 6,2 s |

Geschatte mp3-lengte: ~7.3 s (12 woorden, 5.0 lettergrepen/s). Video: 8.8 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Betaald? Eén klik en hij is weg. Geen archief, geen geschiedenis. Zo hoort het ✅

#betaalbuddy #rekeningen #lifehack #adulting
```

#### BB-P2-07

**Level 2: filterregel** · onderwerp #13 · Mini-explainer · 12,0 s

- **Bestanden:** `renders/backlog/BB-P2-07-Reel.mp4` · `renders/backlog/BB-P2-07-Reel-cover.png` (cover = frame 30)
- **Wanneer:** Een tot twee weken na BB-P2-01, voor wie al één keer heeft doorgestuurd. Geen VO.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | stap 1: **“Level 2: niet eens meer doorsturen.”** · filterregel “Nieuwe regel”: Als Bevat “factuur” · Dan Doorsturen naar je Buddy-adres · schakelaar aan · “Maak één keer een filterregel in je mailprogramma.” |
| 3,4 s | stap 2: **“Nieuwe rekening? Gaat vanzelf door.”** · inbox: Energieleverancier: Je factuur van december; Webshop: Je pakket is onderweg; Nieuwsbrief: Nieuw deze week; label “Doorgestuurd” · “Jij hoeft er niks voor te doen.” |
| 6,4 s | stap 3: **“Jij hoort het pas als het moet.”** · meldingen: “Nog 7 dagen · Energie €86,40”; “Nog 2 dagen · betaal op tijd” · “7 en 2 dagen voor de vervaldatum.” |
| 9,4 s | eindkaart: “Bewaar deze.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst.

**Caption**

```
Level 2 unlocked 🎮 Eén filterregel en je rekeningen gaan vanzelf naar Buddy. Bewaar voor later.

#betaalbuddy #tutorial #lifehack #automatiseren
```

### Pijler 3 · Privacy

#### BB-P3-01

**Wat Buddy bewaart (en niet)** · onderwerp #14 · Voor/na · 9,6 s

- **Bestanden:** `renders/backlog/BB-P3-01-Reel.mp4` · `renders/backlog/BB-P3-01-Reel-cover.png` · `renders/backlog/BB-P3-01-Feed.mp4` · `renders/backlog/BB-P3-01-Feed-cover.png` (cover = frame 30)
- **Wanneer:** Rond Data Privacy Day (28 januari) of na privacynieuws.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Dit bewaart Buddy van jou.”** · “Wel”: “Per rekening”: ✓ Bedrag €86,40; ✓ Vervaldatum 22 nov; ✓ Afzender Energieleverancier; ✓ Betalen IBAN, kenmerk, link → wipe op 3 s → “Niet”: “Nooit”: ✗ Je mail tekst en onderwerp; ✗ Bijlagen pdf's en plaatjes; ✗ Over jou naam en adres; ✗ Geschiedenis wat je ooit betaalde · “Betaald gemeld? Dan is de rest ook weg.” |
| 7,0 s | eindkaart: “Check het zelf: mail “gegevens”.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Dit bewaart Buddy van jou. <break time="1.5s" /> En dit nooit. <break time="0.3s" /> Je mail, je bijlagen, je naam. <break time="0.4s" /> Check het zelf.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Dit bewaart Buddy van jou. | kop op frame 0, lijst staat er |
| 3,2 | En dit nooit. | wipe 3,0 s |
| 4,4 | Je mail, je bijlagen, je naam. | streep door 3,5 tot 4,7 s |
| 7,1 | Check het zelf. | eindkaart 7,0 s |

Geschatte mp3-lengte: ~7.7 s (17 woorden, 5.0 lettergrepen/s). Video: 9.6 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Wat bewaart Buddy van je? Dit. De rest nooit. 🔒 Check het zelf: mail ‘gegevens’.

#betaalbuddy #privacy #geenAI #rekeningen
```

#### BB-P3-02

**Een paar honderd milliseconden** · onderwerp #15 · Getallen-reveal · 8,8 s

- **Bestanden:** `renders/backlog/BB-P3-02-Reel.mp4` · `renders/backlog/BB-P3-02-Reel-cover.png` (cover = frame 60)
- **Wanneer:** Willekeurige doordeweekse dag; sterk na een datalek in het nieuws.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Hoe lang bewaren ze je mail eigenlijk?”** · ± 300 ms “Zo lang bestaat je doorgestuurde mail. Alleen in het geheugen.” |
| 3,4 s | **“Daarna is je mail weg.”** · Buddy · “Wat overblijft: bedrag, datum en hoe je betaalt.” |
| 6,2 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Hoe lang bewaren ze je mail? <break time="0.3s" /> Een paar honderd milliseconden. <break time="0.3s" /> Daarna: weg. <break time="0.6s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Hoe lang bewaren ze je mail? | kop op frame 0 |
| 2,2 | Een paar honderd milliseconden. | teller 0,27 tot 1,7 s |
| 4,6 | Daarna: weg. | iris 3,4 s, kop "Daarna is je mail weg." |
| 6,3 | Activeer Buddy. | eindkaart 6,2 s |

Geschatte mp3-lengte: ~7.3 s (14 woorden, 5.0 lettergrepen/s). Video: 8.8 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Hoe lang bewaart Buddy je doorgestuurde mail? Een paar honderd milliseconden. Daarna: weg 🫥

#betaalbuddy #privacy #geenAI #rekeningen
```

#### BB-P3-03

**Twee regels, geen AI** · onderwerp #16 · Mini-explainer · 11,6 s

- **Bestanden:** `renders/backlog/BB-P3-03-Reel.mp4` · `renders/backlog/BB-P3-03-Reel-cover.png` (cover = frame 30)
- **Wanneer:** Als er AI-nieuws trending is.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | stap 1: **“Iedereen stopt AI in alles. Wij niet.”** · factuur met markering; regels: “Bedrag: het getal achter “Totaal”” · “Buddy leest met vaste regels.” |
| 3,4 s | stap 2: **“En de datum.”** · factuur met markering; regels: “Bedrag: het getal achter “Totaal””; “Datum: wat achter “Vervaldatum” staat” · “Elke dag dezelfde uitkomst. Er wordt niks verzonnen.” |
| 6,4 s | stap 3: **“Geen model dat meeleest.”** · groot: “Geen AI.” + “Expres.” · “Je kunt de regels gewoon nalezen.” |
| 9,0 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Iedereen stopt AI in alles. Wij niet. <break time="1.3s" /> Gewoon vaste regels. <break time="1.4s" /> Geen model dat meeleest. <break time="1.1s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Iedereen stopt AI in alles. Wij niet. | kop op frame 0 |
| 3,6 | Gewoon vaste regels. | push 3,4 s, datum gemarkeerd 4,2 s |
| 6,5 | Geen model dat meeleest. | "Geen AI." 6,4 s |
| 9,1 | Activeer Buddy. | eindkaart 9,0 s |

Geschatte mp3-lengte: ~10.1 s (16 woorden, 5.0 lettergrepen/s). Video: 11.6 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Iedereen stopt AI in alles. Wij niet. Vaste regels die je kunt nalezen 🤖❌

#betaalbuddy #privacy #geenAI #rekeningen
```

#### BB-P3-04

**Wachtwoord vergeten?** · onderwerp #17 · Skit (geanimeerde chat) · 11,3 s

- **Bestanden:** `renders/backlog/BB-P3-04-Reel.mp4` · `renders/backlog/BB-P3-04-Reel-cover.png` (cover = frame 100)
- **Wanneer:** World Password Day (eerste donderdag van mei) of een willekeurige vrijdag. Geen VO.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Wachtwoord kwijt? Kan hier niet.”** · chat “Buddy” (per mail): Jij: “Help, ik ben mijn wachtwoord vergeten” · Buddy: “Welk wachtwoord?” · Buddy: “Er is geen account. Alles gaat per mail.” · Jij: “Dus er valt ook niks te lekken?” · Buddy: “Precies.” |
| 6,1 s | **“Geen wachtwoord. Niks om te stelen.”** · Buddy · “Geen inlog, geen app, geen dashboard.” |
| 8,7 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst en de chat.

**Caption**

```
Wachtwoord vergeten? Kan hier niet. Er is er geen 😌 Geen account, geen app, alles per mail.

#betaalbuddy #privacy #geenAI #rekeningen
```

#### BB-P3-05

**Vertrouw ons niet** · onderwerp #18 · Mini-explainer · 11,8 s

- **Bestanden:** `renders/backlog/BB-P3-05-Reel.mp4` · `renders/backlog/BB-P3-05-Reel-cover.png` (cover = frame 0)
- **Wanneer:** Direct na BB-P3-01, of rond Data Privacy Day.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | stap 1: **“Vertrouw ons niet. Check het.”** · Aan: gegevens@in.betaalbuddy.nl wordt getypt, knop “Versturen” · “Mail het woord “gegevens” naar Buddy.” |
| 3,2 s | stap 2: **“Je krijgt elk veld dat we bewaren.”** · “Wat we van je hebben”: ✓ Doorstuuradres a8f3k@in…; ✓ Antwoordadres jij@mail.nl; ✓ Herinnerdagen 7 en 2; ✓ Open rekeningen 2 · “Veld voor veld, met uitleg erbij.” |
| 6,4 s | stap 3: **“Download als JSON of CSV.”** · Buddy + chips “JSON”, “CSV” · “Zonder in te loggen. Er is geen inlog.” |
| 9,2 s | eindkaart: “Mail “gegevens” en kijk zelf.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Vertrouw ons niet. Check het. <break time="1.8s" /> Je ziet elk veld dat we bewaren. <break time="1.1s" /> Download het als JSON of CSV. <break time="1.1s" /> Kijk zelf.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Vertrouw ons niet. Check het. | kop op frame 0, adres wordt getypt |
| 3,3 | Je ziet elk veld dat we bewaren. | push 3,2 s, velden |
| 6,5 | Download het als JSON of CSV. | chips 6,8 s |
| 9,3 | Kijk zelf. | eindkaart 9,2 s |

Geschatte mp3-lengte: ~9.7 s (20 woorden, 5.0 lettergrepen/s). Video: 11.8 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Vertrouw ons niet. Check het 🔍 Mail ‘gegevens’ en je ziet elk veld dat we van je hebben.

#betaalbuddy #privacy #geenAI #rekeningen
```

#### BB-P3-06

**Opzeggen zonder gedoe** · onderwerp #19 · Voor/na · 9,4 s

- **Bestanden:** `renders/backlog/BB-P3-06-Reel.mp4` · `renders/backlog/BB-P3-06-Reel-cover.png` · `renders/backlog/BB-P3-06-Feed.mp4` · `renders/backlog/BB-P3-06-Feed-cover.png` (cover = frame 0)
- **Wanneer:** Januari (de maand waarin iedereen abonnementen opruimt).

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Opzeggen zonder “weet je het zeker?””** · “Opzeggen, meestal”: “Inloggen”; “Wachtwoord vergeten”; “Account › Abonnement › …”; ““Weet je het zeker?””; ““Hier is een aanbieding”” → wipe op 3 s → “Bij Buddy”: “Mail “stop” naar Buddy”; “Alles is direct weg”; “Geen gesprek, geen aanbod” · “Of klik op de link onderaan elke mail.” |
| 6,8 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Opzeggen zonder ‘weet je het zeker?’ <break time="1.1s" /> Bij Buddy mail je stop. Alles is direct weg. <break time="0.7s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Opzeggen zonder ‘weet je het zeker?’ | kop op frame 0, lijst |
| 3,2 | Bij Buddy mail je stop. | wipe 3,0 s |
| 4,7 | Alles is direct weg. | vinkjes 3,8 en 4,2 s |
| 6,9 | Activeer Buddy. | eindkaart 6,8 s |

Geschatte mp3-lengte: ~7.9 s (17 woorden, 5.0 lettergrepen/s). Video: 9.4 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Opzeggen zonder ‘weet je het zeker?’ en zonder ‘hier is korting’. Mail ‘stop’. Weg ✌️

#betaalbuddy #privacy #geenAI #rekeningen
```

### Pijler 4 · Geld en gevolgen

#### BB-P4-01

**€12 wordt €52** · onderwerp #20 · Getallen-reveal · 10,6 s

- **Bestanden:** `renders/backlog/BB-P4-01-Reel.mp4` · `renders/backlog/BB-P4-01-Reel-cover.png` · `renders/backlog/BB-P4-01-Feed.mp4` · `renders/backlog/BB-P4-01-Feed-cover.png` (cover = frame 145)
- **Wanneer:** Eind van de maand (25e tot 31e).

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Rekening van €12. Vergeten.”** · €12 “je rekening” → €52 “als je ook de veertiendagenbrief laat liggen” + badge “+€40” |
| 5,0 s | **“Incassokosten: minimaal €40.”** · Buddy · “Ook bij een rekening van €12. Buddy seint je 7 en 2 dagen vooraf.” |
| 8,0 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Rekening van twaalf euro. Vergeten. <break time="0.5s" /> Veertiendagenbrief ook laten liggen? <break time="0.1s" /> Minimaal veertig euro erbij. <break time="0.8s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Rekening van twaalf euro. Vergeten. | kop op frame 0 |
| 2,8 | Veertiendagenbrief ook laten liggen? | tweede stap 2,7 s, teller tot 4,2 s |
| 5,2 | Minimaal veertig euro erbij. | iris 5,0 s |
| 8,1 | Activeer Buddy. | eindkaart 8,0 s |

Geschatte mp3-lengte: ~9.1 s (15 woorden, 5.0 lettergrepen/s). Video: 10.6 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Rekening van €12 vergeten én de veertiendagenbrief laten liggen? Dan komt er minimaal €40 bij 😬

#betaalbuddy #aanmaning #geldzaken #rekeningen
```

#### BB-P4-02

**Boete wordt duurder** · onderwerp #21 · Getallen-reveal · 10,6 s

- **Bestanden:** `renders/backlog/BB-P4-02-Reel.mp4` · `renders/backlog/BB-P4-02-Reel-cover.png` (cover = frame 140)
- **Wanneer:** Begin zomervakantie (roadtrips, flitspalen) of een willekeurige vrijdag.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Je boete wordt duurder. Echt.”** · 100% “je verkeersboete” → 150% “na de eerste aanmaning” + badge “+50%” |
| 5,0 s | **“Tweede aanmaning? Dan nog meer.”** · Buddy · “Komt je boete per mail? Stuur hem door. Buddy seint je op tijd.” |
| 8,0 s | eindkaart: “Stuur naar een vriend die altijd boetes heeft.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Je boete wordt duurder. Echt. <break time="1.1s" /> Eerste aanmaning: vijftig procent erbij. Tweede? Nog meer. <break time="1.5s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Je boete wordt duurder. Echt. | kop op frame 0 |
| 2,8 | Eerste aanmaning: vijftig procent erbij. | tweede stap 2,7 s, +50% op 4,2 s |
| 5,5 | Tweede? Nog meer. | iris 5,0 s |
| 8,1 | Activeer Buddy. | eindkaart 8,0 s |

Geschatte mp3-lengte: ~9.1 s (15 woorden, 5.0 lettergrepen/s). Video: 10.6 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Verkeersboete laten liggen? Na de eerste aanmaning +50%, bij de tweede nog meer 💸 Stuur dit naar die ene vriend.

#betaalbuddy #aanmaning #geldzaken #rekeningen
```

#### BB-P4-03

**De hele afweging** · onderwerp #22 · Voor/na · 9,2 s

- **Bestanden:** `renders/backlog/BB-P4-03-Reel.mp4` · `renders/backlog/BB-P4-03-Reel-cover.png` · `renders/backlog/BB-P4-03-Feed.mp4` · `renders/backlog/BB-P4-03-Feed-cover.png` (cover = frame 0)
- **Wanneer:** Salarisdag (rond de 25e).

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Vergeten rekening? Kan €40 kosten.”** · “Vergeten”: rekeningkaart Incassobureau, €126,40, “Incl. €40 kosten” → wipe op 2,6 s → “Met Buddy”: meldingen: “Nog 7 dagen · Energie €86,40”; “Nog 2 dagen · betaal op tijd” · “Twee seintjes op tijd. Dat is de hele afweging.” |
| 6,6 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Eén vergeten rekening kan veertig euro kosten. Of twee seintjes op tijd. <break time="0.4s" /> Dat is de hele afweging. Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Eén vergeten rekening kan veertig euro kosten. | kop op frame 0 |
| 3,1 | Of twee seintjes op tijd. | wipe 2,6 s, meldingen 3,1 en 3,8 s |
| 5,0 | Dat is de hele afweging. | payoff 3,5 s |
| 6,9 | Activeer Buddy. | eindkaart 6,6 s |

Geschatte mp3-lengte: ~7.9 s (19 woorden, 5.0 lettergrepen/s). Video: 9.2 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Eén vergeten rekening kan €40 extra kosten. Of: twee seintjes op tijd. Dat is de hele afweging ⚖️

#betaalbuddy #aanmaning #geldzaken #rekeningen
```

#### BB-P4-04

**Wat niemand je vertelt over aanmaningen** · onderwerp #23 · Dingen die niemand je vertelt · 14,0 s

- **Bestanden:** `renders/backlog/BB-P4-04-Reel.mp4` · `renders/backlog/BB-P4-04-Reel-cover.png` (cover = frame 230)
- **Wanneer:** September (nieuwe studenten) en januari. Geen VO: tekst is de video.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Niemand vertelt je dit over aanmaningen.”** · 1. “Eerst krijg je een brief met 14 dagen de tijd. Zonder kosten.” · 2. “Betaal je dan niet? Minimaal €40 incassokosten.” · 3. “Ook als de rekening zelf maar €12 was.” · 4. “Verkeersboete: +50% na de eerste aanmaning.” · 5. “Je telefoonabonnement kan geblokkeerd worden.” |
| 8,8 s | **“Bewaar dit. Buddy onthoudt.”** · Buddy · “Rekening doorsturen = op tijd een seintje.” |
| 11,4 s | eindkaart: “Stuur dit naar iemand die net op zichzelf woont.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst.

**Caption**

```
Dingen die niemand je vertelt over aanmaningen 📩 Bewaar dit. Of laat Buddy het onthouden.

#betaalbuddy #aanmaning #opjezelfwonen #geldzaken
```

#### BB-P4-05

**Geen bereik** · onderwerp #24 · Skit (geanimeerde chat) · 10,8 s

- **Bestanden:** `renders/backlog/BB-P4-05-Reel.mp4` · `renders/backlog/BB-P4-05-Reel-cover.png` (cover = frame 60)
- **Wanneer:** Vrijdag- of zaterdagavond (uitgaan, festivals). Geen VO.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Je telefoon doet het ineens niet meer.”** · chat “Huisgenoten” (4 leden): Sam: “Waar blijf je?” · Jij: “Bijna er!” (niet bezorgd) · Jij: “Hallo??” (niet bezorgd) · [systeem] “Je abonnement is geblokkeerd. Openstaand: €24,50” |
| 5,4 s | **“Vergeten rekening. Geen bereik.”** · Buddy · “Buddy seint je 7 en 2 dagen voor de vervaldatum.” |
| 8,2 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst en de chat.

**Caption**

```
Je telefoon doet het ineens niet meer en je snapt meteen waarom 💀 Vergeten rekening = geen bereik.

#betaalbuddy #aanmaning #geldzaken #rekeningen
```

#### BB-P4-06

**Nog 5 dagen tot salaris** · onderwerp #25 · Countdown · 11,9 s

- **Bestanden:** `renders/backlog/BB-P4-06-Reel.mp4` · `renders/backlog/BB-P4-06-Reel-cover.png` (cover = frame 0)
- **Wanneer:** De 20e tot 24e van de maand.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Nog 5 dagen tot je salaris.”** · “dagen tot je salaris”: 5 “Wat valt er nog vóór?” → 3 “Telefoon: €24,50” + melding “Nog 2 dagen · betaal op tijd” → 1 “Energie: €86,40” + melding “Nog 2 dagen · Energie €86,40” |
| 5,9 s | **“Weet wat er vóór je salaris valt.”** · agenda November (Facturen): 18 Betalen: Zorgverzekeraar €128,95; 20 Betalen: Telefoon €24,50; 22 Betalen: Energie €86,40 · “Elke rekening op zijn vervaldatum, in je eigen agenda.” |
| 9,3 s | eindkaart: “Koppel je agenda.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Nog vijf dagen tot je salaris. <break time="0.1s" /> Telefoon. Bijna. <break time="0.8s" /> Energie. Ook. <break time="0.6s" /> Weet wat er vóór je salaris valt. <break time="1.3s" /> Koppel je agenda.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Nog vijf dagen tot je salaris. | kop op frame 0, de 5 |
| 2,2 | Telefoon. Bijna. | rol naar 3 op 2,1 s |
| 4,3 | Energie. Ook. | rol naar 1 op 4,2 s |
| 6,0 | Weet wat er vóór je salaris valt. | klok-wipe 5,9 s, agenda |
| 9,4 | Koppel je agenda. | eindkaart 9,3 s |

Geschatte mp3-lengte: ~10.6 s (20 woorden, 5.0 lettergrepen/s). Video: 11.9 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Nog 5 dagen tot je salaris en je wil weten wat er nog vóór valt 👀 Staat gewoon in je agenda.

#betaalbuddy #aanmaning #geldzaken #rekeningen
```

### Pijler 5 · Mythes en bezwaren

#### BB-P5-01

**Mijn bank-app doet dit al** · onderwerp #26 · Mythe vs feit · 11,9 s

- **Bestanden:** `renders/backlog/BB-P5-01-Reel.mp4` · `renders/backlog/BB-P5-01-Reel-cover.png` · `renders/backlog/BB-P5-01-Feed.mp4` · `renders/backlog/BB-P5-01-Feed-cover.png` (cover = frame 0)
- **Wanneer:** Als reactie zodra deze vraag in de comments opduikt; anders doordeweeks.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **““Mijn bank-app doet dit toch al?””** · Mythe: “Mijn bank-app herinnert me aan mijn rekeningen.” → Feit: “Een rekening die per mail komt, kent je bank pas als jij betaalt.” · Mythe: “Dan moet Buddy vast aan mijn bank koppelen.” → Feit: “Nee. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.” |
| 6,7 s | **“Bank kijkt terug. Buddy kijkt vooruit.”** · Buddy · “Je bank ziet wat eraf ging. Buddy onthoudt wat er nog moet.” |
| 9,3 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Mijn bank-app doet dit toch al? Een rekening in je mail kent je bank pas als je betaalt. En nee, geen bankkoppeling. Bank kijkt terug. Buddy kijkt vooruit. <break time="0.5s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Mijn bank-app doet dit toch al? | kop op frame 0 |
| 1,7 | Een rekening in je mail kent je bank pas als je betaalt. | flip 1,3 s |
| 5,0 | En nee, geen bankkoppeling. | flip 4,7 s |
| 6,9 | Bank kijkt terug. Buddy kijkt vooruit. | flip-overgang 6,7 s |
| 9,5 | Activeer Buddy. | eindkaart 9,3 s |

Geschatte mp3-lengte: ~10.5 s (30 woorden, 5.0 lettergrepen/s). Video: 11.9 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
‘Mijn bank-app doet dit toch al?’ Je bank ziet wat eraf ging. Buddy onthoudt wat er nog moet 🔁

#betaalbuddy #mythes #rekeningen #privacy
```

#### BB-P5-02

**Dit is vast een scam** · onderwerp #27 · Mythe vs feit · 11,5 s

- **Bestanden:** `renders/backlog/BB-P5-02-Reel.mp4` · `renders/backlog/BB-P5-02-Reel-cover.png` (cover = frame 0)
- **Wanneer:** Als reactie op ‘is dit een scam?’-comments.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Ik dacht: scam. Geen account?”** · Mythe: “Geen account? Klinkt als een scam.” → Feit: “Je aanmelding is je betaling. Daarna krijg je je eigen doorstuuradres.” · Mythe: “Dan kan ik ook niks controleren.” → Feit: “Mail “gegevens” en je ziet elk veld dat we van je bewaren.” · Mythe: “Opzeggen wordt vast gedoe.” → Feit: “Mail “stop”. Alles is direct weg.” |
| 8,9 s | eindkaart: “Check het zelf.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Geen account? Klinkt als scam. <break time="0.1s" /> Je aanmelding is je betaling. <break time="0.7s" /> Mail gegevens: je ziet alles. <break time="0.9s" /> Mail stop: weg. <break time="0.5s" /> Check het zelf.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Geen account? Klinkt als scam. | kop op frame 0 |
| 1,6 | Je aanmelding is je betaling. | flip 1,2 s |
| 4,4 | Mail gegevens: je ziet alles. | flip 4,2 s |
| 7,4 | Mail stop: weg. | flip 7,2 s |
| 9,0 | Check het zelf. | eindkaart 8,9 s |

Geschatte mp3-lengte: ~9.6 s (21 woorden, 5.0 lettergrepen/s). Video: 11.5 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
‘Geen account? Klinkt als scam.’ Snap ik. Daarom kun je alles zelf checken én met één mail stoppen 🔍

#betaalbuddy #mythes #rekeningen #privacy
```

#### BB-P5-03

**3 dingen die Buddy niet doet** · onderwerp #28 · Mythe vs feit · 13,5 s

- **Bestanden:** `renders/backlog/BB-P5-03-Reel.mp4` · `renders/backlog/BB-P5-03-Reel-cover.png` · `renders/backlog/BB-P5-03-Feed.mp4` · `renders/backlog/BB-P5-03-Feed-cover.png` (cover = frame 0)
- **Wanneer:** Doordeweeks; goed als eerste kennismaking voor nieuwe volgers.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“3 dingen die Buddy NIET doet.”** · Buddy: “…betaalt je rekeningen.” → Nee: “Jij betaalt zelf. Buddy zet de betaalgegevens in je herinnering.” · Buddy: “…leest je hele inbox.” → Nee: “Alleen wat jij doorstuurt. Verder niks.” · Buddy: “…gebruikt AI.” → Nee: “Vaste regels. Je kunt ze gewoon nalezen.” |
| 8,3 s | **“Wat Buddy wel doet: onthouden.”** · Buddy · “Stuur door, krijg 7 en 2 dagen vooraf een seintje.” |
| 10,9 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Drie dingen die Buddy niet doet. <break time="0.1s" /> Betalen? Doe je zelf. <break time="0.6s" /> Je inbox lezen? Alleen wat jij doorstuurt. <break time="0.3s" /> AI? Vaste regels. <break time="0.3s" /> Wat hij wel doet? Onthouden. <break time="0.8s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Drie dingen die Buddy niet doet. | kop op frame 0 |
| 2,0 | Betalen? Doe je zelf. | flip 1,1 s |
| 4,1 | Je inbox lezen? Alleen wat jij doorstuurt. | flip 3,9 s |
| 6,9 | AI? Vaste regels. | flip 6,7 s |
| 8,5 | Wat hij wel doet? Onthouden. | payoff 8,3 s |
| 11,0 | Activeer Buddy. | eindkaart 10,9 s |

Geschatte mp3-lengte: ~12.0 s (27 woorden, 5.0 lettergrepen/s). Video: 13.5 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
3 dingen die Buddy NIET doet, en 1 ding dat hij wel doet 👇

#betaalbuddy #mythes #rekeningen #privacy
```

#### BB-P5-04

**Gescande rekening** · onderwerp #29 · Mythe vs feit · 12,7 s

- **Bestanden:** `renders/backlog/BB-P5-04-Reel.mp4` · `renders/backlog/BB-P5-04-Reel-cover.png` (cover = frame 0)
- **Wanneer:** Doordeweeks; als antwoord op de vraag in de comments.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Gescande rekening? Eerlijk antwoord:”** · Mythe: “Buddy leest ook gescande rekeningen.” → Feit: “Niet vanzelf. In een scan staat geen tekst, en we laten bewust geen software je scan bekijken.” · Mythe: “Dan heb je er niks aan.” → Feit: “Buddy vraagt je om datum en bedrag. Daarna staat hij gewoon in je agenda.” |
| 7,5 s | **“Liever eerlijk dan half werk.”** · Buddy · “Een verkeerde datum in je agenda is erger dan een vraag.” |
| 10,1 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Gescande rekening? Eerlijk antwoord. Niet vanzelf. Een scan heeft geen tekst. <break time="1.1s" /> Dan vraagt Buddy het je gewoon. <break time="0.5s" /> Liever eerlijk dan half werk. <break time="0.8s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Gescande rekening? Eerlijk antwoord. | kop op frame 0 |
| 2,3 | Niet vanzelf. Een scan heeft geen tekst. | flip 1,3 s |
| 5,3 | Dan vraagt Buddy het je gewoon. | flip 5,1 s |
| 7,7 | Liever eerlijk dan half werk. | payoff 7,5 s |
| 10,2 | Activeer Buddy. | eindkaart 10,1 s |

Geschatte mp3-lengte: ~11.2 s (24 woorden, 5.0 lettergrepen/s). Video: 12.7 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Werkt Buddy met een gescande rekening? Eerlijk antwoord: niet vanzelf. Dan vraagt hij datum en bedrag 🤝

#betaalbuddy #mythes #rekeningen #privacy
```

#### BB-P5-05

**Nog een abonnement?** · onderwerp #30 · Mythe vs feit · 11,9 s

- **Bestanden:** `renders/backlog/BB-P5-05-Reel.mp4` · `renders/backlog/BB-P5-05-Reel-cover.png` (cover = frame 0)
- **Wanneer:** Januari (abonnementen opruimen) of eind van de maand.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **““Nog een abo? Nee dank je.””** · Twijfel: “Nog een abonnement erbij? Nee dank je.” → Eerlijk: “Dit is het abonnement dat de rest van je rekeningen in de gaten houdt.” · Twijfel: “Ik vergeet toch nooit iets.” → Eerlijk: “Tot die ene keer. En die kan minimaal €40 kosten.” |
| 6,7 s | **“Eén abonnement dat op de rest let.”** · Buddy · “Opzeggen kan altijd, met één mail.” |
| 9,3 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Nog een abonnement? Nee dank je. Snap ik. Maar deze let op de rest. <break time="0.8s" /> Eén vergeten keer kan veertig euro kosten. Opzeggen kan altijd. <break time="0.3s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Nog een abonnement? Nee dank je. | kop op frame 0 |
| 2,1 | Snap ik. Maar deze let op de rest. | flip 1,3 s |
| 5,0 | Eén vergeten keer kan veertig euro kosten. | flip 4,7 s |
| 7,7 | Opzeggen kan altijd. | payoff 6,7 s |
| 9,5 | Activeer Buddy. | eindkaart 9,3 s |

Geschatte mp3-lengte: ~10.5 s (26 woorden, 5.0 lettergrepen/s). Video: 11.9 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
‘Nog een abonnement? Nee dank je.’ Fair. Maar dit is de enige die op de rest let 👀

#betaalbuddy #mythes #rekeningen #privacy
```

### Pijler 6 · Humor

#### BB-P6-01

**Zet het in je agenda** · onderwerp #31 · Skit (geanimeerde chat) · 12,3 s

- **Bestanden:** `renders/backlog/BB-P6-01-Reel.mp4` · `renders/backlog/BB-P6-01-Reel-cover.png` (cover = frame 80)
- **Wanneer:** Rond Moederdag (9 mei 2027) of een zondag. Geen VO.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Mam: “Zet het gewoon in je agenda.””** · chat “Mam”: Mam: “Heb je je zorgverzekering al betaald?” · Jij: “Ehh” · Mam: “Zet het gewoon in je agenda!” · Jij: “Doe ik nooit” · Jij: “Maar ik heb hem net naar Buddy gestuurd. Die zet hem erin.” · Mam: “Wie is Buddy??” |
| 7,1 s | **“Buddy zet het in je agenda. Jij niet.”** · Buddy · “Stuur je rekening door. De rest gaat vanzelf.” |
| 9,7 s | eindkaart: “Tag je moeder.” · woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst en de chat.

**Caption**

```
Mam: ‘zet het gewoon in je agenda’ 🙃 Ik: stuur hem naar Buddy, die doet dat. Tag je moeder.

#betaalbuddy #moeder #adulting #herkenbaar
```

#### BB-P6-02

**Achievement unlocked** · onderwerp #32 · Getallen-reveal · 8,9 s

- **Bestanden:** `renders/backlog/BB-P6-02-Reel.mp4` · `renders/backlog/BB-P6-02-Reel-cover.png` (cover = frame 110)
- **Wanneer:** De 1e van de maand. Geen VO; gebruik een rechtenvrij ‘level-up’-geluidje.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Adulting-badge unlocked.”** · 30 “dagen zonder aanmaning” · badges: “Eerste rekening doorgestuurd”, “Agenda gekoppeld”, “Betaald vóór het tweede seintje” |
| 3,7 s | **“Level up zonder stress.”** · Buddy · “Buddy onthoudt. Jij krijgt de badge.” |
| 6,3 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst.

**Caption**

```
Adulting-badge unlocked 🏆 30 dagen zonder aanmaning. Welke badge heb jij al?

#betaalbuddy #adulting #herkenbaar #studentenleven
```

#### BB-P6-03

**Tierlist** · onderwerp #33 · Dingen die niemand je vertelt · 12,6 s

- **Bestanden:** `renders/backlog/BB-P6-03-Reel.mp4` · `renders/backlog/BB-P6-03-Reel-cover.png` (cover = frame 200)
- **Wanneer:** Zondagmiddag (comments-magneet). Geen VO.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Tierlist: hoe jij rekeningen onthoudt.”** · F: “Hopen dat het goed komt” · D: “Markeren als ongelezen” · C: “Screenshot in je camerarol” · B: “Post-it op je laptop” · S: “Doorsturen naar Buddy” |
| 7,6 s | **“Wat is jouw tier?”** · Buddy · “Zet het in de comments. Wij oordelen niet.” |
| 10,0 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over:** geen VO; de video werkt op tekst.

**Caption**

```
Tierlist: hoe jij je rekeningen onthoudt. Eerlijk zijn 👇 Wij oordelen niet.

#betaalbuddy #adulting #herkenbaar #studentenleven
```

#### BB-P6-04

**Buddy's dagboek** · onderwerp #34 · Countdown · 12,8 s

- **Bestanden:** `renders/backlog/BB-P6-04-Reel.mp4` · `renders/backlog/BB-P6-04-Reel-cover.png` (cover = frame 100)
- **Wanneer:** Doordeweeks; goed als ‘zo werkt het’ voor nieuwe volgers.

**Tekst in beeld**

| Vanaf | Scène |
|---|---|
| 0,0 s | **“Buddy's dagboek.”** · “Dag”: 1 “Rekening binnen. Onthouden.” → 8 “Nog 7 dagen. Seintje gestuurd.” + melding “Nog 7 dagen · €49,99” → 13 “Nog 2 dagen. Nog een seintje.” + melding “Nog 2 dagen · betaal op tijd” → 14 “Betaald. Ik ben trots.” |
| 7,6 s | **“Saai dagboek. Precies goed.”** · Buddy met tekstballon “Tot de volgende!” · “Buddy onthoudt. Jij leeft je leven.” |
| 10,2 s | eindkaart: woordmerk + Buddy · knop “activeer buddy” · “Geen app. Geen bankkoppeling.” |

**Voice-over** (ElevenLabs Multilingual v2, Speed 1,0)

```
Buddy's dagboek. Dag één: rekening binnen. Dag acht: seintje. <break time="0.4s" /> Dag dertien: nog een. Dag veertien: betaald. <break time="0.1s" /> Saai. Precies goed. <break time="1.2s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Buddy's dagboek. | kop op frame 0 |
| 1,3 | Dag één: rekening binnen. | dag 1 |
| 3,2 | Dag acht: seintje. | rol naar 8 op 2,0 s |
| 4,9 | Dag dertien: nog een. | rol naar 13 op 4,0 s |
| 6,4 | Dag veertien: betaald. | rol naar 14 op 6,0 s |
| 8,0 | Saai. Precies goed. | klok-wipe 7,6 s |
| 10,3 | Activeer Buddy. | eindkaart 10,2 s |

Geschatte mp3-lengte: ~11.3 s (21 woorden, 5.0 lettergrepen/s). Video: 12.8 s. Beeldmomenten zijn exact; spreektijden zijn een schatting.

**Caption**

```
Buddy's dagboek: saai, voorspelbaar, op tijd. Precies zoals je het wil 📓

#betaalbuddy #adulting #herkenbaar #studentenleven
```
