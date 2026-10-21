# Idee 12 · Vriend mee de feestdagen door (Reel, referral)

Campagne "Buddy houdt het lijstje bij", fase Vriendenweek, eindsprint naar het doel van 35 betalende abonnees op 19 december. Hoek: twee Buddies. De linker heeft een nette agenda, de rechter ligt onder een berg enveloppen (de vriend die altijd "o ja, die rekening" zegt). De linker stuurt een link, de rechter stuurt zijn eerste rekening door, de berg wordt een agenda en ze proosten met warme chocomel.

Posten: maandag 14 t/m zaterdag 19 december. Kanaal: organisch plus betaald (doorverwijzen, 15 % van het restbudget; volgers en klanten-lookalike zodra er 20+ klanten zijn).

## Composities

| Id | Formaat | Gebruik | Lengte |
|---|---|---|---|
| `DEC12-Vriend-Reel` | 1080×1920 (9:16) | Reel, Story, ad | 15,0 s (450 frames) |
| `DEC12-Vriend-Feed` | 1080×1350 (4:5) | Feed, ad | 15,0 s |

Bestanden: `renders/december/DEC12-Vriend-Reel.mp4`, `DEC12-Vriend-Feed.mp4` en `DEC12-Vriend-Reel-cover.png` (frame 72, de vriend zucht "O ja, die rekening…").

## Scènes en gemeten tijden (30 fps, overgang 0,4 s)

| # | Scène | Start (s) | Eind (s) | Frames | Kleur | Overgang erin |
|---|---|---|---|---|---|---|
| 1 | Die ene vriend onder de enveloppen | 0,00 | 3,40 | 0 tot 102 | licht | n.v.t. |
| 2 | Stuur hem je link | 3,00 | 6,80 | 90 tot 204 | blauw | slide van rechts |
| 3 | De berg wordt een agenda | 6,40 | 11,20 | 192 tot 336 | licht | wipe van onder |
| 4 | Proost (CTA) | 10,80 | 15,00 | 324 tot 450 | blauw | iris |

| Tijd (s) | Beeld |
|---|---|
| 0,00 | Kop staat er, rustige Buddy (blauw) met "Mijn agenda", de vriend (lichtblauw) onder acht enveloppen |
| 0,73 tot 1,00 | Vinkjes in de agenda: Huur, Zorgpremie, Webshop |
| 1,33 en 1,53 | De berg schudt, de vriend zegt "O ja, die rekening…" |
| 3,67 | De linker Buddy stuurt een berichtje met link, het vliegt naar rechts |
| 4,87 | De vriend antwoordt "Top, doe ik!" |
| 7,00 | De enveloppen vliegen één voor één naar "Je eigen Buddy-adres" |
| 8,60 | De agenda klapt open; items Huur (3 dec), Webshop achteraf (9 dec) en Zorgpremie (14 dec), elk met een 7- en 2-seintje (8,67 tot 9,60 s) |
| 11,33 | Mokken komen omhoog |
| 12,07 | Proost met vonkjes |
| 12,53 | Knop "activeer buddy" |
| 14,13 | Tik op de knop |

Slotbeeld: twee Buddies met een mok chocomel, een proost. Buddy staat dus niet op de knop.

## Voice-over (ElevenLabs Multilingual v2, Speed 0,9)

Beelden zijn gemeten, spreektijden zijn een schatting (4,5 lettergrepen per seconde). De pauze van 2,5 s na "Stuur hem je link." is bewust: het berichtje en het antwoord vliegen dan door beeld.

```
Die ene vriend onder de enveloppen. <break time="0.5s" /> Stuur hem je link. <break time="2.5s" /> Eén rekening door. <break time="0.2s" /> De berg wordt een agenda. <break time="0.5s" /> Per vriend die lid wordt, jij een maand gratis.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Die ene vriend onder de enveloppen. | Kop, vriend onder de berg enveloppen, rustige Buddy met nette agenda |
| 3,2 | Stuur hem je link. | Kop "Stuur hem je link.", link vliegt naar rechts (3.67 s) |
| 6,9 | Eén rekening door. | Enveloppen vliegen naar het Buddy-adres (7.0 s) |
| 8,5 | De berg wordt een agenda. | Agenda klapt open, items met 7 en 2 (8.6 s tot 9.6 s) |
| 10,9 | Per vriend die lid wordt, jij een maand gratis. | Slotkop; proost bij 12.07 s, knop bij 12.53 s |

Doellengte mp3: ongeveer 13,3 s. Zet de mp3 in `public/` en de bestandsnaam in de prop `music` (`musicVolume` op 1).

## Instagram-caption (Reel)

```
Die ene vriend onder de enveloppen: je kent hem. 📬 Neem hem mee de feestdagen door.

Buddy houdt het lijstje bij, ook voor jouw vriend. 💙
🔗 Stuur hem je link
📩 Hij stuurt zijn eerste rekening door naar zijn eigen Buddy-adres
🗓️ Buddy zet de datum in zijn agenda, met een seintje 7 en 2 dagen vooraf

Per vriend die lid wordt: jij een maand gratis. 🎁

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #vriendenweek #feestdagen #rekeningen #geldzaken
```

## Ads Manager

- Primaire tekst (104 tekens): `Die ene vriend onder de enveloppen? Stuur hem je link. Wordt hij lid, dan krijg jij een maand gratis.`
- Kop (29 tekens): `Vriend mee de feestdagen door`
- Knop: Aanmelden
- Doelgroep: volgers en klanten-lookalike zodra er 20+ klanten zijn; tot dan volgers en betrokken kijkers.

## Open controles

- **"Gratis":** de aanbieding "per vriend die lid wordt, jij een maand gratis" komt uit het campagnebestand (werver krijgt handmatig een maand, de vriend niets extra). De copycheck flagt "gratis"; dat is hier bedoeld, het gaat niet om een proefperiode. Besluit "Doorverwijzen: blijft het zo?" staat nog open.
- Hoe weet je wie wie heeft uitgenodigd (code, "wie heeft je gestuurd?" bij aanmelding)? In beeld staat alleen "Stuur hem je link".
- De link-sticker of "link in bio" moet naar de gekozen instappagina wijzen (`/start-met-betaalbuddy/`).
- De bubbel "Handig voor je rekeningen: betaalbuddy.nl" is een voorbeeldbericht, geen echt chatmerk.
- Voorbeeldbedragen en -data (3, 9, 14 dec) zijn illustratief.

## Aanpassen en exporteren

- Studio: `npm run dev`, map December-Lijstje, D12-Vriend. Teksten, agenda-items, kleuren en timings staan in `src/december/d12-vriend/schema.ts` (`defaultVriendProps`).
- Renderen: `node scripts/render-december.cjs DEC12-Vriend-Reel,DEC12-Vriend-Feed`; cover: `node scripts/render-december.cjs DEC12-Vriend-Reel@72`.
