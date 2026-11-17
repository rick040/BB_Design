import type React from "react";

// Two CSS-only transitions for the paper-plane concept (no WebGL).

const c01 = (p: number) => Math.max(0, Math.min(1, p));

/**
 * Breuk (snap): the new scene opens from a jagged crack down the middle,
 * like a chain link breaking apart.
 */
export const crackOpen = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const half = 60 * e; // % from the centre line; > 50 so the teeth clear the edges
  const teeth = 10;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const y = (i / teeth) * 100;
    const j = i % 2 === 0 ? 0 : 6 * (1 - e * 0.5);
    left.push(`${50 - half - j}% ${y}%`);
    right.push(`${50 + half + j}% ${y}%`);
  }
  const poly = `polygon(${[...right, ...left.reverse()].join(", ")})`;
  return { clipPath: poly, WebkitClipPath: poly };
};

/**
 * Vouw (unfold): the new scene unfolds like a sheet of paper, hinged on one
 * edge, with a little shading while it is still at an angle.
 */
export const unfold = (progress: number, hinge: "top" | "left"): React.CSSProperties => {
  const p = c01(progress);
  const e = 1 - Math.pow(1 - p, 3);
  const a = (1 - e) * 88;
  const transform =
    hinge === "top" ? `perspective(2400px) rotateX(${a}deg)` : `perspective(2400px) rotateY(${-a}deg)`;
  return {
    transform,
    transformOrigin: hinge === "top" ? "50% 0%" : "0% 50%",
    filter: `brightness(${0.75 + 0.25 * e})`,
    backfaceVisibility: "hidden",
  };
};
