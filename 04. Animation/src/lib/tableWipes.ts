import type React from "react";

// Two CSS-only transitions for the table-tennis concept (no WebGL).

/** Net sweep: the new scene appears through a net whose strings thicken until it is solid. */
export const netSweep = (progress: number, cell = 72): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const w = Math.min(cell, p * cell * 1.05);
  const g1 = `repeating-linear-gradient(90deg, #000 0px, #000 ${w}px, transparent ${w}px, transparent ${cell}px)`;
  const g2 = `repeating-linear-gradient(0deg, #000 0px, #000 ${w}px, transparent ${w}px, transparent ${cell}px)`;
  const m = `${g1}, ${g2}`;
  return { WebkitMaskImage: m, maskImage: m };
};

/** Ball bounce ease (easeOutBounce). */
const bounce = (x: number) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};

/** Bounce drop: the new scene falls in from above and bounces like a ball on the table. */
export const bounceDrop = (progress: number, height: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  return { transform: `translateY(${(1 - bounce(p)) * -height}px)` };
};
