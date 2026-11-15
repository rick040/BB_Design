import type React from "react";

// Two CSS-only transitions for the advent concept (no WebGL).

/** Hinge door: the new scene swings in like a cabinet door on one side. */
export const hingeDoor = (progress: number, side: "left" | "right"): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const e = 1 - Math.pow(1 - p, 3);
  const a = (1 - e) * (side === "left" ? 92 : -92);
  return {
    transform: `perspective(2600px) rotateY(${a}deg)`,
    transformOrigin: side === "left" ? "0% 50%" : "100% 50%",
    backfaceVisibility: "hidden",
    boxShadow: `0 0 120px rgba(0,0,0,${0.35 * (1 - e)})`,
  };
};

/**
 * Door grid: the new scene appears behind a 3 × 5 grid of little doors that
 * open one after another in a diagonal wave (SVG mask, each door grows from
 * its hinge).
 */
export const doorGrid = (progress: number, cols = 3, rows = 5): React.CSSProperties => {
  const p = Math.max(0, Math.min(1, progress));
  const maxD = cols + rows - 2;
  let rects = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const d = (c + r) / maxD; // 0..1 diagonal order
      const q = Math.max(0, Math.min(1, (p * 1.7 - d * 0.7) / 1));
      if (q <= 0) continue;
      const w = Math.min(1, q * 1.04);
      rects += `<rect x='${c}' y='${r}' width='${w.toFixed(3)}' height='1.02' fill='white'/>`;
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${cols} ${rows}' preserveAspectRatio='none'>${rects}</svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return {
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
};
