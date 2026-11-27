# Audit betaalbuddy.nl (26 november 2026)

Bekeken: de homepage, `/start-met-betaalbuddy/` en `/betaalbuddy-referral-programma/`, op telefoonformaat (iPhone, 390 px breed), want vrijwel al het verkeer komt uit Instagram en TikTok.

**Kort gezegd:** het privacyverhaal ("Onder de motorkap") is sterk en eerlijk. Daaromheen staan beloftes die niet kloppen: een gratis proefperiode, WhatsApp-meldingen, een wachtlijst, een gebruikersaantal en drie pakketten. Voor een merk dat draait op "we zeggen precies wat we wel en niet doen" is dat het grootste risico. Bovendien zegt de eerste schermvulling niet wat het product doet, wat het kost of waar je moet tikken. Dat past bij de cijfers: 79 van de 91 bezoekers op de startpagina raakten niets aan.

---

## 1. Eerst rechtzetten: wat niet klopt (deze week)

| # | Waar | Wat er staat | Probleem | Oplossing |
|---|---|---|---|---|
| 1 | Homepage, popup linksonder | "Nieuwe inschrijving: Mark uit Amsterdam staat nu op de wachtlijst." | Er is geen wachtlijst, het product is live. Als deze melding niet echt is, is het misleidende sociale bewijskracht. Dat mag niet (oneerlijke handelspraktijk) en het botst met je merk. | Weghalen. |
| 2 | Homepage, slot | "Stel gratis je buddy in. Geen creditcard vereist • 7 dagen gratis proberen" | Er is geen proefperiode: betalen is aanmelden. | Vervangen door: "Probeer gratis met één rekening" (dat is je echte gratis route, `?try=1`) of "Start voor €3,49 per maand · 30 dagen geld terug". |
| 3 | Homepage, slot | "Sluit je aan bij de gebruikers die Betaalbuddy vertrouwen" | Suggereert een gebruikersbasis die (nog) niet aantoonbaar is. | Weghalen tot je echte aantallen of quotes hebt. |
| 4 | Homepage, prijzen | Drie pakketten. Buddy €3,49 belooft "Whatsapp/Telegram meldingen", Pro "Prioriteit support". | WhatsApp/Telegram bestaat nog niet. En sinds v5.3 is er één abonnement. | Eén kaart: Buddy, €3,49 per maand, mail + agenda + overzicht, 30 dagen geld terug. |
| 5 | Homepage, onder stap 05 | "Herinneringen en de agendalink zitten in Buddy en Buddy pro." | Klopt niet meer, en de backend geeft iedereen herinneringen. | Weghalen. |
| 6 | FAQ "Hoe komt het in mijn agenda?" | "Bij Basic zit dit er niet bij." | Basic bestaat niet meer. | Zin weghalen. |
| 7 | Referral-pagina (live en vindbaar via de footer) | "✏️ [BELONING VOOR JOU]", "Je vindt je deellink in je BetaalBuddy-account" | Een half ingevulde pagina met placeholders, en er bestaat geen account. | Offline halen tot de beloning en de werkwijze vaststaan (zie `EERSTE-25.md`). |
| 8 | Footer | "Meet je Buddy" linkt naar `http://`; een lege link `item.url` | Kapotte links. | Laten wijzen naar `/start-met-betaalbuddy/` of weghalen. |
| 9 | Meta description (Google, gedeelde links) | "Vanaf € 2,99 p/m" | Oude prijs. | "Stuur je rekening door, Buddy mailt je voordat hij verloopt en zet hem in je agenda. Geen app, geen account, geen AI. €3,49 per maand." |
| 10 | FAQ "Werkt het met Outlook…?" | "Er is geen koppeling met Gmail of Google meer nodig; die oude versie bestaat niet meer." | Interne geschiedenis. Een nieuwe bezoeker gaat juist twijfelen. | "Ja, met elk mailprogramma dat kan doorsturen." |
| 11 | Hele site | Google Tag Manager (`GTM-WGGW9722`) laadt, maar in de HTML en op het eerste scherm staat geen cookiemelding. | Laadt Tag Manager GA4 of de Meta Pixel zonder toestemming, dan is dat in strijd met de cookieregels. En het botst met je privacybelofte. | Controleren in Tag Manager. Is er geen toestemmingsbanner, voeg er een toe (of stap over op cookieloze analytics). |

**Let op bij de startpagina:** de live versie van `/start-met-betaalbuddy/` is nieuwer dan het bestand dat je me stuurde. Buddy heeft daar al "Seintje per mail, 7 en 2 dagen vooraf", en Pro heeft de tekst "ook op de dag zelf". v5.3 is gebouwd op het bestand dat je stuurde. Neem bij het plaatsen de teksten over die je live later nog hebt aangepast, of stuur me de live code, dan voeg ik het samen.

---

## 2. Grootste winst: het eerste scherm

**Nu, op een telefoon:** de kop "Rekeningen vergeten is geen personality trait meer", een animatie van een notificatie, de popup "Mark uit Amsterdam" en pas daaronder (buiten beeld) wat het product doet. De enige knop in beeld is "Probeer Buddy" in de menubalk. Er staat geen prijs, geen "hoe" en geen €40.

Iemand die vanuit een Reel binnenkomt, heeft 2 tot 3 seconden. In die tijd moet hij drie dingen zien: wat het doet, dat het veilig is, en waar hij moet tikken.

**Voorstel voor het eerste scherm:**
- **Kop:** wat je krijgt (zie de alternatieven hieronder).
- **Eén regel:** "Stuur je rekening door. Je krijgt 7 en 2 dagen vooraf een mail, en hij staat in je agenda. Geen app, geen account, geen AI."
- **Hoofdknop:** "Probeer gratis met je eigen rekening" → `/start-met-betaalbuddy/?try=1`. Dat is echt gratis (het .ics-bestand) en vraagt niets, dus de drempel is laag voor koud verkeer. Daarna loopt het pad vanzelf door naar betalen.
- **Tweede knop of tekstlink:** "Direct starten, €3,49 per maand".
- **Kleine regel onder de knoppen:** "Eén vergeten rekening kost al snel €40 aan incassokosten."
- De notificatie-animatie mag blijven, maar onder de tekst. De popup gaat weg.

**Kop: drie alternatieven**
1. "Je rekeningen op tijd betaald. Zonder dat iemand je inbox leest." *Belofte plus het grootste bezwaar in één zin.*
2. "Stuur je rekening door. Buddy mailt je voordat hij verloopt." *Zegt precies wat je doet; sterk voor koud verkeer.*
3. "Eén vergeten rekening kost €40. Buddy kost €3,49 per maand." *Rekensom; past bij de BNPL- en boete-advertenties.*

De huidige kop mag terugkomen als tussenkop verderop. Hij is leuk, maar hij vertelt niet wat Buddy doet.

**Knoptekst: alternatieven**
- "Probeer gratis met je eigen rekening": laagste drempel, eerlijk gratis.
- "Start voor €3,49 per maand": voor wie al overtuigd is.
- Niet meer: "Probeer Buddy" (te vaag) en "Stel gratis je buddy in" (klopt niet).

---

## 3. Belangrijke aanpassingen (komende twee weken)

1. **Advertenties direct naar de startpagina.** Iemand die een Reel ziet over vergeten rekeningen hoeft niet door 11.000 pixels homepage (ongeveer 13 schermen op een telefoon). Stuur advertentieverkeer naar `/start-met-betaalbuddy/` of `?try=1`, met UTM-tags per advertentie. Houd de homepage voor wie zelf zoekt of doorverwezen wordt.
2. **De homepage inkorten en anders ordenen:** eerste scherm → hoe het werkt (3 stappen) → privacy ("Onder de motorkap", ingekort tot 3 kaarten) → prijs (één kaart) → FAQ → slotknop. Zet de prijs hoger; nu staat hij pas na zes schermen.
3. **"Wat het oplost" vullen of schrappen.** Nu staan er drie kopjes zonder uitleg ("Je wordt niet meer verrast", "Geen stress mails meer", "Geen geld meer weggooien"). Of maak er voorbeelden van met echte bedragen (€40 incasso, CJIB +50%, een geblokkeerd telefoonnummer), of haal het weg.
4. **De 3 stappen in gewone taal.**
   - "Kies je abonnement" → "Meld je aan, dan krijg je je eigen Buddy-adres".
   - "Stel je filters en forwarding in" → "Stuur een rekening door. Wil je het automatisch, zet dan één filter."
   - "BetaalBuddy maakt agenda herinneringen…" → "Je krijgt een mail 7 en 2 dagen vooraf, en de datum staat in je agenda."
5. **Echt vertrouwen in plaats van verzonnen vertrouwen.** Je hebt nog geen klantaantallen, maar wel: een gezicht en naam (de founder), "gebouwd in Geldrop, KvK 89078802", "betalen via Mollie" (staat al in de footer; zet het bij de knop), "30 dagen geld terug", en de pagina waar je alles ziet wat Buddy bewaart. Vervang ze later door echte quotes van founding members.
6. **Het privacyblok is je beste stuk.** "Toegang tot je mailbox? Weigeren / Niet nodig" laat in één beeld het verschil met AI-inboxtools zien. Gebruik dat beeld ook in advertenties.

---

## 4. Testideeën (pas zinvol vanaf zo'n 300 bezoekers per variant)

| Hypothese | Variant A | Variant B | Meten met |
|---|---|---|---|
| Een gratis eerste stap verlaagt de drempel voor koud verkeer | Knop "Start voor €3,49" | Knop "Probeer gratis met je eigen rekening" | `ob_engaged`, `tryout_open`, `purchase` |
| Advertentieverkeer converteert beter zonder homepage | Advertentie → homepage | Advertentie → startpagina | `begin_checkout` per UTM |
| De prijs in het eerste scherm schrikt niet af maar schept duidelijkheid | Zonder prijs | Met "€3,49 per maand" | `ob_engaged` → `purchase` |
| Kop met belofte wint van een grappige kop | "…geen personality trait meer" | "Je rekeningen op tijd betaald. Zonder dat iemand je inbox leest." | Scrolldiepte, `ob_engaged` |

Bij de huidige aantallen bezoekers zijn A/B-tests nog te klein. Doe eerst de vaste verbeteringen (punt 1 en 2) en meet daarna een week vóór en een week na.
