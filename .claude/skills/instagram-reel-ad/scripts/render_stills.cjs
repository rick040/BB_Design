// Render many stills of one composition with a single bundle (much faster
// than calling `remotion still` per frame).
//
// Usage:
//   NODE_PATH="<project>/node_modules" node render_stills.cjs <projectDir> <compositionId> <outDir> <f1,f2,...>
//
// Browser: uses $REMOTION_BROWSER, else a preinstalled headless Chromium under
// /opt/pw-browsers (cloud sessions), else lets Remotion download its own.
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { selectComposition, renderStill } = require("@remotion/renderer");

const findBrowser = () => {
  if (process.env.REMOTION_BROWSER) return process.env.REMOTION_BROWSER;
  const root = "/opt/pw-browsers";
  if (!fs.existsSync(root)) return undefined;
  for (const dir of fs.readdirSync(root).sort().reverse()) {
    if (!dir.startsWith("chromium_headless_shell")) continue;
    const p = path.join(root, dir, "chrome-linux", "headless_shell");
    if (fs.existsSync(p)) return p;
  }
  return undefined;
};

(async () => {
  const [projectDir, compId, outDir, framesArg] = process.argv.slice(2);
  if (!projectDir || !compId || !outDir || !framesArg) {
    console.error("Usage: node render_stills.cjs <projectDir> <compositionId> <outDir> <f1,f2,...>");
    process.exit(2);
  }
  const browserExecutable = findBrowser();
  fs.mkdirSync(outDir, { recursive: true });
  const serveUrl = await bundle({
    entryPoint: path.join(projectDir, "src/index.ts"),
    publicDir: path.join(projectDir, "public"),
    rootDir: projectDir,
  });
  const composition = await selectComposition({ serveUrl, id: compId, browserExecutable });
  console.log(`${compId}: ${composition.width}x${composition.height}, ${composition.durationInFrames} frames @ ${composition.fps} fps`);
  const frames = framesArg
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n))
    .map((n) => Math.min(Math.max(0, n), composition.durationInFrames - 1));
  for (const f of frames) {
    const output = path.join(outDir, `${compId}-${String(f).padStart(4, "0")}.png`);
    await renderStill({ serveUrl, composition, frame: f, output, browserExecutable, imageFormat: "png" });
    console.log("rendered", output);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
