import React from "react";
import { fonts, headlineTracking } from "../../theme";

/** A party balloon drawn around its centre; `r` is the horizontal radius. */
export const Balloon: React.FC<{
  cx: number;
  cy: number;
  r: number;
  color: string;
  label?: string;
  labelColor?: string;
  labelIn?: number;
  /** Small rotation in degrees for wobble. */
  tilt?: number;
  /** 1 = whole, 0 = popped away. */
  whole?: number;
}> = ({ cx, cy, r, color, label, labelColor = "#fff", labelIn = 1, tilt = 0, whole = 1 }) => {
  const ry = r * 1.18;
  const knot = Math.max(10, r * 0.13);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - r,
        top: cy - ry,
        width: r * 2,
        height: ry * 2 + knot,
        transform: `rotate(${tilt}deg) scale(${whole})`,
        transformOrigin: "50% 100%",
        opacity: whole > 0.05 ? 1 : 0,
      }}
    >
      <svg width={r * 2} height={ry * 2 + knot} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <ellipse cx={r} cy={ry} rx={r} ry={ry} fill={color} />
        <ellipse
          cx={r * 0.62}
          cy={ry * 0.5}
          rx={r * 0.17}
          ry={ry * 0.26}
          fill="#fff"
          opacity={0.35}
          transform={`rotate(-28 ${r * 0.62} ${ry * 0.5})`}
        />
        <path
          d={`M ${r - knot * 0.7} ${ry * 2 + knot} L ${r} ${ry * 2 - 2} L ${r + knot * 0.7} ${ry * 2 + knot} Z`}
          fill={color}
        />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: ry - r * 0.36,
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: r * 0.62,
            letterSpacing: headlineTracking,
            lineHeight: 1,
            color: labelColor,
            opacity: labelIn,
            transform: `scale(${0.6 + 0.4 * labelIn})`,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Slightly curved string from (x1,y1) to (x2,y2). */
export const BalloonString: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  sway?: number;
  width?: number;
}> = ({ x1, y1, x2, y2, color, sway = 0, width = 4 }) => {
  const mx = (x1 + x2) / 2 + 30 + sway;
  const my = (y1 + y2) / 2;
  return (
    <svg
      width={1080}
      height={900}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
    >
      <path
        d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    </svg>
  );
};

/** A yellow-headed pin, pointing up-right, tip at (x,y). */
export const Pin: React.FC<{ x: number; y: number; color: string; size?: number; angle?: number }> = ({
  x,
  y,
  color,
  size = 110,
  angle = -45,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y - 6,
      width: size,
      height: 12,
      transformOrigin: "0% 50%",
      transform: `rotate(${180 + angle}deg)`,
    }}
  >
    <svg width={size} height={24} style={{ position: "absolute", top: -6, overflow: "visible" }}>
      <line x1={0} y1={12} x2={size - 20} y2={12} stroke="#9aa3b5" strokeWidth={6} strokeLinecap="round" />
      <circle cx={size - 14} cy={12} r={18} fill={color} />
    </svg>
  </div>
);

/** Pop burst: short rays around a point. progress 0..1. */
export const PopBurst: React.FC<{ cx: number; cy: number; progress: number; color: string; radius?: number }> = ({
  cx,
  cy,
  progress,
  color,
  radius = 260,
}) => {
  if (progress <= 0 || progress >= 1) return null;
  const n = 12;
  const r1 = radius * (0.35 + 0.65 * progress);
  const r2 = r1 + 70 * (1 - progress);
  return (
    <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1}
            y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * r2}
            y2={cy + Math.sin(a) * r2}
            stroke={color}
            strokeWidth={14}
            strokeLinecap="round"
            opacity={1 - progress}
          />
        );
      })}
    </svg>
  );
};
