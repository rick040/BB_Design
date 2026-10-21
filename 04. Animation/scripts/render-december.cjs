// Render decembercampagne-composities met één bundle, met dezelfde instellingen als remotion.config.ts.
//
//   node scripts/render-december.cjs                      alle DEC*-composities
//   node scripts/render-december.cjs DEC04-Rijm-1,DEC01-Pakketjes-Reel   alleen deze ids
//   node scripts/render-december.cjs DEC01-Pakketjes-Reel@66            still van frame 66 → <id>-cover.png
//
// Een Still (1 frame) wordt een PNG, al het andere een MP4. Uitvoer: renders/december/.
// Env: REMOTION_BROWSER (pad naar headless shell), CONCURRENCY (default 2), OUT (andere uitvoermap).
const path = require("path");
const fs = require("fs");
const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia, renderStill } = require("@remotion/renderer");

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
  const projectDir = path.resolve(__dirname, "..");
  const outDir = process.env.OUT ? path.resolve(process.env.OUT) : path.join(projectDir, "renders", "december");
  const concurrency = Number(process.env.CONCURRENCY || 2);
  const browserExecutable = findBrowser();
  fs.mkdirSync(outDir, { recursive: true });

  const serveUrl = await bundle({
    entryPoint: path.join(projectDir, "src/index.ts"),
    publicDir: path.join(projectDir, "public"),
    rootDir: projectDir,
  });
  const comps = await getCompositions(serveUrl, { browserExecutable });
  const wanted = (process.argv[2] || "").split(",").map((s) => s.trim()).filter(Boolean);
  const jobs = wanted.length
    ? wanted.map((w) => {
        const [id, frame] = w.split("@");
        return { id, frame: frame === undefined ? null : Number(frame) };
      })
    : comps.filter((c) => c.id.startsWith("DEC")).map((c) => ({ id: c.id, frame: null }));

  for (const { id, frame } of jobs) {
    const composition = comps.find((c) => c.id === id);
    if (!composition) {
      console.error(`Onbekende composition: ${id}`);
      process.exitCode = 1;
      continue;
    }
    const isStill = composition.durationInFrames === 1;
    if (isStill || frame !== null) {
      const output = path.join(outDir, frame !== null && !isStill ? `${id}-cover.png` : `${id}.png`);
      await renderStill({ serveUrl, composition, frame: frame ?? 0, output, browserExecutable, imageFormat: "png" });
      console.log("still", output);
    } else {
      const output = path.join(outDir, `${id}.mp4`);
      await renderMedia({
        serveUrl,
        composition,
        outputLocation: output,
        codec: "h264",
        pixelFormat: "yuv420p",
        colorSpace: "bt709",
        crf: 16,
        imageFormat: "jpeg",
        jpegQuality: 95,
        concurrency,
        browserExecutable,
        logLevel: "warn",
      });
      console.log("video", output);
    }
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
