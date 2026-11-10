import type React from "react";

// Three CSS-only transitions for concept 63 (no WebGL).
const c = (p: number) => Math.max(0, Math.min(1, p));

/** Myth card flip: outgoing scene turns away on the Y axis, the fact side turns in. */
export const flipOut = (p: number): React.CSSProperties => {
  const q = c(p);
  return q >= 0.5
    ? { opacity: 0 }
    : { transform: `perspective(2200px) rotateY(${q * 180}deg) scale(${1 - 0.12 * Math.sin(Math.PI * q)})`, backfaceVisibility: "hidden" };
};
export const flipIn = (p: number): React.CSSProperties => {
  const q = c(p);
  return q < 0.5
    ? { opacity: 0 }
    : { transform: `perspective(2200px) rotateY(${(q - 1) * 180}deg) scale(${1 - 0.12 * Math.sin(Math.PI * q)})`, backfaceVisibility: "hidden" };
};

/** Ruled lines: the new scene appears through horizontal lines that thicken like notebook paper. */
export const ruledLines = (p: number): React.CSSProperties => {
  const q = c(p);
  const pitch = 96;
  const fill = q * pitch;
  const g = `repeating-linear-gradient(to bottom, #000 0px, #000 ${fill}px, transparent ${fill + 0.5}px, transparent ${pitch}px)`;
  return { WebkitMaskImage: g, maskImage: g };
};

/** Ruler sweep: the new scene is revealed top to bottom behind a moving ruler edge. */
export const rulerSweep = (p: number): React.CSSProperties => {
  const q = c(p);
  return { clipPath: `inset(0 0 ${(1 - q) * 100}% 0)` };
};
