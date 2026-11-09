import React from "react";

// Simple board-game pawn: round head, flared body, base. Feet = bottom centre.
export const PAWN_W = 84;
export const PAWN_H = 128;

export const Pawn: React.FC<{ color: string; shine: string; squash?: number; style?: React.CSSProperties }> = ({
  color,
  shine,
  squash = 1,
  style,
}) => (
  <div style={{ position: "absolute", width: PAWN_W, height: PAWN_H, ...style }}>
    <svg
      viewBox="0 0 84 128"
      width={PAWN_W}
      height={PAWN_H}
      style={{ overflow: "visible", transform: `scale(${1 / Math.sqrt(squash)}, ${squash})`, transformOrigin: "50% 100%" }}
    >
      <ellipse cx="42" cy="122" rx="40" ry="8" fill="rgba(0,0,0,0.12)" />
      <path d="M8 120 Q8 104 22 100 L30 58 Q18 50 20 36 Q22 6 42 6 Q62 6 64 36 Q66 50 54 58 L62 100 Q76 104 76 120 Z" fill={color} />
      <ellipse cx="33" cy="26" rx="7" ry="10" fill={shine} opacity={0.6} />
    </svg>
  </div>
);
