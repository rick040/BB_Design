import React from "react";

// A handkerchief seen from above: a soft square with a checked border and
// optional knots in the corners. Drawn in a 400 × 400 box.
const KNOT_POS = [
  { x: 40, y: 40 },
  { x: 360, y: 40 },
  { x: 360, y: 360 },
  { x: 40, y: 360 },
];

export const Hanky: React.FC<{
  size: number;
  cloth: string;
  check: string;
  /** Per corner 0..1: 1 = tight knot, 0 = loose corner. */
  knots?: number[];
  /** Small cloth ripple, -1..1. */
  wave?: number;
  style?: React.CSSProperties;
}> = ({ size, cloth, check, knots = [0, 0, 0, 0], wave = 0, style }) => {
  const w = wave * 14;
  const body = `M40,${40 + w * 0.5} Q200,${14 - w} 360,${40 - w * 0.5} Q${386 + w},200 360,360 Q200,${386 + w} 40,360 Q${14 - w},200 40,${40 + w * 0.5} Z`;
  const stripes = [];
  for (let i = 0; i < 6; i++) {
    const o = 70 + i * 52;
    stripes.push(<line key={`h${i}`} x1={60} y1={o} x2={340} y2={o} stroke={check} strokeWidth={6} opacity={0.35} />);
    stripes.push(<line key={`v${i}`} x1={o} y1={60} x2={o} y2={340} stroke={check} strokeWidth={6} opacity={0.35} />);
  }
  return (
    <svg width={size} height={size} viewBox="-20 -20 440 440" style={{ overflow: "visible", ...style }}>
      <path d={body} fill={cloth} stroke={check} strokeWidth={10} strokeLinejoin="round" />
      <rect x={70} y={70} width={260} height={260} fill="none" stroke={check} strokeWidth={8} rx={10} />
      {stripes}
      {KNOT_POS.map((k, i) => {
        const t = knots[i] ?? 0;
        if (t <= 0.01) return null;
        const dx = k.x < 200 ? -1 : 1;
        const dy = k.y < 200 ? -1 : 1;
        return (
          <g key={i} transform={`translate(${k.x} ${k.y}) scale(${t})`}>
            <path
              d={`M0,0 L${dx * 46},${dy * 18} L${dx * 30},${dy * 40} Z`}
              fill={cloth}
              stroke={check}
              strokeWidth={8}
              strokeLinejoin="round"
            />
            <path
              d={`M0,0 L${dx * 18},${dy * 46} L${dx * 40},${dy * 30} Z`}
              fill={cloth}
              stroke={check}
              strokeWidth={8}
              strokeLinejoin="round"
            />
            <circle cx={0} cy={0} r={30} fill={cloth} stroke={check} strokeWidth={9} />
            <path d="M-16,-6 Q0,14 16,-6" fill="none" stroke={check} strokeWidth={7} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
};

/** Rounded label chip. */
export const Chip: React.FC<{
  text: string;
  bg: string;
  fg: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, bg, fg, size = 34, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      height: size * 1.9,
      padding: `0 ${size * 0.8}px`,
      borderRadius: size,
      background: bg,
      color: fg,
      fontFamily: "'Geist', system-ui, sans-serif",
      fontWeight: 600,
      fontSize: size,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);

export const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path d="M16 4c-5 0-8 3.6-8 8.5v5L5 22h22l-3-4.5v-5C24 7.6 21 4 16 4Z" fill={color} />
    <circle cx="16" cy="26" r="3" fill={color} />
  </svg>
);
