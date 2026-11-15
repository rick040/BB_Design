# Advertentieversies november 2026 (PM-149)

Gerenderd op 15 november 2026 voor de Meta-campagnes uit `docs/META-ADS-STRATEGIE-2EURO-2026-11.md`. Verschil met de organische versies: geen rood meer. De waarschuwingschips ("Te laat", "Kan uitlopen op €40") en de stempel "Aanmaning" staan nu in `#111827` met witte tekst. De roze tint in "later" is een lichte tint van `#0026a8` geworden.

| Bestand | Concept | Campagne | Formaat | Duur | Geluid |
|---|---|---|---|---|---|
| `weegschaal-reel-vo.mp4` | 66 "Reken maar uit." | C3 aanmaning (C3-A1) | 1080x1920 (9:16) | 14,5 s | Voice-over |
| `boemerang-reel-vo.mp4` | 62 "Nu komt hij op tijd terug." | C3 aanmaning (C3-A2) | 1080x1920 (9:16) | 11,7 s | Voice-over |
| `later-reel-vo.mp4` | 87 "Later is gewoon een datum." | C2 achteraf betalen (C2-A1) | 1080x1920 (9:16) | 13,3 s | Voice-over |
| `eigenhuis-reel-vo.mp4` | 79 "Je eigen huis. Meteen op orde." | C1 net op jezelf (C1-A1) | 1080x1920 (9:16) | 14,9 s | Voice-over |

Sleutel (C4-A1) had geen rood en staat ongewijzigd in Drive: BetaalBuddy Ads/2026-11-11 sleutel.

Controle: contactbladen van vóór en na de fix in `docs/bewijs-meta-ads-2026-11/` (`na-fix-*.jpg`).

## Broncode

- **Boemerang** staat op main. De fix zit in deze branch: `src/boemerang/schema.ts` (`colors.alert`) en `src/boemerang/scenes/HookScene.tsx` (schaduw).
- **Weegschaal, later en eigenhuis** staan op hun eigen concept-branches. Die heb ik niet aangepast. De wijzigingen staan als patch in `patches/`. Zo pas je ze toe vanuit de repo-root:
  - weegschaal: branch `claude/peaceful-planck-whri2n`, `git apply "04. Animation/renders/ads-2026-11/patches/weegschaal-geen-rood.patch"`
  - later: branch `claude/sweet-wright-oa0jgj`, idem met `later-geen-rood.patch`
  - eigenhuis: branch `claude/peaceful-planck-5nk07m`, idem met `eigenhuis-geen-rood.patch`

## Renderen

```bash
npx remotion render BB-Weegschaal-Reel out/weegschaal-reel-vo.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
```

Geen 4:5-versies. De campagnes draaien eerst alleen op Instagram Stories en Reels (zie hoofdstuk 3.2 van de strategie). Weegschaal en boemerang hebben geen feedcompositie, en de scènes staan op vaste posities voor 1920 pixels hoog.
