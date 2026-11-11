import React from "react";

// A piggy bank drawn around a 400 × 300 box; the coin slot sits on top
// at (200, 38). Feet at y = 300.
export const PIGGY_W = 400;
export const PIGGY_H = 300;
export const SLOT = { x: 200, y: 40 };

export const Piggy: React.FC<{
  body: string;
  shade: string;
  slot: string;
  /** Snout points left when true. */
  flip?: boolean;
  style?: React.CSSProperties;
}> = ({ body, shade, slot, flip = false, style }) => (
  <svg
    width={PIGGY_W}
    height={PIGGY_H}
    viewBox="0 0 400 300"
    style={{ display: "block", overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}
  >
    {/* legs */}
    <rect x={95} y={220} width={46} height={80} rx={18} fill={shade} />
    <rect x={255} y={220} width={46} height={80} rx={18} fill={shade} />
    {/* tail */}
    <path d="M40 150 c-30 -10 -34 -40 -12 -40 c18 0 10 26 -6 22" fill="none" stroke={shade} strokeWidth={12} strokeLinecap="round" />
    {/* body */}
    <ellipse cx={200} cy={160} rx={165} ry={120} fill={body} />
    {/* ear */}
    <path d="M250 60 L292 18 L300 80 Z" fill={shade} />
    {/* snout */}
    <ellipse cx={360} cy={170} rx={36} ry={42} fill={shade} />
    <ellipse cx={352} cy={160} rx={6} ry={10} fill={slot} />
    <ellipse cx={368} cy={180} rx={6} ry={10} fill={slot} />
    {/* eye */}
    <circle cx={300} cy={118} r={11} fill={slot} />
    {/* coin slot */}
    <rect x={SLOT.x - 55} y={SLOT.y + 2} width={110} height={18} rx={9} fill={slot} />
  </svg>
);

/** A gold coin with a € on it, drawn around its centre. */
export const Coin: React.FC<{ size: number; color: string; edge: string; spin?: number }> = ({
  size,
  color,
  edge,
  spin = 0,
}) => (
  <div
    style={{
      width: size,
      height: size,
      transform: `scaleX(${Math.max(0.12, Math.abs(Math.cos(spin)))})`,
    }}
  >
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ display: "block" }}>
      <circle r={48} fill={edge} />
      <circle r={40} fill={color} />
      <text
        x={0}
        y={17}
        textAnchor="middle"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight={700}
        fontSize={50}
        fill={edge}
      >
        €
      </text>
    </svg>
  </div>
);
