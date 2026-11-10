import type React from "react";

// Three CSS-only transitions for concept 64 (no WebGL).
const c01 = (p: number) => Math.max(0, Math.min(1, p));
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

/** Slam: the new scene lands hard, from slightly too big to its place. */
export const slamIn = (progress: number): React.CSSProperties => {
  const p = easeOut(c01(progress));
  return { transform: `scale(${1.35 - 0.35 * p})`, opacity: Math.min(1, c01(progress) * 2.5) };
};

/** Stencil holes: the new scene shows through a grid of holes that grow until they meet. */
export const stencilHoles = (progress: number, width: number, height: number): React.CSSProperties => {
  const p = easeOut(c01(progress));
  const cols = 4;
  const rows = 7;
  const cw = width / cols;
  const ch = height / rows;
  let d = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Holes in the middle open a little earlier than the edges.
      const k = c01(p * 1.25 - (Math.abs(r - (rows - 1) / 2) / rows) * 0.25);
      const w = cw * k + 1;
      const h = ch * k + 1;
      const x = c * cw + (cw - w) / 2;
      const y = r * ch + (ch - h) / 2;
      d += `M${x.toFixed(1)} ${y.toFixed(1)}h${w.toFixed(1)}v${h.toFixed(1)}h${(-w).toFixed(1)}Z`;
    }
  }
  const path = `path('${d}')`;
  return { clipPath: path, WebkitClipPath: path };
};

/** Plate drop: the new scene slides down from the top like a stencil plate and settles. */
export const plateDrop = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const y = (1 - easeOut(p)) * -100;
  return { transform: `translateY(${y}%)`, boxShadow: "0 30px 80px rgba(0,0,0,0.35)" };
};
