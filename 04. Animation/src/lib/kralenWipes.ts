import type React from "react";

// Two CSS-only transitions for the kralen concept (no WebGL).

const c01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Draad (thread): the new scene is revealed behind a wavy edge that runs
 * across the frame like a thread being pulled through.
 */
export const threadWipe = (progress: number, from: "left" | "right" = "left"): React.CSSProperties => {
  const p = c01(progress);
  const amp = 4; // % of width
  const edge = -amp + p * (100 + 2 * amp);
  const pts: string[] = [];
  const N = 36;
  for (let i = 0; i <= N; i++) {
    const y = (i / N) * 100;
    const x = edge + amp * Math.sin((i / N) * Math.PI * 6 + p * Math.PI * 4);
    pts.push(`${from === "left" ? x : 100 - x}% ${y}%`);
  }
  const poly =
    from === "left"
      ? `polygon(0% 0%, ${pts.join(", ")}, 0% 100%)`
      : `polygon(100% 0%, ${pts.join(", ")}, 100% 100%)`;
  return { clipPath: poly };
};

/**
 * Kraalrol (bead roll): the new scene arrives as a round bead that rolls in
 * from the right edge and grows until it fills the frame.
 */
export const beadRoll = (progress: number, width: number, height: number): React.CSSProperties => {
  const p = c01(progress);
  const e = 1 - Math.pow(1 - p, 2);
  const cx = width * (1.05 - 0.55 * e);
  const cy = height * 0.55;
  const full = Math.hypot(width, height);
  const r = 60 + (full - 60) * Math.pow(p, 1.6);
  return { clipPath: `circle(${r}px at ${cx}px ${cy}px)` };
};
