import React from "react";

// A simple broom. Positioned by the bottom-centre of the bristles (x, y);
// `angle` tilts the stick (deg, 0 = straight up, + = leaning right).
export const Broom: React.FC<{
  x: number;
  y: number;
  angle: number;
  stick: string;
  head: string;
  bristle: string;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ x, y, angle, stick, head, bristle, scale = 1, style }) => (
  <svg
    width={240}
    height={560}
    viewBox="-120 -520 240 560"
    style={{
      position: "absolute",
      left: x - 120,
      top: y - 520,
      overflow: "visible",
      transform: `rotate(${angle}deg) scale(${scale})`,
      transformOrigin: "120px 520px",
      ...style,
    }}
  >
    <rect x={-9} y={-500} width={18} height={430} rx={9} fill={stick} />
    <path d="M-62,-80 L62,-80 L74,-40 L-74,-40 Z" fill={head} />
    <path d="M-78,-40 L78,-40 L96,0 L-96,0 Z" fill={bristle} />
    {Array.from({ length: 11 }).map((_, i) => {
      const t = i / 10;
      const xTop = -74 + 148 * t;
      const xBot = -94 + 188 * t;
      return <line key={i} x1={xTop} y1={-38} x2={xBot} y2={-2} stroke={head} strokeWidth={3} opacity={0.35} />;
    })}
  </svg>
);
