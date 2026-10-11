# BetaalBuddy · Instagram ad (Remotion)

An editable animated ad, built in [Remotion](https://www.remotion.dev) (React → MP4).
The concept and storyboard are in [`CONCEPT.md`](./CONCEPT.md).

| Composition | Size | Use |
|---|---|---|
| `BB-Ad-Reel` | 1080 × 1920 (9:16) | Reels + Stories |
| `BB-Ad-Feed` | 1080 × 1350 (4:5) | Feed |

Both are 14.8 s at 30 fps by default. Finished preview renders are in [`renders/`](./renders).

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

The Studio opens in your browser. Pick **BB-Ad-Reel** or **BB-Ad-Feed** on the left, then use the **Props** panel on the right to change things live:

- **Text:** every headline, subline, button label, mail sender, chip and notification. Put `\n` in a headline or subline to force a line break.
- **Colors:** blue, light background, soft blue, body text on blue, and the alert red.
- **Timing:** the length of each scene and of the transitions, in seconds. The total length updates by itself.
- **music:** drop an `.mp3` in `public/` and type its file name (e.g. `music.mp3`). Set the level with `musicVolume`.
- **showSafeZones:** shows which parts Instagram covers with its UI. Turn it **off** before you export.

Edits in the Props panel are **live**, and they are used when you click **Render** in the Studio. So edit → preview → render works directly.

To make an edit **permanent** (and apply it to both formats at once), change the default in `src/schema.ts` (`defaultAdProps`). Both compositions share that one source on purpose, so the Reel and Feed copy can never drift apart. Because of this, the Studio's own "Save props" button is greyed out. Tip: switch the Props panel to **JSON** to copy your edited values over in one go.

## 3 · Export to MP4

From the Studio: click **Render** in the top right, choose MP4 (H.264), and press Render. The file lands in `out/`.

From the terminal:

```bash
npm run render        # → out/BB-Ad-Reel.mp4  (9:16)
npm run render:feed   # → out/BB-Ad-Feed.mp4  (4:5)
npm run render:all    # both
npm run still         # → out/cover.png  (frame for a cover image)
```

Renders use H.264, yuv420p and BT.709 (see `remotion.config.ts`), which Instagram, WhatsApp and QuickTime all play correctly.

## Project layout

```
src/
  Root.tsx            the two compositions (9:16 + 4:5)
  Ad.tsx              scene order + transitions
  schema.ts           ALL editable props + defaults  ← start here for copy changes
  theme.ts            brand colors + fonts
  scenes/             1 Hook · 2 Buddy · 3 Forward · 4 Remind · 5 CTA
  components/         Buddy (mascot), AppIcon, Notification, CtaPill, Wordmark, …
  lib/                animation helpers, layout per format, palette
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
