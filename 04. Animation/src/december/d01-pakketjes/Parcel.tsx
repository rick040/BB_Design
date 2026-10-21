import React from "react";

/** Vlak pakketje (doos met tape en etiket), puur SVG in de campagnekleuren. */
export const Parcel: React.FC<{
  w: number;
  h: number;
  color: string;
  tape: string;
  label?: string;
  style?: React.CSSProperties;
}> = ({ w, h, color, tape, label = "rgba(255,255,255,0.55)", style }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", overflow: "visible", ...style }}>
    <rect x={0} y={0} width={w} height={h} rx={h * 0.14} fill={color} />
    <rect x={w * 0.41} y={0} width={w * 0.18} height={h} fill={tape} />
    <rect x={w * 0.08} y={h * 0.64} width={w * 0.24} height={h * 0.18} rx={h * 0.04} fill={label} />
  </svg>
);

/** Vlaggetje (7 of 2 dagen vooraf) in een agendacel. */
export const Flag: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: "block", overflow: "visible", ...style }}>
    <rect x={7} y={3} width={3.4} height={27} rx={1.7} fill={color} />
    <path d="M10.4 4.5h15.6l-4.6 6.2 4.6 6.2H10.4Z" fill={color} />
  </svg>
);
