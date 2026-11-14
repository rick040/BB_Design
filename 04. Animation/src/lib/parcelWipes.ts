import type React from "react";

// Two CSS-only transitions for the "later" concept (no WebGL).

/** Tape rip: the new scene is revealed behind a torn, zigzag edge that runs across. */
export const tapeRip = (progress: number, from: "left" | "right"): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const edge = -12 + p * 124; // percent, overshoots so the teeth clear the frame
  const teeth = 14;
  const pts: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const y = (i / teeth) * 100;
    const x = edge + (i % 2 === 0 ? -6 : 6);
    pts.push(`${from === "left" ? x : 100 - x}% ${y}%`);
  }
  const poly =
    from === "left"
      ? `polygon(0% 0%, ${pts.join(", ")}, 0% 100%)`
      : `polygon(100% 0%, ${pts.join(", ")}, 100% 100%)`;
  return { clipPath: poly, WebkitClipPath: poly };
};

/** Box flaps: the new scene opens from the centre like two cardboard flaps. */
export const boxFlaps = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = 1 - Math.pow(1 - p, 3);
  const half = e * 50;
  const poly = `polygon(${50 - half}% 0%, ${50 + half}% 0%, ${50 + half}% 100%, ${50 - half}% 100%)`;
  return { clipPath: poly, WebkitClipPath: poly, transform: `scale(${1.06 - 0.06 * e})` };
};
