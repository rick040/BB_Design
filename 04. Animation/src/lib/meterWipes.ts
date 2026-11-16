import type React from "react";

// Two CSS-only transitions for the taximeter concept (no WebGL).

const c01 = (p: number) => Math.max(0, Math.min(1, p));
const ease = (p: number) => 1 - Math.pow(1 - p, 3);

/** Digit roll: scenes roll over like the drum of a meter digit (old up and away, new from below). */
export const rollOut = (progress: number): React.CSSProperties => {
  const e = ease(c01(progress));
  return {
    transform: `perspective(2200px) translateY(${-e * 55}%) rotateX(${e * 55}deg)`,
    transformOrigin: "50% 100%",
    opacity: 1 - e * 0.6,
  };
};
export const rollIn = (progress: number): React.CSSProperties => {
  const e = ease(c01(progress));
  return {
    transform: `perspective(2200px) translateY(${(1 - e) * 55}%) rotateX(${(1 - e) * -55}deg)`,
    transformOrigin: "50% 0%",
  };
};

/** Headlight: the new scene is revealed by a widening light cone from the left edge. */
export const headlight = (progress: number, y = 55): React.CSSProperties => {
  const e = ease(c01(progress));
  const reach = e * 260;
  const spread = e * e * 260;
  const g = `polygon(0% ${y - 4 * (1 - e)}%, ${reach}% ${y - spread}%, ${reach}% ${y + spread}%, 0% ${y + 4 * (1 - e)}%)`;
  return { clipPath: g, WebkitClipPath: g };
};
