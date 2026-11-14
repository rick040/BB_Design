import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const NOTE_W = 300;
export const NOTE_H = 176;

/** Red push pin, drawn centred on (0,0) of its parent. */
export const Pin: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 30,
  color,
  style,
}) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, #ffffff99 0 18%, ${color ?? p.red} 22%)`,
        boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
        ...style,
      }}
    />
  );
};

/** A paper bill note as pinned on the board. */
export const BillNote: React.FC<{
  sender: string;
  amount: string;
  due: string;
  urgent?: boolean;
  pin?: boolean;
}> = ({ sender, amount, due, urgent = true, pin = true }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "relative",
        width: NOTE_W,
        height: NOTE_H,
        background: p.white,
        borderRadius: 18,
        boxShadow: "0 14px 30px rgba(0, 20, 120, 0.16)",
        padding: "30px 26px 0",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
      }}
    >
      {pin ? <Pin style={{ left: NOTE_W / 2 - 15, top: -10 }} /> : null}
      <div style={{ fontSize: 26, fontWeight: 600, color: p.ink }}>{sender}</div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 52,
          fontWeight: 500,
          letterSpacing: "-0.04em",
          color: p.blue,
          marginTop: 6,
        }}
      >
        {amount}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: urgent ? p.red : p.greyText, marginTop: 2 }}>{due}</div>
    </div>
  );
};

/** Small rounded tag (MYTHE / FEIT / CSV). */
export const Tag: React.FC<{ text: string; bg: string; color: string; size?: number; style?: React.CSSProperties }> = ({
  text,
  bg,
  color,
  size = 40,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      background: bg,
      color,
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "0.04em",
      padding: `${size * 0.3}px ${size * 0.7}px`,
      borderRadius: size,
      boxShadow: "0 12px 30px rgba(0, 20, 120, 0.18)",
      ...style,
    }}
  >
    {text}
  </div>
);
