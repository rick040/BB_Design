import type React from "react";

// Two CSS-only transitions for the weegschaal concept (no WebGL).

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

/**
 * Kantel: the new scene tips in around the scale's pivot, like a beam
 * swinging over, while a circle opens from that pivot.
 */
export const tiltIn = (progress: number, pivot = "50% 37%"): React.CSSProperties => {
  const e = easeOut(c01(progress));
  const clip = `circle(${e * 150}% at ${pivot})`;
  return {
    transform: `rotate(${(1 - e) * -38}deg) scale(${0.85 + 0.15 * e})`,
    transformOrigin: pivot,
    clipPath: clip,
    WebkitClipPath: clip,
  };
};

/** Rekenstreep: line length (0..1) for the sum line drawn across the screen. */
export const sumLine = (progress: number) => easeOut(c01(progress / 0.45));

/** Rekenstreep: after the sum line is drawn, the new scene opens out from it. */
export const sumReveal = (progress: number, lineY = 50): React.CSSProperties => {
  const p = c01((progress - 0.35) / 0.65);
  const e = easeOut(p);
  const top = lineY * (1 - e);
  const bottom = (100 - lineY) * (1 - e);
  const clip = `inset(${top}% 0 ${bottom}% 0)`;
  return { clipPath: clip, WebkitClipPath: clip };
};
