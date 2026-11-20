import React from "react";

// A fortune cookie drawn as two halves that share a jagged break line, so it
// can crack open. viewBox 400 × 260; the break runs down x ≈ 200.
const ZIG = "L188,120 L210,146 L190,176 L208,204 L200,222";
const LEFT = `M20,170 C38,62 150,18 200,92 ${ZIG} C138,226 66,212 20,170 Z`;
const RIGHT = `M380,170 C362,62 250,18 200,92 ${ZIG} C262,226 334,212 380,170 Z`;
const FOLD_L = "M60,168 C90,120 140,110 176,140";
const FOLD_R = "M340,168 C310,120 260,110 224,140";

export const COOKIE_W = 400;
export const COOKIE_H = 260;

export const Cookie: React.FC<{
  width: number;
  /** 0 = whole, 1 = fully cracked open. */
  crack?: number;
  body?: string;
  shade?: string;
  style?: React.CSSProperties;
}> = ({ width, crack = 0, body = "#f6c35c", shade = "#d9973a", style }) => {
  const c = Math.max(0, crack);
  const tilt = 22 * c;
  const dx = 40 * c;
  const dy = 30 * c;
  return (
    <svg
      viewBox={`0 0 ${COOKIE_W} ${COOKIE_H}`}
      width={width}
      height={(width * COOKIE_H) / COOKIE_W}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <ellipse cx={200} cy={236} rx={170 - 30 * c} ry={14} fill="rgba(1,40,160,0.10)" opacity={1 - Math.min(1, c)} />
      <g transform={`translate(${-dx} ${dy}) rotate(${-tilt} 200 222)`}>
        <path d={LEFT} fill={body} />
        <path d={FOLD_L} fill="none" stroke={shade} strokeWidth={9} strokeLinecap="round" />
      </g>
      <g transform={`translate(${dx} ${dy}) rotate(${tilt} 200 222)`}>
        <path d={RIGHT} fill={body} />
        <path d={FOLD_R} fill="none" stroke={shade} strokeWidth={9} strokeLinecap="round" />
      </g>
    </svg>
  );
};
