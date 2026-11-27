# Concept 125 · "Net op jezelf. Niet alleen." (deurmat)

**USP:** `doelgroep` (net op jezelf wonen). Rotatie volgens de changelog: doelgroep laatst in 118, alle andere USP's daarna. **Vorm:** rekensom (niet in 122, 123, 124). **Metafoor:** de deurmat van je eerste eigen huis, waar door de brievenbus vijf rekeningen tegelijk op vallen.

**Idee.** Wie net op zichzelf woont, krijgt ineens alles zelf: huur, energie, internet, zorgverzekering, gemeente. De deur telt mee (1 tot 5), de rekensom maakt er vijf vervaldatums van, en Buddy slikt ze en zet ze als rij in je agenda. Slot: Buddy veegt zijn voeten op een mat "welkom thuis".

## Scènes (geschat, 30 fps, 13,5 s)
| # | Start | Beeld | Overgang erin |
|---|---|---|---|
| 1 Deur | 0,0 s | Blauwe voordeur met gele brievenbus, mat "welkom". Kop "Net op jezelf? Dan komen ze." Klep rammelt; op elk genoemd woord valt een envelop (Verhuurder, Energieleverancier, Internetprovider, Zorgverzekeraar, Gemeente) op de mat, de deur telt 1 tot 5 | n.v.t. |
| 2 Rekensom | 5,6 s | Blauw: vijf mini-enveloppen met plustekens, somstreep, vijf rode datumchips, "= 5", "Allemaal van jou." | brievenbusspleet (scène opent uit een horizontale spleet op de hoogte van de klep) |
| 3 Buddy | 8,7 s | Licht: enveloppen vliegen van de mat in Buddy, kop wisselt naar "Hij zet ze in je agenda.", vijf agendarijen met datum en afzender | voordeur zwaait open (3D-scharnier links, CSS) |
| 4 CTA | 11,8 s | Blauw: "Net op jezelf. Niet alleen.", knop activeer buddy, "Geen app. Geen bankkoppeling.", woordmerk; Buddy veegt zijn voeten op de mat "welkom thuis" | brievenbusspleet vanuit het midden |

## Voice-over (ElevenLabs, eleven_v4, stem uit ELEVENLABS_VOICE_ID)
NIET GEGENEREERD in deze run: ElevenLabs-quota op 0 credits (API 401 quota_exceeded, connector idem). De timing in `public/vo/deurmat/timing.json` is een schatting (`"source": "estimate"`). Na genereren: alignment wegschrijven naar timing.json, `withVoice: true` in het schema, opnieuw renderen.

```
[S1] Net op jezelf? Dan komen de rekeningen. Huur. Energie. Internet. Zorgverzekering. Gemeente. [S2] Vijf rekeningen. Vijf vervaldatums. Allemaal van jou. [S3] Stuur ze door naar Buddy. Hij zet ze in je agenda. [S4] Activeer Buddy.
```
32 woorden. De markers gaan niet naar ElevenLabs.

## Caption
Zie `renders/deurmat-caption.md`.

## Ads Manager
- Primaire tekst: Net op jezelf? Vijf rekeningen, vijf vervaldatums. Stuur ze door naar Buddy en ze staan in je agenda.
- Kop: Net op jezelf. Niet alleen.
- Beschrijving: Geen app. Geen bankkoppeling.
- Knop: Aanmelden

## Uniciteit
Verschilt van alle concepten in CONCEPTEN.md en de changelog-titels op USP (doelgroep net op jezelf, nog niet gebruikt), visueel systeem (voordeur en deurmat), wat Buddy doet (slikt enveloppen, veegt voeten), einde (geruststelling "Niet alleen.") en overgangen (brievenbusspleet, deurzwaai).

## Bouwen
`src/deurmat/` · compositie `BB-Deurmat-Reel` in map `Concept-125-Deurmat` · `npm run render:deurmat`.
