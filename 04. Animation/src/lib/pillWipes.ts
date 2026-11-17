import type React from "react";

// Three CSS-only transitions for concept 95 (weekdoos), no WebGL.

const c01 = (v: number) => Math.max(0, Math.min(1, v));

/** Strike: a horizontal band opens from a strike-through line at `y` (0..1 of the height). */
export const strikeWipe = (progress: number, y: number): React.CSSProperties => {
  const p = c01(progress);
  const e = 1 - Math.pow(1 - p, 3);
  const top = y * 100 * (1 - e);
  const bottom = (1 - y) * 100 * (1 - e);
  const clip = `inset(${top}% 0% ${bottom}% 0%)`;
  return { clipPath: clip, WebkitClipPath: clip };
};

/** Capsule: the new scene grows out of a tilted pill shape in the centre. */
export const capsuleWipe = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const e = p * p * (3 - 2 * p);
  const ix = 50 * (1 - e);
  const iy = 50 * (1 - e) * 0.92;
  const clip = `inset(${iy}% ${ix * 0.6}% ${iy}% ${ix * 0.6}% round ${(1 - e) * 600 + 1}px)`;
  return { clipPath: clip, WebkitClipPath: clip, transform: `rotate(${(1 - e) * -24}deg) scale(${1 + 0.2 * (1 - e)})` };
};

/** Lid: the new scene folds down over the old one from a hinge at the top. */
export const lidDrop = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const e = 1 - Math.pow(1 - p, 2);
  return {
    transform: `perspective(2400px) rotateX(${(1 - e) * 92}deg)`,
    transformOrigin: "50% 0%",
    boxShadow: "0 40px 80px rgba(0,0,0,0.25)",
  };
};
