import type React from "react";

// Two CSS-only transitions for the waiting-room concept (no WebGL).

/** Sliding door: the new scene opens from the centre like automatic doors. */
export const slidingDoor = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = 1 - Math.pow(1 - p, 3);
  const side = 50 * (1 - e);
  return { clipPath: `inset(0 ${side}% 0 ${side}%)` };
};

/** Number roll: the new scene rolls up into view like the next digit on a ticket display. */
export const numberRoll = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = 1 - Math.pow(1 - p, 3);
  return {
    transform: `perspective(1800px) translateY(${(1 - e) * 70}%) rotateX(${(1 - e) * -75}deg)`,
    transformOrigin: "50% 100%",
    filter: `blur(${(1 - e) * 10}px)`,
    opacity: Math.min(1, p * 2.5),
  };
};
