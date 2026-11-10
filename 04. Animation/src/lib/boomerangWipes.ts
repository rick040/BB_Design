import type React from "react";

// Two CSS-only transitions for the boomerang concept (no WebGL).

/** Swing: the new scene is revealed by an arm that swings around a bottom corner. */
export const swingMask = (progress: number, corner: "left" | "right"): React.CSSProperties => {
  const a = Math.max(0, Math.min(1, progress)) * 90;
  const g =
    corner === "left"
      ? `conic-gradient(from 0deg at 0% 100%, #000 0deg, #000 ${a}deg, transparent ${a + 0.6}deg)`
      : `conic-gradient(from ${-a}deg at 100% 100%, #000 0deg, #000 ${a}deg, transparent ${a + 0.6}deg)`;
  return { WebkitMaskImage: g, maskImage: g };
};

/** Spin return: the new scene spins in from the centre like a boomerang coming back. */
export const spinIn = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  return {
    transform: `rotate(${(1 - p) * -200}deg) scale(${0.15 + 0.85 * p})`,
    borderRadius: `${(1 - p) * 50}%`,
    overflow: "hidden",
    opacity: Math.min(1, p * 3),
  };
};
