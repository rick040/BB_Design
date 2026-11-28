import type React from "react";

// Three CSS-only transitions for the music-box concept (no WebGL).

const c01 = (p: number) => Math.max(0, Math.min(1, p));

/** Lid open: the OLD scene swings up and away like a music-box lid (hinge at the top edge). */
export const lidOpenOut = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const e = p * p * (3 - 2 * p);
  return {
    transform: `perspective(1600px) rotateX(${e * 100}deg)`,
    transformOrigin: "50% 0%",
    opacity: p > 0.92 ? 0 : 1,
    boxShadow: `0 ${40 * e}px ${80 * e}px rgba(0,0,40,${0.35 * e})`,
  };
};

/** Comb: the NEW scene appears through the teeth of a music-box comb, tooth by tooth. */
export const combIn = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const tooth = 90;
  const w = Math.min(tooth, p * tooth * 1.05);
  const g = `repeating-linear-gradient(90deg, #000 0px, #000 ${w}px, transparent ${w + 0.5}px, transparent ${tooth}px)`;
  return {
    WebkitMaskImage: g,
    maskImage: g,
    transform: `translateY(${(1 - p) * 60}px)`,
  };
};

/** Lid close: the NEW scene swings down over the old one, hinge at the top edge. */
export const lidCloseIn = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const e = 1 - Math.pow(1 - p, 3);
  return {
    transform: `perspective(1600px) rotateX(${(1 - e) * -95}deg)`,
    transformOrigin: "50% 0%",
    opacity: p < 0.05 ? 0 : 1,
  };
};
