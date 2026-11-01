import React from "react";

// Flat watering can (concept 40). Spout points left. Drawn in a 240 × 170
// box; the spout tip is at SPOUT_TIP. Rotate around the handle to pour.
export const CAN_W = 240;
export const CAN_H = 170;
export const SPOUT_TIP = { x: 6, y: 34 };

export const WateringCan: React.FC<{
  body: string;
  shade: string;
  /** Degrees; negative tips the spout down (pours). */
  tilt?: number;
  /** 0..1 how strong the water stream is. */
  pour?: number;
  /** Frame, for the falling drops. */
  frame: number;
  water: string;
  style?: React.CSSProperties;
}> = ({ body, shade, tilt = 0, pour = 0, frame, water, style }) => {
  const drops = [0, 1, 2, 3, 4, 5];
  return (
    <div style={{ position: "absolute", width: CAN_W, height: CAN_H, ...style }}>
      <svg viewBox={`0 0 ${CAN_W} ${CAN_H}`} width={CAN_W} height={CAN_H} style={{ overflow: "visible", display: "block" }}>
        <g transform={`rotate(${tilt} 170 90)`}>
          {/* Water drops leave from the spout tip, in can space */}
          {pour > 0.02
            ? drops.map((d) => {
                const t = ((frame + d * 3) % 18) / 18;
                return (
                  <ellipse
                    key={d}
                    cx={SPOUT_TIP.x - 8 - t * 30 + (d % 2) * 10}
                    cy={SPOUT_TIP.y + 10 + t * 150}
                    rx={7}
                    ry={11}
                    fill={water}
                    opacity={pour * (1 - t * 0.6)}
                    transform={`rotate(${-tilt} ${SPOUT_TIP.x} ${SPOUT_TIP.y})`}
                  />
                );
              })
            : null}
          {/* Spout */}
          <path d="M104,104 L18,30 L4,30 L4,44 L12,44 L96,124 Z" fill={body} />
          <rect x={-4} y={22} width={22} height={30} rx={6} fill={shade} />
          {/* Handle */}
          <path d="M150,58 C150,8 228,8 228,70 L228,110" fill="none" stroke={body} strokeWidth={16} strokeLinecap="round" />
          {/* Body */}
          <rect x={92} y={56} width={130} height={110} rx={22} fill={body} />
          <rect x={92} y={56} width={130} height={20} rx={10} fill={shade} opacity={0.35} />
        </g>
      </svg>
    </div>
  );
};
