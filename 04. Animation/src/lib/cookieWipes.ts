import type React from "react";

// Two CSS-only transitions for the fortune-cookie concept (no WebGL).

/**
 * Crack: the new scene opens up through a jagged vertical crack in the
 * middle that widens to the full frame, like a cookie breaking in two.
 */
export const crackOpen = (progress: number, width: number, height: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = p * p * (3 - 2 * p);
  const half = e * (width / 2 + 90);
  const teeth = 9;
  const amp = 46 * (1 - e * 0.6);
  const cx = width / 2;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const y = (i / teeth) * height;
    const z = i % 2 === 0 ? -amp : amp;
    right.push(`${(cx + half + z).toFixed(1)}px ${y.toFixed(1)}px`);
    left.unshift(`${(cx - half + z).toFixed(1)}px ${y.toFixed(1)}px`);
  }
  const poly = `polygon(${[...right, ...left].join(", ")})`;
  return { clipPath: poly, WebkitClipPath: poly };
};

/** Unroll: the new scene is revealed top-down, like a paper slip unrolling. */
export const unrollDown = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = 1 - Math.pow(1 - p, 2);
  const clip = `inset(0 0 ${((1 - e) * 100).toFixed(2)}% 0)`;
  return { clipPath: clip, WebkitClipPath: clip };
};

/** Where the rolled edge of `unrollDown` sits (0..1 of the frame height). */
export const unrollEdge = (progress: number) => {
  const p = Math.max(0, Math.min(1, progress));
  return 1 - Math.pow(1 - p, 2);
};
