import React from "react";

// A kitchen sieve in flat brand style. It is drawn in two layers so things
// can sit *inside* the bowl: <SieveBack> (the dark opening, behind the
// contents) and <SieveFront> (the mesh bowl and rim, in front). Both use the
// same box: SIEVE_W × SIEVE_H, with the rim centre at (RIM_CX, RIM_CY).
// The mesh holes are real holes (an SVG mask), so whatever falls behind the
// bowl shows through them.
export const SIEVE_W = 760;
export const SIEVE_H = 320;
export const RIM_CX = 380;
export const RIM_CY = 50;
export const RIM_RX = 270;
export const BOWL_DEPTH = 240;

const VB = `0 0 ${SIEVE_W} ${SIEVE_H}`;

export const SieveBack: React.FC<{ inner: string; style?: React.CSSProperties }> = ({ inner, style }) => (
  <svg viewBox={VB} width={SIEVE_W} height={SIEVE_H} style={{ position: "absolute", overflow: "visible", ...style }}>
    <ellipse cx={RIM_CX} cy={RIM_CY} rx={RIM_RX} ry={34} fill={inner} />
  </svg>
);

export const SieveFront: React.FC<{
  mesh: string;
  rim: string;
  /** Radius of the holes in px (0 = no holes). */
  hole?: number;
  style?: React.CSSProperties;
}> = ({ mesh, rim, hole = 7, style }) => {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const bowl = `M ${RIM_CX - RIM_RX} ${RIM_CY} A ${RIM_RX} ${BOWL_DEPTH} 0 0 0 ${RIM_CX + RIM_RX} ${RIM_CY} Z`;
  return (
    <svg viewBox={VB} width={SIEVE_W} height={SIEVE_H} style={{ position: "absolute", overflow: "visible", ...style }}>
      <defs>
        <pattern id={`holes-${id}`} width={30} height={30} patternUnits="userSpaceOnUse" x={RIM_CX} y={RIM_CY + 12}>
          <circle cx={15} cy={15} r={hole} fill="black" />
        </pattern>
        <mask id={`mask-${id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={SIEVE_W} height={SIEVE_H}>
          <path d={bowl} fill="white" />
          <rect x={0} y={RIM_CY + 22} width={SIEVE_W} height={SIEVE_H} fill={`url(#holes-${id})`} />
        </mask>
      </defs>
      {/* Handles */}
      <path d={`M ${RIM_CX - RIM_RX - 6} ${RIM_CY - 4} L 18 ${RIM_CY - 30}`} stroke={rim} strokeWidth={22} strokeLinecap="round" />
      <path d={`M ${RIM_CX + RIM_RX + 6} ${RIM_CY - 4} q 54 -2 62 14`} stroke={rim} strokeWidth={18} strokeLinecap="round" fill="none" />
      {/* Mesh bowl with holes */}
      <path d={bowl} fill={mesh} mask={`url(#mask-${id})`} />
      {/* Foot ring */}
      <ellipse cx={RIM_CX} cy={RIM_CY + BOWL_DEPTH + 4} rx={70} ry={12} fill={rim} />
      {/* Front of the rim */}
      <path
        d={`M ${RIM_CX - RIM_RX} ${RIM_CY} A ${RIM_RX} 34 0 0 0 ${RIM_CX + RIM_RX} ${RIM_CY}`}
        stroke={rim}
        strokeWidth={18}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${RIM_CX - RIM_RX} ${RIM_CY} A ${RIM_RX} 34 0 0 1 ${RIM_CX + RIM_RX} ${RIM_CY}`}
        stroke={rim}
        strokeWidth={10}
        fill="none"
        opacity={0.55}
      />
    </svg>
  );
};

/** Sieve worn as a helmet: same drawing, upside down, scaled to Buddy. */
export const SieveHat: React.FC<{ mesh: string; rim: string; width: number; style?: React.CSSProperties }> = ({
  mesh,
  rim,
  width,
  style,
}) => {
  const s = width / SIEVE_W;
  return (
    <div style={{ position: "absolute", width, height: SIEVE_H * s, ...style }}>
      <div style={{ transform: `scale(${s}) rotate(180deg)`, transformOrigin: "0 0", position: "absolute", left: width, top: SIEVE_H * s }}>
        <SieveFront mesh={mesh} rim={rim} hole={6} />
      </div>
    </div>
  );
};
