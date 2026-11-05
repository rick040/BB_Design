// Render the whole backlog (or some IDs) to renders/backlog/: MP4 + cover PNG per composition.
// Usage: node scripts/render-backlog.cjs [BB-P1-01,BB-P2-03,...]
// Browser: $REMOTION_BROWSER, else a preinstalled headless Chromium under /opt/pw-browsers, else Remotion's own.
const fs = require("fs");
const path = require("path");
const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia, renderStill } = require("@remotion/renderer");

const P = path.join(__dirname, "..");
const OUT = path.join(P, "renders", "backlog");

const findBrowser = () => {
  if (process.env.REMOTION_BROWSER) return process.env.REMOTION_BROWSER;
  const root = "/opt/pw-browsers";
  if (!fs.existsSync(root)) return undefined;
  for (const dir of fs.readdirSync(root).sort().reverse()) {
    if (!dir.startsWith("chromium_headless_shell")) continue;
    for (const rel of ["chrome-headless-shell-linux64/chrome-headless-shell", "chrome-linux/headless_shell"]) {
      const p = path.join(root, dir, rel);
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
};

(async () => {
  const only = (process.argv[2] || "").split(",").filter(Boolean);
  const browserExecutable = findBrowser();
  fs.mkdirSync(OUT, { recursive: true });
  // Cover frame per video (BACKLOG.md); missing = frame 0.
  const coversFile = path.join(OUT, "covers.json");
  const covers = fs.existsSync(coversFile) ? JSON.parse(fs.readFileSync(coversFile, "utf8")) : {};
  const serveUrl = await bundle({ entryPoint: path.join(P, "src/index.ts"), publicDir: path.join(P, "public"), rootDir: P });
  const comps = (await getCompositions(serveUrl, { browserExecutable })).filter(
    (c) => /^BB-P\d-\d\d-(Reel|Feed)$/.test(c.id) && (only.length === 0 || only.some((o) => c.id.startsWith(o))),
  );
  for (const composition of comps) {
    const t0 = Date.now();
    const mp4 = path.join(OUT, `${composition.id}.mp4`);
    await renderMedia({
      serveUrl, composition, browserExecutable, codec: "h264", outputLocation: mp4,
      pixelFormat: "yuv420p", colorSpace: "bt709", crf: 18, imageFormat: "jpeg", jpegQuality: 95,
    });
    const cover = covers[composition.id.replace(/-(Reel|Feed)$/, "")] ?? 0;
    await renderStill({
      serveUrl, composition, browserExecutable, frame: Math.min(cover, composition.durationInFrames - 1),
      output: path.join(OUT, `${composition.id}-cover.png`), imageFormat: "png",
    });
    console.log(`${composition.id} ${composition.durationInFrames}f ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
})().catch((e) => { console.error(e); process.exit(1); });
