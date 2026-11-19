import type React from "react";

// Two CSS-only transitions for the suitcase concept (no WebGL).

const c = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Rits (zipper): the new scene is unzipped from the top down; the edge is a
 * row of zipper teeth. Returns a clip-path for the incoming scene.
 */
export const zipReveal = (progress: number, width: number, height: number): React.CSSProperties => {
  const p = ease(c(progress));
  const y = p * (height + 60) - 30;
  const tooth = 36;
  const amp = 16;
  const pts: string[] = ["0px 0px", `${width}px 0px`];
  for (let x = width, k = 0; x >= -tooth; x -= tooth / 2, k++) {
    pts.push(`${x}px ${y + (k % 2 === 0 ? amp : -amp)}px`);
  }
  const path = `polygon(${pts.join(",")})`;
  return { clipPath: path, WebkitClipPath: path };
};

/** Where the zipper pull sits during zipReveal (y in px). */
export const zipPullY = (progress: number, height: number) => ease(c(progress)) * (height + 60) - 30;

/**
 * Flappen: like the rubber flaps of a baggage carousel, the new scene drops
 * in as vertical strips, right to left, each with a little swing.
 */
export const flapReveal = (progress: number, width: number, height: number, strips = 9): React.CSSProperties => {
  const p = c(progress);
  const w = width / strips;
  const pts: string[] = ["0px 0px"];
  for (let i = 0; i < strips; i++) {
    const order = strips - 1 - i; // right strip first
    const local = c((p - order * 0.06) / (1 - (strips - 1) * 0.06));
    const h = ease(local) * height * 1.02;
    pts.push(`${i * w}px ${h}px`, `${(i + 1) * w}px ${h}px`);
  }
  pts.push(`${width}px 0px`);
  const path = `polygon(${pts.join(",")})`;
  return { clipPath: path, WebkitClipPath: path };
};
