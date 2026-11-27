import type React from "react";

// CSS-only transitions for concept 126 (no WebGL).

/** Seam push: the new scene grows from the right half to full width (the Buddy half wins). */
export const seamPush = (progress: number, from = 0.5): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const left = from * (1 - p) * 100;
  return { clipPath: `inset(0 0 0 ${left}%)` };
};

/** Straight wipe: the new scene is revealed top to bottom, like a line drawn straight down. */
export const straightDown = (progress: number): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  return { clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` };
};
