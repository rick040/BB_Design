# De eerste 25 betalende klanten: berichten en aanbod

Bijhouden in Notion: **Founding members en leads** (één regel per persoon) en **Scorebord eerste 25 klanten** (één regel per week, doel 25 eind januari 2027). Beide staan onder het project BetaalBuddy.

## Het aanbod voor founding members

Wat je geeft:
- Je helpt persoonlijk om de eerste rekening door te sturen (5 minuten, via WhatsApp of in het echt).
- Hun prijs blijft €3,49 per maand zolang ze klant blijven, ook als de prijs later omhooggaat. *Dit is een voorstel; beslis zelf of je het wilt beloven.*
- 30 dagen geld terug, zoals voor iedereen.

Wat je terugvraagt:
- Eén eerlijk antwoord na twee weken: "Wat zou je missen als Buddy stopt?" Zet het letterlijk in Notion onder *Waarom wel of niet*.

Geen korting op de eerste maand. Je wilt weten of mensen €3,49 betalen, niet of ze iets gratis aannemen.

## Ritme

- 10 persoonlijke berichten per dag, 5 dagen achter elkaar. Dat zijn 50 mensen.
- Wie reageert maar niet betaalt: na 3 dagen één keer opvolgen, daarna niet meer.
- Elke vrijdag het scorebord bijwerken met Mollie (betalende klanten, opzeggers) en GA4.

## Berichten

Pas de namen aan en verstuur ze zelf. Geen uitroeptekens, gewoon praten.

**1. Aan iemand van 18–27 die je kent (WhatsApp)**
> Hoi [naam], ik heb iets gebouwd waar ik je mening over wil. Het heet Betaalbuddy: je stuurt een rekening door naar je eigen adres, en je krijgt een mail voordat hij verloopt, plus de datum in je agenda. Geen app, en niemand leest je inbox. Het kost €3,49 per maand, en binnen 30 dagen krijg je je geld terug als het niks is. Zou je het willen proberen? Dan help ik je met je eerste rekening, kost 5 minuten. betaalbuddy.nl

**2. Aan een ouder van iemand die net op zichzelf woont**
> Hoi [naam], jullie [zoon/dochter] woont toch sinds kort op zichzelf? Ik heb Betaalbuddy gemaakt voor precies die fase: zorgverzekering, telefoon, huur en boetes komen ineens allemaal per mail binnen. Je stuurt een rekening door en krijgt op tijd een seintje, voordat er €40 incassokosten bij komen. €3,49 per maand, 30 dagen geld terug. Mag ik het [naam] een keer laten zien?

**3. Opvolgen na 3 dagen (één keer)**
> Hoi [naam], nog even over Betaalbuddy: als het nu niet uitkomt is dat helemaal prima. Wil je het wel proberen, stuur me dan je eerste rekening-mail, dan zetten we hem samen klaar.

**4. Aan een studentenvereniging of studentenhuis (mail aan het bestuur)**
> Onderwerp: Voor jullie leden: nooit meer €40 incassokosten
>
> Hoi [naam],
>
> Ik ben [je naam], maker van Betaalbuddy uit Geldrop. Veel eerstejaars krijgen in één half jaar hun eerste zorgverzekering, telefoonabonnement, huur en soms een boete, allemaal per mail. Eén vergeten rekening kost al snel €40 aan incassokosten.
>
> Betaalbuddy lost dat op zonder app en zonder toegang tot je inbox: je stuurt een rekening door en krijgt een mail voordat hij verloopt, plus de datum in je agenda. €3,49 per maand, maandelijks opzegbaar.
>
> Mijn voorstel: het bestuur gebruikt het een jaar gratis, en jullie krijgen een eigen code. Voor elke leden-aanmelding via die code maak ik [bedrag, bijv. €5] over naar de verenigingskas. Ik kom het graag een keer kort uitleggen op een borrel of in de groepsapp.
>
> Groet,
> [naam]
> betaalbuddy.nl · KvK 89078802

**5. Om door klanten te laten delen (referral)**
> Ik gebruik Betaalbuddy: je stuurt je rekening door en krijgt een mail voordat hij verloopt. Geen app, niemand leest je inbox. Via mij krijgen we allebei een maand gratis: mail na je aanmelding even naar [jouw contactadres, FILL IN] dat je via [naam] kwam. betaalbuddy.nl

**Referral voorlopig met de hand.** Er is geen account en geen referral-koppeling in de backend. Voor de eerste 25: wie zegt via wie hij kwam, krijgt samen met die persoon een maand extra. Die verlenging zet je met de hand (`paid_until` + 30 dagen). Pas als het werkt, bouwen we het in. Tot die tijd blijft de referral-pagina offline.

**6. Sticker bij de brievenbussen van studentenhuizen (A7 of rond 8 cm)**
> Weer een aanmaning in je mail?
> Stuur hem door. Buddy herinnert je op tijd.
> [QR naar betaalbuddy.nl/start-met-betaalbuddy/?try=1&utm_source=sticker&utm_campaign=(huisnaam)]
> Gratis proberen met je eigen rekening

Geef elke locatie een eigen `utm_campaign`, dan zie je in GA4 welk huis iets oplevert. Op verzoek ontwerp ik de sticker in Canva in je huisstijl.

## Welke kanalen voor 25

| Kanaal | Doel | Waarom |
|---|---|---|
| Eigen netwerk (bericht 1–3) | 10 | Persoonlijk contact betaalt het vaakst; je leert de bezwaren uit de eerste hand |
| Studentenverenigingen en -huizen (bericht 4, sticker) | 8 | Precies het moment dat de eerste rekeningen binnenkomen |
| Referral (bericht 5) | 4 | Huisgenoten hebben dezelfde rekeningen |
| Organische Reels en TikTok, kleine Meta-test | 3 | Om te leren welke boodschap werkt; opschalen pas als het onder €12 per klant blijft |

Het zijn aannames. Bijsturen doe je op het scorebord, elke vrijdag.
