import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

// A paper bill lying flat on the floor (tilted back in perspective).
export const SLIP_W = 320;
export const SLIP_H = 210;

export const Slip: React.FC<{ sender: string; amount: string; flat?: number; scale?: number; style?: React.CSSProperties }> = ({
  sender,
  amount,
  flat = 1,
  scale = 1,
  style,
}) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: SLIP_W,
        height: SLIP_H,
        borderRadius: 22,
        background: p.white,
        boxShadow: "0 14px 30px rgba(1,40,160,0.18)",
        padding: "22px 26px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        transform: `scale(${scale}) perspective(900px) rotateX(${58 * flat}deg)`,
        transformOrigin: "50% 100%",
        ...style,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 600, color: p.ink }}>{sender}</div>
      <div style={{ height: 12, width: 190, borderRadius: 6, background: p.grey, marginTop: 14 }} />
      <div style={{ height: 12, width: 140, borderRadius: 6, background: p.grey, marginTop: 10 }} />
      <div
        style={{
          position: "absolute",
          right: 26,
          bottom: 18,
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 54,
          letterSpacing: headlineTracking,
          color: p.ink,
        }}
      >
        {amount}
      </div>
    </div>
  );
};

/** Small rounded label chip. */
export const Chip: React.FC<{ text: string; bg: string; fg: string; size?: number; style?: React.CSSProperties }> = ({
  text,
  bg,
  fg,
  size = 40,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      height: size * 1.9,
      padding: `0 ${size * 0.8}px`,
      borderRadius: size,
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      fontFamily: fonts.display,
      fontWeight: 500,
      fontSize: size,
      letterSpacing: "-0.02em",
      whiteSpace: "nowrap",
      boxShadow: "0 16px 40px rgba(1,30,120,0.18)",
      ...style,
    }}
  >
    {text}
  </div>
);
