import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

/** Bead look per position in the date order (fill, text). */
export const useBeadColors = () => {
  const p = usePalette();
  return [
    { fill: p.yellow, text: p.ink },
    { fill: p.blueSoft, text: p.blueMascot },
    { fill: p.white, text: p.blue },
    { fill: p.teal, text: p.ink },
    { fill: p.blueMid, text: p.white },
  ];
};

/** A round bead with the due date on it and a little thread hole. */
export const Bead: React.FC<{
  size: number;
  fill: string;
  text: string;
  day: string;
  month: string;
  style?: React.CSSProperties;
}> = ({ size, fill, text, day, month, style }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 32%), ${fill}`,
      boxShadow: `inset 0 -${size * 0.07}px ${size * 0.12}px rgba(0,0,0,0.16), 0 ${size * 0.08}px ${size * 0.2}px rgba(0,20,90,0.22)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: text,
      fontFamily: fonts.display,
      lineHeight: 0.9,
      ...style,
    }}
  >
    <div style={{ fontWeight: 600, fontSize: size * 0.4, letterSpacing: "-0.04em" }}>{day}</div>
    <div style={{ fontWeight: 500, fontSize: size * 0.18, marginTop: size * 0.03 }}>{month}</div>
  </div>
);

/** Sagging thread from (x1,y1) to (x2,y2) as an SVG path; `draw` 0..1 grows it. */
export const Thread: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  sag: number;
  color: string;
  width?: number;
  draw?: number;
}> = ({ x1, y1, x2, y2, sag, color, width = 8, draw = 1 }) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag * 2; // gives `sag` at the middle
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
    </svg>
  );
};

/** Point on the same quadratic curve at t (0..1). */
export const threadPoint = (x1: number, y1: number, x2: number, y2: number, sag: number, t: number) => {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + sag * 2; // control point that gives `sag` at the middle
  const u = 1 - t;
  return {
    x: u * u * x1 + 2 * u * t * cx + t * t * x2,
    y: u * u * y1 + 2 * u * t * cy + t * t * y2,
  };
};
