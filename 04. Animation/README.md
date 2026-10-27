# BetaalBuddy · Instagram ads (Remotion)

Editable animated ads, built in [Remotion](https://www.remotion.dev) (React → MP4). Four concepts in this branch, each in two formats (concept 4 to 25 are described in the BetaalBuddy changelog and live on other branches):

| Concept | Composition | Size | Use | Length |
|---|---|---|---|---|
| 1 · "Stuur door. Buddy onthoudt." ([`CONCEPT.md`](./CONCEPT.md)) | `BB-Ad-Reel` | 1080 × 1920 (9:16) | Reels + Stories | 14.8 s |
| | `BB-Ad-Feed` | 1080 × 1350 (4:5) | Feed | 14.8 s |
| 2 · "7 · 2 · Betaald." ([`CONCEPT-2.md`](./CONCEPT-2.md)) | `BB-Countdown-Reel` | 1080 × 1920 (9:16) | Reels + Stories | 14.0 s |
| | `BB-Countdown-Feed` | 1080 × 1350 (4:5) | Feed | 14.0 s |
| 3 · "Jij kiest wat Buddy ziet." ([`CONCEPT-3.md`](./CONCEPT-3.md)) | `BB-Privacy-Reel` | 1080 × 1920 (9:16) | Reels + Stories | 13.6 s |
| | `BB-Privacy-Feed` | 1080 × 1350 (4:5) | Feed | 13.6 s |
| 26 · "Eng was hij alleen in het donker." ([`CONCEPT-26.md`](./CONCEPT-26.md)) | `BB-Spook-Reel` | 1080 × 1920 (9:16) | Reels + Stories | 14.0 s |
| | `BB-Spook-Feed` | 1080 × 1350 (4:5) | Feed | 14.0 s |

All run at 30 fps. Finished preview renders are in [`renders/`](./renders). Each concept file also has its voice-over script (ElevenLabs) and Instagram caption.

**New concept?** In Claude Code, type `/instagram-reel-ad` followed by your idea, or by "bedenk er een". The skill lives in [`.claude/skills/instagram-reel-ad`](../.claude/skills/instagram-reel-ad/SKILL.md). It writes the concept, builds both formats here, renders and checks them, and delivers the MP4s, an ElevenLabs voice-over script and the Instagram caption.

## 1 · Install (once)

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
cd "04. Animation"
npm install
```

## 2 · Edit in Remotion Studio

```bash
npm run dev
```

The Studio opens in your browser. Pick a composition on the left (they are grouped per concept), then use the **Props** panel on the right to change things live:

- **Text:** every headline, subline, button label, mail sender, chip and notification. Put `\n` in a headline or subline to force a line break.
- **Colors:** blue, light background, soft blue, body text on blue, and the alert red.
- **Timing:** the length of each scene and of the transitions, in seconds. The total length updates by itself.
- **music:** drop an `.mp3` in `public/` and type its file name (e.g. `music.mp3`). Set the level with `musicVolume`.
- **showSafeZones:** shows which parts Instagram covers with its UI. Turn it **off** before you export.

Edits in the Props panel are **live**, and they are used when you click **Render** in the Studio. So edit → preview → render works directly.

To make an edit **permanent** (and apply it to both formats at once), change the defaults in `src/schema.ts` (concept 1, `defaultAdProps`), `src/countdown/schema.ts` (concept 2, `defaultCountdownProps`) `src/privacy/schema.ts` (concept 3, `defaultPrivacyProps`) or `src/spook/schema.ts` (concept 26, `defaultSpookProps`). Both compositions share that one source on purpose, so the Reel and Feed copy can never drift apart. Because of this, the Studio's own "Save props" button is greyed out. Tip: switch the Props panel to **JSON** to copy your edited values over in one go.

## 3 · Export to MP4

From the Studio: click **Render** in the top right, choose MP4 (H.264), and press Render. The file lands in `out/`.

From the terminal:

```bash
npm run render                 # concept 1 → out/BB-Ad-Reel.mp4         (9:16)
npm run render:feed            # concept 1 → out/BB-Ad-Feed.mp4         (4:5)
npm run render:countdown       # concept 2 → out/BB-Countdown-Reel.mp4  (9:16)
npm run render:countdown:feed  # concept 2 → out/BB-Countdown-Feed.mp4  (4:5)
npm run render:privacy         # concept 3 → out/BB-Privacy-Reel.mp4    (9:16)
npm run render:privacy:feed    # concept 3 → out/BB-Privacy-Feed.mp4    (4:5)
npm run render:spook           # concept 26 → out/BB-Spook-Reel.mp4     (9:16)
npm run render:spook:feed      # concept 26 → out/BB-Spook-Feed.mp4     (4:5)
npm run render:all             # all six
npm run still                  # concept 1 cover → out/BB-Ad-Reel-cover.png
npm run still:countdown        # concept 2 cover → out/BB-Countdown-Reel-cover.png
npm run still:privacy          # concept 3 cover → out/BB-Privacy-Reel-cover.png
npm run still:spook            # concept 26 cover → out/BB-Spook-Reel-cover.png
```

Renders use H.264, yuv420p and BT.709 (see `remotion.config.ts`), which Instagram, WhatsApp and QuickTime all play correctly.

## Project layout

```
src/
  Root.tsx            all compositions, grouped per concept (9:16 + 4:5 each)
  Ad.tsx              concept 1: scene order + transitions
  schema.ts           concept 1: ALL editable props + defaults  ← start here for copy changes
  scenes/             concept 1: Hook · Buddy · Forward · Remind · CTA
  countdown/          concept 2: CountdownAd.tsx, schema.ts, scenes/ (Hook · Aftellen · Betaald · CTA)
  spook/              concept 26: SpookAd.tsx, schema.ts, components/Spook.tsx, scenes/ (Hook · Buddy kijkt · Licht aan · CTA)
  privacy/            concept 3: PrivacyAd.tsx, schema.ts, scenes/ (Hook · Kijkt niet mee · Alleen doorgestuurd · CTA),
                      components/ (PermissionDialog, PrivateMailCard, ForwardedMail)
  theme.ts            brand colors + fonts
  components/         shared: Buddy (mascot), AppIcon, Notification, CtaPill, Wordmark,
                      BillCard, RollingNumber, Checkmark, SleepMask (Buddy accessory), …
  lib/                animation helpers, layout per format, palette, focusPull (blur transition), flicker, lightSwitch and sheetDrop (concept 26)
public/fonts/         Space Grotesk + Geist (SIL OFL, bundled so renders work offline)
```

All brand elements (mascot, app icon, notification, CTA pill, calendar tile, wordmark) are rebuilt as vectors from the files in `01. Logo` and `02. Elements`, so they stay sharp at any size and their text can be edited.

## Copy rules (current product)

The default copy follows the BetaalBuddy changelog. Keep these in mind when you edit:

- No "gratis" or trial. The new pricing model has no free period.
- No WhatsApp, Telegram or Signal. They are not available yet.
- No "scant je inbox" or Gmail connection. The product works by forwarding.
- No price in a reminder ad. Basic has no reminders.

## Licensing note

Remotion is free for individuals and companies with up to 3 employees. Larger companies need a [company license](https://www.remotion.pro/license).
