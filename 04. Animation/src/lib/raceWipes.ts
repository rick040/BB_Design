import type React from "react";

// Two CSS-only transitions for the race concept (no WebGL).

const c01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Lane race-in: the new scene arrives as horizontal lanes that each sprint in
 * from one side with a small stagger, like runners off the blocks.
 */
export const laneRaceIn = (
  progress: number,
  from: "left" | "right" = "left",
  lanes = 7,
): React.CSSProperties => {
  const p = c01(progress);
  const stagger = 0.35 / (lanes - 1);
  const images: string[] = [];
  const sizes: string[] = [];
  const positions: string[] = [];
  for (let i = 0; i < lanes; i++) {
    // Middle lanes lead, outer lanes follow.
    const order = Math.abs(i - (lanes - 1) / 2) * 2;
    const t = c01((p - order * stagger * 0.5) / 0.65);
    const eased = 1 - Math.pow(1 - t, 3);
    const w = (eased * 100).toFixed(2);
    images.push("linear-gradient(#000,#000)");
    // +0.6% overlap avoids hairline seams between lanes.
    sizes.push(`${w}% ${(100 / lanes + 0.6).toFixed(2)}%`);
    positions.push(`${from === "left" ? "0%" : "100%"} ${((i / (lanes - 1)) * 100).toFixed(2)}%`);
  }
  const img = images.join(",");
  return {
    WebkitMaskImage: img,
    maskImage: img,
    WebkitMaskSize: sizes.join(","),
    maskSize: sizes.join(","),
    WebkitMaskPosition: positions.join(","),
    maskPosition: positions.join(","),
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
};

/**
 * Finish flag: the new scene appears through a checkered grid whose squares
 * grow diagonally from the finish line (right) across the frame.
 */
export const checkerReveal = (progress: number, cols = 8, rows = 14): React.CSSProperties => {
  const p = c01(progress);
  const rects: string[] = [];
  const maxD = cols - 1 + (rows - 1) * 0.35;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Distance from the right edge, slightly slanted.
      const d = (cols - 1 - c + r * 0.35) / maxD;
      // Black squares of the flag lead, white squares follow.
      const lead = (r + c) % 2 === 0 ? 0 : 0.12;
      const s = c01((p * 1.6 - d * 0.6 - lead) / 0.4);
      if (s <= 0) continue;
      const w = 100 / cols;
      const h = 100 / rows;
      const sw = w * s + 0.15;
      const sh = h * s + 0.15;
      rects.push(
        `<rect x='${(c * w + (w - sw) / 2).toFixed(3)}' y='${(r * h + (h - sh) / 2).toFixed(3)}' width='${sw.toFixed(3)}' height='${sh.toFixed(3)}'/>`,
      );
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>${rects.join("")}</svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return {
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
};
