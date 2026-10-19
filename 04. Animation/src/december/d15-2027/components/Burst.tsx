import React from "react";

/** Vuurwerkknal: stralen die uitwaaieren en vervagen. `t` loopt van 0 tot 1. */
export const Burst: React.FC<{ x: number; y: number; r: number; t: number; color: string; rays?: number }> = ({
  x,
  y,
  r,
  t,
  color,
  rays = 14,
}) => {
  if (t <= 0 || t >= 1) return null;
  const ease = 1 - Math.pow(1 - t, 3);
  const inner = r * 0.2 + r * 0.55 * ease;
  const outer = r * 0.35 + r * 0.65 * ease;
  return (
    <svg
      width={r * 2.6}
      height={r * 2.6}
      viewBox={`${-r * 1.3} ${-r * 1.3} ${r * 2.6} ${r * 2.6}`}
      style={{ position: "absolute", left: x - r * 1.3, top: y - r * 1.3, overflow: "visible" }}
    >
      <g opacity={1 - t * t}>
        {Array.from({ length: rays }, (_, i) => {
          const a = (i / rays) * Math.PI * 2;
          return (
            <g key={i}>
              <line
                x1={Math.cos(a) * inner}
                y1={Math.sin(a) * inner}
                x2={Math.cos(a) * outer}
                y2={Math.sin(a) * outer}
                stroke={color}
                strokeWidth={13}
                strokeLinecap="round"
              />
              <circle cx={Math.cos(a + 0.2) * (outer + 24)} cy={Math.sin(a + 0.2) * (outer + 24)} r={8 * (1 - t)} fill={color} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
