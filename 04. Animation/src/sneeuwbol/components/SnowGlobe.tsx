import React from "react";
import { fonts } from "../../theme";

// A snow globe: glass sphere on a base. Instead of snow it holds tiny paper
// bills that swirl when the globe is shaken and settle when it is calm.
// `swirl` is a phase (keeps increasing while things move); `spread` 0 = all
// flakes settled on the bottom, 1 = fully swirling through the glass.

const rand = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const SnowGlobe: React.FC<{
  r: number;
  swirl: number;
  spread: number;
  flakes?: number;
  water: string;
  glass: string;
  base: string;
  baseText?: string;
  slip: string;
  slipLine: string;
  /** Content inside the glass (clipped), in a 2r × 2r box. */
  children?: React.ReactNode;
  /** Draw the children above the flakes instead of behind them. */
  childrenOnTop?: boolean;
  style?: React.CSSProperties;
}> = ({ r, swirl, spread, flakes = 34, water, glass, base, baseText, slip, slipLine, children, childrenOnTop = false, style }) => {
  const d = r * 2;
  const baseH = r * 0.42;
  const items = Array.from({ length: flakes }, (_, i) => {
    const ring = 0.25 + rand(i, 1) * 0.6;
    const phase = rand(i, 2) * Math.PI * 2;
    const speed = 0.6 + rand(i, 3) * 0.9;
    const dir = i % 3 === 0 ? -1 : 1;
    const a = phase + swirl * speed * dir;
    // Swirling: on a ring around the centre, a bit flattened, with wobble.
    const sx = Math.cos(a) * ring * r * 0.95;
    const sy = Math.sin(a) * ring * r * 0.8 + Math.sin(swirl * 1.7 + phase) * r * 0.06;
    // Settled: in a heap along the bottom of the sphere.
    const hx = (rand(i, 4) - 0.5) * r * 1.3;
    const hy = r * 0.78 - Math.abs(hx) * 0.25 - rand(i, 5) * r * 0.08;
    const x = r + hx + (sx - hx) * spread;
    const y = r + hy + (sy - hy) * spread;
    const isSlip = i % 5 !== 0;
    const w = isSlip ? r * (0.09 + rand(i, 6) * 0.05) : r * 0.035;
    const rot = isSlip ? rand(i, 7) * 360 + swirl * 90 * speed * spread : 0;
    return { x, y, w, rot, isSlip, i };
  });

  return (
    <div style={{ position: "relative", width: d, height: d + baseH * 0.82, ...style }}>
      {/* Base */}
      <div
        style={{
          position: "absolute",
          left: r * 0.18,
          width: d - r * 0.36,
          top: d - baseH * 0.6,
          height: baseH * 1.42,
          background: base,
          clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)",
          borderRadius: r * 0.05,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: baseH * 0.22,
          boxSizing: "border-box",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: r * 0.13,
          letterSpacing: "-0.04em",
          color: "rgba(255,255,255,0.92)",
        }}
      >
        {baseText}
      </div>
      {/* Glass */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: d,
          height: d,
          borderRadius: "50%",
          background: water,
          overflow: "hidden",
          boxShadow: `inset 0 0 0 ${Math.max(5, r * 0.025)}px ${glass}, 0 ${r * 0.08}px ${r * 0.25}px rgba(1,40,160,0.14)`,
        }}
      >
        {childrenOnTop ? null : children}
        {items.map((f) => (
          <div
            key={f.i}
            style={{
              position: "absolute",
              left: f.x - f.w / 2,
              top: f.y - f.w * 0.35,
              width: f.w,
              height: f.isSlip ? f.w * 0.7 : f.w,
              borderRadius: f.isSlip ? f.w * 0.12 : "50%",
              background: slip,
              boxShadow: f.isSlip ? `inset 0 ${f.w * 0.16}px 0 ${slipLine}` : undefined,
              border: f.isSlip ? `1.5px solid ${slipLine}` : undefined,
              transform: `rotate(${f.rot}deg)`,
            }}
          />
        ))}
        {childrenOnTop ? children : null}
        {/* Glass highlight */}
        <div
          style={{
            position: "absolute",
            left: r * 0.22,
            top: r * 0.16,
            width: r * 0.5,
            height: r * 0.5,
            borderRadius: "50%",
            borderTop: `${r * 0.05}px solid rgba(255,255,255,0.75)`,
            transform: "rotate(-30deg)",
          }}
        />
      </div>
    </div>
  );
};

/** A small paper bill: blue header strip, a label and an amount. */
export const BillSlip: React.FC<{
  w: number;
  label: string;
  amount: string;
  header: string;
  ink: string;
  style?: React.CSSProperties;
}> = ({ w, label, amount, header, ink, style }) => (
  <div
    style={{
      width: w,
      height: w * 0.66,
      borderRadius: w * 0.07,
      background: "#ffffff",
      boxShadow: "0 10px 26px rgba(1,40,160,0.22)",
      overflow: "hidden",
      fontFamily: fonts.ui,
      position: "relative",
      ...style,
    }}
  >
    <div style={{ height: w * 0.15, background: header }} />
    <div style={{ padding: `${w * 0.05}px ${w * 0.08}px`, color: ink }}>
      <div style={{ fontSize: w * 0.11, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: w * 0.19,
          fontWeight: 500,
          letterSpacing: "-0.05em",
          marginTop: w * 0.02,
        }}
      >
        {amount}
      </div>
    </div>
  </div>
);

/** A calendar day tile. */
export const DayTile: React.FC<{
  w: number;
  day: string;
  date: string;
  bg: string;
  fg: string;
  sub: string;
  style?: React.CSSProperties;
}> = ({ w, day, date, bg, fg, sub, style }) => (
  <div
    style={{
      width: w,
      height: w * 1.15,
      borderRadius: w * 0.18,
      background: bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: fonts.display,
      ...style,
    }}
  >
    <div style={{ fontSize: w * 0.24, color: sub, fontWeight: 500 }}>{day}</div>
    <div style={{ fontSize: w * 0.5, color: fg, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1 }}>
      {date}
    </div>
  </div>
);

/** Simple bell icon (SVG, no emoji). */
export const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path
      d="M16 4c-5 0-8 3.6-8 8.6v5.6L5.4 22.6c-.5.8.1 1.8 1 1.8h19.2c.9 0 1.5-1 1-1.8L24 18.2v-5.6C24 7.6 21 4 16 4z"
      fill={color}
    />
    <circle cx="16" cy="27" r="3" fill={color} />
  </svg>
);
