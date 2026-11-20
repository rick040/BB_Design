import type React from "react";

// CSS-only transitions for the letterbox concept (no WebGL).
const c = (p: number) => Math.max(0, Math.min(1, p));
const ease = (p: number) => 1 - Math.pow(1 - c(p), 3);

/** Door swing: the new scene swings shut over the old one around its left hinge. */
export const doorSwing = (progress: number): React.CSSProperties => {
  const p = ease(progress);
  return {
    transform: `perspective(2400px) rotateY(${(1 - p) * -92}deg)`,
    transformOrigin: "0% 50%",
    boxShadow: `0 0 120px rgba(0,0,0,${0.35 * (1 - p)})`,
  };
};

/** Letterbox slit: the new scene opens up from a thin horizontal slot in the middle. */
export const slitOpen = (progress: number): React.CSSProperties => {
  const p = ease(progress);
  const v = (1 - p) * 49.5;
  const h = (1 - Math.min(1, p * 2.2)) * 18;
  const g = `inset(${v}% ${h}% ${v}% ${h}% round ${(1 - p) * 60}px)`;
  return { clipPath: g, WebkitClipPath: g };
};

/** Flap: the new scene drops down like a letterbox flap hinged at the top. */
export const flapDown = (progress: number): React.CSSProperties => {
  const p = ease(progress);
  return {
    transform: `perspective(2400px) rotateX(${(1 - p) * 88}deg)`,
    transformOrigin: "50% 0%",
  };
};
