import React from "react";

/** A small boomerang (V-shape with rounded tips), drawn around its centre. */
export const Boomerang: React.FC<{ size: number; color: string; edge?: string }> = ({ size, color, edge }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ display: "block", overflow: "visible" }}>
    <path
      d="M-44 18 C-30 -10 -8 -30 4 -34 C14 -37 20 -30 14 -22 C4 -10 -6 4 -10 20 C14 14 34 16 42 22 C48 28 40 36 30 34 C12 31 -14 34 -34 38 C-46 40 -50 30 -44 18 Z"
      fill={color}
      stroke={edge}
      strokeWidth={edge ? 3 : 0}
    />
  </svg>
);

/** Dotted trail of past positions along a flight curve. */
export const Trail: React.FC<{
  at: (u: number) => { x: number; y: number };
  u: number;
  length?: number;
  color: string;
  dot?: number;
}> = ({ at, u, length = 0.3, color, dot = 14 }) => {
  if (u <= 0 || u >= 1) return null;
  const dots: React.ReactNode[] = [];
  const n = 12;
  for (let i = 1; i <= n; i++) {
    const uu = u - (length * i) / n;
    if (uu < 0) break;
    const pt = at(uu);
    const k = 1 - i / (n + 1);
    dots.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: pt.x - (dot * k) / 2,
          top: pt.y - (dot * k) / 2,
          width: dot * k,
          height: dot * k,
          borderRadius: "50%",
          background: color,
          opacity: 0.85 * k,
        }}
      />,
    );
  }
  return <>{dots}</>;
};

export const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: "block" }}>
    <path d="M16 4c-5 0-8 3.6-8 8.5V18l-3 4h22l-3-4v-5.5C24 7.6 21 4 16 4Z" fill={color} />
    <circle cx="16" cy="26" r="3" fill={color} />
  </svg>
);
