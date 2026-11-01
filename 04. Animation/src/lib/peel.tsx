import React from "react";

// Sticker peel geometry, plain CSS + SVG (no WebGL).
//
// A rectangle (the sticker) is peeled from one corner. The fold line moves
// along a direction `d` that points from that corner into the sticker.
// Everything between the corner and the fold is lifted and folded back over
// the fold line, so we see its backing paper. That folded part (the "flap")
// is the reflection of the lifted part across the fold line. At progress 1
// the fold has passed the far corner and the flap lies completely outside
// the sticker, so nothing of the sticker is left in place.

export type PeelCorner = "tl" | "tr" | "bl" | "br";
type Pt = { x: number; y: number };

const clipHalfPlane = (poly: Pt[], keep: (q: Pt) => number): Pt[] => {
  // Sutherland-Hodgman against a single half-plane keep(q) >= 0.
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const fa = keep(a);
    const fb = keep(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) {
      const t = fa / (fa - fb);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
};

export const peelGeometry = (
  w: number,
  h: number,
  corner: PeelCorner,
  angleDeg: number,
  progress: number,
) => {
  const a = (angleDeg * Math.PI) / 180;
  const sx = corner === "tl" || corner === "bl" ? 1 : -1;
  const sy = corner === "tl" || corner === "tr" ? 1 : -1;
  const d = { x: sx * Math.cos(a), y: sy * Math.sin(a) };
  const o = { x: sx > 0 ? 0 : w, y: sy > 0 ? 0 : h };
  const proj = (q: Pt) => (q.x - o.x) * d.x + (q.y - o.y) * d.y;
  const rect: Pt[] = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];
  const pMax = Math.max(...rect.map(proj));
  const s = Math.max(0, Math.min(1, progress)) * pMax * 1.001;
  const flat = clipHalfPlane(rect, (q) => proj(q) - s);
  const lifted = clipHalfPlane(rect, (q) => s - proj(q));
  const flap = lifted.map((q) => {
    const k = 2 * (s - proj(q));
    return { x: q.x + k * d.x, y: q.y + k * d.y };
  });
  // Two points on the fold line, for a highlight/shadow gradient.
  const foldMid = { x: o.x + d.x * s, y: o.y + d.y * s };
  return { flat, flap, d, s, pMax, foldMid };
};

export const polygonCss = (pts: Pt[]) =>
  pts.length < 3 ? "polygon(0 0, 0 0, 0 0)" : `polygon(${pts.map((q) => `${q.x.toFixed(2)}px ${q.y.toFixed(2)}px`).join(", ")})`;

const polygonSvg = (pts: Pt[]) => pts.map((q) => `${q.x.toFixed(2)},${q.y.toFixed(2)}`).join(" ");

/**
 * Renders `children` as a sticker of w × h that peels from `corner`.
 * progress 0 = flat, 1 = completely peeled off.
 */
export const Peeling: React.FC<{
  w: number;
  h: number;
  progress: number;
  corner?: PeelCorner;
  angle?: number;
  /** Colour of the sticker's backing paper (the flap). */
  backing?: string;
  /** Shadow strength under the flap, 0..1. */
  shadow?: number;
  radius?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, progress, corner = "br", angle = 32, backing = "#f3f1ea", shadow = 0.35, radius = 0, children, style }) => {
  const g = peelGeometry(w, h, corner, angle, progress);
  const gid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const showFlap = progress > 0.001 && g.flap.length >= 3;
  // Gradient across the flap: bright at the fold, a little darker at the tip.
  const tip = { x: g.foldMid.x + g.d.x * g.s, y: g.foldMid.y + g.d.y * g.s };

  return (
    <div style={{ position: "relative", width: w, height: h, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          overflow: "hidden",
          clipPath: progress > 0.001 ? polygonCss(g.flat) : undefined,
        }}
      >
        {children}
      </div>
      {showFlap ? (
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            overflow: "visible",
            filter: `drop-shadow(${-g.d.x * 10}px ${-g.d.y * 10 + 8}px 14px rgba(0, 10, 60, ${shadow}))`,
          }}
        >
          <defs>
            <linearGradient
              id={`peel-${gid}`}
              gradientUnits="userSpaceOnUse"
              x1={g.foldMid.x}
              y1={g.foldMid.y}
              x2={tip.x}
              y2={tip.y}
            >
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.25" stopColor={backing} />
              <stop offset="1" stopColor={backing} stopOpacity={0.92} />
            </linearGradient>
          </defs>
          <polygon points={polygonSvg(g.flap)} fill={`url(#peel-${gid})`} />
        </svg>
      ) : null}
    </div>
  );
};
