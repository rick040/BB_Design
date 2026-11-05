import React from "react";
import { interpolate, spring } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { FPS } from "../common";

/** Frames → spring 0..1 that starts at `delay` frames. */
export const sp = (t: number, delay = 0, damping = 14, stiffness = 170) =>
  spring({ frame: t - delay, fps: FPS, config: { damping, stiffness, mass: 0.7 } });

export const lin = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], clamp);

/** White rounded card, the base of most visuals. Centered in the 1080 stage. */
export const Card: React.FC<{
  width?: number;
  top?: number;
  height?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width = 900, top = 0, height, children, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - width) / 2,
        top,
        width,
        height,
        borderRadius: 48,
        background: p.white,
        boxShadow: "0 30px 80px rgba(1, 40, 160, 0.16)",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Avatar: React.FC<{ letter: string; size?: number; bg?: string; fg?: string }> = ({
  letter,
  size = 72,
  bg,
  fg,
}) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg ?? p.grey,
        color: fg ?? p.blueMid,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.45,
        fontWeight: 600,
        fontFamily: fonts.ui,
        flexShrink: 0,
      }}
    >
      {letter.slice(0, 1).toUpperCase()}
    </div>
  );
};

/** Grey skeleton bar (stand-in for unreadable mail text). */
export const Bar: React.FC<{ w: number | string; h?: number; style?: React.CSSProperties }> = ({
  w,
  h = 18,
  style,
}) => {
  const p = usePalette();
  return <div style={{ width: w, height: h, borderRadius: h / 2, background: p.grey, ...style }} />;
};

export const CheckIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0, display: "block" }}>
    <circle cx="16" cy="16" r="15" fill={color} />
    <path d="M9 16.5l4.5 4.5L23 11.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CrossIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0, display: "block" }}>
    <circle cx="16" cy="16" r="15" fill={color} />
    <path d="M11 11l10 10M21 11L11 21" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
);
