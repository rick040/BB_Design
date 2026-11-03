import React from "react";
import { usePalette } from "../../lib/palette";

// Chunky instant camera that Buddy holds in front of him.
// Drawn in a 260 × 180 box. `flash` 0..1 lights the flash window and
// draws a starburst; the photo slot sits at the bottom edge.
export const CAMERA_W = 260;
export const CAMERA_H = 180;

export const Camera: React.FC<{
  width: number;
  flash?: number;
  body?: string;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ width, flash = 0, body, accent, style }) => {
  const p = usePalette();
  const k = width / CAMERA_W;
  const b = body ?? p.white;
  const a = accent ?? p.blueSoft;
  return (
    <div style={{ position: "absolute", width, height: CAMERA_H * k, ...style }}>
      <svg viewBox={`0 0 ${CAMERA_W} ${CAMERA_H}`} width="100%" height="100%" style={{ overflow: "visible", display: "block" }}>
        {/* Flash burst */}
        {flash > 0.01 ? (
          <g transform={`translate(206 30) scale(${0.4 + flash * 1.2})`} opacity={flash}>
            {Array.from({ length: 10 }).map((_, i) => {
              const ang = (i / 10) * Math.PI * 2;
              const r1 = 22;
              const r2 = i % 2 === 0 ? 74 : 50;
              return (
                <line
                  key={i}
                  x1={Math.cos(ang) * r1}
                  y1={Math.sin(ang) * r1}
                  x2={Math.cos(ang) * r2}
                  y2={Math.sin(ang) * r2}
                  stroke={p.yellow}
                  strokeWidth={9}
                  strokeLinecap="round"
                />
              );
            })}
            <circle r={24} fill="#fff8d6" />
          </g>
        ) : null}
        {/* Body */}
        <rect x={0} y={22} width={260} height={150} rx={30} fill={b} />
        <rect x={0} y={22} width={260} height={46} rx={23} fill={a} />
        <rect x={0} y={46} width={260} height={22} fill={a} />
        {/* Viewfinder + flash window */}
        <rect x={26} y={34} width={42} height={24} rx={7} fill={p.ink} opacity={0.85} />
        <rect x={186} y={30} width={44} height={30} rx={8} fill={flash > 0.01 ? "#fff8d6" : "#e9eefc"} stroke={p.blueMid} strokeWidth={3} />
        {/* Lens */}
        <circle cx={130} cy={108} r={56} fill={p.blueMid} />
        <circle cx={130} cy={108} r={42} fill={p.ink} />
        <circle cx={130} cy={108} r={26} fill="#1f2a55" />
        <circle cx={117} cy={95} r={9} fill="#ffffff" opacity={0.75} />
        {/* Shutter button */}
        <rect x={34} y={10} width={40} height={16} rx={6} fill={p.red} />
        {/* Photo slot */}
        <rect x={40} y={160} width={180} height={8} rx={4} fill={p.ink} opacity={0.75} />
      </svg>
    </div>
  );
};
