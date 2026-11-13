import type React from "react";

// Two CSS-only transitions for the balloon concept (no WebGL).

/**
 * Burst: the new scene bursts open from a point as a jagged star, like a
 * popping balloon. (cx, cy) in px of the full frame.
 */
export const burstMask = (progress: number, cx: number, cy: number, w: number, h: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const eased = 1 - Math.pow(1 - p, 3);
  const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.5;
  const outer = maxR * eased;
  const inner = outer * (0.55 + 0.45 * eased);
  const n = 14;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 + 0.2;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)}px ${(cy + Math.sin(a) * r).toFixed(1)}px`);
  }
  return { clipPath: `polygon(${pts.join(", ")})` };
};

/** Float up: the new scene rises from below with a slight balloon sway. */
export const floatUp = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const eased = 1 - Math.pow(1 - p, 3);
  return {
    transform: `translateY(${(1 - eased) * 100}%) rotate(${Math.sin(p * Math.PI * 2) * (1 - p) * 4}deg)`,
    borderTopLeftRadius: `${(1 - eased) * 50}% ${(1 - eased) * 12}%`,
    borderTopRightRadius: `${(1 - eased) * 50}% ${(1 - eased) * 12}%`,
    overflow: "hidden",
    boxShadow: p < 1 ? "0 -30px 80px rgba(0,20,120,0.25)" : undefined,
  };
};
