import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Line-art parts in the style of a flat-pack instruction sheet: thick ink
// outlines on white, numbered callouts, dashed assembly lines. Everything is
// SVG/HTML so every label stays editable.

export const INK_W = 5;

/** Envelope drawn as a manual part. */
export const LineEnvelope: React.FC<{
  w: number;
  h: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({ w, h, stroke, fill, strokeWidth = INK_W, style }) => {
  const p = usePalette();
  const s = stroke ?? p.ink;
  const sw = strokeWidth;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", ...style }}>
      <rect x={sw / 2} y={sw / 2} width={w - sw} height={h - sw} rx={10} fill={fill ?? p.white} stroke={s} strokeWidth={sw} />
      <path
        d={`M${sw} ${sw + 4} L${w / 2} ${h * 0.56} L${w - sw} ${sw + 4}`}
        fill="none"
        stroke={s}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** Numbered callout circle (①, ②, …). */
export const Callout: React.FC<{
  n: string | number;
  size?: number;
  color?: string;
  fill?: string;
  style?: React.CSSProperties;
}> = ({ n, size = 64, color, fill, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${INK_W}px solid ${color ?? p.ink}`,
        background: fill ?? p.white,
        color: color ?? p.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: size * 0.5,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {n}
    </div>
  );
};

/** Manual-style warning triangle with "!". */
export const WarningTriangle: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({
  size,
  color,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", overflow: "visible", ...style }}>
    <path d="M50 6 L96 90 L4 90 Z" fill="#fff" stroke={color} strokeWidth={9} strokeLinejoin="round" />
    <rect x={45} y={34} width={10} height={32} rx={4} fill={color} />
    <circle cx={50} cy={77} r={6} fill={color} />
  </svg>
);

/** Simple house outline, the "base" the parts belong to. */
export const LineHouse: React.FC<{ w: number; h: number; style?: React.CSSProperties }> = ({ w, h, style }) => {
  const p = usePalette();
  const roof = h * 0.42;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path
        d={`M${w * 0.06} ${roof} L${w / 2} ${INK_W} L${w * 0.94} ${roof} L${w * 0.94} ${h - INK_W / 2} L${w * 0.06} ${
          h - INK_W / 2
        } Z`}
        fill={p.white}
        stroke={p.ink}
        strokeWidth={INK_W}
        strokeLinejoin="round"
      />
      {/* door + window */}
      <rect x={w * 0.42} y={h * 0.66} width={w * 0.16} height={h * 0.34 - INK_W / 2} rx={6} fill="none" stroke={p.ink} strokeWidth={INK_W} />
      <rect x={w * 0.18} y={h * 0.52} width={w * 0.16} height={w * 0.16} rx={6} fill="none" stroke={p.ink} strokeWidth={INK_W} />
      <rect x={w * 0.66} y={h * 0.52} width={w * 0.16} height={w * 0.16} rx={6} fill="none" stroke={p.ink} strokeWidth={INK_W} />
    </svg>
  );
};

/**
 * The faceless manual person. `scratch` 0..1 lifts one arm to the head,
 * `shrug` 0..1 lifts both shoulders.
 */
export const ManualFigure: React.FC<{
  h: number;
  scratch?: number;
  shrug?: number;
  style?: React.CSSProperties;
}> = ({ h, scratch = 0, shrug = 0, style }) => {
  const p = usePalette();
  const w = h * 0.55;
  const sh = 128 - shrug * 14; // shoulder height (viewBox units)
  // Right arm: hangs down, or bends up to scratch the head.
  const handX = 128 + scratch * -18;
  const handY = 250 - scratch * 196;
  const elbowX = 140 + scratch * 30;
  const elbowY = 196 - scratch * 70;
  return (
    <svg width={w} height={h} viewBox="0 0 220 400" style={{ position: "absolute", overflow: "visible", ...style }}>
      <g fill="none" stroke={p.ink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
        {/* body */}
        <path d={`M70 ${sh} Q110 ${sh - 18} 150 ${sh} L146 262 L74 262 Z`} fill={p.white} />
        {/* legs */}
        <path d="M88 262 L84 380 M132 262 L136 380" />
        {/* left arm */}
        <path d={`M72 ${sh + 6} L52 ${200 - shrug * 30} L${60 - shrug * 30} ${252 - shrug * 70}`} />
        {/* right arm */}
        <path d={`M148 ${sh + 6} L${elbowX} ${elbowY} L${handX} ${handY}`} />
      </g>
      {/* head */}
      <circle cx={110} cy={70 - shrug * 6} r={44} fill={p.white} stroke={p.ink} strokeWidth={9} />
    </svg>
  );
};

/** Dashed assembly line between two points (absolute, in parent coordinates). */
export const DashLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  progress?: number;
  width?: number;
}> = ({ x1, y1, x2, y2, color, progress = 1, width = 4 }) => {
  const x = x1 + (x2 - x1) * progress;
  const y = y1 + (y2 - y1) * progress;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
      width={1}
      height={1}
    >
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={width} strokeDasharray="14 12" strokeLinecap="round" />
    </svg>
  );
};

/** Small round "klik" badge with a check, for a finished step. */
export const TickBadge: React.FC<{ size: number; bg: string; fg: string; style?: React.CSSProperties }> = ({
  size,
  bg,
  fg,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", overflow: "visible", ...style }}>
    <circle cx={50} cy={50} r={48} fill={bg} />
    <path d="M28 52 L44 67 L73 36" fill="none" stroke={fg} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Mini calendar tile (line-art). */
export const MiniCalendar: React.FC<{
  size: number;
  month: string;
  day: string;
  accent: string;
  style?: React.CSSProperties;
}> = ({ size, month, day, accent, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: 18,
        border: `${INK_W}px solid ${p.ink}`,
        background: p.white,
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: fonts.display,
        ...style,
      }}
    >
      <div
        style={{
          height: size * 0.3,
          background: accent,
          color: p.white,
          fontWeight: 700,
          fontSize: size * 0.18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "0.02em",
        }}
      >
        {month}
      </div>
      <div
        style={{
          height: size * 0.7 - INK_W * 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: size * 0.44,
          letterSpacing: "-0.04em",
          color: p.ink,
        }}
      >
        {day}
      </div>
    </div>
  );
};

/** Outlined chip as used for bill details in the steps. */
export const InkChip: React.FC<{
  text: string;
  size?: number;
  color?: string;
  fill?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ text, size = 34, color, fill, style, children }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        height: size * 1.9,
        padding: `0 ${size * 0.6}px`,
        borderRadius: size,
        border: `4px solid ${color ?? p.ink}`,
        background: fill ?? p.white,
        color: color ?? p.ink,
        display: "flex",
        alignItems: "center",
        gap: size * 0.3,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: size,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
      {text}
    </div>
  );
};
