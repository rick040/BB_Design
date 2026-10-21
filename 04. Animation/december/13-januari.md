# Idee 13 · Januari staat al klaar

Carrousel van 6 slides (1080 × 1350), een bewaar-carrousel: welke rekeningen in januari kunnen komen en wat je nu al kunt klaarzetten. Geen bedragen in beeld, want die verschillen per persoon. Draait organisch én als ad. Fase Januari klaarzetten, funnel MOFU. Posten: za 26 t/m wo 30 december; als ad ook in de eerste week van januari (planning: za 26 dec).

## Bestanden en composities

| Slide | Composition | Achtergrond | Beeld |
|---|---|---|---|
| 1 | `DEC13-Januari-1` | blauw | "Deze rekeningen kunnen in januari komen. Zet ze nu klaar." Kalender januari, chip "Bewaar dit", Buddy |
| 2 | `DEC13-Januari-2` | licht | Je nieuwe zorgpremie: kaart van de zorgverzekeraar, bedrag als skeleton |
| 3 | `DEC13-Januari-3` | blauw | Termijnen van wat je in december kocht: tijdlijn dec, jan, feb ("voorbeeld") |
| 4 | `DEC13-Januari-4` | licht | Jaarabonnementen die verlengen: drie generieke abonnementen |
| 5 | `DEC13-Januari-5` | blauw | Wat per persoon verschilt, zoals gemeente of energie: check je eigen post |
| 6 | `DEC13-Januari-6` | licht | Stuur ze door zodra ze binnen zijn: doorsturen, agenda met seintjes 7 en 2 dagen vooraf, chip, "Bewaar dit voor januari." |

PNG's: `renders/december/DEC13-Januari-1.png` t/m `-6.png`. Code: `src/december/d13-januari/` (`schema.ts` bevat alle teksten).

## Tekst op de slides (uit het campagnebestand)

1. Deze rekeningen kunnen in januari komen. Zet ze nu klaar.
2. Je nieuwe zorgpremie.
3. Termijnen van wat je in december kocht.
4. Jaarabonnementen die verlengen.
5. Wat per persoon verschilt, zoals gemeente of energie: check je eigen post.
6. Stuur ze door zodra ze binnen zijn. Buddy zet de datum in je agenda.

Voorbeelden in beeld (Zorgverzekeraar, Webshop, Sportschool, Tijdschrift, Software, de datums vr 15 jan, vr 8 jan en wo 13 jan) zijn generiek of verzonnen; er staat geen bedrag en geen merknaam in. Slide 5 doet geen claim over wat iemand betaalt.

## Instagram-caption (organisch)

```
Januari komt eraan, en met januari komen de rekeningen. 📬 Bewaar deze post, dan zet je ze nu alvast klaar.

Dit kan er in januari binnenkomen:
📌 je nieuwe zorgpremie
📌 termijnen van wat je in december kocht
📌 jaarabonnementen die verlengen
📌 post van gemeente of energie (verschilt per persoon, check je eigen post)

Stuur ze door zodra ze binnen zijn. Buddy zet de datum in je agenda, met een seintje 7 en 2 dagen vooraf. 📅

Geen app. Geen bankkoppeling.
Link in bio 👆

#januari #rekeningen #zorgpremie #geldzaken #betaalbuddy
```

## Ads Manager (carrouselad)

- **Primaire tekst:** `Zorgpremie, termijnen, jaarabonnementen: in januari komt er veel tegelijk. Zet je rekeningen nu klaar.`
- **Kop:** `Januari staat al klaar`
- **Knop:** Aanmelden
- Doelgroep en budget: laag Bereik (TOFU/MOFU), breed NL 21 t/m 34, zie "Ads en budget" in het campagnebestand. Poort voor betaald: eerst organisch laten lopen.
- Kaartkoppen per slide (optioneel in de carrouselad): 1 "Januari staat al klaar", 2 "Je nieuwe zorgpremie", 3 "Termijnen uit december", 4 "Jaarabonnementen", 5 "Check je eigen post", 6 "Stuur door, Buddy onthoudt".
- De link moet naar de gekozen instappagina wijzen (zie open controles).

## Alt-tekst

1. Blauwe slide met de tekst "Deze rekeningen kunnen in januari komen. Zet ze nu klaar." Een kalender januari, een chip "Bewaar dit" en een witte Buddy.
2. Lichte slide "Je nieuwe zorgpremie." Een kaart van een zorgverzekeraar met een grijs skeleton op de plek van het bedrag. Blauwe Buddy kijkt mee.
3. Blauwe slide "Termijnen van wat je in december kocht." Een kaart van een webshop, termijn 2 van 3, met een tijdlijn december (gedaan), januari en februari.
4. Lichte slide "Jaarabonnementen die verlengen." Drie kaarten (sportschool, tijdschrift, software) die elk jaar automatisch verlengen.
5. Blauwe slide "Wat per persoon verschilt." Twee enveloppen, van de gemeente en de energieleverancier, en een witte Buddy die meekijkt: "Zoals gemeente of energie. Check je eigen post."
6. Lichte slide "Stuur ze door zodra ze binnen zijn." Een mail van de zorgverzekeraar met een pijl naar een agenda met de vervaldatum vr 15 jan en seintjes 7 en 2 dagen vooraf. Onderaan "Bewaar dit voor januari."

## Open controles

- **Link in bio en de bestemming van de ad:** welke instappagina (campagnebestand: `/start-met-betaalbuddy/` zodra die er is).
- **Feitelijke zinnen** over januari (nieuwe zorgpremie, termijnen, verlengende abonnementen): in de uiting staat "kunnen", zonder bedragen. Controleer voor plaatsing of de formulering nog klopt.
- Slide 1 t/m 5 tonen het productmoment alleen in woorden en op slide 6 (chip). Wil je het op elke slide, zet dan de `chip` ook voor die slides aan in `JanuariSlide.tsx`.

## Aanpassen en renderen

- Studio: `npm run dev`, map `December-Lijstje` → `D13-Januari` → `DEC13-Januari-1` t/m `-6`.
- Blijvend wijzigen: `src/december/d13-januari/schema.ts` (`defaultJanuariProps`).
- Renderen: `node scripts/render-december.cjs DEC13-Januari-1,DEC13-Januari-2,DEC13-Januari-3,DEC13-Januari-4,DEC13-Januari-5,DEC13-Januari-6`.
