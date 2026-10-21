import React from "react";

// Vaste sneeuwvlokken (platte stippen), zodat elke render hetzelfde is.
const FLAKES: [number, number, number][] = [
  [90, 120, 9], [250, 70, 6], [440, 140, 8], [630, 60, 5], [820, 110, 10], [980, 70, 6],
  [60, 360, 6], [180, 520, 10], [980, 400, 8], [1030, 640, 6], [920, 760, 10], [110, 760, 7],
  [200, 980, 6], [900, 1000, 9], [1020, 900, 5], [70, 1010, 9], [380, 1060, 5], [700, 1080, 7],
];

export const Snow: React.FC<{ color: string; scaleY?: number; opacity?: number }> = ({
  color,
  scaleY = 1,
  opacity = 0.55,
}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
    {FLAKES.map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y * scaleY} r={r} fill={color} opacity={opacity} />
    ))}
  </svg>
);
