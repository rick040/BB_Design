import type React from "react";

// Two CSS-only transitions for the glass-drawer concept (no WebGL).

const c01 = (v: number) => Math.max(0, Math.min(1, v));

/** Drawer pull: the new scene slides out toward you like a drawer on runners. */
export const drawerPull = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const e = 1 - Math.pow(1 - p, 3);
  return {
    transform: `perspective(1800px) translateY(${(1 - e) * 55}%) rotateX(${(1 - e) * 32}deg) scale(${0.78 + 0.22 * e})`,
    transformOrigin: "50% 100%",
    boxShadow: `0 -30px 80px rgba(0,20,120,${0.35 * (1 - e)})`,
  };
};

/** Squeegee position (0..1 of the width) for a given transition progress. */
export const squeegeeX = (progress: number) => {
  const p = c01(progress);
  return p * p * (3 - 2 * p);
};

/** Squeegee wipe: the new scene is revealed behind a blade that sweeps across. */
export const squeegeeMask = (progress: number, fromRight = false): React.CSSProperties => {
  const x = squeegeeX(progress) * 100;
  const clip = fromRight ? `inset(0 0 0 ${100 - x}%)` : `inset(0 ${100 - x}% 0 0)`;
  return { clipPath: clip, WebkitClipPath: clip };
};
