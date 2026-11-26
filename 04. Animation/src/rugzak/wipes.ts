import type React from "react";

// Concept 123 transitions (CSS only).
// rits:    the next scene unzips open from the top down along a zigzag seam.
// omkiep:  the old scene is turned upside down and tipped out of frame,
//          like emptying a backpack.

const zig = (x: number, y: number, k: number, tooth: number, side: 1 | -1) =>
  `${x + side * (k % 2 === 0 ? 0 : tooth)}px ${y}px`;

export const rits = (p: number, width: number, height: number): React.CSSProperties => {
  if (p >= 1) return {};
  const cx = width / 2;
  const steps = 48;
  const tooth = 22;
  const maxHalf = width * 0.62;
  const left: string[] = [];
  const right: string[] = [];
  for (let k = 0; k <= steps; k++) {
    const y = (height * k) / steps;
    const local = Math.max(0, Math.min(1, p * 1.7 - (y / height) * 0.7));
    const half = maxHalf * local * local * (3 - 2 * local);
    left.push(zig(cx - half, y, k, tooth * (half > 0 ? 1 : 0), 1));
    right.unshift(zig(cx + half, y, k, tooth * (half > 0 ? 1 : 0), -1));
  }
  return { clipPath: `polygon(${[...left, ...right].join(",")})` };
};

/** Where the zipper pull is (for drawing it), as y in px. */
export const ritsPullY = (p: number, height: number) => Math.min(height, Math.max(0, ((p * 1.7) / 0.7) * height * 0.55));

export const omkiep = (p: number, height: number): React.CSSProperties => ({
  transformOrigin: "50% 40%",
  transform: `translateY(${p * p * height * 1.05}px) rotate(${p * 170}deg) scale(${1 - 0.35 * p})`,
  opacity: p > 0.85 ? (1 - p) / 0.15 : 1,
});
