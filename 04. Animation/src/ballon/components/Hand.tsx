import React from "react";

// A simple flat fist that holds the balloon strings, with a sleeve going
// down out of frame. (x, y) = the point where the strings enter the fist.
export const HAND_GRIP = { dx: 0, dy: 8 };

export const Hand: React.FC<{
  x: number;
  y: number;
  sleeve: string;
  skin?: string;
  line?: string;
  rotate?: number;
}> = ({ x, y, sleeve, skin = "#f3c9a9", line = "#d39c78", rotate = 0 }) => (
  <svg
    width={260}
    height={1000}
    viewBox="0 0 260 1000"
    style={{
      position: "absolute",
      left: x - 130,
      top: y - 20,
      overflow: "visible",
      transformOrigin: "130px 200px",
      transform: `rotate(${rotate}deg)`,
    }}
  >
    {/* sleeve */}
    <path d="M70 150 L190 150 L215 1000 L45 1000 Z" fill={sleeve} />
    <rect x={64} y={140} width={132} height={30} rx={10} fill={sleeve} opacity={0.85} />
    {/* fist */}
    <rect x={58} y={18} width={144} height={132} rx={44} fill={skin} />
    {/* finger lines */}
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={`M${94 + i * 36} 66 L${94 + i * 36} 140`}
        stroke={line}
        strokeWidth={5}
        strokeLinecap="round"
      />
    ))}
    {/* thumb wrapping over the top */}
    <path d="M62 64 C62 30 120 26 176 44 C192 50 190 74 172 74 L92 78 C74 78 62 76 62 64 Z" fill={skin} stroke={line} strokeWidth={5} />
  </svg>
);
