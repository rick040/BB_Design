import type React from "react";
import { Easing, interpolate } from "remotion";

// Concept 76 transitions (CSS only, safe headless).
const ease = Easing.inOut(Easing.cubic);
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Incoming scene flips in like a tossed coin (rotateY 90° → 0°). */
export const coinFlip = (p: number): React.CSSProperties => {
  const t = ease(Math.min(1, Math.max(0, p)));
  const deg = interpolate(t, [0, 1], [90, 0], c);
  return {
    transform: `perspective(2200px) rotateY(${deg}deg) scale(${0.9 + 0.1 * t})`,
    opacity: t < 0.02 ? 0 : 1,
  };
};

/**
 * Incoming scene appears through a coin-slot shaped opening: a thin
 * rounded slit in the middle that widens, then opens to the full frame.
 */
export const slotReveal = (p: number, cy = 50): React.CSSProperties => {
  const t = Math.min(1, Math.max(0, p));
  const w = interpolate(t, [0, 0.45], [46, 0], { ...c, easing: ease }); // % inset left/right
  const h = interpolate(t, [0, 0.45, 1], [49.4, 48.5, 0], { ...c, easing: ease });
  const top = Math.max(0, cy - (50 - h));
  const bottom = Math.max(0, 100 - cy - (50 - h));
  const r = interpolate(t, [0.6, 1], [80, 0], c);
  const clip = `inset(${top}% ${w}% ${bottom}% ${w}% round ${r}px)`;
  return { clipPath: clip, WebkitClipPath: clip };
};
