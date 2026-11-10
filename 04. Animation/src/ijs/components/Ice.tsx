import React from "react";

// A frozen pond seen in slight perspective: an ellipse of ice with
// highlight streaks, growing cracks and an optional hole of open water.

export type Crack = { d: string; at: number; len: number };

export const IceSheet: React.FC<{
  w: number;
  h: number;
  ice: string;
  shine: string;
  rim: string;
  crackColor: string;
  water: string;
  /** frame-driven: returns 0..1 draw progress for crack i */
  crackProgress: number[];
  cracks: Crack[];
  /** hole radius factor 0..1 (rx = 190*hole) */
  hole: number;
  holeCx: number;
  holeCy: number;
  style?: React.CSSProperties;
}> = ({ w, h, ice, shine, rim, crackColor, water, crackProgress, cracks, hole, holeCx, holeCy, style }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", ...style }}>
    <ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill={rim} />
    <ellipse cx={w / 2} cy={h / 2 - 8} rx={w / 2 - 10} ry={h / 2 - 14} fill={ice} />
    {/* highlight streaks */}
    <g opacity={0.9} stroke={shine} strokeLinecap="round" fill="none">
      <path d={`M ${w * 0.16} ${h * 0.36} L ${w * 0.34} ${h * 0.22}`} strokeWidth={14} />
      <path d={`M ${w * 0.22} ${h * 0.5} L ${w * 0.3} ${h * 0.43}`} strokeWidth={9} />
      <path d={`M ${w * 0.66} ${h * 0.8} L ${w * 0.82} ${h * 0.66}`} strokeWidth={12} />
    </g>
    {/* open water */}
    {hole > 0 ? (
      <g>
        <ellipse cx={holeCx} cy={holeCy} rx={200 * hole} ry={62 * hole} fill={water} />
        <ellipse cx={holeCx} cy={holeCy + 6 * hole} rx={150 * hole} ry={40 * hole} fill="none" stroke={shine} strokeWidth={4} opacity={0.35} />
      </g>
    ) : null}
    {/* cracks */}
    {cracks.map((c, i) => {
      const p = crackProgress[i] ?? 0;
      if (p <= 0) return null;
      return (
        <g key={i}>
          <path d={c.d} fill="none" stroke={shine} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={c.len} strokeDashoffset={c.len * (1 - p)} />
          <path d={c.d} fill="none" stroke={crackColor} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={c.len} strokeDashoffset={c.len * (1 - p)} />
        </g>
      );
    })}
  </svg>
);
