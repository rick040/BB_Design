import type React from "react";

// Two CSS-only transitions for the pocket-knife concept (no WebGL).

const c = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Snede (cut): the new scene opens up along a diagonal cut through the frame,
 * like a blade slicing the old scene in two.
 * dir 1 = cut from bottom-left to top-right, -1 = top-left to bottom-right.
 */
export const snede = (progress: number, W: number, H: number, dir: 1 | -1 = 1): React.CSSProperties => {
  const p = ease(c(progress));
  const L = Math.hypot(W, H);
  const P1 = dir === 1 ? { x: 0, y: H } : { x: 0, y: 0 };
  const P2 = dir === 1 ? { x: W, y: 0 } : { x: W, y: H };
  const u = { x: (P2.x - P1.x) / L, y: (P2.y - P1.y) / L };
  const n = { x: -u.y, y: u.x };
  const w = Math.max(1, p * L * 0.55);
  const m = 200;
  const pt = (b: { x: number; y: number }, su: number, sn: number) =>
    `${(b.x + u.x * su + n.x * sn).toFixed(1)}px ${(b.y + u.y * su + n.y * sn).toFixed(1)}px`;
  const poly = `polygon(${pt(P1, -m, w)}, ${pt(P2, m, w)}, ${pt(P2, m, -w)}, ${pt(P1, -m, -w)})`;
  return { clipPath: poly, WebkitClipPath: poly };
};

/**
 * Lemmet (blade): the new scene slides out from the left edge with a pointed
 * blade tip, like a blade folding out of its handle.
 */
export const lemmet = (progress: number, W: number, H: number): React.CSSProperties => {
  const p = ease(c(progress));
  const tip = H * 0.18;
  const x = -tip + p * (W + tip * 2);
  const poly = `polygon(0px 0px, ${x.toFixed(1)}px 0px, ${(x + tip).toFixed(1)}px ${H / 2}px, ${x.toFixed(1)}px ${H}px, 0px ${H}px)`;
  return { clipPath: poly, WebkitClipPath: poly };
};
