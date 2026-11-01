import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const FWD_W = 780;
export const FWD_H = 290;

/** The forwarded bill as a mail card: chip, sender, subject, amount and due date. */
export const ForwardedBill: React.FC<{
  chip: string;
  sender: string;
  subject: string;
  amount: string;
  due: string;
  style?: React.CSSProperties;
}> = ({ chip, sender, subject, amount, due, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: FWD_W,
        height: FWD_H,
        borderRadius: 44,
        background: p.white,
        boxShadow: "0 30px 70px rgba(0, 10, 80, 0.35)",
        padding: "34px 44px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 20px",
          borderRadius: 999,
          background: "#e7edff",
          color: p.blue,
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        <svg width={28} height={28} viewBox="0 0 40 40">
          <path d="M6 20h26M21 9l11 11-11 11" fill="none" stroke={p.blue} strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {chip}
      </div>
      <div style={{ marginTop: 18, fontSize: 40, fontWeight: 600, color: p.ink }}>{sender}</div>
      <div style={{ fontSize: 32, color: "#6b7280", marginTop: 2 }}>{subject}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18 }}>
        <span style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: 600, letterSpacing: "-0.03em", color: p.ink }}>
          {amount}
        </span>
        <span
          style={{
            padding: "8px 20px",
            borderRadius: 999,
            background: p.blue,
            color: p.white,
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          {due}
        </span>
      </div>
    </div>
  );
};
