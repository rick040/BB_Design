import React from "react";
import { brand } from "../../theme";

/** A yellow school ruler with tick marks (horizontal). */
export const Ruler: React.FC<{ width: number; height?: number; style?: React.CSSProperties }> = ({
  width,
  height = 70,
  style,
}) => {
  const ticks = Math.floor(width / 24);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible", ...style }}>
      <rect x={0} y={0} width={width} height={height} rx={10} fill={brand.yellow} />
      <rect x={0} y={height - 8} width={width} height={8} rx={4} fill="#e8b51f" />
      {Array.from({ length: ticks }).map((_, i) => {
        const x = 18 + i * 24;
        const h = i % 5 === 0 ? height * 0.46 : height * 0.24;
        return <rect key={i} x={x} y={0} width={4} height={h} rx={2} fill="#8a6a00" opacity={0.55} />;
      })}
    </svg>
  );
};

/** Four-point sparkle, the cliché "AI" glyph. */
export const Sparkle: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible", ...style }}>
    <path d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z" fill={color} />
  </svg>
);
