# 06. Stories

Statische Instagram Stories voor BetaalBuddy in 1080×1920 (9:16).

- `build.py`: alle stories staan in `STORIES`. `python3 build.py` bouwt alles, `python3 build.py simpel` één serie, `python3 build.py simpel-03` één story. Vereist Python met `playwright` en Chromium. Staat Chromium op een andere plek, zet dan `CHROME_PATH`.
- `src/`: bewerkbare HTML per story. Open in je browser om tekst te proberen; blijvend aanpassen doe je in `build.py`, want een nieuwe build overschrijft `src/`.
- `renders/`: PNG's om te posten.
- Bij de serie Instellen meldt het script per story de onderkant van de inhoud. Komt die onder y 1590, dan staat er `LET OP`: dan botst de tekst met het woordmerk of met de berichtbalk van Instagram.

Merk, fonts en Buddy komen uit `04. Animation` (zelfde paden en kleuren).

---

## Serie "Simpel" (highlight, compact)

Vijf stories in dezelfde opbouw als de bestaande highlight "Meet Buddy": blauw vlak, grote witte kop bovenaan, één beeld in het midden, één zin in zacht blauw eronder. Geen stapnummers, lijstjes of tipvakken. Stap 1 en 2 van de instelpagina (mailtje sturen, gegevens plakken) zijn samengevoegd tot "Stuur één mailtje".

| # | Bestand | Kop | Zin eronder |
|---|---|---|---|
| 01 | `BB-Story-Simpel-01-zo-stel-je-buddy-in.png` | Zo stel je Buddy in | Vier korte stappen. Samen zo'n vijf minuten. |
| 02 | `BB-Story-Simpel-02-stuur-een-mailtje.png` | Stuur één mailtje | Je krijgt je eigen doorstuuradres terug. |
| 03 | `BB-Story-Simpel-03-stuur-je-rekening-door.png` | Stuur je rekening door | Buddy haalt het bedrag en de vervaldatum eruit. |
| 04 | `BB-Story-Simpel-04-zet-de-agenda-aan.png` | Zet de agenda aan | Met één tik staan je vervaldatums in je agenda. |
| 05 | `BB-Story-Simpel-05-doe-een-test.png` | Doe één test | Krijg je een mail terug met bedrag en datum? Dan let Buddy op. |

Plaatsen: post 01 tot en met 05 op volgorde en bundel ze in een highlight "Instellen". Als cover kun je `BB-Story-Instellen-00-highlight-cover.png` gebruiken. Zet op story 05 eventueel een linksticker naar de instelpagina, in de lege ruimte tussen het beeld en de zin.

Open controles: dezelfde als hieronder (instelpagina live, Basic zonder agenda, novemberdata). Story 02 zegt niet dat je het mailtje moet sturen vanaf het adres waar je je mails van Buddy wilt krijgen; dat staat op de instelpagina zelf.

---

## Serie "Stel je Buddy in" (highlight, uitgebreid)

Zeven stories die de vijf stappen van de instelpagina `/stel-je-buddy-in/` laten zien, plus een highlight-cover. Bron: de instelpagina en de walkthrough-video (`04. Animation/WALKTHROUGH.md` op branch `ccr-fbc3e39b-cdjg5n`). Titels, knoppen en tips volgen de pagina.

| # | Bestand | Thema | Inhoud |
|---|---|---|---|
| 00 | `BB-Story-Instellen-00-highlight-cover.png` | blauw | Buddy met tandwiel, voor het rondje van de highlight |
| 01 | `BB-Story-Instellen-01-intro.png` | blauw | "Stel je Buddy in." De vijf stappen, samen ongeveer 5 minuten |
| 02 | `BB-Story-Instellen-02-stap-1-adres.png` | licht | Stap 1: Open mijn mail, mail aan start@ staat klaar, Van-regel gemarkeerd |
| 03 | `BB-Story-Instellen-03-stap-2-plakken.png` | blauw | Stap 2: welkomstmail kopiëren, doorstuuradres en agendalink plakken |
| 04 | `BB-Story-Instellen-04-stap-3-doorsturen.png` | licht | Stap 3: rekening openen, Doorsturen, je doorstuuradres plakken |
| 05 | `BB-Story-Instellen-05-stap-4-agenda.png` | blauw | Stap 4: agenda kiezen en Abonneer, vervaldatums in je agenda |
| 06 | `BB-Story-Instellen-06-stap-5-test.png` | licht | Stap 5: proefmail van € 1,00, bevestiging terug, Al betaald |
| 07 | `BB-Story-Instellen-07-klaar.png` | blauw | "Klaar. Je Buddy let op." Vijf vinkjes en de link naar de instelpagina |

### Plaatsen
1. Post story 01 tot en met 07 op volgorde (01 eerst). Na 24 uur blijven ze in je archief staan.
2. Profiel, **Nieuw** (het plusje bij de highlights), kies de zeven stories en noem de highlight **Instellen**.
3. Cover: **Wijzig cover**, kies `00-highlight-cover` uit je filmrol en schuif het rondje zo dat Buddy en het tandwiel in het midden staan.
4. Story 07: zet er een **linksticker** op naar de instelpagina, in de lege ruimte onder de URL (rond y 1450 tot 1580).

Tip: post de cover niet als story. Je kunt hem direct uit je filmrol als highlight-cover kiezen.

### Voorbeelddata (aan te passen in `build.py`)
- Je eigen mail: `jij@mijnmail.nl`. Doorstuuradres `a8f3k@in.betaalbuddy.nl` en agendalink: het voorbeeld van de instelpagina.
- Rekening: Energieleverancier, € 84,20, te betalen voor 28 november.
- Agenda: Telefoonprovider € 37,85 (vr 13 nov) en Zorgverzekeraar € 142,50 (di 24 nov).
- Proefmail: € 1,00, vervaldatum 13 november (vandaag plus 14 dagen, zoals de pagina rekent, vanaf 30 oktober).

<!-- copycheck:off -->
### Copy
Geen "gratis", geen prijzen, geen WhatsApp of Telegram, geen "scant je inbox", geen merknamen van mailprogramma's of agenda's (de walkthrough noemt ze wel, maar dit is publiek op je profiel), geen gedachtestreepjes. Buddy "houdt de datum bij"; jij betaalt.
<!-- copycheck:on -->

### Open controles
- **Instelpagina live?** Story 02 tot en met 07 verwijzen naar de instelpagina en story 07 noemt `betaalbuddy.nl/stel-je-buddy-in`. Volgens de changelog moest die pagina nog geplaatst worden (open punt van 14 oktober). Check dat de link werkt voor je de highlight maakt.
- **Mails van Betaalbuddy zijn nagemaakt.** De welkomstmail ("Je Buddy staat klaar") en de bevestiging ("Genoteerd: Betaalbuddy test" met "Al betaald") komen uit de walkthrough-video en zijn niet vergeleken met de echte mails van noreply@. Zelfde open punt als bij de video.
- **Basic en de agenda.** Basic heeft geen agenda en geen herinneringen. Story 05 zegt "Mag ook later. Geen agenda? Sla deze stap over. De mails zijn genoeg.", net als de pagina. Moet stap 4 voor Basic weg, dan geldt dat voor de pagina, de video en deze story.
- **Automatisch doorsturen** (tip op story 04): nog niet bevestigd dat het bij alle grote mailprogramma's werkt; de tip zegt alleen dat de pagina uitlegt hoe het moet.
- **Data verouderen.** Highlights blijven maanden staan. Wil je geen novemberdata in maart, zet dan de voorbeelddata in `build.py` om en bouw opnieuw.
