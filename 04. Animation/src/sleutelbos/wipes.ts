import type React from "react";

// Two CSS-only transitions for the key-ring concept (no WebGL).

const KEYHOLE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="38" r="22"/><path d="M40 50 L60 50 L68 96 L32 96 Z"/></svg>`,
);

/** Keyhole: the new scene opens through a growing keyhole. */
export const keyhole = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = p * p * (3 - 2 * p);
  const size = 40 + e * 6000;
  const mask = `url("data:image/svg+xml,${KEYHOLE}")`;
  return {
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskSize: `${size}px ${size}px`,
    maskSize: `${size}px ${size}px`,
    WebkitMaskPosition: "50% 42%",
    maskPosition: "50% 42%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
};

/** Key turn: the new scene turns in a quarter turn, like a key in a lock. */
export const keyTurn = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = 1 - Math.pow(1 - p, 3);
  return {
    transform: `rotate(${(1 - e) * -90}deg) scale(${0.5 + 0.5 * e})`,
    opacity: Math.min(1, p * 2.5),
    borderRadius: `${(1 - e) * 120}px`,
    overflow: "hidden",
  };
};
