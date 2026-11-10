import React from "react";

// A striped rug lying on the floor, seen from slightly above (trapezoid top
// surface + a thin front edge + fringe on the short sides).
//  - bump 0..1: something is swept under it (a hump at bumpX)
//  - roll 0..1: the rug is rolled up from the right edge towards the left
export const Rug: React.FC<{
  width: number;
  depth: number;
  base: string;
  stripe: string;
  edge: string;
  fringe: string;
  bump?: number;
  bumpX?: number;
  wobble?: number;
  roll?: number;
  style?: React.CSSProperties;
}> = ({ width: W, depth: D, base, stripe, edge, fringe, bump = 0, bumpX = 0.5, wobble = 0, roll = 0, style }) => {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const inset = D * 0.32;
  const T = 18; // thickness of the front edge
  const minEdge = inset + 40;
  const edgeX = minEdge + (W - minEdge) * (1 - roll); // right edge after rolling
  const surface = `M${inset},0 L${W - inset},0 L${W},${D} L0,${D} Z`;
  const stripes = [0.12, 0.2, 0.8, 0.88];
  const r = 16 + 26 * roll; // roll radius
  const hx = W * bumpX;
  const hw = 150 * bump;
  const hh = 70 * bump;

  return (
    <svg width={W + 80} height={D + T + 120} viewBox={`-40 -100 ${W + 80} ${D + T + 120}`} style={{ overflow: "visible", ...style }}>
      <defs>
        <clipPath id={`rugclip-${id}`}>
          <rect x={-60} y={-200} width={edgeX + 60} height={D + T + 400} />
        </clipPath>
        <clipPath id={`surf-${id}`}>
          <path d={surface} />
        </clipPath>
      </defs>
      {/* floor shadow */}
      <ellipse cx={(edgeX + 0) / 2} cy={D + T + 6} rx={edgeX / 2 + 20} ry={14} fill="rgba(0,20,90,0.12)" />
      <g clipPath={`url(#rugclip-${id})`}>
        {/* front edge */}
        <rect x={0} y={D} width={W} height={T} fill={edge} />
        <path d={surface} fill={base} />
        <g clipPath={`url(#surf-${id})`}>
          {stripes.map((s, i) => (
            <rect key={i} x={0} y={D * s - 6} width={W} height={12} fill={stripe} />
          ))}
          {/* diamond row in the middle */}
          {Array.from({ length: 9 }).map((_, i) => {
            const cx = W * (0.14 + i * 0.09);
            const cy = D * 0.5;
            return <path key={i} d={`M${cx},${cy - 22} L${cx + 26},${cy} L${cx},${cy + 22} L${cx - 26},${cy} Z`} fill={stripe} />;
          })}
        </g>
        {/* left fringe */}
        {Array.from({ length: 9 }).map((_, i) => {
          const t = (i + 0.5) / 9;
          const x = inset * (1 - t);
          const y = D * t;
          return <line key={i} x1={x} y1={y} x2={x - 26} y2={y + 2} stroke={fringe} strokeWidth={5} strokeLinecap="round" />;
        })}
        {/* right fringe (only when not rolled) */}
        {roll < 0.02
          ? Array.from({ length: 9 }).map((_, i) => {
              const t = (i + 0.5) / 9;
              const x = W - inset * (1 - t);
              const y = D * t;
              return <line key={i} x1={x} y1={y} x2={x + 26} y2={y + 2} stroke={fringe} strokeWidth={5} strokeLinecap="round" />;
            })
          : null}
      </g>

      {/* hump: something hidden under the rug */}
      {bump > 0.01 ? (
        <g transform={`translate(${hx} ${D * 0.55}) rotate(${wobble})`}>
          <ellipse cx={0} cy={hh * 0.25} rx={hw * 1.05} ry={hh * 0.45} fill="rgba(0,20,90,0.16)" />
          <path d={`M${-hw},${hh * 0.2} Q${-hw * 0.6},${-hh} 0,${-hh} Q${hw * 0.6},${-hh} ${hw},${hh * 0.2} Z`} fill={base} />
          <path d={`M${-hw * 0.82},${-hh * 0.05} Q0,${-hh * 1.05} ${hw * 0.82},${-hh * 0.05}`} fill="none" stroke={stripe} strokeWidth={12} />
          <path d={`M${-hw * 0.45},${-hh * 0.62} Q0,${-hh * 0.95} ${hw * 0.45},${-hh * 0.62}`} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={6} strokeLinecap="round" />
        </g>
      ) : null}

      {/* the roll at the moving edge */}
      {roll > 0.02 ? (
        <g>
          <path
            d={`M${edgeX - r},${-r * 0.4} L${edgeX - r + inset * (roll * 0.2)},${-r * 0.4} L${edgeX + r},${D + T} L${edgeX - r},${D + T} Z`}
            fill="none"
          />
          <rect x={edgeX - r} y={-r * 0.6} width={r * 2} height={D + T + r * 0.6} rx={r} fill={base} />
          <rect x={edgeX - r * 0.35} y={-r * 0.4} width={r * 0.5} height={D + T} rx={r * 0.25} fill={stripe} opacity={0.9} />
          <circle cx={edgeX} cy={D + T - r * 0.2} r={r} fill={edge} />
          <path
            d={`M${edgeX},${D + T - r * 0.2} m0,${-r * 0.25} a${r * 0.25},${r * 0.25} 0 1,1 ${-r * 0.01},0 m0,${-r * 0.3} a${r * 0.55},${r * 0.55} 0 1,1 ${-r * 0.01},0`}
            fill="none"
            stroke={stripe}
            strokeWidth={4}
          />
        </g>
      ) : null}
    </svg>
  );
};

/** Inner width/offset helpers so scenes can position things on the rug. */
export const RUG_PAD = { x: 40, y: 100 };
