import React from "react";

// Front view of a backpack, drawn in a 200 × 240 box (handle on top).
// flap 0 = closed, 1 = swung open (opening visible).
export const RUGZAK_W = 200;
export const RUGZAK_H = 240;

export const Rugzak: React.FC<{
  width: number;
  body: string;
  flap: string;
  pocket: string;
  accent: string;
  inside?: string;
  open?: number;
  label?: string;
  labelColor?: string;
  style?: React.CSSProperties;
}> = ({ width, body, flap, pocket, accent, inside = "#0a1a5c", open = 0, label, labelColor, style }) => {
  const h = (width * RUGZAK_H) / RUGZAK_W;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${RUGZAK_W} ${RUGZAK_H}`} style={{ overflow: "visible", ...style }}>
      {/* handle */}
      <path d="M72 40 C72 4, 128 4, 128 40" fill="none" stroke={accent} strokeWidth={12} strokeLinecap="round" />
      {/* body */}
      <rect x={18} y={34} width={164} height={200} rx={44} fill={body} />
      {/* opening (visible once the flap swings away) */}
      <ellipse cx={100} cy={48} rx={70 * Math.min(1, open * 1.5)} ry={16 * Math.min(1, open * 1.5)} fill={inside} />
      {/* pocket */}
      <rect x={48} y={146} width={104} height={70} rx={22} fill={pocket} />
      <rect x={70} y={160} width={60} height={8} rx={4} fill={accent} opacity={0.55} />
      {label ? (
        <text
          x={100}
          y={198}
          textAnchor="middle"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight={700}
          fontSize={30}
          fill={labelColor ?? accent}
        >
          {label}
        </text>
      ) : null}
      {/* flap; folds back over the top edge as it opens */}
      <g transform={`translate(0 34) scale(1 ${Math.max(0.0001, 1 - open)}) translate(0 -34)`} opacity={open > 0.98 ? 0 : 1}>
        <path d="M18 78 C18 50, 40 34, 70 34 L130 34 C160 34, 182 50, 182 78 L182 112 C182 120, 176 126, 168 126 L32 126 C24 126, 18 120, 18 112 Z" fill={flap} />
        <rect x={88} y={104} width={24} height={34} rx={6} fill={accent} />
      </g>
    </svg>
  );
};
