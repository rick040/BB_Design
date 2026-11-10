import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A paper slip with a bill name (sits in the sieve in the hook).
export const SLIP_W = 230;
export const SLIP_H = 104;

export const Slip: React.FC<{ label: string; amount?: string; style?: React.CSSProperties }> = ({
  label,
  amount,
  style,
}) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: SLIP_W,
        height: SLIP_H,
        borderRadius: 18,
        background: p.white,
        boxShadow: "0 10px 30px rgba(1, 40, 160, 0.16)",
        padding: "16px 22px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 600, color: p.ink, lineHeight: 1.1 }}>{label}</div>
      {amount ? (
        <div style={{ fontSize: 28, fontWeight: 500, color: p.blueMid, marginTop: 6 }}>{amount}</div>
      ) : (
        <div style={{ width: 120, height: 14, borderRadius: 7, background: p.grey, marginTop: 16 }} />
      )}
    </div>
  );
};

/** Rounded chip, used for the details that stay behind in the sieve. */
export const Chip: React.FC<{
  text: string;
  bg: string;
  fg: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, bg, fg, size = 40, style }) => (
  <div
    style={{
      position: "absolute",
      height: size * 1.9,
      padding: `0 ${size * 0.75}px`,
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
      boxShadow: "0 14px 40px rgba(0, 20, 120, 0.22)",
      ...style,
    }}
  >
    {text}
  </div>
);
