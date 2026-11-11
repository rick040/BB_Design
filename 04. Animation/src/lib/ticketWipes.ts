import type React from "react";

// Two CSS-only transitions for the waiting-room concept (no WebGL).

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Ticket tear: the new scene is revealed below/above a perforated, zig-zag
 * edge that rips across the frame, like tearing a queue ticket off the roll.
 */
export const ticketTear = (progress: number, from: "top" | "bottom"): React.CSSProperties => {
  const p = clamp01(progress);
  const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  const teeth = 18;
  const depth = 3.2; // % of height
  // Edge position in %, overshoot so the teeth leave the frame at p=1.
  const edge = -depth + eased * (100 + 2 * depth);
  const pts: string[] = [];
  for (let i = 0; i <= teeth * 2; i++) {
    const x = (i / (teeth * 2)) * 100;
    const tilt = (x - 50) * 0.06 * (1 - eased); // slight diagonal rip
    const y = edge + (i % 2 === 0 ? 0 : depth) + tilt;
    pts.push(`${x}% ${from === "top" ? y : 100 - y}%`);
  }
  const poly =
    from === "top"
      ? `polygon(0% 0%, 100% 0%, ${pts.reverse().join(", ")})`
      : `polygon(0% 100%, 100% 100%, ${pts.reverse().join(", ")})`;
  return { clipPath: poly, WebkitClipPath: poly };
};

/**
 * Split-flap: like a departure board, the new scene's top half flips down
 * first, then its bottom half folds open. Returns the styles for both halves.
 */
export const splitFlap = (progress: number): { top: React.CSSProperties; bottom: React.CSSProperties } => {
  const p = clamp01(progress);
  const a = clamp01(p / 0.5);
  const b = clamp01((p - 0.5) / 0.5);
  return {
    top: {
      clipPath: "inset(0 0 50% 0)",
      transform: `perspective(6000px) rotateX(${(1 - a) * 90}deg)`,
      transformOrigin: "50% 50%",
      opacity: a > 0 ? 1 : 0,
    },
    bottom: {
      clipPath: "inset(50% 0 0 0)",
      transform: `perspective(6000px) rotateX(${-(1 - b) * 90}deg)`,
      transformOrigin: "50% 50%",
      opacity: b > 0 ? 1 : 0,
    },
  };
};
