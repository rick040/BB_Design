# BetaalBuddy · Instagram ad, concept 104

## "De rest ziet hij niet." (brievenbus)

**In één zin:** een koppeling geeft een app de sleutel van je hele mailbox; Buddy heeft geen sleutel nodig, want jij doet alleen die ene rekening door de brievenbus.

| | |
|---|---|
| Formaat | 9:16 Reels/Stories 1080×1920 (`BB-Brievenbus-Reel`), alleen Reel met stem |
| Lengte | 13,2 s (395 frames, 30 fps): stem 12,1 s plus 1 s CTA |
| USP | `geen-koppeling` (langst niet gebruikt volgens de changelog: laatst concept 96 op 17 nov) |
| Vorm | twee schermen naast elkaar (laatste drie: mythe/feit, vraag en antwoord, probleem-doorsturen-uitkomst) |
| Geluid | Eén ElevenLabs-take (eleven_v4), loudnorm -14 LUFS. Zonder geluid te volgen via de koppen |

### Hoe dit verschilt
| | 3 · Jij kiest wat Buddy ziet | 88 · Magneet | 96 · Papieren vliegtuig | **104 · Brievenbus** |
|---|---|---|---|---|
| Visueel systeem | focus wazig/scherp | elektromagneet, stekker | vouwende mailrij | voordeur, sleutel, brievenbus; split screen |
| Buddy | slaapmasker | trekt de stekker eruit | vangt vliegtuigje | schopt de sleutel weg, vangt de rekening onder de brievenbus |
| Einde | regie | stekker valt | hoedje op Buddy | ogen knijpen dicht achter de klep: "De rest ziet hij niet." |
| Overgangen | wipe, focus pull | n.v.t. | n.v.t. | deurzwaai (rotateY), brievenbus-spleet (clip-path), klep (rotateX) |

## Storyboard (frames uit `public/vo/brievenbus/timing.json`)

1. **Hook, 0,0 tot 2,2 s, licht.** "Een app in je hele mailbox?" Voordeur met sleutel "Koppeling" in het slot; op "mailbox" zwaait de deur open en vijf mails (Werk, Familie, Bank, Dokter, Vrienden) waaieren uit, elk met een oogje. Chip "Alles leesbaar?".
2. **Twee schermen, 2,2 tot 6,0 s, blauw, deurzwaai.** Links "Met koppeling": deur wijd open, mails met oogjes, op "open" springt alles. Rechts "Met Buddy": dichte deur met brievenbus. Kop wisselt naar "Buddy hoeft geen sleutel."; Buddy verschijnt, een sleutel valt en Buddy schopt hem het beeld uit.
3. **Brievenbus, 6,0 tot 9,3 s, licht, spleet.** "Stuur alleen die ene door." De rekening van de Energieleverancier (€87,60, do 17 dec) duwt zich door de brievenbus, valt op Buddy's hoofd; op "Buddy leest hem" klappen vier velden uit: €87,60, do 17 dec, Betaallink, Kenmerk.
4. **CTA, 9,3 tot 13,2 s, blauw, klep.** "De rest ziet hij niet." Buddy's ogen gluren door de brievenbus en knijpen dicht op "niet"; op "Activeer" gaan ze open en kijken naar de knop "activeer buddy", subregel "Alleen wat jij doorstuurt.", woordmerk, tik.

<!-- copycheck:off -->
## Copyregels
Brand §2 en §3: geen mailboxkoppeling, alleen doorsturen; Buddy leest bedrag, vervaldatum, betaallink en kenmerk. Geen "bewaart niets", geen prijs, geen rood (PM-149).
<!-- copycheck:on -->

## Voice-over (ElevenLabs eleven_v4, stem uit ELEVENLABS_VOICE_ID, één take)
```
[S1] Een app in je hele mailbox? [S2] Een koppeling zet alles open. Buddy hoeft geen sleutel. [S3] Stuur alleen die ene rekening door. Buddy leest hem. [S4] De rest ziet hij niet. Activeer Buddy.
```
Scènestarts (frames): 0, 66, 180, 280. Stem eindigt op frame 365. Langste pauze 0,48 s.

## Caption
Zie `renders/brievenbus-caption.md`.

**Ads Manager:** primaire tekst "Geen koppeling met je mailbox nodig. Stuur alleen die ene rekening door. De rest ziet Buddy niet." · Kop "Buddy ziet alleen wat jij doorstuurt" · Beschrijving "Geen app. Geen bankkoppeling." · Knop "Aanmelden".

## Open controles
- Instappagina: "privacy zonder mailboxkoppeling" past het best (link in bio en CTA).
