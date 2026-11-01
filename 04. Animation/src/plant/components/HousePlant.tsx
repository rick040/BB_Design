import React from "react";
import { interpolateColors } from "remotion";
import { fonts } from "../../theme";

// A flat, on-brand house plant in a pot (concept 40).
// Drawn in its own 300 × 440 box; the pot bottom sits at y = 430.
export const PLANT_W = 300;
export const PLANT_H = 440;
export const POT_BOTTOM = 430;

const BASE = { x: 150, y: 286 }; // where the stem leaves the soil
const TOP = { x: 150, y: 70 }; // stem tip when healthy

// Leaves along the stem: t = position on the stem (0 soil, 1 tip),
// side = -1 left / 1 right, ang = degrees above horizontal.
const LEAVES = [
  { t: 0.22, side: -1, len: 112, ang: 22 },
  { t: 0.34, side: 1, len: 118, ang: 26 },
  { t: 0.52, side: -1, len: 100, ang: 32 },
  { t: 0.64, side: 1, len: 104, ang: 36 },
  { t: 0.8, side: -1, len: 84, ang: 44 },
  { t: 0.9, side: 1, len: 80, ang: 50 },
  { t: 1.0, side: -1, len: 64, ang: 70 },
];
export const FALL_LEAF = 3;

const LEAF = (len: number) => {
  const w = len * 0.42;
  return `M0,0 C${len * 0.25},${-w} ${len * 0.8},${-w * 0.7} ${len},0 C${len * 0.8},${w * 0.7} ${len * 0.25},${w} 0,0 Z`;
};

const qPoint = (t: number, p0: { x: number; y: number }, c: { x: number; y: number }, p1: { x: number; y: number }) => ({
  x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * c.x + t * t * p1.x,
  y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * c.y + t * t * p1.y,
});

export type HousePlantProps = {
  /** 0 healthy, 1 fully wilted. */
  wilt?: number;
  /** Overall plant (stem + leaves) scale from the soil. */
  grow?: number;
  /** 0..1, flower at the tip. */
  bloom?: number;
  /** Small sway in degrees. */
  sway?: number;
  /** -1 = leaf still attached; 0..1 = falling leaf progress. */
  leafFall?: number;
  leafColor: string;
  leafDry: string;
  stemColor: string;
  potColor: string;
  potShade: string;
  label: string;
  labelColor: string;
  labelBg: string;
  /** 0..1, label flips (rotateX) to altLabel. */
  labelFlip?: number;
  altLabel?: string;
  altColor?: string;
  altBg?: string;
  /** Plant stake with a date tag, `insert` 0..1 (slides into the soil). */
  stake?: { text: string; insert: number; color: string; textColor: string };
  flowerColor?: string;
  style?: React.CSSProperties;
};

export const HousePlant: React.FC<HousePlantProps> = ({
  wilt = 0,
  grow = 1,
  bloom = 0,
  sway = 0,
  leafFall = -1,
  leafColor,
  leafDry,
  stemColor,
  potColor,
  potShade,
  label,
  labelColor,
  labelBg,
  labelFlip = 0,
  altLabel,
  altColor,
  altBg,
  stake,
  flowerColor = "#ffce31",
  style,
}) => {
  // The stem bends over to the right while wilting.
  const top = { x: TOP.x + wilt * 92, y: TOP.y + wilt * 120 };
  const ctrl = { x: BASE.x + wilt * 6, y: 150 - wilt * 30 };
  const col = interpolateColors(wilt, [0, 1], [leafColor, leafDry]);

  const leafAt = (i: number) => {
    const l = LEAVES[i];
    const pt = qPoint(l.t, BASE, ctrl, top);
    // Drooping: leaves rotate down to ~55° below horizontal.
    const ang = l.ang * (1 - wilt) - wilt * (50 + l.t * 20);
    const rot = l.side === 1 ? -ang : 180 + ang;
    return { pt, rot, len: l.len * (1 - wilt * 0.12) };
  };

  const flip = Math.min(1, Math.max(0, labelFlip));
  const showAlt = flip > 0.5 && altLabel;
  const flipScale = Math.abs(Math.cos(flip * Math.PI));
  const tip = top;

  // Falling leaf: from its attach point down to the sill (y = POT_BOTTOM).
  const fl = leafAt(FALL_LEAF);
  const f = Math.max(0, leafFall);
  const fallX = fl.pt.x + 60 * f + Math.sin(f * 7) * 26;
  const fallY = fl.pt.y + (POT_BOTTOM - 4 - fl.pt.y) * (f * f * 0.6 + f * 0.4);
  const fallR = fl.rot + f * 160 + Math.sin(f * 9) * 20;

  return (
    <div style={{ position: "absolute", width: PLANT_W, height: PLANT_H, ...style }}>
      <svg
        viewBox={`0 0 ${PLANT_W} ${PLANT_H}`}
        width={PLANT_W}
        height={PLANT_H}
        style={{ overflow: "visible", display: "block", position: "absolute", left: 0, top: 0 }}
      >
        <g transform={`rotate(${sway} ${BASE.x} ${BASE.y}) translate(${BASE.x} ${BASE.y}) scale(${grow}) translate(${-BASE.x} ${-BASE.y})`}>
          <path
            d={`M${BASE.x},${BASE.y + 10} Q${ctrl.x},${ctrl.y} ${top.x},${top.y}`}
            fill="none"
            stroke={stemColor}
            strokeWidth={10}
            strokeLinecap="round"
          />
          {LEAVES.map((_, i) => {
            if (i === FALL_LEAF && leafFall >= 0) return null;
            const { pt, rot, len } = leafAt(i);
            return (
              <g key={i} transform={`translate(${pt.x} ${pt.y}) rotate(${rot})`}>
                <path d={LEAF(len)} fill={col} />
                <path d={`M6,0 L${len * 0.82},0`} stroke={potShade} strokeOpacity={0.25} strokeWidth={3} strokeLinecap="round" />
              </g>
            );
          })}
          {bloom > 0.01 ? (
            <g transform={`translate(${tip.x} ${tip.y - 8}) scale(${bloom}) rotate(${bloom * 40})`}>
              {[0, 1, 2, 3, 4].map((k) => (
                <ellipse
                  key={k}
                  cx={0}
                  cy={-30}
                  rx={20}
                  ry={30}
                  fill={flowerColor}
                  transform={`rotate(${k * 72})`}
                />
              ))}
              <circle r={18} fill="#ffffff" />
            </g>
          ) : null}
        </g>

        {leafFall >= 0 ? (
          <g transform={`translate(${fallX} ${fallY}) rotate(${fallR})`}>
            <path d={LEAF(fl.len)} fill={col} />
          </g>
        ) : null}

        {/* Stake, in front of the leaves */}
        {stake ? (
          <g
            transform={`translate(0 ${(1 - stake.insert) * -240})`}
            opacity={Math.min(1, stake.insert * 3)}
          >
            <rect x={226} y={150} width={10} height={150} rx={4} fill={stake.color} />
            <rect x={176} y={104} width={112} height={56} rx={14} fill={stake.color} />
            <text
              x={232}
              y={142}
              textAnchor="middle"
              fontFamily={fonts.display}
              fontWeight={700}
              fontSize={30}
              letterSpacing="-0.02em"
              fill={stake.textColor}
            >
              {stake.text}
            </text>
          </g>
        ) : null}

        {/* Soil + pot */}
        <ellipse cx={150} cy={292} rx={104} ry={14} fill={potShade} />
        <path d="M44,300 L256,300 L232,430 L68,430 Z" fill={potColor} />
        <rect x={30} y={276} width={240} height={40} rx={12} fill={potColor} />
        <rect x={30} y={306} width={240} height={10} fill={potShade} opacity={0.18} />
      </svg>

      {/* Pot label (HTML for crisp text + flip) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 340,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "8px 20px",
            borderRadius: 14,
            background: showAlt ? altBg : labelBg,
            color: showAlt ? altColor : labelColor,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            transform: `scaleY(${flip > 0 ? Math.max(0.05, flipScale) : 1})`,
          }}
        >
          {showAlt ? altLabel : label}
        </div>
      </div>
    </div>
  );
};
