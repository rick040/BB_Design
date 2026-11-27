import type React from "react";

// CSS-only transitions for the doormat concept (no WebGL).

/** Mail slot: the new scene opens out of a horizontal slit at height `y` (0..1). */
export const slotOpen = (progress: number, y = 0.365): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = 1 - Math.pow(1 - p, 3);
  const top = y * 100 * (1 - e);
  const bottom = (1 - y) * 100 * (1 - e);
  const c = `inset(${top}% 0% ${bottom}% 0%)`;
  return { clipPath: c, WebkitClipPath: c };
};

/** Front door: the new scene swings in on a hinge at the left edge. */
export const doorSwing = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = 1 - Math.pow(1 - p, 3);
  return {
    transform: `perspective(2200px) rotateY(${(1 - e) * 88}deg)`,
    transformOrigin: "0% 50%",
    boxShadow: `${-40 * (1 - e)}px 0 80px rgba(0,0,0,${0.35 * (1 - e)})`,
  };
};
